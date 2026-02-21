import { db } from './firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  Timestamp, 
  where 
} from 'firebase/firestore';

export interface Item {
  id: string;
  title: string;
  createdAt: string;
}

// Firestore 컬렉션 참조
const itemsCollection = collection(db, 'items');

/**
 * 모든 아이템을 Firestore에서 가져옵니다.
 */
export const getAllItems = async (): Promise<Item[]> => {
  try {
    const q = query(itemsCollection, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Item[];
  } catch (error) {
    console.error('Error fetching items from Firestore:', error);
    return [];
  }
};

/**
 * 특정 날짜의 아이템을 가져옵니다. (YYYY-MM-DD 형식)
 */
export const getItemsByDate = async (dateStr: string): Promise<Item[]> => {
  try {
    // 해당 날짜의 시작과 끝 시간 계산 (UTC 기준)
    const startDate = new Date(dateStr);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(dateStr);
    endDate.setHours(23, 59, 59, 999);

    const q = query(
      itemsCollection,
      where('createdAt', '>=', startDate.toISOString()),
      where('createdAt', '<=', endDate.toISOString()),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Item[];
  } catch (error) {
    console.error(`Error fetching items for date ${dateStr}:`, error);
    return [];
  }
};

/**
 * 새로운 아이템을 Firestore에 추가합니다.
 */
export const addItem = async (title: string): Promise<Item> => {
  const newItem = {
    title,
    createdAt: new Date().toISOString(),
  };

  const docRef = await addDoc(itemsCollection, newItem);
  return {
    id: docRef.id,
    ...newItem
  };
};
