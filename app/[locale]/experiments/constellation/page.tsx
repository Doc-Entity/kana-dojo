import { KanaConstellation } from '@/features/Experiments';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Constellation - Connect Kana Stars | KanaDojo',
  description: 'Connect the stars to form Japanese characters in this relaxing mode.'
};

export default function ConstellationPage() {
  return <KanaConstellation />;
}
