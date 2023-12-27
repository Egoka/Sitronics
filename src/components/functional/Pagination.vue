<script setup lang="ts">
import {computed, ref} from "vue";
import {
  ArrowLongLeftIcon, ArrowLongRightIcon,
  ChevronLeftIcon, ChevronRightIcon,
  EllipsisHorizontalIcon
} from '@heroicons/vue/20/solid'
import Button from "@/components/functional/Button.vue";
import StSelect, {type IDateSelect, ISelectExpose} from "@/components/form/StSelect.vue";
import type {IMode} from "@/components/BaseTypes";
import {cn} from "@/helpers/tailwind";
// ---------------------------------------
export type Page = number
export interface IPagination {
  modelValue?: Page
  mode?: IMode
  sizePage?: number|5|15|20|50|100|150
  sizesSelector?: [5,15,20,50,100,150]|Array<number>
  visibleNumberPages?:5|6|7|8|9|10|11
  total?: number
  isInfoText?:boolean
  isPageSizeSelector?:boolean
  isHiddenNavigationButtons?:boolean
}
// ---------------------------------------
const props = defineProps<IPagination>()
const emit = defineEmits<{
  (event: 'update:modelValue', payload: IPagination["modelValue"]): void;
  (event: 'update:sizePage', payload: IPagination["modelValue"]): void;
}>();
// ---------------------------------------
const selectPageSize = ref<ISelectExpose|null>()
// ---------------------------------------
const activePage = computed<Page>(()=>props.modelValue ?? pages[0])
const sizePage = computed<IPagination["sizePage"]>(()=>props.sizePage > 0 ? props.sizePage : 5)
const visibleNumberPages = computed<IPagination["visibleNumberPages"]>(()=>(props.visibleNumberPages >= 5 ? props.visibleNumberPages : 5) ?? 5)
const total = computed<IPagination["total"]>(()=>props.total ?? 0)
const isInfoText = computed<IPagination["isInfoText"]>(()=>props.isInfoText ?? false)
const isPageSizeSelector = computed<IPagination["isPageSizeSelector"]>(()=>(props.isPageSizeSelector || !!props.sizesSelector?.length) ?? false)
const isNavigationButtons = computed<IPagination["isNavigationButtons"]>(()=>!props.isHiddenNavigationButtons ?? false)
const arraySizesSelector = computed<Array<{key:number, value: string}>>(()=>
  ((props.sizesSelector ?? [...new Set([+sizePage.value,5,15,20,50,100,150])]) as Array<number>)
    ?.sort((a, b) => a - b)
    ?.map(size=>({key: size, value: `${size} rows`})))
const pages = computed<Array<Page>>(()=> {
  const countPages = Math.ceil(total.value / sizePage.value)
  let resultArray = Array(countPages).fill(null).map((_, i) => i + 1)
  if (countPages > visibleNumberPages.value) {
    // ---------------
    let beforeCount = activePage.value - Math.floor((visibleNumberPages.value - 3) / 2)
    let afterCount = activePage.value + Math.ceil((visibleNumberPages.value - 3) / 2)
    if (!(activePage.value > 1 && beforeCount > 1)) {
      beforeCount = 1
      afterCount = afterCount + (visibleNumberPages.value - (afterCount - beforeCount+1) - 1)
    }
    if (!(activePage.value < countPages && afterCount < countPages)) {
      afterCount = countPages
      beforeCount = beforeCount - (visibleNumberPages.value - (afterCount - beforeCount+1) - 1)
    }
    resultArray = resultArray.slice(beforeCount-1, afterCount)
    // ---------------
    const first = resultArray[0], last = resultArray[resultArray.length-1]
    return [
      first !== 1  ? first-1 > 1 ? [1,0] : [1] :[],
      resultArray,
      last !== countPages  ? last + 1 < countPages ? [0, countPages]: [countPages] :[]
    ].flat()
  } else { return resultArray.length ? resultArray : [0] }
})
const mode = computed<NonNullable<IPagination["mode"]>>(()=> props.mode ?? "outlined")
const modeStyleSelect = computed<string>(()=>
  (mode.value === "filled") ? "bg-stone-100 dark:bg-stone-900" :
    (mode.value === "outlined") ? "border border-gray-300 dark:border-gray-600 bg-white dark:bg-neutral-950" :
      (mode.value === "underlined") ? "": "")
