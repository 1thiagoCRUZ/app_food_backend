import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { StoragePort } from '../ports/storage.port';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3StorageAdapter implements StoragePort {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;

  constructor(private readonly configService: ConfigService) {
    const region = this.configService.get<string>('AWS_REGION');
    const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get<string>('AWS_SECRET_ACCESS_KEY');
    this.bucketName = this.configService.get<string>('AWS_BUCKET_NAME') || '';

    if (!region || !accessKeyId || !secretAccessKey || !this.bucketName) {
      throw new InternalServerErrorException('Configurações da AWS S3 ausentes no ambiente');
    }

    this.s3Client = new S3Client({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  async uploadFile(fileBuffer: Buffer, fileName: string, mimeType: string): Promise<string> {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: fileName,
        Body: fileBuffer,
        ContentType: mimeType,
      });

      await this.s3Client.send(command);

      return `https://${this.bucketName}.s3.${this.configService.get<string>('AWS_REGION')}.amazonaws.com/${fileName}`;
    } catch (error) {
      console.error('[S3StorageAdapter] Erro ao fazer upload para o S3:', error);
      throw new InternalServerErrorException('Erro ao fazer upload da imagem para o S3');
    }
  }

  async deleteFile(fileName: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: fileName,
    });

    await this.s3Client.send(command);
  }
}
