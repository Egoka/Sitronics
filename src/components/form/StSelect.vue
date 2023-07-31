<script setup lang="ts">
import InputLayout, {type ILayout} from "@/components/functional/inputLayout.vue";
import {computed, getCurrentInstance, ref, reactive, onMounted, watch} from "vue";
import type {ILabelMode} from "@/components/functional/Label.vue";
import Icons from "@/components/functional/Icons.vue";
import StInput from "@/components/form/StInput.vue";
import {CheckIcon} from "@heroicons/vue/20/solid";
import DataStore, { type IDataStore, type IDataItem} from "@/helpers/dataStore";
// ---------------------------------------
export interface ISelect extends Omit<ILayout, "value">{
  id?: string
  modelValue?: number|string|{}|[]|null
  keySelect?: string
  dataSelect: Array<any>
  multiple?:boolean
  noData?: string
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
const dataSelect = computed<IDataStore["dataSelect"]>(()=> props.dataSelect)
const keySelect = computed<IDataStore["keySelect"]>(()=>props.keySelect||typeof dataSelect.value[0] === "object" ? dataSelect.value ? Object.keys(dataSelect.value[0])[0]:"" : "")
const mode = computed<ILayout["mode"]>(()=> props.mode || "outlined")
const multiple = computed<ILayout["multiple"]>(()=> props.multiple || false)
const isValue = computed<boolean>(()=> Boolean(multiple.value ? String(value.value).length : value.value||isOpenList.value))
const noData = computed<ILayout["noData"]>(()=> props.noData || "Нет данных")
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
})
watch(isOpenList, (value)=>{
  inputLayout.class = props.class+(value ? " outline-none ring-2 ring-inset ring-indigo-600 dark:ring-indigo-400": "")
})
watch(() => dataSelect.value, (value)=>{
  dataStore.value.setData(value)
})
// ---------------------------------------
function select(item:IDataItem|null) {
  dataStore.value.select(item)
  emit('update:modelValue', dataStore.value.value)
}
</script>
<template>
  <InputLayout v-bind="inputLayout" @clear="select(null)">
    <div class="flex w-full min-h-[22px] max-h-16 overflow-auto" @click.stop="isOpenList=!isOpenList">
      <div class="flex items-center flex-wrap">
        <template v-if="multiple">
          <transition-group leave-active-class="transition ease-in-out duration-300" leave-from-class="opacity-100 translate-x-0" leave-to-class="opacity-0 -translate-x-5"
                            enter-active-class="transition ease-in-out duration-300" enter-from-class="opacity-0 -translate-x-5" enter-to-class="opacity-100 translate-x-0">
            <div v-for="(item) in dataStore.selected" :key="item[dataStore.key]">
              <slot :selected="item">
                <div v-if="multiple" class="m-[2px] bg-indigo-100 dark:bg-indigo-900 h-4 leading-4 px-1 rounded-[2px]">{{item.item}}</div>
                <div v-else>{{item.item}}</div>
              </slot>
            </div>
          </transition-group>
        </template>
        <template v-else>
          <div v-for="(item) in dataStore.selected" :key="item[dataStore.key]">
            <slot :selected="item">
              <div v-if="multiple" class="m-[2px] bg-indigo-100 dark:bg-indigo-900 h-4 leading-4 px-1 rounded-[2px]">{{item.item}}</div>
              <div v-else>{{item.item}}</div>
            </slot>
          </div>
        </template>
      </div>
    </div>
    <template #body>
      <transition leave-active-class="transition ease-in-out duration-300" leave-from-class="opacity-100" leave-to-class="opacity-0"
                  enter-active-class="transition ease-in-out duration-300" enter-from-class="opacity-0" enter-to-class="opacity-100">
        <ul ref="list" v-if="isOpenList"
            :class="['overflow-auto absolute z-50 py-1 mt-1 w-full max-h-60 text-base rounded-md ring-1 ring-black ring-opacity-5 shadow-lg focus:outline-none sm:text-sm',
             !(mode === 'outlined')||'border-[1px] border-gray-300 dark:border-gray-600 bg-white dark:bg-black',
             !(mode === 'underlined')||'rounded-none border-0 border-gray-300 dark:border-gray-700 border-b-[1px] shadow-none bg-stone-50 dark:bg-stone-950',
             !(mode === 'filled')||'border-0 bg-stone-100 dark:bg-stone-900'
             ]">
          <template v-if="dataSelect?.length" >
            <StInput
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
            <li v-for="item in dataStore.data" :key="item[dataStore.key]"
                class="text-gray-900 dark:text-gray-100 relative cursor-default select-none py-2 pl-10 pr-4"
                :class="['hover:bg-indigo-100 hover:dark:bg-indigo-900']"
                @click="select(item)"
            >
              <slot name="item" :item="item">
                <div v-if="dataStore.isUuidKey">
                  {{ item.item }}
                </div>
                {{item}}
              </slot>
              <span v-if="item.selected" class="flex absolute inset-y-0 left-0 items-center pl-3 text-indigo-600">
                <CheckIcon aria-hidden="true" class="w-5 h-5"/>
              </span>
            </li>
          </template>
          <div v-else class="p-4 text-sm text-gray-500" v-html="noData"/>
        </ul>
      </transition>
    </template>
    <template #before><slot name="before"/></template>
    <template #after><slot name="after"/></template>
  </InputLayout>
</template>