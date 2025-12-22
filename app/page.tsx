import { HomePageContent } from '../components/HomePageContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dev Tools | Free online formatters, converters, and calculators',
  alternates: {
    canonical: 'https://devtools.henrychan.tech',
  },
};

export default function Home() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Dev Tools',
    url: 'https://devtools.henrychan.tech',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://devtools.henrychan.tech/?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomePageContent />
    </>
  );
}
