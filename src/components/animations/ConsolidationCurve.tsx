import { useState } from 'react';
import { Slider } from './Slider';

// Interactive consolidation time-rate: settlement vs time for a clay layer.
export default function ConsolidationCurve() {
  const [H, setH] = useState(4); // m
  const [cv, setCv] = useState(1.5); // m²/yr
  const [dbl, setDbl] = useState(1); // 1 = double drainage
  const [Sc, setSc] = useState(150); // mm ultimate

  const Hdr = dbl ? H / 2 : H;

  // U(Tv) approximation (Terzaghi): invert piecewise
  const Uof = (Tv: number) => {
    if (Tv <= 0) return 0;
    const u1 = Math.sqrt((4 * Tv) / Math.PI); // valid to ~60%
    if (u1 <= 0.6) return u1;
    return 1 - Math.pow(10, (1.781 - Tv) / 0.933) / 100;
  };

  const tMax = ((1.2 * Hdr * Hdr) / cv) * 1.5; // show past ~90%
  const W = 480, Hpx = 280, pad = 44;
  const sx = (t: number) => pad + (t / tMax) * (W - 2 * pad);
  const sy = (s: number) => pad + (s / Sc) * (Hpx - 2 * pad); // settlement grows downward

  const pts: string[] = [];
  for (let i = 0; i <= 120; i++) {
    const t = (tMax * i) / 120;
    const Tv = (cv * t) / (Hdr * Hdr);
    const U = Math.min(1, Uof(Tv));
    pts.push(`${sx(t)},${sy(U * Sc)}`);
  }

  const t50 = (0.197 * Hdr * Hdr) / cv;
  const t90 = (0.848 * Hdr * Hdr) / cv;

  return (
    <div className="rounded-lg border border-slate-700 bg-slate-900/60 p-4">
      <svg viewBox={`0 0 ${W} ${Hpx}`} className="w-full">
        <line x1={pad} y1={pad} x2={W - pad} y2={pad} stroke="#64748b" />
        <line x1={pad} y1={pad} x2={pad} y2={Hpx - pad} stroke="#64748b" />
        <text x={W - pad} y={pad - 6} fill="#94a3b8" fontSize="11" textAnchor="end">time (yr)</text>
        <text x={pad - 4} y={Hpx - pad} fill="#94a3b8" fontSize="11" textAnchor="end">S</text>

        <polyline points={pts.join(' ')} fill="none" stroke="#599fff" strokeWidth={2.5} />

        {/* markers */}
        {[{ t: t50, u: 0.5, lbl: 't₅₀' }, { t: t90, u: 0.9, lbl: 't₉₀' }].map((m) => (
          <g key={m.lbl}>
            <line x1={sx(m.t)} y1={pad} x2={sx(m.t)} y2={sy(m.u * Sc)} stroke="#f59e0b" strokeDasharray="3 3" />
            <circle cx={sx(m.t)} cy={sy(m.u * Sc)} r={4} fill="#f59e0b" />
            <text x={sx(m.t)} y={Hpx - pad + 14} fill="#f59e0b" fontSize="10" textAnchor="middle">{m.lbl}={m.t.toFixed(1)}y</text>
          </g>
        ))}
        {/* ultimate settlement line */}
        <line x1={pad} y1={sy(Sc)} x2={W - pad} y2={sy(Sc)} stroke="#34d399" strokeDasharray="5 4" />
        <text x={W - pad} y={sy(Sc) - 5} fill="#34d399" fontSize="10" textAnchor="end">S∞ = {Sc} mm</text>
      </svg>

      <div className="mt-2 grid grid-cols-2 gap-x-6 sm:grid-cols-4">
        <Slider label="Layer H" value={H} min={1} max={12} step={0.5} onChange={setH} unit="m" />
        <Slider label="cv" value={cv} min={0.2} max={10} step={0.1} onChange={setCv} unit="m²/yr" />
        <Slider label="Ultimate Sc" value={Sc} min={20} max={400} step={10} onChange={setSc} unit="mm" />
        <label className="block text-xs text-slate-300">
          <span className="font-medium">Drainage</span>
          <button
            onClick={() => setDbl(dbl ? 0 : 1)}
            className="mt-1 w-full rounded-lg border border-slate-700 py-1.5 text-xs font-semibold text-slate-200"
          >
            {dbl ? 'Double (top+bottom)' : 'Single (top only)'}
          </button>
        </label>
      </div>

      <div className="mt-3 rounded-md bg-slate-800 px-3 py-2 text-sm text-slate-300">
        Hdr = {Hdr.toFixed(1)} m → t₉₀ = 0.848·Hdr²/cv = <b className="text-emerald-300">{t90.toFixed(1)} yr</b>.
        Toggle drainage: halving Hdr cuts time by <b>4×</b> — the exam's favorite trick.
      </div>
    </div>
  );
}
