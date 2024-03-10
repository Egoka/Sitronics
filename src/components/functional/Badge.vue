<script setup lang="ts">
// ---------------------------------------
import {computed} from "vue";
import {XMarkIcon} from "@heroicons/vue/20/solid";
import Button from "@/components/functional/Button.vue";
import type {StyleClass} from "@/components/BaseTypes";
import {cn} from "@/helpers/tailwind";
import type {IBadge} from "@/components/functional/Badge";

// ---------------------------------------
const props = defineProps<IBadge>()
const emit = defineEmits<{
  (event: 'delete'): void;
}>();
// ---------------------------------------
const mode = computed<NonNullable<IBadge["mode"]>>(()=> props.mode ?? "primary")
const isPoint = computed<NonNullable<IBadge["point"]>>(()=> props.point ?? false)
const isCloseButton = computed<NonNullable<IBadge["closeButton"]>>(()=> props.closeButton ?? false)
const modeStyle = computed<string>(()=>
  (mode.value === "primary") ? "bg-theme-600 text-theme-100 dark:bg-theme-700 dark:text-theme-100" :
    (mode.value === "secondary") ? "bg-theme-100 text-theme-900 dark:bg-theme-950 dark:text-theme-100" :
      (mode.value === "neutral") ? "ring-1 ring-inset" :
        (mode.value === "outline") ? (!isPoint.value&&!isCloseButton.value)
            ? "ring-1 ring-inset bg-theme-50 dark:bg-theme-900 text-theme-600 dark:text-theme-400 ring-theme-500/10"
            : "ring-1 ring-inset text-neutral-600 dark:text-neutral-200 ring-neutral-500/30"
          : "")
const classBadgeContent = computed(()=> {
  const arrayClasses = []
  !(mode.value === "primary") || arrayClasses.push("fill-theme-100 dark:fill-theme-300")
  !(mode.value === "secondary") || arrayClasses.push("fill-theme-600 dark:fill-theme-300")
  !(mode.value === "outline") || arrayClasses.push("fill-theme-500 dark:fill-theme-600")
  !(mode.value === "neutral") || arrayClasses.push(props.classContent)
  return arrayClasses
})
// ---------------------------------------
function deleteBadge() {
  emit('delete')
}
</script>

<template>
  <div :class="cn(
    'items-center m-[2px] px-2 py-1 text-xs font-medium rounded-md',
    (isPoint||isCloseButton) && 'gap-x-[2px]',
    (isPoint && isCloseButton) ? 'px-1' : (isPoint && !isCloseButton) ? 'pl-1' : (!isPoint && isCloseButton) ? 'pr-1' : '',
    modeStyle,
    props.class,
    'inline-flex',
    )">
    <svg
      v-if="isPoint"
      :class="cn('h-1.5 w-1.5 mx-1', classBadgeContent)"
      viewBox="0 0 6 6"
      aria-hidden="true">
      <circle cx="3" cy="3" r="3"></circle>
    </svg>
    <slot/>
    <Button v-if="isCloseButton" mode="ghost" class="m-0 rounded-[5px] h-4 w-4 px-0" @click="deleteBadge">
      <XMarkIcon aria-hidden="true" :class="cn('h-4 w-4', classBadgeContent)"/>
    </Button>
  </div>
</template>