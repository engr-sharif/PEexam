import type { Question } from '../../types';
import { geotechQuestions } from './geotech';
import { feMatheconQuestions } from './fe-mathecon';
import { feMechanicsQuestions } from './fe-mechanics';
import { feStructuralQuestions } from './fe-structural';
import { feGeoconQuestions } from './fe-geocon';
import { feWaterQuestions } from './fe-water';
import { feTransurvQuestions } from './fe-transurv';
import { geotechExtraQuestions } from './geotech-extra';
import { geotechFoundationQuestions } from './geotech-found';
import { geotechGeneralQuestions } from './geotech-gen';
import { seismicQuestions } from './seismic';
import { seismicExtraQuestions } from './seismic-extra';
import { seismicBank2Questions } from './seismic-bank2';
import { surveyingQuestions } from './surveying';
import { wreHydroQuestions } from './wre-hydro';
import { wreWaterQuestions } from './wre-water';
import { wreAnalysisQuestions } from './wre-analysis';
import { wreSiteworkQuestions } from './wre-sitework';
import { surveyingExtraQuestions } from './surveying-extra';
import { surveyingBank2Questions } from './surveying-bank2';

export const QUESTIONS: Question[] = [
  ...feMatheconQuestions,
  ...feMechanicsQuestions,
  ...feStructuralQuestions,
  ...feGeoconQuestions,
  ...feWaterQuestions,
  ...feTransurvQuestions,
  ...geotechQuestions,
  ...geotechExtraQuestions,
  ...geotechFoundationQuestions,
  ...geotechGeneralQuestions,
  ...wreHydroQuestions,
  ...wreWaterQuestions,
  ...wreAnalysisQuestions,
  ...wreSiteworkQuestions,
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
