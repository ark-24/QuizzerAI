/* eslint-disable @typescript-eslint/no-unused-vars */
import { PutObjectCommandOutput, S3 } from "@aws-sdk/client-s3";


export async function uploadToS3(
    file: File
  ): Promise<{ fileKey: string; fileName: string; }> {
    return new Promise((resolve, reject) => {
      try {
        const s3 = new S3({
          region: "us-west-1",
          credentials: {
            accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID!,
            secretAccessKey: import.meta.env.VITE_AWS_ACCESS_KEY!,
          },
        });
  
        const file_key =
          "uploads/" + Date.now().toString() + file.name.replace(" ", "-");
  
        const params = {
          Bucket: import.meta.env.VITE_AWS_BUCKET_NAME!,
          Key: file_key,
          Body: file,
        };
        s3.putObject(
          params,
          (err: unknown, data: PutObjectCommandOutput | undefined) => {
            return resolve({
              fileKey: file_key,
              fileName: file.name,
            });
          }
        );
      } catch (error) {
        reject(error);
      }
    });
  }

export function getS3Url(file_key: string) {
    const url = `https://${import.meta.env.VITE_AWS_BUCKET_NAME}.s3.us-west-1.amazonaws.com/${file_key}`;
    return url;
  }