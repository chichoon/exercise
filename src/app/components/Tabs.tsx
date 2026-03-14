import Link from 'next/link';
import { format } from 'date-fns';
import styles from './Tabs.module.scss';

interface TabsProps {
  activeTab: 'calendar' | 'stats';
}

const Tabs = ({ activeTab }: TabsProps) => {
  const currentMonthPath = `/${format(new Date(), 'yyyy')}/${format(new Date(), 'MM')}`;

  return (
    <div className={styles.tabsContainer}>
      <Link 
        href={currentMonthPath} 
        className={`${styles.tab} ${activeTab === 'calendar' ? styles.active : ''}`}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '6px'}}>
          <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/>
        </svg>
        캘린더
      </Link>
      <Link 
        href="/stats" 
        className={`${styles.tab} ${activeTab === 'stats' ? styles.active : ''}`}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '6px'}}>
          <line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/>
        </svg>
        통계
      </Link>
    </div>
  );
};

export default Tabs;
