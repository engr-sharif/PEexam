import { useState } from 'react';
import { Slider } from './Slider';

// Interactive ASCE 7 design response spectrum with the building's Cs marked.
export default function BaseShearSpectrum() {
  const [sds, setSds] = useState(1.0);
  const [sd1, setSd1] = useState(0.6);
  const [R, setR] = useState(8);
  const [T, setT] = useState(0.6);
  const Ie = 1.0;
  const TL = 8;

  const T0 = 0.2 * (sd1 / sds);
  const Ts = sd1 / sds;

  // Design spectrum Sa(T)
  const Sa = (t: number) => {
    if (t < T0) return sds * (0.4 + 0.6 * (t / T0));
    if (t <= Ts) return sds;
    if (t <= TL) return sd1 / t;
    return (sd1 * TL) / (t * t);
  };

  // Cs governing
  const csBase = sds / (R / Ie);
  const csMax = T <= TL ? sd1 / (T * (R / Ie)) : (sd1 * TL) / (T * T * (R / Ie));
  const csMin = Math.max(0.044 * sds * Ie, 0.01);
  const cs = Math.max(Math.min(csBase, csMax), csMin);

  const W = 480;
  const H = 280;
  const pad = 44;
  const tMax = 4;
  const yMax = Math.max(sds * 1.2, 0.5);
  const sx = (t: number) => pad + (t / tMax) * (W - 2 * pad);
  const sy = (a: number) => H - pad - (a / yMax) * (H - 2 * pad);

  const pts: string[] = [];
  for (let t = 0; t <= tMax; t += 0.05) pts.push(`${sx(t)},${sy(Sa(t))}`);

  return (
    <div className="rounded-lg border border-slate-700 bg-slate-900/60 p-4">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        <line x1={pad} y1={H - pad} x2={W - pad} y2={H - pad} stroke="#64748b" />
        <line x1={pad} y1={H - pad} x2={pad} y2={pad} stroke="#64748b" />
        <text x={W - pad} y={H - pad + 18} fill="#94a3b8" fontSize="11" textAnchor="end">Period T (s)</text>
        <text x={pad - 6} y={pad - 6} fill="#94a3b8" fontSize="11" textAnchor="end">Sa (g)</text>

        {/* design spectrum */}
        <polyline points={pts.join(' ')} fill="none" stroke="#94a3b8" strokeWidth={2} />

        {/* Cs as horizontal demand line at design level for R */}
        <line x1={pad} y1={sy(cs)} x2={W - pad} y2={sy(cs)} stroke="#34d399" strokeDasharray="5 4" />
        <text x={W - pad} y={sy(cs) - 5} fill="#34d399" fontSize="11" textAnchor="end">Cs = {cs.toFixed(3)}</text>

        {/* building T marker */}
        <line x1={sx(T)} y1={sy(0)} x2={sx(T)} y2={pad} stroke="#f59e0b" strokeDasharray="3 3" />
        <circle cx={sx(T)} cy={sy(Sa(T))} r={5} fill="#f59e0b" />
        <text x={sx(T) + 6} y={sy(Sa(T)) - 6} fill="#f59e0b" fontSize="11">T = {T.toFixed(2)} s</text>
      </svg>

      <div className="mt-2 grid grid-cols-2 gap-x-6 sm:grid-cols-4">
        <Slider label="SDS" value={sds} min={0.2} max={1.6} step={0.05} onChange={setSds} unit="g" />
        <Slider label="SD1" value={sd1} min={0.1} max={1.0} step={0.05} onChange={setSd1} unit="g" />
        <Slider label="R" value={R} min={1.5} max={8} step={0.5} onChange={setR} />
        <Slider label="Period T" value={T} min={0.1} max={3.5} step={0.05} onChange={setT} unit="s" />
      </div>

      <div className="mt-3 rounded-md bg-slate-800 px-3 py-2 text-sm text-slate-300">
        Cs = max( min( SDS/(R/Ie)={csBase.toFixed(3)}, limit={csMax.toFixed(3)} ), min={csMin.toFixed(3)} ) →{' '}
        <span className="font-semibold text-emerald-300">Cs = {cs.toFixed(3)}</span>
        <span className="ml-2 text-slate-400">(Ts = {Ts.toFixed(2)} s, T0 = {T0.toFixed(2)} s)</span>
      </div>
    </div>
  );
}
