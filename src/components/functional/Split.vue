<script setup lang="ts">
import {computed, onBeforeMount, onMounted, reactive, ref, watch} from "vue";
import {cn} from "@/helpers/tailwind";
import Icons from "@/components/functional/Icons.vue";
import type {ISplit, Panel, SizePanels} from "@/components/functional/Split";
import type {StyleClass} from "@/components/BaseTypes";
import {createLogger} from "vite";
import {lowerFirst} from "lodash";
// ---PROPS-EMITS-SLOTS-------------------
const props = defineProps<ISplit>()
// ---REF-LINK----------------------------
const resizableGroup = ref<HTMLElement>()
const resizablePanels = ref<Record<string, HTMLElement>>({})
// ---STATE-------------------------------
const sizePanels = reactive<SizePanels>({})
// ---PROPS-------------------------------
const units = computed<ISplit["units"]>(()=> props.units ?? "pixels")
const panels = computed<ISplit["panels"]>(()=> props?.panels ?? [])
const direction = computed<ISplit["direction"]>(()=> props?.direction ?? "horizontal")
const separatorType = computed<ISplit["separatorType"]>(()=>props?.separatorType ?? "strip")
const separatorNotHoverOpacity = computed<ISplit["separatorNotHoverOpacity"]>(()=>props?.separatorNotHoverOpacity)
// ---STYLE-------------------------------
const separator = computed<StyleClass>(()=> `relative flex w-px items-center justify-center bg-gray-200 dark:bg-gray-800
  touch-none select-none
  cursor-ew-resize data-[direction=vertical]:cursor-ns-resize
  after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2
  focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1
  data-[direction=vertical]:h-px data-[direction=vertical]:w-full data-[direction=vertical]:after:left-0 data-[direction=vertical]:after:h-1 data-[direction=vertical]:after:w-full data-[direction=vertical]:after:-translate-y-1/2 data-[direction=vertical]:after:translate-x-0`)
