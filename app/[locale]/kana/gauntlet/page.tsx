import GauntletKana from '@/features/Kana/components/Gauntlet';
import type { Metadata } from 'next';
import { generatePageMetadata } from '@/core/i18n/metadata-helpers';

export async function generateMetadata(): Promise<Metadata> {
  return await generatePageMetadata('kanaGauntlet');
}

export default function GauntletPage() {
  return <GauntletKana />;
}
