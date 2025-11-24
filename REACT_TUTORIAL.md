# 📚 Tutoriel React : Migration de Invader Comparator

## 🎯 Objectif

Apprendre React en recréant l'application Invader Comparator (actuellement en Vue.js) avec les bonnes pratiques et les concepts fondamentaux de React.

---

## 📖 Table des matières

1. [Introduction aux concepts React](#1-introduction-aux-concepts-react)
2. [Configuration du projet](#2-configuration-du-projet)
3. [Migration des fichiers API](#3-migration-des-fichiers-api)
4. [Composants Atoms](#4-composants-atoms)
5. [Composant Molecule](#5-composant-molecule)
6. [Composant principal](#6-composant-principal)
7. [Hooks personnalisés](#7-hooks-personnalisés)
8. [Styling](#8-styling)
9. [Comparaison Vue.js vs React](#9-comparaison-vuejs-vs-react)

---

## 1. Introduction aux concepts React

### 1.1 Qu'est-ce que React ?

React est une bibliothèque JavaScript pour construire des interfaces utilisateur. Contrairement à Vue.js qui est un framework complet, React se concentre uniquement sur la couche "vue" (UI).

### 1.2 Les Hooks React

Les Hooks sont des fonctions qui permettent d'utiliser l'état et d'autres fonctionnalités React dans des composants fonctionnels.

#### `useState` - Gestion d'état local

```typescript
const [count, setCount] = useState(0);
```

- `count` : la valeur actuelle de l'état
- `setCount` : fonction pour modifier l'état
- `0` : valeur initiale

**Vue.js équivalent :** `ref(0)`

#### `useEffect` - Effets de bord

```typescript
useEffect(() => {
  // Code exécuté après le rendu
  console.log('Composant monté');
  
  return () => {
    // Cleanup (nettoyage)
    console.log('Composant démonté');
  };
}, []); // [] = exécuté une seule fois au montage
```

**Vue.js équivalent :** `onMounted()`, `onUnmounted()`, `watch()`

#### `useMemo` - Mémorisation de valeurs

```typescript
const expensiveValue = useMemo(() => {
  return calculateSomething(data);
}, [data]); // Recalculé uniquement si 'data' change
```

**Vue.js équivalent :** `computed()`

#### `useCallback` - Mémorisation de fonctions

```typescript
const handleClick = useCallback(() => {
  console.log('Clicked');
}, []); // La fonction reste la même entre les rendus
```

**Vue.js équivalent :** Pas d'équivalent direct (Vue optimise automatiquement)

#### `useRef` - Références

```typescript
const inputRef = useRef<HTMLInputElement>(null);

// Accès au DOM
inputRef.current?.focus();
```

**Vue.js équivalent :** `ref()` pour le DOM

### 1.3 Props et Communication

En React, la communication parent → enfant se fait via **props**, et enfant → parent via des **callbacks**.

```typescript
// Parent
<Child name="John" onAction={(value) => console.log(value)} />

// Child
interface ChildProps {
  name: string;
  onAction: (value: string) => void;
}

function Child({ name, onAction }: ChildProps) {
  return <button onClick={() => onAction('hello')}>{name}</button>;
}
```

**Vue.js équivalent :** Props + `emit()`

### 1.4 Composants contrôlés (Controlled Components)

En React, les inputs doivent être "contrôlés" : leur valeur est stockée dans l'état.

```typescript
const [value, setValue] = useState('');

<input 
  value={value} 
  onChange={(e) => setValue(e.target.value)} 
/>
```

**Vue.js équivalent :** `v-model`

---

## 2. Configuration du projet

### 2.1 Structure des dossiers

```
frontend/src/
├── api/                    # Fonctions API
│   ├── players.ts
│   ├── spaceInvaders.ts
│   └── compareInvaders.ts
├── atoms/                  # Composants de base
│   ├── BaseButton.tsx
│   ├── BaseDropdown.tsx
│   ├── SearchBar.tsx
│   └── DataTable.tsx
├── molecules/              # Composants composés
│   └── FilterPanel.tsx
├── hooks/                  # Hooks personnalisés
│   ├── useClickOutside.ts
│   ├── useFetch.ts
│   └── useAuth.ts
├── types/                  # Types TypeScript
│   └── index.ts
├── App.tsx                 # Composant principal
├── main.tsx                # Point d'entrée
└── style.css               # Styles globaux
```

### 2.2 Configuration TypeScript

Le fichier `tsconfig.json` doit inclure :
- Mode strict activé
- Alias de chemins (`@/` → `src/`)
- Support JSX pour React

---

## 3. Migration des fichiers API

Les fichiers API sont quasi identiques entre Vue.js et React. Ils exportent simplement des fonctions TypeScript.

**Aucun changement nécessaire !** Les fonctions `fetch` fonctionnent de la même manière.

---

## 4. Composants Atoms

### 4.1 BaseButton - Le plus simple

**Concepts :** Props, événements, TypeScript

Ce composant illustre :
- Comment définir des props avec TypeScript
- Comment gérer les événements en React
- La différence entre `@click` (Vue) et `onClick` (React)

### 4.2 SearchBar - Input contrôlé

**Concepts :** Inputs contrôlés, `onChange`

Ce composant illustre :
- Le pattern "controlled component"
- Comment remplacer `v-model` par `value` + `onChange`
- La gestion des événements d'input

### 4.3 BaseDropdown - Complexe

**Concepts :** `useState`, `useRef`, `useEffect`, `useCallback`

Ce composant illustre :
- Gestion d'état local multiple
- Référence DOM avec `useRef`
- Détection de clic extérieur avec `useEffect`
- Cleanup des event listeners
- Mémorisation de fonctions avec `useCallback`

### 4.4 DataTable - Performance

**Concepts :** `useMemo`, `useEffect` avec dépendances, optimisation

Ce composant illustre :
- Calculs coûteux avec `useMemo`
- Effets avec dépendances multiples
- Gestion de cache
- Gestion d'état de chargement/erreur

---

## 5. Composant Molecule

### FilterPanel - Composition

**Concepts :** Composition, lifting state up

Ce composant illustre :
- Comment composer des composants atoms
- Comment remonter l'état (lifting state up)
- Communication via callbacks
- Coordination de plusieurs composants

---

## 6. Composant principal

### App.tsx - Orchestration

**Concepts :** Gestion d'état complexe, effets multiples, organisation

Ce composant illustre :
- Organisation d'une application complète
- Gestion d'authentification
- Appels API multiples
- Coordination de l'état global

---

## 7. Hooks personnalisés

Les hooks personnalisés permettent d'extraire et de réutiliser de la logique.

### 7.1 useClickOutside

Détecte les clics en dehors d'un élément.

```typescript
const ref = useClickOutside(() => {
  console.log('Clicked outside');
});
```

### 7.2 useFetch

Simplifie les appels API avec gestion du loading/error.

```typescript
const { data, loading, error } = useFetch('/api/users');
```

### 7.3 useAuth

Encapsule la logique d'authentification.

```typescript
const { user, login, logout } = useAuth();
```

---

## 8. Styling

### 8.1 CSS Global

Le fichier `style.css` reste identique. React utilise des classes CSS classiques.

### 8.2 CSS Modules (optionnel)

Pour éviter les conflits de noms de classes :

```typescript
import styles from './Button.module.css';

<button className={styles.button}>Click</button>
```

### 8.3 Styled Components (optionnel)

Pour du CSS-in-JS :

```typescript
import styled from 'styled-components';

const Button = styled.button`
  background: blue;
  color: white;
`;
```

---

## 9. Comparaison Vue.js vs React

| Fonctionnalité | Vue.js | React |
|----------------|--------|-------|
| État local | `ref(value)` | `useState(value)` |
| État réactif | Automatique | Manuel via `setState` |
| Valeurs calculées | `computed(() => ...)` | `useMemo(() => ..., [deps])` |
| Effets | `watch()`, `onMounted()` | `useEffect(() => ..., [deps])` |
| Two-way binding | `v-model` | `value` + `onChange` |
| Références DOM | `ref()` + `ref="name"` | `useRef()` + `ref={ref}` |
| Props | `defineProps<T>()` | Props en paramètre |
| Événements | `emit('event')` | Callback props |
| Conditions | `v-if`, `v-show` | `&&`, opérateur ternaire |
| Listes | `v-for` | `.map()` |
| Template | `<template>` | JSX (retour direct) |

---

## 10. Bonnes pratiques React

### 10.1 Organisation du code

- **Un composant par fichier**
- **Nommage explicite** : `useAuth`, `UserList`, `handleClick`
- **Séparation des responsabilités** : logique métier vs UI

### 10.2 Performance

- Utiliser `React.memo` pour éviter les rendus inutiles
- Utiliser `useMemo` pour les calculs coûteux
- Utiliser `useCallback` pour les fonctions passées en props

### 10.3 TypeScript

- **Typer toutes les props**
- **Typer les événements** : `React.ChangeEvent<HTMLInputElement>`
- **Éviter `any`**

### 10.4 Hooks

- **Ne jamais appeler de hooks conditionnellement**
- **Hooks personnalisés** : commencer par `use`
- **Dépendances d'effets** : toujours les déclarer

---

## 11. Exercices progressifs

### Niveau 1 : BaseButton
Créez un composant bouton simple avec des props.

### Niveau 2 : SearchBar
Créez un input contrôlé avec gestion d'événements.

### Niveau 3 : BaseDropdown
Créez un dropdown avec gestion d'état complexe et effets.

### Niveau 4 : DataTable
Créez un tableau avec optimisations de performance.

### Niveau 5 : App
Assemblez tous les composants dans l'application complète.

---

## 12. Ressources

- **Documentation officielle React** : https://react.dev
- **TypeScript + React** : https://react-typescript-cheatsheet.netlify.app/
- **Hooks en profondeur** : https://react.dev/reference/react

---

## 13. Prochaines étapes

Après avoir maîtrisé ces concepts, vous pourrez explorer :

- **React Router** : navigation entre pages
- **Context API** : état global sans prop drilling
- **React Query** : gestion avancée des données
- **Redux / Zustand** : state management
- **Testing Library** : tests unitaires
- **Next.js** : framework React avec SSR

---

Bon apprentissage ! 🚀
