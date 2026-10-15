/** Resolves the parts of a page that may be written as functions of the helpers (resume, faqs). */
import { helpers } from './helpers';
import type { PageDef, FAQ } from './page-types';
export function resume(p: PageDef): string { return typeof p.resume === 'function' ? p.resume(helpers()) : p.resume; }
export function faqs(p: PageDef): FAQ[] { return typeof p.faqs === 'function' ? p.faqs(helpers()) : p.faqs; }
