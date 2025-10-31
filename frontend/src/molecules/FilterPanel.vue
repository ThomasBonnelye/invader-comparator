<script setup lang="ts">
import BaseDropdown from '../atoms/BaseDropdown.vue'
import SearchBar from '../atoms/SearchBar.vue'

defineProps<{
  firstOptions: { label: string; value: string }[]
  secondOptions: { label: string; value: string }[]
  selectedFirst: string
  selectedSeconds: string[]
  search: string
}>()

const emit = defineEmits<{
  'update:first': [value: string]
  'update:seconds': [values: string[]]
  'update:search': [value: string]
}>()

function onFirstChange(value: string | string[]) {
  if (typeof value === 'string') {
    emit('update:first', value)
    emit('update:seconds', []) // reset second selection
  }
}

function onSecondChange(value: string | string[]) {
  if (Array.isArray(value)) {
    emit('update:seconds', value)
  }
}

function onSearchChange(value: string) {
  emit('update:search', value)
}
</script>

<template>
  <div>
    <BaseDropdown
      :options="firstOptions"
      :modelValue="selectedFirst"
      @update:modelValue="onFirstChange"
      :multiple="false"
    />

    <BaseDropdown
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
