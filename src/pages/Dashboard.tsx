import { Link } from 'react-router-dom';
import { useProgress } from '../store/progress';
import { computeReadiness, recommend, learningInsights, coachMessage } from '../lib/analytics';
import { simulateExam } from '../lib/simulator';
import { Card, ProgressBar, Stat, Pill } from '../components/ui';
import { StudyTimer } from '../components/StudyTimer';
import { EXAM_BY_ID } from '../data/exams';

function daysUntil(dateStr?: string): number | null {
  if (!dateStr) return null;
  const d = new Date(dateStr + 'T00:00:00');
  if (isNaN(d.getTime())) return null;
  return Math.ceil((d.getTime() - Date.now()) / 86400000);
}

const toneFor = (id: string) =>
  id === 'pe-geotech' ? 'amber' : id === 'ca-seismic' ? 'rose' : 'emerald';

export function Dashboard() {
  const { attempts, lessons, cards, settings, streak, mocks } = useProgress();
  const readiness = computeReadiness(attempts, lessons);
  const recs = recommend(attempts, lessons, cards, settings.primaryExam);
  const insights = learningInsights(attempts, lessons);
  const coach = coachMessage(attempts, lessons, cards, settings.primaryExam);
  const sim = attempts.length >= 10 ? simulateExam(settings.primaryExam, attempts) : null;

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

      {/* First-run diagnostic */}
      {totalAttempts === 0 && (
        <Link
          to="/diagnostic"
          className="block rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4 transition hover:border-emerald-400"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-bold text-emerald-200">🧭 New here? Take the 12-question placement diagnostic</div>
              <div className="mt-0.5 text-xs text-emerald-100/70">
                ~15 minutes. It sets your baseline per exam so recommendations target the right areas from day one.
              </div>
            </div>
            <span className="ml-3 text-emerald-300">→</span>
          </div>
        </Link>
      )}

      {/* Tutor coach */}
      <div className="flex items-start gap-3 rounded-xl border border-brand-600/30 bg-brand-600/10 p-4">
        <span className="text-2xl">👨‍🏫</span>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-brand-300">Your tutor</div>
          <p className="mt-0.5 text-sm text-slate-200">{coach}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Day streak" value={`🔥 ${streak.current}`} sub={`best: ${streak.longest}`} />
        <Stat label="Questions done" value={totalAttempts} sub={`${overallAcc}% correct`} />
        <Stat label="Mock exams" value={mocks.length} sub="timed simulations" />
        <Stat label="Daily goal" value={`${settings.dailyGoalMinutes}m`} sub="study target" />
      </div>

      {/* Today's session + pass probability */}
      <div className="grid gap-3 sm:grid-cols-2">
        <Link
          to="/today"
          className="flex items-center justify-between rounded-xl border border-brand-500/50 bg-gradient-to-r from-brand-600/20 to-brand-600/5 p-4 transition hover:border-brand-400"
        >
          <div>
            <div className="text-sm font-bold text-brand-200">▶ Start Today's Session</div>
            <div className="mt-0.5 text-xs text-slate-400">
              Due cards + your misses + weak areas, interleaved — sized to {settings.dailyGoalMinutes} min.
            </div>
          </div>
          <span className="text-2xl text-brand-300">→</span>
        </Link>

        <Card>
          <div className="text-xs uppercase tracking-wide text-slate-400">
            Pass probability — {EXAM_BY_ID[settings.primaryExam]?.shortName}
          </div>
          {sim ? (
            <>
              <div className="mt-1 flex items-baseline gap-3">
                <span
                  className={`text-3xl font-bold ${
                    sim.passProb >= 0.75 ? 'text-emerald-300' : sim.passProb >= 0.5 ? 'text-amber-300' : 'text-rose-300'
                  }`}
                >
                  {Math.round(sim.passProb * 100)}%
                </span>
                <span className="text-xs text-slate-500">
                  score {Math.round(sim.p10 * 100)}–{Math.round(sim.p90 * 100)}% (10th–90th pct)
                </span>
              </div>
              <div className="mt-1.5 text-xs text-slate-400">
                Biggest lever: <b className="text-slate-200">{sim.leverage[0]?.name}</b>
                {sim.leverage[0] && sim.leverage[0].gain > 0.005
                  ? ` (+${Math.round(sim.leverage[0].gain * 100)}% if improved)`
                  : ''}
              </div>
            </>
          ) : (
            <p className="mt-2 text-sm text-slate-400">
              Answer 10+ questions and I'll run 3,000 simulated exams to estimate your pass probability.
            </p>
          )}
        </Card>
      </div>

      {/* Tools: timer + exam countdown */}
      <div className="grid gap-3 sm:grid-cols-2">
        <StudyTimer />
        <Card>
          <div className="text-xs uppercase tracking-wide text-slate-400">Exam countdown</div>
          {(() => {
            const dated = readiness
              .map((r) => ({ r, d: daysUntil(settings.examDates[r.examId]) }))
              .filter((x) => x.d !== null) as { r: (typeof readiness)[number]; d: number }[];
            if (dated.length === 0)
              return (
                <p className="mt-2 text-sm text-slate-400">
                  Set your exam dates in <Link to="/settings" className="text-brand-400 hover:underline">Settings</Link> to see a countdown and pacing.
                </p>
              );
            return (
              <div className="mt-2 space-y-2">
                {dated
                  .sort((a, b) => a.d - b.d)
                  .map(({ r, d }) => (
                    <div key={r.examId} className="flex items-center justify-between text-sm">
                      <span className="text-slate-300">{EXAM_BY_ID[r.examId].shortName}</span>
                      <span className={`font-bold ${d <= 14 ? 'text-rose-300' : d <= 45 ? 'text-amber-300' : 'text-slate-200'}`}>
                        {d > 0 ? `${d} days` : d === 0 ? 'Today!' : 'Past'}
                      </span>
                    </div>
                  ))}
              </div>
            );
          })()}
        </Card>
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