// ---EXPOSE------------------------------
// ---MOUNT-UNMOUNT-----------------------
let allSize = ref(0)
onBeforeMount(()=>{
  if (units.value === "percentages") {
    setSizePanels(panels.value)
  }
})
onMounted(()=>{
  if (units.value === "pixels") {
    setSizePanels(panels.value)
  }
  allSize.value = Object.keys(sizePanels).reduce((sum:number, item)=>sum+sizePanels[item], 0)
})
// ---WATCHERS----------------------------
// ---METHODS-----------------------------
function setItemRef(el:HTMLElement, namePanel: Panel["name"]) {
  resizablePanels.value[namePanel] = el
}
function setSizePanels (array:ISplit["panels"]) {
  const sizeSplit = units.value === "pixels" ? direction.value === "horizontal" ? resizableGroup.value?.offsetWidth ?? 0 : resizableGroup.value?.offsetHeight ?? 0 : 100
  const totalDefinedSize = panels.value.reduce((sum, item)=> sum + (item?.size && item?.size > 0 ? item?.size : 0),0)
  const countNotDefinedSize = panels.value.reduce((sum, item)=> sum + (item?.size && item?.size > 0 ? 0 : 1),0)
  const defaultSize = (sizeSplit - totalDefinedSize) / countNotDefinedSize
  Object.assign(sizePanels, Object.fromEntries(new Map(
    array.map((panel)=>[panel.name, panel.size ?? defaultSize]))))
}
// ---RESIZE-PANELS-----------------------
function resizePanel($event: MouseEvent, namePanel: Panel["name"]) {
  if (!resizableGroup.value && !resizablePanels.value[namePanel]) return
  const isHor = direction.value === "horizontal"
  const isPix = units.value === "pixels"
  const group = resizableGroup.value?.getBoundingClientRect()
  const panel = resizablePanels.value[namePanel]?.getBoundingClientRect()
  const indexNamePanel = panels.value.findIndex(item=>item.name === namePanel)
  //------------------
  let addedDistance = Math.round(isHor
    ? $event.clientX - panel.x - panel.width
    : $event.clientY - panel.y - panel.height)
  addedDistance = isPix ? addedDistance : (addedDistance / ((group?.width??0) / 100))
  const newSizePanel = sizePanels[namePanel] + addedDistance > 0 ? sizePanels[namePanel] + addedDistance : 0
  //------------------
  let sumLeftPanels = 0
  for (let i = indexNamePanel; i >= 0; i--) {
    const item = panels.value[i]
    sumLeftPanels += sizePanels[item.name]
  }
  let rightAddedDistance = addedDistance <= 0 ? sumLeftPanels + addedDistance >= 0 ? addedDistance : -sumLeftPanels : addedDistance
  for (let i = indexNamePanel + 1; i < panels.value.length; i++) {
    let newSize = sizePanels[panels.value[i].name] - rightAddedDistance
    rightAddedDistance = rightAddedDistance - sizePanels[panels.value[i].name]
    if (sumLeftPanels > 0) {
      if (rightAddedDistance <= 0) {
        sizePanels[panels.value[i].name] = newSize > 0 ? newSize : 0
      } else {
        sizePanels[namePanel] += sizePanels[panels.value[i].name]
        sizePanels[panels.value[i].name] = 0
      }
    } else if (newSizePanel > 0) {
      newSize = sizePanels[panels.value[i].name] - addedDistance
      sizePanels[panels.value[i].name] = newSize > 0 ? newSize : 0
    }
    if (newSize > 0) break
  }
  //------------------
  if (newSizePanel === 0) {
    let leftAddedDistance = - addedDistance - sizePanels[namePanel]
    for (let i = indexNamePanel - 1; i >= 0; i--) {
      const newSize = sizePanels[panels.value[i].name] - leftAddedDistance
      leftAddedDistance = leftAddedDistance - sizePanels[panels.value[i].name]
      sizePanels[panels.value[i].name] = newSize > 0 ? newSize : 0
      if (newSize > 0) break
    }
  }
  if (rightAddedDistance <= 0) sizePanels[namePanel] = newSizePanel
}
const resizablePanel = ref<Panel["name"]|null>(null)
const isStartResize = ref<boolean>(false)
const isStartMove = ref<boolean>(false)
function moveResizedPanels(ev: MouseEvent) {
  resizePanel(ev, resizablePanel.value??"");
}
function startResizePanel($event: MouseEvent, namePanel: Panel["name"]) {
  if($event.stopPropagation) $event.stopPropagation();
  if($event.preventDefault) $event.preventDefault();
  resizablePanel.value = namePanel;
  isStartResize.value = true
  window.addEventListener('mousemove', moveResizedPanels);
  window.addEventListener('mouseup', stopResizePanel);
}
function stopResizePanel($event?: MouseEvent, namePanel?: Panel["name"]) {
  isStartResize.value = false
  if (!isStartMove.value) {
    resizablePanel.value = null;
  }
  window.removeEventListener('mousemove', moveResizedPanels);
  window.removeEventListener('mouseup', stopResizePanel);
}
function moveResizePanel($event: MouseEvent, namePanel: Panel["name"]) {
  isStartMove.value = true
  if (!isStartResize.value) {
   resizablePanel.value = namePanel
  }
}
function outResizePanel($event: MouseEvent, namePanel: Panel["name"]) {
  isStartMove.value = false
  if (!isStartResize.value) {
    resizablePanel.value = null;
  }
}
</script>

