export type ToolId =
  | 'json'
  | 'xml'
  | 'sql'
  | 'encode'
  | 'timezone'
  | 'bitwise'
  | 'cron'
  | 'diff'
  | 'csv-json'
  | 'yaml-json'
  | 'timestamp'
  | 'jwt'
  | 'uuid';

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
    id: 'diff',
    slug: 'text-diff-viewer',
    title: 'Compare 2 text files',
    seoTitle: 'Compare two text files with highlighted diffs | Dev Tools',
    description: 'Upload or paste two texts to see a side-by-side diff with line numbers.',
    longDescription:
      'Spot changes quickly by uploading files or pasting text to a shared workspace. View line numbers, copy either side, and read highlighted additions and removals at a glance.',
    badge: 'Diff',
    accent: 'Review',
    keywords: ['diff', 'compare files', 'text difference', 'file diff', 'highlight changes'],
  },
  {
    id: 'cron',
    slug: 'cron-expression-validator',
    title: 'Cron Expression Validator',
    seoTitle: 'Cron Expression Validator with Timeline & Next Runs | Dev Tools',
    description: 'Validate cron syntax, preview the next 10 fire times, and spot risky schedules.',
    longDescription:
      'Check cron expressions quickly with a visual timeline, upcoming execution preview, and warnings for overly aggressive cadences. Great for CI jobs, maintenance windows, or scheduled alerts.',
    badge: 'Scheduler',
    accent: 'Automation',
    keywords: ['cron', 'scheduler', 'cron validator', 'crontab', 'scheduled jobs', 'devops'],
  },
  {
    id: 'csv-json',
    slug: 'csv-json-converter',
    title: 'CSV ↔ JSON Converter',
    seoTitle: 'CSV to JSON & JSON to CSV Online Converter | Dev Tools',
    description: 'Convert CSV rows to JSON arrays and back with header-aware parsing.',
    longDescription:
      'Quickly translate CSV rows into JSON arrays or convert JSON back into shareable CSV. Great for API payload prep, data munging, or debugging exports.',
    badge: 'Converter',
    accent: 'Data',
    keywords: ['csv', 'json', 'converter', 'csv to json', 'json to csv', 'data tools'],
  },
  {
    id: 'yaml-json',
    slug: 'yaml-json-converter',
    title: 'YAML ↔ JSON Converter',
    seoTitle: 'YAML to JSON & JSON to YAML Converter | Dev Tools',
    description: 'Translate YAML configs into JSON and back with a single click.',
    longDescription:
      'Convert between YAML and JSON for config files, CI pipelines, or Kubernetes manifests. Validate structure quickly before committing changes.',
    badge: 'Converter',
    accent: 'Config',
    keywords: ['yaml', 'json', 'converter', 'yaml to json', 'json to yaml', 'kubernetes', 'config'],
  },
  {
    id: 'timestamp',
    slug: 'timestamp-to-date',
    title: 'Timestamp to Date Converter',
    seoTitle: 'Timestamp (ms or s) to Human-Readable Date Converter | Dev Tools',
    description: 'Turn Unix timestamps into readable dates in seconds or milliseconds.',
    longDescription:
      'Paste a Unix timestamp in seconds or milliseconds to see a human-friendly date with ISO and local timezone details. Perfect for log debugging or API payloads.',
    badge: 'Converter',
    accent: 'Time',
    keywords: ['timestamp', 'unix time', 'milliseconds', 'seconds', 'date converter', 'epoch'],
  },
  {
    id: 'jwt',
    slug: 'jwt-decoder',
    title: 'JWT Decoder',
    seoTitle: 'Decode JWT Header & Payload Safely | Dev Tools',
    description: 'Inspect JWT headers and payloads without validating signatures.',
    longDescription:
      'Paste a JSON Web Token to view the decoded header and payload instantly. Great for debugging auth flows or validating claims locally.',
    badge: 'Decoder',
    accent: 'Security',
    keywords: ['jwt', 'json web token', 'decode jwt', 'auth debugging', 'token'],
  },
  {
    id: 'uuid',
    slug: 'uuid-generator',
    title: 'UUID Generator',
    seoTitle: 'Generate RFC 4122 UUIDs Online | Dev Tools',
    description: 'Create random UUIDs for testing, database keys, or identifiers.',
    longDescription:
      'Generate random UUIDs (v4) in the browser. Copy fresh identifiers for migrations, API clients, or test fixtures in one click.',
    badge: 'Generator',
    accent: 'Identity',
    keywords: ['uuid', 'generator', 'random uuid', 'identifier', 'guid'],
  },
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
