/** Checks for tax numbers. The ABN (ABR, modulus 89) and the Canadian business number (CRA, the SIN
 * formula applied to the first nine digits) have an officially published check digit; HMRC does not publish
 * one for UK VAT numbers, so those are checked for format only. */

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

/** Canadian GST/HST account: business number (9 digits) + RT + 4-digit reference (shape only). */
export function caBnFormatValid(input: string): boolean {
  return /^\d{9}\s?RT\s?\d{4}$/i.test(input.trim());
}

/** Check digit of the 9-digit business number: CRA's SIN formula, which the CRA says also validates "the first
 * nine digits of a Business Number (BN)". Every second digit doubled and cross-added, the total subtracted from
 * the next multiple of ten gives the ninth digit. CRA's example: 999 999 998. */
export function caBnCheckDigitValid(input: string): boolean {
  const d = input.replace(/\D/g, '').slice(0, 9);
  if (d.length !== 9) return false;
  let sum = 0;
  for (let i = 0; i < 8; i++) {
    const x = Number(d[i]) * (i % 2 === 1 ? 2 : 1);
    sum += x > 9 ? x - 9 : x;
  }
  return (10 - (sum % 10)) % 10 === Number(d[8]);
}

/** GST/HST account number: right shape and a business number whose check digit is right. */
export function caBnValid(input: string): boolean {
  return caBnFormatValid(input) && caBnCheckDigitValid(input);
}

/** Quebec QST registration number: 10 digits + TQ + 4 digits (format only). */
export function qstValid(input: string): boolean {
  return /^\d{10}\s?TQ\s?\d{4}$/i.test(input.trim());
}
