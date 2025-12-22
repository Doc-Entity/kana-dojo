import type { Metadata } from 'next';
import { TranslatorPage } from '@/features/Translator';
import { StructuredData } from '@/shared/components/SEO/StructuredData';
import { generatePageMetadata } from '@/core/i18n/metadata-helpers';

// JSON-LD structured data for the translator page
const translatorSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      '@id': 'https://kanadojo.com/translate#webapp',
      name: 'KanaDojo Japanese Translator',
      url: 'https://kanadojo.com/translate',
      applicationCategory: 'UtilityApplication',
      operatingSystem: 'Any',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD'
      },
      description:
        'Free online Japanese translator. Translate English to Japanese or Japanese to English instantly with romanization support.',
      featureList: [
        'English to Japanese translation',
        'Japanese to English translation',
        'Romanization (romaji) display',
        'Translation history',
        'Copy to clipboard',
        'Keyboard shortcuts'
      ],
      browserRequirements: 'Requires JavaScript',
      softwareVersion: '1.0',
      author: {
        '@type': 'Organization',
        name: 'KanaDojo',
        url: 'https://kanadojo.com'
      }
    },
    {
      '@type': 'SoftwareApplication',
      '@id': 'https://kanadojo.com/translate#software',
      name: 'Japanese Translator',
      applicationCategory: 'UtilityApplication',
      operatingSystem: 'Web',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD'
      }
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://kanadojo.com/translate#faq',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Is this Japanese translator free?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes! Our Japanese translator is completely free to use with no registration required.'
          }
        },
        {
          '@type': 'Question',
          name: 'How accurate is the translation?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Our translator uses Google Cloud Translation API, one of the most accurate machine translation services available.'
          }
        },
        {
          '@type': 'Question',
          name: 'What is romanization (romaji)?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Romanization, or romaji, is the representation of Japanese text using the Latin alphabet to help with pronunciation.'
          }
        }
      ]
    }
  ]
};

export async function generateMetadata(): Promise<Metadata> {
  return await generatePageMetadata('translate');
}

interface TranslatePageProps {
  params: Promise<{ locale: string }>;
}

export default async function TranslatePage({ params }: TranslatePageProps) {
  const { locale } = await params;

  return (
    <>
      <StructuredData data={translatorSchema} />
      <main className='min-h-screen'>
        <TranslatorPage locale={locale} />
      </main>
    </>
  );
}
