import { definePage } from '../../lib/page-types';

export default definePage({
  id: 'blank-invoice-template',
  path: '/templates/blank-invoice/',
  group: 'templates',
  kind: 'tool',
  order: 130,
  nav: 'Blank invoice',
  card: 'Empty form to fill in on screen or print, with what each box needs by country.',
  title: 'Blank Invoice Template 2026: Fill In Online or Print Free',
  description: 'Blank invoice template, free in 2026: fill it in on screen or print it empty, with what each box must hold in the US, UK, Canada and Australia. No sign-up.',
  h1: 'Blank invoice template',
  intro: 'Every box empty, ready to fill in on screen or to print and complete by hand, with the tax worked out for you if you type the lines.',
  tool: { country: 'US', preset: 'blank' },
  resume: (h) => `A blank invoice is the same document as any other invoice with nothing filled in yet, and what you must write in its boxes depends on the country where you sell. Every version needs a unique number, a date, who is selling, who is buying, what was supplied with quantity and price, and the total. The UK adds the supply date and, for a VAT-registered seller, the VAT number, the VAT rate of each line and the total VAT in sterling; Canada adds your GST/HST registration number once the total reaches ${h.money(h.P.ca.itc_tiers[0], 'CA')} and the customer's name and payment terms from ${h.money(h.P.ca.itc_tiers[1], 'CA')}; Australia wants the words "Tax invoice", the ABN and the GST amount when the seller is registered, plus the buyer's identity from ${h.money(h.P.au.buyer_identity_from, 'AU')}; the US has no federal list but expects sales tax on its own line. This page opens the generator with every field empty. Type into it and the tax, the totals and the checklist fill themselves in, or download it empty and complete it with a pen.`,
  faqs: (h) => [
    { q: 'Can I print a blank invoice and fill it in by hand?', a: 'Yes. Leave the fields empty and download the PDF, or print the preview. A handwritten invoice is valid if it carries the details the law asks for in your country, and the checklist beside the preview tells you which ones those are. Work out the tax carefully by hand: it is the part most often wrong on paper invoices.' },
    { q: 'Is a blank invoice template in Word or Excel better than an online one?', a: 'A spreadsheet adds up what you type, but it does not know the tax rate of a US state, the VAT rounding HMRC allows or the GST/HST of a Canadian province, and it will not warn you that a required detail is missing. Here the tax follows the country and region you choose, and you can still save the result as a PDF.' },
    { q: 'Which boxes of a blank invoice can I leave empty?', a: 'Only those that do not apply: a purchase order number if the customer gave none, a deposit line if nothing was paid, a tax number if you are not registered. Never leave the invoice number, the date, your name, the description or the total empty. Above the amount thresholds, the customer details and terms become required too.' },
    { q: 'Does a blank invoice need my logo to look professional?', a: 'No law asks for a logo. It helps customers recognise you, so the template accepts a PNG or JPG under 600 KB, kept on your device only. What makes an invoice look professional to an accounts department is a clear number, a clear due date and the tax shown correctly, which the template arranges for you.' },
  ],
  body: (h) => `
<h2>What each box must hold, country by country</h2>
<p>The boxes of the template are the same everywhere. What changes is whether a box is required, optional or must stay empty. This table reads the official lists for a seller registered for the tax of its country.</p>
${h.table(['Box', 'United States', 'United Kingdom (VAT)', 'Canada', 'Australia (GST)'], [
  ['Invoice number', 'Expected', 'Sequential, required', 'Expected', 'Expected'],
  ['Invoice date', 'Expected', 'Required', 'Required', 'Required'],
  ['Supply date / tax point', 'Optional', 'Required if different', 'Optional', 'Optional'],
  ['Your name and address', 'Expected', 'Required', 'Name required', 'Identity required'],
  ['Your tax number', 'Optional', 'VAT number required', `GST/HST number from ${h.money(h.P.ca.itc_tiers[0], 'CA')}`, 'ABN required'],
  ['Customer name', 'Expected', 'Name and address required', `From ${h.money(h.P.ca.itc_tiers[1], 'CA')}`, `Identity or ABN from ${h.money(h.P.au.buyer_identity_from, 'AU')}`],
  ['Description, quantity, unit price', 'Expected', 'Required, with VAT rate per line', `Description from ${h.money(h.P.ca.itc_tiers[1], 'CA')}`, 'Required'],
  ['Tax amount', 'Sales tax line', 'Total VAT in sterling', `From ${h.money(h.P.ca.itc_tiers[0], 'CA')}`, 'GST amount or "Total price includes GST"'],
  ['Payment terms', 'Expected', 'Optional', `From ${h.money(h.P.ca.itc_tiers[1], 'CA')}`, 'Optional'],
  ['Title', '"Invoice"', '"VAT invoice" or "Invoice"', '"Invoice"', '"Tax invoice"'],
], 'Required = in the official text; expected = no legal list, but customers and auditors need it', ['l', 'l', 'l', 'l', 'l'])}
<p>For sellers who are not registered, the tax boxes stay empty: no VAT, GST or sales tax line, no tax number that does not exist and, in Australia, no "Tax invoice" title. The ${h.a('how-to-write-an-invoice', 'guide to writing an invoice')} explains each item and its source.</p>
<h2>Mistakes that show up on blank forms</h2>
<p>Paper and spreadsheet blanks fail in predictable places. A duplicated number happens when two pads or two files are in use at once; keep one series and void a spoilt sheet by marking it cancelled rather than reusing its number. Arithmetic slips cluster in the tax: rounding each line and then adding gives a different total from rounding once at the end, and in the UK a VAT-registered trader may round the invoice's total VAT down to the penny. Dates drift too: an invoice dated when it is typed rather than when the work was done can move the tax point in the UK or the due date everywhere. Finally, an old blank kept in a drawer still carries last year's rate or an address you have since left, so check the printed parts before reusing a stack of forms.</p>
<h2>Filling it in on screen</h2>
<p>Start with the country, then the state or province: in the US it sets the state sales tax rate, in Canada it decides between HST and GST with a provincial tax. Type one line per item or job. Each line has a tax code, so you can mix taxable and non-taxable work on the same blank invoice. The totals, the tax per rate and the balance due are recalculated at every keystroke, and the checklist under the preview turns green when every required box for your case is filled.</p>
<p>Your business details, logo and last invoice number stay in this browser for next time, so the following blank invoice opens with your side already completed and the next number ready. Customer details and lines are never kept.</p>
<h2>Printing it empty</h2>
<p>If you prefer pen and paper, click "Start blank" under the checklist and download the PDF straight away. The page size follows the country: US Letter for the United States and Canada, A4 for the UK and Australia. On a printed blank, leave room for each line's tax code if you are VAT-registered in the UK, because a VAT invoice must give the rate line by line, and write the total tax as a separate figure in every country where you charge it.</p>
<p>For a job where a template fits better, start from the ${h.a('freelance-invoice-template', 'freelance')}, ${h.a('contractor-invoice-template', 'contractor')} or ${h.a('hourly-invoice-template', 'hourly')} invoice instead: the lines and terms are already set out for that work.</p>`,
  related: ['how-to-write-an-invoice', 'templates', 'freelance-invoice-template', 'invoice-numbering', 'receipt-template'],
  sources: ['uk_invoice', 'uk_vat_records', 'ca_itc_regs', 'ato_tax_invoices'],
});
