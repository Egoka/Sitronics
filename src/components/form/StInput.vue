<script setup lang="ts">
import { XCircleIcon, ExclamationCircleIcon, QuestionMarkCircleIcon, EyeIcon, EyeSlashIcon, DocumentDuplicateIcon, CheckIcon } from '@heroicons/vue/20/solid'
import Label, {type ILabelMode} from "@/components/functional/Label.vue";
import {computed, getCurrentInstance, onMounted, ref, watch} from "vue";
import Dropdown from "@/components/functional/Dropdown.vue";
import {toPhone, toNumber, convertToPhone, convertToNumber, onkeydown} from "@/helpers/numbers";
import type {IMode} from "./StForm.vue";
import {getLabelType} from "@/helpers/label";

// ---------------------------------------
const arrayInputType:Array<IInputType> = ['text','number','email','password']
export type IInputType = 'text'|'number'|'email'|'password'
export type IInputMask = 'phone'|'number'|'price'
export interface IInput {
  id?: string
  modelValue?: string|number|null|undefined,
  mode?: IMode
  label?: string
  labelMode?: ILabelMode
  type?: IInputType
  placeholder?: string
  autocomplete?: "on"|"off"
  loading?:boolean
  disabled?:boolean
  clear?: boolean
  help?: string
  isInvalid?: boolean
  messageInvalid?: string
  required?: boolean
  mask?: IInputMask
  lengthInteger?: number
  lengthDecimal?: number
  class?: string
  classInput?: string
}
// ---------------------------------------
const props = defineProps<IInput>()
// ---------------------------------------
const id = ref(props.id||getCurrentInstance()?.uid)
const type = ref(props.type && arrayInputType.includes(props.type) ? props.type : "text")
const value =          computed<string>                  (()=> String(props.modelValue? toMask(props.modelValue) : ""))
const placeholder =    computed<IInput["placeholder"]>   (()=> String(props.placeholder || ""))
const autocomplete =   computed<IInput["autocomplete"]>  (()=> props.autocomplete || "on")
const mode =           computed<IInput["mode"]>          (()=> props.mode || "outlined")
const label =          computed<IInput["label"]>         (()=> String(props.label || ""))
const labelMode =      computed<ILabelMode>              (()=> props.labelMode || "offsetDynamic")
const labelType =      computed<ILabelMode>              (()=> getLabelType(value.value, label.value, labelMode.value))
const mask =           computed<IInput["mask"]|null>     (()=> props.mask||null)
const lengthInteger =  computed<IInput["lengthInteger"]> (()=> +(props.lengthInteger || 20))
const lengthDecimal =  computed<IInput["lengthDecimal"]> (()=> +(props.lengthDecimal || 0))
const isLoading =      computed<IInput["loading"]>       (()=> props.loading || false)
const isDisabled =     computed<IInput["disabled"]>      (()=> props.disabled || false)
const isInvalid =      computed<IInput["isInvalid"]>     (()=> !isDisabled.value ? props.isInvalid : false)
const messageInvalid = computed<IInput["messageInvalid"]>(()=> props.messageInvalid || "")
const isRequired =     computed<IInput["required"]>      (()=> props.required)
const isCopy = ref(false)
// ---------------------------------------
const input = ref<HTMLElement|undefined>()
const inputBody = ref<HTMLElement|undefined>()
const beforeInput = ref<HTMLElement|undefined>()
const afterInput = ref<HTMLElement|undefined>()
// ---------------------------------------
function toMask(value:string|number) {
  if (mask.value === "phone"){
    return convertToPhone(String(value))
  } else if (mask.value === "number"){
    return convertToNumber(value, lengthInteger.value, lengthDecimal.value, "")
  } else if (mask.value === "price"){
    return convertToNumber(value, lengthInteger.value, lengthDecimal.value, " ")
  } else { return value }
}
// ---------------------------------------
function inputEvent ($event:any) {
  if (mask.value === "phone"){ toPhone($event) }
  if (mask.value === "number"){ toNumber($event, "", lengthInteger.value, lengthDecimal.value) }
  if (mask.value === "price"){ toNumber($event, " ", lengthInteger.value, lengthDecimal.value) }
  inputModelValue(($event.target as HTMLInputElement).value)
}
// ---------------------------------------
const emit = defineEmits<{
  (event: 'update:modelValue', payload: string): void;
  (event: 'updateModelValue', payload: string): void;
  (event: 'update:isInvalid', payload: boolean): void;
  (event: 'updateIsInvalid', payload: boolean): void;
  (event: 'change:modelValue', payload: boolean): void;
}>();
function inputModelValue(value:any) {
  emit('update:isInvalid', false)
  emit('updateIsInvalid', false)
  emit('update:modelValue', value)
  emit('updateModelValue', value)
}
function changeModelValue(value:any) {
  emit('change:modelValue', value)
}
async function copy() {
  try {
    await navigator.clipboard.writeText(String(value.value))
    isCopy.value = true
    setTimeout(()=>isCopy.value = false, 3000)
  } catch (err) {
    console.error('Failed to copy: ', err);
  }
}
// ---------------------------------------
const beforeWidth = ref<number|null>(null)
const afterWidth = ref<number|null>(null)
const headerHeight = ref(0)
// ---------------------------------------
onMounted(()=>{
  new ResizeObserver(entries => {
    for (let entry of entries) {
      beforeWidth.value = (entry as any).target['offsetWidth']
    }
  }).observe((beforeInput.value as HTMLElement));
  new ResizeObserver(entries => {
    for (let entry of entries) {
      afterWidth.value = (entry as any)?.target['offsetWidth']
      afterWidth.value = afterWidth.value && afterWidth.value > 10 ? afterWidth.value : 10
    }
  }).observe((afterInput.value as HTMLElement));
  headerHeight.value = <number>document.querySelector("header")?.offsetHeight
})
</script>

