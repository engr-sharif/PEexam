import { useState } from 'react';
import { Slider } from './Slider';

// Interactive trapezoidal open channel: drag depth/geometry/slope and watch
// Manning flow, velocity, and Froude number respond (USCS units).
export default function OpenChannel() {
  const [b, setB] = useState(6); // bottom width ft
  const [z, setZ] = useState(2); // side slope H:V
  const [y, setY] = useState(2); // depth ft
  const [n, setN] = useState(0.013);
  const [S, setS] = useState(0.002);

  const A = (b + z * y) * y;
  const P = b + 2 * y * Math.sqrt(1 + z * z);
  const R = A / P;
  const V = (1.49 / n) * Math.pow(R, 2 / 3) * Math.sqrt(S);
  const Q = V * A;
  const T = b + 2 * z * y;
  const Fr = V / Math.sqrt((32.2 * A) / T);
  const regime = Fr < 0.95 ? 'subcritical' : Fr > 1.05 ? 'SUPERCRITICAL' : 'critical';

  // drawing
  const W = 480, H = 220;
  const scale = Math.min(30, 380 / (b + 2 * z * 4 + 4));
  const cx = W / 2;
  const baseY = H - 40;
  const yMax = 4;
  const topHalf = (b / 2 + z * yMax) * scale;
  const waterHalf = (b / 2 + z * y) * scale;

  return (
    <div className="rounded-lg border border-slate-700 bg-slate-900/60 p-4">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        {/* water */}
        <polygon
          points={`${cx - (b / 2) * scale},${baseY} ${cx + (b / 2) * scale},${baseY} ${cx + waterHalf},${baseY - y * scale} ${cx - waterHalf},${baseY - y * scale}`}
          fill="rgba(56,189,248,0.25)"
          stroke="#38bdf8"
        />
        {/* channel */}
        <polyline
          points={`${cx - topHalf},${baseY - yMax * scale} ${cx - (b / 2) * scale},${baseY} ${cx + (b / 2) * scale},${baseY} ${cx + topHalf},${baseY - yMax * scale}`}
          fill="none"
          stroke="#94a3b8"
          strokeWidth={2}
        />
        {/* labels */}
        <text x={cx} y={baseY + 16} fill="#94a3b8" fontSize="11" textAnchor="middle">b = {b} ft</text>
        <text x={cx} y={baseY - y * scale - 6} fill="#38bdf8" fontSize="11" textAnchor="middle">water surface · y = {y.toFixed(1)} ft · T = {T.toFixed(1)} ft</text>
        <text x={cx - topHalf + 4} y={baseY - yMax * scale + 14} fill="#64748b" fontSize="10">side slope {z}:1</text>
      </svg>

      <div className="mt-2 grid grid-cols-2 gap-x-6 sm:grid-cols-5">
        <Slider label="Depth y" value={y} min={0.5} max={4} step={0.1} onChange={setY} unit="ft" />
        <Slider label="Bottom b" value={b} min={2} max={12} step={0.5} onChange={setB} unit="ft" />
        <Slider label="Side slope z" value={z} min={0} max={4} step={0.5} onChange={setZ} />
        <Slider label="Manning n" value={n} min={0.011} max={0.05} step={0.001} onChange={setN} />
        <Slider label="Slope S" value={S} min={0.0005} max={0.02} step={0.0005} onChange={setS} unit="ft/ft" />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-sm sm:grid-cols-5">
        {[
          ['A', A.toFixed(1) + ' ft²'],
          ['R = A/P', R.toFixed(2) + ' ft'],
          ['V', V.toFixed(2) + ' ft/s'],
          ['Q', Q.toFixed(0) + ' cfs'],
          ['Fr', Fr.toFixed(2)],
        ].map(([k, v]) => (
          <div key={k} className="rounded-md bg-slate-800 px-2 py-1 text-center">
            <div className="text-xs text-slate-400">{k}</div>
            <div className="font-semibold tabular-nums">{v}</div>
          </div>
        ))}
      </div>

      <div className={`mt-2 rounded-md px-3 py-2 text-sm font-medium ${Fr > 1.05 ? 'bg-rose-500/15 text-rose-300' : 'bg-emerald-500/15 text-emerald-300'}`}>
        Flow is {regime} (Fr {Fr < 1 ? '<' : '>'} 1). Q = (1.49/n)·A·R^(2/3)·S^(1/2) = {Q.toFixed(0)} cfs.
      </div>
    </div>
  );
}
