// ========================================
// HOOK PERSONNALISÉ - useClickOutside
// ========================================

import { useEffect, useRef, RefObject } from 'react';

/**
 * CONCEPT REACT : Custom Hook (Hook personnalisé)
 * 
 * Un hook personnalisé est une fonction qui :
 * - Commence par "use" (convention obligatoire)
 * - Peut utiliser d'autres hooks React
 * - Encapsule de la logique réutilisable
 * 
 * ÉQUIVALENT VUE.JS :
 * En Vue, on utiliserait un "composable" (fonction réutilisable)
 * 
 * UTILITÉ DE CE HOOK :
 * Détecte quand l'utilisateur clique en dehors d'un élément
 * Très utile pour fermer des modals, dropdowns, tooltips, etc.
 */

/**
 * Hook pour détecter les clics en dehors d'un élément
 * 
 * @param callback - Fonction appelée quand un clic extérieur est détecté
 * @returns Une ref à attacher à l'élément à surveiller
 * 
 * EXEMPLE D'UTILISATION :
 * ```tsx
 * const MyComponent = () => {
 *   const [isOpen, setIsOpen] = useState(false);
 *   
 *   const ref = useClickOutside(() => {
 *     setIsOpen(false);
 *   });
 *   
 *   return (
 *     <div ref={ref}>
 *       {isOpen && <div>Dropdown content</div>}
 *     </div>
 *   );
 * };
 * ```
 */
export function useClickOutside<T extends HTMLElement = HTMLElement>(
  callback: () => void
): RefObject<T> {
  // HOOK useRef : Crée une référence qui persiste entre les rendus
  // Permet d'accéder au DOM sans déclencher de re-render
  const ref = useRef<T>(null);

  // HOOK useEffect : Gère les effets de bord
  useEffect(() => {
    // Fonction qui vérifie si le clic est en dehors de l'élément
    const handleClickOutside = (event: MouseEvent) => {
      // ref.current contient l'élément DOM
      // event.target contient l'élément cliqué
      
      if (ref.current && !ref.current.contains(event.target as Node)) {
        // Le clic est en dehors de l'élément
        callback();
      }
    };

    // Ajoute l'écouteur d'événement au document
    // NOTE : On utilise 'mousedown' plutôt que 'click' pour capturer plus tôt
    document.addEventListener('mousedown', handleClickOutside);

    // CLEANUP FUNCTION : Fonction de nettoyage
    // Exécutée quand le composant est démonté OU avant le prochain effet
    // IMPORTANT : Toujours nettoyer les event listeners pour éviter les fuites mémoire !
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [callback]); // DÉPENDANCES : Le effet se réexécute si callback change

  // Retourne la ref pour que le composant puisse l'attacher à un élément
  return ref;
}

/**
 * NOTES PÉDAGOGIQUES :
 * 
 * 1. POURQUOI useRef ET PAS useState ?
 *    - useRef ne déclenche PAS de re-render quand on modifie .current
 *    - useState déclenche un re-render à chaque modification
 *    - Pour une référence DOM, on ne veut pas de re-render !
 * 
 * 2. POURQUOI LE CLEANUP DANS useEffect ?
 *    - Si on ne retire pas l'event listener, il reste en mémoire
 *    - Cela crée des fuites mémoire et des bugs
 *    - La fonction de cleanup est appelée automatiquement par React
 * 
 * 3. POURQUOI callback DANS LES DÉPENDANCES ?
 *    - Si callback change, on veut ré-enregistrer l'event listener
 *    - Sinon, on appellerait l'ancienne version de callback
 *    - ESLint React vous avertira si vous oubliez une dépendance
 * 
 * 4. GÉNÉRIQUE <T extends HTMLElement> :
 *    - Permet d'utiliser le hook avec n'importe quel type d'élément HTML
 *    - Exemple : useClickOutside<HTMLDivElement>()
 *    - TypeScript peut inférer automatiquement le type
 */
