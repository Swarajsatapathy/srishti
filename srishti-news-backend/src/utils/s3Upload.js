import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import s3Client from '../config/s3.js';

const BUCKET = process.env.S3_BUCKET_NAME || 'srishti-news-media';

/**
 * Upload a buffer to S3 and return the URL + key.
 */
export const uploadToS3 = async (fileBuffer, mimeType, folder = 'images') => {
  const ext = mimeType.split('/')[1] || 'bin';
  const key = `${folder}/${uuidv4()}.${ext}`;

  await s3Client.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: fileBuffer,
      ContentType: mimeType,
    })
  );

  const url = `https://${BUCKET}.s3.amazonaws.com/${key}`;
  return { url, key };
};

/**
 * Delete an object from S3 by key.
 */
export const deleteFromS3 = async (key) => {
  if (!key) return;
  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: BUCKET,
      Key: key,
    })
  );
};

/**
 * Generate a pre-signed upload URL (for client-side direct uploads).
 */
export const getPresignedUploadUrl = async (mimeType, folder = 'images') => {
  const ext = mimeType.split('/')[1] || 'bin';
  const key = `${folder}/${uuidv4()}.${ext}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    ContentType: mimeType,
  });

  const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  const publicUrl = `https://${BUCKET}.s3.amazonaws.com/${key}`;

  return { signedUrl, key, publicUrl };
};
