// ---------------------------------------------------------------------------
// Monte Carlo exam simulator: samples thousands of virtual exams from your
// per-area Elo-predicted accuracy against the official blueprint weighting,
// and reports pass probability against an assumed cut score. Also answers
// "what if I improve area X?" for study-leverage ranking.
// ---------------------------------------------------------------------------

import type { Attempt } from '../store/progress';
import { EXAM_BY_ID } from '../data/exams';
import { QUESTIONS } from '../data/questions';
import { computeElo, pAreaCorrect, type EloState } from './elo';

/** Assumed passing fraction. NCEES/BPELSG cut scores are unpublished;
 * ~53–58% is the commonly reported band for PE Civil. We use 0.58 to be
 * conservative, plus a small margin of uncertainty in the simulation. */
export const CUT_SCORE = 0.58;
const TRIALS = 3000;

export interface SimResult {
  examId: string;
  passProb: number; // 0..1
  meanScore: number; // 0..1
  p10: number;
  p90: number;
  perArea: { areaId: string; name: string; p: number; questions: number }[];
  /** areas ranked by pass-probability gain if p is boosted by +0.10 */
  leverage: { areaId: string; name: string; gain: number }[];
}

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function runTrials(
  areaPs: { p: number; n: number }[],
  total: number,
  seed: number,
): { pass: number; scores: number[] } {
  const rand = mulberry32(seed);
  let pass = 0;
  const scores: number[] = [];
  for (let t = 0; t < TRIALS; t++) {
    let correct = 0;
    for (const { p, n } of areaPs) {
      // per-trial systematic wobble: your true ability on the day varies
      const dayEffect = (rand() - 0.5) * 0.08;
      const pd = Math.min(0.98, Math.max(0.02, p + dayEffect));
      for (let i = 0; i < n; i++) if (rand() < pd) correct++;
    }
    const score = correct / total;
    scores.push(score);
    if (score >= CUT_SCORE) pass++;
  }
  scores.sort((a, b) => a - b);
  return { pass, scores };
}

export function simulateExam(examId: string, attempts: Attempt[]): SimResult | null {
  const exam = EXAM_BY_ID[examId];
  if (!exam) return null;
  const elo: EloState = computeElo(attempts);

  const weightSum = exam.areas.reduce((s, a) => s + a.weight, 0);
  const perArea = exam.areas.map((a) => {
    const n = Math.max(1, Math.round((exam.questionCount * a.weight) / weightSum));
    return { areaId: a.id, name: a.name, p: pAreaCorrect(elo, a.id, QUESTIONS), questions: n };
  });
  const total = perArea.reduce((s, a) => s + a.questions, 0);

  const base = runTrials(
    perArea.map((a) => ({ p: a.p, n: a.questions })),
    total,
    12345,
  );

  // leverage: re-run with each area boosted by +0.10
  const leverage = perArea
    .map((target) => {
      const boosted = perArea.map((a) => ({
        p: a.areaId === target.areaId ? Math.min(0.98, a.p + 0.1) : a.p,
        n: a.questions,
      }));
      const res = runTrials(boosted, total, 12345); // same seed → paired comparison
      return {
        areaId: target.areaId,
        name: target.name,
        gain: (res.pass - base.pass) / TRIALS,
      };
    })
    .sort((a, b) => b.gain - a.gain)
    .slice(0, 3);

  return {
    examId,
    passProb: base.pass / TRIALS,
    meanScore: base.scores.reduce((s, x) => s + x, 0) / TRIALS,
    p10: base.scores[Math.floor(TRIALS * 0.1)],
    p90: base.scores[Math.floor(TRIALS * 0.9)],
    perArea,
    leverage,
  };
}
