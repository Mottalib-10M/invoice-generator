import { definePage } from '../../lib/page-types';
import { nextNumber, formatNumberPattern } from '../../lib/engine/terms';

export default definePage({
  id: 'invoice-numbering',
  path: '/guides/invoice-numbering/',
  group: 'guides',
  kind: 'guide',
  order: 140,
  nav: 'Invoice numbering',
  card: 'What the four countries require of an invoice number, the formats that scale, and how to handle voids, credits and new years.',
  title: 'Invoice Numbering 2026: Formats, Series and the Rules',
  description: 'Invoice numbering rules for 2026: HMRC sequential series, what the US, Canada and Australia require, 8 formats compared, yearly resets and cancelled numbers.',
  h1: 'Invoice numbering that holds up',
  intro: 'One number per document, never reused, in an order you can explain: what each country asks and how to set it up.',
  mini: 'numbering',
  resume: (h) => `Every invoice needs a number that identifies it and no other document, and in the UK a VAT-registered business must go further: HMRC's VAT Notice 700/21 lists "a sequential number based on one or more series which uniquely identifies the document" as the first detail of a VAT invoice. GOV.UK asks every UK business, registered or not, for "a unique identification number". Canada's input tax credit regulations, Australia's seven tax invoice details and US practice do not prescribe a number at all, yet customers' payables teams, banks matching transfers and auditors all rely on one. A format with a prefix, the year and a padded counter, such as ${formatNumberPattern('INV-{YYYY}-{N}', 42, '2026-10-16')}, satisfies every one of these rules, sorts correctly in any spreadsheet, and lets you restart the counter each January without repeating a number. The calculator above gives your next numbers and how long a four-digit counter lasts at your pace, and the generator remembers the last number you used on this device.`,
  faqs: (h) => [
    { q: 'Can I restart my invoice numbers at 0001 every January?', a: `Yes, as long as each number stays unique. HMRC allows a sequence "based on one or more series", and a year in the number makes each year its own series: ${formatNumberPattern('INV-{YYYY}-{N}', 1, '2027-01-04')} cannot be confused with ${formatNumberPattern('INV-{YYYY}-{N}', 1, '2026-01-05')}. Restarting at 1 without the year would reuse numbers, which is exactly what the rule forbids.` },
    { q: 'Can I run separate invoice number series for each client or shop?', a: 'Yes. The HMRC wording explicitly allows "one or more series", so a business with two shops, two brands or a series per major client can number each separately. Give each series its own prefix, for example SHOP1-0042 and WEB-0042, so that every number stays unique across the business, and keep each series in strict order.' },
    { q: 'What do I do with an invoice number I cancelled before sending?', a: 'Keep the gap explained rather than reusing the number. A simple record, "INV-2026-0057 voided, not issued", or the voided document itself kept on file, shows anyone reviewing the sequence why the number is missing. Reusing it for a different customer would give two different documents the same identity, which defeats the purpose of numbering.' },
    { q: 'Should credit notes use the same number series as invoices?', a: 'Better not. A separate series, such as CN-2026-0001, makes credit notes easy to find and stops them breaking the invoice sequence. What matters is that each credit note quotes the number of the invoice it corrects. The generator\'s credit note option starts its own series and has a field for the original invoice number.' },
    { q: 'Is a date-based invoice number such as 20261016-01 acceptable?', a: 'Yes, if it is unique and follows a logical order, which a date with a daily counter does. Its weakness is length and readability on the phone: customers have to read out eleven characters. A shorter year-and-counter format carries the same information about the year and is easier to quote in a bank transfer reference.' },
    { q: 'Do Australian or Canadian invoices legally need a number?', a: 'Neither list requires one. The ATO\'s seven tax invoice details and section 3 of Canada\'s ITC Information Regulations name the seller, dates, amounts, tax and description, not a number. In practice a number is still expected: it is the reference your customer quotes when paying, and the way you match payments to invoices in your own books.' },
  ],
  body: (h) => {
    const formats = [
      ['Plain counter', '1057', 'Simple, short', 'Grows without limit; no year; easy to guess how many invoices you send'],
      ['Padded counter', String(1057).padStart(6, '0'), 'Sorts correctly as text', 'Still no year'],
      ['Prefix + year + counter', formatNumberPattern('INV-{YYYY}-{N}', 57, '2026-10-16'), 'Unique across years, restart each January', 'Slightly longer'],
      ['Short year + month', formatNumberPattern('INV{YY}{MM}-{N}', 57, '2026-10-16', 3), 'Shows the period at a glance', 'Counter must not restart each month unless the month is in the number'],
      ['Series per shop', 'WEB-0057 / SHOP-0057', 'Separate sequences per activity', 'Needs distinct prefixes'],
      ['Date + daily counter', '20261016-01', 'Self-dating', 'Long to read out'],
      ['Client code + counter', 'ACME-014', 'Easy for one client to follow', 'Many short series to manage'],
      ['Credit note series', formatNumberPattern('CN-{YYYY}-{N}', 3, '2026-10-16'), 'Keeps credits apart', 'Must quote the invoice corrected'],
    ];
    return `
<h2>What each country asks</h2>
${h.table(['Country', 'Rule on the number', 'Source'], [
  ['United Kingdom, VAT-registered', 'A sequential number based on one or more series which uniquely identifies the document', h.src('uk_vat_records', 'VAT Notice 700/21, 4.1')],
  ['United Kingdom, not registered', 'A unique identification number', h.src('uk_invoice', 'GOV.UK, invoices')],
  ['Canada', 'Not among the prescribed details for input tax credits', h.src('ca_itc_regs', 'ITC Information Regulations, s. 3')],
  ['Australia', 'Not among the seven tax invoice details', h.src('ato_tax_invoices', 'ATO, tax invoices')],
  ['United States', 'No federal invoice format', 'State rules cover the tax, not the number'],
], 'Invoice number requirements by country', ['l', 'l', 'l'])}
<p>The UK rule is the strictest and the safest to follow everywhere: a sequence you can explain, in one or more series, with no number used twice. A business that numbers that way will never be caught out by a customer, an auditor or a tax inspector in any of the four countries.</p>

<h2>Formats compared</h2>
<p>There is no official format. These are the common ones, with what each buys you and what it costs.</p>
${h.table(['Format', 'Example', 'Strength', 'Weakness'], formats, 'Invoice number formats', ['l', 'l', 'l', 'l'])}
<p>For most freelancers and small firms, a prefix, the year and a four-digit counter is the right default. Four digits hold 9,999 invoices a year, which at a hundred invoices a month is more than eight years of headroom within a single year's series, so the counter never needs a fifth digit. The generator uses this pattern and proposes ${nextNumber(formatNumberPattern('INV-{YYYY}-{N}', 41, '2026-10-16'))} after ${formatNumberPattern('INV-{YYYY}-{N}', 41, '2026-10-16')}, keeping the zero padding.</p>

<h2>Gaps, voids and duplicates</h2>
<p>A sequence with a hole in it is not illegal in itself. What matters is that the hole has an explanation you can show: a draft cancelled before sending, a number skipped by mistake. Keep a note or the voided document. The real fault is the opposite one, two documents with the same number, because it breaks the link between the invoice, the payment and the tax record. That usually happens when two people or two devices issue invoices from the same series. If you invoice from a laptop and a phone, give each its own prefix, or keep one device as the source of numbers.</p>
<p>Once an invoice has been sent, it keeps its number for good. To change an amount, a rate or a customer detail, issue a credit note against it and a new invoice with the next number; the ${h.a('credit-note-template', 'credit note template')} does both halves.</p>
<!--mini:h_numberPlan-->

<h2>Other documents, other series</h2>
<p>Quotes, pro forma invoices, receipts and credit notes are documents too, and each benefits from its own series: Q- for quotes, PF- for pro formas, R- for receipts, CN- for credit notes. A quote that becomes an order then turns into an invoice with an invoice number, and the invoice can mention the quote it came from. Keeping the series apart means your invoice sequence only contains invoices, which is what a VAT inspector expects to read. The ${h.a('estimate-template', 'quote template')} and the ${h.a('proforma-invoice-template', 'pro forma template')} already start their own series.</p>

<h2>Changing your numbering system</h2>
<p>You can change format at any time, ideally at the start of a year or a VAT period. Close the old series cleanly (note its last number), start the new one with a prefix that cannot collide with any old number, and do not go back. Moving from a plain counter at 1057 to ${formatNumberPattern('INV-{YYYY}-{N}', 1, '2027-01-04')} on the first working day of a year is the cleanest version of this.</p>

<h2>Numbers your customer can use</h2>
<p>A number is only useful if it travels with the payment. Put it in the payment instructions ("Reference: the invoice number"), keep it short enough to type into a banking app, and avoid characters that are easy to misread such as a capital O beside zeros. The ${h.a('how-to-write-an-invoice', 'guide to writing an invoice')} covers the other details that sit beside the number at the top of the page, and the ${h.a('vat-invoice-requirements', 'VAT invoice requirements')} list the rest of HMRC's list.</p>`;
  },
  related: ['how-to-write-an-invoice', 'credit-note-template', 'vat-invoice-requirements', 'estimate-template', 'receipt-template'],
  sources: ['uk_vat_records', 'uk_invoice', 'ca_itc_regs', 'ato_tax_invoices'],
});
