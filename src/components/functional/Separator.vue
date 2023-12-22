<script setup lang="ts">
import {computed, useSlots} from "vue";
import type {StyleClass} from "@/components/BaseTypes";
// ---TYPES-------------------------------
type Gradient = 0|5|10|20|30|40|50
type GradientLength = 0|5|10|20|30|40|50
type Depth = 0|1|2|3|4|5|6|7
// ---INTERFACES--------------------------
export interface ISeparatorStyles {
  class?: {
    body?: StyleClass
  }
}
export interface ISeparator {
  vertical?: boolean
  content?: "right"|"left"|"center"|"full"
  gradient?: Gradient|[Gradient, GradientLength]|boolean
  depth?: Depth
  styles?: ISeparatorStyles
}
// ---PROPS-EMITS-SLOTS-------------------
const props = defineProps<ISeparator>()
const slots = useSlots()
// ---PROPS-------------------------------
const vertical = computed<boolean>(()=> props.vertical)
const content = computed<NonNullable<ISeparator["content"]>>(()=> props.content ?? "center")
const gradient = computed<number>(()=> {
  let gradient
  if (Array.isArray(props.gradient)) {
    gradient = props.gradient[0]
  } else {
    gradient = props.gradient
  }
  return (typeof gradient === "boolean" && gradient) ? 20 : (gradient > 0 && gradient <= 100) ? +gradient : 0
})
const gradientLength = computed<number>(()=> Array.isArray(props.gradient) ? props.gradient[1] : 30)
const depth = computed<NonNullable<ISeparator["depth"]>>(()=> props.depth <= 7 ? props.depth : 1)
</script>

<template>
  <div :class="['m-1', props.styles?.class?.body]">
    <div :class="['relative flex justify-center', !vertical||'flex-col h-full']">
      <div v-if="!['left', 'full'].includes(content)" :class="['relative flex items-center w-full', !vertical||'h-full justify-center']" aria-hidden="true">
        <div
          :class="[vertical ? 'bg-gradient-to-b' : 'bg-gradient-to-r', 'from-transparent via-neutral-200 dark:via-neutral-800 to-neutral-200 dark:to-neutral-800']"
          :style="[vertical ? `height: 100%;width: ${depth}px;` : `width: 100%;height: ${depth}px;`,`--tw-gradient-from-position: ${gradient}%;--tw-gradient-via-position: ${gradient > 0 ? gradient+gradientLength : 0}%`]"/>
      </div>
      <span v-if="slots?.default" class="relative text-sm text-gray-500"><slot name="default"/></span>
      <div v-if="!['right', 'full'].includes(content)" :class="['relative flex items-center w-full', !vertical||'h-full justify-center']" aria-hidden="true">
        <div
          :class="[vertical ? 'bg-gradient-to-t' : 'bg-gradient-to-l', 'from-transparent via-neutral-200 dark:via-neutral-800 to-neutral-200 dark:to-neutral-800']"
          :style="[vertical ? `height: 100%;width: ${depth}px;` : `width: 100%;height: ${depth}px;`,`--tw-gradient-from-position: ${gradient}%;--tw-gradient-via-position: ${gradient > 0 ? gradient+gradientLength : 0}%`]"/>
      </div>
    </div>
  </div>
</template>