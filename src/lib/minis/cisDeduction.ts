// CIS: deduction on labour only, after VAT and materials are taken out.
import { money } from './_kit';
import { cisDeduction } from '../engine/terms';
export default () => ({
  title: 'CIS deduction on a subcontractor invoice',
  cta: 'Make the CIS invoice',
  inputs: [{ id: 'l', label: 'Labour', def: 2400, unit: '£', max: 10_000_000, decimals: 2 }, { id: 'm', label: 'Materials you bought', def: 860, unit: '£', max: 10_000_000, decimals: 2 }, { id: 'r', label: 'CIS status', def: 1, options: [{ value: '1', label: 'Registered: 20%' }, { value: '2', label: 'Not registered: 30%' }, { value: '3', label: 'Gross payment: 0%' }] }],
  run: ({ l, m, r }: Record<string, number>) => {
    const rate = r === 2 ? 0.3 : r === 3 ? 0 : 0.2;
    const c = cisDeduction(l + m, 0, m, rate);
    return { head: ['Contractor pays you', money(c.pay, 'UK', 2)] as [string, string], rows: [['CIS deducted and sent to HMRC', money(c.deduction, 'UK', 2)], ['Amount the rate applies to', money(c.base, 'UK', 2)], ['Invoice total', money(l + m, 'UK', 2)]] as [string, string][], note: 'VAT is left out of the deduction; under the reverse charge none is added.' };
  },
});
