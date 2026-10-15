/**
 * One page = one data file in `src/content/pages/<id>.ts`. The file carries everything: URL, snippet,
 * H1, standfirst, quotable block, FAQ, body, sources, generator or mini-calculator, related pages.
 * Routes, menus, footer, sitemap, schemas and internal links are built from it (CONTRIBUTING-PAGES.md).
 */
import type { Country, SourceKey, P, UsState } from './engine/params';
import type { InvoiceInput, InvoiceResult } from './engine/invoice';
import type { PresetId } from './presets';

export type Group = 'countries' | 'templates' | 'guides';
export type Kind = 'tool' | 'guide' | 'index';
export interface FAQ { q: string; a: string }

export interface Helpers {
  /** Internal link by page id. An unknown id fails the build. */
  a: (id: string, text: string) => string;
  /** Money in a country's currency and spelling: h.money(1234.5, 'UK') → "£1,234.50". */
  money: (n: number, country?: Country, decimals?: number) => string;
  num: (n: number, decimals?: number) => string;
  /** Percentage from a fraction (0.2 → "20%"). */
  pct: (x: number, decimals?: number) => string;
  /** ISO date written out ("1 July 2026", US style "July 1, 2026" with country 'US'). */
  date: (iso: string, country?: Country) => string;
  /** Journal-style table. Numbers are formatted; strings are inserted as HTML. */
  table: (headers: string[], rows: Array<Array<string | number>>, caption?: string, align?: Array<'l' | 'r'>) => string;
  /** Link to an official source of params-2026.json. */
  src: (key: SourceKey, text?: string) => string;
  /** Run the invoice engine: every amount in a page comes from here or from P. */
  calc: (input: InvoiceInput) => InvoiceResult;
  /** UK statutory late payment interest (engine). */
  late: (debt: number, due: string, paidOn: string) => { days: number; rate: number; base: number; referenceDay: string; daily: number; interest: number; compensation: number; total: number };
  /** One US state's figures (us-states.json). */
  us: (code: string) => UsState;
  P: typeof P;
}

export interface PageDef {
  id: string;
  /** Full URL path with slashes: "/templates/freelance-invoice/". No year in the slug. */
  path: string;
  group: Group;
  kind: Kind;
  order: number;
  /** Short label for menus and breadcrumb. */
  nav: string;
  /** One sentence for "related pages" cards. */
  card: string;
  /** 50 to 60 characters, key term first, year included (RECETTE §11). */
  title: string;
  /** 150 to 160 characters, year included. */
  description: string;
  h1: string;
  /** One-sentence standfirst under the H1. */
  intro: string;
  /** Quotable block: ONE paragraph of at least 125 words with the figures (RECETTE §21). */
  resume: string | ((h: Helpers) => string);
  /** Page FAQ: questions unique on the whole site, answers 40 to 90 words (RECETTE §7). */
  faqs: FAQ[] | ((h: Helpers) => FAQ[]);
  /** HTML body (h2, h3, p, ul, ol, tables via h.table). `<!--mini:kind-->` inserts another mini-calculator. */
  body: (h: Helpers) => string;
  /** Full invoice generator at the top of the page (tool pages). */
  tool?: { country: Country; preset?: PresetId };
  /** Mini-calculator placed after the quotable block: a file `src/lib/minis/<kind>.ts`. */
  mini?: string;
  /** Page the mini-calculator's link points to (default: the home generator). */
  miniHref?: string;
  related: string[];
  sources: SourceKey[];
}
export const definePage = (p: PageDef): PageDef => p;
