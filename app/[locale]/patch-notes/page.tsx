import PatchNotes from '@/features/PatchNotes/PatchNotes';
import type { Metadata } from 'next';
import { generatePageMetadata } from '@/core/i18n/metadata-helpers';

export async function generateMetadata(): Promise<Metadata> {
  return await generatePageMetadata('patchNotes');
}

export default function PatchNotesPage() {
  return <PatchNotes />;
}
