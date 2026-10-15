/** llms.txt (RECETTE §21): what the site is, its data, and its main pages, built from the page registry. */
import type { APIRoute } from 'astro';
import { PAGES } from '../lib/pages';
import { SITE_URL, LAST_UPDATED } from '../data/site-config';
import { US_STATES } from '../lib/engine/params';
export const GET: APIRoute = () => {
  const group = (g: string, title: string) => `## ${title}\n\n` + PAGES.filter((p) => p.group === g).map((p) => `- [${p.h1}](${SITE_URL}${p.path}): ${p.card}`).join('\n');
  const body = `# Tax Invoice Maker

> Free invoice generator for the United States, the United Kingdom, Canada and Australia. No account, no watermark; the PDF is built in the visitor's browser and nothing typed is sent to a server. Taxes are applied per line by jurisdiction: the general sales tax rate of each of the ${US_STATES.length} US states and DC plus a local rate, UK VAT (20%, 5%, 0%, exempt) with HMRC rounding, the domestic reverse charge and CIS deductions, Canadian GST, HST, PST, RST and QST by province, and Australian GST with ATO tax invoice wording. A checklist compares the invoice with the official list of required details. Rates and rules last checked ${LAST_UPDATED}.

Publisher: Radif Partners. Sources: HMRC and GOV.UK, the Canada Revenue Agency and Justice Laws, Revenu Québec, the Australian Taxation Office and Australian Business Register, the 51 US state revenue departments, the Bank of England.

- [Invoice generator](${SITE_URL}/): the generator, all four countries
- [Methodology](${SITE_URL}/methodology/): formulas, rounding, tests, every source with its reading date

${group('countries', 'Generators by country')}

${group('templates', 'Templates')}

${group('guides', 'Guides')}
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
