// ========================================
// COMPOSANT ATOM - DataTable
// ========================================
// NIVEAU : ⭐⭐⭐⭐ EXPERT
// CONCEPTS : useEffect avec dépendances, useMemo, gestion async, cache, performance
// ========================================

import React, { useState, useEffect, useMemo } from 'react';
import { fetchPlayerData, type PlayerData } from '../api/spaceInvaders';
import { compareInvaders } from '../api/compareInvaders';

interface DataTableProps {
  firstFilter?: string;      // UID du joueur de référence
  secondFilters?: string[];  // UIDs des autres joueurs
  search?: string;           // Terme de recherche
}

/**
 * Composant tableau de données avec gestion asynchrone et cache
 * 
 * CONCEPTS ILLUSTRÉS :
 * 1. useEffect : Chargement de données asynchrones
 * 2. useState : Gestion d'états multiples (cache, données, loading, erreur)
 * 3. useMemo : Optimisation du filtrage de données
 * 4. Gestion d'erreurs : Pattern try/catch avec états d'erreur
 * 5. Cache : Éviter de recharger les données déjà récupérées
 */
function DataTable({ firstFilter, secondFilters, search }: DataTableProps) {
  
  /**
   * CONCEPT REACT : États multiples
   * 
   * En React, on peut avoir plusieurs useState pour gérer différents aspects
   * Chaque état est indépendant et déclenche son propre re-render
   */
  
  // Cache des données de joueurs (key = UID, value = PlayerData)
  const [cache, setCache] = useState<Record<string, PlayerData>>({});
  
  // Résultat de la comparaison (key = nom du joueur, value = liste d'invaders)
  const [rows, setRows] = useState<Record<string, string[]>>({});
  
  // En-têtes de colonnes (noms des joueurs)
  const [columnHeaders, setColumnHeaders] = useState<string[]>([]);
  
  // État de chargement
  const [loading, setLoading] = useState(false);
  
  // Message d'erreur
  const [error, setError] = useState<string | null>(null);

  /**
   * CONCEPT REACT : Fonction asynchrone utilitaire
   * 
   * Charge les données d'un joueur en utilisant le cache si disponible
   * 
   * PATTERN : Cache-First
   * 1. Vérifie si les données sont en cache
   * 2. Si non, fait un appel API
   * 3. Stocke le résultat dans le cache
   */
  const ensurePlayer = async (uid: string): Promise<void> => {
    if (!uid) return;
    
    // Si déjà en cache, ne rien faire
    if (cache[uid]) return;

    try {
      const data = await fetchPlayerData(uid);
      
      // IMPORTANT : Mise à jour immutable du cache
      // On ne modifie PAS cache directement, on crée un nouvel objet
      setCache((prevCache) => ({
        ...prevCache,
        [uid]: data,
      }));
    } catch (e) {
      console.error('Fetch error:', e);
      // En cas d'erreur, on met quand même un objet vide pour éviter de réessayer
      setCache((prevCache) => ({
        ...prevCache,
        [uid]: { player: uid, invaders: [] },
      }));
    }
  };

  /**
   * CONCEPT REACT : useEffect avec dépendances multiples
   * 
   * Cet effet s'exécute quand firstFilter OU secondFilters changent
   * 
   * ÉQUIVALENT VUE.JS :
   * ```typescript
   * watch(
   *   () => [firstFilter, secondFilters],
   *   async ([first, seconds]) => { ... }
   * )
   * ```
   * 
   * IMPORTANT : Ne PAS oublier les dépendances !
   * ESLint React vous avertira si une dépendance manque
   */
  useEffect(() => {
    // Fonction asynchrone à l'intérieur de useEffect
    const loadData = async () => {
      // Réinitialise les données
      setRows({});
      setColumnHeaders([]);
      setError(null);

      // Validation : on a besoin de firstFilter ET secondFilters
      if (!firstFilter || !secondFilters || secondFilters.length === 0) {
        return;
      }

      setLoading(true);
      
      try {
        // Charge les données du joueur de référence
        await ensurePlayer(firstFilter);
        
        // Charge les données de tous les autres joueurs en parallèle
        // Promise.all exécute toutes les promesses en même temps
        await Promise.all(secondFilters.map((uid) => ensurePlayer(uid)));

        // Récupère les données du joueur de référence depuis le cache
        const refData = cache[firstFilter];
        if (!refData) {
          throw new Error('Impossible de récupérer les données du joueur principal');
        }

        // Prépare les données des autres joueurs
        const others: Record<string, string[]> = {};
        for (const uid of secondFilters) {
          const playerData = cache[uid];
          if (!playerData) continue;
          
          const playerName = playerData.player || uid;
          others[playerName] = playerData.invaders || [];
        }

        // Compare les invaders et stocke le résultat
        const comparisonResult = compareInvaders(refData.invaders || [], others);
        
        setColumnHeaders(Object.keys(others));
        setRows(comparisonResult);
        
      } catch (e: unknown) {
        console.error(e);
        setError(e instanceof Error ? e.message : 'Erreur inconnue');
        setRows({});
        setColumnHeaders([]);
      } finally {
        // finally s'exécute toujours, même en cas d'erreur
        setLoading(false);
      }
    };

    // Appelle la fonction asynchrone
    loadData();
    
    // DÉPENDANCES : Le useEffect se réexécute si ces valeurs changent
    // ATTENTION : cache n'est PAS dans les dépendances car il change à l'intérieur
  }, [firstFilter, secondFilters]);
  
  // NOTE : On utilise un deuxième useEffect implicite via cache
  // Car ensurePlayer met à jour cache, qui déclenche un re-render

  /**
   * CONCEPT REACT : useMemo pour filtrage
   * 
   * Filtre les résultats selon le terme de recherche
   * Ne recalcule que si rows ou search changent
   * 
   * POURQUOI useMemo ICI ?
   * - Le filtrage peut être coûteux si beaucoup de données
   * - On évite de refiltrer à chaque render
   * - Seuls rows et search déclenchent un nouveau calcul
   */
  const filteredRows = useMemo(() => {
    if (!search) return rows;

    const filtered: Record<string, string[]> = {};
    const searchLower = search.toLowerCase();
    
    for (const [playerName, invaders] of Object.entries(rows)) {
      // Filtre les invaders qui contiennent le terme de recherche
      filtered[playerName] = (invaders || []).filter((inv) =>
        inv.toLowerCase().includes(searchLower)
      );
    }
    
    return filtered;
  }, [rows, search]);

  /**
   * CONCEPT REACT : useMemo pour calcul dérivé
   * 
   * Calcule le nombre maximum de lignes nécessaires
   * Utile pour créer les lignes du tableau
   */
  const maxRows = useMemo(() => {
    const lengths = Object.values(filteredRows).map((arr) => arr.length || 0);
    return lengths.length ? Math.max(...lengths) : 0;
  }, [filteredRows]);

  /**
   * CONCEPT REACT : Rendu conditionnel multiple
   * 
   * Affiche différentes choses selon l'état :
   * 1. Erreur → Message d'erreur
   * 2. Loading → Message de chargement
   * 3. Données disponibles → Tableau
   * 4. Pas de données → Message par défaut
   */
  
  // État d'erreur
  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  // État de chargement
  if (loading) {
    return <div>Chargement...</div>;
  }

  // Pas de données à afficher
  if (columnHeaders.length === 0 || maxRows === 0) {
    return <p>Aucune donnée à afficher.</p>;
  }

  // Affiche le tableau
  return (
    <table cellPadding="6">
      <thead>
        <tr>
          {/* CONCEPT REACT : .map() pour générer des éléments */}
          {columnHeaders.map((col) => (
            <th key={col}>{col}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {/* Génère les lignes : de 1 à maxRows */}
        {Array.from({ length: maxRows }, (_, i) => i + 1).map((rowIndex) => (
          <tr key={rowIndex}>
            {columnHeaders.map((col) => (
              <td key={`${col}-${rowIndex}`}>
                {/* Affiche l'invader à l'index (rowIndex - 1), ou vide */}
                {filteredRows[col]?.[rowIndex - 1] || ''}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default DataTable;

/**
 * NOTES PÉDAGOGIQUES :
 * 
 * 1. POURQUOI useEffect ET PAS DIRECTEMENT ASYNC ?
 *    
 *    ❌ MAL :
 *    useEffect(async () => {
 *      await fetchData();
 *    }, []);
 *    
 *    ✅ BIEN :
 *    useEffect(() => {
 *      const loadData = async () => {
 *        await fetchData();
 *      };
 *      loadData();
 *    }, []);
 *    
 *    React n'accepte pas de fonction async directement dans useEffect
 * 
 * 2. GESTION DU CACHE :
 *    Le cache évite de recharger les données déjà récupérées
 *    Important pour les performances et limiter les appels API
 *    
 *    PATTERN :
 *    - Vérifie si en cache → utilise directement
 *    - Pas en cache → fetch → stocke dans cache
 * 
 * 3. MISE À JOUR IMMUTABLE :
 *    setCache(prev => ({ ...prev, [uid]: data }))
 *    
 *    On crée un NOUVEAU objet, on ne modifie pas l'ancien
 *    React détecte les changements par référence d'objet
 * 
 * 4. DÉPENDANCES DE useEffect :
 *    [firstFilter, secondFilters]
 *    
 *    POURQUOI cache N'EST PAS dans les dépendances ?
 *    - cache change à l'intérieur de l'effet (via ensurePlayer)
 *    - L'inclure créerait une boucle infinie
 *    - On utilise plutôt la fonction callback de setCache
 * 
 * 5. Promise.all VS SÉQUENTIEL :
 *    
 *    SÉQUENTIEL (lent) :
 *    for (const uid of uids) {
 *      await fetchData(uid); // Attend chaque fetch
 *    }
 *    
 *    PARALLÈLE (rapide) :
 *    await Promise.all(uids.map(uid => fetchData(uid)));
 * 
 * 6. GÉNÉRATION DE LIGNES :
 *    Array.from({ length: maxRows }, (_, i) => i + 1)
 *    
 *    Crée un tableau [1, 2, 3, ..., maxRows]
 *    Utile pour générer N éléments
 * 
 * EXEMPLE D'UTILISATION :
 * ```tsx
 * const Parent = () => {
 *   const [first, setFirst] = useState('');
 *   const [seconds, setSeconds] = useState<string[]>([]);
 *   const [search, setSearch] = useState('');
 *   
 *   return (
 *     <DataTable
 *       firstFilter={first}
 *       secondFilters={seconds}
 *       search={search}
 *     />
 *   );
 * };
 * ```
 * 
 * EXERCICE :
 * Améliorez le composant avec :
 * - Pagination des résultats
 * - Tri par colonne
 * - Export CSV
 * - Skeleton loader pendant le chargement
 */
