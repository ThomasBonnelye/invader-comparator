<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    required: true
  },
  placeholder: {
    type: String,
    default: 'Rechercher...'
  }
})

const emit = defineEmits(['update:modelValue'])

function onInput(event) {
  emit('update:modelValue', event.target.value)
}
</script>

<template>
  <input 
    type="text" 
    :placeholder="placeholder"
    :value="modelValue"
    @input="onInput"
  />
</template>
