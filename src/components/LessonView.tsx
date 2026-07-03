import type { Lesson } from '../types';
import { Blocks } from './Blocks';

const EXAM_SEARCH_CONTEXT: Record<string, string> = {
  'fe-civil': 'FE exam civil',
  'pe-geotech': 'PE exam geotechnical',
  'pe-wre': 'PE exam water resources environmental',
  'ca-seismic': 'seismic design ASCE 7 PE exam',
  'ca-surveying': 'surveying California PE exam',
};

/** Curated-search video link — always available, never a dead URL. */
function videoSearchUrl(lesson: Lesson): string {
  const q = `${lesson.title} ${EXAM_SEARCH_CONTEXT[lesson.examId] ?? 'PE exam'}`;
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`;
}

export function LessonView({ lesson }: { lesson: Lesson }) {
  return (
    <div className="space-y-4">
      <Blocks blocks={lesson.blocks} />

      {lesson.tips && lesson.tips.length > 0 && (
        <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
          <div className="mb-2 text-sm font-semibold text-amber-300">⏱ Exam-day tips</div>
          <ul className="list-disc space-y-1 pl-5 text-sm text-slate-300">
            {lesson.tips.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
        <div className="mb-2 text-sm font-semibold text-slate-200">🎬 Watch & learn</div>
        <ul className="space-y-1 text-sm">
          {(lesson.resources ?? []).map((r, i) => (
            <li key={i}>
              <a href={r.url} target="_blank" rel="noreferrer" className="text-brand-400 hover:underline">
                {r.label}
              </a>
              {r.source && <span className="ml-1 text-xs text-slate-500">({r.source})</span>}
            </li>
          ))}
          <li>
            <a href={videoSearchUrl(lesson)} target="_blank" rel="noreferrer" className="text-brand-400 hover:underline">
              Video walkthroughs: “{lesson.title}”
            </a>
            <span className="ml-1 text-xs text-slate-500">(curated YouTube search)</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
