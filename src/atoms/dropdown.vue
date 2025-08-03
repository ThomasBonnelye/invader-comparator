<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  options: {
    type: Array,
    required: true
  },
  modelValue: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

const selected = ref([...props.modelValue])

watch(selected, (newVal) => {
  emit('update:modelValue', newVal)
})
</script>

<template>
  <select multiple v-model="selected">
    <option 
      v-for="option in options" 
      :key="option.value" 
      :value="option.value"
    >
      {{ option.label }}
    </option>
  </select>
</template>
