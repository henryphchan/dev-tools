import type { ToolId, ToolInfo } from './types';

interface WebpackContext {
  keys(): string[];
  <T = unknown>(id: string): T;
}

function loadToolDefinitions(): ToolInfo[] {
  // Webpack's require.context lets us include every definition file automatically.
  // This keeps new tools isolated to their own files and avoids central merge conflicts.
  const context = (require as unknown as {
    context(directory: string, useSubdirectories: boolean, regExp: RegExp): WebpackContext;
  }).context('./definitions', false, /\.ts$/);

  const loadedTools = context
    .keys()
    .map((key) => (context(key) as { default: ToolInfo }).default)
    .sort((a, b) => a.title.localeCompare(b.title));

  return loadedTools;
}

export const tools: ToolInfo[] = loadToolDefinitions();

export function findToolBySlug(slug: string): ToolInfo | undefined {
  return tools.find((tool) => tool.slug === slug);
}

export function findToolById(id: ToolId): ToolInfo | undefined {
  return tools.find((tool) => tool.id === id);
}

export type { ToolInfo, ToolId };
