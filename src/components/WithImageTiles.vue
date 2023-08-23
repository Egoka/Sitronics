<script setup lang="ts">
defineProps<{
  title: string,
  subtitle?: string,
  button?: {
    name:string
    link?:string
    class?:string
  }
}>()
</script>

<template>
  <div class="relative overflow-hidden bg-white dark:bg-black h-screen">
    <div class="pb-80 pt-16 sm:pb-40 sm:pt-24 lg:pb-48 lg:pt-40">
      <div class="relative mx-auto max-w-7xl px-4 sm:static sm:px-6 lg:px-8">
        <div class="sm:max-w-lg">
          <h1 class="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-500 sm:text-6xl" v-html="title"/>
          <p class="mt-4 text-xl text-gray-500">{{ subtitle }}</p>
        </div>
        <div>
          <div class="mt-10">
            <!-- Decorative image grid -->
            <div aria-hidden="true" class="pointer-events-none lg:absolute lg:inset-y-0 lg:mx-auto lg:w-full lg:max-w-7xl">
              <div class="absolute transform top-80 left-1/2 -translate-x-1/2 sm:left-1/2 sm:top-0 sm:translate-y-1/2 sm:-translate-x-8 lg:left-1/2 lg:top-1/2 lg:-translate-y-1/2 lg:translate-x-8">
                <slot name="visual-content"/>
              </div>
            </div>
            <a v-if="button?.name" :href="button?.link||'#'" :class="button?.class" class="inline-block rounded-md border border-transparent text-center">
              {{ button.name }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>