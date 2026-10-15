# Étude — générateur de factures (idée INV, 2026-10-15)

## Demande mesurée

- Keyword Planner (compte Objet Tech), relevé du 2026-10-15 (`reports/etude-niches-2026-10-15-volumes-KP.txt`) :
  `invoice generator` 100 k – 1 M ; `free invoice generator`, `invoice maker`, `invoice template` 10 k – 100 k
  chacun (États-Unis). Total US annoncé ≈ 455 k ; US + UK (≈ 111 k) + CA (≈ 77 k) + AU (≈ 80 k) ≈ 720 k.
  Enchère haute 8 à 34 € : la plus forte du lot.
- `check-volumes.py` sur les quatre requêtes US nommées : 411 096 recherches/mois estimées, GO (fichier
  `research/invoice-volumes-kp.txt`).

## SERP (relevé du 2026-10-15)

WebSearch n'est pas Google et il est géolocalisé aux États-Unis : il remonte des pages de vendeurs, des
lancements Product Hunt et des pages parasites (sous-domaines piratés de bart.gov, manchester.ac.uk…), écartées.
Les pages ci-dessous ont été ouvertes (WebFetch) le 2026-10-15 ; quand elles ne s'ouvrent pas, c'est dit.

| Site | Classe | Ce qu'il fait | Défaut constaté | En quoi on fait mieux |
|---|---|---|---|---|
| invoice-generator.com | DÉFENDU (marque, « over 4 million businesses ») | Formulaire unique, PDF sans compte | Taxe = une seule case « Percent (%) Flat Amount ($) Off » ; aucun taux d'État, de TVA ou de GST ; aucune mention de VAT/GST ; liens Sign In / History sans dire ce qui est conservé | Taxe par ligne selon le pays, l'État ou la province ; liste de contrôle des mentions obligatoires ; rien n'est conservé hors du navigateur |
| zoho.com/invoice/invoice-generator | DÉFENDU (éditeur de logiciel) | Générateur d'appel vers Zoho Invoice | Pied de facture « Crafted with ease using » Zoho ; écrans d'inscription et de vérification par téléphone ; taxe non détaillée ; enregistrement en ligne = compte | Aucun pied de marque, aucun compte, taxe juste par pays |
| squareup.com (invoice templates) | DÉFENDU | Modèles à télécharger, envoi par Square Invoices | Page générateur en 404 le 2026-10-15 ; modèles Word/Excel sans calcul de taxe par juridiction ; envoi et paiement = compte Square | Calcul et PDF immédiats, sans compte |
| canva.com/create/invoices | DÉFENDU | Modèles graphiques | Page fermée aux robots (403) ; création = compte Canva ; aucune règle de taxe | Générateur sans compte, taxe et mentions calculées |
| waveapps.com (invoicing) | DÉFENDU | Facturation dans le logiciel Wave | « Sign up for Wave and send your first invoice » ; page du générateur gratuit en 404 | Aucun compte ; règles des 4 pays |
| invoicesimple.com | DÉFENDU | Générateur + appli | Page fermée aux robots (403) | — |
| invoicehome.com | DÉFENDU | 100 modèles | Factures « saved on your account » ; taxe = un champ ; rien sur les règles | Rien sur un serveur ; taxe par juridiction |
| xe.com/invoice-generator | DÉFENDU (marque de change) | PDF sans compte, ne stocke rien | Un seul champ « Sales tax (%) », aucun taux d'État | Taux d'État + taux local, lignes taxables ou non |
| sleek.com/uk/free-invoice-generator | DÉFENDU | PDF sans compte, TVA 20 % par défaut | Pas de date de fait générateur (tax point) ; taux par ligne non précisé ; envoi = abonnement | Tax point, TVA par ligne 20/5/0/exonéré, arrondi HMRC, autoliquidation, CIS, TVA en sterling |
| refrens.com/en-ca | CLONE (meilleur au Canada) | TPS/TVH/PST par ligne | « Refrens account is necessary to use this invoice generator » ; Québec et TVQ absents de la page | Aucun compte ; TVQ et numéros TQ, seuils d'ITC 100 / 500 $ |
| rosterelf.com (AU) | CLONE (meilleur en Australie) | ABN, GST 10 %, pas de compte, rien sur le serveur | « This tool does not assess whether an invoice meets ATO requirements » ; ABN non validé | Liste ATO cochée en direct, seuil 1 000 $ (identité de l'acheteur), contrôle du chiffre clé de l'ABN (ABR, modulo 89), mention « Total price includes GST » |
| austax.tools (AU) | PRENABLE | Guide de structure + générateur | Texte sans contrôle de conformité | Contrôle intégré au générateur |

Verdict SERP : tête défendue par des marques (logiciels comptables, banques), mais pas imprenable : des
indépendants récents classent (xe, rosterelf, austax, Product Hunt), et aucune page ne combine « aucun compte »
+ « taxe juste par juridiction » + « mentions obligatoires contrôlées ». Les requêtes par pays et par type
(« vat invoice template », « tax invoice template australia », « invoice template canada hst », « cis
invoice », « late payment interest calculator ») sont l'angle d'entrée réaliste ; la tête « invoice generator »
se vise à long terme.

**Phrase de valeur ajoutée (§6.6)** : ce site fait mieux que le premier résultat Google parce que la taxe sur la
facture est celle qui s'applique là où l'on vend (51 taux d'État, 13 provinces, TVA britannique avec arrondi,
autoliquidation et CIS, GST australienne), et parce qu'il dit avant l'envoi quelle mention obligatoire manque,
sans compte et sans rien envoyer à un serveur.

## Actif de données

Deux dimensions maintenues : juridiction (51 États + DC, 13 provinces et territoires, 4 nations, 8 États
australiens) × règle (taux, taxe locale, structure GST/HST/PST/QST, seuils de mentions, seuils
d'immatriculation, taux de référence de la Banque d'Angleterre par semestre). Scripts rejouables :
`scripts/data/verify-us-rates.py`, `scripts/data/fetch-bank-rate.py`, `scripts/data/check-params.py`,
relancés chaque semaine par `.github/workflows/update-data.yml`.

## Leads

Le secteur vend du logiciel comptable (Zoho, Wave, FreshBooks, Square) : c'est l'enchère à 8-34 €. Nous
n'en vendons pas : monétisation publicitaire seulement, frein noté (§2.3) mais volume > 300 000.
