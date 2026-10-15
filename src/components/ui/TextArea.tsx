/** Multi-line text (addresses, notes). Not a 48 px field: it grows with its content. */
interface Props { id: string; label: string; value: string; onChange: (v: string) => void; rows?: number; help?: string; className?: string; placeholder?: string; maxLength?: number }
export default function TextArea({ id, label, value, onChange, rows = 3, help, className = '', placeholder, maxLength = 1000 }: Props) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-navy-700">{label}</label>
      <textarea id={id} rows={rows} value={value} placeholder={placeholder} maxLength={maxLength} onChange={(e) => onChange(e.target.value)} aria-describedby={help ? `${id}-help` : undefined}
        className="w-full resize-y rounded-lg border border-navy-300 bg-white px-3 py-2.5 leading-snug text-navy-900 placeholder:text-navy-400 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20" />
      {help && <p id={`${id}-help`} className="mt-1 text-xs text-navy-500">{help}</p>}
    </div>
  );
}
