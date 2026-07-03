import type { Attempt, LessonProgress } from '../store/progress';
import { EXAMS, EXAM_BY_ID, areaById } from '../data/exams';
import { lessonsForArea } from '../data/lessons';
import { QUESTIONS } from '../data/questions';
import type { FsrsCard } from './fsrs';
import { fsrsIsDue as isDue } from './fsrs';

const HALF_LIFE_MS = 14 * 24 * 60 * 60 * 1000; // 14-day recency half-life

/** Recency weight: recent attempts count more (exponential decay). */
function recencyWeight(at: number, now: number): number {
  return Math.pow(0.5, (now - at) / HALF_LIFE_MS);
}

export interface AreaMastery {
  areaId: string;
  examId: string;
  name: string;
  weight: number;
  /** 0..1 recency-weighted accuracy, undefined if no data */
  accuracy: number | null;
  attempts: number;
  /** fraction of lessons in this area marked complete */
  lessonCoverage: number;
  /** 0..1 composite mastery used for readiness & recommendations */
  mastery: number;
}

/** Compute mastery for every area, optionally filtered to one exam. */
export function computeAreaMastery(
  attempts: Attempt[],
  lessons: Record<string, LessonProgress>,
  examId?: string,
): AreaMastery[] {
  const now = Date.now();
  const result: AreaMastery[] = [];
  const exams = examId ? EXAMS.filter((e) => e.id === examId) : EXAMS;

  for (const exam of exams) {
    for (const area of exam.areas) {
      const areaAttempts = attempts.filter((a) => a.areaId === area.id);
      let wSum = 0;
      let wCorrect = 0;
      for (const a of areaAttempts) {
        const w = recencyWeight(a.at, now);
        wSum += w;
        if (a.correct) wCorrect += w;
      }
      const accuracy = wSum > 0 ? wCorrect / wSum : null;

      const areaLessons = lessonsForArea(area.id);
      const done = areaLessons.filter((l) => lessons[l.id]?.completed).length;
      const lessonCoverage =
        areaLessons.length > 0 ? done / areaLessons.length : 0;

      // Composite mastery: blend accuracy (60%) and lesson coverage (40%).
      // Confidence in the accuracy term grows with number of attempts.
      const conf = Math.min(1, areaAttempts.length / 5);
      const accComponent = accuracy === null ? 0 : accuracy * conf;
      const mastery = 0.6 * accComponent + 0.4 * lessonCoverage;

      result.push({
        areaId: area.id,
        examId: exam.id,
        name: area.name,
        weight: area.weight,
        accuracy,
        attempts: areaAttempts.length,
        lessonCoverage,
        mastery,
      });
    }
  }
  return result;
}

export interface ExamReadiness {
  examId: string;
  name: string;
  shortName: string;
  /** 0..100 weighted readiness score */
  score: number;
  weakAreas: AreaMastery[];
  attempts: number;
}

export function computeReadiness(
  attempts: Attempt[],
  lessons: Record<string, LessonProgress>,
): ExamReadiness[] {
  const all = computeAreaMastery(attempts, lessons);
  return EXAMS.map((exam) => {
    const areas = all.filter((a) => a.examId === exam.id);
    const score =
      areas.reduce((s, a) => s + a.mastery * a.weight, 0) /
        areas.reduce((s, a) => s + a.weight, 0) || 0;
    const weakAreas = [...areas]
      .sort((a, b) => a.mastery - b.mastery)
      .slice(0, 3);
    const att = attempts.filter((a) => a.examId === exam.id).length;
    return {
      examId: exam.id,
      name: exam.name,
      shortName: exam.shortName,
      score: Math.round(score * 100),
      weakAreas,
      attempts: att,
    };
  });
}

export interface Recommendation {
  kind: 'lesson' | 'practice' | 'flashcards' | 'mock';
  examId: string;
  areaId?: string;
  title: string;
  reason: string;
  to: string; // route
  priority: number; // higher first
}

