import type { RefEntry } from './reference';

// ---------------------------------------------------------------------------
// In-app reference sheet for the PE Civil Water Resources & Environmental
// depth exam. ORIGINAL study compilation of the key equations and tables you
// will look up in the NCEES PE Civil Reference Handbook — drill these so you
// can find them fast. Same block conventions as reference.ts.
// ---------------------------------------------------------------------------

export const WRE_REFERENCE: RefEntry[] = [
  // ---------------------- Open channel ----------------------
  {
    id: 'ref-wre-open',
    exams: ['pe-wre'],
    category: 'Open Channel',
    title: 'Manning, critical flow & hydraulic jump',
    keywords: ['manning', 'open channel', 'normal depth', 'critical depth', 'froude', 'hydraulic jump', 'conjugate depth', 'specific energy'],
    blocks: [
      { kind: 'formula', tex: 'Q = \\dfrac{k}{n}AR_h^{2/3}S^{1/2},\\qquad k=1.49\\ (\\text{USCS}),\\ k=1.0\\ (\\text{SI}),\\qquad R_h=\\dfrac{A}{P}', caption: "Manning's equation (normal / uniform flow)" },
      { kind: 'formula', tex: 'E = y + \\dfrac{V^2}{2g},\\qquad Fr = \\dfrac{V}{\\sqrt{gD_h}},\\qquad D_h = \\dfrac{A}{T}', caption: 'Specific energy & Froude number (Fr<1 subcritical, Fr>1 supercritical)' },
      { kind: 'formula', tex: 'y_c = \\left(\\dfrac{q^2}{g}\\right)^{1/3}\\ \\text{(rectangular)};\\qquad \\dfrac{Q^2 T}{g A^3} = 1\\ \\text{(general section)}', caption: 'Critical depth (Fr = 1, minimum specific energy)' },
      { kind: 'formula', tex: '\\dfrac{y_2}{y_1} = \\tfrac12\\left(\\sqrt{1+8Fr_1^2}-1\\right)', caption: 'Hydraulic jump conjugate (sequent) depths, rectangular channel' },
      {
        kind: 'table',
        headers: ['Surface', 'Typical Manning n'],
        rows: [
          ['Smooth concrete', '0.012'],
          ['Finished concrete', '0.013'],
          ['Corrugated metal pipe', '0.024'],
          ['Earth channel, clean', '0.022'],
          ['Natural stream, clean & straight', '0.030'],
          ['Natural stream, weedy / brush', '0.050–0.10'],
        ],
        caption: 'Typical Manning roughness coefficients',
      },
    ],
  },

  // ---------------------- Closed conduit ----------------------
  {
    id: 'ref-wre-closed',
    exams: ['pe-wre'],
    category: 'Closed Conduit',
    title: 'Pipe friction, minor losses & pumps',
    keywords: ['darcy weisbach', 'hazen williams', 'friction loss', 'minor loss', 'pump power', 'npsh', 'cavitation', 'system curve'],
    blocks: [
      { kind: 'formula', tex: 'h_f = f\\dfrac{L}{D}\\dfrac{V^2}{2g}', caption: 'Darcy-Weisbach (any fluid; f from Moody chart / Colebrook)' },
      { kind: 'formula', tex: 'V = 1.318\\,C R_h^{0.63} S^{0.54}\\ (\\text{USCS});\\qquad V = 0.849\\,C R_h^{0.63} S^{0.54}\\ (\\text{SI})', caption: 'Hazen-Williams (water only; C ≈ 130–140 new DI/PVC, 100 old cast iron)' },
      { kind: 'formula', tex: 'h_m = \\sum K\\dfrac{V^2}{2g}', caption: 'Minor losses (entrance K≈0.5, exit K=1.0, or use equivalent lengths)' },
      { kind: 'formula', tex: 'P = \\dfrac{\\gamma Q H_p}{\\eta},\\qquad WHP = \\dfrac{Q(\\text{gpm})\\,H(\\text{ft})}{3960},\\qquad BHP = \\dfrac{WHP}{\\eta_{pump}}', caption: 'Pump power (water horsepower / brake horsepower)' },
      { kind: 'formula', tex: 'NPSH_a = h_{atm} + h_z - h_f - h_{vp} \\ge NPSH_r', caption: 'Net positive suction head available (hz negative for suction lift)' },
    ],
  },

  // ---------------------- Hydrology ----------------------
  {
    id: 'ref-wre-hydrology',
    exams: ['pe-wre'],
    category: 'Hydrology',
    title: 'Rational method, NRCS runoff & return period',
    keywords: ['rational method', 'runoff coefficient', 'curve number', 'nrcs', 'scs', 'time of concentration', 'return period', 'risk', 'exceedance'],
    blocks: [
      { kind: 'formula', tex: 'Q = CiA', caption: 'Rational method: Q (cfs), i (in/hr) at duration = tc, A (acres) — 1 ac·in/hr ≈ 1 cfs' },
      { kind: 'formula', tex: 'S = \\dfrac{1000}{CN} - 10,\\qquad Q = \\dfrac{(P-0.2S)^2}{P+0.8S}\\quad (P > 0.2S,\\ \\text{else } Q=0)', caption: 'NRCS (SCS) curve-number method, depths in inches' },
      { kind: 'formula', tex: 'p = \\dfrac{1}{T},\\qquad R = 1 - \\left(1-\\dfrac{1}{T}\\right)^n', caption: 'Annual exceedance probability & risk of at least one T-year event in n years' },
      { kind: 'callout', tone: 'tip', html: 'Time of concentration t<sub>c</sub> = longest travel time to the outlet (sheet + shallow concentrated + channel flow). Use rainfall intensity at duration t<sub>c</sub>; shorter t<sub>c</sub> → higher i → higher peak Q.' },
      {
        kind: 'table',
        headers: ['Surface', 'Typical C'],
        rows: [
          ['Pavement / roofs', '0.70–0.95'],
          ['Gravel', '0.35–0.70'],
          ['Lawns, sandy soil', '0.05–0.20'],
          ['Lawns, heavy (clay) soil', '0.13–0.35'],
          ['Downtown business', '0.70–0.95'],
          ['Single-family residential', '0.30–0.50'],
        ],
        caption: 'Typical rational-method runoff coefficients',
      },
    ],
  },

  // ---------------------- Groundwater ----------------------
  {
    id: 'ref-wre-groundwater',
    exams: ['pe-wre'],
    category: 'Groundwater',
    title: 'Darcy flow & steady well hydraulics',
    keywords: ['darcy', 'hydraulic conductivity', 'seepage velocity', 'transmissivity', 'thiem', 'dupuit', 'well', 'drawdown', 'aquifer'],
    blocks: [
      { kind: 'formula', tex: 'v = Ki,\\qquad Q = KiA,\\qquad v_s = \\dfrac{v}{n_e}', caption: "Darcy's law; seepage (pore) velocity uses effective porosity" },
      { kind: 'formula', tex: 'T = Kb', caption: 'Transmissivity of a confined aquifer of thickness b' },
      { kind: 'formula', tex: 'Q = \\dfrac{2\\pi K b (h_2 - h_1)}{\\ln(r_2/r_1)} = \\dfrac{2\\pi T (s_1 - s_2)}{\\ln(r_2/r_1)}', caption: 'Thiem equation — steady radial flow, confined aquifer' },
      { kind: 'formula', tex: 'Q = \\dfrac{\\pi K (h_2^2 - h_1^2)}{\\ln(r_2/r_1)}', caption: 'Dupuit equation — steady radial flow, unconfined aquifer (h from base)' },
    ],
  },

  // ---------------------- Water quality ----------------------
  {
    id: 'ref-wre-quality',
    exams: ['pe-wre'],
    category: 'Water Quality',
    title: 'BOD, mixing & dissolved oxygen',
    keywords: ['bod', 'deoxygenation', 'mass balance', 'mixing', 'dissolved oxygen', 'do sag', 'streeter phelps', 'deficit'],
    blocks: [
      { kind: 'formula', tex: 'BOD_t = L_0\\left(1 - e^{-kt}\\right)', caption: 'BOD exerted at time t (L0 = ultimate BOD; base-10 form: k = 2.303 k10)' },
      { kind: 'formula', tex: 'C_{mix} = \\dfrac{Q_1 C_1 + Q_2 C_2}{Q_1 + Q_2}', caption: 'Flow-weighted mixing mass balance (BOD, DO, temperature, TDS)' },
      { kind: 'formula', tex: 'D = DO_{sat} - DO', caption: 'Dissolved-oxygen deficit' },
      { kind: 'callout', tone: 'key', html: 'DO sag (Streeter-Phelps) summary: downstream of a discharge, deoxygenation (k<sub>d</sub>·BOD) initially outpaces reaeration (k<sub>r</sub>·D); DO falls to a minimum at the critical point (t<sub>c</sub>, D<sub>c</sub>) where the two rates balance, then recovers.' },
    ],
  },

  // ---------------------- Water treatment ----------------------
  {
    id: 'ref-wre-drinking',
    exams: ['pe-wre'],
    category: 'Water Treatment',
    title: 'Sedimentation, mixing, disinfection & hardness',
    keywords: ['surface overflow rate', 'detention time', 'sedimentation', 'velocity gradient', 'rapid mix', 'flocculation', 'ct', 'disinfection', 'hardness', 'caco3'],
    blocks: [
      { kind: 'formula', tex: 'SOR = \\dfrac{Q}{A_{surface}},\\qquad t = \\dfrac{V}{Q}', caption: 'Surface overflow rate (gpd/ft²) & hydraulic detention time — particles with vs ≥ SOR settle out' },
      { kind: 'formula', tex: 'G = \\sqrt{\\dfrac{P}{\\mu V}}\\quad (P = \\mu G^2 V)', caption: 'Velocity gradient: rapid mix G ≈ 600–1000 s⁻¹; flocculation G ≈ 20–80 s⁻¹ (also check Gt)' },
      { kind: 'formula', tex: 'CT = C_{residual}\\ (\\text{mg/L}) \\times t_{10}\\ (\\text{min})', caption: 'Disinfection credit — compare to required CT for the target log inactivation' },
      { kind: 'formula', tex: '1\\ \\text{meq/L} = 50\\ \\text{mg/L as CaCO}_3', caption: 'Hardness / alkalinity equivalence (mg/L as CaCO3 = meq/L × 50)' },
    ],
  },

  // ---------------------- Wastewater ----------------------
  {
    id: 'ref-wre-wastewater',
    exams: ['pe-wre'],
    category: 'Wastewater',
    title: 'Activated sludge & mass loadings',
    keywords: ['activated sludge', 'f/m', 'food to microorganism', 'srt', 'sludge age', 'mlss', 'loading', '8.34', 'mgd'],
    blocks: [
      { kind: 'formula', tex: 'F/M = \\dfrac{Q S_0}{V X}', caption: 'Food-to-microorganism ratio (typical 0.2–0.5 d⁻¹ conventional)' },
      { kind: 'formula', tex: '\\theta_c = SRT = \\dfrac{V X}{Q_w X_w + Q_e X_e}', caption: 'Solids retention time (sludge age) — solids in system / solids wasted per day' },
      { kind: 'formula', tex: '\\text{lb/day} = 8.34 \\times Q\\ (\\text{MGD}) \\times C\\ (\\text{mg/L})', caption: 'Mass loading conversion — the 8.34 lb/(MG·mg/L) factor' },
      { kind: 'formula', tex: '\\text{Volumetric BOD loading} = \\dfrac{Q S_0}{V};\\qquad \\text{clarifier SLR} = \\dfrac{(Q+Q_r)X \\times 8.34}{A}', caption: 'Organic loading & secondary clarifier solids loading rate (lb/d·ft²)' },
    ],
  },

  // ---------------------- Flow measurement ----------------------
  {
    id: 'ref-wre-flowmeas',
    exams: ['pe-wre'],
    category: 'Flow Measurement',
    title: 'Weirs, flumes & meters',
    keywords: ['weir', 'v-notch', 'rectangular weir', 'parshall flume', 'venturi', 'orifice', 'flow measurement', 'head'],
    blocks: [
      { kind: 'formula', tex: 'Q = C_w L H^{3/2},\\qquad C_w \\approx 3.33\\ (\\text{USCS, suppressed})', caption: 'Rectangular weir; contracted: use effective length L − 0.1nH' },
      { kind: 'formula', tex: 'Q = 2.5\\tan\\!\\left(\\dfrac{\\theta}{2}\\right)H^{5/2}\\ (\\text{USCS});\\quad 90^\\circ: Q \\approx 2.5\\,H^{5/2}', caption: 'Triangular (V-notch) weir — best for low flows' },
      { kind: 'formula', tex: 'Q = C A_2\\sqrt{\\dfrac{2g\\,\\Delta h}{1-(A_2/A_1)^2}}', caption: 'Venturi / orifice meter from differential head' },
      { kind: 'callout', tone: 'tip', html: 'Parshall flumes measure Q from upstream head with an empirical rating (Q = C·H<sup>n</sup> per throat width); they are self-cleaning and have low head loss, so they are preferred for wastewater with solids.' },
    ],
  },
];
