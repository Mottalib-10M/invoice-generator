import { definePage } from '../../lib/page-types';

export default definePage({
  id: 'vat-invoice-requirements',
  path: '/guides/vat-invoice-requirements/',
  group: 'guides',
  kind: 'guide',
  order: 60,
  nav: 'VAT invoice requirements',
  card: 'The eleven details HMRC requires, and the simplified invoice up to £250.',
  title: 'VAT Invoice Requirements 2026: HMRC Full and Simplified',
  description: 'VAT invoice requirements from HMRC VAT Notice 700/21 for 2026: what a full invoice must show, simplified invoices up to £250, VAT in sterling, 30-day issue.',
  h1: 'VAT invoice requirements: what HMRC expects on the page',
  intro: 'Enter the price including VAT: the calculator tells you whether a simplified invoice is enough and how much VAT the price holds.',
  mini: 'vatInvoiceType',
  resume: (h) => `A VAT invoice is the document that lets your business customer reclaim the VAT you charge, and HMRC lists what it must contain in section 4 of VAT Notice 700/21. If you are VAT-registered, you must issue one whenever you supply goods or services at the standard or reduced rate to another VAT-registered business, normally within ${h.P.uk.issue_within_days} days of the supply. A full VAT invoice carries a sequential number, the time of supply, the date of issue where it differs, your name, address and VAT registration number, the customer's name and address, a description of what you supplied, and for each line the quantity, the unit price, the VAT rate and the amount before VAT, then the total before VAT, any cash discount rate and the total VAT in sterling. For a supply of ${h.money(h.P.uk.simplified_invoice_max, 'UK')} or less including VAT, a simplified invoice is allowed: your name, address and VAT number, the tax point, a description, and for each rate the total including VAT and the rate. Only VAT-registered businesses can issue either kind.`,
  faqs: (h) => [
    { q: 'Must a UK VAT invoice show the customer\'s address?', a: `On a full VAT invoice, yes: HMRC lists the name and address of the person you supply. On a simplified VAT invoice, allowed when the supply is ${h.money(h.P.uk.simplified_invoice_max, 'UK')} or less including VAT, the customer's details are not on the list at all. A VAT number for the customer is only needed in special cases, such as Northern Ireland sales of goods to EU businesses.` },
    { q: 'How many days do I have to issue a VAT invoice in the UK?', a: `Normally ${h.P.uk.issue_within_days} days from the date you make the supply, according to VAT Notice 700/21. The time of supply, or tax point, printed on the invoice is a separate date: it decides which VAT return the sale belongs to. Keep the two dates distinct on the invoice when they differ, as HMRC's own example does.` },
    { q: 'Can a VAT invoice be in euros or dollars?', a: 'Yes. HMRC allows the amounts on a VAT invoice to be expressed in any currency, but the total VAT chargeable must also be shown in sterling. The generator adds a field for the sterling VAT figure as soon as you pick another currency with VAT, and the guide on invoicing in a foreign currency explains how to choose the exchange rate.' },
    { q: 'Do I need a VAT invoice for zero-rated or exempt sales?', a: 'No. VAT Notice 700/21 says you do not always have to issue a VAT invoice to a registered customer when the invoice is only for exempt or zero-rated sales within the UK. You still need an invoice for your records and your customer\'s, but it does not have to carry the VAT invoice details. Mixed invoices must show each rate.' },
    { q: 'Can I round the VAT down on a UK VAT invoice?', a: 'Yes, as an invoice trader you may round down the total VAT payable on all the goods and services on a VAT invoice to a whole penny and ignore any fraction, under paragraph 17.5 of VAT Notice 700. The concession applies when the VAT you charge and the VAT you pay HMRC are the same. The generator applies it automatically.' },
    { q: 'Is a pro forma invoice a VAT invoice in the UK?', a: 'No. A pro forma asks for payment before the supply and cannot be used by the customer to reclaim VAT. Mark it clearly as a pro forma, then issue the real VAT invoice once the supply or the payment creates a tax point. The generator prints "Pro forma invoice" and a line saying no tax can be reclaimed on it.' },
  ],
  body: (h) => {
    const ex = h.calc({ country: 'UK', region: '', registered: true, lines: [{ desc: 'Radios', qty: 6, price: 25.2, tax: 'standard' }, { desc: 'DVD players', qty: 4, price: 23.6, tax: 'standard' }] });
    const mix = h.calc({ country: 'UK', region: '', registered: true, lines: [{ desc: 'Children\'s car seat', qty: 1, price: 150, tax: 'reduced' }, { desc: 'Pushchair', qty: 1, price: 320, tax: 'standard' }, { desc: 'Baby clothes', qty: 1, price: 60, tax: 'zero' }] });
    return `
<h2>The eleven details of a full VAT invoice</h2>
<p>${h.src('uk_vat_records', 'VAT Notice 700/21, paragraph 4.1')} is a list, not a model layout. Each item has a practical reason behind it, and most refused VAT claims come down to one of them missing.</p>
${h.table(['Detail', 'What it means on the page'], [
  ['Sequential number', 'One or more series that identify each invoice uniquely; gaps should have an explanation'],
  ['Time of supply', 'The tax point, which decides the VAT period of the sale'],
  ['Date of issue', 'Only if it differs from the time of supply'],
  ['Supplier\'s name, address, VAT number', 'Your registered details, the VAT number in full'],
  ['Customer\'s name and address', 'The person you supplied, not necessarily the one who pays'],
  ['Description', 'Enough to identify the goods or services'],
  ['Quantity or extent', 'Units, hours, days for each description'],
  ['Unit price', 'The price of one unit before VAT'],
  ['Rate of VAT and amount excluding VAT', `For each line, at ${h.pct(h.P.uk.vat_rates.standard)}, ${h.pct(h.P.uk.vat_rates.reduced)} or ${h.pct(0)}`],
  ['Total excluding VAT and cash discount rate', 'The gross total before VAT in any currency; the rate of any discount offered for prompt payment'],
  ['Total VAT', 'Expressed in sterling, whatever the invoice currency'],
], 'Required details of a full VAT invoice, HMRC VAT Notice 700/21', ['l', 'l'])}
<p>HMRC prints its own example in the notice: six radios at ${h.money(25.2, 'UK', 2)} and four DVD players at ${h.money(23.6, 'UK', 2)}, all at the standard rate. The generator gives the same figures to the penny: ${h.money(ex.net, 'UK', 2)} before VAT, ${h.money(ex.tax, 'UK', 2)} of VAT, ${h.money(ex.total, 'UK', 2)} in total. It is one of the automated tests the site runs before each update.</p>
<h2>Simplified and modified invoices</h2>
<p>When the charge for a supply is ${h.money(h.P.uk.simplified_invoice_max, 'UK')} or less including VAT, you may issue a simplified invoice. It needs your name, address and VAT registration number, the tax point, a description, and for each VAT rate the total payable including VAT and the rate. It must not include exempt supplies. Above ${h.money(h.P.uk.simplified_invoice_max, 'UK')}, if a customer asks for a VAT invoice, you issue either a full one or a modified one, which shows VAT-inclusive values instead of exclusive ones. The modified form suits retailers whose prices are displayed with VAT.</p>
<p>The calculator at the top of this page works out which form applies to a price and how much VAT that price contains: one-sixth of a standard-rated VAT-inclusive price, one twenty-first of a reduced-rated one.</p>
<h2>Several rates on one invoice</h2>
<p>A full invoice can mix rates, as long as each line shows its own. A nursery shop selling a child's car seat at ${h.pct(h.P.uk.vat_rates.reduced)}, a pushchair at ${h.pct(h.P.uk.vat_rates.standard)} and clothes at ${h.pct(0)} produces three VAT bands (the reduced and zero rates are the ones GOV.UK gives as examples for car seats and children's clothes), and the engine totals them separately.</p>
${h.table(['Rate', 'Net amount', 'VAT'], mix.bands.map((b) => [h.pct(b.rate), h.money(b.base, 'UK', 2), h.money(b.amount, 'UK', 2)]), `Mixed-rate invoice: total ${h.money(mix.total, 'UK', 2)} including ${h.money(mix.tax, 'UK', 2)} of VAT`, ['l', 'r', 'r'])}
<p>Exempt and outside-the-scope lines can sit on the same document, but they carry no VAT and must be clearly identified. A line at zero per cent is still a taxable supply, which is why it appears in the table with a nil amount.</p>
<h2>Rounding the VAT</h2>
<p>Paragraph 17.5 of ${h.src('uk_vat_guide', 'VAT Notice 700')} lets an invoice trader round the total VAT on an invoice down to the whole penny. When VAT is worked out line by line, each line can be rounded down to the nearest 0.1p or to the nearest 1p or 0.5p, and the final total may again be rounded down. The generator works on the whole invoice and rounds the total down, so a single line of ${h.money(10.99, 'UK', 2)} carries ${h.money(h.calc({ country: 'UK', region: '', registered: true, lines: [{ desc: 'x', qty: 1, price: 10.99, tax: 'standard' }] }).tax, 'UK', 2)} of VAT rather than ${h.money(2.2, 'UK', 2)}.</p>
<h2>Special cases with extra wording</h2>
<p>Some supplies need a statement on top of the eleven details. Under the domestic reverse charge for building and construction services, the invoice states that the customer accounts for the VAT, and the VAT is not added to the amount due; the ${h.a('reverse-charge-invoice', 'reverse charge invoice guide')} gives HMRC's accepted wordings. A business in Northern Ireland invoicing a person in an EU member state adds GB before its VAT number and the customer's EU VAT number. Margin scheme invoices follow their own rules and are outside what the generator handles.</p>
<h2>Invoices from businesses that are not registered</h2>
<p>A business below the ${h.money(h.P.uk.vat_threshold, 'UK')} registration threshold, as listed on ${h.src('uk_vat_register', 'GOV.UK')}, cannot issue a VAT invoice and must not show VAT. Its invoices follow the general list on ${h.src('uk_invoice', 'GOV.UK')}: a unique number, its name, address and contact details, the customer's name and address, a description, the supply date, the invoice date, the amounts and the total. A sole trader with a trading name adds their own name and an address where legal documents can be delivered; a limited company uses its full name as on the certificate of incorporation. The ${h.a('sole-trader-invoice-template', 'sole trader invoice template')} is set up for this case.</p>
<h2>Electronic VAT invoices</h2>
<p>Nothing in the notice requires paper. A PDF sent by email is a VAT invoice if it carries all the details, and HMRC's separate notice on electronic invoicing covers systems that exchange invoices automatically. Whatever the format, keep a copy of every VAT invoice you issue: VAT Notice 700/21 treats them as part of your business records, and your customer relies on theirs to reclaim the tax.</p>`;
  },
  related: ['vat-invoice-generator-uk', 'reverse-charge-invoice', 'invoice-in-foreign-currency', 'how-to-write-an-invoice', 'sole-trader-invoice-template'],
  sources: ['uk_vat_records', 'uk_vat_guide', 'uk_vat_rates', 'uk_vat_register', 'uk_invoice'],
});
