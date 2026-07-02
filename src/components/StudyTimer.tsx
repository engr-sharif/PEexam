import { useEffect, useRef, useState } from 'react';
import { useProgress } from '../store/progress';

// A simple study-session timer. Logged minutes feed the activity chart and
// daily-goal tracking — your real "time on task".
export function StudyTimer() {
  const { addStudyMinutes, settings, minutesByDay } = useProgress();
  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const tick = useRef<number | null>(null);

  useEffect(() => {
    if (running) {
      tick.current = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    } else if (tick.current) {
      window.clearInterval(tick.current);
    }
    return () => {
      if (tick.current) window.clearInterval(tick.current);
    };
  }, [running]);

  const today = new Date().toISOString().slice(0, 10);
  const todayMins = minutesByDay[today] ?? 0;
  const goal = settings.dailyGoalMinutes;
  const goalPct = Math.min(100, Math.round((todayMins / goal) * 100));

  const log = () => {
    const mins = Math.round(seconds / 60);
    if (mins > 0) addStudyMinutes(mins);
    setSeconds(0);
    setRunning(false);
  };

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
      <div className="flex items-center justify-between">
        <div className="text-xs uppercase tracking-wide text-slate-400">Study timer</div>
        <div className="text-xs text-slate-400">
          Today: <span className="font-semibold text-slate-200">{todayMins}</span>/{goal} min
        </div>
      </div>
      <div className="mt-1 font-mono text-3xl font-bold tabular-nums">{mm}:{ss}</div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
        <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${goalPct}%` }} />
      </div>
      <div className="mt-3 flex gap-2">
        {!running ? (
          <button onClick={() => setRunning(true)} className="flex-1 rounded-lg bg-brand-600 px-3 py-2 text-sm font-semibold text-white">
            {seconds > 0 ? 'Resume' : 'Start'}
          </button>
        ) : (
          <button onClick={() => setRunning(false)} className="flex-1 rounded-lg bg-amber-600 px-3 py-2 text-sm font-semibold text-white">
            Pause
          </button>
        )}
        <button
          onClick={log}
          disabled={seconds < 60}
          className="flex-1 rounded-lg border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-200 disabled:opacity-40"
        >
          Log &amp; reset
        </button>
      </div>
    </div>
  );
}
