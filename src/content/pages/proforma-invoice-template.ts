import { definePage } from '../../lib/page-types';

export default definePage({
  id: 'proforma-invoice-template',
  path: '/templates/proforma-invoice/',
  group: 'templates',
  kind: 'tool',
  order: 60,
  nav: 'Pro forma invoice',
  card: 'Request payment in advance or support an import, clearly marked as not a tax invoice.',
  title: 'Pro Forma Invoice Template 2026: Free PDF, Marked Correctly',
  description: 'Free pro forma invoice template, 2026: advance payment requests and customs papers, marked \'not a tax invoice\' as HMRC expects. PDF made in your browser.',
  h1: 'Pro forma invoice template',
  intro: 'For payment before delivery, or for paperwork before goods move: a priced document that is deliberately not the final invoice.',
  tool: { country: 'US', preset: 'proforma' },
  resume: (h) => `A pro forma invoice looks like an invoice but promises one instead: it states what you will supply, at what price and with what tax, so the buyer can pay in advance, raise a purchase order or arrange an import, and it is followed by the real invoice once the goods ship or the service is performed. HMRC's VAT guide is explicit that pro forma invoices "cannot be used as evidence to reclaim input tax, even if they show all the details required for a VAT invoice", and asks that they be clearly marked as not being a VAT invoice. The generator does this for you: the document is titled "Pro forma invoice" in every country, it prints that it is not a tax invoice and that no tax can be reclaimed on it, and its own number series (PF-2026-0001) keeps it out of your invoice sequence. The sample shows two industrial machines at ${h.money(3200, 'US')} each plus ${h.money(450, 'US')} of freight; switch the country and the same lines carry ${h.pct(h.P.uk.vat_rates.standard)} UK VAT, ${h.pct(h.P.au.gst)} Australian GST or the Canadian rate of the buyer's province.`,
  faqs: (h) => [
    { q: 'Can my customer reclaim VAT on a pro forma invoice?', a: 'No. HMRC\'s VAT guide, paragraph 17.3, says a pro forma invoice cannot be used as evidence to reclaim input tax even when it shows every detail of a VAT invoice, because the supply may never happen. The customer reclaims the VAT on the VAT invoice you issue once the supply takes place or payment creates a tax point. The generator marks the pro forma accordingly.' },
    { q: 'Does a pro forma invoice need a tax line?', a: 'It should show the tax the final invoice will carry, so the buyer can pay the right amount in advance. The figure is informative: the tax becomes due under the normal rules, for instance in the UK when the supply is made or payment is received, whichever comes first. If the advance payment arrives before delivery, that payment can itself create the tax point.' },
    { q: 'What happens to the pro forma invoice number afterwards?', a: 'Nothing: it stays in its own series. Give the final invoice the next number of your invoice sequence and mention the pro forma reference in the notes or in the PO field, so the buyer can match the payment they made. Reusing the pro forma number for the invoice would break the sequential numbering HMRC asks VAT-registered businesses to keep.' },
    { q: 'Is a pro forma invoice enough for customs when exporting?', a: 'Customs authorities and couriers often accept a pro forma invoice to describe a shipment when no sale has taken place yet, such as samples or goods sent for repair, but many require a commercial invoice with codes, origin and terms of delivery. Check the destination\'s requirements with the carrier or customs broker before relying on the pro forma alone.' },
  ],
  body: (h) => `
<h2>When a pro forma is the right document</h2>
<p>Three situations call for one. A buyer who must pay before you produce or ship, often an overseas customer or a first order from a new account, needs a priced document to authorize the payment. A buyer's finance team may need a document to raise a purchase order, before any invoice can be received against it. And goods that move before a sale, samples or items sent on approval, need a document that states their value. In all three, issuing a real invoice would be premature: it would record a supply that has not happened, and for a VAT-registered seller it could create a tax point too early.</p>
<h2>What to put on it</h2>
<p>Everything the final invoice will show, so that nothing changes but the title: your details, the buyer's, a description precise enough to identify the goods, quantities, unit prices, the tax rate and amount, the delivery cost, the payment terms and your bank details. Add the expected delivery date in the notes. The generator's checklist for a pro forma only asks for a reference, the two parties and the descriptions, since no tax rule applies to the document itself.</p>
${h.table(['', 'Pro forma invoice', 'Final invoice'], [
  ['Purpose', 'Ask for payment or approval before supply', 'Record the supply and claim payment'],
  ['Number series', 'Its own (PF-…)', 'Your sequential invoice numbers'],
  ['Tax reclaimable by the buyer', 'No', 'Yes, if it meets the country\'s rules'],
  ['Marked as', '"Pro forma invoice, not a tax invoice"', `"Invoice", "VAT invoice" or "Tax invoice"`],
  ['Recorded in your accounts', 'No sale yet', 'A sale'],
], 'How the two documents differ', ['l', 'l', 'l'])}
<h2>From pro forma to invoice in the generator</h2>
<p>Once the goods are delivered, keep the same lines, change the Document selector to "Invoice", give it the next invoice number and today's date, and enter the advance received in "Deposit paid". The final invoice then shows the full total with its tax and a balance due of zero, or the remainder if only part was paid in advance. In Australia, choosing "Invoice" while registered for GST turns the title into "Tax invoice", the words the ATO expects on the final document. For a job priced before any commitment at all, the ${h.a('estimate-template', 'quote and estimate template')} is the lighter choice, and the ${h.a('deposit-invoice', 'deposit invoice guide')} covers advance payments taken against a signed order.</p>`,
  related: ['estimate-template', 'deposit-invoice', 'invoice-in-foreign-currency', 'vat-invoice-requirements', 'invoice-numbering'],
  sources: ['uk_vat_guide', 'uk_vat_records', 'ato_tax_invoices'],
});
