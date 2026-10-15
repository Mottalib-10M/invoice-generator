// What a Canadian invoice must show for the customer to claim the input tax credit.
import { PROVINCE, provOf, money, one } from './_kit';
import { P } from '../engine/params';
export default () => ({
  title: 'Details your customer needs to claim the tax back',
  cta: 'Make a compliant invoice',
  inputs: [{ id: 'a', label: 'Invoice total, tax included', def: 450, unit: '$', max: 10_000_000, decimals: 2 }, PROVINCE('QC')],
  run: ({ a, p }: Record<string, number>) => {
    const code = provOf(p), qc = code === 'QC';
    const [t1, t2] = P.ca.itc_tiers;
    const tier = a < t1 ? 1 : a < t2 ? 2 : 3;
    const n = tier === 1 ? (qc ? 5 : 3) : tier === 2 ? (qc ? 7 : 5) : (qc ? 9 : 8);
    return { head: ['Details required', `${n}`] as [string, string], rows: [['Your GST/HST number', tier >= 2 ? 'Required' : 'Not required'], ...(qc ? [['Your QST number', tier >= 2 ? 'Required' : 'Not required'] as [string, string]] : []), ['Customer name and payment terms', tier === 3 ? 'Required' : 'Not required'], ['Tax amount shown', tier >= 2 || qc ? 'Required' : 'Not required']] as [string, string][], note: `Bands: under ${money(t1, 'CA')}, ${money(t1, 'CA')} to ${money(t2 - 0.01, 'CA', 2)}, ${money(t2, 'CA')} or more.` };
  },
});
