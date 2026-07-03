import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { QUESTIONS, QUESTION_BY_ID } from '../data/questions';
import { areaById, EXAM_BY_ID } from '../data/exams';
import { useProgress } from '../store/progress';
import { fsrsIsDue as isDue } from '../lib/fsrs';
import { QuestionCard } from '../components/QuestionCard';
import { RichText } from '../components/Tex';
import { Card, Pill } from '../components/ui';
import { shuffle } from '../lib/analytics';
import type { Question } from '../types';

const toneFor = (id: string) =>
  id === 'fe-civil' ? 'violet' : id === 'pe-geotech' ? 'amber' : id === 'pe-wre' ? 'sky' : id === 'ca-seismic' ? 'rose' : 'emerald';

/** Questions whose LATEST attempt was wrong — your active error log. */
function useMissed(): Question[] {
  const attempts = useProgress((s) => s.attempts);
  return useMemo(() => {
    const latest = new Map<string, boolean>();
    for (const a of attempts) latest.set(a.questionId, a.correct); // later overwrite = latest
    return QUESTIONS.filter((q) => latest.get(q.id) === false);
  }, [attempts]);
}

export function ReviewPage() {
  const missed = useMissed();
  const { cards, recordAttempt } = useProgress();
  const due = Object.values(cards).filter((s) => isDue(s)).length;

  const [session, setSession] = useState<Question[] | null>(null);
  const [pos, setPos] = useState(0);
  const [fixed, setFixed] = useState(0);

  const startCram = () => {
    setSession(shuffle(missed).slice(0, 10));
    setPos(0);
    setFixed(0);
  };

  if (session) {
    if (pos >= session.length) {
      return (
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">Cram session complete</h1>
          <Card>
            <div className="text-4xl font-bold text-emerald-300">{fixed}/{session.length}</div>
            <p className="mt-1 text-sm text-slate-400">
              {fixed === session.length
                ? 'Perfect — every miss is now corrected. They leave your error log.'
                : 'Corrected items leave the log; the rest stay until you get them right.'}
            </p>
            <div className="mt-4 flex gap-2">
              <button onClick={() => setSession(null)} className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white">
                Back to review
              </button>
            </div>
          </Card>
        </div>
      );
    }
    const q = session[pos];
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold">Cram mode — fixing misses</h1>
          <span className="text-sm text-slate-400">{fixed} corrected</span>
        </div>
        <QuestionCard
          q={q}
          index={pos}
          total={session.length}
          onAnswered={(c, _ch, timeMs) => {
            if (c) setFixed((f) => f + 1);
            recordAttempt({ questionId: q.id, examId: q.examId, areaId: q.areaId, correct: c, timeMs, mode: 'review' });
          }}
        />
        <button
          onClick={() => setPos((p) => p + 1)}
          className="w-full rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-200 sm:w-auto"
        >
          {pos + 1 >= session.length ? 'Finish →' : 'Next →'}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-bold">Review</h1>
        <p className="text-sm text-slate-400">
          Your error log — every question whose most recent attempt was wrong. Answer it correctly (here or anywhere) and it clears.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2">
        <Card>
          <div className="text-xs uppercase tracking-wide text-slate-400">Missed questions</div>
          <div className="mt-1 text-3xl font-bold text-rose-300">{missed.length}</div>
          <button
            onClick={startCram}
            disabled={missed.length === 0}
            className="mt-3 w-full rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
          >
            🔥 Start cram session {missed.length > 0 ? `(${Math.min(10, missed.length)})` : ''}
          </button>
        </Card>
        <Card>
          <div className="text-xs uppercase tracking-wide text-slate-400">Flashcards due</div>
          <div className="mt-1 text-3xl font-bold text-amber-300">{due}</div>
          <Link
            to="/flashcards"
            className="mt-3 block w-full rounded-lg border border-slate-700 px-4 py-2 text-center text-sm font-semibold text-slate-200 hover:border-slate-500"
          >
            Review flashcards →
          </Link>
        </Card>
      </div>

      {missed.length === 0 ? (
        <Card>
          <div className="py-6 text-center">
            <div className="text-4xl">🎯</div>
            <p className="mt-2 font-semibold">Error log is clear</p>
            <p className="text-sm text-slate-400">Miss a question in practice or a mock and it will appear here until you correct it.</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-2">
          {missed.map((q) => (
            <details key={q.id} className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
              <summary className="cursor-pointer text-sm">
                <Pill tone={toneFor(q.examId)}>{EXAM_BY_ID[q.examId].shortName}</Pill>{' '}
                <span className="text-xs text-slate-500">{areaById(q.areaId)?.name}</span>
                <RichText html={q.stem} className="mt-1 text-slate-300" />
              </summary>
              <RetryInline q={q} />
            </details>
          ))}
        </div>
      )}
    </div>
  );
}

function RetryInline({ q }: { q: Question }) {
  const recordAttempt = useProgress((s) => s.recordAttempt);
  // fresh key remounts the card so it can be retried repeatedly
  const [attemptKey, setAttemptKey] = useState(0);
  const fullQ = QUESTION_BY_ID[q.id];
  return (
    <div className="mt-3">
      <QuestionCard
        key={attemptKey}
        q={fullQ}
        index={0}
        total={1}
        onAnswered={(c, _ch, timeMs) =>
          recordAttempt({ questionId: q.id, examId: q.examId, areaId: q.areaId, correct: c, timeMs, mode: 'review' })
        }
      />
      <button onClick={() => setAttemptKey((k) => k + 1)} className="mt-2 text-xs text-slate-400 hover:text-slate-200">
        ↻ try again
      </button>
    </div>
  );
}
