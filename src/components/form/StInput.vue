<script setup lang="ts">
import { XCircleIcon, ExclamationCircleIcon, QuestionMarkCircleIcon, EyeIcon, EyeSlashIcon, DocumentDuplicateIcon, CheckIcon } from '@heroicons/vue/20/solid'
import Label, {type ILabelMode} from "@/components/functional/Label.vue";
import {computed, getCurrentInstance, onMounted, ref, watch} from "vue";
import Dropdown from "@/components/functional/Dropdown.vue";
import {toPhone, toNumber, convertToPhone, convertToNumber, onkeydown} from "@/helpers/numbers";
import type {IMode} from "@/components/form/StForm.vue";

// ---------------------------------------
export type IInputType = 'text'|'number'|'email'|'password'
export type IInputMask = 'phone'|'number'|'price'
export interface IInput {
  id?: string
  modelValue: string|number|null|undefined,
  mode?: IMode
  label?: string
  labelMode?: ILabelMode
  type?: IInputType
  placeholder?: string
  loading?:boolean
  disabled?:boolean
  clear?: boolean
  help?: string
  isInvalid?: boolean
  messageInvalid?: string
  isRequired?: boolean
  mask?: IInputMask
  lengthInteger?: string|number
  lengthDecimal?: string|number
  class?: string
}
// ---------------------------------------
const props = defineProps<IInput>()
// ---------------------------------------
const emit = defineEmits<{
  (event: 'update:modelValue', payload: string): void;
  (event: 'updateModelValue', payload: string): void;
  (event: 'update:isInvalid', payload: boolean): void;
  (event: 'updateIsInvalid', payload: boolean): void;
  (event: 'change:modelValue', payload: boolean): void;
}>();
// ---------------------------------------
const id = ref(props.id||getCurrentInstance()?.uid)
const type = ref(props.type||"text")
const value = computed(()=> String(toMask(props.modelValue) || ""))
const placeholder = computed(()=> String(props.placeholder || ""))
const mode = computed<IMode>(()=> props.mode || "outlined")
const label = computed(()=> String(props.label || ""))
const labelMode = computed<ILabelMode>(()=> props.labelMode || "offsetDynamic")
const labelType = computed<ILabelMode>(()=> getLabelType())
const mask = computed(()=>props.mask||null)
const lengthInteger = computed<Number>(()=> +props.lengthInteger || 20)
const lengthDecimal = computed<Number>(()=>+props.lengthDecimal || 0)
const isLoading = computed<Boolean>(()=>props.loading || false)
const isDisabled = computed<Boolean>(()=>props.disabled || false)
const isInvalid = computed<Boolean>(()=>!isDisabled.value ? props.isInvalid : false)
const messageInvalid = computed<String>(()=> props.messageInvalid || "")
const isRequired = computed(()=>props.isRequired)
const isCopy = ref(false)
// ---------------------------------------
const input = ref(0)
const inputBody = ref(0)
const beforeInput = ref(0)
const afterInput = ref(0)
// ---------------------------------------
function toMask(value) {
  if (mask.value === "phone"){
    return convertToPhone(value)
  } else if (mask.value === "number"){
    return convertToNumber(value, lengthInteger.value, lengthDecimal.value, "")
  } else if (mask.value === "price"){
    return convertToNumber(value, lengthInteger.value, lengthDecimal.value, " ")
  } else { return value }
}
// ---------------------------------------
function inputEvent ($event) {
  if (mask.value === "phone"){ toPhone($event) }
  if (mask.value === "number"){ toNumber($event, "", lengthInteger.value, lengthDecimal.value) }
  if (mask.value === "price"){ toNumber($event, " ", lengthInteger.value, lengthDecimal.value) }
  inputModelValue(($event.target as HTMLInputElement).value)
}
// ---------------------------------------
function inputModelValue(value) {
  emit('update:isInvalid', false)
  emit('updateIsInvalid', false)
  emit('update:modelValue', value)
  emit('updateModelValue', value)
}
function changeModelValue(value) {
  emit('change:modelValue', value)
}
async function copy() {
  try {
    await navigator.clipboard.writeText(value.value)
    isCopy.value = true
    setTimeout(()=>isCopy.value = false, 3000)
  } catch (err) {
    console.error('Failed to copy: ', err);
  }
}
function getLabelType() {
  if (label.value?.length) {
    if (!!(value.value)) {
      if (['offsetDynamic','offsetStatic'].includes(labelMode.value)){
        return "offsetStatic"
      } else {return "static"}
    } else { return labelMode.value }
  } else { return "none" }
}
// ---------------------------------------
const beforeWidth = ref(null)
const afterWidth = ref(null)
const headerHeight = ref(0)
// ---------------------------------------
onMounted(()=>{
  new ResizeObserver(entries => {
    for (let entry of entries) {
      beforeWidth.value = entry?.target['offsetWidth']
    }
  }).observe((beforeInput.value as HTMLElement));
  new ResizeObserver(entries => {
    for (let entry of entries) {
      afterWidth.value = entry?.target['offsetWidth']
    }
  }).observe((afterInput.value as HTMLElement));
  headerHeight.value = document.querySelector("header")?.offsetHeight
})
</script>

