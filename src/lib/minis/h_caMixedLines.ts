// Canada: one invoice with a line that carries the provincial tax and one that carries GST only.
import { money, pctText } from './_kit';
import { computeInvoice } from '../engine/invoice';
import { PROVINCES } from '../engine/params';
const OPTS = [{ value: '1', label: 'British Columbia (PST)' }, { value: '2', label: 'Manitoba (RST)' }, { value: '3', label: 'Saskatchewan (PST)' }, { value: '4', label: 'Quebec (QST)' }];
const CODES = ['BC', 'MB', 'SK', 'QC'] as const;
export default () => ({
  title: 'Two lines, one with the provincial tax and one without',
  cta: 'Build this invoice',
  inputs: [{ id: 'g', label: 'Line with GST and provincial tax', def: 600, unit: '$', max: 10_000_000, decimals: 2 }, { id: 's', label: 'Line with GST only', def: 1500, unit: '$', max: 10_000_000, decimals: 2 }, { id: 'p', label: 'Province', def: 1, options: OPTS }],
  run: ({ g, s, p }: Record<string, number>) => {
    const code = CODES[Math.min(Math.max(Math.round(p) - 1, 0), 3)];
    const pv = PROVINCES[code];
    const r = computeInvoice({ country: 'CA', region: code, registered: true, lines: [{ desc: 'a', qty: 1, price: g, tax: 'ca_full' }, { desc: 'b', qty: 1, price: s, tax: 'ca_gst_only' }] });
    const gst = r.bands.find((b) => b.label === 'GST'), prov = r.bands.find((b) => b.label !== 'GST');
    return { head: ['Invoice total', money(r.total, 'CA', 2)] as [string, string], rows: [[`GST ${pctText(0.05)} on both lines`, money(gst?.amount ?? 0, 'CA', 2)], [`${pv.pst_name} ${pctText(pv.pst ?? 0)} on the first line`, money(prov?.amount ?? 0, 'CA', 2)], ['Tax in total', money(r.tax, 'CA', 2)]] as [string, string][] };
  },
});
