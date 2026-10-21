import * as fs from "fs";
import * as path from "path";
import { v4 as uuidv4 } from "uuid";
import { IStorageProvider, UploadResult } from "./storage.interface";

export class LocalStorageProvider implements IStorageProvider {
  private uploadsDir: string;

  constructor() {
    this.uploadsDir = path.resolve(process.cwd(), "public/uploads");
    if (!fs.existsSync(this.uploadsDir)) {
      fs.mkdirSync(this.uploadsDir, { recursive: true });
    }
  }

  async uploadFile(file: Express.Multer.File): Promise<UploadResult> {
    const ext = path.extname(file.originalname) || "";
    const uniqueName = `${uuidv4()}${ext}`;
    const destinationPath = path.join(this.uploadsDir, uniqueName);

    await fs.promises.writeFile(destinationPath, file.buffer);

    const port = process.env.PORT || 8080;
    const url = `http://localhost:${port}/uploads/${uniqueName}`;

    return {
      url,
      fileId: uniqueName,
      fileName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      provider: "local",
      webViewLink: url,
      webContentLink: url
    };
  }

  async deleteFile(fileId: string): Promise<boolean> {
    const filePath = path.join(this.uploadsDir, fileId);
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
      return true;
    }
    return false;
  }
}
