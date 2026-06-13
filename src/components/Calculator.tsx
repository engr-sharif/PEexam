import { useState } from 'react';

// Lightweight scientific calculator for the mock-exam runner (the real CBT
// provides an on-screen calculator; this mirrors that workflow).
export function Calculator({ onClose }: { onClose: () => void }) {
  const [expr, setExpr] = useState('');
  const [result, setResult] = useState('');
  const [deg, setDeg] = useState(true);

  const append = (t: string) => setExpr((e) => e + t);

  const evaluate = () => {
    try {
      const r = safeEval(expr, deg);
      setResult(Number.isFinite(r) ? String(round(r)) : 'Error');
    } catch {
      setResult('Error');
    }
  };

  const keys = [
    '7', '8', '9', '/', 'sin(',
    '4', '5', '6', '*', 'cos(',
    '1', '2', '3', '-', 'tan(',
    '0', '.', '(', ')', '+',
    'sqrt(', '^', 'pi', 'log(', 'ln(',
  ];

  return (
    <div className="w-64 rounded-xl border border-slate-700 bg-slate-900 p-3 shadow-2xl">
      <div className="mb-2 flex items-center justify-between">
        <button
          onClick={() => setDeg((d) => !d)}
          className="rounded bg-slate-800 px-2 py-0.5 text-xs text-slate-300"
        >
          {deg ? 'DEG' : 'RAD'}
        </button>
        <span className="text-xs font-semibold text-slate-400">Calculator</span>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-200">✕</button>
      </div>
      <input
        value={expr}
        onChange={(e) => setExpr(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && evaluate()}
        className="w-full rounded bg-slate-950 px-2 py-1.5 text-right text-sm text-slate-100 outline-none"
        placeholder="0"
      />
      <div className="mt-1 h-5 text-right text-sm font-semibold text-emerald-400">{result}</div>
      <div className="mt-2 grid grid-cols-5 gap-1">
        {keys.map((k) => (
          <button
            key={k}
            onClick={() => append(k)}
            className="rounded bg-slate-800 py-1.5 text-xs text-slate-200 hover:bg-slate-700"
          >
            {k.replace('(', '')}
          </button>
        ))}
        <button onClick={() => setExpr('')} className="col-span-2 rounded bg-rose-600/80 py-1.5 text-xs text-white">C</button>
        <button onClick={() => setExpr((e) => e.slice(0, -1))} className="rounded bg-slate-700 py-1.5 text-xs text-white">⌫</button>
        <button onClick={evaluate} className="col-span-2 rounded bg-brand-600 py-1.5 text-xs font-semibold text-white">=</button>
      </div>
    </div>
  );
}

function round(n: number) {
  return Math.round(n * 1e8) / 1e8;
}

// Restricted evaluator: only math tokens allowed.
function safeEval(input: string, deg: boolean): number {
  const f = deg ? (x: number) => (x * Math.PI) / 180 : (x: number) => x;
  const fi = deg ? (x: number) => (x * 180) / Math.PI : (x: number) => x;
  const scope: Record<string, unknown> = {
    sin: (x: number) => Math.sin(f(x)),
    cos: (x: number) => Math.cos(f(x)),
    tan: (x: number) => Math.tan(f(x)),
    asin: (x: number) => fi(Math.asin(x)),
    acos: (x: number) => fi(Math.acos(x)),
    atan: (x: number) => fi(Math.atan(x)),
    sqrt: Math.sqrt,
    log: Math.log10,
    ln: Math.log,
    pi: Math.PI,
    e: Math.E,
    abs: Math.abs,
  };
  let js = input.replace(/\^/g, '**');
  // disallow anything that isn't a known token
  if (/[a-zA-Z]+/.test(js.replace(/sin|cos|tan|asin|acos|atan|sqrt|log|ln|pi|e|abs/g, ''))) {
    throw new Error('bad token');
  }
  const names = Object.keys(scope);
  const vals = Object.values(scope);
  // eslint-disable-next-line no-new-func
  const fn = new Function(...names, `"use strict"; return (${js});`);
  return fn(...vals) as number;
}
