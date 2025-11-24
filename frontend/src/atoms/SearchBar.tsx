// ========================================
// COMPOSANT ATOM - SearchBar
// ========================================
// NIVEAU : ⭐⭐ INTERMÉDIAIRE
// CONCEPTS : Controlled Components, onChange, événements typés
// ========================================

import React from 'react';

/**
 * CONCEPT REACT : Controlled Component (Composant contrôlé)
 * 
 * En React, un input est "contrôlé" quand :
 * 1. Sa valeur vient de l'état du composant parent (value={...})
 * 2. Les changements sont gérés par le composant parent (onChange={...})
 * 
 * ÉQUIVALENT VUE.JS : v-model
 * Vue utilise v-model qui fait automatiquement le two-way binding
 * React nécessite de le gérer manuellement pour plus de contrôle
 * 
 * VUE :
 * <input v-model="search" />
 * 
 * REACT :
 * <input value={search} onChange={(e) => setSearch(e.target.value)} />
 */

interface SearchBarProps {
  value: string;                                    // Valeur actuelle de l'input
  onChange: (value: string) => void;                // Callback appelé quand la valeur change
  placeholder?: string;                             // Texte placeholder
  className?: string;                               // Classes CSS additionnelles
}

/**
 * Composant barre de recherche
 * 
 * PATTERN : Composant contrôlé
 * - La valeur est contrôlée par le parent (via props.value)
 * - Les changements sont remontés au parent (via props.onChange)
 * 
 * @param props - Les propriétés du composant
 */
function SearchBar({ 
  value, 
  onChange, 
  placeholder = 'Rechercher...', 
  className = '' 
}: SearchBarProps) {
  
  /**
   * CONCEPT REACT : Gestion d'événement typé
   * 
   * React.ChangeEvent<HTMLInputElement> est le type de l'événement onChange d'un input
   * 
   * STRUCTURE DE L'ÉVÉNEMENT :
   * - event.target : L'élément DOM qui a déclenché l'événement
   * - event.target.value : La nouvelle valeur de l'input
   * - event.currentTarget : L'élément sur lequel l'event handler est attaché
   * 
   * POURQUOI TYPER LES ÉVÉNEMENTS ?
   * - TypeScript peut auto-compléter les propriétés
   * - Évite les erreurs de typage
   * - Documentation claire du type d'événement attendu
   */
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Extrait la nouvelle valeur
    const newValue = event.target.value;
    
    // Appelle le callback du parent avec la nouvelle valeur
    onChange(newValue);
  };

  return (
    <input
      type="text"
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      className={className}
    />
  );
}

export default SearchBar;

/**
 * NOTES PÉDAGOGIQUES :
 * 
 * 1. POURQUOI "CONTROLLED COMPONENT" ?
 *    - Le parent contrôle la valeur de l'input
 *    - Permet de valider, transformer, ou synchroniser les données
 *    - Single source of truth : l'état est dans le parent
 * 
 * 2. UNCONTROLLED VS CONTROLLED :
 *    
 *    UNCONTROLLED (non recommandé pour les formulaires complexes) :
 *    ```tsx
 *    const inputRef = useRef<HTMLInputElement>(null);
 *    <input ref={inputRef} />
 *    // Accès à la valeur : inputRef.current?.value
 *    ```
 *    
 *    CONTROLLED (recommandé) :
 *    ```tsx
 *    const [value, setValue] = useState('');
 *    <input value={value} onChange={(e) => setValue(e.target.value)} />
 *    ```
 * 
 * 3. ALTERNATIVE : INLINE HANDLER
 *    Au lieu de créer handleChange, on peut écrire :
 *    ```tsx
 *    <input onChange={(e) => onChange(e.target.value)} />
 *    ```
 *    Les deux approches sont valides !
 * 
 * 4. TYPAGE DES ÉVÉNEMENTS REACT :
 *    - React.ChangeEvent<HTMLInputElement> : input change
 *    - React.MouseEvent<HTMLButtonElement> : button click
 *    - React.FormEvent<HTMLFormElement> : form submit
 *    - React.KeyboardEvent<HTMLInputElement> : keyboard events
 * 
 * EXEMPLE D'UTILISATION :
 * ```tsx
 * const Parent = () => {
 *   const [search, setSearch] = useState('');
 *   
 *   return (
 *     <div>
 *       <SearchBar value={search} onChange={setSearch} />
 *       <p>Vous cherchez : {search}</p>
 *     </div>
 *   );
 * };
 * ```
 * 
 * EXERCICE :
 * Ajoutez ces fonctionnalités :
 * - Un bouton pour effacer la recherche
 * - Un debounce pour ne pas déclencher onChange à chaque touche
 * - Une icône de recherche (🔍)
 * - Un événement onKeyPress pour détecter "Enter"
 */
