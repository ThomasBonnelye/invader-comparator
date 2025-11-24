// ========================================
// COMPOSANT ATOM - BaseButton
// ========================================
// NIVEAU : ⭐ DÉBUTANT
// CONCEPTS : Props, événements, TypeScript
// ========================================

import React from 'react';

/**
 * CONCEPT REACT : Props et TypeScript
 * 
 * En React, on définit les props avec une interface TypeScript
 * Les props sont les paramètres passés au composant
 * 
 * ÉQUIVALENT VUE.JS :
 * ```typescript
 * interface Props {
 *   label: string
 *   action: () => void
 * }
 * defineProps<Props>()
 * ```
 */
interface BaseButtonProps {
  label: string;              // Texte du bouton
  action: () => void;         // Fonction appelée au clic
  disabled?: boolean;         // Optionnel : bouton désactivé
  className?: string;         // Optionnel : classes CSS additionnelles
}

/**
 * Composant bouton simple
 * 
 * DIFFÉRENCES VUE VS REACT :
 * 
 * VUE.JS :
 * - Props : defineProps<Props>()
 * - Événement : @click="action"
 * - Template : <template><button>...</button></template>
 * 
 * REACT :
 * - Props : Paramètres de fonction
 * - Événement : onClick={action}
 * - Template : Return direct (JSX)
 * 
 * @param props - Les propriétés du composant
 */
function BaseButton({ label, action, disabled = false, className = '' }: BaseButtonProps) {
  /**
   * CONCEPT REACT : Gestion d'événements
   * 
   * En React, les événements sont en camelCase : onClick, onChange, onSubmit, etc.
   * En Vue, ils sont en kebab-case : @click, @change, @submit, etc.
   * 
   * IMPORTANT : Ne PAS appeler la fonction directement !
   * ❌ onClick={action()}      // Appelle immédiatement
   * ✅ onClick={action}         // Passe la référence de la fonction
   * ✅ onClick={() => action()} // Crée une nouvelle fonction
   */
  
  return (
    <button 
      onClick={action}
      disabled={disabled}
      className={className}
    >
      {label}
    </button>
  );
}

/**
 * CONCEPT REACT : Export par défaut
 * 
 * En React, on peut exporter le composant par défaut
 * Cela permet d'importer avec n'importe quel nom :
 * import MyButton from './BaseButton'
 * 
 * Ou avec export nommé :
 * export function BaseButton() { ... }
 * import { BaseButton } from './BaseButton'
 */
export default BaseButton;

/**
 * NOTES PÉDAGOGIQUES :
 * 
 * 1. SYNTAXE JSX :
 *    - JSX ressemble à HTML mais c'est du JavaScript
 *    - On peut écrire des expressions JavaScript entre {}
 *    - Exemple : <div>{2 + 2}</div> affiche 4
 * 
 * 2. PROPS OPTIONNELLES :
 *    - disabled?: boolean signifie que c'est optionnel
 *    - On peut définir une valeur par défaut : disabled = false
 * 
 * 3. DÉSTRUCTURATION :
 *    - { label, action } = extraction des propriétés de props
 *    - Équivalent à : props.label et props.action
 *    - Plus concis et lisible
 * 
 * 4. POURQUOI React (majuscule) DANS L'IMPORT ?
 *    - Historiquement nécessaire pour transformer JSX
 *    - Avec React 17+, ce n'est plus obligatoire
 *    - Mais toujours une bonne pratique
 * 
 * EXERCICE :
 * Essayez d'ajouter d'autres props :
 * - type?: 'button' | 'submit' | 'reset'
 * - variant?: 'primary' | 'secondary' | 'danger'
 * - size?: 'small' | 'medium' | 'large'
 * 
 * Et utilisez-les pour changer l'apparence du bouton !
 */
