<script setup lang="ts">
defineProps<{
  gridImage: Array<Array<any>>
}>()
</script>

<template>
  <div class="flex items-center justify-center space-x-6 lg:space-x-8">
    <div v-for="(column, keyGrid) in gridImage" :key="keyGrid" class="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
      <slot v-for="(item, keyColumn) in column" :key="keyColumn" :item="item"/>
    </div>
  </div>
</template>
