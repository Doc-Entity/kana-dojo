import { SpeedTyping } from '@/features/Experiments';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Speed Typing - Romaji Typing Practice | KanaDojo',
  description: 'Test your typing speed with Japanese Romaji.'
};

export default function TypingPage() {
  return <SpeedTyping />;
}
