// Which VAT invoice HMRC allows for the amount: simplified up to £250, full above.
import { money } from './_kit';
import { P } from '../engine/params';
export default () => ({
  title: 'Simplified or full VAT invoice?',
  cta: 'Make the VAT invoice',
  inputs: [{ id: 'a', label: 'Total charged, VAT included', def: 180, unit: '£', max: 10_000_000, decimals: 2 }, { id: 'r', label: 'VAT rate', def: 1, options: [{ value: '1', label: '20% standard' }, { value: '2', label: '5% reduced' }] }],
  run: ({ a, r }: Record<string, number>) => {
    const rate = r === 2 ? P.uk.vat_rates.reduced : P.uk.vat_rates.standard;
    const vat = Math.floor((a * rate / (1 + rate)) * 100 + 1e-9) / 100;
    const simple = a <= P.uk.simplified_invoice_max;
    return { head: ['Invoice you can issue', simple ? 'Simplified (or full)' : 'Full or modified'] as [string, string], rows: [['VAT inside the price', money(vat, 'UK', 2)], ['Price before VAT', money(a - vat, 'UK', 2)], ['Customer address needed', simple ? 'No' : 'Yes'], ['Line-by-line VAT detail', simple ? 'No, one rate total' : 'Yes']] as [string, string][], note: `Threshold: £${P.uk.simplified_invoice_max} including VAT (VAT Notice 700/21, 4.5).` };
  },
});
