<script setup lang="ts">
defineProps<{
  items: Array<any>
}>()
</script>

<template>
  <div class="bg-white">
    <div class="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
      <div class="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
        <a v-for="(item, key) in items" :key="key" :href="item.href" class="group">
          <div class="aspect-h-1 aspect-w-1 w-full h-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
            <slot :item="item"/>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>