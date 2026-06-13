import { useState } from 'react';
import { Slider } from './Slider';

// Interactive simple horizontal curve. Shows geometry + computed T, L, LC, M, E.
export default function HorizontalCurve() {
  const [R, setR] = useState(500);
  const [delta, setDelta] = useState(40);

  const dR = (delta * Math.PI) / 180;
  const T = R * Math.tan(dR / 2);
  const L = (Math.PI * R * delta) / 180;
  const LC = 2 * R * Math.sin(dR / 2);
  const M = R * (1 - Math.cos(dR / 2));
  const E = R * (1 / Math.cos(dR / 2) - 1);

  // Drawing: place PI, draw two tangents and the arc.
  const W = 480;
  const H = 300;
  // Geometry: tangent in points. Use a fixed scale.
  const scale = 0.18;
  const cx = W / 2;
  const piY = 40;
  // back tangent comes from left, forward tangent to right, symmetric about vertical
  const half = dR / 2;
  // PC and PT positions relative to PI
  const pcx = cx - T * scale * Math.sin(half);
  const pcy = piY + T * scale * Math.cos(half);
  const ptx = cx + T * scale * Math.sin(half);
  const pty = piY + T * scale * Math.cos(half);
  // center of curve is below, along bisector
  const ccx = cx;
  const ccy = piY + (T / Math.tan(half)) * scale * 0; // unused; compute via R
  // Easier: center is at distance R from PC perpendicular to back tangent.
  // We'll just draw an arc via SVG path from PC to PT with radius R*scale.
  const rPix = R * scale;
  void ccx;
  void ccy;

  return (
    <div className="rounded-lg border border-slate-700 bg-slate-900/60 p-4">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        {/* tangents */}
        <line x1={pcx - 60} y1={pcy - 60 * (Math.cos(half) / Math.sin(half) || 1)} x2={cx} y2={piY} stroke="#64748b" strokeDasharray="4 3" />
        <line x1={cx} y1={piY} x2={ptx + 60} y2={pty - 60 * (Math.cos(half) / Math.sin(half) || 1)} stroke="#64748b" strokeDasharray="4 3" />
        {/* back & forward tangent solid to PC/PT */}
        <line x1={pcx} y1={pcy} x2={cx} y2={piY} stroke="#94a3b8" />
        <line x1={cx} y1={piY} x2={ptx} y2={pty} stroke="#94a3b8" />
        {/* the curve arc */}
        <path
          d={`M ${pcx} ${pcy} A ${rPix} ${rPix} 0 ${delta > 180 ? 1 : 0} 1 ${ptx} ${pty}`}
          fill="none"
          stroke="#599fff"
          strokeWidth={3}
        />
        {/* long chord */}
        <line x1={pcx} y1={pcy} x2={ptx} y2={pty} stroke="#34d399" strokeDasharray="3 3" />

        {/* labels */}
        <circle cx={cx} cy={piY} r={3} fill="#f59e0b" />
        <text x={cx + 6} y={piY - 4} fill="#f59e0b" fontSize="11">PI</text>
        <circle cx={pcx} cy={pcy} r={3} fill="#e2e8f0" />
        <text x={pcx - 22} y={pcy} fill="#e2e8f0" fontSize="11">PC</text>
        <circle cx={ptx} cy={pty} r={3} fill="#e2e8f0" />
        <text x={ptx + 6} y={pty} fill="#e2e8f0" fontSize="11">PT</text>
      </svg>

      <div className="mt-2 grid grid-cols-2 gap-x-6">
        <Slider label="Radius R" value={R} min={150} max={1500} step={25} onChange={setR} unit="ft" />
        <Slider label="Δ (central angle)" value={delta} min={5} max={120} onChange={setDelta} unit="°" />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-sm sm:grid-cols-5">
        {[
          ['T', T],
          ['L', L],
          ['LC', LC],
          ['M', M],
          ['E', E],
        ].map(([k, v]) => (
          <div key={k as string} className="rounded-md bg-slate-800 px-2 py-1 text-center">
            <div className="text-xs text-slate-400">{k}</div>
            <div className="font-semibold tabular-nums">{(v as number).toFixed(1)}<span className="text-xs text-slate-400"> ft</span></div>
          </div>
        ))}
      </div>
    </div>
  );
}
