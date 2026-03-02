/**
 * One-time script to create the initial admin user.
 *
 * Usage:
 *   node src/scripts/seedAdmin.js
 *
 * Environment variables required:
 *   MONGODB_URI  — MongoDB connection string
 *   ADMIN_USERNAME (optional, default: "admin")
 *   ADMIN_PASSWORD (optional, default: "admin123")
 */

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Admin from '../models/Admin.js';

dotenv.config();

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ MONGODB_URI is not set');
    process.exit(1);
  }

  await mongoose.connect(uri, { dbName: 'srishti-news' });
  console.log('Connected to MongoDB');

  const existing = await Admin.findOne({ username: ADMIN_USERNAME });
  if (existing) {
    console.log(`⚠️  Admin user "${ADMIN_USERNAME}" already exists. Skipping.`);
  } else {
    await Admin.create({ username: ADMIN_USERNAME, password: ADMIN_PASSWORD });
    console.log(`✅ Admin user created → username: "${ADMIN_USERNAME}"`);
  }

  await mongoose.disconnect();
  console.log('Done.');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
