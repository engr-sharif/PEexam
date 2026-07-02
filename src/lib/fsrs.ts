/**
 * FSRS-4.5 (Free Spaced Repetition Scheduler) — self-contained implementation.
 *
 * FSRS is the modern successor to SM-2 (the algorithm classic Anki used).
 * It models each card with two memory variables:
 *
 *   - Stability (S): the number of days after which the probability of
 *     recalling the card drops to 90%.
 *   - Difficulty (D): a value in [1, 10] describing how hard the card is;
 *     higher difficulty slows down stability growth.
 *
 * Predicted recall probability follows a power forgetting curve:
 *
 *   R(t, S) = (1 + FACTOR * t / S) ^ DECAY
 *
 * with DECAY = -0.5 and FACTOR = 19/81, so that R(S, S) = 0.9 exactly.
 * The next interval is chosen so the card comes due when predicted recall
 * falls to the requested retention (0.9):
 *
 *   I(S) = (S / FACTOR) * (r^(1/DECAY) - 1)   // = S when r = 0.9
 *
 * All timestamps are epoch milliseconds. Every function takes an explicit
 * `now` (defaulting to Date.now()) so scheduling is fully testable.
 *
 * No external dependencies.
 */

/**
 * Default FSRS-4.5 model weights (the published 17-parameter w[] vector),
 * as trained on large-scale Anki review data by the FSRS project.
 *
 * w[0..3]  initial stability S0(G) for grades Again/Hard/Good/Easy
 * w[4..5]  initial difficulty: D0(G) = w4 - (G - 3) * w5
 * w[6..7]  difficulty update step and mean-reversion strength
 * w[8..10] recall-stability growth (scale, S exponent, retrievability term)
 * w[11..14] post-lapse stability (scale, D exponent, S exponent, R term)
 * w[15]    hard penalty (multiplier < 1 applied when grade = Hard)
 * w[16]    easy bonus (multiplier > 1 applied when grade = Easy)
 */
const W: readonly number[] = [
  0.4872, 1.4003, 3.7145, 13.8206, 5.1618, 1.2298, 0.8975, 0.031, 1.6474,
  0.1367, 1.0461, 2.1072, 0.0793, 0.3246, 1.587, 0.2272, 2.8755,
];

/** Exponent of the power forgetting curve. */
const DECAY = -0.5;
/** Chosen so that R(S, S) = 0.9, i.e. FACTOR = 0.9^(1/DECAY) - 1 = 19/81. */
const FACTOR = 19 / 81;
/** Desired recall probability at the moment a card comes due. */
const REQUEST_RETENTION = 0.9;
/** Interval bounds, in days. */
const MIN_INTERVAL_DAYS = 1;
const MAX_INTERVAL_DAYS = 365;
/** "Again" re-learning step: come back in ~10 minutes. */
const AGAIN_DELAY_MS = 10 * 60 * 1000;

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Scheduling state for a single card.
 *
 * - `due`        epoch ms at which the card should next be reviewed
 * - `stability`  memory stability S in days (0 until first review)
 * - `difficulty` card difficulty D in [1, 10] (0 until first review)
 * - `reps`       total number of reviews performed
 * - `lapses`     number of times the card was graded Again (forgotten)
 * - `lastReview` epoch ms of the most recent review, or null if never reviewed
 */
export interface FsrsCard {
  due: number;
  stability: number;
  difficulty: number;
  reps: number;
  lapses: number;
  lastReview: number | null;
}

/** Clamp helper. */
function clamp(x: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, x));
}

/** Initial difficulty after the first rating: D0(G) = w4 - (G - 3) * w5, clamped to [1, 10]. */
function initDifficulty(grade: number): number {
  return clamp(W[4] - (grade - 3) * W[5], 1, 10);
}

/**
 * Difficulty update with mean reversion toward D0(Easy):
 *   D' = D - w6 * (G - 3)
 *   D'' = w7 * D0(4) + (1 - w7) * D'   (clamped to [1, 10])
 */
function nextDifficulty(d: number, grade: number): number {
  const next = d - W[6] * (grade - 3);
  return clamp(W[7] * initDifficulty(4) + (1 - W[7]) * next, 1, 10);
}

/**
 * Stability growth after a successful recall (grade >= 2):
 *   S' = S * (1 + e^w8 * (11 - D) * S^-w9 * (e^(w10*(1-R)) - 1) * hardPenalty * easyBonus)
 * where hardPenalty = w15 for Hard, easyBonus = w16 for Easy.
 */
function nextRecallStability(d: number, s: number, r: number, grade: number): number {
  const hardPenalty = grade === 2 ? W[15] : 1;
  const easyBonus = grade === 4 ? W[16] : 1;
  return (
    s *
    (1 +
      Math.exp(W[8]) *
        (11 - d) *
        Math.pow(s, -W[9]) *
        (Math.exp(W[10] * (1 - r)) - 1) *
        hardPenalty *
        easyBonus)
  );
}

