import { GetObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import s3Client from '../config/s3.js';
import { getPresignedUploadUrl } from '../utils/s3Upload.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

const BUCKET = process.env.S3_BUCKET_NAME || 'srishti-news-media';

/**
 * Generate a pre-signed S3 URL for client-side direct upload.
 * POST /api/upload/presigned-url
 * Body: { mimeType: "image/jpeg", folder: "articles" }
 */
export const generatePresignedUrl = asyncHandler(async (req, res) => {
  const { mimeType, folder } = req.body;

  if (!mimeType) {
    return res.status(400).json(new ApiResponse(400, null, 'mimeType is required'));
  }

  const result = await getPresignedUploadUrl(mimeType, folder || 'uploads');
  return res.status(200).json(new ApiResponse(200, result, 'Pre-signed URL generated'));
});

/**
 * Proxy-serve an image from S3.
 * GET /api/images/:key(*)  — key can be e.g. "articles/abc.jpeg"
 * Returns the raw image bytes with correct Content-Type.
 */
export const getImage = asyncHandler(async (req, res) => {
  const key = req.params.folder && req.params.filename
    ? `${req.params.folder}/${req.params.filename}`
    : req.params.key || req.params[0];
  if (!key) throw new ApiError(400, 'Image key is required');

  const command = new GetObjectCommand({ Bucket: BUCKET, Key: key });

  try {
    const s3Res = await s3Client.send(command);

    res.set('Content-Type', s3Res.ContentType || 'application/octet-stream');
    res.set('Content-Length', s3Res.ContentLength);
    res.set('Cache-Control', 'public, max-age=31536000, immutable');

    // Pipe the readable stream straight to the response
    s3Res.Body.pipe(res);
  } catch (err) {
    if (err.name === 'NoSuchKey' || err.$metadata?.httpStatusCode === 404) {
      throw new ApiError(404, 'Image not found');
    }
    throw err;
  }
});

/**
 * Get a time-limited signed URL to view a private image.
 * GET /api/images/signed?key=articles/abc.jpeg
 */
export const getSignedImageUrl = asyncHandler(async (req, res) => {
  const { key } = req.query;
  if (!key) throw new ApiError(400, 'key query param is required');

  const command = new GetObjectCommand({ Bucket: BUCKET, Key: key });
  const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

  return res.status(200).json(
    new ApiResponse(200, { key, signedUrl, expiresIn: 3600 }, 'Signed URL generated')
  );
});

/**
 * List all images in a given S3 folder.
 * GET /api/images?folder=articles&maxKeys=50
 */
export const listImages = asyncHandler(async (req, res) => {
  const { folder = '', maxKeys = 50 } = req.query;
  const prefix = folder ? `${folder}/` : '';

  const command = new ListObjectsV2Command({
    Bucket: BUCKET,
    Prefix: prefix,
    MaxKeys: parseInt(maxKeys, 10),
  });

  const s3Res = await s3Client.send(command);
  const images = (s3Res.Contents || []).map(obj => ({
    key: obj.Key,
    size: obj.Size,
    lastModified: obj.LastModified,
    url: `https://${BUCKET}.s3.amazonaws.com/${obj.Key}`,
  }));

  return res.status(200).json(
    new ApiResponse(200, { count: images.length, images }, 'Images listed')
  );
});
