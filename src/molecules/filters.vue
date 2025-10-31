<script setup lang="ts">
import Dropdown from '../atoms/dropdown.vue'
import SearchBar from '../atoms/searchbar.vue'

defineProps<{
  firstOptions: { label: string; value: string }[]
  secondOptions: { label: string; value: string }[]
  selectedFirst: string
  selectedSeconds: string[]
  search: string
}>()

const emit = defineEmits(['update:first', 'update:seconds', 'update:search'])

function onFirstChange(value: string) {
  emit('update:first', value)
  emit('update:seconds', []) // reset second selection
}

function onSecondChange(values: string[]) {
  emit('update:seconds', values)
}

function onSearchChange(value: string) {
  emit('update:search', value)
}
</script>

<template>
  <div>
    <Dropdown
      :options="firstOptions"
      :modelValue="selectedFirst"
      @update:modelValue="onFirstChange"
      :multiple="false"
    />

    <Dropdown
      :options="secondOptions"
      :modelValue="selectedSeconds"
      @update:modelValue="onSecondChange"
      :multiple="true"
      :disabled="!selectedFirst"
    />

    <SearchBar
      :modelValue="search"
      @update:modelValue="onSearchChange"
      placeholder="Recherche..."
    />
  </div>
</template>
