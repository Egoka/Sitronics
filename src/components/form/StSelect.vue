<script setup lang="ts">
import {computed, getCurrentInstance, ref, reactive, onMounted, watch} from "vue";
import gsap from 'gsap'
import type {ILabelMode} from "@/components/functional/Label.vue";
import Icons from "@/components/functional/Icons.vue";
import StInput from "@/components/form/StInput.vue";
import {CheckIcon} from "@heroicons/vue/20/solid";
import DataStore, { type IDataStore, type IDataItem} from "@/helpers/dataStore";
import InputLayout, {type ILayout} from "@/components/functional/inputLayout.vue";
// ---------------------------------------
export interface ISelect extends Omit<ILayout, "value">{
  id?: string
  modelValue?: number|string|{}|[]|null
  keySelect?: string
  valueSelect?: string
  dataSelect: Array<any>
  multiple?:boolean
  noData?: string
  noQuery?: boolean
  classMaskQuery?: "font-bold text-indigo-700 dark:text-indigo-300"|string
}
// ---------------------------------------
const props = defineProps<ISelect>()
// ---------------------------------------
const emit = defineEmits<{
  (event: 'update:modelValue', payload: ISelect["modelValue"]): void;
}>()
// ---------------------------------------
const query = ref<string>("")
const isOpenList = ref(false)
// ---------------------------------------
const id = ref(props.id||getCurrentInstance()?.uid)
const value = computed<IDataStore["modelValue"]>(()=> props.modelValue)
const keySelect = computed<IDataStore["keySelect"]>(()=> {
  if (props.dataSelect && props.dataSelect.length) {
    if (typeof props.dataSelect[0] === "object") {
      if (props.keySelect && Object.keys(props.dataSelect[0]).includes(props.keySelect)) {
        return props.keySelect
      } else { return Object.keys(props.dataSelect[0])[0] }
    } else { return null }
  } else { return null }
})
const valueSelect = computed<IDataStore["valueSelect"]>(()=> {
  if (props.dataSelect && props.dataSelect.length) {
    if (typeof props.dataSelect[0] === "object") {
      if (props.valueSelect && Object.keys(props.dataSelect[0]).includes(props.valueSelect)) {
        return props.valueSelect
      } else { return Object.keys(props.dataSelect[0])[1] }
    } else { return null }
  } else { return null }
})
const dataSelect = computed<IDataStore["dataSelect"]>(()=> keySelect.value
  ? props.dataSelect.map(item=>{return{[keySelect.value]: item[keySelect.value], [valueSelect.value]: item[valueSelect.value], }})
  : props.dataSelect)
const mode = computed<ILayout["mode"]>(()=> props.mode || "outlined")
const multiple = computed<ILayout["multiple"]>(()=> props.multiple || false)
const isValue = computed<boolean>(()=> Boolean(multiple.value ? value.value ? String(value.value).length : value.value : value.value || isOpenList.value))
const noData = computed<ILayout["noData"]>(()=> props.noData || "Нет данных")
const isQuery = computed<ILayout["noData"]>(()=> !props.noQuery)
const classMaskQuery = computed<ILayout["noData"]>(()=> props.classMaskQuery||"font-bold text-indigo-700 dark:text-indigo-300")
const inputLayout = reactive({value: isValue, mode, label: props.label,
  labelMode: props.labelMode, invalid: props.invalid, messageInvalid: props.messageInvalid,
  required: props.required, disabled: props.disabled, help: props.help, clear: props.clear,
  classBody: props.classBody, class: props.class})
