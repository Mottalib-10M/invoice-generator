import { definePage } from '../../lib/page-types';

type Calc = { total: number; reverseChargeVat: number; cisBase: number; cisDeduction: number; due: number; tax: number };
const job = (h: { calc: Function }, o: { rc?: boolean; cis?: number; registered?: boolean }) => (h.calc as (i: unknown) => Calc)({
  country: 'UK', region: 'ENG', registered: o.registered ?? true, reverseCharge: o.rc ?? true, cisRate: o.cis,
  lines: [{ desc: 'Labour', qty: 1, price: 2400, tax: 'standard' }, { desc: 'Materials', qty: 1, price: 860, tax: 'standard', materials: true }],
});

export default definePage({
  id: 'cis-invoice-template',
  path: '/templates/cis-invoice/',
  group: 'templates',
  kind: 'tool',
  order: 100,
  nav: 'CIS invoice (UK)',
  card: 'Labour and materials split, CIS deduction and reverse charge wording on one invoice.',
  title: 'CIS Invoice Template 2026: Reverse Charge and Deduction',
  description: 'Free CIS invoice template for UK subcontractors, 2026: labour and materials split, 20% or 30% deduction on labour and the domestic reverse charge wording.',
  h1: 'CIS invoice template for subcontractors',
  intro: 'A construction subcontractor\'s invoice has to do two jobs at once: show the labour the CIS deduction applies to, and handle VAT under the reverse charge.',
  tool: { country: 'UK', preset: 'cis' },
  resume: (h) => {
    const r = job(h, { cis: h.P.uk.cis.registered });
    return `A subcontractor in the Construction Industry Scheme invoices a contractor who will keep part of the payment, ${h.pct(h.P.uk.cis.registered)} if you are registered for CIS, ${h.pct(h.P.uk.cis.unregistered)} if you are not, nothing if you hold gross payment status, and pass it to HMRC as an advance on your tax and National Insurance. The contractor works that deduction out from your invoice: the gross amount, less VAT and less the materials you paid for yourself. So a CIS invoice has to separate labour from materials, line by line. If you are VAT-registered and the contractor is too, the domestic reverse charge usually applies to construction services: you state the VAT but do not add it, with wording such as "${h.P.uk.reverse_charge_wordings[2]}". This template starts from an electrician's first fix on a new build: ${h.money(2400, 'UK')} of labour and ${h.money(860, 'UK')} of materials. The invoice totals ${h.money(r.total, 'UK')}, VAT of ${h.money(r.reverseChargeVat, 'UK')} is left for the contractor to account for, the CIS deduction is ${h.money(r.cisDeduction, 'UK')} on the labour, and ${h.money(r.due, 'UK')} is what lands in your account.`;
  },
  faqs: (h) => [
    { q: 'Should a CIS invoice show the gross amount or the amount after the deduction?', a: 'Show the gross amount for the work and materials, then the CIS deduction as a separate line and the balance you expect to receive. The contractor calculates the deduction itself from the figures HMRC gives when it verifies you, so your gross figures and your labour and materials split must be clear. The template prints all three.' },
    { q: 'When does the contractor send the CIS payment and deduction statement?', a: 'GOV.UK says a contractor that makes deductions must give the subcontractor a payment and deduction statement within 14 days of the end of each tax month. For the tax month running from 6 May to 5 June, the statement is due by 19 June. Keep these statements: they prove the deductions counted towards your tax bill.' },
    { q: 'Does a CIS invoice need a VAT number if I am not VAT-registered?', a: 'No. If you are not VAT-registered you charge no VAT, show no VAT number and the reverse charge does not concern you; the invoice only needs the labour and materials split for the CIS deduction. In the template, switch "VAT-registered?" to No and keep the CIS deduction selected.' },
    { q: 'Can I put labour and materials on separate invoices to avoid the reverse charge?', a: 'No. HMRC says charges for labour, and the materials supplied with it, should not be separated to avoid the reverse charge, and on a single supply and fix order the reverse charge applies to the full value even if separate invoices are issued. Materials stay out of the CIS deduction, but not out of the reverse charge.' },
  ],
  body: (h) => {
    const g = job(h, { cis: h.P.uk.cis.registered }), u = job(h, { cis: h.P.uk.cis.unregistered }), z = job(h, { cis: h.P.uk.cis.gross }), nv = job(h, { cis: h.P.uk.cis.registered, rc: false, registered: false });
    return `
<h2>The same job under each CIS status</h2>
<p>The deduction rate is set by HMRC when the contractor verifies you, not by you. The template lets you pick it so that the balance on your invoice matches what you will receive.</p>
${h.table(['CIS status', 'Deduction rate', 'Deducted on labour', 'You receive'], [
  ['Registered (net payment status)', h.pct(h.P.uk.cis.registered), h.money(g.cisDeduction, 'UK', 2), h.money(g.due, 'UK', 2)],
  ['Not registered', h.pct(h.P.uk.cis.unregistered), h.money(u.cisDeduction, 'UK', 2), h.money(u.due, 'UK', 2)],
  ['Gross payment status', h.pct(h.P.uk.cis.gross), h.money(z.cisDeduction, 'UK', 2), h.money(z.due, 'UK', 2)],
  ['Not VAT-registered, registered for CIS', h.pct(h.P.uk.cis.registered), h.money(nv.cisDeduction, 'UK', 2), h.money(nv.due, 'UK', 2)],
], 'Labour £2,400 and materials £860, VAT under the reverse charge where VAT-registered (generator engine)', ['l', 'r', 'r', 'r'])}
<p>Being registered for CIS cuts the deduction from ${h.pct(h.P.uk.cis.unregistered)} to ${h.pct(h.P.uk.cis.registered)}: on this one invoice that is ${h.money(u.cisDeduction - g.cisDeduction, 'UK', 2)} more in your pocket now rather than at the end of the tax year.</p>
<h2>What goes on each line</h2>
<p>Write labour and materials as separate lines and tick "Materials" on the materials. GOV.UK lists what the contractor takes away from the gross before applying the rate: VAT, materials you paid for directly, consumable stores that are now unusable, fuel used other than for travelling, plant hired for the job, and manufacturing or prefabricating materials. Put plant hire and consumables on their own lines too, marked as materials, so the contractor can see them. Keep receipts: the contractor may ask for evidence of what you paid for materials, and without it can estimate the cost itself.</p>
<h2>When the reverse charge applies</h2>
<p>The domestic reverse charge covers most building and construction services supplied between businesses that are both registered for VAT and where the supply is reported under CIS. It does not apply to a homeowner or any customer outside CIS and VAT, nor when the customer has notified you in writing that it is an end user or an intermediary supplier, nor to supplies of workers by employment businesses. When it applies, the invoice must still be a full VAT invoice, must say that the reverse charge applies and that the customer accounts for the VAT, and must show the amount of VAT due without adding it to the total. The ${h.a('reverse-charge-invoice', 'reverse charge guide')} goes through the end user and 5% disregard rules in detail.</p>
<h2>A checklist before you send it</h2>
<ul>
<li>your name or company name and address, matching the details the contractor used to verify you with HMRC;</li>
<li>your VAT number and the reverse charge wording, if both of you are VAT-registered and the customer is not an end user;</li>
<li>a sequential invoice number, the date and the site or plot reference;</li>
<li>labour and materials on separate lines, with the deduction and the balance shown under the total.</li>
</ul>
<p>The ${h.a('cis-deduction', 'CIS deduction guide')} explains how the deductions count against your tax bill and how to reclaim an overpayment.</p>`;
  },
  related: ['cis-deduction', 'reverse-charge-invoice', 'vat-invoice-generator-uk', 'vat-invoice-requirements', 'contractor-invoice-template'],
  sources: ['uk_cis', 'uk_reverse_charge', 'uk_reverse_charge_scope', 'uk_vat_records'],
});
