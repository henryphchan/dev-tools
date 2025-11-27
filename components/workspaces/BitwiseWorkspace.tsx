'use client';

import { useState } from 'react';
import { ToolInfo } from '../../lib/tools';
import { CursorArrowRaysIcon } from '../icons';
import ToolCard from '../ToolCard';

export function BitwiseWorkspace({ tool }: { tool: ToolInfo }) {
  const [bitwiseA, setBitwiseA] = useState('5');
  const [bitwiseB, setBitwiseB] = useState('3');
  const [bitwiseOp, setBitwiseOp] = useState('AND');
  const [bitwiseResult, setBitwiseResult] = useState('');
  const [bitwiseError, setBitwiseError] = useState('');

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
          <input
            type="number"
            value={bitwiseB}
            onChange={(e) => setBitwiseB(e.target.value)}
            disabled={bitwiseOp === 'NOT'}
            className="w-full px-3 py-2 disabled:opacity-40"
          />
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
  );
}
