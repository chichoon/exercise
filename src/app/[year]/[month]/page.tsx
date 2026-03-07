import Calendar from '../../components/Calendar';
import styles from '../../page.module.scss';
import { getExercisesByMonth } from '@/lib/db';
import { parse } from 'date-fns';

interface PageProps {
  params: Promise<{ year: string; month: string }>;
}

export default async function MonthPage({ params }: PageProps) {
  const { year, month } = await params;
  
  // 서버 사이드에서 데이터 가져오기 (SSR)
  const exercises = await getExercisesByMonth(year, month);
  
  // 문자열 파라미터를 Date 객체로 변환
  const currentDate = parse(`${year}-${month}-01`, 'yyyy-MM-dd', new Date());

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>나의 운동 기록</h1>
      </header>
      
      <main className={styles.main}>
        <Calendar currentDate={currentDate} initialExercises={exercises} />
      </main>
      
      <footer className={styles.footer}>
        <p>© 2026 Exercise Tracker</p>
      </footer>
    </div>
  );
}
