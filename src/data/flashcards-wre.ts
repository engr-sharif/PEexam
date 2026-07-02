import type { Flashcard } from '../types';

// Key formulas & facts for the PE Civil Water Resources & Environmental depth
// exam. Fronts/backs accept $tex$ — same conventions as flashcards.ts.
export const WRE_FLASHCARDS: Flashcard[] = [
  // Open-channel flow
  { id: 'fc-wre-1', examId: 'pe-wre', areaId: 'wre-open', front: "Manning's equation (USCS & SI)", back: '$Q = \\dfrac{k}{n}AR_h^{2/3}S^{1/2}$, $k=1.49$ (USCS), $k=1.0$ (SI); $R_h=A/P$' },
  { id: 'fc-wre-2', examId: 'pe-wre', areaId: 'wre-open', front: 'Critical depth (rectangular) & Froude number', back: '$y_c=\\left(\\dfrac{q^2}{g}\\right)^{1/3}$; $Fr=\\dfrac{V}{\\sqrt{gD_h}}$ (Fr<1 subcritical, Fr>1 supercritical)' },
  { id: 'fc-wre-3', examId: 'pe-wre', areaId: 'wre-open', front: 'Hydraulic jump conjugate (sequent) depths', back: '$\\dfrac{y_2}{y_1}=\\tfrac12\\left(\\sqrt{1+8Fr_1^2}-1\\right)$ (rectangular channel)' },

  // Closed-conduit hydraulics
  { id: 'fc-wre-4', examId: 'pe-wre', areaId: 'wre-closed', front: 'Darcy-Weisbach friction loss', back: '$h_f = f\\dfrac{L}{D}\\dfrac{V^2}{2g}$ (any fluid; f from Moody / Colebrook)' },
  { id: 'fc-wre-5', examId: 'pe-wre', areaId: 'wre-closed', front: 'Hazen-Williams velocity (USCS & SI)', back: '$V = 1.318\\,C R_h^{0.63} S^{0.54}$ (USCS); $V = 0.849\\,C R_h^{0.63} S^{0.54}$ (SI); water only' },
  { id: 'fc-wre-6', examId: 'pe-wre', areaId: 'wre-closed', front: 'Minor (fitting) losses', back: '$h_m = K\\dfrac{V^2}{2g}$; sum K values, or use equivalent length $L_e$' },
  { id: 'fc-wre-7', examId: 'pe-wre', areaId: 'wre-closed', front: 'Pump power & NPSH available', back: '$P=\\dfrac{\\gamma Q H}{\\eta}$ (WHP $=\\tfrac{QH}{3960}$, gpm·ft); $NPSH_a = h_{atm}+h_z-h_f-h_{vp}$' },

  // Hydrology
  { id: 'fc-wre-8', examId: 'pe-wre', areaId: 'wre-hydrology', front: 'Rational method peak flow', back: '$Q = CiA$; use i at duration $= t_c$' },
  { id: 'fc-wre-9', examId: 'pe-wre', areaId: 'wre-hydrology', front: 'NRCS (SCS) curve-number runoff', back: '$S=\\dfrac{1000}{CN}-10$ (in); $Q=\\dfrac{(P-0.2S)^2}{P+0.8S}$ for $P>0.2S$, else $Q=0$' },
  { id: 'fc-wre-10', examId: 'pe-wre', areaId: 'wre-hydrology', front: 'Risk of T-year event in n years', back: '$R = 1-\\left(1-\\tfrac{1}{T}\\right)^n$; annual exceedance probability $=1/T$' },
  { id: 'fc-wre-11', examId: 'pe-wre', areaId: 'wre-hydrology', front: "Rational method units check", back: "Q in cfs when i is in/hr and A in acres — 1 ac·in/hr = 1.008 cfs ≈ 1, so no conversion factor" },

  // Groundwater
  { id: 'fc-wre-12', examId: 'pe-wre', areaId: 'wre-groundwater', front: "Darcy velocity vs seepage velocity", back: '$v = Ki$ (Darcy/discharge velocity); $v_s = \\dfrac{v}{n_e}$ (actual pore velocity, $n_e$ = effective porosity)' },
  { id: 'fc-wre-13', examId: 'pe-wre', areaId: 'wre-groundwater', front: 'Steady well equations: Thiem (confined) & Dupuit (unconfined)', back: '$Q=\\dfrac{2\\pi Kb(h_2-h_1)}{\\ln(r_2/r_1)}$ confined ($T=Kb$); $Q=\\dfrac{\\pi K(h_2^2-h_1^2)}{\\ln(r_2/r_1)}$ unconfined' },

  // Water quality
  { id: 'fc-wre-14', examId: 'pe-wre', areaId: 'wre-quality', front: 'BOD exerted at time t', back: '$BOD_t = L_0\\left(1-e^{-kt}\\right)$; base-10 form uses $10^{-k_{10}t}$, $k = 2.303\\,k_{10}$' },
  { id: 'fc-wre-15', examId: 'pe-wre', areaId: 'wre-quality', front: 'Stream-discharge mixing (mass balance)', back: '$C_{mix}=\\dfrac{Q_1C_1+Q_2C_2}{Q_1+Q_2}$; works for BOD, DO, temperature, TDS' },

  // Drinking water treatment
  { id: 'fc-wre-16', examId: 'pe-wre', areaId: 'wre-drinking', front: 'Surface overflow rate & detention time', back: '$SOR = \\dfrac{Q}{A_{surface}}$ (gpd/ft²); $t = \\dfrac{V}{Q}$; particles with $v_s \\ge SOR$ are removed' },
  { id: 'fc-wre-17', examId: 'pe-wre', areaId: 'wre-drinking', front: 'CT disinfection concept & hardness equivalence', back: 'CT = residual C (mg/L) × contact $t_{10}$ (min) for required log inactivation; hardness: 1 meq/L = 50 mg/L as CaCO$_3$' },
  { id: 'fc-wre-18', examId: 'pe-wre', areaId: 'wre-drinking', front: 'Rapid-mix / flocculation velocity gradient', back: '$P = \\mu G^2 V \\Rightarrow G=\\sqrt{\\dfrac{P}{\\mu V}}$; also check $Gt$ product' },

  // Wastewater
  { id: 'fc-wre-19', examId: 'pe-wre', areaId: 'wre-wastewater', front: 'F/M ratio & solids retention time (SRT)', back: '$F/M=\\dfrac{QS_0}{VX}$; $SRT (\\theta_c)=\\dfrac{VX}{Q_wX_w+Q_eX_e}$' },
  { id: 'fc-wre-20', examId: 'pe-wre', areaId: 'wre-wastewater', front: 'Mass loading conversion (the 8.34 factor)', back: '$\\text{lb/day} = 8.34 \\times Q(\\text{MGD}) \\times C(\\text{mg/L})$' },

  // Analysis & design / flow measurement
  { id: 'fc-wre-21', examId: 'pe-wre', areaId: 'wre-analysis', front: 'Rectangular & V-notch weir equations (USCS)', back: '$Q = C_w L H^{3/2}$, $C_w\\approx 3.33$ (suppressed rectangular); $Q = 2.5\\tan(\\theta/2)H^{5/2}$ (V-notch)' },

  // Sitework
  { id: 'fc-wre-22', examId: 'pe-wre', areaId: 'wre-sitework', front: 'Earthwork shrink & swell', back: '$V_{loose}=V_{bank}(1+swell)$; $V_{compacted}=V_{bank}(1-shrink)$; borrow needed $=\\dfrac{V_{fill}}{1-shrink}$' },
];
