import { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FLASHCARDS } from '../data/flashcards';
import { QUESTIONS } from '../data/questions';
import { useProgress } from '../store/progress';
import { fsrsIsDue } from '../lib/fsrs';
import { pickAdaptiveQuestions, shuffle } from '../lib/analytics';
import { QuestionCard } from '../components/QuestionCard';
import { RichText } from '../components/Tex';
import { Card, Pill } from '../components/ui';
import type { Flashcard, Question } from '../types';

// One-tap interleaved daily session: due flashcards → error-log retries →
// adaptive questions mixed ACROSS areas (interleaving beats blocked practice).
export function TodaySession() {
  const { settings, cards, attempts, lessons, reviewCard, recordAttempt, addStudyMinutes } = useProgress();

  const plan = useMemo(() => {
    const mins = settings.dailyGoalMinutes;
    const cardBudget = Math.min(10, Math.max(4, Math.round(mins * 0.15 / 0.5)));
    const qBudget = Math.max(3, Math.round((mins * 0.85) / 4));

    const dueCards = shuffle(
      FLASHCARDS.filter((c) => cards[c.id] && fsrsIsDue(cards[c.id])),
    );
    const newCards = shuffle(FLASHCARDS.filter((c) => !cards[c.id]));
    const sessionCards = [...dueCards, ...newCards].slice(0, cardBudget);

    // error-log first (latest attempt wrong), then adaptive picks
    const latest = new Map<string, boolean>();
    for (const a of attempts) latest.set(a.questionId, a.correct);
    const missed = shuffle(QUESTIONS.filter((q) => latest.get(q.id) === false)).slice(
      0,
      Math.ceil(qBudget / 3),
    );
    const adaptive = pickAdaptiveQuestions(
      attempts,
      lessons,
      settings.primaryExam,
      qBudget - missed.length + 3,
    ).filter((q) => !missed.some((m) => m.id === q.id));

    // interleave across areas round-robin
    const byArea = new Map<string, Question[]>();
    for (const q of [...missed, ...adaptive]) {
      byArea.set(q.areaId, [...(byArea.get(q.areaId) ?? []), q]);
    }
    const interleaved: Question[] = [];
    const areaKeys = shuffle([...byArea.keys()]);
    let added = true;
    while (interleaved.length < qBudget && added) {
      added = false;
      for (const k of areaKeys) {
        const arr = byArea.get(k)!;
        if (arr.length && interleaved.length < qBudget) {
          interleaved.push(arr.shift()!);
          added = true;
        }
      }
    }
    return { sessionCards, questions: interleaved, mins };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [phase, setPhase] = useState<'intro' | 'cards' | 'questions' | 'done'>('intro');
  const [cardPos, setCardPos] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [qPos, setQPos] = useState(0);
  const [score, setScore] = useState(0);
  const startRef = useRef(0);

  const finish = () => {
    addStudyMinutes(Math.max(1, Math.round((Date.now() - startRef.current) / 60000)));
    setPhase('done');
  };

  if (phase === 'intro') {
    return (
      <div className="mx-auto max-w-xl space-y-4">
        <h1 className="text-2xl font-bold">Today’s Session</h1>
        <Card>
          <p className="text-sm text-slate-300">
            Built for you just now — sized to your {plan.mins}-minute daily goal:
          </p>
          <ul className="mt-3 space-y-1.5 text-sm text-slate-300">
            <li>🃏 <b>{plan.sessionCards.length} flashcards</b> (due for review first)</li>
            <li>✎ <b>{plan.questions.length} questions</b> — your misses first, then weak high-weight areas, interleaved across topics</li>
          </ul>
          <p className="mt-3 text-xs text-slate-500">
            Interleaving (mixing topics) feels harder than drilling one topic — that difficulty is exactly what makes it stick.
          </p>
        </Card>
        <button
          onClick={() => {
            startRef.current = Date.now();
            setPhase(plan.sessionCards.length > 0 ? 'cards' : plan.questions.length > 0 ? 'questions' : 'done');
          }}
          className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white"
        >
          Start session
        </button>
      </div>
    );
  }

  if (phase === 'cards') {
    const card: Flashcard | undefined = plan.sessionCards[cardPos];
    if (!card) {
      setPhase('questions');
      return null;
    }
    const grade = (g: 1 | 2 | 3 | 4) => {
      reviewCard(card.id, g);
      setFlipped(false);
      if (cardPos + 1 >= plan.sessionCards.length) setPhase(plan.questions.length ? 'questions' : 'done');
      else setCardPos((p) => p + 1);
    };
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm text-slate-400">
          <span className="font-semibold text-slate-200">Today’s Session — warm-up</span>
          <span>Card {cardPos + 1}/{plan.sessionCards.length}</span>
        </div>
        <button
          onClick={() => setFlipped((f) => !f)}
          className="flex min-h-[180px] w-full flex-col items-center justify-center rounded-2xl border border-slate-700 bg-slate-900/60 p-8 text-center"
        >
          {!flipped ? (
            <div className="text-lg font-semibold text-slate-100">{card.front}</div>
          ) : (
            <RichText html={card.back} className="text-xl text-emerald-300" />
          )}
          {!flipped && <div className="mt-3 text-xs text-slate-500">tap to reveal</div>}
        </button>
        {flipped && (
          <div className="grid grid-cols-4 gap-2">
            {([['Again', 1, 'bg-rose-600/80'], ['Hard', 2, 'bg-amber-600/80'], ['Good', 3, 'bg-brand-600/80'], ['Easy', 4, 'bg-emerald-600/80']] as const).map(
              ([label, g, cls]) => (
                <button key={label} onClick={() => grade(g)} className={`rounded-lg py-2.5 text-sm font-semibold text-white ${cls}`}>
                  {label}
                </button>
              ),
            )}
          </div>
        )}
      </div>
    );
  }

  if (phase === 'questions') {
    const q = plan.questions[qPos];
    if (!q) {
      finish();
      return null;
    }
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm text-slate-400">
          <span className="font-semibold text-slate-200">Today’s Session</span>
          <span>{qPos + 1}/{plan.questions.length} · {score} correct</span>
        </div>
        <QuestionCard
          q={q}
          index={qPos}
          total={plan.questions.length}
          onAnswered={(c, _ch, timeMs) => {
            if (c) setScore((s) => s + 1);
            recordAttempt({ questionId: q.id, examId: q.examId, areaId: q.areaId, correct: c, timeMs, mode: 'session' });
          }}
        />
        <button
          onClick={() => (qPos + 1 >= plan.questions.length ? finish() : setQPos((p) => p + 1))}
          className="w-full rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-200 sm:w-auto"
        >
          {qPos + 1 >= plan.questions.length ? 'Finish session →' : 'Next →'}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Session complete 🎉</h1>
      <Card>
        <div className="flex items-center gap-6">
          <div>
            <div className="text-3xl font-bold text-brand-300">{score}/{plan.questions.length}</div>
            <div className="text-xs text-slate-400">questions</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-emerald-300">{plan.sessionCards.length}</div>
            <div className="text-xs text-slate-400">cards reviewed</div>
          </div>
          <Pill tone="emerald">daily goal progress logged</Pill>
        </div>
        <div className="mt-4 flex gap-2">
          <Link to="/" className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white">Dashboard →</Link>
          <Link to="/review" className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200">Error log →</Link>
        </div>
      </Card>
    </div>
  );
}
