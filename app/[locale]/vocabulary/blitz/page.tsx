import BlitzVocab from '@/features/Vocabulary/components/Blitz';
import type { Metadata } from 'next';
import { generatePageMetadata } from '@/core/i18n/metadata-helpers';

export async function generateMetadata(): Promise<Metadata> {
  return await generatePageMetadata('vocabularyBlitz');
}

export default function BlitzPage() {
  return <BlitzVocab />;
}
