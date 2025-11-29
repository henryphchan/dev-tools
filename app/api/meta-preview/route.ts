import { NextResponse } from 'next/server';
import { load } from 'cheerio';

interface MetaTag {
  attribute: 'name' | 'property';
  key: string;
  content: string;
}

interface ParsedMetadata {
  title: string;
  description: string;
  url: string;
  image?: string;
  siteName?: string;
  favicon?: string;
  metaTags: MetaTag[];
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  twitterSite?: string;
  twitterCreator?: string;
}

function resolveUrl(value: string | undefined, baseUrl: URL) {
  if (!value) return undefined;
  try {
    return new URL(value, baseUrl).toString();
  } catch (error) {
    console.error('Failed to resolve URL', value, error);
    return undefined;
  }
}

function extractMetadata(html: string, baseUrl: URL): ParsedMetadata {
  const $ = load(html);

  const findMeta = (selector: string) => $(selector).attr('content')?.trim();
  const title = $('title').first().text().trim() || findMeta('meta[property="og:title"]') || '';
  const description =
    findMeta('meta[name="description"]') ||
    findMeta('meta[property="og:description"]') ||
    findMeta('meta[name="twitter:description"]') ||
    '';

  const image =
    findMeta('meta[property="og:image"]') ||
    findMeta('meta[name="twitter:image"]') ||
    $('link[rel="image_src"]').attr('href');

  const canonical = $('link[rel="canonical"]').attr('href');
  const ogUrl = findMeta('meta[property="og:url"]');

  const favicon =
    $('link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]').attr('href') ||
    '/favicon.ico';

  const metaTags: MetaTag[] = $('meta')
    .toArray()
    .map((meta) => {
      const nameAttr = $(meta).attr('name');
      const propertyAttr = $(meta).attr('property');
      const content = $(meta).attr('content');

      if (!content) return undefined;
      if (nameAttr) {
        return { attribute: 'name', key: nameAttr, content: content.trim() } as MetaTag;
      }
      if (propertyAttr) {
        return { attribute: 'property', key: propertyAttr, content: content.trim() } as MetaTag;
      }
      return undefined;
    })
    .filter(Boolean) as MetaTag[];

  const twitterImage = findMeta('meta[name="twitter:image"]') || findMeta('meta[name="twitter:image:src"]');
  const twitterTitle = findMeta('meta[name="twitter:title"]');
  const twitterDescription = findMeta('meta[name="twitter:description"]');

  return {
    title,
    description,
    image: resolveUrl(image, baseUrl),
    url: resolveUrl(ogUrl || canonical || baseUrl.toString(), baseUrl) ?? baseUrl.toString(),
    siteName: findMeta('meta[property="og:site_name"]') || baseUrl.hostname,
    favicon: resolveUrl(favicon, baseUrl),
    metaTags,
    twitterCard: findMeta('meta[name="twitter:card"]'),
    twitterTitle: twitterTitle || undefined,
    twitterDescription: twitterDescription || undefined,
    twitterImage: resolveUrl(twitterImage, baseUrl),
    twitterSite: findMeta('meta[name="twitter:site"]') || undefined,
    twitterCreator: findMeta('meta[name="twitter:creator"]') || undefined,
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get('url');

  if (!targetUrl) {
    return NextResponse.json({ error: 'Please provide a url query parameter.' }, { status: 400 });
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(targetUrl);
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      throw new Error('Unsupported protocol');
    }
  } catch (error) {
    return NextResponse.json({ error: 'Please enter a valid http(s) URL.' }, { status: 400 });
  }

  try {
    const response = await fetch(parsedUrl.toString(), {
      redirect: 'follow',
      headers: {
        'user-agent': 'DevTools Meta Preview/1.0 (+https://github.com/)',
        accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Fetching the page failed with status ${response.status}.` },
        { status: response.status },
      );
    }

    const html = await response.text();
    const finalUrl = new URL(response.url || parsedUrl.toString());
    const metadata = extractMetadata(html, finalUrl);

    return NextResponse.json({
      ...metadata,
      sourceUrl: finalUrl.toString(),
      responseStatus: response.status,
      contentType: response.headers.get('content-type') ?? undefined,
    });
  } catch (error) {
    console.error('Metadata fetch failed', error);
    return NextResponse.json({ error: 'Unable to fetch metadata for that URL.' }, { status: 500 });
  }
}
