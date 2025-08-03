<script setup>
import SearchBar from '@/atoms/searchbar.vue'
import Dropdown from '@/atoms/dropdown.vue'

const props = defineProps({
  firstOptions: {
    type: Array,
    required: true
  },
  secondOptions: {
    type: Array,
    required: true
  },
  selectedFirst: String,
  selectedSeconds: Array,
  search: String
})

const emit = defineEmits(['update:first', 'update:seconds', 'update:search'])

function onFirstChange(value) {
  emit('update:first', value)
  emit('update:seconds', []) // reset second selection
}

function onSecondChange(values) {
  emit('update:seconds', values)
}

function onSearchChange(value) {
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
  :options="secondOptions.filter(opt => opt.value !== selectedFirst)" 
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
