// ========================================
// COMPOSANT MOLECULE - FilterPanel
// ========================================
// NIVEAU : ⭐⭐⭐ AVANCÉ
// CONCEPTS : Composition, Lifting State Up, Communication parent-enfant
// ========================================

import React from 'react';
import BaseDropdown from '../atoms/BaseDropdown';
import SearchBar from '../atoms/SearchBar';

/**
 * CONCEPT REACT : Architecture Atomic Design
 * 
 * Les "molecules" sont des composants qui combinent plusieurs "atoms"
 * Ils créent des fonctionnalités plus complexes en composant des éléments simples
 * 
 * ÉQUIVALENT VUE.JS : Même concept, pas de différence fondamentale
 */

interface Option {
  label: string;
  value: string;
}

interface FilterPanelProps {
  // Options pour les dropdowns
  firstOptions: Option[];
  secondOptions: Option[];
  
  // Valeurs sélectionnées
  selectedFirst: string;
  selectedSeconds: string[];
  
  // Valeur de recherche
  search: string;
  
  // Callbacks pour remonter les changements au parent
  onFirstChange: (value: string) => void;
  onSecondsChange: (values: string[]) => void;
  onSearchChange: (value: string) => void;
}

/**
 * CONCEPT REACT : Lifting State Up (Remonter l'état)
 * 
 * Ce composant NE GÈRE PAS l'état lui-même
 * L'état est géré par le composant parent (App)
 * 
 * POURQUOI ?
 * - L'état doit être partagé entre FilterPanel et DataTable
 * - On remonte l'état au plus proche ancêtre commun (App)
 * - C'est le pattern "single source of truth"
 * 
 * FLUX DE DONNÉES :
 * 1. Parent (App) passe les valeurs via props
 * 2. FilterPanel affiche ces valeurs
 * 3. Utilisateur interagit avec FilterPanel
 * 4. FilterPanel appelle les callbacks (onFirstChange, etc.)
 * 5. Parent met à jour son état
 * 6. Parent repasse les nouvelles valeurs via props
 * 7. FilterPanel se re-rend avec les nouvelles valeurs
 * 
 * ÉQUIVALENT VUE.JS :
 * En Vue, on utiliserait v-model ou emit pour le même pattern
 * La différence est que React est plus explicite (pas de magic)
 */

/**
 * Panneau de filtres combinant 2 dropdowns et une barre de recherche
 * 
 * CONCEPTS ILLUSTRÉS :
 * 1. Composition : Utilise BaseDropdown et SearchBar
 * 2. Props drilling : Passe les props aux composants enfants
 * 3. Callbacks : Remonte les événements au parent
 * 4. Controlled components : Tous les inputs sont contrôlés
 */
function FilterPanel({
  firstOptions,
  secondOptions,
  selectedFirst,
  selectedSeconds,
  search,
  onFirstChange,
  onSecondsChange,
  onSearchChange,
}: FilterPanelProps) {
  
  /**
   * CONCEPT REACT : Handler qui transforme les données
   * 
   * BaseDropdown peut retourner string | string[]
   * On veut garantir que onFirstChange reçoit toujours un string
   * 
   * PATTERN : Type Guard + Transformation
   */
  const handleFirstChange = (value: string | string[]) => {
    if (typeof value === 'string') {
      // Quand le premier dropdown change, on reset le second
      onFirstChange(value);
      onSecondsChange([]); // Reset de la sélection multiple
    }
  };

  /**
   * CONCEPT REACT : Handler qui garantit le type
   * 
   * On veut garantir que onSecondsChange reçoit toujours un string[]
   */
  const handleSecondsChange = (value: string | string[]) => {
    if (Array.isArray(value)) {
      onSecondsChange(value);
    }
  };

  /**
   * CONCEPT REACT : JSX et composition
   * 
   * On compose plusieurs composants atoms pour créer une molecule
   * Chaque atom est configuré avec des props spécifiques
   * 
   * IMPORTANT : Notez comment on passe les valeurs ET les callbacks
   * C'est le pattern "controlled component" appliqué à la composition
   */
  return (
    <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
      {/* Premier dropdown : Sélection simple du joueur de référence */}
      <BaseDropdown
        options={firstOptions}
        value={selectedFirst}
        onChange={handleFirstChange}
        multiple={false}
        placeholder="Sélectionner un joueur..."
      />

      {/* Deuxième dropdown : Sélection multiple des autres joueurs */}
      <BaseDropdown
        options={secondOptions}
        value={selectedSeconds}
        onChange={handleSecondsChange}
        multiple={true}
        disabled={!selectedFirst}  // Désactivé si aucun joueur de référence
        placeholder="Sélectionner des joueurs à comparer..."
      />

      {/* Barre de recherche */}
      <SearchBar
        value={search}
        onChange={onSearchChange}
        placeholder="Rechercher un invader..."
      />
    </div>
  );
}

