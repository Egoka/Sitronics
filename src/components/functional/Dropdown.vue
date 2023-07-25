<script setup lang="ts">
import {onMounted, ref} from "vue";
const props = defineProps<{
  isOpen?:boolean
  content?: string
}>()
const isOpen = ref(props?.isOpen|| false)
const mark = ref<HTMLElement|undefined>()
onMounted(()=>{
  document.addEventListener( 'click', (e) => {
    isOpen.value = e.composedPath().includes((mark.value as HTMLElement))
  })
})
</script>

<template>
  <div ref="mark" class="relative inline-block text-left" @click.stop="isOpen = !isOpen">
    <div class="group inline-flex justify-center text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 hover:dark:text-gray-100">
      <slot name="head"/>
    </div>
  </div>
  <transition leave-active-class="transition ease-in duration-500" leave-from-class="opacity-100" leave-to-class="opacity-0"
              enter-active-class="transition ease-in duration-500" enter-from-class="opacity-0" enter-to-class="opacity-100">
    <div class="absolute z-10
      -translate-x-[80%] translate-y-3/4
      min-w-[15rem] w-auto max-w-6xl origin-top-right
      p-3 rounded-md bg-white dark:bg-gray-800 dark:text-white
      font-light italic text-xs
      shadow-2xl ring-1 ring-black ring-opacity-5
      focus:outline-none"
           :class="[isOpen||'hidden']" v-html="content">
    </div>
  </transition>
</template>