import { definePage } from '../../lib/page-types';

const labour = 2400, materials = 860;
const job = (rate: number, rc = true) => ({ country: 'UK' as const, region: '', registered: true, reverseCharge: rc, cisRate: rate, lines: [{ desc: 'Labour', qty: 1, price: labour, tax: 'standard' as const }, { desc: 'Materials', qty: 1, price: materials, tax: 'standard' as const, materials: true }] });

export default definePage({
  id: 'cis-deduction',
  path: '/guides/cis-deduction/',
  group: 'guides',
  kind: 'guide',
  order: 80,
  nav: 'CIS deduction',
  card: 'The 20%, 30% or 0% CIS deduction, worked out on labour only, and how it shows on the invoice.',
  title: 'CIS Deduction 2026: 20% or 30% on Labour, Never Materials',
  description: 'CIS deduction calculator for 2026: 20% registered, 30% unregistered, 0% gross status, taken from labour after VAT and materials, with the reverse charge.',
  h1: 'CIS deduction: what comes off a subcontractor invoice',
  intro: 'The contractor keeps back a share of the labour, never of the materials or the VAT, and pays it to HMRC for you.',
  mini: 'cisDeduction',
  resume: (h) => {
    const r = h.calc(job(h.P.uk.cis.registered));
    return `Under the Construction Industry Scheme, a contractor who pays a subcontractor for construction work deducts a percentage and pays it to HMRC as an advance on the subcontractor's tax and National Insurance: ${h.pct(h.P.uk.cis.registered)} for a registered subcontractor, ${h.pct(h.P.uk.cis.unregistered)} for one who has not registered, and ${h.pct(h.P.uk.cis.gross)} for one with gross payment status. The percentage is not taken from the whole invoice. GOV.UK tells the contractor to start from the gross amount and remove VAT, materials the subcontractor paid for directly, consumable stores, fuel other than for travelling and plant hired for the job, and only then apply the rate. On a ${h.money(labour + materials, 'UK')} invoice made of ${h.money(labour, 'UK')} of labour and ${h.money(materials, 'UK')} of materials, a registered subcontractor therefore loses ${h.money(r.cisDeduction, 'UK')}, not ${h.money((labour + materials) * h.P.uk.cis.registered, 'UK')}, and is paid ${h.money(r.due, 'UK')}. Showing labour and materials as separate lines on your invoice is what lets the contractor apply the deduction to the right figure.`;
  },
  faqs: (h) => [
    { q: 'Is the CIS deduction taken before or after VAT on a subcontractor invoice?', a: `After VAT is removed. GOV.UK lists VAT first among the amounts the contractor takes away from the gross invoice before applying the CIS rate. In practice most VAT-registered subcontractors now invoice under the domestic reverse charge, so no VAT is added in the first place, and the ${h.pct(h.P.uk.cis.registered)} applies to the labour figure alone.` },
    { q: 'Why did the contractor deduct 30% CIS instead of 20%?', a: `Because HMRC told the contractor you are not registered for CIS, or could not match your details when the contractor verified you. The rate the contractor must use is the one HMRC gives at verification: ${h.pct(h.P.uk.cis.registered)} if registered, ${h.pct(h.P.uk.cis.unregistered)} if not. Registering, and making sure the name and UTR you give match HMRC's records, brings the rate down on later payments.` },
    { q: 'Can a contractor take CIS off materials if I have no receipts?', a: 'No, but the materials figure may be estimated. GOV.UK says the contractor can ask for evidence, such as receipts, that you paid for the materials directly, and that without evidence the contractor estimates their cost. Listing materials on their own invoice line, and keeping the receipts, avoids an estimate that is lower than what you spent.' },
    { q: 'Do I get the CIS deduction back at the end of the tax year?', a: 'It is not lost. GOV.UK describes the deductions as advance payments towards your tax and National Insurance bill, so they are set against what you owe for the year rather than kept as a separate charge. Keep a record of every payment received and every amount deducted, job by job, because those figures feed your own tax calculation.' },
    { q: 'What is CIS gross payment status and how does it change my invoice?', a: `With gross payment status the contractor deducts nothing, ${h.pct(h.P.uk.cis.gross)}, and you settle your tax yourself. You have to apply to HMRC for it. Your invoice still separates labour and materials, because the contractor still reports the payment to HMRC each month, but the amount you receive is the full invoice total.` },
    { q: 'Does a CIS invoice also need the reverse charge wording?', a: `If you are VAT-registered and the work is reported within CIS, usually yes: the domestic reverse charge applies to most such services. The invoice then shows the VAT the customer must account for, adds none to the amount due, and carries wording such as "${h.P.uk.reverse_charge_wordings[2]}". Contractors who are end users, and supplies outside CIS, follow normal VAT rules instead.` },
  ],
  body: (h) => {
    const rows = [h.P.uk.cis.registered, h.P.uk.cis.unregistered, h.P.uk.cis.gross].map((rate) => {
      const r = h.calc(job(rate));
      return [h.pct(rate), h.money(r.cisBase, 'UK', 2), h.money(r.cisDeduction, 'UK', 2), h.money(r.reverseChargeVat, 'UK', 2), h.money(r.due, 'UK', 2)];
    });
    const noRc = h.calc(job(h.P.uk.cis.registered, false));
    return `
<h2>The order the contractor follows</h2>
<p>The rule comes from HMRC's guidance to contractors, and it is a sequence, not a single percentage. The contractor starts with the total of the subcontractor's invoice. From it they take away what the subcontractor paid for VAT, for consumable stores (equipment that is now unusable), for fuel other than travelling, for plant hired for the job, for manufacturing or prefabricating materials, and for materials, if the subcontractor bought them directly. What remains is the labour, and the CIS rate HMRC gave at verification applies to that figure only. ${h.src('uk_cis', 'GOV.UK sets the steps out here')}.</p>
<p>This is why an invoice that lumps everything into "Kitchen fit, all in" costs the subcontractor money. The contractor can ask for receipts for the materials, and if there is no evidence, estimates their cost. A separate materials line, with receipts kept, makes the deduction match reality.</p>
<h2>Worked example at each CIS rate</h2>
<p>The same job at each rate: ${h.money(labour, 'UK')} of labour and ${h.money(materials, 'UK')} of materials, invoiced by a VAT-registered electrician to a contractor under the domestic reverse charge. The figures come from the generator's own engine.</p>
${h.table(['CIS rate', 'Labour subject to CIS', 'Deduction', 'VAT the contractor accounts for', 'Paid to you'], rows, 'Labour 2,400 and materials 860, reverse charge at 20%', ['l', 'r', 'r', 'r', 'r'])}
<p>The VAT column does not move: the reverse charge and CIS work on different bases. VAT is computed on labour and materials together, because for VAT a supply and fix job is one supply; the CIS deduction looks at labour only. If the same subcontractor were not under the reverse charge, for example because the customer told them it is an end user, the invoice would add VAT of ${h.money(noRc.tax, 'UK', 2)}, the total would be ${h.money(noRc.total, 'UK', 2)}, and the CIS deduction would still be ${h.money(noRc.cisDeduction, 'UK', 2)}, leaving ${h.money(noRc.due, 'UK', 2)} to pay.</p>
<!--mini:reverseCharge-->
<h2>What the subcontractor's invoice should show</h2>
<p>There is no CIS-specific invoice form. What matters is that the contractor can see the split. A clear CIS invoice carries:</p>
<ul>
<li>your name or company name, address and, if registered, your VAT number;</li>
<li>the contractor's name and address, the site or plot, and the period of work;</li>
<li>labour on its own line or lines, priced as you agreed (days, hours or a fixed price);</li>
<li>materials you bought on separate lines, at cost or with your agreed mark-up;</li>
<li>the VAT treatment: normal VAT, or the reverse charge wording with the VAT amount stated but not added;</li>
<li>the CIS deduction you expect and the net amount, if you want the contractor to check it against the same figure.</li>
</ul>
<p>The last item is optional, and the contractor is not bound by your arithmetic: they apply the rate HMRC gave them. It helps both sides spot a mismatch early, such as a 30% verification when you believed you were registered. The ${h.a('cis-invoice-template', 'CIS invoice template')} sets the generator up this way, with a materials tick box on each line so the deduction falls on labour only.</p>
<h2>Who has to deduct</h2>
<p>A business must register as a CIS contractor if it pays subcontractors to do construction work. A business that does not do construction work becomes a contractor once it has spent more than £3 million on construction in the 12 months since its first payment. Before the first payment, the contractor must check whether the worker should be employed rather than subcontracted, verify the subcontractor with HMRC, and then deduct at the rate HMRC returns. Each month the contractor files a return to HMRC listing the payments and the deductions, and passes the money on.</p>
<h2>Labour, materials and a few grey areas</h2>
<h3>Plant hire with a driver</h3>
<p>Plant hired for the job is one of the amounts taken out before the rate applies. When you hire in a digger and pass the cost on, show it on its own line, so that it is not treated as your labour.</p>
<h3>Travel and fuel</h3>
<p>Fuel used on the job is taken out, but GOV.UK makes an exception for fuel used for travelling. Mileage to and from site is therefore usually part of the amount the rate applies to. Keeping it within the labour line, rather than presenting it as materials, avoids a later correction.</p>
<h3>Separate orders for materials</h3>
<p>For VAT, HMRC treats a supply and fix order as a single supply, even when it is split into two invoices. For CIS it looks at each order separately: a separate order purely for materials or for plant hire is not within the scheme at all. The two taxes can therefore treat the same paperwork differently, which is one more reason to describe each line precisely.</p>
<h2>When the deduction is wrong</h2>
<p>The figure that counts is the one the contractor records and reports in their monthly return, not the one on your invoice. If the deduction was taken from materials, or at the wrong rate, raise it with the contractor first: they correct it in their records. Whatever remains is reconciled on your tax return, since every pound deducted is an advance on your own tax and National Insurance.</p>
<p>For the rest of the reverse charge, including the end user notice and the 5% disregard, see the ${h.a('reverse-charge-invoice', 'reverse charge invoice guide')}.</p>`;
  },
  related: ['cis-invoice-template', 'reverse-charge-invoice', 'vat-invoice-requirements', 'vat-invoice-generator-uk', 'sole-trader-invoice-template'],
  sources: ['uk_cis', 'uk_reverse_charge', 'uk_reverse_charge_scope', 'uk_vat_records'],
});
