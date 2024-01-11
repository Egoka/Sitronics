<script setup lang="ts">
// ---------------------------------------
import {computed} from "vue";
import type {StyleClass} from "@/components/BaseTypes";
import {cn} from "@/helpers/tailwind";

export interface IButton {
  type?: "button" | "reset" | "submit"
  link?: string | Location
  linkReplace?: boolean
  mode?:  "primary" | "secondary" | "creative" | "destructive" | "outline" | "line" | "neutral" | "ghost" | "link" | "text" | "custom"
  class?: StyleClass
  disabled?: boolean
}
// ---------------------------------------
const props = defineProps<IButton>()
// ---------------------------------------
const link = computed<IButton["link"]>(()=> props.link)
const linkReplace = computed<NonNullable<IButton["linkReplace"]>>(()=> props.linkReplace ?? false)
const disabled = computed<NonNullable<IButton["disabled"]>>(()=> props.disabled ?? false)
const type = computed<NonNullable<IButton["type"]>>(()=> props.type ?? "button")
const mode = computed<NonNullable<IButton["mode"]>>(()=> props.mode ?? "neutral")
const tag = computed<string>(()=> ['link', 'text'].includes(mode.value) ? 'button' : 'a')
const classButton = computed<IButton["class"]>(()=> props.class)
const modeStyle = computed<string>(()=>
  (mode.value === "primary") ? "shadow bg-theme-600 text-theme-100 hover:bg-theme-600/90 dark:bg-theme-700 dark:text-theme-100 dark:hover:bg-theme-700/90 focus-visible:ring-theme-400 dark:focus-visible:ring-theme-500" :
    (mode.value === "secondary") ? "bg-theme-100 text-theme-900 dark:bg-theme-950 dark:text-theme-100 hover:bg-theme-200 dark:hover:bg-theme-900 focus-visible:ring-theme-500 dark:focus-visible:ring-theme-600" :
      (mode.value === "neutral") ? "shadow-sm bg-neutral-200 text-neutral-700 hover:bg-neutral-200/80 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-800/80 focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-500" :
        (mode.value === "creative") ? "shadow-sm bg-green-500 text-green-100 hover:bg-green-500/90 dark:bg-green-900 dark:text-green-100 dark:hover:bg-green-900/90 focus-visible:ring-green-300 dark:focus-visible:ring-green-700" :
          (mode.value === "destructive") ? "shadow-sm bg-red-600 text-red-100 hover:bg-red-600/90 dark:bg-red-700 dark:text-rad-100 dark:hover:bg-red-700/90 focus-visible:ring-red-300 dark:focus-visible:ring-red-700" :
            (mode.value === "outline") ? "shadow-sm text-theme-900 dark:text-theme-100 border border-theme-500 dark:border-theme-700 bg-transparent hover:bg-theme-50 dark:hover:bg-theme-950 focus-visible:ring-theme-200 dark:focus-visible:ring-theme-900" :
              (mode.value === "line") ? "shadow-sm text-neutral-900 dark:text-neutral-100 border border-neutral-500 dark:border-neutral-700 bg-transparent hover:bg-neutral-200 dark:hover:bg-neutral-900 focus-visible:ring-neutral-200 dark:focus-visible:ring-neutral-900" :
                (mode.value === "ghost") ? "text-neutral-900 dark:text-neutral-100 hover:bg-neutral-200 dark:hover:bg-neutral-800 focus-visible:ring-neutral-200 dark:focus-visible:ring-neutral-600" :
                  (mode.value === "link") ? "text-neutral-900 dark:text-neutral-100 relative after:bg-black dark:after:bg-white after:absolute after:h-[1px] after:w-0 after:bottom-0 after:-translate-y-2 after:left-[10%] hover:after:w-[80%] after:transition-all after:duration-300 focus-visible:ring-transparent" :
                    (mode.value === "text") ? "text-neutral-900 dark:text-neutral-100 focus-visible:ring-transparent" : "" )
// ---------------------------------------
</script>

<template>
  <RouterLink
    v-if="link"
    :to="link"
    :class="cn(
      'h-9 px-4 py-2 text-sm font-medium rounded-md',
      'inline-flex items-center justify-center',
      'transition-colors duration-300 focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50',
      modeStyle, classButton)"
    :tag="tag"
    :replace="linkReplace">
    <slot name="default"/>
  </RouterLink>
  <button
    v-else
    :type="type"
    :class="cn(
      'h-9 px-4 py-2 text-sm font-medium rounded-md',
      'inline-flex items-center justify-center',
      'transition-colors duration-300 focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50',
      modeStyle, classButton)"
    :disabled="disabled">
    <slot name="default"/>
  </button>
</template>