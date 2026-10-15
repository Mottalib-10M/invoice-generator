// Invoice numbering: how much room a padded yearly counter leaves.
export default () => ({
  title: 'How many digits your yearly counter needs',
  cta: 'Start numbering in the generator',
  inputs: [{ id: 'm', label: 'Invoices per month', def: 40, max: 1_000_000 }, { id: 'd', label: 'Digits in the counter', def: 4, max: 8 }],
  run: ({ m, d }: Record<string, number>) => {
    const digits = Math.min(Math.max(Math.round(d), 1), 8);
    const cap = 10 ** digits - 1;
    const perYear = Math.round(m * 12);
    const needed = Math.max(String(Math.max(perYear, 1)).length, 1);
    return { head: ['Invoices in a year', perYear.toLocaleString('en-US')] as [string, string], rows: [['Capacity of the counter', `${cap.toLocaleString('en-US')} a year`], ['Digits you actually need', `${needed}`], ['Verdict', perYear <= cap ? 'Enough room, reset each January' : 'Too small: add a digit']] as [string, string][] };
  },
});
