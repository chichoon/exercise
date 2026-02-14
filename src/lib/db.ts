import { JSONFilePreset } from 'lowdb/node';

export interface Item {
  id: string;
  title: string;
  createdAt: string;
}

export interface Database {
  items: Item[];
}

const defaultData: Database = { items: [] };

// Initialize the database with default data
// This will create db.json in the project root if it doesn't exist
export const getDb = async () => {
  const db = await JSONFilePreset<Database>('db.json', defaultData);
  return db;
};
