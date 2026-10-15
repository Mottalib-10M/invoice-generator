import { definePage } from '../../lib/page-types';
import { PROVINCES, PROVINCE_CODES } from '../../lib/engine/params';

export default definePage({
  id: 'invoice-generator-canada',
  path: '/invoice-generator-canada/',
  group: 'countries',
  kind: 'tool',
  order: 30,
  nav: 'Canada invoice generator',
  card: 'GST, HST, PST, RST or QST by province, CRA input tax credit details checked.',
  title: 'Invoice Generator Canada 2026: GST, HST, PST and QST Free',
  description: 'Free Canadian invoice generator for 2026: GST 5%, HST 13% to 15%, PST, RST and QST by province, the CRA details your customer needs for ITCs, no sign-up.',
  h1: 'Invoice generator for Canada, with GST, HST, PST and QST',
  intro: 'Choose the province where the sale is taxed: the generator applies HST or stacks GST and the provincial tax, line by line.',
  tool: { country: 'CA', preset: 'standard' },
  resume: (h) => {
    const on = h.calc({ country: 'CA', region: 'ON', registered: true, lines: [{ desc: 'a', qty: 12, price: 150, tax: 'ca_full' }, { desc: 'b', qty: 1, price: 240, tax: 'ca_full' }] });
    const qc = h.calc({ country: 'CA', region: 'QC', registered: true, lines: [{ desc: 'a', qty: 12, price: 150, tax: 'ca_full' }, { desc: 'b', qty: 1, price: 240, tax: 'ca_full' }] });
    return `A Canadian invoice changes shape with the province of the sale, not only its rate. In Ontario, New Brunswick, Nova Scotia, Newfoundland and Labrador and Prince Edward Island, one harmonized sales tax replaces the federal GST, at ${h.pct(0.13)} in Ontario, ${h.pct(PROVINCES.NS.hst ?? 0)} in Nova Scotia since 1 April 2025 and ${h.pct(0.15)} elsewhere. In British Columbia, Manitoba, Saskatchewan and Quebec, a provincial tax sits beside the ${h.pct(h.P.ca.gst)} GST and is computed on the price before GST, and the territories and Alberta charge GST alone. The generator holds the CRA's table for all ${PROVINCE_CODES.length} provinces and territories, so a Toronto consultant billing twelve hours at ${h.money(150, 'CA')} and ${h.money(240, 'CA')} of materials charges ${h.money(on.tax, 'CA', 2)} of HST, while the same invoice in Montreal carries ${h.money(qc.tax, 'CA', 2)} of GST and QST. Beside the preview, the checklist follows the federal regulation on input tax credits: what must be shown under ${h.money(h.P.ca.itc_tiers[0], 'CA')}, up to ${h.money(h.P.ca.itc_tiers[1], 'CA')}, and above.`;
  },
  faqs: (h) => [
    { q: 'Which province do I choose for a Canadian invoice to a customer in another province?', a: 'The province where the sale is made under the CRA place-of-supply rules, which is not always your own. A registrant in Alberta selling into Ontario can owe Ontario HST, so the generator lets you choose any province or territory and recalculates every line. Where the rules for a service are unclear, check the CRA\'s place-of-supply guidance before you send the invoice.' },
    { q: 'Must my GST/HST number appear on every invoice I issue in Canada?', a: `Not on every one, but from ${h.money(h.P.ca.itc_tiers[0], 'CA')} it must, because your customer needs it to claim an input tax credit. Below ${h.money(h.P.ca.itc_tiers[0], 'CA')} the regulation only asks for your name, the date and the total. Printing it on all invoices costs nothing and saves questions from business customers.` },
    { q: 'Is PST charged on the GST in British Columbia or Saskatchewan invoices?', a: `No. In both provinces the provincial sales tax is calculated on the price before GST, and so is Quebec's QST. On ${h.money(1000, 'CA')} in Vancouver that is ${h.money(50, 'CA')} of GST plus ${h.money(70, 'CA')} of PST. Some services are subject to GST but not to PST: mark those lines "GST only" in the generator.` },
    { q: 'Can a small supplier in Canada send invoices without GST?', a: `Yes. If your worldwide taxable supplies stay at or below ${h.money(h.P.ca.small_supplier, 'CA')} in a calendar quarter and over the last four quarters, you are a small supplier and need not register. Set the registration switch to No and the invoice carries no tax. Once registered, even voluntarily, you must charge GST/HST on taxable sales.` },
    { q: 'What does a Canadian invoice of $500 or more need for the customer to claim the tax back?', a: `Everything required below ${h.money(h.P.ca.itc_tiers[1], 'CA')}, which is your name, the date, the total, your registration number and the tax amount or a statement that it is included, plus the customer's name, the terms of payment and a description of what was supplied. The generator's checklist adds these items automatically once the total reaches ${h.money(h.P.ca.itc_tiers[1], 'CA')}.` },
    { q: 'Which page size and date style does the Canada invoice generator use?', a: `US Letter, the paper size used across Canada, and dates written out in full, such as "October 15, 2026", so there is no confusion between day and month. Amounts are in Canadian dollars by default; you can pick another currency for a foreign customer, and the GST, HST, PST or QST lines follow the same currency.` },
  ],
  body: (h) => {
    const rows = PROVINCE_CODES.map((c) => {
      const p = PROVINCES[c];
      const r = h.calc({ country: 'CA', region: c, registered: true, lines: [{ desc: 'x', qty: 1, price: 1000, tax: 'ca_full' }] });
      return [p.name, p.kind === 'hst' ? `HST ${h.pct(p.hst ?? 0)}` : `GST ${h.pct(h.P.ca.gst)}`, p.pst ? `${p.pst_name} ${h.pct(p.pst)}` : 'none', h.money(r.tax, 'CA', 2), h.money(r.total, 'CA', 2)];
    });
    const bc = h.calc({ country: 'CA', region: 'BC', registered: true, lines: [{ desc: 'Software licence', qty: 1, price: 800, tax: 'ca_full' }, { desc: 'Consulting', qty: 1, price: 1200, tax: 'ca_gst_only' }] });
    const [t1, t2] = h.P.ca.itc_tiers;
    return `
<h2>Province by province</h2>
<p>Every rate below comes from the CRA's table effective 1 April 2025 and from the finance ministries of British Columbia, Manitoba and Saskatchewan. The amounts are what the generator produces on a ${h.money(1000, 'CA')} taxable sale by a registrant.</p>
${h.table(['Province or territory', 'Federal or harmonized', 'Provincial tax', 'Tax on $1,000', 'Invoice total'], rows, 'Sales taxes on a taxable sale of $1,000, by province', ['l', 'l', 'l', 'r', 'r'])}
<p>Nova Scotia is the one recent change: its HST fell from ${h.pct(PROVINCES.NS.hst_previous ?? 0)} to ${h.pct(PROVINCES.NS.hst ?? 0)} on 1 April 2025. Invoices copied from an older template still often show the old rate.</p>
<h2>When the provincial tax does not follow the GST</h2>
<p>In the GST-plus-PST provinces, some lines carry GST but no provincial tax, because the provincial base is narrower than the federal one. Take a B.C. firm invoicing an ${h.money(800, 'CA')} software licence and ${h.money(1200, 'CA')} of consulting: if its reading of the B.C. rules is that only the first line bears PST, it sets the second to "GST only" and the generator charges ${h.money(bc.tax, 'CA', 2)} in total, ${h.pct(h.P.ca.gst)} on both lines and ${h.pct(PROVINCES.BC.pst ?? 0)} on the first. Check the provincial rules for your own supplies: the generator applies the treatment you choose, it does not decide it.</p>
<h2>What the invoice must show</h2>
<p>Canada has no single legal invoice format. What it has is the ${h.src('ca_itc_regs', 'Input Tax Credit Information Regulations')}, which list the details a business customer must hold to claim back the GST/HST you charged. If your invoice lacks them, the customer's claim can be refused, and the customer will come back to you.</p>
${h.table(['Total of the invoice', 'What it must show'], [
  [`Under ${h.money(t1, 'CA')}`, 'Your name or business name, the invoice date, the total amount'],
  [`${h.money(t1, 'CA')} to ${h.money(t2 - 0.01, 'CA', 2)}`, 'The above, plus your GST/HST registration number and the tax (or a statement that the price includes it)'],
  [`${h.money(t2, 'CA')} or more`, 'The above, plus the customer\'s name, the terms of payment and a description of each supply'],
], 'Required details by amount (SOR/91-45, section 3)', ['l', 'l'])}
<p>The checklist beside the preview reads your total and switches band as you type. Your registration number is checked for its format: nine digits, the letters RT and a four-digit reference, such as 123456789 RT0001. The ${h.a('gst-hst-invoice-requirements', 'GST/HST invoice requirements guide')} goes through each item.</p>
<h2>Quebec: the QST has its own rules</h2>
<p>Revenu Québec administers both the GST and the QST in Quebec, and its table is stricter than the federal one: the QST amount and a description are required at any amount, and from ${h.money(t1, 'CA')} the invoice must show both your GST and your QST registration numbers. When you pick Quebec, the generator adds a field for the QST number and prints the two taxes on separate lines, ${h.pct(h.P.ca.gst)} and ${h.pct(PROVINCES.QC.pst ?? 0)}. The ${h.a('quebec-invoice-template', 'Quebec invoice template')} is ready filled for a Montreal business.</p>
<h2>Prices with tax included</h2>
<p>Retailers and trades who quote all-in prices can switch on "Prices include tax". The generator then backs the tax out of each line and prints a statement that the prices include it, which the regulation accepts in place of a separate tax amount for each supply. Business customers usually prefer to see the tax separately, so keep it off for business-to-business invoices.</p>
<h2>Registration and small suppliers</h2>
<p>You may invoice without GST/HST while you are a small supplier, that is while your taxable supplies stay at or below ${h.money(h.P.ca.small_supplier, 'CA')} in a calendar quarter and over the four preceding quarters. Revenu Québec applies the same limit for the QST. Above it, registration is required and every taxable invoice carries the tax. The ${h.a('gst-hst-pst-by-province', 'province by province guide')} covers the provincial registrations that PST and RST require.</p>`;
  },
  related: ['gst-hst-invoice-requirements', 'gst-hst-pst-by-province', 'quebec-invoice-template', 'consulting-invoice-template', 'payment-terms', 'deposit-invoice'],
  sources: ['ca_rates', 'ca_itc_regs', 'ca_eta', 'rq_invoices', 'bc_pst', 'mb_rst', 'sk_pst'],
});
