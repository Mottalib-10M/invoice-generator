// ATO: GST inside a price, and which tax invoice details the amount requires.
import { money } from './_kit';
import { P } from '../engine/params';
import { round2 } from '../engine/invoice';
export default () => ({
  title: 'GST in the price and the tax invoice it needs',
  cta: 'Make the tax invoice',
  inputs: [{ id: 'a', label: 'Price including GST', def: 1320, unit: '$', max: 10_000_000, decimals: 2 }],
  run: ({ a }: Record<string, number>) => {
    const gst = round2(a / 11);
    const req = a <= P.au.tax_invoice_on_request_above ? 'Not required, even on request' : a < P.au.buyer_identity_from ? 'Yes, 7 details' : 'Yes, 7 details + buyer identity or ABN';
    return { head: ['GST included (one-eleventh)', money(gst, 'AU', 2)] as [string, string], rows: [['Price before GST', money(a - gst, 'AU', 2)], ['Tax invoice if the customer asks', req], ['Deadline once asked', `${P.au.provide_within_days} days`]] as [string, string][] };
  },
});
