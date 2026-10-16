/**
 * What an invoice must show, country by country, checked against the invoice being typed.
 * Each rule names the source key of params-2026.json that states it. The checker never says an
 * invoice is "legal": it says which required details are present for the case entered.
 */
import { P, PROVINCES, type Country, type SourceKey, type ProvinceCode } from './params';
import type { InvoiceResult } from './invoice';
import { abnValid, ukVatFormatValid, caBnValid, caBnFormatValid, caBnCheckDigitValid, qstValid } from './ids';

export type DocKind = 'invoice' | 'proforma' | 'quote' | 'receipt' | 'credit_note';

export interface Party { name: string; address: string; email?: string; taxId?: string; companyNo?: string; qstNo?: string }
export interface InvoiceDoc {
  country: Country;
  region: string;
  registered: boolean;
  kind: DocKind;
  /** UK: limited company (full registered name required). */
  limitedCompany?: boolean;
  /** UK: sole trader trading under a business name (owner's name and an address for legal documents). */
  tradingName?: boolean;
  ownerName?: string;
  number: string;
  issueDate: string;
  supplyDate?: string;
  dueDate?: string;
  terms?: string;
  currency: string;
  /** Sterling VAT total typed by the user when the invoice is in another currency (UK). */
  vatInGbp?: number;
  seller: Party;
  buyer: Party;
  lineDescriptions: string[];
  reverseCharge?: boolean;
}

export type Status = 'ok' | 'missing' | 'warn' | 'info';
export interface Check { id: string; label: string; status: Status; detail?: string; source: SourceKey }

const has = (s?: string) => !!s && s.trim().length > 0;

