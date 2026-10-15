#!/usr/bin/env python3
"""Bank of England Bank Rate (série IUDBEDR) → src/data/uk-bank-rate.json.

Usage : python3 scripts/data/fetch-bank-rate.py

Télécharge l'historique quotidien depuis la base de données de la Banque d'Angleterre (CSV
officiel, sans clé), garde les jours de changement, puis calcule le « reference rate » de la
Late Payment of Commercial Debts (Interest) Act 1998 : le taux en vigueur le 30 juin (intérêts qui
commencent à courir du 1er juillet au 31 décembre) ou le 31 décembre (du 1er janvier au 30 juin),
article 4 du Rate of Interest (No. 3) Order 2002. Lancé chaque semaine par l'Action planifiée.
"""
import csv, datetime, io, json, os, sys, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(ROOT, 'src/data/uk-bank-rate.json')
URL = ('https://www.bankofengland.co.uk/boeapps/database/_iadb-fromshowcolumns.asp?csv.x=yes'
       '&Datefrom=01/Jan/2015&Dateto=now&SeriesCodes=IUDBEDR&CSVF=TN&UsingCodes=Y&VPD=Y&VFD=N')


def main() -> int:
    req = urllib.request.Request(URL, headers={'User-Agent': 'Mozilla/5.0 (compatible; rate-check)'})
    raw = urllib.request.urlopen(req, timeout=60).read().decode('utf-8', 'ignore')
    rows = []
    for r in csv.reader(io.StringIO(raw)):
        if len(r) < 2 or r[0] == 'DATE':
            continue
        d = datetime.datetime.strptime(r[0].strip(), '%d %b %Y').date()
        rows.append((d, float(r[1])))
    if len(rows) < 100:
        print('Réponse inattendue de la Banque d\'Angleterre : rien écrit.'); return 1
    rows.sort()
    changes, prev = [], None
    for d, v in rows:
        if v != prev:
            changes.append({'from': d.isoformat(), 'rate': v}); prev = v

    def on(day: datetime.date) -> float:
        best = None
        for c in changes:
            if c['from'] <= day.isoformat(): best = c['rate']
        return best

    last = rows[-1][0]
    refs = []
    for y in range(2016, last.year + 2):
        for start, ref_day in ((datetime.date(y, 1, 1), datetime.date(y - 1, 12, 31)), (datetime.date(y, 7, 1), datetime.date(y, 6, 30))):
            if ref_day <= last:
                refs.append({'from': start.isoformat(), 'reference_day': ref_day.isoformat(), 'base': on(ref_day)})
    out = {'retrieved_at': datetime.date.today().isoformat(), 'last_observation': last.isoformat(), 'current': rows[-1][1],
           'source': 'Bank of England database, series IUDBEDR (official Bank Rate)', 'changes': changes, 'reference_rates': refs}
    json.dump(out, open(OUT, 'w'), indent=1)
    print(f"Bank Rate {rows[-1][1]} % au {last} · {len(changes)} changements · {len(refs)} périodes de référence → {os.path.relpath(OUT, ROOT)}")
    return 0


if __name__ == '__main__':
    sys.exit(main())
