/** Payment terms, due dates, early payment discounts, UK late payment interest, numbering. */
import { P, ukReferenceRate } from './params';
import { round2 } from './invoice';

export type Terms = 'receipt' | 'net7' | 'net14' | 'net15' | 'net30' | 'net45' | 'net60' | 'net90' | 'eom' | 'eom30';
export const TERMS: Array<{ value: Terms; label: string; days?: number }> = [
  { value: 'receipt', label: 'Due on receipt', days: 0 },
  { value: 'net7', label: 'Net 7', days: 7 },
  { value: 'net14', label: 'Net 14', days: 14 },
  { value: 'net15', label: 'Net 15', days: 15 },
  { value: 'net30', label: 'Net 30', days: 30 },
  { value: 'net45', label: 'Net 45', days: 45 },
  { value: 'net60', label: 'Net 60', days: 60 },
  { value: 'net90', label: 'Net 90', days: 90 },
  { value: 'eom', label: 'End of month (EOM)' },
  { value: 'eom30', label: '30 days end of month' },
];

const toDate = (iso: string) => new Date(`${iso}T00:00:00Z`);
const iso = (d: Date) => d.toISOString().slice(0, 10);
export const addDays = (isoDay: string, n: number) => { const d = toDate(isoDay); d.setUTCDate(d.getUTCDate() + n); return iso(d); };
export const daysBetween = (a: string, b: string) => Math.round((toDate(b).getTime() - toDate(a).getTime()) / 86400000);
const endOfMonth = (isoDay: string) => { const d = toDate(isoDay); return iso(new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0))); };

/** Due date for a set of terms from the invoice date. */
export function dueDate(issue: string, terms: Terms): string {
  const t = TERMS.find((x) => x.value === terms)!;
  if (t.days !== undefined) return addDays(issue, t.days);
  if (terms === 'eom') return endOfMonth(issue);
  return addDays(endOfMonth(issue), 30);
}

/**
 * Early payment discount such as "2/10 net 30": what the discount costs the seller, as an annual
 * rate. Standard formula: d / (1 − d) × 365 / (net − discount days).
 */
export function earlyDiscount(amount: number, pct: number, discDays: number, netDays: number) {
  const d = pct / 100;
  const window = Math.max(netDays - discDays, 1);
  const saving = round2(amount * d);
  const annual = d >= 1 ? 0 : (d / (1 - d)) * (365 / window);
  return { saving, pay: round2(amount - saving), annual, window };
}

/**
 * UK statutory interest under the Late Payment of Commercial Debts (Interest) Act 1998: 8 % over
 * the reference rate (Bank Rate on 30 June or 31 December before interest starts), simple
 * interest per day on a 365-day year, plus fixed compensation by debt size.
 */
export function ukLateInterest(debt: number, due: string, paidOn: string, baseOverride?: number) {
  const start = addDays(due, 1); // interest runs from the day after the due date
  const ref = ukReferenceRate(start);
  const base = baseOverride ?? ref.base;
  const rate = P.uk.late_payment.margin + base;
  const days = Math.max(daysBetween(due, paidOn), 0);
  // GOV.UK's worked example rounds the daily interest to the penny before multiplying by the days.
  const daily = round2((debt * rate) / 365);
  const interest = round2(daily * days);
  const comp = P.uk.late_payment.compensation.find((c) => c.below === null || debt < c.below)!.amount;
  return { days, rate, base, referenceDay: ref.referenceDay, daily, interest, compensation: days > 0 ? comp : 0, total: round2(debt + interest + (days > 0 ? comp : 0)) };
}

/** Next number in a series such as INV-2026-0042 → INV-2026-0043 (keeps the zero padding). */
export function nextNumber(current: string): string {
  const m = current.match(/^(.*?)(\d+)(\D*)$/);
  if (!m) return current ? `${current}-1` : '1';
  const n = String(Number(m[2]) + 1).padStart(m[2].length, '0');
  return `${m[1]}${n}${m[3]}`;
}

/** Builds a number from a pattern: {YYYY}, {YY}, {MM}, {N} (padded to `pad`). */
export function formatNumberPattern(pattern: string, n: number, dateIso: string, pad = 4): string {
  const [y, mo] = dateIso.split('-');
  return pattern.replace('{YYYY}', y).replace('{YY}', y.slice(2)).replace('{MM}', mo).replace('{N}', String(n).padStart(pad, '0'));
}

/** UK CIS: deduction on the labour part (gross less VAT and materials). */
export function cisDeduction(gross: number, vat: number, materials: number, rate: number) {
  const base = Math.max(gross - vat - materials, 0);
  const deduction = round2(base * rate);
  return { base: round2(base), deduction, pay: round2(gross - deduction) };
}
