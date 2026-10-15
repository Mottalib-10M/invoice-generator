#!/usr/bin/env python3
"""Vérifie le taux général de taxe de vente de chaque État sur la page officielle de son
administration fiscale (DOR, statut ou barème publié), puis écrit src/data/us-states.json.

Usage : python3 scripts/data/verify-us-rates.py [--offline]

- La graine `scripts/data/us-states-seed.json` porte, par État, le taux et l'URL officielle.
- Le script télécharge chaque URL (PDF compris, lu avec pypdf), cherche le taux sous ses
  écritures usuelles (« 6.25% », « 6.25 percent », « 6 1/4 », « six percent »…) et note :
  verified (taux trouvé), not_found (page lue, taux absent : à relire à la main),
  blocked (403, délai, robot refusé). Un État sans taxe d'État (AK, DE, MT, NH, OR) est
  vérifié par la présence de la page seule.
- Rien n'est jamais inventé : un taux « not_found » reste celui de la graine, mais le
  compte rendu le signale et l'Action planifiée échoue s'il y en a plus de 8.
"""
import io, json, os, re, sys, time, datetime, urllib.request, ssl

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SEED = os.path.join(ROOT, 'scripts/data/us-states-seed.json')
OUT = os.path.join(ROOT, 'src/data/us-states.json')
UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36'
WORDS = {1: 'one', 2: 'two', 3: 'three', 4: 'four', 5: 'five', 6: 'six', 7: 'seven'}


def fetch(url: str) -> bytes:
    req = urllib.request.Request(url, headers={'User-Agent': UA, 'Accept': 'text/html,application/pdf,*/*', 'Accept-Language': 'en-US,en;q=0.9'})
    ctx = ssl.create_default_context()
    with urllib.request.urlopen(req, timeout=45, context=ctx) as r:
        return r.read()


def text_of(raw: bytes) -> str:
    if raw[:4] == b'%PDF':
        try:
            import pypdf
            r = pypdf.PdfReader(io.BytesIO(raw))
            return ' '.join((p.extract_text() or '') for p in r.pages[:60])
        except Exception as e:  # pypdf absent ou PDF illisible
            return ''
    t = raw.decode('utf-8', 'ignore')
    t = re.sub(r'<(script|style)[\s\S]*?</\1>', ' ', t)
    t = re.sub(r'<[^>]+>', ' ', t)
    t = re.sub(r'&nbsp;|&#160;', ' ', t)
    return re.sub(r'\s+', ' ', t)


def patterns(rate: float) -> list[str]:
    s = f'{rate:g}'
    alts = {s, f'{rate:.2f}'.rstrip('0').rstrip('.'), f'{rate:.1f}', f'{rate:.2f}', f'{rate:.3f}'}
    pats = [re.escape(a) + r'\s?(?:%|percent|per cent)' for a in alts]
    if rate == int(rate) and int(rate) in WORDS:
        pats.append(WORDS[int(rate)] + r'[\s-]+(?:percent|per cent)')
    frac = {0.25: '1/4', 0.5: '1/2', 0.75: '3/4'}.get(round(rate - int(rate), 3))
    if frac:
        pats.append(rf'{int(rate)}\s?{re.escape(frac)}\s?(?:%|percent)')
    # Taux au millième écrits en fraction décimale (0.0625)
    pats.append(re.escape(f'{rate / 100:.4f}'.rstrip('0')))
    return pats


def check(s: dict, url: str) -> str:
    try:
        txt = text_of(fetch(url))
    except Exception:
        return 'blocked'
    if not s['hasStateTax']:
        return 'verified' if len(txt) > 500 else 'not_found'
    return 'verified' if any(re.search(p, txt, re.I) for p in patterns(s['rate'])) else 'not_found'


def main() -> int:
    seed = json.load(open(SEED))
    today = datetime.date.today().isoformat()
    offline = '--offline' in sys.argv
    old = {}
    if os.path.exists(OUT):
        old = {s['code']: s for s in json.load(open(OUT)).get('states', [])}
    rows, counts = [], {'verified': 0, 'not_found': 0, 'blocked': 0}
    for s in seed['states']:
        row = dict(s)
        if offline:
            row.update({k: old.get(s['code'], {}).get(k) for k in ('status', 'checked') if old.get(s['code'])})
            rows.append(row); continue
        status, via = check(s, s['url']), None
        if status != 'verified':
            # Page officielle fermée aux robots ou réécrite : même page, capture web.archive.org de l'année.
            arch = f"https://web.archive.org/web/{today[:4]}id_/{s['url']}"
            if check(s, arch) == 'verified':
                status, via = 'verified', arch
        row['status'], row['checked'] = status, today
        if via: row['via'] = via
        counts[status] += 1
        rows.append(row)
        print(f"{s['code']}  {s['rate']:>6}  {status:10}  {s['url']}")
        time.sleep(0.4)
    json.dump({'retrieved_at': today, 'source': 'State revenue departments (DOR) and state statutes, one official URL per state', 'states': rows}, open(OUT, 'w'), indent=1)
    print(f"\n{counts}  →  {os.path.relpath(OUT, ROOT)}")
    return 1 if counts['not_found'] > 8 else 0


if __name__ == '__main__':
    sys.exit(main())
