/** On-screen paper preview: the same DocView as the PDF, laid out like the printed page. */
import type { DocView } from '../../lib/doc-view';

interface Props { view: DocView; logo?: string; accent?: string }
export default function InvoicePreview({ view: v, logo, accent = '#0E5A4A' }: Props) {
  return (
    <div className="invoice-paper tabular-nums mx-auto w-full bg-white text-[12px] leading-snug text-neutral-900 shadow-[0_1px_3px_rgba(15,23,42,.12),0_8px_24px_-12px_rgba(15,23,42,.25)] ring-1 ring-navy-200" style={{ aspectRatio: 'auto' }}>
      <div className="h-1.5" style={{ background: accent }} />
      <div className="p-5 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            {logo ? <img src={logo} alt="Business logo" className="mb-2 max-h-14 max-w-[160px] object-contain" /> : null}
            {v.sellerLines.map((l, i) => <p key={i} className={i === 0 ? 'text-[13px] font-semibold' : 'text-neutral-600'}>{l}</p>)}
            {v.sellerIds.map((l) => <p key={l} className="text-neutral-600">{l}</p>)}
          </div>
          <div className="shrink-0 text-right">
            <p className="font-serif text-[22px] font-bold uppercase leading-none tracking-wide" style={{ color: accent }}>{v.title}</p>
            <table className="ml-auto mt-3 text-[11.5px]"><tbody>
              {v.meta.map(([k, x]) => <tr key={k}><td className="pr-3 text-right text-neutral-500">{k}</td><td className="text-right font-medium">{x}</td></tr>)}
            </tbody></table>
          </div>
        </div>
        <div className="mt-5">
          <p className="text-[10.5px] font-semibold uppercase tracking-wider text-neutral-500">{v.buyerTitle}</p>
          {v.buyerLines.length ? v.buyerLines.map((l, i) => <p key={i} className={i === 0 ? 'font-semibold' : 'text-neutral-700'}>{l}</p>) : <p className="text-neutral-500">Customer name and address</p>}
        </div>
        <table className="mt-5 w-full border-collapse text-[11.5px]">
          <thead><tr className="border-b-2" style={{ borderColor: accent }}>
            <th className="py-1.5 pr-2 text-left font-semibold">{v.head.desc}</th>
            <th className="px-2 py-1.5 text-right font-semibold">{v.head.qty}</th>
            <th className="px-2 py-1.5 text-right font-semibold">{v.head.price}</th>
            {v.showTaxCol && <th className="px-2 py-1.5 text-right font-semibold">{v.head.tax}</th>}
            <th className="py-1.5 pl-2 text-right font-semibold">{v.head.amount}</th>
          </tr></thead>
          <tbody>
            {v.rows.map((r, i) => <tr key={i} className="border-b border-neutral-200 align-top">
              <td className="py-1.5 pr-2">{r.desc || <span className="text-neutral-500">Description</span>}</td>
              <td className="px-2 py-1.5 text-right">{r.qty}</td>
              <td className="px-2 py-1.5 text-right">{r.price}</td>
              {v.showTaxCol && <td className="px-2 py-1.5 text-right text-neutral-600">{r.tax}</td>}
              <td className="py-1.5 pl-2 text-right">{r.amount}</td>
            </tr>)}
          </tbody>
        </table>
        <table className="ml-auto mt-3 w-full max-w-[19rem] text-[11.5px]"><tbody>
          {v.totals.map((t, i) => <tr key={i} className={t.strong ? 'border-t border-neutral-300 text-[13px] font-bold' : ''}><td className="py-1 pr-3 text-neutral-600">{t.label}</td><td className="py-1 text-right">{t.value}</td></tr>)}
        </tbody></table>
        {v.statements.length > 0 && <div className="mt-4 space-y-1 border-l-2 pl-3" style={{ borderColor: accent }}>{v.statements.map((s) => <p key={s} className="font-medium">{s}</p>)}</div>}
        {v.payment && <div className="mt-4"><p className="text-[10.5px] font-semibold uppercase tracking-wider text-neutral-500">Payment details</p><p className="whitespace-pre-line text-neutral-700">{v.payment}</p></div>}
        {v.notes && <p className="mt-3 whitespace-pre-line text-neutral-700">{v.notes}</p>}
      </div>
    </div>
  );
}
