import { useState } from 'react';
import { Slider } from './Slider';

// Interactive Mohr's circle with the Mohr-Coulomb failure envelope.
export default function MohrsCircle() {
  const [s1, setS1] = useState(300);
  const [s3, setS3] = useState(100);
  const [c, setC] = useState(10);
  const [phi, setPhi] = useState(30);

  const hi = Math.max(s1, s3);
  const lo = Math.min(s1, s3);
  const center = (hi + lo) / 2;
  const radius = (hi - lo) / 2;
  const phiR = (phi * Math.PI) / 180;

  // Failure: max radius before tangency = (center + c·cotφ)·sinφ
  const cotPhi = phi === 0 ? 1e6 : 1 / Math.tan(phiR);
  const rFail = (center + c * cotPhi) * Math.sin(phiR);
  const fs = radius > 0 ? rFail / radius : Infinity;
  const failed = radius >= rFail - 0.5;

  // SVG scaling
  const W = 480;
  const H = 300;
  const pad = 40;
  const maxX = Math.max(hi * 1.15, 100);
  const sx = (x: number) => pad + (x / maxX) * (W - 2 * pad);
  const sy = (y: number) => H - pad - (y / maxX) * (W - 2 * pad);

  // envelope line: τ = c + σ tanφ
  const envX2 = maxX;
  return (
    <div className="rounded-lg border border-slate-700 bg-slate-900/60 p-4">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        {/* axes */}
        <line x1={pad} y1={H - pad} x2={W - pad} y2={H - pad} stroke="#64748b" />
        <line x1={pad} y1={H - pad} x2={pad} y2={pad} stroke="#64748b" />
        <text x={W - pad} y={H - pad + 18} fill="#94a3b8" fontSize="11" textAnchor="end">σ′ (normal)</text>
        <text x={pad - 6} y={pad} fill="#94a3b8" fontSize="11" textAnchor="end">τ (shear)</text>

        {/* failure envelope */}
        <line
          x1={sx(0)}
          y1={sy(c)}
          x2={sx(envX2)}
          y2={sy(c + envX2 * Math.tan(phiR))}
          stroke={failed ? '#f87171' : '#34d399'}
          strokeWidth={2}
          strokeDasharray="5 4"
        />
        <text x={sx(envX2)} y={sy(c + envX2 * Math.tan(phiR)) - 6} fill={failed ? '#f87171' : '#34d399'} fontSize="11" textAnchor="end">
          τ = c′ + σ′ tanφ′
        </text>

        {/* Mohr circle */}
        <circle
          cx={sx(center)}
          cy={sy(0)}
          r={(radius / maxX) * (W - 2 * pad)}
          fill="rgba(51,123,255,0.12)"
          stroke="#599fff"
          strokeWidth={2}
        />
        {/* principal stress points */}
        <circle cx={sx(lo)} cy={sy(0)} r={4} fill="#93c5fd" />
        <circle cx={sx(hi)} cy={sy(0)} r={4} fill="#93c5fd" />
        <text x={sx(lo)} y={sy(0) + 16} fill="#93c5fd" fontSize="10" textAnchor="middle">σ₃</text>
        <text x={sx(hi)} y={sy(0) + 16} fill="#93c5fd" fontSize="10" textAnchor="middle">σ₁</text>
      </svg>

      <div className="mt-2 grid grid-cols-2 gap-x-6 gap-y-1 sm:grid-cols-4">
        <Slider label="σ₁" value={s1} min={lo} max={600} onChange={(v) => setS1(Math.max(v, s3))} unit="kPa" />
        <Slider label="σ₃" value={s3} min={0} max={400} onChange={(v) => setS3(Math.min(v, s1))} unit="kPa" />
        <Slider label="c′" value={c} min={0} max={80} onChange={setC} unit="kPa" />
        <Slider label="φ′" value={phi} min={0} max={45} onChange={setPhi} unit="°" />
      </div>

      <div className={`mt-3 rounded-md px-3 py-2 text-sm font-medium ${failed ? 'bg-rose-500/15 text-rose-300' : 'bg-emerald-500/15 text-emerald-300'}`}>
        {failed
          ? 'FAILURE — the stress circle has reached the strength envelope.'
          : `Stable. Factor of safety on deviator ≈ ${isFinite(fs) ? fs.toFixed(2) : '∞'}.`}
        <span className="ml-2 text-slate-400">center s = {center.toFixed(0)}, radius t = {radius.toFixed(0)} kPa</span>
      </div>
    </div>
  );
}
