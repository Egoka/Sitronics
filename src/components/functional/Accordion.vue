<script setup lang="ts">
import type {IAccordion, IAccordionStylesClass as isClassObj} from "@/components/functional/Accordion";
import {computed, onMounted, ref, watch} from "vue";
import { ChevronDownIcon, ArrowDownCircleIcon } from '@heroicons/vue/24/outline'
import {removeParamsFromStructure} from "@/helpers/object";
import {cn} from "@/helpers/tailwind";
// ---------------------------------------
const props = defineProps<IAccordion>()
const emit = defineEmits<{
  (event: 'toggle', payload: IAccordion["dataSource"]): void;
}>();
// ---------------------------------------
const multiple = computed<NonNullable<IAccordion["multiple"]>>(()=> props.multiple ?? false)
const animationDuration = computed<NonNullable<IAccordion["animationDuration"]>>(()=> props.animationDuration ?? 300)
const typeIcon = computed<NonNullable<IAccordion["typeIcon"]>>(()=> props.typeIcon ?? "Plus")
// ---------------------------------------
const dataItems = ref<NonNullable<IAccordion["dataSource"]>>(props.dataSource?.length ? props.dataSource : [])
watch(()=> props.dataSource, (value)=>{
  dataItems.value = value ?? []
}, {deep: true})
// ---------------------------------------
function toggle(key: number) {
  if (!multiple.value && !dataItems.value[key].open)
    dataItems.value.forEach((item)=> item.open = false)
  dataItems.value[key].open = !dataItems.value[key].open
  emit("toggle", dataItems.value)
}
// ---------------------------------------
const styleIcon = ref("h-5 w-5 shrink-0 ml-8 text-slate-400 dark:text-slate-500 group-hover/item:text-slate-500 group-hover/item:dark:text-slate-400 transition-all duration-200 ease-out")
</script>

<template>
  <div :class="cn('divide-y divide-slate-200 dark:divide-slate-800', props.styles?.body, props?.class)">
    <div v-for="(item, key) in dataItems as IAccordion['dataSource']" :key="key" :class="cn('py-2',   props.styles?.item, 'group/item')">
      <h2>
        <button type="button" class="flex items-center justify-between w-full text-left font-semibold py-2" @click="toggle(key)" :aria-expanded="item.open" aria-expanded="false">
          <slot name="title" :title="item.title">
            <span :class="cn('text-slate-800 dark:text-slate-300',  props.styles?.title)">{{ item.title }}</span>
            <ChevronDownIcon v-if="typeIcon === 'ChevronDown'" aria-hidden="true" :class="cn(styleIcon, {'!rotate-180': item.open})"/>
            <ArrowDownCircleIcon v-else-if="typeIcon === 'ArrowDownCircle'" aria-hidden="true" :class="cn(styleIcon, {'!rotate-180': item.open})"/>
            <svg v-else-if="typeIcon === 'Plus'" class="fill-slate-200 dark:fill-slate-500 shrink-0 ml-8" width="10" height="10" xmlns="http://www.w3.org/2000/svg">
              <rect y="4" width="10" height="2" rx="1" class="transform origin-center transition duration-200 ease-out" :class="{'!rotate-180': item.open}"></rect>
              <rect y="4" width="10" height="2" rx="1" class="transform origin-center transition duration-200 ease-out rotate-90" :class="{'!rotate-180': item.open}"></rect>
            </svg>
          </slot>
        </button>
      </h2>
      <div
        role="region"
        :class="cn(
          'text-sm text-slate-600 dark:text-slate-400 transition-all ease-in-out',
          props.styles?.subtitle, 'grid overflow-hidden',
          item.open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0')"
        :style="`transition-duration: ${animationDuration}ms;`"
      >
        <div class="overflow-hidden">
          <slot v-if="item.template" :name="item.template" v-bind="removeParamsFromStructure(item, ['template', 'open'])"/>
          <p v-else class="pb-3" v-html="item.subtitle"/>
        </div>
      </div>
    </div>
  </div>
</template>