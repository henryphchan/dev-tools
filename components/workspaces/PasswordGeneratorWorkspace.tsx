'use client';

import { useEffect, useMemo, useState } from 'react';
import { ToolInfo } from '../../lib/tools';
import { ClipboardDocumentCheckIcon, CursorArrowRaysIcon } from '../icons';
import ToolCard from '../ToolCard';
import { copyToClipboard } from './utils';

const CHARSETS = {
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  numbers: '0123456789',
  basicSymbols: '!@#$',
  extendedSymbols: "!@#$%^&*()_-+=[]{}|:;'<>,.?/",
};

const GUESS_RATE_PER_SECOND = 1e10; // 10 billion guesses/sec (modern GPU rigs)

interface SettingsState {
  length: number;
  includeLowercase: boolean;
  includeUppercase: boolean;
  includeNumbers: boolean;
  includeBasicSymbols: boolean;
  includeExtendedSymbols: boolean;
}

const defaultSettings: SettingsState = {
  length: 16,
  includeLowercase: true,
  includeUppercase: true,
  includeNumbers: true,
  includeBasicSymbols: true,
  includeExtendedSymbols: false,
};

function buildCharacterPool(settings: SettingsState) {
  let pool = '';
  if (settings.includeLowercase) pool += CHARSETS.lowercase;
  if (settings.includeUppercase) pool += CHARSETS.uppercase;
  if (settings.includeNumbers) pool += CHARSETS.numbers;
  if (settings.includeBasicSymbols) pool += CHARSETS.basicSymbols;
  if (settings.includeExtendedSymbols) pool += CHARSETS.extendedSymbols;

  return Array.from(new Set(pool)).join('');
}

function generatePassword(settings: SettingsState) {
  const pool = buildCharacterPool(settings);
  if (!pool) return '';

  const randomValues = new Uint32Array(settings.length);
  crypto.getRandomValues(randomValues);

  return Array.from(randomValues, (value) => pool[value % pool.length]).join('');
}

function calculateStrength(password: string) {
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[^A-Za-z0-9\s]/.test(password);

  const usesExtendedSymbol = hasSymbol && Array.from(password).some((char) => CHARSETS.extendedSymbols.includes(char));
  const usesBasicOnly =
    hasSymbol && !usesExtendedSymbol && Array.from(password).every((char) => !CHARSETS.extendedSymbols.includes(char) || CHARSETS.basicSymbols.includes(char));

  const extras = new Set<string>();
  for (const char of password) {
    if (/^[A-Za-z0-9]$/.test(char)) continue;
    if (/[^A-Za-z0-9\s]/.test(char)) continue;
    extras.add(char);
  }

  const symbolSetSize = usesExtendedSymbol
    ? CHARSETS.extendedSymbols.length
    : usesBasicOnly
      ? CHARSETS.basicSymbols.length
      : 0;

  const charsetSize =
    (hasLower ? CHARSETS.lowercase.length : 0) +
    (hasUpper ? CHARSETS.uppercase.length : 0) +
    (hasNumber ? CHARSETS.numbers.length : 0) +
    symbolSetSize +
    extras.size;

  const entropyBits = password.length && charsetSize ? password.length * Math.log2(charsetSize) : 0;
  const log10CrackSeconds = entropyBits * Math.log10(2) - Math.log10(GUESS_RATE_PER_SECOND);

  const score = Math.min(entropyBits / 100, 1);
  let label: 'Weak' | 'Fair' | 'Strong' | 'Very strong' = 'Weak';
  if (entropyBits >= 100) label = 'Very strong';
  else if (entropyBits >= 75) label = 'Strong';
  else if (entropyBits >= 50) label = 'Fair';

  return {
    hasLower,
    hasUpper,
    hasNumber,
    hasSymbol,
    charsetSize,
    entropyBits,
    log10CrackSeconds,
    score,
    label,
  };
}

function formatCrackTime(logSeconds: number) {
  if (!Number.isFinite(logSeconds)) return 'Unknown';

  if (logSeconds < -3) return '<1 ms';
  const seconds = Math.pow(10, logSeconds);

  if (seconds < 1) return `${(seconds * 1000).toFixed(2)} ms`;
  if (seconds < 60) return `${seconds.toFixed(seconds < 10 ? 2 : 0)} seconds`;

  const minutes = seconds / 60;
  if (minutes < 60) return `${minutes.toFixed(minutes < 10 ? 2 : 0)} minutes`;

  const hours = minutes / 60;
  if (hours < 48) return `${hours.toFixed(hours < 10 ? 2 : 0)} hours`;

  const days = hours / 24;
  if (days < 365) return `${days.toFixed(days < 10 ? 2 : 0)} days`;

  const years = days / 365.25;
  if (years < 1e6) return `${years.toFixed(years < 10 ? 2 : 0)} years`;

  const logYears = Math.log10(years);
  return `~10^${logYears.toFixed(1)} years`;
}

