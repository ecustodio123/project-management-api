import { Injectable } from '@nestjs/common';
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class S3Service {
  private readonly bucketName = this.getRequiredEnv('AWS_S3_BUCKET_NAME');
  private readonly region = this.getRequiredEnv('AWS_REGION');
  private readonly s3Client = new S3Client({
    region: this.region,
    credentials: {
      accessKeyId: this.getRequiredEnv('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.getRequiredEnv('AWS_SECRET_ACCESS_KEY'),
    },
  });

  async uploadFile(file: Express.Multer.File, folder: string) {
    const key = `${folder}/${Date.now()}-${file.originalname}`;

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    return {
      key,
      url: `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${key}`,
    };
  }

  async deleteFile(key: string) {
    await this.s3Client.send(
      new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      }),
    );
  }

  private getRequiredEnv(name: string): string {
    const value = process.env[name];

    if (!value) {
      throw new Error(`${name} environment variable is required`);
    }

    return value;
  }

  async getSignedDownloadUrl(key: string) {
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
    });

    const expiresIn = 60 * 5; // 5 minutos

    const url = await getSignedUrl(this.s3Client, command, {
      expiresIn,
    });

    return {
      url,
      expiresIn,
    };
  }
}
