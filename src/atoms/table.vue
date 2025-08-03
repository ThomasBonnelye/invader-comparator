<script setup>
import { computed } from 'vue'

const props = defineProps({
  firstFilter: {
    type: String,
    required: true
  },
  secondFilters: {
    type: Array,
    required: true
  },
  search: {
    type: String,
    required: true
  },
  data: {
    type: Array,
    required: true
  }
})

const filteredData = computed(() => {
  if (!props.firstFilter || props.secondFilters.length === 0) return []

  return props.secondFilters.map(tag => {
    const rows = props.data.filter(row =>
      row.category === props.firstFilter &&
      row.tag === tag &&
      row.value.toLowerCase().includes(props.search.toLowerCase())
    )
    return {
      tag,
      rows
    }
  })
})

// Détermine le nombre max de lignes pour la table
const maxRowCount = computed(() =>
  Math.max(...filteredData.value.map(col => col.rows.length), 0)
)
</script>

<template>
  <table v-if="filteredData.length && maxRowCount > 0">
    <thead>
      <tr>
        <th v-for="col in filteredData" :key="col.tag">
          {{ col.tag }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="i in maxRowCount" :key="i">
        <td v-for="col in filteredData" :key="col.tag + '-' + i">
          {{ col.rows[i - 1]?.value || '' }}
        </td>
      </tr>
    </tbody>
  </table>

  <p v-else>Aucune donnée à afficher.</p>
</template>
