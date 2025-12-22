import BlitzKana from '@/features/Kana/components/Blitz';
import type { Metadata } from 'next';
import { generatePageMetadata } from '@/core/i18n/metadata-helpers';

export async function generateMetadata(): Promise<Metadata> {
  return await generatePageMetadata('kanaBlitz');
}

export default function BlitzPage() {
  return <BlitzKana />;
}
