<script setup lang="ts">
import {getCurrentInstance, onMounted, ref} from "vue";
const props = defineProps<{
  isOpen?:boolean
  content?: string
}>()
const isOpen = ref(props?.isOpen ?? false)
const dropdown = ref<HTMLElement|undefined>()
onMounted(()=>{
  const iconDropdown = document.getElementById(`iconDropdown${getCurrentInstance()?.uid}`)
  document.addEventListener( 'click', (e) => {
    if (iconDropdown && dropdown.value){
      isOpen.value = e.composedPath().includes(iconDropdown) || e.composedPath().includes((dropdown.value as HTMLElement))
    }
  })
})
</script>

<template>
  <div :id="`iconDropdown${getCurrentInstance()?.uid}`" class="relative inline-block text-left" @click="isOpen = !isOpen">
    <div class="group inline-flex justify-center text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 hover:dark:text-gray-100">
      <slot name="head"/>
    </div>
  </div>
  <transition leave-active-class="transition ease-in-out duration-300" leave-from-class="opacity-100" leave-to-class="opacity-0"
              enter-active-class="transition ease-in-out duration-300" enter-from-class="opacity-0" enter-to-class="opacity-100">
    <div v-if="isOpen"
         ref="dropdown"
         v-html="content"
         class="absolute z-10
         -translate-x-[80%] translate-y-3/4
         min-w-[15rem] w-auto max-w-6xl origin-top-right
         p-3 rounded-md bg-white dark:bg-gray-950
         font-light italic text-xs text-gray-500 dark:text-gray-400
         shadow-lg ring-1 ring-black ring-opacity-5
         focus:outline-none"/>
  </transition>
</template>