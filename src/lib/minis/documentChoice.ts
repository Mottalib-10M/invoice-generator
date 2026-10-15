// Invoice or receipt: which document the situation calls for.
import { COUNTRY, countryOf, YESNO } from './_kit';
import { docTitle } from '../invoice-model';
export default () => ({
  title: 'Which document should you send?',
  cta: 'Create it now',
  inputs: [{ id: 'p', label: 'Has the customer already paid?', def: 0, options: YESNO }, { id: 'r', label: 'Registered for VAT, GST or sales tax?', def: 1, options: YESNO }, COUNTRY('AU')],
  run: ({ p, r, c }: Record<string, number>) => {
    const k = countryOf(c);
    const kind = p ? 'receipt' : 'invoice';
    const title = docTitle({ country: k, kind, registered: !!r });
    return { head: ['Send', title] as [string, string], rows: [['Asks for payment', p ? 'No, confirms it' : 'Yes'], ['Due date on it', p ? 'No' : 'Yes'], ['Tax shown separately', r ? 'Yes' : 'No tax charged']] as [string, string][] };
  },
});
