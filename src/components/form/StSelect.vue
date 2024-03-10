<script setup lang="ts">
import {computed, getCurrentInstance, ref, watch, useSlots, onMounted} from "vue";
import InputLayout from "@/components/functional/InputLayout.vue";
import {CheckIcon, MagnifyingGlassIcon, FunnelIcon} from "@heroicons/vue/20/solid";
import StInput from "@/components/form/StInput.vue";
import LD from "lodash";
import gsap from 'gsap'
import Badge from "@/components/functional/Badge.vue";
import FixWindow from "@/components/functional/FixWindow.vue";
import {cn} from "@/helpers/tailwind";
import type {BaseDataItem, IDataItem, IDateSelect, ISelect, ISelectExpose} from "@/components/form/StSelect";
import type {ILayout} from "@/components/functional/InputLayout";
// ---------------------------------------
const props = defineProps<ISelect>()
// ---------------------------------------
const emit = defineEmits<{
  (event: 'update:isInvalid', payload: ISelect["isInvalid"]): void;
  (event: 'update:modelValue', selectValue: ISelect["modelValue"] | null, selectItem?: Array<any>): void;
  (event: 'change:modelValue', selectValue: ISelect["modelValue"] | null, selectItem?: Array<any>): void;
  (event: 'isActive', payload: boolean): void;
}>()
const slots = useSlots()
defineExpose<ISelectExpose>({focusSelect, openSelect, closeSelect, select})
// ---------------------------------------
const selectBody = ref<HTMLElement>()
const selectList = ref<HTMLElement>()
const selectSearch = ref<HTMLElement>()
const query = ref<string>("")
const isOpenList = ref<boolean>(false)
const classLayout =  ref<ILayout["class"]>()
// ---------------------------------------
const value = ref<ISelect["modelValue"]>()
watch(()=>props.modelValue,()=>{
  value.value = props.modelValue ?? ""
},{immediate: true})
// ---------------------------------------
const id = ref(props.id ?? getCurrentInstance()?.uid)
const visibleValue = ref<Array<any>>([])
const valueKeys = computed<Array<any>>(()=> {
  return keySelect.value
    ? visibleValue.value.map(item => item[keySelect.value as string])
    : []
})
const keySelect = computed<IDateSelect["keySelect"] | null>(()=> {
  if (props?.dataSelect && props?.dataSelect.length) {
    if (typeof props?.dataSelect[0] === "object") {
      if (props?.keySelect && Object.keys(props?.dataSelect[0]).includes(props.keySelect)) {
        return props.keySelect
      } else { return Object.keys(props.dataSelect[0])[0] }
    } else { return "id" }
  } else { return null }
})
const valueSelect = computed<IDateSelect["valueSelect"] | null>(()=> {
  if (props?.dataSelect && props?.dataSelect.length) {
    if (typeof props?.dataSelect[0] === "object") {
      if (props?.valueSelect && Object.keys(props?.dataSelect[0]).includes(props.valueSelect)) {
        return props?.valueSelect
      } else { return Object.keys(props?.dataSelect[0])[1] }
    } else { return "value" }
  } else { return null }
})
const dataSelect = computed<IDateSelect["dataSelect"]>(()=> (
  !!keySelect.value && !!valueSelect.value
  ? (props?.dataSelect as Array<IDataItem>).map(item=>({
    [(keySelect.value as string)]: typeof item === "object" ? item[(keySelect.value as string)] : item,
    [(valueSelect.value as string)]: typeof item === "object" ? item[(valueSelect.value as string)] : item
  }))
  : props?.dataSelect)|| [])
