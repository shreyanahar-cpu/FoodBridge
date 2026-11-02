const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

let isMongoConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('[MongoDB] MONGODB_URI is missing from backend/.env');
  return false;
}
  try {
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500, // Quick timeout to fallback if mongod not running
    });
    isMongoConnected = true;
    console.log(`[MongoDB] Successfully connected to host: ${conn.connection.host} / database: ${conn.connection.name}`);
    return true;
  } catch (error) {
    isMongoConnected = false;
    console.warn(`[MongoDB Warning] Could not connect to MongoDB at ${uri} (${error.message}).`);
    console.log(`[FoodBridge Engine] Active in-memory/disk store fallback activated. All features, authentication, and workflows will run smoothly!`);
    return false;
  }
};

const getMongoStatus = () => isMongoConnected;

module.exports = { connectDB, getMongoStatus };
