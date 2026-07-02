import type { Question } from '../../types';
import { geotechQuestions } from './geotech';
import { geotechExtraQuestions } from './geotech-extra';
import { seismicQuestions } from './seismic';
import { seismicExtraQuestions } from './seismic-extra';
import { surveyingQuestions } from './surveying';
import { surveyingExtraQuestions } from './surveying-extra';

export const QUESTIONS: Question[] = [
  ...geotechQuestions,
  ...geotechExtraQuestions,
  ...seismicQuestions,
  ...seismicExtraQuestions,
  ...surveyingQuestions,
  ...surveyingExtraQuestions,
];

export const QUESTION_BY_ID: Record<string, Question> = Object.fromEntries(
  QUESTIONS.map((q) => [q.id, q]),
);
