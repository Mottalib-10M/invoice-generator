import { definePage } from '../../lib/page-types';

export default definePage({
  id: 'consulting-invoice-template',
  path: '/templates/consulting-invoice/',
  group: 'templates',
  kind: 'tool',
  order: 30,
  nav: 'Consulting invoice',
  card: 'Day rates, deliverables and expenses, with the VAT rule on recharged costs and disbursements.',
  title: 'Consulting Invoice Template 2026: Day Rates, Expenses, Tax',
  description: 'Free consulting invoice template for 2026: day rate and deliverables, travel recharged with VAT, true disbursements kept outside it, Net 30 terms, private PDF.',
  h1: 'Consulting invoice template for day rates and deliverables',
  intro: 'Bill the days and the report, recharge expenses the right way for tax, and refer to the engagement letter.',
  tool: { country: 'US', preset: 'consulting' },
  resume: (h) => {
    const r = h.calc({ country: 'US', region: 'TX', registered: true, lines: [{ desc: 'Days', qty: 4, price: 1200, tax: 'exempt' }, { desc: 'Report', qty: 1, price: 2500, tax: 'exempt' }] });
    const uk = h.calc({ country: 'UK', region: '', registered: true, lines: [{ desc: 'Fee', qty: 1, price: 80, tax: 'standard' }, { desc: 'Expenses', qty: 1, price: 20, tax: 'standard' }, { desc: 'Disbursement', qty: 1, price: 50, tax: 'outside' }] });
    return `Consulting invoices are usually large, infrequent and read by a finance team that compares them line by line with an engagement letter, so the template opens on the two shapes a consulting fee takes: time, four days at ${h.money(1200, 'US')}, and a fixed-price deliverable, a market analysis report at ${h.money(2500, 'US')}, ${h.money(r.total, 'US')} in all on Net 30 terms. The part consultants most often get wrong is expenses. HMRC is explicit that a consultant who flies to a client's site cannot treat the air fare as a disbursement: the airline supplied the consultant, so the recharge is part of the consultant's own fee and carries VAT with it. Only a payment made as the client's agent, for something the client itself receives, passed on at the exact cost and itemised separately, stays outside VAT. In HMRC's own worked example, an ${h.money(80, 'UK')} fee with ${h.money(20, 'UK')} of recharged expenses and a ${h.money(50, 'UK')} disbursement gives ${h.money(uk.tax, 'UK')} of VAT and a ${h.money(uk.total, 'UK')} invoice; the generator reproduces it with one line set to "Outside scope".`;
  },
  faqs: (h) => [
    { q: 'Should a consulting invoice show the days worked or only the fee?', a: 'Show what the engagement letter priced. If the fee is a day rate, list the days and the rate, ideally with the dates or the workstream, so the client can match them with their own record of meetings. If it is a fixed fee per phase, describe the phase and its deliverable and leave the quantity at one. Mixing both on one invoice is fine when each line says which it is.' },
    { q: 'Do I charge VAT on travel expenses I recharge to a consulting client?', a: `If you are VAT-registered, yes in most cases. HMRC treats a consultant's own travel, hotels, phone and postage as part of the supply to the client, so they are added to the fee and taxed at the same rate, ${h.pct(h.P.uk.vat_rates.standard)} for standard-rated consulting. Recharge the net cost you paid, not the VAT-inclusive amount, then let the invoice add VAT once.` },
    { q: 'When can a consultant pass on a cost as a disbursement without VAT?', a: 'Only when every HMRC condition is met: you paid as the client\'s agent, the client received and used the goods or services, the client was responsible for the payment and authorised it, knew a third party provided it, and you recover the exact amount, itemised separately. Typical examples are official fees paid on the client\'s behalf. Set that line to "Outside scope" in the generator.' },
    { q: 'Which payment terms are usual on a consulting invoice?', a: `Net 30 is the default in the template and the most common term between businesses. Larger clients often impose their own terms through purchase orders, so enter their PO number in the generator: many accounts teams reject invoices without it. In the UK, an agreed period between businesses should not normally exceed ${h.P.uk.late_payment.b2b_max_days} days unless it is fair to both sides.` },
  ],
  body: (h) => {
    const ex = h.calc({ country: 'UK', region: '', registered: true, lines: [{ desc: 'Fee', qty: 1, price: 80, tax: 'standard' }, { desc: 'Expenses', qty: 1, price: 20, tax: 'standard' }, { desc: 'Disbursement', qty: 1, price: 50, tax: 'outside' }] });
    const ca = h.calc({ country: 'CA', region: 'ON', registered: true, lines: [{ desc: 'Days', qty: 4, price: 1200, tax: 'ca_full' }, { desc: 'Report', qty: 1, price: 2500, tax: 'ca_full' }] });
    const au = h.calc({ country: 'AU', region: 'NSW', registered: true, lines: [{ desc: 'Days', qty: 4, price: 1200, tax: 'gst' }, { desc: 'Report', qty: 1, price: 2500, tax: 'gst' }] });
    return `
<h2>Expenses, recharges and disbursements</h2>
<p>The word "disbursement" is used loosely in consulting, but for VAT it has a narrow meaning. HMRC's VAT guide lists the conditions and then gives examples that fail them, one of which is a consultant's air fare to the client's site. The practical rule for an invoice is simple: anything you bought for yourself to do the work is a cost of your service and follows its VAT treatment; anything you paid strictly on the client's behalf, for the client, at cost, can sit outside.</p>
${h.table(['Line on HMRC\'s example invoice', 'Amount', 'VAT treatment in the generator'], [
  ['Services (fee)', h.money(80, 'UK', 2), `VAT ${h.pct(h.P.uk.vat_rates.standard)}`],
  ['Expenses recharged', h.money(20, 'UK', 2), `VAT ${h.pct(h.P.uk.vat_rates.standard)}, part of the fee`],
  ['Disbursement paid as agent', h.money(50, 'UK', 2), 'Outside scope'],
  ['VAT', h.money(ex.tax, 'UK', 2), 'on the first two lines only'],
  ['Total', h.money(ex.total, 'UK', 2), ''],
], 'HMRC VAT Notice 700, 25.1.2, reproduced by the engine', ['l', 'r', 'l'])}
<p>Outside the UK, each authority has its own rules on recharged costs, and this page does not summarise them: in the generator a recharge is simply a line, and you give it the tax code that applies. For the fee itself, the template's ${h.money(ca.net, 'CA')} carries ${h.money(ca.tax, 'CA', 2)} of HST in Ontario and ${h.money(au.tax, 'AU', 2)} of GST in Sydney.</p>
<h2>Referencing the engagement</h2>
<p>Consulting invoices travel through approval chains, and the one that is paid quickly names the engagement letter or statement of work, the client's purchase order number, the period covered and the person who commissioned the work. The generator has a field for the PO number; put the rest in the first line's description or the notes. If the engagement caps fees, show the cumulative amount billed against the cap in the notes so the sponsor does not have to work it out.</p>
<h2>Retainers and phased fees</h2>
<p>A monthly retainer is invoiced at the start of each month with the period in the description ("Advisory retainer, November 2026"). A phased fee is invoiced at each milestone. When a client pays an advance against future days, invoice the advance as a ${h.a('deposit-invoice', 'deposit invoice')} and show it as paid on the next one. Work billed purely by the hour is clearer on the ${h.a('hourly-invoice-template', 'hourly invoice template')}, which lays the hours out like a timesheet.</p>
<h2>Clients in another country</h2>
<p>Consultants often advise clients abroad. The currency can be the client's, and in the UK a VAT invoice in another currency must still state the VAT total in sterling. Whether VAT, GST or HST applies to a service supplied across a border depends on place-of-supply rules this tool does not decide: choose the tax code your situation requires, often zero-rated or outside the scope, and confirm it with the authority. The ${h.a('invoice-in-foreign-currency', 'foreign currency guide')} covers the sterling figure.</p>`;
  },
  related: ['hourly-invoice-template', 'freelance-invoice-template', 'invoice-in-foreign-currency', 'deposit-invoice', 'payment-terms'],
  sources: ['uk_vat_guide', 'uk_vat_records', 'uk_late_terms', 'ca_rates', 'ato_tax_invoices'],
});
