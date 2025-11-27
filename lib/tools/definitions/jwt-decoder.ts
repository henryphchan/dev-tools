import { ToolInfo } from '../types';

const tool: ToolInfo = {
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
};

export default tool;
