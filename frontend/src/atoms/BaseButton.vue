<script setup lang="ts">
interface Props {
  label: string
  action: () => void
}

defineProps<Props>()
</script>

<template>
  <button @click="action">
    {{ label }}
  </button>
</template>