const autoFocus = computed<NonNullable<IDateSelect["autoFocus"]>>(()=> props?.autoFocus ?? false)
const mode = computed<NonNullable<ILayout["mode"]>>(()=> props.mode ?? "outlined")
const isDisabled = computed<NonNullable<ILayout["disabled"]>>(()=> props.disabled ?? false)
const isLoading = computed<NonNullable<ILayout["isInvalid"]>>(()=> props.loading ?? false)
const isInvalid = computed<NonNullable<ILayout["isInvalid"]>>(()=> props.isInvalid ?? false)
const messageInvalid = computed<ILayout["messageInvalid"]>(()=> props.messageInvalid)
const isValue = computed<boolean>(()=> Boolean(isMultiple.value ? value.value ? String(value.value).length : value.value : value.value ?? isOpenList.value))
const isMultiple = computed<NonNullable<IDateSelect["multiple"]>>(()=> props?.multiple ?? false)
const maxVisible = computed<IDateSelect["maxVisible"]|undefined>(()=> props?.maxVisible)
const noData = computed<NonNullable<IDateSelect["noData"]>>(()=> props?.noData ?? "Нет данных")
const isQuery = computed<NonNullable<IDateSelect["noQuery"]>>(()=> !props?.noQuery)
const classMaskQuery = computed<NonNullable<IDateSelect["classMaskQuery"]>>(()=> props?.classMaskQuery ?? "font-bold text-theme-700 dark:text-theme-300")
const paramsFixWindow = computed<NonNullable<IDateSelect["paramsFixWindow"]>>(()=> ({
  position: "bottom-left", eventOpen: "click", eventClose: "hover", marginPx: 5, ...props?.paramsFixWindow
}))
// ---------------------------------------
const valueLayout = computed<string|null>(()=> {
  return valueSelect.value
    ? visibleValue.value?.map(item => item[valueSelect.value as string])?.join(", ")
    : null
})
// ---------------------------------------
const inputLayout = computed(()=>{ return {isValue: isValue.value, mode: mode.value, classBody: props.classBody, class: props.class,
  label: props.label, labelMode: props.labelMode, isInvalid: isInvalid.value, messageInvalid: messageInvalid.value,
  required: props.required, loading: isLoading.value, disabled: isDisabled.value, help: props.help, clear: props.clear}})
