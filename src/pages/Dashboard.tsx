import { Link } from 'react-router-dom';
import { useProgress } from '../store/progress';
import { computeReadiness, recommend, learningInsights } from '../lib/analytics';
import { Card, ProgressBar, Stat, Pill } from '../components/ui';
import { EXAM_BY_ID } from '../data/exams';

const toneFor = (id: string) =>
  id === 'pe-geotech' ? 'amber' : id === 'ca-seismic' ? 'rose' : 'emerald';

export function Dashboard() {
  const { attempts, lessons, cards, settings, streak, mocks } = useProgress();
  const readiness = computeReadiness(attempts, lessons);
  const recs = recommend(attempts, lessons, cards, settings.primaryExam);
  const insights = learningInsights(attempts, lessons);

  const totalAttempts = attempts.length;
  const overallAcc =
    totalAttempts > 0
      ? Math.round((attempts.filter((a) => a.correct).length / totalAttempts) * 100)
      : 0;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Welcome back 👋</h1>
        <p className="text-sm text-slate-400">
          Your personalized path to California PE Civil licensure — Geotechnical depth, Seismic, and Surveying.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Day streak" value={`🔥 ${streak.current}`} sub={`best: ${streak.longest}`} />
        <Stat label="Questions done" value={totalAttempts} sub={`${overallAcc}% correct`} />
        <Stat label="Mock exams" value={mocks.length} sub="timed simulations" />
        <Stat label="Daily goal" value={`${settings.dailyGoalMinutes}m`} sub="study target" />
      </div>

      {/* Exam readiness */}
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">Exam readiness</h2>
        <div className="grid gap-3 md:grid-cols-3">
          {readiness.map((r) => (
            <Card key={r.examId}>
              <div className="flex items-center justify-between">
                <Pill tone={toneFor(r.examId)}>{EXAM_BY_ID[r.examId].shortName}</Pill>
                <span className="text-2xl font-bold">{r.score}%</span>
              </div>
              <div className="mt-3">
                <ProgressBar value={r.score} tone={toneFor(r.examId)} />
              </div>
              <div className="mt-3 text-xs text-slate-400">
                {r.attempts === 0 ? (
                  'No practice yet — start a lesson or quiz.'
                ) : (
                  <>Weakest: {r.weakAreas[0]?.name}</>
                )}
              </div>
              <Link
                to={`/study/${r.examId}`}
                className="mt-3 inline-block text-xs font-semibold text-brand-400 hover:underline"
              >
                Study plan →
              </Link>
            </Card>
          ))}
        </div>
      </section>

      {/* Recommendations */}
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
          Recommended for you
        </h2>
        <div className="space-y-2">
          {recs.length === 0 && (
            <Card>
              <p className="text-sm text-slate-400">
                Start with a lesson in the Study section, then come back — I’ll tailor this list to your weak spots.
              </p>
            </Card>
          )}
          {recs.map((r, i) => (
            <Link
              key={i}
              to={r.to}
              className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 p-4 transition hover:border-brand-600/60"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Pill tone={toneFor(r.examId)}>{EXAM_BY_ID[r.examId]?.shortName}</Pill>
                  <span className="truncate text-sm font-semibold text-slate-100">{r.title}</span>
                </div>
                <div className="mt-1 text-xs text-slate-400">{r.reason}</div>
              </div>
              <span className="ml-3 text-brand-400">→</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Learning insights */}
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
          How you learn
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {insights.map((ins, i) => (
            <Card key={i}>
              <div className="text-xs uppercase tracking-wide text-slate-500">{ins.label}</div>
              <div className="mt-1 text-xl font-bold text-brand-300">{ins.value}</div>
              <div className="mt-1 text-xs text-slate-400">{ins.detail}</div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
