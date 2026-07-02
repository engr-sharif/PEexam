import { useEffect, useMemo, useState } from 'react';
import { SOLVERS, SOLVER_CATEGORIES, type Solver } from '../data/solvers';
import { runWorksheet, fmt } from '../lib/mathEngine';
import { Tex } from '../components/Tex';
import { Card, Pill } from '../components/ui';

const WORKSHEET_KEY = 'ca-pe-prep-worksheet';
const DEFAULT_SHEET = `# MathLab worksheet — type an expression per line.
# Assign variables with =, use them below. Trig is in DEGREES.
# Built-ins: sin cos tan asin acos atan sqrt log ln exp abs min max pi gwSI(=9.81) gw(=62.4)
gamma = 18
H = 5
phi = 32
Ka = tan(45 - phi/2)^2
Pa = 0.5 * Ka * gamma * H^2`;

export function MathLab() {
  const [tab, setTab] = useState<'solvers' | 'worksheet'>('solvers');

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-bold">MathLab</h1>
        <p className="text-sm text-slate-400">
          Your built-in calculation workspace — guided solvers that show every step, plus a free-form worksheet.
        </p>
      </header>

      <div className="flex gap-2">
        <TabBtn active={tab === 'solvers'} onClick={() => setTab('solvers')}>🧭 Guided solvers</TabBtn>
        <TabBtn active={tab === 'worksheet'} onClick={() => setTab('worksheet')}>📓 Worksheet</TabBtn>
      </div>

      {tab === 'solvers' ? <SolverSuite /> : <Worksheet />}
    </div>
  );
}

// ------------------------------- Solvers ----------------------------------

function SolverSuite() {
  const [cat, setCat] = useState<string>('Geotechnical');
  const [openId, setOpenId] = useState<string>(SOLVERS.find((s) => s.category === 'Geotechnical')!.id);
  const list = SOLVERS.filter((s) => s.category === cat);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {SOLVER_CATEGORIES.map((c) => (
          <TabBtn key={c} active={cat === c} onClick={() => { setCat(c); setOpenId(SOLVERS.find((s) => s.category === c)!.id); }}>
            {c}
          </TabBtn>
        ))}
      </div>
      {list.map((s) => (
        <SolverCard key={s.id} solver={s} open={openId === s.id} onToggle={() => setOpenId(openId === s.id ? '' : s.id)} />
      ))}
    </div>
  );
}

function SolverCard({ solver, open, onToggle }: { solver: Solver; open: boolean; onToggle: () => void }) {
  const [values, setValues] = useState<Record<string, number>>(() =>
    Object.fromEntries(solver.inputs.map((i) => [i.key, i.default])),
  );
  const steps = useMemo(() => {
    try {
      return solver.compute(values);
    } catch {
      return [{ label: 'Check inputs — computation failed.' }];
    }
  }, [solver, values]);

  return (
    <Card>
      <button onClick={onToggle} className="flex w-full items-center justify-between text-left">
        <div>
          <div className="font-semibold text-slate-100">{solver.title}</div>
          <div className="mt-0.5 text-xs text-slate-400">{solver.description}</div>
        </div>
        <span className="ml-3 text-slate-500">{open ? '▾' : '▸'}</span>
      </button>

      {open && (
        <div className="mt-4 grid gap-5 lg:grid-cols-2">
          <div className="space-y-3">
            {solver.inputs.map((inp) => (
              <label key={inp.key} className="block text-xs text-slate-300">
                <span className="flex justify-between">
                  <span className="font-medium">{inp.label}{inp.unit ? ` (${inp.unit})` : ''}</span>
                  <input
                    type="number"
                    value={values[inp.key]}
                    step={inp.step ?? 1}
                    onChange={(e) => setValues((v) => ({ ...v, [inp.key]: Number(e.target.value) }))}
                    className="w-24 rounded border border-slate-700 bg-slate-950 px-2 py-0.5 text-right text-xs text-slate-100"
                  />
                </span>
                <input
                  type="range"
                  min={inp.min ?? 0}
                  max={inp.max ?? inp.default * 3}
                  step={inp.step ?? 1}
                  value={values[inp.key]}
                  onChange={(e) => setValues((v) => ({ ...v, [inp.key]: Number(e.target.value) }))}
                  className="mt-1 w-full accent-brand-500"
                />
              </label>
            ))}
          </div>

          <div className="space-y-2.5">
            {steps.map((st, i) => (
              <div key={i} className="rounded-lg border border-slate-800 bg-slate-950/50 px-3 py-2">
                <div className="text-xs font-medium text-slate-400">{i + 1}. {st.label}</div>
                {st.tex && <div className="mt-1 overflow-x-auto"><Tex tex={st.tex} block /></div>}
                {st.value && <div className="mt-1 text-sm font-bold text-emerald-300">{st.value}</div>}
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}

// ------------------------------ Worksheet ---------------------------------

function Worksheet() {
  const [text, setText] = useState(() => localStorage.getItem(WORKSHEET_KEY) ?? DEFAULT_SHEET);
  useEffect(() => {
    localStorage.setItem(WORKSHEET_KEY, text);
  }, [text]);

  const lines = useMemo(() => runWorksheet(text.split('\n')), [text]);

  return (
    <Card>
      <div className="mb-2 flex items-center justify-between">
        <div className="text-sm font-semibold text-slate-200">Worksheet <Pill>auto-saved</Pill></div>
        <button onClick={() => setText(DEFAULT_SHEET)} className="text-xs text-slate-400 hover:text-slate-200">reset example</button>
      </div>
      <div className="grid gap-3 lg:grid-cols-2">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          spellCheck={false}
          rows={Math.max(12, text.split('\n').length + 2)}
          className="w-full resize-y rounded-lg border border-slate-700 bg-slate-950 p-3 font-mono text-sm text-slate-100 outline-none focus:border-brand-500"
        />
        <div className="space-y-1 overflow-x-auto rounded-lg border border-slate-800 bg-slate-950/60 p-3 font-mono text-sm">
          {lines.map((l, i) => (
            <div key={i} className="flex min-h-[1.5rem] items-baseline justify-between gap-3">
              <span className="truncate text-slate-500">{l.input || ' '}</span>
              {l.error ? (
                <span className="flex-shrink-0 text-xs text-rose-400">{l.error}</span>
              ) : l.value !== undefined ? (
                <span className="flex-shrink-0 font-semibold text-emerald-300">
                  {l.name ? `${l.name} = ` : '= '}{fmt(l.value)}
                </span>
              ) : null}
            </div>
          ))}
        </div>
      </div>
      <p className="mt-3 text-xs text-slate-500">
        Tip: work an exam problem here exactly like scratch paper — assign the givens, then build up the answer. Trig functions use degrees, matching how exam values are given.
      </p>
    </Card>
  );
}

function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
        active ? 'border-brand-500 bg-brand-600/20 text-brand-200' : 'border-slate-700 text-slate-300 hover:border-slate-500'
      }`}
    >
      {children}
    </button>
  );
}
