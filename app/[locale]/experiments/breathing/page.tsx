import { BreathingExercise } from '@/features/Experiments';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Breathing Exercise - Relax with Kana | KanaDojo',
  description: 'Guided breathing exercises synchronized with Japanese characters.'
};

export default function BreathingPage() {
  return <BreathingExercise />;
}
