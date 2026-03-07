'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
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
import { Exercise, WeightRecord } from '@/lib/types';

interface CalendarProps {
  currentDate: Date;
  initialExercises: Exercise[];
}

const Calendar = ({ currentDate, initialExercises }: CalendarProps) => {
  const router = useRouter();

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const goToMonth = (date: Date) => {
    const year = format(date, 'yyyy');
    const month = format(date, 'MM');
    router.push(`/${year}/${month}`);
  };

  const nextMonth = () => goToMonth(addMonths(currentDate, 1));
  const prevMonth = () => goToMonth(subMonths(currentDate, 1));

  const isWeightRecord = (record: any): record is WeightRecord => {
    return 'sets' in record || 'reps' in record || 'weight' in record;
  };

  const getDayExercises = (day: Date) => {
    return initialExercises.filter(ex => isSameDay(parseISO(ex.date), day));
  };

  const renderTooltip = (dayExercises: Exercise[]) => {
    if (dayExercises.length === 0) return null;

    return (
      <div className={styles.tooltip}>
        <div className={styles.tooltipTitle}>운동 기록</div>
        {dayExercises.map((ex, idx) => (
          <div key={idx} className={styles.tooltipItem}>
            <strong>• {ex.name}</strong>
            {ex.record.map((rec, rIdx) => (
              <span key={rIdx} className={styles.tooltipRecord}>
                {isWeightRecord(rec) ? (
                   <>
                     {rec.weight?.value}{rec.weight?.unit} | {rec.sets}세트 x {rec.reps}회
                   </>
                ) : (
                  <>
                    {rec.distance}km | {rec.duration} | {rec.calories?.total}kcal
                  </>
                )}
              </span>
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.calendarContainer}>
      <div className={styles.header}>
        <h2 className={styles.monthTitle}>
          {format(currentDate, 'yyyy년 M월', { locale: ko })}
        </h2>
        <div className={styles.navButtons}>
          <button className={styles.navButton} onClick={prevMonth}>이전</button>
          <button className={styles.navButton} onClick={nextMonth}>다음</button>
        </div>
      </div>

      <div className={styles.grid}>
        {['일', '월', '화', '수', '목', '금', '토'].map((d) => (
          <div key={d} className={styles.weekday}>{d}</div>
        ))}

        {days.map((day, idx) => {
          const dayExercises = getDayExercises(day);
          const hasEx = dayExercises.length > 0;
          
          return (
            <div 
              key={idx} 
              className={`
                ${styles.dayCell} 
                ${!isSameMonth(day, monthStart) ? styles.notCurrentMonth : ''}
                ${hasEx ? styles.hasExercise : ''}
              `}
            >
              <span className={styles.dayNumber}>{format(day, 'd')}</span>
              {hasEx && <div className={styles.exerciseDot} />}
              {hasEx && renderTooltip(dayExercises)}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
