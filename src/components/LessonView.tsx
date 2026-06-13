import type { Lesson, LessonBlock } from '../types';
import { RichText, Tex } from './Tex';
import { Animation } from './animations/registry';

function Block({ block }: { block: LessonBlock }) {
  switch (block.kind) {
    case 'prose':
      return <RichText html={block.html} className="prose-content text-slate-300 leading-relaxed" />;
    case 'callout': {
      const tones = {
        tip: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-100',
        warn: 'border-amber-500/40 bg-amber-500/10 text-amber-100',
        key: 'border-brand-500/40 bg-brand-500/10 text-brand-100',
      } as const;
      const icon = { tip: '💡 Tip', warn: '⚠ Watch out', key: '🔑 Key idea' }[block.tone];
      return (
        <div className={`rounded-lg border px-4 py-3 ${tones[block.tone]}`}>
          <div className="mb-1 text-xs font-semibold uppercase tracking-wide opacity-80">{icon}</div>
          <RichText html={block.html} className="text-sm leading-relaxed" />
        </div>
      );
    }
    case 'formula':
      return (
        <div className="rounded-lg border border-slate-800 bg-slate-950/60 px-4 py-3 text-center">
          <Tex tex={block.tex} block />
          {block.caption && <div className="mt-1 text-xs text-slate-400">{block.caption}</div>}
        </div>
      );
    case 'example':
      return (
        <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-4">
          <div className="mb-2 text-sm font-semibold text-brand-300">📝 Worked example — {block.title}</div>
          <ol className="space-y-2">
            {block.steps.map((s, i) => (
              <li key={i} className="text-sm text-slate-300">
                <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-800 text-xs text-slate-400">{i + 1}</span>
                <RichText html={s.text} className="inline" />
                {s.tex && (
                  <div className="ml-7 mt-1">
                    <Tex tex={s.tex} block />
                  </div>
                )}
              </li>
            ))}
          </ol>
        </div>
      );
    case 'animation':
      return (
        <div>
          <Animation name={block.component} />
          {block.caption && <div className="mt-1 text-center text-xs text-slate-400">{block.caption}</div>}
        </div>
      );
    case 'table':
      return (
        <div className="overflow-x-auto">
          {block.caption && <div className="mb-1 text-xs text-slate-400">{block.caption}</div>}
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700 text-left text-slate-300">
                {block.headers.map((h) => (
                  <th key={h} className="px-3 py-1.5 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((r, i) => (
                <tr key={i} className="border-b border-slate-800/60 text-slate-300">
                  {r.map((c, j) => (
                    <td key={j} className="px-3 py-1.5 tabular-nums">{c}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    default:
      return null;
  }
}

export function LessonView({ lesson }: { lesson: Lesson }) {
  return (
    <div className="space-y-4">
      {lesson.blocks.map((b, i) => (
        <Block key={i} block={b} />
      ))}

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

      {lesson.resources && lesson.resources.length > 0 && (
        <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
          <div className="mb-2 text-sm font-semibold text-slate-200">🎬 Watch & learn</div>
          <ul className="space-y-1 text-sm">
            {lesson.resources.map((r, i) => (
              <li key={i}>
                <a href={r.url} target="_blank" rel="noreferrer" className="text-brand-400 hover:underline">
                  {r.label}
                </a>
                {r.source && <span className="ml-1 text-xs text-slate-500">({r.source})</span>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
