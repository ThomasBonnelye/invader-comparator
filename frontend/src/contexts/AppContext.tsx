// ========================================
// CONTEXT - AppContext
// ========================================
// NIVEAU : ⭐⭐⭐ AVANCÉ
// CONCEPTS : Context API, gestion d'état global, TypeScript
// ========================================

import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { fetchPlayers } from '../api/players';
import { fetchPlayerData, type PlayerData } from '../api/spaceInvaders';

/**
 * CONCEPT REACT : Context API
 * 
 * La Context API permet de partager des données entre composants sans props drilling.
 * 
 * PROBLÈME RÉSOLU : Props Drilling
 * 
 * SANS Context (Props Drilling) :
 * App → Header → UserMenu → UserName (4 niveaux de props)
 * App → Main → FilterPanel → Dropdown → onChange (4 niveaux)
 * 
 * AVEC Context :
 * App → AppContext.Provider
 * N'importe quel composant peut accéder directement aux données
 * 
 * ÉQUIVALENT VUE.JS : provide/inject, Pinia, Vuex
 */

// ========================================
// TYPES TYPESCRIPT
// ========================================

interface User {
  googleId: string;
  email: string;
  name: string;
}

interface Option {
  label: string;
  value: string;
}

/**
 * Interface complète du Context
 * 
 * BONNES PRATIQUES :
 * - Typage strict de toutes les propriétés
 * - Séparation en sections logiques
 * - Fonctions bien nommées (verbes d'action)
 */
interface AppContextType {
  // ========== AUTHENTIFICATION ==========
  authenticated: boolean;
  user: User | null;
  loginWithGoogle: () => void;
  logout: () => Promise<void>;
  
  // ========== UIDS ==========
  myUid: string;
  othersUids: string[];
  newUid: string;
  setMyUid: (uid: string) => void;
  setNewUid: (uid: string) => void;
  updateMyUid: () => Promise<void>;
  addOtherUid: () => Promise<void>;
  removeOtherUid: (uid: string) => Promise<void>;
  
  // ========== DONNÉES ==========
  uids: string[];
  playersMap: Record<string, PlayerData>;
  firstOptions: Option[];
  secondOptions: Option[];
  
  // ========== FILTRES ==========
  selectedFirst: string;
  selectedSeconds: string[];
  search: string;
  setSelectedFirst: (value: string) => void;
  setSelectedSeconds: (values: string[]) => void;
  setSearch: (value: string) => void;
  
  // ========== UI ==========
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
  message: string;
  messageType: 'success' | 'error';
  showMessage: (text: string, type: 'success' | 'error') => void;
}

/**
 * CONCEPT REACT : createContext
 * 
 * Crée le Context avec un type ou undefined
 * undefined permet de vérifier qu'on est bien dans le Provider
 */
const AppContext = createContext<AppContextType | undefined>(undefined);

// ========================================
// PROVIDER COMPONENT
// ========================================

/**
 * AppProvider : Composant qui enveloppe l'application et fournit le Context
 * 
 * CONCEPT : Provider Pattern
 * Le Provider gère tout l'état et la logique de l'application
 * Les composants enfants y accèdent via useAppContext()
 * 
 * ÉQUIVALENT VUE.JS :
 * <script setup>
 * provide('appState', { ... })
 * </script>
 */
