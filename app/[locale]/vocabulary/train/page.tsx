import VocabGame from '@/features/Vocabulary/components/Game';
import type { Metadata } from 'next';
import { generatePageMetadata } from '@/core/i18n/metadata-helpers';

export async function generateMetadata(): Promise<Metadata> {
  return await generatePageMetadata('vocabularyTrain');
}

export default function Train() {
  return <VocabGame />;
}
