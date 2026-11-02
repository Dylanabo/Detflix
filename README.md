# Detflix

Detflix est un clone de Netflix construit avec Next.js et React. L'objectif : permettre de rechercher, découvrir et regarder des films et des séries, avec une interface moderne.

## Stack

- **Next.js 16** (Pages Router) + React 19, Tailwind CSS
- **PostgreSQL** (driver `pg`) pour les données utilisateur
- **NextAuth** (provider email / mot de passe, sessions JWT) et **bcrypt** pour les mots de passe
- TMDB (The Movie Database) pour les films et séries (à venir)

## Lancer le projet

Prérequis : Node.js 22.9+ et Docker (ou un PostgreSQL 13+ déjà installé).

```bash
cd detflix
npm install
cp .env.example .env.local   # puis remplis NEXTAUTH_SECRET (openssl rand -base64 32)
docker compose up -d         # démarre PostgreSQL
npm run db:migrate           # crée les tables
npm run dev
```

Ouvre http://localhost:3000 : tu es redirigé vers `/login`. Crée un compte via `/register`.

Pour un compte de test, renseigne `SEED_USER_EMAIL` et `SEED_USER_PASSWORD` dans `.env.local` puis lance `npm run db:seed`. Ne versionne jamais d'identifiants.

## Scripts

| Commande | Rôle |
| --- | --- |
| `npm run dev` | Serveur de développement |
| `npm run build` / `npm start` | Build et serveur de production |
| `npm run lint` | ESLint |
| `npm run db:migrate` | Applique `db/schema.sql` |
| `npm run db:seed` | Crée ou met à jour le compte de test |

## Structure

```
detflix/
├── components/   composants React partagés
├── db/           schéma SQL
├── lib/          accès base de données, logique utilisateurs
├── pages/        pages et routes API (auth, inscription)
├── proxy.js      protège toutes les pages sauf login/register
└── scripts/      migration et seed de la base
```

## To-do

- [x] Inscription et authentification
- [ ] Recherche de films et de séries (TMDB)
- [ ] Listes de lecture personnalisées
- [ ] Limitation du nombre de tentatives de connexion
- [ ] Tests

## À propos

Démarré le 03/05/2023.