/** Surface the highest-leverage next actions: weak + heavily weighted areas. */
export function recommend(
  attempts: Attempt[],
  lessons: Record<string, LessonProgress>,
  cards: Record<string, FsrsCard>,
  primaryExam: string,
): Recommendation[] {
  const recs: Recommendation[] = [];
  const mastery = computeAreaMastery(attempts, lessons);

  // 1) Due flashcards
  const due = Object.entries(cards).filter(([, s]) => isDue(s)).length;
  if (due > 0) {
    recs.push({
      kind: 'flashcards',
      examId: primaryExam,
      title: `Review ${due} due flashcard${due > 1 ? 's' : ''}`,
      reason: 'Spaced repetition keeps formulas fresh — these are due today.',
      to: '/flashcards',
      priority: 90 + Math.min(due, 9),
    });
  }

  // 2) Open items in the error log (latest attempt wrong)
  const latest = new Map<string, { correct: boolean; examId: string }>();
  for (const a of attempts) latest.set(a.questionId, { correct: a.correct, examId: a.examId });
  const missed = [...latest.values()].filter((v) => !v.correct).length;
  if (missed >= 3) {
    recs.push({
      kind: 'practice',
      examId: primaryExam,
      title: `Fix ${missed} missed questions (cram mode)`,
      reason: 'Correcting your own misses is the highest-yield review there is.',
      to: '/review',
      priority: 80 + Math.min(missed, 10),
    });
  }

  // 3) Weakest high-weight areas (leverage = weight × (1 − mastery))
  const ranked = [...mastery]
    .map((m) => ({ m, leverage: m.weight * (1 - m.mastery) }))
    .sort((a, b) => b.leverage - a.leverage);

  for (const { m, leverage } of ranked.slice(0, 4)) {
    const areaLessons = lessonsForArea(m.areaId);
    const nextLesson = areaLessons.find((l) => !lessons[l.id]?.completed);
    const examBoost = m.examId === primaryExam ? 10 : 0;
    if (nextLesson && m.lessonCoverage < 1) {
      recs.push({
        kind: 'lesson',
        examId: m.examId,
        areaId: m.areaId,
        title: `Study: ${nextLesson.title}`,
        reason: `${m.name} is high-weight and one of your weaker areas.`,
        to: `/lesson/${nextLesson.id}`,
        priority: 60 + leverage * 100 + examBoost,
      });
    } else {
      recs.push({
        kind: 'practice',
        examId: m.examId,
        areaId: m.areaId,
        title: `Practice: ${m.name}`,
        reason:
          m.accuracy !== null
            ? `Your accuracy here is ${Math.round(m.accuracy * 100)}% — drill to lock it in.`
            : `High-weight area with no practice yet — get a baseline.`,
        to: `/practice?exam=${m.examId}&area=${m.areaId}`,
        priority: 55 + leverage * 100 + examBoost,
      });
    }
  }

  // 3) Suggest a mock once enough coverage exists
  const primaryReady =
    computeReadiness(attempts, lessons).find((r) => r.examId === primaryExam)
      ?.score ?? 0;
  if (primaryReady >= 35) {
    recs.push({
      kind: 'mock',
      examId: primaryExam,
      title: `Take a timed mock: ${EXAM_BY_ID[primaryExam]?.shortName}`,
      reason: 'You have enough coverage to benefit from a full timed simulation.',
      to: `/mock/${primaryExam}`,
      priority: 50,
    });
  }

  return recs.sort((a, b) => b.priority - a.priority).slice(0, 6);
}

// --------------------------- Learning insights -----------------------------
// "Learn from me on how I learn": surface patterns in the learner's behavior.

export interface LearningInsight {
  label: string;
  value: string;
  detail: string;
}

