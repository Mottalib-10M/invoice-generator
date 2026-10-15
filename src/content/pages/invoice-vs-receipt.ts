import { definePage } from '../../lib/page-types';

export default definePage({
  id: 'invoice-vs-receipt',
  path: '/guides/invoice-vs-receipt/',
  group: 'guides',
  kind: 'guide',
  order: 20,
  nav: 'Invoice vs receipt',
  card: 'An invoice asks for payment, a receipt confirms it; when the tax rules need one or the other.',
  title: 'Invoice vs Receipt 2026: Which to Send and When Tax Needs It',
  description: 'Invoice vs receipt in 2026: an invoice asks for money, a receipt proves it was paid. When HMRC, the CRA or the ATO need one, and when one document can do both.',
  h1: 'Invoice or receipt: which document the situation calls for',
  intro: 'Answer three questions and see which document to send, and what it must carry.',
  mini: 'documentChoice',
  resume: (h) => `The difference is timing. An invoice is sent before payment and asks for it: it carries a due date, payment details and, when you are registered, the tax the customer owes you. A receipt is issued after payment and proves it happened: it shows the date and amount received and how it was paid, and it closes the transaction. Both can carry the same lines and the same tax, and for tax purposes the label matters less than the details on the page. A UK VAT-registered seller dealing with another VAT-registered business must issue a VAT invoice within ${h.P.uk.issue_within_days} days of the supply, even if the customer paid on the spot, and HMRC adds that a customer using cash accounting can ask for a dated receipt for a cash payment. In Australia, a receipt titled "Tax invoice" with the ATO's seven details serves as both, and a customer can demand a tax invoice for any sale above ${h.money(h.P.au.tax_invoice_on_request_above, 'AU', 2)}. In Canada, the customer claiming input tax credits needs the same details whatever the document is called.`,
  faqs: (h) => [
    { q: 'Can one document be both an invoice and a receipt?', a: `Yes. A paid invoice marked "Paid" with the date and the payment method is commonly used as a receipt, and in Australia a document titled "Tax invoice" that shows the seven ATO details and the payment can do both jobs. The generator's receipt option keeps the invoice details and replaces the due date with the amount received.` },
    { q: 'Is a bank transfer confirmation enough as a receipt for my customer?', a: 'It proves money moved, but it does not show what was bought, the tax, or your tax number, so it rarely satisfies a tax rule. A Canadian customer claiming input tax credits on a purchase of $100 or more needs your GST/HST registration number on the supporting document, which a bank statement does not carry.' },
    { q: 'Should a receipt show the tax separately?', a: `When you are registered and your customer is a business, yes. Revenu Québec says the GST and QST must be either shown separately or included in the price with a statement to that effect, and the ATO accepts "Total price includes GST" only when the GST is exactly one-eleventh of the price. Showing the amount is the safer habit in all four countries.` },
    { q: 'Do I still need to send an invoice when a customer pays upfront by card?', a: `In the UK, if both you and the customer are VAT-registered, yes: HMRC expects a VAT invoice for standard or reduced rate supplies to another registered person, normally within ${h.P.uk.issue_within_days} days. A retailer selling to the public can assume no VAT invoice is needed unless the customer asks for one.` },
    { q: 'Which comes first in a sale paid by deposit, the invoice or the receipt?', a: 'Usually the invoice for the deposit, then a receipt when it is paid, then a final invoice for the balance that shows the deposit already received. The deposit invoice guide explains how the tax splits between the two invoices, and the generator subtracts the deposit from the amount due on the last one.' },
  ],
  body: (h) => `
<h2>Side by side</h2>
${h.table(['', 'Invoice', 'Receipt'], [
  ['Sent', 'Before payment', 'After payment'],
  ['Purpose', 'Asks the customer to pay', 'Confirms the customer paid'],
  ['Key dates', 'Issue date, supply date, due date', 'Date the payment was received'],
  ['Payment details', 'Bank account, payment link, terms', 'How it was paid: card, cash, transfer'],
  ['Balance shown', 'Amount due', 'Amount received, and any balance left'],
  ['Tax line', 'Yes when registered', 'Yes when registered'],
  ['Used by the customer for', 'Approving and scheduling payment, reclaiming tax', 'Proof of expense, warranty, reclaiming tax'],
], 'The two documents compared', ['l', 'l', 'l'])}
<p>The two are not alternatives so much as two moments of the same sale. Many small businesses only ever produce one of them: a tradesperson who is paid on completion may issue a single document headed "Receipt", an online seller may email an invoice that is already marked paid. What counts for the tax authorities is whether the document, whatever its title, contains the details their rules list.</p>

<h2>When the tax rules decide for you</h2>
<h3>United Kingdom</h3>
<p>HMRC's record-keeping notice says that only VAT-registered businesses can issue VAT invoices, and that a registered business must issue one whenever it supplies standard or reduced rate goods or services to another VAT-registered person, normally within ${h.P.uk.issue_within_days} days. Paying immediately does not remove that duty. A retailer selling to the public is different: it can assume no VAT invoice is required unless the customer asks, and for a supply of ${h.money(h.P.uk.simplified_invoice_max, 'UK')} or less including VAT a simplified invoice will do. HMRC also notes that a customer using cash accounting may need a receipt for a cash payment, and that if asked you must give one, dated, for the amount.</p>
<h3>Canada</h3>
<p>The Input Tax Credit Information Regulations do not care what the document is called. Their definition of supporting documentation includes an invoice, a receipt, a credit card receipt, a debit note and a written contract. What matters is the information, by amount: under ${h.money(h.P.ca.itc_tiers[0], 'CA')}, the supplier's name, the date and the total; from ${h.money(h.P.ca.itc_tiers[0], 'CA')}, also the registration number and the tax; from ${h.money(h.P.ca.itc_tiers[1], 'CA')}, also the buyer's name, the terms and a description. A receipt with all of that is as good as an invoice for the customer's claim.</p>
<h3>Australia</h3>
<p>The ATO requires a tax invoice for the customer to claim a GST credit, and it has a precise meaning: a document intended to be a tax invoice, with the seller's identity and ABN, the date, a description with quantity and price, the GST and the extent each sale is taxable. A shop receipt that carries the words "Tax invoice" and these details counts. That is why the generator titles a paid document from a GST-registered business "Tax invoice / Receipt". For sales of ${h.money(h.P.au.tax_invoice_on_request_above, 'AU', 2)} or less including GST, the seller does not have to provide one even on request.</p>
<h3>United States</h3>
<p>There is no federal rule on either document. Receipts matter to buyers for expense records and returns; invoices matter for business-to-business credit. Where you collect sales tax, show it as its own line on both, so a customer who later claims an exemption or a refund can see what was charged.</p>

<h2>What a good receipt shows</h2>
<p>A receipt is short, but a few details make it useful months later: your business name and tax number, a receipt number of its own or the number of the invoice it settles, the date of payment, the method, what was bought, the amount received and the tax inside it. When a payment only covers part of an invoice, write the balance still due; when it settles a deposit, say so. Here is the tax inside one paid amount of ${h.money(550, 'US')} in the generator's four main cases:</p>
${h.table(['Paid, tax included', 'Tax inside', 'Price before tax'], [
  ['Australia, GST 10%', h.money(h.calc({ country: 'AU', region: 'NSW', registered: true, inclusive: true, lines: [{ desc: 'x', qty: 1, price: 550, tax: 'gst' }] }).tax, 'AU', 2), h.money(h.calc({ country: 'AU', region: 'NSW', registered: true, inclusive: true, lines: [{ desc: 'x', qty: 1, price: 550, tax: 'gst' }] }).net, 'AU', 2)],
  ['UK, VAT 20%', h.money(h.calc({ country: 'UK', region: '', registered: true, inclusive: true, lines: [{ desc: 'x', qty: 1, price: 550, tax: 'standard' }] }).tax, 'UK', 2), h.money(h.calc({ country: 'UK', region: '', registered: true, inclusive: true, lines: [{ desc: 'x', qty: 1, price: 550, tax: 'standard' }] }).net, 'UK', 2)],
  ['Ontario, HST 13%', h.money(h.calc({ country: 'CA', region: 'ON', registered: true, inclusive: true, lines: [{ desc: 'x', qty: 1, price: 550, tax: 'ca_full' }] }).tax, 'CA', 2), h.money(h.calc({ country: 'CA', region: 'ON', registered: true, inclusive: true, lines: [{ desc: 'x', qty: 1, price: 550, tax: 'ca_full' }] }).net, 'CA', 2)],
  ['Quebec, GST + QST', h.money(h.calc({ country: 'CA', region: 'QC', registered: true, inclusive: true, lines: [{ desc: 'x', qty: 1, price: 550, tax: 'ca_full' }] }).tax, 'CA', 2), h.money(h.calc({ country: 'CA', region: 'QC', registered: true, inclusive: true, lines: [{ desc: 'x', qty: 1, price: 550, tax: 'ca_full' }] }).net, 'CA', 2)],
], 'Backing the tax out of a payment of 550', ['l', 'r', 'r'])}
<p>The ${h.a('receipt-template', 'receipt template')} builds this layout directly, with "Received from" instead of "Bill to" and the amount paid in place of the amount due.</p>

<h2>Credit notes, quotes and pro formas are neither</h2>
<p>Three other documents get confused with these two. A quote or estimate states a price before anything is agreed, and asks for nothing. A pro forma invoice looks like an invoice but is a preview of one, used for advance payment or customs, and a customer cannot reclaim tax on it. A credit note cancels or reduces an invoice already issued; in Australia the GST version is called an adjustment note, in the US a credit memo. The ${h.a('estimate-template', 'quote template')}, the ${h.a('proforma-invoice-template', 'pro forma template')} and the ${h.a('credit-note-template', 'credit note template')} each print the right title.</p>
<!--mini:invoiceCheck-->
<p>When a payment arrives late instead, the documents change again: in the UK a reminder can add statutory interest, as set out in the ${h.a('late-payment-interest-uk', 'late payment interest guide')}.</p>`,
  related: ['receipt-template', 'how-to-write-an-invoice', 'deposit-invoice', 'proforma-invoice-template', 'credit-note-template'],
  sources: ['uk_vat_records', 'ca_itc_regs', 'rq_showing', 'ato_tax_invoices'],
});
