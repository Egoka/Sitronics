<script setup lang="ts">
import {computed, getCurrentInstance, ref, reactive, watch, useSlots, onMounted} from "vue";
import InputLayout, {type ILayout} from "@/components/functional/InputLayout.vue";
import {CheckIcon, MagnifyingGlassIcon, FunnelIcon} from "@heroicons/vue/20/solid";
import StInput from "@/components/form/StInput.vue";
import * as LData from "lodash";
import gsap from 'gsap'
import Badge from "@/components/functional/Badge.vue";
// ---------------------------------------
type IDataItem = {[key:string]: any}
type BaseDataItem = string|number|IDataItem
export interface IDateSelect {
  dataSelect?: Array<BaseDataItem>
  autoFocus?: boolean
  keySelect?: string|"id"
  valueSelect?: string|"value"
  multiple?:boolean
  maxVisible?:number
  noData?: string
  noQuery?: boolean
  classSelect?: string
  classSelectList?: string
  classMaskQuery?: "font-bold text-primary-700 dark:text-primary-300"|string
  animate?: "-translate-y-5"|string
}
export interface ISelect extends Omit<ILayout, "value"|"isValue">{
  id?: string
  modelValue?: number|string|{}|[]|null
  paramsSelect?: IDateSelect
}
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
export interface ISelectExpose {
  focusSelect(isFocus):void
  openSelect():void
  closeSelect(evt:MouseEvent):void
  select(selectValue:BaseDataItem|null):void
}
defineExpose<ISelectExpose>({
  focusSelect,
  openSelect,
  closeSelect,
  select
})
// ---------------------------------------
const inputBody = ref<HTMLElement>()
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
const valueKeys = computed<Array<any>>(()=>visibleValue.value.map(item=>item[keySelect.value]))
const keySelect = computed<IDateSelect["keySelect"] | null>(()=> {
  if (props.paramsSelect?.dataSelect && props.paramsSelect?.dataSelect.length) {
    if (typeof props.paramsSelect?.dataSelect[0] === "object") {
      if (props.paramsSelect?.keySelect && Object.keys(props.paramsSelect?.dataSelect[0]).includes(props.paramsSelect.keySelect)) {
        return props.paramsSelect.keySelect
      } else { return Object.keys(props.paramsSelect.dataSelect[0])[0] }
    } else { return "id" }
  } else { return null }
})
const valueSelect = computed<IDateSelect["valueSelect"] | null>(()=> {
  if (props.paramsSelect?.dataSelect && props.paramsSelect?.dataSelect.length) {
    if (typeof props.paramsSelect?.dataSelect[0] === "object") {
      if (props.paramsSelect?.valueSelect && Object.keys(props.paramsSelect?.dataSelect[0]).includes(props.paramsSelect.valueSelect)) {
        return props.paramsSelect?.valueSelect
      } else { return Object.keys(props.paramsSelect?.dataSelect[0])[1] }
    } else { return "value" }
  } else { return null }
})
const dataSelect = computed<IDateSelect["dataSelect"]>(()=> ( !!keySelect.value && !!valueSelect.value
  ? (props.paramsSelect?.dataSelect as Array<IDataItem>).map(item=>{
    return { [(keySelect.value as string)]: typeof item === "object" ? item[(keySelect.value as string)] : item,
             [(valueSelect.value as string)]: typeof item === "object" ? item[(valueSelect.value as string)] : item }})
  : props.paramsSelect?.dataSelect)|| [])
