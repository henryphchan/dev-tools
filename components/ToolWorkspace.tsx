'use client';

import { ComponentType } from 'react';
import { ToolInfo } from '../lib/tools';
import { BitwiseWorkspace } from './workspaces/BitwiseWorkspace';
import { CsvProfilerWorkspace } from './workspaces/CsvProfilerWorkspace';
import { LegacyToolWorkspace } from './workspaces/LegacyToolWorkspace';
import { JsonToonWorkspace } from './workspaces/JsonToonWorkspace';
import { LoremIpsumWorkspace } from './workspaces/LoremIpsumWorkspace';
import { MetaPreviewWorkspace } from './workspaces/MetaPreviewWorkspace';
import { PasswordGeneratorWorkspace } from './workspaces/PasswordGeneratorWorkspace';
import { SvgPlaceholderWorkspace } from './workspaces/SvgPlaceholderWorkspace';
import { SlugifyWorkspace } from './workspaces/SlugifyWorkspace';
import { UuidWorkspace } from './workspaces/UuidWorkspace';

// Map tool IDs to dedicated workspace components. Tools not listed here fall back to the
// legacy monolithic workspace so we can migrate incrementally without breaking routes.
const workspaceRegistry: Partial<Record<ToolInfo['id'], ComponentType<{ tool: ToolInfo }>>> = {
  bitwise: BitwiseWorkspace,
  'csv-profiler': CsvProfilerWorkspace,
  'json-toon': JsonToonWorkspace,
  'lorem-ipsum': LoremIpsumWorkspace,
  'meta-preview': MetaPreviewWorkspace,
  'password-generator': PasswordGeneratorWorkspace,
  'svg-placeholder-generator': SvgPlaceholderWorkspace,
  slugify: SlugifyWorkspace,
  uuid: UuidWorkspace,
};

export function ToolWorkspace({ tool }: { tool: ToolInfo }) {
  const Workspace = workspaceRegistry[tool.id] ?? LegacyToolWorkspace;
  return <Workspace tool={tool} />;
}
