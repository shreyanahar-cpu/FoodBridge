require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { connectDB } = require('../config/db');
const fs = require('fs');
const path = require('path');

const runSeed = async () => {
  console.log('[Seed] Starting FoodBridge database seeding...');
  await connectDB();
  const dbFile = path.join(__dirname, '..', 'data', 'database.json');
  if (fs.existsSync(dbFile)) {
    fs.unlinkSync(dbFile);
  }
  delete require.cache[require.resolve('../data/store')];
  const freshStore = require('../data/store');
  // Re-seed memory store
  await freshStore.seedInitialData();
  const stats = await freshStore.getStatistics();
  console.log('[Seed] Seed completed successfully!');
  console.log(`[Seed] Total Donations: ${stats.totalDonations}, Registered Donors: ${stats.registeredDonors}, NGOs: ${stats.registeredNgos}`);
  process.exit(0);
};

runSeed();
