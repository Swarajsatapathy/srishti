/**
 * Migration script to update district names to new Odisha Government approved spellings.
 *
 * Usage:
 *   node src/scripts/migrateDistricts.js
 */

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Article from '../models/Article.js';
import Video from '../models/Video.js';
import Reporter from '../models/Reporter.js';

dotenv.config();

const districtMapping = {
  // Angul -> Anugola
  'Angul (ଅନୁଗୋଳ)': 'Anugola (ଅନୁଗୋଳ)',
  'Angul': 'Anugola (ଅନୁଗୋଳ)',

  // Balasore -> Baleshwar
  'Balasore (ବାଲେଶ୍ୱର)': 'Baleshwar (ବାଲେଶ୍ୱର)',
  'Balasore': 'Baleshwar (ବାଲେଶ୍ୱର)',

  // Bargarh -> Baragada
  'Bargarh (ବରଗଡ଼)': 'Baragada (ବରଗଡ଼)',
  'Bargarh': 'Baragada (ବରଗଡ଼)',

  // Cuttack -> Kataka
  'Cuttack (କଟକ)': 'Kataka (କଟକ)',
  'Cuttack': 'Kataka (କଟକ)',

  // Deogarh -> Debagada
  'Deogarh (ଦେଓଗଡ଼)': 'Debagada (ଦେଓଗଡ଼)',
  'Deogarh': 'Debagada (ଦେଓଗଡ଼)',

  // Kandhamal -> Kandhamala
  'Kandhamal (କନ୍ଧମାଳ)': 'Kandhamala (କନ୍ଧମାଳ)',
  'Kandhamal': 'Kandhamala (କନ୍ଧମାଳ)',

  // Kendrapara -> Kendrapada
  'Kendrapara (କେନ୍ଦ୍ରାପଡ଼ା)': 'Kendrapada (କେନ୍ଦ୍ରାପଡ଼ା)',
  'Kendrapara': 'Kendrapada (କେନ୍ଦ୍ରାପଡ଼ା)',

  // Nayagarh -> Nayagada
  'Nayagarh (ନୟାଗଡ଼)': 'Nayagada (ନୟାଗଡ଼)',
  'Nayagarh': 'Nayagada (ନୟାଗଡ଼)',

  // Sundargarh -> Sundaragada
  'Sundargarh (ସୁନ୍ଦରଗଡ଼)': 'Sundaragada (ସୁନ୍ଦରଗଡ଼)',
  'Sundargarh': 'Sundaragada (ସୁନ୍ଦରଗଡ଼)',

  // Rourkela -> Raurkela
  'Rourkela (ରାଉରକେଲା)': 'Raurkela (ରାଉରକେଲା)',
  'Rourkela': 'Raurkela (ରାଉରକେଲା)',
};

async function migrate() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ MONGODB_URI is not set in .env');
    process.exit(1);
  }

  console.log('Connecting to MongoDB...');
  await mongoose.connect(uri, { dbName: 'srishti-news' });
  console.log('✅ Connected to MongoDB\n');

  const collections = [
    { name: 'Article', model: Article },
    { name: 'Video', model: Video },
    { name: 'Reporter', model: Reporter },
  ];

  // Inspect current distinct districts
  console.log('--- Current Distinct District Values ---');
  for (const { name, model } of collections) {
    const distinct = await model.distinct('district');
    console.log(`${name} districts:`, distinct.filter(Boolean));
  }
  console.log('----------------------------------------\n');

  // Perform updates
  let totalUpdated = 0;
  for (const [oldName, newName] of Object.entries(districtMapping)) {
    for (const { name, model } of collections) {
      const res = await model.updateMany({ district: oldName }, { $set: { district: newName } });
      if (res.modifiedCount > 0) {
        console.log(`Updated ${res.modifiedCount} ${name} documents from "${oldName}" -> "${newName}"`);
        totalUpdated += res.modifiedCount;
      }
    }
  }

  console.log(`\n✅ Migration finished! Total documents updated: ${totalUpdated}\n`);

  // Inspect distinct districts after migration
  console.log('--- Updated Distinct District Values ---');
  for (const { name, model } of collections) {
    const distinct = await model.distinct('district');
    console.log(`${name} districts:`, distinct.filter(Boolean));
  }
  console.log('----------------------------------------\n');

  await mongoose.disconnect();
  console.log('Disconnected from MongoDB.');
}

migrate().catch((err) => {
  console.error('❌ Migration failed:', err);
  process.exit(1);
});
