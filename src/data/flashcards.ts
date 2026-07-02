import type { Flashcard } from '../types';
import { WRE_FLASHCARDS } from './flashcards-wre';

// Key formulas & facts for spaced-repetition review. Fronts/backs accept $tex$.
export const FLASHCARDS: Flashcard[] = [
  // Geotech
  { id: 'fc-geo-1', examId: 'pe-geotech', areaId: 'geo-soilmech', front: 'Effective stress (Terzaghi)', back: "$\\sigma' = \\sigma - u$" },
  { id: 'fc-geo-2', examId: 'pe-geotech', areaId: 'geo-soilmech', front: 'Buoyant (submerged) unit weight', back: "$\\gamma' = \\gamma_{sat} - \\gamma_w$" },
  { id: 'fc-geo-3', examId: 'pe-geotech', areaId: 'geo-soilmech', front: 'Saturated phase relation', back: '$Se = wG_s$  (S=1 → $e = wG_s$)' },
  { id: 'fc-geo-4', examId: 'pe-geotech', areaId: 'geo-soilmech', front: 'Mohr-Coulomb strength', back: "$\\tau_f = c' + \\sigma'\\tan\\phi'$" },
  { id: 'fc-geo-5', examId: 'pe-geotech', areaId: 'geo-shallow', front: 'General bearing capacity', back: '$q_{ult} = cN_c + qN_q + \\tfrac12\\gamma B N_\\gamma$' },
  { id: 'fc-geo-6', examId: 'pe-geotech', areaId: 'geo-shallow', front: 'Bearing factors for φ = 0 (clay)', back: '$N_c = 5.14,\\ N_q = 1,\\ N_\\gamma = 0$' },
  { id: 'fc-geo-7', examId: 'pe-geotech', areaId: 'geo-retaining', front: 'Rankine active / passive coefficients', back: '$K_a=\\tan^2(45-\\phi/2),\\ K_p=\\tan^2(45+\\phi/2)$' },
  { id: 'fc-geo-8', examId: 'pe-geotech', areaId: 'geo-retaining', front: 'Active thrust (dry, cohesionless)', back: '$P_a = \\tfrac12 K_a\\gamma H^2$ at H/3' },
  { id: 'fc-geo-9', examId: 'pe-geotech', areaId: 'geo-earthstruct', front: 'Primary consolidation (NC)', back: "$S_c=\\dfrac{C_c}{1+e_0}H\\log\\dfrac{\\sigma_0'+\\Delta\\sigma}{\\sigma_0'}$" },
  { id: 'fc-geo-10', examId: 'pe-geotech', areaId: 'geo-earthstruct', front: 'Consolidation Tv at U=50% and 90%', back: '$T_{v,50}=0.197,\\ T_{v,90}=0.848$' },
  { id: 'fc-geo-11', examId: 'pe-geotech', areaId: 'geo-earthstruct', front: 'Time of consolidation', back: '$t = \\dfrac{T_v H_{dr}^2}{c_v}$ (double drainage → $H_{dr}=H/2$)' },
  { id: 'fc-geo-12', examId: 'pe-geotech', areaId: 'geo-earthstruct', front: 'Infinite slope FS (dry, c=0)', back: '$FS=\\tan\\phi/\\tan\\beta$' },
  { id: 'fc-geo-13', examId: 'pe-geotech', areaId: 'geo-groundwater', front: 'Seepage from flow net', back: '$q = kH\\dfrac{N_f}{N_d}$' },
  { id: 'fc-geo-14', examId: 'pe-geotech', areaId: 'geo-groundwater', front: 'Critical hydraulic gradient', back: "$i_{cr}=\\gamma'/\\gamma_w$" },
  { id: 'fc-geo-15', examId: 'pe-geotech', areaId: 'geo-earthquake', front: 'Cyclic stress ratio (liquefaction)', back: "$CSR=0.65\\dfrac{a_{max}}{g}\\dfrac{\\sigma_v}{\\sigma_v'}r_d$" },

  // Seismic
  { id: 'fc-seis-1', examId: 'ca-seismic', areaId: 'seis-data', front: 'Design spectral accelerations', back: '$S_{DS}=\\tfrac23 F_a S_S,\\ S_{D1}=\\tfrac23 F_v S_1$' },
  { id: 'fc-seis-2', examId: 'ca-seismic', areaId: 'seis-buildings', front: 'Seismic base shear', back: '$V=C_s W,\\quad C_s=\\dfrac{S_{DS}}{R/I_e}$' },
  { id: 'fc-seis-3', examId: 'ca-seismic', areaId: 'seis-buildings', front: 'Cs upper limit (T ≤ TL)', back: '$C_{s,max}=\\dfrac{S_{D1}}{T(R/I_e)}$' },
  { id: 'fc-seis-4', examId: 'ca-seismic', areaId: 'seis-buildings', front: 'Approximate period', back: '$T_a = C_t h_n^{x}$' },
  { id: 'fc-seis-5', examId: 'ca-seismic', areaId: 'seis-buildings', front: 'Vertical force distribution', back: '$F_x=C_{vx}V,\\ C_{vx}=\\dfrac{w_x h_x^k}{\\sum w_i h_i^k}$' },
  { id: 'fc-seis-6', examId: 'ca-seismic', areaId: 'seis-nonbuilding', front: 'Component force Fp', back: '$F_p=\\dfrac{0.4a_p S_{DS}W_p}{R_p/I_p}(1+2z/h)$' },
  { id: 'fc-seis-7', examId: 'ca-seismic', areaId: 'seis-characteristics', front: 'Natural period (SDOF)', back: '$T=2\\pi\\sqrt{m/k}$' },
  { id: 'fc-seis-8', examId: 'ca-seismic', areaId: 'seis-analysis', front: 'Vertical seismic load effect', back: '$E_v = 0.2 S_{DS} D$' },
  { id: 'fc-seis-9', examId: 'ca-seismic', areaId: 'seis-buildings', front: 'Design story drift', back: '$\\delta_x = \\dfrac{C_d \\delta_{xe}}{I_e}$' },

  // Surveying
  { id: 'fc-surv-1', examId: 'ca-surveying', areaId: 'surv-construction', front: 'Curve tangent & length', back: '$T=R\\tan(\\Delta/2),\\ L=\\dfrac{\\pi R\\Delta}{180}$' },
  { id: 'fc-surv-2', examId: 'ca-surveying', areaId: 'surv-construction', front: 'Long chord & middle ordinate', back: '$LC=2R\\sin(\\Delta/2),\\ M=R(1-\\cos\\tfrac\\Delta2)$' },
  { id: 'fc-surv-3', examId: 'ca-surveying', areaId: 'surv-construction', front: 'Degree of curve (arc)', back: '$R=\\dfrac{5729.58}{D}$' },
  { id: 'fc-surv-4', examId: 'ca-surveying', areaId: 'surv-construction', front: 'Vertical curve turning point', back: '$x=\\dfrac{-g_1 L}{A},\\ A=g_2-g_1$' },
  { id: 'fc-surv-5', examId: 'ca-surveying', areaId: 'surv-construction', front: 'Average end area volume', back: '$V=\\dfrac{L}{2}(A_1+A_2)$' },
  { id: 'fc-surv-6', examId: 'ca-surveying', areaId: 'surv-construction', front: 'Prismoidal volume', back: '$V=\\dfrac{L}{6}(A_1+4A_m+A_2)$' },
  { id: 'fc-surv-7', examId: 'ca-surveying', areaId: 'surv-error', front: 'Linear error of closure', back: '$LEC=\\sqrt{(\\Sigma lat)^2+(\\Sigma dep)^2}$' },
  { id: 'fc-surv-8', examId: 'ca-surveying', areaId: 'surv-topo', front: 'Latitude & departure', back: '$lat=L\\cos(Az),\\ dep=L\\sin(Az)$' },
  { id: 'fc-surv-9', examId: 'ca-surveying', areaId: 'surv-reports', front: 'PLSS section area', back: '1 section = 1 mi² = 640 acres' },
  ...WRE_FLASHCARDS,
];
