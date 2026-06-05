import mongoose from 'mongoose';

let isConnected = false;
let lastError = '';

const connectDB = async () => {
  if (isConnected) return true;

  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      console.error('MongoDB connection error: MONGODB_URI is not set');
      lastError = 'MONGODB_URI is not set';
      return false;
    }
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
    // Don't throw — let the server start; DB calls will fail gracefully
    return false;
  }
};

export const getDbStatus = () => ({
  isConnected,
  state: mongoose.connection.readyState,
  lastError,
});

export default connectDB;
