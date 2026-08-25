# Librairie en ligne

E-commerce de vente de livres enrichi par l'IA — Stage d'été 2026.

**Stagiaire :** Abir Ben Rhouma
**Encadrante :** Taycir Chouk
**Période :** 20 juillet 2026 – 20 août 2026

## Présentation

Plateforme de vente de livres en ligne avec catalogue, panier, tunnel de commande (paiement à la livraison), espace client, back-office administrateur, et un module IA appliqué aux livres (résumés automatiques et traduction FR/EN/AR).

## Stack technique

| Composant | Technologie |
|---|---|
| Backend | NestJS (Node.js / TypeScript) |
| Base de données | PostgreSQL (Neon) via Prisma ORM |
| Frontend | Next.js (React) + Tailwind CSS |
| Internationalisation | next-intl (FR / EN / AR, RTL) |
| Authentification | JWT (Passport) |
| IA | Mistral AI (résumés et traductions) |
| Documentation API | Swagger |
| Graphiques admin | Chart.js |

## Structure du projet

```
librairie-en-ligne/
├── backend/     → API NestJS
├── frontend/    → Application Next.js
└── README.md
```

## Installation

### Prérequis

- Node.js 18 ou supérieur
- Un compte PostgreSQL (Neon.tech recommandé, gratuit)
- Une clé API Mistral (console.mistral.ai, gratuite)

### 1. Cloner le dépôt

```bash
git clone https://github.com/abir184/librairie-en-ligne.git
cd librairie-en-ligne
```

### 2. Backend

```bash
cd backend
npm install
```

Copier `.env.example` vers `.env` et renseigner les vraies valeurs :
```bash
cp .env.example .env
```

Appliquer les migrations et le seed de démonstration :
```bash
npx prisma migrate dev
npx prisma db seed
```

Lancer le serveur :
```bash
npm run start:dev
```

L'API est disponible sur `http://localhost:3001/api`, la documentation Swagger sur `http://localhost:3001/api/docs`.

### 3. Frontend

Dans un second terminal :
```bash
cd frontend
npm install
```

Copier `.env.example` vers `.env.local` :
```bash
cp .env.example .env.local
```

Lancer le serveur :
```bash
npm run dev
```

Le site est disponible sur `http://localhost:3000` (redirige automatiquement vers `/fr`, `/en` ou `/ar` selon la langue).

## Comptes de démonstration

Après le seed, les comptes suivants sont disponibles (mot de passe : `motdepasse123`) :
- `client1@test.com` à `client5@test.com`

## Documentation complémentaire

- [Documentation technique](./docs/documentation-technique.md)
- [Manuel utilisateur](./docs/manuel-utilisateur.md)
- Diagrammes de conception : voir dossier `docs/diagrammes/`

## Licence

Projet réalisé dans le cadre d'un stage académique.