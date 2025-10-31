<script setup lang="ts">
interface Props {
  modelValue: string
  placeholder?: string
}

withDefaults(defineProps<Props>(), {
  placeholder: 'Rechercher...'
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <input
    type="text"
    :placeholder="$props.placeholder"
    :value="$props.modelValue"
    @input="onInput"
  />
</template>
