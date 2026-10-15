import { definePage } from '../../lib/page-types';

export default definePage({
  id: 'sole-trader-invoice-template',
  path: '/templates/sole-trader-invoice/',
  group: 'templates',
  kind: 'tool',
  order: 90,
  nav: 'Sole trader invoice (UK)',
  card: 'Your own name and trading name, an address for legal documents, no VAT.',
  title: 'Sole Trader Invoice Template 2026: Free, No VAT, UK',
  description: 'Free sole trader invoice template for 2026: your own name and trading name, an address for legal papers, and no VAT while under the £90,000 VAT threshold.',
  h1: 'Sole trader invoice template for the UK',
  intro: 'Most sole traders are not VAT-registered. The invoice is simpler, but two details trip people up: your name and your address.',
  tool: { country: 'UK', preset: 'sole_trader' },
  resume: (h) => `A sole trader who is not registered for VAT sends an ordinary invoice, and GOV.UK lists what it must hold: a unique identification number, your name, address and contact details, the customer's name and address, a clear description of what you are charging for, the date of supply, the date of the invoice, the amounts and the total owed. Two extra rules apply to sole traders. The invoice must show your own name as well as any business name you trade under, and if you use a business name it must give an address where legal documents can be delivered to you. This template starts from a gardener, Sam Carter, trading as Carter Gardening, who bills four October visits at ${h.money(70, 'UK')} and ${h.money(45, 'UK')} of green waste removal, ${h.money(325, 'UK')} with no VAT. You may not add VAT unless you are registered, and registration only becomes compulsory when taxable turnover passes ${h.money(h.P.uk.vat_threshold, 'UK')} over the last 12 months, or is expected to in the next 30 days. The template prints "Sam Carter trading as Carter Gardening" and a short no-VAT statement for you.`,
  faqs: (h) => [
    { q: 'Do I put my own name or my business name on a sole trader invoice?', a: 'Both, if you trade under a business name. GOV.UK says a sole trader invoice must include your name and any business name you use. The usual form is "Sam Carter trading as Carter Gardening". If you trade under your own name only, that name is enough. Tick "Sole trader using a business name" and the template prints both.' },
    { q: 'Which address goes on a UK sole trader invoice if I work from home?', a: 'If you use a business name, the invoice must show an address where legal documents can be delivered to you, so a service address that actually reaches you is needed. It does not have to be your home if another address works for that purpose. If you trade under your own name, the invoice still needs your address and contact details.' },
    { q: 'Should a sole trader below the VAT threshold write "not VAT registered" on invoices?', a: 'It is not a listed requirement, but it is useful: it tells business customers why there is no VAT line and that there is no VAT number to check. The template adds "Not registered for VAT: no VAT has been charged" when the registration toggle is set to No. Never show a VAT amount or a VAT number you do not have.' },
    { q: 'Can a sole trader register for VAT before reaching £90,000?', a: `Yes, GOV.UK allows voluntary registration below the ${h.money(h.P.uk.vat_threshold, 'UK')} threshold. From the registration date you must charge VAT on taxable sales, usually at ${h.pct(h.P.uk.vat_rates.standard)}, and issue VAT invoices to VAT-registered customers. In the template, switch "VAT-registered?" to Yes and add your VAT number; the title becomes "VAT invoice".` },
  ],
  body: (h) => `
<h2>The GOV.UK list, field by field</h2>
${h.table(['GOV.UK requires', 'In the template'], [
  ['A unique identification number', 'Number, proposed in sequence on this device'],
  ['Your name, address and contact information', 'From: your business, with email'],
  ['Your own name and any business name (sole traders)', 'Your own name field + business name'],
  ['An address for legal documents, if you use a business name', 'Address'],
  ['Customer name and address', 'Bill to'],
  ['A clear description of what you are charging for', 'One line per job or item'],
  ['The date the goods or service were provided', 'Supply date'],
  ['The date of the invoice', 'Invoice date'],
  ['The amounts charged and the total owed', 'Items and totals'],
  ['VAT amount, if applicable', 'Left out when not registered'],
], 'Invoices: what they must include, GOV.UK', ['l', 'l'])}
<p>The supply date is the one most often missing from a sole trader's invoice. If you bill monthly for repeated work, as the gardener in the template does, say so in the description ("October, 4 visits") or enter the last visit as the supply date.</p>
<h2>Trading name, real name and the paperwork behind them</h2>
<p>A sole trader is the business: there is no separate legal person, which is why the law wants the human name on the invoice next to the trading name. Customers, debt collectors and courts deal with you personally. If you later set up a limited company, the invoice changes completely: it must carry the company's full registered name as it appears on its certificate of incorporation, and if you choose to list directors you must list them all. The ${h.a('vat-invoice-generator-uk', 'UK VAT invoice generator')} covers that case.</p>
<h2>Watching the VAT threshold</h2>
<p>The ${h.money(h.P.uk.vat_threshold, 'UK')} test is rolling: it looks at your taxable turnover for the last 12 months, not the tax year, so keep a running total. You must register if that total goes over the threshold, or if you expect your turnover in the next 30 days alone to go over it. A sole trader billing ${h.money(8000, 'UK')} a month from a standing start reaches ${h.money(88000, 'UK')} after eleven months and goes over in the twelfth; one who wins a single ${h.money(95000, 'UK')} contract must register as soon as the contract makes that turnover expected within 30 days.</p>
${h.table(['Taxable turnover, last 12 months', 'Status', 'Invoice'], [
  [h.money(60000, 'UK'), 'Under the threshold, not registered', 'No VAT, not a VAT invoice'],
  [h.money(60000, 'UK'), 'Registered voluntarily', `VAT invoice, VAT at ${h.pct(h.P.uk.vat_rates.standard)} on standard-rated work`],
  [h.money(91000, 'UK'), 'Over the threshold: registration compulsory', 'VAT invoice once registered'],
], 'VAT registration and the invoice you send', ['r', 'l', 'l'])}
<h2>Getting paid as a sole trader</h2>
<p>Put your bank details and a reference on every invoice, and choose terms you can live with: if you do not agree a payment date with a business customer, the law treats the payment as late 30 days after the customer receives the invoice or the work is done, whichever is later. Between businesses you can then claim statutory interest and a fixed compensation, explained in the ${h.a('late-payment-interest-uk', 'late payment interest guide')}. Those rules do not apply to private individuals, so for household customers the terms on your invoice and your own follow-up are what count. The ${h.a('payment-terms', 'payment terms guide')} helps choose them.</p>`,
  related: ['vat-invoice-generator-uk', 'vat-invoice-requirements', 'late-payment-interest-uk', 'freelance-invoice-template', 'invoice-numbering'],
  sources: ['uk_invoice', 'uk_vat_register', 'uk_late_terms'],
});
