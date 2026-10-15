/** Writing tools (`Helpers`) handed to every page body. */
import { route, ROUTES } from '../i18n/routes';
import { P, SOURCES, COUNTRY_INFO, usState, type SourceKey, type Country } from './engine/params';
import { computeInvoice } from './engine/invoice';
import { ukLateInterest } from './engine/terms';
import type { Helpers } from './page-types';
import { formatNumber, displayDate } from './format';

const esc = (s: string | number) => String(s).replace(/&(?!(?:[a-z]+|#\d+);)/g, '&amp;').replace(/</g, '&lt;');

export function money(n: number, country: Country = 'US', decimals?: number): string {
  const i = COUNTRY_INFO[country];
  const d = decimals ?? (Math.round(n * 100) % 100 === 0 ? 0 : 2);
  return new Intl.NumberFormat(i.locale, { style: 'currency', currency: i.currency, minimumFractionDigits: d, maximumFractionDigits: d }).format(n);
}
/** 0.2 → "20%", 0.09975 → "9.975%" (English: no space before %). */
export const pctText = (x: number, d?: number) => (d === undefined ? `${+(x * 100).toFixed(3)}%` : `${(x * 100).toFixed(d)}%`);

export function helpers(): Helpers {
  return {
    P,
    a: (id, text) => {
      if (!ROUTES.some((r) => r.id === id)) throw new Error(`Unknown page id in a link: ${id}`);
      return `<a href="${route(id, 'en')}">${text}</a>`;
    },
    money,
    num: (n, d = 0) => formatNumber(n, d),
    pct: (x, d) => pctText(x, d),
    date: (iso, country = 'UK') => displayDate(iso, COUNTRY_INFO[country].locale),
    src: (key: SourceKey, text?: string) => { const s = SOURCES[key]; if (!s) throw new Error(`Unknown source: ${key}`); return `<a href="${s.url}" target="_blank" rel="nofollow noopener noreferrer">${text ?? s.label}</a>`; },
    calc: computeInvoice,
    late: ukLateInterest,
    us: usState,
    table: (headers, rows, caption, align = []) => {
      const al = (i: number) => (align[i] === 'r' ? 'text-right' : 'text-left');
      return `<div class="not-prose my-6 overflow-x-auto"><table class="journal w-full text-sm">${caption ? `<caption class="mb-2 text-left text-sm text-navy-600">${caption}</caption>` : ''}<thead><tr>${headers.map((h, i) => `<th scope="col" class="px-3 py-2 font-semibold text-navy-900 ${al(i)}">${h}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c, i) => `<td class="tabular-nums border-b border-navy-100 px-3 py-2 text-navy-800 ${al(i)}">${typeof c === 'number' ? esc(formatNumber(c, 0)) : c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
    },
  };
}
