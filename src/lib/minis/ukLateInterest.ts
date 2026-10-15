// UK Late Payment of Commercial Debts (Interest) Act 1998: 8% + reference rate, plus compensation.
import { money, pctText } from './_kit';
import { ukLateInterest, addDays } from '../engine/terms';
import { BOE } from '../engine/params';
import { longDate } from '../invoice-model';
export default () => ({
  title: 'Statutory interest and compensation on a late invoice',
  cta: 'Add it to a new invoice',
  inputs: [{ id: 'a', label: 'Unpaid invoice amount', def: 4800, unit: '£', max: 10_000_000, decimals: 2 }, { id: 'd', label: 'Days late', def: 45, unit: 'days', max: 3650 }],
  run: ({ a, d }: Record<string, number>) => {
    const due = BOE.last_observation; // interest starting now uses the latest reference rate
    const r = ukLateInterest(a, due, addDays(due, Math.round(d)));
    return { head: ['You can claim', money(r.interest + r.compensation, 'UK', 2)] as [string, string], rows: [['Statutory interest', money(r.interest, 'UK', 2)], ['Fixed compensation', money(r.compensation, 'UK', 0)], ['Rate applied', `${pctText(r.rate, 2)} a year (8% + ${pctText(r.base, 2)})`], ['Interest per day', money(r.daily, 'UK', 2)]] as [string, string][], note: `Reference rate: Bank Rate on ${longDate(r.referenceDay, 'UK')}.` };
  },
});
