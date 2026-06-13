import { useMemo, useState } from 'react';
import { FLASHCARDS } from '../data/flashcards';
import { EXAMS } from '../data/exams';
import { useProgress } from '../store/progress';
import { isDue } from '../lib/srs';
import { RichText } from '../components/Tex';
import { Card, Pill } from '../components/ui';

export function Flashcards() {
  const { cards, reviewCard } = useProgress();
  const [exam, setExam] = useState('');
  const [flipped, setFlipped] = useState(false);
  const [pos, setPos] = useState(0);

  // Build today's queue: due cards first, then unseen cards.
  const queue = useMemo(() => {
    const pool = FLASHCARDS.filter((c) => !exam || c.examId === exam);
    const due = pool.filter((c) => cards[c.id] && isDue(cards[c.id]));
    const unseen = pool.filter((c) => !cards[c.id]);
    return [...due, ...unseen];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exam]);

  const card = queue[pos];

  const grade = (g: number) => {
    if (!card) return;
    reviewCard(card.id, g);
    setFlipped(false);
    setPos((p) => p + 1);
  };

  return (
    <div className="space-y-5">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Flashcards</h1>
          <p className="text-sm text-slate-400">Spaced repetition keeps formulas in long-term memory.</p>
        </div>
      </header>

      <div className="flex flex-wrap gap-2">
        <FilterBtn active={exam === ''} onClick={() => { setExam(''); setPos(0); setFlipped(false); }}>All</FilterBtn>
        {EXAMS.map((e) => (
          <FilterBtn key={e.id} active={exam === e.id} onClick={() => { setExam(e.id); setPos(0); setFlipped(false); }}>
            {e.shortName}
          </FilterBtn>
        ))}
      </div>

      {!card ? (
        <Card>
          <div className="py-8 text-center">
            <div className="text-4xl">🎉</div>
            <p className="mt-2 font-semibold">You’re caught up!</p>
            <p className="text-sm text-slate-400">No cards due right now. Come back later or switch decks.</p>
          </div>
        </Card>
      ) : (
        <>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Card {pos + 1} of {queue.length}</span>
            <Pill>{cards[card.id] ? 'review' : 'new'}</Pill>
          </div>

          <button
            onClick={() => setFlipped((f) => !f)}
            className="flex min-h-[200px] w-full flex-col items-center justify-center rounded-2xl border border-slate-700 bg-slate-900/60 p-8 text-center transition hover:border-slate-500"
          >
            {!flipped ? (
              <>
                <div className="text-xs uppercase tracking-wide text-slate-500">Front</div>
                <div className="mt-3 text-lg font-semibold text-slate-100">{card.front}</div>
                <div className="mt-4 text-xs text-slate-500">tap to reveal</div>
              </>
            ) : (
              <>
                <div className="text-xs uppercase tracking-wide text-slate-500">Answer</div>
                <div className="mt-3 text-xl text-emerald-300">
                  <RichText html={card.back} className="text-xl" />
                </div>
              </>
            )}
          </button>

          {flipped && (
            <div className="grid grid-cols-4 gap-2">
              <GradeBtn color="rose" label="Again" onClick={() => grade(0)} />
              <GradeBtn color="amber" label="Hard" onClick={() => grade(3)} />
              <GradeBtn color="brand" label="Good" onClick={() => grade(4)} />
              <GradeBtn color="emerald" label="Easy" onClick={() => grade(5)} />
            </div>
          )}
        </>
      )}
    </div>
  );
}

function GradeBtn({ color, label, onClick }: { color: string; label: string; onClick: () => void }) {
  const cls: Record<string, string> = {
    rose: 'bg-rose-600/80 hover:bg-rose-600',
    amber: 'bg-amber-600/80 hover:bg-amber-600',
    brand: 'bg-brand-600/80 hover:bg-brand-600',
    emerald: 'bg-emerald-600/80 hover:bg-emerald-600',
  };
  return (
    <button onClick={onClick} className={`rounded-lg py-2.5 text-sm font-semibold text-white ${cls[color]}`}>
      {label}
    </button>
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
