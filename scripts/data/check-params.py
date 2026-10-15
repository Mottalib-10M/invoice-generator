#!/usr/bin/env python3
"""Relit chaque page officielle de params-2026.json et vérifie que les valeurs du moteur y
figurent toujours. Écrit src/data/params-check.json (date, page, valeurs trouvées).

Usage : python3 scripts/data/check-params.py

Une page fermée aux robots (ATO, Revenu Québec, canada.ca selon le réseau) est lue par sa
capture web.archive.org (`via`). Code de sortie 1 si une valeur n'est plus trouvée sur une page
lue : c'est le signal qu'un taux ou un seuil a changé et que params-2026.json doit être relu.
"""
import json, os, re, sys, time, datetime, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
P = json.load(open(os.path.join(ROOT, 'src/data/params-2026.json')))
UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36'

# Clé de source → expressions qui doivent figurer sur la page (valeurs du moteur).
EXPECT = {
    'uk_invoice': [r'unique identification number', r'supply date', r'certificate of incorporation'],
    'uk_vat_records': [r'within 30 days', r'£250 or less', r'expressed in sterling', r'sequential number'],
    'uk_vat_guide': [r'round down the total VAT payable'],
    'uk_vat_rates': [r'20%', r'5%', r'0%'],
    'uk_vat_register': [r'£90,000'],
    'uk_reverse_charge': [r'Section 55A applies', r'Customer to pay the VAT to HMRC'],
    'uk_cis': [r'20% for registered subcontractors', r'30% for unregistered subcontractors'],
    'uk_late_terms': [r'30 days', r'60 days'],
    'uk_late_interest': [r'8% plus the Bank of England base rate'],
    'uk_late_costs': [r'£40', r'£70', r'£100', r'£999\.99', r'£9,999\.99'],
    'uk_late_rate_order': [r'8 per cent per annum', r'30th June', r'31st December'],
    'ca_itc_regs': [r'less than \$100', r'\$100 or more and less than \$500', r'terms of payment'],
    'ca_eta': [r'rate of 5% on the value of the consideration'],
    'rq_invoices': [r'\$500 or more', r'Terms of payment', r'GST and QST registration numbers'],
    'rq_small': [r'\$30,000'],
    'bc_pst': [r'7%'],
    'mb_rst': [r'7%'],
    'ato_tax_invoices': [r'\$82\.50', r'\$1,000', r'7 details', r'Total price includes GST', r'28 days'],
    'ato_register': [r'\$75,000', r'\$150,000'],
    'abr_abn_format': [r'modulus 89', r'51 824 753 556'],
}


def text(url: str) -> str:
    req = urllib.request.Request(url, headers={'User-Agent': UA, 'Accept-Language': 'en'})
    t = urllib.request.urlopen(req, timeout=60).read().decode('utf-8', 'ignore')
    t = re.sub(r'<(script|style)[\s\S]*?</\1>', ' ', t)
    t = re.sub(r'<[^>]+>', ' ', t).replace('&nbsp;', ' ').replace('&#160;', ' ').replace('&pound;', '£').replace('&#163;', '£')
    return re.sub(r'\s+', ' ', t)


def main() -> int:
    today = datetime.date.today().isoformat()
    out, bad = {}, 0
    for key, pats in EXPECT.items():
        src = P['sources'][key]
        page, used = None, None
        for u in [src['url']] + ([src['via'].replace('/web/', '/web/') ] if src.get('via') else []):
            if 'web.archive.org/web/' in u:
                u = re.sub(r'/web/(\d+)/', r'/web/\1id_/', u)
            try:
                page, used = text(u), u; break
            except Exception:
                time.sleep(2)
        if page is None:
            out[key] = {'status': 'unreachable', 'checked': today}; print(f'?  {key}: injoignable'); continue
        missing = [p for p in pats if not re.search(p, page, re.I)]
        out[key] = {'status': 'ok' if not missing else 'changed', 'checked': today, 'read_from': used, 'missing': missing}
        bad += bool(missing)
        print(f"{'ok' if not missing else '!!'} {key}: {len(pats) - len(missing)}/{len(pats)}" + (f'  manquant : {missing}' if missing else ''))
        time.sleep(1)
    json.dump(out, open(os.path.join(ROOT, 'src/data/params-check.json'), 'w'), indent=1)
    return 1 if bad else 0


if __name__ == '__main__':
    sys.exit(main())
