// "2/10 net 30": what an early payment discount really costs.
import { money, pctText } from './_kit';
import { earlyDiscount } from '../engine/terms';
export default () => ({
  title: 'Early payment discount: the yearly rate behind it',
  cta: 'Put these terms on an invoice',
  inputs: [{ id: 'a', label: 'Invoice total', def: 5000, unit: '$', max: 10_000_000, decimals: 2 }, { id: 'p', label: 'Discount', def: 2, unit: '%', max: 50, decimals: 2 }, { id: 'e', label: 'If paid within', def: 10, unit: 'days', max: 365 }, { id: 'n', label: 'Otherwise due in', def: 30, unit: 'days', max: 365 }],
  run: ({ a, p, e, n }: Record<string, number>) => {
    const r = earlyDiscount(a, p, e, n);
    return { head: ['Equivalent yearly rate', pctText(r.annual, 1)] as [string, string], rows: [['Customer pays early', money(r.pay, 'US', 2)], ['Discount you give', money(r.saving, 'US', 2)], ['Days gained', `${r.window}`]] as [string, string][], note: 'Formula: discount ÷ (1 − discount) × 365 ÷ days gained.' };
  },
});
