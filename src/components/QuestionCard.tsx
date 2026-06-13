import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Question } from '../types';
import { RichText } from './Tex';
import { SolutionSteps } from './Blocks';
import { lessonsForArea } from '../data/lessons';
import { areaById } from '../data/exams';

const LETTERS = ['A', 'B', 'C', 'D', 'E'];

export function QuestionCard({
  q,
  index,
  total,
  onAnswered,
  showExplanation = true,
}: {
  q: Question;
  index: number;
  total: number;
  onAnswered: (correct: boolean, chosen: number, timeMs: number) => void;
  showExplanation?: boolean;
}) {
  const [chosen, setChosen] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [showWork, setShowWork] = useState(false);
  const [start, setStart] = useState(() => Date.now());

  // reset when question changes
  useEffect(() => {
    setChosen(null);
    setRevealed(false);
    setShowWork(false);
    setStart(Date.now());
  }, [q.id]);

  const submit = () => {
    if (chosen === null || revealed) return;
    setRevealed(true);
    setShowWork(true);
    onAnswered(chosen === q.answerIndex, chosen, Date.now() - start);
  };

  const correct = chosen === q.answerIndex;
  const reviewLesson = lessonsForArea(q.areaId)[0];

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 sm:p-5">
      <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
        <span>Question {index + 1} of {total}</span>
        <span className="capitalize">{areaById(q.areaId)?.name} · {q.difficulty}</span>
      </div>
      <RichText html={q.stem} className="text-slate-100" />

      <div className="mt-4 space-y-2">
        {q.choices.map((choice, i) => {
          const isAnswer = i === q.answerIndex;
          const isChosen = i === chosen;
          let cls = 'border-slate-700 hover:border-slate-500 active:bg-slate-800';
          if (revealed) {
            if (isAnswer) cls = 'border-emerald-500 bg-emerald-500/10';
            else if (isChosen) cls = 'border-rose-500 bg-rose-500/10';
            else cls = 'border-slate-800 opacity-70';
          } else if (isChosen) {
            cls = 'border-brand-500 bg-brand-500/10';
          }
          return (
            <button
              key={i}
              disabled={revealed}
              onClick={() => setChosen(i)}
              className={`flex w-full items-start gap-3 rounded-lg border px-3 py-3 text-left text-sm transition sm:px-4 sm:py-2.5 ${cls}`}
            >
              <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-slate-800 text-xs">
                {LETTERS[i]}
              </span>
              <RichText html={choice} className="text-slate-200" />
            </button>
          );
        })}
      </div>

      {!revealed ? (
        <button
          onClick={submit}
          disabled={chosen === null}
          className="mt-4 w-full rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-40 sm:w-auto"
        >
          Submit answer
        </button>
      ) : (
        showExplanation && (
          <div className="mt-4 space-y-3">
            <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4">
              <div className={`mb-1 text-sm font-semibold ${correct ? 'text-emerald-400' : 'text-rose-400'}`}>
                {correct ? '✓ Correct' : `✗ Not quite — the answer is ${LETTERS[q.answerIndex]}`}
              </div>
              <RichText html={q.explanation} className="text-sm leading-relaxed text-slate-300" />
            </div>

            {q.solution && q.solution.length > 0 && (
              <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-4">
                <button
                  onClick={() => setShowWork((s) => !s)}
                  className="mb-1 flex w-full items-center justify-between text-sm font-semibold text-brand-300"
                >
                  <span>📝 Worked solution</span>
                  <span className="text-xs text-slate-400">{showWork ? 'hide' : 'show'}</span>
                </button>
                {showWork && <SolutionSteps steps={q.solution} />}
              </div>
            )}

            {/* Tutor nudge when wrong */}
            {!correct && reviewLesson && (
              <div className="flex items-center justify-between rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm">
                <span className="text-amber-100">👨‍🏫 Want a refresher? Review the lesson on this topic.</span>
                <Link to={`/lesson/${reviewLesson.id}`} className="ml-3 flex-shrink-0 font-semibold text-amber-300 hover:underline">
                  {reviewLesson.title} →
                </Link>
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
}
