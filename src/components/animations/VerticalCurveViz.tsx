import { useState } from 'react';
import { Slider } from './Slider';

// Interactive parabolic vertical curve with grades, BVC/EVC, and turning point.
export default function VerticalCurveViz() {
  const [g1, setG1] = useState(-3);
  const [g2, setG2] = useState(2);
  const [L, setL] = useState(600); // ft

  const A = g2 - g1;
  const xt = A !== 0 ? (-g1 * L) / A : NaN;
  const hasTurn = xt > 0 && xt < L && Math.sign(g1) !== Math.sign(g2) && g1 !== 0;

  const elev = (x: number) => (g1 / 100) * x + (A / 100 / (2 * L)) * x * x; // relative to BVC

  const W = 480, H = 260, pad = 40;
  // x range: extend tangents 25% beyond curve
  const x0 = -L * 0.25, x1 = L * 1.25;
  const ys: number[] = [];
  for (let i = 0; i <= 100; i++) ys.push(elev(x0 + ((x1 - x0) * i) / 100));
  const tangentBack = (x: number) => (g1 / 100) * x;
  const tangentFwd = (x: number) => elev(L) + (g2 / 100) * (x - L);
  const allY = [...ys, tangentBack(x0), tangentFwd(x1), 0, elev(L)];
  const yMin = Math.min(...allY), yMax = Math.max(...allY);
  const sx = (x: number) => pad + ((x - x0) / (x1 - x0)) * (W - 2 * pad);
  const sy = (y: number) => H - pad - ((y - yMin) / (yMax - yMin || 1)) * (H - 2 * pad);

  const curvePts: string[] = [];
  for (let i = 0; i <= 100; i++) {
    const x = (L * i) / 100;
    curvePts.push(`${sx(x)},${sy(elev(x))}`);
  }

  return (
    <div className="rounded-lg border border-slate-700 bg-slate-900/60 p-4">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        {/* tangents */}
        <line x1={sx(x0)} y1={sy(tangentBack(x0))} x2={sx(0)} y2={sy(0)} stroke="#94a3b8" />
        <line x1={sx(0)} y1={sy(0)} x2={sx(L / 2)} y2={sy(tangentBack(L / 2))} stroke="#64748b" strokeDasharray="4 3" />
        <line x1={sx(L)} y1={sy(elev(L))} x2={sx(x1)} y2={sy(tangentFwd(x1))} stroke="#94a3b8" />
        <line x1={sx(L / 2)} y1={sy(tangentFwd(L / 2))} x2={sx(L)} y2={sy(elev(L))} stroke="#64748b" strokeDasharray="4 3" />

        {/* curve */}
        <polyline points={curvePts.join(' ')} fill="none" stroke="#599fff" strokeWidth={3} />

        {/* key points */}
        <circle cx={sx(0)} cy={sy(0)} r={4} fill="#e2e8f0" />
        <text x={sx(0) - 8} y={sy(0) - 8} fill="#e2e8f0" fontSize="11" textAnchor="end">BVC</text>
        <circle cx={sx(L)} cy={sy(elev(L))} r={4} fill="#e2e8f0" />
        <text x={sx(L) + 8} y={sy(elev(L)) - 8} fill="#e2e8f0" fontSize="11">EVC</text>
        <circle cx={sx(L / 2)} cy={sy(tangentBack(L / 2))} r={3.5} fill="#f59e0b" />
        <text x={sx(L / 2)} y={sy(tangentBack(L / 2)) + (g1 < g2 ? 16 : -8)} fill="#f59e0b" fontSize="11" textAnchor="middle">PVI</text>

        {hasTurn && (
          <g>
            <circle cx={sx(xt)} cy={sy(elev(xt))} r={5} fill="#34d399" />
            <text x={sx(xt)} y={sy(elev(xt)) + (g1 < 0 ? 18 : -10)} fill="#34d399" fontSize="11" textAnchor="middle">
              {g1 < 0 ? 'low' : 'high'} pt @ x={xt.toFixed(0)} ft
            </text>
          </g>
        )}
      </svg>

      <div className="mt-2 grid grid-cols-3 gap-x-4">
        <Slider label="g₁" value={g1} min={-8} max={8} step={0.5} onChange={setG1} unit="%" />
        <Slider label="g₂" value={g2} min={-8} max={8} step={0.5} onChange={setG2} unit="%" />
        <Slider label="L" value={L} min={200} max={1500} step={50} onChange={setL} unit="ft" />
      </div>

      <div className="mt-3 rounded-md bg-slate-800 px-3 py-2 text-sm text-slate-300">
        A = g₂ − g₁ = <b>{A.toFixed(1)}%</b> ({A < 0 ? 'crest' : A > 0 ? 'sag' : 'straight'} curve).{' '}
        {hasTurn
          ? <>Turning point at x = −g₁L/A = <b className="text-emerald-300">{xt.toFixed(0)} ft</b> from BVC.</>
          : 'No high/low point on the curve — grades don’t change sign.'}{' '}
        K = L/|A| = <b>{A !== 0 ? Math.abs(L / A).toFixed(0) : '∞'}</b> ft/%.
      </div>
    </div>
  );
}
