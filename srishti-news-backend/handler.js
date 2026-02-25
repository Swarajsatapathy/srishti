import serverless from 'serverless-http';
import app from './app.js';

export const handler = serverless(app, {
  binary: [
    'multipart/form-data',
    'image/*',
    'video/*',
    'application/octet-stream',
  ],
});
