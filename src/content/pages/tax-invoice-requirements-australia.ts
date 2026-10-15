import { definePage } from '../../lib/page-types';

export default definePage({
  id: 'tax-invoice-requirements-australia',
  path: '/guides/tax-invoice-requirements-australia/',
  group: 'guides',
  kind: 'guide',
  order: 120,
  nav: 'Tax invoice requirements (Australia)',
  card: 'The ATO rules by sale size, mixed taxable and GST-free sales, eInvoices, recipient-created invoices and the two rounding rules.',
  title: 'Tax Invoice Requirements Australia 2026: ATO Checklist',
  description: 'Tax invoice requirements in Australia for 2026: the 7 ATO details, the $82.50 and $1,000 thresholds, mixed GST-free sales, eInvoices, RCTIs and GST rounding.',
  h1: 'Tax invoice requirements in Australia',
  intro: 'What the ATO expects a tax invoice to show, and how the answer moves with the size and the make-up of the sale.',
  mini: 'auTaxInvoice',
  resume: (h) => `A tax invoice is the document your GST-registered customer needs to claim back the GST in your price, so the ATO's requirements are written from the buyer's side: the document must let anyone reading it determine seven details without guessing. They are that the document is intended to be a tax invoice, the seller's identity, the seller's ABN, the date of issue, a brief description of what was sold with quantity and price, the GST payable (or the statement "Total price includes GST" when the GST is exactly one-eleventh), and the extent to which each sale is taxable. Two thresholds change the obligation. At ${h.money(h.P.au.tax_invoice_on_request_above, 'AU', 2)} or less including GST, you do not have to issue one even if asked; above it, you must provide one within ${h.P.au.provide_within_days} days of a request. At ${h.money(h.P.au.buyer_identity_from, 'AU')} or more, the invoice must also show the buyer's identity or ABN. The calculator above takes a GST-inclusive price, extracts the GST at one-eleventh and tells you which of these rules apply to it.`,
  faqs: (h) => [
    { q: 'Is an emailed PDF a valid tax invoice in Australia?', a: 'Yes. The ATO says a tax invoice does not need to be on paper and gives a PDF sent by email as an example. What matters is the content: the digital document must contain every required detail, exactly as a paper one would. Keep your own copy of each PDF you send, since it is part of your business records.' },
    { q: 'Does a Peppol eInvoice need the words "Tax invoice" on it?', a: 'Not necessarily. The ATO accepts that an eInvoice issued under the A-NZ Invoice Specification on the Peppol network, with all its mandatory data, satisfies the requirement that the document is intended to be a tax invoice, even when the words "Tax invoice" or "GST invoice" do not appear. A PDF made with this generator is not a Peppol eInvoice, so it keeps the words.' },
    { q: 'Who issues a recipient-created tax invoice in Australia?', a: 'The buyer, in special cases the ATO allows, rather than the supplier. These are called recipient-created tax invoices, or RCTIs, and they follow their own ATO conditions. Outside those cases, an ordinary freelancer, shop or trade business issues its own tax invoices, and a customer cannot simply decide to write them on the supplier\'s behalf.' },
    { q: 'What changes on an Australian tax invoice that mixes GST and GST-free items?', a: 'It must show clearly which items are taxable. The ATO adds three requirements for these mixed invoices: each taxable sale, the amount of GST payable and the total amount payable. The single statement "Total price includes GST" no longer works across the whole invoice, because part of the total carries no GST. The generator marks GST-free and input-taxed lines in the tax column.' },
    { q: 'Does a tax invoice for exactly $1,000 need the buyer\'s details?', a: `Yes. The ATO rule applies to sales of ${h.money(h.P.au.buyer_identity_from, 'AU')} or more, so a total of exactly ${h.money(h.P.au.buyer_identity_from, 'AU')} is inside it. Add the buyer's name or ABN. An invoice that meets the ${h.money(h.P.au.buyer_identity_from, 'AU')} requirements can also be used for smaller sales, which is why many businesses simply always show the customer.` },
    { q: 'Must a taxi or rideshare driver issue tax invoices under the $75,000 GST threshold?', a: `Drivers who provide taxi or ride-sourcing travel for passengers must register for GST whatever their turnover, according to the ATO, so the ${h.money(h.P.au.registration_threshold, 'AU')} threshold does not help them. Once registered, a passenger who asks for a tax invoice on a fare above ${h.money(h.P.au.tax_invoice_on_request_above, 'AU', 2)} must receive one within ${h.P.au.provide_within_days} days.` },
  ],
  body: (h) => {
    const cases = [60, 82.5, 82.55, 450, 999.99, 1000, 4400].map((a) => {
      const gst = Math.round((a / 11) * 100) / 100;
      const need = a <= h.P.au.tax_invoice_on_request_above ? 'No, even on request' : `Yes, within ${h.P.au.provide_within_days} days of a request`;
      const buyer = a >= h.P.au.buyer_identity_from ? 'Required' : 'Not required';
      return [h.money(a, 'AU', 2), h.money(gst, 'AU', 2), need, buyer];
    });
    const mixed = h.calc({ country: 'AU', region: 'VIC', registered: true, lines: [{ desc: 'Cooking class', qty: 2, price: 120, tax: 'gst' }, { desc: 'Fresh produce box', qty: 2, price: 45, tax: 'gst_free' }] });
    const three = h.calc({ country: 'AU', region: 'QLD', registered: true, inclusive: true, lines: [{ desc: 'a', qty: 1, price: 10.45, tax: 'gst' }, { desc: 'b', qty: 1, price: 7.15, tax: 'gst' }, { desc: 'c', qty: 1, price: 3.3, tax: 'gst' }] });
    return `
<h2>The size of the sale decides the obligation</h2>
<p>The ${h.src('ato_tax_invoices', 'ATO page on tax invoices')} ties the rules to the GST-inclusive value of the sale. The table applies them to a few amounts, with the GST each contains when the whole price is taxable at ${h.pct(h.P.au.gst)}.</p>
${h.table(['Sale, GST included', 'GST inside (one-eleventh)', 'Tax invoice if the customer asks', 'Buyer identity or ABN'], cases, 'Fully taxable sales, GST rounded to the cent', ['r', 'r', 'l', 'l'])}
<p>Two points are easy to miss. The ${h.money(h.P.au.tax_invoice_on_request_above, 'AU', 2)} limit is inclusive: a sale of exactly that amount never requires a tax invoice, one cent more does. And "on request" is about obligation, not permission: nothing stops you from issuing a tax invoice for every sale, which is what most businesses selling to other businesses do, because their customers need it to claim a GST credit.</p>

<h2>Reading the seven details as a buyer would</h2>
<p>The ATO wording is that the invoice must include "enough information to clearly determine" each detail. That is looser than a fixed form and stricter than it sounds. "Clearly determine" means the bookkeeper processing your invoice, who knows nothing about the job, can see who you are, find your ABN, see the date, understand what was supplied and in what quantity, and arrive at the GST without assumptions. A line reading "Services as discussed, $2,200" fails the description test even though the amount is there. A trading name with no ABN fails the identity test because the buyer cannot link the name to a registered business.</p>
<p>The first detail, that the document is intended to be a tax invoice, is the one paper templates most often lose. An "Invoice" heading on a GST-registered business's document is not fatal if the rest makes the intention clear, but the words "Tax invoice" remove any doubt, and the generator prints them whenever you say you are registered. When you are not registered, it prints "Invoice" and no GST, because a document titled "Tax invoice" from an unregistered seller misleads the customer into claiming a credit that does not exist. That case has its own ${h.a('invoice-without-gst-template', 'template for invoices without GST')}.</p>

<h2>Mixed sales: taxable, GST-free and input-taxed on one invoice</h2>
<p>Under the GST Act, many basic foods, some health and education services and exports are GST-free, while residential rent and financial supplies are input-taxed. When one invoice combines them with taxable items, the ATO asks for three things on top of the seven details: each taxable sale identified, the GST payable, and the total payable. A cooking school that sells two classes at ${h.money(120, 'AU')} and two produce boxes at ${h.money(45, 'AU')} shows GST of ${h.money(mixed.tax, 'AU', 2)} on the classes only, for a total of ${h.money(mixed.total, 'AU', 2)}. The tax column of the generator says "GST 10%" or "GST-free" against each line, which is exactly the "extent to which each sale is taxable" the ATO wants to see.</p>
<p>Whether a given item is GST-free is decided by the GST law, not by the invoice. The generator applies the code you choose; if you are unsure about an item, the ATO's guidance or your tax agent is the place to check before you send.</p>
<!--mini:h_auMixedSale-->

<h2>Paper, PDF and eInvoices</h2>
<p>A tax invoice can be paper, a PDF attached to an email, or another digital format, provided the digital version carries every required detail. Australia has also adopted the Peppol network for eInvoicing, where invoices travel directly from the seller's software to the buyer's. For those, the ATO accepts that the "intended to be a tax invoice" detail is satisfied when the eInvoice follows the A-NZ Invoice Specification and contains its mandatory data. A PDF from this site is not a Peppol message: it is a conventional tax invoice, so it keeps the heading and all seven details visibly on the page.</p>

<h2>Rounding the GST: two rules, both allowed</h2>
<p>GST often lands on a fraction of a cent. With a single taxable sale, round to the nearest cent, half a cent up. With several, the ATO offers two methods. Under the total invoice rule you add up the GST for all taxable sales and round once; when every taxable sale carries exactly one-eleventh, you may instead add the GST-exclusive values and calculate the GST on that sum. Under the taxable supply rule you work out the GST on each sale, round where your system needs to, then add and round the total. You and your customer do not have to use the same method. Three GST-inclusive items at ${h.money(10.45, 'AU', 2)}, ${h.money(7.15, 'AU', 2)} and ${h.money(3.3, 'AU', 2)} hold ${h.money(three.tax, 'AU', 2)} of GST under the total invoice rule, which is the method this generator applies.</p>

<h2>Recipient-created tax invoices and agents</h2>
<p>In most sales the supplier issues the tax invoice. The ATO allows the purchaser to issue it in special cases, known as recipient-created tax invoices, and has separate rules for sales made through agents. Neither case is handled by this generator, which always produces a supplier's document; if your industry works with RCTIs, your customer will usually send you the document instead of asking for one.</p>

<h2>Before you send</h2>
<p>Check the ABN digits: the ${h.src('abr_abn_format', 'Australian Business Register check')} catches a mistyped number, and the generator runs it as you type. Check the date, because the issue date is one of the seven details and an undated invoice is not a tax invoice. Check the total against the ${h.money(h.P.au.buyer_identity_from, 'AU')} line and add the buyer if needed. Then keep your copy. Registration itself, at ${h.money(h.P.au.registration_threshold, 'AU')} of GST turnover (${h.money(h.P.au.nfp_threshold, 'AU')} for non-profit bodies), is explained on the ${h.src('ato_register', 'ATO registration page')}, and the ${h.a('tax-invoice-generator-australia', 'Australian tax invoice generator')} builds the document with all of the above.</p>`;
  },
  related: ['tax-invoice-generator-australia', 'invoice-without-gst-template', 'receipt-template', 'how-to-write-an-invoice', 'invoice-numbering'],
  sources: ['ato_tax_invoices', 'ato_register', 'abr_abn_format', 'au_gst_act'],
});
