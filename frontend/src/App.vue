<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import FilterPanel from '@/molecules/FilterPanel.vue'
import DataTable from '@/atoms/DataTable.vue'
import { fetchPlayers } from '@/api/players'
import { fetchPlayerData, type PlayerData } from '@/api/spaceInvaders'

const authenticated = ref(false)
const user = ref<{ googleId: string; email: string; name: string } | null>(null)
const showSettings = ref(false)

const myUid = ref('')
const othersUids = ref<string[]>([])
const newUid = ref('')
const message = ref('')
const messageType = ref<'success' | 'error'>('success')

const uids = ref<string[]>([])
const playersMap = ref<Record<string, PlayerData>>({})

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
      await loadPlayers()
    }
  } catch (error) {
    console.error('Authentication check failed:', error)
  }
}

const loadUids = async () => {
  try {
    const response = await fetch('/api/uids', {
      credentials: 'include'
    })
    const data = await response.json()
    myUid.value = data.myUid
    othersUids.value = data.othersUids
  } catch (error) {
    console.error('Failed to load UIDs:', error)
    showMessage('Failed to load UIDs', 'error')
  }
}

const loginWithGoogle = () => {
  window.location.href = '/api/auth/google'
}

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
    console.error('Logout failed:', error)
    showMessage('Logout failed', 'error')
  }
}

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
      showMessage('UID updated successfully', 'success')
      await loadPlayers()
    } else {
      showMessage('Failed to update UID', 'error')
    }
  } catch (error) {
    console.error('UID update failed:', error)
    showMessage('Failed to update UID', 'error')
  }
}

const addOtherUid = async () => {
  if (!newUid.value.trim()) {
    showMessage('Please enter a valid UID', 'error')
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
      showMessage('UID added successfully', 'success')
      await loadPlayers()
    } else {
      showMessage('Failed to add UID', 'error')
    }
  } catch (error) {
    console.error('UID addition failed:', error)
    showMessage('Failed to add UID', 'error')
  }
}

const removeOtherUid = async (uid: string) => {
  try {
    const response = await fetch(`/api/uids/others-uids/${encodeURIComponent(uid)}`, {
      method: 'DELETE',
      credentials: 'include'
    })

    if (response.ok) {
      const data = await response.json()
      othersUids.value = data.othersUids
      showMessage('UID removed successfully', 'success')
      await loadPlayers()
    } else {
      showMessage('Failed to remove UID', 'error')
    }
  } catch (error) {
    console.error('UID removal failed:', error)
    showMessage('Failed to remove UID', 'error')
  }
}

const showMessage = (text: string, type: 'success' | 'error') => {
  message.value = text
  messageType.value = type
  setTimeout(() => {
    message.value = ''
  }, 5000)
}

const loadPlayers = async () => {
  try {
    const playersData = await fetchPlayers()
    uids.value = playersData.map(p => p.value)

    for (const uid of uids.value) {
      try {
        const data = await fetchPlayerData(uid)
        playersMap.value[uid] = data
      } catch (e) {
        console.error('Player fetch failed:', e)
        playersMap.value[uid] = { player: uid, invaders: [] }
      }
    }
  } catch (error) {
    console.error('Players loading failed:', error)
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
    <header class="app-header">
      <h1>Invader Comparator</h1>
      <div class="auth-section">
        <button v-if="!authenticated" @click="loginWithGoogle" class="btn btn-primary">
          Sign in with Google
        </button>
        <div v-else class="user-menu">
          <span class="user-name">{{ user?.name }}</span>
          <button @click="showSettings = !showSettings" class="btn btn-secondary">
            Settings
          </button>
          <button @click="logout" class="btn btn-secondary">
            Logout
          </button>
        </div>
      </div>
    </header>

    <div v-if="message" :class="messageType" class="message">
      {{ message }}
    </div>

    <div v-if="showSettings" class="settings-overlay" @click="showSettings = false">
      <div class="settings-panel" @click.stop>
        <div class="settings-header">
          <h2>UID Settings</h2>
          <button @click="showSettings = false" class="close-btn">×</button>
        </div>

        <div class="settings-section">
          <h3>My UID</h3>
          <div class="form-group">
            <input
              v-model="myUid"
              type="text"
              class="form-control"
              placeholder="627F176F-54C3-4D32-90EF-C4C80462A2C3"
            />
          </div>
          <button @click="updateMyUid" class="btn btn-primary">
            Save my UID
          </button>
        </div>

        <div class="settings-section">
          <h3>Other players UIDs</h3>

          <div v-if="othersUids.length > 0" class="uids-list">
            <div v-for="uid in othersUids" :key="uid" class="uid-item">
              <span class="uid-text">{{ uid }}</span>
              <button @click="removeOtherUid(uid)" class="btn btn-danger btn-small">
                Remove
              </button>
            </div>
          </div>
          <p v-else class="no-uids">No UIDs registered</p>

          <div class="add-uid-form">
            <input
              v-model="newUid"
              type="text"
              class="form-control"
              placeholder="FAFDC163-BD97-4372-A647-1A063028E579"
              @keyup.enter="addOtherUid"
            />
            <button @click="addOtherUid" class="btn btn-primary">
              Add
            </button>
          </div>
        </div>
      </div>
    </div>

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
