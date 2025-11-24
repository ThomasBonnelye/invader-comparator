// ========================================
// FICHIER API - SPACE INVADERS
// ========================================
// Ce fichier est IDENTIQUE à la version Vue.js !
// Les fonctions API ne dépendent pas du framework UI.

/**
 * Interface représentant les données d'un joueur
 */
export interface PlayerData {
  player: string;      // Nom du joueur
  invaders: string[];  // Liste des invaders capturés
}

/**
 * Interface interne pour les données brutes de l'API
 */
interface InvaderData {
  name?: string;
}

/**
 * Récupère les données d'un joueur depuis l'API Space Invaders
 * 
 * @param uid - L'identifiant unique du joueur
 * @returns Les données du joueur (nom + liste d'invaders)
 * 
 * NOTES :
 * - L'API retourne un objet complexe avec player.name et invaders
 * - On extrait uniquement les noms des invaders
 * - On utilise Set pour éliminer les doublons
 */
export async function fetchPlayerData(uid: string): Promise<PlayerData> {
  const BASE_URL = 'https://api.space-invaders.com/flashinvaders_v3_pas_trop_predictif/api/gallery?uid=';

  try {
    const response = await fetch(`${BASE_URL}${uid}`);
    const data = await response.json();

    // Extraction du nom du joueur (ou uid si pas de nom)
    const player = data?.player?.name || uid;
    
    // Extraction des noms d'invaders depuis l'objet
    const invadersRaw = Object.values(data?.invaders || {}) as InvaderData[];
    const invaderNames = [...new Set(invadersRaw.map((inv) => (inv?.name ?? '').toString().trim()))];

    return {
      player,
      invaders: invaderNames,
    };
  } catch (error) {
    console.error(`Erreur lors du fetch des données pour UID ${uid}:`, error);
    return {
      player: uid,
      invaders: [],
    };
  }
}
