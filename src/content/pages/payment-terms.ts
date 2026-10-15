import { definePage } from '../../lib/page-types';
import { TERMS, dueDate } from '../../lib/engine/terms';

const issue = '2026-10-15';

export default definePage({
  id: 'payment-terms',
  path: '/guides/payment-terms/',
  group: 'guides',
  kind: 'guide',
  order: 30,
  nav: 'Payment terms',
  card: 'Net 30, EOM, due on receipt: what each term means, the due date it gives and what waiting costs.',
  title: 'Payment Terms on Invoices 2026: Net 30, EOM and Legal Limits',
  description: 'Payment terms for 2026: Net 7 to Net 90, end of month, due on receipt, the UK 30 and 60 day rules, and what each extra day of credit costs a small business.',
  h1: 'Payment terms: choosing the due date on your invoices',
  intro: 'Enter what you invoice each month and your terms: see how much cash is waiting and what that wait costs.',
  mini: 'waitingCost',
  resume: (h) => `Payment terms tell the customer when the invoice must be paid, and they are a credit you give: every day between delivery and payment is money of yours sitting in the customer's account. "Net 30" means the full amount is due 30 days after the invoice date, "EOM" means by the end of the month of the invoice, and "due on receipt" means now. An invoice dated ${h.date(issue, 'US')} on Net 30 is due on ${h.date(dueDate(issue, 'net30'), 'US')}; on 30 days end of month, on ${h.date(dueDate(issue, 'eom30'), 'US')}. The law steps in at the edges. In the UK, if no date is agreed, a business payment becomes late ${h.P.uk.late_payment.default_days} days after the customer receives the invoice or the goods or service, whichever is later, and an agreed period between businesses should normally not exceed ${h.P.uk.late_payment.b2b_max_days} days, or ${h.P.uk.late_payment.public_max_days} for public authorities. In Canada, the terms of payment are a required detail of any invoice of ${h.money(h.P.ca.itc_tiers[1], 'CA')} or more. The calculator above shows what a longer term costs you in a year.`,
  faqs: (h) => [
    { q: 'What does Net 30 mean on an invoice, exactly?', a: `The whole amount is due 30 calendar days after the invoice date, not after the customer receives it and not 30 working days. An invoice dated ${h.date(issue, 'US')} on Net 30 is due on ${h.date(dueDate(issue, 'net30'), 'US')}. Writing the due date itself on the invoice, as the generator does, removes any argument about how to count.` },
    { q: 'What is the difference between Net 30 and 30 days end of month?', a: `Net 30 counts from the invoice date. "30 days end of month" counts 30 days from the last day of the invoice's month, so it is always longer: an invoice dated ${h.date(issue, 'US')} is due on ${h.date(dueDate(issue, 'net30'), 'US')} on Net 30 but ${h.date(dueDate(issue, 'eom30'), 'US')} on 30 days EOM. Large buyers favour EOM terms because they batch payments monthly.` },
    { q: 'Can a UK business customer insist on 90-day payment terms?', a: `Terms are a matter of agreement, but GOV.UK says an agreed period between businesses should usually be within ${h.P.uk.late_payment.b2b_max_days} days, and longer only if it is fair to both. Public authorities should pay within ${h.P.uk.late_payment.public_max_days} days. Once the agreed date passes, statutory interest can run unless the contract sets its own rate.` },
    { q: 'Which payment terms should a freelancer start with?', a: 'Shorter terms get paid faster, and small clients rarely object to 14 days. Larger companies often impose their own terms through purchase orders, so check the order before you invoice. A deposit at the start of a long project, and invoices at each stage rather than one at the end, reduce what is at stake if a client pays late.' },
    { q: 'Do payment terms have to be printed on an invoice?', a: `In Canada they do from ${h.money(h.P.ca.itc_tiers[1], 'CA')}: the Input Tax Credit Information Regulations list the terms of payment among the details a customer needs to claim the GST/HST. Elsewhere they are not a tax requirement, but without them a UK customer's payment only becomes late ${h.P.uk.late_payment.default_days} days after receipt, and nobody knows when to chase.` },
    { q: 'Is "due on receipt" a good payment term?', a: 'It asks for immediate payment, which suits one-off sales, small amounts and new customers. In practice many accounts departments still pay on their next payment run, so it does not guarantee speed. For a regular business client, a short fixed term such as Net 7 or Net 14 with the due date printed is clearer to chase.' },
  ],
  body: (h) => `
<h2>The usual terms and the due dates they give</h2>
<p>The table applies each term offered by the generator to the same invoice, dated ${h.date(issue, 'US')}. The due date is computed the way the generator computes it, so what you see here is what prints on the invoice.</p>
${h.table(['Term', 'Meaning', 'Due date for an invoice dated October 15, 2026'], TERMS.map((t) => [t.label, t.days === 0 ? 'Payable when received' : t.days ? `${t.days} days after the invoice date` : t.value === 'eom' ? 'Last day of the invoice month' : '30 days after the end of the invoice month', h.date(dueDate(issue, t.value), 'US')]), 'Payment terms and due dates', ['l', 'l', 'l'])}
<p>Two details trip people up. Calendar days count, weekends included, unless your contract says otherwise. And the count starts from the invoice date, so dating an invoice the day you send it, not the day you finished the work two weeks earlier, quietly adds two weeks of credit.</p>

<h2>What the law says about the due date</h2>
<h3>United Kingdom: a default and a ceiling</h3>
<p>GOV.UK's guidance on late commercial payments sets the frame for business-to-business invoices. If you agree a payment date, it should usually be within ${h.P.uk.late_payment.public_max_days} days for public authorities and ${h.P.uk.late_payment.b2b_max_days} days between businesses; a longer period is possible between businesses only if it is fair to both. If you agree nothing, the payment is late ${h.P.uk.late_payment.default_days} days after the customer gets the invoice, or after you deliver the goods or service if that is later. From that point you can claim statutory interest and a fixed sum per invoice, covered in the ${h.a('late-payment-interest-uk', 'late payment interest guide')}. These rules come from the Late Payment of Commercial Debts (Interest) Act 1998 and do not apply to sales to consumers.</p>
<h3>Canada: the terms belong on larger invoices</h3>
<p>Canada does not set a default due date in its tax rules, but it does make the terms part of the invoice. Under section 3 of the Input Tax Credit Information Regulations, a supporting document for a supply of ${h.money(h.P.ca.itc_tiers[1], 'CA')} or more must show the terms of payment, alongside the buyer's name and a description. Revenu Québec's table for the QST says the same. An invoice without terms at that level leaves your customer short of a detail for its input tax credit.</p>
<h3>United States and Australia</h3>
<p>Neither the IRS nor the ATO sets invoice payment terms in the sources used on this site. The due date is whatever the contract or the invoice says, which is one more reason to print the date itself rather than only "Net 30".</p>

<h2>What a longer term costs you</h2>
<p>A business that invoices the same amount every month carries, on average, a month's worth of invoices for every 30 days of credit it gives. The calculator at the top turns that into money: at ${h.money(12000, 'US')} invoiced a month on Net 30, about ${h.money(12000 * 12 * 30 / 365, 'US', 0)} is always waiting to be paid; on Net 60 it doubles. Whether that matters depends on what the cash would otherwise do. If it pays down an overdraft at 9%, each extra 30 days of terms costs roughly ${h.money(12000 * 12 * 30 / 365 * 0.09, 'US', 0)} a year.</p>
<p>Offering an early payment discount is one way to buy the cash back, at a price that is usually higher than it looks: the ${h.a('early-payment-discount', 'early payment discount guide')} works out the yearly rate behind "2/10 net 30". Taking a deposit is another, explained in the ${h.a('deposit-invoice', 'deposit invoice guide')}.</p>

<h2>Writing the terms on the invoice</h2>
<p>Good terms on an invoice answer three questions: when, how and what happens if not. When: print the due date in full, and the term that produced it. How: the bank details, the reference to quote, and any accepted card or online method. What happens if not: in the UK you may state that statutory interest applies to late payment; elsewhere, a late fee needs to be agreed in your contract or terms of sale before you can charge it. Keep the wording factual. A line such as "Payment due by 14 November 2026 by bank transfer, quoting INV-2026-0042" gets paid faster than a paragraph of conditions.</p>
${h.table(['Situation', 'Term that usually fits', 'Why'], [
  ['First job for a new client', 'Due on receipt or Net 7', 'Little trust built yet; small exposure'],
  ['Regular monthly client', 'Net 14 or Net 30', 'Predictable, easy for their payment run'],
  ['Large company with a purchase order', 'Their terms, often 30 days EOM', 'Set by their procurement; quote the PO number'],
  ['Long project', 'Deposit, then stage invoices on Net 14', 'Limits what is unpaid at any time'],
  ['UK public authority', `Within ${h.P.uk.late_payment.public_max_days} days`, 'The GOV.UK guidance expects it'],
], 'Choosing terms', ['l', 'l', 'l'])}
<!--mini:earlyDiscount-->
<p>When you are ready, set the terms in the ${h.a('home', 'invoice generator')}: the due date follows them automatically, and you can switch to a custom date for an agreed exception.</p>`,
  related: ['early-payment-discount', 'late-payment-interest-uk', 'deposit-invoice', 'how-to-write-an-invoice', 'gst-hst-invoice-requirements'],
  sources: ['uk_late_terms', 'uk_late_act', 'ca_itc_regs', 'rq_invoices'],
});
