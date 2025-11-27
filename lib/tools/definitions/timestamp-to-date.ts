import { ToolInfo } from '../types';

const tool: ToolInfo = {
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
};

export default tool;