const modeStyle = computed<string>(()=>
  (mode.value === "filled") ? "bg-neutral-100 dark:bg-neutral-900 rounded-lg mx-1 mt-0 px-3.5 py-2 hover:bg-neutral-200 dark:hover:bg-neutral-800" :
    (mode.value === "outlined") ? "bg-white dark:bg-neutral-950 ring-1 ring-inset ring-neutral-300 dark:ring-neutral-700 rounded-lg mx-1 mt-0 px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-900" :
      (mode.value === "underlined") ? "border-t-2 border-transparent pt-4 px-4 hover:border-gray-300 hover:text-gray-700 dark:hover:border-gray-700 dark:hover:text-gray-300" : "")
const paramsSelect = computed<IDateSelect>(()=>({
  noQuery: true,
  classSelect: 'font-bold text-gray-600 dark:text-gray-500',
  classSelectList: 'min-w-[8rem] top-[1rem] -translate-x-[25%] -translate-y-[120%] translate(-25%, -125%)',
  dataSelect:arraySizesSelector.value
}))
// ---------------------------------------
function switchPage(value) {
  let page
  if (Array.isArray(value)){
    page = value.filter(i=>i).reduce((active, page, index, array) => {
      if (page === activePage.value) { return array[index+1] }
      return active
    }, null)
  } else { page = value }
  emit('update:modelValue', page === undefined || page === null || page <= 0 ? activePage.value : page)
}
function switchSizePage(sizePageValue) {
  emit('update:sizePage', sizePageValue)
}
</script>

