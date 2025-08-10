<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { fetchPlayerData, type PlayerData } from '@/api/spaceInvaders'
import { compareInvaders } from '@/api/compareInvaders'

const props = defineProps<{
  firstFilter: string
  secondFilters: string[]
  search: string
}>()

// cache par UID
const cache = ref<Record<string, PlayerData>>({})

const rows = ref<Record<string, string[]>>({})
const columnHeaders = ref<string[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

async function ensurePlayer(uid: string) {
  if (!uid) return
  if (!cache.value[uid]) {
    try {
      const data = await fetchPlayerData(uid)
      cache.value[uid] = data
    } catch (e) {
      console.error('fetch error', e)
      cache.value[uid] = { player: uid, invaders: [] } // fallback
    }
  }
}

watch(
  () => [props.firstFilter, props.secondFilters],
  async ([first, seconds]) => {
    rows.value = {}
    columnHeaders.value = []
    error.value = null

    if (!first || !seconds || seconds.length === 0) {
      return
    }

    loading.value = true
    try {
      await ensurePlayer(first)
      for (const uid of seconds) {
        await ensurePlayer(uid)
      }

      const refData = cache.value[first]
      if (!refData) {
        throw new Error('Impossible de récupérer les données du joueur principal')
      }

      const others: Record<string, string[]> = {}
      for (const uid of seconds) {
        const p = cache.value[uid]
        if (!p) continue
        const playerName = p.player || uid
        others[playerName] = p.invaders || []
      }

      columnHeaders.value = Object.keys(others)
      rows.value = compareInvaders(refData.invaders || [], others)
    } catch (e: any) {
      console.error(e)
      error.value = e?.message || 'Erreur'
      rows.value = {}
      columnHeaders.value = []
    } finally {
      loading.value = false
    }
  },
  { immediate: true }
)

const filteredRows = computed(() => {
  if (!props.search) return rows.value

  const filtered: Record<string, string[]> = {}
  const s = props.search.toLowerCase()
  for (const [playerName, invs] of Object.entries(rows.value)) {
    filtered[playerName] = (invs || []).filter(i => i.toLowerCase().includes(s))
  }
  return filtered
})

const maxRows = computed(() => {
  const lengths = Object.values(filteredRows.value).map(arr => arr.length || 0)
  return lengths.length ? Math.max(...lengths) : 0
})
</script>

<template>
  <div>
    <div v-if="error" style="color: red">{{ error }}</div>
    <div v-if="loading">Chargement...</div>

    <table v-else-if="columnHeaders.length && maxRows > 0" cellpadding="6">
      <thead>
        <tr>
          <th v-for="col in columnHeaders" :key="col">{{ col }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="i in maxRows" :key="i">
          <td v-for="col in columnHeaders" :key="col + '-' + i">
            {{ filteredRows[col]?.[i - 1] || '' }}
          </td>
        </tr>
      </tbody>
    </table>

    <p v-else>Aucune donnée à afficher.</p>
  </div>
</template>
