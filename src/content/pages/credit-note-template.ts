import { definePage } from '../../lib/page-types';

export default definePage({
  id: 'credit-note-template',
  path: '/templates/credit-note/',
  group: 'templates',
  kind: 'tool',
  order: 80,
  nav: 'Credit note',
  card: 'Reduce or cancel an invoice already sent, with the VAT credited in sterling.',
  title: 'Credit Note Template 2026: Free VAT Credit Note, PDF',
  description: 'Free credit note template, 2026: credit a refund or overcharge against the original invoice with the VAT details HMRC lists. Also adjustment notes and memos.',
  h1: 'Credit note template, with the VAT details HMRC asks for',
  intro: 'When an invoice was too high, goods came back or a price was cut after the fact: credit it, do not edit it.',
  tool: { country: 'UK', preset: 'credit_note' },
  resume: (h) => `A credit note reduces an invoice you have already issued, for a return, an overcharge, a cancelled service or a discount agreed afterwards, and it is the correct fix because an issued invoice should never be edited or deleted. HMRC's VAT guide, paragraph 18.2.3, sets out what a valid credit note must show: its own number and date of issue, your name, address and VAT registration number, the customer's name and address, a description of what is credited with the quantity and amount, the total credited excluding VAT, the rate and amount of VAT credited in sterling, and the number and date of the original VAT invoice. It must reflect a genuine mistake, overcharge or agreed reduction and be issued within 14 days of any refund. The template does all of this: the sample credits two faulty desk lamps at ${h.money(49, 'UK')} each against invoice INV-2026-0042, with ${h.money(h.calc({ country: 'UK', region: '', registered: true, lines: [{ desc: 'a', qty: 2, price: 49, tax: 'standard' }] }).tax, 'UK', 2)} of VAT credited. The title follows the country: "Credit note" in the UK and Canada, "Credit memo" in the US and "Adjustment note" for a GST-registered seller in Australia.`,
  faqs: (h) => [
    { q: 'Can I just delete a UK VAT invoice and issue a new one instead of a credit note?', a: 'No. Once a VAT invoice has been issued it is part of your records and your customer may already have reclaimed the VAT on it. Correct it with a credit note that refers to its number and date and shows the VAT credited, then issue a new invoice if the sale still stands. HMRC\'s guide says a correcting credit note should show both the correct and incorrect VAT.' },
    { q: 'How long do I have to issue a credit note after a refund in the UK?', a: 'HMRC\'s VAT guide says a valid credit note must be issued within 14 days of the refund payment being made to the customer, and must give the customer a genuine entitlement to the amount, either refunded or set against future supplies. A credit note that only moves figures around without any real reduction in the price is not valid for VAT.' },
    { q: 'What if the credit note does not adjust the VAT?', a: 'If you and your customer agree a credit without adjusting the VAT, HMRC asks that the document states "This is not a credit note for VAT". You must still adjust your own records of sales and purchases for the VAT return. In the generator, write that sentence in the notes and set the lines to "Outside scope" so no VAT is shown.' },
    { q: 'What is an adjustment note in Australia, compared with a credit note?', a: `It is the ATO's term for the same idea: a document that records a decrease (or increase) in the price of a taxable sale after the tax invoice was issued, so both sides can correct their GST. When you choose Australia and say you are registered for GST, the generator titles the credit document "Adjustment note". At ${h.pct(h.P.au.gst)} GST, the GST credited on a GST-exclusive refund is one-tenth of it.` },
  ],
  body: (h) => `
<h2>The details of a valid UK credit note</h2>
<p>The list in VAT Notice 700 is short and every item has a reason. The original invoice number ties the credit to the VAT already declared; the VAT in sterling lets your customer reduce the input tax they claimed by exactly that amount; the description stops a credit note from becoming a blank cheque. The generator's fields map onto the list as follows.</p>
${h.table(['Required by HMRC', 'Where it comes from in the generator'], [
  ['Identifying number and date of issue', 'Number (CN-2026-0001) and invoice date'],
  ['Your name, address and VAT registration number', 'From: your business'],
  ['Customer name and address', 'Bill to'],
  ['Description, quantity and amount per item', 'Items'],
  ['Total credited excluding VAT', 'Subtotal'],
  ['Rate and amount of VAT credited, in sterling', 'VAT line (add the sterling figure if you invoice in another currency)'],
  ['Number and date of the original VAT invoice', 'Original invoice number field'],
], 'VAT Notice 700, 18.2.3, against the template', ['l', 'l'])}
<p>Type the amounts as positive numbers: the document is titled as a credit and its total reads "Total credit", so the customer cannot mistake it for a new charge.</p>
<h2>Credit note, refund or new invoice</h2>
<p>A credit note says how much the customer no longer owes. What happens to that money is a separate decision: you refund it, or the customer deducts it from the next invoice. Write which one in the notes, with the refund date or the invoice it will be set against. When the original sale simply had the wrong price, the clean sequence is a credit note for the full original invoice, then a new invoice at the right price, so each document is internally consistent.</p>
<h2>Credit memo and adjustment note</h2>
<p>US businesses call the same document a credit memo; no federal rule governs it, but if the original sale carried sales tax, the memo should credit the tax on the returned items too so the customer's records match yours. In Australia, a GST-registered seller who reduces the price of a taxable sale issues an adjustment note, and the generator prints that title when the country is Australia and GST registration is on. In Canada, the credit note should name the original invoice and the GST/HST (and QST in Quebec) credited, so the customer can reduce the tax credit claimed. For a straightforward refund of a paid amount without any change to the sale, a ${h.a('receipt-template', 'receipt')} recording the repayment may be all you need.</p>
<p>If the reduction comes from an early payment discount agreed on the invoice, the ${h.a('early-payment-discount', 'early payment discount guide')} explains the HMRC wording that avoids issuing a credit note at all.</p>`,
  related: ['receipt-template', 'vat-invoice-requirements', 'early-payment-discount', 'invoice-numbering', 'vat-invoice-generator-uk'],
  sources: ['uk_vat_guide', 'uk_vat_records', 'ato_tax_invoices'],
});
