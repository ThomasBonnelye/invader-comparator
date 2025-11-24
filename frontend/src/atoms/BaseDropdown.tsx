// ========================================
// COMPOSANT ATOM - BaseDropdown
// ========================================
// NIVEAU : ⭐⭐⭐ AVANCÉ
// CONCEPTS : useState, useRef, useEffect, useCallback, useMemo, custom hooks
// ========================================

import React, { useState, useMemo, useCallback } from 'react';
import { useClickOutside } from '../hooks/useClickOutside';
import BaseButton from './BaseButton';

/**
 * CONCEPT REACT : Interfaces TypeScript
 * 
 * Définition claire des types pour les données manipulées
 */
interface Option {
  label: string;  // Texte affiché
  value: string;  // Valeur interne
}

interface BaseDropdownProps {
  options: Option[];                      // Liste des options disponibles
  value: string | string[];               // Valeur(s) sélectionnée(s)
  onChange: (value: string | string[]) => void;  // Callback de changement
  multiple?: boolean;                     // Mode multi-sélection
  disabled?: boolean;                     // Dropdown désactivé
  placeholder?: string;                   // Texte par défaut
}

/**
 * Composant dropdown (liste déroulante) avec support de sélection simple ou multiple
 * 
 * CONCEPTS ILLUSTRÉS :
 * 1. useState : Gestion d'état local (ouverture du dropdown)
 * 2. useMemo : Calcul optimisé du label du bouton
 * 3. useCallback : Mémorisation des fonctions handlers
 * 4. useClickOutside : Hook personnalisé pour fermer le dropdown
 * 5. Composition : Utilise BaseButton
 */
