import type { RefEntry } from './reference';

// ---------------------------------------------------------------------------
// In-app reference sheet for the NCEES FE Civil exam. ORIGINAL study
// compilation of the key equations and tables you will look up in the NCEES
// FE Reference Handbook — drill these so you can find them fast. Same block
// conventions as reference.ts.
// ---------------------------------------------------------------------------

export const FE_REFERENCE: RefEntry[] = [
  // ---------------------- Math & Statistics ----------------------
  {
    id: 'ref-fe-math',
    exams: ['fe-civil'],
    category: 'FE Math & Stats',
    title: 'Calculus, vectors & statistics',
    keywords: ['derivative', 'integral', 'chain rule', 'dot product', 'cross product', 'mean', 'standard deviation', 'quadratic'],
    blocks: [
      { kind: 'formula', tex: "(uv)' = u'v + uv',\\qquad \\left(\\dfrac{u}{v}\\right)' = \\dfrac{u'v - uv'}{v^2},\\qquad [f(g(x))]' = f'(g(x))\\,g'(x)", caption: 'Product, quotient & chain rules' },
      { kind: 'formula', tex: '\\int x^n dx = \\dfrac{x^{n+1}}{n+1} + C\\ (n \\ne -1),\\qquad \\int \\dfrac{dx}{x} = \\ln|x| + C,\\qquad \\int e^{ax}dx = \\dfrac{e^{ax}}{a} + C', caption: 'Common integrals' },
      { kind: 'formula', tex: '\\mathbf{A}\\cdot\\mathbf{B} = |\\mathbf{A}||\\mathbf{B}|\\cos\\theta,\\qquad |\\mathbf{A}\\times\\mathbf{B}| = |\\mathbf{A}||\\mathbf{B}|\\sin\\theta', caption: 'Dot product (angle / projection) and cross product (area / moment)' },
      { kind: 'formula', tex: 'x = \\dfrac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}', caption: 'Quadratic formula' },
      { kind: 'formula', tex: '\\bar{x} = \\dfrac{\\sum x_i}{n},\\qquad s = \\sqrt{\\dfrac{\\sum (x_i - \\bar{x})^2}{n-1}},\\qquad \\sigma = \\sqrt{\\dfrac{\\sum (x_i - \\mu)^2}{N}}', caption: 'Mean, sample SD (n−1) and population SD (N)' },
    ],
  },

  // ---------------------- Engineering Economics ----------------------
  {
    id: 'ref-fe-econ',
    exams: ['fe-civil'],
    category: 'FE Economics',
    title: 'Interest factors & capitalized cost',
    keywords: ['interest', 'present worth', 'future worth', 'annuity', 'capitalized cost', 'f/p', 'p/f', 'a/p', 'p/a', 'effective rate'],
    blocks: [
      {
        kind: 'table',
        headers: ['Factor', 'Converts', 'Formula'],
        rows: [
          ['(F/P, i, n)', 'P → F', '(1+i)^n'],
          ['(P/F, i, n)', 'F → P', '(1+i)^−n'],
          ['(A/P, i, n)', 'P → A', 'i(1+i)^n / [(1+i)^n − 1]'],
          ['(P/A, i, n)', 'A → P', '[(1+i)^n − 1] / [i(1+i)^n]'],
          ['(A/F, i, n)', 'F → A', 'i / [(1+i)^n − 1]'],
          ['(F/A, i, n)', 'A → F', '[(1+i)^n − 1] / i'],
        ],
        caption: 'Discrete compounding factors',
      },
      { kind: 'formula', tex: 'P = \\dfrac{A}{i}', caption: 'Capitalized cost — present worth of a perpetual annual amount' },
      { kind: 'formula', tex: 'i_e = \\left(1 + \\dfrac{r}{m}\\right)^m - 1', caption: 'Effective annual rate from nominal rate r compounded m times/yr' },
    ],
  },

  // ---------------------- Statics ----------------------
  {
    id: 'ref-fe-statics',
    exams: ['fe-civil'],
    category: 'Statics',
    title: 'Equilibrium, centroids, inertia & friction',
    keywords: ['equilibrium', 'free body', 'centroid', 'moment of inertia', 'parallel axis', 'friction', 'trusses'],
    blocks: [
      { kind: 'formula', tex: '\\sum F_x = 0,\\quad \\sum F_y = 0,\\quad \\sum M_{any\\ point} = 0', caption: 'Static equilibrium (2D — six equations in 3D)' },
      { kind: 'formula', tex: '\\bar{x} = \\dfrac{\\sum A_i \\bar{x}_i}{\\sum A_i},\\qquad \\bar{y} = \\dfrac{\\sum A_i \\bar{y}_i}{\\sum A_i}', caption: 'Centroid of a composite area (holes negative)' },
      { kind: 'formula', tex: 'I_{rect} = \\dfrac{bh^3}{12},\\qquad I_{circle} = \\dfrac{\\pi d^4}{64},\\qquad I = I_c + Ad^2', caption: 'Centroidal moments of inertia & parallel axis theorem' },
      { kind: 'formula', tex: 'F \\le \\mu_s N;\\qquad \\tan\\phi = \\mu_s\\ \\text{at impending slip}', caption: 'Coulomb friction (kinetic: F = μk N once moving)' },
    ],
  },

  // ---------------------- Dynamics ----------------------
  {
    id: 'ref-fe-dynamics',
    exams: ['fe-civil'],
    category: 'Dynamics',
    title: 'Kinematics, energy & momentum',
    keywords: ['kinematics', 'constant acceleration', 'kinetic energy', 'work energy', 'power', 'impulse', 'momentum', 'projectile'],
    blocks: [
      { kind: 'formula', tex: 'v = v_0 + at,\\qquad s = s_0 + v_0 t + \\tfrac12 at^2,\\qquad v^2 = v_0^2 + 2a(s - s_0)', caption: 'Constant-acceleration kinematics' },
      { kind: 'formula', tex: 'KE = \\tfrac12 mv^2,\\qquad PE = mgh,\\qquad W = Fd\\cos\\theta,\\qquad P = \\dfrac{W}{t} = Fv', caption: 'Energy, work & power' },
      { kind: 'formula', tex: 'W_{net} = \\Delta KE', caption: 'Work–energy principle' },
      { kind: 'formula', tex: 'F\\,\\Delta t = m\\,\\Delta v,\\qquad \\sum m_i v_i = \\text{const (collisions)}', caption: 'Impulse–momentum & conservation of momentum' },
    ],
  },

  // ---------------------- Mechanics of Materials ----------------------
  {
    id: 'ref-fe-mom',
    exams: ['fe-civil'],
    category: 'Mechanics of Materials',
    title: 'Stress, deformation & combined loading',
    keywords: ['axial stress', 'elongation', 'torsion', 'bending', 'flexure', 'thermal', 'principal stress', 'mohr circle', 'pressure vessel'],
    blocks: [
      { kind: 'formula', tex: '\\sigma = \\dfrac{P}{A},\\qquad \\delta = \\dfrac{PL}{AE},\\qquad \\epsilon = \\dfrac{\\delta}{L} = \\dfrac{\\sigma}{E}', caption: 'Axial stress, deformation & strain (Hooke) ' },
      { kind: 'formula', tex: '\\tau = \\dfrac{Tc}{J},\\qquad J_{solid} = \\dfrac{\\pi d^4}{32},\\qquad \\phi = \\dfrac{TL}{GJ}', caption: 'Torsion of circular shafts' },
      { kind: 'formula', tex: '\\sigma = \\dfrac{Mc}{I} = \\dfrac{M}{S},\\qquad \\tau = \\dfrac{VQ}{Ib}', caption: 'Flexural & transverse shear stress' },
      { kind: 'formula', tex: '\\delta_T = \\alpha L\\,\\Delta T', caption: 'Thermal deformation (restrained: σ = EαΔT)' },
      { kind: 'formula', tex: '\\sigma_{1,2} = \\dfrac{\\sigma_x + \\sigma_y}{2} \\pm \\sqrt{\\left(\\dfrac{\\sigma_x - \\sigma_y}{2}\\right)^2 + \\tau_{xy}^2}', caption: 'Principal stresses (Mohr circle: center (σx+σy)/2, radius = the root term)' },
      { kind: 'formula', tex: '\\sigma_{hoop} = \\dfrac{pr}{t},\\qquad \\sigma_{axial} = \\dfrac{pr}{2t}', caption: 'Thin-walled pressure vessel (r/t > 10)' },
    ],
  },

  // ---------------------- Structural ----------------------
  {
    id: 'ref-fe-structural',
    exams: ['fe-civil'],
    category: 'Structural',
    title: 'Beam formulas & Euler buckling',
    keywords: ['beam', 'deflection', 'moment', 'simply supported', 'cantilever', 'euler', 'buckling', 'effective length', 'k factor'],
    blocks: [
      {
        kind: 'table',
        headers: ['Beam & load', 'Max moment', 'Max deflection'],
        rows: [
          ['Simple span, UDL w', 'wL²/8 (midspan)', '5wL⁴/384EI'],
          ['Simple span, point P at mid', 'PL/4 (midspan)', 'PL³/48EI'],
          ['Cantilever, point P at tip', 'PL (support)', 'PL³/3EI'],
          ['Cantilever, UDL w', 'wL²/2 (support)', 'wL⁴/8EI'],
        ],
        caption: 'Elastic beam formulas (deflections at free end / midspan)',
      },
      { kind: 'formula', tex: 'P_{cr} = \\dfrac{\\pi^2 EI}{(KL)^2}', caption: 'Euler elastic buckling load' },
      {
        kind: 'table',
        headers: ['End conditions', 'K (theoretical)', 'K (design)'],
        rows: [
          ['Pinned–pinned', '1.0', '1.0'],
          ['Fixed–fixed', '0.5', '0.65'],
          ['Fixed–pinned', '0.7', '0.80'],
          ['Fixed–free (flagpole)', '2.0', '2.10'],
        ],
        caption: 'Effective length factors',
      },
    ],
  },

  // ---------------------- Fluids ----------------------
  {
    id: 'ref-fe-fluids',
    exams: ['fe-civil'],
    category: 'FE Fluids',
    title: 'Fluid statics, continuity, Bernoulli & Reynolds',
    keywords: ['hydrostatic', 'pressure', 'plane surface', 'continuity', 'bernoulli', 'energy equation', 'reynolds', 'laminar', 'turbulent'],
    blocks: [
      { kind: 'formula', tex: 'p = \\gamma h,\\qquad F_R = \\gamma \\bar{h} A,\\qquad y_{cp} = \\bar{y} + \\dfrac{I_c}{\\bar{y}A}', caption: 'Hydrostatic pressure & resultant on a submerged plane surface' },
      { kind: 'formula', tex: 'Q = A_1 V_1 = A_2 V_2', caption: 'Continuity (incompressible flow)' },
      { kind: 'formula', tex: '\\dfrac{p_1}{\\gamma} + z_1 + \\dfrac{V_1^2}{2g} = \\dfrac{p_2}{\\gamma} + z_2 + \\dfrac{V_2^2}{2g} + h_f', caption: 'Bernoulli / energy equation with head loss' },
      { kind: 'formula', tex: 'Re = \\dfrac{\\rho V D}{\\mu} = \\dfrac{VD}{\\nu}', caption: 'Reynolds number — laminar Re < 2100, transitional 2100–4000, turbulent Re > 4000' },
    ],
  },

  // ---------------------- Transportation ----------------------
  {
    id: 'ref-fe-transport',
    exams: ['fe-civil'],
    category: 'Transportation',
    title: 'Sight distance, curves & traffic flow',
    keywords: ['stopping sight distance', 'horizontal curve', 'vertical curve', 'superelevation', 'traffic flow', 'density', 'peak hour factor'],
    blocks: [
      { kind: 'formula', tex: 'SSD = 1.47Vt + \\dfrac{V^2}{30\\left(\\tfrac{a}{32.2} \\pm G\\right)}', caption: 'Stopping sight distance (V mph, t = 2.5 s, a = 11.2 ft/s²)' },
      { kind: 'formula', tex: 'T = R\\tan\\dfrac{\\Delta}{2},\\qquad L = \\dfrac{\\pi R \\Delta}{180},\\qquad R = \\dfrac{5729.58}{D}', caption: 'Horizontal curve tangent, length & degree of curve (arc def.)' },
      { kind: 'formula', tex: 'e + f = \\dfrac{V^2}{15R}', caption: 'Superelevation (V mph, R ft, f = side friction factor)' },
      { kind: 'formula', tex: 'q = kv', caption: 'Fundamental traffic relation: flow = density × space mean speed' },
      { kind: 'formula', tex: 'PHF = \\dfrac{V_{hr}}{4\\,V_{15,max}}', caption: 'Peak hour factor from the peak 15-min volume' },
    ],
  },

  // ---------------------- Construction & PM ----------------------
  {
    id: 'ref-fe-construction',
    exams: ['fe-civil'],
    category: 'Construction & PM',
    title: 'CPM scheduling & earned value',
    keywords: ['critical path', 'float', 'cpm', 'earned value', 'cpi', 'spi', 'cost variance', 'schedule variance', 'productivity'],
    blocks: [
      { kind: 'callout', tone: 'key', html: 'CPM: critical path = longest path through the network (zero total float). Total float TF = LS − ES = LF − EF; free float = earliest ES of successors − EF.' },
      { kind: 'formula', tex: 'CV = EV - AC,\\qquad SV = EV - PV', caption: 'Cost & schedule variance (negative = over budget / behind)' },
      { kind: 'formula', tex: 'CPI = \\dfrac{EV}{AC},\\qquad SPI = \\dfrac{EV}{PV},\\qquad EAC = \\dfrac{BAC}{CPI}', caption: 'Performance indices & estimate at completion' },
      { kind: 'formula', tex: '\\text{Productivity} = \\dfrac{\\text{output}}{\\text{input (work-hours)}},\\qquad \\text{Unit cost} = \\dfrac{\\text{crew cost/hr}}{\\text{production/hr}}', caption: 'Productivity & unit cost of a crew' },
    ],
  },
];
