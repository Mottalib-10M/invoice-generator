/**
 * What the document says, built once for the on-screen preview and the PDF so that both always
 * print the same words and figures.
 */
import { COUNTRY_INFO, PROVINCES, type ProvinceCode } from './engine/params';
import type { InvoiceResult } from './engine/invoice';
import { TERMS } from './engine/terms';
import { formatAbn } from './engine/ids';
import { docTitle, longDate, money, type InvoiceState } from './invoice-model';

export interface DocView {
  title: string;
  sellerLines: string[];
  sellerIds: string[];
  buyerTitle: string;
  buyerLines: string[];
  meta: Array<[string, string]>;
  head: { desc: string; qty: string; price: string; tax: string; amount: string };
  rows: Array<{ desc: string; qty: string; price: string; tax: string; amount: string }>;
  showTaxCol: boolean;
  totals: Array<{ label: string; value: string; strong?: boolean }>;
  statements: string[];
  payment: string;
  notes: string;
  footer: string;
}

const pct = (r: number) => `${+(r * 100).toFixed(3)}%`;

export function buildView(st: InvoiceState, r: InvoiceResult): DocView {
  const c = st.country, cur = st.currency;
  const m = (n: number) => money(n, cur, c);
  const d = (iso: string) => longDate(iso, c);
  const title = docTitle(st);
  const ids: string[] = [];
  const tid = st.seller.taxId?.trim();
  if (c === 'UK' && st.registered && tid) ids.push(`VAT reg. no. ${tid}`);
  if (c === 'UK' && st.seller.companyNo?.trim()) ids.push(`Company no. ${st.seller.companyNo.trim()}`);
  if (c === 'CA' && st.registered && tid) ids.push(`GST/HST no. ${tid}`);
  if (c === 'CA' && st.region === 'QC' && st.registered && st.seller.qstNo?.trim()) ids.push(`QST no. ${st.seller.qstNo.trim()}`);
  if (c === 'AU' && tid) ids.push(`ABN ${formatAbn(tid)}`);
  if (c === 'US' && tid) ids.push(`Sales tax permit / EIN ${tid}`);

  const sellerLines = [c === 'UK' && st.tradingName && st.ownerName.trim() ? `${st.ownerName.trim()} trading as ${st.seller.name}` : st.seller.name, ...st.seller.address.split('\n'), st.seller.email ?? '', st.seller.phone ?? ''].map((x) => x.trim()).filter(Boolean);
  const buyerLines = [st.buyer.name, ...st.buyer.address.split('\n')].map((x) => x.trim()).filter(Boolean);
  if (st.buyer.taxId?.trim()) buyerLines.push(c === 'AU' ? `ABN ${formatAbn(st.buyer.taxId.trim())}` : c === 'UK' ? `VAT reg. no. ${st.buyer.taxId.trim()}` : st.buyer.taxId.trim());

  const meta: Array<[string, string]> = [];
  const numLabel = st.kind === 'quote' ? (c === 'US' ? 'Estimate no.' : 'Quote no.') : st.kind === 'credit_note' ? `${title} no.` : st.kind === 'receipt' ? 'Receipt no.' : 'Invoice no.';
  meta.push([numLabel, st.number]);
  meta.push([c === 'UK' && st.registered ? 'Date of issue' : 'Date', d(st.issueDate)]);
  if (st.supplyDate && st.supplyDate !== st.issueDate) meta.push([c === 'UK' && st.registered ? 'Time of supply (tax point)' : 'Supply date', d(st.supplyDate)]);
  if (st.kind === 'credit_note' && st.reference.trim()) meta.push(['Against invoice', st.reference.trim()]);
  if (st.kind === 'invoice' || st.kind === 'proforma') {
    const t = TERMS.find((x) => x.value === st.terms);
    if (t) meta.push(['Terms', t.label]);
    if (st.dueDate) meta.push(['Due date', d(st.dueDate)]);
  }
  if (st.kind === 'quote' && st.dueDate) meta.push(['Valid until', d(st.dueDate)]);
  if (st.poNumber.trim()) meta.push(['PO number', st.poNumber.trim()]);

  const showTaxCol = st.registered && c !== 'US';
  const head = { desc: 'Description', qty: st.hourly ? 'Hours' : 'Qty', price: st.hourly ? 'Rate' : st.inclusive ? 'Unit price incl. tax' : 'Unit price', tax: c === 'UK' ? 'VAT rate' : 'Tax', amount: st.inclusive ? 'Amount incl. tax' : c === 'UK' && st.registered ? 'Amount excl. VAT' : 'Amount' };
  const rows = r.lines.map((l) => ({
    desc: l.desc + (l.materials && st.cis !== 'none' ? ' (materials)' : ''),
    qty: new Intl.NumberFormat(COUNTRY_INFO[c].locale, { maximumFractionDigits: 3 }).format(l.qty),
    price: m(l.price),
    tax: l.rateLabel.replace(/^Sales tax \w+ /, ''),
    amount: m(st.inclusive ? l.qty * l.price : l.net),
  }));

  const totals: DocView['totals'] = [];
  totals.push({ label: st.inclusive ? 'Subtotal excl. tax' : 'Subtotal', value: m(r.subtotal) });
  if (r.discount > 0) totals.push({ label: `Discount ${pct(st.discountPct / 100)}`, value: `−${m(r.discount)}` });
  if (r.shipping > 0) totals.push({ label: 'Shipping', value: m(r.shipping) });
  for (const b of r.bands) {
    if (b.rate === 0) { if (c === 'UK') totals.push({ label: `VAT 0% on ${m(b.base)}`, value: m(0) }); continue; }
    let label = `${b.label} ${pct(b.rate)}`;
    if (c === 'US') { const local = st.localRate ? ` incl. ${pct(st.localRate / 100)} local` : ''; label = `Sales tax ${st.region} ${pct(b.rate)}${local}`; }
    totals.push({ label: `${label} on ${m(b.base)}`, value: b.charged ? m(b.amount) : `${m(b.amount)} (reverse charge)` });
  }
  if (st.registered && r.reverseChargeVat > 0) totals.push({ label: 'VAT to be accounted for by the customer', value: m(r.reverseChargeVat) });
  const credit = st.kind === 'credit_note';
  totals.push({ label: credit ? 'Total credit' : st.kind === 'quote' ? 'Total' : 'Total', value: m(r.total), strong: true });
  if (r.cisDeduction > 0) totals.push({ label: `CIS deduction ${pct(Number(st.cis))} on labour ${m(r.cisBase)}`, value: `−${m(r.cisDeduction)}` });
  if (st.kind === 'receipt') totals.push({ label: 'Amount paid', value: m(r.total - r.cisDeduction), strong: true });
  else if (r.paid > 0) totals.push({ label: 'Paid', value: `−${m(r.paid)}` });
  if ((st.kind === 'invoice' || st.kind === 'proforma') && (r.paid > 0 || r.cisDeduction > 0)) totals.push({ label: 'Balance due', value: m(r.due), strong: true });

  const statements: string[] = [];
  if (c === 'UK' && st.registered && st.reverseCharge) statements.push('Reverse charge: customer to pay the VAT to HMRC. VAT Act 1994 Section 55A applies.');
  if (c === 'UK' && !st.registered) statements.push('Not registered for VAT: no VAT has been charged.');
  if (c === 'UK' && st.registered && cur !== 'GBP' && (r.tax > 0 || r.reverseChargeVat > 0) && st.vatInGbp > 0) statements.push(`VAT total in sterling: ${money(st.vatInGbp, 'GBP', 'UK')}`);
  if (c === 'AU' && st.registered && r.allTaxableAtOneEleventh && st.inclusive) statements.push('Total price includes GST.');
  if (c === 'AU' && !st.registered) statements.push('No GST has been charged: the supplier is not registered for GST.');
  if (c === 'CA' && st.registered) {
    const pv = PROVINCES[(st.region in PROVINCES ? st.region : 'ON') as ProvinceCode];
    if (st.inclusive) statements.push(`Prices include ${pv.kind === 'hst' ? 'HST' : pv.kind === 'gst' ? 'GST' : `GST and ${pv.pst_name}`}.`);
  }
  if (st.kind === 'proforma') statements.push('This is a pro forma invoice, not a tax invoice. No tax can be reclaimed on it.');
  if (st.kind === 'quote') statements.push('This is a quote, not a request for payment.');

  return {
    title, sellerLines, sellerIds: ids, buyerTitle: st.kind === 'receipt' ? 'Received from' : st.kind === 'quote' ? 'Prepared for' : 'Bill to', buyerLines, meta, head, rows, showTaxCol, totals, statements,
    payment: st.kind === 'receipt' || st.kind === 'credit_note' ? '' : st.payment, notes: st.notes,
    footer: `${title} ${st.number}`,
  };
}
