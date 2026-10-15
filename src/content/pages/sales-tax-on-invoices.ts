import { definePage } from '../../lib/page-types';
import { US_STATES, US_RETRIEVED } from '../../lib/engine/params';

const taxed = US_STATES.filter((s) => s.hasStateTax);
const none = US_STATES.filter((s) => !s.hasStateTax);
const withLocal = US_STATES.filter((s) => s.local);
const noLocal = taxed.filter((s) => !s.local);

export default definePage({
  id: 'sales-tax-on-invoices',
  path: '/guides/sales-tax-on-invoices/',
  group: 'guides',
  kind: 'guide',
  order: 130,
  nav: 'Sales tax on invoices (US)',
  card: 'The sales tax line on a US invoice: state rate, local rate, taxable lines, exemption certificates, with all 51 official sources.',
  title: 'Sales Tax on Invoices 2026: State Rates and Local Add-ons',
  description: 'Sales tax on a US invoice in 2026: the general rate of all 51 jurisdictions with each official source, how to add the local rate and tax only the taxable lines.',
  h1: 'Sales tax on invoices, state by state',
  intro: 'The rate you print is the state rate plus the local rate where the customer takes delivery, applied only to what that state taxes.',
  mini: 'usSalesTax',
  resume: (h) => {
    const lo = [...taxed].sort((a, b) => a.rate - b.rate)[0];
    const hi = [...taxed].sort((a, b) => b.rate - a.rate)[0];
    const tx = h.calc({ country: 'US', region: 'TX', registered: true, localRate: 2, lines: [{ desc: 'a', qty: 1, price: 1500, tax: 'taxable' }] });
    return `On a US invoice, sales tax is a line you add only if you hold a permit to collect it in the state where the sale is taxed, and the amount on that line is built from two parts. The first is the general state rate, which ranges from ${h.pct(lo.rate / 100)} in ${lo.name} to ${h.pct(hi.rate / 100, 2)} in ${hi.name} among the ${taxed.length} jurisdictions that have one; ${none.map((s) => s.name).join(', ')} have none. The second is the local rate of cities, counties and special districts, allowed in ${withLocal.length} jurisdictions and set by the delivery address, which is why it cannot be printed in a national table. A ${h.money(1500, 'US')} taxable sale delivered in a Texas city with a ${h.pct(0.02)} local rate carries ${h.money(tx.tax, 'US', 2)} of tax at ${h.pct(0.0825, 2)}. The table on this page gives each state's rate with a link to the revenue department or statute it was read from, and the calculator above adds your local rate to it.`;
  },
  faqs: (h) => [
    { q: 'Should the sales tax rate be printed on a US invoice or only the amount?', a: 'Print both. The amount is what the customer pays, but the rate is what lets the customer, its accounts payable team or an auditor check that the right jurisdiction was used. The generator writes a line such as "Sales tax TX 8.25% incl. 2% local on $340.00", so the taxable base, the combined rate and the local part are all visible at a glance.' },
    { q: 'How do I invoice a customer who gives me a resale or exemption certificate?', a: 'Issue the invoice without sales tax on the lines the certificate covers, by marking them "not taxable" in the generator, and keep the certificate in your records with a copy of the invoice. The certificate is what justifies the missing tax if the state audits you, so check it is complete and valid in the state of delivery before relying on it.' },
    { q: 'Is the sales tax on a Virginia invoice 4.3% or 5.3%?', a: `Usually ${h.pct(0.053, 1)}. Virginia's state rate is ${h.pct(h.us('VA').rate / 100, 1)}, but its tax department states that a 1% local tax applies everywhere in the state, so the general rate is never below ${h.pct(0.053, 1)}, and some regions add more. In the generator, choose Virginia and type at least 1% as the local rate.` },
    { q: 'Does an Alaska invoice ever carry sales tax?', a: 'It can. Alaska has no state sales tax, but it allows local governments to levy their own, so an invoice for a sale in a borough or city that has one carries that local tax. In the generator, choose Alaska, leave the state rate at zero, which it already is, and type the local rate of the place of delivery.' },
    { q: 'Should shipping be taxed on a US sales tax invoice?', a: 'It depends on the state, and sometimes on how the delivery charge is stated and who carries the goods. Read your state revenue department\'s guidance on delivery charges. The generator applies the tax to shipping by default when sales tax is on; if your state exempts separately stated delivery, leave the shipping field empty and add delivery as a line marked "not taxable".' },
    { q: 'How do I correct the sales tax on an invoice I already sent?', a: 'Issue a credit memo for the original invoice and a new invoice with the right rate, rather than editing and resending the same number. Both documents keep the audit trail clear: the credit memo cancels the tax you overcharged or undercharged, and the new invoice shows the correct state and local rate. The generator\'s credit note option prints "Credit memo" for the US.' },
  ],
  body: (h) => {
    const rows = US_STATES.map((s) => [
      s.name,
      s.hasStateTax ? h.pct(s.rate / 100) : 'none',
      s.local ? (s.minLocal ? `yes, at least ${h.pct(s.minLocal / 100)}` : 'yes') : 'no',
      `<a href="${s.url}" target="_blank" rel="nofollow noopener noreferrer">revenue page</a>`,
      s.lookup ? `<a href="${s.lookup}" target="_blank" rel="nofollow noopener noreferrer">rate lookup</a>` : '',
    ]);
    const mixed = h.calc({ country: 'US', region: 'NC', registered: true, localRate: 2.25, lines: [{ desc: 'Installation labor', qty: 6, price: 85, tax: 'exempt' }, { desc: 'Ceiling fan', qty: 2, price: 249, tax: 'taxable' }] });
    const dep = h.calc({ country: 'US', region: 'WA', registered: true, localRate: 3.6, paid: 500, lines: [{ desc: 'Custom shelving', qty: 1, price: 2400, tax: 'taxable' }] });
    return `
<h2>The two numbers that make the rate</h2>
<p>A sales tax line has a state part and a local part. The state part is fixed by state law and is the same everywhere in the state; it is what the table below lists. The local part is the sum of the city, county, transit or special district taxes at the place where the customer takes delivery. Two customers in the same city can sit in different districts, so states publish address-based lookup tools, linked in the table where the state has one. ${noLocal.length} of the taxing states do not allow local sales taxes at all, which makes their invoices the simplest: the state rate is the whole rate.</p>
<p>The generator keeps the two apart on purpose. You choose the state, the state rate fills itself in, and you type the local rate you found for the delivery address. The printed line then shows the combined rate and how much of it is local.</p>

<h2>Only the taxable lines</h2>
<p>Sales tax falls on what the state taxes, not on everything you bill. A typical invoice from a contractor or a retailer that also installs mixes taxable goods with labor or services that the state may not tax. With the generator, each line is either "taxable" or "not taxable", and the tax is computed on the taxable lines only. A North Carolina electrician who bills six hours of installation at ${h.money(85, 'US')} and two ceiling fans at ${h.money(249, 'US')}, with installation treated as not taxable in this example and a ${h.pct(0.0225, 2)} local rate, charges ${h.money(mixed.tax, 'US', 2)} of tax on the fans only, for a total of ${h.money(mixed.total, 'US', 2)}. Whether a given service is taxable is a question for your state revenue department; the invoice simply has to reflect its answer line by line.</p>
<!--mini:h_usTaxableSplit-->

<h2>Out-of-state customers</h2>
<p>A sale to a customer in another state is normally taxed where the customer receives it, and you only add that state's tax if you are required to collect there. Since the Supreme Court's decision in ${h.src('us_wayfair', 'South Dakota v. Wayfair')} in 2018, states may require sellers with no physical presence to collect once their sales into the state pass the state's own threshold. Each state sets that threshold, so check the destination state's revenue department before you start charging, or stop charging, its tax. If you are not registered there, invoice without that state's tax; the buyer may owe use tax on its side.</p>

<h2>Exemption and resale certificates</h2>
<p>Businesses that buy goods to resell, and some organizations, give their suppliers a certificate so they are not charged sales tax. On the invoice this looks like any other invoice with the covered lines marked "not taxable". The work is in the file, not on the page: keep the certificate, check that it covers the state of delivery and the type of goods, and link it to the customer so the next invoice is also right.</p>

<h2>Deposits, credits and rounding</h2>
<p>When a customer has paid a deposit, the tax is still computed on the full taxable price of the invoice and the deposit is deducted from the total. On a ${h.money(2400, 'US')} order of custom shelving in Washington with a ${h.pct(0.036, 1)} local rate and ${h.money(500, 'US')} paid up front, the invoice shows ${h.money(dep.tax, 'US', 2)} of tax and a balance due of ${h.money(dep.due, 'US', 2)}; the ${h.a('deposit-invoice', 'deposit invoice guide')} covers billing the deposit itself. To correct a rate after sending, issue a credit memo and a new invoice. The generator rounds the tax to the nearest cent on the invoice total for the taxable lines.</p>

<h2>All 51 jurisdictions and their sources</h2>
<p>Each general rate below was read on the page of the state's revenue department or in its statute; the scheduled check of ${h.date(US_RETRIEVED, 'US')} found ${US_STATES.filter((s) => s.status === 'verified').length} of them automatically on that page, and the methodology page lists the result for every state. Reduced rates on food or other goods, and special taxes on lodging, vehicles or meals, are not in this table: an invoice for those needs the specific rate from the state.</p>
${h.table(['State', 'General state rate', 'Local taxes', 'Official source', 'Local rate lookup'], rows, `General state sales tax rates used by the generator, checked on ${h.date(US_RETRIEVED, 'US')}`, ['l', 'r', 'l', 'l', 'l'])}
<p>For the full generator with these rates built in, use the ${h.a('invoice-generator-usa', 'US invoice generator')}; contractors who split labor and materials can start from the ${h.a('contractor-invoice-template', 'contractor invoice template')}.</p>`;
  },
  related: ['invoice-generator-usa', 'contractor-invoice-template', 'deposit-invoice', 'credit-note-template', 'estimate-template'],
  sources: ['us_states', 'us_wayfair', 'irs_w9'],
});
