/** Templates: each one starts the generator from a document that fits its use. */
import type { Country } from './engine/params';
import type { Line } from './engine/invoice';
import { defaults, type InvoiceState } from './invoice-model';

export type PresetId = 'standard' | 'freelance' | 'contractor' | 'consulting' | 'hourly' | 'proforma' | 'credit_note' | 'receipt' | 'estimate' | 'cis' | 'sole_trader' | 'no_gst' | 'quebec' | 'blank';

interface Preset { country?: Country; patch: (s: InvoiceState) => Partial<InvoiceState> }
const L = (desc: string, qty: number, price: number, s: InvoiceState, materials?: boolean): Line => ({ desc, qty, price, tax: s.lines[0]?.tax ?? 'taxable', ...(materials ? { materials } : {}) });

export const PRESETS: Record<PresetId, Preset> = {
  standard: { patch: () => ({}) },
  freelance: { patch: (s) => ({ lines: [L('Feature article, 1,500 words', 3, 450, s), L('Interview transcription', 2, 60, s)], notes: 'Payment within 14 days of this invoice. Thank you!', terms: 'net14' }) },
  contractor: { patch: (s) => ({ lines: [L('Labor: kitchen remodel, phase 2', 38, 65, s), L('Materials: cabinets and fixtures', 1, 2140, s)], notes: 'Work completed as per the agreed scope. Retainage, if any, is shown as a payment received.', terms: 'net15' }) },
  consulting: { patch: (s) => ({ lines: [L('Strategy consulting, day rate', 4, 1200, s), L('Market analysis report', 1, 2500, s)], notes: 'Engagement letter dated at the start of the project applies.', terms: 'net30' }) },
  hourly: { patch: (s) => ({ hourly: true, lines: [L('Development, sprint 14 (timesheet attached)', 32.5, 95, s), L('Code review and deployment', 6, 95, s)], terms: 'net14' }) },
  proforma: { patch: (s) => ({ kind: 'proforma', number: 'PF-2026-0001', notes: 'Pro forma invoice for advance payment or customs. Not a tax invoice: a final invoice follows on delivery.', lines: [L('Industrial sewing machines, model 4000', 2, 3200, s), L('Freight to destination', 1, 450, s)] }) },
  credit_note: { patch: (s) => ({ kind: 'credit_note', number: 'CN-2026-0001', reference: 'INV-2026-0042', notes: 'Credit for returned goods against the invoice referenced above.', lines: [L('Returned item: desk lamp, faulty', 2, 49, s)] }) },
  receipt: { patch: (s) => ({ kind: 'receipt', number: 'R-2026-0001', terms: 'receipt', notes: 'Paid in full, thank you.', lines: [L('Annual maintenance service', 1, 180, s)] }) },
  estimate: { patch: (s) => ({ kind: 'quote', number: 'Q-2026-0001', notes: 'This quote is valid for 30 days. Prices are firm for the scope described.', lines: [L('Garden landscaping, design and planting', 1, 3400, s), L('Plants and materials (estimate)', 1, 1250, s)] }) },
  cis: { country: 'UK', patch: (s) => ({ reverseCharge: true, cis: '0.2', lines: [{ ...L('Labour: first fix electrics, plot 7', 1, 2400, s) }, { ...L('Materials: cable, back boxes and consumer unit', 1, 860, s, true) }], seller: { ...s.seller, name: 'R. Patel Electrical Ltd' }, buyer: { ...s.buyer, name: 'Westbury Homes Ltd', address: '1 Station Road\nBristol BS2 0AA' }, notes: 'CIS deduction at 20% on labour. Please send a payment and deduction statement.' }) },
  sole_trader: { country: 'UK', patch: (s) => ({ registered: false, limitedCompany: false, tradingName: true, ownerName: 'Sam Carter', seller: { ...s.seller, name: 'Carter Gardening', taxId: '', address: '27 Elm Grove\nLeeds LS6 2AQ' }, lines: [L('Garden maintenance, October (4 visits)', 4, 70, s), L('Green waste removal', 1, 45, s)], notes: 'Not registered for VAT.' }) },
  no_gst: { country: 'AU', patch: (s) => ({ registered: false, seller: { ...s.seller, name: 'Mia Nguyen Photography' }, lines: [L('Event photography, 3 hours', 3, 180, s), L('Edited digital images', 1, 150, s)], notes: 'No GST has been charged: not registered for GST.' }) },
  quebec: { country: 'CA', patch: (s) => ({ region: 'QC', seller: { ...s.seller, name: 'Atelier Saint-Laurent inc.', address: '1000 rue Sherbrooke O\nMontréal QC H3A 3G4', qstNo: '1234567890 TQ0001' }, buyer: { ...s.buyer, name: 'Boulangerie du Plateau', address: '4300 boul. Saint-Laurent\nMontréal QC H2W 1Z3' } }) },
  blank: { patch: (s) => ({ seller: { name: '', address: '', email: '', taxId: '' }, buyer: { name: '', address: '', taxId: '' }, lines: [{ desc: '', qty: 1, price: 0, tax: s.lines[0]?.tax ?? 'taxable' }], notes: '', payment: '' }) },
};

export function initialState(country: Country, preset: PresetId = 'standard'): InvoiceState {
  const p = PRESETS[preset];
  const base = defaults(p.country ?? country);
  return { ...base, ...p.patch(base) };
}
