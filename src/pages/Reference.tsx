import { useState } from 'react';
import { EXAMS } from '../data/exams';
import { FLASHCARDS } from '../data/flashcards';
import { areaById } from '../data/exams';
import { RichText } from '../components/Tex';
import { Card, Pill } from '../components/ui';

const toneFor = (id: string) =>
  id === 'pe-geotech' ? 'amber' : id === 'ca-seismic' ? 'rose' : 'emerald';

export function Reference() {
  const [exam, setExam] = useState('pe-geotech');
  const formulas = FLASHCARDS.filter((c) => c.examId === exam);
  const current = EXAMS.find((e) => e.id === exam)!;

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-bold">Reference</h1>
        <p className="text-sm text-slate-400">
          Quick formula sheet and the official codes/standards you’re allowed on each exam.
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        {EXAMS.map((e) => (
          <button
            key={e.id}
            onClick={() => setExam(e.id)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
              exam === e.id ? 'border-brand-500 bg-brand-600/20 text-brand-200' : 'border-slate-700 text-slate-300 hover:border-slate-500'
            }`}
          >
            {e.shortName}
          </button>
        ))}
      </div>

      <Card>
        <h2 className="mb-3 text-sm font-semibold text-slate-200">Formula sheet</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {formulas.map((f) => (
            <div key={f.id} className="rounded-lg border border-slate-800 bg-slate-950/40 p-3">
              <div className="text-xs text-slate-400">{f.front}</div>
              <div className="mt-1"><RichText html={f.back} /></div>
              <div className="mt-1 text-[10px] text-slate-600">{areaById(f.areaId)?.name}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div className="mb-2 flex items-center gap-2">
          <Pill tone={toneFor(exam)}>{current.authority}</Pill>
          <h2 className="text-sm font-semibold text-slate-200">Allowed references & codes</h2>
        </div>
        <ul className="list-disc space-y-1 pl-5 text-sm text-slate-300">
          {current.references.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-slate-500">{current.passNote}</p>
      </Card>

      <Card>
        <h2 className="mb-2 text-sm font-semibold text-slate-200">Unit cheat-sheet</h2>
        <ul className="grid gap-1 text-sm text-slate-300 sm:grid-cols-2">
          <li>γ<sub>w</sub> = 62.4 pcf = 9.81 kN/m³</li>
          <li>1 ksf = 47.88 kPa</li>
          <li>1 ft = 0.3048 m · 1 m = 3.281 ft</li>
          <li>1 yd³ = 27 ft³</li>
          <li>1 acre = 43,560 ft²</li>
          <li>g = 32.2 ft/s² = 9.81 m/s²</li>
          <li>1 kip = 1000 lb = 4.448 kN</li>
          <li>1 atm ≈ 2116 psf ≈ 101.3 kPa</li>
        </ul>
      </Card>

      <p className="text-xs text-slate-500">
        ⚠ Always confirm the current test plan and approved code editions on the official sites
        (<a className="text-brand-400 hover:underline" href="https://ncees.org/exams/pe-exam/civil/" target="_blank" rel="noreferrer">ncees.org</a> and{' '}
        <a className="text-brand-400 hover:underline" href="https://www.bpelsg.ca.gov/applicants/candidate_info.shtml" target="_blank" rel="noreferrer">bpelsg.ca.gov</a>) before your exam date.
      </p>
    </div>
  );
}
