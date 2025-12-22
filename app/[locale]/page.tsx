import MainMenu from '@/features/MainMenu';
import type { Metadata } from 'next';
import { generatePageMetadata } from '@/core/i18n/metadata-helpers';

export async function generateMetadata(): Promise<Metadata> {
  return await generatePageMetadata('home');
}

export default function Home() {
  return <MainMenu />;
}
