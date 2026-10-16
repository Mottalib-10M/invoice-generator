/** Typed access to the official figures. Pages and components read values here, never in the JSON. */
import raw from '../../data/params-2026.json';
import usRaw from '../../data/us-states.json';
import boeRaw from '../../data/uk-bank-rate.json';

export interface Source { url: string; label: string; read: string; via?: string }
export const P = raw as typeof raw;
export type SourceKey = keyof typeof raw.sources;
export const SOURCES = raw.sources as Record<SourceKey, Source>;

export const COUNTRIES = ['US', 'UK', 'CA', 'AU'] as const;
export type Country = (typeof COUNTRIES)[number];

export interface UsState { code: string; name: string; rate: number; hasStateTax: boolean; local: boolean; url: string; lookup?: string | null; minLocal?: number; localNote?: string; status?: string; checked?: string; via?: string; read_from?: string; excerpt?: string; special?: SpecialRate[] }
export interface SpecialRate { note: string; url: string; status: string; checked: string; excerpt?: string }
export const US_STATES = (usRaw as { states: UsState[] }).states;
export const US_RETRIEVED = (usRaw as { retrieved_at: string }).retrieved_at;
export const usState = (code: string): UsState => US_STATES.find((s) => s.code === code) ?? US_STATES.find((s) => s.code === 'TX')!;

export type ProvinceCode = keyof typeof raw.ca.provinces;
export interface Province { name: string; kind: 'gst' | 'hst' | 'gst_pst' | 'gst_qst'; hst?: number; pst?: number; pst_name?: string; hst_previous?: number; changed?: string }
export const PROVINCES = raw.ca.provinces as Record<ProvinceCode, Province>;
export const PROVINCE_CODES = Object.keys(PROVINCES) as ProvinceCode[];

export interface BankRate { retrieved_at: string; last_observation: string; current: number; changes: Array<{ from: string; rate: number }>; reference_rates: Array<{ from: string; reference_day: string; base: number }> }
export const BOE = boeRaw as BankRate;

/** Country facts used across the site: currency, page size, spelling, the authority. */
export const COUNTRY_INFO: Record<Country, { name: string; short: string; currency: string; locale: string; paper: 'letter' | 'a4'; taxName: string; idLabel: string; authority: string; regionLabel: string; postcode: string }> = {
  US: { name: 'United States', short: 'US', currency: 'USD', locale: 'en-US', paper: 'letter', taxName: 'Sales tax', idLabel: 'Sales tax permit or EIN', authority: 'state revenue department', regionLabel: 'State', postcode: 'ZIP code' },
  UK: { name: 'United Kingdom', short: 'UK', currency: 'GBP', locale: 'en-GB', paper: 'a4', taxName: 'VAT', idLabel: 'VAT registration number', authority: 'HMRC', regionLabel: 'Nation', postcode: 'Postcode' },
  CA: { name: 'Canada', short: 'Canada', currency: 'CAD', locale: 'en-CA', paper: 'letter', taxName: 'GST/HST', idLabel: 'GST/HST registration number (BN)', authority: 'CRA', regionLabel: 'Province or territory', postcode: 'Postal code' },
  AU: { name: 'Australia', short: 'Australia', currency: 'AUD', locale: 'en-AU', paper: 'a4', taxName: 'GST', idLabel: 'ABN', authority: 'ATO', regionLabel: 'State or territory', postcode: 'Postcode' },
};

/** Reference rate of the UK late payment law for interest that starts to run on `day` (ISO). */
export function ukReferenceRate(day: string): { base: number; referenceDay: string; from: string } {
  let best = BOE.reference_rates[0];
  for (const r of BOE.reference_rates) if (r.from <= day) best = r;
  return { base: best.base / 100, referenceDay: best.reference_day, from: best.from };
}