export default FilterPanel;

/**
 * NOTES PÉDAGOGIQUES :
 * 
 * 1. LIFTING STATE UP :
 *    
 *    ❌ MAL (état local dans FilterPanel) :
 *    const FilterPanel = () => {
 *      const [selected, setSelected] = useState('');
 *      // Comment partager avec DataTable ?
 *    }
 *    
 *    ✅ BIEN (état dans le parent) :
 *    const App = () => {
 *      const [selected, setSelected] = useState('');
 *      return (
 *        <>
 *          <FilterPanel selected={selected} onChange={setSelected} />
 *          <DataTable selected={selected} />
 *        </>
 *      );
 *    }
 * 
 * 2. PROPS DRILLING :
 *    Ici, on passe beaucoup de props de App → FilterPanel → BaseDropdown
 *    
 *    C'est OK pour 2-3 niveaux de profondeur
 *    Au-delà, considérez :
 *    - Context API (état global)
 *    - Redux / Zustand (state management)
 *    - Composition plus intelligente
 * 
 * 3. TYPE GUARDS :
 *    if (typeof value === 'string') { ... }
 *    if (Array.isArray(value)) { ... }
 *    
 *    TypeScript comprend le type dans le bloc if
 *    C'est appelé "type narrowing"
 * 
 * 4. DÉSACTIVATION CONDITIONNELLE :
 *    disabled={!selectedFirst}
 *    
 *    Le second dropdown est désactivé tant qu'aucun joueur de référence
 *    n'est sélectionné. C'est une bonne UX !
 * 
 * 5. RESET DE SÉLECTION :
 *    Quand on change le joueur de référence, on reset les autres sélections
 *    Cela évite des incohérences dans les données
 * 
 * EXEMPLE D'UTILISATION :
 * ```tsx
 * const App = () => {
 *   const [selectedFirst, setSelectedFirst] = useState('');
 *   const [selectedSeconds, setSelectedSeconds] = useState<string[]>([]);
 *   const [search, setSearch] = useState('');
 *   
 *   const firstOptions = [
 *     { label: 'Player 1', value: 'uid1' },
 *     { label: 'Player 2', value: 'uid2' },
 *   ];
 *   
 *   const secondOptions = firstOptions.filter(
 *     opt => opt.value !== selectedFirst
 *   );
 *   
 *   return (
 *     <FilterPanel
 *       firstOptions={firstOptions}
 *       secondOptions={secondOptions}
 *       selectedFirst={selectedFirst}
 *       selectedSeconds={selectedSeconds}
 *       search={search}
 *       onFirstChange={setSelectedFirst}
 *       onSecondsChange={setSelectedSeconds}
 *       onSearchChange={setSearch}
 *     />
 *   );
 * };
 * ```
 * 
 * EXERCICE :
 * Améliorez FilterPanel avec :
 * - Un bouton "Réinitialiser" pour tout effacer
 * - Un indicateur du nombre de joueurs sélectionnés
 * - Une animation lors du changement de sélection
 * - Un mode "comparaison rapide" avec boutons prédéfinis
 */
