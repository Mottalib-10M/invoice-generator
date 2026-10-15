import { definePage } from '../../lib/page-types';

export default definePage({
  id: 'hourly-invoice-template',
  path: '/templates/hourly-invoice/',
  group: 'templates',
  kind: 'tool',
  order: 40,
  nav: 'Hourly invoice',
  card: 'Hours and rate columns like a timesheet, decimal hours, overtime on its own line.',
  title: 'Hourly Invoice Template 2026: Bill Hours at Your Rate, Free',
  description: 'Free hourly invoice template for 2026: Hours and Rate columns, minutes as decimal hours, overtime on its own line, tax by country, PDF made in your browser.',
  h1: 'Hourly invoice template: hours, rate and a total the client can check',
  intro: 'The quantity column becomes Hours and the price column Rate, so the invoice reads like the timesheet behind it.',
  tool: { country: 'US', preset: 'hourly' },
  resume: (h) => {
    const r = h.calc({ country: 'US', region: 'TX', registered: true, lines: [{ desc: 'Dev', qty: 32.5, price: 95, tax: 'exempt' }, { desc: 'Review', qty: 6, price: 95, tax: 'exempt' }] });
    const au = h.calc({ country: 'AU', region: 'NSW', registered: true, lines: [{ desc: 'Dev', qty: 32.5, price: 95, tax: 'gst' }, { desc: 'Review', qty: 6, price: 95, tax: 'gst' }] });
    return `An hourly invoice is a promise that the hours are real, so its job is to be checkable: each line names the work, the number of hours and the rate, and the total is nothing more than their product. With the "Hours × rate" box ticked, this template relabels the quantity column "Hours" and the price column "Rate" on the form, the preview and the PDF. It opens on a development sprint of 32.5 hours and 6 hours of review at ${h.money(95, 'US')}, ${h.money(r.total, 'US')} before any tax. Hours go in as decimals, which is where most hand-made invoices slip: 7 hours 45 minutes is 7.75, not 7.45, and the converter below does the division for you. Tax is added the same way as on any other invoice, by the country and the registration you choose: the same ${h.money(r.net, 'AU')} becomes ${h.money(au.total, 'AU', 2)} with GST in Sydney. Attach or keep the timesheet the hours come from, because the client's first question about an hourly invoice is always where a number came from.`;
  },
  faqs: (h) => [
    { q: 'How do I write minutes on an hourly invoice?', a: 'As a decimal fraction of an hour: divide the minutes by 60. Fifteen minutes is 0.25, thirty is 0.5, forty-five is 0.75, and twenty is 0.33 once rounded to two decimals. Never type 1.30 for an hour and a half, because the invoice will bill 1.3 hours. The converter on this page gives the decimal and the line amount for any number of hours and minutes.' },
    { q: 'Should overtime or weekend hours be a separate line on an hourly invoice?', a: 'Yes. Put each rate on its own line, "Weekend support, 4 hours at 1.5 times the rate" for instance, so the client sees both the hours and the higher rate they agreed to. Blending them into an average rate makes the invoice impossible to reconcile with the timesheet and invites a query that delays payment.' },
    { q: 'Do I need to attach a timesheet to an hourly invoice?', a: 'No tax authority among the four countries requires one on the invoice itself, but many clients do in their supplier terms, and it is the quickest answer to a dispute. Refer to it on the line ("sprint 14, timesheet attached") and keep it with your copy of the invoice. Agencies and staffing firms often make an approved timesheet a condition of payment.' },
    { q: 'Can I round hours up to the next quarter hour on an hourly invoice?', a: 'Only if your agreement says so. Billing increments, such as six or fifteen minutes, are a contractual choice, common in legal and IT services, and should be stated in the engagement terms. If they are, apply them in the timesheet and bill the rounded total; if nothing was agreed, bill the time actually worked.' },
  ],
  body: (h) => {
    const uk = h.calc({ country: 'UK', region: '', registered: true, lines: [{ desc: 'Dev', qty: 32.5, price: 95, tax: 'standard' }, { desc: 'Review', qty: 6, price: 95, tax: 'standard' }] });
    const qc = h.calc({ country: 'CA', region: 'QC', registered: true, lines: [{ desc: 'Dev', qty: 32.5, price: 95, tax: 'ca_full' }, { desc: 'Review', qty: 6, price: 95, tax: 'ca_full' }] });
    const au = h.calc({ country: 'AU', region: 'NSW', registered: true, lines: [{ desc: 'Dev', qty: 32.5, price: 95, tax: 'gst' }, { desc: 'Review', qty: 6, price: 95, tax: 'gst' }] });
    const us = h.calc({ country: 'US', region: 'TX', registered: true, lines: [{ desc: 'Dev', qty: 32.5, price: 95, tax: 'exempt' }, { desc: 'Review', qty: 6, price: 95, tax: 'exempt' }] });
    return `
<h2>From timesheet to invoice line</h2>
<p>Add up the timesheet per type of work and per rate, not per day: a client wants "Development, 32.5 hours" rather than five lines of 6.5. Keep the daily detail in the timesheet. If the work spans two periods or two purchase orders, split the lines along the same boundary so each one can be approved by the right person.</p>
<!--mini:e_hours-->
<h2>Rates, minimums and travel time</h2>
<p>An hourly rate rarely travels alone. A call-out minimum ("minimum charge of two hours") is best shown as the hours actually billed with a note explaining the minimum. Travel time billed at a lower rate gets its own line. Rush or out-of-hours work at a multiple of the base rate gets its own line too, with the multiple in the description. The generator accepts up to three decimals of hours, so a line of 0.083 hours (five minutes) is possible, though most agreements bill in larger steps.</p>
<h2>The same hours, taxed in four places</h2>
${h.table(['Where the business is registered', 'Tax on the hours', 'Invoice total'], [
  ['Texas, service not taxable', h.money(us.tax, 'US', 2), h.money(us.total, 'US', 2)],
  ['United Kingdom, VAT-registered', h.money(uk.tax, 'UK', 2), h.money(uk.total, 'UK', 2)],
  ['Quebec, GST + QST', h.money(qc.tax, 'CA', 2), h.money(qc.total, 'CA', 2)],
  ['New South Wales, GST-registered', h.money(au.tax, 'AU', 2), h.money(au.total, 'AU', 2)],
], 'Hours at 95 an hour, computed by the generator\'s engine', ['l', 'r', 'r'])}
<p>Whether hourly services are taxed in a US state depends on the service and the state, so the lines start as not taxable and you switch any that your state taxes. In the UK, Canada and Australia, a registered business charges VAT, GST or HST on its hours at the rate that applies to the service; the ${h.a('gst-hst-pst-by-province', 'guide to Canadian rates by province')} has the provincial figures.</p>
<h2>Billing hours every week or every month</h2>
<p>Frequent hourly invoices keep each one small and easy to approve. Whatever the rhythm, give every invoice its own number in one continuous series and the period it covers in the first line. If you are billing a fixed fee for a defined result rather than time, the ${h.a('consulting-invoice-template', 'consulting template')} or the ${h.a('freelance-invoice-template', 'freelance template')} fits better, and a large job priced in advance starts from the ${h.a('estimate-template', 'quote and estimate template')}.</p>`;
  },
  related: ['consulting-invoice-template', 'freelance-invoice-template', 'estimate-template', 'invoice-numbering', 'payment-terms'],
  sources: ['uk_vat_records', 'ca_rates', 'ato_tax_invoices', 'us_states'],
});
