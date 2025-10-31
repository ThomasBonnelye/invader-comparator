<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import BaseButton from '@/atoms/BaseButton.vue'

const props = defineProps({
  options: {
    type: Array,
    required: true
  },
  modelValue: {
    type: [String, Array],
    required: true
  },
  multiple: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const dropdownRef = ref(null)

function toggleDropdown() {
  if (!props.disabled) {
    isOpen.value = !isOpen.value
  }
}

function selectOption(option) {
  if (props.multiple) {
    const current = Array.isArray(props.modelValue) ? [...props.modelValue] : []
    const index = current.indexOf(option.value)
    if (index === -1) {
      current.push(option.value)
    } else {
      current.splice(index, 1)
    }
    emit('update:modelValue', current)
  } else {
    emit('update:modelValue', option.value)
    isOpen.value = false
  }
}

function isSelected(option) {
  if (props.multiple) {
    return Array.isArray(props.modelValue) && props.modelValue.includes(option.value)
  }
  return props.modelValue === option.value
}

const buttonLabel = computed(() => {
  if (props.multiple) {
    const labels = props.options
      .filter(opt => props.modelValue.includes(opt.value))
      .map(opt => opt.label)
    return labels.length > 0 ? labels.join(', ') : 'Sélectionner...'
  } else {
    const found = props.options.find(opt => opt.value === props.modelValue)
    return found?.label || 'Sélectionner...'
  }
})

// Fermeture en cliquant dehors
function handleClickOutside(event) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div ref="dropdownRef" style="position: relative;">
    <BaseButton
      :label="buttonLabel"
      :action="toggleDropdown"
      :disabled="disabled"
    />

    <div v-if="isOpen" style="position: absolute; background: white; border: 1px solid #ccc; margin-top: 2px; z-index: 10;">
      <div
        v-for="option in options"
        :key="option.value"
        @click="selectOption(option)"
        :style="{
          padding: '6px 10px',
          cursor: 'pointer',
          backgroundColor: isSelected(option) ? '#eee' : 'white'
        }"
      >
        {{ option.label }}
      </div>
    </div>
  </div>
</template>
