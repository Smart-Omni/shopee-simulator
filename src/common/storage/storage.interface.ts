export interface UploadResult {
  url: string;
  fileId: string;
  fileName: string;
  mimeType: string;
  size: number;
  provider: "google_drive" | "local";
  webViewLink?: string;
  webContentLink?: string;
}

export interface IStorageProvider {
  uploadFile(file: Express.Multer.File, options?: { folderId?: string }): Promise<UploadResult>;
  deleteFile?(fileId: string): Promise<boolean>;
}
