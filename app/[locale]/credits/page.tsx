import Credits from '@/features/Legal/credits/Credits';
import { Metadata } from 'next';
import { generatePageMetadata } from '@/core/i18n/metadata-helpers';

export async function generateMetadata(): Promise<Metadata> {
  return await generatePageMetadata('credits');
}

export default function CreditsRoute() {
  return <Credits />;
}
