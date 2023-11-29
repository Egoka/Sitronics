<script setup lang="ts">
import {computed, watch} from "vue";
import Button from "@/components/functional/Button.vue";
import {XMarkIcon} from "@heroicons/vue/20/solid";
import type {StyleClass} from "@/components/BaseTypes";

// ---------------------------------------
export interface IDialog {
  modelValue: boolean
  class?: string
  size?: "size1"|"size2"|"size3"|"size4"|"size5"
  position?: "top"|"bottom"|"left"|"right"|"center"|"bottom-left"|"top-left"|"bottom-right"|"top-right"
  notAnimate?: boolean
  closeButton?: boolean
  withoutMargin?: boolean
  notCloseBackground?: boolean
  toTeleport?: string
}
// ---------------------------------------
const props = defineProps<IDialog>()
const emit = defineEmits<{
  (event: 'update:modelValue', payload: boolean): void;
}>();
// ---------------------------------------
const toTeleport = computed<IDialog["toTeleport"]>(()=>props.toTeleport ?? "body")
const isOpen = computed<boolean>(()=>props.modelValue ?? false)
const size = computed<IDialog["size"]>(()=>props.size ?? "size3")
const classSize = computed(()=>{
  switch (size.value){
    case 'size1': return "sm:max-w-[15rem]"
    case 'size2': return "sm:max-w-[20rem]"
    case 'size3': return "sm:max-w-[35rem]"
    case 'size4': return "sm:max-w-[70%]"
    case 'size5': return "sm:max-w-[90%]"
  }
})
const isCloseButton = computed<IDialog["closeButton"]>(()=>props.closeButton ?? false)
const notCloseBackground = computed<IDialog["notCloseBackground"]>(()=>props.notCloseBackground ?? false)
const withoutMargin = computed<IDialog["withoutMargin"]>(()=>props.withoutMargin ?? false)
// ---------------------------------------
const position = computed<NonNullable<IDialog["position"]>>(()=> props.position ?? "center")
const classDialog = computed<StyleClass>(()=> {
  const arrayDialog = !!props.class
    ? Array.isArray(props.class)
      ? (props.class as Array<string>).flat().map(item=>item.split(" ")).flat()
      : (props.class as string)?.split(" ")
    : [];
  [
    {reg: "^p-", class: "p-6"},
    {reg: "^w-", class: "w-full"},
    {reg: "^max-w-", class: `max-w-xs ${classSize.value}`},
    {reg: "^max-h-", class: "max-h-full"},
    {reg: "rounded-", class: "rounded-md"},
    {reg: "overflow-", class: "overflow-auto"},
    {reg: "bg-", class: "bg-white dark:bg-neutral-950"},
  ].map((item:{reg: string, class: string})=>{
    if(!arrayDialog?.some(classItem=>classItem.match(new RegExp(item.reg)))){
      arrayDialog.push(item.class)
    }
  })
  arrayDialog.push("absolute")
  if (position.value === "center") {
    arrayDialog.push("top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2")
  }
  if(position.value.includes("bottom")) { arrayDialog.push(`bottom-0 ${withoutMargin.value?"":"mb-5"}`)
  } else if(position.value.includes("top")) { arrayDialog.push(`top-0 ${withoutMargin.value?"":"mt-5"}`)
  } else { arrayDialog.push("top-1/2 -translate-y-1/2") }
  if(position.value.includes("right")) { arrayDialog.push(`right-0 ${withoutMargin.value?"":"mr-5"}`)
  } else if(position.value.includes("left")) { arrayDialog.push(`left-0 ${withoutMargin.value?"":"ml-5"}`)
  } else { arrayDialog.push("left-1/2 -translate-x-1/2") }
  return arrayDialog
})
const enterAndLeaveClass = computed<StyleClass>(()=> {
  if (!props.notAnimate) {
    if(position.value.includes("left")){ return "-translate-x-full"}
    else if(position.value.includes("right")){ return "translate-x-full"}
    else if(position.value.includes("top")){ return "-translate-y-full"}
    else if(position.value.includes("bottom")){ return "translate-y-full"}}
  return "opacity-0"
})

// ---------------------------------------
watch(isOpen,(value)=>{
  const bodyEl = document.querySelector("body")
  if (value) {
    bodyEl.classList.add("overflow-hidden")
  } else {
    bodyEl.classList.remove("overflow-hidden")
  }
})
// ---------------------------------------
function closeModal() {
  emit('update:modelValue', false)
}
</script>

<template>
  <Teleport :to="String(toTeleport)">
    <transition  appear leave-active-class="transition-all ease-in-out duration-500" leave-from-class="translate-x-0 opacity-100" :leave-to-class="enterAndLeaveClass"
                enter-active-class="transition-all ease-in-out duration-500" :enter-from-class="enterAndLeaveClass" enter-to-class="translate-x-0 opacity-100">
      <div v-if="isOpen" class="fixed top-0 left-0 right-0 bottom-0 z-[200] w-full overflow-x-hidden overflow-y-auto inset-0 h-screen max-h-full">
        <div v-if="!notCloseBackground" class="fixed inset-0" @click="closeModal"/>
        <div :class="classDialog">
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