<script setup lang="ts">
import {computed, getCurrentInstance, ref, reactive, watch} from "vue";
import InputLayout, {type ILayout} from "@/components/functional/inputLayout.vue";
import {CheckIcon, MagnifyingGlassIcon} from "@heroicons/vue/20/solid";
import StInput from "@/components/form/StInput.vue";
import DataStore, {type BaseDataItem, type IDataItem} from "@/helpers/dataStore";
import gsap from 'gsap'
// ---------------------------------------
export interface IDateSelect {
  dataSelect: Array<BaseDataItem>
  keySelect?: string
  valueSelect?: string
  multiple?:boolean
  noData?: string
  noQuery?: boolean
  classMaskQuery?: "font-bold text-primary-700 dark:text-primary-300"|string
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
  (event: 'update:modelValue', payload: ISelect["modelValue"]): void;
  (event: 'change:modelValue', payload: ISelect["modelValue"]): void;
}>()
// ---------------------------------------
const query = ref<string>("")
const isOpenList = ref(false)
// ---------------------------------------
const id = ref(props.id||getCurrentInstance()?.uid)
const value = computed<ISelect["modelValue"]>(()=> props.modelValue)
const keySelect = computed<IDateSelect["keySelect"] | null>(()=> {
  if (props.paramsSelect?.dataSelect && props.paramsSelect?.dataSelect.length) {
    if (typeof props.paramsSelect?.dataSelect[0] === "object") {
      if (props.paramsSelect?.keySelect && Object.keys(props.paramsSelect?.dataSelect[0]).includes(props.paramsSelect.keySelect)) {
        return props.paramsSelect.keySelect
      } else { return Object.keys(props.paramsSelect.dataSelect[0])[0] }
    } else { return null }
  } else { return null }
})
const valueSelect = computed<IDateSelect["valueSelect"] | null>(()=> {
  if (props.paramsSelect?.dataSelect && props.paramsSelect?.dataSelect.length) {
    if (typeof props.paramsSelect?.dataSelect[0] === "object") {
      if (props.paramsSelect?.valueSelect && Object.keys(props.paramsSelect?.dataSelect[0]).includes(props.paramsSelect.valueSelect)) {
        return props.paramsSelect?.valueSelect
      } else { return Object.keys(props.paramsSelect?.dataSelect[0])[1] }
    } else { return null }
  } else { return null }
})
const dataSelect = computed<IDateSelect["dataSelect"]>(()=>
   ( keySelect.value && valueSelect.value
  ? (props.paramsSelect?.dataSelect as Array<IDataItem>).map(item=>{
    return { [(keySelect.value as string)]: item[(keySelect.value as string)],
             [(valueSelect.value as string)]: item[(valueSelect.value as string)] }})
  : props.paramsSelect?.dataSelect)|| [])
const mode = computed<NonNullable<ILayout["mode"]>>(()=> props.mode || "outlined")
const isDisabled = computed<NonNullable<ILayout["disabled"]>>(()=> props.disabled || false)
const isLoading = computed<NonNullable<ILayout["isInvalid"]>>(()=> props.loading || false)
const isInvalid = computed<NonNullable<ILayout["isInvalid"]>>(()=> props.isInvalid || false)
const messageInvalid = computed<ILayout["messageInvalid"]>(()=> props.messageInvalid)
const isValue = computed<boolean>(()=> Boolean(isMultiple.value ? value.value ? String(value.value).length : value.value : value.value || isOpenList.value))
const isMultiple = computed<NonNullable<IDateSelect["multiple"]>>(()=> props.paramsSelect?.multiple || false)
const noData = computed<NonNullable<IDateSelect["noData"]>>(()=> props.paramsSelect?.noData || "Нет данных")
const isQuery = computed<NonNullable<IDateSelect["noQuery"]>>(()=> !props.paramsSelect?.noQuery)
const classMaskQuery = computed<NonNullable<IDateSelect["classMaskQuery"]>>(()=> props.paramsSelect?.classMaskQuery||"font-bold text-primary-700 dark:text-primary-300")
// ---------------------------------------
const dataStore = ref(new DataStore(value.value, keySelect.value, dataSelect.value, isMultiple.value))
const valueLayout = computed<string>(()=>dataStore.value.getValue()?.map((item: any) => item[dataStore.value.getKey()])?.join(", "))
// ---------------------------------------
const inputLayout = reactive({value: valueLayout.value, isValue: isValue, mode: mode.value, label: props.label,
  labelMode: props.labelMode, isInvalid: isInvalid.value, messageInvalid: messageInvalid.value,
  required: props.required, loading: isLoading.value, disabled: isDisabled.value, help: props.help, clear: props.clear,
  classBody: props.classBody, class: props.class})
