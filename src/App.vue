<script setup>
import { ref } from 'vue'
import Filters from '@/molecules/filters.vue'
import Table from '@/atoms/table.vue'

// This is a mock data structure for demonstration purposes
const allData = ref([
  { id: 1, category: 'A', tag: 'X', value: 'Alpha' },
  { id: 2, category: 'A', tag: 'Y', value: 'Beta' },
  { id: 3, category: 'A', tag: 'Y', value: 'Bingo' },
  { id: 4, category: 'A', tag: 'Z', value: 'Zebra' },
  { id: 5, category: 'A', tag: 'Z', value: 'Zoom' },
  { id: 6, category: 'B', tag: 'Y', value: 'Gamma' }
])

const firstOptions = [
  { label: 'Cat A', value: 'A' },
  { label: 'Cat B', value: 'B' }
]

const secondOptions = [
  { label: 'Tag X', value: 'X' },
  { label: 'Tag Y', value: 'Y' },
  { label: 'Tag Z', value: 'Z' }
]

const selectedFirst = ref('')
const selectedSeconds = ref([])
const search = ref('')
</script>

<template>
  <Filters
    :firstOptions="firstOptions"
    :secondOptions="secondOptions"
    :selectedFirst="selectedFirst"
    :selectedSeconds="selectedSeconds"
    :search="search"
    @update:first="selectedFirst = $event"
    @update:seconds="selectedSeconds = $event"
    @update:search="search = $event"
  />

  <Table
    :firstFilter="selectedFirst"
    :secondFilters="selectedSeconds"
    :search="search"
    :data="allData"
  />
</template>
