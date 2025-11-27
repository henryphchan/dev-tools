import { ToolInfo } from '../types';

const tool: ToolInfo = {
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
};

export default tool;
