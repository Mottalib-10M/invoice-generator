/** Registry of content pages: every file of `src/content/pages/` is loaded here. */
import type { PageDef, Group } from './page-types';
const mods = import.meta.glob<{ default: PageDef }>('../content/pages/*.ts', { eager: true });
export const PAGES: PageDef[] = Object.entries(mods)
  .map(([file, m]) => {
    const p = m.default;
    const base = file.split('/').pop()!.replace(/\.ts$/, '');
    if (p.id !== base) throw new Error(`${file}: id "${p.id}" differs from the file name`);
    return p;
  })
  .sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));
export const GROUP_ORDER: Group[] = ['countries', 'templates', 'guides'];
export const pageById = (id: string) => PAGES.find((p) => p.id === id);
export const inGroup = (g: Group) => PAGES.filter((p) => p.group === g);
