import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { FsrsCard } from '../lib/fsrs';
import { newFsrsCard, reviewFsrs } from '../lib/fsrs';
import { getActiveProfile, storageKeyFor } from '../lib/profile';

/** Convert a legacy SM-2 card (pre-FSRS) into an FSRS card on the fly. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toFsrs(c: any): FsrsCard {
  if (c && typeof c.stability === 'number') return c as FsrsCard;
  return {
    due: c?.due ?? Date.now(),
    stability: Math.max(0.5, c?.intervalDays ?? 0.5),
    difficulty: 5,
    reps: c?.reps ?? 0,
    lapses: 0,
    lastReview: null,
  };
}

// ---------------------------------------------------------------------------
// All learner progress lives here and is persisted to localStorage. This is
// the "memory" the adaptive engine reads to learn how YOU learn.
// ---------------------------------------------------------------------------

export type ErrorType = 'concept' | 'arithmetic' | 'misread' | 'time';

export interface Attempt {
  id: string; // unique
  questionId: string;
  examId: string;
  areaId: string;
  correct: boolean;
  timeMs: number;
  /** self-rated confidence before/after answering, 1..3 (optional) */
  confidence?: number;
  /** self-tagged failure mode for incorrect answers */
  errorType?: ErrorType;
  at: number; // epoch ms
  /** 'practice' | 'mock' | 'review' | 'diagnostic' | 'session' */
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
  cards: Record<string, FsrsCard>;
  mocks: MockResult[];
  settings: Settings;
  streak: Streak;
  // minutes studied per day, YYYY-MM-DD -> minutes
  minutesByDay: Record<string, number>;

  recordAttempt: (a: Omit<Attempt, 'id' | 'at'>) => void;
  /** Tag the most recent attempt on a question with a failure mode. */
  tagAttemptError: (questionId: string, errorType: ErrorType) => void;
  setLessonProgress: (lessonId: string, patch: Partial<LessonProgress>) => void;
  reviewCard: (cardId: string, grade: 1 | 2 | 3 | 4) => void;
  cardState: (cardId: string) => FsrsCard;
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

      tagAttemptError: (questionId, errorType) =>
        set((st) => {
          for (let i = st.attempts.length - 1; i >= 0; i--) {
            if (st.attempts[i].questionId === questionId) {
              const attempts = [...st.attempts];
              attempts[i] = { ...attempts[i], errorType };
              return { attempts };
            }
          }
          return {};
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

      cardState: (cardId) => toFsrs(get().cards[cardId]) ?? newFsrsCard(),

      reviewCard: (cardId, grade) =>
        set((st) => {
          const cur = st.cards[cardId] ? toFsrs(st.cards[cardId]) : newFsrsCard();
          return {
            cards: { ...st.cards, [cardId]: reviewFsrs(cur, grade) },
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
    { name: storageKeyFor(getActiveProfile()) },
  ),
);
