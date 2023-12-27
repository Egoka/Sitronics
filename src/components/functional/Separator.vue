<script setup lang="ts">
import {computed, useSlots} from "vue";
import type {StyleClass} from "@/components/BaseTypes";
import {cn} from "@/helpers/tailwind";
// ---TYPES-------------------------------
type Gradient = 0|5|10|20|30|40|50
type GradientLength = 0|5|10|20|30|40|50
type Depth = 0|1|2|3|4|5|6|7
// ---INTERFACES--------------------------
export interface ISeparatorStyles {
  body?: StyleClass
  bodyLine?: StyleClass
  line?:StyleClass
  content?: StyleClass
  bodyLineLeft?: StyleClass
  lineLeft?:StyleClass
  bodyLineRight?: StyleClass
  lineRight?:StyleClass
}
export interface ISeparator {
  vertical?: boolean
  content?: "right"|"left"|"center"|"full"
  gradient?: Gradient|[Gradient, GradientLength]|boolean
  depth?: Depth
  styles?: ISeparatorStyles
  class?: StyleClass
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
  <div :class="cn('justify-center', props.class, props.styles?.body, !vertical||'flex-col h-full', 'relative flex')">
    <div v-if="!['left', 'full'].includes(content)" :class="cn('items-center w-full', props.styles?.bodyLine, props.styles?.bodyLineLeft, !vertical||'h-full justify-center', 'relative flex')" aria-hidden="true">
      <div
        :class="cn(vertical ? 'bg-gradient-to-b' : 'bg-gradient-to-r', 'from-transparent via-neutral-200 dark:via-neutral-800 to-neutral-200 dark:to-neutral-800', props.styles?.line, props.styles?.lineLeft)"
        :style="[vertical ? `height: 100%;width: ${depth}px;` : `width: 100%;height: ${depth}px;`,`--tw-gradient-from-position: ${gradient}%;--tw-gradient-via-position: ${gradient > 0 ? gradient+gradientLength : 0}%`]"/>
    </div>
    <span v-if="slots?.default" :class="cn('text-sm text-gray-500', props.styles?.content, 'relative')"><slot name="default"/></span>
    <div v-if="!['right', 'full'].includes(content)" :class="cn('items-center w-full', props.styles?.bodyLine, props.styles?.bodyLineRight, !vertical||'h-full justify-center', 'relative flex')" aria-hidden="true">
      <div
        :class="cn(vertical ? 'bg-gradient-to-t' : 'bg-gradient-to-l', 'from-transparent via-neutral-200 dark:via-neutral-800 to-neutral-200 dark:to-neutral-800', props.styles?.line, props.styles?.lineRight)"
        :style="[vertical ? `height: 100%;width: ${depth}px;` : `width: 100%;height: ${depth}px;`,`--tw-gradient-from-position: ${gradient}%;--tw-gradient-via-position: ${gradient > 0 ? gradient+gradientLength : 0}%`]"/>
    </div>
  </div>
</template>