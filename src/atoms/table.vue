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

  return props.secondFilters.map(second => {
    return {
      tag: second,
      rows: props.data.filter(row => 
        row.category === props.firstFilter &&
        row.tag === second &&
        row.value.toLowerCase().includes(props.search.toLowerCase())
      )
    }
  })
})
</script>

<template>
  <table v-if="filteredData.length">
    <thead>
      <tr>
        <th v-for="col in filteredData" :key="col.tag">
          {{ col.tag }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="rowIndex in Math.max(...filteredData.map(col => col.rows.length))" :key="rowIndex">
        <td v-for="col in filteredData" :key="col.tag + '-' + rowIndex">
          {{ col.rows[rowIndex - 1]?.value || '' }}
        </td>
      </tr>
    </tbody>
  </table>
</template>