<template>
  <div class="flex items-center justify-between w-full border-t border-gray-200 dark:border-gray-800 pb-3 -mt-px">
    <div :class="cn('justify-between mx-5 sm:hidden', (mode === 'outlined' || mode === 'filled') && 'pt-3', 'flex flex-1')">
      <button
        :class="cn('inline-flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors duration-300 disabled:cursor-not-allowed', modeStyle)"
        :disabled="[0, activePage].includes(pages[pages.length-1])"
        @click="switchPage(pages)">
        Previous
      </button>
      <!-- -------------------------------- -->
      <div :class="cn('flex sm:-mt-px sm:hidden px-3 text-neutral-500 font-bold', (mode === 'outlined' || mode === 'filled') ? 'pt-2' : 'pt-3')">
        <span class="text-primary-700 dark:text-primary-400">{{ activePage }}</span>
        <span class="mx-0.5">/</span>
        <span class="text-neutral-700 dark:text-neutral-400">{{ pages[pages.length-1] }}</span>
      </div>
      <!-- -------------------------------- -->
      <button
        :class="cn('inline-flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors duration-300 disabled:cursor-not-allowed', modeStyle)"
        :disabled="[0, activePage].includes(pages[pages.length-1])"
        @click="switchPage(pages)">
        Next
      </button>
    </div>
    <!-- -------------------------------- -->
    <!-- -------------------------------- -->
    <!-- -------------------------------- -->
    <div :class="cn('hidden sm:flex sm:flex-1 sm:items-center sm:justify-between', isInfoText||'flex-row-reverse')">
      <!-- -------------------------------- -->
      <div v-if="isInfoText" class="w-[7rem] md:w-[9rem] text-center -mb-4">
        <p class="text-sm text-gray-600 dark:text-gray-500">
          <span class="font-bold dark:text-gray-400">{{ sizePage * activePage + (total - sizePage * activePage < 0 ? total - sizePage * activePage : 0) }}</span>
          of
          <span class="font-bold dark:text-gray-400">{{ total }}</span>
          items
        </p>
      </div>
      <!-- -------------------------------- -->
      <nav v-if="pages.length" class="isolate inline-flex rounded-md" aria-label="Pagination" :class="cn(!(isInfoText || isPageSizeSelector)||'w-full')">
        <div :class="cn(!(isInfoText || isPageSizeSelector)||'-mt-px flex w-0 flex-1', ['outlined', 'filled'].includes(mode)&&'pt-3')">
          <button
            v-if="isNavigationButtons"
            :class="cn('inline-flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors duration-300 disabled:cursor-not-allowed', modeStyle)"
            :disabled="[0, activePage].includes(pages[0])"
            @click="switchPage(pages.slice().reverse())">
            <template v-if="isInfoText || isPageSizeSelector">
              <span class="sr-only">Previous</span>
              <ChevronLeftIcon class="h-5 w-5" aria-hidden="true" />
            </template>
            <template v-else>
              <ArrowLongLeftIcon class="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
              Previous
            </template>
          </button>
        </div>
        <div class="hidden sm:-mt-px sm:flex" :class="cn(['outlined', 'filled'].includes(mode)&&'pt-3')">
          <template v-for="(page, key) in pages" :key="`${page}-${key}`">
            <button
              v-if="page > 0" :aria-current="page === activePage ? 'page': false"
              :class="[
                'inline-flex items-center text-sm font-medium select-none transition-colors duration-300',
                page === activePage ? 'text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-400',
                (mode === 'filled') ? 'max-w-9 w-9 flex justify-center rounded-lg mx-0.5 mt-0 py-2 ' + (page === activePage ? 'bg-primary-100 dark:bg-primary-950 hover:bg-primary-200 dark:hover:bg-primary-900' : 'bg-stone-100 dark:bg-stone-900 hover:bg-neutral-200 dark:hover:bg-neutral-800') :
                (mode === 'outlined') ? 'max-w-9 w-9 flex justify-center ring-1 ring-inset rounded-lg mx-0.5 mt-0 py-2 '+ (page === activePage ? 'ring-primary-300 dark:ring-primary-700 bg-white dark:bg-neutral-950 hover:bg-primary-100 dark:hover:bg-primary-950' : 'bg-white dark:bg-neutral-950 ring-neutral-300 dark:ring-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-900') :
                (mode === 'underlined') ? 'border-t-2 px-4 pt-4 '+ (page === activePage ? 'border-primary-400 dark:border-primary-700' : 'border-transparent hover:border-gray-300 hover:text-gray-700 dark:hover:border-gray-700 dark:hover:text-gray-300'): ''
                ]"
              @click="switchPage(page)">{{ page }}</button>
            <span v-else :class="cn(['outlined', 'filled'].includes(mode) ? 'mt-0 px-2 py-2' : 'px-4 pt-5')">
              <EllipsisHorizontalIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
            </span>
          </template>
        </div>
        <div :class="cn('flex sm:-mt-px sm:hidden px-3 text-neutral-500 font-bold', ['outlined', 'filled'].includes(mode)&&'pt-2')">
          <span class="text-primary-700 dark:text-primary-400">{{ activePage }}</span><span class="mx-0.5">/</span><span class="text-neutral-700 dark:text-neutral-400">{{ pages[pages.length-1] }}</span>
        </div>
        <div :class="cn(!(isInfoText || isPageSizeSelector)||'-mt-px flex w-0 flex-1 justify-end', ['outlined', 'filled'].includes(mode)&&'pt-3')">
          <button
            v-if="isNavigationButtons"
            :class="cn('inline-flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors duration-300 disabled:cursor-not-allowed', modeStyle)"
            :disabled="[0, activePage].includes(pages[pages.length-1])"
            @click="switchPage(pages)">
            <template v-if="isInfoText || isPageSizeSelector">
              <span class="sr-only">Next</span>
              <ChevronRightIcon class="h-5 w-5" aria-hidden="true" />
            </template>
            <template v-else>
              Next
              <ArrowLongRightIcon class="ml-3 h-5 w-5 text-gray-400" aria-hidden="true" />
            </template>
          </button>
        </div>
      </nav>
      <!-- -------------------------------- -->
      <div
        v-if="isPageSizeSelector"
        :class="cn('md:mr-5 pl-2 rounded-md flex items-center -mb-3 cursor-pointer', isInfoText||'mx-5', modeStyleSelect)"
        @click="selectPageSize?.openSelect()">
        <p class="text-sm text-gray-400 dark:text-gray-500">Show:</p>
        <StSelect
          ref="selectPageSize"
          :class="cn((mode === 'outlined') ? 'border-none' : (mode === 'underlined') ? '!bg-transparent': '')"
          :class-body="['m-0 min-w-[6rem] max-w-[6rem]']"
          :mode="mode"
          :model-value="sizePage"
          :params-select="paramsSelect"
          @update:model-value="switchSizePage">
        </StSelect>
      </div>
    </div>
  </div>
</template>