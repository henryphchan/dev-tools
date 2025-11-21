'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import { DateTime } from 'luxon';
import ToolCard from './ToolCard';
import xmlFormatter from 'xml-formatter';
import { format as formatSql } from 'sql-formatter';
import { ToolInfo } from '../lib/tools';
import { CronExpressionParser } from 'cron-parser';
import { diffLines } from 'diff';
import Papa from 'papaparse';
import yaml from 'js-yaml';
import QRCode from 'qrcode';
import CryptoJS from 'crypto-js';
import * as blake from 'blakejs';
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

  const [csvInput, setCsvInput] = useState('');
  const [jsonFromCsv, setJsonFromCsv] = useState('');
  const [csvError, setCsvError] = useState('');
  const [jsonForCsv, setJsonForCsv] = useState('');
  const [csvFromJson, setCsvFromJson] = useState('');
  const [jsonToCsvError, setJsonToCsvError] = useState('');

  const [yamlInput, setYamlInput] = useState('');
  const [jsonFromYaml, setJsonFromYaml] = useState('');
  const [yamlError, setYamlError] = useState('');
  const [jsonForYaml, setJsonForYaml] = useState('');
  const [yamlFromJson, setYamlFromJson] = useState('');
  const [jsonToYamlError, setJsonToYamlError] = useState('');

  const [timestampInput, setTimestampInput] = useState('');
  const [timestampUnit, setTimestampUnit] = useState<'seconds' | 'milliseconds'>('seconds');
  const [timestampResult, setTimestampResult] = useState('');
  const [timestampError, setTimestampError] = useState('');

  const [jwtInput, setJwtInput] = useState('');
  const [jwtHeader, setJwtHeader] = useState('');
  const [jwtPayload, setJwtPayload] = useState('');
  const [jwtError, setJwtError] = useState('');

  const [uuidValue, setUuidValue] = useState('');

  const [qrContent, setQrContent] = useState('');
  const [qrType, setQrType] = useState<'text' | 'wifi'>('text');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [qrError, setQrError] = useState('');
  const [qrSize, setQrSize] = useState(320);
  const [qrDarkColor, setQrDarkColor] = useState('#0ea5e9');
  const [qrLightColor, setQrLightColor] = useState('#0b1224');
  const [qrDarkColorText, setQrDarkColorText] = useState('#0ea5e9');
  const [qrLightColorText, setQrLightColorText] = useState('#0b1224');
  const [qrErrorCorrection, setQrErrorCorrection] = useState<'L' | 'M' | 'H'>('M');
  const [wifiSsid, setWifiSsid] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');
  const [wifiSecurity, setWifiSecurity] = useState<'WPA' | 'WEP' | 'nopass'>('WPA');
  const [wifiHidden, setWifiHidden] = useState(false);

  const clampedQrSize = useMemo(() => Math.min(1024, Math.max(120, qrSize)), [qrSize]);

  const normalizeHexColor = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return null;

    const withHash = trimmed.startsWith('#') ? trimmed : `#${trimmed}`;
    const hex = withHash.slice(1).replace(/[^0-9a-fA-F]/g, '');

    if (hex.length === 3) {
      return `#${hex
        .split('')
        .map((char) => char.repeat(2))
        .join('')}`.toLowerCase();
    }

    if (hex.length === 6) {
      return `#${hex.toLowerCase()}`;
    }

    return null;
  };

  const commitColorInput = (
    value: string,
    setColor: (color: string) => void,
    setText: (colorText: string) => void,
    fallback: string
  ) => {
    const normalized = normalizeHexColor(value);

    if (normalized) {
      setColor(normalized);
      setText(normalized);
    } else {
      setText(fallback);
    }
  };

  const [wordCloudText, setWordCloudText] = useState('');
  const [wordCloudBg, setWordCloudBg] = useState('#0b1224');
  const [wordCloudMaxWords, setWordCloudMaxWords] = useState(60);
  const [wordCloudStopwords, setWordCloudStopwords] = useState('the,and,a,to,of,in,for,on,with,at,by');
  const [wordCloudPalette, setWordCloudPalette] = useState('aurora');
  const [wordCloudWidth, setWordCloudWidth] = useState(640);
  const [wordCloudHeight, setWordCloudHeight] = useState(360);
  const [wordCloudError, setWordCloudError] = useState('');
  const [isGeneratingWordCloud, setIsGeneratingWordCloud] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [digestAlgorithm, setDigestAlgorithm] = useState('sha256');
  const [digestText, setDigestText] = useState('');
  const [digestFileName, setDigestFileName] = useState('');
  const [digestFileBytes, setDigestFileBytes] = useState<ArrayBuffer | null>(null);
  const [digestResult, setDigestResult] = useState('');
  const [digestError, setDigestError] = useState('');

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

  const handleCsvToJson = () => {
    try {
      const parsed = Papa.parse(csvInput, { header: true, skipEmptyLines: true });

      if (parsed.errors.length) {
        throw new Error(parsed.errors[0].message);
      }

      setJsonFromCsv(JSON.stringify(parsed.data, null, 2));
      setCsvError('');
    } catch (error) {
      setCsvError('Unable to parse CSV. Check your delimiters and headers.');
      setJsonFromCsv('');
    }
  };

  const handleJsonToCsv = () => {
    try {
      const parsed = JSON.parse(jsonForCsv || '');
      const csv = Papa.unparse(parsed);
      setCsvFromJson(csv);
      setJsonToCsvError('');
    } catch (error) {
      setJsonToCsvError('Invalid JSON. Provide an array or object to convert.');
      setCsvFromJson('');
    }
  };

  const handleYamlToJson = () => {
    try {
      const parsed = yaml.load(yamlInput);
      setJsonFromYaml(JSON.stringify(parsed, null, 2));
      setYamlError('');
    } catch (error) {
      setYamlError('Invalid YAML. Make sure indentation and syntax are correct.');
      setJsonFromYaml('');
    }
  };

  const handleJsonToYaml = () => {
    try {
      const parsed = JSON.parse(jsonForYaml || '');
      setYamlFromJson(yaml.dump(parsed, { lineWidth: 100 }));
      setJsonToYamlError('');
    } catch (error) {
      setJsonToYamlError('Invalid JSON for conversion. Please check the structure.');
      setYamlFromJson('');
    }
  };

  const handleTimestampConvert = () => {
    const value = Number(timestampInput);

    if (!Number.isFinite(value)) {
      setTimestampError('Enter a numeric timestamp in seconds or milliseconds.');
      setTimestampResult('');
      return;
    }

    const millis = timestampUnit === 'seconds' ? value * 1000 : value;
    const dt = DateTime.fromMillis(millis);

    if (!dt.isValid) {
      setTimestampError('Invalid timestamp. Please verify the units match the value.');
      setTimestampResult('');
      return;
    }

    const local = dt.toFormat('DDD • HH:mm:ss ZZZZ');
    const iso = dt.toISO();

    setTimestampResult(`${local}\nISO: ${iso}`);
    setTimestampError('');
  };

  const decodeBase64Url = (value: string) => {
    const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
    return atob(padded);
  };

  const handleJwtDecode = () => {
    try {
      const parts = jwtInput.split('.');

      if (parts.length < 2) {
        throw new Error('JWT must have at least header and payload parts.');
      }

      const [headerPart, payloadPart] = parts;

      const decodedHeader = JSON.parse(decodeBase64Url(headerPart));
      const decodedPayload = JSON.parse(decodeBase64Url(payloadPart));

      setJwtHeader(JSON.stringify(decodedHeader, null, 2));
      setJwtPayload(JSON.stringify(decodedPayload, null, 2));
      setJwtError('');
    } catch (error) {
      setJwtError('Unable to decode JWT. Ensure it is a valid Base64URL token.');
      setJwtHeader('');
      setJwtPayload('');
    }
  };

  const generateUuid = () => {
    const next = crypto.randomUUID();
    setUuidValue(next);
  };

  const buildWifiPayload = () => {
    if (!wifiSsid.trim()) {
      throw new Error('SSID is required for WiFi QR codes.');
    }

    const hiddenFlag = wifiHidden ? 'H:true;' : '';
    const passwordPart = wifiSecurity === 'nopass' ? '' : `P:${wifiPassword};`;
    return `WIFI:T:${wifiSecurity};S:${wifiSsid};${passwordPart}${hiddenFlag};`;
  };

  const handleGenerateQr = async () => {
    try {
      const payload = qrType === 'wifi' ? buildWifiPayload() : qrContent.trim();

      if (!payload) {
        throw new Error('Enter text, a URL, or WiFi details to generate a QR code.');
      }

      const dataUrl = await QRCode.toDataURL(payload, {
        width: clampedQrSize,
        margin: 2,
        color: { dark: qrDarkColor, light: qrLightColor },
        errorCorrectionLevel: qrErrorCorrection,
      });

      setQrDataUrl(dataUrl);
      setQrError('');
    } catch (error) {
      console.error('QR generation failed', error);
      setQrError('Unable to generate QR code. Please verify the input data.');
      setQrDataUrl('');
    }
  };

  const colorPalettes: Record<string, string[]> = {
    aurora: ['#22d3ee', '#a855f7', '#f472b6', '#f97316', '#facc15'],
    grayscale: ['#f8fafc', '#cbd5e1', '#94a3b8', '#475569', '#1f2937'],
    ocean: ['#67e8f9', '#22d3ee', '#0284c7', '#0ea5e9', '#312e81'],
    sunset: ['#f472b6', '#fb923c', '#facc15', '#f97316', '#ef4444'],
  };

  const buildWordList = () => {
    const stopwords = new Set(
      wordCloudStopwords
        .split(',')
        .map((word) => word.trim().toLowerCase())
        .filter(Boolean)
    );

    const tokens = wordCloudText.match(/[\p{L}\p{N}']+/gu) || [];
    const counts = new Map<string, number>();

    tokens.forEach((token) => {
      const lower = token.toLowerCase();
      if (stopwords.has(lower) || lower.length < 2) return;
      counts.set(lower, (counts.get(lower) || 0) + 1);
    });

    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, Math.max(1, wordCloudMaxWords));
  };

  const generateWordCloud = async () => {
    if (!canvasRef.current) return;

    const list = buildWordList();
    if (list.length === 0) {
      setWordCloudError('Enter some text to visualize.');
      return;
    }

    setIsGeneratingWordCloud(true);

    try {
      const WordCloud = (await import('wordcloud')).default as any;
      const palette = colorPalettes[wordCloudPalette] || colorPalettes.aurora;

      canvasRef.current.width = wordCloudWidth;
      canvasRef.current.height = wordCloudHeight;

      WordCloud(canvasRef.current, {
        list,
        backgroundColor: wordCloudBg,
        color: () => palette[Math.floor(Math.random() * palette.length)],
        weightFactor: (size: number) => Math.max(Math.min(size * 12, 140), 12),
        rotateRatio: 0,
        shuffle: true,
        drawOutOfBound: false,
      });

      setWordCloudError('');
    } catch (error) {
      console.error('Word cloud generation failed', error);
      setWordCloudError('Unable to render the word cloud. Please try again.');
    } finally {
      setIsGeneratingWordCloud(false);
    }
  };

  const digestAlgorithms = [
    { value: 'md5', label: 'MD5' },
    { value: 'sha1', label: 'SHA-1' },
    { value: 'sha256', label: 'SHA-256' },
    { value: 'sha3-256', label: 'SHA3-256' },
    { value: 'blake2b', label: 'BLAKE2b (512-bit)' },
  ];

  const toHexFromBytes = (bytes: Uint8Array) =>
    Array.from(bytes)
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join('');

  const handleDigestFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setDigestFileName('');
      setDigestFileBytes(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setDigestFileBytes(reader.result as ArrayBuffer);
      setDigestFileName(file.name);
    };
    reader.readAsArrayBuffer(file);
  };

  const computeDigest = async () => {
    if (!digestText && !digestFileBytes) {
      setDigestError('Provide text or upload a file to hash.');
      setDigestResult('');
      return;
    }

    try {
      const byteSource = digestFileBytes ? new Uint8Array(digestFileBytes) : new TextEncoder().encode(digestText);
      const wordArray = digestFileBytes
        ? CryptoJS.lib.WordArray.create(byteSource as any)
        : CryptoJS.enc.Utf8.parse(digestText);

      let hexResult = '';

      switch (digestAlgorithm) {
        case 'md5':
          hexResult = CryptoJS.MD5(wordArray).toString(CryptoJS.enc.Hex);
          break;
        case 'sha1':
          hexResult = CryptoJS.SHA1(wordArray).toString(CryptoJS.enc.Hex);
          break;
        case 'sha256':
          hexResult = CryptoJS.SHA256(wordArray).toString(CryptoJS.enc.Hex);
          break;
        case 'sha3-256':
          hexResult = CryptoJS.SHA3(wordArray, { outputLength: 256 }).toString(CryptoJS.enc.Hex);
          break;
        case 'blake2b':
          hexResult = toHexFromBytes(blake.blake2b(byteSource, undefined, 64));
          break;
        default:
          hexResult = '';
      }

      setDigestResult(hexResult);
      setDigestError('');
    } catch (error) {
      console.error('Digest computation failed', error);
      setDigestError('Unable to compute the hash. Please try again.');
      setDigestResult('');
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

  useEffect(() => {
    generateUuid();
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

      {tool.id === 'qr-generator' && (
        <ToolCard title="QR Code Generator" description={tool.description} badge={tool.badge} accent={tool.accent}>
          <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] gap-6 items-start">
            <div className="space-y-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-4">
                <div className="flex flex-wrap gap-3">
                  <label className="inline-flex items-center gap-2 text-sm text-slate-300">
                    <input
                      type="radio"
                      name="qr-type"
                      value="text"
                      checked={qrType === 'text'}
                      onChange={() => setQrType('text')}
                    />
                    Text or URL
                  </label>
                  <label className="inline-flex items-center gap-2 text-sm text-slate-300">
                    <input
                      type="radio"
                      name="qr-type"
                      value="wifi"
                      checked={qrType === 'wifi'}
                      onChange={() => setQrType('wifi')}
                    />
                    WiFi credentials
                  </label>
                </div>

                {qrType === 'text' && (
                  <div className="space-y-2">
                    <label className="text-sm text-slate-300">Text or URL</label>
                    <textarea
                      value={qrContent}
                      onChange={(e) => setQrContent(e.target.value)}
                      placeholder="https://example.com or any text..."
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 min-h-[120px]"
                    />
                  </div>
                )}

                {qrType === 'wifi' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <label className="text-sm text-slate-300">Network name (SSID)</label>
                      <input
                        type="text"
                        value={wifiSsid}
                        onChange={(e) => setWifiSsid(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2"
                        placeholder="MyWiFi"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-slate-300">Security</label>
                      <select
                        value={wifiSecurity}
                        onChange={(e) => setWifiSecurity(e.target.value as typeof wifiSecurity)}
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2"
                      >
                        <option value="WPA">WPA/WPA2</option>
                        <option value="WEP">WEP</option>
                        <option value="nopass">Open network</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-slate-300">Password (optional for open networks)</label>
                      <input
                        type="text"
                        value={wifiPassword}
                        onChange={(e) => setWifiPassword(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2"
                        placeholder="••••••••"
                        disabled={wifiSecurity === 'nopass'}
                      />
                    </div>
                    <label className="inline-flex items-center gap-2 text-sm text-slate-300">
                      <input
                        type="checkbox"
                        checked={wifiHidden}
                        onChange={(e) => setWifiHidden(e.target.checked)}
                      />
                      Hidden network
                    </label>
                  </div>
                )}
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-4">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <p className="text-sm font-semibold text-slate-200">Customization</p>
                  <p className="text-xs text-slate-400">Choose error correction, sizing, and colors.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-sm text-slate-300">Error correction</label>
                    <select
                      value={qrErrorCorrection}
                      onChange={(e) => setQrErrorCorrection(e.target.value as typeof qrErrorCorrection)}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2"
                    >
                      <option value="H">High (30%)</option>
                      <option value="M">Medium (15%)</option>
                      <option value="L">Low (7%)</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm text-slate-300">Size (px)</label>
                    <input
                      type="number"
                      min={120}
                      max={1024}
                      value={qrSize}
                      onChange={(e) => setQrSize(Number(e.target.value))}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2"
                      placeholder="320"
                    />
                    <p className="text-xs text-slate-400">Clamped between 120px and 1024px.</p>
                  </div>
                  <div className="space-y-1 min-w-0">
                    <label className="text-sm text-slate-300">Foreground</label>
                    <div className="flex items-center gap-2 min-w-0">
                      <input
                        type="color"
                        value={qrDarkColor}
                        onChange={(e) => {
                          setQrDarkColor(e.target.value);
                          setQrDarkColorText(e.target.value);
                        }}
                        className="h-10 w-12 shrink-0 rounded-lg border border-white/10 bg-white/5 p-0"
                      />
                      <input
                        type="text"
                        value={qrDarkColorText}
                        onChange={(e) => setQrDarkColorText(e.target.value)}
                        onBlur={() => commitColorInput(qrDarkColorText, setQrDarkColor, setQrDarkColorText, qrDarkColor)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            commitColorInput(qrDarkColorText, setQrDarkColor, setQrDarkColorText, qrDarkColor);
                          }
                        }}
                        className="flex-1 min-w-0 rounded-xl border border-white/10 bg-white/5 px-3 py-2"
                        placeholder="#0ea5e9"
                      />
                    </div>
                  </div>
                  <div className="space-y-1 min-w-0">
                    <label className="text-sm text-slate-300">Background</label>
                    <div className="flex items-center gap-2 min-w-0">
                      <input
                        type="color"
                        value={qrLightColor}
                        onChange={(e) => {
                          setQrLightColor(e.target.value);
                          setQrLightColorText(e.target.value);
                        }}
                        className="h-10 w-12 shrink-0 rounded-lg border border-white/10 bg-white/5 p-0"
                      />
                      <input
                        type="text"
                        value={qrLightColorText}
                        onChange={(e) => setQrLightColorText(e.target.value)}
                        onBlur={() => commitColorInput(qrLightColorText, setQrLightColor, setQrLightColorText, qrLightColor)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            commitColorInput(qrLightColorText, setQrLightColor, setQrLightColorText, qrLightColor);
                          }
                        }}
                        className="flex-1 min-w-0 rounded-xl border border-white/10 bg-white/5 px-3 py-2"
                        placeholder="#0b1224"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleGenerateQr}
                  className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white shadow-brand"
                >
                  <CursorArrowRaysIcon className="h-4 w-4" />
                  Generate QR code
                </button>
                {qrDataUrl && (
                  <button
                    onClick={() => copyToClipboard(qrType === 'wifi' ? buildWifiPayload() : qrContent)}
                    className="flex items-center gap-2 text-sm text-slate-300 hover:text-white"
                  >
                    <ClipboardDocumentCheckIcon className="w-4 h-4" /> Copy encoded data
                  </button>
                )}
                {qrError && <p className="text-sm text-rose-400">{qrError}</p>}
              </div>
            </div>

            <div className="space-y-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-slate-300 mb-2">Preview</p>
                <div className="flex items-center justify-center rounded-xl border border-white/5 bg-slate-950/40 p-6 min-h-[280px]">
                  {qrDataUrl ? (
                    <Image
                      src={qrDataUrl}
                      alt="Generated QR code"
                      width={clampedQrSize}
                      height={clampedQrSize}
                      className="object-contain"
                      style={{ width: clampedQrSize, height: clampedQrSize, maxWidth: '100%', maxHeight: '100%' }}
                    />
                  ) : (
                    <p className="text-sm text-slate-400 text-center">Enter details and generate to see the QR code.</p>
                  )}
                </div>
              </div>
              {qrDataUrl && (
                <a
                  download="qr-code.png"
                  href={qrDataUrl}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:border-brand/50 hover:text-white"
                >
                  <ArrowPathRoundedSquareIcon className="h-4 w-4" />
                  Download PNG
                </a>
              )}
            </div>
          </div>
        </ToolCard>
      )}

      {tool.id === 'word-cloud' && (
        <ToolCard title="Word Cloud Generator" description={tool.description} badge={tool.badge} accent={tool.accent}>
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-5">
            <div className="space-y-3">
              <div className="space-y-2">
                <label className="text-sm text-slate-300">Text to visualize</label>
                <textarea
                  value={wordCloudText}
                  onChange={(e) => setWordCloudText(e.target.value)}
                  placeholder="Paste or type your text here..."
                  className="w-full"
                  rows={6}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-sm text-slate-300">Max words</label>
                  <input
                    type="number"
                    min={10}
                    max={400}
                    value={wordCloudMaxWords}
                    onChange={(e) => setWordCloudMaxWords(Number(e.target.value))}
                    className="w-full px-3 py-2"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm text-slate-300">Color palette</label>
                  <select
                    value={wordCloudPalette}
                    onChange={(e) => setWordCloudPalette(e.target.value)}
                    className="w-full px-3 py-2"
                  >
                    <option value="aurora">Aurora (brand)</option>
                    <option value="grayscale">Grayscale</option>
                    <option value="ocean">Ocean</option>
                    <option value="sunset">Sunset</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm text-slate-300">Canvas width (px)</label>
                  <input
                    type="number"
                    min={320}
                    max={1200}
                    value={wordCloudWidth}
                    onChange={(e) => setWordCloudWidth(Number(e.target.value))}
                    className="w-full px-3 py-2"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm text-slate-300">Canvas height (px)</label>
                  <input
                    type="number"
                    min={240}
                    max={900}
                    value={wordCloudHeight}
                    onChange={(e) => setWordCloudHeight(Number(e.target.value))}
                    className="w-full px-3 py-2"
                  />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-sm text-slate-300">Stopwords (comma-separated)</label>
                  <input
                    type="text"
                    value={wordCloudStopwords}
                    onChange={(e) => setWordCloudStopwords(e.target.value)}
                    className="w-full px-3 py-2"
                  />
                  <p className="text-xs text-slate-400">Excluded words will not appear in the cloud.</p>
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-sm text-slate-300">Background color</label>
                  <input
                    type="text"
                    value={wordCloudBg}
                    onChange={(e) => setWordCloudBg(e.target.value)}
                    className="w-full px-3 py-2"
                    placeholder="#0b1224"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={generateWordCloud}
                  className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white shadow-brand"
                  disabled={isGeneratingWordCloud}
                >
                  <CursorArrowRaysIcon className="h-4 w-4" />
                  {isGeneratingWordCloud ? 'Generating...' : 'Generate word cloud'}
                </button>
                {wordCloudError && <p className="text-sm text-rose-400">{wordCloudError}</p>}
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm text-slate-300">Live preview</p>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 flex items-center justify-center min-h-[260px]">
                <canvas ref={canvasRef} className="max-w-full" aria-label="Word cloud preview" />
              </div>
              <p className="text-xs text-slate-400">Adjust dimensions for higher-resolution exports, then right-click the canvas to save.</p>
            </div>
          </div>
        </ToolCard>
      )}

      {tool.id === 'digest' && (
        <ToolCard title="Message Digester" description={tool.description} badge={tool.badge} accent={tool.accent}>
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-5">
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-sm text-slate-300">Algorithm</label>
                  <select
                    value={digestAlgorithm}
                    onChange={(e) => setDigestAlgorithm(e.target.value)}
                    className="w-full px-3 py-2"
                  >
                    {digestAlgorithms.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm text-slate-300">Upload file (optional)</label>
                  <input type="file" onChange={handleDigestFile} className="w-full" />
                  {digestFileName && <p className="text-xs text-slate-400">{digestFileName}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-slate-300">Text input (used if no file is provided)</label>
                <textarea
                  value={digestText}
                  onChange={(e) => setDigestText(e.target.value)}
                  placeholder="Paste text to hash..."
                  className="w-full"
                  rows={4}
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={computeDigest}
                  className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white shadow-brand"
                >
                  <CursorArrowRaysIcon className="h-4 w-4" />
                  Generate hash
                </button>
                {digestResult && (
                  <button
                    onClick={() => copyToClipboard(digestResult)}
                    className="flex items-center gap-2 text-sm text-slate-300 hover:text-white"
                  >
                    <ClipboardDocumentCheckIcon className="w-4 h-4" /> Copy hash
                  </button>
                )}
                {digestError && <p className="text-sm text-rose-400">{digestError}</p>}
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm text-slate-300">Hash output</p>
              {digestResult ? (
                <pre className="code-output break-all" aria-label="Digest output">{digestResult}</pre>
              ) : (
                <p className="text-sm text-slate-400">Select an algorithm and provide input to see the hash.</p>
              )}
              <p className="text-xs text-slate-400">Uses client-side hashing only; inputs stay in your browser.</p>
            </div>
          </div>
        </ToolCard>
      )}

      {tool.id === 'csv-json' && (
        <ToolCard title="CSV ↔ JSON Converter" description={tool.description} badge={tool.badge} accent={tool.accent}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-3">
              <label className="text-sm text-slate-300">CSV input (expects headers)</label>
              <textarea
                value={csvInput}
                onChange={(e) => setCsvInput(e.target.value)}
                placeholder={`name,role\nAda,Engineer`}
                className="w-full"
              />
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleCsvToJson}
                  className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white shadow-brand"
                >
                  <CursorArrowRaysIcon className="h-4 w-4" />
                  Convert to JSON
                </button>
                {jsonFromCsv && (
                  <button
                    onClick={() => copyToClipboard(jsonFromCsv)}
                    className="flex items-center gap-2 text-sm text-slate-300 hover:text-white"
                  >
                    <ClipboardDocumentCheckIcon className="w-4 h-4" /> Copy JSON
                  </button>
                )}
              </div>
              {csvError && <p className="text-sm text-rose-400">{csvError}</p>}
              {jsonFromCsv && <pre className="code-output" aria-label="JSON from CSV">{jsonFromCsv}</pre>}
            </div>

            <div className="space-y-3 border-t border-white/10 pt-4 lg:border-t-0 lg:pt-0 lg:border-l lg:pl-4">
              <label className="text-sm text-slate-300">JSON input</label>
              <textarea
                value={jsonForCsv}
                onChange={(e) => setJsonForCsv(e.target.value)}
                placeholder='[{"name":"Ada","role":"Engineer"}]'
                className="w-full"
              />
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleJsonToCsv}
                  className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-slate-100 border border-white/10"
                >
                  <ArrowPathRoundedSquareIcon className="h-4 w-4" />
                  Convert to CSV
                </button>
                {csvFromJson && (
                  <button
                    onClick={() => copyToClipboard(csvFromJson)}
                    className="flex items-center gap-2 text-sm text-slate-300 hover:text-white"
                  >
                    <ClipboardDocumentCheckIcon className="w-4 h-4" /> Copy CSV
                  </button>
                )}
              </div>
              {jsonToCsvError && <p className="text-sm text-rose-400">{jsonToCsvError}</p>}
              {csvFromJson && <pre className="code-output" aria-label="CSV from JSON">{csvFromJson}</pre>}
            </div>
          </div>
        </ToolCard>
      )}

      {tool.id === 'yaml-json' && (
        <ToolCard title="YAML ↔ JSON Converter" description={tool.description} badge={tool.badge} accent={tool.accent}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-3">
              <label className="text-sm text-slate-300">YAML input</label>
              <textarea
                value={yamlInput}
                onChange={(e) => setYamlInput(e.target.value)}
                placeholder={`app:\n  env: prod`}
                className="w-full"
              />
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleYamlToJson}
                  className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white shadow-brand"
                >
                  <CursorArrowRaysIcon className="h-4 w-4" />
                  Convert to JSON
                </button>
                {jsonFromYaml && (
                  <button
                    onClick={() => copyToClipboard(jsonFromYaml)}
                    className="flex items-center gap-2 text-sm text-slate-300 hover:text-white"
                  >
                    <ClipboardDocumentCheckIcon className="w-4 h-4" /> Copy JSON
                  </button>
                )}
              </div>
              {yamlError && <p className="text-sm text-rose-400">{yamlError}</p>}
              {jsonFromYaml && <pre className="code-output" aria-label="JSON from YAML">{jsonFromYaml}</pre>}
            </div>

            <div className="space-y-3 border-t border-white/10 pt-4 lg:border-t-0 lg:pt-0 lg:border-l lg:pl-4">
              <label className="text-sm text-slate-300">JSON input</label>
              <textarea
                value={jsonForYaml}
                onChange={(e) => setJsonForYaml(e.target.value)}
                placeholder='{"app":{"env":"prod"}}'
                className="w-full"
              />
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleJsonToYaml}
                  className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-slate-100 border border-white/10"
                >
                  <ArrowPathRoundedSquareIcon className="h-4 w-4" />
                  Convert to YAML
                </button>
                {yamlFromJson && (
                  <button
                    onClick={() => copyToClipboard(yamlFromJson)}
                    className="flex items-center gap-2 text-sm text-slate-300 hover:text-white"
                  >
                    <ClipboardDocumentCheckIcon className="w-4 h-4" /> Copy YAML
                  </button>
                )}
              </div>
              {jsonToYamlError && <p className="text-sm text-rose-400">{jsonToYamlError}</p>}
              {yamlFromJson && <pre className="code-output" aria-label="YAML from JSON">{yamlFromJson}</pre>}
            </div>
          </div>
        </ToolCard>
      )}

      {tool.id === 'timestamp' && (
        <ToolCard title="Timestamp to Date Converter" description={tool.description} badge={tool.badge} accent={tool.accent}>
          <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_auto] gap-3 items-end">
            <div className="space-y-1">
              <label className="text-sm text-slate-300">Timestamp</label>
              <input
                type="text"
                value={timestampInput}
                onChange={(e) => setTimestampInput(e.target.value)}
                placeholder="1700000000"
                className="w-full px-3 py-2"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-slate-300">Units</label>
              <select
                value={timestampUnit}
                onChange={(e) => setTimestampUnit(e.target.value as 'seconds' | 'milliseconds')}
                className="w-full px-3 py-2"
              >
                <option value="seconds">Seconds</option>
                <option value="milliseconds">Milliseconds</option>
              </select>
            </div>
            <button
              onClick={handleTimestampConvert}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white shadow-brand"
            >
              <CursorArrowRaysIcon className="h-4 w-4" /> Convert
            </button>
          </div>
          {timestampError && <p className="text-sm text-rose-400">{timestampError}</p>}
          {timestampResult && <pre className="code-output" aria-label="Timestamp output">{timestampResult}</pre>}
          <p className="text-xs text-slate-400">Outputs include your local timezone and ISO-8601 format.</p>
        </ToolCard>
      )}

      {tool.id === 'jwt' && (
        <ToolCard title="JWT Decoder" description={tool.description} badge={tool.badge} accent={tool.accent}>
          <div className="space-y-2">
            <label className="text-sm text-slate-300">JWT</label>
            <textarea
              value={jwtInput}
              onChange={(e) => setJwtInput(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiZGV2In0.signature"
              className="w-full"
            />
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleJwtDecode}
                className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white shadow-brand"
              >
                <CursorArrowRaysIcon className="h-4 w-4" />
                Decode JWT
              </button>
              {(jwtHeader || jwtPayload) && (
                <button
                  onClick={() => copyToClipboard(`${jwtHeader}\n${jwtPayload}`)}
                  className="flex items-center gap-2 text-sm text-slate-300 hover:text-white"
                >
                  <ClipboardDocumentCheckIcon className="w-4 h-4" /> Copy decoded parts
                </button>
              )}
            </div>
            {jwtError && <p className="text-sm text-rose-400">{jwtError}</p>}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-white">Header</p>
              {jwtHeader ? <pre className="code-output" aria-label="JWT header">{jwtHeader}</pre> : <p className="text-sm text-slate-400">Decoded header will appear here.</p>}
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold text-white">Payload</p>
              {jwtPayload ? <pre className="code-output" aria-label="JWT payload">{jwtPayload}</pre> : <p className="text-sm text-slate-400">Decoded payload will appear here.</p>}
            </div>
          </div>
        </ToolCard>
      )}

      {tool.id === 'uuid' && (
        <ToolCard title="UUID Generator" description={tool.description} badge={tool.badge} accent={tool.accent}>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={generateUuid}
              className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white shadow-brand"
            >
              <CursorArrowRaysIcon className="h-4 w-4" />
              Generate UUID
            </button>
            {uuidValue && (
              <button
                onClick={() => copyToClipboard(uuidValue)}
                className="flex items-center gap-2 text-sm text-slate-300 hover:text-white"
              >
                <ClipboardDocumentCheckIcon className="w-4 h-4" /> Copy
              </button>
            )}
          </div>
          {uuidValue && <pre className="code-output" aria-label="UUID output">{uuidValue}</pre>}
          <p className="text-xs text-slate-400">Uses the browser&apos;s crypto API to generate RFC 4122 v4 identifiers.</p>
        </ToolCard>
      )}

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
