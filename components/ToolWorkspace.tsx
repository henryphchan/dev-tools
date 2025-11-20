'use client';

import Link from 'next/link';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { DateTime } from 'luxon';
import ToolCard from './ToolCard';
import xmlFormatter from 'xml-formatter';
import { format as formatSql } from 'sql-formatter';
import { ToolInfo } from '../lib/tools';
import { CronExpressionParser } from 'cron-parser';
import { diffLines } from 'diff';
import {
  ArrowPathRoundedSquareIcon,
  ClipboardDocumentCheckIcon,
  CursorArrowRaysIcon,
} from './icons';

const timeZones = [
  'UTC',
  'America/New_York',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Berlin',
  'Asia/Tokyo',
  'Asia/Kolkata',
  'Australia/Sydney',
];

function formatDateTimeValue(value: string) {
  const dt = DateTime.fromISO(value, { setZone: true });
  if (!dt.isValid) return '';
  return dt.toFormat('fff ZZZZ');
}

export function ToolWorkspace({ tool }: { tool: ToolInfo }) {
  const [jsonInput, setJsonInput] = useState('');
  const [jsonOutput, setJsonOutput] = useState('');
  const [jsonError, setJsonError] = useState('');

  const [xmlInput, setXmlInput] = useState('');
  const [xmlOutput, setXmlOutput] = useState('');
  const [xmlError, setXmlError] = useState('');

  const [sqlInput, setSqlInput] = useState('');
  const [sqlOutput, setSqlOutput] = useState('');
  const [sqlError, setSqlError] = useState('');

  const [encodeInput, setEncodeInput] = useState('');
  const [urlEncoded, setUrlEncoded] = useState('');
  const [base64Encoded, setBase64Encoded] = useState('');
  const [decodeInput, setDecodeInput] = useState('');
  const [decodeOutput, setDecodeOutput] = useState('');
  const [decodeError, setDecodeError] = useState('');
  const [encodeError, setEncodeError] = useState('');

  const [diffLeftText, setDiffLeftText] = useState('');
  const [diffRightText, setDiffRightText] = useState('');
  const [diffLeftLabel, setDiffLeftLabel] = useState('Left text');
  const [diffRightLabel, setDiffRightLabel] = useState('Right text');
  const [clipboardError, setClipboardError] = useState('');

  const initialDate = useMemo(
    () => DateTime.now().setZone('UTC').toISO({ suppressMilliseconds: true, suppressSeconds: true })?.slice(0, 16) ?? '',
    []
  );

  const [sourceTime, setSourceTime] = useState(initialDate);
  const [sourceZone, setSourceZone] = useState('UTC');
  const [targetZone, setTargetZone] = useState('America/New_York');
  const [convertedTime, setConvertedTime] = useState('');
  const [timeError, setTimeError] = useState('');

  const [bitwiseA, setBitwiseA] = useState('5');
  const [bitwiseB, setBitwiseB] = useState('3');
  const [bitwiseOp, setBitwiseOp] = useState('AND');
  const [bitwiseResult, setBitwiseResult] = useState('');
  const [bitwiseError, setBitwiseError] = useState('');

  const [cronExpression, setCronExpression] = useState('*/5 * * * *');
  const [cronZone, setCronZone] = useState('UTC');
  const [cronRuns, setCronRuns] = useState<DateTime[]>([]);
  const [cronError, setCronError] = useState('');
  const [cronWarnings, setCronWarnings] = useState<string[]>([]);

  const copyToClipboard = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
    } catch (error) {
      console.error('Clipboard copy failed', error);
    }
  };

  const handleJsonFormat = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonOutput(JSON.stringify(parsed, null, 2));
      setJsonError('');
    } catch (error) {
      setJsonError('Invalid JSON. Please check your syntax.');
      setJsonOutput('');
    }
  };

  const handleXmlFormat = () => {
    try {
      setXmlOutput(xmlFormatter(xmlInput, { collapseContent: true }));
      setXmlError('');
    } catch (error) {
      setXmlError('Invalid XML. Please verify your markup.');
      setXmlOutput('');
    }
  };

  const handleSqlFormat = () => {
    try {
      setSqlOutput(formatSql(sqlInput, { language: 'sql' }));
      setSqlError('');
    } catch (error) {
      setSqlError('Unable to format SQL. Check for incomplete statements.');
      setSqlOutput('');
    }
  };

  const handleEncode = () => {
    setUrlEncoded(encodeURIComponent(encodeInput));
    try {
      setBase64Encoded(btoa(encodeInput));
      setEncodeError('');
    } catch (error) {
      setBase64Encoded('');
      setEncodeError('Encoding failed. Ensure the input contains valid characters.');
    }
  };

  const handleDecode = () => {
    try {
      const decodedUrl = decodeURIComponent(decodeInput);
      const decodedBase64 = atob(decodeInput);
      setDecodeOutput(`URL decoded: ${decodedUrl}\nBase64 decoded: ${decodedBase64}`);
      setDecodeError('');
    } catch (error) {
      setDecodeError('Decoding failed. Ensure the string is valid URL or Base64.');
      setDecodeOutput('');
    }
  };

  type DiffLine = {
    type: 'added' | 'removed' | 'unchanged';
    leftNumber?: number;
    rightNumber?: number;
    text: string;
  };

  const handleFileUpload = (
    event: ChangeEvent<HTMLInputElement>,
    setText: (value: string) => void,
    setLabel: (value: string) => void
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLabel(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setText(typeof reader.result === 'string' ? reader.result : '');
    };
    reader.readAsText(file);
  };

  const pasteFromClipboard = async (setText: (value: string) => void) => {
    try {
      const text = await navigator.clipboard.readText();
      setText(text);
      setClipboardError('');
    } catch (error) {
      setClipboardError('Unable to read from clipboard. Please paste manually.');
    }
  };

  const diffSegments = useMemo(() => diffLines(diffLeftText, diffRightText), [diffLeftText, diffRightText]);

  const numberedDiff = useMemo<DiffLine[]>(() => {
    let leftLine = 1;
    let rightLine = 1;
    const rows: DiffLine[] = [];

    diffSegments.forEach((segment) => {
      const lines = segment.value.split('\n');
      if (lines[lines.length - 1] === '') {
        lines.pop();
      }

      lines.forEach((line) => {
        if (segment.added) {
          rows.push({ type: 'added', rightNumber: rightLine, text: line });
          rightLine += 1;
        } else if (segment.removed) {
          rows.push({ type: 'removed', leftNumber: leftLine, text: line });
          leftLine += 1;
        } else {
          rows.push({ type: 'unchanged', leftNumber: leftLine, rightNumber: rightLine, text: line });
          leftLine += 1;
          rightLine += 1;
        }
      });
    });

    return rows;
  }, [diffSegments]);

  const diffStats = useMemo(
    () =>
      numberedDiff.reduce(
        (acc, line) => {
          if (line.type === 'added') acc.added += 1;
          if (line.type === 'removed') acc.removed += 1;
          acc.total += 1;
          return acc;
        },
        { added: 0, removed: 0, total: 0 }
      ),
    [numberedDiff]
  );

  const handleTimeConversion = () => {
    const parsed = DateTime.fromISO(sourceTime, { zone: sourceZone });
    if (!parsed.isValid) {
      setTimeError('Invalid date/time. Please use the picker to choose a valid value.');
      setConvertedTime('');
      return;
    }

    const converted = parsed.setZone(targetZone);
    setConvertedTime(converted.toISO());
    setTimeError('');
  };

  const handleBitwise = () => {
    const a = Number(bitwiseA);
    const b = Number(bitwiseB);

    if (!Number.isInteger(a) || (!Number.isInteger(b) && bitwiseOp !== 'NOT')) {
      setBitwiseError('Only integer inputs are supported.');
      setBitwiseResult('');
      return;
    }

    let result: number;

    switch (bitwiseOp) {
      case 'AND':
        result = a & b;
        break;
      case 'OR':
        result = a | b;
        break;
      case 'XOR':
        result = a ^ b;
        break;
      case 'LSHIFT':
        result = a << b;
        break;
      case 'RSHIFT':
        result = a >> b;
        break;
      case 'NOT':
        result = ~a;
        break;
      default:
        result = 0;
    }

    setBitwiseError('');
    setBitwiseResult(`${result} (binary ${result.toString(2)})`);
  };

  const computeCronWarnings = (expression: string, runs: DateTime[]) => {
    const warnings = new Set<string>();

    const fields = expression
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    if (fields.length >= 1 && (fields[0] === '*' || fields[0] === '*/1')) {
      warnings.add('Minute field is unrestricted (every minute). Make sure the workload is light or rate-limited.');
    }

    if (runs.length >= 2) {
      const diffSeconds = runs[1].diff(runs[0], 'seconds').seconds;
      if (diffSeconds <= 60) {
        warnings.add('Runs every minute or faster — verify downstream systems can handle the volume.');
      } else if (diffSeconds <= 300) {
        warnings.add('Runs very frequently (under 5 minutes). Consider widening the interval for heavy tasks.');
      }
    }

    return Array.from(warnings);
  };

  const handleCronPreview = () => {
    try {
      const interval = CronExpressionParser.parse(cronExpression, {
        currentDate: DateTime.now().setZone(cronZone).toISO(),
        tz: cronZone,
      });

      const nextRuns: DateTime[] = [];
      for (let i = 0; i < 10; i += 1) {
        const next = interval.next().toDate();
        nextRuns.push(DateTime.fromJSDate(next).setZone(cronZone));
      }

      setCronRuns(nextRuns);
      setCronError('');
      setCronWarnings(computeCronWarnings(cronExpression, nextRuns));
    } catch (error) {
      setCronError('Invalid cron expression. Use 5-field syntax like “*/5 * * * *”.');
      setCronRuns([]);
      setCronWarnings([]);
    }
  };

  useEffect(() => {
    handleCronPreview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <nav className="flex items-center gap-2 text-sm text-slate-300" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-white">Home</Link>
        <span aria-hidden>/</span>
        <span className="text-white font-semibold">{tool.title}</span>
      </nav>

      <header className="section-card gradient-border space-y-4">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400 font-semibold">{tool.accent}</p>
            <h1 className="text-3xl font-bold text-white leading-tight">{tool.seoTitle}</h1>
            <p className="text-sm text-slate-300 max-w-3xl">{tool.longDescription}</p>
          </div>
          <span className="badge bg-brand/15 text-brand border-brand/30">{tool.badge}</span>
        </div>
        <div className="flex flex-wrap gap-2 text-xs text-slate-300">
          <span className="badge">SEO-friendly URL</span>
          <span className="badge">Shareable metadata</span>
          <span className="badge">Copy-ready outputs</span>
        </div>
      </header>

      {tool.id === 'diff' && (
        <ToolCard title="Compare 2 text files" description={tool.description} badge={tool.badge} accent={tool.accent}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-slate-300">{diffLeftLabel}</label>
              <textarea
                value={diffLeftText}
                onChange={(e) => setDiffLeftText(e.target.value)}
                placeholder="Paste or upload the first file..."
                className="w-full"
              />
              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-slate-200 transition hover:border-brand/50 hover:text-white">
                  <input
                    type="file"
                    accept=".txt,.log,.md,.json,.xml,.sql,.csv,.yml,.yaml"
                    className="sr-only"
                    onChange={(event) => handleFileUpload(event, setDiffLeftText, setDiffLeftLabel)}
                  />
                  Upload file
                </label>
                <button
                  onClick={() => pasteFromClipboard(setDiffLeftText)}
                  className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-slate-200 transition hover:bg-white/20"
                >
                  Paste clipboard
                </button>
                {diffLeftText && (
                  <button
                    onClick={() => copyToClipboard(diffLeftText)}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-slate-200 transition hover:border-brand/60 hover:text-white"
                  >
                    Copy text
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-slate-300">{diffRightLabel}</label>
              <textarea
                value={diffRightText}
                onChange={(e) => setDiffRightText(e.target.value)}
                placeholder="Paste or upload the second file..."
                className="w-full"
              />
              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-slate-200 transition hover:border-brand/50 hover:text-white">
                  <input
                    type="file"
                    accept=".txt,.log,.md,.json,.xml,.sql,.csv,.yml,.yaml"
                    className="sr-only"
                    onChange={(event) => handleFileUpload(event, setDiffRightText, setDiffRightLabel)}
                  />
                  Upload file
                </label>
                <button
                  onClick={() => pasteFromClipboard(setDiffRightText)}
                  className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-slate-200 transition hover:bg-white/20"
                >
                  Paste clipboard
                </button>
                {diffRightText && (
                  <button
                    onClick={() => copyToClipboard(diffRightText)}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-slate-200 transition hover:border-brand/60 hover:text-white"
                  >
                    Copy text
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-3 mt-4">
            <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-300">
              <div className="flex flex-wrap items-center gap-2">
                <span className="badge">Line numbers</span>
                <span className="badge bg-emerald-500/20 text-emerald-200 border-emerald-500/30">+ {diffStats.added}</span>
                <span className="badge bg-rose-500/20 text-rose-200 border-rose-500/30">- {diffStats.removed}</span>
              </div>
              <span className="text-xs text-slate-400">{diffStats.total || '0'} total lines compared</span>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-950/70 overflow-hidden">
              <div className="grid grid-cols-[70px_70px_1fr] border-b border-white/10 bg-slate-900/70 text-xs uppercase tracking-wide text-slate-300">
                <div className="px-3 py-2 text-right">Left</div>
                <div className="px-3 py-2 text-right">Right</div>
                <div className="px-3 py-2">Diff</div>
              </div>
              {numberedDiff.length === 0 && (
                <p className="px-4 py-6 text-sm text-slate-300">Paste or upload two files to see highlighted changes.</p>
              )}
              {numberedDiff.length > 0 && (
                <div className="max-h-[480px] overflow-auto">
                  {numberedDiff.map((line, index) => {
                    const bgClass =
                      line.type === 'added'
                        ? 'bg-emerald-950/60 text-emerald-100'
                        : line.type === 'removed'
                          ? 'bg-rose-950/60 text-rose-100'
                          : 'bg-slate-900/50 text-slate-100';

                    return (
                      <div
                        key={`${line.type}-${index}-${line.leftNumber ?? 'x'}-${line.rightNumber ?? 'x'}`}
                        className={`grid grid-cols-[70px_70px_1fr] border-b border-white/5 text-sm font-mono ${bgClass}`}
                      >
                        <div className="px-3 py-1 text-right text-xs text-slate-400">{line.leftNumber ?? ''}</div>
                        <div className="px-3 py-1 text-right text-xs text-slate-400">{line.rightNumber ?? ''}</div>
                        <div className="px-3 py-1 whitespace-pre-wrap">
                          <span className="mr-2 text-xs text-slate-400">
                            {line.type === 'added' ? '+' : line.type === 'removed' ? '-' : '·'}
                          </span>
                          {line.text || ' '}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          {clipboardError && <p className="text-sm text-rose-400">{clipboardError}</p>}
        </ToolCard>
      )}

      {tool.id === 'json' && (
        <ToolCard title="JSON Formatter" description={tool.description} badge={tool.badge} accent={tool.accent}>
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder='Paste JSON here...'
            className="w-full"
          />
          <div className="flex flex-wrap items-center gap-3">
            <button onClick={handleJsonFormat} className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white shadow-brand">
              <CursorArrowRaysIcon className="h-4 w-4" />
              Format JSON
            </button>
            {jsonOutput && (
              <button onClick={() => copyToClipboard(jsonOutput)} className="flex items-center gap-2 text-sm text-slate-300 hover:text-white">
                <ClipboardDocumentCheckIcon className="w-4 h-4" /> Copy output
              </button>
            )}
            {jsonError && <p className="text-sm text-rose-400">{jsonError}</p>}
          </div>
          {jsonOutput && <pre className="code-output" aria-label="JSON output">{jsonOutput}</pre>}
        </ToolCard>
      )}

      {tool.id === 'xml' && (
        <ToolCard title="XML Formatter" description={tool.description} badge={tool.badge} accent={tool.accent}>
          <textarea
            value={xmlInput}
            onChange={(e) => setXmlInput(e.target.value)}
            placeholder='<note><to>Devs</to><body>Stay awesome</body></note>'
            className="w-full"
          />
          <div className="flex flex-wrap items-center gap-3">
            <button onClick={handleXmlFormat} className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white shadow-brand">
              <CursorArrowRaysIcon className="h-4 w-4" />
              Format XML
            </button>
            {xmlOutput && (
              <button onClick={() => copyToClipboard(xmlOutput)} className="flex items-center gap-2 text-sm text-slate-300 hover:text-white">
                <ClipboardDocumentCheckIcon className="w-4 h-4" /> Copy output
              </button>
            )}
            {xmlError && <p className="text-sm text-rose-400">{xmlError}</p>}
          </div>
          {xmlOutput && <pre className="code-output" aria-label="XML output">{xmlOutput}</pre>}
        </ToolCard>
      )}

      {tool.id === 'sql' && (
        <ToolCard title="SQL Formatter" description={tool.description} badge={tool.badge} accent={tool.accent}>
          <textarea
            value={sqlInput}
            onChange={(e) => setSqlInput(e.target.value)}
            placeholder="select id, email from users where active=1 order by created_at desc"
            className="w-full"
          />
          <div className="flex flex-wrap items-center gap-3">
            <button onClick={handleSqlFormat} className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white shadow-brand">
              <CursorArrowRaysIcon className="h-4 w-4" />
              Format SQL
            </button>
            {sqlOutput && (
              <button onClick={() => copyToClipboard(sqlOutput)} className="flex items-center gap-2 text-sm text-slate-300 hover:text-white">
                <ClipboardDocumentCheckIcon className="w-4 h-4" /> Copy output
              </button>
            )}
            {sqlError && <p className="text-sm text-rose-400">{sqlError}</p>}
          </div>
          {sqlOutput && <pre className="code-output" aria-label="SQL output">{sqlOutput}</pre>}
        </ToolCard>
      )}

      {tool.id === 'encode' && (
        <ToolCard title="URL & Base64 Encoder/Decoder" description={tool.description} badge={tool.badge} accent={tool.accent}>
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-slate-300">Encode input</label>
              <textarea value={encodeInput} onChange={(e) => setEncodeInput(e.target.value)} placeholder="Any string to encode" className="w-full" />
              <div className="flex flex-wrap gap-2 text-sm text-slate-300">
                <span className="badge">URL encoded</span>
                <span className="badge">Base64 encoded</span>
              </div>
              <div className="flex flex-wrap gap-3">
                <button onClick={handleEncode} className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white shadow-brand">
                  <CursorArrowRaysIcon className="h-4 w-4" /> Encode
                </button>
                {(urlEncoded || base64Encoded) && (
                  <button onClick={() => copyToClipboard(`${urlEncoded}\n${base64Encoded}`)} className="flex items-center gap-2 text-sm text-slate-300 hover:text-white">
                    <ClipboardDocumentCheckIcon className="w-4 h-4" /> Copy results
                  </button>
                )}
                {encodeError && <p className="text-sm text-rose-400">{encodeError}</p>}
              </div>
              {(urlEncoded || base64Encoded) && (
                <div className="code-output space-y-2">
                  {urlEncoded && <p><span className="text-brand font-semibold">URL:</span> {urlEncoded}</p>}
                  {base64Encoded && <p><span className="text-brand font-semibold">Base64:</span> {base64Encoded}</p>}
                </div>
              )}
            </div>

            <div className="border-t border-white/10 pt-4 space-y-2">
              <label className="text-sm text-slate-300">Decode input</label>
              <textarea value={decodeInput} onChange={(e) => setDecodeInput(e.target.value)} placeholder="Paste Base64 or URL encoded value" className="w-full" />
              <div className="flex flex-wrap gap-3 items-center">
                <button onClick={handleDecode} className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-slate-100 border border-white/10">
                  <ArrowPathRoundedSquareIcon className="h-4 w-4" /> Decode
                </button>
                {decodeOutput && (
                  <button onClick={() => copyToClipboard(decodeOutput)} className="flex items-center gap-2 text-sm text-slate-300 hover:text-white">
                    <ClipboardDocumentCheckIcon className="w-4 h-4" /> Copy decoded
                  </button>
                )}
                {decodeError && <p className="text-sm text-rose-400">{decodeError}</p>}
              </div>
              {decodeOutput && <pre className="code-output" aria-label="Decoded output">{decodeOutput}</pre>}
            </div>
          </div>
        </ToolCard>
      )}

      {tool.id === 'timezone' && (
        <ToolCard title="Timezone Converter" description={tool.description} badge={tool.badge} accent={tool.accent}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-slate-300">Source time</label>
              <input
                type="datetime-local"
                value={sourceTime}
                onChange={(e) => setSourceTime(e.target.value)}
                className="w-full px-3 py-2"
              />
              <select value={sourceZone} onChange={(e) => setSourceZone(e.target.value)} className="w-full px-3 py-2">
                {timeZones.map((zone) => (
                  <option key={zone}>{zone}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-300">Target timezone</label>
              <select value={targetZone} onChange={(e) => setTargetZone(e.target.value)} className="w-full px-3 py-2">
                {timeZones.map((zone) => (
                  <option key={zone}>{zone}</option>
                ))}
              </select>
              <button onClick={handleTimeConversion} className="mt-2 inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white shadow-brand">
                <CursorArrowRaysIcon className="h-4 w-4" /> Convert time
              </button>
              {timeError && <p className="text-sm text-rose-400">{timeError}</p>}
            </div>
          </div>

          {convertedTime && (
            <div className="code-output">
              <p className="text-sm text-slate-400">{formatDateTimeValue(sourceTime)} ({sourceZone})</p>
              <p className="text-lg font-semibold text-white">{formatDateTimeValue(convertedTime)} ({targetZone})</p>
            </div>
          )}
        </ToolCard>
      )}

      {tool.id === 'bitwise' && (
        <ToolCard title="Bitwise Calculator" description={tool.description} badge={tool.badge} accent={tool.accent}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="space-y-2">
              <label className="text-sm text-slate-300">Operand A</label>
              <input type="number" value={bitwiseA} onChange={(e) => setBitwiseA(e.target.value)} className="w-full px-3 py-2" />
              <p className="text-xs text-slate-400">Binary: {Number(bitwiseA || '0').toString(2)}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-300">Operator</label>
              <select value={bitwiseOp} onChange={(e) => setBitwiseOp(e.target.value)} className="w-full px-3 py-2">
                <option value="AND">AND</option>
                <option value="OR">OR</option>
                <option value="XOR">XOR</option>
                <option value="LSHIFT">Left shift (A &lt;&lt; B)</option>
                <option value="RSHIFT">Right shift (A &gt;&gt; B)</option>
                <option value="NOT">NOT ( ~A )</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-300">Operand B</label>
              <input type="number" value={bitwiseB} onChange={(e) => setBitwiseB(e.target.value)} disabled={bitwiseOp === 'NOT'} className="w-full px-3 py-2 disabled:opacity-40" />
              <p className="text-xs text-slate-400">Binary: {Number(bitwiseB || '0').toString(2)}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button onClick={handleBitwise} className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-slate-100 border border-white/10">
              <CursorArrowRaysIcon className="h-4 w-4" /> Evaluate
            </button>
            {bitwiseError && <p className="text-sm text-rose-400">{bitwiseError}</p>}
          </div>
          {bitwiseResult && <pre className="code-output" aria-label="Bitwise output">{bitwiseResult}</pre>}
        </ToolCard>
      )}

      {tool.id === 'cron' && (
        <ToolCard title="Cron Expression Validator" description={tool.description} badge={tool.badge} accent={tool.accent}>
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_auto] gap-3 items-end">
              <div className="space-y-1">
                <label className="text-sm text-slate-300">Cron expression</label>
                <input
                  type="text"
                  value={cronExpression}
                  onChange={(e) => setCronExpression(e.target.value)}
                  placeholder="*/5 * * * *"
                  className="w-full px-3 py-2"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm text-slate-300">Timezone</label>
                <select value={cronZone} onChange={(e) => setCronZone(e.target.value)} className="w-full px-3 py-2">
                  {timeZones.map((zone) => (
                    <option key={zone}>{zone}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleCronPreview}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white shadow-brand"
              >
                <CursorArrowRaysIcon className="h-4 w-4" />
                Validate & preview
              </button>
            </div>

            {cronError && <p className="text-sm text-rose-400">{cronError}</p>}

            {!cronError && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <span className="badge">Next 10 runs</span>
                    <span className="text-xs text-slate-400">Based on {cronZone}</span>
                  </div>
                  <div className="code-output space-y-2">
                    {cronRuns.length === 0 && <p className="text-sm text-slate-400">Enter a cron expression to see the schedule.</p>}
                    {cronRuns.map((run, index) => (
                      <div key={run.toMillis()} className="flex items-center gap-3 text-sm text-slate-50">
                        <span className="badge">#{index + 1}</span>
                        <div className="flex-1">
                          <p className="font-semibold">{run.toFormat('ccc, MMM d yyyy • HH:mm:ss ZZZZ')}</p>
                          <p className="text-xs text-slate-400">{run.toRelative({ base: DateTime.now().setZone(cronZone) })}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <span className="badge">Visual timeline</span>
                    <span className="text-xs text-slate-400">Spacing reflects time between runs</span>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-2">
                    <div className="relative h-20 rounded-xl overflow-hidden border border-white/10 bg-gradient-to-r from-brand/10 via-brand/5 to-indigo-500/10">
                      {cronRuns.length > 0 && (
                        <div className="absolute inset-0">
                          {(() => {
                            const start = cronRuns[0];
                            const end = cronRuns[cronRuns.length - 1];
                            const span = Math.max(end.diff(start).as('milliseconds'), 1);

                            return cronRuns.map((run, index) => {
                              const offset = Math.min(Math.max(((run.toMillis() - start.toMillis()) / span) * 100, 0), 100);
                              return (
                                <div key={run.toMillis()} className="absolute top-0 h-full" style={{ left: `${offset}%` }}>
                                  <div className="mx-auto h-full w-[2px] bg-brand/70" />
                                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] text-white/90">
                                    {run.toFormat('HH:mm')}
                                  </span>
                                  <span className="absolute top-1 left-1/2 -translate-x-1/2 text-[10px] text-white/70">#{index + 1}</span>
                                </div>
                              );
                            });
                          })()}
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-slate-400">Timeline scaled between first and tenth run in {cronZone}.</p>

                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-white">Warnings</p>
                      {cronWarnings.length === 0 && <p className="text-sm text-emerald-300">No risky cadence detected.</p>}
                      {cronWarnings.length > 0 && (
                        <ul className="list-disc list-inside space-y-1 text-sm text-amber-200">
                          {cronWarnings.map((warning) => (
                            <li key={warning}>{warning}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ToolCard>
      )}
    </main>
  );
}
