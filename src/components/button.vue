<script setup>
defineProps({
  label: {
    type: String,
    required: true
  },
  action: {
    type: Function,
    required: true
  }
})
</script>

<template>
  <button @click="action">
    {{ label }}
  </button>
</template>
