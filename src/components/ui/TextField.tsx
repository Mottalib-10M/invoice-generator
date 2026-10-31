/** Text input aligned with NumberField and SelectField: label, 48 px field, one-line help (RECETTE §10.3). */
interface Props { id: string; label: string; value: string; onChange: (v: string) => void; help?: string; className?: string; placeholder?: string; type?: 'text' | 'email' | 'date'; autoComplete?: string; maxLength?: number }
export default function TextField({ id, label, value, onChange, help, className = '', placeholder, type = 'text', autoComplete = 'off', maxLength = 200 }: Props) {
  return (
    <div className={`grid min-w-0 grid-rows-subgrid row-span-3 content-start gap-y-0 ${className}`}>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-navy-700">{label}</label>
      <input id={id} type={type} value={value} placeholder={placeholder} autoComplete={autoComplete} maxLength={maxLength} onChange={(e) => onChange(e.target.value)} aria-describedby={help ? `${id}-help` : undefined}
        className="h-12 w-full min-w-0 self-start rounded-lg border border-navy-300 bg-white px-3 text-navy-900 placeholder:text-navy-400 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20" />
      {help ? <p id={`${id}-help`} className="mt-1 text-xs text-navy-500">{help}</p> : <span />}
    </div>
  );
}
