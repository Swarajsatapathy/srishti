import { S3Client } from '@aws-sdk/client-s3';

// On Lambda the IAM role provides credentials automatically.
// Locally (serverless-offline / dev) we fall back to env vars.
const isLambda = !!process.env.AWS_LAMBDA_FUNCTION_NAME;

const s3Client = new S3Client({
  region: process.env.AWS_S3_REGION || 'ap-south-1',
  ...(!isLambda && process.env.AWS_ACCESS_KEY_ID && {
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  }),
});

export default s3Client;
