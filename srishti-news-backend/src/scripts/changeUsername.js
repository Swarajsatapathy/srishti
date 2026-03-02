/**
 * One-time script to change the admin username.
 * Usage: node src/scripts/changeUsername.js
 */
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const OLD_USERNAME = 'admin';
const NEW_USERNAME = 'srishtinews';

async function run() {
  await mongoose.connect(process.env.MONGODB_URI, { dbName: 'srishti-news' });
  console.log('Connected to MongoDB');

  const result = await mongoose.connection.collection('admins').updateOne(
    { username: OLD_USERNAME },
    { $set: { username: NEW_USERNAME } }
  );

  if (result.modifiedCount) {
    console.log(`✅ Username changed: "${OLD_USERNAME}" → "${NEW_USERNAME}"`);
  } else {
    console.log(`⚠️  No user found with username "${OLD_USERNAME}"`);
  }

  await mongoose.disconnect();
}

run().catch((err) => { console.error(err); process.exit(1); });
