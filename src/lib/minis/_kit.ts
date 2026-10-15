/** Shared bits for mini-calculators (ignored by the registry: "_" prefix). */
import { COUNTRY_INFO, COUNTRIES, US_STATES, PROVINCE_CODES, PROVINCES, type Country } from '../engine/params';
import { computeInvoice, defaultTax, type InvoiceInput } from '../engine/invoice';
import { money, pctText } from '../helpers';
export { money, pctText };
export const COUNTRY_OPTS = COUNTRIES.map((c, i) => ({ value: String(i + 1), label: COUNTRY_INFO[c].name }));
export const countryOf = (n: number): Country => COUNTRIES[Math.min(Math.max(Math.round(n) - 1, 0), 3)];
export const COUNTRY = (def: Country, label = 'Country') => ({ id: 'c', label, def: COUNTRIES.indexOf(def) + 1, options: COUNTRY_OPTS });
export const STATE_OPTS = US_STATES.map((s, i) => ({ value: String(i + 1), label: `${s.name} (${s.rate}%)` }));
export const stateOf = (n: number) => US_STATES[Math.min(Math.max(Math.round(n) - 1, 0), US_STATES.length - 1)];
export const STATE = (code: string) => ({ id: 's', label: 'State', def: US_STATES.findIndex((s) => s.code === code) + 1, options: STATE_OPTS });
export const PROV_OPTS = PROVINCE_CODES.map((p, i) => ({ value: String(i + 1), label: PROVINCES[p].name }));
export const provOf = (n: number) => PROVINCE_CODES[Math.min(Math.max(Math.round(n) - 1, 0), PROVINCE_CODES.length - 1)];
export const PROVINCE = (code: string) => ({ id: 'p', label: 'Province or territory', def: PROVINCE_CODES.indexOf(code as never) + 1, options: PROV_OPTS });
export const AMOUNT = (def: number, label = 'Amount before tax', unit = '$') => ({ id: 'a', label, def, unit, max: 10_000_000, decimals: 2 });
export const YESNO = [{ value: '0', label: 'No' }, { value: '1', label: 'Yes' }];
/** One-line invoice through the engine. */
export function one(country: Country, amount: number, o: Partial<InvoiceInput> = {}) {
  const region = o.region ?? (country === 'US' ? 'TX' : country === 'CA' ? 'ON' : '');
  return computeInvoice({ country, region, registered: true, lines: [{ desc: 'Item', qty: 1, price: amount, tax: defaultTax(country) }], ...o });
}
export const sym = (c: Country) => (c === 'UK' ? '£' : '$');
