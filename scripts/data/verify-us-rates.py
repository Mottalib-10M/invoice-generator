#!/usr/bin/env python3
"""Vérifie le taux général de taxe de vente de chaque État sur une source officielle de l'État
(Department of Revenue, statut, publication de la législature), puis écrit src/data/us-states.json.

Usage : python3 scripts/data/verify-us-rates.py [--offline] [--only AZ,CO]

- La graine `scripts/data/us-states-seed.json` porte, par État, le taux, l'URL officielle
  affichée (`url`) et, si besoin, d'autres URL officielles lisibles (`alt`) : PDF du même
  organisme, statut, publication de la législature, ou capture web.archive.org datée de la
  page officielle (en dernier recours).
- Chaque URL est lue avec deux en-têtes User-Agent (outil en ligne de commande, puis
  navigateur : certains pare-feu d'État refusent l'un et acceptent l'autre), PDF compris (pypdf)
  et réponse gzip comprise (captures web.archive.org).
- Le taux est cherché sous ses écritures usuelles (« 6.25% », « 6.25 percent », « 6 1/4 »,
  « six percent (6%) »…). Un État sans taxe d'État (AK, DE, MT, NH, OR) est vérifié par une
  phrase attendue (`expect`) sur sa page officielle, à défaut par la présence de la page.
- Statuts : verified (taux trouvé ; `read_from` = URL lue, `excerpt` = passage où il figure),
  not_found (pages lues, taux absent : un taux a peut-être changé), blocked (aucune page lue).
- Rien n'est jamais inventé : un taux non confirmé reste celui de la graine, le compte rendu le
  signale et le script sort en erreur (l'Action planifiée lève alors un avertissement).
"""
import gzip, io, json, os, re, sys, time, datetime, urllib.request, ssl

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SEED = os.path.join(ROOT, 'scripts/data/us-states-seed.json')
OUT = os.path.join(ROOT, 'src/data/us-states.json')
UAS = [
    'curl/8.7.1',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36',
]
WORDS = {1: 'one', 2: 'two', 3: 'three', 4: 'four', 5: 'five', 6: 'six', 7: 'seven'}


def fetch(url: str, ua: str = UAS[0]) -> bytes:
    req = urllib.request.Request(url, headers={'User-Agent': ua, 'Accept': 'text/html,application/pdf,*/*', 'Accept-Language': 'en-US,en;q=0.9'})
    with urllib.request.urlopen(req, timeout=40, context=ssl.create_default_context()) as r:
        raw = r.read()
    return gzip.decompress(raw) if raw[:2] == b'\x1f\x8b' else raw


def text_of(raw: bytes) -> str:
    if raw[:4] == b'%PDF':
        try:
            import pypdf
            r = pypdf.PdfReader(io.BytesIO(raw))
            t = ' '.join((p.extract_text() or '') for p in r.pages[:600])
        except Exception:  # pypdf absent ou PDF illisible
            return ''
    else:
        t = raw.decode('utf-8', 'ignore')
        t = re.sub(r'<(script|style)[\s\S]*?</\1>', ' ', t)
        t = re.sub(r'<[^>]+>', ' ', t)
        t = re.sub(r'&nbsp;|&#160;', ' ', t)
    return re.sub(r'\s+', ' ', t)


def patterns(rate: float) -> list[str]:
    s = f'{rate:g}'
    alts = {s, f'{rate:.2f}'.rstrip('0').rstrip('.'), f'{rate:.1f}', f'{rate:.2f}', f'{rate:.3f}'}
    pats = [r'(?<![\d.])' + re.escape(a) + r'\s?(?:%|percent|per cent)' for a in alts]
    if rate == int(rate) and int(rate) in WORDS:
        pats.append(r'(?<![\w-])' + WORDS[int(rate)] + r'[\s-]+(?:percent|per cent)')
    frac = {0.25: '1/4', 0.5: '1/2', 0.75: '3/4'}.get(round(rate - int(rate), 3))
    if frac:
        pats.append(rf'(?<![\d.]){int(rate)}\s?{re.escape(frac)}\s?(?:%|percent)')
    # Taux au millième écrits en fraction décimale (0.0625)
    pats.append(r'(?<![\d.])' + re.escape(f'{rate / 100:.4f}'.rstrip('0')) + r'(?!\d)')
    return pats


