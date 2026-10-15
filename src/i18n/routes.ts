/**
 * Routes of the site. English only (US, UK, Canadian and Australian spelling where the page is about that country), served at the root: no /en/ prefix.
 * Content pages come from `src/content/pages/*.ts` (one file = one page, see CONTRIBUTING-PAGES.md).
 */
import { makeRouter, type RouteDef } from './routes-core';
import { PAGES } from '../lib/pages';
export const LOCALES = ['en'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';
const R = (id: string, path: string, noindex = false): RouteDef<Locale> => ({ id, paths: { en: path }, ...(noindex ? { noindex } : {}) });
const CORE: RouteDef<Locale>[] = [
  R('home', '/'),
  R('method', '/methodology/'),
  R('about', '/about/'),
  R('widget', '/widget/', true),
  R('contact', '/contact/', true),
  R('editorial', '/editorial-policy/', true),
  R('privacy', '/privacy/', true),
  R('terms', '/legal-notice/', true),
  R('cookies', '/cookies/', true),
];
export const ROUTES: RouteDef<Locale>[] = [CORE[0], ...PAGES.map((p) => R(p.id, p.path)), ...CORE.slice(1)];
export const { NOINDEX_PATHS, route, altPaths } = makeRouter(LOCALES, ROUTES);
