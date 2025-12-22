import KanaGame from '@/features/Kana/components/Game';
import type { Metadata } from 'next';
import { generatePageMetadata } from '@/core/i18n/metadata-helpers';

export async function generateMetadata(): Promise<Metadata> {
  return await generatePageMetadata('kanaTrain');
}

export default function Train() {
  return <KanaGame />;
}
