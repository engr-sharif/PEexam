import { useProgress } from '../store/progress';
import { computeAreaMastery, computeReadiness, learningInsights } from '../lib/analytics';
import { EXAMS, EXAM_BY_ID } from '../data/exams';
import { FLASHCARDS } from '../data/flashcards';
import { retrievability } from '../lib/fsrs';
import { Card, Pill, ProgressBar, Stat } from '../components/ui';

const ERROR_LABELS: Record<string, string> = {
  concept: '🧠 Concept gaps',
  arithmetic: '🔢 Arithmetic slips',
  misread: '👁 Misreads',
  time: '⏱ Time pressure',
};

const toneFor = (id: string) =>
  id === 'pe-geotech' ? 'amber' : id === 'ca-seismic' ? 'rose' : 'emerald';

export function ProgressPage() {
  const { attempts, lessons, mocks, minutesByDay, streak, cards, settings } = useProgress();

  // ---- Forgetting projection: mean FSRS retrievability of each area's
  // flashcards, projected to your exam date (or 30 days out if unset). ----
  const primary = settings.primaryExam;
  const examDateStr = settings.examDates[primary];
  const horizon = examDateStr
    ? new Date(examDateStr + 'T08:00:00').getTime()
    : Date.now() + 30 * 86400000;
  const horizonLabel = examDateStr ? 'on your exam date' : 'in 30 days';
  const retentionByArea = (EXAM_BY_ID[primary]?.areas ?? [])
    .map((a) => {
      const areaCards = FLASHCARDS.filter((c) => c.areaId === a.id && cards[c.id]);
      if (areaCards.length === 0) return { name: a.name, r: null as number | null };
      const mean =
        areaCards.reduce((s, c) => s + retrievability(cards[c.id], Math.max(horizon, Date.now())), 0) /
        areaCards.length;
      return { name: a.name, r: mean };
    })
    .filter((x) => x.r !== null) as { name: string; r: number }[];

  // ---- Error taxonomy: why you miss ----
  const tagged = attempts.filter((a) => !a.correct && a.errorType);
  const errCounts: Record<string, number> = {};
  for (const a of tagged) errCounts[a.errorType!] = (errCounts[a.errorType!] ?? 0) + 1;
  const errRanked = Object.entries(errCounts).sort((a, b) => b[1] - a[1]);
  const readiness = computeReadiness(attempts, lessons);
  const insights = learningInsights(attempts, lessons);

  // last 14 days study minutes sparkline
  const days: { day: string; mins: number }[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10);
    days.push({ day: d, mins: minutesByDay[d] ?? 0 });
  }
  const maxMins = Math.max(30, ...days.map((d) => d.mins));

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Progress</h1>
        <p className="text-sm text-slate-400">Track readiness and watch your weak areas turn green.</p>
      </header>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Total questions" value={attempts.length} sub={`${attempts.filter((a) => a.correct).length} correct`} />
        <Stat label="Mock exams" value={mocks.length} />
        <Stat label="Current streak" value={`🔥 ${streak.current}`} sub={`best ${streak.longest}`} />
        <Stat label="Avg mock" value={mocks.length ? `${Math.round((mocks.reduce((s, m) => s + m.score, 0) / mocks.length) * 100)}%` : '—'} />
      </div>

      {/* activity */}
      <Card>
        <h2 className="mb-3 text-sm font-semibold text-slate-200">Study activity (14 days)</h2>
        <div className="flex h-24 items-end gap-1">
          {days.map((d) => (
            <div key={d.day} className="flex flex-1 flex-col items-center justify-end">
              <div
                className="w-full rounded-t bg-brand-500/70"
                style={{ height: `${(d.mins / maxMins) * 100}%`, minHeight: d.mins > 0 ? 4 : 0 }}
                title={`${d.day}: ${d.mins} min`}
              />
            </div>
          ))}
        </div>
        <div className="mt-1 flex justify-between text-[10px] text-slate-500">
          <span>{days[0].day.slice(5)}</span>
          <span>today</span>
        </div>
      </Card>

      {/* forgetting projection */}
      {retentionByArea.length > 0 && (
        <Card>
          <h2 className="mb-1 text-sm font-semibold text-slate-200">
            Projected retention {horizonLabel} — {EXAM_BY_ID[primary]?.shortName}
          </h2>
          <p className="mb-3 text-xs text-slate-500">
            FSRS forgetting-curve projection from your review history. Red areas will decay below passing recall unless reviewed.
          </p>
          <div className="space-y-2">
            {retentionByArea.map((x) => (
              <div key={x.name} className="flex items-center gap-3 text-sm">
                <span className="w-44 flex-shrink-0 truncate text-slate-300">{x.name}</span>
                <div className="flex-1">
                  <ProgressBar value={x.r * 100} tone={x.r >= 0.8 ? 'emerald' : x.r >= 0.6 ? 'amber' : 'rose'} />
                </div>
                <span className="w-12 text-right text-xs tabular-nums text-slate-400">{Math.round(x.r * 100)}%</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* error taxonomy */}
      {errRanked.length > 0 && (
        <Card>
          <h2 className="mb-1 text-sm font-semibold text-slate-200">Why you miss questions</h2>
          <p className="mb-3 text-xs text-slate-500">
            From your one-tap tags on missed questions. Each failure mode has a different cure.
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {errRanked.map(([k, n]) => (
              <div key={k} className="flex items-center justify-between rounded-lg border border-slate-800 px-3 py-2 text-sm">
                <span className="text-slate-300">{ERROR_LABELS[k] ?? k}</span>
                <span className="font-bold text-slate-100">{n}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-slate-400">
            {errRanked[0][0] === 'concept' && 'Concept gaps dominate → prioritize lessons before more drilling.'}
            {errRanked[0][0] === 'arithmetic' && 'Arithmetic slips dominate → slow down 10% and write intermediate values in MathLab.'}
            {errRanked[0][0] === 'misread' && 'Misreads dominate → underline the asked quantity and givens before solving.'}
            {errRanked[0][0] === 'time' && 'Time pressure dominates → run speed drills weekly and bank time on easy questions.'}
          </p>
        </Card>
      )}

      {/* per-exam mastery */}
      {EXAMS.map((exam) => {
        const mastery = computeAreaMastery(attempts, lessons, exam.id);
        const r = readiness.find((x) => x.examId === exam.id)!;
        return (
          <Card key={exam.id}>
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Pill tone={toneFor(exam.id)}>{exam.shortName}</Pill>
                <h2 className="text-sm font-semibold text-slate-200">Knowledge-area mastery</h2>
              </div>
              <span className="text-lg font-bold">{r.score}%</span>
            </div>
            <div className="space-y-2">
              {mastery.map((m) => (
                <div key={m.areaId} className="flex items-center gap-3 text-sm">
                  <span className="w-44 flex-shrink-0 truncate text-slate-300">{m.name}</span>
                  <div className="flex-1"><ProgressBar value={m.mastery * 100} tone={toneFor(exam.id)} /></div>
                  <span className="w-24 text-right text-xs text-slate-500">
                    {m.accuracy !== null ? `${Math.round(m.accuracy * 100)}% · ` : ''}{m.attempts}Q
                  </span>
                </div>
              ))}
            </div>
          </Card>
        );
      })}

      {/* insights */}
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">Learning insights</h2>
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
