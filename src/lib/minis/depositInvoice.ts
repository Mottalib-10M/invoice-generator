// Deposit invoice and balance invoice: tax on each part.
import { AMOUNT, COUNTRY, countryOf, money, one } from './_kit';
export default () => ({
  title: 'Deposit now, balance later: the two invoices',
  cta: 'Make the deposit invoice',
  inputs: [AMOUNT(12000, 'Project price before tax', ''), { id: 'd', label: 'Deposit', def: 30, unit: '%', max: 100, decimals: 2 }, COUNTRY('UK')],
  run: ({ a, d, c }: Record<string, number>) => {
    const k = countryOf(c);
    const dep = one(k, a * d / 100), bal = one(k, a * (1 - d / 100));
    return { head: ['Deposit invoice total', money(dep.total, k, 2)] as [string, string], rows: [['Tax on the deposit', money(dep.tax, k, 2)], ['Balance invoice total', money(bal.total, k, 2)], ['Tax on the balance', money(bal.tax, k, 2)]] as [string, string][], note: 'Tax is due on each payment as it is invoiced or received.' };
  },
});
