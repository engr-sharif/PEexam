import { Link } from 'react-router-dom';
import { EXAMS } from '../data/exams';
import { QUESTIONS } from '../data/questions';
import { useProgress } from '../store/progress';
import { Card, Pill } from '../components/ui';

const toneFor = (id: string) =>
  id === 'fe-civil' ? 'violet' : id === 'pe-geotech' ? 'amber' : id === 'pe-wre' ? 'sky' : id === 'ca-seismic' ? 'rose' : 'emerald';

export function MockList() {
  const mocks = useProgress((s) => s.mocks);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Mock Exams</h1>
        <p className="text-sm text-slate-400">
          Full timed simulations that mirror each real exam’s format, area weighting, and pacing.
          A countdown timer, question navigator, flag-for-review, and on-screen calculator replicate the CBT experience.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {EXAMS.map((e) => {
          const bank = QUESTIONS.filter((q) => q.examId === e.id).length;
          const perQ = Math.round(e.examMinutes / e.questionCount);
          return (
            <Card key={e.id}>
              <Pill tone={toneFor(e.id)}>{e.authority}</Pill>
              <h2 className="mt-2 text-lg font-bold">{e.shortName}</h2>
              <ul className="mt-2 space-y-1 text-sm text-slate-400">
                <li>{e.questionCount} questions · {Math.round((e.examMinutes / 60) * 10) / 10} h</li>
                <li>≈ {perQ} min per question budget</li>
                <li className="text-slate-500">{bank} questions currently in bank</li>
              </ul>

              <div className="mt-4 flex flex-col gap-2">
                <Link
                  to={`/mock/${e.id}?count=10`}
                  className="rounded-lg bg-brand-600 px-4 py-2 text-center text-sm font-semibold text-white"
                >
                  Quick mock — 10 Q
                </Link>
                <Link
                  to={`/mock/${e.id}`}
                  className="rounded-lg border border-slate-700 px-4 py-2 text-center text-sm font-semibold text-slate-200 hover:border-slate-500"
                >
                  Full blueprint ({Math.min(bank, e.questionCount)} Q)
                </Link>
                <Link
                  to={`/mock/${e.id}?count=10&time=900`}
                  className="rounded-lg border border-amber-600/40 px-4 py-2 text-center text-sm font-semibold text-amber-300 hover:border-amber-500"
                >
                  ⚡ Speed drill — 10 Q / 15 min
                </Link>
              </div>
            </Card>
          );
        })}
      </div>

      {mocks.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">Recent results</h2>
          <div className="space-y-2">
            {[...mocks].reverse().slice(0, 8).map((m) => (
              <div key={m.id} className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/60 px-4 py-2.5 text-sm">
                <div>
                  <Pill tone={toneFor(m.examId)}>{EXAMS.find((e) => e.id === m.examId)?.shortName}</Pill>
                  <span className="ml-2 text-slate-400">{new Date(m.at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-slate-400">{Math.round(m.durationMs / 60000)} min</span>
                  <span className={`font-bold ${m.score >= 0.7 ? 'text-emerald-400' : m.score >= 0.55 ? 'text-amber-400' : 'text-rose-400'}`}>
                    {Math.round(m.score * 100)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
