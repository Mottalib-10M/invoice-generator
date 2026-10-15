import { definePage } from '../../lib/page-types';

export default definePage({
  id: 'vat-invoice-generator-uk',
  path: '/vat-invoice-generator-uk/',
  group: 'countries',
  kind: 'tool',
  order: 20,
  nav: 'UK VAT invoice generator',
  card: 'VAT at 20%, 5% or 0% per line, HMRC rounding, reverse charge and CIS, A4 PDF.',
  title: 'VAT Invoice Generator UK 2026: Free, HMRC Details Checked',
  description: 'Free UK VAT invoice generator for 2026: 20%, 5% and 0% VAT per line, total VAT rounded down to the penny, reverse charge and CIS, A4 PDF, nothing uploaded.',
  h1: 'VAT invoice generator for UK businesses',
  intro: 'Set each line to 20%, 5%, 0% or exempt, add your VAT number, and the checklist compares the invoice with HMRC\'s list.',
  tool: { country: 'UK', preset: 'standard' },
  resume: (h) => {
    const ex = h.calc({ country: 'UK', region: '', registered: true, lines: [{ desc: 'a', qty: 1, price: 1200, tax: 'standard' }, { desc: 'b', qty: 12, price: 15, tax: 'standard' }] });
    return `A UK VAT invoice is the document your business customer needs to reclaim the VAT you charge, so HMRC fixes what it must carry: a sequential number, the time of supply, your name, address and VAT registration number, the customer's name and address, a description, and for each line the quantity, unit price, VAT rate and amount before VAT, with the total VAT shown in sterling. This generator lays the invoice out that way and lets each line carry its own rate, ${h.pct(h.P.uk.vat_rates.standard)}, ${h.pct(h.P.uk.vat_rates.reduced)} or ${h.pct(0)}, or no VAT when the supply is exempt or outside the scope. The total VAT is rounded down to the whole penny, which VAT Notice 700 allows businesses that issue invoices. A Bristol web designer billing ${h.money(1200, 'UK')} for a site and twelve months of hosting at ${h.money(15, 'UK')} charges ${h.money(ex.tax, 'UK', 2)} of VAT on ${h.money(ex.net, 'UK')}, ${h.money(ex.total, 'UK', 2)} in all. Builders can switch on the domestic reverse charge and the CIS deduction, and the PDF comes out on A4.`;
  },
  faqs: (h) => [
    { q: 'When must a UK business issue a VAT invoice rather than an ordinary one?', a: `When you are VAT-registered and you supply standard-rated or reduced-rated goods or services to another VAT-registered business. HMRC expects the VAT invoice within ${h.P.uk.issue_within_days} days of the supply. You do not have to issue one for sales that are only exempt or zero-rated, and retailers selling to the public only need to when the customer asks.` },
    { q: 'What is a simplified VAT invoice and when can I use one in the UK?', a: `When the charge for the supply is ${h.money(h.P.uk.simplified_invoice_max, 'UK')} or less including VAT. It needs your name, address and VAT number, the time of supply, a description, and for each VAT rate the total including VAT and the rate. It does not need the customer's address. Above ${h.money(h.P.uk.simplified_invoice_max, 'UK')}, a full or modified VAT invoice is required.` },
    { q: 'Can I round the VAT down on my UK invoices?', a: `Yes, if you issue invoices to other businesses. HMRC lets you round the total VAT on an invoice down to a whole penny and ignore the fraction. The generator does exactly that: on a single line of ${h.money(10.99, 'UK', 2)} at ${h.pct(h.P.uk.vat_rates.standard)}, the VAT of £2.198 becomes ${h.money(h.calc({ country: 'UK', region: '', registered: true, lines: [{ desc: 'x', qty: 1, price: 10.99, tax: 'standard' }] }).tax, 'UK', 2)}. Retailers working out VAT from gross takings follow different rules.` },
    { q: 'Must I show my company number on a UK limited company invoice?', a: 'GOV.UK asks a limited company to use its full name as it appears on the certificate of incorporation, and to list all directors if it names any. The generator has an optional company number field and prints it under your VAT number when filled. A sole trader using a business name must also show their own name and an address for legal documents.' },
    { q: 'Should a UK invoice show VAT if my turnover is below the registration threshold?', a: `No. Only a VAT-registered business can charge VAT. Registration becomes compulsory when taxable turnover over the last 12 months goes over ${h.money(h.P.uk.vat_threshold, 'UK')}, or is expected to within the next 30 days. Below that, set "VAT-registered?" to No: the VAT lines disappear and the invoice says no VAT has been charged.` },
    { q: 'Can a UK VAT invoice be sent as a PDF by email?', a: `Yes. VAT Notice 700/21 covers issuing VAT invoices electronically and refers to Notice 700/63 for the detailed rules; the invoice must still show every required detail. The generator builds an A4 PDF in your browser, with the VAT rate and the net amount on each line and the VAT total in pounds. Keep a copy of each invoice you issue.` },
  ],
  body: (h) => {
    const P = h.P;
    const mixed = h.calc({ country: 'UK', region: '', registered: true, lines: [{ desc: 'a', qty: 1, price: 400, tax: 'standard' }, { desc: 'b', qty: 1, price: 120, tax: 'reduced' }, { desc: 'c', qty: 1, price: 60, tax: 'zero' }, { desc: 'd', qty: 1, price: 80, tax: 'vat_exempt' }] });
    const rc = h.calc({ country: 'UK', region: '', registered: true, reverseCharge: true, cisRate: P.uk.cis.registered, lines: [{ desc: 'Labour', qty: 1, price: 2400, tax: 'standard' }, { desc: 'Materials', qty: 1, price: 860, tax: 'standard', materials: true }] });
    const hmrc = h.calc({ country: 'UK', region: '', registered: true, lines: [{ desc: 'Radios', qty: 6, price: 25.2, tax: 'standard' }, { desc: 'DVD players', qty: 4, price: 23.6, tax: 'standard' }] });
    return `
<h2>The rates the generator offers on each line</h2>
<p>A single UK invoice can legitimately carry several VAT treatments, which is why the tax is chosen line by line rather than once for the whole document. Each band is totalled separately, so the customer sees how much VAT belongs to each rate.</p>
${h.table(['Treatment', 'Rate', 'Shown on the invoice as'], [
  ['Standard rate', h.pct(P.uk.vat_rates.standard), 'VAT 20% with its base'],
  ['Reduced rate', h.pct(P.uk.vat_rates.reduced), 'VAT 5% with its base'],
  ['Zero rate', h.pct(P.uk.vat_rates.zero), 'VAT 0%, still a taxable supply'],
  ['Exempt', 'none', 'No VAT, outside the VAT totals'],
  ['Outside the scope', 'none', 'No VAT, outside the VAT totals'],
], 'UK VAT treatments in the line selector (GOV.UK VAT rates)', ['l', 'r', 'l'])}
<p>A gift shop invoicing a café for ${h.money(400, 'UK')} of standard-rated goods, ${h.money(120, 'UK')} at the reduced rate, ${h.money(60, 'UK')} of zero-rated items and ${h.money(80, 'UK')} of an exempt supply ends up with ${h.money(mixed.tax, 'UK', 2)} of VAT and a total of ${h.money(mixed.total, 'UK', 2)}. Zero-rated and exempt look alike on the bottom line, but they are not the same thing for your VAT return, so the generator keeps them apart.</p>
<h2>HMRC's own example, reproduced</h2>
<p>VAT Notice 700/21 prints a sample invoice: six radios at ${h.money(25.2, 'UK', 2)} and four DVD players at ${h.money(23.6, 'UK', 2)}, all at the standard rate. Typed into the generator, it gives ${h.money(hmrc.net, 'UK', 2)} before VAT, ${h.money(hmrc.tax, 'UK', 2)} of VAT and ${h.money(hmrc.total, 'UK', 2)} to pay, the same figures as HMRC's. That example is one of the automated tests the engine must pass before each publication. Read the full list of required details in the ${h.a('vat-invoice-requirements', 'VAT invoice requirements guide')}.</p>
<h2>Tax point and date of issue</h2>
<p>A VAT invoice has two dates when they differ: the time of supply, also called the tax point, which fixes the VAT period the sale belongs to, and the date the document was issued. If you deliver on the last day of a quarter and invoice a week later, both should appear. The generator prints "Time of supply (tax point)" only when you fill in a date different from the invoice date, so a same-day invoice stays uncluttered.</p>
<h2>Builders: reverse charge and CIS on the same invoice</h2>
<p>Most construction services supplied between VAT and CIS registered businesses fall under the domestic reverse charge. The supplier does not add VAT to the amount due; the invoice states the VAT and carries wording such as "${P.uk.reverse_charge_wordings[2]}". A subcontractor registered for CIS also sees ${h.pct(P.uk.cis.registered)} deducted from the labour part of the payment, and nothing from materials. On ${h.money(2400, 'UK')} of labour and ${h.money(860, 'UK')} of materials, the generator shows ${h.money(rc.reverseChargeVat, 'UK', 2)} of VAT for the contractor to account for, a CIS deduction of ${h.money(rc.cisDeduction, 'UK', 2)} and ${h.money(rc.due, 'UK', 2)} actually paid. The ${h.a('cis-invoice-template', 'CIS invoice template')} starts from that case, and the ${h.a('reverse-charge-invoice', 'reverse charge guide')} explains who the end user is.</p>
<h2>Invoicing in euros or dollars</h2>
<p>A VAT invoice can be in any currency, but HMRC requires the total VAT to be shown in sterling as well. Pick another currency and the generator adds a field for the sterling VAT figure, then prints it beneath the totals. The ${h.a('invoice-in-foreign-currency', 'foreign currency guide')} shows how to convert it.</p>
<h2>Not registered for VAT yet</h2>
<p>Switch "VAT-registered?" to No and the document becomes an ordinary invoice: no VAT column, no VAT total, and a line saying no VAT has been charged. GOV.UK still expects a unique number, your name and contact details, the customer's name and address, a description, the supply date, the invoice date and the amounts. The ${h.a('sole-trader-invoice-template', 'sole trader template')} is set up that way.</p>
<h2>Getting paid</h2>
<p>If no payment date is agreed, a business payment is late ${P.uk.late_payment.default_days} days after the customer receives the invoice or the goods, whichever is later. From then on you may claim statutory interest at ${h.pct(P.uk.late_payment.margin)} over the Bank of England reference rate, plus fixed compensation. The ${h.a('late-payment-interest-uk', 'late payment interest calculator')} works out the figures for any unpaid invoice.</p>`;
  },
  related: ['vat-invoice-requirements', 'reverse-charge-invoice', 'cis-invoice-template', 'sole-trader-invoice-template', 'late-payment-interest-uk', 'invoice-in-foreign-currency'],
  sources: ['uk_vat_records', 'uk_invoice', 'uk_vat_rates', 'uk_vat_guide', 'uk_vat_register', 'uk_reverse_charge'],
});
