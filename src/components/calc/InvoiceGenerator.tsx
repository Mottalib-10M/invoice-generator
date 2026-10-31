/**
 * The invoice generator. Everything happens in this component, in the visitor's browser:
 * the tax engine (lib/engine), the live preview, the compliance check and the PDF (jsPDF, loaded
 * on demand). Nothing is sent to a server. The business details are remembered in this browser's
 * localStorage only, applied after the first render so the built HTML matches it (RECETTE §17.5).
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import SelectField from '../ui/SelectField';
import NumberField from '../ui/NumberField';
import TextField from '../ui/TextField';
import TextArea from '../ui/TextArea';
import Toggle from '../ui/Toggle';
import CellNumber from '../ui/CellNumber';
import InvoicePreview from './InvoicePreview';
import { COUNTRY_INFO, COUNTRIES, US_STATES, PROVINCES, PROVINCE_CODES, usState, type Country } from '../../lib/engine/params';
import { computeInvoice, taxOptions, normaliseTax, defaultTax, type Line } from '../../lib/engine/invoice';
import { checkInvoice, type DocKind } from '../../lib/engine/compliance';
import { TERMS, dueDate, nextNumber, type Terms } from '../../lib/engine/terms';
import { BUILD_DAY, CURRENCIES, REMEMBER, STORAGE_KEY, money, toDoc, toInput, withCountry, UK_NATIONS, AU_STATES, type InvoiceState } from '../../lib/invoice-model';
import { initialState, type PresetId } from '../../lib/presets';
import { buildView } from '../../lib/doc-view';

interface Props { country?: Country; preset?: PresetId; methodHref?: string; embed?: boolean }

const KINDS: Array<{ value: DocKind; label: string }> = [
  { value: 'invoice', label: 'Invoice' }, { value: 'receipt', label: 'Receipt' }, { value: 'quote', label: 'Quote / estimate' },
  { value: 'proforma', label: 'Pro forma invoice' }, { value: 'credit_note', label: 'Credit note' },
];
const ACCENT = '#0E5A4A';
const today = () => new Date().toISOString().slice(0, 10);

function regionOptions(c: Country) {
  if (c === 'US') return US_STATES.map((s) => ({ value: s.code, label: `${s.name}${s.hasStateTax ? ` (${s.rate}%)` : ' (no state tax)'}` }));
  if (c === 'CA') return PROVINCE_CODES.map((p) => ({ value: p, label: PROVINCES[p].name }));
  if (c === 'UK') return UK_NATIONS.map(([v, l]) => ({ value: v, label: l }));
  return AU_STATES.map(([v, l]) => ({ value: v, label: l }));
}

export default function InvoiceGenerator({ country = 'US', preset = 'standard', methodHref, embed = false }: Props) {
  const [st, setSt] = useState<InvoiceState>(() => initialState(country, preset));
  const [loaded, setLoaded] = useState(false);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const set = <K extends keyof InvoiceState>(k: K, v: InvoiceState[K]) => setSt((s) => ({ ...s, [k]: v }));
  const setSeller = (k: keyof InvoiceState['seller'], v: string) => setSt((s) => ({ ...s, seller: { ...s.seller, [k]: v } }));
  const setBuyer = (k: keyof InvoiceState['buyer'], v: string) => setSt((s) => ({ ...s, buyer: { ...s.buyer, [k]: v } }));

  // After mount: today's date and what this browser remembered (never during the first render).
  useEffect(() => {
    setSt((s) => {
      let n = { ...s };
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw && !embed) {
          const mem = JSON.parse(raw) as Partial<InvoiceState>;
          const keep = preset === 'standard' || preset === 'blank';
          if (keep || mem.country === n.country) {
            for (const k of REMEMBER) if (k in mem && (keep || !['country', 'region', 'registered'].includes(k))) (n as Record<string, unknown>)[k] = mem[k];
            if (mem.number) n.number = preset === 'standard' ? nextNumber(mem.number) : n.number;
            n.lines = n.lines.map((l) => ({ ...l, tax: normaliseTax(l.tax, n) }));
          }
        }
      } catch { /* storage blocked: defaults stay */ }
      const t = today();
      if (n.issueDate === BUILD_DAY && t !== BUILD_DAY) n = { ...n, issueDate: t, dueDate: n.terms === 'custom' ? n.dueDate : dueDate(t, n.terms as Terms) };
      return n;
    });
    setLoaded(true);
  }, []);

  // Remember the business details in this browser only.
  useEffect(() => {
    if (!loaded || embed) return;
    try {
      const mem: Record<string, unknown> = {};
      for (const k of REMEMBER) mem[k] = st[k];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mem));
    } catch { /* quota or blocked: nothing saved */ }
  }, [loaded, embed, ...REMEMBER.map((k) => JSON.stringify(st[k]))]);

  const input = useMemo(() => toInput(st), [st]);
  const res = useMemo(() => computeInvoice(input), [input]);
  const check = useMemo(() => checkInvoice(toDoc(st), res), [st, res]);
  const view = useMemo(() => buildView(st, res), [st, res]);
  const info = COUNTRY_INFO[st.country];
  const m = (n: number) => money(n, st.currency, st.country);
  const opts = taxOptions(st);
  const missing = check.checks.filter((c) => c.status === 'missing').length;

  const changeCountry = (c: Country) => setSt((s) => withCountry(s, c));
  const changeRegion = (r: string) => setSt((s) => ({ ...s, region: r, lines: s.lines.map((l) => ({ ...l, tax: normaliseTax(l.tax, { country: s.country, region: r }) })) }));
  const changeTerms = (t: string) => setSt((s) => ({ ...s, terms: t as Terms, dueDate: dueDate(s.issueDate || BUILD_DAY, t as Terms) }));
  const changeIssue = (d: string) => setSt((s) => ({ ...s, issueDate: d, dueDate: s.terms === 'custom' || !d ? s.dueDate : dueDate(d, s.terms as Terms) }));
  const setLine = (i: number, patch: Partial<Line>) => setSt((s) => ({ ...s, lines: s.lines.map((l, j) => (j === i ? { ...l, ...patch } : l)) }));
  const addLine = () => setSt((s) => ({ ...s, lines: [...s.lines, { desc: '', qty: 1, price: 0, tax: defaultTax(s.country) }] }));
  const removeLine = (i: number) => setSt((s) => ({ ...s, lines: s.lines.length > 1 ? s.lines.filter((_, j) => j !== i) : s.lines }));

  const onLogo = (f?: File) => {
    if (!f) return;
    if (f.size > 600_000) { alert('Please use a logo under 600 KB (PNG or JPG).'); return; }
    const r = new FileReader();
    r.onload = () => set('logo', String(r.result));
    r.readAsDataURL(f);
  };
  const download = async () => {
    setBusy(true);
    try {
      const { makePdf } = await import('../../lib/pdf');
      await makePdf(view, { paper: info.paper, logo: st.logo || undefined, accent: ACCENT, fileName: `${(view.title + ' ' + st.number).replace(/[^\w.-]+/g, '-')}.pdf` });
    } finally { setBusy(false); }
  };
  const newInvoice = () => setSt((s) => ({ ...s, number: nextNumber(s.number), buyer: { name: '', address: '', taxId: '' }, lines: [{ desc: '', qty: 1, price: 0, tax: defaultTax(s.country) }], paid: 0, discountPct: 0, shipping: 0, poNumber: '', supplyDate: '' }));
  const blank = () => setSt((s) => ({ ...initialState(s.country, 'blank'), country: s.country, region: s.region, registered: s.registered, issueDate: s.issueDate, dueDate: s.dueDate }));

  const regLabel = st.country === 'US' ? 'Charge sales tax?' : st.country === 'UK' ? 'VAT-registered?' : st.country === 'CA' ? 'GST/HST registrant?' : 'Registered for GST?';
  const st0 = st.country === 'US' ? usState(st.region) : null;
  const card = 'rounded-xl border border-navy-200 bg-white p-4 sm:p-5';
  const h3 = 'mb-3 font-serif text-lg font-semibold text-navy-900';

  return (
    <div className="invoice-tool rechner grid grid-cols-[minmax(0,1fr)] items-start gap-6 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,1fr)]">
      <div className="min-w-0 space-y-4">
        <form className={`${card} grid grid-cols-2 gap-x-3 gap-y-3 sm:grid-cols-3`} onSubmit={(e) => e.preventDefault()} aria-label="Country and tax">
          <SelectField id="g-country" label="Country" value={st.country} onChange={(v) => changeCountry(v as Country)} options={COUNTRIES.map((c) => ({ value: c, label: COUNTRY_INFO[c].name }))} />
          {(st.country === 'US' || st.country === 'CA')
            ? <SelectField id="g-region" label={info.regionLabel} value={st.region} onChange={changeRegion} options={regionOptions(st.country)} />
            : <SelectField id="g-currency" label="Currency" value={st.currency} onChange={(v) => set('currency', v)} options={CURRENCIES.map((c) => ({ value: c, label: c }))} />}
          <SelectField id="g-kind" label="Document" value={st.kind} onChange={(v) => set('kind', v as DocKind)} options={KINDS} className="col-span-2 sm:col-span-1" />
          <Toggle id="g-reg" label={regLabel} value={st.registered ? '1' : '0'} onChange={(v) => set('registered', v === '1')} options={[{ value: '0', label: 'No' }, { value: '1', label: 'Yes' }]} />
          <Toggle id="g-incl" label="Prices include tax?" value={st.inclusive ? '1' : '0'} onChange={(v) => set('inclusive', v === '1')} options={[{ value: '0', label: 'No' }, { value: '1', label: 'Yes' }]} />
          {st.country === 'US' && st.registered
            ? <NumberField id="g-local" label="Local rate" value={st.localRate} onChange={(v) => set('localRate', v)} unit="%" max={10} decimals={3} help={st0?.local ? 'City, county, district: add yours' : 'No local tax here'} />
            : (st.country === 'US' || st.country === 'CA')
              ? <SelectField id="g-currency" label="Currency" value={st.currency} onChange={(v) => set('currency', v)} options={CURRENCIES.map((c) => ({ value: c, label: c }))} />
              : <span />}
          {st0?.special?.filter((x) => x.status === 'verified').map((x) => (
            <p key={x.note} className="col-span-2 rounded-md bg-navy-50 px-3 py-2 text-xs text-navy-700 sm:col-span-3">
              <strong>{st0.name}:</strong> {x.note}. The generator applies the general rate: mark exempt lines "not taxable", and check a reduced rate with the <a href={x.url} rel="nofollow noopener" target="_blank" className="underline">official source</a>.
            </p>
          ))}
        </form>

        <form className={card} onSubmit={(e) => e.preventDefault()} aria-label="Items">
          <div className="mb-2 flex items-center justify-between gap-3">
            <p className={h3.replace('mb-3 ', '')}>Items</p>
            <label className="flex items-center gap-2 text-sm text-navy-700"><input type="checkbox" checked={st.hourly} onChange={(e) => set('hourly', e.target.checked)} className="h-4 w-4 accent-accent-600" /> Hours × rate</label>
          </div>
          <div className="space-y-3">
            {st.lines.map((l, i) => (
              <div key={i} className="rounded-lg border border-navy-100 bg-navy-50/40 p-2.5">
                <div className="grid grid-cols-[minmax(0,1fr)_2.25rem] gap-2">
                  <div>
                    <label htmlFor={`g-desc-${i}`} className="sr-only">Description, line {i + 1}</label>
                    <input id={`g-desc-${i}`} type="text" value={l.desc} maxLength={300} placeholder={`Description of line ${i + 1}`} onChange={(e) => setLine(i, { desc: e.target.value })}
                      className="h-12 w-full rounded-lg border border-navy-300 bg-white px-3 text-navy-900 placeholder:text-navy-400 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20" />
                  </div>
                  <button type="button" onClick={() => removeLine(i)} disabled={st.lines.length === 1} className="h-12 rounded-lg text-xl leading-none text-navy-400 hover:bg-white hover:text-navy-700 disabled:opacity-30" aria-label={`Remove line ${i + 1}`}>×</button>
                </div>
                <div className="mt-2 grid grid-cols-[4.75rem_minmax(0,1fr)_minmax(0,1.15fr)] items-center gap-2 sm:grid-cols-[4.75rem_7rem_minmax(0,1fr)_6.5rem]">
                  <div><span aria-hidden="true" className="mb-0.5 block text-xs font-semibold uppercase tracking-wide text-navy-500">{st.hourly ? 'Hours' : 'Qty'}</span>
                    <CellNumber id={`g-qty-${i}`} label={`${st.hourly ? 'Hours' : 'Quantity'}, line ${i + 1}`} value={l.qty} decimals={3} max={1_000_000} onChange={(v) => setLine(i, { qty: v })} locale={info.locale} /></div>
                  <div><span aria-hidden="true" className="mb-0.5 block text-xs font-semibold uppercase tracking-wide text-navy-500">{st.hourly ? 'Rate' : st.inclusive ? 'Price incl. tax' : 'Unit price'}</span>
                    <CellNumber id={`g-price-${i}`} label={`${st.hourly ? 'Rate' : 'Unit price'}, line ${i + 1}`} value={l.price} onChange={(v) => setLine(i, { price: v })} locale={info.locale} /></div>
                  <div><span aria-hidden="true" className="mb-0.5 block text-xs font-semibold uppercase tracking-wide text-navy-500">Tax</span>
                    <div className="relative">
                      <label htmlFor={`g-tax-${i}`} className="sr-only">Tax, line {i + 1}</label>
                      <select id={`g-tax-${i}`} value={l.tax} disabled={!st.registered} onChange={(e) => setLine(i, { tax: e.target.value as Line['tax'] })}
                        className="h-12 w-full appearance-none truncate rounded-lg border border-navy-300 bg-white pl-2.5 pr-8 text-base text-navy-900 disabled:bg-navy-50 disabled:text-navy-400 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20">
                        {opts.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                      <svg className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-500" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M5 7.5l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </div></div>
                  <p className="tabular-nums col-span-3 text-right text-sm text-navy-700 sm:col-span-1 sm:pt-4"><span className="text-navy-500 sm:hidden">Line amount </span><span className="font-semibold text-navy-900">{m(res.lines[i] ? (st.inclusive ? l.qty * l.price : res.lines[i].net) : 0)}</span></p>
                </div>
                {st.country === 'UK' && st.cis !== 'none' && (
                  <label className="mt-2 flex items-center gap-2 text-xs text-navy-600"><input type="checkbox" checked={!!l.materials} onChange={(e) => setLine(i, { materials: e.target.checked })} className="h-4 w-4 accent-accent-600" /> Materials (no CIS deduction on this line)</label>
                )}
              </div>
            ))}
          </div>
          <button type="button" onClick={addLine} className="mt-3 rounded-lg border border-dashed border-navy-300 px-4 py-2 text-sm font-medium text-accent-700 hover:border-accent-400 hover:bg-accent-50">+ Add a line</button>
          <div className="mt-4 grid grid-cols-3 gap-x-3 border-t border-navy-100 pt-4">
            <NumberField id="g-disc" label="Discount" value={st.discountPct} onChange={(v) => set('discountPct', v)} unit="%" max={100} decimals={2} />
            <NumberField id="g-ship" label="Shipping" value={st.shipping} onChange={(v) => set('shipping', v)} decimals={2} max={1_000_000} />
            <NumberField id="g-paid" label={st.kind === 'receipt' ? 'Paid already' : 'Deposit paid'} value={st.paid} onChange={(v) => set('paid', v)} decimals={2} max={100_000_000} />
          </div>
          {st.country === 'UK' && st.registered && (
            <div className="mt-3 grid grid-cols-2 gap-x-3 border-t border-navy-100 pt-4">
              <Toggle id="g-rc" label="Domestic reverse charge?" value={st.reverseCharge ? '1' : '0'} onChange={(v) => set('reverseCharge', v === '1')} options={[{ value: '0', label: 'No' }, { value: '1', label: 'Yes' }]} />
              <SelectField id="g-cis" label="CIS deduction" value={st.cis} onChange={(v) => set('cis', v as InvoiceState['cis'])} options={[{ value: 'none', label: 'No CIS' }, { value: '0.2', label: '20% (registered)' }, { value: '0.3', label: '30% (not registered)' }, { value: '0', label: '0% (gross status)' }]} />
            </div>
          )}
          {st.country === 'UK' && !st.registered && (
            <div className="mt-3 grid grid-cols-2 gap-x-3 border-t border-navy-100 pt-4">
              <SelectField id="g-cis" label="CIS deduction" value={st.cis} onChange={(v) => set('cis', v as InvoiceState['cis'])} options={[{ value: 'none', label: 'No CIS' }, { value: '0.2', label: '20% (registered)' }, { value: '0.3', label: '30% (not registered)' }, { value: '0', label: '0% (gross status)' }]} />
              <span />
            </div>
          )}
        </form>

        <section className={card} aria-label="Your details">
          <p className={h3}>From: your business</p>
          <form className="grid grid-cols-2 gap-x-3 gap-y-3" onSubmit={(e) => e.preventDefault()}>
            <TextField id="g-sname" label={st.country === 'UK' && st.limitedCompany ? 'Full company name' : 'Business name'} value={st.seller.name} onChange={(v) => setSeller('name', v)} className="col-span-2" autoComplete="organization" />
            <TextArea id="g-saddr" label="Address" value={st.seller.address} onChange={(v) => setSeller('address', v)} className="col-span-2" rows={2} />
            <TextField id="g-semail" label="Email" type="email" value={st.seller.email ?? ''} onChange={(v) => setSeller('email', v)} autoComplete="email" />
            <TextField id="g-staxid" label={info.idLabel} value={st.seller.taxId ?? ''} onChange={(v) => setSeller('taxId', v)} help={st.country === 'AU' ? '11 digits, checked against the ABR formula' : st.country === 'CA' ? '123456782 RT0001' : st.country === 'UK' ? 'GB 123 4567 89' : 'Optional'} />
            {st.country === 'CA' && st.region === 'QC' && <TextField id="g-sqst" label="QST registration number" value={st.seller.qstNo ?? ''} onChange={(v) => setSeller('qstNo', v)} help="1234567890 TQ0001" />}
            {st.country === 'UK' && <TextField id="g-sco" label="Company number (optional)" value={st.seller.companyNo ?? ''} onChange={(v) => setSeller('companyNo', v)} />}
            {st.country === 'UK' && (
              <div className="col-span-2 flex flex-wrap gap-x-5 gap-y-2 text-sm text-navy-700">
                <label className="flex items-center gap-2"><input type="checkbox" checked={st.limitedCompany} onChange={(e) => set('limitedCompany', e.target.checked)} className="h-4 w-4 accent-accent-600" /> Limited company</label>
                <label className="flex items-center gap-2"><input type="checkbox" checked={st.tradingName} onChange={(e) => set('tradingName', e.target.checked)} className="h-4 w-4 accent-accent-600" /> Sole trader using a business name</label>
              </div>
            )}
            {st.country === 'UK' && st.tradingName && <TextField id="g-owner" label="Your own name" value={st.ownerName} onChange={(v) => set('ownerName', v)} className="col-span-2" />}
          </form>
          <div className="mt-3 flex items-center gap-3">
            <input ref={fileRef} id="g-logo" type="file" accept="image/png,image/jpeg" className="sr-only" onChange={(e) => onLogo(e.target.files?.[0])} />
            <label htmlFor="g-logo" className="inline-flex h-10 cursor-pointer items-center rounded-lg border border-navy-300 px-4 text-sm font-medium text-navy-800 hover:bg-navy-50">{st.logo ? 'Change logo' : 'Add your logo'}</label>
            {st.logo && <button type="button" onClick={() => set('logo', '')} className="text-sm text-navy-500 underline">Remove</button>}
            <span className="text-xs text-navy-500">PNG or JPG, stays on this device</span>
          </div>
        </section>

        <section className={card} aria-label="Customer">
          <p className={h3}>{view.buyerTitle}: your customer</p>
          <form className="grid grid-cols-2 gap-x-3 gap-y-3" onSubmit={(e) => e.preventDefault()}>
            <TextField id="g-bname" label="Customer name" value={st.buyer.name} onChange={(v) => setBuyer('name', v)} className="col-span-2" />
            <TextArea id="g-baddr" label="Address" value={st.buyer.address} onChange={(v) => setBuyer('address', v)} className="col-span-2" rows={2} />
            <TextField id="g-btax" label={st.country === 'AU' ? 'Customer ABN (optional)' : st.country === 'UK' ? 'Customer VAT number (optional)' : 'Customer tax ID (optional)'} value={st.buyer.taxId ?? ''} onChange={(v) => setBuyer('taxId', v)} />
            <TextField id="g-po" label="PO number (optional)" value={st.poNumber} onChange={(v) => set('poNumber', v)} />
          </form>
        </section>

        <section className={card} aria-label="Invoice details">
          <p className={h3}>Number, dates and terms</p>
          <form className="grid grid-cols-2 gap-x-3 gap-y-3" onSubmit={(e) => e.preventDefault()}>
            <TextField id="g-num" label="Number" value={st.number} onChange={(v) => set('number', v)} />
            <TextField id="g-issue" label="Invoice date" type="date" value={st.issueDate} onChange={changeIssue} />
            <TextField id="g-supply" label={st.country === 'UK' && st.registered ? 'Tax point, if different' : 'Supply date (optional)'} type="date" value={st.supplyDate} onChange={(v) => set('supplyDate', v)} />
            {st.kind === 'credit_note'
              ? <TextField id="g-ref" label="Original invoice number" value={st.reference} onChange={(v) => set('reference', v)} />
              : <SelectField id="g-terms" label="Payment terms" value={st.terms} onChange={changeTerms} options={[...TERMS.map((t) => ({ value: t.value, label: t.label })), { value: 'custom', label: 'Custom due date' }]} />}
            {(st.kind === 'invoice' || st.kind === 'proforma' || st.kind === 'quote') && <TextField id="g-due" label={st.kind === 'quote' ? 'Valid until' : 'Due date'} type="date" value={st.dueDate} onChange={(v) => setSt((s) => ({ ...s, dueDate: v, terms: 'custom' }))} />}
            {st.country === 'UK' && st.registered && st.currency !== 'GBP' && <NumberField id="g-gbp" label="VAT total in sterling" value={st.vatInGbp} onChange={(v) => set('vatInGbp', v)} unit="£" decimals={2} help="Required when invoicing in another currency" />}
          </form>
        </section>

        <section className={card} aria-label="Notes and payment">
          <div className="grid gap-3 sm:grid-cols-2">
            <TextArea id="g-pay" label="Payment details" value={st.payment} onChange={(v) => set('payment', v)} rows={3} />
            <TextArea id="g-notes" label="Notes" value={st.notes} onChange={(v) => set('notes', v)} rows={3} />
          </div>
        </section>
      </div>

      <div className="space-y-4 lg:sticky lg:top-4" data-resultat aria-live="polite">
        <div className="rounded-xl border border-accent-200 bg-accent-50/60 p-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-navy-600">{st.kind === 'credit_note' ? 'Total credit' : st.kind === 'receipt' ? 'Amount received' : res.paid > 0 || res.cisDeduction > 0 ? 'Balance due' : 'Total due'}</p>
              <p className="tabular-nums text-4xl font-bold text-navy-900">{m(st.kind === 'receipt' || st.kind === 'credit_note' ? res.total : res.due)}</p>
              <p className="mt-0.5 text-sm text-navy-600">{res.tax > 0 ? `including ${m(res.tax)} ${st.country === 'US' ? 'sales tax' : info.taxName === 'GST/HST' ? 'tax' : info.taxName}` : res.reverseChargeVat > 0 ? `VAT ${m(res.reverseChargeVat)} under the reverse charge` : 'no tax added'}</p>
            </div>
            <div className="no-print flex flex-wrap gap-2">
              <button type="button" onClick={download} disabled={busy} className="h-11 rounded-lg bg-accent-600 px-5 text-sm font-semibold text-white hover:bg-accent-700 disabled:opacity-60">{busy ? 'Building PDF…' : 'Download PDF'}</button>
              <button type="button" onClick={() => window.print()} className="h-11 rounded-lg border border-navy-300 bg-white px-4 text-sm font-medium text-navy-800 hover:bg-navy-50">Print</button>
            </div>
          </div>
        </div>
        <div className="max-h-[none] overflow-hidden rounded-lg lg:max-h-[640px] lg:overflow-auto">
          <InvoicePreview view={view} logo={st.logo || undefined} accent={ACCENT} />
        </div>
        <div className={`${card} no-print`}>
          <div className="flex items-baseline justify-between gap-3">
            <p className="font-semibold text-navy-900">{check.title}</p>
            <p className={`text-sm font-semibold ${missing ? 'text-amber-700' : 'text-green-700'}`}>{missing ? `${missing} detail${missing > 1 ? 's' : ''} missing` : 'All required details present'}</p>
          </div>
          <p className="mt-0.5 text-xs text-navy-500">{check.rule}</p>
          <ul className="mt-3 space-y-1.5 text-sm">
            {check.checks.map((c) => (
              <li key={c.id} className="flex gap-2">
                <span aria-hidden="true" className={`mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white ${c.status === 'ok' ? 'bg-green-700' : c.status === 'missing' ? 'bg-amber-600' : c.status === 'warn' ? 'bg-navy-400' : 'bg-accent-600'}`}>{c.status === 'ok' ? '✓' : c.status === 'info' ? 'i' : '!'}</span>
                <span className="text-navy-800"><span className="sr-only">{c.status === 'ok' ? 'Present: ' : c.status === 'missing' ? 'Missing: ' : 'Note: '}</span>{c.label}{c.detail ? <span className="text-navy-500"> · {c.detail}</span> : null}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-navy-100 pt-3 text-sm">
            <button type="button" onClick={newInvoice} className="font-medium text-accent-700 hover:underline">Next invoice ({nextNumber(st.number)})</button>
            <button type="button" onClick={blank} className="font-medium text-navy-600 hover:underline">Start blank</button>
            {!embed && <button type="button" onClick={() => { try { localStorage.removeItem(STORAGE_KEY); setSaved(true); } catch { /* */ } }} className="text-navy-500 hover:underline">{saved ? 'Forgotten on this device' : 'Forget my details'}</button>}
            {methodHref && <a href={methodHref} className="text-navy-500 underline hover:text-navy-800">How the tax is calculated</a>}
          </div>
          <p className="mt-2 text-xs text-navy-500">Made in your browser. Nothing you type is sent to a server; your business details are kept on this device only, for the next invoice.</p>
        </div>
      </div>

      <div className="no-print fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-3 border-t border-navy-200 bg-white/95 px-4 py-2.5 lg:hidden">
        <div><p className="text-xs text-navy-500">{st.kind === 'credit_note' ? 'Total credit' : 'Total due'}</p><p className="tabular-nums text-lg font-bold text-navy-900">{m(st.kind === 'receipt' || st.kind === 'credit_note' ? res.total : res.due)}</p></div>
        <button type="button" onClick={download} disabled={busy} className="h-11 rounded-lg bg-accent-600 px-5 text-sm font-semibold text-white">{busy ? 'Building…' : 'Download PDF'}</button>
      </div>
    </div>
  );
}
