import { definePage } from '../../lib/page-types';

const net = 8000;
const rates = [1.12, 1.15, 1.18];

export default definePage({
  id: 'invoice-in-foreign-currency',
  path: '/guides/invoice-in-foreign-currency/',
  group: 'guides',
  kind: 'guide',
  order: 90,
  nav: 'Invoice in a foreign currency',
  card: 'Invoicing in euros or dollars from the UK: the VAT total in sterling and the exchange rates HMRC accepts.',
  title: 'Foreign Currency Invoice 2026: VAT in Sterling, HMRC Rates',
  description: 'Invoice in euros or dollars from the UK in 2026: lines in any currency, the VAT total in sterling at the market rate or HMRC period rate, a 20% VAT example.',
  h1: 'Invoicing in a foreign currency: the sterling VAT rule',
  intro: 'A UK VAT invoice can be priced in any currency, but one figure on it must always be in pounds.',
  mini: 'foreignCurrency',
  resume: (h) => {
    const vat = net * h.P.uk.vat_rates.standard;
    return `A VAT-registered UK business can invoice a customer in euros, dollars or any other currency: HMRC's list of invoice details allows the price of each line and the total before VAT to be expressed in any currency. One item is the exception. The total amount of VAT chargeable must be expressed in sterling, because that is the amount that goes on your VAT return. VAT Notice 700 also fixes how to convert it: at the UK market selling rate at the time of supply, or, if you choose that option for all your supplies or a class of them, at the period rate of exchange HMRC publishes for customs purposes; any other commercial rate needs written agreement from HMRC, and forward rates are refused. On an ${'€'}${h.num(net)} service at ${h.pct(h.P.uk.vat_rates.standard)}, the VAT is ${'€'}${h.num(vat)}, which at €${rates[1]} to the pound must appear on the invoice as ${h.money(Math.round((vat / rates[1]) * 100) / 100, 'UK', 2)}. The generator adds the sterling field as soon as you pick another currency.`;
  },
  faqs: (h) => [
    { q: 'Can a UK VAT invoice be issued entirely in euros?', a: 'Almost entirely. VAT Notice 700 allows each line, the unit prices and the total before VAT to be in any currency, so the customer can be billed and pay in euros. The total VAT must also be shown in sterling, because HMRC needs that figure for your return. A euro-only VAT invoice without the sterling VAT total is missing a required detail.' },
    { q: 'Which exchange rate should I use for the sterling VAT on a foreign currency invoice?', a: 'By default, the UK market selling rate at the time of supply; HMRC accepts the rates printed in national newspapers as evidence. You can instead adopt HMRC\'s period rate of exchange for customs purposes for all your supplies, or for one class of them, and note that choice in your records. A rate of your own needs HMRC\'s written agreement.' },
    { q: 'Does the sterling VAT figure change if the customer pays my euro invoice later at a different rate?', a: 'No. The rate that counts is the one current at the time of supply, so the sterling VAT on the invoice is fixed when you issue it. If the pound moves before the customer pays, the difference is an exchange gain or loss in your accounts, not a VAT adjustment. Your return uses the sterling VAT shown on the invoice.' },
    { q: 'Can I switch between the market rate and HMRC period rates from one currency invoice to the next?', a: 'Not freely. Once you adopt HMRC\'s period rates for your supplies, or for a class of them, VAT Notice 700 says you cannot change without first getting agreement from HMRC\'s VAT Written Enquiries Team. Pick the method that suits your bookkeeping, write it down, and apply it to every invoice in that class.' },
    { q: 'Does a zero-rated export invoice in dollars need a sterling figure?', a: 'The sterling rule is about the VAT total. Where every line is zero-rated, the VAT due is nil, and the invoice must show clearly that no VAT is payable on those items and give a separate total for them. Many exporters still show the sterling equivalent of the total for their own records, which costs nothing and avoids questions.' },
  ],
  body: (h) => {
    const vat = net * h.P.uk.vat_rates.standard;
    const rows = rates.map((x) => [`€${x}`, `€${h.num(net + vat, 2)}`, `€${h.num(vat, 2)}`, h.money(Math.round((net / x) * 100) / 100, 'UK', 2), h.money(Math.round((vat / x) * 100) / 100, 'UK', 2)]);
    return `
<h2>What may be in another currency, and what may not</h2>
<p>HMRC's list of details for a full VAT invoice, in ${h.src('uk_vat_guide', 'VAT Notice 700, section 16.3')} and ${h.src('uk_vat_records', 'VAT Notice 700/21, section 4')}, says in so many words which amounts are free and which are not:</p>
<ul>
<li>for each description, the quantity, the rate of VAT and the amount payable excluding VAT: <strong>any currency</strong>;</li>
<li>the gross total payable excluding VAT: <strong>any currency</strong>;</li>
<li>the total amount of VAT chargeable: <strong>sterling</strong>.</li>
</ul>
<p>Section 16.4 adds that a business issuing VAT invoices in a foreign currency for supplies that take place in the UK must convert the total VAT into sterling, and points to section 7.6 for the method. Nothing requires the whole invoice to be duplicated in pounds; one extra line with the sterling VAT is enough. Showing the sterling net as well does no harm and helps your customer's bookkeeping.</p>
<h2>The three ways to convert</h2>
<p>Section 7.6 of VAT Notice 700 has force of law under Schedule 6 to the VAT Act 1994. It offers three bases, in this order.</p>
<h3>1. The UK market selling rate</h3>
<p>The default. Use the market selling rate at the time of supply. HMRC says the rates published in national newspapers are acceptable evidence of the rate on a given day, so keep a note of where you took it from.</p>
<h3>2. HMRC's period rates</h3>
<p>Instead, you may use the period rate of exchange that HMRC publishes for customs purposes. You can adopt it for all your supplies, or only for a particular class or description of them, recording that choice at the time. No advance notice to HMRC is needed, but once adopted you cannot change back without HMRC's agreement in writing. Period rates suit businesses that issue many small invoices in the same currency, because one rate covers a whole month.</p>
<h3>3. A rate you agree with HMRC</h3>
<p>A business that uses another rate for its commercial accounts can apply in writing to the VAT Written Enquiries Team. HMRC considers whether the rate refers to the UK currency market, whether it can be objectively verified and how often it is updated. Forward rates, or methods derived from them, are not acceptable.</p>
<p>Whatever the method, the rate is the one current at the time of supply. That date is the tax point, which the ${h.a('vat-invoice-requirements', 'VAT invoice requirements guide')} explains.</p>
<h2>Worked example at three exchange rates</h2>
<p>A London design studio invoices a Paris client ${'€'}${h.num(net)} for a branding project taxed at ${h.pct(h.P.uk.vat_rates.standard)}. The euro figures do not move; the sterling VAT on the invoice depends on the rate of the day.</p>
${h.table(['£1 =', 'Invoice total in euros', 'VAT in euros', 'Net in sterling', 'VAT to show in sterling'], rows, 'Euro invoice of 8,000 plus 20% VAT, sterling VAT at three rates', ['l', 'r', 'r', 'r', 'r'])}
<p>A swing of a few cents in the rate moves the sterling VAT by tens of pounds, which is why the rate and its date belong on the invoice next to the sterling figure. In the generator, choose the currency, then type the sterling VAT in the field that appears under the dates; it prints as "VAT total in sterling" under the totals. The calculator above does the division for you.</p>
<h2>When the customer abroad pays no UK VAT at all</h2>
<p>Many invoices in euros or dollars go to customers outside the UK, and the VAT treatment then depends on the place of supply rules, which are outside what this generator decides. If the supply is zero-rated, HMRC requires the items to show clearly that no VAT is payable and to carry a separate total. If the supply is outside the scope of UK VAT, choose "Outside scope" on the line: the generator adds no VAT and the sterling field is not needed. When in doubt about the place of supply, ask HMRC or an accountant before you issue the invoice.</p>
<h2>Paying, receiving and the exchange difference</h2>
<p>The sterling VAT you show is the VAT you declare, even if the customer pays weeks later after the euro has fallen. The difference between the sterling value at invoice date and the pounds that land in your account is an exchange gain or loss, handled in your accounts. For that reason it is worth stating clearly on the invoice which currency the customer must pay in, and giving bank details for that currency; the payment details box of the generator is the place for it.</p>
<h2>Invoicing in other currencies from the US, Canada or Australia</h2>
<p>The generator lets you choose any listed currency in every country, and shows the tax in that currency. Our sources for this site contain a sterling-specific rule only for the UK, so for a Canadian, Australian or US business invoicing in a foreign currency, check with the CRA, the ATO or your state how the amounts must be converted for your returns before relying on the invoice figures alone.</p>`;
  },
  related: ['vat-invoice-requirements', 'vat-invoice-generator-uk', 'how-to-write-an-invoice', 'proforma-invoice-template', 'deposit-invoice'],
  sources: ['uk_vat_guide', 'uk_vat_records', 'uk_vat_rates'],
});
