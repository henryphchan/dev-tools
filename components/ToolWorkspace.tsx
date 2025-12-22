'use client';

import { ComponentType } from 'react';
import { ToolInfo } from '../lib/tools';
import { AdUnit } from './AdUnit';
import { Breadcrumb } from './Breadcrumb';
import { BitwiseWorkspace } from './workspaces/BitwiseWorkspace';
import { CsvProfilerWorkspace } from './workspaces/CsvProfilerWorkspace';
import { JsonToonWorkspace } from './workspaces/JsonToonWorkspace';
import { LoremIpsumWorkspace } from './workspaces/LoremIpsumWorkspace';
import { PasswordGeneratorWorkspace } from './workspaces/PasswordGeneratorWorkspace';
import { SvgPlaceholderWorkspace } from './workspaces/SvgPlaceholderWorkspace';
import { SlugifyWorkspace } from './workspaces/SlugifyWorkspace';
import { UuidWorkspace } from './workspaces/UuidWorkspace';
import { MarkdownPreviewWorkspace } from './workspaces/MarkdownPreviewWorkspace';
import { KeycodeVisualizerWorkspace } from './workspaces/KeycodeVisualizerWorkspace';
import { ParquetViewerWorkspace } from './workspaces/ParquetViewerWorkspace';
import { FakeDataGeneratorWorkspace } from './workspaces/FakeDataGeneratorWorkspace';

import { ParquetProfilerWorkspace } from './workspaces/ParquetProfilerWorkspace';
import { ColorPaletteWorkspace } from './workspaces/ColorPaletteWorkspace';
import { WebpConverterWorkspace } from './workspaces/WebpConverterWorkspace';
import { ExifEditorWorkspace } from './workspaces/ExifEditorWorkspace';
import { QrCodeGeneratorWorkspace } from './workspaces/QrCodeGeneratorWorkspace';
import { WordCloudWorkspace } from './workspaces/WordCloudWorkspace';
import { HashGeneratorWorkspace } from './workspaces/HashGeneratorWorkspace';
import { CsvJsonConverterWorkspace } from './workspaces/CsvJsonConverterWorkspace';
import { YamlJsonConverterWorkspace } from './workspaces/YamlJsonConverterWorkspace';
import { StringCaseConverterWorkspace } from './workspaces/StringCaseConverterWorkspace';
import { ChmodCalculatorWorkspace } from './workspaces/ChmodCalculatorWorkspace';
import { TimestampConverterWorkspace } from './workspaces/TimestampConverterWorkspace';
import { DatetimeDifferenceWorkspace } from './workspaces/DatetimeDifferenceWorkspace';
import { JwtDecoderWorkspace } from './workspaces/JwtDecoderWorkspace';
import { TextDiffViewerWorkspace } from './workspaces/TextDiffViewerWorkspace';
import { JsonFormatterWorkspace } from './workspaces/JsonFormatterWorkspace';
import { XmlFormatterWorkspace } from './workspaces/XmlFormatterWorkspace';
import { SqlFormatterWorkspace } from './workspaces/SqlFormatterWorkspace';
import { RegexTesterWorkspace } from './workspaces/RegexTesterWorkspace';
import { UrlEncoderWorkspace } from './workspaces/UrlEncoderWorkspace';
import { TimezoneConverterWorkspace } from './workspaces/TimezoneConverterWorkspace';
import { CronValidatorWorkspace } from './workspaces/CronValidatorWorkspace';

// Map tool IDs to dedicated workspace components. Tools not listed here fall back to the
// legacy monolithic workspace so we can migrate incrementally without breaking routes.
const workspaceRegistry: Partial<Record<ToolInfo['id'], ComponentType<{ tool: ToolInfo }>>> = {
  bitwise: BitwiseWorkspace,
  'csv-profiler': CsvProfilerWorkspace,
  'parquet-profiler': ParquetProfilerWorkspace,
  'json-toon': JsonToonWorkspace,
  'lorem-ipsum': LoremIpsumWorkspace,
  'password-generator': PasswordGeneratorWorkspace,
  'svg-placeholder-generator': SvgPlaceholderWorkspace,
  slugify: SlugifyWorkspace,
  uuid: UuidWorkspace,
  'tailwind-palette-generator': ColorPaletteWorkspace,
  'markdown-preview': MarkdownPreviewWorkspace,
  'keycode-visualizer': KeycodeVisualizerWorkspace,
  'photo-exif': ExifEditorWorkspace,
  'qr-generator': QrCodeGeneratorWorkspace,
  'word-cloud': WordCloudWorkspace,
  digest: HashGeneratorWorkspace,
  'csv-json': CsvJsonConverterWorkspace,
  'yaml-json': YamlJsonConverterWorkspace,
  'string-case': StringCaseConverterWorkspace,
  chmod: ChmodCalculatorWorkspace,
  timestamp: TimestampConverterWorkspace,
  'datetime-diff': DatetimeDifferenceWorkspace,
  jwt: JwtDecoderWorkspace,
  diff: TextDiffViewerWorkspace,
  json: JsonFormatterWorkspace,
  xml: XmlFormatterWorkspace,
  sql: SqlFormatterWorkspace,
  'regex-tester': RegexTesterWorkspace,
  encode: UrlEncoderWorkspace,
  timezone: TimezoneConverterWorkspace,
  cron: CronValidatorWorkspace,
  'parquet-viewer': ParquetViewerWorkspace,
  'fake-data-generator': FakeDataGeneratorWorkspace,

  'webp-converter': WebpConverterWorkspace,
};

export function ToolWorkspace({ tool }: { tool: ToolInfo }) {
  const Workspace = workspaceRegistry[tool.id];

  if (!Workspace) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center text-slate-400">
        <p className="text-lg font-semibold text-white">Workspace not found</p>
        <p>The tool &quot;{tool.title}&quot; (ID: {tool.id}) does not have a registered workspace.</p>
      </div>
    );
  }

  return (
    <main className="w-full mx-auto px-4 py-6 space-y-8">
      <Breadcrumb tool={tool} />
      <Workspace tool={tool} />

      <AdUnit />

      {/* SEO Content Injection */}
      <section className="mx-auto max-w-4xl pt-8 border-t border-white/5 space-y-8">
        <div>
          <h2 className="text-lg font-semibold text-slate-200 mb-3">About {tool.title}</h2>
          <p className="text-slate-400 leading-relaxed">{tool.longDescription}</p>
        </div>

        {tool.technicalDescription && (
          <div>
            <h3 className="text-lg font-semibold text-slate-200 mb-3">Under the Hood</h3>
            <p className="text-slate-400 leading-relaxed text-sm font-mono bg-black/20 p-4 rounded-lg border border-white/5">
              {tool.technicalDescription}
            </p>
          </div>
        )}
      </section>


    </main>
  );
}
