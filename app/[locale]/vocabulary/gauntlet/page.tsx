import GauntletVocab from '@/features/Vocabulary/components/Gauntlet';
import type { Metadata } from 'next';
import { generatePageMetadata } from '@/core/i18n/metadata-helpers';

export async function generateMetadata(): Promise<Metadata> {
  return await generatePageMetadata('vocabularyGauntlet');
}

export default function GauntletPage() {
  return <GauntletVocab />;
}
