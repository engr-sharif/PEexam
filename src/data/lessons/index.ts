import type { Lesson } from '../../types';
import { geotechLessons } from './geotech';
import { seismicLessons } from './seismic';
import { surveyingLessons } from './surveying';
import { wreLessons } from './wre';
import { feLessons1 } from './fe1';
import { feLessons2 } from './fe2';

export const LESSONS: Lesson[] = [
  ...geotechLessons,
  ...seismicLessons,
  ...surveyingLessons,
  ...wreLessons,
  ...feLessons1,
  ...feLessons2,
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
