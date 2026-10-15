/** The document model: titles, statements and totals printed on the preview and the PDF. */
import { describe, it, expect } from 'vitest';
import { initialState } from '../src/lib/presets';
import { toInput, docTitle, withCountry } from '../src/lib/invoice-model';
import { computeInvoice } from '../src/lib/engine/invoice';
import { buildView } from '../src/lib/doc-view';

const view = (s: ReturnType<typeof initialState>) => buildView(s, computeInvoice(toInput(s)));

describe('document titles use each country\'s words', () => {
  it('tax invoice in Australia, VAT invoice in the UK, plain invoice when not registered', () => {
    expect(docTitle({ country: 'AU', kind: 'invoice', registered: true })).toBe('Tax invoice');
    expect(docTitle({ country: 'AU', kind: 'invoice', registered: false })).toBe('Invoice');
    expect(docTitle({ country: 'UK', kind: 'invoice', registered: true })).toBe('VAT invoice');
    expect(docTitle({ country: 'AU', kind: 'credit_note', registered: true })).toBe('Adjustment note');
    expect(docTitle({ country: 'US', kind: 'credit_note', registered: true })).toBe('Credit memo');
    expect(docTitle({ country: 'US', kind: 'quote', registered: true })).toBe('Estimate');
  });
});

describe('templates', () => {
  it('the CIS template prints the reverse charge wording and the deduction', () => {
    const s = initialState('UK', 'cis');
    const v = view(s);
    expect(v.statements.join(' ')).toMatch(/customer to pay the VAT to HMRC/);
    expect(v.totals.some((t) => /CIS deduction 20%/.test(t.label))).toBe(true);
    const r = computeInvoice(toInput(s));
    expect(r.cisDeduction).toBe(480); // 20% of £2,400 labour; materials excluded
    expect(r.due).toBe(2780);
  });
  it('the Quebec template charges GST and QST on the price before GST', () => {
    const s = initialState('CA', 'quebec');
    const r = computeInvoice(toInput(s));
    expect(r.bands.map((b) => b.label).sort()).toEqual(['GST', 'QST']);
    // 12 × 150 + 240 = 2,040: GST 102.00, QST 203.49
    expect(r.tax).toBe(305.49);
  });
  it('the Australian no-GST template has no GST and says so', () => {
    const s = initialState('AU', 'no_gst');
    expect(computeInvoice(toInput(s)).tax).toBe(0);
    expect(view(s).title).toBe('Invoice');
    expect(view(s).statements.join(' ')).toMatch(/not registered for GST/);
  });
  it('switching country moves each line to a valid tax code', () => {
    const s = withCountry(initialState('US', 'standard'), 'UK');
    expect(s.lines.map((l) => l.tax)).toEqual(['vat_exempt', 'standard']);
    expect(s.currency).toBe('GBP');
  });
});
