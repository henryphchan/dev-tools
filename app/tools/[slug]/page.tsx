import { notFound } from 'next/navigation';
import { ToolWorkspace } from '../../../components/ToolWorkspace';
import { findToolBySlug, tools } from '../../../lib/tools';

interface ToolPageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.slug }));
}

export function generateMetadata({ params }: ToolPageProps) {
  const tool = findToolBySlug(params.slug);

  if (!tool) {
    return {};
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://devtools.henrychan.tech';

  return {
    title: tool.seoTitle,
    description: tool.longDescription,
    keywords: tool.keywords,
    alternates: {
      canonical: `${baseUrl}/tools/${tool.slug}`,
    },
    openGraph: {
      title: tool.seoTitle,
      description: tool.longDescription,
      url: `${baseUrl}/tools/${tool.slug}`,
      type: 'website',
      siteName: 'Dev Tools',
    },
  };
}

export default function ToolPage({ params }: ToolPageProps) {
  const tool = findToolBySlug(params.slug);

  if (!tool) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://devtools.henrychan.tech';
  const url = `${baseUrl}/tools/${tool.slug}`;

  // SoftwareApplication Schema
  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.title,
    description: tool.description,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Any',
    url: url,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };

  // BreadcrumbList Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: tool.title,
        item: url,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ToolWorkspace tool={tool!} />
    </>
  );
}
