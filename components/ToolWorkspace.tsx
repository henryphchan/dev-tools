'use client';

import { ComponentType } from 'react';
import { ToolInfo } from '../lib/tools';
import { Breadcrumb } from './Breadcrumb';
import { BitwiseWorkspace } from './workspaces/BitwiseWorkspace';
import { CsvProfilerWorkspace } from './workspaces/CsvProfilerWorkspace';
import { LegacyToolWorkspace } from './workspaces/LegacyToolWorkspace';
import { JsonToonWorkspace } from './workspaces/JsonToonWorkspace';
import { LoremIpsumWorkspace } from './workspaces/LoremIpsumWorkspace';
import { PasswordGeneratorWorkspace } from './workspaces/PasswordGeneratorWorkspace';
import { SvgPlaceholderWorkspace } from './workspaces/SvgPlaceholderWorkspace';
import { SlugifyWorkspace } from './workspaces/SlugifyWorkspace';
import { UuidWorkspace } from './workspaces/UuidWorkspace';
import { MarkdownPreviewWorkspace } from './workspaces/MarkdownPreviewWorkspace';
import { KeycodeVisualizerWorkspace } from './workspaces/KeycodeVisualizerWorkspace';
import { ParquetViewerWorkspace } from './workspaces/ParquetViewerWorkspace';

import { ColorPaletteWorkspace } from './workspaces/ColorPaletteWorkspace';

// Map tool IDs to dedicated workspace components. Tools not listed here fall back to the
// legacy monolithic workspace so we can migrate incrementally without breaking routes.
const workspaceRegistry: Partial<Record<ToolInfo['id'], ComponentType<{ tool: ToolInfo }>>> = {
  bitwise: BitwiseWorkspace,
  'csv-profiler': CsvProfilerWorkspace,
  'json-toon': JsonToonWorkspace,
  'lorem-ipsum': LoremIpsumWorkspace,
  'password-generator': PasswordGeneratorWorkspace,
  'svg-placeholder-generator': SvgPlaceholderWorkspace,
  slugify: SlugifyWorkspace,
  uuid: UuidWorkspace,
  'tailwind-palette-generator': ColorPaletteWorkspace,
  'markdown-preview': MarkdownPreviewWorkspace,
  'keycode-visualizer': KeycodeVisualizerWorkspace,
  'parquet-viewer': ParquetViewerWorkspace,
};

export function ToolWorkspace({ tool }: { tool: ToolInfo }) {
  const Workspace = workspaceRegistry[tool.id] ?? LegacyToolWorkspace;

  return (
    <main className="w-full mx-auto px-4 py-6 space-y-6">
      <Breadcrumb tool={tool} />
      <Workspace tool={tool} />
    </main>
  );
}
