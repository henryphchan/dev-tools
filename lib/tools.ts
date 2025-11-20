export type ToolId = 'json' | 'xml' | 'sql' | 'encode' | 'timezone' | 'bitwise';

export interface ToolInfo {
  id: ToolId;
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  longDescription: string;
  badge: string;
  accent: string;
  keywords: string[];
}

export const tools: ToolInfo[] = [
  {
    id: 'json',
    slug: 'json-formatter',
    title: 'JSON Formatter',
    seoTitle: 'Online JSON Formatter & Validator | Dev Tools',
    description: 'Instantly pretty-print and validate JSON for APIs, configs, or log payloads.',
    longDescription:
      'Format, validate, and share JSON snippets in seconds. Use it to prepare clean API payloads, tidy configuration files, or debug malformed responses without leaving your browser.',
    badge: 'Formatter',
    accent: 'Structured data',
    keywords: ['json', 'formatter', 'validator', 'api payload', 'prettify JSON'],
  },
  {
    id: 'xml',
    slug: 'xml-formatter',
    title: 'XML Formatter',
    seoTitle: 'XML Beautifier & Indenter | Dev Tools',
    description: 'Beautify XML with consistent indentation and readable markup.',
    longDescription:
      'Make XML easy to scan with reliable indentation. Great for SOAP payloads, sitemap debugging, configuration files, or any XML you need to share with teammates.',
    badge: 'Formatter',
    accent: 'Markup',
    keywords: ['xml', 'formatter', 'beautifier', 'indent XML', 'xml editor'],
  },
  {
    id: 'sql',
    slug: 'sql-formatter',
    title: 'SQL Formatter',
    seoTitle: 'SQL Formatter & Query Beautifier | Dev Tools',
    description: 'Clean up ad-hoc queries for MySQL, Postgres, SQL Server, and more.',
    longDescription:
      'Reformat SQL for faster reviews and fewer mistakes. Ideal for formatting ad-hoc queries, code review snippets, or saved scripts across major databases.',
    badge: 'Formatter',
    accent: 'Database',
    keywords: ['sql formatter', 'query beautifier', 'postgres sql format', 'mysql', 'database tools'],
  },
  {
    id: 'encode',
    slug: 'url-base64-encoder-decoder',
    title: 'URL & Base64 Encoder/Decoder',
    seoTitle: 'URL Encoder, URL Decoder & Base64 Converter | Dev Tools',
    description: 'Encode and decode URLs and Base64 strings for tokens, cookies, and payloads.',
    longDescription:
      'Safely transform strings between URL encoding and Base64. Decode JWT fragments, sanitize query parameters, and copy clean outputs without extra dependencies.',
    badge: 'Converter',
    accent: 'Transport',
    keywords: ['url encode', 'url decode', 'base64', 'converter', 'jwt'],
  },
  {
    id: 'timezone',
    slug: 'timezone-converter',
    title: 'Timezone Converter',
    seoTitle: 'Timezone Converter with Offset Details | Dev Tools',
    description: 'Translate meeting times across regions with clear offsets and readable formats.',
    longDescription:
      'Plan meetings and releases with confidence. Convert between popular time zones, see readable offsets, and copy the converted values for invites or documentation.',
    badge: 'Converter',
    accent: 'Schedule',
    keywords: ['timezone converter', 'utc offset', 'meeting planner', 'time zones', 'scheduler'],
  },
  {
    id: 'bitwise',
    slug: 'bitwise-calculator',
    title: 'Bitwise Calculator',
    seoTitle: 'Bitwise Calculator for AND, OR, XOR & Shifts | Dev Tools',
    description: 'Evaluate AND/OR/XOR/shift operations and view binary representations.',
    longDescription:
      'Test bitwise logic quickly. Inspect how integers respond to AND, OR, XOR, NOT, and shift operators with decimal and binary outputs for debugging low-level code.',
    badge: 'Calculator',
    accent: 'Binary',
    keywords: ['bitwise calculator', 'binary', 'and or xor', 'bit shifts', 'debugging'],
  },
];

export function findToolBySlug(slug: string): ToolInfo | undefined {
  return tools.find((tool) => tool.slug === slug);
}

export function findToolById(id: ToolId): ToolInfo | undefined {
  return tools.find((tool) => tool.id === id);
}
