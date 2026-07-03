// ---------------------------------------------------------------------------
// Domain model for the CA PE Civil prep app.
// Content (exams / knowledge areas / lessons / questions / flashcards) is all
// plain data so it can be edited without touching app logic.
// ---------------------------------------------------------------------------

export type ExamId = 'fe-civil' | 'pe-geotech' | 'pe-wre' | 'ca-seismic' | 'ca-surveying';

export type Difficulty = 'easy' | 'medium' | 'hard';

/** A high-level exam (one of the three CA PE Civil requirements). */
export interface Exam {
  id: ExamId;
  name: string;
  shortName: string;
  authority: string; // NCEES or BPELSG
  /** Total scored questions on the real exam. */
  questionCount: number;
  /** Real testing window in minutes (the timed portion the app simulates). */
  examMinutes: number;
  /** Human description of the real appointment length. */
  appointmentNote: string;
  passNote: string;
  color: string; // tailwind-ish accent for UI
  blurb: string;
  references: string[];
  /** Knowledge / content areas with their weighting. */
  areas: KnowledgeArea[];
}

/** A weighted knowledge / content area within an exam. */
export interface KnowledgeArea {
  id: string;
  examId: ExamId;
  name: string;
  /** Approx fraction of the exam, 0..1. Used for the mock-exam blueprint. */
  weight: number;
  /** Official question range, when published (e.g. "8–12"). */
  questionRange?: string;
  subtopics: string[];
}

/** A study lesson tied to a knowledge area. */
export interface Lesson {
  id: string;
  examId: ExamId;
  areaId: string;
  title: string;
  /** ~1 sentence of what you'll be able to do. */
  objective: string;
  estMinutes: number;
  blocks: LessonBlock[];
  /** Curated external video/resource links. */
  resources?: ResourceLink[];
  /** Exam-day tips specific to this topic. */
  tips?: string[];
}

export interface ResourceLink {
  label: string;
  url: string;
  source?: string;
}

export type LessonBlock =
  | { kind: 'prose'; html: string }
  | { kind: 'callout'; tone: 'tip' | 'warn' | 'key'; html: string }
  | { kind: 'formula'; tex: string; caption?: string }
  | { kind: 'example'; title: string; steps: ExampleStep[] }
  | { kind: 'animation'; component: string; caption?: string }
  | { kind: 'table'; headers: string[]; rows: string[][]; caption?: string };

export interface ExampleStep {
  /** Markdown-ish / inline-html prompt for the step. */
  text: string;
  /** Optional KaTeX expression for this step. */
  tex?: string;
}

/** A practice / exam question. */
export interface Question {
  id: string;
  examId: ExamId;
  areaId: string;
  difficulty: Difficulty;
  stem: string; // may contain inline html / $tex$
  choices: string[];
  answerIndex: number;
  /** One-line takeaway shown immediately. */
  explanation: string; // may contain inline html / $tex$
  /** Full step-by-step worked solution (the "show your work" walkthrough). */
  solution?: ExampleStep[];
  tags?: string[];
}

/** A spaced-repetition flashcard. */
export interface Flashcard {
  id: string;
  examId: ExamId;
  areaId: string;
  front: string;
  back: string;
}
