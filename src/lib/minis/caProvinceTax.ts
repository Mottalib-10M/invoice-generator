// Canada: GST, HST, PST, RST or QST on one amount, by province.
import { PROVINCE, provOf, money, one, pctText } from './_kit';
import { PROVINCES } from '../engine/params';
export default () => ({
  title: 'Sales tax on an invoice, by province',
  cta: 'Make the invoice for this province',
  inputs: [{ id: 'a', label: 'Amount before tax', def: 2500, unit: '$', max: 10_000_000, decimals: 2 }, PROVINCE('BC')],
  run: ({ a, p }: Record<string, number>) => {
    const code = provOf(p);
    const r = one('CA', a, { region: code, lines: [{ desc: 'x', qty: 1, price: a, tax: 'ca_full' }] });
    const pv = PROVINCES[code];
    return { head: ['Total with tax', money(r.total, 'CA', 2)] as [string, string], rows: [...r.bands.map((b) => [`${b.label} ${pctText(b.rate)}`, money(b.amount, 'CA', 2)] as [string, string]), ['Tax system', pv.kind === 'hst' ? 'Harmonized (HST)' : pv.kind === 'gst' ? 'GST only' : `GST + ${pv.pst_name}`]] };
  },
});
