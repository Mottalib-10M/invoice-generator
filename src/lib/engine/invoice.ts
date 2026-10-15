/**
 * Invoice arithmetic for the four countries. Pure functions, no I/O: the generator, the PDF and
 * every mini-calculator call these. Rules applied, each with its source in params-2026.json:
 *  - US: state rate (us-states.json) + local rate typed by the user, on taxable lines only.
 *  - UK: VAT 20 / 5 / 0 %, exempt and outside scope; total VAT rounded down to the penny
 *    (VAT Notice 700, 17.5); domestic reverse charge (no VAT added, amount stated);
 *    CIS deduction on the labour part only, excluding VAT and materials.
 *  - CA: GST 5 %, HST by province, PST (BC, SK), RST (MB), QST (QC) on the price before GST.
 *  - AU: GST 10 %; with GST-inclusive prices the GST is one-eleventh; rounding to the nearest
 *    cent, half a cent up (ATO, total invoice rule).
 */
import { P, PROVINCES, usState, type Country, type ProvinceCode } from './params';

export type TaxCode =
  | 'taxable' | 'exempt' // US
  | 'standard' | 'reduced' | 'zero' | 'vat_exempt' | 'outside' // UK
  | 'ca_full' | 'ca_gst_only' | 'ca_zero' | 'ca_exempt' // CA: full = GST/HST (+ PST/QST where it applies)
  | 'gst' | 'gst_free' | 'input_taxed'; // AU

export interface Line { desc: string; qty: number; price: number; tax: TaxCode; /** UK CIS: materials are not subject to the deduction. */ materials?: boolean }

export interface InvoiceInput {
  country: Country;
  /** US state code or Canadian province code. */
  region: string;
  /** Registered for VAT / GST / HST, or collecting sales tax (US). Unregistered: no tax added. */
  registered: boolean;
  /** US: local (city, county, district) rate in percent, added to the state rate. */
  localRate?: number;
  /** Unit prices typed tax included (common in Australian and UK retail). */
  inclusive?: boolean;
  lines: Line[];
  /** Discount on the whole invoice, percent (0 to 100), applied before tax. */
  discountPct?: number;
  shipping?: number;
  shippingTax?: TaxCode;
  /** UK domestic reverse charge for construction services (s55A VATA 1994). */
  reverseCharge?: boolean;
  /** UK CIS deduction rate: 0.2, 0.3 or 0 (gross payment status). Undefined = no CIS. */
  cisRate?: number;
  /** Deposit or payment already received. */
  paid?: number;
}

export interface TaxBand { key: string; label: string; rate: number; base: number; amount: number; charged: boolean }
export interface LineOut extends Line { net: number; gross: number; rateLabel: string }
export interface InvoiceResult {
  lines: LineOut[];
  subtotal: number; // sum of line nets before discount
  discount: number;
  shipping: number;
  net: number; // after discount, shipping included, before tax
  bands: TaxBand[];
  tax: number; // tax added to the amount due
  reverseChargeVat: number; // UK: VAT the customer accounts for
  total: number;
  cisBase: number;
  cisDeduction: number;
  paid: number;
  due: number;
  /** All taxable lines carry GST of exactly one-eleventh of the price (AU wording "Total price includes GST"). */
  allTaxableAtOneEleventh: boolean;
  notes: string[];
}

/** Half up to the cent, guarded against binary noise (1.005 → 1.01). */
export const round2 = (x: number) => Math.sign(x) * Math.round((Math.abs(x) + Number.EPSILON) * 100) / 100;
/** Down to the penny (UK concession), guarded the same way. */
export const floor2 = (x: number) => Math.sign(x) * Math.floor((Math.abs(x) + 1e-9) * 100) / 100;

