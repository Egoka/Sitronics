<script setup lang="ts">
import {computed} from "vue";
import type {IMode} from "@/components/BaseTypes";
export type ILabelMode = "offsetDynamic"|"offsetStatic"|"dynamic"|"static"|"vanishing"|"none"
const props = defineProps<{
  title?: string
  isRequired?: boolean
  // isDisabled?: boolean
  type?: ILabelMode
  mode?: IMode
  translateX?:number|undefined
  maxWidth?:number|undefined
}>();
const title = computed(()=>props.title ?? "")
const mode = computed<IMode>(()=> props.mode ?? "outlined")
const isRequired = computed(()=>props.isRequired)
// const isDisabled = computed(()=>props.isDisabled)
const type = computed(()=>props.type ?? "dynamic")
const maxWidth = computed(()=> props.maxWidth ?? null)
const background = computed(()=> {
  switch (mode.value) {
    case "outlined": return 'from-white dark:from-neutral-950 from-50% to-transparent to-55%'
    case "underlined": return 'from-stone-50 dark:from-stone-950 from-50% to-transparent to-55%'
    case "filled": return 'from-stone-100 dark:from-stone-900 from-50% to-transparent to-55%'
  }
})
</script>

<template>
  <div :class="['absolute top-[38px] flex pointer-events-none select-none h-5 rounded-md transition',
  !(type === 'dynamic')||`peer-focus:-translate-y-[60px] peer-focus:translate-x-4 -translate-y-7 transition-transform`,
  !(type === 'offsetDynamic')||`peer-focus:-translate-y-[48px] peer-focus:translate-x-4 -translate-y-7 transition-transform px-1 bg-gradient-to-t ${background}`,
  !(type === 'offsetStatic')||`-translate-y-[48px] translate-x-4 px-1 bg-gradient-to-t ${background} from-50% to-transparent to-55%`,
  !(type === 'static')||'-translate-y-[60px] translate-x-4',
  !(type === 'vanishing')||`-translate-y-[28px]`,
  !(type === 'none')||'invisible -translate-y-[30px] translate-x-4',
  !isRequired||`after:content-['*'] after:text-red-500 after:dark:text-red-800 after:ml-1` ]" :style="`--tw-translate-x: ${props.translateX}px;`">
    <span
      class="block text-sm font-medium text-gray-400 dark:text-gray-500 truncate"
      :style="`max-width: ${maxWidth-27}px`">
      {{ title }}
    </span>
  </div>
</template>