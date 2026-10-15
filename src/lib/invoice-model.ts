/**
 * The invoice being edited: its state, its defaults per country and per template, and the
 * conversions to the engine's inputs. First render uses these defaults and __BUILD_DAY__ only
 * (RECETTE §17.5); what the visitor saved in this browser is applied after mount.
 */
import { COUNTRY_INFO, type Country } from './engine/params';
import { defaultTax, normaliseTax, type InvoiceInput, type Line, type TaxCode } from './engine/invoice';
import type { DocKind, InvoiceDoc, Party } from './engine/compliance';
import { dueDate, type Terms } from './engine/terms';

declare const __BUILD_DAY__: string;
export const BUILD_DAY: string = typeof __BUILD_DAY__ !== 'undefined' ? __BUILD_DAY__ : '2026-10-15';

export interface Seller extends Party { phone?: string; website?: string }
export interface InvoiceState {
  country: Country;
  region: string;
  registered: boolean;
  localRate: number;
  inclusive: boolean;
  kind: DocKind;
  number: string;
  issueDate: string;
  supplyDate: string;
  terms: Terms | 'custom';
  dueDate: string;
  currency: string;
  poNumber: string;
  reference: string; // credit note: original invoice number
  seller: Seller;
  buyer: Party;
  ownerName: string;
  limitedCompany: boolean;
  tradingName: boolean;
  lines: Line[];
  discountPct: number;
  shipping: number;
  paid: number;
  reverseCharge: boolean;
  cis: 'none' | '0.2' | '0.3' | '0';
  vatInGbp: number;
  notes: string;
  payment: string;
  logo: string; // data URL, kept in this browser only
  hourly: boolean; // quantity column labelled "Hours" and price "Rate"
}

export const REGION_DEFAULT: Record<Country, string> = { US: 'TX', UK: 'ENG', CA: 'ON', AU: 'NSW' };
export const AU_STATES = [['NSW', 'New South Wales'], ['VIC', 'Victoria'], ['QLD', 'Queensland'], ['WA', 'Western Australia'], ['SA', 'South Australia'], ['TAS', 'Tasmania'], ['ACT', 'Australian Capital Territory'], ['NT', 'Northern Territory']] as const;
export const UK_NATIONS = [['ENG', 'England'], ['SCT', 'Scotland'], ['WLS', 'Wales'], ['NIR', 'Northern Ireland']] as const;

/** Sample business details per country: realistic, clearly fictitious, replaced by the visitor. */
const SAMPLE: Record<Country, { seller: Seller; buyer: Party; payment: string; lines: Line[] }> = {
  US: {
    seller: { name: 'Juniper Lane Studio LLC', address: '418 Congress Ave, Suite 200\nAustin, TX 78701', email: 'billing@example.com', taxId: '' },
    buyer: { name: 'Bluebonnet Coffee Co.', address: '2200 S Lamar Blvd\nAustin, TX 78704', taxId: '' },
    payment: 'ACH: routing 000000000, account 0000000000\nPlease include the invoice number with your payment.',
    lines: [{ desc: 'Brand identity design, logo and guidelines', qty: 1, price: 1800, tax: 'exempt' }, { desc: 'Printed menu boards', qty: 4, price: 85, tax: 'taxable' }],
  },
  UK: {
    seller: { name: 'Harbour Design Ltd', address: '12 Quay Street\nBristol BS1 4DB', email: 'accounts@example.co.uk', taxId: 'GB 123 4567 89', companyNo: '' },
    buyer: { name: 'Northgate Bakery Ltd', address: '5 Northgate\nBath BA1 5AS', taxId: '' },
    payment: 'Bank transfer: sort code 00-00-00, account 00000000\nReference: the invoice number',
    lines: [{ desc: 'Website design, 3 pages', qty: 1, price: 1200, tax: 'standard' }, { desc: 'Hosting, 12 months', qty: 12, price: 15, tax: 'standard' }],
  },
  CA: {
    seller: { name: 'Maple Ridge Consulting Inc.', address: '100 King St W, Suite 5600\nToronto, ON M5X 1C9', email: 'invoices@example.ca', taxId: '123456789 RT0001', qstNo: '' },
    buyer: { name: 'Lakeshore Outfitters Ltd.', address: '250 Queens Quay W\nToronto, ON M5J 2N2', taxId: '' },
    payment: 'Interac e-Transfer to invoices@example.ca\nor EFT: transit 00000, institution 000, account 0000000',
    lines: [{ desc: 'Process review and recommendations', qty: 12, price: 150, tax: 'ca_full' }, { desc: 'Workshop materials', qty: 1, price: 240, tax: 'ca_full' }],
  },
  AU: {
    seller: { name: 'Saltbush Creative Pty Ltd', address: '88 George Street\nSydney NSW 2000', email: 'accounts@example.com.au', taxId: '51 824 753 556' },
    buyer: { name: 'Coastal Surf Supplies', address: '14 Campbell Parade\nBondi Beach NSW 2026', taxId: '' },
    payment: 'Bank transfer: BSB 000-000, account 00000000\nPayID: accounts@example.com.au',
    lines: [{ desc: 'Product photography, half day', qty: 1, price: 900, tax: 'gst' }, { desc: 'Image licensing, 20 images', qty: 20, price: 25, tax: 'gst' }],
  },
};

