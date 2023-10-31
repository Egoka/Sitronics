<script setup lang="ts">
// ---------------------------------------
import {computed} from "vue";
import {XMarkIcon} from "@heroicons/vue/20/solid";
import Button from "@/components/functional/Button.vue";
import type {StyleClass} from "@/components/BaseTypes";
// ---------------------------------------
export interface IBadge {
  type?: "button" | "reset" | "submit"
  mode?:  "primary" | "secondary" | "outline" | "neutral"
  class?: StyleClass
  classContent?: StyleClass
  point?: boolean
  closeButton?:boolean
}
// ---------------------------------------
const props = defineProps<IBadge>()
const emit = defineEmits<{
  (event: 'delete'): void;
}>();
// ---------------------------------------
const mode = computed<NonNullable<IBadge["mode"]>>(()=> props.mode ?? "primary")
const isPoint = computed<NonNullable<IBadge["point"]>>(()=> props.point ?? false)
const isCloseButton = computed<NonNullable<IBadge["closeButton"]>>(()=> props.closeButton ?? false)
const classBadge = computed<StyleClass>(()=> {
  const arrayClasses = !!props.class
    ? Array.isArray(props.class)
      ? (props.class as Array<string>).flat().map(item=>item.split(" ")).flat()
      : (props.class as string).split(" ")
    : [];
  arrayClasses.push("inline-flex items-center text-xs");
  if (isPoint.value||isCloseButton.value) {
    arrayClasses.push("gap-x-[2px]")
    arrayClasses.push(isPoint.value && isCloseButton.value ? "px-1" :
      isPoint.value && !isCloseButton.value ? "pl-1" :
        !isPoint.value && isCloseButton.value ? "pr-1" : "")
  }
  [
    {reg: "m-", class: "m-[2px]"},
    {reg: "px-", class: "px-2"},
    {reg: "py-", class: "py-1"},
    {reg: "text-", class: "text-xs"},
    {reg: "font-", class: "font-medium"},
    {reg: "rounded-", class: "rounded-md"}
  ].map((item:{reg: string, class: string})=>{
    if (!arrayClasses.some(classItem=>classItem.match(new RegExp(item.reg)))){
      arrayClasses.push(item.class)
    }
  })
  !(mode.value === "primary") || arrayClasses.push("bg-primary-600 text-primary-100 dark:bg-primary-700 dark:text-primary-100")
  !(mode.value === "secondary") || arrayClasses.push("bg-primary-100 text-primary-900 dark:bg-primary-950 dark:text-primary-100")
  !(mode.value === "neutral") || arrayClasses.push("ring-1 ring-inset")
  if (["outline"].includes(mode.value)){
    if (!isPoint.value&&!isCloseButton.value){
      !(mode.value === "outline") || arrayClasses.push("ring-1 ring-inset bg-primary-50 dark:bg-primary-900 text-primary-600 dark:text-primary-400 ring-primary-500/10")
    } else {
      arrayClasses.push("ring-1 ring-inset text-neutral-600 dark:text-neutral-200 ring-neutral-500/30")
    }
  }
  return arrayClasses
})
const classBadgeContent = computed<StyleClass>(()=> {
  const arrayClasses = []
  !(mode.value === "primary") || arrayClasses.push("fill-primary-100 dark:fill-primary-300")
  !(mode.value === "secondary") || arrayClasses.push("fill-primary-600 dark:fill-primary-300")
  !(mode.value === "outline") || arrayClasses.push("fill-primary-500 dark:fill-primary-600")
  !(mode.value === "neutral") || arrayClasses.push(props.classContent)
  return arrayClasses
})
// ---------------------------------------
function deleteBadge() {
  emit('delete')
}
</script>

<template>
  <div :class="classBadge">
    <svg v-if="isPoint" class="h-1.5 w-1.5 mx-1" :class="classBadgeContent" viewBox="0 0 6 6" aria-hidden="true"><circle cx="3" cy="3" r="3"></circle></svg>
    <slot/>
    <Button v-if="isCloseButton" mode="text" class="rounded-[5px] h-4 w-4 px-0" @click="deleteBadge">
      <XMarkIcon aria-hidden="true" class="h-4 w-4" :class="classBadgeContent"/>
    </Button>
  </div>
</template>