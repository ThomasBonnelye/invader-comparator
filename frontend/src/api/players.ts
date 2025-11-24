// ========================================
// FICHIER API - PLAYERS
// ========================================
// Ce fichier est IDENTIQUE à la version Vue.js !
// Les fonctions API ne dépendent pas du framework UI.

/**
 * Récupère la liste de tous les UIDs (joueurs) depuis l'API
 * Combine myUid et othersUids en une seule liste
 */
export const fetchPlayers = async (): Promise<{ value: string }[]> => {
  try {
    const response = await fetch('/api/uids');
    if (!response.ok) {
      throw new Error('Failed to fetch UIDs');
    }
    const data = await response.json();
    
    // Combine mon UID et les UIDs des autres joueurs
    const allUids = [data.myUid, ...data.othersUids].filter(Boolean);
    
    // Retourne un tableau d'objets { value: uid }
    return allUids.map((value: string) => ({ value }));
  } catch (error) {
    console.error('Players loading failed:', error);
    return [];
  }
};

// Export d'un tableau vide (utilisé comme valeur par défaut ailleurs)
export const players: { value: string }[] = [];
