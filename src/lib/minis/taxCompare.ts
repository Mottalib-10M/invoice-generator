// Guides index: the same sale under the four tax systems.
import { money, one } from './_kit';
export default () => ({
  title: 'The same sale under four tax systems',
  cta: 'Open the invoice generator',
  inputs: [{ id: 'a', label: 'Price before tax', def: 250, unit: '$', max: 10_000_000, decimals: 2 }],
  run: ({ a }: Record<string, number>) => {
    const uk = one('UK', a), au = one('AU', a), qc = one('CA', a, { region: 'QC' }), ca = one('US', a, { region: 'CA' });
    return { head: ['UK total with VAT', money(uk.total, 'UK', 2)] as [string, string], rows: [['Australia, GST', money(au.total, 'AU', 2)], ['Quebec, GST + QST', money(qc.total, 'CA', 2)], ['California, base rate', money(ca.total, 'US', 2)]] as [string, string][] };
  },
});
