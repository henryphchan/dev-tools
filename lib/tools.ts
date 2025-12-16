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
  technicalDescription?: string;
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
    technicalDescription:
      'This tool uses the Myers Diff Algorithm (via the `diff` library) to compute the shortest edit script (SES) between two sequences. It operates in O(ND) time, offering a balanced approach for standard text files. The results are transformed into a unified view where chunks are tokenized and highlighted. Large files are processed in chunks to prevent blocking the main thread, though very large datasets (>5MB) may still impact UI responsiveness depending on browser allocations.',
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
    technicalDescription:
      'Conversion is handled by splitting input strings based on common delimiters (spaces, underscores, hyphens) and camelCase boundaries using regex lookaheads. The tokenized segments are then reassembled according to the target implementation rules: camelCase (lower first, upper subsequent), PascalCase (upper all), and others. This ensures consistent handling of mixed-input formats like "user_ID" or "APIResponse".',
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
    technicalDescription:
      'Slugification involves normalizing Unicode characters (NFD form) to separate diacritics, which are then stripped to ASCII approximations. Non-alphanumeric characters are replaced with the chosen delimiter, and multiple delimiters are collapsed into one. This process ensures RFC 3986 compliance for URLs while maintaining readability. The implementation relies on strict regex filtering to prevent unsafe characters from appearing in the output.',
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
    technicalDescription:
      'The validator parses cron expressions (standard 5-field and non-standard 6-field with seconds) using a custom parser compatible with Vixie Cron and Quartz. Next occurrences are calculated by iterating forward from the current server time, accounting for month lengths and leap years. Human-readable descriptions are generated using `cronstrue`, mapping numerical ranges to natural language specifics like "At minute 5 past hour 4".',
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
    technicalDescription:
      'Permissions are modeled as a 12-bit integer. The lower 9 bits represent standard rwx groups (User, Group, Other), while the upper 3 bits handle special flags (SetUID, SetGID, Sticky). The tool provides a bidirectional mapping between the bitmask state, the octal representation (using standard base-8 conversion), and the symbolic string notation `drwxrwxrwx`. Computations are purely bitwise to ensure accuracy.',
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
    technicalDescription:
      'The profiler relies on `PapaParse` for high-performance CSV streaming. It processes the file in chunks (streaming mode) to handle datasets larger than available memory. For each column, it aggregates statistics in a single pass: Min/Max/Ave for numbers, string lengths, and cardinality estimates using a Set for small count approximations. Type inference uses regex heuristics to detect Dates, Booleans, and Floats.',
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
    technicalDescription:
      'This tool uses `apache-arrow` (referenced as `parquet-wasm` or pure JS implementation depending on build) to read Parquet footers and row groups. It extracts the Thrift metadata to display schema types and compression codecs without reading the entire file body. Statistical profiling utilizes the page-level statistics embedded in the Parquet file metadata (min, max, null count) to provide instant insights without a full table scan.',
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
    technicalDescription:
      'CSV parsing is handled by `PapaParse`, a robust RFC 4180 compliant parser. It detects delimiters (comma, tab, pipe) naturally during the first pass. JSON conversion transforms logic maps rows to objects (using header row keys) or arrays. The reverse process (JSON to CSV) flattens nested objects where possible or stringifies them, ensuring that the tabular structure is preserved for Excel compatibility.',
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
    technicalDescription:
      'The conversion engine relies on `js-yaml` to safely parse and dump YAML. It supports standard YAML types including anchors and aliases, though purely cyclic structures are detected and handled to prevent stack overflows. JSON output uses native `JSON.stringify`, while YAML generation offers configurable indentation and scalar styles (folded vs literal blocks) to optimize readability for configuration files.',
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
    technicalDescription:
      'TOON (Tree Object Outline Notation) is a custom whitespace-sensitive format designed to minimize token usage for LLMs. The converter traverses the JSON AST, replacing braces and quotes with indentation and labeled nodes. Arrays are compressed into concise lists. This reduction often yields 20-30% token savings for deep trees compared to standard JSON, making it ideal for large context windows.',
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
    technicalDescription:
      'Timestamps are processed using `date-fns` for consistent locale formatting. The tool applies heuristic detection to determine if an input is in seconds or milliseconds based on magnitude (e.g., values near 10^12 are treated as ms). Timezone offsets are calculated against the browser\'s local implementation (`Intl.DateTimeFormat`) to show accurate local versus UTC times without server-side skew.',
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
    technicalDescription:
      'Duration calculations are performed using `date-fns` `intervalToDuration` and `differenceIn[Unit]` functions. This accounts for variable month lengths and leap years accurately, avoiding simpler epoch-subtraction errors. The tool breaks down the total duration into component parts (years, months, days, etc.) and also provides total counts (e.g., "Total Days") for versatile use cases.',
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
    technicalDescription:
      'JWT decoding is performed client-side by Base64Url-decoding the three components (header, payload, signature). The JSON segments are parsed and prettified. NOTE: Verification (signature checking) is simulated or requires the user to provide a public key/secret; the tool creates the signature string locally using `crypto-js` (HMAC or RSA) to verify if the input signature matches the computed one, proving message integrity.',
  },
  {
    id: 'uuid',
    slug: 'uuid-generator',
    title: 'UUID Generator',
    seoTitle: 'UUID Generator - Create Random v4 GUIDs | Dev Tools',
    description: 'Generate random UUIDs (v4) for database keys and unique identifiers.',
    longDescription:
      'Generate cryptographically strong UUIDs (v4) instantly in your browser. Bulk generate identifiers for database migrations, API keys, or test seed data with a single click.',
    badge: 'Generators',
    accent: 'Identity',
    keywords: ['uuid', 'generator', 'random uuid', 'identifier', 'guid'],
    technicalDescription:
      'UUIDs are generated using the `crypto.randomUUID()` API (available in modern browsers) which relies on the underlying OS CSPRNG (Cryptographically Secure Pseudo-Random Number Generator). This ensures v4 UUIDs meet high-entropy requirements suitable for production database keys, unlike `Math.random()`-based implementations which are not collision-resistant.',
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
    technicalDescription:
      'The generator uses a deterministic algorithm seeded with a standard dictionary of Latin roots. It assembles sentences by randomizing usage frequency distributions to mimic natural language sentence lengths (gaussian distribution) and paragraph structures. This prevents the "repetitive pattern" look of simpler generators while maintaining the classic visual texture of standard Lorem Ipsum.',
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
    technicalDescription:
      'Password strength is evaluated using zxcvbn-inspired logic, specifically checking for common patterns and calculating entropy bits. The actual generation involves a Crypto Random (CSPRNG) byte stream mapped to the selected character sets. Entropy estimates help visualize complexity, where >60 bits generally resists online attacks and >128 bits resists offline brute force attacks using current hardware.',
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
    technicalDescription:
      'The SVG is constructed as a React component string and then serialized. Unlike raster image generators that require server-side Canvas processing, this tool builds a vector DOM representation. It instantly converts the SVG string to a Base64 Data URI (`data:image/svg+xml;base64,...`) allowing developers to embed it directly as a `src` attribute without any HTTP requests.',
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
    technicalDescription:
      'QR generation utilizes `qrcode.react`, which implements the ISO/IEC 18004 standard. It handles Reed-Solomon error correction (Levels L, M, Q, H), allowing the code to remain scannable even if partially obscured. The output is drawn to an HTML5 Canvas element for download or rendered as an SVG for vector scalability. For WiFi, it constructs the standard `WIFI:T:WPA;S:MyNet;P:Pass;;` string format.',
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
    technicalDescription:
      'The word cloud engine is based on `d3-cloud`, implementing a force-directed layout algorithm. Words are sized proportional to their Term Frequency (TF). The layout uses a spiral placement strategy, attempting to place the largest words in the center and working outward, checking for bounding box collisions at each step to ensure no overlap. Stopwords are filtered using a predefined list of common English articles and prepositions.',
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
    technicalDescription:
      'This tool interfaces directly with the browser\'s native JavaScript `RegExp` engine. Highlight generation is done by iterating through `exec()` matches and building a React fragment tree that wraps matched indices in styled `span` tags. Group capturing uses the result array from the match object. Since it runs in the client browser, it perfectly mimics the regex behavior of the user\'s deployed JS environment.',
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
    technicalDescription:
      'Hashing is performed using the `crypto-js` library for legacy algorithms (MD5, SHA-1) and `js-sha3` for modern variants (SHA-3, Keccak). For file inputs, the File API reads content in chunks (using `FileReader`) to feed a progressive hasher, ensuring that large files (>1GB) can be hashed without crashing the browser tab by keeping memory usage low.',
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
    technicalDescription:
      'JSON parsing uses the native `JSON.parse` with a try-catch block to capture specific syntax errors (like trailing commas or unquoted keys). Formatting relies on `JSON.stringify(obj, null, indentation)`. For the editor experience, we use `CodeMirror` (or similar text area logic) to provide line numbers and basic syntax highlighting, making it easier to spot nesting errors in large payloads.',
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
    technicalDescription:
      'XML is parsed using a DOMParser to build a node tree, which allows validation of tag nesting and closure. Formatting is achieved by serializing the DOM tree with explicit indentation logic (recursively traversing nodes) rather than simple regex replacement, which ensures that CDATA sections and mixed content attributes are preserved correctly.',
  },
  {
    id: 'sql',
    slug: 'sql-formatter',
    title: 'SQL Formatter',
    seoTitle: 'SQL Formatter - Prettify Queries for MySQL, Postgres | Dev Tools',
    description: 'Format and prettify SQL queries into clean, readable code for various dialects.',
    longDescription:
      'Reformat SQL for faster reviews and fewer mistakes. Ideal for formatting ad-hoc queries, code review snippets, or saved scripts across major databases.',
    badge: 'Data & Analysis',
    accent: 'Database',
    keywords: ['sql formatter', 'query beautifier', 'postgres sql format', 'mysql', 'database tools'],
    technicalDescription:
      'SQL formatting utilizes the `sql-formatter` library, whichTokenizes the input string and applies dialect-specific rules (PostgreSQL, MySQL, Standard SQL) for indentation, capitalization, and newlines. The token stream handles complex nested queries, CTEs, and stored procedure syntax, ensuring that the semantic structure of the query drives the visual layout.',
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
    technicalDescription:
      'Encoding relies on the standard `encodeURIComponent` (URL) and `btoa`/`atob` (Base64) web APIs. For Base64, we handle Unicode limits by UTF-8 encoding the string before conversion, preventing "The string to be encoded contains characters outside of the Latin1 range" errors. This ensures proper handling of emojis and multi-byte characters.',
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
    technicalDescription:
      'Timezone calculations use `date-fns-tz` to handle IANA timezone identifiers accurately. When a source time is selected, it is normalized to UTC. Then, this UTC timestamp is projected into target timezones, accounting for Daylight Saving Time (DST) shifts specific to each region\'s historical and future rules (via the bundled timezone database).',
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
    technicalDescription:
      'Bitwise operations are performed using JavaScript\'s native 32-bit signed integer operators (`&`, `|`, `^`, `<<`, `>>`). Since JS numbers are IEEE 754 doubles, operands are implicitly coerced to 32-bit integers during these operations. We format the output as standard decimal and binary strings (using `radix` 2), showing the raw bit pattern for debugging flags and masks.',
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
    technicalDescription:
      'Conversion is handled client-side using the HTML5 `<canvas>` API. Images are drawn to an off-screen canvas and then exported using `canvas.toBlob(callback, "image/webp", quality)`. This leverages the browser\'s internal graphics engine for high-performance encoding. No image data is ever uploaded to a server, ensuring privacy and speed for large assets.',
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
    technicalDescription:
      'EXIF parsing and editing relies on `piexifjs`. The tool reads the binary JPEG markers (APP1 segment) to extract the Exif, GPS, and Interop IFDs. When updating metadata (e.g., stripping GPS), the tool reconstructs the binary exif block and splices it back into the original JPEG stream, creating a bit-identical copy of the image data with new metadata headers.',
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
    technicalDescription:
      'Palette generation starts with the base color converted to HSL space. We use a custom lightness curve to generate shades: 50 is near-white (95%+ lightness), 500 is the base color (or close approximation), and 950 is near-black. Saturation is slightly adjusted at the extremes to prevent "muddy" dark colors or "washed out" light colors, mimicking the hand-tuned look of the official Tailwind CSS default palette.',
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
    technicalDescription:
      'Markdown rendering uses `react-markdown` backed by `remark-gfm` to support GitHub Flavored Markdown (tables, task lists, strikethrough). The syntax highlighter is `prismjs` or `react-syntax-highlighter`, applied during the AST transformation phase. The preview pane is a sanitized output container that mirrors the styles of the editor for a WYSIWYG-like experience.',
  },
  {
    id: 'keycode-visualizer',
    slug: 'keycode-visualizer',
    title: 'Keycode Visualizer',
    seoTitle: 'JavaScript Keycode Visualizer - Event Codes & Modifiers | Dev Tools',
    description: 'Visualize JavaScript keyboard events, codes, and modifiers in real-time.',
    longDescription:
      'Press any key to instantly visualize JavaScript event codes, including `event.key`, `event.code`, and `event.which`. View modifier keys in real-time. Essential for developers building keyboard navigation, games, or accessibility features.',
    badge: 'Web & Frontend',
    accent: 'Keyboard',
    keywords: ['keycode', 'event', 'visualizer', 'keyboard', 'navigation', 'accessibility'],
    technicalDescription:
      'This tool attaches a global event listener (`window.addEventListener("keydown")`) to capture `KeyboardEvent` objects. It prevents default browser actions (like `Ctrl+P` printing) for supported keys to allow testing without interruptions. The visualizer extracts properties like `key`, `code` (physical key position), `which` (legacy code), and modifier flags (`ctrlKey`, `metaKey`, `shiftKey`, `altKey`) to display the complete event state.',
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
    technicalDescription:
      'The viewer utilizes `parquet-wasm` (Rust bindings for Apache Parquet) to decode Parquet files directly in the browser. It reads the file footer to determine the schema and row count. Data is fetched in chunks (row groups) to populate a virtualized table (e.g., `tanstack-table` or similar), ensuring that even multi-gigabyte files can be browsed smoothly without loading the entire dataset into JS heap memory.',
  },
  {
    id: 'fake-data-generator',
    slug: 'fake-data-generator',
    title: 'Fake Data Generator',
    seoTitle: 'Fake Data Generator - Mock JSON, CSV & SQL for Testing | Dev Tools',
    description: 'Generate realistic mock data for testing and export as JSON, CSV, or SQL.',
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
    technicalDescription:
      'Data generation is powered by `@faker-js/faker`, which provides localized data providers for names, addresses, and commerce items. The tool builds an array of objects based on the user-defined schema. Exporting involves transforming this in-memory array: `JSON.stringify` for JSON, a custom string builder for CSV (handling escaping), and a SQL INSERT statement generator that maps JS types to SQL types (e.g., Dates to ISO strings, text to quoted strings).',
  },
];

export function findToolBySlug(slug: string): ToolInfo | undefined {
  return tools.find((tool) => tool.slug === slug);
}

export function findToolById(id: ToolId): ToolInfo | undefined {
  return tools.find((tool) => tool.id === id);
}
