// One amount, the tax each country adds when the seller is registered.
import { AMOUNT, COUNTRY, countryOf, money, one, pctText } from './_kit';
export default () => ({
  title: 'Tax added to one invoice, country by country',
  cta: 'Make the full invoice',
  inputs: [AMOUNT(1000, 'Invoice amount before tax', ''), COUNTRY('UK', 'Highlight')],
  run: ({ a, c }: Record<string, number>) => {
    const k = countryOf(c);
    const r = one(k, a);
    const row = (x: 'US' | 'UK' | 'CA' | 'AU', label: string) => { const q = one(x, a); return [label, `${money(q.tax, x, 2)} → ${money(q.total, x, 2)}`] as [string, string]; };
    return { head: [`Total with tax, ${k}`, money(r.total, k, 2)] as [string, string], rows: [row('UK', 'UK, VAT 20%'), row('AU', 'Australia, GST 10%'), row('CA', 'Ontario, HST 13%'), row('US', 'Texas, state rate 6.25%')], note: `Effective tax rate for ${k}: ${pctText(a ? r.tax / a : 0, 2)}` };
  },
});