export function checkInvoice(doc: InvoiceDoc, r: InvoiceResult): { title: string; rule: string; checks: Check[] } {
  const c: Check[] = [];
  const push = (id: string, label: string, ok: boolean, source: SourceKey, detail?: string, soft = false) =>
    c.push({ id, label, status: ok ? 'ok' : soft ? 'warn' : 'missing', detail, source });
  const descOk = doc.lineDescriptions.length > 0 && doc.lineDescriptions.every(has);
  const total = Math.abs(r.total);

  if (doc.kind === 'quote' || doc.kind === 'proforma') {
    push('number', 'A reference number', has(doc.number), 'uk_invoice');
    push('seller', 'Your name and address', has(doc.seller.name) && has(doc.seller.address), 'uk_invoice');
    push('buyer', 'Customer name', has(doc.buyer.name), 'uk_invoice');
    push('desc', 'A description of each item', descOk, 'uk_invoice');
    c.push({ id: 'notinvoice', label: doc.kind === 'quote' ? 'Marked as a quote, not a demand for payment' : 'Marked as pro forma: not a tax invoice, no tax can be reclaimed on it', status: 'info', source: 'uk_vat_records' });
    return { title: doc.kind === 'quote' ? 'Quote or estimate' : 'Pro forma invoice', rule: 'A quote or a pro forma invoice is not a VAT, GST or tax invoice.', checks: c };
  }

  if (doc.country === 'UK') {
    const vat = doc.registered;
    const simplified = vat && total <= P.uk.simplified_invoice_max;
    push('number', vat ? 'A sequential number that identifies the invoice' : 'A unique identification number', has(doc.number), vat ? 'uk_vat_records' : 'uk_invoice');
    push('seller', 'Your business name, address and contact details', has(doc.seller.name) && has(doc.seller.address), 'uk_invoice');
    if (doc.limitedCompany) push('company', 'Full company name as on the certificate of incorporation', has(doc.seller.name), 'uk_invoice', 'Limited company');
    if (doc.tradingName) push('owner', 'Your own name, as well as the business name, and an address for legal documents', has(doc.ownerName) && has(doc.seller.address), 'uk_invoice', 'Sole trader using a business name');
    push('buyer', 'Customer name and address', has(doc.buyer.name) && (simplified || has(doc.buyer.address)), vat ? 'uk_vat_records' : 'uk_invoice');
    push('desc', 'A clear description of what you are charging for', descOk, 'uk_invoice');
    push('issue', 'Date of the invoice', has(doc.issueDate), 'uk_invoice');
    push('supply', vat ? 'Time of supply (tax point), if different from the invoice date' : 'Date the goods or services were provided', has(doc.supplyDate) || (vat && has(doc.issueDate)), vat ? 'uk_vat_records' : 'uk_invoice', undefined, vat);
    if (vat) {
      push('vatno', 'Your VAT registration number', ukVatFormatValid(doc.seller.taxId ?? ''), 'uk_vat_records', has(doc.seller.taxId) && !ukVatFormatValid(doc.seller.taxId!) ? 'A UK VAT number is 9 digits (or 12 for a branch), with or without GB' : undefined);
      if (!simplified) push('rates', 'For each line: quantity, unit price, VAT rate and amount before VAT', true, 'uk_vat_records');
      if (doc.currency !== 'GBP') push('gbp', 'Total VAT expressed in sterling', (doc.vatInGbp ?? 0) > 0 || r.tax + r.reverseChargeVat === 0, 'uk_vat_records', 'The invoice can be in any currency, the VAT total must also be shown in pounds');
      if (doc.reverseCharge) c.push({ id: 'rc', label: 'Reverse charge wording, VAT not added to the amount due', status: 'ok', detail: P.uk.reverse_charge_wordings[2], source: 'uk_reverse_charge' });
      c.push({ id: 'within', label: `Issue it within ${P.uk.issue_within_days} days of the supply`, status: 'info', source: 'uk_vat_records' });
    } else {
      c.push({ id: 'novat', label: 'No VAT shown: only VAT-registered businesses can charge it', status: r.tax === 0 ? 'ok' : 'missing', source: 'uk_vat_records' });
    }
    return {
      title: vat ? (simplified ? 'Simplified VAT invoice possible (£250 or less)' : 'Full VAT invoice') : 'Invoice, not VAT-registered',
      rule: vat ? 'HMRC, VAT Notice 700/21, section 4' : 'GOV.UK, invoices: what they must include',
      checks: c,
    };
  }

  if (doc.country === 'CA') {
    const qc = doc.region === 'QC';
    const [t1, t2] = P.ca.itc_tiers;
    const tier = total < t1 ? 1 : total < t2 ? 2 : 3;
    push('seller', 'Your name or business name', has(doc.seller.name), 'ca_itc_regs');
    push('issue', 'Invoice date', has(doc.issueDate), 'ca_itc_regs');
    push('total', 'Total amount paid or payable', total > 0, 'ca_itc_regs');
    if (doc.registered) {
      if (tier >= 2) push('bn', 'Your GST/HST registration number', caBnValid(doc.seller.taxId ?? ''), 'ca_itc_regs', has(doc.seller.taxId) && !caBnFormatValid(doc.seller.taxId!) ? 'Format: 9 digits followed by RT and 4 digits, e.g. 123456782 RT0001' : has(doc.seller.taxId) && !caBnCheckDigitValid(doc.seller.taxId!) ? 'The 9-digit business number fails the CRA check digit: check for a mistyped digit' : `Required from $${t1}`);
      if (qc && tier >= 2) push('qst', 'Your QST registration number', qstValid(doc.seller.qstNo ?? ''), 'rq_invoices', 'Format: 10 digits, TQ and 4 digits');
      if (tier >= 2 || qc) push('taxamt', qc && tier === 1 ? 'Amount of QST (required at any amount in Quebec)' : 'Amount of tax, or a statement that the price includes it', true, qc ? 'rq_invoices' : 'ca_itc_regs');
    }
    if (tier === 3) {
      push('buyer', "Customer's name or business name", has(doc.buyer.name), 'ca_itc_regs', `Required from $${t2}`);
      push('terms', 'Terms of payment', has(doc.terms) || has(doc.dueDate), 'ca_itc_regs', `Required from $${t2}`);
    }
    if (tier === 3 || qc) push('desc', 'A description of each item', descOk, qc ? 'rq_invoices' : 'ca_itc_regs');
    else push('desc', 'A description of each item', descOk, 'ca_itc_regs', 'Not required under $500 outside Quebec, but expected', true);
    push('number', 'An invoice number', has(doc.number), 'ca_itc_regs', 'Not in the regulation, but needed to match payments', true);
    const pv = PROVINCES[(doc.region in PROVINCES ? doc.region : 'ON') as ProvinceCode];
    return {
      title: `${pv.name}: ${tier === 1 ? `under $${t1}` : tier === 2 ? `$${t1} to $${t2 - 0.01}` : `$${t2} or more`}`,
      rule: 'Input Tax Credit Information (GST/HST) Regulations, s. 3' + (qc ? ', and Revenu Québec' : ''),
      checks: c,
    };
  }

  if (doc.country === 'AU') {
    const gst = doc.registered;
    if (gst) {
      push('words', "The words 'Tax invoice' (the document is intended to be a tax invoice)", doc.kind === 'invoice', 'ato_tax_invoices');
      push('seller', "Seller's identity", has(doc.seller.name), 'ato_tax_invoices');
      push('abn', "Seller's ABN", abnValid(doc.seller.taxId ?? ''), 'ato_tax_invoices', has(doc.seller.taxId) && !abnValid(doc.seller.taxId!) ? 'This ABN fails the ABR check digit test' : undefined);
      push('issue', 'Date the invoice was issued', has(doc.issueDate), 'ato_tax_invoices');
      push('desc', 'Description of the items, with quantity and price', descOk, 'ato_tax_invoices');
      c.push({ id: 'gstamt', label: r.allTaxableAtOneEleventh ? "GST amount, or 'Total price includes GST'" : 'GST amount payable', status: 'ok', source: 'ato_tax_invoices' });
      c.push({ id: 'extent', label: 'Which items are taxable', status: 'ok', source: 'ato_tax_invoices' });
      if (total >= P.au.buyer_identity_from) push('buyer', "Buyer's identity or ABN", has(doc.buyer.name) || abnValid(doc.buyer.taxId ?? ''), 'ato_tax_invoices', 'Required from $1,000');
      c.push({ id: 'within', label: `Give it within ${P.au.provide_within_days} days if the customer asks (sales over $${P.au.tax_invoice_on_request_above.toFixed(2)})`, status: 'info', source: 'ato_tax_invoices' });
    } else {
      push('seller', 'Your name or business name', has(doc.seller.name), 'ato_register');
      push('abn', 'Your ABN', abnValid(doc.seller.taxId ?? ''), 'abr_abn_format', 'Not a GST requirement, but business customers expect it', true);
      c.push({ id: 'nogst', label: "No GST and not titled 'Tax invoice': you are not registered for GST", status: r.tax === 0 ? 'ok' : 'missing', source: 'ato_register' });
      push('desc', 'A description of each item', descOk, 'ato_tax_invoices', undefined, true);
    }
    return { title: gst ? (total >= P.au.buyer_identity_from ? 'Tax invoice, $1,000 or more' : 'Tax invoice, under $1,000') : 'Invoice, not registered for GST', rule: gst ? 'ATO, tax invoices' : 'ATO, registering for GST', checks: c };
  }

  // US: no federal invoice law. The checker lists what customers and states usually need.
  push('number', 'An invoice number', has(doc.number), 'us_states', undefined, true);
  push('seller', 'Your business name and address', has(doc.seller.name) && has(doc.seller.address), 'us_states', undefined, true);
  push('buyer', 'Customer name and billing address', has(doc.buyer.name), 'us_states', undefined, true);
  push('desc', 'A description of each item', descOk, 'us_states', undefined, true);
  push('due', 'Due date or payment terms', has(doc.dueDate) || has(doc.terms), 'us_states', undefined, true);
  if (doc.registered) c.push({ id: 'tax', label: 'Sales tax shown as its own line, with the rate', status: 'ok', source: 'us_states' });
  return { title: 'United States: no federal invoice format', rule: 'State sales tax rules apply to what you charge, not to the invoice layout.', checks: c };
}
