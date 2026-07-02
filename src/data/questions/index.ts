import type { Question } from '../../types';
import { geotechQuestions } from './geotech';
import { geotechExtraQuestions } from './geotech-extra';
import { geotechFoundationQuestions } from './geotech-found';
import { geotechGeneralQuestions } from './geotech-gen';
import { seismicQuestions } from './seismic';
import { seismicExtraQuestions } from './seismic-extra';
import { seismicBank2Questions } from './seismic-bank2';
import { surveyingQuestions } from './surveying';
import { surveyingExtraQuestions } from './surveying-extra';
import { surveyingBank2Questions } from './surveying-bank2';

export const QUESTIONS: Question[] = [
  ...geotechQuestions,
  ...geotechExtraQuestions,
  ...geotechFoundationQuestions,
  ...geotechGeneralQuestions,
  ...seismicQuestions,
  ...seismicExtraQuestions,
  ...seismicBank2Questions,
  ...surveyingQuestions,
  ...surveyingExtraQuestions,
  ...surveyingBank2Questions,
];

export const QUESTION_BY_ID: Record<string, Question> = Object.fromEntries(
  QUESTIONS.map((q) => [q.id, q]),
);
