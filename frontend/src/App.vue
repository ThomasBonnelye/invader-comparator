<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import FilterPanel from '@/molecules/FilterPanel.vue'
import DataTable from '@/atoms/DataTable.vue'
import { fetchPlayers } from '@/api/players'
import { fetchPlayerData, type PlayerData } from '@/api/spaceInvaders'

// Authentification
const authenticated = ref(false)
const user = ref<{ googleId: string; email: string; name: string } | null>(null)
const showSettings = ref(false)

// Gestion des UIDs
const myUid = ref('')
const othersUids = ref<string[]>([])
const newUid = ref('')
const message = ref('')
const messageType = ref<'success' | 'error'>('success')

// Liste des UIDs chargés depuis l'API
const uids = ref<string[]>([])

// map uid => PlayerData (nom + invaders)
const playersMap = ref<Record<string, PlayerData>>({})

// Vérifier l'authentification au démarrage
const checkAuth = async () => {
  try {
    const response = await fetch('/api/auth/status', {
      credentials: 'include'
    })
    const data = await response.json()

    if (data.authenticated) {
      authenticated.value = true
      user.value = data.user
      await loadUids()
      await loadPlayers() // Charger les données seulement si connecté
    }
  } catch (error) {
    console.error('Authentication check failed:', error)
  }
}

// Charger les UIDs de l'utilisateur
const loadUids = async () => {
  try {
    const response = await fetch('/api/uids', {
      credentials: 'include'
    })
    const data = await response.json()
    myUid.value = data.myUid
    othersUids.value = data.othersUids
  } catch (error) {
    console.error('Erreur lors du chargement des UIDs:', error)
    showMessage('Erreur lors du chargement des UIDs', 'error')
  }
}

// Connexion Google
const loginWithGoogle = () => {
  window.location.href = '/api/auth/google'
}

// Déconnexion
const logout = async () => {
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include'
    })
    authenticated.value = false
    user.value = null
    myUid.value = ''
    othersUids.value = []
    showSettings.value = false
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error)
    showMessage('Erreur lors de la déconnexion', 'error')
  }
}

// Mettre à jour mon UID
const updateMyUid = async () => {
  try {
    const response = await fetch('/api/uids/my-uid', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ uid: myUid.value })
    })

    if (response.ok) {
      showMessage('Votre UID a été mis à jour avec succès', 'success')
      await loadPlayers() // Recharger les données des joueurs
    } else {
      showMessage('Erreur lors de la mise à jour de l\'UID', 'error')
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'UID:', error)
    showMessage('Erreur lors de la mise à jour de l\'UID', 'error')
  }
}

// Ajouter un UID aux autres
const addOtherUid = async () => {
  if (!newUid.value.trim()) {
    showMessage('Veuillez entrer un UID valide', 'error')
    return
  }

  try {
    const response = await fetch('/api/uids/others-uids', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ uid: newUid.value })
    })

    if (response.ok) {
      const data = await response.json()
      othersUids.value = data.othersUids
      newUid.value = ''
      showMessage('UID ajouté avec succès', 'success')
      await loadPlayers() // Recharger les données des joueurs
    } else {
      showMessage('Erreur lors de l\'ajout de l\'UID', 'error')
    }
  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'UID:', error)
    showMessage('Erreur lors de l\'ajout de l\'UID', 'error')
  }
}

// Supprimer un UID des autres
const removeOtherUid = async (uid: string) => {
  try {
    const response = await fetch(`/api/uids/others-uids/${encodeURIComponent(uid)}`, {
      method: 'DELETE',
      credentials: 'include'
    })

    if (response.ok) {
      const data = await response.json()
      othersUids.value = data.othersUids
      showMessage('UID supprimé avec succès', 'success')
      await loadPlayers() // Recharger les données des joueurs
    } else {
      showMessage('Erreur lors de la suppression de l\'UID', 'error')
    }
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'UID:', error)
    showMessage('Erreur lors de la suppression de l\'UID', 'error')
  }
}

// Afficher un message
const showMessage = (text: string, type: 'success' | 'error') => {
  message.value = text
  messageType.value = type
  setTimeout(() => {
    message.value = ''
  }, 5000)
}

