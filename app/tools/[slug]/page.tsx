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

  return {
    title: tool.seoTitle,
    description: tool.longDescription,
    keywords: tool.keywords,
    alternates: {
      canonical: `/tools/${tool.slug}`,
    },
    openGraph: {
      title: tool.seoTitle,
      description: tool.longDescription,
      url: `/tools/${tool.slug}`,
      type: 'article',
      siteName: 'Dev Tools',
    },
  };
}

export default function ToolPage({ params }: ToolPageProps) {
  const tool = findToolBySlug(params.slug);

  if (!tool) {
    notFound();
  }

  return <ToolWorkspace tool={tool!} />;
}
