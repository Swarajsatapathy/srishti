import serverless from 'serverless-http';
import app from './app.js';

// Express handles CORS for normal API responses.
// serverless.yml handles API Gateway OPTIONS/preflight requests.
// Keeping CORS in one response layer avoids duplicate
// Access-Control-Allow-Origin headers, which browsers reject.
const serverlessHandler = serverless(app, {
  binary: [
    'multipart/form-data',
    'image/*',
    'video/*',
    'application/octet-stream',
  ],
});

export const handler = async (event, context) => {
  // Prevent AWS Lambda from waiting for MongoDB's background heartbeat / keepalive timers
  // to drain before freezing the container and returning the HTTP response.
  context.callbackWaitsForEmptyEventLoop = false;
  return serverlessHandler(event, context);
};
