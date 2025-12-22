import { SoundGarden } from '@/features/Experiments';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sound Garden - Interactive Kana Sounds | KanaDojo',
  description: 'Create music and sounds using Japanese characters.'
};

export default function SoundPage() {
  return <SoundGarden />;
}
