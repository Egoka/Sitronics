<script setup lang="ts">
import {getCurrentInstance, computed, ref, onMounted, onUnmounted, watch} from "vue";
// ---------------------------------------
export interface ITooltip {
  el?: string|Element
  delay?: number|5|10|15|20
  position?: "top"|"bottom"|"left"|"right"|"center"|"left-bottom"|"left-top"|"right-bottom"|"right-top"
  class?: string| Array<string>
}
// ---------------------------------------
const props = defineProps<ITooltip>()
// ---------------------------------------
const tooltip = ref<HTMLElement>()
const isVisibleHelp = ref<boolean>()
// ---------------------------------------
const delay = ref<NonNullable<ITooltip["delay"]>>(props.delay || 10)
const position = ref<NonNullable<ITooltip["position"]>>(props.position || "top")
const element = computed<HTMLElement>(()=> {
  if (props.el) {
    if (typeof props.el === "string"){
      return document.querySelector(props.el)
    } else { return props.el}
  } else { return getCurrentInstance()?.vnode?.el?.parentElement }
})
const classTooltip = computed<Array<string>>(()=> {
  const arrayClasses = !!props.class
    ? Array.isArray(props.class)
      ? (props.class as Array<string>).flat().map(item=>item.split(" ")).flat()
      : (props.class as string)?.split(" ")
    : [];
  [{reg: "text-", class: "text-sm text-neutral-800 dark:text-neutral-300"},
    {reg: "bg-", class: "bg-neutral-100/30 dark:bg-neutral-800/30"},
    {reg: "backdrop-", class: "backdrop-blur-[3px]"},
    {reg: "px-", class: "px-2"},
    {reg: "py-", class: "py-1"},
    {reg: "rounded-", class: "rounded-md"}
  ].map((item:{reg: string, class: string})=>{
    if(!arrayClasses?.some(classItem=>classItem.match(new RegExp(item.reg)))){
      arrayClasses.push(item.class)
    }
  })
  arrayClasses.push("fixed min-w-max z-10 overflow-hidden select-none")
  return arrayClasses
})
// ---------------------------------------
onMounted(()=>{
  if (element.value){
    element.value?.addEventListener("mouseover", inHover)
    element.value?.addEventListener("mouseout", outHover)
    window.addEventListener("scroll", update);
    window.addEventListener('resize', update);
  }
})
onUnmounted(()=>{
  outHover()
  element.value?.removeEventListener("mouseover", inHover)
  element.value?.removeEventListener("mouseout", outHover)
  window.removeEventListener("scroll", update);
  window.removeEventListener('resize', update);
})
watch(isVisibleHelp, (value)=>{
  if (value){
    setTimeout(()=>update(), 10)
  }
})
// ---------------------------------------
let timer = <number|null>null
const countTimer = ref<number>(1)
function inHover () {
  if (timer === null){
    timer = setInterval(() => {
      if (countTimer.value === delay.value){
        isVisibleHelp.value = true
      } else { countTimer.value++ }
    }, 100);
  }
}
function outHover() {
  if (timer){
    clearInterval(timer)
    timer = null
  }
  countTimer.value = 1
  isVisibleHelp.value = false
}
// ---------------------------------------
const x = ref<number>(0)
const y = ref<number>(0)
function update() {
  if (timer !== null || countTimer.value > 1){
    const paddingBody = 2
    const body = element.value.getBoundingClientRect()
    const tooltipRect = tooltip.value?.getBoundingClientRect()
    x.value = body.x + (body.width - tooltipRect.width)/2
    y.value = body.y + (body.height - tooltipRect.height)/2
    x.value = x.value + (body.width/2 + tooltipRect.width/2 + paddingBody)*
      (position.value.match("left") ? -1 : position.value.match("right") ? 1 : 0)
    y.value = y.value + (body.height/2 + tooltipRect.height/2 + paddingBody)*
      (position.value.match("top") ? -1 : position.value.match("bottom") ? 1 : 0)
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
    <div v-if="isVisibleHelp" ref="tooltip" :class="classTooltip" :style="`left: 0px; top: 0px;transform: translate(${x}px, ${y}px);`"><slot/></div>
  </transition>
</template>