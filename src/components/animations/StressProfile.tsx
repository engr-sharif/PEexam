import { useState } from 'react';
import { Slider } from './Slider';

// Effective-stress profile: drag the water table; read σ, u, σ′ with depth.
export default function StressProfile() {
  const [wt, setWt] = useState(3); // water table depth (m)
  const totalDepth = 10;
  const gammaMoist = 17;
  const gammaSat = 20;
  const gammaW = 9.81;

  const sigma = (z: number) => {
    if (z <= wt) return gammaMoist * z;
    return gammaMoist * wt + gammaSat * (z - wt);
  };
  const u = (z: number) => (z <= wt ? 0 : gammaW * (z - wt));
  const eff = (z: number) => sigma(z) - u(z);

  const W = 480;
  const H = 300;
  const pad = 40;
  const maxStress = sigma(totalDepth) * 1.1;
  const sx = (s: number) => pad + (s / maxStress) * (W - 2 * pad);
  const dy = (z: number) => pad + (z / totalDepth) * (H - 2 * pad);

  const line = (fn: (z: number) => number) => {
    const pts: string[] = [];
    for (let z = 0; z <= totalDepth; z += 0.5) pts.push(`${sx(fn(z))},${dy(z)}`);
    return pts.join(' ');
  };

  const probe = 8;
  return (
    <div className="rounded-lg border border-slate-700 bg-slate-900/60 p-4">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        {/* depth axis */}
        <line x1={pad} y1={pad} x2={pad} y2={H - pad} stroke="#64748b" />
        <line x1={pad} y1={pad} x2={W - pad} y2={pad} stroke="#64748b" />
        <text x={pad - 6} y={H - pad} fill="#94a3b8" fontSize="11" textAnchor="end">depth</text>
        <text x={W - pad} y={pad - 6} fill="#94a3b8" fontSize="11" textAnchor="end">stress (kPa)</text>

        {/* water table */}
        <line x1={pad} y1={dy(wt)} x2={W - pad} y2={dy(wt)} stroke="#38bdf8" strokeDasharray="4 3" />
        <text x={W - pad} y={dy(wt) - 4} fill="#38bdf8" fontSize="11" textAnchor="end">▽ water table {wt} m</text>

        <polyline points={line(sigma)} fill="none" stroke="#f59e0b" strokeWidth={2} />
        <polyline points={line(u)} fill="none" stroke="#38bdf8" strokeWidth={2} />
        <polyline points={line(eff)} fill="none" stroke="#34d399" strokeWidth={2} />

        {/* probe at depth */}
        <line x1={pad} y1={dy(probe)} x2={W - pad} y2={dy(probe)} stroke="#475569" strokeDasharray="2 2" />
        <circle cx={sx(sigma(probe))} cy={dy(probe)} r={3} fill="#f59e0b" />
        <circle cx={sx(u(probe))} cy={dy(probe)} r={3} fill="#38bdf8" />
        <circle cx={sx(eff(probe))} cy={dy(probe)} r={3} fill="#34d399" />
      </svg>

      <div className="flex flex-wrap items-center gap-4 text-xs">
        <span className="flex items-center gap-1"><span className="inline-block h-2 w-3 bg-amber-500" /> σ total</span>
        <span className="flex items-center gap-1"><span className="inline-block h-2 w-3 bg-sky-400" /> u pore</span>
        <span className="flex items-center gap-1"><span className="inline-block h-2 w-3 bg-emerald-400" /> σ′ effective</span>
      </div>

      <div className="mt-2">
        <Slider label="Water table depth" value={wt} min={0} max={totalDepth} step={0.5} onChange={setWt} unit="m" />
      </div>

      <div className="mt-2 rounded-md bg-slate-800 px-3 py-2 text-sm text-slate-300">
        At z = {probe} m: σ = {sigma(probe).toFixed(1)}, u = {u(probe).toFixed(1)}, σ′ ={' '}
        <span className="font-semibold text-emerald-300">{eff(probe).toFixed(1)} kPa</span>.
        Raise the water table and watch σ′ drop.
      </div>
    </div>
  );
}
