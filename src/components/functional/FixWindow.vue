<script setup lang="ts">
import {computed, getCurrentInstance, ref, watch, onMounted, onUnmounted} from "vue";
import type {Ref, UnwrapRef} from "vue";
import Button from "@/components/functional/Button.vue";
import {XMarkIcon} from "@heroicons/vue/20/solid";
import type {StyleClass} from "@/components/BaseTypes";
// ---------------------------------------
export type EventFixWindow = "hover"|"click"|"mousedown"|"mouseup"|"dblclick"|"contextmenu"
export interface IFixWindow {
  modelValue?: boolean
  el?: string|HTMLElement
  scrollableEl?: string|HTMLElement
  position?:
    "center"|"center-top"  |"center-bottom"|"center-right"|"center-left"|
    "top"   |"top-right"   |"top-left"|
    "bottom"|"bottom-right"|"bottom-left"|
    "right" |"right-top"   |"right-bottom"|
    "left"  |"left-top"    |"left-bottom"
  class?: StyleClass
  eventOpen?: EventFixWindow
  eventClose?: EventFixWindow
  delay?: number|1|5|10|15|20
  marginPx?: number|2|5|10
  closeButton?: boolean
  paddingWindow?: number|0
}
// ---PROPS-EMITS-SLOTS-------------------
const props = defineProps<IFixWindow>()
const emit = defineEmits<{
  (event: 'update:modelValue', isOpen: boolean): void
  (event: 'open', env: MouseEvent): void
  (event: 'close', env: MouseEvent): void
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
const paddingWindow = computed<NonNullable<IFixWindow["paddingWindow"]>>(()=> props.paddingWindow ?? 0)
const element = computed<HTMLElement>(()=> {
  if (props.el) {
    if (typeof props.el === "string"){
      return document.querySelector(props.el)
    } else { return props.el}
  } else { return getCurrentInstance()?.vnode?.el?.parentElement }
})
const scrollableEl = computed<HTMLElement>(() => {
  if (props.scrollableEl) {
    if (typeof props.scrollableEl === "string"){
      return document.querySelector(props.scrollableEl)
    } else { return props.scrollableEl}
  } else { return element.value.offsetParent as HTMLElement }
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
    case "mousedown": element.value?.addEventListener("mousedown", open);break
    case "mouseup": element.value?.addEventListener("mouseup", open);break
    case "dblclick": element.value?.addEventListener("dblclick", open);break
    case "contextmenu": element.value?.addEventListener("contextmenu", openOnContextMenu);break
  }
}
function removeOpenListener() {
  switch (eventOpen.value) {
    case "hover": element.value?.removeEventListener("mouseover", open);break
    case "click": element.value?.removeEventListener("click", open);break
    case "mousedown": element.value?.removeEventListener("mousedown", open);break
    case "mouseup": element.value?.removeEventListener("mouseup", open);break
    case "dblclick": element.value?.removeEventListener("dblclick", open);break
    case "contextmenu": element.value?.removeEventListener("contextmenu", openOnContextMenu);break
  }
}
function addCloseListener() {
  switch (eventClose.value) {
    case "hover": element.value?.addEventListener("mouseleave", close);break
    case "click": window?.addEventListener("click", closeOnClick);break
    case "mousedown": window?.addEventListener("mousedown", closeOnClick);break
    case "mouseup": window?.addEventListener("mouseup", closeOnClick);break
    case "dblclick": window?.addEventListener("dblclick", closeOnClick);break
    case "contextmenu": window?.addEventListener("contextmenu", closeOnClick);break
  }
}
function removeCloseListener() {
  switch (eventClose.value) {
    case "hover": element.value?.removeEventListener("mouseleave", close);break
    case "click": window?.removeEventListener("click", closeOnClick);break
    case "mousedown": window?.removeEventListener("mousedown", closeOnClick);break
    case "mouseup": window?.removeEventListener("mouseup", closeOnClick);break
    case "dblclick": window?.removeEventListener("dblclick", closeOnClick);break
    case "contextmenu": window?.removeEventListener("contextmenu", closeOnClick);break
  }
}
function addPositionListener() {
  if(scrollableEl.value) { (scrollableEl.value as HTMLElement).addEventListener("scroll", updatePosition) }
  window.addEventListener("scroll", updatePosition)
  if(scrollableEl.value) { (scrollableEl.value as HTMLElement).addEventListener('resize', updatePosition) }
  window.addEventListener('resize', updatePosition)
}
function removePositionListener() {
  if(scrollableEl.value) { (scrollableEl.value as HTMLElement).removeEventListener("scroll", updatePosition) }
  window.removeEventListener("scroll", updatePosition)
  if(scrollableEl.value) { (scrollableEl.value as HTMLElement).removeEventListener('resize', updatePosition) }
  window.removeEventListener('resize', updatePosition)
}
// ---OPEN-CLOSE--------------------------
function open(env?:MouseEvent) {
  if (timer.value === null){
    timer.value = setInterval(() => {
      if (countTimer.value === delay.value){
        clearInterval(timer.value as number)
        timer.value = null
        isOpen.value = true
        if (env) {
          emit('open', env)
        }
      } else { countTimer.value++ }
    }, 100);
  }
}
function close(env?:MouseEvent) {
  if (timer.value){
    clearInterval(timer.value as number)
    timer.value = null
  }
  countTimer.value = 1
  isOpen.value = false
  if (env) {
    emit('close', env)
  }
}
// ---METHODS-----------------------------
function openOnContextMenu(evt) {
  evt.preventDefault()
  open()
}
function closeOnClick(evt) {
  if (!evt.composedPath().includes(element.value as HTMLElement)) {
    close(evt)
  }
}
function defaultCloseEvent(event:EventFixWindow):EventFixWindow {
  switch (event) {
    case "hover": return "hover"
    case "click": return "click"
    case "mousedown": return "mousedown"
    case "mouseup": return "mouseup"
    case "dblclick": return "click"
    case "contextmenu": return "click"
  }
}
// ---UPDATE-POSITION---------------------
function updatePosition() {
  if (isOpen.value) {
    const body = element.value.getBoundingClientRect()
    const child = fixWindow.value?.getBoundingClientRect()
    const el = <{
      xCenter:number,
      yCenter:number,
      xTranslate: number
      yTranslate: number
      xValue:number
      yValue:number
      xPositionIndex: 0 | 1 | -1
      yPositionIndex: 0 | 1 | -1
    }>{}
    if (["absolute", "fixed"].includes(getComputedStyle(element.value.offsetParent as HTMLElement).position)) {
      const parent = (element.value.offsetParent as HTMLElement)?.getBoundingClientRect()
      body.x = body.x - parent.x
      body.y = body.y - parent.y
    }
    //
    el.xCenter = body.x + (body.width - child.width)/2
    el.yCenter = body.y + (body.height - child.height)/2
    //
    el.xTranslate = body.width/2 + child.width/2
    el.yTranslate = body.height/2 + child.height/2
    //
    el.xPositionIndex = position.value.match("^left") ? -1 : position.value.match("^right") ? 1 : 0
    el.yPositionIndex = position.value.match("^top") ? -1 : position.value.match("^bottom") ? 1 : 0
    //
    el.xValue = position.value.match("-left$") ? body.x : position.value.match("-right$") ? body.x + body.width - child.width : 0
    el.yValue = position.value.match("-top$") ? body.y : position.value.match("-bottom$") ? body.y + body.height - child.height : 0
    //
    x.value = Math.floor(el.xPositionIndex !== 0 || el.xValue === 0 ? el.xCenter + el.xTranslate * el.xPositionIndex  : el.xValue)
    y.value = Math.floor(el.yPositionIndex !== 0 || el.yValue === 0 ? el.yCenter + el.yTranslate * el.yPositionIndex  : el.yValue)
    
    if (x.value < paddingWindow.value){
      x.value = body.width + body.x - paddingWindow.value > 0
        ? position.value.match("^left")
          ? body.x + body.width
          : paddingWindow.value
        : body.width + body.x }
    if (y.value < paddingWindow.value){
      y.value = body.height + body.y - paddingWindow.value > 0
        ? position.value.match("^top")
          ? body.y + body.height
          : paddingWindow.value
        : body.height + body.y }
    if (window.innerWidth - (x.value + child.width) < paddingWindow.value){
      x.value = body.x > window.innerWidth - paddingWindow.value
        ? body.x - child.width
        : position.value.match("^right")
          ? body.x - child.width
          : window.innerWidth - paddingWindow.value - child.width}
    if (window.innerHeight - (y.value + child.height) < paddingWindow.value){
      y.value = body.y > window.innerHeight - paddingWindow.value
        ? body.y - child.height
        : position.value.match("^bottom")
          ? body.y - child.height
          : window.innerHeight - paddingWindow.value - child.height}
  }
}
</script>

<template>
  <transition leave-active-class="transition-opacity ease-in-out duration-300" leave-from-class="opacity-100" leave-to-class="opacity-0"
              enter-active-class="transition-opacity ease-in-out duration-300" enter-from-class="opacity-0" enter-to-class="opacity-100">
  <div v-show="isOpen" ref="fixWindow" :class="props.class" :style="`position: fixed;left: 0px; top: 0px;transform: translate(${x}px, ${y}px);border: ${marginPx}px solid transparent;`">
    <slot/>
    <Button v-if="isCloseButton" mode="ghost" class="absolute top-2 right-2 px-[5px] m-0.5 h-9 w-9" @click="close">
      <XMarkIcon aria-hidden="true" class="h-5 w-5 fill-neutral-500 dark:fill-neutral-500"/>
    </Button>
  </div>
  </transition>
</template>