import type { Metadata } from 'next';
import DojoMenu from '@/shared/components/Menu/DojoMenu';
import { generatePageMetadata } from '@/core/i18n/metadata-helpers';

export async function generateMetadata(): Promise<Metadata> {
  return await generatePageMetadata('kanji');
}

export default function KanjiPage() {
  return <DojoMenu />;
}