<template>
  <div ref="inputBody" class="relative mb-6 rounded-md" :class="[
    ['offsetDynamic','offsetStatic'].includes(labelType)?'mt-1':'mt-6',
      !(mode === 'outlined')||'shadow-sm',
      !(mode === 'underlined')||'shadow-none',
      !(mode === 'filled')||'shadow-sm',
    ]">
    <div ref="beforeInput" class="absolute inset-y-0 left-0 flex items-center pl-3 pr-1">
      <slot name="before"/>
    </div>
    <input
      :id="id"
      ref="input"
      :name="id"
      :type="type"
      :disabled="isDisabled"
      :placeholder="placeholder"
      class="block peer w-full rounded-md py-1.5 text-gray-900 ring-0 ring-inset ring-gray-300
      transition-all
      [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
      placeholder:text-transparent focus:placeholder:text-gray-400
      focus:outline-none focus:ring-inset focus:ring-indigo-600
      sm:text-sm sm:leading-6
      disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:border-dashed disabled:shadow-none"
      :class="[!isInvalid||'is-invalid ring-2 ring-red-500 scroll-mt-10',
      !(mode === 'outlined')||'border-1 border-gray-300 bg-white focus:ring-2 focus:border-transparent',
      !(mode === 'underlined')||'rounded-none border-0 border-gray-300 border-b-[1px] shadow-none bg-stone-50 focus:border-b-[1px] focus:border-indigo-400 focus:ring-0',
      !(mode === 'filled')||'border-0 bg-stone-100 focus:ring-2 disabled:bg-stone-100 disabled:border-dotted disabled:border-2 disabled:border-slate-200',
      props.class]"
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
           :translate-x="beforeWidth||10"
           :max-width="input['offsetWidth']"
    />
    <div ref="afterInput" class="absolute inset-y-0 right-0 flex items-center pl-1">
      <slot name="after"/>
      <transition leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100" leave-to-class="opacity-0"
                  enter-active-class="transition ease-in duration-200" enter-from-class="opacity-0" enter-to-class="opacity-100">
        <div v-if="isLoading" class="relative mx-2">
          <div class="w-4 h-4 border-gray-200 border-2 rounded-full"></div>
          <div class="w-4 h-4 border-gray-700 border-t-2 animate-spin rounded-full absolute left-0 top-0"></div>
        </div>
      </transition>
      <EyeSlashIcon v-if="props.type === 'password' && type === 'password'" class="h-5 w-5 mr-2 text-gray-400 hover:text-cyan-500 transition" aria-hidden="true" @click="type = 'text'" />
      <EyeIcon v-if="props.type === 'password' && type === 'text'" class="h-5 w-5 mr-2 text-gray-400 hover:text-cyan-500 transition" aria-hidden="true" @click="type = 'password'" />
      <Dropdown v-if="help?.length" :content="help">
        <template #head>
          <QuestionMarkCircleIcon class="h-5 w-5 mr-2 mt-[6px] text-gray-400 hover:text-yellow-500 transition" aria-hidden="true" />
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
          <XCircleIcon v-if="clear && value?.length" class="h-5 w-5 mr-2 text-gray-400 hover:text-red-600 transition" aria-hidden="true" @click="inputModelValue(null)" />
        </transition>
      </template>
      <template v-else-if="value?.length">
        <DocumentDuplicateIcon v-if="!isCopy" class="h-5 w-5 mr-2 text-gray-400 hover:text-gray-600 transition" aria-hidden="true" @click="copy" />
        <CheckIcon v-else class="h-5 w-5 mr-2 text-emerald-400" aria-hidden="true" />
      </template>
    </div>
    <p
      class="absolute block text-red-600 text-sm truncate  ml-1"
      :class="[isInvalid ? 'visible' : 'invisible']"
      :style="`max-width: ${inputBody['offsetWidth']||10}px`">
      {{ messageInvalid }}
    </p>
  </div>
</template>