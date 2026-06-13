import { useProgress } from '../store/progress';
import { computeAreaMastery, computeReadiness, learningInsights } from '../lib/analytics';
import { EXAMS } from '../data/exams';
import { Card, Pill, ProgressBar, Stat } from '../components/ui';

const toneFor = (id: string) =>
  id === 'pe-geotech' ? 'amber' : id === 'ca-seismic' ? 'rose' : 'emerald';

export function ProgressPage() {
  const { attempts, lessons, mocks, minutesByDay, streak } = useProgress();
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
