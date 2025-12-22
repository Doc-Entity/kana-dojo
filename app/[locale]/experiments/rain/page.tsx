import { KanaRain } from '@/features/Experiments';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kana Rain - Matrix Style Japanese Characters | KanaDojo',
  description: 'Watch Japanese characters fall in a digital rain effect.'
};

export default function RainPage() {
  return <KanaRain />;
}
