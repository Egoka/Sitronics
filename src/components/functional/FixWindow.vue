<script setup lang="ts">
import {computed, getCurrentInstance, ref, watch, onMounted, onUnmounted} from "vue";
import Button from "@/components/functional/Button.vue";
import {XMarkIcon} from "@heroicons/vue/20/solid";
import type {EventFixWindow, IFixWindow, IFixWindowExpose} from "@/components/functional/FixWindow";
import {cn} from "@/helpers/tailwind";
// ---PROPS-EMITS-SLOTS-------------------
const props = defineProps<IFixWindow>()
const emit = defineEmits<{
  (event: 'update:modelValue', isOpen: boolean): void
  (event: 'open', env: MouseEvent): void
  (event: 'close', env: MouseEvent): void
}>()
// ---REF-LINK----------------------------
const fixWindow = ref<Element>()
const scrollableEl = ref<Element>()
// ---STATE-------------------------------
const x = ref<number>(0)
const y = ref<number>(0)
const isOpen = ref<boolean>(false)
const timer = ref<number|null>(null)
const countTimer = ref<number>(0)
const positionMouse = ref<{x:number, y:number}>()
// ---PROPS-------------------------------
const position = computed<NonNullable<IFixWindow["position"]>>(()=>props.position ?? "top")
const delay = computed<NonNullable<IFixWindow["delay"]>>(()=>props.delay && props.delay > 0 ? props.delay : 0)
const marginPx = computed<NonNullable<IFixWindow["marginPx"]>>(()=>props.marginPx ?? 10)
const translatePx = computed<NonNullable<IFixWindow["translatePx"]>>(()=>props.translatePx ?? 0)
const eventOpen = computed<EventFixWindow>(()=>props.eventOpen ?? "hover")
const eventClose = computed<EventFixWindow>(()=> props.eventClose ?? defaultCloseEvent(eventOpen.value as EventFixWindow) ?? "hover")
const paddingWindow = computed<NonNullable<IFixWindow["paddingWindow"]>>(()=> props.paddingWindow ?? 0)
const byCursor = computed<NonNullable<IFixWindow["byCursor"]>>(()=>props.byCursor)
const isCloseButton = computed<NonNullable<IFixWindow["closeButton"]>>(()=>props.closeButton ?? false)
const element = computed<HTMLElement>(()=> {
  if (props.el) {
    if (typeof props.el === "string"){
      return document.querySelector(props.el)
    } else { return props.el}
  } else { return getCurrentInstance()?.vnode?.el?.parentElement }
})
const border = computed<string>(()=> {
  if (marginPx.value > 0){
    if (position.value.match("^(left|right)")){
      return `border-left: ${marginPx.value}px solid transparent;border-right: ${marginPx.value}px solid transparent;`
    } else if (position.value.match("^(top|bottom)")){
      return `border-top: ${marginPx.value}px solid transparent;border-bottom: ${marginPx.value}px solid transparent;`
    }
  }
  return ""
})
const mode = computed<string>(()=>{
  const baseStyle = "flex items-center px-1 border border-neutral-200 dark:border-neutral-900 text-black text-zinc-600 dark:text-zinc-400"
  switch (props.mode) {
    case "filled": return `${baseStyle} bg-stone-100 dark:bg-stone-900 rounded-md`;
    case "outlined": return `${baseStyle} bg-white dark:bg-neutral-950 rounded-md`;
    case "underlined": return `${baseStyle} bg-stone-50 dark:bg-stone-950`;
    default: return ""
  }
})
// ---EXPOSE------------------------------
defineExpose<IFixWindowExpose>({
  // ---STATE-------------------------
  x, y, isOpen,
  // ---PROPS-------------------------
  position, delay, marginPx, isCloseButton, eventOpen, eventClose, element,
  // ---METHODS-----------------------
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
watch(()=>props.scrollableEl as IFixWindow["scrollableEl"], (value)=>{
  if (value) {
    if (typeof value === "string"){
      const el = document.querySelector(value)
      if (el) scrollableEl.value = el
      addPositionListener()
    } else {
      scrollableEl.value = value
      addPositionListener()
    }
  } else { scrollableEl.value = undefined }
}, {immediate: true})
watch(()=>props.modelValue, (value)=>{
  value ? isOpen.value||open() : close()
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
    case "hover": {
      const el = byCursor.value ? fixWindow.value as HTMLElement : element.value
      el?.addEventListener("mouseleave", close);
      break
    }
    case "click": window?.addEventListener("click", closeOnClick);break
    case "mousedown": window?.addEventListener("mousedown", closeOnClick);break
    case "mouseup": window?.addEventListener("mouseup", closeOnClick);break
    case "dblclick": window?.addEventListener("dblclick", closeOnClick);break
    case "contextmenu": window?.addEventListener("contextmenu", closeOnClick);break
  }
}
function removeCloseListener() {
  switch (eventClose.value) {
    case "hover": window?.removeEventListener("mouseleave", closeOnClick);break
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
  if (byCursor.value) {
    positionMouse.value = { x: env?.x as number, y: env?.y as number }
  }
  function setIsOpen() {
    isOpen.value = true
    if (env) {
      emit('open', env)
    }
  }
  if (delay.value === 0) {
    return setIsOpen()
  }
  if (timer.value === null){
    timer.value = setInterval(() => {
      if (countTimer.value === delay.value){
        if (typeof timer.value === "number")
          clearInterval(timer.value)
        timer.value = null
        setIsOpen()
      } else { countTimer.value++ }
    }, 100);
  }
}
function close(event?:MouseEvent) {
  if (typeof timer.value === "number"){
    clearInterval(timer.value)
    timer.value = null
  }
  countTimer.value = 0
  isOpen.value = false
  if (event) emit('close', event)
}
// ---METHODS-----------------------------
function openOnContextMenu(event:MouseEvent) {
  event.preventDefault()
  open(event)
}
function closeOnClick(event:MouseEvent) {
  if (!event.composedPath().includes(element.value as HTMLElement)) {
    close(event)
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
    default: return "click"
  }
}
// ---UPDATE-POSITION---------------------
function updatePosition() {
  if (isOpen.value) {
    const body = element.value.getBoundingClientRect()
    const child = fixWindow.value?.getBoundingClientRect()
    if (body && child) {
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
        const elParent = element.value.offsetParent as HTMLElement
        const borderLeft = parseFloat(getComputedStyle(elParent).borderLeftWidth),
          borderTop = parseFloat(getComputedStyle(elParent).borderTopWidth)
        if (borderLeft > 0){
          body.x = body.x - borderLeft
        } else if (borderTop > 0){
          body.y = body.y - borderTop
        }
      }
      if (byCursor.value && typeof positionMouse.value?.x === "number" && typeof positionMouse.value?.y === "number") {
        body.x = positionMouse.value?.x as number
        body.y = positionMouse.value?.y as number
        body.width = 0
        body.height = 0
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
      x.value = Math.floor(el.xPositionIndex !== 0 || el.xValue === 0 ? el.xCenter + el.xTranslate * el.xPositionIndex : el.xValue) + el.xPositionIndex * translatePx.value
      y.value = Math.floor(el.yPositionIndex !== 0 || el.yValue === 0 ? el.yCenter + el.yTranslate * el.yPositionIndex : el.yValue) + el.yPositionIndex * translatePx.value
      //
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
}
</script>

<template>
  <transition leave-active-class="transition-opacity ease-in-out duration-300" leave-from-class="opacity-100" leave-to-class="opacity-0"
              enter-active-class="transition-opacity ease-in-out duration-300" enter-from-class="opacity-0" enter-to-class="opacity-100">
    <div
      v-show="isOpen"
      ref="fixWindow"
      :class="cn('text-neutral-800 dark:text-neutral-300', props.classBody)"
      :style="`position: fixed;left: 0px; top: 0px;transform: translate(${x}px, ${y}px);${border}`">
      <div :class="cn(mode, props.class)"><slot/></div>
      <Button v-if="isCloseButton" mode="ghost" class="absolute top-2 right-2 px-[5px] m-0.5 h-9 w-9" @click="close">
        <XMarkIcon aria-hidden="true" class="h-5 w-5 fill-neutral-500 dark:fill-neutral-500"/>
      </Button>
    </div>
  </transition>
</template>