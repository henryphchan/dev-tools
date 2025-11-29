import type { MetadataRoute } from 'next';
import { tools } from '../lib/tools';

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://devtools.henrychan.tech').replace(/\/$/, '');

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const toolEntries: MetadataRoute.Sitemap = tools.map((tool) => ({
    url: `${siteUrl}/tools/${tool.slug}`,
    lastModified,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [
    {
      url: siteUrl,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...toolEntries,
  ];
}
