import { definePage } from '../../lib/page-types';
import { P, PROVINCES, PROVINCE_CODES, type ProvinceCode } from '../../lib/engine/params';

// Previous HST rates: params-2026.json > ca.hst_history (CRA table, source ca_rates).
const HISTORY = (Object.entries(P.ca.hst_history.rates) as Array<[string, number[]]>).map(([c, r]) => [PROVINCES[c as ProvinceCode].name, ...r.map((x) => `${+(x * 100).toFixed(3)}%`)]);

const kindLabel = (c: ProvinceCode) => {
  const p = PROVINCES[c];
  return p.kind === 'hst' ? 'One harmonized tax' : p.kind === 'gst' ? 'GST alone' : p.kind === 'gst_qst' ? 'GST and QST, two lines' : `GST and ${p.pst_name}, two lines`;
};

export default definePage({
  id: 'gst-hst-pst-by-province',
  path: '/guides/gst-hst-pst-by-province/',
  group: 'guides',
  kind: 'guide',
  order: 110,
  nav: 'GST, HST and PST by province',
  card: 'The tax structure of each province and territory, the lines it puts on an invoice and what one sale costs in each.',
  title: 'GST, HST and PST by Province 2026: Rates for Invoices',
  description: 'GST, HST, PST, RST and QST by province for 2026 invoices: the 13 rates, how many tax lines each puts on the bill, and one $2,500 sale priced in every province.',
  h1: 'GST, HST and PST by province, line by line',
  intro: 'Thirteen provinces and territories, four ways of taxing the same sale, and the tax lines each one prints.',
  mini: 'caProvinceTax',
  resume: (h) => {
    const sale = 2500;
    const all = PROVINCE_CODES.map((c) => ({ c, r: h.calc({ country: 'CA', region: c, registered: true, lines: [{ desc: 'x', qty: 1, price: sale, tax: 'ca_full' }] }) }));
    const lo = all.reduce((a, b) => (b.r.tax < a.r.tax ? b : a));
    const hi = all.reduce((a, b) => (b.r.tax > a.r.tax ? b : a));
    return `A Canadian invoice carries one, two or no sales tax lines depending on where the supply is made, and the province decides the structure as much as the rate. Five provinces fold the ${h.pct(h.P.ca.gst)} federal GST into a single harmonized sales tax, from ${h.pct(PROVINCES.ON.hst!)} in Ontario to ${h.pct(PROVINCES.NB.hst!)} in New Brunswick, Newfoundland and Labrador and Prince Edward Island, with Nova Scotia at ${h.pct(PROVINCES.NS.hst!)} since ${h.date(PROVINCES.NS.changed!, 'CA')}. Four add a provincial tax of their own beside the GST: British Columbia's PST at ${h.pct(PROVINCES.BC.pst!)}, Manitoba's RST at ${h.pct(PROVINCES.MB.pst!)}, Saskatchewan's PST at ${h.pct(PROVINCES.SK.pst!)} and Quebec's QST at ${h.pct(PROVINCES.QC.pst!)}, each worked out on the price before GST. Alberta and the three territories charge the GST alone. On a ${h.money(sale, 'CA')} sale that gives ${h.money(lo.r.tax, 'CA', 2)} of tax in ${PROVINCES[lo.c].name} and ${h.money(hi.r.tax, 'CA', 2)} in ${PROVINCES[hi.c].name}. The calculator above shows each line for the province you pick, and the generator prints them exactly so.`;
  },
  faqs: (h) => [
    { q: 'Why does a Saskatchewan or Manitoba invoice show two tax lines when Ontario shows one?', a: `Ontario harmonized its sales tax with the GST, so a single ${h.pct(PROVINCES.ON.hst!)} HST line covers both. Saskatchewan (PST ${h.pct(PROVINCES.SK.pst!)}) and Manitoba (RST ${h.pct(PROVINCES.MB.pst!)}) kept their own provincial tax, administered by the province, so the ${h.pct(h.P.ca.gst)} GST and the provincial tax are separate amounts and are best shown as separate lines on the invoice.` },
    { q: 'Which HST rate goes on a Nova Scotia invoice dated before April 2025?', a: `The rate in force at the time, ${h.pct(PROVINCES.NS.hst_previous!)}. The CRA's table of previous rates shows Nova Scotia at ${h.pct(PROVINCES.NS.hst_previous!)} from 1 October 2016 to 31 March 2025 and ${h.pct(PROVINCES.NS.hst!)} from 1 April 2025. A corrected or reissued invoice for an older supply should keep the rate that applied then; the generator uses today's ${h.pct(PROVINCES.NS.hst!)}, so check older dates by hand.` },
    { q: 'Is QST worked out on the price including GST in Quebec?', a: `No. The QST of ${h.pct(PROVINCES.QC.pst!)} applies to the same price as the GST, before GST. On ${h.money(100, 'CA')} that means ${h.money(5, 'CA')} of GST and ${h.money(h.calc({ country: 'CA', region: 'QC', registered: true, lines: [{ desc: 'x', qty: 1, price: 100, tax: 'ca_full' }] }).bands.find((b) => b.label === 'QST')!.amount, 'CA', 2)} of QST, for a total of ${h.money(h.calc({ country: 'CA', region: 'QC', registered: true, lines: [{ desc: 'x', qty: 1, price: 100, tax: 'ca_full' }] }).total, 'CA', 2)}. Revenu Québec also asks that the taxes be shown separately or stated as included.` },
    { q: 'Do the territories add any sales tax to the GST on an invoice?', a: `No. Yukon, the Northwest Territories and Nunavut have no territorial sales tax, so an invoice for a supply made there carries the ${h.pct(h.P.ca.gst)} GST and nothing else, exactly like Alberta. A registrant based in Whitehorse that sells to a customer in another province may still have to charge that province's HST, because the rate follows where the supply is made.` },
    { q: 'Can one invoice mix lines with and without the provincial sales tax?', a: 'Yes, and in British Columbia, Manitoba and Saskatchewan it is common, because the provincial tax does not reach everything the GST does. Mark each line in the generator: "GST + PST" or "GST only". The invoice then shows the GST on all taxable lines and the provincial tax on the lines it applies to, with one total per tax.' },
    { q: 'Which provinces changed their harmonized rate in the last ten years?', a: 'Four, according to the CRA table. New Brunswick went from 13% to 15% on 1 July 2016, Newfoundland and Labrador from 13% to 15% on 1 July 2016, Prince Edward Island from 14% to 15% on 1 October 2016, and Nova Scotia from 15% down to 14% on 1 April 2025. Ontario has stayed at 13% throughout.' },
  ],
  body: (h) => {
    const sale = 2500;
    const rows = PROVINCE_CODES.map((c) => {
      const p = PROVINCES[c];
      const r = h.calc({ country: 'CA', region: c, registered: true, lines: [{ desc: 'x', qty: 1, price: sale, tax: 'ca_full' }] });
      const lines = r.bands.map((b) => `${b.label} ${h.money(b.amount, 'CA', 2)}`).join(' + ');
      return [p.name, kindLabel(c), p.kind === 'hst' ? `HST ${h.pct(p.hst!)}` : `GST ${h.pct(h.P.ca.gst)}${p.pst ? ` + ${p.pst_name} ${h.pct(p.pst)}` : ''}`, lines, h.money(r.total, 'CA', 2)];
    });
    const bc = h.calc({ country: 'CA', region: 'BC', registered: true, lines: [{ desc: 'Design work', qty: 1, price: 1500, tax: 'ca_gst_only' }, { desc: 'Printed brochures', qty: 1, price: 600, tax: 'ca_full' }] });
    const sk = h.calc({ country: 'CA', region: 'SK', registered: true, inclusive: true, lines: [{ desc: 'x', qty: 1, price: 111, tax: 'ca_full' }] });
    return `
<h2>Four structures, thirteen jurisdictions</h2>
<p>The federal GST of ${h.pct(h.P.ca.gst)}, set by section 165 of the ${h.src('ca_eta', 'Excise Tax Act')}, applies everywhere. What changes from one province to the next is what sits on top of it. The table below runs one ${h.money(sale, 'CA')} taxable sale through the engine for each jurisdiction, so you can see both the rate and the lines your customer will read.</p>
${h.table(['Province or territory', 'Structure', 'Rates', 'Tax lines on the invoice', 'Invoice total'], rows, `A ${h.money(sale, 'CA')} sale before tax, seller registered, rates from the CRA table effective 1 April 2025`, ['l', 'l', 'l', 'l', 'r'])}
<p>The rates come from the ${h.src('ca_rates', 'CRA table of GST/HST rates by province')}, read on ${h.date(h.P.retrieved_at, 'CA')}. The provincial sales taxes are confirmed on each government's own page: ${h.src('bc_pst', 'British Columbia')}, ${h.src('mb_rst', 'Manitoba')} and ${h.src('sk_pst', 'Saskatchewan')}.</p>

<h2>Harmonized provinces: one line, one return</h2>
<p>In Ontario, New Brunswick, Nova Scotia, Newfoundland and Labrador and Prince Edward Island, the provincial part is collected with the federal part as a single HST, reported on the same GST/HST return. The invoice therefore needs one tax line, labelled HST with its rate. Writing "GST 5% + provincial 8%" on an Ontario invoice is not wrong arithmetically, but it describes a tax that does not exist separately there, and it confuses the customer's bookkeeper who has to enter a single HST amount.</p>
<p>A harmonized province can change its rate on its own. The CRA keeps a table of the earlier rates, useful when you correct an old invoice or check one you received:</p>
${h.table(['Province', '1 Apr 2013 to 30 Jun 2016', '1 Jul to 30 Sep 2016', '1 Oct 2016 to 31 Mar 2025', 'From 1 Apr 2025'], HISTORY, 'HST rates over time, CRA table of previous rates', ['l', 'r', 'r', 'r', 'r'])}

<h2>GST plus a provincial tax: two lines, two administrations</h2>
<p>British Columbia, Manitoba, Saskatchewan and Quebec run their own sales tax. In the first three it is a retail tax administered by the province, with its own registration and its own list of what is taxable; in Quebec the QST is administered, together with the GST, by Revenu Québec. Either way, the invoice shows two separate amounts. Each provincial tax is computed on the price before GST, never on the GST itself, which is why the generator works out both taxes on the same base and rounds each total to the cent.</p>
<p>The provincial tax does not always follow the GST line for line. A British Columbia designer who bills design work and printed brochures in one invoice may owe the PST on the printed goods but not on the design service, while the GST applies to both. Marked that way in the generator, a ${h.money(1500, 'CA')} design fee and ${h.money(600, 'CA')} of brochures give ${bc.bands.map((b) => `${b.label} ${h.money(b.amount, 'CA', 2)} on ${h.money(b.base, 'CA')}`).join(' and ')}, a total of ${h.money(bc.total, 'CA', 2)}. Which goods and services each province taxes is set by that province; the generator applies the choice you make for each line and does not decide it for you.</p>
<!--mini:h_caMixedLines-->

<h2>GST alone</h2>
<p>Alberta, Yukon, the Northwest Territories and Nunavut have no provincial or territorial sales tax. A registered business there adds ${h.pct(h.P.ca.gst)} GST and nothing more. That does not make every invoice from Calgary a GST-only invoice: the rate depends on where the supply is made, so a sale delivered to a customer in a harmonized province can carry that province's HST instead. The generator asks for the province of the supply, not the province of your office, for that reason.</p>

<h2>Prices that include the taxes</h2>
<p>Some businesses quote tax-included prices, especially to consumers. The arithmetic then runs backwards: the net price is the typed price divided by one plus the combined rate. In Saskatchewan, a ${h.money(111, 'CA')} price that includes ${h.pct(h.P.ca.gst)} GST and ${h.pct(PROVINCES.SK.pst!)} PST holds ${h.money(sk.net, 'CA', 2)} before tax and ${h.money(sk.tax, 'CA', 2)} of tax. Revenu Québec accepts that the GST and QST be either shown separately or included in the price, as long as the customer is told the sale is taxable (${h.src('rq_showing', 'showing the taxes')}). For invoices of ${h.money(h.P.ca.itc_tiers[0], 'CA')} or more, the federal regulations ask for the tax amount or a statement that the price includes it, which the ${h.a('gst-hst-invoice-requirements', 'GST/HST invoice requirements guide')} covers band by band.</p>

<h2>Registration comes first</h2>
<p>All of this applies to registrants. A small supplier whose taxable supplies, with its associates, stay under ${h.money(h.P.ca.small_supplier, 'CA')} in a calendar quarter and over the four previous quarters does not have to register for the GST/HST or the QST (${h.src('rq_small', 'Revenu Québec, small suppliers')}), and an unregistered business charges neither. Provincial retail taxes have their own registration rules, separate from the federal one. In the generator, set "GST/HST registrant?" to No and the tax lines disappear from the invoice.</p>

<h2>Reading the province right on the invoice</h2>
<p>Three habits avoid most province errors. Put the customer's full address with the province on the invoice, because it is what shows where the goods went. Keep the rate on the tax line ("HST 13%", "QST 9.975%"), so a reader can check the arithmetic without a calculator. And when you deliver to several provinces in one month, issue separate invoices or separate lines per province rather than one blended rate. For a Quebec customer, the ${h.a('quebec-invoice-template', 'Quebec invoice template')} prints both registration numbers, and the ${h.a('invoice-generator-canada', 'Canada invoice generator')} handles every other province.</p>`;
  },
  related: ['invoice-generator-canada', 'gst-hst-invoice-requirements', 'quebec-invoice-template', 'deposit-invoice', 'invoice-numbering'],
  sources: ['ca_rates', 'ca_eta', 'bc_pst', 'mb_rst', 'sk_pst', 'rq_showing', 'rq_small'],
});
