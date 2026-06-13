import { NavLink, Outlet } from 'react-router-dom';
import { useProgress } from '../store/progress';

interface NavItem { to: string; label: string; icon: string; end?: boolean }

const primary: NavItem[] = [
  { to: '/', label: 'Home', icon: '◎', end: true },
  { to: '/study', label: 'Study', icon: '📚' },
  { to: '/practice', label: 'Practice', icon: '✎' },
  { to: '/mock', label: 'Mocks', icon: '⏱' },
  { to: '/flashcards', label: 'Cards', icon: '🃏' },
];
const secondary: NavItem[] = [
  { to: '/progress', label: 'Progress', icon: '📈' },
  { to: '/reference', label: 'Reference', icon: '📖' },
  { to: '/settings', label: 'Settings', icon: '⚙' },
];
const allNav = [...primary, ...secondary];

export function Layout() {
  const streak = useProgress((s) => s.streak);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-800 bg-slate-950/95 px-4 py-2.5 backdrop-blur md:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold">CA</div>
          <div className="text-sm font-bold">PE Civil Prep</div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-amber-400">🔥 {streak.current}</span>
          {secondary.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) => `text-lg ${isActive ? 'opacity-100' : 'opacity-50'}`}
              title={n.label}
            >
              {n.icon}
            </NavLink>
          ))}
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl gap-6 px-4 py-6">
        {/* Desktop sidebar */}
        <aside className="hidden w-56 flex-shrink-0 md:block">
          <div className="mb-5 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 font-bold">CA</div>
            <div>
              <div className="text-sm font-bold leading-tight">PE Civil Prep</div>
              <div className="text-[11px] text-slate-400">California licensure</div>
            </div>
          </div>
          <nav className="grid gap-1">
            {allNav.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.end}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${
                    isActive ? 'bg-brand-600/20 font-semibold text-brand-200' : 'text-slate-300 hover:bg-slate-800/60'
                  }`
                }
              >
                <span className="w-4 text-center">{n.icon}</span>
                {n.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-5 rounded-lg border border-slate-800 bg-slate-900/60 p-3 text-center">
            <div className="text-2xl font-bold text-amber-400">🔥 {streak.current}</div>
            <div className="text-xs text-slate-400">day streak · best {streak.longest}</div>
          </div>
        </aside>

        {/* Content */}
        <main className="min-w-0 flex-1 pb-24 md:pb-0">
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom tab bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 grid grid-cols-5 border-t border-slate-800 bg-slate-950/95 backdrop-blur md:hidden">
        {primary.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            end={n.end}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 py-2 text-[10px] ${isActive ? 'text-brand-300' : 'text-slate-400'}`
            }
          >
            <span className="text-lg">{n.icon}</span>
            {n.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