// Charger les données des joueurs
const loadPlayers = async () => {
  try {
    // Charger les UIDs depuis l'API backend
    const playersData = await fetchPlayers()
    uids.value = playersData.map(p => p.value)

    // Charger les données de chaque joueur
    for (const uid of uids.value) {
      try {
        const data = await fetchPlayerData(uid)
        playersMap.value[uid] = data
      } catch (e) {
        console.error('fetch player loadPlayers', e)
        playersMap.value[uid] = { player: uid, invaders: [] }
      }
    }
  } catch (error) {
    console.error('Erreur lors du chargement des UIDs:', error)
    // Fallback vers les données par défaut si l'API n'est pas disponible
    uids.value = []
  }
}

onMounted(async () => {
  await checkAuth()
})

const firstOptions = computed(() =>
  uids.value.map(uid => ({
    label: playersMap.value[uid]?.player || uid,
    value: uid
  }))
)

const selectedFirst = ref('')
const selectedSeconds = ref<string[]>([])
const search = ref('')

const secondOptions = computed(() =>
  uids.value
    .filter(uid => uid !== selectedFirst.value)
    .map(uid => ({
      label: playersMap.value[uid]?.player || uid,
      value: uid
    }))
)
</script>

<template>
  <div id="app">
    <!-- Header avec bouton de connexion -->
    <header class="app-header">
      <h1>Comparatif Invaders</h1>
      <div class="auth-section">
        <button v-if="!authenticated" @click="loginWithGoogle" class="btn btn-primary">
          Se connecter avec Google
        </button>
        <div v-else class="user-menu">
          <span class="user-name">{{ user?.name }}</span>
          <button @click="showSettings = !showSettings" class="btn btn-secondary">
            Paramètres
          </button>
          <button @click="logout" class="btn btn-secondary">
            Déconnexion
          </button>
        </div>
      </div>
    </header>

    <!-- Message de feedback -->
    <div v-if="message" :class="messageType" class="message">
      {{ message }}
    </div>

    <!-- Menu latéral des paramètres -->
    <div v-if="showSettings" class="settings-overlay" @click="showSettings = false">
      <div class="settings-panel" @click.stop>
        <div class="settings-header">
          <h2>Paramètres des UIDs</h2>
          <button @click="showSettings = false" class="close-btn">×</button>
        </div>

        <!-- Mon UID -->
        <div class="settings-section">
          <h3>Mon UID</h3>
          <div class="form-group">
            <input
              v-model="myUid"
              type="text"
              class="form-control"
              placeholder="627F176F-54C3-4D32-90EF-C4C80462A2C3"
            />
          </div>
          <button @click="updateMyUid" class="btn btn-primary">
            Enregistrer mon UID
          </button>
        </div>

        <!-- UIDs des autres -->
        <div class="settings-section">
          <h3>UIDs des autres joueurs</h3>

          <!-- Liste des UIDs -->
          <div v-if="othersUids.length > 0" class="uids-list">
            <div v-for="uid in othersUids" :key="uid" class="uid-item">
              <span class="uid-text">{{ uid }}</span>
              <button @click="removeOtherUid(uid)" class="btn btn-danger btn-small">
                Supprimer
              </button>
            </div>
          </div>
          <p v-else class="no-uids">Aucun UID enregistré</p>

          <!-- Formulaire d'ajout -->
          <div class="add-uid-form">
            <input
              v-model="newUid"
              type="text"
              class="form-control"
              placeholder="FAFDC163-BD97-4372-A647-1A063028E579"
              @keyup.enter="addOtherUid"
            />
            <button @click="addOtherUid" class="btn btn-primary">
              Ajouter
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenu principal -->
    <main class="main-content">
      <FilterPanel
        :firstOptions="firstOptions"
        :secondOptions="secondOptions"
        :selectedFirst="selectedFirst"
        :selectedSeconds="selectedSeconds"
        :search="search"
        @update:first="selectedFirst = $event"
        @update:seconds="selectedSeconds = $event"
        @update:search="search = $event"
      />

      <DataTable
        :firstFilter="selectedFirst"
        :secondFilters="selectedSeconds"
        :search="search"
      />
    </main>
  </div>
</template>
