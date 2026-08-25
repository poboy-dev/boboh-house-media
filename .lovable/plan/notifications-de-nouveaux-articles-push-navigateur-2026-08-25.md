# Notifications de nouveaux articles (push navigateur)

Un seul canal pour cette mise à jour : **notifications push web** pour les utilisateurs qui ont un compte sur la plateforme.

L'abonnement par email pour les visiteurs sans compte est reporté à plus tard (la structure est prévue pour l'ajouter facilement).

Déclenchement automatique dès qu'un article est créé.

## Coût

Aucun coût financier :
- Le push web passe par les services gratuits des navigateurs (FCM pour Chrome, Mozilla, WNS pour Edge) — pas de compte ni de facturation.
- Les clés VAPID sont générées gratuitement.
- Une invocation d'edge function par article publié : négligeable dans le quota Supabase.

## 1. Base de données (migration)

**Table `push_subscriptions`**
- `user_id` (référence l'utilisateur connecté)
- `endpoint` (unique), `p256dh`, `auth` — les clés fournies par le navigateur
- `user_agent` pour identifier l'appareil
- RLS : chaque utilisateur ne voit, crée et supprime que ses propres abonnements ; les envois se font côté serveur avec les droits élevés

**Trigger sur `articles`** (après création) → appelle l'edge function d'envoi via `pg_net`.

## 2. Edge function `notify-new-article`

- Déclenchée par le trigger avec l'id de l'article
- Récupère titre, description, image et id
- Envoie une notification Web Push signée VAPID à chaque abonnement enregistré
- Supprime automatiquement les abonnements expirés (réponse 404/410 du service push)

## 3. Frontend

**Service worker `public/sw.js`** — uniquement pour recevoir les push et ouvrir l'article au clic. Aucun cache, aucune installation PWA.

**Composant d'activation** (dans le header ou le tableau de bord, visible uniquement si connecté) :
- Bouton « Activer les notifications » → demande la permission navigateur puis enregistre l'abonnement
- Trois états : non activé / activé (avec possibilité de désactiver) / bloqué par le navigateur
- Message clair si le navigateur ne supporte pas le push (Safari iOS hors app installée)

## 4. Secrets

- `VAPID_PUBLIC_KEY` et `VAPID_PRIVATE_KEY` — générés automatiquement, la clé publique est exposée côté client (c'est normal et sans risque)

## Détails techniques

```text
Article créé (dashboard)
        │
        ▼
Trigger SQL AFTER INSERT
        │
        ▼
pg_net.http_post → edge function notify-new-article
        │
        ▼
Web Push (VAPID) → navigateurs des utilisateurs abonnés
```

- Extension `pg_net` à activer dans la migration.
- Envoi Web Push implémenté dans l'edge function (chiffrement aes128gcm + JWT VAPID), sans dépendance externe payante.
- Les notifications ne partent qu'aux utilisateurs ayant explicitement cliqué « Activer les notifications ».

## Hors scope (pour plus tard)

- Abonnement email pour les visiteurs sans compte, avec double opt-in et lien de désabonnement
- Préférences fines (notifier seulement certaines catégories)