export function learningInsights(
  attempts: Attempt[],
  lessons: Record<string, LessonProgress>,
): LearningInsight[] {
  const insights: LearningInsight[] = [];
  if (attempts.length < 5) {
    insights.push({
      label: 'Getting to know you',
      value: 'Keep going',
      detail:
        'Answer more practice questions and I’ll start tailoring recommendations to how you learn.',
    });
    return insights;
  }

  // Best time of day (by accuracy across hour buckets)
  const buckets: Record<string, { c: number; n: number }> = {
    Morning: { c: 0, n: 0 },
    Afternoon: { c: 0, n: 0 },
    Evening: { c: 0, n: 0 },
    'Late night': { c: 0, n: 0 },
  };
  for (const a of attempts) {
    const h = new Date(a.at).getHours();
    const key =
      h < 12 ? 'Morning' : h < 17 ? 'Afternoon' : h < 22 ? 'Evening' : 'Late night';
    buckets[key].n++;
    if (a.correct) buckets[key].c++;
  }
  const best = Object.entries(buckets)
    .filter(([, v]) => v.n >= 3)
    .sort((a, b) => b[1].c / b[1].n - a[1].c / a[1].n)[0];
  if (best) {
    insights.push({
      label: 'Your sharpest time',
      value: best[0],
      detail: `You answer best in the ${best[0].toLowerCase()} (${Math.round(
        (best[1].c / best[1].n) * 100,
      )}% accuracy). Schedule hard topics then.`,
    });
  }

  // Pace: median time per question
  const times = attempts.map((a) => a.timeMs).sort((a, b) => a - b);
  const med = times[Math.floor(times.length / 2)] / 1000;
  insights.push({
    label: 'Your pace',
    value: `${med.toFixed(0)} s / question`,
    detail:
      med > 180
        ? 'Above the ~6 min/question PE budget on average — practice timed sets to build speed.'
        : 'Comfortably within exam time budgets. Keep accuracy up at this pace.',
  });

  // Effect of studying first: accuracy on questions whose area lesson is done
  let doneC = 0,
    doneN = 0,
    undC = 0,
    undN = 0;
  for (const a of attempts) {
    const areaDone = lessonsForArea(a.areaId).some((l) => lessons[l.id]?.completed);
    if (areaDone) {
      doneN++;
      if (a.correct) doneC++;
    } else {
      undN++;
      if (a.correct) undC++;
    }
  }
  if (doneN >= 3 && undN >= 3) {
    const lift = Math.round((doneC / doneN - undC / undN) * 100);
    insights.push({
      label: 'Studying pays off',
      value: lift >= 0 ? `+${lift}%` : `${lift}%`,
      detail: `You score ${Math.abs(lift)}% ${
        lift >= 0 ? 'higher' : 'lower'
      } on areas where you finished the lesson first.`,
    });
  }

  // Confidence calibration
  const rated = attempts.filter((a) => a.confidence);
  if (rated.length >= 5) {
    const conf = rated.filter((a) => a.confidence === 3);
    if (conf.length >= 3) {
      const acc = conf.filter((a) => a.correct).length / conf.length;
      insights.push({
        label: 'Confidence calibration',
        value: `${Math.round(acc * 100)}%`,
        detail:
          acc < 0.8
            ? 'When you felt confident you were right only ' +
              Math.round(acc * 100) +
              '% of the time — watch for overconfidence traps.'
            : 'Your confidence is well-calibrated. Trust your first instinct on the exam.',
      });
    }
  }

  return insights;
}

