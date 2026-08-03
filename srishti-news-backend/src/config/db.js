import mongoose from 'mongoose';

let isConnected = false;
let lastError = '';
let connectionPromise = null;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    isConnected = true;
    return true;
  }

  // Reuse the same in-flight connection during Lambda cold starts instead of
  // opening duplicate MongoDB connections for simultaneous API requests.
  if (connectionPromise) {
    return connectionPromise;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MongoDB connection error: MONGODB_URI is not set');
    lastError = 'MONGODB_URI is not set';
    return false;
  }

  connectionPromise = (async () => {
    try {
      console.log('Connecting to MongoDB...');
      const conn = await mongoose.connect(uri, {
        dbName: 'srishti-news',
        serverSelectionTimeoutMS: 15000,
        socketTimeoutMS: 45000,
        connectTimeoutMS: 15000,
      });

      isConnected = conn.connections[0].readyState === 1;
      lastError = '';
      console.log(`MongoDB connected: ${conn.connection.host}`);
      return isConnected;
    } catch (error) {
      console.error('MongoDB connection error:', error.message);
      isConnected = false;
      lastError = error.message || 'Unknown MongoDB connection error';
      return false;
    } finally {
      connectionPromise = null;
    }
  })();

  return connectionPromise;
};

export const getDbStatus = () => ({
  isConnected,
  state: mongoose.connection.readyState,
  lastError,
});

export default connectDB;
