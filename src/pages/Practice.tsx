import { useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { EXAMS, EXAM_BY_ID, areaById } from '../data/exams';
import { QUESTIONS } from '../data/questions';
import { useProgress } from '../store/progress';
import { shuffle, pickAdaptiveQuestions, computeAreaMastery, competency } from '../lib/analytics';
import { QuestionCard } from '../components/QuestionCard';
import { Card, Pill } from '../components/ui';
import type { Question } from '../types';

export function Practice() {
  const [params, setParams] = useSearchParams();
  const { attempts, lessons, recordAttempt, addStudyMinutes } = useProgress();

  const examFilter = params.get('exam') ?? '';
  const areaFilter = params.get('area') ?? '';
  const [adaptive, setAdaptive] = useState(false);

  const [quiz, setQuiz] = useState<Question[] | null>(null);
  const [pos, setPos] = useState(0);
  const [score, setScore] = useState(0);
  const quizStart = useRef(0);

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
    const set = adaptive
      ? pickAdaptiveQuestions(attempts, lessons, examFilter || undefined, 10)
      : shuffle(available).slice(0, 10);
    setQuiz(set);
    setPos(0);
    setScore(0);
    quizStart.current = Date.now();
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
      const pct = Math.round((score / quiz.length) * 100);
      return (
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">Quiz complete</h1>
          <Card>
            <div className="text-4xl font-bold text-brand-300">{score}/{quiz.length}</div>
            <p className="mt-1 text-sm text-slate-400">
              {pct}% correct.{' '}
              {pct >= 80
                ? 'Excellent — you clearly know this material.'
                : pct >= 60
                ? 'Good progress. Review the ones you missed and try again.'
                : 'Keep at it — revisit the linked lessons, then retry.'}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
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
          onAnswered={(c, _chosen, timeMs) => {
            if (c) setScore((s) => s + 1);
            recordAttempt({ questionId: q.id, examId: q.examId, areaId: q.areaId, correct: c, timeMs, mode: 'practice' });
          }}
        />
        <button
          onClick={() => {
            if (pos + 1 >= quiz.length) {
              addStudyMinutes(Math.max(1, Math.round((Date.now() - quizStart.current) / 60000)));
            }
            setPos((p) => p + 1);
          }}
          className="w-full rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-200 hover:border-slate-500 sm:w-auto"
        >
          {pos + 1 >= quiz.length ? 'Finish →' : 'Next question →'}
        </button>
      </div>
    );
  }

  const areasForExam = examFilter ? EXAM_BY_ID[examFilter]?.areas ?? [] : [];
  const areaMastery = areaFilter
    ? computeAreaMastery(attempts, lessons).find((m) => m.areaId === areaFilter)
    : undefined;
  const comp = areaMastery ? competency(areaMastery.mastery, areaMastery.attempts) : undefined;

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-bold">Practice</h1>
        <p className="text-sm text-slate-400">Untimed quizzes with worked solutions and instant tutor feedback.</p>
      </header>

      {/* Mode */}
      <div className="grid gap-3 sm:grid-cols-2">
        <button
          onClick={() => setAdaptive(true)}
          className={`rounded-xl border p-4 text-left transition ${adaptive ? 'border-brand-500 bg-brand-600/10' : 'border-slate-800 hover:border-slate-600'}`}
        >
          <div className="font-semibold text-slate-100">🎯 Adaptive — tutor picks</div>
          <div className="mt-1 text-xs text-slate-400">I choose 10 questions targeting your weak, high-value areas at the right difficulty.</div>
        </button>
        <button
          onClick={() => setAdaptive(false)}
          className={`rounded-xl border p-4 text-left transition ${!adaptive ? 'border-brand-500 bg-brand-600/10' : 'border-slate-800 hover:border-slate-600'}`}
        >
          <div className="font-semibold text-slate-100">🗂 By topic — you choose</div>
          <div className="mt-1 text-xs text-slate-400">Filter by exam and knowledge area below.</div>
        </button>
      </div>

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

        {!adaptive && areasForExam.length > 0 && (
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

        {comp && areaMastery && (
          <div className="mt-4 flex items-center gap-2 text-sm text-slate-400">
            Your level here: <Pill tone={comp.tone}>{comp.label}</Pill>
            <span>· {Math.round(areaMastery.mastery * 100)}% mastery · {areaMastery.attempts} attempts</span>
          </div>
        )}

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            onClick={start}
            disabled={!adaptive && available.length === 0}
            className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-40"
          >
            {adaptive ? 'Start adaptive quiz (10)' : `Start quiz (${Math.min(10, available.length)} questions)`}
          </button>
          {!adaptive && <Pill>{available.length} in bank{areaFilter ? ` · ${areaById(areaFilter)?.name}` : ''}</Pill>}
        </div>
        {!adaptive && available.length === 0 && (
          <p className="mt-2 text-xs text-amber-400">No questions for this filter yet — try “All”.</p>
        )}
      </Card>
    </div>
  );
}

function FilterBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
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