// ---------------------------------------
onMounted(()=>{
  if (autoFocus.value) { openSelect() }
})
// ---------------------------------------
watch(isOpenList, (value)=>{
  if (value) {
    document.addEventListener("keydown", keydownSelect)
  } else {
    document.removeEventListener("keydown", keydownSelect)
  }
  focusSelect(value)
  emit('isActive', value)
})
watch(value, ()=>{
  if (dataSelect.value && value.value && keySelect.value) {
    if (isMultiple.value) {
      visibleValue.value = dataSelect.value
        .filter(item=> {
          return Array.isArray(value.value)
            ? value.value?.includes((typeof item === 'object' ? item[keySelect.value as string] : item))
            : (typeof item === 'object' ? item[keySelect.value as string] : item) === value.value
        })
    } else {
      const result = dataSelect.value
        ?.find(item=>Array.isArray(value.value)
          ? value.value?.includes((typeof item === 'object' ? item[keySelect.value as string] : item))
          : (typeof item === 'object' ? item[keySelect.value as string] : item) === value.value)
      visibleValue.value = result ? [result] : []
    }
  } else { visibleValue.value = [] }
}, { immediate: true })
// ---------------------------------------
function keydownSelect(evt:KeyboardEvent){
  let isEscape = false;
  if ("key" in evt) { isEscape = (evt.key === "Escape" || evt.key === "Esc") }
  if (isEscape) { isOpenList.value = false
  } else { selectSearch.value?.focus() }
}
// ---------------------------------------
function focusSelect(isFocus:boolean) {
  classLayout.value = (props.class??"")+(isFocus ? " border-theme-600 dark:border-theme-700 ring-2 ring-inset ring-theme-600 dark:ring-theme-700": "")
}
function openSelect() {
  if (isDisabled.value) { return }
  isOpenList.value = true
}
function closeSelect(evt:MouseEvent) {
  if (isOpenList.value && selectBody.value && selectList) {
    isOpenList.value = evt.composedPath().includes(selectBody.value as HTMLElement) || evt.composedPath().includes(selectList.value as HTMLElement)
    if (isOpenList.value === false) {
      emit('change:modelValue', value.value, visibleValue.value)
    }
  }
}
// ---------------------------------------
function select(selectValue:BaseDataItem|null) {
  if (selectValue && keySelect.value) {
    keySelect.value
    const index = visibleValue.value.findIndex(value=>value[keySelect.value as string] === (typeof selectValue === "object" ? selectValue[keySelect.value as string]: selectValue))
    if (index >= 0) {
      visibleValue.value.splice(index, 1)
    } else {
      if (!isMultiple.value) { visibleValue.value = [] }
      visibleValue.value.push(selectValue)
    }
  } else { visibleValue.value = [] }
  value.value = valueKeys.value.length ? isMultiple.value ? valueKeys.value : valueKeys.value[0] : null
  emit('update:isInvalid', false)
  emit('update:modelValue', value.value, visibleValue.value)
}
// ---------------------------------------
const dataList = computed<Array<any>>(()=> {
  if (dataSelect.value?.length && valueSelect.value && isQuery.value) {
    return LD.map(
      LD.filter(dataSelect.value, item => String((typeof item === "object" ? item[valueSelect.value as string] : item)).toLowerCase().includes(query.value.toLowerCase())),
      (item: any) => {
        item.marker = query.value.length
          ? String(item[valueSelect.value as string]).replace(new RegExp(query.value, "gi"), `<span class="${classMaskQuery.value}">$&</span>`)
          : String(item[valueSelect.value as string])
        return item
      })
  } else { return dataSelect.value ?? [] }
})
// ---------------------------------------
function onBeforeEnter(el:any) {
  el.style.opacity = 0
  el.style.height = 0
}
function onEnter(el:any, done:any) {
  gsap.to(el, {
    opacity: 1,
    height: '38px',
    delay: el.dataset.index * (dataList.value?.length >= 80 ? 0 : 0.01),
    onComplete: done
  })
}
const delay = computed<number>(():number=> {
  const d = dataSelect.value?.length
  if (!d) return 0
  if (d>=0 && d<10) { return 0.15
  } else if (d>=10 && d<30) { return 0.05
  } else if (d>=30 && d<80) { return 0.01
  } return 0
})
function onLeave(el:any, done:any) {
  gsap.to(el, {
    opacity: 0,
    height: 0,
    delay: el.dataset.index * delay.value,
    onComplete: done
  })
}
</script>
<template>
  <InputLayout
    :value="valueLayout"
    :class="classLayout"
    v-bind="inputLayout"
    @clear="select(null)">
    <div ref="selectBody" tabindex="0"
         :class="cn('selectBody w-full min-h-[36px] max-h-16 focus:outline-0 focus:ring-0',
            props?.classSelect,
            'classSelect flex overflow-auto cursor-pointer'
            )"
         @focusin="focusSelect(true)"
         @focusout="focusSelect(false)"
         @click="openSelect">
      <div class="flex items-center flex-wrap">
        <template v-if="isMultiple">
          <transition-group leave-active-class="transition ease-in-out duration-300" leave-from-class="opacity-100 translate-x-0" leave-to-class="opacity-0 -translate-x-5"
                            enter-active-class="transition ease-in-out duration-300" enter-from-class="opacity-0 -translate-x-5" enter-to-class="opacity-100 translate-x-0">
            <div v-for="item in typeof maxVisible === 'number' ? visibleValue.slice(0, maxVisible) : visibleValue" :key="item[keySelect]" class="z-10">
              <slot name="values" :selected="item" :key="valueSelect ? valueSelect : keySelect" :delete-select="select">
                <Badge mode="neutral" :close-button="props?.closeButtonBadge" class-content="fill-theme-500" @delete="select(item)" class="m-1 mb-0 text-xs bg-theme-50 text-theme-700 ring-theme-600/20 dark:bg-theme-950 dark:text-theme-300 dark:ring-theme-400/20">
                  {{valueSelect? item[valueSelect] : item[keySelect]}}
                </Badge>
              </slot>
            </div>
            <div v-if="visibleValue.length > maxVisible" class="z-10">
              <slot name="values" :selected="visibleValue.length" :key="null" :delete-select="select">
                <Badge mode="neutral" :close-button="props?.closeButtonBadge" class-content="fill-theme-500" @delete="select(null)" class="m-1 mb-0 pl-2 text-xs bg-theme-50 text-theme-700 ring-theme-600/20 dark:bg-theme-950 dark:text-theme-300 dark:ring-theme-400/20">
                  <FunnelIcon aria-hidden="true" class="h-3 w-3 mr-1 text-theme-400 dark:text-theme-600"/> {{visibleValue.length}}
                </Badge>
              </slot>
            </div>
          </transition-group>
        </template>
        <template v-else>
          <div v-for="(item, key) in visibleValue" :key="`${item[keySelect]}-${key}`">
            <slot :selected="item" :key="valueSelect ? valueSelect : keySelect">
              <div>{{valueSelect? item[valueSelect] : item[keySelect]}}</div>
            </slot>
          </div>
        </template>
      </div>
    </div>
    <template #body>
      <FixWindow v-bind="paramsFixWindow" :model-value="isOpenList" class-body="z-30" @close="env => closeSelect(env)">
        <div
          ref="selectList"
          :class="cn(
            'min-w-[10rem] mt-1 max-h-60',
            'text-base rounded-md ring-1 ring-black ring-opacity-5 shadow-xl focus:outline-none sm:text-sm',
            !(mode === 'outlined')||'border border-gray-300 dark:border-gray-600 bg-white dark:bg-black',
            !(mode === 'underlined')||'rounded-none border-0 border-gray-300 dark:border-gray-700 border-b bg-stone-50 dark:bg-stone-950',
            !(mode === 'filled')||'border-0 bg-stone-100 dark:bg-stone-900',
            props?.classSelectList,
            'classSelectList overflow-auto')"
          :style="`width: ${(selectBody as HTMLElement)?.clientWidth??0}px`">
          <div :class="cn(
            'w-full h-5 bg-gradient-to-t to-transparent pointer-events-none',
            !(mode === 'outlined')||'from-white dark:from-black via-white dark:via-black',
            !(mode === 'underlined')||'from-stone-50 dark:from-stone-950 via-stone-50 dark:via-stone-950',
            !(mode === 'filled')||'from-stone-100 dark:from-stone-900 via-stone-100 dark:via-stone-900',
            'sticky top-[220px] z-20'
            )"/>
          <StInput
            v-if="isQuery"
            ref="selectSearch"
            v-model="query"
            label="Найти..."
            :mode="mode"
            label-mode="vanishing"
            clear
            :class-body="cn(
              `m-2 mb-5 sticky top-1 z-20 rounded-md`,
              (mode === 'outlined') ? 'ring-stone-200 dark:ring-black': '',
              (mode === 'underlined') ? 'ring-stone-200 dark:ring-stone-950': '',
              (mode === 'filled') ? 'ring-stone-100 dark:ring-stone-900': '')">
            <template #before>
              <MagnifyingGlassIcon aria-hidden="true" class="h-5 w-5 text-gray-400 dark:text-gray-600"/>
            </template>
          </StInput>
          <TransitionGroup
            name="ul"
            tag="ul"
            :css="false"
            @before-enter="onBeforeEnter"
            @enter="onEnter"
            @leave="onLeave">
              <template v-if="dataSelect?.length">
                <li
                  v-for="(item, index) in dataList"
                  :key="`${item[keySelect]}`"
                  :data-index="index"
                  :class="cn(
                    'text-gray-900 dark:text-gray-100 items-center h-9 mx-2 pl-8 pr-4 last:mb-5',
                    'hover:bg-theme-200 hover:dark:bg-theme-900 hover:text-theme-700 dark:hover:text-theme-100',
                    ['outlined','filled'].includes(mode) && 'rounded-md',
                    'group/li relative cursor-default select-none flex transition-colors duration-75'
                    )"
                  @click="select(item)">
                  <slot name="item" :item="item" :key="valueSelect" :isQuery="isQuery && item?.marker">
                    <div
                      v-if="isQuery && item?.marker"
                      v-html="item?.marker"
                      class="text-gray-600 dark:text-gray-300 group-hover/li:text-theme-700 dark:group-hover/li:text-theme-400"/>
                    <div
                      v-else
                      class="text-gray-600 dark:text-gray-300 group-hover/li:text-theme-700 dark:group-hover/li:text-theme-200">
                      {{valueSelect? item[valueSelect] : item}}
                    </div>
                  </slot>
                  <span
                    v-if="visibleValue?.find(i=>i[keySelect] === item[keySelect])"
                    class="flex absolute inset-y-0 left-0 items-center pl-2 text-theme-700 dark:text-theme-400">
                    <CheckIcon aria-hidden="true" class="w-5 h-5"/>
                  </span>
                </li>
                <div
                  v-if="!dataList?.length"
                  v-html="noData"
                  class="h-9 px-4 text-sm text-gray-500"/>
              </template>
              <div v-else class="p-4 text-sm text-gray-500" v-html="noData"/>
          </TransitionGroup>
        </div>
      </FixWindow>
      <slot/>
    </template>
    <template v-if="slots.before" #before><slot name="before"/></template>
    <template v-if="slots.after" #after><slot name="after"/></template>
  </InputLayout>
</template>