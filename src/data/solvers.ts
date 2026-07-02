// ---------------------------------------------------------------------------
// MathLab guided solvers: parameterized engineering calculators that show the
// full worked computation, step by step, exactly as you'd write it on scratch
// paper during the exam.
// ---------------------------------------------------------------------------

export interface SolverInput {
  key: string;
  label: string;
  unit?: string;
  default: number;
  min?: number;
  max?: number;
  step?: number;
}

export interface SolverStep {
  label: string;
  tex?: string; // KaTeX, already substituted with numbers
  value?: string; // formatted "x = 12.3 unit"
}

export interface Solver {
  id: string;
  category: 'Geotechnical' | 'Seismic' | 'Surveying';
  title: string;
  description: string;
  inputs: SolverInput[];
  compute: (v: Record<string, number>) => SolverStep[];
}

const r = (n: number, d = 3) =>
  Number.isFinite(n) ? Number(n.toPrecision(d + 2)).toLocaleString('en-US', { maximumFractionDigits: d }) : '—';
const DEG = Math.PI / 180;

export const SOLVERS: Solver[] = [
  // ------------------------------ GEOTECH ------------------------------
  {
    id: 'sv-effective-stress',
    category: 'Geotechnical',
    title: 'Effective stress at depth',
    description: 'Two-layer profile with a water table: total stress, pore pressure, effective stress.',
    inputs: [
      { key: 'dw', label: 'Water table depth', unit: 'm', default: 3, min: 0, max: 30, step: 0.5 },
      { key: 'z', label: 'Depth of interest', unit: 'm', default: 8, min: 0.5, max: 30, step: 0.5 },
      { key: 'gm', label: 'Moist γ (above WT)', unit: 'kN/m³', default: 17, min: 12, max: 23, step: 0.5 },
      { key: 'gs', label: 'Saturated γ (below WT)', unit: 'kN/m³', default: 20, min: 14, max: 24, step: 0.5 },
    ],
    compute: ({ dw, z, gm, gs }) => {
      const above = Math.min(z, dw);
      const below = Math.max(0, z - dw);
      const sigma = gm * above + gs * below;
      const u = 9.81 * below;
      const eff = sigma - u;
      return [
        { label: 'Total stress: sum γ·h down to the point', tex: `\\sigma = ${r(gm)}(${r(above)}) + ${r(gs)}(${r(below)}) = ${r(sigma)}\\ \\text{kPa}` },
        { label: 'Pore pressure: water column above the point', tex: `u = 9.81(${r(below)}) = ${r(u)}\\ \\text{kPa}` },
        { label: 'Effective stress (Terzaghi)', tex: `\\sigma' = ${r(sigma)} - ${r(u)} = \\mathbf{${r(eff)}}\\ \\text{kPa}`, value: `σ′ = ${r(eff)} kPa` },
      ];
    },
  },
  {
    id: 'sv-bearing',
    category: 'Geotechnical',
    title: 'Bearing capacity (shallow)',
    description: 'General equation with Meyerhof/Vesić factors computed from φ; FS applied.',
    inputs: [
      { key: 'c', label: 'Cohesion c', unit: 'kPa', default: 0, min: 0, max: 200, step: 5 },
      { key: 'phi', label: 'Friction angle φ', unit: '°', default: 30, min: 0, max: 45, step: 1 },
      { key: 'gamma', label: 'Unit weight γ', unit: 'kN/m³', default: 18, min: 12, max: 24, step: 0.5 },
      { key: 'B', label: 'Footing width B', unit: 'm', default: 2, min: 0.5, max: 6, step: 0.25 },
      { key: 'Df', label: 'Embedment Df', unit: 'm', default: 1, min: 0, max: 5, step: 0.25 },
      { key: 'FS', label: 'Factor of safety', default: 3, min: 1, max: 5, step: 0.5 },
    ],
    compute: ({ c, phi, gamma, B, Df, FS }) => {
      const p = phi * DEG;
      const Nq = phi === 0 ? 1 : Math.exp(Math.PI * Math.tan(p)) * Math.tan(Math.PI / 4 + p / 2) ** 2;
      const Nc = phi === 0 ? 5.14 : (Nq - 1) / Math.tan(p);
      const Ng = phi === 0 ? 0 : 2 * (Nq + 1) * Math.tan(p);
      const q = gamma * Df;
      const qult = c * Nc + q * Nq + 0.5 * gamma * B * Ng;
      const qall = qult / FS;
      return [
        { label: 'Bearing factors from φ (Vesić)', tex: `N_q = e^{\\pi\\tan\\phi}\\tan^2(45+\\tfrac{\\phi}{2}) = ${r(Nq)},\\quad N_c = ${r(Nc)},\\quad N_\\gamma = ${r(Ng)}` },
        { label: 'Surcharge at footing base', tex: `q = \\gamma D_f = ${r(gamma)}(${r(Df)}) = ${r(q)}\\ \\text{kPa}` },
        { label: 'Ultimate bearing capacity (strip)', tex: `q_{ult} = ${r(c)}(${r(Nc)}) + ${r(q)}(${r(Nq)}) + \\tfrac12(${r(gamma)})(${r(B)})(${r(Ng)}) = \\mathbf{${r(qult)}}\\ \\text{kPa}` },
        { label: 'Allowable bearing', tex: `q_{all} = ${r(qult)}/${r(FS)} = \\mathbf{${r(qall)}}\\ \\text{kPa}`, value: `q_all = ${r(qall)} kPa` },
      ];
    },
  },
  {
    id: 'sv-rankine',
    category: 'Geotechnical',
    title: 'Rankine thrust on a wall',
    description: 'Active/passive coefficients and resultant thrusts, with optional uniform surcharge.',
    inputs: [
      { key: 'H', label: 'Wall height H', unit: 'm', default: 5, min: 1, max: 15, step: 0.5 },
      { key: 'gamma', label: 'Backfill γ', unit: 'kN/m³', default: 18, min: 12, max: 23, step: 0.5 },
      { key: 'phi', label: 'Friction angle φ', unit: '°', default: 32, min: 20, max: 45, step: 1 },
      { key: 'qs', label: 'Surcharge q', unit: 'kPa', default: 0, min: 0, max: 100, step: 5 },
    ],
    compute: ({ H, gamma, phi, qs }) => {
      const Ka = Math.tan((45 - phi / 2) * DEG) ** 2;
      const Kp = Math.tan((45 + phi / 2) * DEG) ** 2;
      const Pa = 0.5 * Ka * gamma * H * H;
      const Pq = Ka * qs * H;
      const total = Pa + Pq;
      const ybar = (Pa * (H / 3) + Pq * (H / 2)) / (total || 1);
      return [
        { label: 'Coefficients', tex: `K_a = \\tan^2(45-\\tfrac{${r(phi)}}{2}) = ${r(Ka)},\\qquad K_p = ${r(Kp)}` },
        { label: 'Soil thrust (triangle, acts at H/3)', tex: `P_a = \\tfrac12(${r(Ka)})(${r(gamma)})(${r(H)})^2 = ${r(Pa)}\\ \\text{kN/m}` },
        { label: 'Surcharge thrust (rectangle, acts at H/2)', tex: `P_q = ${r(Ka)}(${r(qs)})(${r(H)}) = ${r(Pq)}\\ \\text{kN/m}` },
        { label: 'Total thrust and line of action', tex: `P = \\mathbf{${r(total)}}\\ \\text{kN/m at } \\bar{y} = ${r(ybar)}\\ \\text{m above base}`, value: `P = ${r(total)} kN/m` },
      ];
    },
  },
  {
    id: 'sv-consolidation',
    category: 'Geotechnical',
    title: 'Consolidation settlement (NC/OC)',
    description: 'Handles recompression, virgin compression, or both when loading crosses σ′c.',
    inputs: [
      { key: 'H', label: 'Layer thickness H', unit: 'm', default: 4, min: 0.5, max: 20, step: 0.5 },
      { key: 'e0', label: 'Initial void ratio e₀', default: 0.9, min: 0.3, max: 2.5, step: 0.05 },
      { key: 'Cc', label: 'Compression index Cc', default: 0.3, min: 0.05, max: 1, step: 0.01 },
      { key: 'Cr', label: 'Recompression index Cr', default: 0.05, min: 0.01, max: 0.2, step: 0.01 },
      { key: 's0', label: 'Initial σ′₀ (mid-layer)', unit: 'kPa', default: 100, min: 10, max: 500, step: 10 },
      { key: 'sc', label: 'Preconsolidation σ′c', unit: 'kPa', default: 100, min: 10, max: 800, step: 10 },
      { key: 'ds', label: 'Added stress Δσ', unit: 'kPa', default: 100, min: 0, max: 500, step: 10 },
    ],
    compute: ({ H, e0, Cc, Cr, s0, sc, ds }) => {
      const sf = s0 + ds;
      const ocr = sc / s0;
      const steps: SolverStep[] = [
        { label: 'Overconsolidation check', tex: `OCR = \\sigma'_c/\\sigma'_0 = ${r(sc)}/${r(s0)} = ${r(ocr)} \\Rightarrow \\text{${ocr <= 1.01 ? 'normally consolidated' : 'overconsolidated'}}` },
      ];
      let S: number;
      if (ocr <= 1.01) {
        S = (Cc / (1 + e0)) * H * Math.log10(sf / s0);
        steps.push({ label: 'Virgin compression (Cc)', tex: `S_c = \\dfrac{${r(Cc)}}{1+${r(e0)}}(${r(H)})\\log\\dfrac{${r(sf)}}{${r(s0)}} = \\mathbf{${r(S)}}\\ \\text{m}` });
      } else if (sf <= sc) {
        S = (Cr / (1 + e0)) * H * Math.log10(sf / s0);
        steps.push({ label: 'Stays below σ′c → recompression only (Cr)', tex: `S_c = \\dfrac{${r(Cr)}}{1+${r(e0)}}(${r(H)})\\log\\dfrac{${r(sf)}}{${r(s0)}} = \\mathbf{${r(S)}}\\ \\text{m}` });
      } else {
        const S1 = (Cr / (1 + e0)) * H * Math.log10(sc / s0);
        const S2 = (Cc / (1 + e0)) * H * Math.log10(sf / sc);
        S = S1 + S2;
        steps.push({ label: 'Recompression up to σ′c (Cr)', tex: `S_1 = \\dfrac{${r(Cr)}}{1+${r(e0)}}(${r(H)})\\log\\dfrac{${r(sc)}}{${r(s0)}} = ${r(S1)}\\ \\text{m}` });
        steps.push({ label: 'Virgin beyond σ′c (Cc)', tex: `S_2 = \\dfrac{${r(Cc)}}{1+${r(e0)}}(${r(H)})\\log\\dfrac{${r(sf)}}{${r(sc)}} = ${r(S2)}\\ \\text{m}` });
      }
      steps.push({ label: 'Settlement', value: `Sc = ${r(S * 1000)} mm` });
      return steps;
    },
  },
  {
    id: 'sv-timerate',
    category: 'Geotechnical',
    title: 'Consolidation time rate',
    description: 'Time to reach a degree of consolidation U, with single or double drainage.',
    inputs: [
      { key: 'H', label: 'Layer thickness', unit: 'm', default: 4, min: 0.5, max: 20, step: 0.5 },
      { key: 'double', label: 'Double drainage? (1=yes, 0=no)', default: 1, min: 0, max: 1, step: 1 },
      { key: 'cv', label: 'cv', unit: 'm²/yr', default: 1.5, min: 0.1, max: 20, step: 0.1 },
      { key: 'U', label: 'Target U', unit: '%', default: 90, min: 10, max: 95, step: 5 },
    ],
    compute: ({ H, double: dbl, cv, U }) => {
      const Tv = U < 60 ? (Math.PI / 4) * Math.pow(U / 100, 2) : 1.781 - 0.933 * Math.log10(100 - U);
      const Hdr = dbl >= 0.5 ? H / 2 : H;
      const t = (Tv * Hdr * Hdr) / cv;
      return [
        { label: 'Time factor from U', tex: U < 60 ? `T_v = \\tfrac{\\pi}{4}\\left(\\tfrac{${r(U)}}{100}\\right)^2 = ${r(Tv)}` : `T_v = 1.781 - 0.933\\log(100-${r(U)}) = ${r(Tv)}` },
        { label: `Drainage path (${dbl >= 0.5 ? 'double' : 'single'} drainage)`, tex: `H_{dr} = ${dbl >= 0.5 ? `${r(H)}/2 = ${r(Hdr)}` : r(Hdr)}\\ \\text{m}` },
        { label: 'Time', tex: `t = \\dfrac{T_v H_{dr}^2}{c_v} = \\dfrac{${r(Tv)}(${r(Hdr)})^2}{${r(cv)}} = \\mathbf{${r(t)}}\\ \\text{yr}`, value: `t = ${r(t)} years` },
      ];
    },
  },
  {
    id: 'sv-pile',
    category: 'Geotechnical',
    title: 'Pile capacity (α-method, clay)',
    description: 'Skin friction plus end bearing for a pile in clay, with FS.',
    inputs: [
      { key: 'D', label: 'Diameter', unit: 'm', default: 0.4, min: 0.2, max: 2, step: 0.05 },
      { key: 'L', label: 'Length', unit: 'm', default: 12, min: 3, max: 40, step: 1 },
      { key: 'su', label: 'Undrained strength su', unit: 'kPa', default: 60, min: 10, max: 300, step: 5 },
      { key: 'alpha', label: 'Adhesion factor α', default: 0.55, min: 0.2, max: 1, step: 0.05 },
      { key: 'FS', label: 'Factor of safety', default: 2.5, min: 1.5, max: 4, step: 0.25 },
    ],
    compute: ({ D, L, su, alpha, FS }) => {
      const As = Math.PI * D * L;
      const Ap = (Math.PI * D * D) / 4;
      const Qs = alpha * su * As;
      const Qp = 9 * su * Ap;
      const Qu = Qs + Qp;
      const Qa = Qu / FS;
      return [
        { label: 'Shaft & tip areas', tex: `A_s = \\pi D L = ${r(As)}\\ \\text{m}^2,\\qquad A_p = \\tfrac{\\pi D^2}{4} = ${r(Ap)}\\ \\text{m}^2` },
        { label: 'Skin friction (α-method)', tex: `Q_s = \\alpha s_u A_s = ${r(alpha)}(${r(su)})(${r(As)}) = ${r(Qs)}\\ \\text{kN}` },
        { label: 'End bearing (Nc = 9)', tex: `Q_p = 9 s_u A_p = 9(${r(su)})(${r(Ap)}) = ${r(Qp)}\\ \\text{kN}` },
        { label: 'Ultimate and allowable', tex: `Q_u = ${r(Qu)}\\ \\text{kN};\\qquad Q_{all} = ${r(Qu)}/${r(FS)} = \\mathbf{${r(Qa)}}\\ \\text{kN}`, value: `Q_all = ${r(Qa)} kN` },
      ];
    },
  },
  {
    id: 'sv-infinite-slope',
    category: 'Geotechnical',
    title: 'Infinite slope FS',
    description: 'Dry and full-seepage factor of safety for a cohesionless infinite slope.',
    inputs: [
      { key: 'phi', label: 'Friction angle φ', unit: '°', default: 34, min: 20, max: 45, step: 1 },
      { key: 'beta', label: 'Slope angle β', unit: '°', default: 20, min: 5, max: 40, step: 1 },
      { key: 'gsat', label: 'Saturated γ', unit: 'kN/m³', default: 20, min: 15, max: 23, step: 0.5 },
    ],
    compute: ({ phi, beta, gsat }) => {
      const dry = Math.tan(phi * DEG) / Math.tan(beta * DEG);
      const wet = ((gsat - 9.81) / gsat) * dry;
      return [
        { label: 'Dry slope', tex: `FS = \\dfrac{\\tan${r(phi)}^\\circ}{\\tan${r(beta)}^\\circ} = \\mathbf{${r(dry)}}` },
        { label: 'Seepage parallel to slope', tex: `FS = \\dfrac{\\gamma'}{\\gamma_{sat}}\\cdot\\dfrac{\\tan\\phi}{\\tan\\beta} = \\dfrac{${r(gsat - 9.81)}}{${r(gsat)}}(${r(dry)}) = \\mathbf{${r(wet)}}`, value: `FS(dry) = ${r(dry)}, FS(seepage) = ${r(wet)}` },
        { label: wet < 1 ? '⚠ Unstable with seepage — drainage is decisive.' : 'Stable in both conditions.' },
      ];
    },
  },

  // ------------------------------ SEISMIC ------------------------------
  {
    id: 'sv-baseshear',
    category: 'Seismic',
    title: 'ELF base shear (full Cs check)',
    description: 'Computes Cs with the base value, upper (period) limit, and minimum — shows which governs.',
    inputs: [
      { key: 'sds', label: 'SDS', unit: 'g', default: 1.0, min: 0.2, max: 2, step: 0.05 },
      { key: 'sd1', label: 'SD1', unit: 'g', default: 0.6, min: 0.1, max: 1.2, step: 0.05 },
      { key: 'R', label: 'R', default: 8, min: 1.5, max: 8, step: 0.5 },
      { key: 'Ie', label: 'Ie', default: 1.0, min: 1, max: 1.5, step: 0.25 },
      { key: 'T', label: 'Period T', unit: 's', default: 0.8, min: 0.1, max: 4, step: 0.05 },
      { key: 'W', label: 'Seismic weight W', unit: 'kip', default: 4000, min: 100, max: 50000, step: 100 },
    ],
    compute: ({ sds, sd1, R, Ie, T, W }) => {
      const base = sds / (R / Ie);
      const upper = sd1 / (T * (R / Ie));
      const minv = Math.max(0.044 * sds * Ie, 0.01);
      const cs = Math.max(Math.min(base, upper), minv);
      const gov = cs === minv && minv > Math.min(base, upper) ? 'minimum' : upper < base ? 'upper (period) limit' : 'base value';
      const V = cs * W;
      return [
        { label: 'Base value', tex: `C_s = \\dfrac{S_{DS}}{R/I_e} = \\dfrac{${r(sds)}}{${r(R / Ie)}} = ${r(base, 4)}` },
        { label: 'Upper limit (T ≤ TL)', tex: `C_{s,max} = \\dfrac{S_{D1}}{T(R/I_e)} = \\dfrac{${r(sd1)}}{${r(T)}(${r(R / Ie)})} = ${r(upper, 4)}` },
        { label: 'Minimum', tex: `C_{s,min} = 0.044 S_{DS} I_e = ${r(minv, 4)} \\ge 0.01` },
        { label: `Governing: ${gov}`, tex: `C_s = ${r(cs, 4)}` },
        { label: 'Base shear', tex: `V = C_s W = ${r(cs, 4)}(${r(W)}) = \\mathbf{${r(V)}}\\ \\text{kip}`, value: `V = ${r(V)} kip` },
      ];
    },
  },
  {
    id: 'sv-fp',
    category: 'Seismic',
    title: 'Component force Fp (with bounds)',
    description: 'Nonstructural component seismic force with the floor/ceiling checks.',
    inputs: [
      { key: 'ap', label: 'ap', default: 1.0, min: 1, max: 2.5, step: 0.25 },
      { key: 'Rp', label: 'Rp', default: 2.5, min: 1, max: 12, step: 0.5 },
      { key: 'Ip', label: 'Ip', default: 1.0, min: 1, max: 1.5, step: 0.5 },
      { key: 'sds', label: 'SDS', unit: 'g', default: 1.0, min: 0.2, max: 2, step: 0.05 },
      { key: 'Wp', label: 'Wp', unit: 'kip', default: 2, min: 0.1, max: 100, step: 0.1 },
      { key: 'zh', label: 'z/h (0=base, 1=roof)', default: 1, min: 0, max: 1, step: 0.1 },
    ],
    compute: ({ ap, Rp, Ip, sds, Wp, zh }) => {
      const fp = ((0.4 * ap * sds * Wp) / (Rp / Ip)) * (1 + 2 * zh);
      const lo = 0.3 * sds * Ip * Wp;
      const hi = 1.6 * sds * Ip * Wp;
      const gov = Math.min(Math.max(fp, lo), hi);
      const which = gov === fp ? 'computed value' : gov === lo ? 'lower bound' : 'upper bound';
      return [
        { label: 'Computed Fp', tex: `F_p = \\dfrac{0.4(${r(ap)})(${r(sds)})(${r(Wp)})}{${r(Rp)}/${r(Ip)}}(1+2\\cdot${r(zh)}) = ${r(fp)}\\ \\text{kip}` },
        { label: 'Bounds', tex: `${r(lo)} \\le F_p \\le ${r(hi)}` },
        { label: `Governing: ${which}`, tex: `F_p = \\mathbf{${r(gov)}}\\ \\text{kip}`, value: `Fp = ${r(gov)} kip` },
      ];
    },
  },
  {
    id: 'sv-spectrum-params',
    category: 'Seismic',
    title: 'Design spectrum parameters',
    description: 'From mapped Ss, S1 and site coefficients to SDS, SD1, T0, Ts.',
    inputs: [
      { key: 'Ss', label: 'Ss (mapped)', unit: 'g', default: 1.5, min: 0.2, max: 3, step: 0.05 },
      { key: 'S1', label: 'S1 (mapped)', unit: 'g', default: 0.6, min: 0.1, max: 1.5, step: 0.05 },
      { key: 'Fa', label: 'Fa', default: 1.0, min: 0.8, max: 2.5, step: 0.1 },
      { key: 'Fv', label: 'Fv', default: 1.5, min: 0.8, max: 3.5, step: 0.1 },
    ],
    compute: ({ Ss, S1, Fa, Fv }) => {
      const sms = Fa * Ss, sm1 = Fv * S1;
      const sds = (2 / 3) * sms, sd1 = (2 / 3) * sm1;
      const ts = sd1 / sds, t0 = 0.2 * ts;
      return [
        { label: 'Site-modified MCER', tex: `S_{MS} = ${r(Fa)}(${r(Ss)}) = ${r(sms)},\\qquad S_{M1} = ${r(Fv)}(${r(S1)}) = ${r(sm1)}` },
        { label: 'Design values (×2/3)', tex: `S_{DS} = ${r(sds)}\\ g,\\qquad S_{D1} = ${r(sd1)}\\ g` },
        { label: 'Spectrum corners', tex: `T_S = S_{D1}/S_{DS} = ${r(ts)}\\ \\text{s},\\qquad T_0 = 0.2T_S = ${r(t0)}\\ \\text{s}`, value: `SDS = ${r(sds)} g, SD1 = ${r(sd1)} g` },
      ];
    },
  },

  // ------------------------------ SURVEYING ------------------------------
  {
    id: 'sv-hcurve',
    category: 'Surveying',
    title: 'Horizontal curve + stationing',
    description: 'All curve elements from R and Δ, plus PC/PT stations from the PI.',
    inputs: [
      { key: 'R', label: 'Radius R', unit: 'ft', default: 1000, min: 100, max: 6000, step: 50 },
      { key: 'delta', label: 'Δ', unit: '°', default: 24, min: 2, max: 120, step: 1 },
      { key: 'pi', label: 'PI station', unit: 'ft', default: 4500, min: 0, max: 100000, step: 50 },
    ],
    compute: ({ R, delta, pi }) => {
      const T = R * Math.tan((delta / 2) * DEG);
      const L = (Math.PI * R * delta) / 180;
      const LC = 2 * R * Math.sin((delta / 2) * DEG);
      const M = R * (1 - Math.cos((delta / 2) * DEG));
      const E = R * (1 / Math.cos((delta / 2) * DEG) - 1);
      const pc = pi - T;
      const pt = pc + L;
      const sta = (x: number) => `${Math.floor(x / 100)}+${(x % 100).toFixed(2).padStart(5, '0')}`;
      return [
        { label: 'Tangent & length', tex: `T = ${r(R)}\\tan${r(delta / 2)}^\\circ = ${r(T)};\\qquad L = \\dfrac{\\pi(${r(R)})(${r(delta)})}{180} = ${r(L)}` },
        { label: 'Chord, middle ordinate, external', tex: `LC = ${r(LC)},\\quad M = ${r(M)},\\quad E = ${r(E)}\\ \\text{ft}` },
        { label: 'Stationing (PT = PC + L, not PI + T!)', tex: `PC = ${r(pi)} - ${r(T)} = ${r(pc)};\\qquad PT = ${r(pc)} + ${r(L)} = ${r(pt)}`, value: `PC = sta ${sta(pc)}, PT = sta ${sta(pt)}` },
      ];
    },
  },
  {
    id: 'sv-vcurve',
    category: 'Surveying',
    title: 'Vertical curve elevations',
    description: 'Elevation at any point plus the high/low turning point.',
    inputs: [
      { key: 'g1', label: 'Grade in g₁', unit: '%', default: -3, min: -10, max: 10, step: 0.5 },
      { key: 'g2', label: 'Grade out g₂', unit: '%', default: 2, min: -10, max: 10, step: 0.5 },
      { key: 'L', label: 'Curve length L', unit: 'ft', default: 500, min: 100, max: 3000, step: 50 },
      { key: 'ebvc', label: 'BVC elevation', unit: 'ft', default: 100, min: 0, max: 10000, step: 1 },
      { key: 'x', label: 'Distance from BVC', unit: 'ft', default: 300, min: 0, max: 3000, step: 10 },
    ],
    compute: ({ g1, g2, L, ebvc, x }) => {
      const A = g2 - g1;
      const elev = ebvc + (g1 / 100) * x + (A / 100 / (2 * L)) * x * x;
      const xt = (-g1 * L) / A;
      const hasTurn = xt > 0 && xt < L && Math.sign(g1) !== Math.sign(g2);
      const et = hasTurn ? ebvc + (g1 / 100) * xt + (A / 100 / (2 * L)) * xt * xt : NaN;
      const steps: SolverStep[] = [
        { label: 'Grade change', tex: `A = g_2 - g_1 = ${r(g2)} - (${r(g1)}) = ${r(A)}\\%` },
        { label: `Elevation at x = ${r(x)} ft`, tex: `Elev = ${r(ebvc)} + \\tfrac{${r(g1)}}{100}(${r(x)}) + \\tfrac{${r(A)}/100}{2(${r(L)})}(${r(x)})^2 = \\mathbf{${r(elev)}}\\ \\text{ft}`, value: `Elev(x) = ${r(elev)} ft` },
      ];
      if (hasTurn) {
        steps.push({ label: `${g1 < 0 ? 'Low' : 'High'} point`, tex: `x_t = \\dfrac{-g_1 L}{A} = ${r(xt)}\\ \\text{ft};\\qquad Elev_t = ${r(et)}\\ \\text{ft}` });
      } else {
        steps.push({ label: 'No turning point on the curve (grades do not change sign).' });
      }
      return steps;
    },
  },
  {
    id: 'sv-traverse',
    category: 'Surveying',
    title: 'Traverse closure & precision',
    description: 'Linear error of closure and relative precision from misclosures.',
    inputs: [
      { key: 'lat', label: 'Σ latitudes', unit: 'ft', default: 0.12, min: -5, max: 5, step: 0.01 },
      { key: 'dep', label: 'Σ departures', unit: 'ft', default: -0.16, min: -5, max: 5, step: 0.01 },
      { key: 'per', label: 'Perimeter', unit: 'ft', default: 3000, min: 100, max: 50000, step: 100 },
    ],
    compute: ({ lat, dep, per }) => {
      const lec = Math.hypot(lat, dep);
      const prec = per / (lec || 1e-9);
      return [
        { label: 'Linear error of closure', tex: `LEC = \\sqrt{(${r(lat)})^2 + (${r(dep)})^2} = ${r(lec)}\\ \\text{ft}` },
        { label: 'Relative precision', tex: `\\dfrac{${r(lec)}}{${r(per)}} = 1:${Math.round(prec).toLocaleString()}`, value: `1 : ${Math.round(prec).toLocaleString()}` },
        { label: prec >= 10000 ? 'Meets typical 1:10,000 boundary standard.' : '⚠ Below typical 1:10,000 standard — check for blunders.' },
      ];
    },
  },
  {
    id: 'sv-earthwork',
    category: 'Surveying',
    title: 'Earthwork volume',
    description: 'Average-end-area and prismoidal volumes between two stations.',
    inputs: [
      { key: 'A1', label: 'End area A₁', unit: 'ft²', default: 250, min: 0, max: 20000, step: 10 },
      { key: 'A2', label: 'End area A₂', unit: 'ft²', default: 310, min: 0, max: 20000, step: 10 },
      { key: 'Am', label: 'Midpoint area Am', unit: 'ft²', default: 280, min: 0, max: 20000, step: 10 },
      { key: 'L', label: 'Distance L', unit: 'ft', default: 100, min: 10, max: 1000, step: 10 },
    ],
    compute: ({ A1, A2, Am, L }) => {
      const aea = (L / 2) * (A1 + A2);
      const pris = (L / 6) * (A1 + 4 * Am + A2);
      return [
        { label: 'Average end area', tex: `V = \\tfrac{${r(L)}}{2}(${r(A1)}+${r(A2)}) = ${r(aea)}\\ \\text{ft}^3 = ${r(aea / 27)}\\ \\text{yd}^3` },
        { label: 'Prismoidal', tex: `V = \\tfrac{${r(L)}}{6}(${r(A1)}+4(${r(Am)})+${r(A2)}) = ${r(pris)}\\ \\text{ft}^3 = \\mathbf{${r(pris / 27)}}\\ \\text{yd}^3`, value: `AEA = ${r(aea / 27)} yd³ · prismoidal = ${r(pris / 27)} yd³` },
      ];
    },
  },
];

export const SOLVER_CATEGORIES = ['Geotechnical', 'Seismic', 'Surveying'] as const;
