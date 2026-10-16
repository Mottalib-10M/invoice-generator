/**
 * Reference cases. Each expected figure was worked out by hand from the rule in the source named
 * in the comment, then compared with the engine (RECETTE §17.4, point 5).
 */
import { describe, it, expect } from 'vitest';
import { computeInvoice, type InvoiceInput } from './invoice';
import { checkInvoice, type InvoiceDoc } from './compliance';
import { abnValid, ukVatFormatValid, caBnValid, caBnCheckDigitValid, caBnFormatValid, qstValid } from './ids';
import { ukLateInterest, earlyDiscount, nextNumber, dueDate, cisDeduction, formatNumberPattern } from './terms';
import { P, usState, ukReferenceRate } from './params';

const base = (o: Partial<InvoiceInput>): InvoiceInput => ({ country: 'UK', region: '', registered: true, lines: [], ...o });

describe('UK VAT', () => {
  it('reproduces the HMRC example invoice (VAT Notice 700/21, 4.3)', () => {
    const r = computeInvoice(base({ lines: [{ desc: 'Radios', qty: 6, price: 25.2, tax: 'standard' }, { desc: 'DVD players', qty: 4, price: 23.6, tax: 'standard' }] }));
    expect(r.net).toBe(245.6); expect(r.tax).toBe(49.12); expect(r.total).toBe(294.72);
  });
  it('rounds the total VAT down to the penny (VAT Notice 700, 17.5)', () => {
    const r = computeInvoice(base({ lines: [{ desc: 'x', qty: 1, price: 10.99, tax: 'standard' }] })); // 2.198
    expect(r.tax).toBe(2.19); expect(r.total).toBe(13.18);
  });
  it('mixes 20 %, 5 % and 0 % lines', () => {
    const r = computeInvoice(base({ lines: [{ desc: 'a', qty: 1, price: 100, tax: 'standard' }, { desc: 'b', qty: 2, price: 50, tax: 'reduced' }, { desc: 'c', qty: 1, price: 40, tax: 'zero' }, { desc: 'd', qty: 1, price: 10, tax: 'vat_exempt' }] }));
    expect(r.tax).toBe(25); expect(r.total).toBe(275);
    expect(r.bands.map((b) => b.amount)).toEqual([20, 5, 0]);
  });
  it('applies an invoice discount before VAT', () => {
    const r = computeInvoice(base({ discountPct: 10, lines: [{ desc: 'a', qty: 1, price: 100, tax: 'standard' }] }));
    expect(r.discount).toBe(10); expect(r.tax).toBe(18); expect(r.total).toBe(108);
  });
  it('backs VAT out of VAT-inclusive prices (1/6 at 20 %)', () => {
    const r = computeInvoice(base({ inclusive: true, lines: [{ desc: 'a', qty: 1, price: 120, tax: 'standard' }] }));
    expect(r.net).toBe(100); expect(r.tax).toBe(20); expect(r.total).toBe(120);
  });
  it('adds no VAT under the domestic reverse charge but states it', () => {
    const r = computeInvoice(base({ reverseCharge: true, lines: [{ desc: 'Labour', qty: 1, price: 1000, tax: 'standard' }] }));
    expect(r.tax).toBe(0); expect(r.reverseChargeVat).toBe(200); expect(r.total).toBe(1000);
    expect(r.notes[0]).toMatch(/customer to pay the VAT to HMRC/i);
  });
  it('deducts CIS at 20 % on labour only, not on materials or VAT (GOV.UK, CIS)', () => {
    const r = computeInvoice(base({ reverseCharge: true, cisRate: 0.2, lines: [{ desc: 'Labour', qty: 1, price: 1000, tax: 'standard' }, { desc: 'Materials', qty: 1, price: 500, tax: 'standard', materials: true }] }));
    expect(r.cisBase).toBe(1000); expect(r.cisDeduction).toBe(200); expect(r.due).toBe(1300);
    expect(cisDeduction(1800, 300, 500, 0.3)).toEqual({ base: 1000, deduction: 300, pay: 1500 });
  });
  it('charges nothing when not VAT-registered', () => {
    const r = computeInvoice(base({ registered: false, lines: [{ desc: 'a', qty: 3, price: 40, tax: 'standard' }] }));
    expect(r.tax).toBe(0); expect(r.total).toBe(120);
  });
});

