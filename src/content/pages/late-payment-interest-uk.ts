import { definePage } from '../../lib/page-types';
import { BOE } from '../../lib/engine/params';

const refs = BOE.reference_rates.slice(-6);
const cur = BOE.reference_rates[BOE.reference_rates.length - 1];

export default definePage({
  id: 'late-payment-interest-uk',
  path: '/guides/late-payment-interest-uk/',
  group: 'guides',
  kind: 'guide',
  order: 50,
  nav: 'Late payment interest (UK)',
  card: 'Statutory interest at 8% over the reference rate, plus £40, £70 or £100 per invoice.',
  title: 'Late Payment Interest UK 2026: Statutory Rate, Compensation',
  description: 'Late payment interest in the UK for 2026: 8% over the Bank of England reference rate, daily interest, and £40, £70 or £100 fixed compensation per invoice.',
  h1: 'Late payment interest in the UK: what you can add to an unpaid invoice',
  intro: 'Type the amount and how many days late it is: the statutory interest and the fixed compensation come out at once.',
  mini: 'ukLateInterest',
  resume: (h) => `A business customer in the UK who pays an invoice late owes you statutory interest under the Late Payment of Commercial Debts (Interest) Act 1998, unless your contract sets a different rate. The rate is ${h.pct(h.P.uk.late_payment.margin)} a year over the Bank of England reference rate, and the reference rate is fixed twice a year: the Bank Rate in force on 30 June applies to interest that starts to run between 1 July and 31 December, and the rate on 31 December applies from 1 January to 30 June. The Bank Rate on ${h.date(cur.reference_day)} was ${h.pct(cur.base / 100, 2)}, so a debt that fell late from ${h.date(cur.from)} earns ${h.pct(h.P.uk.late_payment.margin + cur.base / 100, 2)} a year. Interest is simple, worked out per day on a 365-day year. On top, you can charge a fixed sum once per invoice for the cost of recovery: ${h.money(40, 'UK')} on a debt under ${h.money(1000, 'UK')}, ${h.money(70, 'UK')} up to ${h.money(9999.99, 'UK', 2)} and ${h.money(100, 'UK')} from ${h.money(10000, 'UK')}. Both apply only between businesses, never to consumers.`,
  faqs: (h) => [
    { q: 'Can I charge UK statutory late payment interest to a private individual?', a: 'No. The Late Payment of Commercial Debts (Interest) Act 1998 covers contracts between businesses, including sole traders and public authorities acting as buyers. A consumer who pays late can only be charged interest if your terms with them say so and the term is fair; otherwise the remedy is a claim for the debt itself.' },
    { q: 'Which Bank of England rate applies to UK late payment interest on my invoice?', a: `The rate in force on the last 30 June or 31 December before the day interest starts to run, which is the day after the due date. It stays fixed for that debt even if the Bank Rate changes later. For interest starting between ${h.date(cur.from)} and the following half-year, it is ${h.pct(cur.base / 100, 2)}, read on ${h.date(cur.reference_day)}.` },
    { q: 'When does UK late payment interest start if we never agreed a payment date?', a: `If no date was agreed, a business payment is late ${h.P.uk.late_payment.default_days} days after the later of the day the customer received the invoice and the day you delivered the goods or service. Interest runs from the next day. Putting a due date on every invoice removes the argument about when the invoice arrived.` },
    { q: 'Is the £40, £70 or £100 late payment compensation charged once or every month?', a: `Once per unpaid invoice, not per month and not per reminder. The band depends on the size of the debt: ${h.money(40, 'UK')} below ${h.money(1000, 'UK')}, ${h.money(70, 'UK')} from ${h.money(1000, 'UK')} to ${h.money(9999.99, 'UK', 2)}, ${h.money(100, 'UK')} at ${h.money(10000, 'UK')} or more. A supplier may also claim reasonable recovery costs beyond that sum.` },
    { q: 'Do I need to send a new invoice to claim UK late payment interest?', a: 'GOV.UK suggests sending a new invoice when you decide to add interest to the money you are owed. It shows the original invoice number, the days late, the rate used and the compensation band, so the customer can check the figures. You can make it in the generator, with the interest and the compensation on lines of their own and the original invoice number in the reference.' },
    { q: 'Does a rate written in my contract replace UK statutory late payment interest?', a: 'Yes. GOV.UK states that you cannot claim statutory interest if a different rate of interest is set in the contract, so the contract rate is the one you charge. The exception runs the other way for public authorities: in a contract with one, you cannot use a rate lower than the statutory rate. Check your terms before adding interest to an invoice.' },
  ],
  body: (h) => {
    const ex = h.P.uk.late_payment.official_example;
    const now = h.late(4800, '2026-08-31', '2026-10-15');
    const sizes = [600, 2500, 12000];
    return `
<h2>The rate, and the date that fixes it</h2>
<p>The Act sets the interest at ${h.pct(h.P.uk.late_payment.margin)} a year over the "official dealing rate" of the Bank of England. Article 4 of the ${h.src('uk_late_rate_order', 'Rate of Interest (No. 3) Order 2002')} then freezes that base for six months at a time: the rate in force on 30 June serves for interest that starts to run from 1 July to 31 December, the rate on 31 December for interest starting from 1 January to 30 June. What matters is when the debt fell late, not when you claim it. A debt that became overdue in November 2026 keeps the reference rate read on 30 June 2026 for its whole life, even if it is paid two years later.</p>
${h.table(['Interest starting from', 'Reference day', 'Bank Rate', 'Statutory rate'], refs.map((r) => [h.date(r.from), h.date(r.reference_day), h.pct(r.base / 100, 2), h.pct(h.P.uk.late_payment.margin + r.base / 100, 2)]), 'Reference rates from the Bank of England database (series IUDBEDR), refreshed each week', ['l', 'l', 'r', 'r'])}
<p>The table is built from the ${h.src('boe_bank_rate', 'Bank of England Bank Rate history')}, which a scheduled job reads every week. When the Bank changes its rate in the middle of a half-year, nothing changes for debts already overdue; only the next 30 June or 31 December reading moves the statutory figure.</p>
<h2>Working out the interest day by day</h2>
<p>Statutory interest is simple interest. Multiply the debt by the yearly rate, divide by 365 to get the daily amount, and multiply by the number of days since the due date. ${h.src('uk_late_interest', 'GOV.UK')} gives its own worked example: a debt of ${h.money(ex.debt, 'UK')} at a base rate of ${h.pct(ex.base, 1)} costs ${h.money(ex.annual, 'UK')} a year, about ${h.money(ex.daily, 'UK', 2)} a day, so ${h.money(ex.interest, 'UK', 2)} after ${ex.days} days. The calculator rounds the daily figure to the penny in the same way, so it reproduces that example exactly.</p>
<p>With today's reference rate the arithmetic looks like this. An invoice for ${h.money(4800, 'UK')} due on ${h.date('2026-08-31')} and paid on ${h.date('2026-10-15')} is ${now.days} days late. Interest starts on 1 September, so the 30 June reading applies: ${h.pct(now.rate, 2)} a year, ${h.money(now.daily, 'UK', 2)} a day, ${h.money(now.interest, 'UK', 2)} in total, plus ${h.money(now.compensation, 'UK')} of fixed compensation because the debt is between ${h.money(1000, 'UK')} and ${h.money(9999.99, 'UK', 2)}.</p>
<h2>The fixed compensation bands</h2>
<p>The ${h.src('uk_late_costs', 'debt recovery costs')} are a flat sum per invoice, on top of the interest. They exist so that a small business can recover something for the time spent chasing, without itemising it.</p>
${h.table(['Unpaid invoice', 'Compensation', 'Interest after 30 days late', 'Total you can add'], sizes.map((d) => { const r = h.late(d, '2026-09-30', '2026-10-30'); return [h.money(d, 'UK'), h.money(r.compensation, 'UK'), h.money(r.interest, 'UK', 2), h.money(r.interest + r.compensation, 'UK', 2)]; }), 'Three invoice sizes, due 30 September 2026 and paid 30 days late, computed by the engine', ['r', 'r', 'r', 'r'])}
<p>The bands are applied to the size of the debt, which is the invoice amount including VAT. A supplier who spends more than the flat sum, on a debt collector for example, can claim reasonable costs beyond it, but must be ready to justify them.</p>
<h2>When a payment is late in the first place</h2>
<p>${h.src('uk_late_terms', 'GOV.UK')} sets out the default: if you agree a payment date, it should usually be within ${h.P.uk.late_payment.public_max_days} days for a public authority and ${h.P.uk.late_payment.b2b_max_days} days between businesses, and a longer period between businesses must be fair to both. If nothing was agreed, the payment is late ${h.P.uk.late_payment.default_days} days after the customer received the invoice, or after you delivered, whichever is later. That is the strongest reason to print a due date on every invoice: it turns a vague "within a month" into a date that starts the clock. The ${h.a('payment-terms', 'payment terms guide')} compares the usual choices.</p>
<h2>Claiming it in practice</h2>
<p>Most suppliers mention the right to statutory interest in their terms and on the invoice itself, then decide case by case whether to charge it. If you do, send a separate invoice for the interest and the compensation, referring to the original invoice number. Keep the calculation: the debt, the due date, the reference rate and the number of days. If the customer still does not pay, the interest and the compensation can be included in a court claim for the debt.</p>
<!--mini:earlyDiscount-->
<p>A gentler lever works before the due date rather than after it: a small discount for early payment. The calculator above shows its true yearly cost, often far higher than the statutory rate, which is why many firms prefer to rely on interest. The ${h.a('early-payment-discount', 'early payment discount guide')} explains the trade-off.</p>
<h2>What the statute does not cover</h2>
<p>The Act applies to contracts for the supply of goods or services where both parties act in the course of a business. It does not apply to sales to consumers, and it gives way when your contract already sets a rate of interest for late payment, as GOV.UK points out. Public authorities buying from you are covered, with a payment period that should usually stay within ${h.P.uk.late_payment.public_max_days} days. The text itself is on ${h.src('uk_late_act', 'legislation.gov.uk')}.</p>`;
  },
  related: ['payment-terms', 'early-payment-discount', 'vat-invoice-requirements', 'vat-invoice-generator-uk', 'invoice-numbering'],
  sources: ['uk_late_interest', 'uk_late_costs', 'uk_late_terms', 'uk_late_rate_order', 'uk_late_act', 'boe_bank_rate'],
});
