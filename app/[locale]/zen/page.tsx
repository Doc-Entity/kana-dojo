import { ZenMode } from '@/features/Experiments';
import type { Metadata } from 'next';
import { generatePageMetadata } from '@/core/i18n/metadata-helpers';

export async function generateMetadata(): Promise<Metadata> {
  return await generatePageMetadata('zen');
}

export default function ZenRoute() {
  return <ZenMode />;
}