export function defaults(country: Country = 'US'): InvoiceState {
  const s = SAMPLE[country];
  return {
    country, region: REGION_DEFAULT[country], registered: true, localRate: 0, inclusive: false, kind: 'invoice',
    number: `INV-${BUILD_DAY.slice(0, 4)}-0001`, issueDate: BUILD_DAY, supplyDate: '', terms: 'net30', dueDate: dueDate(BUILD_DAY, 'net30'),
    currency: COUNTRY_INFO[country].currency, poNumber: '', reference: '',
    seller: { ...s.seller }, buyer: { ...s.buyer }, ownerName: '', limitedCompany: country === 'UK', tradingName: false,
    lines: s.lines.map((l) => ({ ...l })), discountPct: 0, shipping: 0, paid: 0, reverseCharge: false, cis: 'none', vatInGbp: 0,
    notes: 'Thank you for your business.', payment: s.payment, logo: '', hourly: false,
  };
}

/** Switching country keeps the visitor's text but resets what belongs to the tax system. */
export function withCountry(st: InvoiceState, country: Country): InvoiceState {
  const region = REGION_DEFAULT[country];
  return {
    ...st, country, region, currency: COUNTRY_INFO[country].currency, reverseCharge: false, cis: 'none', localRate: 0,
    lines: st.lines.map((l) => ({ ...l, tax: normaliseTax(l.tax, { country, region }) })),
  };
}

export function toInput(st: InvoiceState): InvoiceInput {
  return {
    country: st.country, region: st.region, registered: st.registered, localRate: st.localRate, inclusive: st.inclusive,
    lines: st.lines, discountPct: st.discountPct, shipping: st.shipping, shippingTax: defaultTax(st.country) as TaxCode,
    reverseCharge: st.country === 'UK' && st.reverseCharge, cisRate: st.country === 'UK' && st.cis !== 'none' ? Number(st.cis) : undefined,
    paid: st.paid,
  };
}

export function toDoc(st: InvoiceState): InvoiceDoc {
  return {
    country: st.country, region: st.region, registered: st.registered, kind: st.kind, limitedCompany: st.limitedCompany, tradingName: st.tradingName,
    ownerName: st.ownerName, number: st.number, issueDate: st.issueDate, supplyDate: st.supplyDate, dueDate: st.dueDate,
    terms: st.terms === 'custom' ? '' : st.terms, currency: st.currency, vatInGbp: st.vatInGbp, seller: st.seller, buyer: st.buyer,
    lineDescriptions: st.lines.map((l) => l.desc), reverseCharge: st.reverseCharge,
  };
}

/** The title printed at the top of the document, with each country's own words. */
export function docTitle(st: Pick<InvoiceState, 'country' | 'kind' | 'registered'>): string {
  const { country: c, kind: k, registered: r } = st;
  if (k === 'quote') return c === 'US' ? 'Estimate' : 'Quote';
  if (k === 'proforma') return 'Pro forma invoice';
  if (k === 'receipt') return c === 'AU' && r ? 'Tax invoice / Receipt' : 'Receipt';
  if (k === 'credit_note') return c === 'AU' && r ? 'Adjustment note' : c === 'US' ? 'Credit memo' : 'Credit note';
  if (c === 'AU' && r) return 'Tax invoice';
  if (c === 'UK' && r) return 'VAT invoice';
  return 'Invoice';
}

export const CURRENCIES = ['USD', 'GBP', 'CAD', 'AUD', 'EUR', 'NZD', 'CHF', 'JPY', 'SGD', 'HKD', 'INR', 'ZAR', 'SEK', 'NOK', 'DKK', 'MXN', 'AED'];

export function money(n: number, currency: string, country: Country): string {
  const locale = COUNTRY_INFO[country].locale;
  try { return new Intl.NumberFormat(locale, { style: 'currency', currency, currencyDisplay: 'symbol' }).format(n); }
  catch { return `${currency} ${n.toFixed(2)}`; }
}

export function longDate(iso: string, country: Country): string {
  if (!iso) return '';
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString(COUNTRY_INFO[country].locale, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}

/** Fields remembered in this browser for the next invoice (never sent anywhere). */
export const REMEMBER: Array<keyof InvoiceState> = ['country', 'region', 'registered', 'localRate', 'seller', 'ownerName', 'limitedCompany', 'tradingName', 'currency', 'payment', 'notes', 'logo', 'number'];
export const STORAGE_KEY = 'tim-invoice-v1';
