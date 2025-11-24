// ========================================
// COMPOSANT PRINCIPAL - App
// ========================================
// NIVEAU : ⭐⭐⭐⭐ EXPERT
// CONCEPTS : Architecture complète, gestion d'état globale, effets multiples, authentification
// ========================================

import React, { useState, useEffect, useMemo } from 'react';
import FilterPanel from './molecules/FilterPanel';
import DataTable from './atoms/DataTable';
import { fetchPlayers } from './api/players';
import { fetchPlayerData, type PlayerData } from './api/spaceInvaders';
import './style.css';

/**
 * CONCEPT REACT : Composant racine de l'application
 * 
 * Ce composant orchestre toute l'application :
 * - Gère l'authentification
 * - Charge les données des joueurs
 * - Coordonne les composants enfants
 * - Gère les messages de succès/erreur
 * 
 * ÉQUIVALENT VUE.JS : App.vue (composant racine)
 * 
 * ARCHITECTURE :
 * App
 * ├── Header (auth, settings)
 * ├── Messages (success/error)
 * ├── Settings Panel (modal latéral)
 * └── Main Content
 *     ├── FilterPanel
 *     └── DataTable
 */

/**
 * Interface pour les données utilisateur
 */
interface User {
  googleId: string;
  email: string;
  name: string;
}

