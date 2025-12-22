import SecurityPolicy from '@/features/Legal/Security';
import type { Metadata } from 'next';
import { generatePageMetadata } from '@/core/i18n/metadata-helpers';

export async function generateMetadata(): Promise<Metadata> {
  return await generatePageMetadata('security');
}

export default function SecurityPolicyPage() {
  return <SecurityPolicy />;
}
