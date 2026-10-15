// Balance invoice: the whole job taxed, the deposit already paid deducted.
import { COUNTRY, countryOf, money, one } from './_kit';
export default () => ({
  title: 'Balance invoice after a deposit',
  cta: 'Make the balance invoice',
  inputs: [{ id: 'a', label: 'Whole job before tax', def: 5500, unit: '', max: 10_000_000, decimals: 2 }, { id: 'p', label: 'Deposit already paid, tax included', def: 1650, unit: '', max: 10_000_000, decimals: 2 }, COUNTRY('AU')],
  run: ({ a, p, c }: Record<string, number>) => {
    const k = countryOf(c);
    const r = one(k, a, { paid: p });
    return { head: ['Balance due', money(r.due, k, 2)] as [string, string], rows: [['Job total with tax', money(r.total, k, 2)], ['Tax on the whole job', money(r.tax, k, 2)], ['Deposit deducted', money(r.paid, k, 2)]] as [string, string][] };
  },
});
