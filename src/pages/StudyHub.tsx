import { Link, useParams } from 'react-router-dom';
import { EXAMS, EXAM_BY_ID } from '../data/exams';
import { lessonsForArea } from '../data/lessons';
import { useProgress } from '../store/progress';
import { computeAreaMastery, competency } from '../lib/analytics';
import { Card, Pill, ProgressBar } from '../components/ui';

const toneFor = (id: string) =>
  id === 'pe-geotech' ? 'amber' : id === 'pe-wre' ? 'sky' : id === 'ca-seismic' ? 'rose' : 'emerald';

export function StudyHub() {
  const { examId } = useParams();
  const { attempts, lessons } = useProgress();

  // No exam selected → show the three exams.
  if (!examId) {
    return (
      <div className="space-y-6">
        <header>
          <h1 className="text-2xl font-bold">Study</h1>
          <p className="text-sm text-slate-400">Pick an exam to see its knowledge-area study plan.</p>
        </header>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {EXAMS.map((e) => (
            <Link key={e.id} to={`/study/${e.id}`}>
              <Card className="h-full transition hover:border-brand-600/60">
                <Pill tone={toneFor(e.id)}>{e.authority}</Pill>
                <h2 className="mt-2 text-lg font-bold">{e.shortName}</h2>
                <p className="mt-1 text-sm text-slate-400">{e.blurb}</p>
                <div className="mt-3 text-xs text-slate-500">
                  {e.questionCount} questions · {Math.round(e.examMinutes / 60 * 10) / 10} h · {e.areas.length} areas
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  const exam = EXAM_BY_ID[examId];
  if (!exam) return <p>Unknown exam.</p>;
  const mastery = computeAreaMastery(attempts, lessons, examId);
  const masteryById = Object.fromEntries(mastery.map((m) => [m.areaId, m]));

  return (
    <div className="space-y-5">
      <header>
        <Link to="/study" className="text-xs text-slate-400 hover:underline">← All exams</Link>
        <h1 className="mt-1 text-2xl font-bold">{exam.name}</h1>
        <p className="text-sm text-slate-400">{exam.appointmentNote}</p>
      </header>

      <div className="space-y-3">
        {exam.areas.map((area) => {
          const m = masteryById[area.id];
          const areaLessons = lessonsForArea(area.id);
          return (
            <Card key={area.id}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-100">{area.name}</h3>
                    <Pill tone={toneFor(exam.id)}>{Math.round(area.weight * 100)}%{area.questionRange ? ` · ${area.questionRange} Q` : ''}</Pill>
                  </div>
                  <div className="mt-1 text-xs text-slate-500">{area.subtopics.length} subtopics</div>
                </div>
                <div className="w-28 flex-shrink-0">
                  <div className="mb-1 flex items-center justify-end gap-1">
                    <Pill tone={competency(m?.mastery ?? 0, m?.attempts ?? 0).tone}>
                      {competency(m?.mastery ?? 0, m?.attempts ?? 0).label}
                    </Pill>
                  </div>
                  <ProgressBar value={(m?.mastery ?? 0) * 100} tone={toneFor(exam.id)} />
                </div>
              </div>

              {areaLessons.length > 0 ? (
                <div className="mt-3 space-y-1.5">
                  {areaLessons.map((l) => {
                    const done = lessons[l.id]?.completed;
                    return (
                      <Link
                        key={l.id}
                        to={`/lesson/${l.id}`}
                        className="flex items-center justify-between rounded-lg border border-slate-800 px-3 py-2 text-sm transition hover:border-slate-600"
                      >
                        <span className="flex items-center gap-2">
                          <span className={done ? 'text-emerald-400' : 'text-slate-600'}>{done ? '✓' : '○'}</span>
                          <span className="text-slate-200">{l.title}</span>
                        </span>
                        <span className="text-xs text-slate-500">{l.estMinutes}m</span>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="mt-3 flex items-center justify-between rounded-lg border border-dashed border-slate-700 px-3 py-2 text-xs text-slate-500">
                  <span>Lesson content coming soon — practice questions available.</span>
                  <Link to={`/practice?exam=${exam.id}&area=${area.id}`} className="text-brand-400 hover:underline">
                    Practice →
                  </Link>
                </div>
              )}

              <details className="mt-2">
                <summary className="cursor-pointer text-xs text-slate-400 hover:text-slate-200">Subtopics</summary>
                <ul className="mt-1 list-disc pl-5 text-xs text-slate-400">
                  {area.subtopics.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </details>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