// ---------------------------------------
const list = ref<HTMLElement|undefined>()
const dataStore = ref(new DataStore(value.value, keySelect.value, dataSelect.value, multiple.value))
// ---------------------------------------
onMounted(()=>{
  document.addEventListener( 'click', (e) => {
    isOpenList.value = e.composedPath().includes((list.value as HTMLElement))
  })
  document.onkeydown = function(evt) {
    if (isOpenList.value) {
      evt = <KeyboardEvent>(evt || window.event)
      let isEscape = false;
      if ("key" in evt) { isEscape = (evt.key === "Escape" || evt.key === "Esc")
      } else { isEscape = (evt.keyCode === 27) }
      if (isEscape) { isOpenList.value = false }
    }
  };
})
watch(isOpenList, (value)=>{
  inputLayout.class = props.class+(value ? " outline-none ring-2 ring-inset ring-indigo-600 dark:ring-indigo-400": "")
})
watch(() => dataSelect.value, (value)=>{
  dataStore.value.setData(value)
})
// ---------------------------------------
function select(item:IDataItem|null) {
  if (item) {
    dataStore.value.setValue(item)
  } else { dataStore.value.clearValue() }
  emit('update:modelValue', dataStore.value.getKeyValue())
}
// ---------------------------------------
const dataList = computed<IDataStore["dataSelect"]>(()=> {
  if (isQuery.value) {
    return dataStore.value.getData()
      .filter(item => {
        const valueSelectSting = String(valueSelect.value ? item[valueSelect.value] : item[dataStore.value.getKey()])
        return valueSelectSting.toLowerCase().includes(query.value) ||
          valueSelectSting.toUpperCase().includes(query.value) ||
          valueSelectSting.includes(query.value)
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
function onBeforeEnter(el) {
  el.style.opacity = 0
  el.style.height = 0
}
function onEnter(el, done) {
  gsap.to(el, {
    opacity: 1,
    height: '36px',
    delay: el.dataset.index * 0.01,
    onComplete: done
  })
}
function onLeave(el, done) {
  gsap.to(el, {
    opacity: 0,
    height: 0,
    delay: el.dataset.index * delay.value,
    onComplete: done
  })
}
const delay = computed(()=> {
  const d = dataStore.value.getData()
  if (d>=0 && d>10) { return 0.25
  } else if (d>=10 && d>30) { return 0.15
  } else if (d>=30 && d>80) { return 0.10
  } else if (d>=80) { return 0.05 }
})
</script>
<template>
  <InputLayout v-bind="inputLayout" @clear="select(null)">
    <div class="flex w-full min-h-[22px] max-h-16 overflow-auto" @click.stop="isOpenList=!isOpenList">
      <div class="flex items-center flex-wrap">
        <template v-if="multiple">
          <transition-group leave-active-class="transition ease-in-out duration-300" leave-from-class="opacity-100 translate-x-0" leave-to-class="opacity-0 -translate-x-5"
                            enter-active-class="transition ease-in-out duration-300" enter-from-class="opacity-0 -translate-x-5" enter-to-class="opacity-100 translate-x-0">
            <div v-for="item in dataStore.getValue()" :key="item[dataStore.getKey(item)]">
              <slot :selected="item" :key="valueSelect ? valueSelect : dataStore.getKey()">
                <div class="m-[2px] bg-stone-200 dark:bg-indigo-900 h-4 leading-4 px-1 rounded-[2px]">{{valueSelect? item[valueSelect] : item[dataStore.getKey()]}}</div>
              </slot>
            </div>
          </transition-group>
        </template>
        <template v-else>
          <div v-for="item in dataStore.getValue()" :key="item[dataStore.getKey(item)]">
            <slot :selected="item" :key="valueSelect ? valueSelect : dataStore.getKey()">
              <div>{{valueSelect? item[valueSelect] : item[dataStore.getKey()]}}</div>
            </slot>
          </div>
        </template>
      </div>
    </div>
    <template #body>
      <div v-if="isOpenList"
           ref="list"
           :class="['overflow-auto absolute z-50 py-1 mt-1 w-full max-h-60 text-base rounded-md ring-1 ring-black ring-opacity-5 shadow-lg focus:outline-none sm:text-sm',
               !(mode === 'outlined')||'border-[1px] border-gray-300 dark:border-gray-600 bg-white dark:bg-black',
               !(mode === 'underlined')||'rounded-none border-0 border-gray-300 dark:border-gray-700 border-b-[1px] shadow-none bg-stone-50 dark:bg-stone-950',
               !(mode === 'filled')||'border-0 bg-stone-100 dark:bg-stone-900'
               ]">
        <StInput
          v-if="isQuery"
          v-model="query"
          label="Найти..."
          :mode="mode"
          label-mode="vanishing"
          class="m-2 my-5 sticky top-0 z-20"
          clear
        >
          <template #before>
            <Icons type="MagnifyingGlassIcon"/>
          </template>
        </StInput>
        <TransitionGroup
          name="ul"
          tag="ul"
          :css="false"
          @before-enter="onBeforeEnter"
          @enter="onEnter"
          @leave="onLeave"
        >
            <template v-if="dataSelect?.length" >
              <li v-for="(item, index) in dataList"
                  :key="dataStore.getKey() !== 'uuid'? item[dataStore.getKey()]: item[dataStore.getKey()]+index"
                  :data-index="index"
                  class="text-gray-900 dark:text-gray-100 relative cursor-default select-none flex items-center h-9 pl-10 pr-4"
                  :class="['hover:bg-indigo-100 hover:dark:bg-indigo-900']"
                  @click="select(item)"
              >
                <slot name="item" :item="item">
                  <div v-if="isQuery" v-html="item.marker" class="text-gray-600 dark:text-gray-400"/>
                  <div v-else class="text-gray-500">{{valueSelect? item[valueSelect] : item}}</div>
                </slot>
                <span v-if="dataStore.isValue(item)" class="flex absolute inset-y-0 left-0 items-center pl-3 text-indigo-600">
                  <CheckIcon aria-hidden="true" class="w-5 h-5"/>
                </span>
              </li>
              <div v-if="!dataList.length" class="px-4 text-sm text-gray-500" v-html="noData"></div>
            </template>
            <div v-else class="p-4 text-sm text-gray-500" v-html="noData"></div>
        </TransitionGroup>
      </div>
    </template>
    <template #before><slot name="before"/></template>
    <template #after><slot name="after"/></template>
  </InputLayout>
</template>