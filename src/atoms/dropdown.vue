<script setup>
const props = defineProps({
  options: Array,
  modelValue: [String, Array],
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

function onInput(event) {
  const selected = props.multiple
    ? Array.from(event.target.selectedOptions).map(o => o.value)
    : event.target.value

  emit('update:modelValue', selected)
}
</script>

<template>
  <select
    :multiple="multiple"
    :value="modelValue"
    :disabled="disabled"
    @change="onInput"
  >
    <option 
      v-for="option in options" 
      :key="option.value" 
      :value="option.value"
    >
      {{ option.label }}
    </option>
  </select>
</template>
