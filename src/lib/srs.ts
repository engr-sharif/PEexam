// Minimal SM-2 spaced repetition scheduler.
// grade: 0 = "Again", 3 = "Hard", 4 = "Good", 5 = "Easy" (0..5).

export interface CardState {
  reps: number;
  intervalDays: number;
  ease: number; // ease factor, starts 2.5
  due: number; // epoch ms
  lastGrade?: number;
}

export function newCard(): CardState {
  return { reps: 0, intervalDays: 0, ease: 2.5, due: Date.now() };
}

const DAY = 24 * 60 * 60 * 1000;

export function schedule(state: CardState, grade: number): CardState {
  const s = { ...state, lastGrade: grade };
  if (grade < 3) {
    // lapse: reset reps, review again soon (~10 min)
    s.reps = 0;
    s.intervalDays = 0;
    s.due = Date.now() + 10 * 60 * 1000;
    s.ease = Math.max(1.3, s.ease - 0.2);
    return s;
  }
  s.reps += 1;
  if (s.reps === 1) s.intervalDays = 1;
  else if (s.reps === 2) s.intervalDays = 6;
  else s.intervalDays = Math.round(s.intervalDays * s.ease);

  // ease update per SM-2
  s.ease = Math.max(
    1.3,
    s.ease + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02)),
  );
  s.due = Date.now() + s.intervalDays * DAY;
  return s;
}

export function isDue(state: CardState, now = Date.now()): boolean {
  return state.due <= now;
}
