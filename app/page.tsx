'use client';

import { useMemo, useState } from 'react';
import ToolCard from '../components/ToolCard';
import xmlFormatter from 'xml-formatter';
import { format as formatSql } from 'sql-formatter';
import { DateTime } from 'luxon';
import {
  ArrowPathRoundedSquareIcon,
  ClipboardDocumentCheckIcon,
  CursorArrowRaysIcon,
  SparklesIcon,
} from '../components/icons';

const timeZones = [
  'UTC',
  'America/New_York',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Berlin',
  'Asia/Tokyo',
  'Asia/Kolkata',
  'Australia/Sydney'
];

function formatDateTimeValue(value: string) {
  const dt = DateTime.fromISO(value, { setZone: true });
  if (!dt.isValid) return '';
  return dt.toFormat('fff ZZZZ');
}

export default function Home() {
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

  return (
    <main className="max-w-6xl mx-auto px-4 py-12 space-y-10">
      <header className="flex flex-col gap-6 text-center">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
          <SparklesIcon className="w-4 h-4 text-brand" />
          Dev productivity stack for Azure-ready teams
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-50">Dev Tools</h1>
          <p className="max-w-2xl mx-auto text-lg text-slate-300">
            Format, convert, and calculate without leaving your browser. Built with Next.js, Tailwind, and ready for Azure Static Web Apps.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3 text-sm text-slate-300">
          <span className="badge">App Router</span>
          <span className="badge">Client-first ergonomics</span>
          <span className="badge">Secure by default</span>
          <span className="badge">Copy-friendly outputs</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ToolCard title="JSON Formatter" description="Prettify and validate JSON payloads before shipping them to APIs." badge="Formatter">
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

        <ToolCard title="XML Formatter" description="Readable, indented XML without plugins or heavyweight editors." badge="Formatter">
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

        <ToolCard title="SQL Formatter" description="Clean up ad-hoc queries and share them with your teammates." badge="Formatter">
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

        <ToolCard title="Encoders & Decoders" description="Handle URL encoding and Base64 conversions for tokens and payloads." badge="Converter">
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

        <ToolCard title="Timezone Converter" description="Translate meeting times confidently across regions using Luxon." badge="Converter">
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

        <ToolCard title="Bitwise Calculator" description="Inspect how integers behave with bitwise operators." badge="Calculator">
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
      </div>
    </main>
  );
}
