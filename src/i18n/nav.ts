import { route, type Locale } from './routes';
import { pageById, inGroup } from '../lib/pages';
export interface NavLink { href: string; label: string } export interface NavCategory { label: string; links: NavLink[] }
const CORE: Record<string, string> = { home: 'Invoice generator', method: 'Methodology', about: 'About', widget: 'Embed the generator', contact: 'Contact', editorial: 'Editorial policy', privacy: 'Privacy', terms: 'Legal notice', cookies: 'Cookies' };
export const label = (id: string, _lang: Locale = 'en') => CORE[id] ?? pageById(id)?.nav ?? id;
const link = (id: string): NavLink => ({ href: route(id, 'en'), label: label(id) });
export function navCategories(_lang: Locale): NavCategory[] {
  return [
    { label: 'By country', links: [link('home'), ...inGroup('countries').map((p) => link(p.id))] },
    { label: 'Templates', links: inGroup('templates').map((p) => link(p.id)) },
    { label: 'Guides', links: inGroup('guides').map((p) => link(p.id)) },
  ].filter((c) => c.links.length);
}
export const navDirect = (_lang: Locale): NavLink[] => [link('method')];
export const footerColumns = (_lang: Locale): NavCategory[] => [
  { label: 'Invoice generators', links: [link('home'), ...inGroup('countries').map((p) => link(p.id))] },
  { label: 'Templates', links: inGroup('templates').map((p) => link(p.id)) },
  { label: 'Guides', links: inGroup('guides').map((p) => link(p.id)) },
  { label: 'This site', links: ['method', 'about', 'contact', 'editorial', 'widget', 'terms', 'privacy', 'cookies'].map((i) => link(i)) },
].filter((c) => c.links.length);
export const popularLinks = (_lang: Locale): NavLink[] => [];
