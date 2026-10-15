import { definePage } from '../../lib/page-types';

export default definePage({
  id: 'invoice-without-gst-template',
  path: '/templates/invoice-without-gst/',
  group: 'templates',
  kind: 'tool',
  order: 120,
  nav: 'Invoice without GST (Australia)',
  card: 'For sole traders under the GST threshold: ABN, no GST, not titled tax invoice.',
  title: 'Invoice Without GST Template 2026: ABN, Not Registered',
  description: 'Free invoice template for Australian businesses not registered for GST, 2026: ABN checked, no GST line, no "tax invoice" title, and the $75,000 GST rule.',
  h1: 'Invoice template without GST, for businesses not registered',
  intro: 'Under the GST threshold you still invoice, with your ABN, but without GST and without calling the document a tax invoice.',
  tool: { country: 'AU', preset: 'no_gst' },
  resume: (h) => `An Australian business that is not registered for GST issues an ordinary invoice: it shows the ABN, the customer, what was supplied and the price, but no GST amount, and it must not be titled "Tax invoice", because only a registered seller can issue one. Registration becomes compulsory once GST turnover reaches ${h.money(h.P.au.registration_threshold, 'AU')}, measured on the current month and the previous eleven or projected over the current month and the next eleven (${h.money(h.P.au.nfp_threshold, 'AU')} for non-profit organisations), and taxi and ride-sourcing drivers must register whatever their turnover. This template starts from a photographer below the threshold billing three hours of event work at ${h.money(180, 'AU')} and a ${h.money(150, 'AU')} image package, ${h.money(690, 'AU')} with no GST added. The ABN field runs the Australian Business Register's own check digit test, so a mistyped number is flagged before the invoice leaves, and a line on the document tells the customer why there is no GST. The day you register, switch the toggle and the same invoice becomes a tax invoice with GST at ${h.pct(h.P.au.gst)}.`,
  faqs: (h) => [
    { q: 'Can I write "Tax invoice" on an Australian invoice if I am not registered for GST?', a: `No. The words "Tax invoice" tell the buyer the document supports a GST credit, and only a GST-registered seller can issue one. If you are under the ${h.money(h.P.au.registration_threshold, 'AU')} threshold and not registered, title it simply "Invoice" and charge no GST. The template does this automatically when the registration toggle is set to No.` },
    { q: 'Do I need an ABN on an invoice if I am not registered for GST?', a: 'The GST rules do not require it, because you are not issuing a tax invoice, but business customers expect it and the template asks for it. The field checks the number with the Australian Business Register formula: subtract 1 from the first digit, weight the eleven digits, and the total must divide exactly by 89. A typo almost always fails that test.' },
    { q: 'How do I word an Australian invoice that has no GST because I am not registered?', a: 'A short statement is enough, for example "No GST has been charged: the supplier is not registered for GST". The template prints it under the totals so the customer does not assume GST is hidden in the price. Avoid "GST-free", which describes specific supplies by a registered business, not your registration status.' },
    { q: 'I just passed $75,000 in turnover: what changes on my Australian invoices?', a: `Once your current or projected GST turnover reaches ${h.money(h.P.au.registration_threshold, 'AU')}, you must register for GST. From your registration date, taxable sales carry GST at ${h.pct(h.P.au.gst)} and your invoices become tax invoices with the seven details the ATO lists. In the template, set "Registered for GST?" to Yes; the title, the GST line and the checklist change at once.` },
  ],
  body: (h) => {
    const before = h.calc({ country: 'AU', region: 'NSW', registered: false, lines: [{ desc: 'x', qty: 1, price: 690, tax: 'gst' }] });
    const after = h.calc({ country: 'AU', region: 'NSW', registered: true, lines: [{ desc: 'x', qty: 1, price: 690, tax: 'gst' }] });
    return `
<h2>Before and after GST registration</h2>
<p>The same job looks different on paper depending on your registration. Below the threshold, the price is the price. Once registered, either you add GST on top of the same price, or you keep the price the customer sees and absorb the GST in it, which lowers what you keep.</p>
${h.table(['', 'Not registered', 'Registered, GST added', 'Registered, price unchanged'], [
  ['Document title', 'Invoice', 'Tax invoice', 'Tax invoice'],
  ['Amount before GST', h.money(before.net, 'AU', 2), h.money(after.net, 'AU', 2), h.money(690 / 1.1, 'AU', 2)],
  ['GST', h.money(0, 'AU', 2), h.money(after.tax, 'AU', 2), h.money(690 / 11, 'AU', 2)],
  ['Customer pays', h.money(before.total, 'AU', 2), h.money(after.total, 'AU', 2), h.money(690, 'AU', 2)],
], 'A $690 photography job, computed by the generator\'s engine', ['l', 'r', 'r', 'r'])}
<p>The last column uses the ATO's one-eleventh rule: in a price that includes GST at ${h.pct(h.P.au.gst)}, GST is one-eleventh of the total.</p>
<h2>Working out whether you have reached the threshold</h2>
<p>The ATO measures GST turnover two ways and you must register if either reaches ${h.money(h.P.au.registration_threshold, 'AU')}: your current GST turnover, which is this month plus the previous eleven months, and your projected GST turnover, this month plus the next eleven. GST turnover is gross business income minus any GST. A photographer who has earned ${h.money(60000, 'AU')} over the past year but has just signed ${h.money(20000, 'AU')} of wedding work for the coming months is under the first test and over the second, so registration is due. Taxi and limousine drivers, including ride-sourcing drivers, must register whatever their GST turnover.</p>
<h2>What the invoice should still show</h2>
<p>Without GST, no ATO list applies to the document, but the invoice still has to work for your customer and your records. Keep these items, which the template fills in:</p>
<ul>
<li>your name or business name, with your ABN, so business customers can identify you;</li>
<li>the customer's name, the date and a unique invoice number;</li>
<li>a description of each item with the quantity and price;</li>
<li>the total and the due date or terms, with your BSB and account number or PayID;</li>
<li>the statement that no GST has been charged.</li>
</ul>
<p>Registered customers sometimes ask a supplier who is not registered for a tax invoice so they can claim a credit. You cannot provide one, and there is no GST in your price for them to claim. Your ABN on the invoice is what they need for their own records.</p>
<h2>Checking an ABN before it goes on an invoice</h2>
<p>The Australian Business Register publishes the check digit method for ABNs. The ABR's own example, 51 824 753 556, passes: take 1 from the first digit, multiply each digit by its weight (10, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19), add the products and divide by 89; a valid ABN leaves no remainder. The template runs this test on your ABN and on the customer's if you type it. A passing number is well formed; only the ABN Lookup confirms it is active and belongs to the business named.</p>
<p>When you register, the ${h.a('tax-invoice-generator-australia', 'Australian tax invoice generator')} and the ${h.a('tax-invoice-requirements-australia', 'tax invoice requirements guide')} take over: from ${h.money(h.P.au.buyer_identity_from, 'AU')} the buyer's identity or ABN must be on the tax invoice too.</p>`;
  },
  related: ['tax-invoice-generator-australia', 'tax-invoice-requirements-australia', 'invoice-vs-receipt', 'freelance-invoice-template', 'invoice-numbering'],
  sources: ['ato_register', 'ato_tax_invoices', 'abr_abn_format'],
});