// ----------------------- Mock exam blueprint sampling ----------------------
// Build a question set that mirrors the real exam's area weighting.
export function buildMockExam(examId: string, count?: number) {
  const exam = EXAM_BY_ID[examId];
  if (!exam) return [];
  const total = count ?? exam.questionCount;
  const pool = QUESTIONS.filter((q) => q.examId === examId);
  if (pool.length === 0) return [];

  // target count per area by NORMALIZED weight (published ranges can sum to
  // more than 100%, e.g. geotech midpoints total 110% — normalize so a full
  // mock is exactly `total` questions)
  const weightSum = exam.areas.reduce((s, a) => s + a.weight, 0);
  const targets = exam.areas.map((a) => ({
    areaId: a.id,
    n: Math.max(0, Math.round((total * a.weight) / weightSum)),
  }));

  const chosen: typeof pool = [];
  const used = new Set<string>();
  for (const t of targets) {
    const areaPool = shuffle(pool.filter((q) => q.areaId === t.areaId));
    for (let i = 0; i < t.n && i < areaPool.length; i++) {
      if (chosen.length >= total) break;
      chosen.push(areaPool[i]);
      used.add(areaPool[i].id);
    }
  }
  // backfill to reach total (or as close as the bank allows)
  for (const q of shuffle(pool)) {
    if (chosen.length >= total) break;
    if (!used.has(q.id)) {
      chosen.push(q);
      used.add(q.id);
    }
  }
  return shuffle(chosen);
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// --------------------------- Tutor / competency ----------------------------

export interface Competency {
  label: string;
  tone: string; // ui Pill tone
  level: number; // 0..4
}

/** Map a 0..1 mastery score to a competency level the tutor reports back. */
export function competency(mastery: number, attempts: number): Competency {
  if (attempts === 0) return { label: 'Not started', tone: 'slate', level: 0 };
  if (mastery < 0.35) return { label: 'Novice', tone: 'rose', level: 1 };
  if (mastery < 0.6) return { label: 'Developing', tone: 'amber', level: 2 };
  if (mastery < 0.8) return { label: 'Proficient', tone: 'brand', level: 3 };
  return { label: 'Exam-ready', tone: 'emerald', level: 4 };
}

/**
 * Tutor-driven adaptive question set: weight toward weak, high-value areas and
 * lean to easier items when an area is weak, harder when it is strong.
 */
export function pickAdaptiveQuestions(
  attempts: Attempt[],
  lessons: Record<string, LessonProgress>,
  examId: string | undefined,
  n: number,
): typeof QUESTIONS {
  const mastery = computeAreaMastery(attempts, lessons, examId);
  const mById = Object.fromEntries(mastery.map((m) => [m.areaId, m]));
  const recentIds = new Set(attempts.slice(-12).map((a) => a.questionId));

  const pool = QUESTIONS.filter((q) => !examId || q.examId === examId);
  const scored = pool.map((q) => {
    const m = mById[q.areaId];
    const weakness = m ? 1 - m.mastery : 1;
    const weight = m ? m.weight : 0.1;
    // prefer easy/medium when weak, medium/hard when strong
    const diffScore =
      (weakness > 0.5 && q.difficulty !== 'hard') ||
      (weakness <= 0.5 && q.difficulty !== 'easy')
        ? 1
        : 0.4;
    const freshness = recentIds.has(q.id) ? 0.15 : 1;
    const noise = 0.6 + Math.random() * 0.8;
    return { q, score: (0.5 + weakness) * (0.5 + weight) * diffScore * freshness * noise };
  });
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, n)
    .map((s) => s.q);
}

/** A short, contextual coaching line for the dashboard. */
export function coachMessage(
  attempts: Attempt[],
  lessons: Record<string, LessonProgress>,
  cards: Record<string, FsrsCard>,
  primaryExam: string,
): string {
  const due = Object.values(cards).filter((s) => isDue(s)).length;
  if (attempts.length === 0)
    return 'Welcome! Start with a lesson, then try a short practice quiz so I can gauge where you are.';
  if (due >= 5) return `You have ${due} flashcards due — a quick 5-minute review will lock in those formulas.`;

  const readiness = computeReadiness(attempts, lessons).find((r) => r.examId === primaryExam);
  if (!readiness) return 'Keep practicing — every answer sharpens your study plan.';
  const weak = readiness.weakAreas[0];
  if (readiness.score < 40)
    return `You're building a foundation in ${EXAM_BY_ID[primaryExam].shortName}. Focus next on ${weak?.name}.`;
  if (readiness.score < 70)
    return `Solid progress (${readiness.score}% ready). Your biggest lever right now is ${weak?.name}.`;
  return `You're at ${readiness.score}% readiness — time to prove it with a timed mock exam.`;
}

export { areaById };
