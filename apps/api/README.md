# Sika Bijoux — Backend API

> **Composant** : API REST (Serveur Express)  
> **Organisation** : Nexus Partners  

---

## 📌 Présentation

Ce service est l'API REST de la plateforme Sika Bijoux. Construit avec **Express.js**, **TypeScript**, et documenté avec des structures claires, il se connecte à une base de données PostgreSQL gérée via **Supabase** en utilisant l'ORM **Prisma**.

## 🛠️ Stack et Bibliothèques

- **Langage / Runtime** : Node.js avec TypeScript (compilé vers ESM)
- **Framework** : Express.js
- **ORM** : Prisma Client (`@prisma/client`)
- **Validation** : Zod
- **Sécurité** : JWT (`jsonwebtoken`) & Hachage (`bcryptjs`)
- **Fichiers** : Multer pour le téléversement d'images de bijoux

---

## 📂 Structure des Fichiers

```text
apps/api/
├── prisma/
│   ├── schema.prisma   # Schéma de la base de données
│   └── seed.ts         # Script de peuplement de la DB (seeding)
├── src/
│   ├── controllers/    # Logique des routes (requête/réponse)
│   ├── routes/         # Définition des routes de l'API
│   ├── services/       # Couche d'accès aux données (Prisma)
│   ├── middleware/     # Middlewares Express (Auth, Error handler, Upload)
│   ├── validators/     # Schémas de validation Zod
│   ├── serializers/    # Formateurs de réponses API
│   ├── lib/            # Clients tiers (Supabase, stockage)
│   ├── app.ts          # Configuration de l'application Express
│   └── server.ts       # Point d'entrée pour lancer le serveur
├── package.json
└── tsconfig.json
```

---

## 🚦 Endpoints de l'API

L'API est structurée autour de deux grandes catégories de routes : **publiques** (accessibles à tous les visiteurs) et **administrateur** (nécessitant une authentification JWT et des droits d'accès).

### Routes Publiques
- `GET /health` : Statut de santé de l'API
- `GET /uploads/*` : Accès aux images publiques téléversées
- `/api/public/categories` : Consultation des catégories de bijoux
- `/api/public/products` : Consultation des produits (bijoux) disponibles
- `/api/public/orders` : Création et suivi basique des commandes clients

### Routes d'Authentification
- `/api/auth` : Inscription, connexion et gestion de session (génération de token JWT)

### Routes d'Administration (`/api/admin/*`)
*Nécessitent un Header `Authorization: Bearer <token_jwt>` valide et un rôle administrateur.*
- `/api/admin/products` : Gestion complète du catalogue de bijoux (Création, Modification, Suppression, Upload d'images)
- `/api/admin/categories` : Gestion des catégories de bijoux
- `/api/admin/orders` : Gestion globale et suivi des commandes clients
- `/api/admin/users` : Gestion des utilisateurs et de leurs privilèges
- `/api/admin/negotiations` : Gestion des offres de négociation (spécifique aux pièces uniques ou sur-mesure)
- `/api/admin/reports` : Statistiques de vente et rapports d'activité

---

## 💻 Commandes de Développement

Toutes les commandes listées ci-dessous doivent être exécutées depuis le dossier `apps/api` ou via l'option `-w apps/api` depuis la racine du monorepo.

### Lancement

```bash
# Lancer le serveur de dev avec rechargement automatique (tsx watch)
npm run dev

# Compiler le code TypeScript en JavaScript ESM
npm run build

# Lancer l'API en production (après compilation)
npm run start
```

### Base de données (Prisma & Migrations)

```bash
# Générer le client Prisma suite à un changement de schéma
npm run prisma:generate

# Créer et appliquer une migration de base de données locale/distante
npm run prisma:migrate

# Peupler la base de données avec les données initiales (seeds)
npm run prisma:seed
```
