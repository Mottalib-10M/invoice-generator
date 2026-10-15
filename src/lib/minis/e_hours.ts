// Hourly invoices: hours and minutes to decimal hours, then the line amount with tax.
import { COUNTRY, countryOf, money, one } from './_kit';
export default () => ({
  title: 'Hours and minutes to an invoice line',
  cta: 'Bill these hours',
  inputs: [{ id: 'h', label: 'Hours', def: 7, max: 10000 }, { id: 'm', label: 'Minutes', def: 45, max: 59 }, { id: 'r', label: 'Hourly rate', def: 95, max: 100000, decimals: 2 }, COUNTRY('UK')],
  run: ({ h, m, r, c }: Record<string, number>) => {
    const k = countryOf(c);
    const qty = Math.round((h + Math.min(m, 59) / 60) * 100) / 100;
    const res = one(k, qty * r);
    return { head: ['Quantity to enter', `${qty} hours`] as [string, string], rows: [['Line amount before tax', money(res.net, k, 2)], ['Tax if registered', money(res.tax, k, 2)], ['Total with tax', money(res.total, k, 2)]] as [string, string][], note: 'Minutes ÷ 60, rounded to two decimals: 45 minutes is 0.75 of an hour.' };
  },
});
