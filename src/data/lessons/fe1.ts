import type { Lesson } from '../../types';

// FE Civil review lessons — first batch. Written for FE candidates refreshing
// fundamentals: first-principles explanations, FE Reference Handbook equation
// names, and pacing tactics for a ~3 min/question exam.
export const feLessons1: Lesson[] = [
  // -------------------------------------------------------------------------
  // 1. Mathematics & Statistics
  // -------------------------------------------------------------------------
  {
    id: 'fe-math-review',
    examId: 'fe-civil',
    areaId: 'fe-math',
    title: 'Calculus, Vectors & Statistics Essentials',
    objective:
      'Take derivatives and integrals on sight, use dot/cross products for angles and moments, and compute mean, standard deviation, and z-scores fast.',
    estMinutes: 18,
    blocks: [
      {
        kind: 'prose',
        html: `<p>FE math questions are <b>speed checks</b>, not proofs. Almost every calculus question reduces to one of three moves: differentiate a polynomial/trig/exponential, integrate one, or set a derivative to zero to optimize. The FE Reference Handbook lists every derivative and integral you need under <b>Mathematics — Differential Calculus / Integral Calculus</b>, but looking them up costs 30+ seconds. Know the core set cold:</p>
        <ul class="list-disc ml-5 space-y-1">
          <li><span class="tex">\\dfrac{d}{dx}x^n = nx^{n-1}</span>, <span class="tex">\\dfrac{d}{dx}e^{ax}=ae^{ax}</span>, <span class="tex">\\dfrac{d}{dx}\\ln x = 1/x</span>, <span class="tex">\\dfrac{d}{dx}\\sin x = \\cos x</span>, <span class="tex">\\dfrac{d}{dx}\\cos x = -\\sin x</span></li>
          <li>Product rule <span class="tex">(uv)' = u'v + uv'</span> and chain rule <span class="tex">\\dfrac{d}{dx}f(g)=f'(g)\\,g'</span></li>
          <li><span class="tex">\\int x^n dx = \\dfrac{x^{n+1}}{n+1}+C\\ (n\\neq -1)</span>, <span class="tex">\\int \\dfrac{dx}{x} = \\ln|x|+C</span>, <span class="tex">\\int e^{ax}dx = \\dfrac{e^{ax}}{a}+C</span></li>
        </ul>`,
      },
      {
        kind: 'callout',
        tone: 'key',
        html: `<b>Max/min recipe</b> (the most common calculus question): set <span class="tex">f'(x)=0</span>, solve for critical points, then use the <b>second derivative test</b> — <span class="tex">f''&lt;0</span> is a maximum, <span class="tex">f''&gt;0</span> is a minimum. Inflection point: <span class="tex">f''(x)=0</span> with a sign change.`,
      },
      {
        kind: 'example',
        title: 'Locate and classify the maximum',
        steps: [
          { text: 'Find the local maximum of f(x) = x³ − 6x² + 9x + 2.' },
          { text: 'Differentiate and factor:', tex: "f'(x) = 3x^2 - 12x + 9 = 3(x-1)(x-3) = 0" },
          { text: 'Critical points x = 1 and x = 3. Apply the second derivative test:', tex: "f''(x) = 6x - 12" },
          { text: "At x = 1: f''(1) = −6 < 0 → local maximum. At x = 3: f''(3) = +6 > 0 → local minimum.", tex: "f''(1) = -6 < 0 \\;\\Rightarrow\\; \\text{max at } x=1" },
          { text: 'Maximum value:', tex: 'f(1) = 1 - 6 + 9 + 2 = 6' },
        ],
      },
      {
        kind: 'prose',
        html: `<p><b>Vectors.</b> Two products, two jobs. The <b>dot product</b> gives a scalar — use it for angles, projections, and work (<span class="tex">W = \\mathbf{F}\\cdot\\mathbf{d}</span>). The <b>cross product</b> gives a vector — use it for moments (<span class="tex">\\mathbf{M} = \\mathbf{r}\\times\\mathbf{F}</span>) and areas.</p>`,
      },
      {
        kind: 'formula',
        tex: '\\mathbf{A}\\cdot\\mathbf{B} = A_xB_x + A_yB_y + A_zB_z = |\\mathbf{A}||\\mathbf{B}|\\cos\\theta',
        caption: 'Dot product — zero means perpendicular',
      },
      {
        kind: 'formula',
        tex: '\\mathbf{A}\\times\\mathbf{B} = \\begin{vmatrix}\\mathbf{i} & \\mathbf{j} & \\mathbf{k}\\\\ A_x & A_y & A_z\\\\ B_x & B_y & B_z\\end{vmatrix}, \\qquad |\\mathbf{A}\\times\\mathbf{B}| = |\\mathbf{A}||\\mathbf{B}|\\sin\\theta',
        caption: 'Cross product — zero means parallel; magnitude = parallelogram area',
      },
      {
        kind: 'prose',
        html: `<p><b>Statistics.</b> The handbook's <b>Engineering Probability and Statistics</b> section gives both the population and sample formulas — the exam expects the <b>sample</b> standard deviation (divide by <span class="tex">n-1</span>) unless it explicitly says population.</p>`,
      },
      {
        kind: 'formula',
        tex: '\\bar{x} = \\dfrac{\\sum x_i}{n}, \\qquad s = \\sqrt{\\dfrac{\\sum (x_i-\\bar{x})^2}{n-1}}, \\qquad z = \\dfrac{x-\\mu}{\\sigma}',
        caption: 'Sample mean, sample standard deviation, and standard normal z-score',
      },
      {
        kind: 'example',
        title: 'Standard deviation and z-score by hand',
        steps: [
          { text: 'Data set (n = 8): 2, 4, 4, 4, 5, 5, 7, 9. Find the sample standard deviation and the z-score of the value 9 (treating the data as the population for z).' },
          { text: 'Mean:', tex: '\\bar{x} = \\dfrac{2+4+4+4+5+5+7+9}{8} = \\dfrac{40}{8} = 5' },
          { text: 'Sum of squared deviations:', tex: '\\sum(x_i-\\bar{x})^2 = 9+1+1+1+0+0+4+16 = 32' },
          { text: 'Sample SD (n − 1 = 7 in the denominator):', tex: 's = \\sqrt{32/7} = \\sqrt{4.571} = 2.14' },
          { text: 'Population SD would be √(32/8) = 2.0, so the z-score of 9 is:', tex: 'z = \\dfrac{9-5}{2.0} = 2.0' },
        ],
      },
      {
        kind: 'callout',
        tone: 'tip',
        html: `Your CBT calculator (TI-36X Pro or Casio fx-115/991) computes <span class="tex">\\bar{x}</span>, <span class="tex">s</span>, and <span class="tex">\\sigma</span> from a data list in seconds. Practice the STAT mode <i>before</i> exam day — it turns a 3-minute hand calculation into 30 seconds.`,
      },
    ],
    tips: [
      'Memorize the top-10 derivatives and integrals — searching the handbook PDF for them wastes more time than any other habit.',
      'Dot product = 0 → perpendicular; cross product = 0 → parallel. Many vector questions are just this test.',
      "Sample vs population SD: divide by n−1 unless the problem says \"population.\" Both appear as answer choices on purpose.",
    ],
  },

  // -------------------------------------------------------------------------
  // 2. Engineering Economics
  // -------------------------------------------------------------------------
  {
    id: 'fe-econ-tvm',
    examId: 'fe-civil',
    areaId: 'fe-econ',
    title: 'Time Value of Money',
    objective:
      'Convert between present worth P, future worth F, and uniform series A using factor notation and the FE handbook interest tables, then apply break-even and benefit-cost analysis.',
    estMinutes: 16,
    blocks: [
      {
        kind: 'prose',
        html: `<p>Every economics question on the FE is a translation problem: move cash flows through time at interest rate <span class="tex">i</span>. Three quantities cover nearly everything:</p>
        <ul class="list-disc ml-5 space-y-1">
          <li><b>P</b> — a single amount <i>now</i> (present worth)</li>
          <li><b>F</b> — a single amount <i>n periods from now</i> (future worth)</li>
          <li><b>A</b> — an equal amount <i>every period</i> for n periods (uniform series / annuity)</li>
        </ul>
        <p class="mt-2">The FE Reference Handbook's <b>Engineering Economics</b> section defines every conversion as a <b>factor</b> written <span class="tex">(X/Y, i\\%, n)</span> — read it as "X given Y": multiply what you <i>have</i> (Y) by the factor to get what you <i>want</i> (X).</p>`,
      },
      {
        kind: 'formula',
        tex: 'F = P(1+i)^n = P\\,(F/P, i\\%, n)',
        caption: 'Single payment compound amount — the root formula; every other factor derives from it',
      },
      {
        kind: 'formula',
        tex: 'P = A\\left[\\dfrac{(1+i)^n - 1}{i(1+i)^n}\\right] = A\\,(P/A, i\\%, n)',
        caption: 'Uniform series present worth — value today of n equal end-of-period payments',
      },
      {
        kind: 'formula',
        tex: 'A = P\\left[\\dfrac{i(1+i)^n}{(1+i)^n - 1}\\right] = P\\,(A/P, i\\%, n)',
        caption: 'Capital recovery — the loan-payment factor, reciprocal of P/A',
      },
      {
        kind: 'callout',
        tone: 'key',
        html: `<b>Using the handbook tables:</b> the interest tables give the factor values directly — find the page for your <span class="tex">i</span>, go down to row <span class="tex">n</span>, read the column (F/P, P/F, A/P, P/A, F/A, A/F). Reading a table beats exponent arithmetic and avoids keystroke errors. Sanity checks: <span class="tex">(P/F) = 1/(F/P)</span>, <span class="tex">(A/P) = 1/(P/A)</span>, and P/A is always a bit less than n.`,
      },
      {
        kind: 'example',
        title: 'Future worth of a single deposit',
        steps: [
          { text: 'You deposit $10,000 today at 6% compounded annually. What is it worth in 10 years?' },
          { text: 'Identify: have P, want F → use (F/P, 6%, 10):', tex: 'F = P(1+i)^n = 10{,}000(1.06)^{10}' },
          { text: 'From the 6% table, (F/P, 6%, 10) = 1.7908 (or compute 1.06¹⁰):', tex: '(1.06)^{10} = 1.7908' },
          { text: 'Future worth:', tex: 'F = 10{,}000(1.7908) = \\$17{,}908' },
        ],
      },
      {
        kind: 'example',
        title: 'Present worth of a uniform series',
        steps: [
          { text: 'A pump saves $2,000 per year in energy for 5 years. At i = 8%, what is the most you should pay for it today?' },
          { text: 'Identify: have A, want P → use (P/A, 8%, 5):', tex: 'P = A\\left[\\dfrac{(1.08)^5 - 1}{0.08(1.08)^5}\\right]' },
          { text: 'Compute the factor: (1.08)⁵ = 1.4693, so', tex: '(P/A, 8\\%, 5) = \\dfrac{1.4693 - 1}{0.08(1.4693)} = \\dfrac{0.4693}{0.11755} = 3.9927' },
          { text: 'Present worth:', tex: 'P = 2{,}000(3.9927) = \\$7{,}985' },
          { text: 'Sanity check: 5 payments of $2,000 = $10,000 undiscounted; P must be less. ✓' },
        ],
      },
      {
        kind: 'prose',
        html: `<p><b>Break-even</b> analysis finds the quantity where two alternatives cost the same, or where revenue equals cost: set <span class="tex">\\text{Cost}_1 = \\text{Cost}_2</span> (or total revenue = fixed + variable cost) and solve for the quantity. <b>Benefit-cost ratio</b> is the public-works screening tool:</p>`,
      },
      {
        kind: 'formula',
        tex: 'B/C = \\dfrac{\\text{PW of benefits} - \\text{PW of disbenefits}}{\\text{PW of costs}} \\ge 1',
        caption: 'Benefit-cost criterion — a project is acceptable when B/C ≥ 1; compare alternatives with incremental ΔB/ΔC',
      },
      {
        kind: 'callout',
        tone: 'warn',
        html: `<b>Cash-flow convention traps:</b> A-series payments occur at the <i>end</i> of each period, and P sits one period <i>before</i> the first A. If the first payment is at year 0 (annuity due) or year 2 (deferred), shift with an extra (P/F) or (F/P) factor. Draw the cash-flow diagram — 15 seconds of sketching prevents the classic off-by-one-period error.`,
      },
    ],
    tips: [
      'Write the factor notation first — e.g., P = 2000(P/A, 8%, 5) — then grab the number from the handbook table. It self-documents and prevents inverted factors.',
      'MARR, effective vs nominal rates: effective i per period = r/m for m compounding periods per year; use the period that matches the payments.',
      'Answer choices are usually spread far apart — the table value to 4 significant figures is always accurate enough. Do not re-derive factors from scratch.',
    ],
  },

  // -------------------------------------------------------------------------
  // 3. Ethics & Professional Practice
  // -------------------------------------------------------------------------
  {
    id: 'fe-ethics-rules',
    examId: 'fe-civil',
    areaId: 'fe-ethics',
    title: 'Ethics, Licensure & Contracts',
    objective:
      'Apply the NCEES Model Rules hierarchy — public welfare first, competence, honesty, disclosure — to eliminate wrong answers fast, and recognize the elements of a valid contract.',
    estMinutes: 14,
    blocks: [
      {
        kind: 'prose',
        html: `<p>Ethics questions are free points <i>if</i> you answer from the <b>NCEES Model Rules of Professional Conduct</b> (in the FE Reference Handbook) rather than from workplace instinct. The rules form a hierarchy:</p>
        <ul class="list-disc ml-5 space-y-1">
          <li><b>1. Public first.</b> Hold paramount the safety, health, and welfare of the public. This outranks the client, the employer, and your career.</li>
          <li><b>2. Competence.</b> Perform services only in areas of your competence; sign/seal only work you did or directly supervised.</li>
          <li><b>3. Honesty & objectivity.</b> Be truthful in reports and public statements; do not misrepresent qualifications.</li>
          <li><b>4. Disclosure of conflicts.</b> Disclose any conflict of interest to employers or clients — even the <i>appearance</i> of one — and do not accept compensation from multiple parties on the same project without full disclosure and consent.</li>
          <li><b>5. Confidentiality.</b> Do not reveal client information without consent — <i>unless</i> the public-welfare duty requires it.</li>
        </ul>`,
      },
      {
        kind: 'callout',
        tone: 'key',
        html: `<b>How the questions are worded — and eliminated.</b> The correct choice is almost always the one that (a) protects the public, (b) works up the chain first (supervisor → client → authorities), and (c) avoids both doing nothing and public grandstanding. Eliminate any choice containing "ignore," "since it is not your responsibility," "resign immediately," or "notify the media" — extremes are wrong. The answer that says <i>report your concern to your supervisor / the responsible engineer in writing, and escalate if unresolved</i> wins far more often than not.`,
      },
      {
        kind: 'example',
        title: 'Scenario walk-through: the undersized column',
        steps: [
          { text: 'Scenario: An EIT reviewing shop drawings notices a column that appears undersized for the design load. Her supervisor, under schedule pressure, says "it was checked, let it go." What should she do? (A) Let it go — the supervisor is the engineer of record. (B) Anonymously call the building department. (C) Re-verify her calculation, present it to the supervisor in writing, and escalate within the firm (and beyond, if unresolved) because public safety is at stake. (D) Resign in protest.' },
          { text: 'Step 1 — Identify the governing rule. A possibly undersized column is a public-safety issue, so Model Rule #1 (public welfare paramount) controls. Any answer that drops the issue is eliminated: (A) is out, even though the supervisor is licensed and she is not.' },
          { text: 'Step 2 — Eliminate the extremes. (B) jumps to authorities before verifying the concern or using the internal chain — premature. (D) removes her from the problem without protecting anyone. Ethics answers reward proportionate escalation, not exit or exposure as a first move.' },
          { text: 'Step 3 — Check the remaining choice against the hierarchy. (C) verifies the technical concern (competence, honesty), documents it in writing, uses the chain of authority, and preserves escalation to the building official if the firm refuses to act — exactly the Model Rules sequence.' },
          { text: 'Answer: (C). Pattern to remember: verify → document → escalate internally → escalate externally only if the public remains at risk.' },
        ],
      },
      {
        kind: 'prose',
        html: `<p><b>Licensure basics</b> the exam tests directly: only a licensed PE may offer engineering services to the public, seal documents, or use the title "engineer" in most states; an EIT/EI certification is a step toward licensure, not a license. <b>Industrial exemption</b> lets unlicensed engineers work on their employer's products, but never to seal public infrastructure work. Plan stamping (sealing work you did not supervise) is a violation everywhere.</p>`,
      },
      {
        kind: 'prose',
        html: `<p><b>Contracts.</b> A valid contract requires four elements — memorize them as a checklist:</p>
        <ul class="list-disc ml-5 space-y-1">
          <li><b>Offer</b> — a definite proposal by one party</li>
          <li><b>Acceptance</b> — unqualified agreement to that exact offer (a modified acceptance is a counteroffer)</li>
          <li><b>Consideration</b> — something of value exchanged by both sides</li>
          <li><b>Legal capacity & lawful purpose</b> — competent parties and a legal objective</li>
        </ul>
        <p class="mt-2">Related terms that appear: <b>breach</b> (failure to perform), <b>negligence</b> (failing the standard of care of a reasonable professional — the usual basis for engineer liability), and the difference between <b>lump-sum</b>, <b>unit-price</b>, and <b>cost-plus</b> compensation.</p>`,
      },
      {
        kind: 'callout',
        tone: 'tip',
        html: `Gifts and conflicts questions: the safe-harbor answer is <b>disclose and decline anything of more than nominal value</b>. Accepting a contractor's lavish gift, sole-sourcing to a firm you own stock in without disclosure, or reviewing a competitor's work for the same client without consent are all wrong for the same root reason: undisclosed divided loyalty.`,
      },
    ],
    tips: [
      'Answer from the NCEES Model Rules, not from "what my office would actually do." The exam grades the rules.',
      'Ethics questions take 60–90 seconds, not 3 minutes — bank the extra time for calculation-heavy problems later in the section.',
      'When two answers both look ethical, pick the one that protects the public AND follows the escalation chain in order. Skipping steps or stopping early are both traps.',
    ],
  },

  // -------------------------------------------------------------------------
  // 4. Statics
  // -------------------------------------------------------------------------
  {
    id: 'fe-statics-core',
    examId: 'fe-civil',
    areaId: 'fe-statics',
    title: 'Statics: Equilibrium, Trusses & Centroids',
    objective:
      'Set up ΣF = 0 and ΣM = 0 efficiently, solve truss members by joints or sections, spot zero-force members on sight, and compute composite centroids with the parallel axis theorem.',
    estMinutes: 20,
    blocks: [
      {
        kind: 'prose',
        html: `<p>Statics is the highest-leverage subject on the FE Civil: it is worth 8–12 questions itself <i>and</i> it feeds mechanics of materials and structural analysis. Every problem starts the same way: <b>draw the free-body diagram</b>, replace supports with reactions (pin → 2 forces, roller → 1 force, fixed → 2 forces + 1 moment), then apply equilibrium:</p>`,
      },
      {
        kind: 'formula',
        tex: '\\sum F_x = 0, \\qquad \\sum F_y = 0, \\qquad \\sum M_{any\\ point} = 0',
        caption: 'Planar equilibrium — three independent equations, so at most three unknowns per FBD',
      },
      {
        kind: 'callout',
        tone: 'key',
        html: `<b>Speed move:</b> take moments about the point where the <i>most unknowns intersect</i> — those unknowns vanish from the equation and you solve one unknown in one line. For a simply supported beam, summing moments at one support gives the other reaction immediately.`,
      },
      {
        kind: 'prose',
        html: `<p><b>Trusses.</b> All members are two-force members: pure tension (pulls on the joint) or compression (pushes). Two attack methods:</p>
        <ul class="list-disc ml-5 space-y-1">
          <li><b>Method of joints</b> — ΣFx = 0, ΣFy = 0 at one pin. Best when you need <i>all</i> members or a member at a simple joint. Start at a joint with ≤ 2 unknowns.</li>
          <li><b>Method of sections</b> — cut through ≤ 3 members and apply full equilibrium to one piece. Best when you need <i>one specific member</i> in the middle of the truss: one cut, one moment equation, done.</li>
        </ul>
        <p class="mt-2"><b>Zero-force members</b> (find them <i>before</i> computing anything): at an unloaded joint with only two non-collinear members, both are zero; at an unloaded joint with three members where two are collinear, the third is zero.</p>`,
      },
      {
        kind: 'example',
        title: 'Beam reactions, then a truss joint',
        steps: [
          { text: 'Part 1: A simply supported beam AB spans 10 m with a 20 kN downward load 4 m from A. Find the reactions.' },
          { text: 'Moments about A (eliminates R_A):', tex: '\\sum M_A = 0:\\; R_B(10) - 20(4) = 0 \\;\\Rightarrow\\; R_B = 8\\ \\text{kN}' },
          { text: 'Vertical equilibrium:', tex: '\\sum F_y = 0:\\; R_A = 20 - 8 = 12\\ \\text{kN}' },
          { text: 'Part 2: At a truss support the 8 kN reaction acts up; a diagonal member rises at 45° toward the interior and a horizontal bottom chord leaves the joint. Joint equilibrium, vertical first:', tex: '\\sum F_y = 0:\\; 8 + F_{diag}\\sin 45^\\circ = 0 \\;\\Rightarrow\\; F_{diag} = -11.31\\ \\text{kN (compression)}' },
          { text: 'Horizontal:', tex: '\\sum F_x = 0:\\; F_{chord} + (-11.31)\\cos 45^\\circ = 0 \\;\\Rightarrow\\; F_{chord} = +8\\ \\text{kN (tension)}' },
        ],
      },
      {
        kind: 'prose',
        html: `<p><b>Centroids of composite areas.</b> Break the shape into rectangles, triangles, and circles whose centroids are tabulated in the handbook's <b>Statics</b> section; holes enter with <i>negative</i> area:</p>`,
      },
      {
        kind: 'formula',
        tex: '\\bar{x} = \\dfrac{\\sum A_i \\bar{x}_i}{\\sum A_i}, \\qquad \\bar{y} = \\dfrac{\\sum A_i \\bar{y}_i}{\\sum A_i}',
        caption: 'Composite centroid — area-weighted average of piece centroids (holes: negative A)',
      },
      {
        kind: 'formula',
        tex: 'I = I_c + A d^2',
        caption: 'Parallel axis theorem — d is the distance from the piece centroid to the composite axis; the Ad² term is always added, never subtracted (except for holes, where the whole piece is negative)',
      },
      {
        kind: 'callout',
        tone: 'warn',
        html: `The parallel axis theorem only transfers <i>away from</i> a centroidal axis. To move between two non-centroidal axes, go through the centroid in two steps. And remember the workhorse values: rectangle <span class="tex">I_c = bh^3/12</span>, circle <span class="tex">I_c = \\pi r^4/4</span>, triangle <span class="tex">I_c = bh^3/36</span>.`,
      },
    ],
    tips: [
      'Scan every truss for zero-force members first — the exam loves asking for a member that is zero by inspection, a 20-second answer.',
      'Need one mid-truss member? Method of sections with a moment about the point where the other two cut members intersect: one equation, one unknown.',
      'Sign discipline beats sign cleverness: assume all truss members in tension; a negative result means compression. Never re-guess mid-problem.',
    ],
  },

  // -------------------------------------------------------------------------
  // 5. Dynamics
  // -------------------------------------------------------------------------
  {
    id: 'fe-dynamics-core',
    examId: 'fe-civil',
    areaId: 'fe-dynamics',
    title: 'Dynamics: Kinematics, Energy & Momentum',
    objective:
      'Choose the fastest tool — constant-acceleration equations, projectile decomposition, work-energy, or impulse-momentum — and execute it in under three minutes.',
    estMinutes: 16,
    blocks: [
      {
        kind: 'prose',
        html: `<p>FE dynamics rewards <b>tool selection</b>. Ask what the problem gives and what it wants:</p>
        <ul class="list-disc ml-5 space-y-1">
          <li>Positions, velocities, <i>times</i> with constant acceleration → <b>kinematics equations</b></li>
          <li>Forces over a <i>distance</i>, speeds at two points → <b>work-energy</b> (no time, no acceleration needed)</li>
          <li>Forces over a <i>time</i>, or an impact/collision → <b>impulse-momentum</b></li>
        </ul>`,
      },
      {
        kind: 'formula',
        tex: 'v = v_0 + at, \\qquad s = s_0 + v_0 t + \\tfrac{1}{2}at^2, \\qquad v^2 = v_0^2 + 2a(s - s_0)',
        caption: 'Constant-acceleration equations (handbook: "Constant Acceleration") — the third one skips time entirely',
      },
      {
        kind: 'prose',
        html: `<p><b>Projectiles</b> are just two independent constant-a problems sharing a clock: horizontally <span class="tex">a_x = 0</span> so <span class="tex">x = v_0\\cos\\theta\\, t</span>; vertically <span class="tex">a_y = -g</span> so <span class="tex">y = v_0\\sin\\theta\\, t - \\tfrac12 g t^2</span>. Time links them. Apex: <span class="tex">v_y = 0</span>.</p>`,
      },
      {
        kind: 'example',
        title: 'Projectile: range and max height',
        steps: [
          { text: 'A ball is launched from level ground at v₀ = 20 m/s, 30° above horizontal. Find the maximum height and the range.' },
          { text: 'Resolve components:', tex: 'v_{0x} = 20\\cos 30^\\circ = 17.32\\ \\text{m/s}, \\quad v_{0y} = 20\\sin 30^\\circ = 10\\ \\text{m/s}' },
          { text: 'Max height (v_y = 0, time-free equation):', tex: 'h = \\dfrac{v_{0y}^2}{2g} = \\dfrac{10^2}{2(9.81)} = 5.10\\ \\text{m}' },
          { text: 'Total flight time (up and down, level ground):', tex: 't = \\dfrac{2v_{0y}}{g} = \\dfrac{2(10)}{9.81} = 2.04\\ \\text{s}' },
          { text: 'Range:', tex: 'R = v_{0x}\\,t = 17.32(2.04) = 35.3\\ \\text{m} \\quad \\left(\\text{check: } \\dfrac{v_0^2\\sin 2\\theta}{g} = \\dfrac{400(0.866)}{9.81} = 35.3\\ \\text{m} \\checkmark\\right)' },
        ],
      },
      {
        kind: 'formula',
        tex: 'W = \\Delta KE: \\quad \\sum W_{1\\to 2} = \\tfrac{1}{2}mv_2^2 - \\tfrac{1}{2}mv_1^2',
        caption: 'Work-energy principle — friction work is negative; gravity work = ±mgh; spring work = ±½kx²',
      },
      {
        kind: 'example',
        title: 'Work-energy: skidding to a stop',
        steps: [
          { text: 'A 1500 kg car traveling 25 m/s locks its brakes; μ = 0.7 between tires and pavement. Find the skid distance.' },
          { text: 'Friction force (level road, N = mg):', tex: 'F_f = \\mu m g = 0.7(1500)(9.81) = 10{,}300\\ \\text{N}' },
          { text: 'Work-energy from moving to stopped:', tex: '-F_f\\, d = 0 - \\tfrac{1}{2}mv^2 = -\\tfrac{1}{2}(1500)(25^2) = -468{,}750\\ \\text{J}' },
          { text: 'Solve for d:', tex: 'd = \\dfrac{468{,}750}{10{,}300} = 45.5\\ \\text{m}' },
          { text: 'Note the mass cancels: d = v²/(2μg) = 625/13.73 = 45.5 m — same answer, fewer keystrokes.' },
        ],
      },
      {
        kind: 'formula',
        tex: '\\mathbf{F}\\,\\Delta t = m\\,\\Delta \\mathbf{v}, \\qquad \\sum m_i v_i = \\text{const (isolated system)}',
        caption: 'Impulse-momentum and conservation of linear momentum — the collision toolkit',
      },
      {
        kind: 'callout',
        tone: 'key',
        html: `<b>Collisions:</b> momentum is conserved in <i>every</i> collision; kinetic energy only in perfectly elastic ones. Coefficient of restitution <span class="tex">e = \\dfrac{v_2' - v_1'}{v_1 - v_2}</span> (separation ÷ approach): e = 1 elastic, e = 0 perfectly plastic (objects stick and move together).`,
      },
      {
        kind: 'callout',
        tone: 'warn',
        html: `Unit trap: in USCS problems, weight W (lbf) is not mass — divide by g to get slugs: <span class="tex">m = W/g</span> with g = 32.2 ft/s². Mixing lbf and lbm is the most common dynamics error on the exam.`,
      },
    ],
    tips: [
      'No time given and none asked? Reach for v² = v₀² + 2aΔs or work-energy — skipping the time variable saves a full solve.',
      'Objects that "stick together" after impact: pure momentum conservation with a combined mass. Never conserve KE in a plastic collision.',
      'g = 9.81 m/s² or 32.2 ft/s² — commit both to memory with their unit systems and check which the answer choices imply.',
    ],
  },

  // -------------------------------------------------------------------------
  // 6. Mechanics of Materials
  // -------------------------------------------------------------------------
  {
    id: 'fe-mom-core',
    examId: 'fe-civil',
    areaId: 'fe-mom',
    title: 'Mechanics of Materials Toolkit',
    objective:
      'Deploy the five core stress/deformation formulas — axial, torsion, bending, thermal, and principal stress — and combine loads by superposition.',
    estMinutes: 20,
    blocks: [
      {
        kind: 'prose',
        html: `<p>Five formulas answer the large majority of mechanics-of-materials questions. Each pairs a <b>load type</b> with a <b>section property</b>. Know the pattern and the handbook names:</p>`,
      },
      {
        kind: 'formula',
        tex: '\\sigma = \\dfrac{P}{A}, \\qquad \\delta = \\dfrac{PL}{AE}',
        caption: 'Axial stress and axial deformation (uniaxial loading) — series bars: add the δ of each segment',
      },
      {
        kind: 'formula',
        tex: '\\tau = \\dfrac{Tc}{J}, \\qquad \\phi = \\dfrac{TL}{GJ}, \\qquad J_{solid} = \\dfrac{\\pi d^4}{32}',
        caption: 'Torsion of circular shafts — max shear at the outer surface c = d/2',
      },
      {
        kind: 'formula',
        tex: '\\sigma = \\dfrac{Mc}{I} = \\dfrac{M}{S}, \\qquad S = \\dfrac{I}{c} = \\dfrac{bh^2}{6}\\ (\\text{rectangle})',
        caption: 'Flexure formula — bending stress is zero at the neutral axis, max at the extreme fiber',
      },
      {
        kind: 'formula',
        tex: '\\delta_T = \\alpha L \\Delta T; \\qquad \\text{if restrained: } \\sigma = E\\alpha\\Delta T',
        caption: 'Thermal deformation — free expansion causes no stress; full restraint converts all of it to stress',
      },
      {
        kind: 'callout',
        tone: 'key',
        html: `<b>Superposition:</b> stresses of the same type at the same point simply add. A column with axial load + bending has <span class="tex">\\sigma = \\dfrac{P}{A} \\pm \\dfrac{Mc}{I}</span> — plus on the fiber where both effects act the same way, minus on the opposite face. This one combination is the most common "hard" MOM question on the FE.`,
      },
      {
        kind: 'example',
        title: 'Combined axial + bending on a rectangular member',
        steps: [
          { text: 'A rectangular member, b = 100 mm wide × h = 150 mm deep, carries an axial tension P = 50 kN and a bending moment M = 4 kN·m about its strong axis. Find the extreme fiber stresses.' },
          { text: 'Section properties:', tex: 'A = 100(150) = 15{,}000\\ \\text{mm}^2, \\qquad S = \\dfrac{bh^2}{6} = \\dfrac{100(150)^2}{6} = 375{,}000\\ \\text{mm}^3' },
          { text: 'Axial component (uniform over the section):', tex: '\\sigma_a = \\dfrac{P}{A} = \\dfrac{50{,}000}{15{,}000} = 3.33\\ \\text{MPa (tension)}' },
          { text: 'Bending component (± at extreme fibers):', tex: '\\sigma_b = \\dfrac{M}{S} = \\dfrac{4\\times 10^6\\ \\text{N·mm}}{375{,}000\\ \\text{mm}^3} = 10.67\\ \\text{MPa}' },
          { text: 'Superpose:', tex: '\\sigma_{max} = 3.33 + 10.67 = 14.0\\ \\text{MPa (T)}, \\qquad \\sigma_{min} = 3.33 - 10.67 = -7.33\\ \\text{MPa (C)}' },
        ],
      },
      {
        kind: 'prose',
        html: `<p><b>Principal stresses.</b> For a plane-stress element with <span class="tex">\\sigma_x, \\sigma_y, \\tau_{xy}</span>, the principal stresses are the max/min normal stresses (on planes of zero shear), and the peak in-plane shear sits 45° away:</p>`,
      },
      {
        kind: 'formula',
        tex: '\\sigma_{1,2} = \\dfrac{\\sigma_x + \\sigma_y}{2} \\pm \\sqrt{\\left(\\dfrac{\\sigma_x - \\sigma_y}{2}\\right)^2 + \\tau_{xy}^2}, \\qquad \\tau_{max} = \\sqrt{\\left(\\dfrac{\\sigma_x - \\sigma_y}{2}\\right)^2 + \\tau_{xy}^2}',
        caption: "Principal stresses and max in-plane shear — center ± radius of Mohr's circle",
      },
      {
        kind: 'animation',
        component: 'MohrsCircle',
        caption: "Interactive Mohr's circle — drag σx, σy, and τxy and watch the principal stresses (circle-axis intercepts) and τmax (circle radius) update live. Build the picture once here and you can sanity-check every principal-stress answer on the exam.",
      },
      {
        kind: 'callout',
        tone: 'warn',
        html: `Unit hygiene wins MOM problems: N with mm and MPa (N/mm²) is the cleanest SI set — note 1 kN·m = 10⁶ N·mm. In USCS, kips with inches gives ksi. Convert <i>everything</i> to one set before touching the calculator.`,
      },
    ],
    tips: [
      'Pattern-match load to formula instantly: axial → P/A, twist → Tc/J, bend → Mc/I. Then the only real work is the section property.',
      'Rectangle I = bh³/12 with h the dimension in the bending plane — orienting h wrong changes the answer by (h/b)². Sketch the axis.',
      "Mohr's circle center = (σx+σy)/2, radius = √[((σx−σy)/2)² + τxy²]. Two numbers give you σ1, σ2, and τmax without re-deriving anything.",
    ],
  },

  // -------------------------------------------------------------------------
  // 7. Materials
  // -------------------------------------------------------------------------
  {
    id: 'fe-materials-core',
    examId: 'fe-civil',
    areaId: 'fe-materials',
    title: 'Civil Materials in 20 Minutes',
    objective:
      "Recall the exam-critical facts for concrete, steel, aggregates, asphalt, and wood — w/c ratio, slump, f'c, the stress-strain curve, gradation, and PG binder grades.",
    estMinutes: 18,
    blocks: [
      {
        kind: 'prose',
        html: `<p><b>Concrete.</b> Strength is governed by the <b>water-cement (w/c) ratio</b> — lower w/c means higher strength and lower workability (Abrams' law). Typical structural w/c is 0.40–0.55. Fresh-concrete workability is measured by the <b>slump test</b> (a taller slump = wetter, more workable mix). Design strength <span class="tex">f'_c</span> is the 28-day compressive strength of standard cylinders, commonly 3,000–6,000 psi (20–40 MPa). Concrete is strong in compression but weak in tension — tensile strength is only about 10% of <span class="tex">f'_c</span>, which is why we reinforce it.</p>`,
      },
      {
        kind: 'formula',
        tex: "E_c = 57{,}000\\sqrt{f'_c}\\ \\text{(psi)} \\qquad\\qquad E_c = 4{,}700\\sqrt{f'_c}\\ \\text{(MPa)}",
        caption: "Concrete modulus of elasticity from f'c (ACI, normal-weight concrete) — both forms are in the handbook",
      },
      {
        kind: 'callout',
        tone: 'key',
        html: `<b>Curing:</b> concrete gains strength by <i>hydration</i>, a chemical reaction that needs water and moderate temperature — it does not "dry" to strength. Moist curing longer → stronger. Cold weather slows hydration; admixtures (air entrainment for freeze-thaw durability, retarders, accelerators, plasticizers for workability without extra water) are frequent one-liner questions.`,
      },
      {
        kind: 'prose',
        html: `<p><b>Steel.</b> The stress-strain curve is the most-tested figure in materials: a linear <b>elastic</b> region with slope <span class="tex">E</span> up to the <b>proportional limit</b>, then <b>yield</b> (<span class="tex">F_y</span> = 36 ksi for A36, 50 ksi for A992), a plastic plateau, <b>strain hardening</b> up to the <b>ultimate strength</b> <span class="tex">F_u</span>, then necking and fracture. <span class="tex">E \\approx 29{,}000\\ \\text{ksi} = 200\\ \\text{GPa}</span> for <i>all</i> structural steels — alloying changes strength, not stiffness. Ductility = large strain between yield and fracture; toughness = area under the whole curve; resilience = area under the elastic part.</p>`,
      },
      {
        kind: 'example',
        title: 'Modulus of elasticity from a tension test',
        steps: [
          { text: 'A steel bar, L = 2 m long with cross-section A = 500 mm², is pulled with P = 50 kN and elongates 1.0 mm (still elastic). Find E.' },
          { text: 'Stress:', tex: '\\sigma = \\dfrac{P}{A} = \\dfrac{50{,}000\\ \\text{N}}{500\\ \\text{mm}^2} = 100\\ \\text{MPa}' },
          { text: 'Strain (dimensionless — keep both lengths in mm):', tex: '\\varepsilon = \\dfrac{\\delta}{L} = \\dfrac{1.0}{2{,}000} = 0.0005' },
          { text: "Hooke's law:", tex: 'E = \\dfrac{\\sigma}{\\varepsilon} = \\dfrac{100}{0.0005} = 200{,}000\\ \\text{MPa} = 200\\ \\text{GPa} \\;\\checkmark\\ \\text{(steel)}' },
        ],
      },
      {
        kind: 'prose',
        html: `<p><b>Aggregates.</b> Gradation (the particle-size distribution from a sieve analysis) controls packing and paste demand. <b>Well-graded</b> = wide range of sizes, dense packing, less cement paste needed. <b>Uniformly (poorly) graded</b> = one size dominates. <b>Gap-graded</b> = missing intermediate sizes. The <b>fineness modulus</b> (sum of cumulative percent retained on standard sieves ÷ 100, typically 2.3–3.1 for fine aggregate) indexes coarseness. Aggregates occupy 60–75% of concrete volume, so their quality and moisture state (absorbed vs free water corrects the mix w/c) matter enormously.</p>`,
      },
      {
        kind: 'prose',
        html: `<p><b>Asphalt.</b> Superpave <b>performance grade</b> binders read PG <i>high</i>-<i>low</i>: <b>PG 64-22</b> performs from an average 7-day max pavement temperature of 64°C down to −22°C. Hot climates push the first number up (rutting resistance); cold climates push the second down (thermal-cracking resistance). Asphalt concrete is <b>viscoelastic</b> — stiff and brittle when cold, soft when hot — and mix design balances asphalt content against air voids (~4% design).</p>`,
      },
      {
        kind: 'prose',
        html: `<p><b>Wood.</b> Wood is <b>orthotropic</b>: much stronger and stiffer parallel to the grain than perpendicular. Design values (<span class="tex">F_b, F_v, E</span>) come from species/grade tables and are multiplied by adjustment factors — moisture (strength drops above ~19% moisture content; "dry" service), load duration (short-duration loads allow higher stress), size, and temperature. Defects (knots, checks, splits) set the grade.</p>`,
      },
      {
        kind: 'table',
        caption: 'Material property cheat sheet — the comparison values the FE expects you to know',
        headers: ['Material', 'E (typical)', 'Strength benchmark', 'Behavior / FE fact'],
        rows: [
          ['Structural steel', '29,000 ksi (200 GPa)', 'Fy = 36–50 ksi; Fu = 58–65 ksi', 'Ductile, linear to yield; E same for all grades'],
          ["Concrete (f'c = 4 ksi)", "~3,600 ksi (25 GPa); Ec = 57,000√f'c psi", "f'c = 3–6 ksi compression; tension ≈ 10% of f'c", 'Brittle in tension; strength ∝ 1/(w/c); 28-day cylinders'],
          ['Aluminum', '10,000 ksi (70 GPa)', 'Yield varies by alloy (e.g., ~35 ksi for 6061-T6)', 'One-third the stiffness of steel; no fatigue endurance limit'],
          ['Wood (parallel to grain)', '1,000–1,900 ksi (7–13 GPa)', 'Fb ≈ 1–2 ksi (allowable, adjusted)', 'Orthotropic; strength drops with moisture > 19%'],
          ['Asphalt concrete', 'Temperature-dependent (viscoelastic)', 'Graded by PG high-low temp (e.g., PG 64-22)', 'Rutting when hot, cracking when cold; ~4% design air voids'],
        ],
      },
      {
        kind: 'callout',
        tone: 'tip',
        html: `Ratios are faster than absolutes: steel is ~3× stiffer than aluminum and ~8× stiffer than 4-ksi concrete. The modular ratio <span class="tex">n = E_s/E_c \\approx 8</span> shows up again in reinforced-concrete transformed sections — one memorized number, two exam topics.`,
      },
    ],
    tips: [
      "Lower w/c → higher strength, lower workability. If a question pairs strength with slump, remember they usually move in opposite directions for a fixed mix.",
      'PG 64-22: first number = high pavement temperature (°C), second = low. Hotter climate raises the first; colder climate lowers the second.',
      'E for steel is 29,000 ksi / 200 GPa regardless of grade — any answer implying high-strength steel is stiffer is a trap.',
    ],
  },
];
