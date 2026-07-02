import { MongoClient, Db } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'property-evidence';

let client: MongoClient | null = null;
let db: Db | null = null;

export async function getDatabase(): Promise<Db> {
  if (db) return db;

  if (!client) {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
  }

  db = client.db(DB_NAME);
  return db;
}

export async function closeConnection(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
}
