<script setup lang="ts">
import {computed, ref} from "vue";
import type {IMode} from "@/components/BaseTypes";
import {cn} from "@/helpers/tailwind";
import type {ILabel, ILabelMode} from "@/components/functional/Label";
const props = defineProps<ILabel>();
const mode = computed<IMode>(()=> props.mode ?? "outlined")
const type = computed(()=>props.type ?? "dynamic")
const background = computed(()=> {
  switch (mode.value) {
    case "outlined": return 'from-white dark:from-neutral-950 from-50% to-transparent to-55%'
    case "underlined": return 'from-stone-50 dark:from-stone-950 from-50% to-transparent to-55%'
    case "filled": return 'from-stone-100 dark:from-stone-900 from-50% to-transparent to-55%'
  }
})
</script>

<template>
  <div
    :class="cn(
      'absolute top-[38px] flex pointer-events-none select-none h-5 rounded-md transition-all duration-200',
      !(type === 'dynamic')||`peer-focus:-translate-y-[60px] peer-focus:translate-x-4 -translate-y-7`,
      !(type === 'offsetDynamic')||`peer-focus:-translate-y-[48px] peer-focus:translate-x-4 -translate-y-7 px-1 bg-gradient-to-t ${background}`,
      !(type === 'offsetStatic')||`-translate-y-[48px] translate-x-4 px-1 bg-gradient-to-t ${background} from-50% to-transparent to-55%`,
      !(type === 'static')||'-translate-y-[60px] translate-x-4',
      !(type === 'vanishing')||`-translate-y-[30px]`,
      !(type === 'none')||'opacity-0 -translate-y-[30px] !translate-x-8',
      !props.isRequired||`after:content-['*'] after:text-red-500 after:dark:text-red-800 after:ml-1`
      )"
    :style="`--tw-translate-x: ${props.translateX}px;`">
    <span
      class="block text-sm font-medium text-gray-400 dark:text-gray-500 truncate"
      :style="`max-width: ${(props.maxWidth??0)-27}px`">
      {{ props.title }}
    </span>
  </div>
</template>