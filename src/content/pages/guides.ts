import { definePage } from '../../lib/page-types';

export default definePage({
  id: 'guides',
  path: '/guides/',
  group: 'guides',
  kind: 'index',
  order: 0,
  nav: 'All guides',
  card: 'Every invoicing guide, grouped by country and by question, each with its own calculator.',
  title: 'Invoicing Guides 2026: VAT, GST, Sales Tax and Payment Terms',
  description: 'Invoicing guides for 2026 in the US, UK, Canada and Australia: required details, VAT, GST, HST, sales tax, CIS and late interest, each with its own calculator.',
  h1: 'Invoicing guides for the US, the UK, Canada and Australia',
  intro: 'Start from the same sale under four tax systems, then pick the guide for your question.',
  mini: 'taxCompare',
  resume: (h) => `These guides answer the questions that come up between typing an invoice and getting it paid, and each one carries a calculator for its own topic rather than generic advice. They are grouped the way the problems arrive. First the document itself: what an invoice must contain, when a receipt is enough, how to number invoices. Then the tax on it, country by country: UK VAT at ${h.pct(h.P.uk.vat_rates.standard)} with its simplified invoice up to ${h.money(h.P.uk.simplified_invoice_max, 'UK')}, the construction reverse charge and the CIS deduction of ${h.pct(h.P.uk.cis.registered)} or ${h.pct(h.P.uk.cis.unregistered)}; Canadian GST, HST, PST and QST with the ${h.money(h.P.ca.itc_tiers[0], 'CA')} and ${h.money(h.P.ca.itc_tiers[1], 'CA')} detail bands; Australian GST at ${h.pct(h.P.au.gst)} and the tax invoice rules; US sales tax state by state. Last, money and time: payment terms, early payment discounts, deposits and UK statutory interest at ${h.pct(h.P.uk.late_payment.margin)} over the Bank of England rate. Every figure comes from the same official sources as the generator.`,
  faqs: (h) => [
    { q: 'Which invoicing guide should I read first as a new freelancer?', a: 'Start with the guide on writing an invoice: it lists the details every invoice needs and what your country adds, and its checker counts what is missing. Then read the guide for your tax situation, VAT, GST/HST or sales tax, and the one on payment terms, since those three decide whether the invoice is correct and when it gets paid.' },
    { q: 'Do these guides apply if I sell from one country to another?', a: 'Each guide follows the rules of one country and says so. Cross-border sales raise questions the guides only touch: in the UK, the VAT total in sterling on a foreign currency invoice; in the US, whether you must collect a state\'s tax as a remote seller. For anything beyond that, the tax authority of each country involved is the reference.' },
    { q: 'How often are the rates in the invoicing guides checked?', a: `A scheduled job re-reads the Bank of England rate and the official pages every week and flags any value that is no longer found, and every rule is read in full at least once a year. The parameter file was last checked on ${h.date(h.P.retrieved_at)}; the methodology page lists each source with its reading date.` },
    { q: 'Are the calculators in the guides the same as the invoice generator?', a: 'Yes, they call the same tax engine, so a figure in a guide and the figure on your invoice cannot disagree. Each guide\'s calculator isolates one question, such as the GST inside a price or the interest on a late invoice, and links to the full generator to turn the answer into a document.' },
    { q: 'Can a guide tell me whether I must register for VAT or GST?', a: `They give the published thresholds, ${h.money(h.P.uk.vat_threshold, 'UK')} of taxable turnover in the UK, ${h.money(h.P.au.registration_threshold, 'AU')} of GST turnover in Australia and ${h.money(h.P.ca.small_supplier, 'CA')} for Canadian small suppliers, but whether you must register depends on how your turnover is measured. HMRC, the ATO or the CRA decide, and an accountant can apply the test to your figures.` },
    { q: 'Is there a guide for invoices in the United States specifically?', a: 'Yes, the sales tax guide covers US invoices: the general rate of each of the 50 states and DC, the local rates added on top, which lines to tax and how to show the tax. The US invoice generator page adds the layout and the details American customers expect, since there is no federal invoice format.' },
  ],
  body: (h) => `
<h2>The invoice itself</h2>
<p>These three guides deal with the document, whatever the tax: what goes on it, which kind of document a situation needs, and how to keep the numbers straight from one year to the next.</p>
${h.table(['Guide', 'The question it answers', 'Its calculator'], [
  [h.a('how-to-write-an-invoice', 'How to write an invoice'), 'Which details must be on my invoice, in my country, at this amount?', 'Counts the required details still missing'],
  [h.a('invoice-vs-receipt', 'Invoice vs receipt'), 'Do I send an invoice, a receipt, or one document that is both?', 'Names the document for your case'],
  [h.a('invoice-numbering', 'Invoice numbering'), 'How do I number invoices so none repeats or goes missing?', 'Gives your next numbers'],
], 'Guides on the document', ['l', 'l', 'l'])}

<h2>United Kingdom</h2>
<p>UK invoicing is shaped by VAT registration. Below the threshold you issue an ordinary invoice and must not add VAT; once registered, HMRC's list of details applies, with a lighter simplified invoice for small sales. Building work adds two special regimes, and late payment has its own statute.</p>
${h.table(['Guide', 'The question it answers', 'Its calculator'], [
  [h.a('vat-invoice-requirements', 'VAT invoice requirements'), 'What must a full, simplified or modified VAT invoice show?', 'Simplified or full, and the VAT inside a price'],
  [h.a('reverse-charge-invoice', 'Reverse charge invoice'), 'How do I invoice construction work under the domestic reverse charge?', 'What you bill and what the customer accounts for'],
  [h.a('cis-deduction', 'CIS deduction'), 'How much will the contractor deduct from my invoice under CIS?', 'Deduction on labour only'],
  [h.a('invoice-in-foreign-currency', 'Invoice in a foreign currency'), 'Can I invoice in euros or dollars, and what about the VAT?', 'VAT total in sterling'],
  [h.a('late-payment-interest-uk', 'Late payment interest'), 'What can I add when a business customer pays late?', 'Statutory interest and compensation'],
], 'Guides for UK invoices', ['l', 'l', 'l'])}

<h2>Canada</h2>
<p>In Canada the province sets the structure of the tax, a single HST or the GST with a provincial tax on top, and the invoice total sets how much detail the customer needs to claim it back.</p>
${h.table(['Guide', 'The question it answers', 'Its calculator'], [
  [h.a('gst-hst-pst-by-province', 'GST, HST and PST by province'), 'Which taxes, at which rates, in each province and territory?', 'Tax on an amount, by province'],
  [h.a('gst-hst-invoice-requirements', 'GST/HST invoice requirements'), 'What must the invoice show for the customer to get its input tax credit?', 'Details required at your amount'],
], 'Guides for Canadian invoices', ['l', 'l', 'l'])}

<h2>Australia and the United States</h2>
${h.table(['Guide', 'The question it answers', 'Its calculator'], [
  [h.a('tax-invoice-requirements-australia', 'Tax invoice requirements (Australia)'), 'When is a tax invoice required, and what are the seven details?', 'GST inside a price and the invoice it needs'],
  [h.a('sales-tax-on-invoices', 'Sales tax on invoices (US)'), 'Which rate goes on a US invoice, and on which lines?', 'State rate plus local rate'],
], 'Guides for Australian and US invoices', ['l', 'l', 'l'])}

<h2>Getting paid</h2>
<p>The last group is about money and time, and applies in every country. Terms decide when an invoice is due, a discount or a deposit changes when the cash arrives, and in the UK the law decides what you may add when it is late.</p>
${h.table(['Guide', 'The question it answers', 'Its calculator'], [
  [h.a('payment-terms', 'Payment terms'), 'Net 30, EOM or due on receipt, and what does the wait cost me?', 'Cash waiting and its yearly cost'],
  [h.a('early-payment-discount', 'Early payment discount'), 'Is 2/10 net 30 a good deal for me?', 'The yearly rate behind the discount'],
  [h.a('deposit-invoice', 'Deposit invoice'), 'How do I invoice a deposit and then the balance?', 'Tax on each of the two invoices'],
], 'Guides on payment', ['l', 'l', 'l'])}

<h2>From a guide to an invoice</h2>
<p>Every guide ends at the same place: the ${h.a('home', 'invoice generator')}, or one of the ${h.a('templates', 'templates')} that start it with lines and wording for a given job. The guides and the generator share one engine and one parameter file, so a rate corrected in one place is corrected everywhere. The country pages, ${h.a('vat-invoice-generator-uk', 'UK')}, ${h.a('invoice-generator-canada', 'Canada')}, ${h.a('tax-invoice-generator-australia', 'Australia')} and ${h.a('invoice-generator-usa', 'United States')}, open the generator already set to that country.</p>
<p>The guides state published rules and work through examples; they are not tax advice. Where a rule turns on facts only you know, such as whether a customer is an end user for the reverse charge or whether a service is taxable in your state, they say so and point to the authority's own page.</p>`,
  related: ['how-to-write-an-invoice', 'vat-invoice-requirements', 'gst-hst-invoice-requirements', 'tax-invoice-requirements-australia', 'sales-tax-on-invoices', 'payment-terms'],
  sources: ['uk_vat_records', 'ca_itc_regs', 'ato_tax_invoices', 'uk_late_interest'],
});
