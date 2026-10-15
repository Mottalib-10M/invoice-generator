import { definePage } from '../../lib/page-types';

export default definePage({
  id: 'tax-invoice-generator-australia',
  path: '/tax-invoice-generator-australia/',
  group: 'countries',
  kind: 'tool',
  order: 40,
  nav: 'Australia tax invoice generator',
  card: 'GST at 10%, the seven ATO details, ABN check digit, A4 PDF.',
  title: 'Tax Invoice Generator Australia 2026: Free, GST, ABN Check',
  description: 'Free Australian tax invoice generator for 2026: GST at 10% or GST-free per line, the 7 ATO details, buyer ABN from $1,000, ABN check digit tested, no sign-up.',
  h1: 'Tax invoice generator for Australia, with GST',
  intro: 'Mark each line GST, GST-free or input-taxed, enter your ABN, and the checklist reads the invoice against the ATO\'s seven details.',
  tool: { country: 'AU', preset: 'standard' },
  resume: (h) => {
    const ex = h.calc({ country: 'AU', region: 'NSW', registered: true, lines: [{ desc: 'a', qty: 1, price: 900, tax: 'gst' }, { desc: 'b', qty: 20, price: 25, tax: 'gst' }] });
    return `In Australia the document your customer needs to claim a GST credit is a tax invoice, and the ATO lists what it must let a reader work out: that it is intended to be a tax invoice, the seller's identity and ABN, the date of issue, a brief description of each item with quantity and price, the GST payable, and how far each sale is taxable. From ${h.money(h.P.au.buyer_identity_from, 'AU')}, the buyer's identity or ABN is added. This generator prints the words "Tax invoice" when you are registered for GST, computes GST at ${h.pct(h.P.au.gst)} on the lines you mark taxable, rounds to the nearest cent with half a cent going up, and tests your ABN with the Australian Business Register's check digit. A Sydney photographer invoicing a ${h.money(900, 'AU')} half-day shoot and twenty images at ${h.money(25, 'AU')} adds ${h.money(ex.tax, 'AU', 2)} of GST for ${h.money(ex.total, 'AU', 2)}, and because that total passes ${h.money(h.P.au.buyer_identity_from, 'AU')} the checklist asks for the client's name or ABN. Not registered? The title becomes "Invoice" and no GST is added.`;
  },
  faqs: (h) => [
    { q: 'When does an Australian customer have the right to a tax invoice?', a: `When they ask for one on a taxable sale above ${h.money(h.P.au.tax_invoice_on_request_above, 'AU', 2)} including GST. You then have ${h.P.au.provide_within_days} days to provide it. At ${h.money(h.P.au.tax_invoice_on_request_above, 'AU', 2)} or less you are not obliged to, although many businesses issue one anyway. A PDF sent by email is a valid tax invoice if it contains all the required details.` },
    { q: 'Does an Australian tax invoice have to show the GST amount separately?', a: `Not always. It must show the GST payable, or, when GST is exactly one-eleventh of the total price, a statement such as "Total price includes GST". The generator prints that statement when you enter GST-inclusive prices and every taxable line carries ${h.pct(h.P.au.gst)} GST; otherwise it shows the GST amount as its own line.` },
    { q: 'Do I need the buyer\'s ABN on an Australian tax invoice?', a: `Only from ${h.money(h.P.au.buyer_identity_from, 'AU')}, and then the buyer's identity or ABN is enough, so a company name will do. Below ${h.money(h.P.au.buyer_identity_from, 'AU')} the buyer can stay unnamed. An invoice that meets the higher standard can be used for smaller sales too, which is why some businesses always print the customer's details.` },
    { q: 'When must an Australian business register for GST before invoicing with it?', a: `When its GST turnover reaches ${h.money(h.P.au.registration_threshold, 'AU')} over the current or projected twelve months, ${h.money(h.P.au.nfp_threshold, 'AU')} for a non-profit body. Taxi and ride-sourcing drivers must register whatever their turnover. Until you are registered, you cannot charge GST or issue a tax invoice: switch "Registered for GST?" to No.` },
    { q: 'How is GST rounded on an Australian invoice with several lines?', a: 'The ATO allows two methods. Under the total invoice rule, you total the GST and round to the nearest cent, half a cent up. Under the taxable supply rule, you work out each line\'s GST, then round the sum. The generator uses the first: GST per line unrounded, one rounding on the total.' },
    { q: 'Which page size does the Australian tax invoice generator use?', a: `A4, with dates in the Australian style ("15 October 2026") and amounts in Australian dollars. The ATO accepts a tax invoice sent as a PDF by email, as long as it carries every required detail, so the downloaded file can go straight to your customer. Keep a copy: the generator does not store your invoices.` },
  ],
  body: (h) => {
    const P = h.P;
    const mix = h.calc({ country: 'AU', region: 'VIC', registered: true, lines: [{ desc: 'Catering', qty: 1, price: 600, tax: 'gst' }, { desc: 'Fresh fruit', qty: 1, price: 120, tax: 'gst_free' }] });
    const incl = h.calc({ country: 'AU', region: 'QLD', registered: true, inclusive: true, lines: [{ desc: 'Service', qty: 1, price: 1320, tax: 'gst' }] });
    const odd = h.calc({ country: 'AU', region: 'NSW', registered: true, lines: [{ desc: 'Item', qty: 1, price: 99.95, tax: 'gst' }] });
    return `
<h2>The seven details, and where the generator puts them</h2>
${h.table(['ATO detail', 'On the generated invoice'], [
  ['Document is intended to be a tax invoice', 'Title "Tax invoice" when you are registered for GST'],
  ["Seller's identity", 'Your business name at the top left'],
  ["Seller's ABN", 'Printed as ABN 51 824 753 556 style, after a check digit test'],
  ['Date the invoice was issued', 'Invoice date, in Australian format'],
  ['Description, quantity and price', 'One table row per item'],
  ['GST payable', `GST line at ${h.pct(P.au.gst)}, or "Total price includes GST"`],
  ['Extent each sale is taxable', 'Tax column: GST 10%, GST-free or input-taxed'],
  [`Buyer's identity or ABN, from ${h.money(P.au.buyer_identity_from, 'AU')}`, 'Customer block; the checklist asks for it above the limit'],
], 'ATO tax invoice requirements and the generator', ['l', 'l'])}
<p>The ATO's words are "enough information to clearly determine" each detail, so the layout is free. What fails in practice is a missing ABN, an ABN with a typing error, or an invoice that mixes taxable and GST-free items without saying which is which.</p>
<h2>ABN check before you send</h2>
<p>An ABN has eleven digits, and its first two are check digits computed with a modulus 89 formula published by the Australian Business Register. The generator runs that test as you type: a transposed digit fails it and the checklist shows the ABN as wrong. It cannot confirm that the ABN is active or belongs to you; the ABN Lookup service does that.</p>
<h2>Mixing taxable and GST-free lines</h2>
<p>A tax invoice that includes GST-free or input-taxed items must make clear which items are taxable, the GST payable and the total. A Melbourne caterer billing ${h.money(600, 'AU')} of catering with GST and ${h.money(120, 'AU')} of fresh fruit that is GST-free shows ${h.money(mix.tax, 'AU', 2)} of GST on a total of ${h.money(mix.total, 'AU', 2)}, and each line names its own treatment in the tax column.</p>
<h2>Prices that already include GST</h2>
<p>Many Australian businesses quote GST-inclusive prices. Turn on "Prices include tax" and the generator takes one-eleventh of each taxable line as GST: a ${h.money(1320, 'AU')} service holds ${h.money(incl.tax, 'AU', 2)} of GST and ${h.money(incl.net, 'AU', 2)} before it. When all taxable lines are at the full rate, the invoice may simply say "Total price includes GST", which the generator prints.</p>
<h2>Rounding to the cent</h2>
<p>GST on a ${h.money(99.95, 'AU', 2)} item is 9.995 cents short of ten dollars; the ATO's rule rounds half a cent up, so the invoice shows ${h.money(odd.tax, 'AU', 2)} and a total of ${h.money(odd.total, 'AU', 2)}. On invoices with several taxable lines the generator totals the unrounded GST first, then rounds once, the total invoice rule.</p>
<h2>Sole traders without GST registration</h2>
<p>Below the ${h.money(P.au.registration_threshold, 'AU')} turnover threshold, registration is optional. An unregistered business must not charge GST or call its document a tax invoice, but it still invoices, and business customers expect an ABN on it. Switch "Registered for GST?" to No, or open the ${h.a('invoice-without-gst-template', 'invoice without GST template')}, which also prints a short statement that no GST has been charged.</p>
<h2>Paper size, dates and payment details</h2>
<p>The PDF is A4 with dates written the Australian way, such as ${h.date('2026-10-15', 'AU')}. The payment block holds a BSB and account number or a PayID. If you deliver in stages, the ${h.a('deposit-invoice', 'deposit invoice guide')} shows how to split GST between the deposit and the balance, and the ${h.a('tax-invoice-requirements-australia', 'tax invoice requirements guide')} covers recipient-created tax invoices and eInvoicing through Peppol.</p>`;
  },
  related: ['tax-invoice-requirements-australia', 'invoice-without-gst-template', 'deposit-invoice', 'invoice-vs-receipt', 'freelance-invoice-template'],
  sources: ['ato_tax_invoices', 'ato_register', 'au_gst_act', 'abr_abn_format'],
});
