import serverless from 'serverless-http';
import app from './app.js';

// Express handles CORS for normal API responses.
// serverless.yml handles API Gateway OPTIONS/preflight requests.
// Keeping CORS in one response layer avoids duplicate
// Access-Control-Allow-Origin headers, which browsers reject.
export const handler = serverless(app, {
  binary: [
    'multipart/form-data',
    'image/*',
    'video/*',
    'application/octet-stream',
  ],
});
