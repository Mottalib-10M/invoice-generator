/** Format checks for tax numbers. Only the ABN has a published check digit (ABR). */

/** ABN: 11 digits, modulus 89 check with the ABR weights (abr.business.gov.au/Help/AbnFormat). */
export function abnValid(input: string): boolean {
  const d = input.replace(/\s/g, '');
  if (!/^\d{11}$/.test(d)) return false;
  const w = [10, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
  const digits = d.split('').map(Number);
  digits[0] -= 1;
  return digits.reduce((s, x, i) => s + x * w[i], 0) % 89 === 0;
}
export const formatAbn = (s: string) => { const d = s.replace(/\D/g, ''); return d.length === 11 ? `${d.slice(0, 2)} ${d.slice(2, 5)} ${d.slice(5, 8)} ${d.slice(8)}` : s; };

/** UK VAT registration number: 9 digits, or 12 for a branch, optional GB prefix (format only). */
export function ukVatFormatValid(input: string): boolean {
  const s = input.replace(/[\s.-]/g, '').toUpperCase().replace(/^GB/, '');
  return /^\d{9}$/.test(s) || /^\d{12}$/.test(s);
}

/** Canadian GST/HST account: business number (9 digits) + RT + 4-digit reference (format only). */
export function caBnValid(input: string): boolean {
  return /^\d{9}\s?RT\s?\d{4}$/i.test(input.trim());
}

/** Quebec QST registration number: 10 digits + TQ + 4 digits (format only). */
export function qstValid(input: string): boolean {
  return /^\d{10}\s?TQ\s?\d{4}$/i.test(input.trim());
}
