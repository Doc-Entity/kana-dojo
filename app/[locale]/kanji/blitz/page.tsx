import BlitzKanji from '@/features/Kanji/components/Blitz';
import type { Metadata } from 'next';
import { generatePageMetadata } from '@/core/i18n/metadata-helpers';

export async function generateMetadata(): Promise<Metadata> {
  return await generatePageMetadata('kanjiBlitz');
}

export default function BlitzPage() {
  return <BlitzKanji />;
}