/** Rates that apply to one line, as [band key, label, rate][]. */
export function lineRates(inp: InvoiceInput, tax: TaxCode): Array<[string, string, number]> {
  if (!inp.registered) return [];
  switch (inp.country) {
    case 'US': {
      if (tax !== 'taxable') return [];
      const st = usState(inp.region);
      const rate = (st.rate + (inp.localRate ?? 0)) / 100;
      return rate > 0 ? [['sales', `Sales tax ${st.code}`, rate]] : [];
    }
    case 'UK': {
      const r = P.uk.vat_rates;
      if (tax === 'standard') return [['vat20', 'VAT', r.standard]];
      if (tax === 'reduced') return [['vat5', 'VAT', r.reduced]];
      if (tax === 'zero') return [['vat0', 'VAT', r.zero]];
      return [];
    }
    case 'CA': {
      const pv = PROVINCES[(inp.region in PROVINCES ? inp.region : 'ON') as ProvinceCode];
      if (tax === 'ca_zero' || tax === 'ca_exempt') return [];
      if (pv.kind === 'hst') return [['hst', 'HST', pv.hst!]];
      const out: Array<[string, string, number]> = [['gst', 'GST', P.ca.gst]];
      if (tax === 'ca_full' && (pv.kind === 'gst_pst' || pv.kind === 'gst_qst')) out.push(['pst', pv.pst_name!, pv.pst!]);
      return out;
    }
    case 'AU':
      return tax === 'gst' ? [['gst', 'GST', P.au.gst]] : [];
  }
}

export function rateLabel(inp: InvoiceInput, tax: TaxCode): string {
  const rs = lineRates(inp, tax);
  if (!inp.registered) return 'No tax';
  if (rs.length) return rs.map(([, l, r]) => `${l} ${+(r * 100).toFixed(3)}%`).join(' + ');
  const names: Partial<Record<TaxCode, string>> = { exempt: 'Not taxable', vat_exempt: 'Exempt', outside: 'Outside the scope', zero: 'VAT 0%', ca_zero: 'Zero-rated', ca_exempt: 'Exempt', gst_free: 'GST-free', input_taxed: 'Input-taxed' };
  return names[tax] ?? 'No tax';
}

export function computeInvoice(inp: InvoiceInput): InvoiceResult {
  const notes: string[] = [];
  const disc = Math.min(Math.max(inp.discountPct ?? 0, 0), 100) / 100;
  const lines: LineOut[] = [];
  const bandMap = new Map<string, TaxBand>();
  let subtotal = 0, discount = 0, allOneEleventh = true, anyTaxable = false;
  let cisBase = 0;

  const add = (key: string, label: string, rate: number, base: number) => {
    const k = `${key}:${rate}`;
    const b = bandMap.get(k) ?? { key: k, label, rate, base: 0, amount: 0, charged: !(inp.country === 'UK' && inp.reverseCharge) };
    b.base += base; b.amount += base * rate; bandMap.set(k, b);
  };

  const process = (desc: string, qty: number, price: number, tax: TaxCode, materials: boolean | undefined, discountable: boolean): LineOut => {
    const rates = lineRates(inp, tax);
    const sumRate = rates.reduce((s, [, , r]) => s + r, 0);
    const amount = round2(qty * price); // line amount as typed (net, or gross if inclusive)
    // Inclusive prices: the typed amount carries the tax; the net is backed out of it.
    const lineNet = inp.inclusive && sumRate > 0 ? amount / (1 + sumRate) : amount;
    const afterDisc = discountable ? lineNet * (1 - disc) : lineNet;
    if (discountable) { subtotal += lineNet; discount += lineNet * disc; }
    for (const [k, l, r] of rates) add(k, l, r, afterDisc);
    if (rates.length) { anyTaxable = true; if (!(inp.country === 'AU' && Math.abs(sumRate - 0.1) < 1e-12)) allOneEleventh = false; }
    if (inp.country === 'UK' && inp.cisRate !== undefined && !materials) cisBase += afterDisc;
    return { desc, qty, price, tax, materials, net: lineNet, gross: lineNet * (1 + sumRate), rateLabel: rateLabel(inp, tax) };
  };

  for (const l of inp.lines) lines.push(process(l.desc, l.qty, l.price, l.tax, l.materials, true));
  const ship = Math.max(inp.shipping ?? 0, 0);
  let shippingNet = 0;
  if (ship > 0) {
    const sl = process('Shipping', 1, ship, inp.shippingTax ?? defaultTax(inp.country), true, false);
    shippingNet = sl.net;
  }

  const bands = [...bandMap.values()].sort((a, b) => b.rate - a.rate);
  // Rounding of the tax.
  let taxExact = bands.reduce((s, b) => s + b.amount, 0);
  let taxTotal: number;
  if (inp.country === 'UK') {
    taxTotal = floor2(taxExact); // VAT Notice 700, 17.5: total VAT may be rounded down to a whole penny
    for (const b of bands) b.amount = round2(b.amount);
    const diff = round2(taxTotal - bands.reduce((s, b) => s + b.amount, 0));
    if (diff !== 0 && bands.length) bands[0].amount = round2(bands[0].amount + diff);
  } else {
    for (const b of bands) b.amount = round2(b.amount);
    taxTotal = round2(bands.reduce((s, b) => s + b.amount, 0));
  }
  for (const b of bands) b.base = round2(b.base);

  const net = round2(subtotal - discount + shippingNet);
  const reverse = inp.country === 'UK' && !!inp.reverseCharge && inp.registered;
  const reverseChargeVat = reverse ? taxTotal : 0;
  const tax = reverse ? 0 : taxTotal;
  if (reverse) notes.push('Reverse charge: customer to pay the VAT to HMRC');
  // Inclusive prices: the total is what was typed (less discount), the tax is backed out.
  const total = round2(net + tax);
  const cisDeduction = inp.country === 'UK' && inp.cisRate !== undefined ? round2(cisBase * inp.cisRate) : 0;
  const paid = Math.max(inp.paid ?? 0, 0);
  const due = round2(total - cisDeduction - paid);
  if (inp.country === 'AU' && inp.registered && anyTaxable && allOneEleventh) notes.push('Total price includes GST');
  return {
    lines, subtotal: round2(subtotal), discount: round2(discount), shipping: round2(shippingNet), net, bands, tax, reverseChargeVat, total,
    cisBase: round2(cisBase), cisDeduction, paid: round2(paid), due, allTaxableAtOneEleventh: anyTaxable && allOneEleventh, notes,
  };
}