export function AppProvider({ children }: { children: ReactNode }) {
  // ========== ÉTATS D'AUTHENTIFICATION ==========
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  
  // ========== ÉTATS DES UIDS ==========
  const [myUid, setMyUid] = useState('');
  const [othersUids, setOthersUids] = useState<string[]>([]);
  const [newUid, setNewUid] = useState('');
  
  // ========== ÉTATS DES DONNÉES ==========
  const [uids, setUids] = useState<string[]>([]);
  const [playersMap, setPlayersMap] = useState<Record<string, PlayerData>>({});
  
  // ========== ÉTATS DES FILTRES ==========
  const [selectedFirst, setSelectedFirst] = useState('');
  const [selectedSeconds, setSelectedSeconds] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  
  // ========== ÉTATS UI ==========
  const [showSettings, setShowSettings] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  /**
   * FONCTION UTILITAIRE : Afficher un message
   */
  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
    }, 5000);
  };

  /**
   * FONCTION : Vérifier l'authentification au montage
   * 
   * CONCEPT : useEffect avec dépendances vides
   * Exécuté une seule fois au montage du composant
   */
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/status', {
          credentials: 'include',
        });
        const data = await response.json();

        if (data.authenticated) {
          setAuthenticated(true);
          setUser(data.user);
          await loadUids();
          await loadPlayers();
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
      }
    };

    checkAuth();
  }, []);

  /**
   * FONCTIONS API
   */
  const loadUids = async () => {
    try {
      const response = await fetch('/api/uids', {
        credentials: 'include',
      });
      const data = await response.json();
      setMyUid(data.myUid);
      setOthersUids(data.othersUids);
    } catch (error) {
      console.error('Failed to load UIDs:', error);
      showMessage('Failed to load UIDs', 'error');
    }
  };

  const loadPlayers = async () => {
    try {
      const playersData = await fetchPlayers();
      const uidsArray = playersData.map((p) => p.value);
      setUids(uidsArray);

      const newPlayersMap: Record<string, PlayerData> = {};
      for (const uid of uidsArray) {
        try {
          const data = await fetchPlayerData(uid);
          newPlayersMap[uid] = data;
        } catch (e) {
          console.error('Player fetch failed:', e);
          newPlayersMap[uid] = { player: uid, invaders: [] };
        }
      }
      
      setPlayersMap(newPlayersMap);
    } catch (error) {
      console.error('Players loading failed:', error);
      setUids([]);
    }
  };

  const loginWithGoogle = () => {
    window.location.href = '/api/auth/google';
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      
      setAuthenticated(false);
      setUser(null);
      setMyUid('');
      setOthersUids([]);
      setShowSettings(false);
    } catch (error) {
      console.error('Logout failed:', error);
      showMessage('Logout failed', 'error');
    }
  };

  const updateMyUid = async () => {
    try {
      const response = await fetch('/api/uids/my-uid', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ uid: myUid }),
      });

      if (response.ok) {
        showMessage('UID updated successfully', 'success');
        await loadPlayers();
      } else {
        showMessage('Failed to update UID', 'error');
      }
    } catch (error) {
      console.error('UID update failed:', error);
      showMessage('Failed to update UID', 'error');
    }
  };

  const addOtherUid = async () => {
    if (!newUid.trim()) {
      showMessage('Please enter a valid UID', 'error');
      return;
    }

    try {
      const response = await fetch('/api/uids/others-uids', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ uid: newUid }),
      });

      if (response.ok) {
        const data = await response.json();
        setOthersUids(data.othersUids);
        setNewUid('');
        showMessage('UID added successfully', 'success');
        await loadPlayers();
      } else {
        showMessage('Failed to add UID', 'error');
      }
    } catch (error) {
      console.error('UID addition failed:', error);
      showMessage('Failed to add UID', 'error');
    }
  };

  const removeOtherUid = async (uid: string) => {
    try {
      const response = await fetch(`/api/uids/others-uids/${encodeURIComponent(uid)}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setOthersUids(data.othersUids);
        showMessage('UID removed successfully', 'success');
        await loadPlayers();
      } else {
        showMessage('Failed to remove UID', 'error');
      }
    } catch (error) {
      console.error('UID removal failed:', error);
      showMessage('Failed to remove UID', 'error');
    }
  };

  /**
   * CONCEPT REACT : useMemo pour les valeurs calculées
   * 
   * Options pour les dropdowns calculées depuis les données
   * Ne recalcule que si uids ou playersMap changent
   * 
   * ÉQUIVALENT VUE.JS : computed()
   */
  const firstOptions = useMemo(() => {
    return uids.map((uid) => ({
      label: playersMap[uid]?.player || uid,
      value: uid,
    }));
  }, [uids, playersMap]);

  const secondOptions = useMemo(() => {
    return uids
      .filter((uid) => uid !== selectedFirst)
      .map((uid) => ({
        label: playersMap[uid]?.player || uid,
        value: uid,
      }));
  }, [uids, playersMap, selectedFirst]);

  /**
   * CONCEPT REACT : useMemo pour optimisation du Context
   * 
   * IMPORTANT : Sans useMemo, l'objet contextValue serait recréé à chaque render
   * Cela forcerait TOUS les composants qui utilisent le Context à se re-render
   * 
   * AVEC useMemo : Seuls les composants affectés par les changements se re-rendent
   */
  const contextValue = useMemo<AppContextType>(() => ({
    authenticated,
    user,
    loginWithGoogle,
    logout,
    myUid,
    othersUids,
    newUid,
    setMyUid,
    setNewUid,
    updateMyUid,
    addOtherUid,
    removeOtherUid,
    uids,
    playersMap,
    firstOptions,
    secondOptions,
    selectedFirst,
    selectedSeconds,
    search,
    setSelectedFirst,
    setSelectedSeconds,
    setSearch,
    showSettings,
    setShowSettings,
    message,
    messageType,
    showMessage,
  }), [
    authenticated,
    user,
    myUid,
    othersUids,
    newUid,
    uids,
    playersMap,
    firstOptions,
    secondOptions,
    selectedFirst,
    selectedSeconds,
    search,
    showSettings,
    message,
    messageType,
  ]);

  /**
   * CONCEPT REACT : Provider
   * 
   * Le Provider rend le Context disponible à tous les composants enfants
   * Peu importe leur profondeur dans l'arborescence
   */
  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

// ========================================
// CUSTOM HOOK
// ========================================

/**
 * CONCEPT REACT : Custom Hook pour le Context
 * 
 * BONNES PRATIQUES :
 * - Toujours créer un hook personnalisé pour chaque Context
 * - Vérifier que le hook est utilisé dans le Provider
 * - Lancer une erreur claire si ce n'est pas le cas
 * 
 * AVANTAGES :
 * - API plus propre : useAppContext() au lieu de useContext(AppContext)
 * - Vérification automatique du Provider
 * - Auto-complétion TypeScript
 * 
 * ÉQUIVALENT VUE.JS :
 * const appState = inject('appState')
 * if (!appState) throw new Error('...')
 */
export function useAppContext() {
  const context = useContext(AppContext);
  
  if (!context) {
    throw new Error(
      'useAppContext doit être utilisé à l\'intérieur de AppProvider. ' +
      'Assurez-vous que votre composant est enveloppé dans <AppProvider>.'
    );
  }
  
  return context;
}

/**
 * NOTES PÉDAGOGIQUES :
 * 
 * 1. POURQUOI Context API ?
 *    - Évite le props drilling
 *    - Centralise la logique métier
 *    - Facilite la maintenance
 *    - Améliore la lisibilité
 * 
 * 2. QUAND UTILISER Context ?
 *    ✅ Authentification
 *    ✅ Thème (dark/light)
 *    ✅ Langue/localisation
 *    ✅ Données globales de l'app
 *    ❌ État local d'un composant
 *    ❌ Données changeant très fréquemment
 * 
 * 3. OPTIMISATIONS :
 *    - useMemo pour contextValue
 *    - useMemo pour valeurs calculées
 *    - Dépendances bien définies
 * 
 * 4. ALTERNATIVE : Multiples Contexts
 *    Pour les grandes apps, séparez en plusieurs Contexts :
 *    - AuthContext (authentification)
 *    - DataContext (données métier)
 *    - UIContext (état UI)
 * 
 * 5. COMPARAISON AVEC REDUX :
 *    Context API convient pour la plupart des apps
 *    Redux si besoin de :
 *    - Middleware complexe
 *    - DevTools avancés
 *    - Time-travel debugging
 */
