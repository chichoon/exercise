import { JSONFilePreset } from 'lowdb/node';
import path from 'path';
import fs from 'fs/promises';

export interface Item {
  id: string;
  title: string;
  createdAt: string;
}

export interface Database {
  items: Item[];
}

const defaultData: Database = { items: [] };

const DATABASE_DIR = path.join(process.cwd(), 'public', 'database');

/**
 * Gets the lowdb instance for a specific date.
 */
export const getDbForDate = async (date: Date) => {
  // Ensure the directory exists
  await fs.mkdir(DATABASE_DIR, { recursive: true });

  const fileName = date.toISOString().split('T')[0] + '.json';
  const filePath = path.join(DATABASE_DIR, fileName);
  
  const db = await JSONFilePreset<Database>(filePath, defaultData);
  return db;
};

/**
 * Retrieves all items from all daily JSON files in the database directory.
 */
export const getAllItems = async (): Promise<Item[]> => {
  try {
    await fs.mkdir(DATABASE_DIR, { recursive: true });
    const files = await fs.readdir(DATABASE_DIR);
    const jsonFiles = files.filter(file => file.endsWith('.json'));

    const allItems: Item[] = [];

    for (const file of jsonFiles) {
      const filePath = path.join(DATABASE_DIR, file);
      const content = await fs.readFile(filePath, 'utf-8');
      try {
        const data: Database = JSON.parse(content);
        if (data && Array.isArray(data.items)) {
          allItems.push(...data.items);
        }
      } catch (e) {
        console.error(`Error parsing ${file}:`, e);
      }
    }

    // Sort by createdAt descending
    return allItems.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.error('Error reading database directory:', error);
    return [];
  }
};
