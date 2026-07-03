import type { Lesson } from '../../types';

// FE Civil rapid-review lessons, batch 2. First-principles refreshers keyed to
// FE Reference Handbook equations, tuned for the ~3 minutes/question pace.
export const feLessons2: Lesson[] = [
  // -------------------------------------------------------------------------
  // 1. Fluid Mechanics
  // -------------------------------------------------------------------------
  {
    id: 'fe-fluids-core',
    examId: 'fe-civil',
    areaId: 'fe-fluids',
    title: 'Fluid Statics & Dynamics Essentials',
    objective:
      'Compute hydrostatic pressures and gate forces, apply buoyancy, and solve continuity/Bernoulli pipe problems fast enough for the FE clock.',
    estMinutes: 18,
    blocks: [
      {
        kind: 'prose',
        html: `<p>Almost every FE fluids question starts from one idea: in a static fluid, pressure grows linearly with depth. From there the exam builds gate forces, manometers, and buoyancy. The dynamic half of the topic is just two bookkeeping laws — <b>continuity</b> (mass in = mass out) and the <b>Bernoulli/energy equation</b> (head in = head out ± losses).</p>`,
      },
      {
        kind: 'formula',
        tex: 'p = \\gamma h = \\rho g h',
        caption: 'Hydrostatic pressure at depth h below a free surface (gage)',
      },
      {
        kind: 'prose',
        html: `<p><b>Force on a plane submerged surface</b> — the FE Reference Handbook gives the resultant and its location (center of pressure):</p>`,
      },
      {
        kind: 'formula',
        tex: 'F_R = \\gamma \\bar{h} A, \\qquad y_{cp} = \\bar{y} + \\dfrac{I_{xc}}{\\bar{y}A}',
        caption:
          'Resultant on a plane surface (h̄ = depth of centroid) and center of pressure measured along the plane from the free surface',
      },
      {
        kind: 'callout',
        tone: 'key',
        html: `The center of pressure is <b>always below the centroid</b> (deeper water pushes harder). For a rectangle, <span class="tex">I_{xc} = bh^3/12</span>. For a rectangular gate whose top edge is at the surface, the resultant acts at 2/3 of the depth — a free sanity check.`,
      },
      {
        kind: 'formula',
        tex: 'F_B = \\gamma_f V_{displaced}',
        caption: "Archimedes: buoyant force = weight of displaced fluid. Floating: weight = buoyancy.",
      },
      {
        kind: 'formula',
        tex: 'Q = A_1 V_1 = A_2 V_2, \\qquad \\dfrac{p_1}{\\gamma}+\\dfrac{V_1^2}{2g}+z_1 = \\dfrac{p_2}{\\gamma}+\\dfrac{V_2^2}{2g}+z_2 + h_L',
        caption: 'Continuity and the energy (Bernoulli) equation between two sections; drop h_L for an ideal fluid',
      },
      {
        kind: 'formula',
        tex: 'Re = \\dfrac{VD}{\\nu} = \\dfrac{\\rho V D}{\\mu}',
        caption: 'Reynolds number: laminar below ~2100, turbulent above ~4000 (pipe flow)',
      },
      {
        kind: 'example',
        title: 'Force on a vertical rectangular gate',
        steps: [
          {
            text: 'A vertical gate 4 ft wide and 6 ft tall has its top edge 8 ft below the water surface. Find the resultant force and its depth. γ = 62.4 lb/ft³.',
          },
          {
            text: 'Centroid depth = 8 + 6/2 = 11 ft; area A = 4 × 6 = 24 ft². Resultant:',
            tex: 'F_R = \\gamma \\bar{h} A = 62.4(11)(24) = 16{,}474\\ \\text{lb} \\approx 16.5\\ \\text{kip}',
          },
          {
            text: 'Moment of inertia of the gate about its own centroid:',
            tex: 'I_{xc} = \\dfrac{bh^3}{12} = \\dfrac{4(6)^3}{12} = 72\\ \\text{ft}^4',
          },
          {
            text: 'Center of pressure (vertical gate, so ȳ = h̄ = 11 ft):',
            tex: 'y_{cp} = 11 + \\dfrac{72}{11(24)} = 11 + 0.27 = 11.27\\ \\text{ft below the surface}',
          },
          {
            text: 'Check: y_cp is below the centroid (11.27 > 11) and within the gate (8 to 14 ft). Done in under two minutes.',
          },
        ],
      },
      {
        kind: 'example',
        title: 'Bernoulli through a pipe contraction',
        steps: [
          {
            text: 'Water (ρ = 1000 kg/m³) flows at Q = 0.05 m³/s through a horizontal pipe that contracts from D₁ = 0.30 m to D₂ = 0.15 m. If p₁ = 200 kPa, find p₂ (neglect losses).',
          },
          {
            text: 'Continuity for the velocities:',
            tex: 'V_1 = \\dfrac{Q}{A_1} = \\dfrac{0.05}{\\tfrac{\\pi}{4}(0.30)^2} = 0.707\\ \\text{m/s}, \\qquad V_2 = 4V_1 = 2.83\\ \\text{m/s}',
          },
          {
            text: 'Bernoulli with z₁ = z₂ (horizontal), solved for p₂:',
            tex: 'p_2 = p_1 + \\tfrac{\\rho}{2}\\left(V_1^2 - V_2^2\\right) = 200{,}000 + 500(0.50 - 8.01)',
          },
          {
            text: 'Evaluate:',
            tex: 'p_2 = 200{,}000 - 3{,}753 \\approx 196.2\\ \\text{kPa}',
          },
          {
            text: 'Sense check: the flow speeds up into the contraction, so pressure must drop. Halving D quadruples V — a shortcut worth memorizing.',
          },
        ],
      },
      {
        kind: 'callout',
        tone: 'warn',
        html: `Gage vs absolute pressure trips people under time pressure. Bernoulli works with either, <b>as long as you are consistent on both sides</b>. Manometer and vapor-pressure (cavitation) questions usually need absolute.`,
      },
    ],
    tips: [
      'Halving a pipe diameter quadruples velocity (A ∝ D²) — use this instead of recomputing areas.',
      'For gate problems, write FR = γh̄A first; more than half the time the question only asks for the force, not the center of pressure.',
      'Keep γ_water = 62.4 lb/ft³ = 9.81 kN/m³ and ν_water ≈ 1×10⁻⁶ m²/s at your fingertips — the handbook lookup costs you 30 seconds.',
    ],
  },

  // -------------------------------------------------------------------------
  // 2. Water Resources
  // -------------------------------------------------------------------------
  {
    id: 'fe-wre-core',
    examId: 'fe-civil',
    areaId: 'fe-wre',
    title: 'Water Resources Rapid Review',
    objective:
      "Solve open-channel flow with Manning's equation, size runoff with the rational and NRCS methods, and handle pump power, BOD, and detention-time questions on sight.",
    estMinutes: 18,
    blocks: [
      {
        kind: 'prose',
        html: `<p>Water resources on the FE is formula-driven and generous: nearly every equation is printed in the handbook. Your edge is knowing <b>which</b> equation each prompt is pointing at and keeping the units straight.</p>`,
      },
      {
        kind: 'formula',
        tex: 'V = \\dfrac{K}{n} R_H^{2/3} S^{1/2}, \\qquad Q = VA, \\qquad R_H = \\dfrac{A}{P}',
        caption: "Manning's equation: K = 1.486 (USCS, ft/s) or 1.0 (SI, m/s); R_H = area / wetted perimeter",
      },
      {
        kind: 'callout',
        tone: 'key',
        html: `The wetted perimeter <b>excludes the free surface</b>. Rectangular channel: <span class="tex">A = by</span>, <span class="tex">P = b + 2y</span>. Full circular pipe: <span class="tex">R_H = D/4</span> — memorize that one.`,
      },
      {
        kind: 'animation',
        component: 'OpenChannel',
        caption: 'Vary depth, slope, and roughness n and watch velocity and discharge respond in the Manning equation.',
      },
      {
        kind: 'formula',
        tex: 'Q = CiA',
        caption:
          'Rational method: Q in cfs when i is in in/hr and A in acres (1 ac-in/hr = 1.008 cfs ≈ 1 cfs). Pick i at the time of concentration.',
      },
      {
        kind: 'formula',
        tex: 'S = \\dfrac{1000}{CN} - 10, \\qquad Q_d = \\dfrac{(P - 0.2S)^2}{P + 0.8S}',
        caption: 'NRCS (SCS) curve-number runoff depth (inches); valid when P > 0.2S (initial abstraction)',
      },
      {
        kind: 'formula',
        tex: 'P_{water} = \\dfrac{\\gamma Q H}{\\eta_{pump}}, \\qquad \\text{brake power} \\times \\eta = \\text{water power}',
        caption: 'Pump power: γQH is the power delivered to the water; divide by efficiency for input power',
      },
      {
        kind: 'formula',
        tex: 'BOD_t = L_0\\left(1 - e^{-kt}\\right), \\qquad t_d = \\dfrac{V}{Q}',
        caption: 'First-order BOD exerted at time t (L₀ = ultimate BOD) and hydraulic detention time of a basin',
      },
      {
        kind: 'example',
        title: 'Manning capacity of a rectangular channel',
        steps: [
          {
            text: 'Concrete channel (n = 0.013), width b = 8 ft, flow depth y = 2 ft, slope S = 0.002. Find Q.',
          },
          {
            text: 'Geometry:',
            tex: 'A = 8(2) = 16\\ \\text{ft}^2, \\quad P = 8 + 2(2) = 12\\ \\text{ft}, \\quad R_H = \\tfrac{16}{12} = 1.333\\ \\text{ft}',
          },
          {
            text: 'Velocity from Manning (USCS, K = 1.486):',
            tex: 'V = \\dfrac{1.486}{0.013}(1.333)^{2/3}(0.002)^{1/2} = 114.3(1.211)(0.0447) = 6.19\\ \\text{ft/s}',
          },
          {
            text: 'Discharge:',
            tex: 'Q = VA = 6.19(16) \\approx 99\\ \\text{cfs}',
          },
        ],
      },
      {
        kind: 'example',
        title: 'Rational-method peak flow',
        steps: [
          {
            text: 'A 12-acre commercial site has runoff coefficient C = 0.80. The design storm intensity at the time of concentration is i = 2.5 in/hr. Find the peak discharge.',
          },
          {
            text: 'Direct substitution — the mixed units are self-consistent:',
            tex: 'Q = CiA = 0.80(2.5)(12) = 24\\ \\text{cfs}',
          },
          {
            text: 'For a composite watershed, area-weight C first: C_w = ΣC_jA_j / ΣA_j, then apply Q = C_w i A_total.',
          },
        ],
      },
      {
        kind: 'callout',
        tone: 'warn',
        html: `The rational method is for <b>small</b> watersheds (roughly &lt; 200 acres) and gives <b>peak flow (cfs)</b>; the NRCS CN method gives <b>runoff depth (inches)</b>. Questions love to ask for one and tempt you with the other.`,
      },
    ],
    tips: [
      'In Q = CiA, resist converting units — in/hr times acres already yields cfs within 1%. Converting wastes a minute and invites errors.',
      "Manning slope S is a decimal (ft/ft), not percent. A '0.5% slope' is S = 0.005.",
      'Pump questions: compute γQH first, then decide whether to divide by η (input power asked) or multiply (output asked). Efficiency always makes input bigger.',
    ],
  },

  // -------------------------------------------------------------------------
  // 3. Structural
  // -------------------------------------------------------------------------
  {
    id: 'fe-structural-analysis',
    examId: 'fe-civil',
    areaId: 'fe-structural',
    title: 'Beams, Deflections & Buckling',
    objective:
      'Recall the standard beam moment/deflection formulas, apply Euler buckling with effective length factors, and dispatch determinacy, tributary-area, and load-combination questions in seconds.',
    estMinutes: 20,
    blocks: [
      {
        kind: 'prose',
        html: `<p>The FE does not ask you to derive beam theory — it asks you to <b>recognize the standard case</b> and plug in. The handbook tabulates simply supported and cantilever results; these four cover the vast majority of questions:</p>`,
      },
      {
        kind: 'table',
        caption: 'Beam formulas to know cold (E = modulus, I = moment of inertia)',
        headers: ['Case', 'Max moment', 'Max deflection'],
        rows: [
          ['Simple beam, uniform w', 'wL²/8 (midspan)', '5wL⁴/384EI'],
          ['Simple beam, midspan P', 'PL/4 (midspan)', 'PL³/48EI'],
          ['Cantilever, tip load P', 'PL (at fixed end)', 'PL³/3EI'],
          ['Cantilever, uniform w', 'wL²/2 (at fixed end)', 'wL⁴/8EI'],
        ],
      },
      {
        kind: 'formula',
        tex: '\\sigma = \\dfrac{Mc}{I} = \\dfrac{M}{S}, \\qquad \\tau = \\dfrac{VQ}{Ib}',
        caption: 'Flexure and transverse shear stress — pair these with the tabulated M and V',
      },
      {
        kind: 'formula',
        tex: 'P_{cr} = \\dfrac{\\pi^2 E I}{(K L)^2}',
        caption:
          'Euler buckling. Theoretical K: pinned-pinned 1.0, fixed-fixed 0.5, fixed-pinned 0.7, fixed-free 2.0',
      },
      {
        kind: 'callout',
        tone: 'key',
        html: `Buckling always occurs about the axis with the <b>smaller I</b> (weak axis) unless bracing prevents it. If the two axes have different bracing, compute <span class="tex">KL</span> for each and take the case with the larger <span class="tex">KL/r</span> (smaller <span class="tex">P_{cr}</span>).`,
      },
      {
        kind: 'formula',
        tex: 'm + r \\;\\text{vs}\\; 2j',
        caption:
          'Truss determinacy: m + r = 2j determinate; m + r > 2j indeterminate (degree = excess); m + r < 2j unstable',
      },
      {
        kind: 'prose',
        html: `<p><b>Tributary area</b> converts area loads to member loads: an interior beam carries a strip half a bay wide on each side, so <span class="tex">w = q \\times s</span> (psf × tributary width). An interior column carries one full bay: <span class="tex">P = q \\times (L_1 \\times L_2)</span>. For strength design, the workhorse load combination is:</p>`,
      },
      {
        kind: 'formula',
        tex: 'U = 1.2D + 1.6L',
        caption: 'Basic LRFD gravity combination (also check 1.4D — it rarely governs unless L is tiny)',
      },
      {
        kind: 'example',
        title: 'Midspan deflection of a simple beam',
        steps: [
          {
            text: 'A simply supported steel beam spans L = 20 ft carrying w = 2 kip/ft (total, service). E = 29,000 ksi, I = 800 in⁴. Find the maximum deflection.',
          },
          {
            text: 'Convert to consistent units first — kips and inches:',
            tex: 'w = \\dfrac{2}{12} = 0.1667\\ \\text{kip/in}, \\qquad L = 240\\ \\text{in}',
          },
          {
            text: 'Apply the tabulated formula:',
            tex: '\\delta_{max} = \\dfrac{5wL^4}{384EI} = \\dfrac{5(0.1667)(240)^4}{384(29{,}000)(800)}',
          },
          {
            text: 'Evaluate (240⁴ = 3.318×10⁹ in⁴):',
            tex: '\\delta_{max} = \\dfrac{2.765\\times10^9}{8.909\\times10^9} = 0.31\\ \\text{in}',
          },
          {
            text: 'Bonus check: L/360 = 240/360 = 0.67 in, so this beam passes the typical live-load deflection limit. Max moment would be wL²/8 = 2(20)²/8 = 100 kip-ft.',
          },
        ],
      },
      {
        kind: 'example',
        title: 'Euler buckling load of a pinned column',
        steps: [
          {
            text: 'A pinned-pinned steel column has L = 12 ft, E = 29,000 ksi, and weak-axis I = 50 in⁴. Find the Euler buckling load, then the load if the column were fixed-free.',
          },
          {
            text: 'Pinned-pinned: K = 1.0, KL = 144 in.',
            tex: 'P_{cr} = \\dfrac{\\pi^2(29{,}000)(50)}{(144)^2} = \\dfrac{1.431\\times10^7}{20{,}736} = 690\\ \\text{kips}',
          },
          {
            text: 'Fixed-free (flagpole): K = 2.0, so (KL)² quadruples and P_cr divides by 4:',
            tex: 'P_{cr} = \\dfrac{690}{4} \\approx 173\\ \\text{kips}',
          },
          {
            text: 'Pattern: P_cr scales with 1/K². Fixing both ends (K = 0.5) would instead multiply the pinned value by 4.',
          },
        ],
      },
      {
        kind: 'callout',
        tone: 'warn',
        html: `The single biggest deflection error is <b>mixed units</b>: w in kip/ft with L in inches. Convert everything to kips and inches (or N and mm) before touching the formula — E is already in ksi, so follow its lead.`,
      },
    ],
    tips: [
      'Memorize the four table cases; deriving a deflection by double integration during the exam is a 10-minute trap.',
      'K-factor questions are free points: sketch the buckled shape — more end restraint means shorter effective length means higher capacity.',
      'For determinacy, count fast: r = 3 for a pin + roller, each truss joint contributes 2 equations. Check m + r vs 2j before analyzing anything.',
    ],
  },

  // -------------------------------------------------------------------------
  // 4. Geotechnical
  // -------------------------------------------------------------------------
  {
    id: 'fe-geotech-core',
    examId: 'fe-civil',
    areaId: 'fe-geotech',
    title: 'Geotech Fundamentals for the FE',
    objective:
      'Work the soil phase diagram with Se = wGs, build total/pore/effective stress profiles, and recall Rankine Ka, the φ = 0 bearing case, and one-step consolidation settlement.',
    estMinutes: 18,
    blocks: [
      {
        kind: 'prose',
        html: `<p>FE geotech rewards two habits: <b>draw the phase diagram</b> (solids, water, air) for any weight-volume question, and <b>draw the soil column</b> for any stress question. The handbook lists a dozen phase identities, but they all fall out of one anchor relation plus the definitions:</p>`,
      },
      {
        kind: 'formula',
        tex: 'S e = w G_s',
        caption: 'The phase-diagram anchor: saturation × void ratio = water content × specific gravity (always true)',
      },
      {
        kind: 'formula',
        tex: '\\gamma_d = \\dfrac{G_s \\gamma_w}{1+e}, \\qquad \\gamma = \\gamma_d (1 + w), \\qquad n = \\dfrac{e}{1+e}',
        caption: 'Dry unit weight, total (moist) unit weight, and porosity from void ratio',
      },
      {
        kind: 'formula',
        tex: "\\sigma' = \\sigma - u, \\qquad \\sigma = \\sum \\gamma_i h_i, \\qquad u = \\gamma_w h_w",
        caption: "Terzaghi's effective stress: total stress from the soil column minus hydrostatic pore pressure",
      },
      {
        kind: 'animation',
        component: 'StressProfile',
        caption: 'Drag the water table and watch σ, u, and σ′ rebuild with depth — the exact picture to sketch on exam scratch paper.',
      },
      {
        kind: 'formula',
        tex: 'K_a = \\tan^2\\!\\left(45^\\circ - \\tfrac{\\phi}{2}\\right), \\qquad P_a = \\tfrac{1}{2} K_a \\gamma H^2',
        caption: 'Rankine active pressure coefficient and the triangular active thrust (resultant at H/3 above the base)',
      },
      {
        kind: 'formula',
        tex: 'q_{ult} = c N_c + q N_q + \\tfrac{1}{2}\\gamma B N_\\gamma \\;\\xrightarrow{\\;\\phi=0\\;}\\; q_{ult} = 5.14\\, s_u + \\gamma D_f',
        caption: 'Bearing capacity; the saturated-clay shortcut uses Nc = 5.14, Nq = 1, Nγ = 0',
      },
      {
        kind: 'formula',
        tex: "S_c = \\dfrac{C_c}{1+e_0} H \\log\\dfrac{\\sigma'_0 + \\Delta\\sigma}{\\sigma'_0}",
        caption: 'One-step primary consolidation settlement of a normally consolidated clay layer',
      },
      {
        kind: 'example',
        title: 'Phase relations from w, Gs, and S',
        steps: [
          {
            text: 'A soil has water content w = 20%, Gs = 2.70, and saturation S = 90%. Find e, γd, and the moist unit weight γ (γw = 62.4 pcf).',
          },
          {
            text: 'Void ratio from the anchor relation:',
            tex: 'e = \\dfrac{w G_s}{S} = \\dfrac{0.20(2.70)}{0.90} = 0.60',
          },
          {
            text: 'Dry unit weight:',
            tex: '\\gamma_d = \\dfrac{G_s \\gamma_w}{1+e} = \\dfrac{2.70(62.4)}{1.60} = 105.3\\ \\text{pcf}',
          },
          {
            text: 'Moist unit weight:',
            tex: '\\gamma = \\gamma_d(1+w) = 105.3(1.20) = 126.4\\ \\text{pcf}',
          },
        ],
      },
      {
        kind: 'example',
        title: 'Effective stress at 6 m',
        steps: [
          {
            text: 'Moist sand (γ = 16 kN/m³) from 0 to 2 m; water table at 2 m; saturated sand (γsat = 19 kN/m³) below. Find σ′ at 6 m depth.',
          },
          {
            text: 'Total stress from the column:',
            tex: '\\sigma = 16(2) + 19(4) = 32 + 76 = 108\\ \\text{kPa}',
          },
          {
            text: 'Pore pressure (6 − 2 = 4 m of water above the point):',
            tex: 'u = 9.81(4) = 39.2\\ \\text{kPa}',
          },
          {
            text: 'Effective stress:',
            tex: "\\sigma' = 108 - 39.2 = 68.8\\ \\text{kPa}",
          },
          {
            text: 'Shortcut check with buoyant weight below the water table: σ′ = 16(2) + (19 − 9.81)(4) = 32 + 36.8 = 68.8 kPa ✓',
          },
        ],
      },
      {
        kind: 'callout',
        tone: 'warn',
        html: `Water content w is weight of water over weight of <b>solids</b>, not total weight — so w can exceed 100% in soft clays. And use <span class="tex">\\gamma_{sat}</span> below the water table in the total-stress sum, never <span class="tex">\\gamma_d</span>.`,
      },
    ],
    tips: [
      'If a phase problem stalls, assume Vs = 1: then Vv = e, Ww = wGs·γw, and everything cascades in one pass.',
      'Ka questions: φ = 30° gives Ka = 1/3 exactly — a common answer choice you can verify mentally.',
      'Consolidation prompts on the FE are almost always one formula, one log. Compute the log argument first; if it is less than 1 you mixed up σ′₀ and Δσ.',
    ],
  },

  // -------------------------------------------------------------------------
  // 5. Transportation
  // -------------------------------------------------------------------------
  {
    id: 'fe-transport-core',
    examId: 'fe-civil',
    areaId: 'fe-transport',
    title: 'Transportation: Curves, Sight Distance & Traffic',
    objective:
      'Compute horizontal and vertical curve elements, build stopping sight distance from reaction + braking, and answer superelevation, flow, PHF, LOS, and MUTCD questions from memory.',
    estMinutes: 20,
    blocks: [
      {
        kind: 'prose',
        html: `<p>Transportation questions split into <b>geometry</b> (curves, sight distance, superelevation) and <b>traffic</b> (flow relationships, capacity, control devices). The geometry formulas are in the handbook; the traffic definitions are quick recall.</p>`,
      },
      {
        kind: 'formula',
        tex: 'T = R\\tan\\tfrac{\\Delta}{2}, \\qquad L = \\dfrac{\\pi}{180} R\\,\\Delta, \\qquad E = R\\left(\\sec\\tfrac{\\Delta}{2} - 1\\right), \\qquad M = R\\left(1 - \\cos\\tfrac{\\Delta}{2}\\right)',
        caption: 'Horizontal circular curve: tangent, arc length, external distance, middle ordinate (Δ in degrees for L)',
      },
      {
        kind: 'callout',
        tone: 'key',
        html: `Stationing along a horizontal curve: <b>PC = PI − T</b> and <b>PT = PC + L</b> (along the arc, <i>not</i> PI + T). For vertical curves, length is horizontal: elevations follow <span class="tex">y = y_{BVC} + g_1 x + \\tfrac{g_2 - g_1}{2L}x^2</span>, and the high/low point sits at <span class="tex">x = \\tfrac{g_1 L}{g_1 - g_2}</span>.`,
      },
      {
        kind: 'formula',
        tex: 'SSD = 1.47\\,V t + \\dfrac{V^2}{30\\left(\\tfrac{a}{32.2} \\pm G\\right)}',
        caption:
          'Stopping sight distance (V in mph, ft out): reaction distance + braking distance. AASHTO defaults t = 2.5 s, a = 11.2 ft/s²; grade G as a decimal, + upgrade, − downgrade',
      },
      {
        kind: 'formula',
        tex: 'e + f = \\dfrac{V^2}{15R}',
        caption: 'Superelevation (V in mph, R in ft): side friction f plus banking e balance the curve speed',
      },
      {
        kind: 'formula',
        tex: 'q = k v, \\qquad PHF = \\dfrac{V}{4 \\times V_{15}}',
        caption:
          'Fundamental traffic relation (flow = density × speed) and peak hour factor (V = hourly volume, V₁₅ = peak 15-min count)',
      },
      {
        kind: 'table',
        caption: 'Recall ladders: level of service and MUTCD sign colors',
        headers: ['Item', 'Meaning'],
        rows: [
          ['LOS A → F', 'Free flow → forced/breakdown flow; capacity is reached at LOS E'],
          ['Red / Yellow', 'Stop or prohibition / general warning'],
          ['Orange', 'Temporary traffic control (work zones)'],
          ['Green / Blue', 'Guide and direction / motorist services'],
          ['Brown / Fluor. yellow-green', 'Recreation-cultural / pedestrian, bicycle, school warning'],
        ],
      },
      {
        kind: 'example',
        title: 'Stopping sight distance at 45 mph',
        steps: [
          {
            text: 'Find the design SSD for V = 45 mph on level grade using AASHTO defaults (t = 2.5 s, a = 11.2 ft/s²).',
          },
          {
            text: 'Reaction (brake-perception) distance:',
            tex: 'd_r = 1.47\\,V t = 1.47(45)(2.5) = 165.4\\ \\text{ft}',
          },
          {
            text: 'Braking distance, level grade (a/32.2 = 0.348):',
            tex: 'd_b = \\dfrac{V^2}{30(0.348)} = \\dfrac{2025}{10.43} = 194.1\\ \\text{ft}',
          },
          {
            text: 'Total:',
            tex: 'SSD = 165.4 + 194.1 = 359.5 \\approx 360\\ \\text{ft}',
          },
          {
            text: 'A downgrade would subtract G in the denominator, shrinking it and lengthening the braking distance — downhill always needs more room.',
          },
        ],
      },
      {
        kind: 'example',
        title: 'Horizontal curve elements',
        steps: [
          {
            text: 'A horizontal curve has R = 800 ft and Δ = 30°. Find the tangent length and curve length; if the PI is at station 25+00, station the PC.',
          },
          {
            text: 'Tangent:',
            tex: 'T = R\\tan\\tfrac{\\Delta}{2} = 800\\tan 15^\\circ = 800(0.268) = 214.4\\ \\text{ft}',
          },
          {
            text: 'Arc length:',
            tex: 'L = \\dfrac{\\pi}{180}(800)(30) = 418.9\\ \\text{ft}',
          },
          {
            text: 'Stationing:',
            tex: 'PC = PI - T = 2500 - 214.4 = 2285.6 \\Rightarrow \\text{Sta } 22{+}85.6',
          },
          { text: 'And PT = PC + L = 2285.6 + 418.9 = 2704.5 → Sta 27+04.5.' },
        ],
      },
      {
        kind: 'callout',
        tone: 'warn',
        html: `Unit landmines: SSD and superelevation formulas take V in <b>mph</b> (the 1.47, 30, and 15 constants absorb the conversions). If a problem hands you ft/s, convert to mph first or use the ft/s forms <span class="tex">d_r = Vt</span>, <span class="tex">d_b = V^2/2a</span>.`,
      },
    ],
    tips: [
      'Memorize 1.47 ft/s per mph (and 1 mph ≈ 1.47 ft/s both ways) — it unlocks every sight-distance problem without derivation.',
      'Curve questions usually want only one element. Identify whether they ask T, L, E, or M before computing anything else.',
      'PHF is at most 1.0; if your answer exceeds 1, you inverted the ratio. Typical urban values run 0.85–0.95.',
    ],
  },

  // -------------------------------------------------------------------------
  // 6. Surveying
  // -------------------------------------------------------------------------
  {
    id: 'fe-surveying-core',
    examId: 'fe-civil',
    areaId: 'fe-surveying',
    title: 'Surveying Quick Kit',
    objective:
      'Convert bearings and azimuths, compute latitudes/departures and shoelace areas, run a differential level loop with HI, and move between slope and horizontal distance.',
    estMinutes: 16,
    blocks: [
      {
        kind: 'prose',
        html: `<p>Surveying is the most formula-light area on the FE — it is really trigonometry with vocabulary. Nail the conventions and the arithmetic is fast.</p>
        <ul class="list-disc ml-5 space-y-1">
          <li><b>Azimuth</b>: 0°–360°, clockwise from north.</li>
          <li><b>Bearing</b>: acute angle from north or south toward east or west, e.g. N 30° E (azimuth 30°) or S 45° E (azimuth 135°).</li>
          <li><b>Back-azimuth</b> = azimuth ± 180°.</li>
        </ul>`,
      },
      {
        kind: 'formula',
        tex: '\\text{Lat} = L\\cos\\alpha, \\qquad \\text{Dep} = L\\sin\\alpha',
        caption:
          'Latitude (north-south) and departure (east-west) of a course of length L and azimuth α; a closed traverse must have ΣLat = ΣDep = 0',
      },
      {
        kind: 'formula',
        tex: 'A = \\tfrac{1}{2}\\left|\\sum_{i}\\left(x_i y_{i+1} - x_{i+1} y_i\\right)\\right|',
        caption: 'Shoelace (coordinate) area formula — wrap around: the last vertex pairs with the first',
      },
      {
        kind: 'formula',
        tex: 'HI = \\text{Elev}_{BM} + BS, \\qquad \\text{Elev}_{pt} = HI - FS',
        caption: 'Differential leveling: add the backsight to get the height of instrument, subtract the foresight',
      },
      {
        kind: 'formula',
        tex: 'H = S\\cos\\theta = S\\sin z, \\qquad \\text{grade} = \\dfrac{\\Delta \\text{elev}}{H} \\times 100\\%',
        caption: 'Horizontal distance from slope distance S (θ = vertical angle from horizontal, z = zenith angle) and percent grade',
      },
      {
        kind: 'example',
        title: 'Two-setup level run',
        steps: [
          {
            text: 'BM elevation 100.00 ft. Setup 1: BS on BM = 4.32, FS on TP1 = 6.78. Setup 2: BS on TP1 = 5.10, FS on point A = 3.22. Find the elevation of A.',
          },
          {
            text: 'Setup 1:',
            tex: 'HI_1 = 100.00 + 4.32 = 104.32, \\qquad \\text{Elev}_{TP1} = 104.32 - 6.78 = 97.54\\ \\text{ft}',
          },
          {
            text: 'Setup 2:',
            tex: 'HI_2 = 97.54 + 5.10 = 102.64, \\qquad \\text{Elev}_A = 102.64 - 3.22 = 99.42\\ \\text{ft}',
          },
          {
            text: 'Check with the net rule: Elev_A = 100.00 + ΣBS − ΣFS = 100.00 + 9.42 − 10.00 = 99.42 ft ✓',
          },
        ],
      },
      {
        kind: 'example',
        title: 'Shoelace area of a four-sided parcel',
        steps: [
          {
            text: 'Parcel corners (ft): P1(0, 0), P2(500, 100), P3(400, 400), P4(100, 300). Find the area in acres.',
          },
          {
            text: 'Cross-products x_i·y_(i+1) − x_(i+1)·y_i around the loop:',
            tex: '(0\\cdot100 - 500\\cdot0) + (500\\cdot400 - 400\\cdot100) + (400\\cdot300 - 100\\cdot400) + (100\\cdot0 - 0\\cdot300)',
          },
          {
            text: 'Evaluate each term:',
            tex: '0 + 160{,}000 + 80{,}000 + 0 = 240{,}000',
          },
          {
            text: 'Halve and convert (43,560 ft² per acre):',
            tex: 'A = \\tfrac{1}{2}(240{,}000) = 120{,}000\\ \\text{ft}^2 = \\dfrac{120{,}000}{43{,}560} = 2.75\\ \\text{ac}',
          },
        ],
      },
      {
        kind: 'callout',
        tone: 'warn',
        html: `Bearing-to-azimuth is where points die. Work quadrant by quadrant: NE → az = bearing angle; SE → 180° − angle; SW → 180° + angle; NW → 360° − angle. Sketch a compass rose if in doubt — ten seconds well spent.`,
      },
    ],
    tips: [
      'BS is a plus sight, FS is a minus sight. Elev_end = Elev_start + ΣBS − ΣFS closes any level run in one line.',
      'List shoelace coordinates in order (either direction) and repeat the first point at the bottom; a sign error just flips the sign — take the absolute value.',
      'Keep 43,560 ft²/acre and 66 ft/chain in your head; the exam expects the conversion without prompting.',
    ],
  },

  // -------------------------------------------------------------------------
  // 7. Construction
  // -------------------------------------------------------------------------
  {
    id: 'fe-construction-core',
    examId: 'fe-civil',
    areaId: 'fe-construction',
    title: 'Construction: CPM, Earned Value & Estimating',
    objective:
      'Run a CPM forward and backward pass to find the critical path and floats, compute earned-value indices (CPI, SPI, EAC), and handle productivity, unit-price, and delivery-method questions.',
    estMinutes: 18,
    blocks: [
      {
        kind: 'prose',
        html: `<p><b>CPM scheduling</b> is two sweeps through the network. Forward pass sets early times; backward pass sets late times; the difference is float.</p>
        <ul class="list-disc ml-5 space-y-1">
          <li><b>Forward pass:</b> <span class="tex">ES = \\max(EF_{preds})</span>, <span class="tex">EF = ES + d</span>. Project duration = largest EF.</li>
          <li><b>Backward pass:</b> <span class="tex">LF = \\min(LS_{succs})</span>, <span class="tex">LS = LF - d</span>.</li>
          <li><b>Total float:</b> <span class="tex">TF = LS - ES = LF - EF</span>. Critical activities have TF = 0.</li>
        </ul>`,
      },
      {
        kind: 'callout',
        tone: 'key',
        html: `The <b>critical path</b> is the longest path through the network — it sets the minimum project duration, and delaying any activity on it delays the whole job. Under time pressure, just enumerate the paths and take the longest; float on a non-critical activity = critical duration − its path duration.`,
      },
      {
        kind: 'formula',
        tex: 'CPI = \\dfrac{EV}{AC}, \\qquad SPI = \\dfrac{EV}{PV}, \\qquad CV = EV - AC, \\qquad SV = EV - PV',
        caption:
          'Earned value: EV (BCWP) = budgeted cost of work performed, AC (ACWP) = actual cost, PV (BCWS) = planned value. Above 1.0 (or positive) is good',
      },
      {
        kind: 'formula',
        tex: 'EAC = \\dfrac{BAC}{CPI}',
        caption: 'Estimate at completion, assuming current cost efficiency continues',
      },
      {
        kind: 'formula',
        tex: '\\text{Duration} = \\dfrac{\\text{Quantity}}{\\text{Productivity} \\times \\text{Crews}}, \\qquad \\text{Bid} = \\text{Unit price} \\times \\text{Quantity}',
        caption:
          'Productivity converts quantities to durations; unit-price estimating (with unit price = direct cost + markup) converts quantities to bids',
      },
      {
        kind: 'table',
        caption: 'Project delivery methods — the definitions the FE tests',
        headers: ['Method', 'Key feature'],
        rows: [
          ['Design-Bid-Build', 'Sequential; owner holds separate design and construction contracts; award to low responsive bidder'],
          ['Design-Build', 'One entity designs and builds; single point of responsibility; fastest overlap'],
          ['CM at Risk', 'CM advises during design, then delivers under a Guaranteed Maximum Price (GMP)'],
          ['Cost-plus / T&M', 'Owner reimburses cost plus fee; used when scope is uncertain; owner carries cost risk'],
          ['Lump sum / Unit price', 'Contractor carries cost risk / quantities remeasured, good for earthwork'],
        ],
      },
      {
        kind: 'example',
        title: 'CPM: critical path and float',
        steps: [
          {
            text: 'Activities (durations, days): A(3) starts the job; B(4) and C(2) follow A; D(5) follows B; E(4) follows C; the project ends after D and E. Find the duration, critical path, and float of E.',
          },
          {
            text: 'Forward pass:',
            tex: 'A{:}\\,0\\!\\to\\!3,\\quad B{:}\\,3\\!\\to\\!7,\\quad C{:}\\,3\\!\\to\\!5,\\quad D{:}\\,7\\!\\to\\!12,\\quad E{:}\\,5\\!\\to\\!9',
          },
          {
            text: 'Project duration = max EF = 12 days, via A–B–D. Backward pass from 12:',
            tex: 'D{:}\\,LS = 7,\\quad E{:}\\,LS = 12 - 4 = 8,\\quad B{:}\\,LS = 3,\\quad C{:}\\,LF = 8,\\ LS = 6',
          },
          {
            text: 'Float of E:',
            tex: 'TF_E = LS - ES = 8 - 5 = 3\\ \\text{days}',
          },
          {
            text: 'Path check: A–B–D = 3+4+5 = 12 (critical, zero float); A–C–E = 3+2+4 = 9, so C and E each carry 12 − 9 = 3 days of float ✓',
          },
        ],
      },
      {
        kind: 'example',
        title: 'Earned value health check',
        steps: [
          {
            text: 'BAC = $500,000. At the status date: PV = $200,000, EV = $180,000, AC = $210,000. Evaluate cost and schedule performance and forecast the final cost.',
          },
          {
            text: 'Cost performance:',
            tex: 'CPI = \\dfrac{180{,}000}{210{,}000} = 0.857 \\quad (CV = -\\$30{,}000\\ \\text{over budget})',
          },
          {
            text: 'Schedule performance:',
            tex: 'SPI = \\dfrac{180{,}000}{200{,}000} = 0.90 \\quad (SV = -\\$20{,}000\\ \\text{behind schedule})',
          },
          {
            text: 'Forecast at completion:',
            tex: 'EAC = \\dfrac{BAC}{CPI} = \\dfrac{500{,}000}{0.857} \\approx \\$583{,}000',
          },
          {
            text: 'Read: every earned dollar of work is costing $1.17, and only 90% of the planned work is done — expect roughly $83k of overrun unless efficiency improves.',
          },
        ],
      },
      {
        kind: 'callout',
        tone: 'warn',
        html: `EV is the anchor of <b>every</b> earned-value ratio — it sits in the numerator of both CPI and SPI. If you catch yourself dividing AC by PV, stop: no standard metric compares those two directly.`,
      },
    ],
    tips: [
      'For small networks, skip the full table: list every start-to-finish path, sum durations, longest wins. Float of an off-path activity = critical duration − its longest path.',
      'Mnemonic: CPI and SPI both start with EV on top; "greater than 1 = good" for both indices.',
      'Free float vs total float: free float only borrows time before the next activity is delayed; total float borrows against the project finish. Read which one the question wants.',
    ],
  },
];
