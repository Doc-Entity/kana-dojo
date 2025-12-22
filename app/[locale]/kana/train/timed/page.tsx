import BlitzKana from '@/features/Kana/components/Blitz';
import type { Metadata } from 'next';
import { generatePageMetadata } from '@/core/i18n/metadata-helpers';

export async function generateMetadata(): Promise<Metadata> {
  return await generatePageMetadata('kanaBlitz');
}

export default function TimedKanaPage() {
  return (
    <main className='p-4 max-w-xl mx-auto'>
      <h1 className='text-2xl font-bold mb-4 text-center'>Blitz: Kana</h1>
      <BlitzKana />
    </main>
  );
}
