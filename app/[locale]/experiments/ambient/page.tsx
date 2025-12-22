import { AmbientMode } from '@/features/Experiments';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ambient Mode - Floating Kana Atmosphere | KanaDojo',
  description: 'Relax with floating Japanese characters in ambient mode.'
};

export default function AmbientPage() {
  return <AmbientMode />;
}
