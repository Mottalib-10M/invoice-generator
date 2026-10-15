# Ajouter ou réécrire une page de Tax Invoice Maker

Notice pour les agents qui écrivent les pages. À lire en entier, avec `~/Documents/GitHub/RECETTE-SITE.md`
(§0, §6, §7, §9.3, §11, §17.4, §21, §26).

Le site : un générateur de factures gratuit (aucune inscription, aucun filigrane, PDF fait dans le navigateur)
pour les États-Unis, le Royaume-Uni, le Canada et l'Australie, avec la taxe juste par pays, État ou province et
une liste de contrôle des mentions obligatoires. Langue : **anglais seul**, servi à la racine. Orthographe
britannique sur les pages britanniques et australiennes (« organisation », « licence », « colour »), américaine
sur les pages américaines, canadienne (britannique pour -our, américaine pour -ize) sur les pages canadiennes ;
pages générales : américaine. Éditeur : Radif Partners. Aucun nom de personne, aucune photo.

## Principe

Une page = **un fichier** `src/content/pages/<id>.ts` (type `PageDef`, `src/lib/page-types.ts`). Il porte l'URL,
le titre, la description, le H1, le chapeau, le bloc citable (`resume`), la FAQ, le corps, les sources, et soit
le générateur complet (`tool: { country, preset }`), soit un mini-simulateur (`mini`). Modèle : 
`src/content/pages/invoice-generator-usa.ts`. Copier la **structure**, jamais les phrases. Ne modifier aucun
fichier du cœur pour ajouter une page.

## Les chiffres : jamais en dur

- Taux, seuils et règles : `src/data/params-2026.json` (lu via `h.P`), taux des États : `h.us('TX').rate`,
  taux de la Banque d'Angleterre : `BOE` dans `src/lib/engine/params.ts`.
- Un montant calculé passe par le moteur : `h.calc({ country, region, registered, lines: [...] })` rend
  `.tax`, `.total`, `.bands`, `.reverseChargeVat`, `.cisDeduction`, `.due` ; `h.late(dette, échéance, payé le)`
  rend l'intérêt de retard britannique.
- Mise en forme : `h.money(n, 'UK'|'US'|'CA'|'AU', décimales?)`, `h.pct(0.2)` → « 20% », `h.num(n)`,
  `h.date('2026-07-01', 'UK')`, `h.table(entêtes, lignes, légende, alignements)`, `h.src('uk_vat_records')`,
  `h.a('id-de-page', 'texte')` pour un lien interne (un id inconnu fait échouer le build).
- **Un fait absent de params-2026.json et des sources listées ne se publie pas.** Pas de chiffre de blog,
  de logiciel comptable ou de mémoire. Les seuls faits admis sont ceux des sources de `params-2026.json`
  (lues le 2026-10-15) ; en cas de doute, on ne l'écrit pas.

## Les champs

| Champ | Règle |
|---|---|
| `title` | **50 à 60 caractères**, terme-clé d'abord, année 2026. Jamais en tête : un pays ou son adjectif (`UK `, `US `, `USA`, `Canada`, `Australia`, `Canadian`, `Australian`, `British`, `American`), un mot d'outil (`Calculator`, `Calculate`), `About`, `How`, `What`, `When`, `FAQ`. Pas de tiret cadratin. Compter avec python. |
| `description` | **150 à 160 caractères**, année et un fait chiffré. Unique sur le site. |
| `resume` | **UN** paragraphe d'au moins 125 mots, citable seul, avec chiffres (§21). La première phrase s'affiche, le reste se replie : elle porte le message. Ne pas commencer la 2ᵉ phrase par un chiffre. |
| `faqs` | Page outil : 4 à 6. Guide : 5 à 8. Index : 6 à 8. Réponses de **40 à 90 mots**. Une question n'existe **qu'une fois sur tout le site** : nommer le pays ou la situation dans la question. |
| `body` | `(h) => \`…\`` HTML : `h2`, `h3`, `p`, `ul`, `ol`, `h.table(...)`. `<!--mini:<kind>-->` insère un mini-simulateur de plus (fichiers de `src/lib/minis/`). |
| `related` | 3 à 6 ids existants. |
| `sources` | Clés de `params-2026.json > sources`. Au moins 2 ; guides : 3. |

### Longueurs (comptées par `check-seo.py` dans `<main>`, FAQ et tableaux compris)

- page outil (générateur complet, `tool`) : au moins **600 mots** au total ;
- guide (`/guides/…`) : au moins **1 300 mots** ;
- index (`/templates/`, `/guides/`) : au moins **900 mots**.

## Ton

Voix humaine, phrases de longueur variable, le chiffre d'abord, des cas concrets (un métier, un montant, une
province). **Interdits** : tiret cadratin « — » et demi-cadratin en incise ; « it's important to note »,
« dive into », « whether you're… or… », « in today's… » ; « Additionally / Moreover / Furthermore » en enfilade ;
triplets systématiques ; conclusions qui résument ; émojis ; listes à puces là où une phrase suffit. Aucune
recommandation de logiciel, de banque ou de prestataire ; aucun lien vers un site commercial ni vers un site
de `_trame/domaines-ovh.txt`.

## Unicité (RECETTE §6)

`check-unique.py` compare toutes les pages, chiffres neutralisés, seuil 30 %, fenêtre des 12 000 premiers
caractères : ouvrir chaque page sur ce qui n'appartient qu'à elle, avec un vocabulaire propre. Aucune
tournure reprise d'une autre page. Aucune question de FAQ en double.

## Contrôles

```bash
cd ~/Documents/GitHub/a-publier/Mottalib-10M/invoice-generator
OUTDIR=/tmp/<toi>/dist npx astro build      # sortie séparée si plusieurs agents travaillent
python3 scripts/check-seo.py /tmp/<toi>/dist
python3 scripts/check-unique.py /tmp/<toi>/dist
python3 scripts/check-trame.py /tmp/<toi>/dist
```
