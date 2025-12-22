import ProgressWithSidebar from '@/features/Progress/components/ProgressWithSidebar';
import type { Metadata } from 'next';
import { generatePageMetadata } from '@/core/i18n/metadata-helpers';

export async function generateMetadata(): Promise<Metadata> {
  return await generatePageMetadata('progress');
}

export default function ProgressPage() {
  return <ProgressWithSidebar />;
}