/**
 * Post-lapse stability after the card is forgotten (grade = Again):
 *   S'_f = w11 * D^-w12 * ((S + 1)^w13 - 1) * e^(w14*(1-R))
 * Never allowed to exceed the pre-lapse stability.
 */
function nextForgetStability(d: number, s: number, r: number): number {
  const sf =
    W[11] *
    Math.pow(d, -W[12]) *
    (Math.pow(s + 1, W[13]) - 1) *
    Math.exp(W[14] * (1 - r));
  return Math.min(Math.max(sf, 0.01), s);
}

/**
 * Convert a stability (days) into the next review interval in whole days,
 * targeting REQUEST_RETENTION: I = (S / FACTOR) * (r^(1/DECAY) - 1),
 * rounded and clamped to [1, 365]. At r = 0.9 this simplifies to I = S.
 */
function nextIntervalDays(stability: number): number {
  const interval =
    (stability / FACTOR) * (Math.pow(REQUEST_RETENTION, 1 / DECAY) - 1);
  return clamp(Math.round(interval), MIN_INTERVAL_DAYS, MAX_INTERVAL_DAYS);
}

/**
 * Create a brand-new, never-reviewed card. The card is due immediately
 * (`due = now`) so it appears in the next review session.
 *
 * @param now Current time in epoch ms (defaults to Date.now()).
 */
export function newFsrsCard(now: number = Date.now()): FsrsCard {
  return {
    due: now,
    stability: 0,
    difficulty: 0,
    reps: 0,
    lapses: 0,
    lastReview: null,
  };
}

/**
 * Apply a review grade to a card and return the rescheduled card
 * (the input card is not mutated).
 *
 * Grades: 1 = Again (forgot), 2 = Hard, 3 = Good, 4 = Easy.
 *
 * First review: stability is initialized to S0(G) = w[G-1] and difficulty to
 * D0(G). Later reviews: retrievability R at review time feeds the FSRS-4.5
 * update rules — recall grades grow stability, Again applies the post-lapse
 * stability formula and increments `lapses`.
 *
 * Scheduling: Again comes back in ~10 minutes; Hard/Good/Easy are scheduled
 * `I(S')` days out, clamped to [1, 365] days.
 *
 * @param card  Current card state.
 * @param grade Review grade (1 = Again, 2 = Hard, 3 = Good, 4 = Easy).
 * @param now   Review time in epoch ms (defaults to Date.now()).
 */
export function reviewFsrs(
  card: FsrsCard,
  grade: 1 | 2 | 3 | 4,
  now: number = Date.now()
): FsrsCard {
  let stability: number;
  let difficulty: number;

  if (card.lastReview === null || card.reps === 0) {
    // First review: seed memory state from the initial-stability/difficulty tables.
    stability = W[grade - 1];
    difficulty = initDifficulty(grade);
  } else {
    const r = retrievability(card, now);
    difficulty = nextDifficulty(card.difficulty, grade);
    stability =
      grade === 1
        ? nextForgetStability(card.difficulty, card.stability, r)
        : nextRecallStability(card.difficulty, card.stability, r, grade);
  }

  const due =
    grade === 1 ? now + AGAIN_DELAY_MS : now + nextIntervalDays(stability) * DAY_MS;

  return {
    due,
    stability,
    difficulty,
    reps: card.reps + 1,
    lapses: card.lapses + (grade === 1 ? 1 : 0),
    lastReview: now,
  };
}

/**
 * Whether the card is due for review at `now` (i.e. `now >= card.due`).
 * New cards are due immediately.
 *
 * @param card Card to check.
 * @param now  Current time in epoch ms (defaults to Date.now()).
 */
export function fsrsIsDue(card: FsrsCard, now: number = Date.now()): boolean {
  return now >= card.due;
}

/**
 * Predicted probability (0..1) of recalling the card right now, per the
 * power forgetting curve R(t, S) = (1 + FACTOR * t / S)^DECAY where t is
 * the elapsed time since the last review in days.
 *
 * Returns 1 for cards that have never been reviewed (nothing to forget yet);
 * decays from 1 at the moment of review toward 0 as time passes.
 *
 * @param card Card to evaluate.
 * @param now  Current time in epoch ms (defaults to Date.now()).
 */
export function retrievability(card: FsrsCard, now: number = Date.now()): number {
  if (card.lastReview === null || card.stability <= 0) return 1;
  const elapsedDays = Math.max(0, (now - card.lastReview) / DAY_MS);
  return Math.pow(1 + (FACTOR * elapsedDays) / card.stability, DECAY);
}
