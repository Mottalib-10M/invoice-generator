// Australia: a tax invoice that mixes taxable and GST-free lines.
import { money } from './_kit';
import { computeInvoice } from '../engine/invoice';
import { P } from '../engine/params';
export default () => ({
  title: 'Taxable and GST-free items on one tax invoice',
  cta: 'Make the tax invoice',
  inputs: [{ id: 't', label: 'Taxable items, before GST', def: 240, unit: '$', max: 10_000_000, decimals: 2 }, { id: 'f', label: 'GST-free items', def: 90, unit: '$', max: 10_000_000, decimals: 2 }],
  run: ({ t, f }: Record<string, number>) => {
    const r = computeInvoice({ country: 'AU', region: 'NSW', registered: true, lines: [{ desc: 'a', qty: 1, price: t, tax: 'gst' }, { desc: 'b', qty: 1, price: f, tax: 'gst_free' }] });
    return { head: ['Total payable', money(r.total, 'AU', 2)] as [string, string], rows: [['GST, on the taxable items only', money(r.tax, 'AU', 2)], ["'Total price includes GST' usable?", 'No, part of the total has no GST'], ['Buyer identity or ABN needed', r.total >= P.au.buyer_identity_from ? 'Yes' : 'No']] as [string, string][] };
  },
});
