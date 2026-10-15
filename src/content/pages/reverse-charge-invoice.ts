import { definePage } from '../../lib/page-types';

export default definePage({
  id: 'reverse-charge-invoice',
  path: '/guides/reverse-charge-invoice/',
  group: 'guides',
  kind: 'guide',
  order: 70,
  nav: 'Reverse charge invoice',
  card: 'Construction services under s55A: VAT stated, not charged, with HMRC wording.',
  title: 'Reverse Charge Invoice 2026: UK Construction VAT Wording',
  description: 'Reverse charge invoice for UK construction services in 2026: VAT stated but not charged, HMRC wording such as \'Customer to pay the VAT to HMRC\', 5% disregard.',
  h1: 'Reverse charge invoices for building and construction services',
  intro: 'Enter the value of the works: see what you invoice, what VAT your customer pays to HMRC, and the wording to print.',
  mini: 'reverseCharge',
  resume: (h) => {
    const r = h.calc({ country: 'UK', region: '', registered: true, reverseCharge: true, lines: [{ desc: 'x', qty: 1, price: 6500, tax: 'standard' }] });
    return `Since 1 March 2021, most building and construction services supplied between VAT-registered businesses that report under the Construction Industry Scheme fall under the VAT domestic reverse charge: the subcontractor does not add VAT to the invoice, and the contractor who receives the service accounts for it directly to HMRC. The invoice still has to carry every detail of a normal VAT invoice, plus a note that the reverse charge applies and that the customer must account for the VAT, and it should state how much VAT is due or, if that cannot be shown, the rate. HMRC accepts wordings such as "VAT Act 1994 Section 55A applies", "S55A VATA 94 applies" or "Customer to pay the VAT to HMRC". On works of ${h.money(6500, 'UK')} at the standard rate, you invoice ${h.money(r.total, 'UK')}, and your customer accounts for ${h.money(r.reverseChargeVat, 'UK')} of VAT on its own return. The charge does not apply to end users, to employment businesses supplying workers, or to services outside the CIS list.`;
  },
  faqs: (h) => [
    { q: 'Which wording must a UK reverse charge invoice show?', a: `The VAT Regulations 1995 require the reference "reverse charge". HMRC's technical guide gives three wordings that meet the requirement: "${h.P.uk.reverse_charge_wordings[0]}", "${h.P.uk.reverse_charge_wordings[1]}" and "${h.P.uk.reverse_charge_wordings[2]}". The generator prints the last one with the first, so both the customer and an inspector see it at a glance.` },
    { q: 'Does the reverse charge apply when I build for a homeowner?', a: 'No. A private homeowner is not VAT-registered and does not report under the Construction Industry Scheme, so the normal VAT rules apply and you charge VAT on the invoice. HMRC also says that where sales are clearly set up for domestic consumers, you do not need to check the customer\'s VAT or CIS status.' },
    { q: 'What is an end user for the construction reverse charge?', a: 'A VAT and CIS registered business that buys construction services but does not make onward supplies of them, such as a company having its own offices refurbished, or an intermediary connected to it. It must tell you in writing; HMRC suggests wording for that notice. You then issue a normal VAT invoice with VAT charged at the appropriate rate.' },
    { q: 'Does the reverse charge cover materials on a supply and fix job?', a: 'Yes. When goods are supplied with construction services, it is a single supply for VAT, and the reverse charge applies to the full value of the invoice. Splitting the labour and the materials into separate invoices does not change that for a single supply and fix order. The CIS deduction, by contrast, still applies to labour only.' },
    { q: 'What is the 5% disregard in the construction reverse charge?', a: 'If the reverse charge services are 5% or less of the value of a single supply, the parties can agree from the start of the contract to disregard them and apply normal VAT. The test uses the overall contract values, never invoice by invoice, and HMRC gives the example of a staircase built off site whose installation is a small share of the price.' },
  ],
  body: (h) => {
    const cases = [1200, 6500, 48000].map((v) => ({ v, rc: h.calc({ country: 'UK', region: '', registered: true, reverseCharge: true, lines: [{ desc: 'x', qty: 1, price: v, tax: 'standard' }] }), n: h.calc({ country: 'UK', region: '', registered: true, lines: [{ desc: 'x', qty: 1, price: v, tax: 'standard' }] }) }));
    const cis = h.calc({ country: 'UK', region: '', registered: true, reverseCharge: true, cisRate: h.P.uk.cis.registered, lines: [{ desc: 'Labour', qty: 1, price: 2400, tax: 'standard' }, { desc: 'Materials', qty: 1, price: 860, tax: 'standard', materials: true }] });
    return `
<h2>When the reverse charge applies</h2>
<p>${h.src('uk_reverse_charge_scope', 'HMRC\'s scope guidance')} lists the conditions. The supply must be a standard or reduced-rated construction service, the customer and the supplier must both be registered for VAT in the UK, and the payment must be reported within the Construction Industry Scheme. The services are the same "construction operations" as in the CIS: building, altering, repairing, extending or demolishing buildings and structures, installing heating, lighting, drainage, power or fire protection systems, painting and decorating, internal cleaning during construction, and preparatory work such as site clearance, excavation, foundations and scaffolding.</p>
<p>The guide also lists what stays outside when supplied on its own: the professional work of architects, surveyors and consultants, manufacturing or delivering materials and components, installing security systems, seating, blinds and shutters, signwriting, and artistic works. For those, the normal VAT rules apply and VAT goes on the invoice as usual.</p>
<h2>What changes on the invoice</h2>
<p>The ${h.src('uk_reverse_charge', 'technical guide')} asks suppliers to show all the information required on a VAT invoice, to make a note that the reverse charge applies and that the customer accounts for the VAT, and to state how much VAT is due under the reverse charge, without including it in the amount charged. If your software cannot show the amount, you must add "customer to account to HMRC" and make sure the customer can identify the reverse charge services.</p>
${h.table(['Works before VAT', 'Invoice total (reverse charge)', 'VAT stated, paid by customer', 'Total if VAT were charged'], cases.map((c) => [h.money(c.v, 'UK'), h.money(c.rc.total, 'UK', 2), h.money(c.rc.reverseChargeVat, 'UK', 2), h.money(c.n.total, 'UK', 2)]), 'Standard-rated works, computed by the engine', ['r', 'r', 'r', 'r'])}
<p>The amount the customer pays you is the net figure. That is the reason HMRC warns subcontractors about cash flow: the VAT you used to receive with each payment no longer comes in, so a business that relied on it to bridge the gap to its VAT return now has less money in hand.</p>
<h2>How the generator builds a reverse charge invoice</h2>
<p>Choose the United Kingdom, keep "VAT-registered" on Yes and switch "Domestic reverse charge" to Yes. Each line keeps its rate, so the preview shows the VAT band and its amount marked "reverse charge", the line "VAT to be accounted for by the customer", and a total without VAT. The statement "Reverse charge: customer to pay the VAT to HMRC. VAT Act 1994 Section 55A applies." is printed under the totals. The ${h.a('cis-invoice-template', 'CIS invoice template')} opens the generator with these settings and a labour and materials split.</p>
<h2>Reverse charge and CIS on the same invoice</h2>
<p>The two mechanisms often meet. The reverse charge decides the VAT; the ${h.a('cis-deduction', 'CIS deduction')} decides how much of the invoice the contractor withholds for HMRC on account of your tax. They use different bases: the reverse charge covers the whole supply, materials included, while the CIS deduction applies only to labour, after VAT and the materials you bought are taken out.</p>
${h.table(['Line', 'Amount'], [
  ['Labour', h.money(2400, 'UK')],
  ['Materials', h.money(860, 'UK')],
  ['Invoice total, no VAT added', h.money(cis.total, 'UK', 2)],
  ['VAT the contractor accounts for', h.money(cis.reverseChargeVat, 'UK', 2)],
  [`CIS deduction at ${h.pct(h.P.uk.cis.registered)} on labour`, h.money(cis.cisDeduction, 'UK', 2)],
  ['Paid to the subcontractor', h.money(cis.due, 'UK', 2)],
], 'Electrical subcontract with both mechanisms, computed by the engine', ['l', 'r'])}
<h2>Customers who are end users or intermediaries</h2>
<p>A customer that receives construction services but does not sell them on, such as a retailer having a new shopfront installed, is an end user. If it notifies you in writing, you issue a normal VAT invoice and charge VAT. HMRC proposes this text for the notice: "We are an end user for the purposes of section 55A VAT Act 1994 reverse charge for building and construction services. Issue us with a normal VAT invoice, with VAT charged at the appropriate rate. We will not account for the reverse charge." You can also state in your terms that you will assume the customer is an end user or intermediary supplier unless it says otherwise.</p>
<h2>Changes during a contract</h2>
<p>If a customer's status changes mid-contract, it must tell you, and the new treatment applies from the change. When the change falls inside an invoice period, you can switch the whole period or wait until the next invoice. Tax points matter too: VAT is due when the invoice is issued or payment received, whichever is earlier.</p>
<h2>Mistakes HMRC looks for</h2>
<p>Charging VAT under the reverse charge leaves the customer unable to reclaim it and you liable for the amount shown. Omitting the wording turns the document into a normal VAT invoice in appearance. Splitting a single supply and fix order to keep materials outside the reverse charge does not work for VAT. Before issuing, ask the customer for its VAT and CIS status, keep its end user notice if there is one, and check that the invoice shows the VAT amount, the rate and one of the accepted wordings. The general list of invoice details is in the ${h.a('vat-invoice-requirements', 'VAT invoice requirements guide')}.</p>`;
  },
  related: ['cis-invoice-template', 'cis-deduction', 'vat-invoice-requirements', 'vat-invoice-generator-uk', 'deposit-invoice'],
  sources: ['uk_reverse_charge', 'uk_reverse_charge_scope', 'uk_cis', 'uk_vat_records'],
});
