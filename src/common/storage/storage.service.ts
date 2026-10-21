import * as fs from "fs";
import * as path from "path";
import { IStorageProvider, UploadResult } from "./storage.interface";
import { GoogleDriveStorageProvider } from "./google-drive.provider";
import { LocalStorageProvider } from "./local-storage.provider";

class StorageServiceManager implements IStorageProvider {
  private activeProvider: IStorageProvider;
  public providerType: "google_drive" | "local" = "local";

  constructor() {
    this.activeProvider = this.initProvider();
  }

  private initProvider(): IStorageProvider {
    if (process.env.SKIP_DRIVE_UPLOAD === "true") {
      console.log(`[StorageService] SKIP_DRIVE_UPLOAD=true detected. Defaulting to LocalStorageProvider.`);
      this.providerType = "local";
      return new LocalStorageProvider();
    }

    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
    const clientId = process.env.GOOGLE_DRIVE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_DRIVE_CLIENT_SECRET;
    const refreshToken = process.env.GOOGLE_DRIVE_REFRESH_TOKEN;

    // Check if OAuth2 credentials (personal Drive with 15GB quota) are set
    if (clientId && clientSecret && refreshToken && folderId) {
      try {
        const driveProvider = new GoogleDriveStorageProvider();
        this.providerType = "google_drive";
        console.log(`[StorageService] Initialized GoogleDriveStorageProvider via OAuth2 User Credentials (Folder: ${folderId})`);
        return driveProvider;
      } catch (err: any) {
        console.warn(`[StorageService] Failed to initialize Google Drive OAuth2: ${err.message}.`);
      }
    }

    // Check if Service Account credentials are set
    const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || "./google-service-account.json";
    const resolvedPath = path.isAbsolute(credPath) ? credPath : path.resolve(process.cwd(), credPath);

    if (fs.existsSync(resolvedPath) && folderId) {
      try {
        const driveProvider = new GoogleDriveStorageProvider(resolvedPath, folderId);
        this.providerType = "google_drive";
        console.log(`[StorageService] Initialized GoogleDriveStorageProvider via Service Account (Folder: ${folderId})`);
        return driveProvider;
      } catch (err: any) {
        console.warn(`[StorageService] Failed to initialize Google Drive Service Account: ${err.message}.`);
      }
    } else {
      console.log(`[StorageService] Google Drive credentials not present. Initializing LocalStorageProvider.`);
    }

    this.providerType = "local";
    return new LocalStorageProvider();
  }

  public setProvider(provider: IStorageProvider, type: "google_drive" | "local" = "local"): void {
    this.activeProvider = provider;
    this.providerType = type;
  }

  public getProviderType(): "google_drive" | "local" {
    return this.providerType;
  }

  async uploadFile(file: Express.Multer.File, options?: { folderId?: string }): Promise<UploadResult> {
    return this.activeProvider.uploadFile(file, options);
  }

  async deleteFile(fileId: string): Promise<boolean> {
    if (this.activeProvider.deleteFile) {
      return this.activeProvider.deleteFile(fileId);
    }
    return false;
  }
}

export const storageService = new StorageServiceManager();