export function defaultTax(c: Country): TaxCode {
  return c === 'US' ? 'taxable' : c === 'UK' ? 'standard' : c === 'CA' ? 'ca_full' : 'gst';
}

/** Tax codes offered for a country, with their labels for the line selector. */
export function taxOptions(inp: Pick<InvoiceInput, 'country' | 'region'>): Array<{ value: TaxCode; label: string }> {
  switch (inp.country) {
    case 'US': return [{ value: 'taxable', label: 'Taxable' }, { value: 'exempt', label: 'Not taxable' }];
    case 'UK': return [{ value: 'standard', label: 'VAT 20%' }, { value: 'reduced', label: 'VAT 5%' }, { value: 'zero', label: 'VAT 0%' }, { value: 'vat_exempt', label: 'Exempt' }, { value: 'outside', label: 'Outside scope' }];
    case 'CA': {
      const pv = PROVINCES[(inp.region in PROVINCES ? inp.region : 'ON') as ProvinceCode];
      if (pv.kind === 'hst') return [{ value: 'ca_full', label: `HST ${+(pv.hst! * 100).toFixed(3)}%` }, { value: 'ca_zero', label: 'Zero-rated' }, { value: 'ca_exempt', label: 'Exempt' }];
      if (pv.kind === 'gst') return [{ value: 'ca_full', label: 'GST 5%' }, { value: 'ca_zero', label: 'Zero-rated' }, { value: 'ca_exempt', label: 'Exempt' }];
      return [{ value: 'ca_full', label: `GST + ${pv.pst_name}` }, { value: 'ca_gst_only', label: `GST only, no ${pv.pst_name}` }, { value: 'ca_zero', label: 'Zero-rated' }, { value: 'ca_exempt', label: 'Exempt' }];
    }
    case 'AU': return [{ value: 'gst', label: 'GST 10%' }, { value: 'gst_free', label: 'GST-free' }, { value: 'input_taxed', label: 'Input-taxed' }];
  }
}

/** Moves a line's tax code to the nearest one valid in another country or province. */
export function normaliseTax(tax: TaxCode, inp: Pick<InvoiceInput, 'country' | 'region'>): TaxCode {
  const opts = taxOptions(inp).map((o) => o.value);
  if (opts.includes(tax)) return tax;
  // Closest meaning first: "not taxable / exempt" maps to the exempt code, "zero-rated" to zero.
  const exemptLike: TaxCode[] = ['exempt', 'vat_exempt', 'outside', 'ca_exempt', 'input_taxed', 'gst_free'];
  const zeroLike: TaxCode[] = ['zero', 'ca_zero', 'gst_free', 'exempt'];
  if (exemptLike.includes(tax)) return opts.find((o) => exemptLike.includes(o)) ?? opts[0];
  if (zeroLike.includes(tax)) return opts.find((o) => zeroLike.includes(o)) ?? opts[0];
  return opts[0];
}

/** Combined US rate for a state and an optional local rate, percent. */
export function usCombinedRate(state: string, local = 0): number {
  const s = usState(state);
  return +(s.rate + local).toFixed(4);
}
