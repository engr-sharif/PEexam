import { NavLink, Outlet } from 'react-router-dom';
import { useProgress } from '../store/progress';

const nav = [
  { to: '/', label: 'Dashboard', icon: '◎', end: true },
  { to: '/study', label: 'Study', icon: '📚' },
  { to: '/practice', label: 'Practice', icon: '✎' },
  { to: '/mock', label: 'Mock Exams', icon: '⏱' },
  { to: '/flashcards', label: 'Flashcards', icon: '🃏' },
  { to: '/progress', label: 'Progress', icon: '📈' },
  { to: '/reference', label: 'Reference', icon: '📖' },
  { to: '/settings', label: 'Settings', icon: '⚙' },
];

export function Layout() {
  const streak = useProgress((s) => s.streak);
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 md:flex-row">
        <aside className="md:w-56 md:flex-shrink-0">
          <div className="mb-5 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 font-bold">CA</div>
            <div>
              <div className="text-sm font-bold leading-tight">PE Civil Prep</div>
              <div className="text-[11px] text-slate-400">California licensure</div>
            </div>
          </div>
          <nav className="grid grid-cols-2 gap-1 md:grid-cols-1">
            {nav.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.end}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${
                    isActive
                      ? 'bg-brand-600/20 font-semibold text-brand-200'
                      : 'text-slate-300 hover:bg-slate-800/60'
                  }`
                }
              >
                <span className="w-4 text-center">{n.icon}</span>
                {n.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-5 hidden rounded-lg border border-slate-800 bg-slate-900/60 p-3 text-center md:block">
            <div className="text-2xl font-bold text-amber-400">🔥 {streak.current}</div>
            <div className="text-xs text-slate-400">day streak</div>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
