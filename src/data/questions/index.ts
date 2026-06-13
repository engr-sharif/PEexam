import type { Question } from '../../types';
import { geotechQuestions } from './geotech';
import { seismicQuestions } from './seismic';
import { surveyingQuestions } from './surveying';

export const QUESTIONS: Question[] = [
  ...geotechQuestions,
  ...seismicQuestions,
  ...surveyingQuestions,
];

export const QUESTION_BY_ID: Record<string, Question> = Object.fromEntries(
  QUESTIONS.map((q) => [q.id, q]),
);
