import type { Lesson } from '../../types';
import { geotechLessons } from './geotech';
import { seismicLessons } from './seismic';
import { surveyingLessons } from './surveying';

export const LESSONS: Lesson[] = [
  ...geotechLessons,
  ...seismicLessons,
  ...surveyingLessons,
];

export const LESSON_BY_ID: Record<string, Lesson> = Object.fromEntries(
  LESSONS.map((l) => [l.id, l]),
);

export function lessonsForExam(examId: string): Lesson[] {
  return LESSONS.filter((l) => l.examId === examId);
}

export function lessonsForArea(areaId: string): Lesson[] {
  return LESSONS.filter((l) => l.areaId === areaId);
}
