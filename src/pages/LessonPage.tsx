import { useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { LESSON_BY_ID, lessonsForArea } from '../data/lessons';
import { areaById, EXAM_BY_ID } from '../data/exams';
import { useProgress } from '../store/progress';
import { LessonView } from '../components/LessonView';
import { Pill } from '../components/ui';

export function LessonPage() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const lesson = lessonId ? LESSON_BY_ID[lessonId] : undefined;
  const { lessons, setLessonProgress } = useProgress();

  // count a view when opened
  useEffect(() => {
    if (lesson) setLessonProgress(lesson.id, {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson?.id]);

  if (!lesson) return <p>Lesson not found.</p>;
  const area = areaById(lesson.areaId);
  const exam = EXAM_BY_ID[lesson.examId];
  const done = lessons[lesson.id]?.completed;
  const confidence = lessons[lesson.id]?.confidence;

  const siblings = lessonsForArea(lesson.areaId);
  const idx = siblings.findIndex((l) => l.id === lesson.id);
  const next = siblings[idx + 1];

  return (
    <div className="space-y-5">
      <header>
        <Link to={`/study/${lesson.examId}`} className="text-xs text-slate-400 hover:underline">
          ← {exam?.shortName}: {area?.name}
        </Link>
        <h1 className="mt-1 text-2xl font-bold">{lesson.title}</h1>
        <p className="mt-1 text-sm text-slate-400">{lesson.objective}</p>
        <div className="mt-2 flex items-center gap-2">
          <Pill>{lesson.estMinutes} min</Pill>
          {done && <Pill tone="emerald">✓ Completed</Pill>}
        </div>
      </header>

      <LessonView lesson={lesson} />

      {/* Confidence + completion */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
        <div className="text-sm font-semibold text-slate-200">How confident do you feel on this topic?</div>
        <div className="mt-2 flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => setLessonProgress(lesson.id, { confidence: n, completed: true })}
              className={`h-9 w-9 rounded-lg border text-sm font-semibold transition ${
                confidence === n
                  ? 'border-brand-500 bg-brand-600/20 text-brand-200'
                  : 'border-slate-700 text-slate-400 hover:border-slate-500'
              }`}
            >
              {n}
            </button>
          ))}
          <span className="self-center text-xs text-slate-500">1 = shaky · 5 = exam-ready</span>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => setLessonProgress(lesson.id, { completed: true })}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
          >
            {done ? 'Marked complete ✓' : 'Mark complete'}
          </button>
          <Link
            to={`/practice?exam=${lesson.examId}&area=${lesson.areaId}`}
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 hover:border-slate-500"
          >
            Practice this topic →
          </Link>
          {next && (
            <button
              onClick={() => navigate(`/lesson/${next.id}`)}
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 hover:border-slate-500"
            >
              Next lesson: {next.title} →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
