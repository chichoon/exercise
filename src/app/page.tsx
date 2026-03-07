import { redirect } from 'next/navigation';
import { format } from 'date-fns';

export default function Home() {
  // 메인 페이지 접속 시 현재 연도/월로 리다이렉트 (예: /2026/03)
  const currentYear = format(new Date(), 'yyyy');
  const currentMonth = format(new Date(), 'MM');
  
  redirect(`/${currentYear}/${currentMonth}`);
}