describe('Canada', () => {
  const ca = (region: string, lines: InvoiceInput['lines']) => computeInvoice({ country: 'CA', region, registered: true, lines });
  it('HST 13 % in Ontario', () => { const r = ca('ON', [{ desc: 'a', qty: 1, price: 100, tax: 'ca_full' }]); expect(r.tax).toBe(13); expect(r.total).toBe(113); });
  it('HST 14 % in Nova Scotia since 1 April 2025', () => { const r = ca('NS', [{ desc: 'a', qty: 2, price: 100, tax: 'ca_full' }]); expect(r.tax).toBe(28); });
  it('GST 5 % + QST 9.975 % in Quebec, QST on the price before GST', () => {
    const r = ca('QC', [{ desc: 'a', qty: 1, price: 100, tax: 'ca_full' }]);
    expect(r.bands.map((b) => [b.label, b.amount])).toEqual([['QST', 9.98], ['GST', 5]]); expect(r.total).toBe(114.98);
  });
  it('GST + PST 7 % in British Columbia, and a GST-only line', () => {
    const r = ca('BC', [{ desc: 'a', qty: 1, price: 100, tax: 'ca_full' }, { desc: 'b', qty: 1, price: 100, tax: 'ca_gst_only' }]);
    expect(r.tax).toBe(17); expect(r.total).toBe(217);
  });
  it('GST + RST 7 % in Manitoba, GST + PST 6 % in Saskatchewan, GST only in Alberta', () => {
    expect(ca('MB', [{ desc: 'a', qty: 1, price: 200, tax: 'ca_full' }]).tax).toBe(24);
    expect(ca('SK', [{ desc: 'a', qty: 1, price: 200, tax: 'ca_full' }]).tax).toBe(22);
    expect(ca('AB', [{ desc: 'a', qty: 1, price: 200, tax: 'ca_full' }]).tax).toBe(10);
  });
  it('zero-rated and exempt lines carry no tax', () => { expect(ca('ON', [{ desc: 'a', qty: 1, price: 100, tax: 'ca_zero' }, { desc: 'b', qty: 1, price: 100, tax: 'ca_exempt' }]).tax).toBe(0); });
});

describe('Australia', () => {
  const au = (o: Partial<InvoiceInput>) => computeInvoice({ country: 'AU', region: 'NSW', registered: true, lines: [], ...o });
  it('GST is one-eleventh of a GST-inclusive price', () => {
    const r = au({ inclusive: true, lines: [{ desc: 'a', qty: 1, price: 110, tax: 'gst' }] });
    expect(r.tax).toBe(10); expect(r.net).toBe(100); expect(r.notes).toContain('Total price includes GST');
  });
  it('rounds GST to the nearest cent, half a cent up (ATO)', () => {
    const r = au({ lines: [{ desc: 'a', qty: 1, price: 99.95, tax: 'gst' }] }); // 9.995
    expect(r.tax).toBe(10); expect(r.total).toBe(109.95);
  });
  it('keeps GST-free lines out of the GST', () => {
    const r = au({ lines: [{ desc: 'a', qty: 1, price: 100, tax: 'gst' }, { desc: 'b', qty: 1, price: 50, tax: 'gst_free' }] });
    expect(r.tax).toBe(10); expect(r.total).toBe(160);
  });
});

describe('United States', () => {
  it('state rate plus local rate on taxable lines only (Texas 6.25 % + 2 %)', () => {
    expect(usState('TX').rate).toBe(6.25);
    const r = computeInvoice({ country: 'US', region: 'TX', registered: true, localRate: 2, lines: [{ desc: 'a', qty: 1, price: 100, tax: 'taxable' }, { desc: 'b', qty: 1, price: 50, tax: 'exempt' }] });
    expect(r.tax).toBe(8.25); expect(r.total).toBe(158.25);
  });
  it('California base rate 7.25 % rounds half up to the cent', () => {
    const r = computeInvoice({ country: 'US', region: 'CA', registered: true, lines: [{ desc: 'a', qty: 1, price: 19.99, tax: 'taxable' }] }); // 1.449275
    expect(r.tax).toBe(1.45);
  });
  it('no state sales tax in Oregon', () => {
    expect(computeInvoice({ country: 'US', region: 'OR', registered: true, lines: [{ desc: 'a', qty: 1, price: 100, tax: 'taxable' }] }).tax).toBe(0);
  });
  it('a deposit already paid reduces the balance due', () => {
    const r = computeInvoice({ country: 'US', region: 'NY', registered: true, localRate: 4.875, paid: 200, lines: [{ desc: 'a', qty: 4, price: 250, tax: 'taxable' }] });
    expect(r.tax).toBe(88.75); expect(r.due).toBe(888.75);
  });
});

