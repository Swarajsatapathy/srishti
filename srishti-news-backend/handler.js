import serverless from 'serverless-http';
import app from './app.js';

const serverlessHandler = serverless(app, {
  binary: [
    'multipart/form-data',
    'image/*',
    'video/*',
    'application/octet-stream',
  ],
});

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent',
};

export const handler = async (event, context) => {
  // Handle preflight OPTIONS directly at the Lambda level
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: '',
    };
  }

  const result = await serverlessHandler(event, context);

  // Ensure CORS headers exist — deduplicate by overwriting in multiValueHeaders
  if (result.multiValueHeaders) {
    // Remove any Express-set lowercase variants to avoid duplication
    delete result.multiValueHeaders['access-control-allow-origin'];
    delete result.multiValueHeaders['access-control-allow-methods'];
    delete result.multiValueHeaders['access-control-allow-headers'];
    // Set the canonical ones
    result.multiValueHeaders['Access-Control-Allow-Origin'] = ['*'];
    result.multiValueHeaders['Access-Control-Allow-Methods'] = ['GET,POST,PUT,PATCH,DELETE,OPTIONS'];
    result.multiValueHeaders['Access-Control-Allow-Headers'] = ['Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'];
  } else {
    result.headers = result.headers || {};
    result.headers['Access-Control-Allow-Origin'] = '*';
    result.headers['Access-Control-Allow-Methods'] = 'GET,POST,PUT,PATCH,DELETE,OPTIONS';
    result.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent';
  }

  return result;
};
