// How to write an invoice: how many details the law asks for, by country and amount.
import { COUNTRY, countryOf, YESNO, one } from './_kit';
import { checkInvoice } from '../engine/compliance';
export default () => ({
  title: 'Details your invoice must show',
  cta: 'Fill them in the generator',
  inputs: [COUNTRY('UK'), { id: 'a', label: 'Invoice total', def: 600, unit: '', max: 10_000_000, decimals: 2 }, { id: 'r', label: 'Registered for VAT/GST/sales tax?', def: 1, options: YESNO }],
  run: ({ c, a, r }: Record<string, number>) => {
    const k = countryOf(c);
    const res = one(k, a, { registered: !!r, inclusive: true });
    const ch = checkInvoice({ country: k, region: k === 'CA' ? 'ON' : k === 'US' ? 'TX' : '', registered: !!r, kind: 'invoice', number: '', issueDate: '', currency: 'X', seller: { name: '', address: '' }, buyer: { name: '', address: '' }, lineDescriptions: [''] }, res);
    const req = ch.checks.filter((x) => x.status === 'missing' || x.status === 'warn');
    return { head: ['Details to fill in', `${req.length}`] as [string, string], rows: req.slice(0, 4).map((x, i) => [`${i + 1}`, x.label] as [string, string]), note: ch.title };
  },
});
