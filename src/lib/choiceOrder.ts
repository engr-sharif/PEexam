import type { Question } from '../types';

// Deterministic per-question shuffle of the choice display order.
// Kills answer-position bias (like the real CBT) while keeping letters stable
// for a given question across practice, mocks, and review screens.
// Returns an array of ORIGINAL indices in display order.
export function choiceOrder(q: Question): number[] {
  let h = 2166136261;
  for (let i = 0; i < q.id.length; i++) {
    h ^= q.id.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const order = q.choices.map((_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    const j = (h >>> 16) % (i + 1);
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}

/** Display letter (A–D) of the correct answer under the shuffled order. */
export function answerLetter(q: Question): string {
  return 'ABCDE'[choiceOrder(q).indexOf(q.answerIndex)];
}
