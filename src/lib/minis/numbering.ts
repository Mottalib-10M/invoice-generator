// Invoice numbering: the next numbers in a sequence, and how far a pattern lasts.
import { formatNumberPattern } from '../engine/terms';
export default () => ({
  title: 'Your next invoice numbers',
  cta: 'Use it in the generator',
  inputs: [{ id: 'n', label: 'Last number issued', def: 41, max: 999999 }, { id: 'y', label: 'Year', def: 2026, max: 2100 }, { id: 'm', label: 'Invoices per month', def: 25, max: 100000 }],
  run: ({ n, y, m }: Record<string, number>) => {
    const day = `${Math.round(y) || 2026}-01-01`;
    const next = [1, 2, 3].map((k) => formatNumberPattern('INV-{YYYY}-{N}', Math.round(n) + k, day));
    const years = m > 0 ? Math.max((9999 - n) / (m * 12), 0) : 0;
    return { head: ['Next number', next[0]] as [string, string], rows: [['Then', `${next[1]}, ${next[2]}`], ['Four digits last', `${years.toFixed(1)} years at this pace`], ['Restart each year?', 'Allowed if the year is in the number']] as [string, string][] };
  },
});
