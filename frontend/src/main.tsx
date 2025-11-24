// ========================================
// POINT D'ENTRÉE - main.tsx
// ========================================
// CONCEPTS : Initialisation React, Montage dans le DOM
// ========================================

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './style.css';

/**
 * CONCEPT REACT : Point d'entrée de l'application
 * 
 * Ce fichier est le premier fichier exécuté par l'application React
 * Il monte le composant App dans le DOM
 * 
 * ÉQUIVALENT VUE.JS :
 * ```typescript
 * import { createApp } from 'vue'
 * import App from './App.vue'
 * 
 * createApp(App).mount('#app')
 * ```
 */

/**
 * CONCEPT REACT 18 : Nouveau système de rendu avec createRoot
 * 
 * React 18 a introduit une nouvelle API pour monter l'application
 * 
 * ANCIEN (React 17) :
 * ```typescript
 * ReactDOM.render(<App />, document.getElementById('app'));
 * ```
 * 
 * NOUVEAU (React 18) :
 * ```typescript
 * const root = ReactDOM.createRoot(document.getElementById('app')!);
 * root.render(<App />);
 * ```
 * 
 * AVANTAGES :
 * - Support du Concurrent Mode (rendu concurrent)
 * - Meilleures performances
 * - Support de Suspense et Transitions
 */

/**
 * CONCEPT REACT : StrictMode
 * 
 * StrictMode est un composant qui active des vérifications supplémentaires
 * en mode développement :
 * - Détecte les composants avec des effets de bord non intentionnels
 * - Avertit sur l'utilisation d'APIs dépréciées
 * - Avertit sur les effets de bord dans le rendu
 * 
 * IMPORTANT : StrictMode rend les composants DEUX FOIS en dev
 * C'est voulu ! Cela aide à détecter les bugs
 * En production, les composants ne sont rendus qu'une seule fois
 * 
 * ÉQUIVALENT VUE.JS : Pas d'équivalent direct
 */

// Récupère l'élément DOM racine
const rootElement = document.getElementById('app');

// Vérification TypeScript : l'élément existe
if (!rootElement) {
  throw new Error('Failed to find the root element');
}

// Crée la racine React
const root = ReactDOM.createRoot(rootElement);

// Monte l'application
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

/**
 * NOTES PÉDAGOGIQUES :
 * 
 * 1. POURQUOI main.tsx ET PAS index.tsx ?
 *    C'est une convention. Les deux noms sont valides.
 *    Vite (le bundler moderne) utilise souvent main.tsx
 * 
 * 2. POURQUOI L'OPÉRATEUR ! ?
 *    document.getElementById('app')!
 *    Le ! dit à TypeScript "je suis sûr que cet élément existe"
 *    Sans ça, TypeScript pense que ça peut être null
 * 
 * 3. QU'EST-CE QUE JSX ?
 *    <App /> est du JSX, pas du HTML
 *    Le bundler transforme ça en :
 *    React.createElement(App, null)
 * 
 * 4. STRICTMODE EN PRODUCTION ?
 *    StrictMode n'a aucun effet en production
 *    Il n'ajoute pas de nœuds au DOM
 *    C'est juste pour le développement
 * 
 * 5. STRUCTURE HTML NÉCESSAIRE :
 *    Le fichier index.html doit contenir :
 *    <div id="app"></div>
 *    
 *    React remplacera le contenu de cette div
 */
