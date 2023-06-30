<script setup lang="ts">
export type ILink = string
defineProps<{
  link: ILink
}>()
</script>

<template>
  <RouterLink :to="link">
    <slot></slot>
  </RouterLink>
</template>

<style scoped>

</style>