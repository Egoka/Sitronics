<script setup lang="ts">
// ---------------------------------------
import {computed, getCurrentInstance, ref} from "vue";
import Button from "@/components/functional/Button.vue";

export interface IButton {
  type?: "button" | "reset" | "submit"
  link?: string | Location
  linkReplace?: boolean
  mode?:  "primary" | "secondary" | "creative" | "destructive" | "outline" | "neutral" | "ghost" | "link" | "text"
  class?: string| Array<string>
  disabled?: boolean
}
// ---------------------------------------
const props = defineProps<IButton>()
// ---------------------------------------
const link = computed<IButton["link"]>(()=> props.link)
const linkReplace = computed<NonNullable<IButton["linkReplace"]>>(()=> props.linkReplace||false)
const disabled = computed<NonNullable<IButton["disabled"]>>(()=> props.disabled||false)
const type = computed<NonNullable<IButton["type"]>>(()=> props.type|| "button")
const mode = computed<NonNullable<IButton["mode"]>>(()=> props.mode|| "primary")
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
  !(mode.value === "secondary") || arrayClasses.push("border border-transparent bg-primary-100 text-primary-900 dark:bg-primary-950 dark:text-primary-100 hover:bg-primary-200 dark:hover:bg-primary-900 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-600")
  !(mode.value === "neutral") || arrayClasses.push("shadow-sm bg-secondary-200 text-secondary-700 hover:bg-secondary-200/80 dark:bg-secondary-800 dark:text-secondary-300 dark:hover:bg-secondary-800/80 focus-visible:ring-secondary-400 dark:focus-visible:ring-secondary-500")
  !(mode.value === "creative") ||arrayClasses.push( "shadow-sm bg-green-500 text-green-100 hover:bg-green-500/90 dark:bg-green-900 dark:text-green-100 dark:hover:bg-green-900/90 focus-visible:ring-green-300 dark:focus-visible:ring-green-700")
  !(mode.value === "destructive") || arrayClasses.push("shadow-sm bg-red-500 text-red-100 hover:bg-red-500/90 dark:bg-red-900 dark:text-rad-100 dark:hover:bg-red-900/90 focus-visible:ring-red-300 dark:focus-visible:ring-red-700")
  !(mode.value === "outline") || arrayClasses.push("shadow-sm text-primary-900 dark:text-primary-100 border border-primary-500 dark:border-primary-700 bg-transparent hover:bg-primary-200 dark:hover:bg-primary-900 focus-visible:ring-primary-200 dark:focus-visible:ring-primary-900")
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