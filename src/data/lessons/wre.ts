import type { Lesson } from '../../types';

// Water Resources & Environmental (WRE) lessons for the PE Civil depth exam.
// Fully-worked, exam-focused content matching the geotech lesson style.
export const wreLessons: Lesson[] = [
  {
    id: 'wre-manning',
    examId: 'pe-wre',
    areaId: 'wre-open',
    title: "Manning's Equation & Open-Channel Flow",
    objective:
      "Compute normal depth and capacity of an open channel with Manning's equation, correctly handling the 1.49 (USCS) vs 1.0 (SI) constant and the hydraulic radius R = A/P.",
    estMinutes: 20,
    blocks: [
      {
        kind: 'prose',
        html: `<p><b>Open-channel flow</b> is gravity-driven flow with a free surface. Under <b>uniform flow</b> (constant depth, slope, and cross-section) the depth is the <b>normal depth</b> <span class="tex">y_n</span>, and Manning's equation relates discharge to geometry, roughness, and slope.</p>`,
      },
      {
        kind: 'formula',
        tex: 'Q = \\dfrac{C}{n}\\,A\\,R^{2/3}\\,S^{1/2}',
        caption: "Manning's equation: C = 1.49 (USCS, ft) or C = 1.0 (SI, m)",
      },
      {
        kind: 'prose',
        html: `<p>The pieces you build first:</p>
        <ul class="list-disc ml-5 space-y-1">
          <li><b>Hydraulic radius</b> <span class="tex">R = A/P</span> — flow area divided by <i>wetted</i> perimeter (the top water surface is NOT wetted perimeter).</li>
          <li><b>n</b> is Manning's roughness (dimensionless-ish); concrete ≈ 0.013, earth ≈ 0.025, natural channels 0.03–0.05.</li>
          <li><b>S</b> is the channel-bottom slope for uniform flow (m/m or ft/ft).</li>
        </ul>`,
      },
      {
        kind: 'callout',
        tone: 'key',
        html: `The constant C is what trips people up. In <b>USCS</b> (Q in cfs, A in ft², R in ft) use <span class="tex">C = 1.49</span>. In <b>SI</b> (Q in m³/s, A in m², R in m) use <span class="tex">C = 1.0</span>. The 1.49 is literally <span class="tex">3.281^{1/3}</span> — the unit conversion baked in.`,
      },
      {
        kind: 'animation',
        component: 'OpenChannel',
        caption: 'Adjust depth, side slope, and bottom width — watch A, P, R, and the resulting Q respond.',
      },
      {
        kind: 'example',
        title: 'Discharge in a trapezoidal channel',
        steps: [
          {
            text: 'Trapezoidal channel: bottom width b = 3 m, side slopes 2H:1V (z = 2), flow depth y = 1.5 m, bottom slope S = 0.001, n = 0.025. Find Q (SI).',
          },
          {
            text: 'Flow area (rectangle + two triangles):',
            tex: 'A = by + zy^2 = 3(1.5) + 2(1.5)^2 = 4.5 + 4.5 = 9.0\\ \\text{m}^2',
          },
          {
            text: 'Wetted perimeter (bottom + two sloped sides):',
            tex: 'P = b + 2y\\sqrt{1+z^2} = 3 + 2(1.5)\\sqrt{5} = 3 + 6.708 = 9.708\\ \\text{m}',
          },
          {
            text: 'Hydraulic radius:',
            tex: 'R = A/P = 9.0/9.708 = 0.927\\ \\text{m}',
          },
          {
            text: 'Manning (SI, C = 1.0):',
            tex: 'Q = \\dfrac{1.0}{0.025}(9.0)(0.927)^{2/3}(0.001)^{1/2} = 40(9.0)(0.951)(0.0316) = 10.8\\ \\text{m}^3/\\text{s}',
          },
        ],
      },
      {
        kind: 'callout',
        tone: 'warn',
        html: `Finding <b>normal depth</b> from a known Q is <i>iterative</i> — both A and R depend on y, so there's no closed form for trapezoids. Guess y, compute Q, and adjust. For a wide rectangular channel <span class="tex">R \\approx y</span>, which simplifies the algebra.`,
      },
    ],
    tips: [
      "n-value trap: don't switch C when the problem switches units. cfs → 1.49, m³/s → 1.0. Mixing them is off by ~50%.",
      'Wetted perimeter excludes the free surface; for a partly full pipe, P is the arc length in contact with water, not the full circumference.',
      'Best hydraulic section (max R for a given A) minimizes n and maximizes Q — a half-hexagon trapezoid or half-square rectangle.',
    ],
  },
  {
    id: 'wre-critical-flow',
    examId: 'pe-wre',
    areaId: 'wre-open',
    title: 'Critical Flow, Froude Number & Hydraulic Jump',
    objective:
      'Classify flow as sub- or supercritical using the Froude number, find critical depth, and compute the conjugate depth and energy dissipated across a hydraulic jump.',
    estMinutes: 18,
    blocks: [
      {
        kind: 'prose',
        html: `<p>The <b>Froude number</b> is the ratio of inertial to gravitational forces and sets the flow regime. <span class="tex">Fr < 1</span> is <b>subcritical</b> (deep, slow, tranquil), <span class="tex">Fr = 1</span> is <b>critical</b>, and <span class="tex">Fr > 1</span> is <b>supercritical</b> (shallow, fast, rapid).</p>`,
      },
      {
        kind: 'formula',
        tex: 'Fr = \\dfrac{V}{\\sqrt{g\\,D_h}}, \\qquad D_h = \\dfrac{A}{T}',
        caption: 'Froude number; Dh = hydraulic depth = area ÷ top width T',
      },
      {
        kind: 'formula',
        tex: 'y_c = \\left(\\dfrac{q^2}{g}\\right)^{1/3} \\quad (\\text{rectangular, } q = Q/b)',
        caption: 'Critical depth for a rectangular channel',
      },
      {
        kind: 'prose',
        html: `<p>When supercritical flow abruptly slows to subcritical it forms a <b>hydraulic jump</b> — a turbulent, energy-dissipating transition. The upstream and downstream depths are <b>conjugate (sequent) depths</b> linked by the momentum equation:</p>`,
      },
      {
        kind: 'formula',
        tex: '\\dfrac{y_2}{y_1} = \\tfrac{1}{2}\\left(\\sqrt{1 + 8\\,Fr_1^{2}} - 1\\right)',
        caption: 'Conjugate depth ratio across a jump (rectangular channel)',
      },
      {
        kind: 'formula',
        tex: '\\Delta E = \\dfrac{(y_2 - y_1)^3}{4\\,y_1\\,y_2}',
        caption: 'Head (energy) lost in the jump',
      },
      {
        kind: 'example',
        title: 'Hydraulic jump in a rectangular channel',
        steps: [
          {
            text: 'Rectangular channel, unit discharge q = 5 m²/s, upstream (supercritical) depth y1 = 0.6 m. Find y2 and the energy dissipated.',
          },
          {
            text: 'Upstream velocity and Froude number:',
            tex: 'V_1 = q/y_1 = 5/0.6 = 8.33\\ \\text{m/s}, \\quad Fr_1 = \\dfrac{8.33}{\\sqrt{9.81(0.6)}} = 3.43',
          },
          {
            text: 'Conjugate depth:',
            tex: 'y_2 = \\dfrac{0.6}{2}\\left(\\sqrt{1 + 8(3.43)^2} - 1\\right) = 0.3(9.20) = 2.76\\ \\text{m}',
          },
          {
            text: 'Energy dissipated:',
            tex: '\\Delta E = \\dfrac{(2.76 - 0.6)^3}{4(0.6)(2.76)} = \\dfrac{10.08}{6.62} = 1.52\\ \\text{m}',
          },
          {
            text: 'The jump raises depth from 0.6 m to 2.76 m and burns off 1.52 m of head — the basis for stilling-basin design below spillways.',
          },
        ],
      },
      {
        kind: 'callout',
        tone: 'key',
        html: `At <b>critical depth</b> the <b>specific energy</b> <span class="tex">E = y + V^2/2g</span> is a <b>minimum</b> for a given discharge. This is why critical-flow sections (weirs, flumes, free overfalls) make good flow-measurement controls.`,
      },
    ],
    tips: [
      'A hydraulic jump only forms going from supercritical to subcritical. Fr1 must be > 1, or there is no jump.',
      'Jumps always lose energy (ΔE > 0). If your algebra gives a negative loss, you swapped y1 and y2.',
      'Critical slope is the bottom slope that makes normal depth equal critical depth — steeper is "steep" (supercritical), flatter is "mild".',
    ],
  },
  {
    id: 'wre-pipe-flow',
    examId: 'pe-wre',
    areaId: 'wre-closed',
    title: 'Pressure Pipe Flow & Head Loss',
    objective:
      'Apply the energy equation with EGL/HGL, and compute friction head loss by both Darcy-Weisbach and Hazen-Williams, plus minor losses.',
    estMinutes: 20,
    blocks: [
      {
        kind: 'prose',
        html: `<p>Full pipe flow is analyzed with the <b>energy (Bernoulli) equation</b> between two points, including friction and minor losses and any pump/turbine head:</p>`,
      },
      {
        kind: 'formula',
        tex: '\\dfrac{p_1}{\\gamma} + \\dfrac{V_1^2}{2g} + z_1 + h_p = \\dfrac{p_2}{\\gamma} + \\dfrac{V_2^2}{2g} + z_2 + h_t + h_L',
        caption: 'Energy equation (heads in ft or m); hL = friction + minor losses',
      },
      {
        kind: 'prose',
        html: `<p>The <b>energy grade line (EGL)</b> plots total head <span class="tex">p/\\gamma + V^2/2g + z</span>; the <b>hydraulic grade line (HGL)</b> plots piezometric head <span class="tex">p/\\gamma + z</span>. They differ by the velocity head <span class="tex">V^2/2g</span>, and the EGL always slopes downward in the flow direction (except across a pump).</p>`,
      },
      {
        kind: 'formula',
        tex: 'h_f = f\\,\\dfrac{L}{D}\\,\\dfrac{V^2}{2g} \\qquad (\\text{Darcy-Weisbach})',
        caption: 'Darcy-Weisbach: f from the Moody chart via Re and ε/D',
      },
      {
        kind: 'formula',
        tex: 'h_f = \\dfrac{10.67\\,L\\,Q^{1.852}}{C^{1.852}\\,D^{4.87}} \\ (\\text{SI}), \\qquad h_f = \\dfrac{4.73\\,L\\,Q^{1.852}}{C^{1.852}\\,D^{4.87}} \\ (\\text{USCS})',
        caption: 'Hazen-Williams (water only); C = roughness coefficient',
      },
      {
        kind: 'formula',
        tex: 'h_m = \\sum K\\,\\dfrac{V^2}{2g}',
        caption: 'Minor losses from fittings/valves/entrances (K values)',
      },
      {
        kind: 'example',
        title: 'Friction loss both ways',
        steps: [
          {
            text: 'Water at 20°C flows at Q = 0.05 m³/s through L = 300 m of D = 0.2 m pipe. ε = 0.045 mm (commercial steel), Hazen-Williams C = 130. Find hf both ways.',
          },
          {
            text: 'Velocity and Reynolds number (ν = 1.0×10⁻⁶ m²/s):',
            tex: 'V = \\dfrac{Q}{A} = \\dfrac{0.05}{\\tfrac{\\pi}{4}(0.2)^2} = 1.59\\ \\text{m/s}, \\quad Re = \\dfrac{VD}{\\nu} = 3.18\\times10^5',
          },
          {
            text: 'Relative roughness ε/D = 0.045/200 = 0.000225; Moody / Colebrook gives f ≈ 0.0175. Darcy-Weisbach:',
            tex: 'h_f = 0.0175\\dfrac{300}{0.2}\\dfrac{1.59^2}{2(9.81)} = 26.25(0.129) = 3.38\\ \\text{m}',
          },
          {
            text: 'Hazen-Williams (SI):',
            tex: 'h_f = \\dfrac{10.67(300)(0.05)^{1.852}}{130^{1.852}(0.2)^{4.87}} = \\dfrac{3201\\times0.00466}{7770\\times0.000384}',
          },
          {
            text: 'Evaluate:',
            tex: 'h_f = \\dfrac{14.9}{2.98} = 5.0\\ \\text{m}',
          },
          {
            text: 'The two methods differ (≈3.4 vs 5.0 m) — Darcy-Weisbach is general and physically based; Hazen-Williams is an empirical water-only shortcut. Use whichever the problem specifies.',
          },
        ],
      },
      {
        kind: 'callout',
        tone: 'warn',
        html: `Hazen-Williams is valid only for <b>water at normal temperatures</b> in <b>turbulent</b> flow, roughly 4–60 in pipes. Darcy-Weisbach works for any fluid and regime but needs <span class="tex">f</span> (Moody chart or Colebrook/Swamee-Jain). Do not use Hazen-Williams for oil, air, or laminar flow.`,
      },
    ],
    tips: [
      'For laminar flow (Re < 2100), f = 64/Re exactly — no Moody chart needed.',
      'Minor losses are often negligible for long pipelines but dominate short runs with many fittings — check the L/D ratio.',
      "A higher Hazen-Williams C means a smoother pipe (less loss). New PVC ≈ 150, old cast iron ≈ 100. Don't confuse it with Manning's n (opposite sense).",
    ],
  },
  {
    id: 'wre-pumps',
    examId: 'pe-wre',
    areaId: 'wre-closed',
    title: 'Pumps, System Curves & NPSH',
    objective:
      'Find the operating point from pump and system curves, compute required power, and check available NPSH against required NPSH to avoid cavitation.',
    estMinutes: 18,
    blocks: [
      {
        kind: 'prose',
        html: `<p>A centrifugal pump adds head to a system. The <b>operating point</b> is where the falling <b>pump curve</b> (head vs flow) intersects the rising <b>system curve</b> (static lift + friction, which grows with <span class="tex">Q^2</span>).</p>`,
      },
      {
        kind: 'formula',
        tex: 'P_{water} = \\gamma\\,Q\\,H, \\qquad P_{brake} = \\dfrac{\\gamma\\,Q\\,H}{\\eta}',
        caption: 'Water (hydraulic) power and brake (input) power; η = pump efficiency',
      },
      {
        kind: 'formula',
        tex: 'H_{sys} = H_{static} + \\sum h_L = H_{static} + kQ^2',
        caption: 'System curve: static head plus flow-dependent losses',
      },
      {
        kind: 'prose',
        html: `<p><b>Cavitation</b> occurs when local pressure at the pump inlet drops to the fluid's vapor pressure, forming and collapsing bubbles that erode the impeller. The guard against it compares <b>available</b> to <b>required</b> NPSH:</p>`,
      },
      {
        kind: 'formula',
        tex: 'NPSH_A = \\dfrac{p_{atm} - p_{vapor}}{\\gamma} + z_s - h_{L,s}',
        caption: 'Available NPSH at the pump suction (zs positive if source is above pump)',
      },
      {
        kind: 'callout',
        tone: 'key',
        html: `The design rule is <span class="tex">NPSH_A > NPSH_R</span> with margin (often ≥ 0.6 m / 2 ft or 10%). If <span class="tex">NPSH_A \\le NPSH_R</span> the pump cavitates — raise the pump, shorten/enlarge suction piping, or lower the fluid temperature.`,
      },
      {
        kind: 'example',
        title: 'NPSH check on a suction lift',
        steps: [
          {
            text: 'Water at 20°C pumped from a sump. Pump is 3.0 m ABOVE the water surface (suction lift). Suction friction loss hL,s = 0.8 m. patm = 101.3 kPa, pvapor = 2.34 kPa, γ = 9.79 kN/m³. Pump NPSHR = 4.5 m. Is it OK?',
          },
          {
            text: 'Atmospheric head:',
            tex: '\\dfrac{p_{atm}}{\\gamma} = \\dfrac{101.3}{9.79} = 10.35\\ \\text{m}',
          },
          {
            text: 'Vapor-pressure head:',
            tex: '\\dfrac{p_{vapor}}{\\gamma} = \\dfrac{2.34}{9.79} = 0.24\\ \\text{m}',
          },
          {
            text: 'Suction lift means zs = −3.0 m. Available NPSH:',
            tex: 'NPSH_A = 10.35 - 0.24 - 3.0 - 0.8 = 6.31\\ \\text{m}',
          },
          {
            text: 'Compare: NPSHA = 6.31 m > NPSHR = 4.5 m, margin 1.8 m. No cavitation — the pump is acceptable.',
          },
        ],
      },
      {
        kind: 'callout',
        tone: 'tip',
        html: `<b>Affinity laws</b> (fixed impeller, variable speed N): <span class="tex">Q \\propto N</span>, <span class="tex">H \\propto N^2</span>, <span class="tex">P \\propto N^3</span>. A 10% speed increase raises power by ~33% — watch the cube.`,
      },
    ],
    tips: [
      'NPSHA drops with elevation (lower patm), higher temperature (higher pvapor), and longer suction lines. Hot-water and high-altitude pumps are cavitation-prone.',
      "Power unit trap: γQH gives kW in SI directly (kN/m³ · m³/s · m). In USCS, brake horsepower = γQH/(550·η) with γ in lb/ft³, Q in cfs, H in ft.",
      'Pumps in series add head; pumps in parallel add flow.',
    ],
  },
  {
    id: 'wre-rational',
    examId: 'pe-wre',
    areaId: 'wre-hydrology',
    title: 'Rational Method & Time of Concentration',
    objective:
      'Estimate peak runoff with Q = CiA, build a composite runoff coefficient, and use the time of concentration with an IDF curve to pick the design intensity.',
    estMinutes: 16,
    blocks: [
      {
        kind: 'prose',
        html: `<p>The <b>Rational Method</b> gives peak discharge for small drainage areas (typically < 200 ac). It assumes the whole watershed contributes once the storm duration equals the <b>time of concentration</b> <span class="tex">t_c</span>.</p>`,
      },
      {
        kind: 'formula',
        tex: 'Q = C\\,i\\,A',
        caption: 'Rational Method: C dimensionless, i in in/hr, A in acres → Q in cfs',
      },
      {
        kind: 'callout',
        tone: 'key',
        html: `The "units magic": 1 ac·in/hr = 1.008 cfs ≈ 1 cfs. So in USCS you plug in acres and in/hr and read off <b>cfs directly</b> — no conversion factor needed. (In SI, <span class="tex">Q = CiA/360</span> with A in ha, i in mm/hr, Q in m³/s.)`,
      },
      {
        kind: 'prose',
        html: `<p><b>Time of concentration</b> is the travel time from the hydraulically most distant point to the outlet. Because IDF curves show intensity <i>decreasing</i> with duration, you set storm duration = <span class="tex">t_c</span> to get the design intensity for the peak.</p>`,
      },
      {
        kind: 'formula',
        tex: 'C_{comp} = \\dfrac{\\sum C_j A_j}{\\sum A_j}',
        caption: 'Area-weighted composite runoff coefficient',
      },
      {
        kind: 'example',
        title: 'Composite C and peak flow',
        steps: [
          {
            text: 'Watershed: 8 ac pavement (C = 0.90), 12 ac lawn (C = 0.20). tc = 15 min. From the IDF curve, i at 15 min = 4.0 in/hr. Find peak Q.',
          },
          {
            text: 'Composite runoff coefficient:',
            tex: 'C = \\dfrac{0.90(8) + 0.20(12)}{8 + 12} = \\dfrac{7.2 + 2.4}{20} = 0.48',
          },
          {
            text: 'Total area A = 20 ac. Peak discharge:',
            tex: 'Q = C\\,i\\,A = 0.48(4.0)(20) = 38.4\\ \\text{cfs}',
          },
          {
            text: 'If tc were longer, i would be smaller (flatter IDF), lowering Q — the design storm duration matters.',
          },
        ],
      },
      {
        kind: 'callout',
        tone: 'warn',
        html: `Use the Rational Method only for <b>small, fairly uniform</b> basins. It gives a peak flow, not a hydrograph or volume. For larger or complex watersheds, use NRCS unit-hydrograph methods.`,
      },
    ],
    tips: [
      'C rises with imperviousness and slope, and for higher return periods (some codes multiply C by a frequency factor Cf for the 50/100-yr storm).',
      'Always match storm duration to tc — using a shorter duration overstates i and Q; a longer one understates the peak.',
      'tc can be split into sheet flow (Manning kinematic), shallow concentrated flow, and channel flow segments; sum the travel times.',
    ],
  },
  {
    id: 'wre-nrcs',
    examId: 'pe-wre',
    areaId: 'wre-hydrology',
    title: 'NRCS Curve Number Method & Hydrographs',
    objective:
      'Compute runoff depth from a design storm with the NRCS curve number method, scale a unit hydrograph, and set up basic detention routing.',
    estMinutes: 18,
    blocks: [
      {
        kind: 'prose',
        html: `<p>The <b>NRCS (SCS) Curve Number method</b> estimates runoff <i>volume</i> from rainfall using a single parameter, the <b>curve number CN</b> (0–100), which encodes soil type (hydrologic group A–D), land use, and antecedent moisture.</p>`,
      },
      {
        kind: 'formula',
        tex: 'S = \\dfrac{1000}{CN} - 10 \\quad (\\text{inches})',
        caption: 'Potential maximum retention S from the curve number',
      },
      {
        kind: 'formula',
        tex: 'Q = \\dfrac{(P - 0.2S)^2}{P + 0.8S} \\quad (\\text{for } P > 0.2S,\\ \\text{else } Q = 0)',
        caption: 'Runoff depth Q (in) from precipitation P (in); Ia = 0.2S initial abstraction',
      },
      {
        kind: 'prose',
        html: `<p>Multiply runoff depth by drainage area for volume. A <b>unit hydrograph</b> is the runoff response to 1 inch (or 1 cm) of excess rainfall; scale it linearly and superimpose for a full storm (the basis of NRCS dimensionless and triangular hydrographs).</p>`,
      },
      {
        kind: 'example',
        title: 'Runoff depth from a design storm',
        steps: [
          {
            text: 'Watershed CN = 80, design storm P = 4.5 in. Find the runoff depth Q and the volume over 50 ac.',
          },
          {
            text: 'Potential maximum retention:',
            tex: 'S = \\dfrac{1000}{80} - 10 = 12.5 - 10 = 2.5\\ \\text{in}',
          },
          {
            text: 'Initial abstraction Ia = 0.2S = 0.5 in. Since P = 4.5 > 0.5, runoff occurs. Runoff depth:',
            tex: 'Q = \\dfrac{(4.5 - 0.5)^2}{4.5 + 0.8(2.5)} = \\dfrac{16.0}{6.5} = 2.46\\ \\text{in}',
          },
          {
            text: 'Volume = depth × area:',
            tex: 'V = 2.46\\ \\text{in} \\times \\dfrac{1\\ \\text{ft}}{12\\ \\text{in}} \\times 50\\ \\text{ac} = 10.25\\ \\text{ac-ft}',
          },
          {
            text: 'Note only 2.46 in of the 4.5 in became runoff; the rest was abstracted (infiltration + initial abstraction).',
          },
        ],
      },
      {
        kind: 'callout',
        tone: 'key',
        html: `<b>Detention basins</b> store the difference between inflow and allowable outflow. The routing balance is <span class="tex">I - O = dS/dt</span> (storage-indication / modified Puls method). Peak outflow occurs where the outflow hydrograph crosses the receding limb of the inflow hydrograph.`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        html: `Higher CN (impervious/clayey soils, group D) → smaller S → more runoff. Urbanization raises CN and shrinks <span class="tex">t_c</span>, producing higher, earlier peaks — the core argument for stormwater detention.`,
      },
    ],
    tips: [
      'Check P > 0.2S before computing — if the storm is small relative to S, Q = 0.',
      'CN depends on antecedent moisture condition (AMC I dry, II average, III wet); tables are usually AMC II. Adjust for wet conditions on the exam only if told to.',
      'The NRCS triangular unit hydrograph has time base ≈ 2.67 × time-to-peak; peak Q_p ≈ 484·A·Q/tp (USCS, A in mi², Q in in, tp in hr).',
    ],
  },
  {
    id: 'wre-wells',
    examId: 'pe-wre',
    areaId: 'wre-groundwater',
    title: 'Groundwater Flow & Well Hydraulics',
    objective:
      "Apply Darcy's law and seepage velocity, and compute steady-state drawdown or discharge with the Thiem (confined) and Dupuit (unconfined) well equations.",
    estMinutes: 18,
    blocks: [
      {
        kind: 'prose',
        html: `<p>Groundwater flows through porous media following <b>Darcy's law</b>. The Darcy (specific discharge) velocity is a flux per unit total area; the actual <b>seepage velocity</b> through the pores is faster by <span class="tex">1/n_e</span>.</p>`,
      },
      {
        kind: 'formula',
        tex: 'q = -KA\\dfrac{dh}{dx}, \\qquad v_{seepage} = \\dfrac{v_{Darcy}}{n_e} = \\dfrac{Ki}{n_e}',
        caption: 'Darcy flux and seepage (pore) velocity; ne = effective porosity',
      },
      {
        kind: 'prose',
        html: `<p>A pumping well draws water radially, creating a <b>cone of depression</b>. At steady state between two observation wells:</p>`,
      },
      {
        kind: 'formula',
        tex: 'Q = \\dfrac{2\\pi K b\\,(h_2 - h_1)}{\\ln(r_2/r_1)} \\quad (\\text{confined, Thiem})',
        caption: 'Thiem equation — confined aquifer of thickness b',
      },
      {
        kind: 'formula',
        tex: 'Q = \\dfrac{\\pi K\\,(h_2^2 - h_1^2)}{\\ln(r_2/r_1)} \\quad (\\text{unconfined, Dupuit})',
        caption: 'Dupuit-Forchheimer — unconfined aquifer (h measured from base)',
      },
      {
        kind: 'example',
        title: 'Confined aquifer pumping test',
        steps: [
          {
            text: 'Confined aquifer, K = 25 m/day, thickness b = 20 m. Observation wells: at r1 = 30 m head h1 = 48 m; at r2 = 120 m head h2 = 50 m. Find the well discharge Q.',
          },
          {
            text: 'Transmissivity T = Kb = 25(20) = 500 m²/day. Apply Thiem:',
            tex: 'Q = \\dfrac{2\\pi K b\\,(h_2 - h_1)}{\\ln(r_2/r_1)} = \\dfrac{2\\pi (25)(20)(50 - 48)}{\\ln(120/30)}',
          },
          {
            text: 'Numerator and denominator:',
            tex: 'Q = \\dfrac{2\\pi(500)(2)}{\\ln 4} = \\dfrac{6283}{1.386}',
          },
          {
            text: 'Discharge:',
            tex: 'Q = 4533\\ \\text{m}^3/\\text{day} \\approx 0.0525\\ \\text{m}^3/\\text{s}',
          },
          {
            text: 'Drawdown is larger near the well (small r) and flattens outward — the log term reflects the radial geometry.',
          },
        ],
      },
      {
        kind: 'callout',
        tone: 'key',
        html: `<b>Confined vs unconfined:</b> confined uses head <span class="tex">h</span> (linear, transmissivity <span class="tex">T = Kb</span>); unconfined uses <span class="tex">h^2</span> because the saturated thickness itself shrinks as it drains. Picking the wrong form is the classic well-problem error.`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        html: `For transient (time-dependent) drawdown use the <b>Theis</b> equation or its <b>Cooper-Jacob</b> straight-line approximation; the exam usually gives steady-state (Thiem/Dupuit) unless it provides storativity S and time t.`,
      },
    ],
    tips: [
      "Seepage velocity (not Darcy velocity) governs contaminant travel time — divide by effective porosity.",
      'Keep K and the radii/heads in consistent units; K in m/day with r in m gives Q in m³/day.',
      'The radius of influence R is where drawdown ≈ 0; if given, use r2 = R and h2 = the undisturbed head H.',
    ],
  },
  {
    id: 'wre-dosag',
    examId: 'pe-wre',
    areaId: 'wre-quality',
    title: 'BOD Kinetics & the DO Sag Curve',
    objective:
      'Compute BOD exerted over time with first-order kinetics, find the dissolved-oxygen deficit, and interpret the Streeter-Phelps sag curve and critical point for a TMDL.',
    estMinutes: 18,
    blocks: [
      {
        kind: 'prose',
        html: `<p><b>Biochemical oxygen demand (BOD)</b> is the oxygen microbes consume degrading organic matter. It follows <b>first-order kinetics</b> toward the ultimate demand <span class="tex">L_0</span>:</p>`,
      },
      {
        kind: 'formula',
        tex: 'BOD_t = L_0\\left(1 - e^{-k\\,t}\\right)',
        caption: 'BOD exerted after time t; L0 = ultimate BOD, k = deoxygenation rate (base e)',
      },
      {
        kind: 'prose',
        html: `<p>When treated effluent enters a river, the <b>DO sag curve</b> (Streeter-Phelps) tracks the balance between <b>deoxygenation</b> (BOD decay, rate <span class="tex">k_d</span>) pulling DO down and <b>reaeration</b> (rate <span class="tex">k_r</span>) from the atmosphere pulling it back up. The <b>deficit</b> <span class="tex">D</span> is saturation DO minus actual DO.</p>`,
      },
      {
        kind: 'formula',
        tex: 'D_t = \\dfrac{k_d L_0}{k_r - k_d}\\left(e^{-k_d t} - e^{-k_r t}\\right) + D_0\\,e^{-k_r t}',
        caption: 'Streeter-Phelps oxygen-deficit equation',
      },
      {
        kind: 'formula',
        tex: 't_c = \\dfrac{1}{k_r - k_d}\\ln\\!\\left[\\dfrac{k_r}{k_d}\\left(1 - \\dfrac{D_0(k_r - k_d)}{k_d L_0}\\right)\\right]',
        caption: 'Time to the critical (minimum-DO) point',
      },
      {
        kind: 'example',
        title: 'BOD remaining and exerted',
        steps: [
          {
            text: 'A wastewater has ultimate BOD L0 = 250 mg/L and deoxygenation rate k = 0.23/day (base e). Find BOD exerted at 5 days (the standard BOD5) and the fraction remaining.',
          },
          {
            text: 'BOD exerted in 5 days:',
            tex: 'BOD_5 = 250\\left(1 - e^{-0.23(5)}\\right) = 250\\left(1 - e^{-1.15}\\right)',
          },
          {
            text: 'Evaluate the exponential (e^-1.15 = 0.3166):',
            tex: 'BOD_5 = 250(1 - 0.3166) = 250(0.6834) = 170.8\\ \\text{mg/L}',
          },
          {
            text: 'BOD remaining (still to be exerted):',
            tex: 'L_5 = L_0\\,e^{-kt} = 250(0.3166) = 79.2\\ \\text{mg/L}',
          },
          {
            text: 'So after 5 days about 68% of the ultimate demand has been exerted, 32% remains.',
          },
        ],
      },
      {
        kind: 'callout',
        tone: 'key',
        html: `The <b>critical point</b> is where DO is <i>lowest</i> (deficit greatest), the binding constraint for permits. A <b>TMDL</b> (Total Maximum Daily Load) is the max pollutant load a water body can receive and still meet standards — it caps <span class="tex">L_0</span> discharged so the critical DO stays above the minimum (e.g., 5 mg/L).`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        html: `Watch the rate-constant base: BOD constants are often quoted <b>base 10</b> in older texts (<span class="tex">k_{10}</span>) vs <b>base e</b> (<span class="tex">k_e = 2.303\\,k_{10}</span>). Temperature also matters: <span class="tex">k_T = k_{20}\\,\\theta^{(T-20)}</span> with θ ≈ 1.047 for deoxygenation.`,
      },
    ],
    tips: [
      'DO saturation decreases with temperature and elevation — warm summer low-flow is the worst-case sag scenario.',
      'If kr = kd the Streeter-Phelps formula is indeterminate; use the limiting form Dt = (kd L0 t + D0)e^{-kt}.',
      'Nitrogenous BOD (NBOD) kicks in later; the standard BOD5 with nitrification inhibitor measures only carbonaceous BOD (CBOD).',
    ],
  },
  {
    id: 'wre-watertreat',
    examId: 'pe-wre',
    areaId: 'wre-drinking',
    title: 'Drinking Water Treatment Train',
    objective:
      'Follow the conventional treatment train, size a sedimentation basin by surface overflow rate, apply the CT concept for disinfection, and express hardness as CaCO3.',
    estMinutes: 18,
    blocks: [
      {
        kind: 'prose',
        html: `<p>Conventional surface-water treatment runs a sequence: <b>coagulation/flocculation</b> (destabilize and grow particles) → <b>sedimentation</b> (settle floc) → <b>filtration</b> (remove residual particles) → <b>disinfection</b> (inactivate pathogens).</p>`,
      },
      {
        kind: 'formula',
        tex: 'v_o = \\dfrac{Q}{A_{surface}} \\quad (\\text{surface overflow rate})',
        caption: 'SOR: particles with settling velocity ≥ vo are fully removed',
      },
      {
        kind: 'prose',
        html: `<p>Ideal-basin theory says removal depends on <b>surface area, not depth</b>: a particle is captured if its settling velocity <span class="tex">v_s \\ge v_o</span>. SOR (a.k.a. overflow rate) has units of velocity (m/hr or gpd/ft²).</p>`,
      },
      {
        kind: 'formula',
        tex: 'CT = C \\times t \\ge CT_{required}',
        caption: 'Disinfection: residual concentration × contact time (mg·min/L)',
      },
      {
        kind: 'formula',
        tex: '\\text{Hardness as CaCO}_3 = \\sum \\dfrac{M_i\\,(50)}{EW_i} \\ (\\text{mg/L as CaCO}_3)',
        caption: 'Convert each ion to CaCO3 equivalents (EW of CaCO3 = 50)',
      },
      {
        kind: 'example',
        title: 'Sedimentation SOR and disinfection CT',
        steps: [
          {
            text: 'Plant flow Q = 0.15 m³/s. Rectangular sedimentation basin 30 m long × 8 m wide. (a) Find the surface overflow rate. (b) A basin holds free chlorine at C = 1.0 mg/L for a contact time of 45 min — find CT.',
          },
          {
            text: 'Surface area and SOR:',
            tex: 'A = 30(8) = 240\\ \\text{m}^2, \\quad v_o = \\dfrac{0.15}{240} = 6.25\\times10^{-4}\\ \\text{m/s}',
          },
          {
            text: 'Convert to typical units (× 3600 s/hr):',
            tex: 'v_o = 6.25\\times10^{-4}(3600) = 2.25\\ \\text{m/hr}',
          },
          {
            text: 'That is a reasonable design SOR (conventional basins ~1–2.5 m/hr), so particles settling faster than 2.25 m/hr are removed.',
          },
          {
            text: 'Disinfection CT:',
            tex: 'CT = C\\,t = 1.0\\ \\tfrac{\\text{mg}}{\\text{L}} \\times 45\\ \\text{min} = 45\\ \\text{mg·min/L}',
          },
          {
            text: 'Compare to the required CT table (pathogen, temperature, pH) to confirm adequate inactivation.',
          },
        ],
      },
      {
        kind: 'callout',
        tone: 'key',
        html: `<b>Hardness</b> (mainly Ca²⁺ and Mg²⁺) is expressed <b>as CaCO₃</b> so different ions can be added. Multiply each ion's mg/L by (50 ÷ its equivalent weight). Softening via lime-soda ash precipitates CaCO₃ and Mg(OH)₂.`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        html: `Higher <b>pH lowers chlorine's effectiveness</b> (more hypochlorite ion OCl⁻, less potent hypochlorous acid HOCl), so required CT rises with pH. Cold water also needs higher CT. Giardia and viruses have much larger CT requirements than most bacteria.`,
      },
    ],
    tips: [
      'Detention time θ = V/Q is different from SOR = Q/A. SOR governs particle removal; θ governs reaction/contact time.',
      'The jar test picks the optimum coagulant dose; alum (Al2(SO4)3) consumes alkalinity and lowers pH.',
      'CaCO3 equivalent weight is 50 mg/meq — memorize it; it converts any ion or compound to a common hardness/alkalinity basis.',
    ],
  },
  {
    id: 'wre-activated-sludge',
    examId: 'pe-wre',
    areaId: 'wre-wastewater',
    title: 'Activated Sludge Fundamentals',
    objective:
      'Compute the food-to-microorganism (F/M) ratio and solids retention time (SRT), set the sludge wasting rate from an MLSS mass balance, and place the Ten States Standards.',
    estMinutes: 18,
    blocks: [
      {
        kind: 'prose',
        html: `<p><b>Activated sludge</b> is a suspended-growth biological process: microorganisms (measured as <b>MLSS/MLVSS</b>) consume BOD in an aerated tank, then settle in a clarifier and are recycled. Two control parameters dominate design: the <b>F/M ratio</b> and the <b>solids retention time (SRT, or θc/MCRT)</b>.</p>`,
      },
      {
        kind: 'formula',
        tex: 'F/M = \\dfrac{Q\\,S_0}{V\\,X}',
        caption: 'Food-to-microorganism ratio (kg BOD applied per kg MLVSS per day)',
      },
      {
        kind: 'formula',
        tex: '\\theta_c = SRT = \\dfrac{V\\,X}{Q_w\\,X_w + Q_e\\,X_e}',
        caption: 'Solids retention time: aeration-tank solids ÷ solids leaving per day',
      },
      {
        kind: 'prose',
        html: `<p>SRT is the <b>average time a solids particle stays in the system</b>. Wasting more sludge (larger <span class="tex">Q_w</span>) shortens SRT; wasting less lengthens it. SRT sets the microbial community — long SRT favors nitrifiers.</p>`,
      },
      {
        kind: 'example',
        title: 'F/M ratio and SRT',
        steps: [
          {
            text: 'Aeration tank V = 2000 m³, MLVSS X = 2500 mg/L. Influent Q = 8000 m³/day, BOD S0 = 200 mg/L. Waste sludge Qw = 80 m³/day at Xw = 8000 mg/L; effluent solids are negligible. Find F/M and SRT.',
          },
          {
            text: 'F/M ratio (concentrations in the ratio, so units cancel with V in the same basis):',
            tex: 'F/M = \\dfrac{Q\\,S_0}{V\\,X} = \\dfrac{8000(200)}{2000(2500)} = \\dfrac{1.6\\times10^6}{5.0\\times10^6} = 0.32\\ \\text{d}^{-1}',
          },
          {
            text: 'Solids in the aeration tank (mass ∝ V·X):',
            tex: 'V\\,X = 2000(2500) = 5.0\\times10^6\\ \\text{g/m}^3\\cdot\\text{m}^3 \\ (\\text{relative mass})',
          },
          {
            text: 'Solids wasted per day (effluent term ≈ 0):',
            tex: 'Q_w X_w = 80(8000) = 6.4\\times10^5',
          },
          {
            text: 'Solids retention time:',
            tex: '\\theta_c = \\dfrac{5.0\\times10^6}{6.4\\times10^5} = 7.8\\ \\text{days}',
          },
          {
            text: 'F/M = 0.32/day and SRT ≈ 7.8 days are both in the conventional activated-sludge range (F/M ~0.2–0.5, SRT ~5–15 d).',
          },
        ],
      },
      {
        kind: 'callout',
        tone: 'key',
        html: `<b>Sludge wasting is how you control SRT.</b> To hold a target θc, waste <span class="tex">Q_w \\approx VX/(\\theta_c X_w)</span> each day (neglecting effluent solids). Too-short SRT washes out the biomass; too-long SRT gives old, poorly settling sludge.`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        html: `The <b>"Ten States Standards"</b> (Recommended Standards for Wastewater Facilities) is the widely adopted design guidance for loading rates, tank sizing, and redundancy across many US states — the go-to reference when a problem asks for a "standard" design criterion.`,
      },
    ],
    tips: [
      'Low F/M (extended aeration) → more complete treatment, more stable, but bigger tanks and more air. High F/M → smaller tanks but less stable, poorer settling.',
      'SVI (sludge volume index) flags settling problems; SVI > 150 mL/g suggests filamentous bulking.',
      'Return activated sludge (RAS) maintains MLSS; the recycle ratio R = Qr/Q comes from a clarifier solids balance X(1+R) = R·Xr.',
    ],
  },
];
