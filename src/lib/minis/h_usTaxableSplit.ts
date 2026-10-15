// US: sales tax on the taxable lines only, with a non-taxable service line beside them.
import { STATE, stateOf, money, pctText } from './_kit';
import { computeInvoice } from '../engine/invoice';
export default () => ({
  title: 'Taxable goods and a non-taxable service on one invoice',
  cta: 'Make the US invoice',
  inputs: [{ id: 'g', label: 'Taxable goods', def: 498, unit: '$', max: 10_000_000, decimals: 2 }, { id: 'v', label: 'Service not taxed in your state', def: 510, unit: '$', max: 10_000_000, decimals: 2 }, STATE('NC'), { id: 'l', label: 'Local rate', def: 2.25, unit: '%', max: 10, decimals: 3 }],
  run: ({ g, v, s, l }: Record<string, number>) => {
    const st = stateOf(s);
    const local = st.local ? l : 0;
    const r = computeInvoice({ country: 'US', region: st.code, registered: true, localRate: local, lines: [{ desc: 'g', qty: 1, price: g, tax: 'taxable' }, { desc: 'v', qty: 1, price: v, tax: 'exempt' }] });
    const all = computeInvoice({ country: 'US', region: st.code, registered: true, localRate: local, lines: [{ desc: 'g', qty: 1, price: g + v, tax: 'taxable' }] });
    return { head: ['Sales tax on the goods only', money(r.tax, 'US', 2)] as [string, string], rows: [['Invoice total', money(r.total, 'US', 2)], ['Combined rate', pctText((st.rate + local) / 100)], ['If the service were wrongly taxed', `${money(all.tax, 'US', 2)} of tax`]] as [string, string][] };
  },
});
