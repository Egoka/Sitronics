<script setup lang="ts">
import {computed, watch} from "vue";
import Button from "@/components/functional/Button.vue";
import {XMarkIcon} from "@heroicons/vue/20/solid";
import type {StyleClass} from "@/components/BaseTypes";
import {cn} from "@/helpers/tailwind";
import type {IDialog} from "@/components/functional/Dialog";
// ---------------------------------------
const props = defineProps<IDialog>()
const emit = defineEmits<{
  (event: 'update:modelValue', payload: boolean): void;
}>();
// ---------------------------------------
const toTeleport = computed<IDialog["toTeleport"]>(()=>props.toTeleport ?? "body")
const isOpen = computed<boolean>(()=>props.modelValue ?? false)
const size = computed<string>(()=> {
  switch (props.size) {
    case "xs": return "sm:max-w-xs";case "sm": return "sm:max-w-sm";case "md": return "sm:max-w-md";
    case "lg": return "sm:max-w-lg";case "xl": return "sm:max-w-xl";case "2xl": return "sm:max-w-2xl";
    case "3xl": return "sm:max-w-3xl";case "4xl": return "sm:max-w-4xl";case "5xl": return "sm:max-w-5xl";
    case "6xl": return "sm:max-w-6xl";case "7xl": return "sm:max-w-7xl";default: return "sm:max-w-2xl"
  }
})
const isCloseButton = computed<IDialog["closeButton"]>(()=>props.closeButton ?? false)
const notCloseBackground = computed<IDialog["notCloseBackground"]>(()=>props.notCloseBackground ?? false)
const withoutMargin = computed<IDialog["withoutMargin"]>(()=>props.withoutMargin ?? false)
// ---------------------------------------
const position = computed<NonNullable<IDialog["position"]>>(()=> props.position ?? "center")
const classDialog = computed<IDialog["class"]>(()=> props.class)
const enterAndLeaveClass = computed<StyleClass>(()=> {
  if (!props.notAnimate) {
    if(position.value.includes("left")){ return "-translate-x-full"}
    else if(position.value.includes("right")){ return "translate-x-full"}
    else if(position.value.includes("top")){ return "-translate-y-full"}
    else if(position.value.includes("bottom")){ return "translate-y-full"}}
  return "opacity-0"
})
const classPosition = computed<Array<string>>(()=>{
  const arrayDialog = []
  if (position.value === "center") { arrayDialog.push("top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2") }
  if(position.value.includes("bottom")) { arrayDialog.push(`bottom-0 ${withoutMargin.value?"":"mb-5"}`)
  } else if(position.value.includes("top")) { arrayDialog.push(`top-0 ${withoutMargin.value?"":"mt-5"}`)
  } else { arrayDialog.push("top-1/2 -translate-y-1/2") }
  if(position.value.includes("right")) { arrayDialog.push(`right-0 ${withoutMargin.value?"":"mr-5"}`)
  } else if(position.value.includes("left")) { arrayDialog.push(`left-0 ${withoutMargin.value?"":"ml-5"}`)
  } else { arrayDialog.push("left-1/2 -translate-x-1/2") }
  return arrayDialog
})

// ---------------------------------------
watch(isOpen,(value)=>{
  const bodyEl = document.querySelector("body")
  if (value) {
    bodyEl?.classList.add("overflow-hidden")
  } else {
    bodyEl?.classList.remove("overflow-hidden")
  }
})
// ---------------------------------------
function closeModal() {
  emit('update:modelValue', false)
}
</script>

<template>
  <Teleport :to="String(toTeleport)">
    <transition appear leave-active-class="transition-all ease-in-out duration-500" leave-from-class="translate-x-0 opacity-100" :leave-to-class="enterAndLeaveClass"
                enter-active-class="transition-all ease-in-out duration-500" :enter-from-class="enterAndLeaveClass" enter-to-class="translate-x-0 opacity-100">
      <div v-if="isOpen" class="fixed top-0 left-0 right-0 bottom-0 z-[200] w-full overflow-x-hidden overflow-y-auto inset-0 h-screen max-h-full">
        <div v-if="!notCloseBackground" class="fixed inset-0" @click="closeModal"/>
        <div :class="cn(
          'p-6 w-full max-w-xs max-h-full rounded-md bg-white dark:bg-neutral-950',
          classDialog,
          classPosition,
          size,
          'absolute overflow-auto'
          )">
          <slot :closeDialog="closeModal"></slot>
        <Button v-if="isCloseButton" mode="ghost" class="absolute top-2 right-2 px-[5px] m-1 h-9 w-9" @click="closeModal">
          <XMarkIcon aria-hidden="true" class="h-5 w-5 fill-neutral-500 dark:fill-neutral-500"/>
        </Button>
        </div>
      </div>
    </transition>
    <transition leave-active-class="transition-opacity ease-in duration-200" leave-from-class="opacity-100" leave-to-class="opacity-0"
                  enter-active-class="transition-opacity ease-in duration-200" enter-from-class="opacity-0" enter-to-class="opacity-100">
      <div v-if="isOpen" class="fixed inset-0 z-[99]">
        <slot name="background">
          <div class="fixed inset-0 bg-neutral-500/10 dark:bg-neutral-400/10 backdrop-blur-[3px]" />
        </slot>
      </div>
    </transition>
  </Teleport>
</template>