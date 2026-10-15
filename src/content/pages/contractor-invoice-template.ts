import { definePage } from '../../lib/page-types';

export default definePage({
  id: 'contractor-invoice-template',
  path: '/templates/contractor-invoice/',
  group: 'templates',
  kind: 'tool',
  order: 20,
  nav: 'Contractor invoice',
  card: 'Labor and materials on separate lines, progress billing, retainage and CIS where it applies.',
  title: 'Contractor Invoice Template 2026: Labor, Materials and Tax',
  description: 'Free contractor invoice template for 2026: labor and materials on separate lines, sales tax per line, UK CIS and reverse charge, deposit deducted, private PDF.',
  h1: 'Contractor invoice template: labor, materials and the tax on each',
  intro: 'Bill the hours and the materials apart, mark which lines are taxable, and deduct what the customer already paid.',
  tool: { country: 'US', preset: 'contractor' },
  resume: (h) => {
    const r = h.calc({ country: 'US', region: 'TX', registered: true, lines: [{ desc: 'Labor', qty: 38, price: 65, tax: 'exempt' }, { desc: 'Materials', qty: 1, price: 2140, tax: 'exempt' }] });
    const uk = h.calc({ country: 'UK', region: '', registered: true, reverseCharge: true, cisRate: h.P.uk.cis.registered, lines: [{ desc: 'Labour', qty: 38, price: 65, tax: 'standard' }, { desc: 'Materials', qty: 1, price: 2140, tax: 'standard', materials: true }] });
    return `A contractor's invoice has one habit that sets it apart from a freelancer's: labor and materials are billed on separate lines, because they are often taxed differently, priced differently and, in the UK construction industry, treated differently for deductions. This template opens on a kitchen remodel phase: 38 hours of labor at ${h.money(65, 'US')} and ${h.money(2140, 'US')} of cabinets and fixtures, ${h.money(r.total, 'US')} before any tax. In the United States each state decides whether installation labor, materials or both are taxable, so each line carries its own taxable switch and the state and local rate apply only where you turn it on. In the UK the same job invoiced to a building contractor under the Construction Industry Scheme loses ${h.money(uk.cisDeduction, 'UK')} of CIS deduction at ${h.pct(h.P.uk.cis.registered)}, taken on the labor only, and carries no VAT in the total because the domestic reverse charge moves it to the customer. A deposit already received is subtracted at the bottom so the balance due is the figure the customer pays.`;
  },
  faqs: (h) => [
    { q: 'Why should a contractor invoice separate labor from materials?', a: 'Because the two are often treated differently. US states tax materials and installation labor according to their own rules, so separate lines let the sales tax fall only on the taxable part. In the UK, the CIS deduction is taken on labor only, after materials the subcontractor paid for are taken out. A separate materials line also lets the customer check your markup against receipts.' },
    { q: 'How do I show retainage on a contractor invoice?', a: 'Invoice the full value of the work completed, then show the amount held back as a separate note or deduction, as your contract describes it. The generator\'s "Deposit paid" field reduces the balance due, and the notes box can state the retainage percentage and when it will be released. Keep the retained amount visible so the final invoice can claim it.' },
    { q: 'Can a contractor bill a job in stages?', a: `Yes, with one invoice per stage, each with its own number and the work completed in that period. Describe the stage precisely ("phase 2: cabinets installed, plumbing connected") and refer to the contract. In the UK, VAT and any CIS deduction apply to each stage invoice, and a deduction statement from the contractor should follow each payment at ${h.pct(h.P.uk.cis.registered)} or ${h.pct(h.P.uk.cis.unregistered)}.` },
    { q: 'What changes on a contractor invoice for a homeowner in the UK?', a: 'The domestic reverse charge does not apply when the customer is the end user, such as a homeowner having work done on their own house, so you charge VAT in the normal way if you are registered. CIS deductions are made by contractors, meaning construction businesses or bodies spending more than £3 million on construction in 12 months, so a homeowner makes none. Leave the reverse charge switch on No and the CIS selector on "No CIS".' },
  ],
  body: (h) => {
    const cis = h.calc({ country: 'UK', region: '', registered: true, reverseCharge: true, cisRate: h.P.uk.cis.registered, lines: [{ desc: 'Labour', qty: 38, price: 65, tax: 'standard' }, { desc: 'Materials', qty: 1, price: 2140, tax: 'standard', materials: true }] });
    const home = h.calc({ country: 'UK', region: '', registered: true, lines: [{ desc: 'Labour', qty: 38, price: 65, tax: 'standard' }, { desc: 'Materials', qty: 1, price: 2140, tax: 'standard' }] });
    return `
<h2>Writing the labor line</h2>
<p>Customers dispute labor more than materials, because they cannot see it on a receipt. Put the number of hours and the hourly rate on the line rather than a lump sum, name the phase or the room, and keep a daily log you can send if asked. Where two trades worked, one line per trade reads better than a blended rate. If you quote fixed prices instead, describe the milestone reached and leave the quantity at 1.</p>
<h2>Materials: cost, markup and tax</h2>
<p>List materials as one line per supplier order or per major item. Whether you show the markup separately is a commercial choice, but the materials line is the one a careful customer checks against the supplier's receipt. In the US, a contractor who buys materials tax-paid and installs them may be treated as the final consumer in some states and as a reseller in others; the per-line taxable switch lets you follow whichever your state applies, and the state's revenue department is the place to confirm it.</p>
<h2>The UK construction case</h2>
<p>A subcontractor working for a building contractor in the UK usually invoices under two rules at once. The domestic reverse charge means no VAT is added to the total; the invoice states the VAT the customer accounts for and carries the wording HMRC lists. The Construction Industry Scheme means the contractor pays you less than the invoice total and sends the difference to HMRC as an advance on your tax. Only a contractor in the sense of the scheme deducts: a business whose trade is construction, or one that has spent more than £3 million on construction in 12 months, as <a href="https://www.gov.uk/what-you-must-do-as-a-cis-contractor/who-is-covered-by-cis" rel="nofollow noopener" target="_blank">GOV.UK's page on who is covered by CIS</a> sets out.</p>
${h.table(['Same job, UK', 'VAT added', 'CIS deducted', 'Customer pays you'], [
  ['Building contractor, CIS and reverse charge', h.money(cis.tax, 'UK', 2), h.money(cis.cisDeduction, 'UK', 2), h.money(cis.due, 'UK', 2)],
  ['Homeowner, VAT-registered contractor', h.money(home.tax, 'UK', 2), h.money(0, 'UK', 2), h.money(home.total, 'UK', 2)],
], `38 hours at ${h.money(65, 'UK')} and ${h.money(2140, 'UK')} of materials, computed by the engine`, ['l', 'r', 'r', 'r'])}
<p>The ${h.a('cis-invoice-template', 'CIS invoice template')} opens with both rules already set, and the ${h.a('cis-deduction', 'CIS deduction guide')} explains the 20%, 30% and gross payment rates. The scope of the reverse charge, including the end-user exception, is in the ${h.a('reverse-charge-invoice', 'reverse charge guide')}.</p>
<h2>Deposits and final invoices</h2>
<p>For jobs that start with a deposit, invoice the deposit first, then on the final invoice enter what was received in "Deposit paid": the generator prints the full total, the payment already made and the balance due, so the two documents reconcile. The ${h.a('deposit-invoice', 'deposit invoice guide')} shows the tax on each part.</p>`;
  },
  related: ['cis-invoice-template', 'cis-deduction', 'reverse-charge-invoice', 'deposit-invoice', 'estimate-template'],
  sources: ['uk_cis', 'uk_reverse_charge', 'uk_reverse_charge_scope', 'us_states'],
});
