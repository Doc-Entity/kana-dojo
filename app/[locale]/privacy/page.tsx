import PrivacyPolicy from '@/features/Legal/Privacy';
import type { Metadata } from 'next';
import { generatePageMetadata } from '@/core/i18n/metadata-helpers';

export async function generateMetadata(): Promise<Metadata> {
  return await generatePageMetadata('privacy');
}

export default function PrivacyPolicyPage() {
  return <PrivacyPolicy />;
}
