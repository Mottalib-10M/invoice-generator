import { definePage } from '../../lib/page-types';

export default definePage({
  id: 'templates',
  path: '/templates/',
  group: 'templates',
  kind: 'index',
  order: 0,
  nav: 'All templates',
  card: 'Thirteen starting points, from freelance and hourly invoices to receipts, credit notes and CIS.',
  title: 'Invoice Templates 2026: 13 Free Layouts, Tax Built In',
  description: 'Thirteen free invoice templates for 2026: freelance, contractor, hourly, quote, receipt, credit note, CIS, Quebec, no-GST, each with tax for four countries.',
  h1: 'Invoice templates for each kind of job and document',
  intro: 'Every template opens the same generator, already filled in for its case, with the tax of the country you choose.',
  mini: 'invoiceTotal',
  resume: (h) => {
    const uk = h.calc({ country: 'UK', region: '', registered: true, lines: [{ desc: 'x', qty: 1, price: 1000, tax: 'standard' }] });
    const au = h.calc({ country: 'AU', region: 'NSW', registered: true, lines: [{ desc: 'x', qty: 1, price: 1000, tax: 'gst' }] });
    return `A template on this site is not a Word file to download and fill in by hand: it is the invoice generator opened on a document that already fits a job, with sample lines, payment terms, notes and the right document title, which you overwrite with your own. That matters because the hard part of an invoice is not the layout but the tax and the wording, and those follow the country you pick rather than the template. Pick the freelance template in the UK as a VAT-registered business and ${h.money(1000, 'UK')} of work becomes ${h.money(uk.total, 'UK')} with VAT at ${h.pct(h.P.uk.vat_rates.standard)}; switch the country to Australia and the same work becomes ${h.money(au.total, 'AU')} with GST, titled "Tax invoice". There are thirteen templates: four for ways of charging (freelance, contractor, consulting, hourly), five for other documents (quote, pro forma, receipt, credit note, blank invoice) and four for national cases (UK sole trader, UK construction under CIS, Quebec with QST, and Australia without GST). None needs an account, and each one is checked against the required details of the country you choose.`;
  },
  faqs: (h) => [
    { q: 'Are these invoice templates Word or Excel files?', a: 'No, they are starting points for the online generator, which produces a PDF in your browser. That is deliberate: a spreadsheet template cannot know your state\'s sales tax, the VAT rounding rule or the details a Canadian customer needs for a tax credit, while the generator applies them as you type. If you need an editable file, print the blank template or copy the lines into your own software.' },
    { q: 'Can I change the country after opening a template?', a: `Yes. Every template works in all four countries. Changing the country keeps your text and amounts, switches the currency, and moves each line to the closest tax code that exists there, for example from "Not taxable" in the US to "Exempt" in the UK. The document title follows: "Tax invoice" for a GST-registered business in Australia, "VAT invoice" for a VAT-registered one in the UK.` },
    { q: 'Which template should a self-employed person with no tax registration use?', a: `The template that matches the work, with the registration switch set to No. The generator then adds no tax and prints a short statement saying so. Two templates are built for that case already: the UK sole trader invoice and the Australian invoice without GST. Registration becomes compulsory above ${h.money(h.P.uk.vat_threshold, 'UK')} in the UK and ${h.money(h.P.au.registration_threshold, 'AU')} in Australia.` },
    { q: 'Do the templates keep my business details for the next invoice?', a: 'Yes, on this device only. Your business name, address, tax number, logo and payment details are saved in your browser\'s local storage when you use the generator, and every template picks them up the next time, while keeping its own sample lines. Nothing is sent to a server. The "Forget my details" link under the checklist erases them.' },
    { q: 'Is a receipt template different from an invoice template?', a: 'Yes. An invoice asks for payment and carries a due date; a receipt confirms a payment already made and replaces the due date with the amount received. The receipt template prints "Receipt", or "Tax invoice / Receipt" for a GST-registered Australian business, and shows the amount paid at the bottom instead of a balance due.' },
    { q: 'Which invoice template suits a business selling goods rather than services?', a: 'The standard generator on the home page, or the blank template, both of which start from quantity and unit price lines. Add shipping in its own field so it is taxed correctly, and in the US mark each product line taxable or not according to your state. Goods shipped abroad before payment often need the pro forma template first.' },
  ],
  body: (h) => `
<h2>Templates by way of charging</h2>
<p>The first choice is how the work is priced, because it decides how the lines read.</p>
<ul>
<li>${h.a('freelance-invoice-template', 'Freelance invoice')}: one line per deliverable, an article, a design, a feature, with the usage rights in the notes and short payment terms.</li>
<li>${h.a('contractor-invoice-template', 'Contractor invoice')}: labor and materials on separate lines, progress billing and a deposit deducted from the balance.</li>
<li>${h.a('consulting-invoice-template', 'Consulting invoice')}: day rates and fixed-fee deliverables, a purchase order number, and expenses recharged the way the tax authority expects.</li>
<li>${h.a('hourly-invoice-template', 'Hourly invoice')}: Hours and Rate columns that read like a timesheet, with overtime on its own line.</li>
</ul>
<h2>Templates by document</h2>
<p>Not every document that looks like an invoice is one. Tax authorities draw a line between a document that records a taxable supply and one that only prices or confirms it, and the generator prints each with its own title and statements.</p>
${h.table(['Template', 'Asks for payment', 'Can support a tax claim', 'Title printed'], [
  [h.a('estimate-template', 'Quote or estimate'), 'No', 'No', 'Estimate (US), Quote (elsewhere)'],
  [h.a('proforma-invoice-template', 'Pro forma invoice'), 'In advance', 'No', 'Pro forma invoice'],
  [h.a('blank-invoice-template', 'Blank invoice'), 'Yes', 'Yes, once complete', 'Invoice, VAT invoice or Tax invoice'],
  [h.a('receipt-template', 'Receipt'), 'No, confirms payment', 'In Australia, if titled tax invoice', 'Receipt'],
  [h.a('credit-note-template', 'Credit note'), 'No, reduces an invoice', 'Adjusts the original', 'Credit note, Credit memo (US), Adjustment note (AU)'],
], 'What each document does', ['l', 'l', 'l', 'l'])}
<p>A pro forma is the one most often misused: it lets a customer pay in advance or clear goods through customs, but neither the customer nor you can treat it as the tax invoice. The real invoice follows on delivery.</p>
<h2>Templates for national cases</h2>
<p>Four templates exist because one country has a rule the others do not.</p>
<ul>
<li>${h.a('sole-trader-invoice-template', 'UK sole trader invoice')}: not VAT-registered, trading under a business name, so GOV.UK asks for your own name and an address where legal documents can reach you.</li>
<li>${h.a('cis-invoice-template', 'UK CIS invoice')}: construction work for a contractor, with the reverse charge wording and the ${h.pct(h.P.uk.cis.registered)} deduction on labour only.</li>
<li>${h.a('quebec-invoice-template', 'Quebec invoice')}: GST at ${h.pct(h.P.ca.gst)} and QST at ${h.pct(h.P.ca.provinces.QC.pst)}, both registration numbers, and Revenu Québec's detail requirements that start at any amount.</li>
<li>${h.a('invoice-without-gst-template', 'Australian invoice without GST')}: below the ${h.money(h.P.au.registration_threshold, 'AU')} threshold and not registered, so no GST and never the words "Tax invoice".</li>
</ul>
<h2>What every template shares</h2>
<p>Whatever you start from, the same engine computes the tax, the same checklist compares the invoice with the official list for your country and total, and the same PDF builder draws the result on Letter paper for the US and Canada or A4 for the UK and Australia. The country pages explain each system in full: the ${h.a('invoice-generator-usa', 'US generator')} with sales tax by state, the ${h.a('vat-invoice-generator-uk', 'UK VAT invoice generator')}, the ${h.a('invoice-generator-canada', 'Canadian generator')} with GST, HST, PST and QST, and the ${h.a('tax-invoice-generator-australia', 'Australian tax invoice generator')}.</p>
<h2>Choosing quickly</h2>
<p>If you are unsure, start from the template closest to how you price your work, set the country and registration, and read the checklist beside the preview: it says what is still missing for your case. Change the Document selector at any time to turn a quote into an invoice or an invoice into a credit note; the lines stay. And once an invoice is paid late, the ${h.a('late-payment-interest-uk', 'UK late payment interest guide')} and the ${h.a('payment-terms', 'payment terms guide')} take over.</p>`,
  related: ['freelance-invoice-template', 'estimate-template', 'receipt-template', 'blank-invoice-template', 'how-to-write-an-invoice'],
  sources: ['uk_invoice', 'uk_vat_records', 'rq_invoices', 'ato_tax_invoices'],
});
