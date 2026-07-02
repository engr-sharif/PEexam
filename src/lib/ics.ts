// Dependency-free iCalendar (.ics) study-plan generator.
// RFC 5545 compliant: CRLF line endings, lines folded at 75 octets.

export interface StudyPlanInput {
  examDates: Record<string, string>;
  examNames: Record<string, string>;
  weeklyHours: number;
  daysPerWeek: number;
  startDate?: string;
}

const PRODID = '-//CA PE Prep//EN';
const UID_DOMAIN = 'ca-pe-prep';
const MAX_EVENTS = 400;
const MS_PER_DAY = 86400000;

/** Parse a 'YYYY-MM-DD' string into a UTC-midnight Date, or null if invalid. */
function parseDate(s: string | undefined | null): Date | null {
  if (!s) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s.trim());
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  const date = new Date(Date.UTC(y, mo - 1, d));
  if (
    date.getUTCFullYear() !== y ||
    date.getUTCMonth() !== mo - 1 ||
    date.getUTCDate() !== d
  ) {
    return null;
  }
  return date;
}

function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

/** Format as YYYYMMDD (date-only value). */
function fmtDate(d: Date): string {
  return `${d.getUTCFullYear()}${pad2(d.getUTCMonth() + 1)}${pad2(d.getUTCDate())}`;
}

/** Format as YYYYMMDDTHHMMSS (floating local time, no TZID/Z). */
function fmtDateTime(d: Date): string {
  return `${fmtDate(d)}T${pad2(d.getUTCHours())}${pad2(d.getUTCMinutes())}${pad2(d.getUTCSeconds())}`;
}

/** UTF-8 byte length of a single code point. */
function codePointBytes(cp: number): number {
  if (cp < 0x80) return 1;
  if (cp < 0x800) return 2;
  if (cp < 0x10000) return 3;
  return 4;
}

/**
 * Fold a content line at 75 octets per RFC 5545 section 3.1.
 * Continuation lines begin with a single space (which counts toward the
 * 75-octet limit of that line). Never splits inside a UTF-8 code point.
 */
function foldLine(line: string): string[] {
  const out: string[] = [];
  let current = '';
  let bytes = 0;
  let limit = 75;
  for (const ch of line) {
    const b = codePointBytes(ch.codePointAt(0) as number);
    if (bytes + b > limit) {
      out.push(current);
      current = ' ' + ch;
      bytes = 1 + b;
      limit = 75;
    } else {
      current += ch;
      bytes += b;
    }
  }
  out.push(current);
  return out;
}

/** Escape TEXT values per RFC 5545 section 3.3.11. */
function escapeText(s: string): string {
  return s
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

interface IcsEvent {
  uid: string;
  lines: string[];
}

function eventLines(uid: string, dtstamp: string, body: string[]): string[] {
  return [
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${dtstamp}`,
    ...body,
    'END:VEVENT',
  ];
}

/**
 * Build a complete VCALENDAR study plan.
 *
 * - One all-day VEVENT per exam whose date is valid and on/after the start
 *   date, titled "\u{1F393} {examName} — EXAM DAY".
 * - Evening study sessions (19:00 floating local time) on the first
 *   `daysPerWeek` days of each week (Monday first), from the start date
 *   through the latest exam date. Duration = weeklyHours / daysPerWeek,
 *   rounded to the nearest 15 minutes. Session titles cycle through the
 *   exams still upcoming at that session's date.
 * - Deterministic output: UIDs are sequence-based and DTSTAMP is derived
 *   from the start date at 00:00 (no wall-clock reads beyond defaulting
 *   startDate to today).
 * - Capped at 400 events total; study sessions are truncated first and
 *   exam-day events are always kept.
 */
export function buildStudyPlanIcs(input: StudyPlanInput): string {
  const { examDates, examNames, weeklyHours, daysPerWeek } = input;

  // Resolve start date (default: today, local calendar date).
  let start = parseDate(input.startDate);
  if (!start) {
    const now = new Date();
    start = new Date(
      Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()),
    );
  }
  const dtstamp = `${fmtDate(start)}T000000Z`;

  // Collect exams with valid dates on/after the start date, sorted by
  // date then id for deterministic ordering.
  const exams: { id: string; name: string; date: Date }[] = [];
  for (const id of Object.keys(examDates || {}).sort()) {
    const date = parseDate(examDates[id]);
    if (!date || date.getTime() < start.getTime()) continue;
    exams.push({ id, name: examNames?.[id] || id, date });
  }
  exams.sort((a, b) => a.date.getTime() - b.date.getTime() || (a.id < b.id ? -1 : 1));

  const events: IcsEvent[] = [];
  let seq = 0;

  // Exam-day all-day events (never truncated).
  for (const exam of exams) {
    seq += 1;
    const dayAfter = new Date(exam.date.getTime() + MS_PER_DAY);
    events.push({
      uid: `exam-${seq}@${UID_DOMAIN}`,
      lines: eventLines(`exam-${seq}@${UID_DOMAIN}`, dtstamp, [
        `DTSTART;VALUE=DATE:${fmtDate(exam.date)}`,
        `DTEND;VALUE=DATE:${fmtDate(dayAfter)}`,
        `SUMMARY:${escapeText(`\u{1F393} ${exam.name} — EXAM DAY`)}`,
        'TRANSP:TRANSPARENT',
      ]),
    });
  }

  // Study sessions.
  const latest = exams.length ? exams[exams.length - 1].date : null;
  const sessionMinutes =
    daysPerWeek > 0 && weeklyHours > 0 && Number.isFinite(weeklyHours / daysPerWeek)
      ? Math.round((weeklyHours / daysPerWeek) * 60 / 15) * 15
      : 0;

  if (latest && sessionMinutes > 0) {
    const sessionBudget = MAX_EVENTS - events.length;
    let cycle = 0;
    let made = 0;
    for (
      let t = start.getTime();
      t <= latest.getTime() && made < sessionBudget;
      t += MS_PER_DAY
    ) {
      const day = new Date(t);
      const weekdayMonFirst = (day.getUTCDay() + 6) % 7; // Mon=0 .. Sun=6
      if (weekdayMonFirst >= daysPerWeek) continue;

      // Exams still upcoming at this session's date.
      const active = exams.filter((e) => e.date.getTime() >= t);
      if (active.length === 0) break;
      const exam = active[cycle % active.length];
      cycle += 1;

      const startAt = new Date(t + 19 * 3600000); // 19:00 floating
      const endAt = new Date(startAt.getTime() + sessionMinutes * 60000);
      seq += 1;
      made += 1;
      events.push({
        uid: `study-${seq}@${UID_DOMAIN}`,
        lines: eventLines(`study-${seq}@${UID_DOMAIN}`, dtstamp, [
          `DTSTART:${fmtDateTime(startAt)}`,
          `DTEND:${fmtDateTime(endAt)}`,
          `SUMMARY:${escapeText(`\u{1F4DA} Study: ${exam.name}`)}`,
          'DESCRIPTION:Focus session generated by CA PE Civil Prep',
        ]),
      });
    }
  }

  const lines: string[] = [
    'BEGIN:VCALENDAR',
    `PRODID:${PRODID}`,
    'VERSION:2.0',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:CA PE Civil Study Plan',
  ];
  for (const ev of events) lines.push(...ev.lines);
  lines.push('END:VCALENDAR');

  return lines.flatMap(foldLine).join('\r\n') + '\r\n';
}

/** Trigger a browser download of the given .ics content. */
export function downloadIcs(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
