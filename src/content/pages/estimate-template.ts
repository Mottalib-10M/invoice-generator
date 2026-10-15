import { definePage } from '../../lib/page-types';

export default definePage({
  id: 'estimate-template',
  path: '/templates/quote-estimate/',
  group: 'templates',
  kind: 'tool',
  order: 50,
  nav: 'Quote or estimate',
  card: 'Price a job before you start it, with the tax shown, then turn it into the invoice.',
  title: 'Quote and Estimate Template 2026: Free PDF with Tax Shown',
  description: 'Free quote and estimate template for 2026: price the job with sales tax, VAT or GST applied, set a validity date, download the PDF. No sign-up, no watermark.',
  h1: 'Quote and estimate template, with the tax already worked out',
  intro: 'Price the job line by line, set how long the price holds, and send a PDF that shows the customer the real total.',
  tool: { country: 'US', preset: 'estimate' },
  resume: (h) => `A quote or estimate is the price you offer before the work starts, and it is not a request for payment: the generator titles it "Estimate" in the United States and "Quote" in the UK, Canada and Australia, replaces the due date with a "valid until" date, and prints a line saying it is not a demand for payment. What makes this template more useful than a blank one is that the tax is already on it. A landscaper in Texas quoting ${h.money(3400, 'US')} of design and planting plus ${h.money(1250, 'US')} of plants shows the customer ${h.money(h.calc({ country: 'US', region: 'TX', registered: true, localRate: 0, lines: [{ desc: 'a', qty: 1, price: 3400, tax: 'taxable' }, { desc: 'b', qty: 1, price: 1250, tax: 'taxable' }] }).total, 'US', 2)} at the state rate alone, before any local rate is added; the same job priced in Bristol at ${h.money(4650, 'UK')} before VAT becomes ${h.money(h.calc({ country: 'UK', region: '', registered: true, lines: [{ desc: 'a', qty: 1, price: 4650, tax: 'standard' }] }).total, 'UK', 2)} with ${h.pct(h.P.uk.vat_rates.standard)} VAT. Customers compare totals, not net prices, so a quote that leaves tax out often loses to one that includes it, or causes an argument when the invoice arrives. When the customer accepts, switch the document to "Invoice", give it an invoice number and the figures carry over unchanged.`,
  faqs: (h) => [
    { q: 'Is a quote or estimate a legally binding price?', a: 'That depends on the wording and on the contract law where you work, not on the template. Generally an "estimate" is read as an approximate figure and a "quote" as a fixed price for the described work, but courts look at what was agreed. Describe the scope precisely, state how long the price is valid, and say what happens if the scope changes. When in doubt about enforceability, ask a lawyer.' },
    { q: 'Should a quote or estimate include sales tax, VAT or GST?', a: `It should show it, because the customer pays the total. If you are registered, the generator adds the tax line exactly as on the future invoice: ${h.pct(h.P.uk.vat_rates.standard)} VAT in the UK, ${h.pct(h.P.au.gst)} GST in Australia, the provincial rate in Canada. A business customer who can reclaim the tax will still want to see it separately. If you are not registered, say so, and no tax is added.` },
    { q: 'Can a quote be used to reclaim VAT or GST?', a: 'No. A quote is an offer, not a record of a supply, so your customer cannot reclaim tax from it. In the UK the VAT invoice must normally be issued within 30 days of the supply, and in Australia a document must be intended to be a tax invoice to count as one. Send a proper invoice once the work is done or the goods are delivered.' },
    { q: 'How long should a quote or estimate stay valid?', a: 'Long enough for the customer to decide, short enough that your costs have not moved: 30 days is a common choice and the generator proposes a date 30 days after the quote. For work that depends on material prices, a shorter period, or a line saying materials are re-priced at purchase, protects you. The date is printed as "Valid until" on the PDF.' },
    { q: 'How do I turn an accepted estimate into an invoice?', a: 'Change the Document selector from "Quote / estimate" to "Invoice", replace the Q- number with your next invoice number, set the invoice date and payment terms, and adjust any line that changed during the job. The lines, tax codes and customer details stay in place, so the invoice matches what the customer accepted, which is the best protection against disputes.' },
  ],
  body: (h) => `
<h2>What a good quote puts in writing</h2>
<p>A quote prevents a dispute only if it says what you will do and what you will not. Each line should name a deliverable a customer can check: "two coats of exterior paint on the front elevation" rather than "painting". Separate labor from materials when the customer may want to buy the materials, and when the tax treatment differs, as it can for materials and installation in US states. Add the assumptions behind the price in the notes: access to the site, who removes waste, how many rounds of revisions a design includes. The generator keeps the notes on the PDF under the totals.</p>
<p>The quote number matters less than an invoice number, because no tax authority asks for a sequence of quotes, but a reference such as Q-2026-0001 lets the customer quote it back when accepting. Keep quotes in their own series so they never take a number your invoices need.</p>
<h2>Estimate or quote: the word on the page</h2>
<p>The generator prints "Estimate" when the country is the United States, where the word is usual for trades and services, and "Quote" elsewhere. Both are the same document in the tool. If your agreement uses one word with a specific meaning, for instance a fixed quote and an estimate that may vary by a set percentage, write that rule into the notes so the PDF carries it.</p>
${h.table(['Country', 'Title on the PDF', 'Date shown instead of a due date', 'Tax line'], [
  ['United States', 'Estimate', 'Valid until', 'State + local sales tax on taxable lines'],
  ['United Kingdom', 'Quote', 'Valid until', `VAT at ${h.pct(h.P.uk.vat_rates.standard)}, ${h.pct(h.P.uk.vat_rates.reduced)} or ${h.pct(0)} per line`],
  ['Canada', 'Quote', 'Valid until', 'GST/HST, plus PST or QST where it applies'],
  ['Australia', 'Quote', 'Valid until', `GST at ${h.pct(h.P.au.gst)}, or GST-free`],
], 'How the quote document changes with the country', ['l', 'l', 'l', 'l'])}
<h2>Deposits on accepted quotes</h2>
<p>Many trades ask for a deposit once a quote is accepted. The deposit is invoiced on its own, with its share of the tax, and the final invoice shows it as already paid. The ${h.a('deposit-invoice', 'deposit invoice guide')} works through the two invoices, and the "Deposit paid" field of the generator subtracts it from the balance due.</p>
<h2>When the job changes</h2>
<p>If the customer adds work, issue a revised quote with the same reference and a suffix, such as Q-2026-0001-B, rather than editing the accepted one. The revised total and the original are then both on file. For prices that depend on time spent, the ${h.a('hourly-invoice-template', 'hourly invoice template')} is a better final document than a fixed quote.</p>`,
  related: ['deposit-invoice', 'hourly-invoice-template', 'proforma-invoice-template', 'payment-terms', 'contractor-invoice-template'],
  sources: ['uk_vat_records', 'ato_tax_invoices', 'us_states'],
});
