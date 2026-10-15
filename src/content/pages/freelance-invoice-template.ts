import { definePage } from '../../lib/page-types';

const lines = (tax: 'exempt' | 'standard' | 'gst' | 'ca_full') => [
  { desc: 'Feature article, 1,500 words', qty: 3, price: 450, tax },
  { desc: 'Interview transcription', qty: 2, price: 60, tax },
];

export default definePage({
  id: 'freelance-invoice-template',
  path: '/templates/freelance-invoice/',
  group: 'templates',
  kind: 'tool',
  order: 10,
  nav: 'Freelance invoice',
  card: 'For writers, designers and developers paid per piece: deliverables, rights, 14-day terms.',
  title: 'Freelance Invoice Template 2026: Free PDF, Tax by Country',
  description: 'Free freelance invoice template for 2026: bill per article, design or sprint, with VAT, GST or sales tax only if registered, 14-day terms, PDF in your browser.',
  h1: 'Freelance invoice template for work billed by the piece',
  intro: 'Name each deliverable, say what the client may do with it, and add tax only where your registration requires it.',
  tool: { country: 'US', preset: 'freelance' },
  resume: (h) => {
    const us = h.calc({ country: 'US', region: 'TX', registered: true, lines: lines('exempt') });
    const uk = h.calc({ country: 'UK', region: '', registered: true, lines: lines('standard') });
    return `A freelancer's invoice is judged on two things the client's accounts team checks first: whether each line matches a deliverable they commissioned, and whether the tax on it is one you are entitled to charge. This template opens on three commissioned articles and two transcriptions, ${h.money(us.total, 'US')} in total, with 14-day terms because most freelance agreements are shorter than the Net 30 that companies use between themselves. Whether tax appears depends on where you are and on your registration, not on the template. In the US, whether writing or design work is taxable depends on the state, so the lines start as not taxable and you switch any line your state does tax. A UK freelancer who has registered for VAT adds ${h.pct(h.P.uk.vat_rates.standard)}, ${h.money(uk.tax, 'UK')} on the same work, and one who has not, below the ${h.money(h.P.uk.vat_threshold, 'UK')} threshold, must leave VAT off. An Australian freelancer charges GST only once registered, compulsory from ${h.money(h.P.au.registration_threshold, 'AU')} of turnover.`;
  },
  faqs: (h) => [
    { q: 'Should a freelance invoice list each article or design separately?', a: 'Yes, one line per deliverable the client can recognise, with the title or brief reference they used when commissioning it. A single "writing services, October" line forces the client to match it against their own records and often delays approval. Separate lines also let you mark one item as taxable and another not, which matters when a job mixes a service with goods such as prints.' },
    { q: 'Does a freelancer need to put a tax number on an invoice?', a: `Only the number of a tax you charge. A UK freelancer registered for VAT must show the VAT registration number; one who is not shows none. In Australia the ABN is expected on business invoices whether or not you charge GST, and the generator checks its digits. In the US, clients ask for your Form W-9 to report what they paid you rather than for a number on each invoice.` },
    { q: 'Can I add a late fee to a freelance invoice?', a: `Only if it was agreed before the work, in your contract or written terms. In the UK, business clients who pay late also owe statutory interest of ${h.pct(h.P.uk.late_payment.margin)} over the Bank of England reference rate plus a fixed sum, without any clause in your terms. Elsewhere, write the late fee into your terms and repeat it in the invoice notes so the client sees it each time.` },
    { q: 'What payment terms suit a freelance invoice?', a: 'Short ones, stated on every invoice. Fourteen days is common for individual freelancers, and many ask for part of the fee upfront on larger commissions. Whatever you choose, the generator turns it into a due date printed next to the invoice date. In the UK, if no date was ever agreed, a business payment becomes late 30 days after the client receives the invoice.' },
  ],
  body: (h) => {
    const au = h.calc({ country: 'AU', region: 'NSW', registered: true, lines: lines('gst') });
    const on = h.calc({ country: 'CA', region: 'ON', registered: true, lines: lines('ca_full') });
    const uk = h.calc({ country: 'UK', region: '', registered: true, lines: lines('standard') });
    const us = h.calc({ country: 'US', region: 'TX', registered: true, lines: lines('exempt') });
    return `
<h2>Describing creative work so it gets paid</h2>
<p>Commissioning editors, art directors and product owners approve invoices against what they asked for. Use their words: the headline, the campaign name, the ticket or sprint number. If the agreement grants usage rights, say which ones on the line or in the notes ("first serial rights, web and print, 12 months"), because rights are often what the fee is really for, and the invoice becomes the written trace of them. Revisions beyond those included are worth a line of their own, priced, rather than a silent extra.</p>
<h2>The same freelance invoice in four countries</h2>
<p>The template's work, three articles at ${h.money(450, 'US')} and two transcriptions at ${h.money(60, 'US')}, comes to the same fee everywhere; only the tax changes, and only for a freelancer who is registered.</p>
${h.table(['Freelancer based in', 'Tax if registered', 'Tax amount', 'Total'], [
  ['Texas, service not taxable', 'None on these lines', h.money(us.tax, 'US', 2), h.money(us.total, 'US', 2)],
  ['United Kingdom', `VAT ${h.pct(h.P.uk.vat_rates.standard)}`, h.money(uk.tax, 'UK', 2), h.money(uk.total, 'UK', 2)],
  ['Ontario', 'HST 13%', h.money(on.tax, 'CA', 2), h.money(on.total, 'CA', 2)],
  ['New South Wales', `GST ${h.pct(h.P.au.gst)}`, h.money(au.tax, 'AU', 2), h.money(au.total, 'AU', 2)],
], `Fee of ${h.num(us.net)} in local currency, computed by the generator's engine`, ['l', 'l', 'r', 'r'])}
<p>Below the registration limits (${h.money(h.P.uk.vat_threshold, 'UK')} in the UK, ${h.money(h.P.ca.small_supplier, 'CA')} for a Canadian small supplier, ${h.money(h.P.au.registration_threshold, 'AU')} in Australia), set the registration switch to No and the generator removes the tax and states why.</p>
<h2>Working for clients abroad</h2>
<p>Freelancers increasingly invoice clients in another country, and two settings change. The currency: pick the client's if that is what you agreed, and if you are VAT-registered in the UK the VAT total must also appear in sterling, as the ${h.a('invoice-in-foreign-currency', 'foreign currency guide')} explains. The tax: cross-border services follow place-of-supply rules this tool does not decide for you, so choose the tax code your situation calls for, often zero or outside the scope, and check the rule with the authority.</p>
<h2>Keeping the series clean</h2>
<p>Freelancers who send few invoices are tempted to number them by client or by project. A single running series is safer: HMRC asks VAT-registered businesses for sequential numbers, and gaps or duplicates are what an inspector notices first. The generator remembers your last number on this device and proposes the next; the ${h.a('invoice-numbering', 'numbering guide')} covers prefixes and yearly restarts. If you bill by time rather than by piece, the ${h.a('hourly-invoice-template', 'hourly template')} lays the hours out for the client to check.</p>`;
  },
  related: ['hourly-invoice-template', 'consulting-invoice-template', 'invoice-numbering', 'payment-terms', 'invoice-in-foreign-currency'],
  sources: ['uk_invoice', 'uk_vat_register', 'ato_register', 'irs_w9'],
});
