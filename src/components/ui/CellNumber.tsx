/**
 * Number input for a table cell (quantity, unit price): same rules as NumberField (RECETTE §17.2):
 * the typed text is the source of truth, formatting only on blur, a maximum applied to the derived
 * number, never to the text, selection right after focus so "12" typed at once gives 12.
 */
import { type ChangeEvent, useLayoutEffect, useRef, useState } from 'react';
import { parseLocaleNumber } from '../../lib/format';

interface Props { id: string; label: string; value: number; onChange: (v: number) => void; decimals?: number; max?: number; className?: string; locale?: string }
export default function CellNumber({ id, label, value, onChange, decimals = 2, max = 100_000_000, className = '', locale = 'en-US' }: Props) {
  const [focused, setFocused] = useState(false);
  const [raw, setRaw] = useState('');
  const [over, setOver] = useState(false);
  const el = useRef<HTMLInputElement>(null);
  const pendingSelect = useRef(false);
  const guard = useRef(false);
  useLayoutEffect(() => { if (pendingSelect.current) { pendingSelect.current = false; el.current?.select(); } });
  const fmt = (n: number) => new Intl.NumberFormat(locale, { minimumFractionDigits: decimals === 2 && n % 1 !== 0 ? 2 : 0, maximumFractionDigits: decimals }).format(n);
  const display = focused ? raw : value === 0 ? '' : fmt(value);
  const change = (e: ChangeEvent<HTMLInputElement>) => {
    const t = e.target.value.replace(/[^0-9.,\s-]/g, '');
    setRaw(t);
    const n = parseLocaleNumber(t);
    setOver(n > max);
    onChange(Math.min(n, max));
  };
  return (
    <div className={`relative ${className}`}>
      <label htmlFor={id} className="sr-only">{label}</label>
      <input ref={el} id={id} type="text" inputMode="decimal" value={display} placeholder="0" onChange={change}
        onFocus={() => { setRaw(value === 0 ? '' : String(value)); setFocused(true); pendingSelect.current = true; guard.current = true; }}
        onMouseUp={(e) => { if (guard.current) { guard.current = false; e.preventDefault(); } }}
        onBlur={() => { guard.current = false; setFocused(false); setOver(false); }}
        aria-invalid={over || undefined}
        className="tabular-nums h-12 w-full rounded-lg border border-navy-300 bg-white px-2.5 text-right text-navy-900 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20" />
      {over && <span role="status" className="absolute -bottom-4 right-1 text-[11px] font-medium text-amber-700">max {fmt(max)}</span>}
    </div>
  );
}
