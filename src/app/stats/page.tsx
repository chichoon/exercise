import Tabs from '../components/Tabs';
import StatsChart from '../components/StatsChart';
import styles from '../page.module.scss';
import { getMonthlyStats } from '@/lib/db';
import { format } from 'date-fns';

export default async function StatsPage() {
  const currentYear = format(new Date(), 'yyyy');
  const statsData = await getMonthlyStats(currentYear);

  return (
    <div className={styles.page}>
      <Tabs activeTab="stats" />
      
      <main className={styles.main}>
        <div style={{ padding: '0 1rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#333', marginBottom: '10px' }}>
            {currentYear}년 월별 운동 통계
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '2rem' }}>
            한 달 동안 기록된 총 운동 종목의 횟수를 보여줍니다.
          </p>
          
          <div style={{ backgroundColor: '#fcfcfc', padding: '1.5rem', borderRadius: '20px', border: '1px solid #f2f2f2' }}>
            <StatsChart data={statsData} />
          </div>
        </div>
      </main>
      
      <footer className={styles.footer}>
        <p>© 2026 Exercise Tracker</p>
      </footer>
    </div>
  );
}
