import { definePage } from '../../lib/page-types';

export default definePage({
  id: 'how-to-write-an-invoice',
  path: '/guides/how-to-write-an-invoice/',
  group: 'guides',
  kind: 'guide',
  order: 10,
  nav: 'How to write an invoice',
  card: 'The details every invoice needs, then the extra ones each country adds, with a checklist.',
  title: 'Writing an Invoice 2026: What to Include, Country by Country',
  description: 'Writing an invoice in 2026: the nine details every invoice needs, the items HMRC, the CRA and the ATO add, and a checklist that counts what yours still lacks.',
  h1: 'How to write an invoice that gets paid and passes a tax check',
  intro: 'Pick the country and the total: the checker below tells you how many required details you still have to fill in.',
  mini: 'invoiceCheck',
  resume: (h) => `An invoice is a request for payment that also serves as a tax record, so writing one well means satisfying two readers: the customer who has to approve and pay it, and the tax authority that may later check it. The core is the same everywhere: a unique number, the date, your business name and address, the customer's name, a description of what you supplied with quantity and price, the amount of any tax and the total due. Each country then adds its own items. HMRC wants a VAT-registered seller to show the VAT number, the time of supply and the VAT rate of each line, with the VAT total in sterling, unless the sale is ${h.money(h.P.uk.simplified_invoice_max, 'UK')} or less and a simplified invoice is enough. In Canada the list grows with the amount, with steps at ${h.money(h.P.ca.itc_tiers[0], 'CA')} and ${h.money(h.P.ca.itc_tiers[1], 'CA')}. In Australia a registered business must title the document a tax invoice and show its ABN, and from ${h.money(h.P.au.buyer_identity_from, 'AU')} the buyer's identity too. The checker above applies these lists to your case.`,
  faqs: (h) => [
    { q: 'What is the minimum an invoice must contain to be valid for my customer?', a: `Across the four countries the shared minimum is a number, the date, your name, the customer, a description, the amount and the total. Whether that is enough depends on your status and the amount: a UK VAT-registered seller needs eight more items, and a Canadian invoice of ${h.money(h.P.ca.itc_tiers[1], 'CA')} or more must add the customer's name, terms of payment and a description before the customer can claim the tax.` },
    { q: 'Does an invoice need a signature or a company stamp?', a: 'None of the official lists used on this site, from HMRC, the Canada Revenue Agency, Revenu Québec or the Australian Taxation Office, asks for a signature or a stamp. A PDF sent by email is a valid invoice in all four countries as long as it carries the required details. Some customers ask for a signature for their own approval process, which is a contract matter, not a tax rule.' },
    { q: 'Can I write an invoice before the work is finished?', a: 'Yes, an invoice can be issued in advance, for a deposit or for a stage of the work. In the UK the date of a VAT invoice can fix the time of supply, so the VAT becomes due for that period. Write what the invoice covers, for example "50% deposit for the kitchen project", so the final invoice can show the balance clearly.' },
    { q: 'Should I write the invoice in my own name or my business name?', a: 'Use the name your customers and the tax authority know you by. A UK limited company must use its full name as on the certificate of incorporation. A UK sole trader trading under another name must also show their own name and an address where legal documents can be delivered. In Australia, the ABN ties the invoice to the registered business.' },
    { q: 'How should I describe the work on an invoice line?', a: 'Precisely enough that a third party could tell what was supplied without asking you: "Logo design, 3 concepts and final files" rather than "Design work". HMRC asks for a description sufficient to identify the goods or services, and the ATO for a brief description with the quantity and the price. One line per item or service also lets each line carry its own tax rate.' },
    { q: 'Do I have to send an invoice when the customer has already paid?', a: `Not always, but tax rules can require a document. A UK VAT-registered business must issue a VAT invoice to another VAT-registered customer within ${h.P.uk.issue_within_days} days of the supply, paid or not. In Australia a customer who asks for a tax invoice on a sale above ${h.money(h.P.au.tax_invoice_on_request_above, 'AU', 2)} must get one within ${h.P.au.provide_within_days} days. Otherwise a receipt usually does the job.` },
  ],
  body: (h) => `
<h2>The nine details every invoice should carry</h2>
<p>Before the country rules, an invoice has to work as a business document. Your customer's accounts team will match it to an order, approve it and pay it, sometimes weeks later and without having spoken to you. Each of these details answers a question they would otherwise have to email you about.</p>
<ol>
<li><strong>The word "Invoice"</strong>, or the exact title your country requires, at the top. A quote or a pro forma must say so instead.</li>
<li><strong>A unique number.</strong> It is how a payment gets matched to the right document. HMRC asks VAT-registered sellers for a sequential number "based on one or more series".</li>
<li><strong>The date of issue</strong>, and the date of supply when the goods or services were delivered on another day.</li>
<li><strong>Your business name, address and contact details</strong>, plus your tax number when you are registered.</li>
<li><strong>The customer's name and address.</strong> For a business, the legal name rather than a contact's first name.</li>
<li><strong>A description of each item</strong>, with the quantity or hours and the unit price.</li>
<li><strong>The tax</strong>, shown as its own line with its rate, or a statement that no tax is charged.</li>
<li><strong>The total due</strong>, after any discount, deposit or deduction.</li>
<li><strong>When and how to pay</strong>: the due date or terms, and bank or payment details.</li>
</ol>
<p>The generator lays these out in that order, and the checklist next to the preview turns red for whichever of them a tax rule makes compulsory in your case.</p>

<h2>What each tax authority adds</h2>
<p>The table sums up the official lists. The guides linked in the last column go through each item and the exceptions.</p>
${h.table(['Country', 'Who sets the list', 'Items added to the core', 'Guide'], [
  ['United Kingdom, VAT-registered', h.src('uk_vat_records', 'HMRC, VAT Notice 700/21'), 'Sequential number, time of supply, VAT number, quantity, unit price, VAT rate and net amount per line, rate of any cash discount, total VAT in sterling', h.a('vat-invoice-requirements', 'VAT invoice requirements')],
  ['United Kingdom, not VAT-registered', h.src('uk_invoice', 'GOV.UK'), 'Supply date; sole traders using a trading name show their own name and an address for legal documents; companies their full registered name', h.a('sole-trader-invoice-template', 'Sole trader invoice')],
  ['Canada', h.src('ca_itc_regs', 'ITC Information Regulations'), `From ${h.money(h.P.ca.itc_tiers[0], 'CA')}: GST/HST registration number and tax amount; from ${h.money(h.P.ca.itc_tiers[1], 'CA')}: customer name, terms of payment, description`, h.a('gst-hst-invoice-requirements', 'GST/HST invoice requirements')],
  ['Quebec', h.src('rq_invoices', 'Revenu Québec'), 'As in Canada, plus the QST registration number; QST amount and description required at any amount', h.a('quebec-invoice-template', 'Quebec invoice')],
  ['Australia, GST-registered', h.src('ato_tax_invoices', 'ATO'), `The words "Tax invoice", ABN, extent each sale is taxable, GST amount; buyer identity or ABN from ${h.money(h.P.au.buyer_identity_from, 'AU')}`, h.a('tax-invoice-requirements-australia', 'Tax invoice requirements')],
  ['United States', 'No federal list', 'Sales tax as a separate line where you collect it; your state may ask for more on exempt or resale sales', h.a('sales-tax-on-invoices', 'Sales tax on invoices')],
], 'What the official lists add to a basic invoice', ['l', 'l', 'l', 'l'])}

<h2>Step by step, the way the generator asks for it</h2>
<h3>1. Decide where the sale is taxed and whether you are registered</h3>
<p>This choice drives everything else. A UK freelancer below the VAT threshold of ${h.money(h.P.uk.vat_threshold, 'UK')} who is not registered must not add VAT; an Ontario consultant registered for GST/HST adds ${h.pct(h.P.ca.provinces.ON.hst)} HST; a Sydney photographer registered for GST adds ${h.pct(h.P.au.gst)}. In the US, the question is whether you hold a seller's permit in the state where the customer takes delivery.</p>
<h3>2. Write the lines</h3>
<p>One line per item or service, with a quantity and a unit price. Hours and an hourly rate work the same way. When one invoice mixes taxable and non-taxable items, for instance design work and printed goods in Texas, or standard-rated and zero-rated goods in the UK, the tax code of each line keeps the tax on the right part only.</p>
<h3>3. Add the tax and the total</h3>
<p>Here is what one ${h.money(2000, 'US')} job before tax becomes when it is invoiced by a registered business in each place, computed by the generator's engine:</p>
${h.table(['Where', 'Tax', 'Total due'], [
  ['England', h.money(h.calc({ country: 'UK', region: '', registered: true, lines: [{ desc: 'x', qty: 1, price: 2000, tax: 'standard' }] }).tax, 'UK', 2), h.money(h.calc({ country: 'UK', region: '', registered: true, lines: [{ desc: 'x', qty: 1, price: 2000, tax: 'standard' }] }).total, 'UK', 2)],
  ['Nova Scotia', h.money(h.calc({ country: 'CA', region: 'NS', registered: true, lines: [{ desc: 'x', qty: 1, price: 2000, tax: 'ca_full' }] }).tax, 'CA', 2), h.money(h.calc({ country: 'CA', region: 'NS', registered: true, lines: [{ desc: 'x', qty: 1, price: 2000, tax: 'ca_full' }] }).total, 'CA', 2)],
  ['Saskatchewan', h.money(h.calc({ country: 'CA', region: 'SK', registered: true, lines: [{ desc: 'x', qty: 1, price: 2000, tax: 'ca_full' }] }).tax, 'CA', 2), h.money(h.calc({ country: 'CA', region: 'SK', registered: true, lines: [{ desc: 'x', qty: 1, price: 2000, tax: 'ca_full' }] }).total, 'CA', 2)],
  ['Victoria, Australia', h.money(h.calc({ country: 'AU', region: 'VIC', registered: true, lines: [{ desc: 'x', qty: 1, price: 2000, tax: 'gst' }] }).tax, 'AU', 2), h.money(h.calc({ country: 'AU', region: 'VIC', registered: true, lines: [{ desc: 'x', qty: 1, price: 2000, tax: 'gst' }] }).total, 'AU', 2)],
  ['Florida (state rate only)', h.money(h.calc({ country: 'US', region: 'FL', registered: true, lines: [{ desc: 'x', qty: 1, price: 2000, tax: 'taxable' }] }).tax, 'US', 2), h.money(h.calc({ country: 'US', region: 'FL', registered: true, lines: [{ desc: 'x', qty: 1, price: 2000, tax: 'taxable' }] }).total, 'US', 2)],
], 'A taxable job of 2,000 before tax, registered seller', ['l', 'r', 'r'])}
<h3>4. Say when and how to pay</h3>
<p>Payment terms are part of the invoice, not an afterthought. In Canada they become a required detail from ${h.money(h.P.ca.itc_tiers[1], 'CA')}. In the UK they also decide when a business customer's payment becomes late and statutory interest can start, as the ${h.a('payment-terms', 'payment terms guide')} explains.</p>
<h3>5. Number it, keep a copy, send it</h3>
<p>Keep a copy of every invoice you issue: HMRC states that a VAT-registered business must keep a copy of every VAT invoice. The ${h.a('invoice-numbering', 'invoice numbering guide')} covers sequences that survive a new year or a second business line.</p>

<h2>The mistakes that get invoices sent back</h2>
<p>Most rejected invoices fail on something small. A purchase order number missing from an invoice to a large company sends it to a queue. A customer's trading name instead of its legal name stops the payment run. A tax line added by a seller who is not registered for that tax is the more serious one: the customer cannot reclaim it, and the seller may have to pay it over anyway. In Australia, a document headed "Invoice" instead of "Tax invoice" can leave a registered customer without the evidence it needs for its GST credit. In the UK, an invoice in euros without the VAT total in sterling is incomplete for a VAT-registered customer.</p>
<p>The checklist catches the missing items; it cannot tell whether a supply is taxable, exempt or zero-rated in law. That choice, made line by line, is yours, and when in doubt the authority's guidance or an accountant settles it.</p>
<!--mini:documentChoice-->
<p>If the customer has already paid, you may need a receipt rather than an invoice: the ${h.a('invoice-vs-receipt', 'invoice vs receipt guide')} sets out when each one is expected, and the ${h.a('home', 'invoice generator')} makes both.</p>`,
  related: ['vat-invoice-requirements', 'gst-hst-invoice-requirements', 'tax-invoice-requirements-australia', 'invoice-numbering', 'invoice-vs-receipt', 'blank-invoice-template'],
  sources: ['uk_invoice', 'uk_vat_records', 'ca_itc_regs', 'rq_invoices', 'ato_tax_invoices'],
});
