import mongoose from 'mongoose';

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      console.error('MongoDB connection error: MONGODB_URI is not set');
      return;
    }
    console.log('Connecting to MongoDB...');
    const conn = await mongoose.connect(uri, {
      dbName: 'srishti-news',
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 15000,
    });
    isConnected = conn.connections[0].readyState === 1;
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    // Don't throw — let the server start; DB calls will fail gracefully
  }
};

export default connectDB;
