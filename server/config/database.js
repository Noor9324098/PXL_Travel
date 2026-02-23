import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://Nooraddeen:<db_password>@cluster0.odpwsxm.mongodb.net/';
const DB_NAME = process.env.DB_NAME || 'pxl_travel';

let client;
let db;

export const connectToDatabase = async () => {
  try {
    if (!client) {
      // Replace <db_password> with actual password
      const uri = MONGODB_URI.replace('<db_password>', process.env.MONGODB_PASSWORD || '');
      
      client = new MongoClient(uri, {
        // Remove these options if using MongoDB Atlas (they're for older versions)
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
      });
      
      await client.connect();
      db = client.db(DB_NAME);
      console.log('Connected to MongoDB');
    }
    return { client, db };
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
};

export const getDatabase = () => {
  if (!db) {
    throw new Error('Database not connected. Call connectToDatabase() first.');
  }
  return db;
};

export const closeDatabase = async () => {
  if (client) {
    await client.close();
    console.log('MongoDB connection closed');
  }
};

