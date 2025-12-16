export type ToolId =
  | 'json'
  | 'markdown-preview'
  | 'xml'
  | 'sql'
  | 'encode'
  | 'timezone'
  | 'bitwise'
  | 'cron'
  | 'diff'
  | 'csv-profiler'
  | 'parquet-profiler'
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
  | 'tailwind-palette-generator'
  | 'keycode-visualizer'
  | 'parquet-viewer'
  | 'fake-data-generator';

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
    title: 'Text Diff Viewer',
    seoTitle: 'Text Diff Viewer - Compare Two Files Online | Dev Tools',
    description: 'Compare two text files or strings side-by-side with line numbers and highlighting.',
    longDescription:
      'Identify differences between two texts quickly. Paste or upload files to see a side-by-side comparison with syntax highlighting, line numbers, and distinct colors for additions and removals.',
    badge: 'Data & Analysis',
    accent: 'Diffing',
    keywords: ['diff', 'compare files', 'text difference', 'file diff', 'highlight changes'],
  },
  {
    id: 'string-case',
    slug: 'string-case-converter',
    title: 'String Case Converter',
    seoTitle: 'String Case Converter - Camel, Snake, Kebab & Pascal Case | Dev Tools',
    description: 'Convert text between camelCase, snake_case, kebab-case, PascalCase, and more.',
    longDescription:
      'Paste any text and see it converted across popular casing styles like camelCase, PascalCase, kebab-case, snake_case, and SCREAMING_SNAKE. Great for renaming variables or aligning API fields.',
    badge: 'Converters',
    accent: 'Casing',
    keywords: ['case converter', 'camelCase', 'snake_case', 'PascalCase', 'kebab-case', 'naming'],
  },
  {
    id: 'slugify',
    slug: 'slugify-string',
    title: 'URL Slug Generator',
    seoTitle: 'URL Slug Generator - Create SEO Friendly Clean Links | Dev Tools',
    description: 'Generate clean, SEO-friendly URL slugs from any string with custom delimiters.',
    longDescription:
      'Paste any text to generate a URL-ready slug. Strip punctuation, collapse spaces, and pick your delimiter while keeping output lowercase for consistent links.',
    badge: 'Web & Frontend',
    accent: 'URLs',
    keywords: ['slugify', 'url slug', 'kebab-case', 'seo', 'permalink'],
  },
  {
    id: 'cron',
    slug: 'cron-expression-validator',
    title: 'Crontab Generator & Validator',
    seoTitle: 'Crontab Generator & Validator - Schedule Cron Expressions | Dev Tools',
    description: 'Validate and generate cron schedule expressions with next-run previews.',
    longDescription:
      'Check cron expressions quickly with a visual timeline, upcoming execution preview, and warnings for overly aggressive cadences. Great for CI jobs, maintenance windows, or scheduled alerts.',
    badge: 'DevOps',
    accent: 'Automation',
    keywords: ['cron', 'scheduler', 'cron validator', 'crontab', 'scheduled jobs', 'devops'],
  },
  {
    id: 'chmod',
    slug: 'chmod-calculator',
    title: 'Chmod Permission Calculator',
    seoTitle: 'Linux Chmod Calculator - Octal & Symbolic Permissions | Dev Tools',
    description: 'Calculate file permissions in octal (755) and symbolic (rwxr-xr-x) formats.',
    longDescription:
      'Interactively flip read, write, and execute bits for owners, groups, and others. See octal, 4-digit (special bits), and symbolic chmod strings update instantly for server hardening or script generation.',
    badge: 'DevOps',
    accent: 'Permissions',
    keywords: ['chmod', 'file permissions', 'octal permissions', 'rwx', 'unix permissions'],
  },
  {
    id: 'csv-profiler',
    slug: 'csv-data-profiler',
    title: 'CSV Data Profiler',
    seoTitle: 'CSV Data Profiler - Analyze Statistics, Types & Patterns | Dev Tools',
    description: 'Analyze CSV files for column statistics, null types, and data patterns.',
    longDescription:
      'Validate CSV structure quickly by pasting or uploading a file. Review unique counts, nulls, dominant data patterns, and sample values per column, then export the profiling summary as CSV.',
    badge: 'Data & Analysis',
    accent: 'Data Quality',
    keywords: ['csv profiling', 'data quality', 'unique count', 'null count', 'pattern analysis', 'data profiler'],
  },
  {
    id: 'parquet-profiler',
    slug: 'parquet-data-profiler',
    title: 'Parquet File Profiler',
    seoTitle: 'Parquet File Profiler - View Schema & Statistics Online | Dev Tools',
    description: 'Inspect Apache Parquet files for schema details, row counts, and column statistics.',
    longDescription:
      'Validate Parquet structure by uploading a file. Review schema, row count, unique counts, nulls, and sample values per column. Runs entirely in your browser.',
    badge: 'Data & Analysis',
    accent: 'Data Quality',
    keywords: ['parquet', 'profiling', 'data quality', 'big data', 'schema', 'arrow'],
  },
  {
    id: 'csv-json',
    slug: 'csv-json-converter',
    title: 'CSV to JSON Converter',
    seoTitle: 'CSV to JSON Converter - Transform Data Arrays & Objects | Dev Tools',
    description: 'Convert CSV data into JSON arrays or objects with automatic header detection.',
    longDescription:
      'Quickly translate CSV rows into JSON arrays or convert JSON back into shareable CSV. Great for API payload prep, data munging, or debugging exports.',
    badge: 'Converters',
    accent: 'Data',
    keywords: ['csv', 'json', 'converter', 'csv to json', 'json to csv', 'data tools'],
  },
  {
    id: 'yaml-json',
    slug: 'yaml-json-converter',
    title: 'YAML to JSON Converter',
    seoTitle: 'YAML to JSON Converter - Validate & Transform Configs | Dev Tools',
    description: 'Convert YAML configuration files to JSON and vice-versa for easy validation.',
    longDescription:
      'Convert between YAML and JSON for config files, CI pipelines, or Kubernetes manifests. Validate structure quickly before committing changes.',
    badge: 'Converters',
    accent: 'Config',
    keywords: ['yaml', 'json', 'converter', 'yaml to json', 'json to yaml', 'kubernetes', 'config'],
  },
  {
    id: 'json-toon',
    slug: 'json-toon-converter',
    title: 'JSON to TOON Converter',
    seoTitle: 'JSON to TOON Outline Converter - Token Efficient Format | Dev Tools',
    description: 'Convert JSON to TOON outline notation to save tokens in LLM prompts.',
    longDescription:
      'Convert structured JSON into TOON, a token-efficient outline notation favored by LLM teams, and reverse it back without losing type safety.',
    badge: 'Converters',
    accent: 'LLM',
    keywords: ['json', 'toon', 'converter', 'llm', 'prompt format', 'outline notation'],
  },
  {
    id: 'timestamp',
    slug: 'timestamp-to-date',
    title: 'Unix Timestamp Converter',
    seoTitle: 'Unix Timestamp Converter - Epoch to Human Readable Date | Dev Tools',
    description: 'Convert Unix timestamps (seconds/millis) to human-readable dates and local times.',
    longDescription:
      'Paste a Unix timestamp in seconds or milliseconds to see a human-friendly date with ISO and local timezone details. Perfect for log debugging or API payloads.',
    badge: 'Converters',
    accent: 'Time',
    keywords: ['timestamp', 'unix time', 'milliseconds', 'seconds', 'date converter', 'epoch'],
  },
  {
    id: 'datetime-diff',
    slug: 'datetime-difference-calculator',
    title: 'Date & Time Difference',
    seoTitle: 'Date Time Difference Calculator - Calculate Duration | Dev Tools',
    description: 'Calculate the precise duration between two dates in years, months, days, and seconds.',
    longDescription:
      'Pick any two date-times to instantly see the difference across units. Defaults to the current moment so you can quickly measure gaps without manual setup.',
    badge: 'Converters',
    accent: 'Time math',
    keywords: ['datetime difference', 'time delta', 'duration calculator', 'date gap', 'time math'],
  },
  {
    id: 'jwt',
    slug: 'jwt-decoder',
    title: 'JWT Debugger',
    seoTitle: 'JWT Debugger & Decoder - Verify Signatures Online | Dev Tools',
    description: 'Decode, verify, and debug JSON Web Tokens without sending them to a server.',
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
    seoTitle: 'UUID Generator - Create Random v4 GUIDs | Dev Tools',
    description: 'Generate random UUIDs (v4) for database keys and unique identifiers.',
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
    seoTitle: 'Lorem Ipsum Generator - Placeholder Text for Designs | Dev Tools',
    description: 'Generate standard Lorem Ipsum placeholder text for design mockups.',
    longDescription:
      'Produce classic lorem ipsum filler tailored to your layout. Choose between sentences or paragraphs, control how long each item is, and export the text for mockups or documentation.',
    badge: 'Generators',
    accent: 'Content',
    keywords: ['lorem ipsum', 'placeholder text', 'dummy text', 'filler content', 'content generator'],
  },
  {
    id: 'password-generator',
    slug: 'password-generator',
    title: 'Password Generator',
    seoTitle: 'Secure Password Generator - Random Strong Passwords | Dev Tools',
    description: 'Create strong, random passwords with custom requirements like symbols and numbers.',
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
    seoTitle: 'SVG Placeholder Image Generator - Custom Dimensions | Dev Tools',
    description: 'Generate SVG placeholder images with custom dimensions, colors, and text.',
    longDescription:
      'Quickly craft shareable placeholder images for mocks or social previews. Set width, height, background/text colors, font size, and a custom label while copying inline SVG markup or Base64 data URIs instantly.',
    badge: 'Web & Frontend',
    accent: 'Images',
    keywords: ['svg placeholder', 'placeholder generator', 'base64 svg', 'placeholder image', 'mock image'],
  },
  {
    id: 'qr-generator',
    slug: 'qr-code-generator',
    title: 'QR Code Generator',
    seoTitle: 'QR Code Generator - Create Free QR Codes for URLs/WiFi | Dev Tools',
    description: 'Generate QR codes for URLs, text, email, or WiFi connection details.',
    longDescription:
      'Produce high-quality QR codes without leaving your browser. Generate standard QR images for text or links, or create WiFi QR codes that let devices join your network instantly.',
    badge: 'Generators',
    accent: 'Sharing',
    keywords: ['qr code', 'wifi qr', 'qr generator', 'share links', 'network onboarding'],
  },
  {
    id: 'word-cloud',
    slug: 'word-cloud-generator',
    title: 'Word Cloud Visualizer',
    seoTitle: 'Word Cloud Generator - Visualize Text Frequency | Dev Tools',
    description: 'Visualize the most frequent words in your text with a customizable cloud.',
    longDescription:
      'Paste any text to see the most frequent words rendered as an eye-catching cloud. Tweak colors, background, stopwords, and canvas size to match your presentation or report.',
    badge: 'Data & Analysis',
    accent: 'Content',
    keywords: ['word cloud', 'text visualization', 'frequency', 'stopwords', 'presentation'],
  },
  {
    id: 'regex-tester',
    slug: 'regex-tester',
    title: 'Regex Tester',
    seoTitle: 'Regular Expression Tester - Validate & Debug Regex | Dev Tools',
    description: 'Test and debug regular expressions against sample text with real-time matches.',
    longDescription:
      'Experiment with regular expressions quickly. Try patterns with flags, view matched substrings with positions, and debug capture groups for your text processing tasks.',
    badge: 'Web & Frontend',
    accent: 'Regex',
    keywords: ['regex tester', 'regular expression', 'pattern matching', 'regex flags', 'regex groups'],
  },
  {
    id: 'digest',
    slug: 'message-digester',
    title: 'Hash Generator',
    seoTitle: 'Hash Generator - Calculate MD5, SHA-256, SHA-512 | Dev Tools',
    description: 'Calculate cryptographic hashes for text or files using MD5, SHA-256, and more.',
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
    seoTitle: 'JSON Formatter & Validator - Minify & Beautify | Dev Tools',
    description: 'Format, validate, and minify JSON data with error highlighting.',
    longDescription:
      'Format, validate, and share JSON snippets in seconds. Use it to prepare clean API payloads, tidy configuration files, or debug malformed responses without leaving your browser.',
    badge: 'Data & Analysis',
    accent: 'Structured data',
    keywords: ['json', 'formatter', 'validator', 'api payload', 'prettify JSON'],
  },
  {
    id: 'xml',
    slug: 'xml-formatter',
    title: 'XML Formatter',
    seoTitle: 'XML Formatter - Beautify & Minify Online | Dev Tools',
    description: 'Format and prettify XML strings with proper indentation.',
    longDescription:
      'Make XML easy to scan with reliable indentation. Great for SOAP payloads, sitemap debugging, configuration files, or any XML you need to share with teammates.',
    badge: 'Data & Analysis',
    accent: 'Markup',
    keywords: ['xml', 'formatter', 'beautifier', 'indent XML', 'xml editor'],
  },
  {
    id: 'sql',
    slug: 'sql-formatter',
    title: 'SQL Formatter',
    seoTitle: 'SQL Formatter - Prettify Queries for MySQL, Postgres | Dev Tools',
    description: 'Format chaotic SQL queries into clean, readable code for various dialects.',
    longDescription:
      'Reformat SQL for faster reviews and fewer mistakes. Ideal for formatting ad-hoc queries, code review snippets, or saved scripts across major databases.',
    badge: 'Data & Analysis',
    accent: 'Database',
    keywords: ['sql formatter', 'query beautifier', 'postgres sql format', 'mysql', 'database tools'],
  },
  {
    id: 'encode',
    slug: 'url-base64-encoder-decoder',
    title: 'URL & Base64 Converter',
    seoTitle: 'URL & Base64 Encoder/Decoder - Online String Converter | Dev Tools',
    description: 'Encode or decode text to URL-safe strings or Base64 format.',
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
    seoTitle: 'Timezone Converter - Meeting Planner & UTC Offset | Dev Tools',
    description: 'Convert between different timezones and plan international meetings.',
    longDescription:
      'Plan meetings and releases with confidence. Convert between popular time zones, see readable offsets, and copy the converted values for invites or documentation.',
    badge: 'DevOps',
    accent: 'Schedule',
    keywords: ['timezone converter', 'utc offset', 'meeting planner', 'time zones', 'scheduler'],
  },
  {
    id: 'bitwise',
    slug: 'bitwise-calculator',
    title: 'Bitwise Calculator',
    seoTitle: 'Bitwise Calculator - AND, OR, XOR, Binary Shifts | Dev Tools',
    description: 'Perform low-level bitwise operations and convert between binary and decimal.',
    longDescription:
      'Test bitwise logic quickly. Inspect how integers respond to AND, OR, XOR, NOT, and shift operators with decimal and binary outputs for debugging low-level code.',
    badge: 'Data & Analysis',
    accent: 'Binary',
    keywords: ['bitwise calculator', 'binary', 'and or xor', 'bit shifts', 'debugging'],
  },
  {
    id: 'webp-converter',
    slug: 'webp-converter',
    title: 'WebP Image Converter',
    seoTitle: 'WebP Image Converter - Compress & Convert to WebP | Dev Tools',
    description: 'Convert images to the modern WebP format for better web performance.',
    longDescription:
      'Upload single or multiple images, pick a WebP quality, and download optimized files together. Track before/after file sizes to see how much space you save.',
    badge: 'Converters',
    accent: 'Images',
    keywords: ['webp', 'image converter', 'webp converter', 'optimize images', 'webp quality', 'batch conversion'],
  },
  {
    id: 'photo-exif',
    slug: 'photo-exif-editor',
    title: 'EXIF Data Viewer',
    seoTitle: 'Photo EXIF Viewer & Editor - View Metadata | Dev Tools',
    description: 'View and edit EXIF metadata, including GPS location and camera settings.',
    longDescription:
      'Review every EXIF field in your photo, adjust capture times with timezone offsets, and retag GPS coordinates before saving a fresh copy—all in your browser.',
    badge: 'Data & Analysis',
    accent: 'Imaging',
    keywords: ['exif', 'photo metadata', 'gps tags', 'timezone', 'image editing'],
  },
  {
    id: 'tailwind-palette-generator',
    slug: 'tailwind-palette-generator',
    title: 'Tailwind Palette Generator',
    seoTitle: 'Tailwind CSS Color Generator - Shades & Tints | Dev Tools',
    description: 'Generate a complete Tailwind CSS color palette from a single hex code.',
    longDescription:
      'Enter a base hex color to generate a complete Tailwind CSS palette including shades 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, and 950. Copy the entire object for your tailwind.config.js or individual hex codes.',
    badge: 'Web & Frontend',
    accent: 'Colors',
    keywords: ['tailwind', 'color palette', 'generator', 'design', 'css', 'hex'],
  },
  {
    id: 'markdown-preview',
    slug: 'markdown-live-preview',
    title: 'Markdown Live Preview',
    seoTitle: 'Markdown Editor & Preview - Live HTML conversion | Dev Tools',
    description: 'Write Markdown with a real-time side-by-side HTML preview.',
    longDescription:
      'Write Markdown on the left and see the rendered HTML on the right instantly. Perfect for drafting content, checking syntax, or previewing README files.',
    badge: 'Web & Frontend',
    accent: 'Writing',
    keywords: ['markdown', 'preview', 'editor', 'live preview', 'md', 'html preview'],
  },
  {
    id: 'keycode-visualizer',
    slug: 'keycode-visualizer',
    title: 'Keycode Visualizer',
    seoTitle: 'JavaScript Keycode Visualizer - Event Codes & Modifiers | Dev Tools',
    description: 'Visualize JavaScript keyboard events, codes, and modifiers in real-time.',
    longDescription:
      'The user presses any key, and a large display shows the JS event codes. Essential for developers building keyboard navigation, games, or accessibility features.',
    badge: 'Web & Frontend',
    accent: 'Keyboard',
    keywords: ['keycode', 'event', 'visualizer', 'keyboard', 'navigation', 'accessibility'],
  },
  {
    id: 'parquet-viewer',
    slug: 'parquet-viewer',
    title: 'Parquet Viewer',
    seoTitle: 'Parquet Viewer - Open & Inspect Parquet Files Online | Dev Tools',
    description: 'Open and inspect Apache Parquet files directly in the browser.',
    longDescription:
      'Drag and drop .parquet files to view them instantly. Inspect schema details, browse data in a grid, and analyze file metadata locally—no server upload required.',
    badge: 'Data & Analysis',
    accent: 'Data',
    keywords: ['parquet', 'viewer', 'apache parquet', 'data analysis', 'local viewer'],
  },
  {
    id: 'fake-data-generator',
    slug: 'fake-data-generator',
    title: 'Fake Data Generator',
    seoTitle: 'Fake Data Generator - Mock JSON, CSV & SQL for Testing | Dev Tools',
    description: 'Free online mock data generator. Create realistic random users, addresses, and financial data. Export to JSON, CSV, and SQL.',
    longDescription:
      'Generate massive datasets of realistic dummy data for testing and development. Build custom schemas with fields like names, emails, and credit cards. Export up to 5,000 rows instantly as JSON, CSV, or SQL INSERT statements to seed your database.',
    badge: 'Generators',
    accent: 'Mock Data',
    keywords: [
      'fake data',
      'mock data',
      'dummy data',
      'random user generator',
      'sql seeder',
      'json generator',
      'test data',
      'faker',
      'database seed',
    ],
  },
];

export function findToolBySlug(slug: string): ToolInfo | undefined {
  return tools.find((tool) => tool.slug === slug);
}

export function findToolById(id: ToolId): ToolInfo | undefined {
  return tools.find((tool) => tool.id === id);
}
