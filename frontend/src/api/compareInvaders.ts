// ========================================
// FICHIER API - COMPARE INVADERS
// ========================================
// Ce fichier est IDENTIQUE à la version Vue.js !
// Les fonctions API ne dépendent pas du framework UI.

/**
 * Compare les invaders d'un joueur de référence avec ceux d'autres joueurs
 * 
 * @param referenceInvaders - Liste des invaders du joueur de référence
 * @param others - Objet avec les listes d'invaders des autres joueurs (clé = nom du joueur, valeur = liste d'invaders)
 * @returns Un objet avec les invaders que chaque joueur possède MAIS PAS le joueur de référence
 * 
 * EXEMPLE :
 * referenceInvaders = ['A', 'B', 'C']
 * others = {
 *   'Player1': ['A', 'B', 'D'],
 *   'Player2': ['C', 'E']
 * }
 * 
 * RETOURNE :
 * {
 *   'Player1': ['D'],  // Player1 a 'D' que reference n'a pas
 *   'Player2': ['E']   // Player2 a 'E' que reference n'a pas
 * }
 * 
 * UTILITÉ :
 * Permet de savoir quels invaders manquent au joueur de référence
 * et que les autres joueurs possèdent (utile pour l'échange/trading)
 */
export function compareInvaders(
  referenceInvaders: string[],
  others: Record<string, string[]>
): Record<string, string[]> {
  const result: Record<string, string[]> = {};
  
  // Crée un Set pour des recherches O(1) au lieu de O(n)
  const refSet = new Set(referenceInvaders.map(s => s.trim()));

  // Pour chaque autre joueur
  for (const [playerName, invList] of Object.entries(others)) {
    const invSet = new Set((invList || []).map(s => s.trim()));
    
    // Trouve les invaders que ce joueur a MAIS PAS le joueur de référence
    const diff = [...invSet].filter(inv => !refSet.has(inv));
    
    // Stocke le résultat trié
    result[playerName] = diff.sort();
  }

  return result;
}