<template>
  <div ref="inputBody" :class="[
    'relative',
    props.class||' mb-6 rounded-md',
    ['offsetDynamic','offsetStatic'].includes(labelType)?'mt-1':'',
      !(mode === 'outlined')||'shadow-sm',
      !(mode === 'underlined')||'shadow-none',
      !(mode === 'filled')||'shadow-none',
    ]">
    <div ref="beforeInput" class="absolute inset-y-0 left-0 flex items-center pl-3 pr-1 z-10">
      <slot name="before"/>
    </div>
    <input
      :id="id"
      ref="input"
      :name="id"
      :type="type"
      :disabled="isDisabled"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      class="block peer w-full rounded-md py-1.5 text-gray-900 dark:text-gray-100 ring-0 ring-inset
      transition-all
      placeholder:text-transparent placeholder:select-none focus:placeholder:text-gray-400 focus:placeholder:dark:text-gray-600
      focus:outline-none focus:ring-inset focus:ring-indigo-600 focus:dark:ring-indigo-400
      sm:text-sm sm:leading-6
      disabled:bg-slate-50 disabled:dark:bg-slate-950 disabled:text-slate-500 disabled:border-slate-200 disabled:dark:border-slate-800 disabled:border-dashed disabled:shadow-none"
      :class="[!isInvalid||'is-invalid ring-2 ring-red-500 scroll-mt-10',
      !(mode === 'outlined')||'border-[1px] border-gray-300 dark:border-gray-600 bg-white dark:bg-black focus:ring-2 focus:border-transparent',
      !(mode === 'underlined')||'rounded-none border-0 border-gray-300 dark:border-gray-700 border-b-[1px] shadow-none bg-stone-50 dark:bg-stone-950 focus:border-b-[1px] focus:border-indigo-400 focus:dark:border-indigo-600 focus:ring-0',
      !(mode === 'filled')||'border-0 bg-stone-100 dark:bg-stone-900 focus:ring-2 disabled:bg-stone-100 disabled:dark:bg-stone-900 disabled:border-dotted disabled:border-2 disabled:border-slate-200',
      props.classInput]"
      :style="`padding-left: ${beforeWidth||10}px; padding-right: ${afterWidth||10}px; scroll-margin-top: ${headerHeight + 10}px;`"
      :value="value"
      @input="inputEvent($event)"
      @keydown="onkeydown($event)"
      @change="changeModelValue(($event.target as HTMLInputElement).value)"
    />
    <Label :title="label"
           :type="labelType"
           :mode="mode"
           :is-required="isRequired"
           :is-disabled="isDisabled"
           :translate-x="beforeWidth||10"
           :max-width="input?.['offsetWidth']"
    />
    <div ref="afterInput" class="absolute inset-y-0 right-0 flex items-center pl-1">
      <slot name="after"/>
      <transition leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100" leave-to-class="opacity-0"
                  enter-active-class="transition ease-in duration-200" enter-from-class="opacity-0" enter-to-class="opacity-100">
        <div v-if="isLoading" class="relative mx-2">
          <div class="w-4 h-4 border-gray-200 dark:border-gray-800 border-2 rounded-full"></div>
          <div class="w-4 h-4 border-gray-700 dark:border-gray-300 border-t-2 animate-spin rounded-full absolute left-0 top-0"></div>
        </div>
      </transition>
      <EyeSlashIcon v-if="props.type === 'password' && type === 'password'" class="h-5 w-5 mr-2 text-gray-400 dark:text-gray-600 hover:text-cyan-500 transition" aria-hidden="true" @click="type = 'text'" />
      <EyeIcon v-if="props.type === 'password' && type === 'text'" class="h-5 w-5 mr-2 text-gray-400 dark:text-gray-600 hover:text-cyan-500 transition" aria-hidden="true" @click="type = 'password'" />
      <Dropdown v-if="help?.length" :content="help">
        <template #head>
          <QuestionMarkCircleIcon class="h-5 w-5 mr-2 mt-[6px] text-gray-400 dark:text-gray-600 hover:text-yellow-500 transition" aria-hidden="true" />
        </template>
      </Dropdown>
      <template v-if="!isDisabled">
        <transition leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100" leave-to-class="opacity-0"
                    enter-active-class="transition ease-in duration-200" enter-from-class="opacity-0" enter-to-class="opacity-100">
          <div>
            <Dropdown v-if="isInvalid&&messageInvalid" :content="messageInvalid">
              <template #head>
                <ExclamationCircleIcon class="h-5 w-5 mr-2 mt-[6px] text-red-500" aria-hidden="true" />
              </template>
            </Dropdown>
          </div>
        </transition>
        <transition leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100" leave-to-class="opacity-0"
                    enter-active-class="transition ease-in duration-200" enter-from-class="opacity-0" enter-to-class="opacity-100">
          <XCircleIcon v-if="clear && value?.length" class="h-5 w-5 mr-2 text-gray-400 dark:text-gray-600 hover:text-red-600 hover:dark:text-red-500 transition" aria-hidden="true" @click="inputModelValue('')" />
        </transition>
      </template>
      <template v-else-if="value?.length">
        <DocumentDuplicateIcon v-if="!isCopy" class="h-5 w-5 mr-2 text-gray-400 dark:text-gray-600 hover:text-gray-600 hover:dark:text-gray-400 transition" aria-hidden="true" @click="copy" />
        <CheckIcon v-else class="h-5 w-5 mr-2 text-emerald-400 dark:text-emerald-600" aria-hidden="true" />
      </template>
    </div>
    <p
      class="absolute block text-red-600 dark:text-red-400 text-sm truncate ml-1"
      :class="[isInvalid ? 'visible' : 'invisible']"
      :style="`max-width: ${inputBody?.['offsetWidth']||10}px`">
      {{ messageInvalid }}
    </p>
  </div>
</template>