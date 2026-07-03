import { useMemo, useState } from 'react';
import { REFERENCE } from '../data/reference';
import { Blocks } from './Blocks';

// Docked, searchable reference panel for exam mode — replicates having the
// searchable NCEES handbook beside the question on the real CBT. Practicing
// lookup speed here transfers directly to exam day.
export function ExamReferencePanel({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return REFERENCE;
    return REFERENCE.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q) ||
        e.keywords.some((k) => k.includes(q)),
    );
  }, [query]);

  return (
    <div className="fixed inset-y-0 right-0 z-30 flex w-full max-w-md flex-col border-l border-slate-700 bg-slate-950 shadow-2xl">
      <div className="flex items-center gap-2 border-b border-slate-800 p-3">
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search the reference… (e.g. bearing, Cs, curve)"
          className="min-w-0 flex-1 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none focus:border-brand-500"
        />
        <button onClick={onClose} className="flex-shrink-0 rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300">
          ✕
        </button>
      </div>
      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3">
        {results.length === 0 && <p className="text-sm text-slate-500">No matches.</p>}
        {results.map((e) => (
          <div key={e.id} className="rounded-lg border border-slate-800 bg-slate-900/60">
            <button
              onClick={() => setOpenId(openId === e.id ? null : e.id)}
              className="flex w-full items-center justify-between px-3 py-2 text-left text-sm"
            >
              <span>
                <span className="font-semibold text-slate-100">{e.title}</span>
                <span className="ml-2 text-xs text-slate-500">{e.category}</span>
              </span>
              <span className="text-slate-500">{openId === e.id ? '▾' : '▸'}</span>
            </button>
            {openId === e.id && (
              <div className="border-t border-slate-800 p-3">
                <Blocks blocks={e.blocks} />
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="border-t border-slate-800 p-2 text-center text-[10px] text-slate-500">
        Train your lookup speed — on the real CBT the clock runs while you search.
      </div>
    </div>
  );
}
