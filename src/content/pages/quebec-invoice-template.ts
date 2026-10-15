import { definePage } from '../../lib/page-types';

const QC = (h: { calc: Function }, price: number) => (h.calc as (i: unknown) => { bands: Array<{ label: string; amount: number }>; tax: number; total: number })({ country: 'CA', region: 'QC', registered: true, lines: [{ desc: 'x', qty: 1, price, tax: 'ca_full' }] });

export default definePage({
  id: 'quebec-invoice-template',
  path: '/templates/quebec-invoice/',
  group: 'templates',
  kind: 'tool',
  order: 110,
  nav: 'Quebec invoice (GST + QST)',
  card: 'GST and QST on separate lines, both registration numbers, Revenu Québec bands.',
  title: 'Quebec Invoice Template 2026: GST and QST, Free PDF',
  description: 'Free Quebec invoice template for 2026: GST at 5% and QST at 9.975% on separate lines, both registration numbers, and the details Revenu Québec lists by amount.',
  h1: 'Quebec invoice template with GST and QST',
  intro: 'Two taxes, two registration numbers, and a rule set that asks for more detail than the rest of Canada, even on small amounts.',
  tool: { country: 'CA', preset: 'quebec' },
  resume: (h) => {
    const r = QC(h, 2040);
    const gst = r.bands.find((b) => b.label === 'GST')!.amount, qst = r.bands.find((b) => b.label === 'QST')!.amount;
    return `A Quebec invoice carries two separate consumption taxes: the federal GST at ${h.pct(h.P.ca.gst)} and the Quebec sales tax, QST, at ${h.pct(h.P.ca.provinces.QC.pst)}, both collected by Revenu Québec for most businesses in the province. The QST is calculated on the selling price before GST, never on the GST itself, so the two amounts are computed side by side on the same base. This template starts from a Montreal design studio billing twelve hours at ${h.money(150, 'CA')} and ${h.money(240, 'CA')} of workshop material: on ${h.money(2040, 'CA')} the invoice adds ${h.money(gst, 'CA', 2)} of GST and ${h.money(qst, 'CA', 2)} of QST, ${h.money(r.total, 'CA', 2)} in all. Revenu Québec does not impose a special invoice format, except for restaurants and taxi operators under mandatory billing, but the purchaser can only claim back its input tax credits and refunds if the document shows certain details, and those details depend on the total: under ${h.money(h.P.ca.itc_tiers[0], 'CA')}, up to ${h.money(h.P.ca.itc_tiers[1] - 0.01, 'CA', 2)}, or ${h.money(h.P.ca.itc_tiers[1], 'CA')} and more. The checklist beside the preview applies that table as you type.`;
  },
  faqs: (h) => [
    { q: 'Must a Quebec invoice show the GST and the QST as two separate amounts?', a: `Revenu Québec lets you either show the GST and QST separately from the price or include them in it, as long as the customer is told the sale is subject to both. For an invoice of ${h.money(h.P.ca.itc_tiers[0], 'CA')} or more, the purchaser needs the tax amount to claim it back, and where both taxes are combined you must say the figure includes GST and QST. Separate lines are the clearest choice.` },
    { q: 'Where do I find my QST registration number for a Quebec invoice?', a: 'It is the number Revenu Québec gave you when you registered, ten digits followed by TQ and four digits, such as 1234567890 TQ0001. Your GST number is a different one, nine digits followed by RT and four digits. From $100 both numbers must be on the invoice for a registered customer to claim its credits and refunds.' },
    { q: 'Does a Quebec freelancer below $30,000 of sales have to charge QST on invoices?', a: `No. Revenu Québec treats you as a small supplier if your worldwide taxable supplies, with your associates, do not exceed ${h.money(h.P.ca.small_supplier, 'CA')} in a calendar quarter or over the four preceding quarters. A small supplier who has not registered voluntarily charges neither GST nor QST and should not print tax numbers. Switch the registration toggle to No and the template drops both tax lines.` },
    { q: 'Is QST charged on top of the GST on a Quebec invoice?', a: `No. The QST is computed on the price before GST, so the two taxes share the same base, and neither is a tax on the other. On ${h.money(1000, 'CA')} that gives ${h.money(50, 'CA')} of GST and ${h.money(99.75, 'CA', 2)} of QST, ${h.money(1149.75, 'CA', 2)} in all, which is what the generator calculates line by line.` },
    { q: 'Can a Quebec invoice be written in English?', a: 'This template prints in English, and nothing in the GST and QST invoice information rules sets a language. Quebec\'s Charter of the French language has its own rules for commercial documents, so many Quebec businesses issue French or bilingual invoices; check your obligations under the Charter if you invoice Quebec consumers.' },
  ],
  body: (h) => {
    const rows = [80, 300, 1200].map((p) => { const r = QC(h, p); return [h.money(p, 'CA'), h.money(r.bands.find((b) => b.label === 'GST')!.amount, 'CA', 2), h.money(r.bands.find((b) => b.label === 'QST')!.amount, 'CA', 2), h.money(r.total, 'CA', 2)]; });
    return `
<h2>What Revenu Québec asks to see, band by band</h2>
<p>The table below is Revenu Québec's own list of the information a registrant needs on its purchase documents to justify input tax credits (GST) and input tax refunds (QST). Your invoice is your customer's purchase document, so this is the list that decides whether the tax you charge can be recovered. The difference with the rest of Canada sits in the first band: below ${h.money(h.P.ca.itc_tiers[0], 'CA')}, the federal regulations only ask for the supplier, the date and the total, while Quebec also wants the QST amount and a description.</p>
${h.table(['Detail on the invoice', `Under ${h.money(h.P.ca.itc_tiers[0], 'CA')}`, `${h.money(h.P.ca.itc_tiers[0], 'CA')} to ${h.money(h.P.ca.itc_tiers[1] - 0.01, 'CA', 2)}`, `${h.money(h.P.ca.itc_tiers[1], 'CA')} or more`], [
  ['Supplier\'s name or business name', 'Required', 'Required', 'Required'],
  ['Date of invoice', 'Required', 'Required', 'Required'],
  ['Total amount', 'Required', 'Required', 'Required'],
  ['Amount of tax', 'QST only', 'Required', 'Required'],
  ['GST and QST registration numbers', 'Not required', 'Required', 'Required'],
  ['Purchaser\'s name', 'Not required', 'Not required', 'Required'],
  ['Terms of payment', 'Not required', 'Not required', 'Required'],
  ['Description of the goods or services', 'QST only', 'QST only', 'Required'],
], 'Revenu Québec, information required to justify ITCs and ITRs, by total including taxes', ['l', 'l', 'l', 'l'])}
<p>Totals are measured taxes included. A ${h.money(95, 'CA')} sale before tax becomes more than ${h.money(h.P.ca.itc_tiers[0], 'CA')} once GST and QST are added, so it already falls in the second band and needs both registration numbers. The template prints them automatically once you fill in the two fields.</p>
<h2>Three Quebec invoices worked out</h2>
${h.table(['Price before tax', `GST ${h.pct(h.P.ca.gst)}`, `QST ${h.pct(h.P.ca.provinces.QC.pst)}`, 'Total'], rows, 'Computed by the generator\'s engine, each tax rounded to the cent', ['r', 'r', 'r', 'r'])}
<p>Each tax is rounded to the cent on its own total, which is how the amounts appear on the invoice. If you work with prices that already include both taxes, switch "Prices include tax?" to Yes: the engine backs out the net price with the combined rate and prints a statement that the prices include GST and QST.</p>
<h2>Lines that carry GST only, or no tax</h2>
<p>Not every supply in Quebec is taxed at the full rates. A zero-rated supply is taxable at 0%, so it carries neither GST nor QST but still counts as a taxable supply, for instance in the small supplier test; an exempt supply is outside both taxes altogether. Which of your sales fall in either category is set by the legislation, not by the invoice. Pick "Zero-rated" or "Exempt" on the line. The generator keeps those lines out of both tax bases, so a mixed invoice shows the GST and QST only on what is taxed. The ${h.a('gst-hst-pst-by-province', 'province by province guide')} explains why the other provinces split their taxes differently.</p>
<h2>Selling from Quebec to another province</h2>
<p>The province on the invoice is the province where the supply is made, which in most cases follows where the customer receives the goods or the service, not where your office is. A Montreal studio billing a client in Ottawa charges Ontario HST rather than GST and QST. Choose the customer's province in the generator: the tax lines and the checklist change with it. The ${h.a('gst-hst-invoice-requirements', 'GST/HST invoice requirements guide')} covers the federal rules that apply in every province, and the ${h.a('invoice-generator-canada', 'Canada invoice generator')} starts from an Ontario sale.</p>
<h2>Restaurants and taxis</h2>
<p>Two sectors are outside this template. Restaurant establishments and taxi business operators in Quebec fall under mandatory billing: their bills must be produced with a sales recording module or system, and a customer who needs a copy of a bill of ${h.money(h.P.ca.itc_tiers[1], 'CA')} or more for tax purposes asks the establishment for the copy produced by that system. A PDF made here does not replace it.</p>`;
  },
  related: ['invoice-generator-canada', 'gst-hst-invoice-requirements', 'gst-hst-pst-by-province', 'invoice-in-foreign-currency', 'credit-note-template'],
  sources: ['rq_invoices', 'rq_showing', 'rq_small', 'ca_itc_regs', 'ca_rates'],
});