function App() {
  /**
   * CONCEPT REACT : Organisation des états
   * 
   * On groupe les états par fonctionnalité :
   * - Authentification
   * - UIDs
   * - Données de joueurs
   * - Filtres
   * - UI (messages, settings)
   */
  
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
   * CONCEPT REACT : Fonction utilitaire pour afficher des messages
   * 
   * Affiche un message temporaire pendant 5 secondes
   * Pattern commun pour les notifications
   */
  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage(text);
    setMessageType(type);
    
    // Efface le message après 5 secondes
    setTimeout(() => {
      setMessage('');
    }, 5000);
  };

  /**
   * CONCEPT REACT : useEffect pour vérification d'authentification au montage
   * 
   * ÉQUIVALENT VUE.JS : onMounted(async () => { await checkAuth(); })
   * 
   * [] en dépendances = exécuté une seule fois au montage
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
          // Charge les UIDs et les joueurs après authentification
          await loadUids();
          await loadPlayers();
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
      }
    };

    checkAuth();
  }, []); // Dépendances vides = exécuté une seule fois

  /**
   * CONCEPT REACT : Fonctions asynchrones pour les appels API
   * 
   * Ces fonctions sont définies dans le corps du composant
   * Elles peuvent accéder à l'état et le modifier
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

      // Charge les données de chaque joueur
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

  /**
   * CONCEPT REACT : Handlers pour les actions utilisateur
   * 
   * Ces fonctions sont appelées lors des interactions avec l'UI
   */
  
  const loginWithGoogle = () => {
    window.location.href = '/api/auth/google';
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      
      // Réinitialise tous les états
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
   * CONCEPT REACT : useMemo pour calculs dérivés
   * 
   * Crée les options pour les dropdowns à partir des données de joueurs
   * Ne recalcule que si uids ou playersMap changent
   * 
   * ÉQUIVALENT VUE.JS : computed(() => ...)
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
   * CONCEPT REACT : JSX et rendu conditionnel
   * 
   * Le return contient tout le JSX du composant
   * On utilise des conditions pour afficher différents éléments
   */
  return (
    <div id="app">
      {/* ========== HEADER ========== */}
      <header className="app-header">
        <h1>Invader Comparator</h1>
        <div className="auth-section">
          {!authenticated ? (
            <button onClick={loginWithGoogle} className="btn btn-primary">
              Sign in with Google
            </button>
          ) : (
            <div className="user-menu">
              <span className="user-name">{user?.name}</span>
              <button onClick={() => setShowSettings(!showSettings)} className="btn btn-secondary">
                Settings
              </button>
              <button onClick={logout} className="btn btn-secondary">
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* ========== MESSAGES ========== */}
      {message && (
        <div className={`message ${messageType}`}>
          {message}
        </div>
      )}

      {/* ========== SETTINGS PANEL ========== */}
      {showSettings && (
        <div className="settings-overlay" onClick={() => setShowSettings(false)}>
          <div className="settings-panel" onClick={(e) => e.stopPropagation()}>
            <div className="settings-header">
              <h2>UID Settings</h2>
              <button onClick={() => setShowSettings(false)} className="close-btn">
                ×
              </button>
            </div>

            {/* My UID Section */}
            <div className="settings-section">
              <h3>My UID</h3>
              <div className="form-group">
                <input
                  value={myUid}
                  onChange={(e) => setMyUid(e.target.value)}
                  type="text"
                  className="form-control"
                  placeholder="627F176F-54C3-4D32-90EF-C4C80462A2C3"
                />
              </div>
              <button onClick={updateMyUid} className="btn btn-primary">
                Save my UID
              </button>
            </div>

            {/* Others UIDs Section */}
            <div className="settings-section">
              <h3>Other players UIDs</h3>

              {othersUids.length > 0 ? (
                <div className="uids-list">
                  {othersUids.map((uid) => (
                    <div key={uid} className="uid-item">
                      <span className="uid-text">{uid}</span>
                      <button onClick={() => removeOtherUid(uid)} className="btn btn-danger btn-small">
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-uids">No UIDs registered</p>
              )}

              <div className="add-uid-form">
                <input
                  value={newUid}
                  onChange={(e) => setNewUid(e.target.value)}
                  type="text"
                  className="form-control"
                  placeholder="FAFDC163-BD97-4372-A647-1A063028E579"
                  onKeyUp={(e) => {
                    if (e.key === 'Enter') {
                      addOtherUid();
                    }
                  }}
                />
                <button onClick={addOtherUid} className="btn btn-primary">
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========== MAIN CONTENT ========== */}
      <main className="main-content">
        <FilterPanel
          firstOptions={firstOptions}
          secondOptions={secondOptions}
          selectedFirst={selectedFirst}
          selectedSeconds={selectedSeconds}
          search={search}
          onFirstChange={setSelectedFirst}
          onSecondsChange={setSelectedSeconds}
          onSearchChange={setSearch}
        />

        <DataTable
          firstFilter={selectedFirst}
          secondFilters={selectedSeconds}
          search={search}
        />
      </main>
    </div>
  );
}

export default App;

/**
 * NOTES PÉDAGOGIQUES FINALES :
 * 
 * 1. ORGANISATION DU COMPOSANT :
 *    - États groupés par fonctionnalité
 *    - Fonctions utilitaires
 *    - useEffect pour le montage
 *    - Fonctions async pour les API
 *    - Handlers pour les événements
 *    - useMemo pour les calculs
 *    - JSX au return
 * 
 * 2. GESTION D'ÉTAT :
 *    - useState pour chaque état indépendant
 *    - Pas de state management externe (Redux, etc.)
 *    - Props drilling vers les composants enfants
 *    - Callbacks pour remonter les événements
 * 
 * 3. EFFETS DE BORD :
 *    - useEffect pour checkAuth au montage
 *    - Appels API dans des fonctions async
 *    - Gestion d'erreurs avec try/catch
 * 
 * 4. OPTIMISATIONS :
 *    - useMemo pour firstOptions et secondOptions
 *    - Évite de recalculer à chaque render
 *    - Important si beaucoup de joueurs
 * 
 * 5. PATTERNS REACT :
 *    - Controlled components partout
 *    - Lifting state up (état dans App)
 *    - Composition de composants
 *    - Single source of truth
 * 
 * 6. DIFFÉRENCES MAJEURES VUE → REACT :
 *    
 *    VUE.JS :
 *    - v-model pour two-way binding
 *    - @click pour les événements
 *    - ref() pour l'état
 *    - computed() pour les valeurs calculées
 *    - watch() / onMounted() pour les effets
 *    - emit() pour remonter les événements
 *    
 *    REACT :
 *    - value + onChange pour two-way binding
 *    - onClick pour les événements
 *    - useState() pour l'état
 *    - useMemo() pour les valeurs calculées
 *    - useEffect() pour les effets
 *    - Callbacks pour remonter les événements
 * 
 * 7. AMÉLIORATIONS POSSIBLES :
 *    - Context API pour éviter le props drilling
 *    - Custom hooks pour extraire la logique
 *    - React Query pour le cache des données
 *    - Error Boundaries pour la gestion d'erreurs
 *    - Suspense pour le chargement
 *    - Code splitting pour les performances
 */
