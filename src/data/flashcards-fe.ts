import type { Flashcard } from '../types';

// Key formulas & facts for the NCEES FE Civil exam. Fronts/backs accept $tex$
// — same conventions as flashcards.ts.
export const FE_FLASHCARDS: Flashcard[] = [
  // Mathematics & Statistics
  { id: 'fc-fe-1', examId: 'fe-civil', areaId: 'fe-math', front: 'Product & chain rules of differentiation', back: "$(uv)' = u'v + uv';\\quad \\dfrac{d}{dx}f(g(x)) = f'(g(x))\\,g'(x)$" },
  { id: 'fc-fe-2', examId: 'fe-civil', areaId: 'fe-math', front: 'Power rule of integration', back: '$\\int x^n\\,dx = \\dfrac{x^{n+1}}{n+1} + C\\quad (n \\ne -1)$' },
  { id: 'fc-fe-3', examId: 'fe-civil', areaId: 'fe-math', front: 'Dot product & angle between vectors', back: '$\\mathbf{A}\\cdot\\mathbf{B} = A_xB_x + A_yB_y + A_zB_z = |\\mathbf{A}||\\mathbf{B}|\\cos\\theta$' },
  { id: 'fc-fe-4', examId: 'fe-civil', areaId: 'fe-math', front: 'Sample standard deviation', back: '$s = \\sqrt{\\dfrac{\\sum (x_i - \\bar{x})^2}{n-1}}$ (note $n-1$, not $n$)' },

  // Engineering Economics
  { id: 'fc-fe-5', examId: 'fe-civil', areaId: 'fe-econ', front: 'Single-payment compound amount (F/P)', back: '$F = P(1+i)^n$; and $P = F(1+i)^{-n}$' },
  { id: 'fc-fe-6', examId: 'fe-civil', areaId: 'fe-econ', front: 'Capitalized cost (perpetual series)', back: '$P = \\dfrac{A}{i}$ (present worth of an annual cost that lasts forever)' },
  { id: 'fc-fe-7', examId: 'fe-civil', areaId: 'fe-econ', front: 'Effective annual interest rate', back: '$i_e = \\left(1 + \\dfrac{r}{m}\\right)^m - 1$ (r = nominal rate, m = periods/yr)' },

  // Ethics & Professional Practice
  { id: 'fc-fe-8', examId: 'fe-civil', areaId: 'fe-ethics', front: 'First canon of the NCEES / NSPE codes of ethics', back: 'Hold paramount the safety, health, and welfare of the public — it outranks duties to client and employer.' },

  // Statics
  { id: 'fc-fe-9', examId: 'fe-civil', areaId: 'fe-statics', front: 'Equilibrium equations (2D)', back: '$\\sum F_x = 0,\\ \\sum F_y = 0,\\ \\sum M = 0$ (3 eqs in 2D, 6 in 3D)' },
  { id: 'fc-fe-10', examId: 'fe-civil', areaId: 'fe-statics', front: 'Centroid of a composite area', back: '$\\bar{x} = \\dfrac{\\sum A_i \\bar{x}_i}{\\sum A_i}$ (holes enter with negative area)' },
  { id: 'fc-fe-11', examId: 'fe-civil', areaId: 'fe-statics', front: 'Rectangle moment of inertia & parallel axis theorem', back: '$I_c = \\dfrac{bh^3}{12};\\qquad I = I_c + Ad^2$' },
  { id: 'fc-fe-12', examId: 'fe-civil', areaId: 'fe-statics', front: 'Dry (Coulomb) friction', back: '$F \\le \\mu_s N$; motion impends when $F = \\mu_s N$, i.e. $\\tan\\phi = \\mu_s$' },

  // Dynamics
  { id: 'fc-fe-13', examId: 'fe-civil', areaId: 'fe-dynamics', front: 'Constant-acceleration velocity–position relation', back: '$v^2 = v_0^2 + 2a(s - s_0)$' },
  { id: 'fc-fe-14', examId: 'fe-civil', areaId: 'fe-dynamics', front: 'Work–energy principle', back: '$W_{net} = \\Delta KE = \\tfrac12 m v_2^2 - \\tfrac12 m v_1^2$' },

  // Mechanics of Materials
  { id: 'fc-fe-15', examId: 'fe-civil', areaId: 'fe-mom', front: 'Axial stress & axial deformation', back: '$\\sigma = \\dfrac{P}{A};\\qquad \\delta = \\dfrac{PL}{AE}$' },
  { id: 'fc-fe-16', examId: 'fe-civil', areaId: 'fe-mom', front: 'Torsional shear stress', back: '$\\tau = \\dfrac{Tc}{J}$; solid circular shaft $J = \\dfrac{\\pi d^4}{32}$' },
  { id: 'fc-fe-17', examId: 'fe-civil', areaId: 'fe-mom', front: 'Flexural (bending) stress', back: '$\\sigma = \\dfrac{Mc}{I} = \\dfrac{M}{S}$, max at extreme fiber' },
  { id: 'fc-fe-18', examId: 'fe-civil', areaId: 'fe-mom', front: 'Principal stresses (plane stress)', back: '$\\sigma_{1,2} = \\dfrac{\\sigma_x + \\sigma_y}{2} \\pm \\sqrt{\\left(\\dfrac{\\sigma_x - \\sigma_y}{2}\\right)^2 + \\tau_{xy}^2}$' },

  // Materials
  { id: 'fc-fe-19', examId: 'fe-civil', areaId: 'fe-materials', front: 'Modulus of elasticity of steel', back: '$E_s = 29{,}000\\ \\text{ksi} = 200\\ \\text{GPa}$ (essentially all structural steels)' },

  // Fluid Mechanics
  { id: 'fc-fe-20', examId: 'fe-civil', areaId: 'fe-fluids', front: 'Hydrostatic pressure & resultant on a plane surface', back: '$p = \\gamma h;\\qquad F_R = \\gamma \\bar{h} A$ (acts below the centroid, at the center of pressure)' },
  { id: 'fc-fe-21', examId: 'fe-civil', areaId: 'fe-fluids', front: 'Reynolds number & flow regimes (pipe)', back: '$Re = \\dfrac{\\rho V D}{\\mu} = \\dfrac{VD}{\\nu}$; laminar $Re < 2100$, turbulent $Re > 4000$' },

  // Water Resources & Environmental
  { id: 'fc-fe-22', examId: 'fe-civil', areaId: 'fe-wre', front: "Manning's equation (USCS)", back: '$Q = \\dfrac{1.49}{n} A R_h^{2/3} S^{1/2}$, $R_h = A/P$ ($k = 1.0$ in SI)' },
  { id: 'fc-fe-23', examId: 'fe-civil', areaId: 'fe-wre', front: 'Rational method peak runoff', back: '$Q = CiA$ (Q cfs, i in/hr, A acres; use i at duration $= t_c$)' },

  // Structural Engineering
  { id: 'fc-fe-24', examId: 'fe-civil', areaId: 'fe-structural', front: 'Simply supported beam, uniform load: max M & max deflection', back: '$M_{max} = \\dfrac{wL^2}{8}\\ \\text{(midspan)};\\qquad \\delta_{max} = \\dfrac{5wL^4}{384EI}$' },
  { id: 'fc-fe-25', examId: 'fe-civil', areaId: 'fe-structural', front: 'Euler buckling load & K factors', back: '$P_{cr} = \\dfrac{\\pi^2 EI}{(KL)^2}$; K: pinned–pinned 1.0, fixed–fixed 0.5, fixed–pinned 0.7, fixed–free 2.0' },

  // Geotechnical Engineering
  { id: 'fc-fe-26', examId: 'fe-civil', areaId: 'fe-geotech', front: 'Basic soil phase identity', back: '$Se = wG_s$ (saturated, S = 1 → $e = wG_s$)' },

  // Transportation Engineering
  { id: 'fc-fe-27', examId: 'fe-civil', areaId: 'fe-transport', front: 'Superelevation of a horizontal curve (USCS)', back: '$e + f = \\dfrac{V^2}{15R}$ (V in mph, R in ft)' },
  { id: 'fc-fe-28', examId: 'fe-civil', areaId: 'fe-transport', front: 'Fundamental traffic flow relation', back: '$q = kv$ (flow veh/hr = density veh/mi × speed mi/hr)' },

  // Surveying
  { id: 'fc-fe-29', examId: 'fe-civil', areaId: 'fe-surveying', front: 'Sum of interior angles of a closed traverse', back: '$\\sum = (n-2)\\,180^\\circ$ (n = number of sides)' },

  // Construction Engineering
  { id: 'fc-fe-30', examId: 'fe-civil', areaId: 'fe-construction', front: 'Earned-value performance indices', back: '$CPI = \\dfrac{EV}{AC},\\quad SPI = \\dfrac{EV}{PV}$ (>1 good, <1 over budget / behind schedule)' },
];
