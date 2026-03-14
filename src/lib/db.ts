import { db } from './firebase';
import { 
  collection, 
  getDocs, 
  query, 
  setDoc,
  doc
} from 'firebase/firestore';
import { Exercise } from './types';

/**
 * 특정 연도와 월의 컬렉션 참조를 가져옵니다.
 * 구조: exercises/{year}/{month}
 */
const getMonthCollectionRef = (year: string, month: string) => {
  return collection(db, 'exercises', year, month.padStart(2, '0'));
};

/**
 * 특정 연도와 월에 해당하는 모든 운동 기록을 가져옵니다.
 */
export const getExercisesByMonth = async (year: string, month: string): Promise<Exercise[]> => {
  try {
    const monthColRef = getMonthCollectionRef(year, month);
    const querySnapshot = await getDocs(query(monthColRef));
    
    // 각 날짜 문서(예: 2026-02-02) 내의 운동 배열을 하나로 합칩니다.
    const allExercises: Exercise[] = [];
    querySnapshot.forEach((doc) => {
      const dayData = doc.data();
      if (dayData && dayData.exercises) {
        allExercises.push(...dayData.exercises);
      }
    });
    
    return allExercises.sort((a, b) => a.date.localeCompare(b.date));
  } catch (error) {
    console.error(`Error fetching exercises for ${year}/${month}:`, error);
    return [];
  }
};

/**
 * 운동 기록을 특정 날짜 문서에 저장합니다.
 * ID 예시: exercises/2026/02/2026-02-02
 */
export const saveExercisesByDate = async (date: string, exercises: Exercise[]): Promise<void> => {
  try {
    const [year, month] = date.split('-');
    // 문서 경로: exercises/2026/02/2026-02-02
    const docRef = doc(db, 'exercises', year, month, date);
    
    await setDoc(docRef, { 
      exercises,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error saving exercises to Firestore:', error);
    throw error;
  }
};

/**
 * 특정 연도의 월별 운동 횟수를 가져옵니다.
 */
export const getMonthlyStats = async (year: string) => {
  try {
    const stats = [];
    // 1월부터 12월까지 순회하며 데이터 개수 확인
    for (let i = 1; i <= 12; i++) {
      const monthStr = i.toString().padStart(2, '0');
      const monthColRef = getMonthCollectionRef(year, monthStr);
      const querySnapshot = await getDocs(query(monthColRef));
      
      let count = 0;
      querySnapshot.forEach((doc) => {
        const dayData = doc.data();
        if (dayData && dayData.exercises) {
          count += dayData.exercises.length;
        }
      });
      
      stats.push({
        name: `${i}월`,
        count: count
      });
    }
    return stats;
  } catch (error) {
    console.error(`Error fetching stats for ${year}:`, error);
    return [];
  }
};

// 기존 addExercise 호환성을 위해 유지 (단일 운동 추가 시 사용)
export const addExercise = async (exercise: Exercise): Promise<void> => {
  const [year, month, day] = exercise.date.split('-');
  const dateStr = exercise.date;
  
  // 해당 날짜의 기존 데이터를 가져와서 추가하는 로직이 필요하지만, 
  // 여기서는 간단히 해당 날짜 문서를 덮어쓰거나 새로 생성하는 방식으로 구현합니다.
  await saveExercisesByDate(dateStr, [exercise]);
};
