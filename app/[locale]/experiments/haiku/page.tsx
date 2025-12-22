import { DailyHaiku } from '@/features/Experiments';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Haiku Garden - Daily Japanese Poetry | KanaDojo',
  description: 'Read and contemplate daily Haiku poems in Japanese and English.'
};

export default function HaikuPage() {
  return <DailyHaiku />;
}
