import { definePage } from '../../lib/page-types';

export default definePage({
  id: 'deposit-invoice',
  path: '/guides/deposit-invoice/',
  group: 'guides',
  kind: 'guide',
  order: 150,
  nav: 'Deposit invoice',
  card: 'Billing an upfront payment and the balance: two invoices, the tax on each, and the UK tax point rules for deposits.',
  title: 'Deposit Invoice 2026: Upfront Payment, Balance and Tax',
  description: 'Deposit invoice guide for 2026: bill 30% or 50% upfront, then the balance, with the right VAT, GST or sales tax on each part and HMRC tax point rules.',
  h1: 'Deposit invoices: billing the upfront payment and the balance',
  intro: 'Two invoices for one job, tax on each part, and the date that decides when the tax is due.',
  mini: 'depositInvoice',
  resume: (h) => {
    const job = 12000;
    const dep = h.calc({ country: 'UK', region: '', registered: true, lines: [{ desc: 'x', qty: 1, price: job * 0.3, tax: 'standard' }] });
    const bal = h.calc({ country: 'UK', region: '', registered: true, lines: [{ desc: 'x', qty: 1, price: job * 0.7, tax: 'standard' }] });
    return `A deposit invoice asks for part of the price before the work starts or the goods are delivered, and a balance invoice follows for the rest. Done properly, the two documents together charge exactly the full price and the full tax, no more, and each one carries the tax on its own share. For a UK job worth ${h.money(job, 'UK')} before VAT with a 30% deposit, the first invoice is ${h.money(dep.total, 'UK', 2)} including ${h.money(dep.tax, 'UK', 2)} of VAT and the balance invoice ${h.money(bal.total, 'UK', 2)} including ${h.money(bal.tax, 'UK', 2)}. Timing matters as much as arithmetic: HMRC's VAT Notice 700 says that issuing a VAT invoice or receiving a payment before the work is done creates a tax point for the amount invoiced or received, so VAT on a deposit is due in the return for the period in which you invoiced or received it, not when the job ends. A security deposit that you will refund is different and creates no tax point. The calculator above splits any project into its two invoices for each country.`;
  },
  faqs: (h) => [
    { q: 'Do I charge VAT on a deposit invoice or only on the final invoice?', a: 'On the deposit invoice, for the deposit. HMRC treats most deposits as advance payments: a VAT invoice issued, or a payment received, before the basic tax point creates a tax point for that amount (VAT Notice 700, 14.2.2 and 14.2.3). The final invoice then charges VAT on the balance only, so the two VAT amounts add up to the VAT on the whole price.' },
    { q: 'Is a refundable security deposit taxable on an invoice?', a: 'Not under HMRC\'s rules when the deposit only secures the safe return of hired goods and is refunded, or kept to compensate for loss or damage. VAT Notice 700 gives that example as one where no tax point is created. Show it on a separate document or as a non-taxable line, and keep it apart from payments for the hire itself.' },
    { q: 'What happens to the VAT if the customer cancels and I keep the deposit?', a: 'VAT stays due on the amount you keep. HMRC says that if you retain a full or part payment for a supply the customer fails to take up, VAT is due on the amount paid, and the payment cannot be reclassified as outside the scope of VAT. If you refund the deposit, you can reclaim the VAT you accounted for in your next return.' },
    { q: 'Should the balance invoice show the full price or only the remaining amount?', a: 'Either works if the arithmetic is clear. The tidiest balance invoice lists the full job, deducts the deposit already paid and charges tax on the balance only. The other common layout bills just the remaining share as its own line. What must never happen is tax charged twice on the deposit, once on each invoice.' },
    { q: 'How much deposit can I ask for on an invoice?', a: 'There is no general legal maximum for business deals in the four countries covered here: the deposit is whatever you and the customer agree, usually in the quote or contract. Thirty to fifty per cent is common where you buy materials up front. Write the percentage and what happens to the deposit on cancellation into your terms.' },
  ],
  body: (h) => {
    const job = 12000;
    const rows = [
      ['UK, VAT 20%', 'UK', 'standard', ''],
      ['Ontario, HST 13%', 'CA', 'ca_full', 'ON'],
      ['Quebec, GST + QST', 'CA', 'ca_full', 'QC'],
      ['Australia, GST 10%', 'AU', 'gst', 'NSW'],
      ['Texas, 6.25% + 2% local', 'US', 'taxable', 'TX'],
    ].map(([label, c, t, region]) => {
      const one = (amt: number) => h.calc({ country: c as 'UK', region, registered: true, localRate: c === 'US' ? 2 : 0, lines: [{ desc: 'x', qty: 1, price: amt, tax: t as 'standard' }] });
      const d = one(job * 0.3), b = one(job * 0.7), w = one(job);
      return [label, h.money(d.total, c as 'UK', 2), h.money(b.total, c as 'UK', 2), h.money(d.tax + b.tax, c as 'UK', 2), h.money(w.tax, c as 'UK', 2)];
    });
    const net = h.calc({ country: 'AU', region: 'VIC', registered: true, paid: 1650, lines: [{ desc: 'Kitchen joinery', qty: 1, price: 5500, tax: 'gst' }] });
    return `
<h2>Two invoices, one tax bill</h2>
<p>The test of a deposit and balance pair is simple: add the tax on both and you must get the tax on the whole job. The engine checks it for a ${h.money(job, 'US')} project billed 30% up front in each tax system.</p>
${h.table(['Where', 'Deposit invoice (30%)', 'Balance invoice (70%)', 'Tax on both', 'Tax on the whole job'], rows, `A ${h.money(job, 'US')} job before tax, local currency, seller registered`, ['l', 'r', 'r', 'r', 'r'])}
<p>A cent of difference can appear when each invoice is rounded separately, which is normal and accepted: each invoice is rounded on its own amount. What is not acceptable is a deposit invoice without tax followed by a final invoice that taxes the full price, or the reverse.</p>

<h2>When the tax on a deposit is due: the UK tax point</h2>
<p>In the UK the date matters because it decides which VAT return the tax goes into. For services the basic tax point is when the work is performed; for goods it is when they are removed or made available. ${h.src('uk_vat_guide', 'VAT Notice 700')} adds that if you issue a VAT invoice or receive a payment before that basic tax point, the date of the invoice or of the payment, whichever comes first, becomes the tax point for the amount invoiced or received. A deposit received in March for work done in May is therefore VAT you declare for March.</p>
<p>The same paragraph allows a VAT invoice issued up to 14 days after the basic tax point to set the tax point instead, but it does not undo a tax point already created by a deposit: that part was fixed when you invoiced or received it. If you work this way, keep the deposit invoice and the balance invoice in the same file so each VAT period can be traced.</p>
<p>Not every deposit is a payment for the supply. HMRC's example is the deposit taken as security for the safe return of hired goods, refunded on return or kept to cover loss or damage: it creates no tax point. A deposit held by a third party as stakeholder in a property sale creates none until the money is released to the seller. Both are rarely what a freelancer or tradesperson takes, but they explain why a damage deposit should not appear as a taxable line.</p>

<h2>Cancelled jobs and kept deposits</h2>
<p>HMRC is clear that VAT is due on all charges, deposits and fees that are full or part payments for a supply. If the customer walks away and you keep the deposit, you still owe the VAT you charged on it; the payment cannot be relabelled as compensation outside the scope of VAT. If you refund it, the VAT you accounted for can be reclaimed in your next return, and a credit note against the deposit invoice documents the refund. The ${h.a('credit-note-template', 'credit note template')} prints the reference to the original invoice.</p>
<!--mini:h_balanceDue-->

<h2>Laying out the balance invoice</h2>
<p>The generator supports the layout most accountants prefer: list the whole job at its full price, let the tax be computed on the full amount, then enter the deposit in "Deposit paid". The invoice shows the total, the payment received and the balance due. A Victorian joiner who quoted ${h.money(5500, 'AU')} plus GST for a kitchen and took ${h.money(1650, 'AU')} up front issues a final tax invoice of ${h.money(net.total, 'AU', 2)} with ${h.money(net.tax, 'AU', 2)} of GST and a balance of ${h.money(net.due, 'AU', 2)}. Used this way, the final document repeats the GST on the whole job, so it should be read together with the deposit document: if your deposit was itself a tax invoice with GST, bill only the remaining share on the final invoice instead, so the GST is not counted twice in your records.</p>
<p>In practice, choose one of the two methods and keep to it. The share method (deposit invoice for 30%, balance invoice for 70%) is the clearest for VAT and GST because each document carries its own tax. The full-price method suits a receipt-style deposit that was not a tax invoice, such as a booking payment acknowledged by a ${h.a('receipt-template', 'receipt')}.</p>

<h2>Deposits in the other countries</h2>
<p>Canada, Australia and the US states each have their own rules on when tax on an advance payment becomes due, and this site does not model them; the arithmetic above is the same everywhere, the timing should be checked with the authority. In Canada, the deposit invoice must still meet the input tax credit details for its own total, so a ${h.money(4000, 'CA')} deposit invoice needs the customer's name and your payment terms like any invoice of ${h.money(h.P.ca.itc_tiers[1], 'CA')} or more (${h.a('gst-hst-invoice-requirements', 'GST/HST invoice requirements')}). In Australia, a deposit tax invoice of ${h.money(h.P.au.buyer_identity_from, 'AU')} or more needs the buyer's identity or ABN.</p>

<h2>Quote, deposit, balance: the paper trail</h2>
<p>A tidy job leaves three documents: the ${h.a('estimate-template', 'quote')} that states the price and the deposit percentage, the deposit invoice, and the balance invoice that refers to both. Number them in their own series, as the ${h.a('invoice-numbering', 'numbering guide')} suggests, and quote the deposit invoice number on the balance invoice. If the job runs over several months, interim invoices follow the same logic as a deposit: each one carries the tax on its own share, with its own tax point.</p>`;
  },
  related: ['estimate-template', 'receipt-template', 'credit-note-template', 'invoice-numbering', 'payment-terms'],
  sources: ['uk_vat_guide', 'uk_vat_records', 'ato_tax_invoices', 'ca_itc_regs'],
});
