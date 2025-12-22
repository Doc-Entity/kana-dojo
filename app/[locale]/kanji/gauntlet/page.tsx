import GauntletKanji from '@/features/Kanji/components/Gauntlet';
import type { Metadata } from 'next';
import { generatePageMetadata } from '@/core/i18n/metadata-helpers';

export async function generateMetadata(): Promise<Metadata> {
  return await generatePageMetadata('kanjiGauntlet');
}

export default function GauntletPage() {
  return <GauntletKanji />;
}
