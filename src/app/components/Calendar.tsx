import React from 'react';
import Link from 'next/link';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay,
  parseISO
} from 'date-fns';
import { ko } from 'date-fns/locale';
import styles from './Calendar.module.scss';
import { Exercise, WeightRecord, CardioRecord } from '@/lib/types';

interface CalendarProps {
  currentDate: Date;
  initialExercises: Exercise[];
  selectedDay: Date | null;
  showSelector?: boolean;
}

const Calendar = ({ currentDate, initialExercises, selectedDay, showSelector }: CalendarProps) => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const getMonthLink = (date: Date) => {
    return `/${format(date, 'yyyy')}/${format(date, 'MM')}`;
  };

  const getDayLink = (day: Date) => {
    return `${getMonthLink(currentDate)}?day=${format(day, 'yyyy-MM-dd')}`;
  };

  const isWeightRecord = (record: any): record is WeightRecord => {
    return 'sets' in record || 'reps' in record || 'weight' in record;
  };

  const getDayExercises = (day: Date) => {
    return initialExercises.filter(ex => isSameDay(parseISO(ex.date), day));
  };

  const selectedExercises = selectedDay ? getDayExercises(selectedDay) : [];

  const currentYear = format(currentDate, 'yyyy');
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div className={styles.calendarContainer}>
      {/* Navigation with SVG Icons */}
      <div className={styles.header}>
        <Link href={getMonthLink(subMonths(currentDate, 1))} className={styles.navBtn}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
        </Link>
        <Link href={`${getMonthLink(currentDate)}?select=true`} className={styles.monthTitle}>
          {format(currentDate, 'yyyy년 M월', { locale: ko })}
        </Link>
        <Link href={getMonthLink(addMonths(currentDate, 1))} className={styles.navBtn}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 18 6-6-6-6"/>
          </svg>
        </Link>
      </div>

      {/* Selector Modal */}
      {showSelector && (
        <div className={styles.modalOverlay}>
          <div className={styles.monthSelectorModal}>
            <h3>월 선택 ({currentYear})</h3>
            <div className={styles.monthGrid}>
              {months.map((m) => {
                const monthStr = m.toString().padStart(2, '0');
                const isActive = format(currentDate, 'MM') === monthStr;
                return (
                  <Link 
                    key={m} 
                    href={`/${currentYear}/${monthStr}`} 
                    className={`${styles.monthLink} ${isActive ? styles.activeMonth : ''}`}
                  >
                    {m}월
                  </Link>
                );
              })}
            </div>
            <Link href={getMonthLink(currentDate)} className={styles.closeModalBtn}>
              취소
            </Link>
          </div>
        </div>
      )}

      <div className={styles.grid}>
        {['일', '월', '화', '수', '목', '금', '토'].map((d) => (
          <div key={d} className={styles.weekday}>{d}</div>
        ))}

        {days.map((day, idx) => {
          const dayExercises = getDayExercises(day);
          const hasEx = dayExercises.length > 0;
          const isSelected = selectedDay && isSameDay(day, selectedDay);
          
          return (
            <Link 
              key={idx} 
              href={hasEx ? getDayLink(day) : '#'}
              className={`
                ${styles.dayCell} 
                ${!isSameMonth(day, monthStart) ? styles.notCurrentMonth : ''}
                ${hasEx ? styles.hasExercise : ''}
                ${isSelected ? styles.selectedDay : ''}
              `}
            >
              <span className={styles.dayNumber}>{format(day, 'd')}</span>
              {hasEx && <div className={styles.exerciseDot} />}
            </Link>
          );
        })}
      </div>

      {/* Detail Section */}
      {selectedDay && selectedExercises.length > 0 && (
        <div className={styles.detailSection}>
          <div className={styles.detailHeader}>
            <h3>{format(selectedDay, 'M월 d일', { locale: ko })} 운동 상세</h3>
            <Link href={getMonthLink(currentDate)} className={styles.closeBtn}>닫기</Link>
          </div>
          
          {selectedExercises.map((ex, exIdx) => (
            <div key={exIdx} className={styles.workoutGroup}>
              <h4 className={styles.workoutName}>{ex.name} <span className={styles.tag}>#{ex.tag}</span></h4>
              
              <div className={styles.recordList}>
                {ex.record.map((rec, rIdx) => (
                  <div key={rIdx} className={styles.recordItem}>
                    <span className={styles.itemName}>{rec.name}</span>
                    <span className={styles.itemValue}>
                      {isWeightRecord(rec) ? (
                        <>
                          {rec.weight?.value}{rec.weight?.unit} × {rec.sets}세트 × {rec.reps}회
                        </>
                      ) : (
                        <>
                          {(rec as CardioRecord).distance}km | {(rec as CardioRecord).duration}
                        </>
                      )}
                    </span>
                  </div>
                ))}
              </div>

              {ex.description && (
                <div className={styles.descriptionBox}>
                  <strong>Note:</strong> {ex.description}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Calendar;
