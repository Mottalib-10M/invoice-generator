// UK domestic reverse charge for construction: no VAT added, amount stated for the customer.
import { money, one } from './_kit';
export default () => ({
  title: 'Reverse charge invoice: what you bill, what the customer accounts for',
  cta: 'Make a reverse charge invoice',
  inputs: [{ id: 'a', label: 'Construction services, before VAT', def: 6500, unit: '£', max: 10_000_000, decimals: 2 }, { id: 'r', label: 'VAT rate', def: 1, options: [{ value: '1', label: '20% standard' }, { value: '2', label: '5% reduced' }] }],
  run: ({ a, r }: Record<string, number>) => {
    const tax = r === 2 ? 'reduced' : 'standard';
    const rc = one('UK', a, { reverseCharge: true, lines: [{ desc: 'Works', qty: 1, price: a, tax }] });
    const normal = one('UK', a, { lines: [{ desc: 'Works', qty: 1, price: a, tax }] });
    return { head: ['Amount you invoice', money(rc.total, 'UK', 2)] as [string, string], rows: [['VAT the customer pays to HMRC', money(rc.reverseChargeVat, 'UK', 2)], ['Same job without reverse charge', money(normal.total, 'UK', 2)], ['Wording on the invoice', 'Customer to pay the VAT to HMRC']] as [string, string][] };
  },
});
