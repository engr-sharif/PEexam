import { useMemo, useState } from 'react';
import { REFERENCE } from '../data/reference';
import { EXAMS, EXAM_BY_ID } from '../data/exams';
import { Blocks } from '../components/Blocks';
import { Card, Pill } from '../components/ui';
import type { ExamId } from '../types';

const toneFor = (id: string) =>
  id === 'pe-geotech' ? 'amber' : id === 'pe-wre' ? 'sky' : id === 'ca-seismic' ? 'rose' : 'emerald';

export function Reference() {
  const [exam, setExam] = useState<ExamId | ''>('');
  const [query, setQuery] = useState('');

  const entries = useMemo(() => {
    const q = query.trim().toLowerCase();
    return REFERENCE.filter((e) => {
      if (exam && !e.exams.includes(exam)) return false;
      if (!q) return true;
      return (
        e.title.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q) ||
        e.keywords.some((k) => k.includes(q))
      );
    });
  }, [exam, query]);

  // group by category
  const byCategory = useMemo(() => {
    const m: Record<string, typeof REFERENCE> = {};
    for (const e of entries) (m[e.category] ??= []).push(e);
    return m;
  }, [entries]);

  return (
    <div className="space-y-5">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Reference Handbook</h1>
          <p className="text-sm text-slate-400">
            The equations, factors, and tables you’ll have on exam day — search and drill them so you can find them fast.
          </p>
        </div>
        <button
          onClick={() => window.print()}
          className="no-print flex-shrink-0 rounded-lg border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-200 hover:border-slate-500"
        >
          🖨 Print cheat sheet
        </button>
      </header>

      {/* search + filter */}
      <div className="no-print sticky top-0 z-10 -mx-4 space-y-3 bg-slate-950/95 px-4 py-3 backdrop-blur">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search formulas… (e.g. bearing, base shear, curve, liquefaction)"
          className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-brand-500"
        />
        <div className="flex flex-wrap gap-2">
          <FilterBtn active={exam === ''} onClick={() => setExam('')}>All exams</FilterBtn>
          {EXAMS.map((e) => (
            <FilterBtn key={e.id} active={exam === e.id} onClick={() => setExam(e.id)}>
              {e.shortName}
            </FilterBtn>
          ))}
        </div>
      </div>

      {entries.length === 0 && (
        <Card><p className="text-sm text-slate-400">No reference entries match “{query}”.</p></Card>
      )}

      {Object.entries(byCategory).map(([cat, list]) => (
        <section key={cat}>
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-400">{cat}</h2>
          <div className="space-y-3">
            {list.map((e) => (
              <Card key={e.id}>
                <div className="mb-2 flex items-center gap-2">
                  <h3 className="font-semibold text-slate-100">{e.title}</h3>
                  {e.exams.map((x) => (
                    <Pill key={x} tone={toneFor(x)}>{EXAM_BY_ID[x].shortName}</Pill>
                  ))}
                </div>
                <Blocks blocks={e.blocks} />
              </Card>
            ))}
          </div>
        </section>
      ))}

      {/* codes per exam */}
      <section>
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-400">Allowed codes & standards</h2>
        <div className="grid gap-3 md:grid-cols-3">
          {EXAMS.filter((e) => !exam || e.id === exam).map((e) => (
            <Card key={e.id}>
              <Pill tone={toneFor(e.id)}>{e.shortName}</Pill>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-slate-300">
                {e.references.map((r) => <li key={r}>{r}</li>)}
              </ul>
            </Card>
          ))}
        </div>
      </section>

      <p className="text-xs text-slate-500">
        This is an original study compilation — not the copyrighted NCEES handbook (get that free from your MyNCEES
        account). Always confirm current test plans and code editions at{' '}
        <a className="text-brand-400 hover:underline" href="https://ncees.org/exams/pe-exam/civil/" target="_blank" rel="noreferrer">ncees.org</a>{' '}and{' '}
        <a className="text-brand-400 hover:underline" href="https://www.bpelsg.ca.gov/applicants/candidate_info.shtml" target="_blank" rel="noreferrer">bpelsg.ca.gov</a>.
      </p>
    </div>
  );
}

function FilterBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
        active ? 'border-brand-500 bg-brand-600/20 text-brand-200' : 'border-slate-700 text-slate-300 hover:border-slate-500'
      }`}
    >
      {children}
    </button>
  );
}
