import { drive, drive_v3, auth } from "googleapis/build/src/apis/drive";
import { Readable } from "stream";
import * as path from "path";
import * as fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { IStorageProvider, UploadResult } from "./storage.interface";

export class GoogleDriveStorageProvider implements IStorageProvider {
  private drive: drive_v3.Drive;
  private defaultFolderId: string;

  constructor(credentialsPath?: string, folderId?: string) {
    this.defaultFolderId = folderId || process.env.GOOGLE_DRIVE_FOLDER_ID || "";

    // 1. Check if OAuth2 credentials (personal account with 15GB quota) are provided
    const clientId = process.env.GOOGLE_DRIVE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_DRIVE_CLIENT_SECRET;
    const refreshToken = process.env.GOOGLE_DRIVE_REFRESH_TOKEN;

    if (clientId && clientSecret && refreshToken) {
      const oauth2Client = new auth.OAuth2(clientId, clientSecret);
      oauth2Client.setCredentials({ refresh_token: refreshToken });
      this.drive = drive({ version: "v3", auth: oauth2Client });
      return;
    }

    // 2. Otherwise fall back to Service Account key
    const credPath = credentialsPath || process.env.GOOGLE_APPLICATION_CREDENTIALS || "./google-service-account.json";
    const resolvedPath = path.isAbsolute(credPath) ? credPath : path.resolve(process.cwd(), credPath);

    if (!fs.existsSync(resolvedPath)) {
      throw new Error(`Google credentials not found. Provide OAuth2 credentials or Service Account at: ${resolvedPath}`);
    }

    const authClient = new auth.GoogleAuth({
      keyFile: resolvedPath,
      scopes: ["https://www.googleapis.com/auth/drive"]
    });

    this.drive = drive({ version: "v3", auth: authClient });
  }

  async uploadFile(file: Express.Multer.File, options?: { folderId?: string }): Promise<UploadResult> {
    const targetFolderId = options?.folderId || this.defaultFolderId;
    const ext = path.extname(file.originalname) || "";
    const uniqueFileName = `${Date.now()}-${uuidv4().slice(0, 8)}${ext}`;

    const stream = new Readable();
    stream.push(file.buffer);
    stream.push(null);

    // 1. Upload to Google Drive folder
    const createRes = await this.drive.files.create({
      supportsAllDrives: true,
      requestBody: {
        name: uniqueFileName,
        parents: targetFolderId ? [targetFolderId] : undefined
      },
      media: {
        mimeType: file.mimetype,
        body: stream
      },
      fields: "id, name, mimeType, size, webViewLink, webContentLink"
    });

    const fileId = createRes.data.id;
    if (!fileId) {
      throw new Error("Failed to obtain file ID from Google Drive response");
    }

    // 2. Grant public read permission so anyone with link can view the file
    try {
      await this.drive.permissions.create({
        fileId,
        supportsAllDrives: true,
        requestBody: {
          role: "reader",
          type: "anyone"
        }
      });
    } catch (permErr: any) {
      console.warn(`[GoogleDriveStorageProvider] Warning setting public permission on file ${fileId}:`, permErr.message);
    }

    // 3. Format direct embed link (for images: Google CDN lh3 link; for videos: direct link / uc link)
    let directUrl = `https://lh3.googleusercontent.com/d/${fileId}`;
    if (file.mimetype.startsWith("video/")) {
      directUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
    }

    return {
      url: directUrl,
      fileId,
      fileName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      provider: "google_drive",
      webViewLink: createRes.data.webViewLink || undefined,
      webContentLink: createRes.data.webContentLink || undefined
    };
  }

  async deleteFile(fileId: string): Promise<boolean> {
    try {
      await this.drive.files.delete({ fileId });
      return true;
    } catch (err: any) {
      console.warn(`[GoogleDriveStorageProvider] Failed to delete file ${fileId}:`, err.message);
      return false;
    }
  }
}