export function PasswordGeneratorWorkspace({ tool }: { tool: ToolInfo }) {
  const [settings, setSettings] = useState<SettingsState>(defaultSettings);
  const [password, setPassword] = useState('');

  const strength = useMemo(() => calculateStrength(password), [password]);

  useEffect(() => {
    if (!password) {
      setPassword(generatePassword(settings));
    }
  }, [settings, password]);

  const activePool = buildCharacterPool(settings);

  const handleGenerate = () => {
    const next = generatePassword(settings);
    setPassword(next);
  };

  const toggleSetting = (key: keyof SettingsState) => (value: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <ToolCard headingLevel="h1" title="Password Generator" description={tool.description} badge={tool.badge} accent={tool.accent}>
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-slate-300">
              <label htmlFor="password-length" className="font-semibold text-white">
                Length
              </label>
              <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-200">{settings.length} characters</span>
            </div>
            <input
              id="password-length"
              type="range"
              min={8}
              max={64}
              value={settings.length}
              onChange={(e) => setSettings((prev) => ({ ...prev, length: Number(e.target.value) }))}
              className="w-full accent-brand"
            />
            <p className="text-xs text-slate-400">
              Longer passwords dramatically increase brute-force search space. Aim for 16+ characters with mixed symbols.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { key: 'includeLowercase' as const, label: 'Lowercase (a-z)', description: 'Adds 26 characters' },
              { key: 'includeUppercase' as const, label: 'Uppercase (A-Z)', description: 'Adds 26 characters' },
              { key: 'includeNumbers' as const, label: 'Numbers (0-9)', description: 'Adds 10 characters' },
              { key: 'includeBasicSymbols' as const, label: 'Symbols (!@#$)', description: 'Safe for stricter systems' },
              {
                key: 'includeExtendedSymbols' as const,
                label: 'Symbols (all keyboard)',
                description: 'Adds punctuation, operators, and brackets',
              },
            ].map((option) => (
              <label
                key={option.key}
                className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200"
              >
                <input
                  type="checkbox"
                  checked={settings[option.key]}
                  onChange={(e) => toggleSetting(option.key)(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-white/20 bg-white/5"
                />
                <div>
                  <p className="font-semibold text-white">{option.label}</p>
                  <p className="text-xs text-slate-400">{option.description}</p>
                </div>
              </label>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleGenerate}
              disabled={!activePool}
              className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white shadow-brand disabled:cursor-not-allowed disabled:opacity-60"
            >
              <CursorArrowRaysIcon className="h-4 w-4" /> Generate password
            </button>
            {!activePool && <p className="text-sm text-rose-400">Select at least one character type.</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-white" htmlFor="generated-password">
              Generated password
            </label>
            <div className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/5 p-3">
              <input
                id="generated-password"
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Click generate to create a password"
                className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 font-mono text-sm text-white placeholder:text-slate-500"
              />
              <div className="flex items-center justify-between text-xs text-slate-300">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-white/5 px-3 py-1">{password.length} chars</span>
                  <span className="rounded-full bg-white/5 px-3 py-1">Pool: {activePool.length || 0}</span>
                </div>
                <button
                  onClick={() => copyToClipboard(password)}
                  disabled={!password}
                  className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-1 text-slate-200 hover:border-white/30 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ClipboardDocumentCheckIcon className="w-4 h-4" /> Copy
                </button>
              </div>
            </div>
            <p className="text-xs text-slate-400">
              Generation runs only in your browser using the Web Crypto API. Nothing is sent over the network.
            </p>
          </div>
        </div>

        <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-white">Strength insight</p>
              <p className="text-xs text-slate-400">Based on brute-force search space; dictionary attacks not considered.</p>
            </div>
            <span className="badge bg-white/10 text-white border-white/10">{strength.label}</span>
          </div>

          <div className="space-y-2">
            <div className="h-2 w-full rounded-full bg-white/10">
              <div
                className={`h-full rounded-full ${
                  strength.score > 0.75
                    ? 'bg-emerald-400'
                    : strength.score > 0.5
                      ? 'bg-lime-300'
                      : strength.score > 0.3
                        ? 'bg-amber-300'
                        : 'bg-rose-400'
                }`}
                style={{ width: `${Math.max(strength.score * 100, 6)}%` }}
              />
            </div>
            <p className="text-xs text-slate-300">{strength.entropyBits.toFixed(1)} bits of entropy</p>
          </div>

          <dl className="grid grid-cols-2 gap-3 text-sm text-slate-200">
            <div className="rounded-xl border border-white/10 bg-slate-950/40 p-3">
              <dt className="text-xs text-slate-400">Character set</dt>
              <dd className="text-lg font-semibold text-white">{strength.charsetSize || '—'}</dd>
              <p className="text-[11px] text-slate-400">Unique symbols the attacker must try</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-slate-950/40 p-3">
              <dt className="text-xs text-slate-400">Length</dt>
              <dd className="text-lg font-semibold text-white">{password.length}</dd>
              <p className="text-[11px] text-slate-400">Every additional character multiplies the search</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-slate-950/40 p-3">
              <dt className="text-xs text-slate-400">Crack time @10B/s</dt>
              <dd className="text-lg font-semibold text-white">{formatCrackTime(strength.log10CrackSeconds)}</dd>
              <p className="text-[11px] text-slate-400">Pure brute force, worst case</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-slate-950/40 p-3">
              <dt className="text-xs text-slate-400">Entropy</dt>
              <dd className="text-lg font-semibold text-white">{strength.entropyBits.toFixed(1)} bits</dd>
              <p className="text-[11px] text-slate-400">log₂(character set^length)</p>
            </div>
          </dl>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-white">Detected character types</p>
            <div className="flex flex-wrap gap-2 text-xs text-slate-200">
              {[
                { label: 'Lowercase', active: strength.hasLower },
                { label: 'Uppercase', active: strength.hasUpper },
                { label: 'Numbers', active: strength.hasNumber },
                { label: 'Symbols', active: strength.hasSymbol },
              ].map((item) => (
                <span
                  key={item.label}
                  className={`rounded-full px-3 py-1 border text-xs font-semibold ${
                    item.active
                      ? 'border-emerald-300/50 bg-emerald-400/10 text-emerald-100'
                      : 'border-white/10 bg-white/5 text-slate-400'
                  }`}
                >
                  {item.label}
                </span>
              ))}
            </div>
            <p className="text-xs text-slate-400">
              Strength assumes random selection from the detected character sets. Avoid reused phrases to resist dictionary attacks.
            </p>
          </div>
        </div>
      </div>
    </ToolCard>
  );
}
