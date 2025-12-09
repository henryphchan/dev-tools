export type ToolId =
  | 'json'
  | 'xml'
  | 'sql'
  | 'encode'
  | 'timezone'
  | 'bitwise'
  | 'cron'
  | 'diff'
  | 'csv-profiler'
  | 'csv-json'
  | 'yaml-json'
  | 'json-toon'
  | 'timestamp'
  | 'datetime-diff'
  | 'jwt'
  | 'uuid'
  | 'lorem-ipsum'
  | 'password-generator'
  | 'svg-placeholder-generator'
  | 'qr-generator'
  | 'word-cloud'
  | 'regex-tester'
  | 'digest'
  | 'string-case'
  | 'slugify'
  | 'chmod'
  | 'photo-exif'
  | 'webp-converter'
  | 'tailwind-palette-generator';

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
    badge: 'Text & Analysis',
    accent: 'Review',
    keywords: ['diff', 'compare files', 'text difference', 'file diff', 'highlight changes'],
  },
  {
    id: 'string-case',
    slug: 'string-case-converter',
    title: 'String Case Converter',
    seoTitle: 'Convert strings between camelCase, snake_case, and more | Dev Tools',
    description: 'Translate text between camelCase, PascalCase, kebab-case, and snake_case instantly.',
    longDescription:
      'Paste any text and see it converted across popular casing styles like camelCase, PascalCase, kebab-case, snake_case, and SCREAMING_SNAKE. Great for renaming variables or aligning API fields.',
    badge: 'Text & Analysis',
    accent: 'Casing',
    keywords: ['case converter', 'camelCase', 'snake_case', 'PascalCase', 'kebab-case', 'naming'],
  },
  {
    id: 'slugify',
    slug: 'slugify-string',
    title: 'Slugify String',
    seoTitle: 'Create URL-friendly slugs from text | Dev Tools',
    description: 'Turn titles or labels into clean slugs with custom delimiters.',
    longDescription:
      'Paste any text to generate a URL-ready slug. Strip punctuation, collapse spaces, and pick your delimiter while keeping output lowercase for consistent links.',
    badge: 'Text & Analysis',
    accent: 'URLs',
    keywords: ['slugify', 'url slug', 'kebab-case', 'seo', 'permalink'],
  },
  {
    id: 'cron',
    slug: 'cron-expression-validator',
    title: 'Cron Expression Validator',
    seoTitle: 'Cron Expression Validator with Timeline & Next Runs | Dev Tools',
    description: 'Validate cron syntax, preview the next 10 fire times, and spot risky schedules.',
    longDescription:
      'Check cron expressions quickly with a visual timeline, upcoming execution preview, and warnings for overly aggressive cadences. Great for CI jobs, maintenance windows, or scheduled alerts.',
    badge: 'Development',
    accent: 'Automation',
    keywords: ['cron', 'scheduler', 'cron validator', 'crontab', 'scheduled jobs', 'devops'],
  },
  {
    id: 'chmod',
    slug: 'chmod-calculator',
    title: 'Chmod Calculator',
    seoTitle: 'Calculate chmod permissions with octal and symbolic output | Dev Tools',
    description: 'Toggle owner/group/other permissions and copy the matching chmod notation.',
    longDescription:
      'Interactively flip read, write, and execute bits for owners, groups, and others. See octal, 4-digit (special bits), and symbolic chmod strings update instantly for server hardening or script generation.',
    badge: 'Security',
    accent: 'Permissions',
    keywords: ['chmod', 'file permissions', 'octal permissions', 'rwx', 'unix permissions'],
  },
  {
    id: 'csv-profiler',
    slug: 'csv-data-profiler',
    title: 'CSV Data Profiler',
    seoTitle: 'Profile CSV columns for patterns, uniques, and nulls | Dev Tools',
    description: 'Inspect CSV headers, nulls, unique values, and patterns with exportable results.',
    longDescription:
      'Validate CSV structure quickly by pasting or uploading a file. Review unique counts, nulls, dominant data patterns, and sample values per column, then export the profiling summary as CSV.',
    badge: 'Text & Analysis',
    accent: 'Data Quality',
    keywords: ['csv profiling', 'data quality', 'unique count', 'null count', 'pattern analysis', 'data profiler'],
  },
  {
    id: 'csv-json',
    slug: 'csv-json-converter',
    title: 'CSV ↔ JSON Converter',
    seoTitle: 'CSV to JSON & JSON to CSV Online Converter | Dev Tools',
    description: 'Convert CSV rows to JSON arrays and back with header-aware parsing.',
    longDescription:
      'Quickly translate CSV rows into JSON arrays or convert JSON back into shareable CSV. Great for API payload prep, data munging, or debugging exports.',
    badge: 'Converters',
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
    badge: 'Converters',
    accent: 'Config',
    keywords: ['yaml', 'json', 'converter', 'yaml to json', 'json to yaml', 'kubernetes', 'config'],
  },
  {
    id: 'json-toon',
    slug: 'json-toon-converter',
    title: 'JSON ↔ TOON Converter',
    seoTitle: 'JSON to TOON Converter & TOON back to JSON | Dev Tools',
    description: 'Round-trip JSON into TOON outline notation with a single click and keep prompts token-lean.',
    longDescription:
      'Convert structured JSON into TOON, a token-efficient outline notation favored by LLM teams, and reverse it back without losing type safety.',
    badge: 'Converters',
    accent: 'LLM',
    keywords: ['json', 'toon', 'converter', 'llm', 'prompt format', 'outline notation'],
  },
  {
    id: 'timestamp',
    slug: 'timestamp-to-date',
    title: 'Timestamp to Date Converter',
    seoTitle: 'Timestamp (ms or s) to Human-Readable Date Converter | Dev Tools',
    description: 'Turn Unix timestamps into readable dates in seconds or milliseconds.',
    longDescription:
      'Paste a Unix timestamp in seconds or milliseconds to see a human-friendly date with ISO and local timezone details. Perfect for log debugging or API payloads.',
    badge: 'Converters',
    accent: 'Time',
    keywords: ['timestamp', 'unix time', 'milliseconds', 'seconds', 'date converter', 'epoch'],
  },
  {
    id: 'datetime-diff',
    slug: 'datetime-difference-calculator',
    title: 'Datetime Difference Calculator',
    seoTitle: 'Calculate time between two datetimes in multiple units | Dev Tools',
    description: 'Compare two date-times and see the gap in seconds, minutes, hours, days, months, and years.',
    longDescription:
      'Pick any two date-times to instantly see the difference across units. Defaults to the current moment so you can quickly measure gaps without manual setup.',
    badge: 'Converters',
    accent: 'Time math',
    keywords: ['datetime difference', 'time delta', 'duration calculator', 'date gap', 'time math'],
  },
  {
    id: 'jwt',
    slug: 'jwt-decoder',
    title: 'JWT Decoder',
    seoTitle: 'Decode JWT Header & Payload Safely | Dev Tools',
    description: 'Inspect JWT headers and payloads without validating signatures.',
    longDescription:
      'Paste a JSON Web Token to view the decoded header and payload instantly. Great for debugging auth flows or validating claims locally.',
    badge: 'Security',
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
    badge: 'Generators',
    accent: 'Identity',
    keywords: ['uuid', 'generator', 'random uuid', 'identifier', 'guid'],
  },
  {
    id: 'lorem-ipsum',
    slug: 'lorem-ipsum-generator',
    title: 'Lorem Ipsum Generator',
    seoTitle: 'Generate Lorem Ipsum sentences or paragraphs | Dev Tools',
    description: 'Create placeholder sentences or paragraphs with adjustable lengths.',
    longDescription:
      'Produce classic lorem ipsum filler tailored to your layout. Choose between sentences or paragraphs, control how long each item is, and export the text for mockups or documentation.',
    badge: 'Generators',
    accent: 'Content',
    keywords: ['lorem ipsum', 'placeholder text', 'dummy text', 'filler content', 'content generator'],
  },
  {
    id: 'password-generator',
    slug: 'password-generator',
    title: 'Password Generator & Strength Checker',
    seoTitle: 'Generate strong passwords and estimate crack time | Dev Tools',
    description: 'Create random passwords with custom character sets and see entropy-based strength.',
    longDescription:
      'Build complex passwords with adjustable length, casing, numbers, and symbols. Gauge strength with entropy and estimated brute-force crack times—computed entirely in your browser.',
    badge: 'Security',
    accent: 'Passwords',
    keywords: ['password generator', 'strong password', 'entropy', 'brute force time', 'password strength'],
  },
  {
    id: 'svg-placeholder-generator',
    slug: 'svg-placeholder-generator',
    title: 'SVG Placeholder Generator',
    seoTitle: 'Generate SVG placeholders with custom text and colors | Dev Tools',
    description: 'Create on-the-fly SVG placeholders with custom text, colors, and dimensions.',
    longDescription:
      'Quickly craft shareable placeholder images for mocks or social previews. Set width, height, background/text colors, font size, and a custom label while copying inline SVG markup or Base64 data URIs instantly.',
    badge: 'Generators',
    accent: 'Images',
    keywords: ['svg placeholder', 'placeholder generator', 'base64 svg', 'placeholder image', 'mock image'],
  },
  {
    id: 'qr-generator',
    slug: 'qr-code-generator',
    title: 'QR Code Generator',
    seoTitle: 'Generate QR codes for text, links, or WiFi networks | Dev Tools',
    description: 'Create shareable QR codes for URLs, text, or WiFi credentials in seconds.',
    longDescription:
      'Produce high-quality QR codes without leaving your browser. Generate standard QR images for text or links, or create WiFi QR codes that let devices join your network instantly.',
    badge: 'Generators',
    accent: 'Sharing',
    keywords: ['qr code', 'wifi qr', 'qr generator', 'share links', 'network onboarding'],
  },
  {
    id: 'word-cloud',
    slug: 'word-cloud-generator',
    title: 'Word Cloud Generator',
    seoTitle: 'Create customizable word clouds from text | Dev Tools',
    description: 'Visualize text frequency with adjustable colors, stopwords, and dimensions.',
    longDescription:
      'Paste any text to see the most frequent words rendered as an eye-catching cloud. Tweak colors, background, stopwords, and canvas size to match your presentation or report.',
    badge: 'Text & Analysis',
    accent: 'Content',
    keywords: ['word cloud', 'text visualization', 'frequency', 'stopwords', 'presentation'],
  },
  {
    id: 'regex-tester',
    slug: 'regex-tester',
    title: 'Regex Tester',
    seoTitle: 'Test regex patterns with flags and matched results | Dev Tools',
    description: 'Validate regex patterns, flags, and see live matches against sample text.',
    longDescription:
      'Experiment with regular expressions quickly. Try patterns with flags, view matched substrings with positions, and debug capture groups for your text processing tasks.',
    badge: 'Development',
    accent: 'Regex',
    keywords: ['regex tester', 'regular expression', 'pattern matching', 'regex flags', 'regex groups'],
  },
  {
    id: 'digest',
    slug: 'message-digester',
    title: 'Message Digester',
    seoTitle: 'Hash text or files with MD5, SHA, or BLAKE2 | Dev Tools',
    description: 'Generate cryptographic hashes from text or uploaded files with multiple algorithms.',
    longDescription:
      'Compute MD5, SHA-1, SHA-256, SHA3-256, or BLAKE2b hashes directly in the browser. Paste text or upload a file to verify integrity, fingerprints, or cache keys.',
    badge: 'Security',
    accent: 'Integrity',
    keywords: ['hash', 'checksum', 'md5', 'sha256', 'blake2'],
  },
  {
    id: 'json',
    slug: 'json-formatter',
    title: 'JSON Formatter',
    seoTitle: 'Online JSON Formatter & Validator | Dev Tools',
    description: 'Instantly pretty-print and validate JSON for APIs, configs, or log payloads.',
    longDescription:
      'Format, validate, and share JSON snippets in seconds. Use it to prepare clean API payloads, tidy configuration files, or debug malformed responses without leaving your browser.',
    badge: 'Formatters',
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
    badge: 'Formatters',
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
    badge: 'Formatters',
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
    badge: 'Converters',
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
    badge: 'Converters',
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
    badge: 'Development',
    accent: 'Binary',
    keywords: ['bitwise calculator', 'binary', 'and or xor', 'bit shifts', 'debugging'],
  },
  {
    id: 'webp-converter',
    slug: 'webp-converter',
    title: 'WebP Converter',
    seoTitle: 'Convert images to WebP with adjustable quality | Dev Tools',
    description: 'Batch convert images to WebP, see total savings, and export everything in one click.',
    longDescription:
      'Upload single or multiple images, pick a WebP quality, and download optimized files together. Track before/after file sizes to see how much space you save.',
    badge: 'Converters',
    accent: 'Images',
    keywords: ['webp', 'image converter', 'webp converter', 'optimize images', 'webp quality', 'batch conversion'],
  },
  {
    id: 'photo-exif',
    slug: 'photo-exif-editor',
    title: 'Photo EXIF & Metadata Editor',
    seoTitle: 'Edit photo EXIF metadata including timezone and GPS | Dev Tools',
    description: 'Upload a photo to inspect and rewrite EXIF fields, timestamps, and GPS tags.',
    longDescription:
      'Review every EXIF field in your photo, adjust capture times with timezone offsets, and retag GPS coordinates before saving a fresh copy—all in your browser.',
    badge: 'Media',
    accent: 'Imaging',
    keywords: ['exif', 'photo metadata', 'gps tags', 'timezone', 'image editing'],
  },
  {
    id: 'tailwind-palette-generator',
    slug: 'tailwind-palette-generator',
    title: 'Tailwind Palette Generator',
    seoTitle: 'Generate Tailwind CSS Color Palette (50-950) | Dev Tools',
    description: 'Generate a Tailwind CSS color palette (50-950) from a single base color.',
    longDescription:
      'Enter a base hex color to generate a complete Tailwind CSS palette including shades 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, and 950. Copy the entire object for your tailwind.config.js or individual hex codes.',
    badge: 'Generators',
    accent: 'Colors',
    keywords: ['tailwind', 'color palette', 'generator', 'design', 'css', 'hex'],
  },
];

export function findToolBySlug(slug: string): ToolInfo | undefined {
  return tools.find((tool) => tool.slug === slug);
}

export function findToolById(id: ToolId): ToolInfo | undefined {
  return tools.find((tool) => tool.id === id);
}
