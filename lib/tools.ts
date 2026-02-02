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
  | 'fake-data-generator'
  | 'ip-subnet-calculator'
  | 'image-base64';

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
      'Use this online **Text Diff Viewer** to **compare files** and identify every **text difference** instantly. Whether you are debugging code, checking versions, or merging content, our tool highlights exactly what has changed between your two inputs. It identifies added, removed, and modified lines with clear, distinct colors for easy analysis.\n\nSave valuable time during code reviews and document revisions by spotting discrepancies immediately. Instead of manually scanning for errors, you can rely on this automated **file diff** tool to catch even the smallest whitespace changes or typos. It is an essential utility for developers, writers, and data analysts who need to **highlight changes** accurately.\n\nSimply paste your original text into the \'Left\' panel and the modified text into the \'Right\' panel. Alternatively, upload two files from your computer. The comparison will run automatically in your browser. Use the summary view to jump between differences or toggle "Word Wrap" to view long lines comfortably.',
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
      'This **Case Converter** tool effortlessly transforms text into standard programming formats like **camelCase**, **snake_case**, **PascalCase**, and **kebab-case**. It is designed for developers who need to normalize variable names, database fields, or API keys across different coding standards and languages.\n\nEnsure consistency in your codebase and eliminate manual editing errors. By automatically converting phrases into strict programming conventions, you can maintain clean naming schemas for your variables and classes. This tool handles special characters and spaces intelligently, ensuring your **naming** conventions are always respected.\n\nTo use, just paste your text into the input field. The converter will instantly display the text in all supported formats simultaneously. Click on any of the result boxes to copy the converted string directly to your clipboard.',
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
      'Our **URL Slug Generator** turns any text string into a clean, readable, and **SEO**-friendly URL slug. It automatically removes special characters, transliterates accents, and replaces spaces with hyphens or underscores (kebab-case or snake-case), making it perfect for generating a **permalink** or blog post address.\n\nBoost your website\'s search engine ranking by using descriptive, keyword-rich URLs. A well-formatted **url slug** is easier for users to read and for Google to index. This tool ensures your links follow web standards (RFC 3986) without you needing to manually sanitize every title.\n\nType your article title or text into the input box. Select your preferred delimiter (usually a hyphen for URLs). The tool will instantly generate the sanitized slug string below. Click the copy button to paste it straight into your code or CMS.',
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
      'This **Cron Validator** helps developers create and verify **crontab** schedules with ease. It parses standard cron expressions to generate a human-readable description and calculates the next upcoming execution dates, ensuring your **scheduled jobs** run exactly when expected.\n\nEliminate the guesswork from **DevOps** scheduling and prevent critical job failures. Visualizing the timeline of your cron tasks helps you spot overlaps or overly frequent runs that could crash your server. It is an indispensable tool for managing backups, system maintenance on Linux, or serverless functions.\n\nEnter a cron expression (e.g., `*/5 * * * *`) into the input field to see its schedule. Alternatively, use the visual interface to point and click your desired minutes, hours, and days. The next run times will update in real-time.',
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
      'The **Chmod** Calculator provides a quick way to compute accurate **file permissions** for Linux and Unix systems. It converts between the standard **octal permissions** (like 755 or 644) and the symbolic **rwx** notation, identifying exactly who has read, write, or execute access.\n\nSecure your servers and scripts by ensuring precise access and control lists. Understanding **unix permissions** prevents security vulnerabilities caused by accidental overly-permissive files (like 777). This tool helps systems administrators and developers verify the correct `chmod` commands for their deployment scripts.\n\nCheck or uncheck the boxes for Owner, Group, and Public permissions. The calculator will instantly show the corresponding Octal code (e.g., 755) and Symbolic text (e.g., `drwxr-xr-x`). You can also type an Octal number directly to see what permissions it represents.',
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
      'The **CSV Data Profiler** scans your datasets to provide a comprehensive **data quality** report. It calculates a **unique count**, identifies null values, and detects formatting patterns for every column, essentially serving as an instant **data profiler** in your browser.\n\nUnderstand your data before importing it into a database or analytics tool. By spotting missing values (`null count`) and cardinality issues early, you avoid costly cleanup steps later. It helps data engineers and analysts perform rapid exploratory data analysis (EDA) without writing code.\n\nDrag and drop your CSV file onto the page or paste raw CSV text. The tool applies **pattern analysis** to generate a column-by-column breakdown, showing the data type (string, number, boolean), min/max values, and non-null percentages.',
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
      'This **Parquet** Profiler allows you to inspect the metadata and statistics of **big data** files without downloading specialized desktop software. It reads the file header to visualize the **schema**, column types, compression codecs, and row counts directly in the browser.\n\nEnsure your data lake files are valid and conform to the expected schema. This tool is vital for data engineers working with **Arrow** or Spark ecosystems who need to check **data quality** and file integrity rapidly. It provides transparency into binary formats that are otherwise unreadable.\n\nUpload a `.parquet` file to the drop zone. The application parses the footer metadata and displays a structural overview, including nested fields and statistical summaries for each column group.',
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
      'Our **CSV to JSON** Converter transforms flat tabular data into structured JavaScript Objects. It is a robust **converter** that handles complex quoting and delimiters, allowing you to seamlessly swap formats between **CSV** and **JSON** for web APIs or configuration.\n\nModernize your legacy data workflows by converting spreadsheets into web-native JSON. This allows frontend applications and NoSQL databases to consume your data easily. It handles both **json to csv** and vice-versa, making it the ultimate **data tool** for interoperability.\n\nPaste your CSV content on the left or upload a file. Toggle "Header Row" if your first line contains field names. The tool will parse the data and output a clean JSON array on the right, ready for copy-pasting.',
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
      'The **YAML to JSON** Converter is essential for DevOps professionals managing **Kubernetes** manifests or CI/CD pipelines. It translates human-readable **YAML** into strict **JSON** format, and supports **json to yaml** conversion for generating configuration files.\n\nValidate your **config** files instantly. YAML is prone to indentation errors; converting it to JSON reveals structure flaws immediately. This tool bridges the gap between configuration management (YAML) and data interchange (JSON), streamlining your deployment workflows.\n\nInput your YAML code into the editor. The tool automatically detects the schema and produces the equivalent JSON. You can modify the object in either view and see the changes reflected in the other format instantly.',
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
      'This **converter** transforms standard **JSON** into **TOON** (Tree Object Outline Notation), a specialized **outline notation** optimized for Large Language Models (**LLM**). It strips away redundant syntax like braces and quotes to create a highly compact **prompt format**.\n\nReduce your API costs and stay within context window limits. By compressing generic data structures into minimal token counts, you can feed more context to models like GPT-4 or Claude without sacrificing structural integrity. It is the perfect pre-processing step for prompt engineering.\n\nPaste your JSON object to generate the TOON representation. Copy the output for your LLM prompt. The tool also supports reverse conversion, allowing you to turn LLM-generated outline text back into valid JSON.',
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
      'The Unix **Timestamp** Converter translates the raw **epoch** time into a human-readable **date**. It supports both **seconds** and **milliseconds** formats, handling the conversion between machine time (integer) and standard ISO 8601 date strings.\n\nDebug time-sensitive issues efficiently. Logs and databases often store time as a plain integer **unix time**, which is unreadable to humans. This **date converter** allows developers to quickly verify exactly when an event occurred in their local timezone or UTC.\n\nPaste a numeric timestamp to see the formatted date relative to your browser\'s local time. Conversely, you can use the date picker to select a specific time and get the corresponding Unix epoch value.',
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
      'The **Datetime Difference** Calculator computes the exact **time delta** or **duration** between two specific dates. It provides a granular breakdown of the **date gap**, showing the total years, months, days, hours, and minutes between the start and end points.\n\nPerform accurate **time math** for project planning, billing cycles, or uptime analysis. Calculating time intervals manually is prone to errors due to leap years and varying month lengths; this tool handles all calendar logic for you.\n\nSelect a Start Date and an End Date. The calculator instantly updates to show the full duration string (e.g., "2 years, 3 months, 4 days") as well as the total count of individual units (e.g., "Total Days: 825").',
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
      'This **JWT** Decoder serves as a comprehensive debugger for your **JSON Web Token** implementation. It allows you to **decode jwt** strings to view the header, payload, and signature claims, facilitating rigorous **auth debugging** for your web applications.\n\nInspect your **token** contents securely. Verify that your authentication service is issuing the correct user roles, expiration times, and issuers. Since the decoding happens entirely in your browser, your sensitive tokens never leave your local machine, ensuring privacy.\n\nPaste your Base64Url encoded JWT string into the text area. The tool will parse the three components color-coded for clarity. You can also view the raw JSON payload to check specific claim values.',
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
      'The **UUID** Generator creates cryptographically secure Version 4 (random) identifiers. Whether you call it a **GUID** or a **UUID**, this tool produces valid, RFC 4122 compliant strings suitable for database keys and session handling.\n\nEnsure data integrity with a collision-resistant **identifier**. Using a secure **random uuid** **generator** prevents the risks associated with predictable sequences or timestamp-based IDs in distributed systems. It is the standard for uniquely identifying objects in modern software architecture.\n\nClick the "Generate" button to create a single UUID. For bulk needs, switch to Batch mode to generate up to 1000 IDs at once. You can copy the list directly to your clipboard for use in SQL scripts or testing data.',
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
      'Our **Lorem Ipsum** Generator creates authentic-looking **placeholder text** for your UI designs and wireframes. Generate paragraphs, sentences, or lists of **dummy text** that mimic regular sentence structure without carrying any meaning.\n\nSpeed up your design process with professional **filler content**. Using a **content generator** prevents stakeholders from getting distracted by readable copy during visual reviews. It allows the focus to remain on layout, typography, and spacing.\n\nChoose your desired unit (paragraphs, words, or sentences) and quantity. The generator produces clean text that you can copy instantly. It uses a rich dictionary of Latin roots to ensure variety and avoid repetitive patterns.',
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
      'This **Password Generator** creates high-**entropy** credentials to secure your accounts. It builds a **strong password** by combining uppercase letters, numbers, and symbols, ensuring resilience against dictionary and **brute force** attacks.\n\nProtect your digital identity with a robust **password strength** strategy. Reusing simple passwords allows attackers to compromise multiple accounts easily. Generating a unique, complex password for every service is the most effective defense against credential stuffing.\n\nCustomize the length and character sets (A-Z, 0-9, Symbols). As you adjust settings, the tool provides real-time feedback on the crack time and security score. Copy the secure string to your password manager immediately.',
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
      'The **SVG Placeholder** Generator is a handy tool for frontend developers needing a quick **mock image**. It creates lightweight, scalable vector images with custom dimensions and colors, outputting the result as a **base64 svg** or raw code.\n\nStreamline your prototyping workflow. Instead of searching for stock photos or creating dummy files in design software, use this **placeholder generator** to create a properly sized **placeholder image** in seconds. It allows you to test responsive layouts with precise aspect ratios.\n\nSet the Width and Height, then pick background and text colors. You can add a custom label to identifying area. Copy the `img src` data URI to embed it directly in your HTML or download the .svg file.',
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
      'This **QR Generator** creates high-quality 2D barcodes for URLs, text messages, and **WiFi QR** connection strings. It is a versatile tool to **share links** and data instantly with mobile users, enabling seamless **network onboarding** and information exchange.\n\nBridge the physical and digital worlds. A **QR code** is the standard for contactless interaction, perfect for restaurant menus, business cards, or event ticketing. Ensuring your codes are scannable and high-contrast is critical for user experience.\n\nSelect the data type: URL, Text, or WiFi. Enter the relevant information, such as the SSID and password for networks. The QR code updates instantly. You can save it as a PNG or SVG for print-quality resolution.',
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
      'The **Word Cloud** Visualizer turns raw text into a compelling graphic where word size represents **frequency**. It is an effective method for **text visualization**, allowing you to spot dominant themes and keywords in a meaningful visual layout.\n\nAnalyze content at a glance. Whether checking SEO density or summarizing a speech, a word cloud reveals the "weight" of vocabulary instantly. This tool filters out common **stopwords** (like "the" or "and") to focus purely on the significant terms in your **presentation**.\n\nPaste your article or dataset into the text area. The cloud will render automatically. You can customize the color theme and font scale to match your style. Hover over words to see their exact occurrence count.',
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
      'This **Regex Tester** provides a real-time environment to validate and debug your **regular expression** patterns. It highlights **pattern matching** results instantly, helping you visualize how your regex interacts with sample text and capture groups.\n\nWrite robust code by testing your expressions before deployment. Regex is powerful but brittle; ensuring you handle edge cases and **regex flags** correctly prevents runtime errors in production. This tool breaks down complex queries into understandable matches.\n\nEnter your regex pattern (e.g., `^\\d{5}$` for zips) and input a test string. The matching substrings are highlighted. You can inspect specific **regex groups** and modify flags (like Global or Case Insensitive) to refine your logic.',
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
      'The **Hash** Generator computes a unique cryptographic **checksum** for any text or file input. It supports standard algorithms like **MD5**, **SHA256**, and **BLAKE2**, enabling you to verify data integrity and generate digital fingerprints securely in the browser.\n\nEnsure that files have not been tampered with or corrupted. By comparing the calculated hash against a known value, you can guarantee the authenticity of downloads or backups. It also serves as a utility for generating non-reversible keys for data indexing.\n\nType your message or upload a file. Select your desired algorithm (e.g., SHA-512). The tool will compute the hexadecimal digest string instantly. For large files, it processes data in chunks to remain responsive.',
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
      'The **JSON** Formatter is an all-in-one **validator** and beautifier for JavaScript Object Notation. It helps you **prettify JSON** responses from APIs, making them readable, or minify them for compact storage and transmission.\n\nDebug your **API payload** structures faster. Raw JSON is often single-lined and hard to read; this tool formats it with proper indentation and nesting. It also catches syntax errors, such as missing quotes or trailing commas, which are common sources of application failures.\n\nPaste your raw JSON string into the editor. The tool automatically formats it. If there is an error, it highlights the specific line number. You can toggle between "Pretty" and "Minified" views to suit your needs.',
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
      'This **XML** Formatter organizes standard Extensible Markup Language into a clean, hierarchical tree. It acts as an intelligent **xml editor** and **beautifier**, adding correct indentation to make complex XML documents easy for humans to scan and understand.\n\nSimplify the debugging of SOAP messages, sitemaps, and config files. Unformatted XML is dense and difficult to parse visually. This tool ensures that tags are properly nested and closed, helping you validate the structure of your data interchange format.\n\nInput your XML string. The tool will parse and **indent XML** nodes automatically. You can copy the formatted output or minify it back to a single string for production usage.',
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
      'The **SQL Formatter** standardizes your database queries into clean, professional code. It serves as a universal **query beautifier**, supporting multiple dialects like **MySQL**, **Postgres SQL format**, and Standard SQL to apply the correct syntax highlighting and indentation rules.\n\nEnhance the maintainability of your database scripts. Complex queries with nested JOINs and subqueries can become unreadable over time. This **database tool** reorganizes them into a structured format, making code reviews and debugging significantly clearer.\n\nPaste your SQL statement into the box. Select your target language (e.g., PostgreSQL). The tool will align keywords and clauses. You can copy the result directly into your DB management tool.',
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
      'This dual-purpose **Converter** handles **URL encode** and **Base64** operations in one interface. It allows you to sanitize strings for safe transport via HTTP or encode binary data into text formats, covering the most common encoding tasks for web development.\n\nFix broken links and data transmission errors. **URL decode** logic restores readable text from percent-encoded strings, while Base64 is essential for embedding images or handling **JWT** segments. This tool ensures your data remains intact across different systems.\n\nChoose your mode: Encoder or Decoder. Paste your text. The output updates instantly. It properly handles UTF-8 characters to prevent encoding glitches with emojis or non-Latin scripts.',
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
      'The **Timezone Converter** is a visual **meeting planner** designed for remote teams. It allows you to cross-reference multiple **time zones** simultaneously and calculate the **UTC offset**, making it easy to schedule across borders.\n\nCoordinate global collaboration without the headache of mental math. Finding a slot that works for London, New York, and Tokyo is complex; this **scheduler** visualizes the overlap so you can pick a reasonable hour for everyone.\n\nAdd cities or zones to your list. Drag the time slider to see how the hour shifts for every location. The tool highlights business hours to help you avoid scheduling meetings in the middle of the night.',
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
      'This **Bitwise Calculator** performs low-level logic operations on integers. It visualizes **binary** math including **AND, OR, XOR**, and **bit shifts**, helping developers understand how data is manipulated at the machine level.\n\nMaster the fundamentals of computer science and **debugging**. Whether you are working on embedded systems, permission masks, or network protocols, visualizing the binary representation of your data is crucial for accuracy. It bridges the gap between decimal values and bit patterns.\n\nEnter your operands in decimal or hex. Select the operator (e.g., `&` or `|`). The tool displays the result along with the full 32-bit binary breakdown of inputs and outputs.',
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
      'The **WebP Converter** transforms standard images (JPG, PNG) into the highly efficient **WebP** format. This **image converter** allows you to **optimize images** for the web, significantly reducing file sizes while maintaining visual fidelity.\n\nImprove your Core Web Vitals and page load speeds. WebP files are often 30% smaller than their JPEG counterparts. Using this tool for **batch conversion** helps you modernize your asset library quickly without needing server-side processing.\n\nUpload one or many images. Adjust the **WebP quality** slider to find the balance between size and sharpness. Download the converted files individually or as a group.',
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
      'The **EXIF** Data Viewer allows you inspect and modify the hidden **photo metadata** inside JPEG images. It reveals camera details, ISO settings, timestamps, and **GPS tags**, giving you full control over the information embedded in your files.\n\nProtect your privacy before sharing images online. Photos often contain precise location data; this tool lets you review and strip sensitive **image editing** history or location markers. It is also useful for correcting **timezone** errors in travel photography.\n\nUpload your photo to view the full EXIF table. You can edit specific fields or use the "Remove All Metadata" feature. Save the cleaned image back to your device without re-compressing the visual data.',
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
      'The **Tailwind** Palette **Generator** creates a complete, consistent **color palette** from a single input color. It calculates the full range of shades (50-950) necessary to extend your **tailwind** **css** configuration file with custom branding.\n\nAccelerate your UI **design** workflow. Manually picking accessible and harmonious shades is time-consuming; this tool automates the process using professional spacing logic. It ensures your custom colors blend perfectly with the utility-first framework.\n\nEnter your brand\'s primary **hex** code. The generator outputs the JSON object for your config file. You can also click to copy individual shade values for quick prototyping.',
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
      'This **Markdown** **Editor** provides a robust environment for writing and testing **md** syntax. It features a **live preview** panel that renders your content into HTML in real-time, side-by-side with your source text.\n\nPerfect your documentation, blog posts, and READMEs. The tool supports standard formatting as well as GitHub Flavored Markdown (tables, checklists). Seeing the **html preview** instantly helps you catch syntax errors and formatting issues before you commit your code.\n\nType in the left editor pane. The preview updates on every keystroke. You can copy the raw Markdown or the compiled HTML code directly to your clipboard.',
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
      'The **Keycode** **Visualizer** is an interactive debugging tool for web inputs. It listens for **keyboard** activity and displays the precise **event** properties, including `key`, `code`, `which`, and modifier states like Shift or Ctrl.\n\nDebug complex shortcuts and game controls with ease. Understanding how different browsers and operating systems handle **navigation** keys is vital for building accessible web apps. This tool reveals exactly what the browser sees when you press a key.\n\nSimply press any key on your keyboard. The visualizer lights up to show the active code and any modifiers relative to standard **accessibility** mappings.',
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
      'Our **Parquet Viewer** allows you to open and explore **Apache Parquet** files directly in your web browser. It renders the columnar data into a readable grid, acting as a lightweight **local viewer** for heavy data files.\n\nPerform spot checks and **data analysis** on your output files instantly. Loading parquet data often requires complex setups like Jupyter or Pandas; this tool removes that friction, enabling quick verification of data integrity and values on the fly.\n\nDrag and drop your Parquet file. The viewer loads the data using WebAssembly for speed. You can scroll through rows and columns to verify the contents without uploading your private data to any server.',
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
      'The **Fake Data** Generator is a versatile tool for creating massive datasets of **mock data**. It acts as a **random user generator**, populating custom fields like names, emails, and addresses to create realistic **test data** for your applications.\n\nSeed your development databases efficiently. Writing a **sql seeder** or **json generator** script manually is tedious; this tool automates the process, allowing you to stress-test your UI or backend with thousands of rows of **dummy data** in seconds.\n\nDefine your schema by adding fields (e.g., First Name, City). Choose how many rows you need. Click download to get the result as a JSON file, CSV, or SQL Insert script using the powerful **faker** library.',
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
  {
    id: 'ip-subnet-calculator',
    slug: 'ip-subnet-calculator',
    title: 'IP Subnet Calculator',
    seoTitle: 'IP Subnet Calculator - CIDR, Netmask & Broadcast Address | Dev Tools',
    description: 'Calculate network details like netmask, broadcast address, and usable IP range from a CIDR block.',
    longDescription:
      'The **IP Subnet Calculator** is an essential utility for network engineers and DevOps professionals. It takes an IP address and CIDR suffix (e.g., `192.168.1.0/24`) and breaks down the network configuration into actionable details.\n\nPlan your network architecture with precision. Quickly determine the **subnet mask**, **broadcast address**, and the range of **usable IP addresses** for any given network block. This tool supports both **IPv4** and **IPv6** addressing schemes.\n\nSimply enter your IP and partial mask (CIDR). The calculator instantly displays the Network Address, First and Last usable host IPs, and the total number of hosts available in that subnet.',
    badge: 'DevOps',
    accent: 'Network',
    keywords: ['subnet calculator', 'cidr', 'netmask', 'broadcast address', 'ipv4', 'ipv6', 'network calculator'],
    technicalDescription:
      'This tool uses the `ip-address` library to parse and manipulate IP addresses. It performs bitwise operations to mask the host bits for the network address and invert them for the broadcast address. For IPv4, it calculates the range of usable hosts by adding 1 to the network address (First IP) and subtracting 1 from the broadcast address (Last IP). Support for IPv6 includes canonical expansion and abbreviation logic.',
  },
  {
    id: 'image-base64',
    slug: 'image-to-base64-converter',
    title: 'Image to Base64 Converter',
    seoTitle: 'Image to Base64 Converter - Encode Images to Data URI | Dev Tools',
    description: 'Convert images (PNG, JPG, GIF) to Base64 encoded strings for embedding in HTML or CSS.',
    longDescription:
      'The **Image to Base64 Converter** transforms your image files into **Base64** strings (Data URIs). This allows you to embed images directly into your HTML, CSS, or JSON code, eliminating the need for external HTTP requests.\n\nOptimize your critical path performance. Embedding small assets like logos, icons, or background patterns as data URIs can reduce round-trip times (RTT) for your website. This tool provides ready-to-paste snippets for **HTML Image** tags and **CSS Background** properties.\n\nDrag and drop your image file. The tool instantly generates the Base64 string. You can preview the image and copy the code snippet that fits your use case.',
    badge: 'Converters',
    accent: 'Images',
    keywords: ['image to base64', 'base64 converter', 'data uri', 'embed image', 'css background'],
    technicalDescription:
      'Conversions are performed entirely in the browser using the `FileReader` API (`readAsDataURL`). The file is read into memory as a Base64-encoded string. No data is uploaded to any server. The tool approximates the output size (Base64 is roughly 33% larger than the binary original) to help you decide if embedding is the right performance strategy.',
  },
];

export function findToolBySlug(slug: string): ToolInfo | undefined {
  return tools.find((tool) => tool.slug === slug);
}

export function findToolById(id: ToolId): ToolInfo | undefined {
  return tools.find((tool) => tool.id === id);
}