const autoFocus = computed<NonNullable<IDateSelect["autoFocus"]>>(()=> props.paramsSelect?.autoFocus ?? false)
const mode = computed<NonNullable<ILayout["mode"]>>(()=> props.mode ?? "outlined")
const isDisabled = computed<NonNullable<ILayout["disabled"]>>(()=> props.disabled ?? false)
const isLoading = computed<NonNullable<ILayout["isInvalid"]>>(()=> props.loading ?? false)
const isInvalid = computed<NonNullable<ILayout["isInvalid"]>>(()=> props.isInvalid ?? false)
const messageInvalid = computed<ILayout["messageInvalid"]>(()=> props.messageInvalid)
const isValue = computed<boolean>(()=> Boolean(isMultiple.value ? value.value ? String(value.value).length : value.value : value.value ?? isOpenList.value))
const isMultiple = computed<NonNullable<IDateSelect["multiple"]>>(()=> props.paramsSelect?.multiple ?? false)
const maxVisible = computed<IDateSelect["maxVisible"]>(()=> props.paramsSelect?.maxVisible)
const noData = computed<NonNullable<IDateSelect["noData"]>>(()=> props.paramsSelect?.noData ?? "Нет данных")
const isQuery = computed<NonNullable<IDateSelect["noQuery"]>>(()=> !props.paramsSelect?.noQuery)
const classMaskQuery = computed<NonNullable<IDateSelect["classMaskQuery"]>>(()=> props.paramsSelect?.classMaskQuery ?? "font-bold text-primary-700 dark:text-primary-300")
const animate = computed<NonNullable<IDateSelect["animate"]>>(()=> props.paramsSelect?.animate ?? "-translate-y-5")
// ---------------------------------------
const valueLayout = computed<string|null>(()=> visibleValue.value?.map(item => item[valueSelect.value])?.join(", ")||null)
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
    document.addEventListener("mousedown", closeSelect)
    document.addEventListener("keydown", keydownSelect)
  } else {
    document.removeEventListener("mousedown", closeSelect);
    document.removeEventListener("keydown", keydownSelect)
  }
  focusSelect(value)
  emit('isActive', value)
})
watch(value, ()=>{
  if (value.value) {
    if (isMultiple.value) {
      visibleValue.value = dataSelect.value
        ?.filter(item=>Array.isArray(value.value)
          ? (value.value as [])?.includes(item[keySelect.value])
          : item[keySelect.value] === value.value)
    } else {
      const result = dataSelect.value
        ?.find(item=>Array.isArray(value.value)
          ? (value.value as [])?.includes(item[keySelect.value])
          : item[keySelect.value] === value.value)
      visibleValue.value = result ? [result] : []
    }
  } else { visibleValue.value = [] }
}, { immediate: true })
// ---------------------------------------
function keydownSelect(evt:KeyboardEvent){
  let isEscape = false;
  if ("key" in evt) { isEscape = (evt.key === "Escape" || evt.key === "Esc") }
  if (isEscape) { isOpenList.value = false
  } else {
    document.getElementById(`search${id.value}`)?.focus()
  }
}
// ---------------------------------------
function focusSelect(isFocus) {
  classLayout.value = (props.class??"")+(isFocus ? " border-primary-600 dark:border-primary-700 ring-2 ring-inset ring-primary-600 dark:ring-primary-700": "")
}
function openSelect() {
  if (isDisabled.value) { return }
  isOpenList.value = true
}
function closeSelect(evt:MouseEvent) {
  const select = document.getElementById(`select${id.value}`)
  const list = document.getElementById(`list${id.value}`)
  if (isOpenList.value && select && list) {
    isOpenList.value = evt.composedPath().includes(select) || evt.composedPath().includes(list)
    if (isOpenList.value === false) {
      console.log(value.value, visibleValue.value)
      emit('change:modelValue', value.value, visibleValue.value)
    }
  }
}
// ---------------------------------------
function select(selectValue:BaseDataItem|null) {
  if (selectValue) {
    const index = visibleValue.value.findIndex(value=>value[keySelect.value] === selectValue[keySelect.value])
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
const dataList = computed<object>(()=> {
  if (isQuery.value) {
    return LData.map(
      LData.filter(dataSelect.value, item => String(item[valueSelect.value]).toLowerCase().includes(query.value.toLowerCase())),
      (item: any) => {
        item.marker = query.value.length
          ? String(item[valueSelect.value]).replace(new RegExp(query.value, "gi"), `<span class="${classMaskQuery.value}">$&</span>`)
          : String(item[valueSelect.value])
        return item
      })
  } else { return dataSelect.value }
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
  if (d>=0 && d<10) { return 0.15
  } else if (d>=10 && d<30) { return 0.05
  } else if (d>=30 && d<80) { return 0.01
  } else if (d>=80) { return 0 }
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
    <div :id="`select${id}`"
         ref="inputBody"
         tabindex="0"
         :class="[
           'classSelect flex w-full min-h-[36px] max-h-16 overflow-auto cursor-pointer focus:outline-0 focus:ring-0',
            props.paramsSelect?.classSelect]"
         @focusin="focusSelect(true)"
         @focusout="focusSelect(false)"
         @click="openSelect">
      <div class="flex items-center flex-wrap">
        <template v-if="isMultiple">
          <transition-group leave-active-class="transition ease-in-out duration-300" leave-from-class="opacity-100 translate-x-0" leave-to-class="opacity-0 -translate-x-5"
                            enter-active-class="transition ease-in-out duration-300" enter-from-class="opacity-0 -translate-x-5" enter-to-class="opacity-100 translate-x-0">
            <div v-for="item in typeof maxVisible === 'number' ? visibleValue.slice(0, maxVisible) : visibleValue" :key="item[keySelect]" class="z-10">
              <slot name="values" :selected="item" :key="valueSelect ? valueSelect : keySelect" :delete-select="select">
                <Badge mode="neutral" close-button class-content="fill-primary-500" @delete="select(item)"
                       :class="['m-1 mb-0 text-xs bg-primary-50 text-primary-700 ring-primary-600/20 dark:bg-primary-950 dark:text-primary-300 dark:ring-primary-400/20', 'rounded-full']">
                  {{valueSelect? item[valueSelect] : item[keySelect]}}
                </Badge>
              </slot>
            </div>
            <div v-if="visibleValue.length > maxVisible" class="z-10">
              <slot name="values" :selected="visibleValue.length" :key="null" :delete-select="select">
                <Badge mode="neutral" class-content="fill-primary-500"
                       :class="['m-1 mb-0 px-3 text-xs bg-primary-50 text-primary-700 ring-primary-600/20 dark:bg-primary-950 dark:text-primary-300 dark:ring-primary-400/20', 'rounded-full']">
                  <FunnelIcon aria-hidden="true" class="h-3 w-3 mr-2 text-primary-400 dark:text-primary-600"/> {{visibleValue.length}}
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
      <transition leave-active-class="transition ease-in-out duration-200" leave-from-class="opacity-100" :leave-to-class="`opacity-0 ${animate}`"
                  enter-active-class="transition ease-in-out duration-200" :enter-from-class="`opacity-0 ${animate}`" enter-to-class="opacity-100">
        <div v-show="isOpenList"
             :id="`list${id}`"
             :class="['classSelectList overflow-auto overscroll-y-contain absolute z-50 min-w-[10rem] mt-1 w-full max-h-60',
             'text-base rounded-md ring-1 ring-black ring-opacity-5 shadow-xl focus:outline-none sm:text-sm',
             props.paramsSelect?.classSelectList,
             !(mode === 'outlined')||'border-[1px] border-gray-300 dark:border-gray-600 bg-white dark:bg-black',
             !(mode === 'underlined')||'rounded-none border-0 border-gray-300 dark:border-gray-700 border-b-[1px] bg-stone-50 dark:bg-stone-950',
             !(mode === 'filled')||'border-0 bg-stone-100 dark:bg-stone-900']">
          <div :class="[
            'sticky top-[220px] w-full h-5 z-20 bg-gradient-to-t to-transparent pointer-events-none',
            !(mode === 'outlined')||'from-white dark:from-black via-white dark:via-black',
            !(mode === 'underlined')||'from-stone-50 dark:from-stone-950 via-stone-50 dark:via-stone-950',
            !(mode === 'filled')||'from-stone-100 dark:from-stone-900 via-stone-100 dark:via-stone-900']"/>
          <StInput
            :id="`search${id}`"
            v-if="isQuery"
            v-model="query"
            label="Найти..."
            :mode="mode"
            label-mode="vanishing"
            :class-body="[`m-2 mb-5 sticky top-1 z-20 rounded-md`,
            (mode === 'outlined') ? 'ring-stone-200 dark:ring-black': '',
            (mode === 'underlined') ? 'ring-stone-200 dark:ring-stone-950': '',
            (mode === 'filled') ? 'ring-stone-100 dark:ring-stone-900': '']"
            clear>
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
                <li v-for="(item, index) in dataList"
                    :key="`${item[keySelect]}`"
                    :data-index="index"
                    class="group/li text-gray-900 dark:text-gray-100 relative cursor-default select-none flex items-center h-9 mx-2 pl-8 pr-4 last:mb-5 transition-colors duration-75"
                    :class="['hover:bg-primary-200 hover:dark:bg-primary-900 hover:text-primary-700 dark:hover:text-primary-100', ['outlined','filled'].includes(mode) ? 'rounded-md': '']"
                    @click="select(item)">
                  <slot name="item" :item="item" :key="valueSelect">
                    <div v-if="isQuery && item?.marker" v-html="item?.marker" class="text-gray-600 dark:text-gray-300 group-hover/li:text-primary-700 dark:group-hover/li:text-primary-400"/>
                    <div v-else class="text-gray-600 dark:text-gray-300 group-hover/li:text-primary-700 dark:group-hover/li:text-primary-200">{{valueSelect? item[valueSelect] : item}}</div>
                  </slot>
                  <span v-if="visibleValue?.find(i=>i[keySelect] === item[keySelect])" class="flex absolute inset-y-0 left-0 items-center pl-2 text-primary-700 dark:text-primary-400">
                    <CheckIcon aria-hidden="true" class="w-5 h-5"/>
                  </span>
                </li>
                <div v-if="!dataList?.length" class="h-9 px-4 text-sm text-gray-500" v-html="noData"></div>
              </template>
              <div v-else class="p-4 text-sm text-gray-500" v-html="noData"></div>
          </TransitionGroup>
        </div>
      </transition>
      <slot/>
    </template>
    <template v-if="slots.before" #before><slot name="before"/></template>
    <template #after><slot name="after"/></template>
  </InputLayout>
</template>