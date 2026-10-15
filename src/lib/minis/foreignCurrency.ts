// UK VAT invoice in another currency: the VAT total must also be shown in sterling.
import { money } from './_kit';
import { P } from '../engine/params';
import { floor2 } from '../engine/invoice';
export default () => ({
  title: 'VAT in sterling on an invoice in euros or dollars',
  cta: 'Make a VAT invoice in another currency',
  inputs: [{ id: 'a', label: 'Amount before VAT, in your invoice currency', def: 8000, unit: '€', max: 10_000_000, decimals: 2 }, { id: 'x', label: 'Exchange rate: 1 GBP =', def: 1.15, unit: '€', max: 100000, decimals: 4 }],
  run: ({ a, x }: Record<string, number>) => {
    const vat = a * P.uk.vat_rates.standard;
    const gbp = x > 0 ? floor2(vat / x) : 0;
    return { head: ['VAT total to show in sterling', money(gbp, 'UK', 2)] as [string, string], rows: [['VAT in invoice currency', `€${vat.toFixed(2)}`], ['Net in sterling', money(x > 0 ? a / x : 0, 'UK', 2)], ['Rate used', `£1 = €${x}`]] as [string, string][], note: 'Use a rate HMRC accepts, such as its published monthly rate, and say which.' };
  },
});
