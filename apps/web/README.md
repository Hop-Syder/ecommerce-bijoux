# Sika Bijoux — Application Web Cliente

> **Composant** : Frontend (Next.js Application)  
> **Organisation** : Nexus Partners  

---

## 📌 Présentation

Cette application est l'interface utilisateur de la boutique de vente de bijoux haut de gamme Sika Bijoux. Conçue avec **Next.js (App Router)** et configurée en TypeScript, elle offre une expérience d'achat fluide et un tableau de bord complet pour les administrateurs.

## 🛠️ Stack Technique et Bibliothèques

- **Framework** : Next.js 16 (App Router)
- **Styling** : Tailwind CSS v4 (nouvelle architecture optimisée, pas de fichier `tailwind.config.js` classique)
- **Gestion d'État** : Zustand (utilisé pour gérer le panier d'achat, les filtres produits et la synchronisation de l'état client)
- **Authentification** : NextAuth.js v5 (Beta) avec stratégie JWT, intégrée de façon transparente avec le backend API

---

## 📂 Structure des Fichiers

```text
apps/web/
├── public/           # Assets statiques (logos, icônes)
├── src/
│   ├── app/          # Pages et architecture App Router
│   │   ├── (public)/ # Pages de la boutique (vitrine, produits, panier, etc.)
│   │   ├── (admin)/  # Dashboard d'administration (commandes, bijoux, rapports)
│   │   ├── login/    # Page de connexion
│   │   ├── api/      # Routes API Next.js internes (auth handlers)
│   │   ├── globals.css
│   │   └── layout.tsx
│   ├── components/   # Composants UI partagés et réutilisables
│   ├── hooks/        # React Hooks personnalisés
│   ├── store/        # Stores Zustand (ex: panier.ts)
│   ├── lib/          # Configurations tierces (ex: fetch clients)
│   ├── types/        # Déclarations de types TypeScript
│   └── auth.ts       # Configuration d'authentification NextAuth.js v5
├── package.json
└── tsconfig.json
```

---

## 🚦 Intégration et API

L'application communique directement avec l'API REST Express (`apps/api`) via l'URL spécifiée par la variable d'environnement `NEXT_PUBLIC_API_URL`.

L'authentification est gérée via [NextAuth.js v5](file:///home/hopsyder/Projet/ecommerce-bijoux/apps/web/src/auth.ts) qui sécurise :
- Les pages d'administration sous le groupe de routes `(admin)`
- Les requêtes sortantes vers l'API d'administration en y injectant le token JWT de session.

---

## 💻 Commandes de Développement

Toutes les commandes listées ci-dessous doivent être exécutées depuis le dossier `apps/web` ou via l'option `-w apps/web` depuis la racine du monorepo.

### Serveur de développement

```bash
# Lancer le serveur de développement Next.js (sur http://localhost:3000)
npm run dev
```

### Production et Qualité

```bash
# Lancer le build de production (génère les pages statiques et optimisées)
npm run build

# Démarrer le serveur Next.js compilé pour la production
npm run start

# Exécuter ESLint pour analyser la qualité et le style du code
npm run lint
```
