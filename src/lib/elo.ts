// ---------------------------------------------------------------------------
// Elo skill model: every question has a difficulty rating; the learner has a
// rating per knowledge area. Each attempt is a "match" — beating a hard
// question moves your rating more than beating an easy one. This is the same
// family of model used by chess and modern adaptive-learning platforms.
//
// Ratings are recomputed deterministically from the full attempt history
// (order matters), so no extra persisted state is needed.
// ---------------------------------------------------------------------------

import type { Attempt } from '../store/progress';
import type { Question } from '../types';
import { QUESTION_BY_ID } from '../data/questions';

export const BASE_RATING = 1200;

/** Question difficulty prior by authored difficulty tier. */
const DIFF_RATING: Record<Question['difficulty'], number> = {
  easy: 1050,
  medium: 1250,
  hard: 1450,
};

const K_LEARNER = 40; // learner adapts fast (few attempts per area)
const K_ITEM = 12; // items drift slowly toward observed difficulty

export interface EloState {
  /** learner rating per areaId */
  areas: Record<string, number>;
  /** question rating per questionId (starts at difficulty prior) */
  items: Record<string, number>;
  /** attempts seen per area (confidence) */
  counts: Record<string, number>;
}

export function expectedScore(learner: number, item: number): number {
  return 1 / (1 + Math.pow(10, (item - learner) / 400));
}

/** Replay the attempt history into ratings. */
export function computeElo(attempts: Attempt[]): EloState {
  const areas: Record<string, number> = {};
  const items: Record<string, number> = {};
  const counts: Record<string, number> = {};

  for (const a of attempts) {
    const q = QUESTION_BY_ID[a.questionId];
    if (!q) continue;
    const learner = areas[a.areaId] ?? BASE_RATING;
    const item = items[a.questionId] ?? DIFF_RATING[q.difficulty];
    const exp = expectedScore(learner, item);
    const score = a.correct ? 1 : 0;
    areas[a.areaId] = learner + K_LEARNER * (score - exp);
    items[a.questionId] = item - K_ITEM * (score - exp);
    counts[a.areaId] = (counts[a.areaId] ?? 0) + 1;
  }
  return { areas, items, counts };
}

/** Rating for an area, falling back to the base rating. */
export function areaRating(elo: EloState, areaId: string): number {
  return elo.areas[areaId] ?? BASE_RATING;
}

/** Predicted probability of answering a specific question correctly. */
export function pCorrect(elo: EloState, q: Question): number {
  const learner = areaRating(elo, q.areaId);
  const item = elo.items[q.id] ?? DIFF_RATING[q.difficulty];
  return expectedScore(learner, item);
}

/**
 * Predicted probability of answering a random blueprint question in an area,
 * i.e. against a "typical" item of each difficulty tier weighted like the
 * bank. Shrinks toward the base expectation when the area has few attempts.
 */
export function pAreaCorrect(
  elo: EloState,
  areaId: string,
  bank: Question[],
): number {
  const learner = areaRating(elo, areaId);
  const areaQs = bank.filter((q) => q.areaId === areaId);
  if (areaQs.length === 0) return 0.5;
  let p = 0;
  for (const q of areaQs) {
    p += expectedScore(learner, elo.items[q.id] ?? DIFF_RATING[q.difficulty]);
  }
  p /= areaQs.length;
  // low-data shrinkage toward a conservative 0.45 baseline
  const n = elo.counts[areaId] ?? 0;
  const conf = Math.min(1, n / 8);
  return conf * p + (1 - conf) * 0.45;
}

/** Human label for a rating, mirroring the competency scale. */
export function ratingLabel(r: number): string {
  if (r < 1100) return 'Novice';
  if (r < 1250) return 'Developing';
  if (r < 1400) return 'Proficient';
  return 'Exam-ready';
}