<template>
  <div
    ref="resizableGroup"
    :class="cn(props?.class, 'flex h-full w-full data-[direction=vertical]:flex-col max-w-md overflow-hidden dark:text-gray-300 transition-all')"
    :data-direction="direction"
    :data-name="props.autoSaveName ?? null"
    :data-units="units ?? null">
    <template v-for="(panel, key) in panels" :key="panel.name+key">
      <div
        :ref="(el)=>setItemRef(el, panel.name)"
        class="overflow-hidden"
        :data-name="panel.name"
        :data-size="sizePanels[panel.name]"
        :style="`flex: ${units === 'percentages' ? sizePanels[panel.name] : '0'} 1 ${units === 'pixels' ? sizePanels[panel.name]+'px' : '0px'}`">
        <slot :name="panel.name"></slot>
      </div>
      <div
        v-if="key !== panels?.length-1"
        role="separator"
        tabindex="0"
        :class="cn(separator, 'group')"
        :data-direction="direction"
        data-panel-group-id=":r70:"
        data-panel-resize-handle-enabled="true"
        data-panel-resize-handle-id=":r72:"
        aria-valuemax="90"
        aria-valuemin="10"
        aria-valuenow="49"
        aria-controls="data-panel-id-:r71:"
        @mousemove="moveResizePanel($event, panel.name)"
        @mouseout="outResizePanel($event, panel.name)"
        @mousedown="startResizePanel($event, panel.name)"
        @mouseup="stopResizePanel($event, panel.name)"
      >
        <div
          v-if="separatorType === 'strip'"
          :class="cn(
            'split split absolute z-10 inset-y-0 flex items-center',
            separatorNotHoverOpacity || 'transition-opacity duration-500 opacity-0',
            separatorNotHoverOpacity || (resizablePanel === panel.name && 'opacity-100'),
            direction === 'vertical' && 'rotate-90')">
          <div :class="cn('h-8 w-1.5 bg-neutral-300 dark:bg-neutral-600','rounded-full')"></div>
        </div>
        <div v-else :class="cn(
          'z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-gray-200',
          direction === 'vertical' && 'rotate-90',
          separatorNotHoverOpacity || 'transition-opacity duration-500 opacity-0 group-hover:opacity-100')">
          <svg v-if="separatorType === 'hexagon'" width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-2.5 w-2.5">
            <path d="M5.5 4.625C6.12132 4.625 6.625 4.12132 6.625 3.5C6.625 2.87868 6.12132 2.375 5.5 2.375C4.87868 2.375 4.375 2.87868 4.375 3.5C4.375 4.12132 4.87868 4.625 5.5 4.625ZM9.5 4.625C10.1213 4.625 10.625 4.12132 10.625 3.5C10.625 2.87868 10.1213 2.375 9.5 2.375C8.87868 2.375 8.375 2.87868 8.375 3.5C8.375 4.12132 8.87868 4.625 9.5 4.625ZM10.625 7.5C10.625 8.12132 10.1213 8.625 9.5 8.625C8.87868 8.625 8.375 8.12132 8.375 7.5C8.375 6.87868 8.87868 6.375 9.5 6.375C10.1213 6.375 10.625 6.87868 10.625 7.5ZM5.5 8.625C6.12132 8.625 6.625 8.12132 6.625 7.5C6.625 6.87868 6.12132 6.375 5.5 6.375C4.87868 6.375 4.375 6.87868 4.375 7.5C4.375 8.12132 4.87868 8.625 5.5 8.625ZM10.625 11.5C10.625 12.1213 10.1213 12.625 9.5 12.625C8.87868 12.625 8.375 12.1213 8.375 11.5C8.375 10.8787 8.87868 10.375 9.5 10.375C10.1213 10.375 10.625 10.8787 10.625 11.5ZM5.5 12.625C6.12132 12.625 6.625 12.1213 6.625 11.5C6.625 10.8787 6.12132 10.375 5.5 10.375C4.87868 10.375 4.375 10.8787 4.375 11.5C4.375 12.1213 4.87868 12.625 5.5 12.625Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path>
          </svg>
          <Icons v-else :type="separatorType" :class="cn('h-2.5 w-2.5 fill-amber-300 text-gray-500', direction === 'vertical' && 'rotate-90')"/>
        </div>
      </div>
    </template>
  </div>
</template>