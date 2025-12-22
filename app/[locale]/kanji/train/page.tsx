import KanjiGame from '@/features/Kanji/components/Game';
import type { Metadata } from 'next';
import { generatePageMetadata } from '@/core/i18n/metadata-helpers';

export async function generateMetadata(): Promise<Metadata> {
  return await generatePageMetadata('kanjiTrain');
}

export default function Train() {
  return <KanjiGame />;
}
