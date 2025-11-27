import { ToolInfo } from '../types';

const tool: ToolInfo = {
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
};

export default tool;
