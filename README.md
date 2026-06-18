# Sika Bijoux — Monorepo

> **Organisation** : Nexus Partners  
> **Auteur** : @hopsyder  
> **Description** : Plateforme e-commerce haut de gamme de vente de bijoux (sika-bijoux).  
> 🌐 [ceo.nexus-partners.xyz](https://ceo.nexus-partners.xyz) | 📧 <daoudaabassichristian@gmail.com>

---

## 📌 Présentation du Projet

Sika Bijoux est une plateforme e-commerce moderne et performante, structurée sous forme de **monorepo npm**. Elle sépare distinctement l'application cliente (Frontend) et le serveur de services (Backend API).

## 🛠️ Stack Technique

### Frontend (`apps/web`)

- **Framework** : [Next.js 16 (App Router)](https://nextjs.org/) avec TypeScript
- **State Management** : [Zustand](https://github.com/pmndrs/zustand)
- **Styling** : [Tailwind CSS v4](https://tailwindcss.com/)
- **Authentification** : [NextAuth.js v5 (Beta)](https://next-auth.js.org/)

### Backend API (`apps/api`)

- **Serveur** : [Express.js](https://expressjs.com/) avec TypeScript (ESM)
- **Base de données** : PostgreSQL via [Supabase](https://supabase.com/)
- **ORM** : [Prisma](https://www.prisma.io/)
- **Authentification** : JWT (`jsonwebtoken` & `bcryptjs`)
- **Validation** : [Zod](https://zod.dev/)

---

## 📁 Structure du Monorepo

```text
ecommerce-bijoux/
├── apps/
│   ├── web/          # Application Next.js (Client)
│   └── api/          # API REST Express (Serveur & DB)
├── packages/
│   └── shared/       # Packages utilitaires et types partagés (futurs)
├── package.json      # Configuration des workspaces npm
└── README.md         # Ce fichier
```

---

## 🚀 Démarrage Rapide

### 1. Prérequis

Assurez-vous d'avoir installé sur votre machine :

- **Node.js** (v20 ou supérieure recommandée)
- **npm** (v10 ou supérieure)
- Un projet **Supabase** configuré avec une base de données PostgreSQL.

### 2. Installation des dépendances

À la racine du monorepo, exécutez la commande suivante pour installer toutes les dépendances des workspaces :

```bash
npm install
```

### 3. Configuration des variables d'environnement

Vous devez configurer les fichiers `.env` dans chaque application. Des exemples sont disponibles dans leurs dossiers respectifs.

#### Backend API (`apps/api/.env`)

Copiez le fichier d'exemple et renseignez vos variables :

```bash
cp apps/api/.env.example apps/api/.env
```

Assurez-vous de définir les variables de connexion PostgreSQL, l'URL de votre Supabase, ainsi que la clé secrète JWT :

```env
DATABASE_URL="votre_url_postgresql_supabase"
DIRECT_URL="votre_url_directe_postgresql_supabase"
SUPABASE_URL="https://votre-projet.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="votre_role_key"
API_JWT_SECRET="votre_jwt_secret_genere"
```

#### Frontend (`apps/web/.env`)

Copiez le fichier d'exemple et renseignez vos variables :

```bash
cp apps/web/.env.example apps/web/.env
```

Configurez l'adresse de l'API et la clé secrète NextAuth :

```env
NEXT_PUBLIC_API_URL="http://localhost:4000"
NEXTAUTH_SECRET="votre_nextauth_secret_genere"
NEXTAUTH_URL="http://localhost:3000"
```

> 💡 *Note : Des clés secrètes sécurisées de 32 octets ont été générées et pré-configurées pour vos environnements locaux.*

---

## 💻 Commandes de Développement

Toutes les commandes peuvent être exécutées depuis la racine du monorepo en utilisant les workspaces :

### Lancer les serveurs de développement

- **Lancer le Frontend uniquement** :

  ```bash
  npm run dev:web
  ```

- **Lancer l'API uniquement** :

  ```bash
  npm run dev:api
  ```

### Base de données (Prisma)

Toutes les opérations Prisma s'exécutent dans le workspace de l'API :

- **Générer le client Prisma** :

  ```bash
  npm run prisma:generate -w apps/api
  ```

- **Appliquer les migrations de base de données** :

  ```bash
  npm run prisma:migrate -w apps/api
  ```

- **Lancer le script de seeding** :

  ```bash
  npm run prisma:seed -w apps/api
  ```

- **Ouvrir Prisma Studio** (Interface graphique d'exploration de données) :

  ```bash
  npx prisma studio -w apps/api
  ```

---

## 🔒 Sécurité et Bonnes Pratiques

- **Secrets** : Ne commitez jamais de fichiers `.env` ou de secrets en clair sur Git. Les fichiers `.env` sont ignorés par défaut dans le [.gitignore](file:///home/hopsyder/Projet/ecommerce-bijoux/.gitignore).
- **Standards de code** : Suivez scrupuleusement les conventions de nommage définies (camelCase en JS/TS, kebab-case pour les noms de fichiers).
