<script setup lang="ts">
// ---------------------------------------
import {computed} from "vue";

export interface IButton {
  type?: "button" | "reset" | "submit"
  link?: string | Location
  linkReplace?: boolean
  mode?:  "primary" | "secondary" | "creative" | "destructive" | "outline" | "line" | "neutral" | "ghost" | "link" | "text" | "custom"
  class?: string| Array<string>
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
const classButton = computed<Array<string>>(()=> {
  const arrayClasses = !!props.class
    ? Array.isArray(props.class)
      ? (props.class as Array<string>).flat().map(item=>item.split(" ")).flat()
      : (props.class as string).split(" ")
    : [];
  [{reg: "h-", class: "h-9"},
    {reg: "px-", class: "px-4"},
    {reg: "py-", class: "py-2"},
    {reg: "text-", class: "text-sm"},
    {reg: "font-", class: "font-medium"},
    {reg: "rounded-", class: "rounded-md"},
  ].map((item:{reg: string, class: string})=>{
    if (!arrayClasses.some(classItem=>classItem.match(new RegExp(item.reg)))){
      arrayClasses.push(item.class)
    }
  })
  arrayClasses.push("inline-flex items-center justify-center")
  arrayClasses.push("transition-colors duration-300 focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50")
  !(mode.value === "primary") || arrayClasses.push("shadow bg-primary-600 text-primary-100 hover:bg-primary-600/90 dark:bg-primary-700 dark:text-primary-100 dark:hover:bg-primary-700/90 focus-visible:ring-primary-400 dark:focus-visible:ring-primary-500")
  !(mode.value === "secondary") || arrayClasses.push("bg-primary-100 text-primary-900 dark:bg-primary-950 dark:text-primary-100 hover:bg-primary-200 dark:hover:bg-primary-900 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-600")
  !(mode.value === "neutral") || arrayClasses.push("shadow-sm bg-neutral-200 text-neutral-700 hover:bg-neutral-200/80 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-800/80 focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-500")
  !(mode.value === "creative") ||arrayClasses.push( "shadow-sm bg-green-500 text-green-100 hover:bg-green-500/90 dark:bg-green-900 dark:text-green-100 dark:hover:bg-green-900/90 focus-visible:ring-green-300 dark:focus-visible:ring-green-700")
  !(mode.value === "destructive") || arrayClasses.push("shadow-sm bg-red-600 text-red-100 hover:bg-red-600/90 dark:bg-red-700 dark:text-rad-100 dark:hover:bg-red-700/90 focus-visible:ring-red-300 dark:focus-visible:ring-red-700")
  !(mode.value === "outline") || arrayClasses.push("shadow-sm text-primary-900 dark:text-primary-100 border border-primary-500 dark:border-primary-700 bg-transparent hover:bg-primary-50 dark:hover:bg-primary-950 focus-visible:ring-primary-200 dark:focus-visible:ring-primary-900")
  !(mode.value === "line") || arrayClasses.push("shadow-sm text-neutral-900 dark:text-neutral-100 border border-neutral-500 dark:border-neutral-700 bg-transparent hover:bg-neutral-200 dark:hover:bg-neutral-900 focus-visible:ring-neutral-200 dark:focus-visible:ring-neutral-900")
  !(mode.value === "ghost") || arrayClasses.push("text-neutral-900 dark:text-neutral-100 hover:bg-neutral-200 dark:hover:bg-neutral-800 focus-visible:ring-neutral-200 dark:focus-visible:ring-neutral-600")
  !(mode.value === "link") || arrayClasses.push("text-neutral-900 dark:text-neutral-100 relative after:bg-black dark:after:bg-white after:absolute after:h-[1px] after:w-0 after:bottom-0 after:-translate-y-2 after:left-[10%] hover:after:w-[80%] after:transition-all after:duration-300 focus-visible:ring-transparent")
  !(mode.value === "text") || arrayClasses.push("text-neutral-900 dark:text-neutral-100 focus-visible:ring-transparent")
  return arrayClasses
})
// ---------------------------------------
</script>

<template>
  <RouterLink v-if="link" :to="link" :class="classButton" :tag="tag" :replace="linkReplace">
    <slot name="default"/>
  </RouterLink>
  <button v-else :type="type" :class="classButton as any" :disabled="disabled">
    <slot name="default"/>
  </button>
</template>