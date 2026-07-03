import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LESSONS } from '../data/lessons';
import { REFERENCE } from '../data/reference';
import { SOLVERS } from '../data/solvers';
import { EXAM_BY_ID } from '../data/exams';

interface Cmd {
  label: string;
  hint: string;
  to: string;
  keywords: string;
}

function buildIndex(): Cmd[] {
  const cmds: Cmd[] = [
    { label: 'Dashboard', hint: 'page', to: '/', keywords: 'home dashboard' },
    { label: "Today's Session", hint: 'page', to: '/today', keywords: 'daily session interleaved' },
    { label: 'Practice', hint: 'page', to: '/practice', keywords: 'quiz questions' },
    { label: 'Mock Exams', hint: 'page', to: '/mock', keywords: 'timed simulation cbt' },
    { label: 'MathLab', hint: 'page', to: '/mathlab', keywords: 'calculator solver worksheet' },
    { label: 'Review / Error log', hint: 'page', to: '/review', keywords: 'missed cram wrong' },
    { label: 'Flashcards', hint: 'page', to: '/flashcards', keywords: 'spaced repetition cards' },
    { label: 'Progress', hint: 'page', to: '/progress', keywords: 'analytics stats retention' },
    { label: 'Reference Handbook', hint: 'page', to: '/reference', keywords: 'formulas codes' },
    { label: 'Placement Diagnostic', hint: 'page', to: '/diagnostic', keywords: 'baseline placement' },
    { label: 'Settings', hint: 'page', to: '/settings', keywords: 'export import dates' },
  ];
  for (const l of LESSONS) {
    cmds.push({
      label: l.title,
      hint: `lesson · ${EXAM_BY_ID[l.examId]?.shortName}`,
      to: `/lesson/${l.id}`,
      keywords: `${l.objective} lesson`.toLowerCase(),
    });
  }
  for (const s of SOLVERS) {
    cmds.push({
      label: s.title,
      hint: `solver · ${s.category}`,
      to: '/mathlab',
      keywords: `${s.description} solver calculator`.toLowerCase(),
    });
  }
  for (const r of REFERENCE) {
    cmds.push({
      label: r.title,
      hint: `reference · ${r.category}`,
      to: '/reference',
      keywords: r.keywords.join(' '),
    });
  }
  return cmds;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [sel, setSel] = useState(0);
  const navigate = useNavigate();
  const index = useMemo(buildIndex, []);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
        setQuery('');
        setSel(0);
      } else if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return index.slice(0, 9);
    const terms = q.split(/\s+/);
    return index
      .map((c) => {
        const hay = `${c.label.toLowerCase()} ${c.keywords}`;
        let score = 0;
        for (const t of terms) {
          if (c.label.toLowerCase().startsWith(t)) score += 3;
          else if (c.label.toLowerCase().includes(t)) score += 2;
          else if (hay.includes(t)) score += 1;
          else return null;
        }
        return { c, score };
      })
      .filter((x): x is { c: Cmd; score: number } => x !== null)
      .sort((a, b) => b.score - a.score)
      .slice(0, 9)
      .map((x) => x.c);
  }, [query, index]);

  const go = (c: Cmd) => {
    setOpen(false);
    navigate(c.to);
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/70 p-4 pt-[12vh]" onClick={() => setOpen(false)}>
      <div className="w-full max-w-lg overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <input
          ref={inputRef}
          autoFocus
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSel(0);
          }}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') setSel((s) => Math.min(s + 1, results.length - 1));
            else if (e.key === 'ArrowUp') setSel((s) => Math.max(s - 1, 0));
            else if (e.key === 'Enter' && results[sel]) go(results[sel]);
          }}
          placeholder="Jump to any lesson, formula, solver, or page…"
          className="w-full border-b border-slate-800 bg-transparent px-4 py-3 text-sm text-slate-100 outline-none"
        />
        <div className="max-h-80 overflow-y-auto p-1.5">
          {results.map((c, i) => (
            <button
              key={c.to + c.label}
              onClick={() => go(c)}
              onMouseEnter={() => setSel(i)}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm ${
                i === sel ? 'bg-brand-600/20 text-brand-100' : 'text-slate-300'
              }`}
            >
              <span className="truncate">{c.label}</span>
              <span className="ml-3 flex-shrink-0 text-xs text-slate-500">{c.hint}</span>
            </button>
          ))}
          {results.length === 0 && <p className="px-3 py-4 text-sm text-slate-500">No matches.</p>}
        </div>
        <div className="border-t border-slate-800 px-3 py-1.5 text-[10px] text-slate-500">↑↓ navigate · Enter open · Esc close</div>
      </div>
    </div>
  );
}
