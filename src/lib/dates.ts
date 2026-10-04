// The prototype runs on a fixed "today" so every date and every piece of date maths on screen agrees.
export const TODAY = '2026-10-04';

const MS = 86_400_000;
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function parse(d: string): Date {
  const [y, m, day] = d.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, day));
}

function iso(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function addDays(d: string, n: number): string {
  return iso(new Date(parse(d).getTime() + n * MS));
}

export function diffDays(from: string, to: string): number {
  return Math.round((parse(to).getTime() - parse(from).getTime()) / MS);
}

/** "Oct 7" */
export function fmt(d: string): string {
  const p = parse(d);
  return `${MONTHS[p.getUTCMonth()]} ${p.getUTCDate()}`;
}

/** "Wed, Oct 7" */
export function fmtDay(d: string): string {
  const p = parse(d);
  return `${WEEKDAYS[p.getUTCDay()]}, ${fmt(d)}`;
}

/** "Nov 4, 2026" */
export function fmtLong(d: string): string {
  return `${fmt(d)}, ${parse(d).getUTCFullYear()}`;
}

export function daysFromToday(d: string): number {
  return diffDays(TODAY, d);
}

export function inDays(d: string): string {
  const n = daysFromToday(d);
  if (n === 0) return 'today';
  if (n === 1) return 'tomorrow';
  if (n < 0) return `${-n} days ago`;
  return `in ${n} days`;
}
