import { definePage } from '../../lib/page-types';

export default definePage({
  id: 'receipt-template',
  path: '/templates/receipt/',
  group: 'templates',
  kind: 'tool',
  order: 70,
  nav: 'Receipt',
  card: 'Confirm a payment received, with the tax shown and the payment date on the PDF.',
  title: 'Receipt Template 2026: Free Paid Receipt Maker, Tax Shown',
  description: 'Free receipt template, 2026: confirm a payment with its date and the tax included, and in Australia a tax invoice and receipt in one. PDF made in your browser.',
  h1: 'Receipt template: proof of payment, with the tax on it',
  intro: 'For money already received: the receipt names what was paid for, how much tax it held, and when.',
  tool: { country: 'US', preset: 'receipt' },
  resume: (h) => `A receipt confirms that a payment has been made, where an invoice asks for one, so the generator changes the document's wording when you choose "Receipt": the customer block becomes "Received from", the payment details disappear, the due date is dropped and the totals end with "Amount paid". The tax stays on the document, because a customer who pays for a business purchase usually needs to see it. In Australia, a GST-registered seller's receipt is titled "Tax invoice / Receipt", since the ATO accepts any document intended to be a tax invoice that carries its seven details, and a sale of more than ${h.money(h.P.au.tax_invoice_on_request_above, 'AU', 2)} needs a tax invoice if the customer asks. In the UK, VAT Notice 700/21 says that when a customer pays cash for a supply already invoiced and asks for a receipt, you must give one for the amount and date it. The sample is an annual maintenance service at ${h.money(180, 'US')}: in Texas it carries ${h.money(h.calc({ country: 'US', region: 'TX', registered: true, lines: [{ desc: 'a', qty: 1, price: 180, tax: 'taxable' }] }).tax, 'US', 2)} of state sales tax if the service is taxable there.`,
  faqs: (h) => [
    { q: 'What should a receipt for a payment include?', a: 'Who was paid and who paid, the date of payment, what the payment was for, the amount, and the tax it included if you are registered. Add the method of payment and the invoice number it settles, if there was one, in the notes. The generator prints the receipt number, the date, the lines, the tax and "Amount paid" automatically.' },
    { q: 'Is a receipt the same as a tax invoice in Australia?', a: `It can be. The ATO looks at substance: a document intended to be a tax invoice that shows the seller's identity and ABN, the date, the items, the GST and the extent each sale is taxable is a tax invoice, whatever else it is called. The generator therefore titles a GST-registered seller's receipt "Tax invoice / Receipt". From ${h.money(h.P.au.buyer_identity_from, 'AU')} it must also show the buyer's identity or ABN.` },
    { q: 'Do I need to give a receipt when a UK customer pays cash?', a: 'VAT Notice 700/21 says that if a customer asks for a receipt for a cash payment against a VAT invoice you have issued, you must give one for the amount and date it. Customers using cash accounting need it, because their VAT recovery follows the date of payment. Outside that case, a receipt is good practice rather than a rule.' },
    { q: 'Can I make a receipt for a partial payment or deposit?', a: 'Yes. Enter the full lines and type the earlier payments in "Paid already", or create a receipt with a single line describing the instalment, for example "Deposit on quote Q-2026-0004, 30%". Keep the receipt number in its own series. The deposit invoice guide explains how the tax is split between the instalments.' },
  ],
  body: (h) => `
<h2>Receipt, invoice or both</h2>
<p>The order of events decides the document. If the customer pays after the work, you send an invoice first and, when asked, a receipt. If the customer pays on the spot, a shop sale or a job paid on completion, one document can do both jobs: a receipt that carries everything an invoice would, which in Australia is exactly the "Tax invoice / Receipt" the generator produces. The ${h.a('invoice-vs-receipt', 'invoice vs receipt guide')} walks through the cases.</p>
${h.table(['Country', 'Title the generator prints (registered seller)', 'Rule behind it'], [
  ['United States', 'Receipt', 'No federal format; show sales tax separately where you collect it'],
  ['United Kingdom', 'Receipt', 'A receipt for cash against a VAT invoice must be dated (VAT Notice 700/21, 4.7)'],
  ['Canada', 'Receipt', `Supporting documents for tax credits follow the bands of ${h.money(h.P.ca.itc_tiers[0], 'CA')} and ${h.money(h.P.ca.itc_tiers[1], 'CA')}`],
  ['Australia', 'Tax invoice / Receipt', 'A document intended to be a tax invoice with the seven details is one'],
], 'Receipts in the four countries', ['l', 'l', 'l'])}
<p>In Canada, the regulations on input tax credits treat a receipt as supporting documentation in the same way as an invoice: a customer who pays ${h.money(h.P.ca.itc_tiers[0], 'CA')} or more needs your GST/HST registration number on it, and from ${h.money(h.P.ca.itc_tiers[1], 'CA')} also their own name and a description. The generator's checklist applies these bands to the receipt total.</p>
<h2>Recording how the money was paid</h2>
<p>A receipt is more useful months later if it says how the payment arrived. Write it in the notes: "Paid by card ending 4421 on 12 October", "Bank transfer, reference INV-2026-0042", "Cash". For a payment that settles an invoice, quote the invoice number so both documents point at each other.</p>
<h2>Numbering and copies</h2>
<p>Give receipts their own sequence (the template starts at R-2026-0001) and keep a copy of each one, as you would an invoice. A receipt does not replace your accounting records, but it is often the only document a customer keeps, and the first one they produce if a payment is ever disputed. If you later refund part of the amount, a ${h.a('credit-note-template', 'credit note')} records it against the original document.</p>`,
  related: ['invoice-vs-receipt', 'credit-note-template', 'deposit-invoice', 'tax-invoice-requirements-australia', 'blank-invoice-template'],
  sources: ['uk_vat_records', 'ato_tax_invoices', 'ca_itc_regs'],
});
