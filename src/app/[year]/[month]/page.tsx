import Calendar from '../../components/Calendar';
import styles from '../../page.module.scss';
import { getExercisesByMonth } from '@/lib/db';
import { parse, isValid } from 'date-fns';

interface PageProps {
  params: Promise<{ year: string; month: string }>;
  searchParams: Promise<{ day?: string }>;
}

export default async function MonthPage({ params, searchParams }: PageProps) {
  const { year, month } = await params;
  const { day: selectedDayStr } = await searchParams;
  
  // 서버 사이드에서 데이터 가져오기
  const exercises = await getExercisesByMonth(year, month);
  
  // 현재 날짜 및 선택된 날짜 처리
  const currentDate = parse(`${year}-${month}-01`, 'yyyy-MM-dd', new Date());
  
  let selectedDay: Date | null = null;
  if (selectedDayStr) {
    const parsedDay = parse(selectedDayStr, 'yyyy-MM-dd', new Date());
    if (isValid(parsedDay)) {
      selectedDay = parsedDay;
    }
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Calendar 
          currentDate={currentDate} 
          initialExercises={exercises} 
          selectedDay={selectedDay}
        />
      </main>
      
      <footer className={styles.footer}>
        <p>© 2026 Exercise Tracker</p>
      </footer>
    </div>
  );
}
