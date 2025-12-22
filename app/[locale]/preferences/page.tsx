import Settings from '@/features/Preferences/components';
import type { Metadata } from 'next';
import { generatePageMetadata } from '@/core/i18n/metadata-helpers';

export async function generateMetadata(): Promise<Metadata> {
  return await generatePageMetadata('preferences');
}

export default function SettingsPage() {
  return <Settings />;
}
