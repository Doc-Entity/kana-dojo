import TermsOfService from '@/features/Legal/Terms';
import type { Metadata } from 'next';
import { generatePageMetadata } from '@/core/i18n/metadata-helpers';

export async function generateMetadata(): Promise<Metadata> {
  return await generatePageMetadata('terms');
}

export default function TermsOfServicePage() {
  return <TermsOfService />;
}
