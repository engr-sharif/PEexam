import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { EXAM_BY_ID, areaById } from '../data/exams';
import { buildMockExam } from '../lib/analytics';
import { useProgress } from '../store/progress';
import { Calculator } from '../components/Calculator';
import { RichText } from '../components/Tex';
import type { MockResult } from '../store/progress';
import type { Exam, Question } from '../types';

const LETTERS = ['A', 'B', 'C', 'D', 'E'];

export function MockRunner() {
  const { examId } = useParams();
  const [params] = useSearchParams();
  const exam = examId ? EXAM_BY_ID[examId] : undefined;
  const recordMock = useProgress((s) => s.recordMock);
  const recordAttempt = useProgress((s) => s.recordAttempt);
  const addStudyMinutes = useProgress((s) => s.addStudyMinutes);

  const count = params.get('count') ? Number(params.get('count')) : undefined;
  const questions = useMemo(
    () => (examId ? buildMockExam(examId, count) : []),
    [examId, count],
  );

  // total time = real per-question budget × number of questions
  const totalSeconds = useMemo(() => {
    if (!exam) return 0;
    const perQ = (exam.examMinutes * 60) / exam.questionCount;
    return Math.round(perQ * questions.length);
  }, [exam, questions.length]);

  const [started, setStarted] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [flags, setFlags] = useState<boolean[]>([]);
  const [cur, setCur] = useState(0);
  const [remaining, setRemaining] = useState(totalSeconds);
  const [showCalc, setShowCalc] = useState(false);
  const [result, setResult] = useState<MockResult | null>(null);
  const startTime = useRef(0);

  useEffect(() => {
    setRemaining(totalSeconds);
  }, [totalSeconds]);

  // countdown
  useEffect(() => {
    if (!started || result) return;
    const t = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(t);
          finish();
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, result]);

  if (!exam) return <p>Unknown exam.</p>;
  if (questions.length === 0)
    return (
      <div className="space-y-3">
        <p>No questions available for this exam yet.</p>
        <Link to="/mock" className="text-brand-400 hover:underline">← Back to mock exams</Link>
      </div>
    );

  function begin() {
    setAnswers(new Array(questions.length).fill(null));
    setFlags(new Array(questions.length).fill(false));
    setCur(0);
    setRemaining(totalSeconds);
    startTime.current = Date.now();
    setStarted(true);
  }

  function finish() {
    const durationMs = Date.now() - startTime.current;
    let correct = 0;
    const byArea: Record<string, { correct: number; total: number }> = {};
    const ansSnapshot = questions.map((q, i) => {
      const chosen = answers[i];
      const ok = chosen === q.answerIndex;
      if (ok) correct++;
      byArea[q.areaId] = byArea[q.areaId] ?? { correct: 0, total: 0 };
      byArea[q.areaId].total++;
      if (ok) byArea[q.areaId].correct++;
      // feed the adaptive engine
      recordAttempt({
        questionId: q.id,
        examId: q.examId,
        areaId: q.areaId,
        correct: ok,
        timeMs: Math.round(durationMs / questions.length),
        mode: 'mock',
      });
      return { questionId: q.id, chosen, correct: ok };
    });
    const r = {
      examId: exam!.id,
      score: correct / questions.length,
      correct,
      total: questions.length,
      durationMs,
      byArea,
      answers: ansSnapshot,
    };
    recordMock(r);
    addStudyMinutes(Math.max(1, Math.round(durationMs / 60000)));
    setResult({ ...r, id: 'live', at: Date.now() });
  }

  // ----- intro screen -----
  if (!started) {
    return (
      <div className="mx-auto max-w-xl space-y-4">
        <h1 className="text-2xl font-bold">{exam.shortName} — Mock Exam</h1>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <ul className="space-y-2">
            <li>📋 <b>{questions.length} questions</b>, weighted to the real blueprint.</li>
            <li>⏱ <b>{fmt(totalSeconds)}</b> on the clock (real per-question pace).</li>
            <li>🚩 Flag questions and revisit them via the navigator.</li>
            <li>🧮 On-screen calculator available.</li>
            <li>⚠ The timer auto-submits at 0:00 — just like the CBT.</li>
          </ul>
          <p className="mt-3 text-xs text-slate-500">{exam.passNote}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={begin} className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white">
            Start timed exam
          </button>
          <Link to="/mock" className="rounded-lg border border-slate-700 px-5 py-2.5 text-sm font-semibold text-slate-200">
            Cancel
          </Link>
        </div>
      </div>
    );
  }

  // ----- results screen -----
  if (result) {
    return <Results exam={exam} questions={questions} result={result} />;
  }

  // ----- exam runner -----
  const q = questions[cur];
  const lowTime = remaining < totalSeconds * 0.1;
  const answeredCount = answers.filter((a) => a !== null).length;

  return (
    <div className="space-y-4">
      {/* top bar */}
      <div className="sticky top-0 z-10 -mx-4 flex items-center justify-between border-b border-slate-800 bg-slate-950/95 px-4 py-2 backdrop-blur">
        <div className="text-sm font-semibold">{exam.shortName} mock</div>
        <div className={`rounded-md px-3 py-1 font-mono text-lg font-bold ${lowTime ? 'bg-rose-500/20 text-rose-300' : 'text-slate-200'}`}>
          {fmt(remaining)}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowCalc((s) => !s)} className="rounded-lg border border-slate-700 px-3 py-1 text-xs">🧮 Calc</button>
          <button onClick={finish} className="rounded-lg bg-emerald-600 px-3 py-1 text-xs font-semibold text-white">Submit</button>
        </div>
      </div>

      {showCalc && (
        <div className="fixed bottom-4 right-4 z-20">
          <Calculator onClose={() => setShowCalc(false)} />
        </div>
      )}

      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="min-w-0 flex-1 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Question {cur + 1} of {questions.length} · {areaById(q.areaId)?.name}</span>
            <button
              onClick={() => setFlags((f) => f.map((v, i) => (i === cur ? !v : v)))}
              className={`rounded px-2 py-0.5 ${flags[cur] ? 'bg-amber-500/20 text-amber-300' : 'text-slate-400 hover:text-slate-200'}`}
            >
              🚩 {flags[cur] ? 'Flagged' : 'Flag'}
            </button>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
            <RichText html={q.stem} className="text-slate-100" />
            <div className="mt-4 space-y-2">
              {q.choices.map((choice, i) => {
                const isChosen = answers[cur] === i;
                return (
                  <button
                    key={i}
                    onClick={() => setAnswers((a) => a.map((v, idx) => (idx === cur ? i : v)))}
                    className={`flex w-full items-start gap-3 rounded-lg border px-4 py-2.5 text-left text-sm transition ${
                      isChosen ? 'border-brand-500 bg-brand-500/10' : 'border-slate-700 hover:border-slate-500'
                    }`}
                  >
                    <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-slate-800 text-xs">{LETTERS[i]}</span>
                    <RichText html={choice} className="text-slate-200" />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setCur((c) => Math.max(0, c - 1))}
              disabled={cur === 0}
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm disabled:opacity-40"
            >
              ← Previous
            </button>
            <button
              onClick={() => setCur((c) => Math.min(questions.length - 1, c + 1))}
              disabled={cur === questions.length - 1}
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm disabled:opacity-40"
            >
              Next →
            </button>
          </div>
        </div>

        {/* navigator */}
        <div className="lg:w-56 lg:flex-shrink-0">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <div className="mb-2 text-xs text-slate-400">{answeredCount}/{questions.length} answered</div>
            <div className="grid grid-cols-6 gap-1.5 lg:grid-cols-5">
              {questions.map((_, i) => {
                const answered = answers[i] !== null;
                const flagged = flags[i];
                return (
                  <button
                    key={i}
                    onClick={() => setCur(i)}
                    className={`relative h-8 rounded text-xs font-medium ${
                      i === cur
                        ? 'ring-2 ring-brand-400 '
                        : ''
                    }${answered ? 'bg-brand-600/40 text-brand-100' : 'bg-slate-800 text-slate-400'}`}
                  >
                    {i + 1}
                    {flagged && <span className="absolute -right-0.5 -top-0.5 text-[8px]">🚩</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Results({
  exam,
  questions,
  result,
}: {
  exam: Exam;
  questions: Question[];
  result: MockResult;
}) {
  const pct = Math.round(result.score * 100);
  const tone = result.score >= 0.7 ? 'text-emerald-400' : result.score >= 0.55 ? 'text-amber-400' : 'text-rose-400';
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">{exam.shortName} — Results</h1>
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-center">
          <div className={`text-5xl font-bold ${tone}`}>{pct}%</div>
          <div className="mt-1 text-sm text-slate-400">{result.correct} / {result.total} correct</div>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-center">
          <div className="text-2xl font-bold">{Math.round(result.durationMs / 60000)} min</div>
          <div className="mt-1 text-sm text-slate-400">time used</div>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-center">
          <div className={`text-2xl font-bold ${tone}`}>{result.score >= 0.7 ? 'On track ✓' : result.score >= 0.55 ? 'Borderline' : 'Keep building'}</div>
          <div className="mt-1 text-sm text-slate-400">≈ pass likelihood</div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
        <h2 className="mb-3 text-sm font-semibold text-slate-200">By knowledge area</h2>
        <div className="space-y-2">
          {Object.entries(result.byArea).map(([areaId, v]) => {
            const p = Math.round((v.correct / v.total) * 100);
            return (
              <div key={areaId} className="flex items-center gap-3 text-sm">
                <span className="w-48 flex-shrink-0 truncate text-slate-300">{areaById(areaId)?.name}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-800">
                  <div className={`h-full ${p >= 70 ? 'bg-emerald-500' : p >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${p}%` }} />
                </div>
                <span className="w-16 text-right tabular-nums text-slate-400">{v.correct}/{v.total}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
        <h2 className="mb-3 text-sm font-semibold text-slate-200">Review answers</h2>
        <div className="space-y-3">
          {questions.map((q, i) => {
            const a = result.answers[i];
            return (
              <details key={q.id} className="rounded-lg border border-slate-800 p-3">
                <summary className="cursor-pointer text-sm">
                  <span className={a.correct ? 'text-emerald-400' : 'text-rose-400'}>{a.correct ? '✓' : '✗'}</span>{' '}
                  <span className="text-slate-300">Q{i + 1}.</span>{' '}
                  <RichText html={q.stem} className="inline text-slate-300" />
                </summary>
                <div className="mt-2 text-sm">
                  <div className="text-slate-400">
                    Your answer: {a.chosen !== null ? LETTERS[a.chosen] : '—'} · Correct: {LETTERS[q.answerIndex]}
                  </div>
                  <RichText html={q.explanation} className="mt-1 text-slate-300" />
                </div>
              </details>
            );
          })}
        </div>
      </div>

      <div className="flex gap-2">
        <Link to={`/mock/${exam.id}`} className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white">Retake</Link>
        <Link to="/progress" className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200">View progress →</Link>
      </div>
    </div>
  );
}

function fmt(s: number): string {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return h > 0
    ? `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
    : `${m}:${String(sec).padStart(2, '0')}`;
}