// ---------------------------------------
watch(value, ()=>{
  inputLayout.value = valueLayout.value
})
watch(isInvalid, ()=>{
  inputLayout.isInvalid = props.isInvalid
})
watch(messageInvalid, ()=>{
  inputLayout.messageInvalid = props.messageInvalid
})
watch(isLoading, (value)=>{
  inputLayout.loading = value
})
watch(isDisabled, (value)=>{
  inputLayout.disabled = value
})
watch(isOpenList, (value)=>{
  if (value) {
    document.addEventListener("click", closeSelect)
    document.addEventListener("keydown", keydownSelect)
  } else {
    document.removeEventListener("click", closeSelect);
    document.removeEventListener("keydown", keydownSelect)
  }
  inputLayout.class = (props.class||"")+(value ? " border-primary-600 dark:border-primary-700 ring-2 ring-inset ring-primary-600 dark:ring-primary-700": "")
})
watch(()=>props.paramsSelect?.dataSelect, ()=>{
  dataStore.value.setData(dataSelect.value)
})
watch(value, (value:ISelect["modelValue"])=>{
  const dataStoreValue = dataStore.value.getKeyValue()
  if (Array.isArray(value) && value?.some((item, index)=>item !== dataStoreValue[index])) {
    dataStore.value.clearValue()
    dataStore.value.setValue((dataStore.value.getData() as Array<IDataItem>)
        .filter(item=> (value as Array<string|number>).includes(item[dataStore.value.getKey()])))
  }
})
// ---------------------------------------
function keydownSelect(evt:KeyboardEvent){
  let isEscape = false;
  if ("key" in evt) { isEscape = (evt.key === "Escape" || evt.key === "Esc") }
  if (isEscape) { isOpenList.value = false
  } else {
    document.getElementById(`search${id.value}`)?.focus()
  }
}
function closeSelect(evt:MouseEvent) {
  const select = document.getElementById(`select${id.value}`)
  const list = document.getElementById(`list${id.value}`)
  if (isOpenList.value && select && list) {
    isOpenList.value = evt.composedPath().includes(select) || evt.composedPath().includes(list)
    if (isOpenList.value === false) {
      emit('change:modelValue', dataStore.value.getKeyValue().length ? dataStore.value.getKeyValue() : null)
    }
  }
}
// ---------------------------------------
function select(item:BaseDataItem|null) {
  if (item) {
    dataStore.value.setValue(item)
  } else { dataStore.value.clearValue() }
  emit('update:isInvalid', false)
  emit('update:modelValue', dataStore.value.getKeyValue().length ? dataStore.value.getKeyValue() : null)
}
// ---------------------------------------
const dataList = computed<IDataItem>(()=> {
  if (isQuery.value) {
    return (dataStore.value.getData() as Array<IDataItem>)
      .filter(item => {
        const valueSelectSting = String(valueSelect.value ? item[valueSelect.value] : item[dataStore.value.getKey()])
        return valueSelectSting.toLowerCase().includes(query.value.toLowerCase())
      })
      .map(item => {
        const valueSelectSting = String(valueSelect.value ? item[valueSelect.value] : item[dataStore.value.getKey()])
        item.marker = query.value.length
          ? valueSelectSting.replace(new RegExp(query.value, "gi"), `<span class="${classMaskQuery.value}">$&</span>`)
          : valueSelectSting
        return item
      })
  } else {
    return dataStore.value.getData()
  }
})
// ---------------------------------------
function onBeforeEnter(el:any) {
  el.style.opacity = 0
  el.style.height = 0
}
function onEnter(el:any, done:any) {
  gsap.to(el, {
    opacity: 1,
    height: '36px',
    delay: el.dataset.index * 0.01,
    onComplete: done
  })
}
const delay = computed<number>(():number=> {
  const d = dataStore.value.getData().length
  if (d>=0 && d>10) { return 0.25
  } else if (d>=10 && d>30) { return 0.15
  } else if (d>=30 && d>80) { return 0.10
  } else if (d>=80) { return 0.05 } else { return 0.05}
})
function onLeave(el:any, done:any) {
  gsap.to(el, {
    opacity: 0,
    height: 0,
    delay: el.dataset.index * delay.value,
    onComplete: done
  })
}
function open() {
  if (isDisabled.value) { return }
  isOpenList.value = true
}
</script>
<template>
  <InputLayout v-bind="inputLayout" @clear="select(null)">
    <div :id="`select${id}`" class="flex w-full min-h-[36px] max-h-16 overflow-auto" @click="open">
      <div class="flex items-center flex-wrap">
        <template v-if="isMultiple">
          <transition-group leave-active-class="transition ease-in-out duration-300" leave-from-class="opacity-100 translate-x-0" leave-to-class="opacity-0 -translate-x-5"
                            enter-active-class="transition ease-in-out duration-300" enter-from-class="opacity-0 -translate-x-5" enter-to-class="opacity-100 translate-x-0">
            <div v-for="item in dataStore.getValue()" :key="item[dataStore.getKey()]" class="z-10">
              <slot name="values" :selected="item" :key="valueSelect ? valueSelect : dataStore.getKey()">
                <div class="m-[2px] bg-stone-200 dark:bg-primary-900 h-4 leading-4 px-1 rounded-[2px]">{{valueSelect? item[valueSelect] : item[dataStore.getKey()]}}</div>
              </slot>
            </div>
          </transition-group>
        </template>
        <template v-else>
          <div v-for="item in dataStore.getValue()" :key="item[dataStore.getKey()]">
            <slot :selected="item" :key="valueSelect ? valueSelect : dataStore.getKey()">
              <div>{{valueSelect? item[valueSelect] : item[dataStore.getKey()]}}</div>
            </slot>
          </div>
        </template>
      </div>
    </div>
    <template #body>
      <transition leave-active-class="transition ease-in-out duration-200" leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 -translate-y-5"
                  enter-active-class="transition ease-in-out duration-200" enter-from-class="opacity-0 -translate-y-5" enter-to-class="opacity-100 translate-y-0">
        <div v-show="isOpenList"
             :id="`list${id}`"
             :class="['overflow-auto absolute z-50 mt-1 w-full max-h-60 text-base rounded-md ring-1 ring-black ring-opacity-5 shadow-xl focus:outline-none sm:text-sm',
                 !(mode === 'outlined')||'border-[1px] border-gray-300 dark:border-gray-600 bg-white dark:bg-black',
                 !(mode === 'underlined')||'rounded-none border-0 border-gray-300 dark:border-gray-700 border-b-[1px] bg-stone-50 dark:bg-stone-950',
                 !(mode === 'filled')||'border-0 bg-stone-100 dark:bg-stone-900'
                 ]">
          <div :class="[
            'sticky top-[220px] w-full h-5 z-20 bg-gradient-to-t to-transparent',
            !(mode === 'outlined')||'from-white dark:from-black via-white dark:via-black',
            !(mode === 'underlined')||'from-stone-50 dark:from-stone-950 via-stone-50 dark:via-stone-950',
            !(mode === 'filled')||'from-stone-100 dark:from-stone-900 via-stone-100 dark:via-stone-900'
          ]"/>
          <StInput
            :id="`search${id}`"
            v-if="isQuery"
            v-model="query"
            label="Найти..."
            :mode="mode"
            label-mode="vanishing"
            :class-body="`m-2 mb-5 sticky top-1 z-20 rounded-md ring-4 ${
              (mode === 'outlined') ? 'ring-white dark:ring-black' :
              (mode === 'underlined') ? 'ring-stone-50 dark:ring-stone-950' :
              (mode === 'filled') ? 'ring-stone-100 dark:ring-stone-900': '' }`"
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
              <template v-if="dataSelect?.length" >
                <li v-for="(item, index) in dataList"
                    :key="dataStore.getKey() !== 'uuid'? item[dataStore.getKey()]: item[dataStore.getKey()]+index"
                    :data-index="index"
                    class="group text-gray-900 dark:text-gray-100 relative cursor-default select-none flex items-center h-9 mx-2 pl-8 pr-4 last:mb-5 transition-colors duration-75"
                    :class="['hover:bg-primary-200 hover:dark:bg-primary-900', ['outlined','filled'].includes(mode) ? 'rounded-md': '']"
                    @click="select(item)">
                  <slot name="item" :item="item">
                    <div v-if="isQuery && item.marker" v-html="item.marker" class="text-primary-600 dark:text-primary-400"/>
                    <div v-else class="text-gray-500">{{valueSelect? item[valueSelect] : item}}</div>
                  </slot>
                  <span v-if="dataStore.isValue(item)" class="flex absolute inset-y-0 left-0 items-center pl-2 text-primary-700 dark:text-primary-400">
                    <CheckIcon aria-hidden="true" class="w-5 h-5"/>
                  </span>
                </li>
                <div v-if="!dataList.length" class="h-9 px-4 text-sm text-gray-500" v-html="noData"></div>
              </template>
              <div v-else class="p-4 text-sm text-gray-500" v-html="noData"></div>
          </TransitionGroup>
        </div>
      </transition>
      <slot/>
    </template>
    <template #before><slot name="before"/></template>
    <template #after><slot name="after"/></template>
  </InputLayout>
</template>