function BaseDropdown({
  options,
  value,
  onChange,
  multiple = false,
  disabled = false,
  placeholder = 'Sélectionner...',
}: BaseDropdownProps) {
  
  /**
   * CONCEPT REACT : useState
   * 
   * Gère l'état d'ouverture/fermeture du dropdown
   * 
   * ÉQUIVALENT VUE.JS : ref(false)
   * 
   * IMPORTANT : Chaque appel à setIsOpen déclenche un re-render
   */
  const [isOpen, setIsOpen] = useState(false);

  /**
   * CONCEPT REACT : Custom Hook
   * 
   * Utilise notre hook personnalisé pour détecter les clics extérieurs
   * Le hook retourne une ref que l'on attache au conteneur
   * 
   * ÉQUIVALENT VUE.JS :
   * ```typescript
   * const dropdownRef = ref<HTMLElement | null>(null);
   * onMounted(() => {
   *   document.addEventListener('click', handleClickOutside);
   * });
   * onBeforeUnmount(() => {
   *   document.removeEventListener('click', handleClickOutside);
   * });
   * ```
   */
  const dropdownRef = useClickOutside<HTMLDivElement>(() => {
    setIsOpen(false);
  });

  /**
   * CONCEPT REACT : useCallback
   * 
   * Mémorise la fonction toggleDropdown pour éviter de la recréer à chaque render
   * 
   * POURQUOI ?
   * - Si on passe cette fonction comme prop à BaseButton
   * - Et que BaseButton est optimisé avec React.memo
   * - Sans useCallback, BaseButton se re-rendrait à chaque fois
   * 
   * DÉPENDANCES : [disabled]
   * - La fonction doit se recréer si disabled change
   * 
   * ÉQUIVALENT VUE.JS : Pas nécessaire (Vue optimise automatiquement)
   */
  const toggleDropdown = useCallback(() => {
    if (!disabled) {
      setIsOpen((prev) => !prev);
    }
  }, [disabled]);

  /**
   * CONCEPT REACT : useCallback avec logique complexe
   * 
   * Gère la sélection d'une option
   * Différent selon mode simple ou multiple
   */
  const selectOption = useCallback(
    (option: Option) => {
      if (multiple) {
        // MODE MULTIPLE : Ajoute/retire l'option de la liste
        const currentValues = Array.isArray(value) ? value : [];
        const index = currentValues.indexOf(option.value);
        
        if (index === -1) {
          // Option non sélectionnée → on l'ajoute
          onChange([...currentValues, option.value]);
        } else {
          // Option déjà sélectionnée → on la retire
          const newValues = [...currentValues];
          newValues.splice(index, 1);
          onChange(newValues);
        }
      } else {
        // MODE SIMPLE : Remplace la valeur et ferme le dropdown
        onChange(option.value);
        setIsOpen(false);
      }
    },
    [multiple, value, onChange]
  );

  /**
   * CONCEPT REACT : Fonction utilitaire
   * 
   * Vérifie si une option est sélectionnée
   */
  const isSelected = useCallback(
    (option: Option): boolean => {
      if (multiple) {
        return Array.isArray(value) && value.includes(option.value);
      }
      return value === option.value;
    },
    [multiple, value]
  );

  /**
   * CONCEPT REACT : useMemo
   * 
   * Calcule le label du bouton de manière optimisée
   * Ne recalcule que si options ou value changent
   * 
   * POURQUOI ?
   * - Le calcul peut être coûteux si beaucoup d'options
   * - On évite de recalculer à chaque render
   * 
   * ÉQUIVALENT VUE.JS : computed(() => ...)
   */
  const buttonLabel = useMemo(() => {
    if (multiple) {
      // Mode multiple : affiche tous les labels séparés par des virgules
      const selectedOptions = options.filter(
        (opt) => Array.isArray(value) && value.includes(opt.value)
      );
      const labels = selectedOptions.map((opt) => opt.label);
      return labels.length > 0 ? labels.join(', ') : placeholder;
    } else {
      // Mode simple : affiche le label de l'option sélectionnée
      const found = options.find((opt) => opt.value === value);
      return found?.label || placeholder;
    }
  }, [options, value, multiple, placeholder]);

  /**
   * CONCEPT REACT : JSX conditionnel
   * 
   * En React, on utilise :
   * - {condition && <Component />} : Affiche si condition vraie
   * - {condition ? <A /> : <B />} : Affiche A ou B selon condition
   * 
   * ÉQUIVALENT VUE.JS : v-if, v-else, v-show
   */
  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      <BaseButton
        label={buttonLabel}
        action={toggleDropdown}
        disabled={disabled}
      />

      {/* Affiche la liste déroulante si ouverte */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            background: 'white',
            border: '1px solid #ccc',
            marginTop: '2px',
            zIndex: 10,
            minWidth: '100%',
          }}
        >
          {/* CONCEPT REACT : .map() pour les listes */}
          {/* ÉQUIVALENT VUE.JS : v-for */}
          {options.map((option) => (
            <div
              key={option.value}  // KEY obligatoire pour les listes !
              onClick={() => selectOption(option)}
              style={{
                padding: '6px 10px',
                cursor: 'pointer',
                backgroundColor: isSelected(option) ? '#eee' : 'white',
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BaseDropdown;

/**
 * NOTES PÉDAGOGIQUES :
 * 
 * 1. POURQUOI useState, useMemo, useCallback ?
 *    
 *    useState : Pour l'état local qui change (isOpen)
 *    useMemo : Pour les valeurs calculées coûteuses (buttonLabel)
 *    useCallback : Pour les fonctions passées comme props ou dépendances
 * 
 * 2. KEY DANS LES LISTES :
 *    La prop key est OBLIGATOIRE pour les listes en React
 *    - Aide React à identifier les éléments
 *    - Optimise les re-renders
 *    - Doit être unique et stable
 * 
 * 3. GESTION D'ÉTAT IMMUTABLE :
 *    En React, on ne modifie JAMAIS l'état directement !
 *    
 *    ❌ MAL :
 *    currentValues.push(newValue);
 *    onChange(currentValues);
 *    
 *    ✅ BIEN :
 *    onChange([...currentValues, newValue]);
 * 
 * 4. CALLBACK DANS setState :
 *    setIsOpen(prev => !prev) utilise la valeur précédente
 *    Plus sûr que setIsOpen(!isOpen) qui pourrait être obsolète
 * 
 * 5. STYLES INLINE :
 *    Ici, on utilise des styles inline pour la simplicité
 *    En production, préférez CSS Modules ou Styled Components
 * 
 * EXEMPLE D'UTILISATION :
 * ```tsx
 * const Parent = () => {
 *   const [selected, setSelected] = useState('');
 *   
 *   const options = [
 *     { label: 'Option 1', value: '1' },
 *     { label: 'Option 2', value: '2' },
 *   ];
 *   
 *   return (
 *     <BaseDropdown
 *       options={options}
 *       value={selected}
 *       onChange={setSelected}
 *     />
 *   );
 * };
 * ```
 * 
 * EXERCICE :
 * Ajoutez ces fonctionnalités :
 * - Recherche dans les options
 * - Groupe d'options (avec optgroups)
 * - Support du clavier (flèches, Enter, Escape)
 * - Animation d'ouverture/fermeture
 */
