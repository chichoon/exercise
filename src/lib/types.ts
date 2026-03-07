/*
 * (strength 목록에 있는 것들: Assisted Pullup, Lat Pulldown 등, 한국어일 경우 번역)
 * 자전거의 경우 '자전거', 하단 key는 'cycling',
 * 러닝의 경우 '러닝', 하단 key 는 'running'
 * 운동별로 Exercise 인터페이스 하나씩 추가
 */

interface BaseRecord {
  name: string; // 운동 이름
  key: string; // 운동 키 (name 을 camelCase 로 기재)
  description?: string; // 그외 내용은 여기에 문자열로 기재
}

export interface WeightRecord extends BaseRecord {
  reps?: number; // 한 세트당 운동 횟수, 개수로 적혀있음, strength 의 경우에만
  sets?: number; // 세트 횟수, 개수로 적혀있음, strength의 경우에만
  weight?: {
    // 무게, kg or pound, strength의 경우에만
    value: number; // 단위를 뺀 절대값
    unit: 'kg' | 'pound'; // 단위 (그 외의 단위일 경우 기재)
  };
}

export interface CardioRecord extends BaseRecord {
  distance?: number; // 러닝 or 자전거의 경우 수행한 거리, km단위
  duration?: string; // 러닝 Or 자전거의 경우 수행한 시간, hh:mm:ss
  avgSpeed?: number; // 평균속도, km/h 단위
  calories?: {
    // 러닝 or 자전거의 경우 소모한 칼로리
    active: number; // 활동 칼로리, 없을 경우 0
    total: number; // 총 칼로리, 없을 경우 0, 칼로리만 적혀있을 경우 total만 기재
  };
}

export type RecordItem = WeightRecord | CardioRecord;
export type WorkoutTag =
  | 'upperBodyWorkout'
  | 'lowerBodyWorkout'
  | 'crossfit'
  | 'running'
  | 'cycling'
  | 'other';

export interface Exercise {
  name: string; // 운동 이름
  tag: WorkoutTag; // 운동 태그 (strength, crossfit, running, ...)
  date: string; // 수행한 날짜, YYYY-MM-DD
  description: string; // 그외 내용은 여기에 문자열로 기재
  record: RecordItem[];
}

export type DateString = string;
export type ExerciseRecord = Record<DateString, Exercise[]>;
