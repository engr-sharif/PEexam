import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { EXAMS, EXAM_BY_ID, areaById } from '../data/exams';
import { QUESTIONS } from '../data/questions';
import { useProgress } from '../store/progress';
import { shuffle } from '../lib/analytics';
import { QuestionCard } from '../components/QuestionCard';
import { Card, Pill } from '../components/ui';
import type { Question } from '../types';

export function Practice() {
  const [params, setParams] = useSearchParams();
  const recordAttempt = useProgress((s) => s.recordAttempt);

  const examFilter = params.get('exam') ?? '';
  const areaFilter = params.get('area') ?? '';

  const [quiz, setQuiz] = useState<Question[] | null>(null);
  const [pos, setPos] = useState(0);
  const [score, setScore] = useState(0);

  const available = useMemo(
    () =>
      QUESTIONS.filter(
        (q) =>
          (!examFilter || q.examId === examFilter) &&
          (!areaFilter || q.areaId === areaFilter),
      ),
    [examFilter, areaFilter],
  );

  const start = () => {
    setQuiz(shuffle(available).slice(0, 10));
    setPos(0);
    setScore(0);
  };

  const setExam = (e: string) => {
    const p = new URLSearchParams(params);
    if (e) p.set('exam', e);
    else p.delete('exam');
    p.delete('area');
    setParams(p);
  };
  const setArea = (a: string) => {
    const p = new URLSearchParams(params);
    if (a) p.set('area', a);
    else p.delete('area');
    setParams(p);
  };

  if (quiz) {
    if (pos >= quiz.length) {
      return (
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">Quiz complete</h1>
          <Card>
            <div className="text-4xl font-bold text-brand-300">
              {score}/{quiz.length}
            </div>
            <p className="mt-1 text-sm text-slate-400">
              {Math.round((score / quiz.length) * 100)}% correct. Keep your streak going.
            </p>
            <div className="mt-4 flex gap-2">
              <button onClick={start} className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white">
                New quiz
              </button>
              <button onClick={() => setQuiz(null)} className="rounded-lg border border-slate-700 px-4 py-2 text-sm">
                Change topics
              </button>
            </div>
          </Card>
        </div>
      );
    }
    const q = quiz[pos];
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold">Practice</h1>
          <span className="text-sm text-slate-400">Score: {score}/{pos}</span>
        </div>
        <QuestionCard
          q={q}
          index={pos}
          total={quiz.length}
          onAnswered={(correct, chosen, timeMs) => {
            void chosen;
            if (correct) setScore((s) => s + 1);
            recordAttempt({
              questionId: q.id,
              examId: q.examId,
              areaId: q.areaId,
              correct,
              timeMs,
              mode: 'practice',
            });
          }}
        />
        <button
          onClick={() => setPos((p) => p + 1)}
          className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 hover:border-slate-500"
        >
          {pos + 1 >= quiz.length ? 'Finish →' : 'Next question →'}
        </button>
      </div>
    );
  }

  const areasForExam = examFilter ? EXAM_BY_ID[examFilter]?.areas ?? [] : [];

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-bold">Practice</h1>
        <p className="text-sm text-slate-400">Build a quick untimed quiz with instant explanations.</p>
      </header>

      <Card>
        <div className="text-sm font-semibold text-slate-200">Exam</div>
        <div className="mt-2 flex flex-wrap gap-2">
          <FilterBtn active={examFilter === ''} onClick={() => setExam('')}>All</FilterBtn>
          {EXAMS.map((e) => (
            <FilterBtn key={e.id} active={examFilter === e.id} onClick={() => setExam(e.id)}>
              {e.shortName}
            </FilterBtn>
          ))}
        </div>

        {areasForExam.length > 0 && (
          <>
            <div className="mt-4 text-sm font-semibold text-slate-200">Knowledge area</div>
            <div className="mt-2 flex flex-wrap gap-2">
              <FilterBtn active={areaFilter === ''} onClick={() => setArea('')}>All</FilterBtn>
              {areasForExam.map((a) => (
                <FilterBtn key={a.id} active={areaFilter === a.id} onClick={() => setArea(a.id)}>
                  {a.name}
                </FilterBtn>
              ))}
            </div>
          </>
        )}

        <div className="mt-5 flex items-center gap-3">
          <button
            onClick={start}
            disabled={available.length === 0}
            className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-40"
          >
            Start quiz ({Math.min(10, available.length)} questions)
          </button>
          <Pill>{available.length} in bank{areaFilter ? ` · ${areaById(areaFilter)?.name}` : ''}</Pill>
        </div>
        {available.length === 0 && (
          <p className="mt-2 text-xs text-amber-400">No questions for this filter yet — try “All”.</p>
        )}
      </Card>
    </div>
  );
}

function FilterBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
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
