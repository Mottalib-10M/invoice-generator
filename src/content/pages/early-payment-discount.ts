import { definePage } from '../../lib/page-types';
import { earlyDiscount } from '../../lib/engine/terms';

const cases: Array<[number, number, number]> = [[1, 10, 30], [2, 10, 30], [2, 10, 60], [3, 15, 45], [5, 7, 30]];

export default definePage({
  id: 'early-payment-discount',
  path: '/guides/early-payment-discount/',
  group: 'guides',
  kind: 'guide',
  order: 40,
  nav: 'Early payment discount',
  card: 'What "2/10 net 30" really costs: the yearly rate behind a prompt payment discount.',
  title: 'Early Payment Discount 2026: What 2/10 Net 30 Really Costs',
  description: 'Early payment discount in 2026: how 2/10 net 30 works, its yearly cost of about 37%, how to word it on an invoice and when a cheaper way to get paid exists.',
  h1: 'Early payment discounts: the yearly rate behind 2/10 net 30',
  intro: 'Enter the discount and the two deadlines to see what the offer costs you as a yearly rate.',
  mini: 'earlyDiscount',
  resume: (h) => {
    const r = earlyDiscount(5000, 2, 10, 30);
    return `An early payment discount, written "2/10 net 30" on an invoice, lets the customer take 2% off if it pays within 10 days, and otherwise asks for the full amount within 30. It looks like a small gesture, but it is a loan in reverse: you give up 2% to receive the money 20 days sooner, and over a year that price adds up. The usual formula, discount divided by one minus the discount, times 365 divided by the days gained, puts the cost of 2/10 net 30 at about ${h.pct(r.annual, 1)} a year. On a ${h.money(5000, 'US')} invoice, the customer who pays early sends ${h.money(r.pay, 'US', 2)} and keeps ${h.money(r.saving, 'US', 2)}. That can still be worth it: when cash is short, when a customer pays slowly, or when the alternative is an expensive overdraft. The calculator above runs your own percentage and deadlines, and the sections below show how to word the term and how it interacts with VAT, GST and sales tax on the invoice.`;
  },
  faqs: (h) => [
    { q: 'What does 2/10 net 30 mean on an invoice?', a: 'The customer may deduct 2% from the invoice if it pays within 10 days of the invoice date; otherwise the full amount is due within 30 days. The first number is the discount, the second the discount period, and "net 30" the normal term. Some invoices write it as "2% 10, net 30"; spelling it out in words avoids any doubt.' },
    { q: 'Why is a 2% early payment discount so expensive?', a: `Because the 2% buys only 20 days of money. Spread over a year, 20-day periods repeat about 18 times, so the discount behaves like an interest rate of about ${h.pct(earlyDiscount(1000, 2, 10, 30).annual, 1)} a year. A 1/10 net 30 offer costs about ${h.pct(earlyDiscount(1000, 1, 10, 30).annual, 1)}, still far above most business borrowing.` },
    { q: 'Must a UK VAT invoice mention an early payment discount?', a: 'Yes, if you offer one. HMRC\'s list of details for a full VAT invoice in VAT Notice 700/21 includes "the rate of any cash discount offered". Write the percentage and the condition on the invoice, for example "2% discount if paid by 25 October 2026", next to the payment terms.' },
    { q: 'Can a customer take the early payment discount after the deadline?', a: 'Not unless you agree. Customers sometimes deduct it anyway when they pay late. You can accept, which turns the discount into a cut in price, or ask for the difference. Printing the exact discount deadline as a date on the invoice, rather than "10 days", makes a late deduction easier to refuse.' },
    { q: 'Is an early payment discount better than charging late fees?', a: 'They work on different customers. A discount rewards those able to pay early and costs you on every invoice they take it on. A late fee or, in the UK, statutory interest only bites when a customer is late, and costs prompt payers nothing. Many small businesses use clear short terms and late interest rather than a discount.' },
  ],
  body: (h) => `
<h2>The yearly rate of common offers</h2>
<p>The table runs the formula used by the calculator on five terms seen on real invoices. The "days gained" are the difference between the normal deadline and the discount deadline: that is how much sooner the money arrives.</p>
${h.table(['Terms', 'Discount', 'Days gained', 'Yearly rate', 'On a 5,000 invoice'], cases.map(([p, d, n]) => { const r = earlyDiscount(5000, p, d, n); return [`${p}/${d} net ${n}`, h.pct(p / 100), `${r.window}`, h.pct(r.annual, 1), `${h.money(r.saving, 'US', 2)} off`]; }), 'Early payment discounts expressed as a yearly rate', ['l', 'r', 'r', 'r', 'r'])}
<p>Two things move the rate. The discount itself, obviously, but even more the gap between the two deadlines: 2/10 net 60 gains 50 days and costs much less per year than 2/10 net 30, because the same 2% buys a longer wait. A discount for paying on day 7 of a 30-day term buys 23 days.</p>

<h2>How the formula works</h2>
<p>If the customer takes the discount, you receive 98% of the invoice 20 days earlier instead of 100% later. Seen from the customer's side, skipping the discount means borrowing 98 from you for 20 days and paying 2 for it. The interest for 20 days is therefore 2 divided by 98, a little over 2%, and the number of 20-day periods in a year is 365 divided by 20. Multiplying the two gives the yearly rate. It is a simple-interest figure; compounding would make it higher still. The formula ignores the customer's risk of not paying at all, which is exactly what a discount can reduce, so it measures the price, not the value.</p>

<h2>Writing it on the invoice</h2>
<p>Put the discount next to the payment terms, with dates rather than day counts:</p>
<ul>
<li>"Total due ${h.money(5000, 'US')} by November 14, 2026. 2% discount (${h.money(100, 'US')}) if paid by October 25, 2026: pay ${h.money(4900, 'US')}."</li>
<li>For a UK VAT-registered seller, the rate of the cash discount is one of the details HMRC lists for a VAT invoice, so it must appear whenever the discount is offered.</li>
</ul>
<p>The generator does not compute two totals on the same invoice; write the discount in the notes, as above, and keep the invoice total at the full amount. If the customer takes the discount, record the shortfall as the discount allowed rather than as an unpaid balance.</p>

<h2>The tax on a discounted payment</h2>
<p>A prompt payment discount is different from a discount on the price written on the invoice. A price discount, the "Discount %" field of the generator, reduces the amount before tax, so the tax is charged only on what the customer pays: a 10% discount on a ${h.money(1000, 'UK')} UK sale leaves ${h.money(h.calc({ country: 'UK', region: '', registered: true, discountPct: 10, lines: [{ desc: 'x', qty: 1, price: 1000, tax: 'standard' }] }).tax, 'UK', 2)} of VAT instead of ${h.money(h.calc({ country: 'UK', region: '', registered: true, lines: [{ desc: 'x', qty: 1, price: 1000, tax: 'standard' }] }).tax, 'UK', 2)}. A conditional early payment discount is only known when the customer pays. How each country adjusts the tax for it is a question for the authority's guidance; the sources used on this site do not set it out, so the generator leaves the tax on the full amount and the discount in the notes.</p>
${h.table(['Same 1,000 sale', 'No discount', 'Price discount of 10%'], [
  ['UK, VAT 20%', h.money(h.calc({ country: 'UK', region: '', registered: true, lines: [{ desc: 'x', qty: 1, price: 1000, tax: 'standard' }] }).total, 'UK', 2), h.money(h.calc({ country: 'UK', region: '', registered: true, discountPct: 10, lines: [{ desc: 'x', qty: 1, price: 1000, tax: 'standard' }] }).total, 'UK', 2)],
  ['Australia, GST 10%', h.money(h.calc({ country: 'AU', region: 'NSW', registered: true, lines: [{ desc: 'x', qty: 1, price: 1000, tax: 'gst' }] }).total, 'AU', 2), h.money(h.calc({ country: 'AU', region: 'NSW', registered: true, discountPct: 10, lines: [{ desc: 'x', qty: 1, price: 1000, tax: 'gst' }] }).total, 'AU', 2)],
  ['Manitoba, GST + RST', h.money(h.calc({ country: 'CA', region: 'MB', registered: true, lines: [{ desc: 'x', qty: 1, price: 1000, tax: 'ca_full' }] }).total, 'CA', 2), h.money(h.calc({ country: 'CA', region: 'MB', registered: true, discountPct: 10, lines: [{ desc: 'x', qty: 1, price: 1000, tax: 'ca_full' }] }).total, 'CA', 2)],
], 'A discount on the price reduces the tax with it', ['l', 'r', 'r'])}

<h2>When a discount is worth offering</h2>
<p>Compare the yearly rate with what the money costs you elsewhere. If an overdraft or a credit card balance costs you more than the discount's rate, getting paid early is worth the discount. If the cash would sit in a current account, it is not. A discount also makes sense for customers known to pay late, where it shortens a 60-day reality rather than a 30-day promise, and for one large invoice that would otherwise strain your month. It makes little sense for customers who already pay on time: they simply take the 2%.</p>
<p>Cheaper alternatives exist for most small businesses: shorter terms from the start, a deposit on long jobs, invoices at each stage, and in the UK the right to statutory interest when a business customer is late. The ${h.a('payment-terms', 'payment terms guide')} compares what longer credit costs, and the ${h.a('late-payment-interest-uk', 'late payment interest guide')} what you can add when the deadline passes.</p>
<!--mini:waitingCost-->
<p>To put the discount on a real invoice, open the ${h.a('home', 'invoice generator')}, choose the terms, and write the discount and its deadline in the notes.</p>`,
  related: ['payment-terms', 'late-payment-interest-uk', 'deposit-invoice', 'vat-invoice-requirements', 'how-to-write-an-invoice'],
  sources: ['uk_vat_records', 'uk_late_terms', 'uk_late_interest'],
});
