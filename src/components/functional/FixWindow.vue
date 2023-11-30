<script setup lang="ts">
import {computed, getCurrentInstance, ref, watch, onMounted, onUnmounted} from "vue";
import type {Ref, UnwrapRef} from "vue";
import type {Position} from "@/components/BaseTypes";
import Button from "@/components/functional/Button.vue";
import {XMarkIcon} from "@heroicons/vue/20/solid";
// ---------------------------------------
export type EventFixWindow = "hover"|"click"|"dblclick"|"contextmenu"
type Event = {
  eventOpen?: EventFixWindow
  eventClose?: EventFixWindow
}
export interface IFixWindow {
  modelValue?: boolean
  el?: string|Element
  position?: Position
  eventOpen?: EventFixWindow
  eventClose?: EventFixWindow
  delay?: number|1|5|10|15|20
  marginPx?: number|2|5|10
  closeButton?: boolean
}
// ---PROPS-EMITS-SLOTS-------------------
const props = defineProps<IFixWindow>()
const emit = defineEmits<{
  (event: 'update:modelValue', payload: boolean): void;
}>()
// ---REF-LINK----------------------------
const fixWindow = ref<HTMLElement>()
// ---STATE-------------------------------
const x = ref<number>(0)
const y = ref<number>(0)
const isOpen = ref<boolean>(false)
const timer = ref<number|null>(null)
const countTimer = ref<number>(1)
// ---PROPS-------------------------------
const position = computed<NonNullable<IFixWindow["position"]>>(()=>props.position ?? "top")
const delay = computed<NonNullable<IFixWindow["delay"]>>(()=>props.delay ?? 1)
const marginPx = computed<NonNullable<IFixWindow["marginPx"]>>(()=>props.marginPx ?? 10)
const isCloseButton = computed<NonNullable<IFixWindow["isCloseButton"]>>(()=>props.closeButton ?? false)
const eventOpen = computed<EventFixWindow>(()=>props.eventOpen ?? "hover")
const eventClose = computed<EventFixWindow>(()=> props.eventClose ?? defaultCloseEvent(props.eventOpen as EventFixWindow) ?? "hover")
const element = computed<HTMLElement>(()=> {
  if (props.el) {
    if (typeof props.el === "string"){
      return document.querySelector(props.el)
    } else { return props.el}
  } else { return getCurrentInstance()?.vnode?.el?.parentElement }
})
// ---EXPOSE------------------------------
export interface IFixWindowExpose {
  //---STATE-------------------------
  x: Readonly<Ref<UnwrapRef<number>>>
  y: Readonly<Ref<UnwrapRef<number>>>
  isOpen: Readonly<Ref<UnwrapRef<boolean>>>
  // ---PROPS-------------------------------
  position: Readonly<Ref<UnwrapRef<IFixWindow["position"]>>>
  delay: Readonly<Ref<UnwrapRef<IFixWindow["delay"]>>>
  marginPx: Readonly<Ref<UnwrapRef<IFixWindow["marginPx"]>>>
  isCloseButton: Readonly<Ref<UnwrapRef<IFixWindow["isCloseButton"]>>>
  eventOpen: Readonly<Ref<UnwrapRef<EventFixWindow>>>
  eventClose: Readonly<Ref<UnwrapRef<EventFixWindow>>>
  element: Readonly<Ref<UnwrapRef<HTMLElement>>>
  // ---METHODS-----------------------------
  open():void
  close():void
  updatePosition():void
}
defineExpose<IFixWindowExpose>({
  //---STATE-------------------------
  x, y, isOpen,
  // ---PROPS-------------------------------
  position, delay, marginPx, isCloseButton, eventOpen, eventClose, element,
  // ---METHODS-----------------------------
  open, close, updatePosition
})
// ---MOUNT-UNMOUNT-----------------------
onMounted(()=>{
  if (element.value){
    addOpenListener()
    addCloseListener()
    addPositionListener()
  }
})
onUnmounted(()=>{
  removeOpenListener()
  removeCloseListener()
  removePositionListener()
})
// ---WATCHERS----------------------------
watch(()=>props.modelValue, (value)=>{
  value ? isOpen.value||open() : !isOpen.value||close()
},{immediate: true})
watch(isOpen, (value:boolean)=>{
  if (value) {
    setTimeout(()=> {
      removeOpenListener()
      addCloseListener()
      updatePosition()
    }, 10)
  } else {
    setTimeout(()=> {
      addOpenListener()
      removeCloseListener()
    }, 10)
  }
  emit('update:modelValue', value)
},{immediate: true})
// ---SET-LISTENER--------------------------
function addOpenListener() {
  switch (eventOpen.value) {
    case "hover": element.value?.addEventListener("mouseover", open);break
    case "click": element.value?.addEventListener("click", open);break
    case "dblclick": element.value?.addEventListener("dblclick", open);break
    case "contextmenu": element.value?.addEventListener("contextmenu", openOnContextMenu);break
  }
}
function removeOpenListener() {
  switch (eventOpen.value) {
    case "hover": element.value?.removeEventListener("mouseover", open);break
    case "click": element.value?.removeEventListener("click", open);break
    case "dblclick": element.value?.removeEventListener("dblclick", open);break
    case "contextmenu": element.value?.removeEventListener("contextmenu", openOnContextMenu);break
  }
}
function addCloseListener() {
  switch (eventClose.value) {
    case "hover": element.value?.addEventListener("mouseleave", close);break
    case "click": window?.addEventListener("click", closeOnClick);break
    case "dblclick": window?.addEventListener("dblclick", closeOnClick);break
    case "contextmenu": window?.addEventListener("contextmenu", closeOnClick);break
  }
}
function removeCloseListener() {
  switch (eventClose.value) {
    case "hover": element.value?.removeEventListener("mouseleave", close);break
    case "click": window?.removeEventListener("click", closeOnClick);break
    case "dblclick": window?.removeEventListener("dblclick", closeOnClick);break
    case "contextmenu": window?.removeEventListener("contextmenu", closeOnClick);break
  }
}
function addPositionListener() {
  window.addEventListener("scroll", updatePosition);
  window.addEventListener('resize', updatePosition);
}
function removePositionListener() {
  window.removeEventListener("scroll", updatePosition);
  window.removeEventListener('resize', updatePosition);
}
// ---OPEN-CLOSE--------------------------
function open() {
  if (timer.value === null){
    timer.value = setInterval(() => {
      if (countTimer.value === delay.value){
        clearInterval(timer.value as number)
        timer.value = null
        isOpen.value = true
      } else { countTimer.value++ }
    }, 100);
  }
}
function close() {
  if (timer.value){
    clearInterval(timer.value as number)
    timer.value = null
  }
  countTimer.value = 1
  isOpen.value = false
}
// ---METHODS-----------------------------
function openOnContextMenu(evt) {
  evt.preventDefault()
  open()
}
function closeOnClick(evt) {
  if (!evt.composedPath().includes(element.value as HTMLElement)) {
    close()
  }
}
function defaultCloseEvent(event:EventFixWindow):EventFixWindow {
  switch (event) {
    case "hover": return "hover"
    case "click": return "click"
    case "dblclick": return "click"
    case "contextmenu": return "click"
  }
}
// ---UPDATE-POSITION---------------------
function updatePosition() {
  if (isOpen.value) {
    const paddingBody = 0
    const body = element.value.getBoundingClientRect()
    const tooltipRect = fixWindow.value?.getBoundingClientRect()
    x.value = body.x + (body.width - tooltipRect.width)/2
    y.value = body.y + (body.height - tooltipRect.height)/2
    x.value = x.value + (body.width/2 + tooltipRect.width/2 + paddingBody)*
      (position.value.match("left") ? - 1 : position.value.match("right") ? 1 : 0)
    y.value = y.value + (body.height/2 + tooltipRect.height/2 + paddingBody)*
      (position.value.match("top") ? - 1 : position.value.match("bottom") ? 1 : 0)
    if (x.value < 0){ x.value = body.x+body.width+paddingBody }
    if (window.innerWidth - (x.value + tooltipRect.width) < 0){ x.value = body.x - (paddingBody + tooltipRect.width)}
    if (y.value < 0){ y.value = body.y+body.height+paddingBody }
    if (window.innerHeight - (y.value + tooltipRect.height) < 0){ y.value = body.y - (paddingBody + tooltipRect.height)}
  }
}
</script>

<template>
  <transition leave-active-class="transition-opacity ease-in-out duration-300" leave-from-class="opacity-100" leave-to-class="opacity-0"
              enter-active-class="transition-opacity ease-in-out duration-300" enter-from-class="opacity-0" enter-to-class="opacity-100">
  <div v-if="isOpen" ref="fixWindow" :style="`position: fixed;left: 0px; top: 0px;transform: translate(${x}px, ${y}px);border: ${marginPx}px solid transparent;`">
    <slot/>
    <Button v-if="isCloseButton" mode="ghost" class="absolute top-2 right-2 px-[5px] m-0.5 h-9 w-9" @click="close">
      <XMarkIcon aria-hidden="true" class="h-5 w-5 fill-neutral-500 dark:fill-neutral-500"/>
    </Button>
  </div>
  </transition>
</template>