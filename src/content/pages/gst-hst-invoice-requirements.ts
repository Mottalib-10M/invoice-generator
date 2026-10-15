import { definePage } from '../../lib/page-types';

export default definePage({
  id: 'gst-hst-invoice-requirements',
  path: '/guides/gst-hst-invoice-requirements/',
  group: 'guides',
  kind: 'guide',
  order: 100,
  nav: 'GST/HST invoice requirements',
  card: 'The three bands of the ITC regulations, under $100, to $500 and above, and what Quebec adds for the QST.',
  title: 'GST/HST Invoice Requirements 2026: $100 and $500 Rules',
  description: 'GST/HST invoice requirements for 2026: what a Canadian invoice must show under $100, from $100 and from $500 so customers can claim ITCs, plus Quebec\'s QST.',
  h1: 'GST/HST invoice requirements in Canada',
  intro: 'What your invoice must carry depends on its total, and your business customers lose their tax credit if a detail is missing.',
  mini: 'caItc',
  resume: (h) => {
    const [t1, t2] = h.P.ca.itc_tiers;
    return `Canada has no single list of what an invoice must say. What it has is stricter in practice: the Input Tax Credit Information (GST/HST) Regulations, which list what a business customer must hold before it can claim back the GST or HST you charged. If your invoice lacks one of those details, it is your customer who loses the input tax credit, and it is you who gets the call. The list grows in three steps with the total of the document. Under ${h.money(t1, 'CA')}, your name or trade name, the invoice date and the total are enough. From ${h.money(t1, 'CA')} to ${h.money(t2 - 0.01, 'CA', 2)}, your GST/HST registration number and the tax charged, or a statement that the price includes it, are added. From ${h.money(t2, 'CA')}, the invoice must also name the customer, state the terms of payment and describe each supply. In Quebec, Revenu Québec applies the same bands to the QST and asks for your QST number from ${h.money(t1, 'CA')}, and for the QST amount and a description at any amount.`;
  },
  faqs: (h) => [
    { q: 'Do I have to put my GST/HST number on every Canadian invoice?', a: `The regulations require it on invoices of ${h.money(h.P.ca.itc_tiers[0], 'CA')} or more, because without it your customer cannot claim the input tax credit. Below ${h.money(h.P.ca.itc_tiers[0], 'CA')} it is not a prescribed detail. Most registrants print it on every invoice anyway: it costs nothing and it removes a reason for customers to ask for a corrected copy.` },
    { q: 'Is a GST/HST-included price allowed on an invoice of $100 or more?', a: 'Yes, if the invoice says so. Section 3 of the ITC Information Regulations accepts, instead of a separate tax amount, a statement that tax is included in the price of each taxable supply, together with the total tax rate that applies and the amount for those supplies. "Prices include 13% HST" next to the lines meets that wording; a silent inclusive price does not.' },
    { q: 'What extra details does an invoice of $500 or more need for GST/HST?', a: 'Three more than the middle band: the customer\'s name, the name it does business under, or its authorized agent\'s name; the terms of payment; and a description of each supply sufficient to identify it. A purchase order number is not a substitute for the customer\'s name, and "services rendered" is rarely a sufficient description.' },
    { q: 'Do small suppliers not registered for GST/HST have to follow the invoice rules?', a: `They cannot charge GST or HST at all, so there is no tax to support and no registration number to show. Revenu Québec describes a small supplier as one whose taxable supplies, with its associates, do not exceed ${h.money(h.P.ca.small_supplier, 'CA')} in a calendar quarter or in the four preceding quarters. A clear invoice with your name, the date and the total is still good practice.` },
    { q: 'Why does a Quebec invoice under $100 need more detail than one in Ontario?', a: 'Because Revenu Québec\'s table for the QST is stricter at the bottom. For a total under $100, it requires the amount of tax and a description of the property or service for the QST, which the federal regulations do not ask for at that level. From $100, your QST registration number joins your GST/HST number.' },
    { q: 'Does a credit card slip count as a GST/HST invoice for the customer?', a: 'It can. The regulations define supporting documentation broadly: an invoice, a receipt, a credit-card receipt, a debit note, a written contract and records held in an electronic system all qualify, as long as the prescribed details for the amount appear on them, together or across several documents.' },
  ],
  body: (h) => {
    const [t1, t2] = h.P.ca.itc_tiers;
    const ex = [80, 350, 1200].map((a) => {
      const r = h.calc({ country: 'CA', region: 'ON', registered: true, lines: [{ desc: 'x', qty: 1, price: a, tax: 'ca_full' }] });
      const tier = r.total < t1 ? `under ${h.money(t1, 'CA')}` : r.total < t2 ? `${h.money(t1, 'CA')} to ${h.money(t2, 'CA')}` : `${h.money(t2, 'CA')} or more`;
      const n = r.total < t1 ? 3 : r.total < t2 ? 5 : 8;
      return [h.money(a, 'CA'), h.money(r.tax, 'CA', 2), h.money(r.total, 'CA', 2), tier, String(n)];
    });
    return `
<h2>The three bands, detail by detail</h2>
<p>The bands are set by the total shown on the document, tax included, and when one document covers several supplies, by their combined total. The source is section 3 of the ${h.src('ca_itc_regs', 'Input Tax Credit Information (GST/HST) Regulations')}; the Quebec column comes from ${h.src('rq_invoices', 'Revenu Québec\'s table for ITCs and ITRs')}.</p>
${h.table(['Detail', `Under ${h.money(t1, 'CA')}`, `${h.money(t1, 'CA')} to ${h.money(t2 - 0.01, 'CA', 2)}`, `${h.money(t2, 'CA')} or more`], [
  ['Your name or trade name (or an intermediary\'s)', 'Required', 'Required', 'Required'],
  ['Invoice date (or date tax became payable)', 'Required', 'Required', 'Required'],
  ['Total amount paid or payable', 'Required', 'Required', 'Required'],
  ['Your GST/HST registration number', 'No', 'Required', 'Required'],
  ['Tax amount, or statement that tax is included with the total rate', 'No (QST: required)', 'Required', 'Required'],
  ['Status of each supply if they differ', 'No', 'Required', 'Required'],
  ['Your QST registration number (Quebec)', 'No', 'Required', 'Required'],
  ['Customer\'s name or agent\'s name', 'No', 'No', 'Required'],
  ['Terms of payment', 'No', 'No', 'Required'],
  ['Description of each supply', 'No (QST: required)', 'No (QST: required)', 'Required'],
], 'Prescribed information by band, federal regulations and Revenu Québec', ['l', 'l', 'l', 'l'])}
<p>The generator's checklist applies this table to the total you build. Switch the province to Quebec and the QST lines join the list.</p>
<h2>Where invoices go wrong at each band</h2>
<h3>Under $100</h3>
<p>Coffee, parking, a small part. The regulations ask little, but a receipt that only shows a card number and a total, with no supplier name, still fails. In Quebec, the QST amount must be visible even here, so a single "taxes included" line without the QST figure does not support an input tax refund.</p>
<h3>From $100</h3>
<p>The registration number is where most corrected invoices start. It is the business number followed by the program identifier and reference, in the form 123456789 RT0001, and the checklist flags a number that does not have that shape. The tax also has to be shown, either as an amount or through the inclusive statement described below. When some lines are taxable and others are not, the invoice must indicate the status of each taxable supply, which is what the per-line tax code in the generator prints.</p>
<h3>From $500</h3>
<p>Here the customer's name, the terms of payment and a description sufficient to identify each supply become compulsory. Freelancers who send a short "for services, October" invoice to a corporate client are the usual casualties: the accounts payable team cannot support the credit and asks for a new one.</p>
<h2>Showing the tax: separately or included</h2>
<p>The regulations offer two ways to show the GST/HST on an invoice from ${h.money(t1, 'CA')}. The usual one is to show the tax: either per supply or as a total for all of them. Where provincial sales tax also applies to each taxable supply, the GST and PST may be shown as one combined figure, with a statement that the total includes the GST. The other way is to give tax-inclusive prices with a statement that tax is included, the total rate of tax that applies, and the amount paid for those supplies. "All prices include HST at 13%" meets it. In the generator, set "Prices include tax?" to Yes and the PDF prints the statement for you.</p>
<p>Revenu Québec adds its own rule for collecting the taxes: when you make a taxable sale, you must tell the customer it is subject to GST and QST, and the taxes must be either shown separately from the price or included in it.</p>
<h2>Three invoices, three bands</h2>
<p>The same Toronto consultant invoicing three amounts before tax, with HST at ${h.pct(h.P.ca.provinces.ON.hst ?? 0)} computed by the engine. The band follows the total with tax, which is why a ${h.money(t2 - 60, 'CA')} job can already fall in the top band.</p>
${h.table(['Price before tax', 'HST', 'Total', 'Band', 'Details required'], ex, 'Ontario, HST 13%, one taxable line', ['r', 'r', 'r', 'l', 'r'])}
<h2>Small suppliers and voluntary registration</h2>
<p>A business that is not registered for GST/HST must not add the tax, and its invoices cannot support an input tax credit for the customer. Revenu Québec's definition of a small supplier is the one the generator's notes use: total taxable supplies worldwide, with associates, of no more than ${h.money(h.P.ca.small_supplier, 'CA')} in a calendar quarter or in the four preceding calendar quarters. Above that, you register, and from that date every invoice of ${h.money(t1, 'CA')} or more carries your number. In the generator, set "GST/HST registrant?" to No to remove the tax lines.</p>
<h2>Rates belong on the invoice too</h2>
<p>The rate you charge depends on the province of the supply, from ${h.pct(h.P.ca.gst)} GST in Alberta to ${h.pct(0.15)} HST in the Atlantic provinces, with PST, RST or QST added in four provinces. The ${h.a('gst-hst-pst-by-province', 'GST, HST and PST by province guide')} gives every rate and computes them, and the ${h.a('quebec-invoice-template', 'Quebec invoice template')} starts with both registration numbers in place.</p>`;
  },
  related: ['invoice-generator-canada', 'gst-hst-pst-by-province', 'quebec-invoice-template', 'how-to-write-an-invoice', 'invoice-numbering'],
  sources: ['ca_itc_regs', 'rq_invoices', 'rq_showing', 'rq_small', 'ca_rates'],
});
