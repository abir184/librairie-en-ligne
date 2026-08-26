# Documentation technique — Librairie en ligne
 
## 1. Architecture générale
 
Le projet suit une architecture client-serveur classique en deux applications séparées, communiquant via une API REST :
 
```
Frontend (Next.js, port 3000)  <--HTTP/JSON-->  Backend (NestJS, port 3001)  <--Prisma-->  PostgreSQL (Neon)
                                                        |
                                                        v
                                                  API Mistral (IA)
```
 
- Le **frontend** ne contient aucune logique métier : il affiche les données et appelle l'API.
- Le **backend** centralise toute la logique métier, la validation, l'authentification et l'accès aux données.
- La base de données est hébergée sur **Neon** (PostgreSQL serverless).
## 2. Modèle de données
 
Voir le schéma complet dans `backend/prisma/schema.prisma`. Entités principales :
 
- **Livre** : titre, auteur, prix, stock, description, couverture, résumé IA, traductions (EN/AR)
- **Categorie** : nom, liée à plusieurs livres
- **Client** : nom, email, mot de passe (haché avec bcrypt), adresse, téléphone
- **Commande** : statut (en_attente / validee / livree / annulee), liée à un client
- **LigneCommande** : quantité, prix unitaire figé à la commande, liée à une commande et un livre
- **Avis** : note, commentaire, statut d'approbation, lié à un client et un livre
- **Favori** : relation many-to-many entre client et livre (liste d'envies)
Les diagrammes de classes et le MCD complets sont disponibles dans `docs/diagrammes/`.
 
## 3. Backend (NestJS)
 
### Organisation des modules
 
Chaque entité a son propre module (`livre`, `categorie`, `client`, `commande`, `avis`, `favoris`), suivant la structure standard NestJS : `*.module.ts`, `*.controller.ts`, `*.service.ts`.
 
Modules transverses :
- `prisma/` : service Prisma partagé (connexion à la base via adapter `pg`)
- `auth/` : authentification JWT (login, stratégie Passport, guard)
- `ia/` : service d'appel à l'API Mistral (résumés, traductions)
### Authentification
 
- Connexion via `POST /api/auth/login` (email + mot de passe) → retourne un token JWT (validité 7 jours).
- Les routes protégées utilisent `@UseGuards(JwtAuthGuard)` ; le token est envoyé en en-tête `Authorization: Bearer <token>`.
- Le `clientId` d'une commande n'est jamais envoyé par le client : il est déduit du token, ce qui empêche de passer commande au nom d'un autre client.
### Validation des données
 
Toutes les routes d'écriture utilisent des DTOs avec `class-validator` (`@IsString`, `@IsNumber`, `@Min`, etc.). Le `ValidationPipe` global (dans `main.ts`) rejette automatiquement tout champ non déclaré (`whitelist: true`, `forbidNonWhitelisted: true`).
 
### Règles métier notables
 
- **Stock** : vérifié et décrémenté de façon atomique (transaction Prisma) à la création d'une commande. Restitué automatiquement en cas d'annulation.
- **Annulation** : impossible depuis le statut `livree`.
- **Suppression de catégorie** : bloquée si des livres y sont encore rattachés (contrainte de clé étrangère Prisma).
- **Avis clients** : non visibles publiquement tant qu'un administrateur ne les a pas approuvés (`GET /api/avis/en-attente` pour la modération).
### Module IA
 
Le service `IaService` (Mistral AI) génère :
1. Un résumé automatique du livre à sa création (`genererResume`).
2. Une traduction du titre et du résumé en anglais et en arabe (`traduireLivre`), une fois le résumé généré.
Ces opérations sont exécutées **en arrière-plan**, sans bloquer la réponse de création du livre : si l'API IA échoue ou est indisponible, le livre reste publié normalement (résumé/traductions restent `null`).
 
### Sécurité
 
- Rate limiting global : 30 requêtes/minute par IP (`@nestjs/throttler`).
- CORS restreint à l'origine du frontend (`http://localhost:3000` en développement).
- Mots de passe hachés avec bcrypt (jamais stockés ni renvoyés en clair).
## 4. Frontend (Next.js)
 
### Structure des routes (App Router)
 
```
app/[locale]/
├── page.tsx                  → Accueil
├── catalogue/page.tsx        → Catalogue (recherche, filtres, pagination)
├── livre/[id]/page.tsx       → Fiche livre + avis
├── panier/page.tsx           → Panier (state local)
├── commande/page.tsx         → Tunnel de commande (JWT requis)
├── connexion/page.tsx        → Connexion
├── compte/page.tsx           → Espace client (profil, commandes)
├── favoris/page.tsx          → Liste d'envies
└── admin/
    ├── page.tsx               → Tableau de bord (stats, graphique)
    ├── livres/                → CRUD livres
    ├── commandes/page.tsx     → Gestion des statuts de commande
    ├── clients/page.tsx       → Liste des clients
    └── avis/page.tsx          → Modération des avis
```
 
### Gestion d'état
 
Deux contextes React globaux (`app/context/`) :
- **AuthContext** : token JWT et infos client, persistés dans `localStorage`.
- **CartContext** : contenu du panier, en mémoire uniquement (non persisté, réinitialisé au rechargement de page — comportement standard d'un panier avant validation).
### Internationalisation
 
`next-intl` gère le routage par langue (`/fr`, `/en`, `/ar`) et le chargement des traductions (`messages/*.json`). Le sens de lecture (`dir="rtl"` / `"ltr"`) est appliqué automatiquement dans `app/[locale]/layout.tsx` selon la langue active.
 
### Performance
 
Les images de couverture utilisent le composant `next/image` (redimensionnement automatique, lazy loading) plutôt que des balises `<img>` classiques, sur les pages catalogue et fiche livre.
 
## 5. Déploiement (développement local)
 
Voir le `README.md` à la racine pour les instructions d'installation complètes. En résumé :
1. Backend : `npm install` → configurer `.env` → `npx prisma migrate dev` → `npx prisma db seed` → `npm run start:dev`
2. Frontend : `npm install` → configurer `.env.local` → `npm run dev`
## 6. Points de vigilance connus
 
- **Neon (base de données gratuite)** se met en veille après une période d'inactivité ; le premier appel API après une pause peut échouer et nécessiter une nouvelle tentative (délai de réveil de quelques secondes).
- Le quota gratuit de l'API Mistral peut être atteint en cas d'usage intensif ; dans ce cas, les résumés/traductions ne sont pas générés mais le livre reste fonctionnel (comportement voulu).
- L'accès aux routes d'administration n'est pas encore restreint par un rôle spécifique côté backend (au-delà de l'authentification générale) : point à sécuriser avant une mise en production réelle.
 