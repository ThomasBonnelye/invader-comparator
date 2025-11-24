# 📚 Tutoriel React avec Material-UI et Context API

## 🎯 Objectif

Apprendre React en recréant l'application Invader Comparator avec :
- **Material-UI (MUI)** : Bibliothèque de composants React moderne et élégante
- **Context API** : Gestion d'état global pour éviter le props drilling
- **TypeScript** : Pour la sécurité des types

---

## 📖 Table des matières

1. [Introduction aux technologies](#introduction-aux-technologies)
2. [Configuration du projet](#configuration-du-projet)
3. [Context API](#context-api)
4. [Composants avec MUI](#composants-avec-mui)
5. [Architecture de l'application](#architecture-de-lapplication)
6. [Comparaison Vue.js vs React](#comparaison-vuejs-vs-react)

---

## Introduction aux technologies

### Material-UI (MUI)

MUI est une bibliothèque de composants React qui implémente le Material Design de Google.

**Avantages :**
- Composants prêts à l'emploi (Button, TextField, Select, etc.)
- Design moderne et cohérent
- Thème personnalisable
- Accessibilité intégrée
- Documentation excellente

**Équivalent Vue.js :** Vuetify, Quasar

### Context API

La Context API permet de partager des données entre composants sans passer par les props.

**Problème résolu :** Props drilling

**Props drilling (mauvais) :**
```
App → FilterPanel → BaseDropdown → onChange
```
Chaque composant doit passer les props au suivant, même s'il ne les utilise pas.

**Context API (bien) :**
```
AppContext → N'importe quel composant peut accéder directement aux données
```

**Équivalent Vue.js :** Provide/Inject, Pinia, Vuex

---

## Configuration du projet

### Installation des dépendances

```bash
cd frontend

# React
npm install react react-dom @types/react @types/react-dom

# Material-UI
npm install @mui/material @emotion/react @emotion/styled

# Icons MUI (optionnel mais recommandé)
npm install @mui/icons-material

# Vite + React
npm install --save-dev vite @vitejs/plugin-react typescript
```

### Configuration complète

Voir le fichier `REACT_SETUP.md` pour les détails de configuration de Vite et TypeScript.

---

## Context API

### Qu'est-ce qu'un Context ?

Un Context est un conteneur qui stocke des données et des fonctions accessibles par tous les composants enfants.

### Concepts clés

**1. createContext** : Crée le Context
```typescript
const AppContext = createContext<AppContextType | undefined>(undefined);
```

**2. Provider** : Fournit les données aux enfants
```typescript
<AppContext.Provider value={{ data, setData }}>
  <App />
</AppContext.Provider>
```

**3. useContext** : Consomme les données
```typescript
const { data, setData } = useContext(AppContext);
```

### Quand utiliser Context API ?

✅ **Utiliser Context pour :**
- Authentification (user, login, logout)
- Thème (dark/light mode)
- Langue/localisation
- Données globales partagées par plusieurs composants

❌ **Ne PAS utiliser Context pour :**
- État local d'un composant
- Données qui changent très fréquemment (performance)
- Props simples entre parent-enfant direct

---

## Composants avec MUI

### Avantages de MUI sur composants custom

| Feature | Composants Custom | MUI |
|---------|-------------------|-----|
| Design | À créer | Material Design intégré |
| Accessibilité | À implémenter | Intégrée (ARIA, clavier) |
| Responsive | À gérer | Intégré |
| Thème | CSS custom | Theme provider |
| Icons | À ajouter | @mui/icons-material |
| Loading states | À créer | CircularProgress, Skeleton |

### Composants MUI vs Composants Custom

**BaseButton → MUI Button**
```typescript
// Custom
<BaseButton label="Click" action={handleClick} />

// MUI
<Button variant="contained" onClick={handleClick}>
  Click
</Button>
```

**BaseDropdown → MUI Select**
```typescript
// Custom
<BaseDropdown options={opts} value={val} onChange={setVal} />

// MUI
<Select value={val} onChange={(e) => setVal(e.target.value)}>
  {opts.map(opt => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
</Select>
```

**SearchBar → MUI TextField**
```typescript
// Custom
<SearchBar value={search} onChange={setSearch} />

// MUI
<TextField 
  value={search} 
  onChange={(e) => setSearch(e.target.value)}
  placeholder="Rechercher..."
/>
```

---

## Architecture de l'application

### Structure avec Context API

```
App.tsx (Context Provider)
  │
  ├── AppContext.Provider
  │   │
  │   ├── Header (useContext pour auth)
  │   ├── Settings (useContext pour UIDs)
  │   └── Main Content
  │       ├── FilterPanel (useContext pour filtres)
  │       └── DataTable (useContext pour data)
```

### Avantages

1. **Pas de props drilling** : Les composants accèdent directement aux données
2. **Code plus propre** : Moins de props à passer
3. **Maintenance facilitée** : Modifications centralisées dans le Context
4. **Performance** : Seuls les composants qui utilisent le Context se re-rendent

---

## Concepts React avancés

### 1. Context + useMemo

Optimisation pour éviter les re-renders inutiles :

```typescript
const contextValue = useMemo(() => ({
  data,
  setData,
  handleAction
}), [data]); // Ne recrée le contexte que si data change

return (
  <AppContext.Provider value={contextValue}>
    {children}
  </AppContext.Provider>
);
```

### 2. Context + TypeScript

Typage strict du Context :

```typescript
interface AppContextType {
  user: User | null;
  login: () => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Hook personnalisé avec vérification
function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext doit être utilisé dans AppProvider');
  }
  return context;
}
```

### 3. Multiples Contexts

On peut avoir plusieurs Contexts pour séparer les responsabilités :

```typescript
<AuthContext.Provider>
  <ThemeContext.Provider>
    <DataContext.Provider>
      <App />
    </DataContext.Provider>
  </ThemeContext.Provider>
</AuthContext.Provider>
```

---

## Comparaison Vue.js vs React

### Gestion d'état global

| Vue.js | React |
|--------|-------|
| Pinia / Vuex | Context API / Redux |
| `const store = useStore()` | `const context = useContext()` |
| `store.user` | `context.user` |
| `store.login()` | `context.login()` |

### Bibliothèques de composants

| Vue.js | React |
|--------|-------|
| Vuetify | Material-UI |
| Quasar | Ant Design |
| Element Plus | Chakra UI |
| PrimeVue | React Bootstrap |

### Hooks vs Composition API

| Vue Composition API | React Hooks |
|---------------------|-------------|
| `ref()` | `useState()` |
| `computed()` | `useMemo()` |
| `watch()` | `useEffect()` |
| `provide()` / `inject()` | `Context API` |

---

## Bonnes pratiques

### 1. Organisation des Contexts

```
src/
├── contexts/
│   ├── AuthContext.tsx      # Authentification
│   ├── DataContext.tsx      # Données de l'app
│   └── ThemeContext.tsx     # Thème MUI
```

### 2. Custom Hooks pour les Contexts

Toujours créer un hook personnalisé :

```typescript
// ✅ BIEN
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('...');
  return context;
};

// Utilisation
const { user, login } = useAuth();

// ❌ MAL
const context = useContext(AuthContext); // Pas de vérification
```

### 3. Optimisation avec React.memo

Pour les composants qui utilisent Context :

```typescript
const MyComponent = React.memo(() => {
  const { data } = useAppContext();
  return <div>{data}</div>;
});
```

---

## Exercices progressifs

### Niveau 1 : Configuration
- Installer MUI et créer un bouton simple
- Créer un Context avec une seule valeur

### Niveau 2 : Context basique
- Créer un AuthContext avec login/logout
- Utiliser le Context dans un Header

### Niveau 3 : MUI + Context
- Créer un formulaire avec MUI TextField et Button
- Gérer les données du formulaire dans un Context

### Niveau 4 : Application complète
- Recréer Invader Comparator avec MUI et Context
- Optimiser avec useMemo et useCallback

---

## Ressources

- [Documentation MUI](https://mui.com/)
- [Context API React](https://react.dev/reference/react/useContext)
- [MUI Templates](https://mui.com/material-ui/getting-started/templates/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

---

Bon apprentissage avec MUI et Context API ! 🚀
