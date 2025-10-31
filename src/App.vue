<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import FilterPanel from '@/molecules/FilterPanel.vue'
import DataTable from '@/atoms/DataTable.vue'
import { players } from '@/api/players'
import { fetchPlayerData, type PlayerData } from '@/api/spaceInvaders'

const uids = players.map(p => p.value)

// map uid => PlayerData (nom + invaders)
const playersMap = ref<Record<string, PlayerData>>({})

onMounted(async () => {
  for (const uid of uids) {
    try {
      const data = await fetchPlayerData(uid)
      playersMap.value[uid] = data
    } catch (e) {
      console.error('fetch player onMounted', e)
      playersMap.value[uid] = { player: uid, invaders: [] }
    }
  }
})

const firstOptions = computed(() =>
  uids.map(uid => ({
    label: playersMap.value[uid]?.player || uid,
    value: uid
  }))
)

const selectedFirst = ref('')
const selectedSeconds = ref<string[]>([])
const search = ref('')

const secondOptions = computed(() =>
  uids
    .filter(uid => uid !== selectedFirst.value)
    .map(uid => ({
      label: playersMap.value[uid]?.player || uid,
      value: uid
    }))
)
</script>

<template>
  <div>
    <h1>Comparatif Invaders</h1>

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
  </div>
</template>
