export const STORAGE_PORT = 'STORAGE_PORT';

export interface StoragePort {
  uploadFile(fileBuffer: Buffer, fileName: string, mimeType: string): Promise<string>;
  deleteFile(fileName: string): Promise<void>;
}
