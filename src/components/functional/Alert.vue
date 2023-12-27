<script setup lang="ts">
import {computed, ref, watch, useSlots} from "vue";
import {
  CheckCircleIcon,
  InformationCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
  ChatBubbleOvalLeftIcon
} from "@heroicons/vue/20/solid";
import Button from "@/components/functional/Button.vue";
import {IAlert} from "@/components/functional/Alert.ts";
import type {StyleClass} from "@/components/BaseTypes";
import {cn} from "@/helpers/tailwind";
// ---------------------------------------
export interface IAlertProps extends Omit<IAlert, 'position'> {
  position?: "top"|"bottom"|"left"|"right"|"center"
}
const props = defineProps<IAlertProps>()
const emit = defineEmits<{
  (event: 'update:modelValue', payload: boolean): void;
}>();
const $slots = useSlots()
// ---------------------------------------
const isVisible = ref(props.modelValue)
const type = computed<NonNullable<IAlertProps["type"]>>(()=> props.type ?? "success")
const title = computed<NonNullable<IAlertProps["title"]>>(()=> props.title ?? "")
const subtitle = computed<NonNullable<IAlertProps["subtitle"]>>(()=> props.subtitle ?? "")
const displayTime = computed<number>(()=> !!+props.displayTime ? +props.displayTime : 0)
const isCloseButton = computed<NonNullable<IAlertProps["closeButton"]>>(()=>props.closeButton ?? false)
const position = computed<NonNullable<IAlertProps["position"]>>(()=> props.position ?? "top")
const classClass = computed<StyleClass>(()=> props.class)
const startEnterAndLeaveClass = computed<StyleClass>(()=> {
  if (!props.notAnimate) {
    if(position.value.includes("left")){ return "-translate-x-[200%] opacity-0"}
    else if(position.value.includes("right")){ return "translate-x-[200%] opacity-0"}
    else if(position.value.includes("top")){ return "-translate-y-[200%] opacity-0"}
    else if(position.value.includes("bottom")){ return "translate-y-[200%] opacity-0"}}
  return "opacity-0"
})
const endEnterAndLeaveClass = computed<StyleClass>(()=> {
  if (!props.notAnimate) {
    if(position.value.includes("left")){ return "translate-x-0 opacity-100"}
    else if(position.value.includes("right")){ return "translate-x-0 opacity-100"}
    else if(position.value.includes("top")){ return "translate-y-0 opacity-100"}
    else if(position.value.includes("bottom")){ return "translate-y-0 opacity-100"}}
  return "opacity-100"
})
const style = computed<{body: string, icon: string, title: string, subtitle:string, button:string, buttonIcon:string}>(()=>{
  switch (type.value) {
    case "success": return {body: "bg-green-50 dark:bg-green-950", icon: "text-green-400 dark:text-green-600", title: "text-green-800 dark:text-green-200", subtitle: "text-green-700 dark:text-green-300", button: "hover:bg-green-200 dark:hover:bg-green-800", buttonIcon: "fill-green-500 dark:fill-green-500"}
    case "warning": return {body: "bg-yellow-50 dark:bg-yellow-950", icon: "text-yellow-400 dark:text-yellow-600", title: "text-yellow-800 dark:text-yellow-200", subtitle: "text-yellow-700 dark:text-yellow-300", button: "hover:bg-yellow-200 dark:hover:bg-yellow-800", buttonIcon: "fill-yellow-500 dark:fill-yellow-500"}
    case "info": return {body: "bg-blue-50 dark:bg-blue-950", icon: "text-blue-400 dark:text-blue-600", title: "text-blue-800 dark:text-blue-200", subtitle: "text-blue-700 dark:text-blue-300", button: "hover:bg-blue-200 dark:hover:bg-blue-800", buttonIcon: "fill-blue-500 dark:fill-blue-500"}
    case "error": return {body: "bg-red-50 dark:bg-red-950", icon: "text-red-400 dark:text-red-600", title: "text-red-800 dark:text-red-200", subtitle: "text-red-700 dark:text-red-300", button: "hover:bg-red-200 dark:hover:bg-red-800", buttonIcon: "fill-red-500 dark:fill-red-500"}
    case "neutral": return {body: "bg-neutral-100 dark:bg-neutral-800", icon: "text-neutral-400 dark:text-neutral-600", title: "text-neutral-600 dark:text-neutral-300", subtitle: "text-neutral-500 dark:text-neutral-400", button: "hover:bg-neutral-200 dark:hover:bg-neutral-700", buttonIcon: "fill-neutral-500 dark:fill-neutral-500"}
  }
})
const icon = computed(()=>{
  switch (type.value) {
    case "success": return CheckCircleIcon
    case "warning": return ExclamationTriangleIcon
    case "info": return InformationCircleIcon
    case "error": return XCircleIcon
    case "neutral": return ChatBubbleOvalLeftIcon
  }
})
const size = computed<string>(()=> {
  switch (props.size) {
    case "xs": return "sm:max-w-xs";case "sm": return "sm:max-w-sm";case "md": return "sm:max-w-md";
    case "lg": return "sm:max-w-lg";case "xl": return "sm:max-w-xl";case "2xl": return "sm:max-w-2xl";
    case "3xl": return "sm:max-w-3xl";case "4xl": return "sm:max-w-4xl";case "5xl": return "sm:max-w-5xl";
    case "6xl": return "sm:max-w-6xl";case "7xl": return "sm:max-w-7xl";default: return "sm:max-w-2xl"
  }
})
watch(()=>props.modelValue, (value)=>{
  isVisible.value = value
  if (displayTime.value >= 100 && value){
    setTimeout(()=> {
      isVisible.value = false
      emit('update:modelValue', false)
    }, displayTime.value)
  }
},{immediate: true})
function close() {
  isVisible.value = false
  emit('update:modelValue', false)
}
</script>

<template>
  <transition appear leave-active-class="transition-all ease-in-out duration-500" :leave-from-class="endEnterAndLeaveClass" :leave-to-class="startEnterAndLeaveClass"
              enter-active-class="transition-all ease-in-out duration-500" :enter-from-class="startEnterAndLeaveClass" :enter-to-class="endEnterAndLeaveClass">
    <div
      v-if="isVisible"
      :class="cn(
        'alert-body p-4 w-auto max-w-[89vw] rounded-md',
        style.body,
        classClass,
        size
        )"
      :style="props.style">
      <div class="flex">
        <div class="shrink-0">
          <component :is="icon" aria-hidden="true" :class="cn('h-5 w-5', style.icon)"/>
        </div>
        <div class="ml-3">
          <h3 v-if="title?.length" :class="cn('text-sm font-medium', style.title)">{{ title }}</h3>
          <div v-if="subtitle" :class="cn('text-sm', !title?.length||'mt-2', style.subtitle)" v-html="subtitle"/>
          <div v-if="!!$slots?.default" :class="cn('text-sm', !title?.length||'mt-2', style.subtitle)"><slot/></div>
        </div>
        <div v-if="isCloseButton || displayTime === 0" class="ml-auto pl-3">
          <div class="-mx-1.5 -my-2">
            <button
              type="button"
              :class="cn(
                'button-delete','rounded-md m-0 h-9 w-9 px-2',
                style.button,
                'py-2 text-sm font-medium inline-flex items-center justify-center transition-colors duration-300'
               )"
              @click="close">
              <XMarkIcon aria-hidden="true" :class="cn('h-5 w-5', style.buttonIcon)"/>
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>