import type { Lesson } from '../../types';

// Flagship, fully-worked geotechnical lessons + structured starters for the
// remaining areas. Add to these freely — the app renders any lesson here.
export const geotechLessons: Lesson[] = [
  {
    id: 'geo-effective-stress',
    examId: 'pe-geotech',
    areaId: 'geo-soilmech',
    title: 'Effective Stress & Pore Pressure',
    objective:
      'Compute total stress, pore water pressure, and effective stress at any depth — the single most-used skill on the geotech exam.',
    estMinutes: 18,
    blocks: [
      {
        kind: 'prose',
        html: `<p><b>Effective stress</b> controls nearly all soil behavior: shear strength, consolidation, bearing capacity, and lateral earth pressure all depend on it. Terzaghi's principle states that effective stress is the portion of total stress carried by the soil skeleton (grain-to-grain contact).</p>`,
      },
      {
        kind: 'formula',
        tex: "\\sigma' = \\sigma - u",
        caption: "Effective stress = total stress − pore water pressure",
      },
      {
        kind: 'prose',
        html: `<p>Build the stress profile layer by layer from the ground surface down:</p>
        <ul class="list-disc ml-5 space-y-1">
          <li><b>Total stress</b> <span class="tex">\\sigma = \\sum \\gamma_i h_i</span> — sum of unit weight × thickness of everything above the point (use saturated unit weight <span class="tex">\\gamma_{sat}</span> below the water table, moist <span class="tex">\\gamma_m</span> above).</li>
          <li><b>Pore pressure</b> <span class="tex">u = \\gamma_w \\, h_w</span> — only the height of water above the point (hydrostatic, no flow). <span class="tex">\\gamma_w = 62.4\\ \\text{pcf} = 9.81\\ \\text{kN/m}^3</span>.</li>
          <li><b>Effective stress</b> <span class="tex">\\sigma' = \\sigma - u</span>.</li>
        </ul>`,
      },
      {
        kind: 'callout',
        tone: 'key',
        html: `Below the water table you can shortcut effective stress using the <b>buoyant (submerged) unit weight</b> <span class="tex">\\gamma' = \\gamma_{sat} - \\gamma_w</span>. Then <span class="tex">\\sigma' = \\sum \\gamma'_i h_i</span> directly — no separate pore-pressure step.`,
      },
      {
        kind: 'example',
        title: "Effective stress at 8 m (water table at 3 m)",
        steps: [
          {
            text: 'Profile: 0–3 m moist sand, γm = 17 kN/m³. 3–10 m saturated sand, γsat = 20 kN/m³. Find σ′ at depth 8 m.',
          },
          { text: 'Total stress at 8 m:', tex: '\\sigma = 17(3) + 20(5) = 51 + 100 = 151\\ \\text{kPa}' },
          { text: 'Pore pressure (water 8 − 3 = 5 m above point):', tex: 'u = 9.81(5) = 49.1\\ \\text{kPa}' },
          { text: 'Effective stress:', tex: "\\sigma' = 151 - 49.1 = 101.9\\ \\text{kPa}" },
          {
            text: 'Check with buoyant weight: σ′ = 17(3) + (20−9.81)(5) = 51 + 50.95 = 101.95 kPa ✓',
            tex: "\\sigma' = 51 + 10.19(5) = 101.9\\ \\text{kPa}",
          },
        ],
      },
      {
        kind: 'callout',
        tone: 'warn',
        html: `<b>Capillary rise</b> and <b>upward seepage</b> change pore pressure. Upward flow <i>reduces</i> effective stress; when <span class="tex">\\sigma' \\to 0</span> the soil is at the <b>critical hydraulic gradient</b> and <b>quick / boiling</b> conditions occur: <span class="tex">i_{cr} = \\gamma'/\\gamma_w \\approx (G_s-1)/(1+e)</span>.`,
      },
      {
        kind: 'animation',
        component: 'StressProfile',
        caption: 'Drag the water table and read how σ, u, and σ′ change with depth.',
      },
    ],
    tips: [
      'On the CBT, sketch the profile on your scratchpad first — label every layer with γ and the water table.',
      'Watch units: pcf with feet (psf) vs kN/m³ with meters (kPa). The exam mixes SI and USCS.',
      'If the question mentions artesian pressure or seepage, do NOT assume hydrostatic u.',
    ],
    resources: [
      { label: 'Effective stress explained', url: 'https://www.youtube.com/results?search_query=effective+stress+soil+mechanics', source: 'YouTube search' },
    ],
  },
  {
    id: 'geo-mohr',
    examId: 'pe-geotech',
    areaId: 'geo-soilmech',
    title: "Shear Strength & Mohr's Circle",
    objective:
      "Use the Mohr-Coulomb failure criterion and Mohr's circle to find stresses on a plane and the factor of safety against shear failure.",
    estMinutes: 20,
    blocks: [
      {
        kind: 'prose',
        html: `<p>Soil fails in <b>shear</b>. The <b>Mohr-Coulomb</b> envelope gives the shear strength available on a plane as a function of the effective normal stress on that plane.</p>`,
      },
      { kind: 'formula', tex: "\\tau_f = c' + \\sigma'\\tan\\phi'", caption: 'Mohr-Coulomb failure criterion (effective stress)' },
      {
        kind: 'prose',
        html: `<p>For a given stress state with major/minor principal stresses <span class="tex">\\sigma_1</span> and <span class="tex">\\sigma_3</span>, the stresses on a plane inclined at angle θ from the major principal plane are read off <b>Mohr's circle</b> (center, radius below). Failure occurs when the circle becomes tangent to the envelope.</p>`,
      },
      { kind: 'formula', tex: 's = \\tfrac{1}{2}(\\sigma_1+\\sigma_3),\\quad t = \\tfrac{1}{2}(\\sigma_1-\\sigma_3)', caption: 'Center s and radius t of the Mohr circle' },
      { kind: 'formula', tex: '\\theta_f = 45^\\circ + \\phi/2', caption: 'Orientation of the failure plane from the major principal plane' },
      {
        kind: 'animation',
        component: 'MohrsCircle',
        caption: "Adjust σ₁, σ₃, c, and φ. Watch the circle approach the failure envelope.",
      },
      {
        kind: 'example',
        title: 'Is the element safe?',
        steps: [
          { text: "Drained triaxial element: σ₁′ = 300 kPa, σ₃′ = 100 kPa, soil c′ = 10 kPa, φ′ = 30°." },
          { text: 'Circle center and radius:', tex: 's = 200,\\ t = 100\\ \\text{kPa}' },
          { text: 'Max obliquity (mobilized): the circle is tangent to envelope at failure when', tex: '\\sin\\phi_{mob}=\\dfrac{t}{s + c\\cot\\phi}' },
          { text: 'At failure for φ′ = 30°, required (σ₁−σ₃)/2 = (s+c·cotφ)·sinφ:', tex: 't_f = (200 + 10\\cot 30^\\circ)\\sin 30^\\circ = 108.7' },
          { text: 'Since actual t = 100 < t_f = 108.7, the element has not failed. FS on deviator ≈ 108.7/100 ≈ 1.09.' },
        ],
      },
      {
        kind: 'callout',
        tone: 'tip',
        html: `Drained (effective, <span class="tex">c',\\phi'</span>) vs undrained (total, <span class="tex">\\phi=0,\\ s_u=c</span>) is the classic trap. <b>Sands → drained.</b> <b>Clays, short-term → undrained</b> with <span class="tex">s_u</span> and a horizontal envelope.`,
      },
    ],
    tips: [
      'For saturated clay short-term (undrained), φ = 0 and the radius equals s_u — the deviator stress at failure is 2·s_u.',
      'Double-angle trap: a plane at physical angle θ plots at 2θ on Mohr\'s circle.',
    ],
  },
  {
    id: 'geo-bearing',
    examId: 'pe-geotech',
    areaId: 'geo-shallow',
    title: 'Bearing Capacity of Shallow Foundations',
    objective:
      'Apply the general (Terzaghi/Meyerhof) bearing capacity equation and apply a factor of safety to size a footing.',
    estMinutes: 22,
    blocks: [
      {
        kind: 'prose',
        html: `<p>Ultimate bearing capacity is the pressure that causes shear failure of the supporting soil. The general equation has three terms — cohesion, surcharge, and footing-width (self-weight of the failure wedge):</p>`,
      },
      { kind: 'formula', tex: 'q_{ult} = c\\,N_c\\,s_c + q\\,N_q\\,s_q + \\tfrac{1}{2}\\gamma B\\,N_\\gamma\\,s_\\gamma', caption: 'General bearing capacity (with shape factors s)' },
      {
        kind: 'prose',
        html: `<p>where <span class="tex">q=\\gamma D_f</span> is the effective overburden at footing base, <span class="tex">B</span> is footing width, and <span class="tex">N_c,N_q,N_\\gamma</span> are bearing capacity factors that depend only on <span class="tex">\\phi</span>. Then design with a factor of safety, typically <b>FS = 3</b>:</p>`,
      },
      { kind: 'formula', tex: 'q_{all} = \\dfrac{q_{ult}}{FS}, \\qquad q_{net,all}=\\dfrac{q_{ult}-q}{FS}', caption: 'Allowable (gross) and net allowable bearing pressure' },
      {
        kind: 'table',
        caption: 'Representative bearing capacity factors (Meyerhof/Vesić — use the table provided on the exam)',
        headers: ['φ (°)', 'Nc', 'Nq', 'Nγ'],
        rows: [
          ['0', '5.14', '1.0', '0.0'],
          ['20', '14.8', '6.4', '5.4'],
          ['30', '30.1', '18.4', '22.4'],
          ['35', '46.1', '33.3', '48.0'],
          ['40', '75.3', '64.2', '109.4'],
        ],
      },
      {
        kind: 'example',
        title: 'Square footing on sand',
        steps: [
          { text: 'B = 2 m square footing, Df = 1 m, γ = 18 kN/m³, c = 0, φ = 30° (water table deep). FS = 3.' },
          { text: 'Surcharge:', tex: 'q = \\gamma D_f = 18(1) = 18\\ \\text{kPa}' },
          { text: 'Square shape factors (Meyerhof, φ=30°): s_q = s_γ ≈ 1+0.1·Kp·(B/L), here ≈ 1.3 each; c-term drops out (c=0).' },
          { text: 'q_ult (c=0):', tex: 'q_{ult}=18(18.4)(1.3)+\\tfrac12(18)(2)(22.4)(1.3)' },
          { text: 'Evaluate:', tex: 'q_{ult}=430.6 + 524.2 = 954.8\\ \\text{kPa}' },
          { text: 'Allowable:', tex: 'q_{all}=954.8/3 \\approx 318\\ \\text{kPa}' },
        ],
      },
      {
        kind: 'callout',
        tone: 'warn',
        html: `<b>Water table effects.</b> If groundwater is at or above the footing base, use buoyant unit weight <span class="tex">\\gamma'</span> in the <span class="tex">\\tfrac12\\gamma B N_\\gamma</span> term (and adjust the surcharge term if water is above the base). Forgetting this is the #1 bearing-capacity error.`,
      },
    ],
    tips: [
      'Net vs gross allowable: subtract overburden q for net. Read which the question wants.',
      'For clay (φ = 0): Nc = 5.14, Nq = 1, Nγ = 0, so q_ult = 5.14·su·sc + q. Very common quick problem.',
      'Local vs general shear: loose sand/soft clay may use reduced (φ*, c*) — check the prompt.',
    ],
  },
  {
    id: 'geo-lateral',
    examId: 'pe-geotech',
    areaId: 'geo-retaining',
    title: 'Lateral Earth Pressure (Rankine & Coulomb)',
    objective:
      'Compute active, passive, and at-rest pressures and the resultant thrust on a retaining wall, including water and surcharge.',
    estMinutes: 20,
    blocks: [
      { kind: 'prose', html: `<p>Retaining walls must resist <b>lateral earth pressure</b>. The state depends on wall movement: <b>at-rest</b> (no movement), <b>active</b> (wall moves away from soil — minimum pressure), <b>passive</b> (wall pushes into soil — maximum).</p>` },
      { kind: 'formula', tex: 'K_a = \\tan^2\\!\\left(45^\\circ-\\tfrac{\\phi}{2}\\right),\\quad K_p = \\tan^2\\!\\left(45^\\circ+\\tfrac{\\phi}{2}\\right),\\quad K_0 = 1-\\sin\\phi', caption: 'Rankine coefficients (level backfill, smooth vertical wall)' },
      { kind: 'formula', tex: "\\sigma'_a = K_a\\,\\sigma'_v - 2c'\\sqrt{K_a}, \\qquad \\sigma'_p = K_p\\,\\sigma'_v + 2c'\\sqrt{K_p}", caption: 'Active/passive horizontal effective stress (with cohesion)' },
      { kind: 'prose', html: `<p>The resultant active thrust for cohesionless level backfill of height H is a triangle:</p>` },
      { kind: 'formula', tex: 'P_a = \\tfrac12 K_a \\gamma H^2 \\quad\\text{acting at } H/3 \\text{ above the base}', caption: 'Active thrust (dry, cohesionless)' },
      {
        kind: 'example',
        title: 'Thrust on a 5 m wall',
        steps: [
          { text: 'H = 5 m, dry granular backfill γ = 18 kN/m³, φ = 32°, c = 0, no water.' },
          { text: 'Active coefficient:', tex: 'K_a=\\tan^2(45-16)=0.307' },
          { text: 'Total active thrust:', tex: 'P_a=\\tfrac12(0.307)(18)(5^2)=69.1\\ \\text{kN/m}' },
          { text: 'Line of action: 5/3 = 1.67 m above base.' },
        ],
      },
      { kind: 'callout', tone: 'warn', html: `<b>Water behind the wall</b> adds a separate hydrostatic triangle <span class="tex">\\tfrac12\\gamma_w H_w^2</span> and you must use <span class="tex">\\gamma'</span> for the submerged soil. A clogged drain doubling design pressure is a classic exam theme — always check drainage.` },
      { kind: 'callout', tone: 'tip', html: `<b>Surcharge</b> q (uniform) adds a rectangular pressure <span class="tex">K_a q</span> over the full height, resultant <span class="tex">K_a q H</span> at <span class="tex">H/2</span>.` },
    ],
    tips: [
      'Coulomb accounts for wall friction δ and sloped backfill — gives lower active thrust than Rankine; the exam table will tell you which to use.',
      'Tension cracks: cohesive soils have negative active pressure near the top (depth zc = 2c/(γ√Ka)); often neglect tension and start the diagram below zc.',
    ],
  },
  {
    id: 'geo-consolidation',
    examId: 'pe-geotech',
    areaId: 'geo-earthstruct',
    title: 'Consolidation Settlement',
    objective:
      'Classify a clay as NC or OC and compute primary consolidation settlement and time rate of settlement.',
    estMinutes: 22,
    blocks: [
      { kind: 'prose', html: `<p>Saturated clays settle slowly as water is squeezed out (<b>primary consolidation</b>). First compare the current effective stress <span class="tex">\\sigma'_0</span> to the <b>preconsolidation pressure</b> <span class="tex">\\sigma'_c</span>: OCR = σ′c/σ′0. If OCR ≈ 1 the clay is <b>normally consolidated (NC)</b>; if OCR > 1 it is <b>overconsolidated (OC)</b>.</p>` },
      { kind: 'formula', tex: "S_c = \\dfrac{C_c}{1+e_0} H \\log\\dfrac{\\sigma'_0+\\Delta\\sigma}{\\sigma'_0} \\quad (NC)", caption: 'Primary settlement, normally consolidated' },
      { kind: 'formula', tex: "S_c = \\dfrac{C_r}{1+e_0} H \\log\\dfrac{\\sigma'_0+\\Delta\\sigma}{\\sigma'_0} \\quad (OC,\\ \\sigma'_0+\\Delta\\sigma \\le \\sigma'_c)", caption: 'Recompression only (stays below preconsolidation)' },
      { kind: 'prose', html: `<p>If an OC clay is loaded past <span class="tex">\\sigma'_c</span>, split into a recompression part (Cr up to σ′c) plus a virgin part (Cc beyond σ′c).</p>` },
      { kind: 'formula', tex: 't = \\dfrac{T_v\\,H_{dr}^2}{c_v}', caption: 'Time for a given degree of consolidation (Hdr = longest drainage path)' },
      {
        kind: 'example',
        title: 'Settlement of an NC clay layer',
        steps: [
          { text: 'H = 4 m NC clay, e0 = 0.9, Cc = 0.30. σ′0 (mid-layer) = 80 kPa, Δσ = 60 kPa.' },
          { text: 'Settlement:', tex: 'S_c=\\dfrac{0.30}{1.9}(4)\\log\\dfrac{140}{80}' },
          { text: 'Evaluate log term: log(1.75) = 0.243.', tex: 'S_c=0.632(4)(0.243)=0.614\\ \\text{m}?' },
          { text: 'Careful with H units — use H in meters and answer in meters: Sc = (0.30/1.9)(4 m)(0.243) = 0.154 m = 154 mm.', tex: 'S_c=0.1579\\times4\\times0.243=0.153\\ \\text{m}' },
        ],
      },
      { kind: 'callout', tone: 'warn', html: `<b>Drainage path Hdr.</b> Double drainage (sand above and below) → Hdr = H/2. Single drainage → Hdr = H. Time depends on Hdr², so this factor of 2 changes time by 4×.` },
      { kind: 'animation', component: 'ConsolidationCurve', caption: 'Settlement vs time — toggle drainage and watch t₅₀/t₉₀ shift by 4×.' },
      { kind: 'callout', tone: 'tip', html: `U = 50% → Tv = 0.197; U = 90% → Tv = 0.848. Memorize these two — they cover most time-rate questions.` },
    ],
    tips: [
      'Use the mid-layer σ′0 for a single representative calc; split thick layers into sublayers for accuracy.',
      'Δσ at depth comes from stress distribution (2:1 method or Boussinesq influence factors).',
    ],
  },
  {
    id: 'geo-slope',
    examId: 'pe-geotech',
    areaId: 'geo-earthstruct',
    title: 'Slope Stability',
    objective:
      'Compute factor of safety for an infinite slope and understand method-of-slices and ϕ=0 circular analyses.',
    estMinutes: 18,
    blocks: [
      { kind: 'prose', html: `<p>Slope stability = available shear strength ÷ driving shear stress along a failure surface. For a long planar slip parallel to the surface (<b>infinite slope</b>) in cohesionless soil:</p>` },
      { kind: 'formula', tex: "FS = \\dfrac{\\tan\\phi'}{\\tan\\beta} \\quad (\\text{dry, } c'=0)", caption: 'Infinite slope, dry cohesionless' },
      { kind: 'formula', tex: "FS = \\dfrac{\\gamma'}{\\gamma_{sat}}\\cdot\\dfrac{\\tan\\phi'}{\\tan\\beta} \\quad (\\text{steady seepage parallel to slope})", caption: 'Infinite slope with seepage — note the γ′/γsat reduction' },
      { kind: 'prose', html: `<p>For curved failure surfaces, use the <b>method of slices</b> (Ordinary/Fellenius, Bishop's simplified). For saturated clay under undrained conditions (<span class="tex">\\phi=0</span>), the <b>Taylor stability number</b> or a φ=0 circular analysis applies.</p>` },
      {
        kind: 'example',
        title: 'Seepage cuts FS roughly in half',
        steps: [
          { text: 'Slope β = 20°, φ′ = 34°, c′ = 0. γsat = 20, γw = 9.81 kN/m³.' },
          { text: 'Dry:', tex: 'FS=\\tan34/\\tan20 = 0.675/0.364 = 1.85' },
          { text: 'Full seepage:', tex: 'FS=\\dfrac{20-9.81}{20}(1.85)=0.51(1.85)=0.94 < 1' },
          { text: 'Conclusion: dry it is stable; with seepage it fails. Drainage is decisive.' },
        ],
      },
      { kind: 'callout', tone: 'key', html: `Typical minimum FS: <b>1.5</b> for long-term static slopes, <b>1.3</b> for end-of-construction, and as low as <b>1.0–1.1</b> for pseudo-static seismic checks.` },
    ],
    tips: [
      'Pore pressure ratio ru = u/(γh) is a quick way to include water in slice methods.',
      'Bishop\'s simplified is more accurate than Ordinary (which ignores interslice forces) and usually gives a higher FS.',
    ],
  },
  {
    id: 'geo-liquefaction',
    examId: 'pe-geotech',
    areaId: 'geo-earthquake',
    title: 'Liquefaction & Seismic Site Effects',
    objective:
      'Screen a site for liquefaction triggering using the simplified CSR vs CRR approach and identify susceptible soils.',
    estMinutes: 16,
    blocks: [
      { kind: 'prose', html: `<p><b>Liquefaction</b> occurs when loose, saturated, cohesionless soil loses strength under cyclic loading as pore pressure rises to the confining stress (<span class="tex">\\sigma'\\to 0</span>). The simplified procedure compares demand to capacity:</p>` },
      { kind: 'formula', tex: "CSR = 0.65\\,\\dfrac{a_{max}}{g}\\,\\dfrac{\\sigma_{v}}{\\sigma'_{v}}\\,r_d", caption: 'Cyclic Stress Ratio (seismic demand)' },
      { kind: 'formula', tex: 'FS_{liq} = \\dfrac{CRR \\cdot MSF}{CSR}', caption: 'Capacity (CRR from SPT/CPT) ÷ demand, with magnitude scaling factor' },
      { kind: 'callout', tone: 'key', html: `Most susceptible: <b>loose, saturated, clean fine sands and non-plastic silts</b> with low (N₁)₆₀, below the water table, and young/uncompacted. Clays generally do not liquefy.` },
      { kind: 'callout', tone: 'tip', html: `Site class for design comes from <span class="tex">V_{s30}</span> (or N̄, s̄u over the top 30 m / 100 ft). Softer site → higher site coefficients → larger seismic demand. This ties directly into the CA Seismic exam.` },
    ],
    tips: [
      'rd ≈ 1 − 0.00765z (z in m) for shallow depths — a handy approximation.',
      'Mitigation: densification (vibro, dynamic compaction), drainage (stone columns), and ground reinforcement.',
    ],
  },
  // ---- Structured starters (expand with full content over time) ----
  {
    id: 'geo-site-investigation',
    examId: 'pe-geotech',
    areaId: 'geo-site',
    title: 'Subsurface Exploration & In-situ Testing',
    objective: 'Select exploration/sampling methods and correct SPT N-values for field conditions.',
    estMinutes: 14,
    blocks: [
      { kind: 'prose', html: `<p>Plan borings by project type and risk. Key in-situ tests: <b>SPT</b> (N-value), <b>CPT</b> (qc, fs, continuous profile), <b>vane shear</b> (su of soft clay), <b>pressuremeter</b>, and <b>dilatometer</b>.</p>` },
      { kind: 'formula', tex: '(N_1)_{60} = N \\cdot C_N \\cdot C_E C_B C_R C_S', caption: 'SPT correction: energy/overburden/borehole/rod/sampler' },
      { kind: 'callout', tone: 'tip', html: `<span class="tex">(N_1)_{60}</span> normalizes N to 60% hammer energy and 1 atm overburden — it's the value used in liquefaction and strength correlations.` },
    ],
    tips: ['CPT gives continuous data and no spoil but no sample; SPT gives a sample but is variable. Know the trade-offs.'],
  },
  {
    id: 'geo-deep-foundations',
    examId: 'pe-geotech',
    areaId: 'geo-deep',
    title: 'Deep Foundations — Axial Capacity',
    objective: 'Compute pile capacity from skin friction plus end bearing and apply a factor of safety.',
    estMinutes: 16,
    blocks: [
      { kind: 'prose', html: `<p>A pile carries load by <b>skin friction</b> along the shaft plus <b>end bearing</b> at the tip:</p>` },
      { kind: 'formula', tex: 'Q_{ult} = Q_s + Q_p = \\sum f_s A_s + q_p A_p', caption: 'Total ultimate axial capacity' },
      { kind: 'formula', tex: "f_s = \\beta\\,\\sigma'_v \\ (\\text{sand}),\\qquad f_s = \\alpha\\,s_u \\ (\\text{clay})", caption: 'Unit skin friction: β-method (sand) and α-method (clay)' },
      { kind: 'callout', tone: 'warn', html: `Watch <b>downdrag (negative skin friction)</b> when fill or consolidating clay settles relative to the pile — it adds load instead of resisting it.` },
    ],
    tips: ['Group efficiency and group settlement can govern over single-pile capacity for closely spaced piles.'],
  },
  {
    id: 'geo-seepage',
    examId: 'pe-geotech',
    areaId: 'geo-groundwater',
    title: 'Seepage & Flow Nets',
    objective: 'Use Darcy’s law and flow nets to compute seepage quantity and exit gradient.',
    estMinutes: 12,
    blocks: [
      { kind: 'formula', tex: 'q = k\\,H\\,\\dfrac{N_f}{N_d}', caption: 'Seepage from a flow net (per unit width)' },
      { kind: 'formula', tex: "i = \\dfrac{\\Delta h}{L},\\qquad i_{cr} = \\dfrac{\\gamma'}{\\gamma_w}", caption: 'Hydraulic gradient and critical gradient (piping/heave)' },
      { kind: 'callout', tone: 'key', html: `Factor of safety against <b>piping/boiling</b> = i_cr / i_exit. Nf = number of flow channels, Nd = number of equipotential drops.` },
    ],
    tips: ['Anisotropy: transform the section using √(kx/kz) before drawing a square flow net.'],
  },
  {
    id: 'geo-permeability',
    examId: 'pe-geotech',
    areaId: 'geo-soilmech',
    title: 'Permeability & Darcy Flow',
    objective: 'Compute hydraulic conductivity from lab tests and apply Darcy’s law for flow rate.',
    estMinutes: 14,
    blocks: [
      { kind: 'prose', html: `<p><b>Hydraulic conductivity</b> k governs how fast water moves through soil. Flow follows <b>Darcy's law</b>, valid for laminar flow:</p>` },
      { kind: 'formula', tex: 'v = ki,\\qquad q = kiA,\\qquad i = \\dfrac{\\Delta h}{L}', caption: 'Darcy velocity, flow rate, and hydraulic gradient' },
      { kind: 'prose', html: `<p>Measure k in the lab two ways: the <b>constant-head test</b> (coarse soils) and the <b>falling-head test</b> (fine soils).</p>` },
      { kind: 'formula', tex: 'k = \\dfrac{QL}{Ah t}\\ (\\text{constant head}),\\qquad k = \\dfrac{aL}{At}\\ln\\dfrac{h_1}{h_2}\\ (\\text{falling head})', caption: 'Lab permeability tests' },
      { kind: 'formula', tex: 'k \\approx C\\,D_{10}^2\\ (\\text{Hazen, clean sands, } D_{10}\\text{ in mm}, k\\text{ in cm/s})', caption: 'Hazen empirical correlation' },
      {
        kind: 'example',
        title: 'Flow through a sand layer',
        steps: [
          { text: 'k = 3×10⁻³ cm/s, gradient i = 0.4, cross-section A = 2 m². Find q.' },
          { text: 'Convert k: 3×10⁻³ cm/s = 3×10⁻⁵ m/s.' },
          { text: 'Darcy:', tex: 'q = kiA = 3\\times10^{-5}(0.4)(2) = 2.4\\times10^{-5}\\ \\text{m}^3/\\text{s}' },
        ],
      },
      { kind: 'callout', tone: 'tip', html: `Typical k: clean gravel 1–100 cm/s; sands 10⁻³–1; silts 10⁻⁶–10⁻³; clays < 10⁻⁷ cm/s. Memorize these orders of magnitude.` },
    ],
    tips: ['Watch unit consistency between k, A, and the head terms — mixing cm/s with m is the usual slip.'],
  },
  {
    id: 'geo-earthwork',
    examId: 'pe-geotech',
    areaId: 'geo-construction',
    title: 'Earthwork, Compaction & Excavation Safety',
    objective: 'Use Proctor results and relative compaction, account for shrink/swell, and apply OSHA excavation rules.',
    estMinutes: 16,
    blocks: [
      { kind: 'prose', html: `<p>Compaction increases density and strength and reduces settlement/permeability. The <b>Proctor test</b> gives the maximum dry unit weight at the optimum moisture content. Field quality is measured as <b>relative compaction</b>:</p>` },
      { kind: 'formula', tex: 'RC = \\dfrac{\\gamma_{d,field}}{\\gamma_{d,max}}\\times 100\\%', caption: 'Relative compaction (typically specify ≥ 90–95% of standard Proctor)' },
      { kind: 'prose', html: `<p><b>Shrink/swell</b> converts between bank (in-place), loose (hauled), and compacted (placed) volumes — never forget it on mass-haul problems.</p>` },
      {
        kind: 'example',
        title: 'Relative compaction check',
        steps: [
          { text: 'Field dry unit weight 17.8 kN/m³; standard Proctor max 18.5 kN/m³.' },
          { text: 'Relative compaction:', tex: 'RC = \\dfrac{17.8}{18.5} = 96.2\\%' },
          { text: 'If the spec is 95%, this passes.' },
        ],
      },
      { kind: 'callout', tone: 'warn', html: `<b>OSHA 29 CFR 1926 Subpart P:</b> protective systems (sloping/shoring/shielding) are required at <b>5 ft (1.5 m)</b> depth or more, a competent person classifies the soil (A/B/C), and spoil is kept ≥ 2 ft from the edge.` },
      {
        kind: 'table',
        caption: 'OSHA maximum allowable slopes (simple guidance — confirm with the standard)',
        headers: ['Soil type', 'Max slope (H:V)'],
        rows: [['Stable rock', 'Vertical'], ['Type A', '3/4 : 1 (53°)'], ['Type B', '1 : 1 (45°)'], ['Type C', '1.5 : 1 (34°)']],
      },
    ],
    tips: ['Cohesionless soil cannot be Type A. Submerged or previously disturbed soil cannot be Type A.'],
  },
  {
    id: 'geo-problematic-soils',
    examId: 'pe-geotech',
    areaId: 'geo-problematic',
    title: 'Problematic Soils & Rock',
    objective: 'Identify expansive, collapsible, and other problem soils and select mitigation.',
    estMinutes: 14,
    blocks: [
      { kind: 'prose', html: `<p>Some soils behave badly under changing moisture or load. Recognizing them — and the giveaway clues in a problem statement — is the key exam skill.</p>` },
      {
        kind: 'table',
        headers: ['Soil/condition', 'Problem', 'Clue / mitigation'],
        rows: [
          ['Expansive clay (montmorillonite)', 'Shrink/swell with moisture', 'High PI / LL; moisture control, lime treatment, deepen footings'],
          ['Collapsible soil (loess)', 'Sudden settlement when wetted', 'Low density, arid origin; prewetting, compaction, chemical grout'],
          ['Karst (limestone)', 'Sinkholes / voids', 'Solutioned rock; grouting, deep foundations to bedrock'],
          ['Sensitive clay', 'Strength loss when remolded', 'High sensitivity St; avoid disturbance'],
          ['Frost-susceptible silt', 'Frost heave / thaw softening', 'Capillary silt; replace, insulate, drain'],
          ['Corrosive/reactive soil', 'Attacks concrete/steel', 'Low pH, sulfates; protective coatings, sulfate-resistant cement'],
        ],
      },
      { kind: 'callout', tone: 'key', html: `<b>Expansive soils</b> are flagged by high plasticity index. Damage = differential heave under slabs/footings, not bearing failure. Fixes target <i>moisture stability</i>, not strength.` },
    ],
    tips: ['Sensitivity St = undisturbed strength / remolded strength. "Quick" clays have St > 8.'],
  },
];
