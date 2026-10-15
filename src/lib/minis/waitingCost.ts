// Payment terms: what waiting for the money costs the seller.
import { money } from './_kit';
import { P } from '../engine/params';
export default () => ({
  title: 'What longer payment terms cost you',
  cta: 'Set the terms on your invoice',
  inputs: [{ id: 'a', label: 'Invoices per month', def: 12000, unit: '$', max: 10_000_000, decimals: 2 }, { id: 'n', label: 'Payment terms', def: 30, unit: 'days', max: 365 }, { id: 'r', label: 'Your cost of borrowing', def: 9, unit: '%', max: 60, decimals: 2 }],
  run: ({ a, n, r }: Record<string, number>) => {
    const tied = (a * 12 * n) / 365;
    const cost = tied * (r / 100);
    const at30 = (a * 12 * 30 * (r / 100)) / 365;
    return { head: ['Money waiting to be paid, on average', money(tied, 'US', 0)] as [string, string], rows: [['Yearly cost of that wait', money(cost, 'US', 0)], ['Same at Net 30', money(at30, 'US', 0)], ['UK default if nothing agreed', `${P.uk.late_payment.default_days} days`], ['UK business-to-business ceiling', `${P.uk.late_payment.b2b_max_days} days, unless fair`]] as [string, string][] };
  },
});
