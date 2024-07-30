// packages/services/fileUploadService.ts
import { S3 } from 'aws-sdk';

const s3 = new S3({
  region: 'us-east-1', // Ajusta esto según tu configuración
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'defaultAccessKeyId',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'defaultSecretAccessKey',
  },
});

export async function uploadProfilePicture(file: Buffer, fileName: string) {
  const params = {
    Bucket: 'your-bucket-name',
    Key: `profile-pictures/${fileName}`,
    Body: file,
    ContentType: 'image/jpeg', // O el tipo de archivo correspondiente
  };

  return s3.upload(params).promise();
}
