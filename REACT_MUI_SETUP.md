# 🚀 Guide d'installation React + Material-UI + Context API

Ce guide explique comment installer et configurer l'application React avec **Material-UI** et **Context API**.

---

## 📋 Installation rapide

```bash
cd frontend

# 1. React et React DOM
npm install react react-dom @types/react @types/react-dom

# 2. Material-UI (MUI)
npm install @mui/material @emotion/react @emotion/styled

# 3. Icons Material-UI
npm install @mui/icons-material

# 4. Outils de développement
npm install --save-dev vite @vitejs/plugin-react typescript
```

---

## 📦 Dépendances complètes

### Production
- `react`, `react-dom` : Bibliothèque React
- `@mui/material` : Composants Material-UI
- `@emotion/react`, `@emotion/styled` : Styling pour MUI
- `@mui/icons-material` : Icônes Material

### Développement
- `vite` : Build tool ultra-rapide
- `@vitejs/plugin-react` : Plugin Vite pour React
- `typescript` : TypeScript
- `@types/react`, `@types/react-dom` : Types TypeScript

---

## ⚙️ Configuration

### 1. Modifier `main.tsx`

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './AppMUI'; // ← Utiliser AppMUI.tsx
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const rootElement = document.getElementById('app');
if (!rootElement) throw new Error('Failed to find the root element');

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### 2. Installer les polices Roboto (optionnel)

```bash
npm install @fontsource/roboto
```

---

## 🎨 Personnaliser le thème MUI (optionnel)

Créer `frontend/src/theme.ts` :

```typescript
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#1a73e8', // Bleu Google
    },
    secondary: {
      main: '#f50057',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});
```

Puis dans `AppMUI.tsx` :

```typescript
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './theme';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ThemeProvider>
  );
}
```

---

## 📁 Structure des fichiers

```
frontend/src/
├── contexts/
│   └── AppContext.tsx         # Context API
├── AppMUI.tsx                 # App avec MUI + Context
├── main.tsx                   # Point d'entrée
├── theme.ts                   # Thème MUI (optionnel)
└── api/
    ├── players.ts
    ├── spaceInvaders.ts
    └── compareInvaders.ts
```

---

## 🚀 Lancement

```bash
npm run dev
```

Application accessible sur `http://localhost:5173`

---

## 🎯 Concepts appris

### 1. Context API
- ✅ Évite le props drilling
- ✅ État global accessible partout
- ✅ Custom hook `useAppContext()`

### 2. Material-UI
- ✅ Composants prêts à l'emploi
- ✅ Design Material cohérent
- ✅ Accessibilité intégrée
- ✅ Responsive automatique

### 3. Architecture
```
<AppProvider>          ← Context
  <ThemeProvider>      ← Thème MUI
    <AppContent>       ← Application
      <Header />       → useAppContext()
      <Settings />     → useAppContext()
      <FilterPanel />  → useAppContext()
      <DataTable />    → useAppContext()
```

---

## 📚 Ressources

- [Documentation MUI](https://mui.com/)
- [Context API React](https://react.dev/reference/react/useContext)
- [MUI Icons](https://mui.com/material-ui/material-icons/)
- [Emotion (styling)](https://emotion.sh/)

---

## 🔑 Avantages de cette approche

| Aspect | Sans MUI/Context | Avec MUI/Context |
|--------|------------------|------------------|
| **Props** | Drilling sur 3-4 niveaux | Accès direct via Context |
| **Design** | CSS custom à écrire | Composants stylés ready |
| **Accessibilité** | À implémenter manuellement | Intégrée dans MUI |
| **Maintenance** | Props partout | Logique centralisée |
| **Code** | Verbeux | Concis |

---

Bon développement avec React + MUI + Context API ! 🎉
