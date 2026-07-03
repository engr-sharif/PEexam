import type { ExamId, LessonBlock } from '../types';
import { WRE_REFERENCE } from './reference-wre';

// ---------------------------------------------------------------------------
// In-app reference handbook. This is an ORIGINAL study compilation of the key
// equations, tables, factors, and constants you will have access to on each
// exam (the NCEES PE Civil Reference Handbook for the PE exam; ASCE 7-16 / CBC
// for CA Seismic; standard surveying references for CA Surveying).
//
// It is NOT a copy of the copyrighted NCEES handbook — get that free from your
// MyNCEES account. Use this to drill the formulas so you can find them fast.
// ---------------------------------------------------------------------------

export interface RefEntry {
  id: string;
  exams: ExamId[];
  category: string;
  title: string;
  keywords: string[];
  blocks: LessonBlock[];
}

export const REFERENCE: RefEntry[] = [
  // ---------------------- General / units ----------------------
  {
    id: 'ref-units',
    exams: ['pe-geotech', 'ca-seismic', 'ca-surveying'],
    category: 'General',
    title: 'Unit conversions & constants',
    keywords: ['units', 'conversion', 'gamma water', 'gravity', 'acre', 'kip'],
    blocks: [
      {
        kind: 'table',
        headers: ['Quantity', 'USCS', 'SI'],
        rows: [
          ['Unit weight of water γw', '62.4 pcf', '9.81 kN/m³'],
          ['Gravity g', '32.2 ft/s²', '9.81 m/s²'],
          ['Atmospheric pressure', '2116 psf (14.7 psi)', '101.3 kPa'],
          ['Length', '1 ft = 0.3048 m', '1 m = 3.281 ft'],
          ['Pressure', '1 ksf = 47.88 kPa', '1 kPa = 20.89 psf'],
          ['Force', '1 kip = 4.448 kN', '1 kN = 224.8 lb'],
          ['Volume', '1 yd³ = 27 ft³', '1 m³ = 1.308 yd³'],
          ['Area', '1 acre = 43,560 ft²', '1 ha = 2.471 acre'],
          ['Angle', '1 rad = 57.2958°', '1° = 0.01745 rad'],
        ],
      },
    ],
  },

  // ---------------------- Geotech: index ----------------------
  {
    id: 'ref-phase',
    exams: ['pe-geotech'],
    category: 'Soil Mechanics',
    title: 'Phase relationships & index properties',
    keywords: ['void ratio', 'porosity', 'water content', 'saturation', 'unit weight', 'specific gravity'],
    blocks: [
      { kind: 'formula', tex: 'e = \\dfrac{V_v}{V_s},\\quad n = \\dfrac{V_v}{V}=\\dfrac{e}{1+e},\\quad S = \\dfrac{V_w}{V_v}', caption: 'Void ratio, porosity, degree of saturation' },
      { kind: 'formula', tex: 'Se = wG_s', caption: 'Basic phase identity (S=1 for saturated)' },
      { kind: 'formula', tex: '\\gamma = \\dfrac{(G_s + Se)\\gamma_w}{1+e},\\qquad \\gamma_d = \\dfrac{\\gamma}{1+w}', caption: 'Moist and dry unit weight' },
      { kind: 'formula', tex: "\\gamma' = \\gamma_{sat} - \\gamma_w,\\qquad \\gamma_{sat}=\\dfrac{(G_s+e)\\gamma_w}{1+e}", caption: 'Buoyant and saturated unit weight' },
      { kind: 'formula', tex: 'D_r = \\dfrac{e_{max}-e}{e_{max}-e_{min}}\\times 100\\%', caption: 'Relative density of sands' },
    ],
  },
  {
    id: 'ref-stress',
    exams: ['pe-geotech'],
    category: 'Soil Mechanics',
    title: 'Effective stress & seepage',
    keywords: ['effective stress', 'pore pressure', 'seepage', 'critical gradient', 'piping', 'darcy', 'flow net'],
    blocks: [
      { kind: 'formula', tex: "\\sigma' = \\sigma - u,\\qquad u = \\gamma_w h_w", caption: 'Terzaghi effective stress' },
      { kind: 'formula', tex: 'v = ki,\\qquad q = kiA', caption: "Darcy's law" },
      { kind: 'formula', tex: 'q = kH\\dfrac{N_f}{N_d}', caption: 'Seepage from a flow net (per unit width)' },
      { kind: 'formula', tex: "i_{cr} = \\dfrac{\\gamma'}{\\gamma_w} = \\dfrac{G_s-1}{1+e},\\qquad FS = \\dfrac{i_{cr}}{i_{exit}}", caption: 'Critical gradient & FS against piping/heave' },
    ],
  },
  {
    id: 'ref-strength',
    exams: ['pe-geotech'],
    category: 'Soil Mechanics',
    title: 'Shear strength (Mohr-Coulomb)',
    keywords: ['shear strength', 'mohr coulomb', 'friction angle', 'cohesion', 'failure plane', 'undrained'],
    blocks: [
      { kind: 'formula', tex: "\\tau_f = c' + \\sigma'\\tan\\phi'", caption: 'Effective-stress strength' },
      { kind: 'formula', tex: '\\sigma_{1f} = \\sigma_3 \\tan^2\\!\\left(45+\\tfrac{\\phi}{2}\\right) + 2c\\tan\\!\\left(45+\\tfrac{\\phi}{2}\\right)', caption: 'Principal stress relationship at failure' },
      { kind: 'formula', tex: '\\theta_f = 45^\\circ + \\dfrac{\\phi}{2}', caption: 'Failure plane orientation from major principal plane' },
      { kind: 'callout', tone: 'tip', html: 'Undrained saturated clay: φ=0, strength = s<sub>u</sub>; deviator stress at failure = 2 s<sub>u</sub>.' },
    ],
  },
  {
    id: 'ref-consol',
    exams: ['pe-geotech'],
    category: 'Settlement',
    title: 'Consolidation',
    keywords: ['consolidation', 'settlement', 'compression index', 'preconsolidation', 'time rate', 'cv'],
    blocks: [
      { kind: 'formula', tex: "S_c = \\dfrac{C_c}{1+e_0}H\\log\\dfrac{\\sigma_0'+\\Delta\\sigma}{\\sigma_0'}", caption: 'Primary settlement, normally consolidated' },
      { kind: 'formula', tex: "S_c = \\dfrac{C_r}{1+e_0}H\\log\\dfrac{\\sigma_c'}{\\sigma_0'} + \\dfrac{C_c}{1+e_0}H\\log\\dfrac{\\sigma_0'+\\Delta\\sigma}{\\sigma_c'}", caption: 'Overconsolidated, loaded past σ′c' },
      { kind: 'formula', tex: 't = \\dfrac{T_v H_{dr}^2}{c_v}', caption: 'Time rate (Hdr = longest drainage path)' },
      {
        kind: 'table',
        headers: ['U (%)', 'Tv'],
        rows: [['10', '0.008'], ['20', '0.031'], ['30', '0.071'], ['50', '0.197'], ['60', '0.286'], ['70', '0.403'], ['80', '0.567'], ['90', '0.848']],
        caption: 'Degree of consolidation vs time factor',
      },
    ],
  },
  {
    id: 'ref-lateral',
    exams: ['pe-geotech'],
    category: 'Retaining Structures',
    title: 'Lateral earth pressure',
    keywords: ['lateral earth pressure', 'active', 'passive', 'at rest', 'rankine', 'rankine', 'thrust', 'ka', 'kp'],
    blocks: [
      { kind: 'formula', tex: 'K_a = \\tan^2\\!\\left(45-\\tfrac{\\phi}{2}\\right),\\ K_p = \\tan^2\\!\\left(45+\\tfrac{\\phi}{2}\\right),\\ K_0 = 1-\\sin\\phi', caption: 'Rankine coefficients (level backfill)' },
      { kind: 'formula', tex: "\\sigma'_a = K_a\\sigma'_v - 2c'\\sqrt{K_a},\\qquad \\sigma'_p = K_p\\sigma'_v + 2c'\\sqrt{K_p}", caption: 'Active / passive pressure with cohesion' },
      { kind: 'formula', tex: 'P_a = \\tfrac12 K_a\\gamma H^2\\ \\text{at } H/3;\\quad P_q = K_a q H\\ \\text{at } H/2;\\quad P_w=\\tfrac12\\gamma_w H_w^2', caption: 'Resultant thrust components (soil, surcharge, water)' },
      { kind: 'formula', tex: 'z_c = \\dfrac{2c}{\\gamma\\sqrt{K_a}}', caption: 'Depth of tension crack in cohesive backfill' },
    ],
  },
  {
    id: 'ref-bearing',
    exams: ['pe-geotech'],
    category: 'Foundations',
    title: 'Bearing capacity (shallow)',
    keywords: ['bearing capacity', 'terzaghi', 'meyerhof', 'shallow foundation', 'footing', 'nc nq ngamma'],
    blocks: [
      { kind: 'formula', tex: 'q_{ult} = cN_c s_c d_c + qN_q s_q d_q + \\tfrac12\\gamma B N_\\gamma s_\\gamma d_\\gamma', caption: 'General bearing capacity (shape & depth factors)' },
      { kind: 'formula', tex: 'q_{all}=\\dfrac{q_{ult}}{FS},\\quad q_{net,all}=\\dfrac{q_{ult}-q}{FS},\\quad FS\\approx 3', caption: 'Allowable bearing' },
      {
        kind: 'table',
        headers: ['φ (°)', 'Nc', 'Nq', 'Nγ (Meyerhof)'],
        rows: [
          ['0', '5.14', '1.0', '0.0'],
          ['10', '8.35', '2.47', '0.37'],
          ['20', '14.83', '6.40', '5.39'],
          ['25', '20.72', '10.66', '10.88'],
          ['30', '30.14', '18.40', '22.40'],
          ['35', '46.12', '33.30', '48.03'],
          ['40', '75.31', '64.20', '109.41'],
        ],
        caption: 'Bearing capacity factors (use the table provided on the exam)',
      },
      { kind: 'callout', tone: 'warn', html: 'Use γ′ in the Nγ term when groundwater is at/above the footing base.' },
    ],
  },
  {
    id: 'ref-deep',
    exams: ['pe-geotech'],
    category: 'Foundations',
    title: 'Deep foundations',
    keywords: ['pile', 'deep foundation', 'skin friction', 'end bearing', 'alpha method', 'beta method', 'group'],
    blocks: [
      { kind: 'formula', tex: 'Q_{ult}=Q_s+Q_p=\\sum f_s A_s + q_p A_p', caption: 'Axial capacity' },
      { kind: 'formula', tex: "f_s = \\alpha s_u\\ (\\text{clay}),\\qquad f_s = \\beta\\sigma'_v = K\\tan\\delta\\,\\sigma'_v\\ (\\text{sand})", caption: 'Unit skin friction (α and β methods)' },
      { kind: 'formula', tex: 'Q_{group} = \\eta\\, n\\, Q_{single}', caption: 'Group capacity with efficiency η' },
      { kind: 'callout', tone: 'warn', html: 'Negative skin friction (downdrag) adds load when surrounding soil settles relative to the pile.' },
    ],
  },
  {
    id: 'ref-slope',
    exams: ['pe-geotech'],
    category: 'Slopes & Earth Structures',
    title: 'Slope stability',
    keywords: ['slope stability', 'infinite slope', 'factor of safety', 'method of slices', 'bishop', 'taylor'],
    blocks: [
      { kind: 'formula', tex: "FS = \\dfrac{\\tan\\phi'}{\\tan\\beta}\\ (\\text{dry}),\\qquad FS=\\dfrac{\\gamma'}{\\gamma_{sat}}\\dfrac{\\tan\\phi'}{\\tan\\beta}\\ (\\text{seepage})", caption: 'Infinite slope, cohesionless' },
      { kind: 'formula', tex: "FS = \\dfrac{\\sum (c'\\ell + (N - u\\ell)\\tan\\phi')}{\\sum W\\sin\\alpha}", caption: 'Method of slices (general form)' },
      { kind: 'callout', tone: 'key', html: 'Typical minimum FS: 1.5 long-term static, 1.3 end-of-construction, 1.0–1.1 pseudo-static seismic.' },
    ],
  },
  {
    id: 'ref-spt',
    exams: ['pe-geotech'],
    category: 'Site Investigation',
    title: 'SPT corrections & correlations',
    keywords: ['spt', 'n value', 'n60', 'energy', 'overburden', 'cpt'],
    blocks: [
      { kind: 'formula', tex: 'N_{60} = N\\cdot\\dfrac{ER}{60},\\qquad (N_1)_{60} = N_{60}\\,C_N', caption: 'Energy and overburden corrections' },
      { kind: 'formula', tex: "C_N = \\sqrt{\\dfrac{p_a}{\\sigma'_v}} \\le 1.7", caption: 'Overburden correction factor' },
    ],
  },
  {
    id: 'ref-seismic-geo',
    exams: ['pe-geotech', 'ca-seismic'],
    category: 'Earthquake',
    title: 'Liquefaction & site class',
    keywords: ['liquefaction', 'csr', 'crr', 'vs30', 'site class', 'msf'],
    blocks: [
      { kind: 'formula', tex: "CSR = 0.65\\dfrac{a_{max}}{g}\\dfrac{\\sigma_v}{\\sigma'_v}r_d,\\qquad FS_{liq}=\\dfrac{CRR\\cdot MSF}{CSR}", caption: 'Simplified liquefaction triggering' },
      { kind: 'formula', tex: 'r_d \\approx 1 - 0.00765z\\ (z\\ \\text{in m})', caption: 'Stress reduction coefficient (shallow)' },
      {
        kind: 'table',
        headers: ['Site Class', 'Description', 'Vs30'],
        rows: [
          ['A', 'Hard rock', '> 5000 ft/s'],
          ['B', 'Rock', '2500–5000'],
          ['C', 'Very dense soil / soft rock', '1200–2500'],
          ['D', 'Stiff soil', '600–1200'],
          ['E', 'Soft clay soil', '< 600'],
          ['F', 'Special (liquefiable, etc.)', 'site-specific'],
        ],
        caption: 'ASCE 7 site classes (USCS units)',
      },
    ],
  },

  // ---------------------- Seismic ----------------------
  {
    id: 'ref-seis-params',
    exams: ['ca-seismic'],
    category: 'Seismic Design Parameters',
    title: 'Design accelerations & SDC',
    keywords: ['sds', 'sd1', 'fa', 'fv', 'seismic design category', 'importance factor', 'risk category'],
    blocks: [
      { kind: 'formula', tex: 'S_{MS}=F_a S_S,\\ S_{M1}=F_v S_1;\\quad S_{DS}=\\tfrac23 S_{MS},\\ S_{D1}=\\tfrac23 S_{M1}', caption: 'Mapped → design spectral accelerations' },
      { kind: 'formula', tex: 'T_0 = 0.2\\dfrac{S_{D1}}{S_{DS}},\\qquad T_S = \\dfrac{S_{D1}}{S_{DS}}', caption: 'Response spectrum corner periods' },
      {
        kind: 'table',
        headers: ['Risk Category', 'Ie', 'Examples'],
        rows: [['I', '1.00', 'Low hazard'], ['II', '1.00', 'Standard buildings'], ['III', '1.25', 'Large occupancy'], ['IV', '1.50', 'Essential (hospitals, fire)']],
        caption: 'Importance factor by risk category',
      },
    ],
  },
  {
    id: 'ref-seis-baseshear',
    exams: ['ca-seismic'],
    category: 'Equivalent Lateral Force',
    title: 'Base shear & distribution',
    keywords: ['base shear', 'cs', 'response coefficient', 'period', 'cvx', 'vertical distribution', 'drift'],
    blocks: [
      { kind: 'formula', tex: 'V = C_s W,\\qquad C_s = \\dfrac{S_{DS}}{R/I_e}', caption: 'Seismic base shear' },
      { kind: 'formula', tex: 'C_{s,max}=\\dfrac{S_{D1}}{T(R/I_e)}\\ (T\\le T_L);\\quad C_{s,min}=0.044 S_{DS}I_e \\ge 0.01', caption: 'Cs limits' },
      { kind: 'formula', tex: 'T_a = C_t h_n^{x},\\qquad F_x = \\dfrac{w_x h_x^k}{\\sum w_i h_i^k}V', caption: 'Approximate period & vertical force distribution' },
      { kind: 'formula', tex: '\\delta_x = \\dfrac{C_d\\delta_{xe}}{I_e}', caption: 'Amplified design displacement (for drift)' },
      {
        kind: 'table',
        headers: ['System', 'Ct', 'x'],
        rows: [['Steel moment frame', '0.028', '0.8'], ['Concrete moment frame', '0.016', '0.9'], ['Eccentric braced / BRBF', '0.03', '0.75'], ['All other systems', '0.02', '0.75']],
        caption: 'Approximate period parameters (Ct with hn in ft)',
      },
    ],
  },
  {
    id: 'ref-seis-components',
    exams: ['ca-seismic'],
    category: 'Components & Load Combos',
    title: 'Component forces & load combinations',
    keywords: ['fp', 'component', 'nonstructural', 'load combination', 'overstrength', 'redundancy', 'vertical seismic'],
    blocks: [
      { kind: 'formula', tex: 'F_p = \\dfrac{0.4 a_p S_{DS} W_p}{R_p/I_p}\\left(1+2\\dfrac{z}{h}\\right)', caption: 'Component seismic force' },
      { kind: 'formula', tex: '0.3 S_{DS}I_p W_p \\le F_p \\le 1.6 S_{DS}I_p W_p', caption: 'Bounds on Fp' },
      { kind: 'formula', tex: 'E = \\rho Q_E \\pm 0.2 S_{DS}D,\\qquad E_{mh}=\\Omega_0 Q_E', caption: 'Seismic load effect & overstrength' },
      { kind: 'callout', tone: 'tip', html: 'LRFD: (1.2 + 0.2S<sub>DS</sub>)D + ρQ<sub>E</sub> + L + 0.2S  and  (0.9 − 0.2S<sub>DS</sub>)D + ρQ<sub>E</sub>.' },
    ],
  },

  // ---------------------- Surveying ----------------------
  {
    id: 'ref-surv-hcurve',
    exams: ['ca-surveying'],
    category: 'Route Surveying',
    title: 'Horizontal curves',
    keywords: ['horizontal curve', 'tangent', 'curve length', 'long chord', 'middle ordinate', 'external', 'degree of curve', 'stationing'],
    blocks: [
      { kind: 'formula', tex: 'T = R\\tan\\dfrac{\\Delta}{2},\\qquad L = \\dfrac{\\pi R\\Delta}{180}', caption: 'Tangent & length' },
      { kind: 'formula', tex: 'LC = 2R\\sin\\dfrac{\\Delta}{2},\\quad M = R\\left(1-\\cos\\dfrac{\\Delta}{2}\\right),\\quad E = R\\left(\\sec\\dfrac{\\Delta}{2}-1\\right)', caption: 'Chord, middle ordinate, external' },
      { kind: 'formula', tex: 'R = \\dfrac{5729.58}{D}\\ (\\text{arc definition})', caption: 'Degree of curve' },
      { kind: 'callout', tone: 'key', html: 'PC = PI − T;  PT = PC + L (along the curve, not PI + T).' },
    ],
  },
  {
    id: 'ref-surv-vcurve',
    exams: ['ca-surveying'],
    category: 'Route Surveying',
    title: 'Vertical curves',
    keywords: ['vertical curve', 'parabola', 'grade', 'high point', 'low point', 'k value', 'sight distance'],
    blocks: [
      { kind: 'formula', tex: 'Elev_x = Elev_{BVC} + g_1 x + \\dfrac{A}{2L}x^2,\\qquad A = g_2 - g_1', caption: 'Elevation on the curve (consistent units)' },
      { kind: 'formula', tex: 'x_{turn} = \\dfrac{-g_1 L}{A},\\qquad K = \\dfrac{L}{A}', caption: 'Turning point and rate of vertical curvature' },
    ],
  },
  {
    id: 'ref-surv-earthwork',
    exams: ['ca-surveying'],
    category: 'Earthwork & Areas',
    title: 'Volumes & areas',
    keywords: ['earthwork', 'volume', 'average end area', 'prismoidal', 'area', 'coordinates', 'shoelace', 'shrinkage'],
    blocks: [
      { kind: 'formula', tex: 'V = \\dfrac{L}{2}(A_1+A_2),\\qquad V=\\dfrac{L}{6}(A_1+4A_m+A_2)', caption: 'Average end area & prismoidal' },
      { kind: 'formula', tex: 'A = \\tfrac12\\left|\\sum (x_i y_{i+1} - x_{i+1} y_i)\\right|', caption: 'Area by coordinates (shoelace)' },
    ],
  },
  {
    id: 'ref-surv-cogo',
    exams: ['ca-surveying'],
    category: 'Measurements & COGO',
    title: 'Bearings, traverse & coordinates',
    keywords: ['bearing', 'azimuth', 'latitude', 'departure', 'traverse', 'closure', 'state plane', 'scale factor'],
    blocks: [
      { kind: 'formula', tex: '\\text{lat}=L\\cos(Az),\\qquad \\text{dep}=L\\sin(Az)', caption: 'Latitude & departure' },
      { kind: 'formula', tex: 'LEC = \\sqrt{(\\Sigma\\text{lat})^2+(\\Sigma\\text{dep})^2},\\qquad \\text{Precision} = \\dfrac{LEC}{\\text{perimeter}}', caption: 'Linear error of closure & relative precision' },
      { kind: 'formula', tex: 'D_{grid} = D_{ground}\\times CSF\\ (= \\text{grid}\\times\\text{elev. factor})', caption: 'Combined scale factor (State Plane)' },
      { kind: 'callout', tone: 'tip', html: 'Azimuth quadrants: NE 0–90 (= Az), SE 90–180 (S(180−Az)E), SW 180–270 (S(Az−180)W), NW 270–360 (N(360−Az)W).' },
    ],
  },
  {
    id: 'ref-surv-error',
    exams: ['ca-surveying'],
    category: 'Errors',
    title: 'Error analysis',
    keywords: ['error', 'random', 'systematic', 'blunder', 'propagation', 'standard deviation', 'most probable'],
    blocks: [
      { kind: 'formula', tex: 'E_{series}=\\sqrt{\\sum e_i^2},\\qquad E_{sum}=E\\sqrt{n}', caption: 'Error propagation (independent random)' },
      { kind: 'formula', tex: '\\sigma = \\sqrt{\\dfrac{\\sum(x_i-\\bar x)^2}{n-1}},\\qquad \\sigma_{\\bar x}=\\dfrac{\\sigma}{\\sqrt n}', caption: 'Sample standard deviation & of the mean' },
    ],
  },
  ...WRE_REFERENCE,
];

export const REF_CATEGORIES = Array.from(new Set(REFERENCE.map((r) => r.category)));
