import { ToolInfo } from '../types';

const tool: ToolInfo = {
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
};

export default tool;
