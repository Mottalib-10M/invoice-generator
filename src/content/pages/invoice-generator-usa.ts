import { definePage } from '../../lib/page-types';
import { US_STATES } from '../../lib/engine/params';

const noTax = US_STATES.filter((s) => !s.hasStateTax);
const local = US_STATES.filter((s) => s.local);
const top = [...US_STATES].sort((a, b) => b.rate - a.rate).slice(0, 5);

export default definePage({
  id: 'invoice-generator-usa',
  path: '/invoice-generator-usa/',
  group: 'countries',
  kind: 'tool',
  order: 10,
  nav: 'US invoice generator',
  card: 'Sales tax by state on each taxable line, Letter-size PDF, US date style.',
  title: 'Invoice Generator USA 2026: Free, with Sales Tax by State',
  description: 'Free US invoice generator with each state\'s 2026 sales tax rate plus your local rate on taxable lines only, Letter-size PDF, no sign-up and nothing uploaded.',
  h1: 'Invoice generator for the US, with sales tax by state',
  intro: 'Pick the state where your customer takes delivery, add the local rate, and mark which lines are taxable.',
  tool: { country: 'US', preset: 'standard' },
  resume: (h) => `In the United States there is no federal invoice law and no federal sales tax, so what makes a US invoice right is the sales tax line: the general rate of the state, plus the city, county or district rate of the place where the customer receives the goods, applied only to what that state taxes. This generator holds the general rate of all ${US_STATES.length} jurisdictions, from ${h.pct(Math.min(...US_STATES.filter((s) => s.hasStateTax).map((s) => s.rate)) / 100)} in ${US_STATES.filter((s) => s.hasStateTax).sort((a, b) => a.rate - b.rate)[0].name} to ${h.pct(top[0].rate / 100, 2)} in ${top[0].name}, each read on the state's own revenue page; ${noTax.map((s) => s.name).join(', ')} have no state sales tax. You add the local rate, because it depends on the street address and ${local.length} jurisdictions allow one. Each line can be taxable or not: a Texas designer billing a ${h.money(1800, 'US')} logo and four ${h.money(85, 'US')} printed boards puts tax only on the boards, ${h.money(h.calc({ country: 'US', region: 'TX', registered: true, localRate: 2, lines: [{ desc: 'a', qty: 1, price: 1800, tax: 'exempt' }, { desc: 'b', qty: 4, price: 85, tax: 'taxable' }] }).tax, 'US', 2)} at ${h.pct((h.us('TX').rate + 2) / 100, 2)} in Austin. The PDF comes out on Letter paper with US dates.`,
  faqs: (h) => [
    { q: 'Do I have to charge sales tax on a US invoice for services?', a: `Only if the state taxes that service. Many states tax goods but few services, and the list differs everywhere: Washington, for example, taxes IT consulting and website development since October 2025, Texas taxes data processing, and Hawaii's general excise tax reaches almost everything. Mark the service lines "not taxable" when your state does not tax them; the tax then falls only on the taxable goods.` },
    { q: 'Which state\'s sales tax goes on an invoice to another state?', a: 'Usually the destination state, where the customer receives the goods, and only if you have a sales tax obligation there. Since the Supreme Court\'s Wayfair decision in 2018, states can require remote sellers above their sales thresholds to collect. Below that, an out-of-state sale often carries no tax on your invoice, and the buyer may owe use tax instead.' },
    { q: 'Where do I find the local sales tax rate to add?', a: `From the state's own rate lookup, by address or ZIP+4. The rate is the sum of the city, county and special district taxes at the delivery address, so two customers in the same ZIP code can differ. The methodology page lists each state's official source. In Virginia a ${h.pct(0.01)} local tax applies everywhere, so the general rate is never below ${h.pct(0.053, 1)}.` },
    { q: 'Should my EIN or sales tax permit number be on my invoices?', a: 'No federal rule requires it, and many businesses leave the EIN off to limit exposure; customers who need it ask for a Form W-9 instead. Some buyers ask for your seller\'s permit number when they give you a resale certificate. The generator prints the number only if you fill in the field.' },
    { q: 'Can I invoice without sales tax if I do not have a seller\'s permit?', a: 'Yes, set "Charge sales tax?" to No. You must not collect a tax you are not registered to collect. If your sales should be taxable, get the permit from the state first: collecting tax without one, or failing to collect it when you should, are both problems the state can raise later.' },
    { q: 'Is a US invoice due in 30 days by law?', a: 'No. Outside government contracts, US law sets no default payment period for business invoices; the due date is whatever you agree. Net 30 is the most common choice, and the generator computes the due date from the terms you pick. A late fee needs to be agreed in your contract or terms before you can charge it.' },
  ],
  body: (h) => `
<h2>How the sales tax line is built</h2>
<p>The generator adds the state rate and the local rate you type, then applies the result to the lines you mark taxable. The tax is computed on the invoice total for those lines and rounded to the cent. Shipping is treated as taxable by default; set its line to zero if your state exempts separately stated delivery. The tax appears as one line, "Sales tax ${'TX'} 8.25% incl. 2% local" for example, so the customer sees the rate as well as the amount.</p>
${h.table(['State', 'State rate', 'Local taxes allowed'], top.map((s) => [s.name, h.pct(s.rate / 100, 3), s.local ? 'yes' : 'no']), 'The five highest state rates in the generator', ['l', 'r', 'l'])}
<p>A high state rate does not mean the highest bill: Louisiana and Alabama have moderate state rates but some of the highest combined rates once parishes and cities add theirs. That is why the local rate is a field of its own rather than an average.</p>
<h2>States with no state sales tax</h2>
<p>${noTax.map((s) => s.name).join(', ')} do not levy a general state sales tax. Alaska allows local sales taxes, so a seller in Juneau or Kenai can still owe one; choose Alaska and type the local rate. In the others, an invoice normally carries no sales tax at all, though Hawaii-style gross receipts taxes and lodging taxes are a different matter.</p>
<h2>What a US invoice should show</h2>
<p>With no federal format, a US invoice is judged by what your customer, your bank and your state auditor need: a unique number, your business name and address, the customer's name and billing address, the date, a description of each item with quantity and price, the sales tax as a separate line with its rate, the total and the due date or terms. The checklist beside the preview uses this list. If you sell to a customer who gives you a resale or exemption certificate, keep the certificate and invoice without tax.</p>
<h2>Contractors, consultants and freelancers</h2>
<p>A 1099 contractor's invoice is an ordinary invoice: no tax is withheld, and the client asks for your Form W-9 to report payments at year end. The ${h.a('contractor-invoice-template', 'contractor invoice template')} separates labor and materials, which matters in states that tax materials but not installation labor. Consultants and freelancers can start from the ${h.a('consulting-invoice-template', 'consulting template')} or the ${h.a('freelance-invoice-template', 'freelance template')}.</p>
<h2>The rate check behind the list</h2>
<p>Each state rate was read on the official page of the state's revenue department or in its statute, and a script re-reads those pages each week to confirm the rate still appears. The ${h.a('sales-tax-on-invoices', 'sales tax on invoices guide')} has the full table of states, and the methodology page lists every source with the result of its last check.</p>`,
  related: ['sales-tax-on-invoices', 'contractor-invoice-template', 'freelance-invoice-template', 'payment-terms', 'estimate-template'],
  sources: ['us_states', 'us_wayfair', 'irs_w9'],
});
