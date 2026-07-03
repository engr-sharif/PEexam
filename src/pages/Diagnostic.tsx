import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { EXAMS } from '../data/exams';
import { QUESTIONS } from '../data/questions';
import { useProgress } from '../store/progress';
import { computeReadiness, shuffle } from '../lib/analytics';
import { QuestionCard } from '../components/QuestionCard';
import { Card, Pill, ProgressBar } from '../components/ui';

const toneFor = (id: string) =>
  id === 'pe-geotech' ? 'amber' : id === 'pe-wre' ? 'sky' : id === 'ca-seismic' ? 'rose' : 'emerald';

/** 12-question placement quiz: 4 per exam, spread across areas & difficulties. */
function buildDiagnostic() {
  const set: typeof QUESTIONS = [];
  for (const exam of EXAMS) {
    const pool = QUESTIONS.filter((q) => q.examId === exam.id);
    // spread across distinct areas where possible
    const byArea = new Map<string, typeof QUESTIONS>();
    for (const q of pool) {
      byArea.set(q.areaId, [...(byArea.get(q.areaId) ?? []), q]);
    }
    const areas = shuffle([...byArea.keys()]);
    const picked: typeof QUESTIONS = [];
    for (const a of areas) {
      if (picked.length >= 4) break;
      picked.push(shuffle(byArea.get(a)!)[0]);
    }
    for (const q of shuffle(pool)) {
      if (picked.length >= 4) break;
      if (!picked.includes(q)) picked.push(q);
    }
    set.push(...picked);
  }
  return shuffle(set);
}

export function Diagnostic() {
  const { attempts, lessons, recordAttempt, addStudyMinutes } = useProgress();
  const [quiz] = useState(buildDiagnostic);
  const [pos, setPos] = useState(0);
  const [started, setStarted] = useState(false);
  const [startTime] = useState(() => Date.now());
  const done = pos >= quiz.length;

  const readiness = useMemo(
    () => (done ? computeReadiness(attempts, lessons) : []),
    [done, attempts, lessons],
  );

  if (!started) {
    return (
      <div className="mx-auto max-w-xl space-y-4">
        <h1 className="text-2xl font-bold">Placement diagnostic</h1>
        <Card>
          <p className="text-sm text-slate-300">
            {quiz.length} questions across all exams (~15 minutes, untimed). I use the results to set your
            starting competency per area, so your study plan targets the right things from day one.
          </p>
          <ul className="mt-3 list-disc pl-5 text-sm text-slate-400">
            <li>Answer honestly — skipping hurts less than guessing lucky.</li>
            <li>You’ll see worked solutions after each answer.</li>
          </ul>
        </Card>
        <div className="flex gap-2">
          <button onClick={() => setStarted(true)} className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white">
            Start diagnostic
          </button>
          <Link to="/" className="rounded-lg border border-slate-700 px-5 py-2.5 text-sm font-semibold text-slate-200">
            Later
          </Link>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div className="space-y-5">
        <h1 className="text-2xl font-bold">Diagnostic complete — your baseline</h1>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {readiness.map((r) => (
            <Card key={r.examId}>
              <div className="flex items-center justify-between">
                <Pill tone={toneFor(r.examId)}>{r.shortName}</Pill>
                <span className="text-2xl font-bold">{r.score}%</span>
              </div>
              <div className="mt-3"><ProgressBar value={r.score} tone={toneFor(r.examId)} /></div>
              <div className="mt-2 text-xs text-slate-400">
                Start with: {r.weakAreas[0]?.name ?? '—'}
              </div>
            </Card>
          ))}
        </div>
        <p className="text-sm text-slate-400">
          Your dashboard recommendations are now calibrated. Retake the diagnostic anytime from Settings — the engine
          always weights recent results more.
        </p>
        <Link to="/" className="inline-block rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white">
          Go to my study plan →
        </Link>
      </div>
    );
  }

  const q = quiz[pos];
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold">Placement diagnostic</h1>
        <span className="text-sm text-slate-400">{pos + 1}/{quiz.length}</span>
      </div>
      <QuestionCard
        q={q}
        index={pos}
        total={quiz.length}
        onAnswered={(c, _ch, timeMs) =>
          recordAttempt({ questionId: q.id, examId: q.examId, areaId: q.areaId, correct: c, timeMs, mode: 'diagnostic' })
        }
      />
      <button
        onClick={() => {
          if (pos + 1 >= quiz.length) addStudyMinutes(Math.max(1, Math.round((Date.now() - startTime) / 60000)));
          setPos((p) => p + 1);
        }}
        className="w-full rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-200 sm:w-auto"
      >
        {pos + 1 >= quiz.length ? 'See my baseline →' : 'Next →'}
      </button>
    </div>
  );
}
