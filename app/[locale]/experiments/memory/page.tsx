import { MemoryPalace } from '@/features/Experiments';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Memory Palace - Spatial Memory Game | KanaDojo',
  description: 'Test your spatial memory with Japanese characters.'
};

export default function MemoryPage() {
  return <MemoryPalace />;
}