def find(s: dict, txt: str) -> str | None:
    """Passage de la page où figure le taux (ou la phrase attendue), sinon None."""
    pats = [s['expect']] if s.get('expect') else ([] if not s['hasStateTax'] else patterns(s['rate']))
    if not pats:  # État sans taxe et sans phrase attendue : la page suffit
        return txt[:160] if len(txt) > 500 else None
    # Le taux doit parler de taxe de vente (et non d'un impôt sur le revenu ou foncier) :
    # d'abord dans un voisinage étroit, puis plus large.
    for width in (160, 300, 500):
        for p in pats:
            for m in re.finditer(p, txt, re.I):
                if s.get('expect') or SALES.search(txt[max(0, m.start() - width):m.end() + width]):
                    return txt[max(0, m.start() - 110):m.end() + 50].strip()
    return None


SALES = re.compile(r"sales|retail|transaction privilege|gross receipts|excise tax|general excise|use tax", re.I)


def check(s: dict, today: str) -> dict:
    urls = [s['url']] + list(s.get('alt') or [])
    # Dernier recours : la capture web.archive.org de l'année de la page affichée.
    urls.append(f"https://web.archive.org/web/{today[:4]}id_/{s['url']}")
    read = False
    for u in urls:
        # Chaque en-tête peut recevoir une page différente (page réelle ou page de contrôle).
        for ua in UAS:
            try:
                txt = text_of(fetch(u, ua))
            except Exception:  # 403 d'un pare-feu, délai, 404
                time.sleep(1)
                continue
            read = read or len(txt) > 500
            ex = find(s, txt)
            if ex:
                return {'status': 'verified', 'read_from': u, 'excerpt': ex}
            time.sleep(0.5)
    return {'status': 'not_found' if read else 'blocked'}


def check_special(sp: dict) -> dict:
    """Taux réduit ou exonération courante (alimentation, vêtements) : phrase attendue sur la source."""
    for ua in UAS:
        try:
            txt = text_of(fetch(sp['url'], ua))
        except Exception:
            continue
        m = re.search(sp['expect'], txt, re.I)
        if m:
            return {'status': 'verified', 'excerpt': txt[max(0, m.start() - 60):m.end() + 40].strip()}
    return {'status': 'not_found'}


def main() -> int:
    seed = json.load(open(SEED))
    today = datetime.date.today().isoformat()
    offline = '--offline' in sys.argv
    only = None
    if '--only' in sys.argv:
        only = set(sys.argv[sys.argv.index('--only') + 1].upper().split(','))
    old = {}
    if os.path.exists(OUT):
        old = {s['code']: s for s in json.load(open(OUT)).get('states', [])}
    keep = ('status', 'checked', 'read_from', 'excerpt', 'special')
    rows, counts, special_bad = [], {'verified': 0, 'not_found': 0, 'blocked': 0}, 0
    for s in seed['states']:
        row = {k: v for k, v in s.items() if k not in ('alt', 'expect', 'special')}
        if offline or (only and s['code'] not in only):
            row.update({k: old[s['code']][k] for k in keep if k in old.get(s['code'], {})})
            rows.append(row)
            if row.get('status') in counts: counts[row['status']] += 1
            continue
        res = check(s, today)
        row.update(res)
        row['checked'] = today
        counts[res['status']] += 1
        if s.get('special'):
            row['special'] = []
            for sp in s['special']:
                r = check_special(sp)
                row['special'].append({'note': sp['note'], 'url': sp['url'], **r, 'checked': today})
                special_bad += r['status'] != 'verified'
                print(f"    {r['status']:10} {sp['note']}")
        rows.append(row)
        print(f"{s['code']}  {s['rate']:>6}  {res['status']:10}  {res.get('read_from', s['url'])}")
        time.sleep(0.4)
    json.dump({'retrieved_at': today if not offline else json.load(open(OUT))['retrieved_at'],
               'source': 'State revenue departments (DOR), state statutes and legislative publications: one official URL per state, read automatically',
               'states': rows}, open(OUT, 'w'), indent=1, ensure_ascii=False)
    print(f"\n{counts}  →  {os.path.relpath(OUT, ROOT)}")
    if special_bad: print(f'{special_bad} special-rate note(s) not found on their source')
    return 0 if counts['verified'] == len(rows) and not special_bad else 1


if __name__ == '__main__':
    sys.exit(main())
