import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CardState } from '../lib/srs';
import { newCard, schedule } from '../lib/srs';

// ---------------------------------------------------------------------------
// All learner progress lives here and is persisted to localStorage. This is
// the "memory" the adaptive engine reads to learn how YOU learn.
// ---------------------------------------------------------------------------

export interface Attempt {
  id: string; // unique
  questionId: string;
  examId: string;
  areaId: string;
  correct: boolean;
  timeMs: number;
  /** self-rated confidence before/after answering, 1..3 (optional) */
  confidence?: number;
  at: number; // epoch ms
  /** 'practice' | 'mock' | 'review' */
  mode: string;
}

export interface LessonProgress {
  completed: boolean;
  confidence?: number; // 1..5 self rating
  lastViewed: number;
  views: number;
}

export interface MockResult {
  id: string;
  examId: string;
  at: number;
  score: number; // 0..1
  correct: number;
  total: number;
  durationMs: number;
  /** per-area correct/total */
  byArea: Record<string, { correct: number; total: number }>;
  /** snapshot of answers for review */
  answers: { questionId: string; chosen: number | null; correct: boolean }[];
}

export interface Settings {
  dailyGoalMinutes: number;
  primaryExam: string;
  showTimerWarnings: boolean;
  /** Target exam dates, keyed by examId (YYYY-MM-DD). */
  examDates: Record<string, string>;
}

export interface Streak {
  current: number;
  longest: number;
  lastDay: string | null; // YYYY-MM-DD
}

interface ProgressState {
  attempts: Attempt[];
  lessons: Record<string, LessonProgress>;
  cards: Record<string, CardState>;
  mocks: MockResult[];
  settings: Settings;
  streak: Streak;
  // minutes studied per day, YYYY-MM-DD -> minutes
  minutesByDay: Record<string, number>;

  recordAttempt: (a: Omit<Attempt, 'id' | 'at'>) => void;
  setLessonProgress: (lessonId: string, patch: Partial<LessonProgress>) => void;
  reviewCard: (cardId: string, grade: number) => void;
  cardState: (cardId: string) => CardState;
  recordMock: (r: Omit<MockResult, 'id' | 'at'>) => void;
  addStudyMinutes: (mins: number) => void;
  updateSettings: (patch: Partial<Settings>) => void;
  resetAll: () => void;
  importState: (json: string) => boolean;
  exportState: () => string;
}

function todayKey(d = new Date()): string {
  return d.toISOString().slice(0, 10);
}

function bumpStreak(streak: Streak): Streak {
  const today = todayKey();
  if (streak.lastDay === today) return streak;
  const yesterday = todayKey(new Date(Date.now() - 86400000));
  const current = streak.lastDay === yesterday ? streak.current + 1 : 1;
  return {
    current,
    longest: Math.max(streak.longest, current),
    lastDay: today,
  };
}

const DEFAULT_SETTINGS: Settings = {
  dailyGoalMinutes: 45,
  primaryExam: 'pe-geotech',
  showTimerWarnings: true,
  examDates: {},
};

export const useProgress = create<ProgressState>()(
  persist(
    (set, get) => ({
      attempts: [],
      lessons: {},
      cards: {},
      mocks: [],
      settings: DEFAULT_SETTINGS,
      streak: { current: 0, longest: 0, lastDay: null },
      minutesByDay: {},

      recordAttempt: (a) =>
        set((st) => {
          const attempt: Attempt = {
            ...a,
            id: `${a.questionId}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            at: Date.now(),
          };
          // cap history to keep storage bounded
          const attempts = [...st.attempts, attempt].slice(-3000);
          return { attempts, streak: bumpStreak(st.streak) };
        }),

      setLessonProgress: (lessonId, patch) =>
        set((st) => {
          const prev = st.lessons[lessonId] ?? {
            completed: false,
            lastViewed: 0,
            views: 0,
          };
          return {
            lessons: {
              ...st.lessons,
              [lessonId]: {
                ...prev,
                ...patch,
                lastViewed: Date.now(),
                views: prev.views + (patch.views === undefined ? 1 : 0),
              },
            },
            streak: bumpStreak(st.streak),
          };
        }),

      cardState: (cardId) => get().cards[cardId] ?? newCard(),

      reviewCard: (cardId, grade) =>
        set((st) => {
          const cur = st.cards[cardId] ?? newCard();
          return {
            cards: { ...st.cards, [cardId]: schedule(cur, grade) },
            streak: bumpStreak(st.streak),
          };
        }),

      recordMock: (r) =>
        set((st) => {
          const result: MockResult = {
            ...r,
            id: `mock-${Date.now()}`,
            at: Date.now(),
          };
          return {
            mocks: [...st.mocks, result].slice(-50),
            streak: bumpStreak(st.streak),
          };
        }),

      addStudyMinutes: (mins) =>
        set((st) => {
          const key = todayKey();
          return {
            minutesByDay: {
              ...st.minutesByDay,
              [key]: (st.minutesByDay[key] ?? 0) + mins,
            },
          };
        }),

      updateSettings: (patch) =>
        set((st) => ({ settings: { ...st.settings, ...patch } })),

      resetAll: () =>
        set({
          attempts: [],
          lessons: {},
          cards: {},
          mocks: [],
          settings: DEFAULT_SETTINGS,
          streak: { current: 0, longest: 0, lastDay: null },
          minutesByDay: {},
        }),

      exportState: () => {
        const { attempts, lessons, cards, mocks, settings, streak, minutesByDay } =
          get();
        return JSON.stringify(
          { version: 1, attempts, lessons, cards, mocks, settings, streak, minutesByDay },
          null,
          2,
        );
      },

      importState: (json) => {
        try {
          const d = JSON.parse(json);
          set({
            attempts: d.attempts ?? [],
            lessons: d.lessons ?? {},
            cards: d.cards ?? {},
            mocks: d.mocks ?? [],
            settings: { ...DEFAULT_SETTINGS, ...(d.settings ?? {}) },
            streak: d.streak ?? { current: 0, longest: 0, lastDay: null },
            minutesByDay: d.minutesByDay ?? {},
          });
          return true;
        } catch {
          return false;
        }
      },
    }),
    { name: 'ca-pe-prep-progress' },
  ),
);
