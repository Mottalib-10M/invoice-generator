// US: state rate + local rate on the taxable part of an invoice.
import { STATE, stateOf, money, one, pctText } from './_kit';
export default () => ({
  title: 'Sales tax on an invoice, state rate plus local rate',
  cta: 'Make the invoice with sales tax',
  inputs: [{ id: 'a', label: 'Taxable amount', def: 1500, unit: '$', max: 10_000_000, decimals: 2 }, STATE('TX'), { id: 'l', label: 'Local rate', def: 2, unit: '%', max: 10, decimals: 3 }],
  run: ({ a, s, l }: Record<string, number>) => {
    const st = stateOf(s);
    const r = one('US', a, { region: st.code, localRate: st.local ? l : 0 });
    return { head: ['Sales tax to add', money(r.tax, 'US', 2)] as [string, string], rows: [['Invoice total', money(r.total, 'US', 2)], [`${st.name} state rate`, pctText(st.rate / 100)], ['Local rate used', st.local ? pctText(l / 100) : 'none (no local tax)']] as [string, string][], note: st.localNote ?? (st.local ? 'Local rates depend on the delivery address: look it up with the state.' : undefined) };
  },
});
