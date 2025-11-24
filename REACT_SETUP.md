# 🚀 Guide de configuration React

Ce guide explique comment configurer et lancer l'application React que vous venez de créer dans le cadre du tutoriel de migration Vue.js → React.

---

## 📋 Table des matières

1. [Prérequis](#prérequis)
2. [Installation des dépendances](#installation-des-dépendances)
3. [Configuration TypeScript](#configuration-typescript)
4. [Configuration Vite](#configuration-vite)
5. [Mise à jour du fichier HTML](#mise-à-jour-du-fichier-html)
6. [Lancement de l'application](#lancement-de-lapplication)
7. [Structure finale du projet](#structure-finale-du-projet)
8. [Dépannage](#dépannage)

---

## Prérequis

- Node.js 18+ installé
- npm ou yarn

---

## Installation des dépendances

### 1. Installer React et React DOM

```bash
cd frontend
npm install react react-dom
```

### 2. Installer les types TypeScript pour React

```bash
npm install --save-dev @types/react @types/react-dom
```

### 3. Installer Vite et ses plugins pour React

```bash
npm install --save-dev vite @vitejs/plugin-react
```

### 4. Installer TypeScript (si pas déjà installé)

```bash
npm install --save-dev typescript
```

---

## Configuration TypeScript

### Créer/Modifier `frontend/tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,

    /* Alias de chemins */
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### Créer `frontend/tsconfig.node.json`

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

---

## Configuration Vite

### Créer/Modifier `frontend/vite.config.ts`

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});
```

---

## Mise à jour du fichier HTML

### Modifier `frontend/index.html`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Invader Comparator - React</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

**IMPORTANT :** 
- Le script doit pointer vers `/src/main.tsx` (et non `main.ts`)
- L'attribut `type="module"` est obligatoire

---

## Lancement de l'application

### Développement

```bash
cd frontend
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

### Production

```bash
# Build
npm run build

# Preview du build
npm run preview
```

---

## Structure finale du projet

```
frontend/
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── public/
│   └── favicon.ico
└── src/
    ├── main.tsx              ← Point d'entrée
    ├── App.tsx               ← Composant principal
    ├── style.css             ← Styles globaux
    ├── api/                  ← Fonctions API
    │   ├── players.ts
    │   ├── spaceInvaders.ts
    │   └── compareInvaders.ts
    ├── atoms/                ← Composants atomiques
    │   ├── BaseButton.tsx
    │   ├── BaseDropdown.tsx
    │   ├── SearchBar.tsx
    │   └── DataTable.tsx
    ├── molecules/            ← Composants composés
    │   └── FilterPanel.tsx
    └── hooks/                ← Hooks personnalisés
        └── useClickOutside.ts
```

---

## Dépannage

### Erreur : "Cannot find module 'react'"

**Solution :** Installez React et ses types :
```bash
npm install react react-dom @types/react @types/react-dom
```

### Erreur : "Property 'className' does not exist"

**Cause :** TypeScript n'est pas configuré correctement pour React.

**Solution :** Vérifiez que votre `tsconfig.json` contient :
```json
{
  "compilerOptions": {
    "jsx": "react-jsx"
  }
}
```

### Erreur : "Failed to resolve import '@/...' "

**Cause :** Les alias de chemins ne sont pas configurés.

**Solution :** Vérifiez `vite.config.ts` :
```typescript
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
  },
}
```

### L'application ne se charge pas

1. Vérifiez que le backend est lancé sur le port 3000
2. Vérifiez que le proxy Vite est configuré correctement
3. Vérifiez la console du navigateur pour les erreurs

### Les styles ne s'appliquent pas

Vérifiez que `style.css` est importé dans `main.tsx` :
```typescript
import './style.css';
```

---

## Scripts npm recommandés

Ajoutez ces scripts dans `frontend/package.json` :

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0"
  }
}
```

---

## Prochaines étapes

Maintenant que votre application React est configurée, vous pouvez :

1. **Consulter le tutoriel complet** : `REACT_TUTORIAL.md`
2. **Étudier chaque composant** : Tous les fichiers contiennent des explications détaillées
3. **Expérimenter** : Modifiez les composants pour comprendre leur fonctionnement
4. **Améliorer** : Ajoutez des fonctionnalités supplémentaires

---

## Comparaison des commandes Vue vs React

| Action | Vue.js | React (Vite) |
|--------|--------|--------------|
| Créer un projet | `npm create vue@latest` | `npm create vite@latest` |
| Dev server | `npm run dev` | `npm run dev` |
| Build production | `npm run build` | `npm run build` |
| Extension fichiers | `.vue` | `.tsx` |
| État local | `ref()` | `useState()` |
| Valeurs calculées | `computed()` | `useMemo()` |
| Effets | `watch()`, `onMounted()` | `useEffect()` |

---

## Ressources

- [Documentation React officielle](https://react.dev)
- [Documentation Vite](https://vitejs.dev)
- [TypeScript + React Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [React Hooks en profondeur](https://react.dev/reference/react)

---

Bon apprentissage de React ! 🎉