describe('UK late payment interest', () => {
  it('matches the GOV.UK worked example (£1,000, base 0.5 %, 50 days → £11.50)', () => {
    const r = ukLateInterest(1000, '2026-01-31', '2026-03-22', 0.005);
    expect(r.days).toBe(50); expect(r.daily).toBe(0.23); expect(r.interest).toBe(11.5); expect(r.compensation).toBe(70);
  });
  it('uses the Bank Rate in force on 30 June for interest starting in the second half-year', () => {
    const ref = ukReferenceRate('2026-10-01');
    expect(ref.referenceDay).toBe('2026-06-30');
    const r = ukLateInterest(500, '2026-09-30', '2026-10-30');
    expect(r.rate).toBeCloseTo(P.uk.late_payment.margin + ref.base, 10); expect(r.compensation).toBe(40);
  });
  it('fixed compensation by debt size: £40, £70, £100', () => {
    expect(ukLateInterest(999.99, '2026-01-01', '2026-01-10').compensation).toBe(40);
    expect(ukLateInterest(9999.99, '2026-01-01', '2026-01-10').compensation).toBe(70);
    expect(ukLateInterest(10000, '2026-01-01', '2026-01-10').compensation).toBe(100);
  });
});

describe('Terms, numbers and IDs', () => {
  it('due dates', () => {
    expect(dueDate('2026-10-15', 'net30')).toBe('2026-11-14');
    expect(dueDate('2026-10-15', 'eom')).toBe('2026-10-31');
    expect(dueDate('2026-10-15', 'eom30')).toBe('2026-11-30');
    expect(dueDate('2026-02-10', 'eom')).toBe('2026-02-28');
  });
  it('2/10 net 30 costs about 37.2 % a year', () => { expect(earlyDiscount(1000, 2, 10, 30).annual).toBeCloseTo(0.3724, 3); });
  it('next invoice number keeps the padding', () => { expect(nextNumber('INV-2026-0099')).toBe('INV-2026-0100'); expect(nextNumber('A7')).toBe('A8'); expect(formatNumberPattern('INV-{YYYY}-{N}', 7, '2026-10-15')).toBe('INV-2026-0007'); });
  it('ABN check digit: the ABR example 51 824 753 556 is valid', () => { expect(abnValid('51 824 753 556')).toBe(true); expect(abnValid('51 824 753 557')).toBe(false); });
  it('format checks', () => {
    expect(ukVatFormatValid('GB 123 4567 89')).toBe(true); expect(ukVatFormatValid('12345')).toBe(false);
    expect(caBnValid('123456782 RT0001')).toBe(true); expect(qstValid('1234567890TQ0001')).toBe(true);
  });
  it('business number check digit: the CRA example 999 999 998 passes, a mistyped digit fails', () => {
    expect(caBnCheckDigitValid('999999998')).toBe(true); expect(caBnCheckDigitValid('999999997')).toBe(false);
    expect(caBnValid('123456782 RT0001')).toBe(true); expect(caBnValid('123456789 RT0001')).toBe(false);
    expect(caBnFormatValid('123456789 RT0001')).toBe(true);
  });
});

describe('Compliance checker', () => {
  const doc = (o: Partial<InvoiceDoc>): InvoiceDoc => ({ country: 'AU', region: 'NSW', registered: true, kind: 'invoice', number: '1', issueDate: '2026-10-15', currency: 'AUD', seller: { name: 'S', address: 'A', taxId: '51 824 753 556' }, buyer: { name: '', address: '' }, lineDescriptions: ['x'], ...o });
  it('asks for the buyer from $1,000 in Australia', () => {
    const r = computeInvoice({ country: 'AU', region: 'NSW', registered: true, lines: [{ desc: 'x', qty: 1, price: 1000, tax: 'gst' }] });
    expect(checkInvoice(doc({}), r).checks.find((c) => c.id === 'buyer')?.status).toBe('missing');
    const small = computeInvoice({ country: 'AU', region: 'NSW', registered: true, lines: [{ desc: 'x', qty: 1, price: 100, tax: 'gst' }] });
    expect(checkInvoice(doc({}), small).checks.find((c) => c.id === 'buyer')).toBeUndefined();
  });
  it('asks for the BN from $100 and terms from $500 in Canada', () => {
    const r = computeInvoice({ country: 'CA', region: 'ON', registered: true, lines: [{ desc: 'x', qty: 1, price: 500, tax: 'ca_full' }] });
    const ch = checkInvoice(doc({ country: 'CA', region: 'ON', currency: 'CAD', seller: { name: 'S', address: 'A', taxId: '' } }), r).checks;
    expect(ch.find((c) => c.id === 'bn')?.status).toBe('missing'); expect(ch.find((c) => c.id === 'terms')?.status).toBe('missing');
  });
  it('allows a simplified VAT invoice up to £250', () => {
    const r = computeInvoice(base({ lines: [{ desc: 'x', qty: 1, price: 200, tax: 'standard' }] })); // 240
    expect(checkInvoice(doc({ country: 'UK', currency: 'GBP', seller: { name: 'S', address: 'A', taxId: 'GB123456789' } }), r).title).toMatch(/Simplified/);
  });
});
