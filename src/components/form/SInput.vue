<script setup lang="ts">
import {reactive, computed, getCurrentInstance, ref, watch, onMounted} from "vue";
import InputLayout, {type ILayout} from "@/components/functional/inputLayout.vue";
import {convertToNumber, convertToPhone, onkeydown, toNumber, toPhone} from "@/helpers/numbers";
import {EyeIcon, EyeSlashIcon} from "@heroicons/vue/20/solid";
// ---------------------------------------
// ---------------------------------------
const arrayInputType:Array<IInputType> = ['text','number','email','password']
export type IInputType = 'text'|'number'|'email'|'password'
export type IInputMask = 'phone'|'number'|'price'
export interface IDataInput {
  type?: IInputType
  placeholder?: string
  autocomplete?: "on"|"off"
  mask?: IInputMask
  lengthInteger?: number
  lengthDecimal?: number
  classInput?: string
}
export interface IInput extends Omit<ILayout, "value">{
  id?: string
  modelValue?: string|number|null|undefined,
  paramsInput?: Partial<IDataInput>
}
// ---------------------------------------
const props = defineProps<IInput>()
const emit = defineEmits<{
  (event: 'update:modelValue', payload: string): void;
  (event: 'update:isInvalid', payload: boolean): void;
  (event: 'change:modelValue', payload: boolean): void;
}>();
// ---------------------------------------
const isActiveInput = ref<boolean>(false)
const input = ref<HTMLElement|undefined>()
// ---------------------------------------
const id = ref(props.id||getCurrentInstance()?.uid)
const type = ref(props.paramsInput?.type && arrayInputType.includes(props.paramsInput.type) ? props.paramsInput?.type : "text")
const value = computed<string>(()=> String(props.modelValue? toMask(props.modelValue) : ""))
const placeholder = computed<IInput["placeholder"]>(()=> String(props.paramsInput?.placeholder || ""))
const autocomplete = computed<IInput["autocomplete"]>(()=> props.paramsInput?.autocomplete || "on")
const mask = computed<IInput["mask"]|null>(()=> props.paramsInput?.mask||null)
const lengthInteger =  computed<IInput["lengthInteger"]> (()=> +(props.paramsInput?.lengthInteger || 20))
const lengthDecimal =  computed<IInput["lengthDecimal"]> (()=> +(props.paramsInput?.lengthDecimal || 0))
const isValue = computed<boolean>(()=> Boolean(value.value ? String(value.value).length : value.value || isActiveInput.value))
const mode = computed<ILayout["mode"]>(()=> props.mode || "outlined")
const isDisabled = computed<IInput["disabled"]>(()=> props.disabled || false)
const isInvalid = computed<IInput["isInvalid"]>(()=> !isDisabled.value ? props.isInvalid : false)
const messageInvalid = computed<IInput["messageInvalid"]>(()=> props.messageInvalid || "")
// ---------------------------------------
const inputLayout = reactive({value: value.value, isValue: isValue, mode: mode.value, label: props.label,
  labelMode: props.labelMode, isInvalid: isInvalid.value, messageInvalid: messageInvalid.value,
  required: props.required, loading: props.loading, disabled: isDisabled.value, help: props.help, clear: props.clear,
  classBody: props.classBody, class: props.class})
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
onMounted(()=>{
  document.addEventListener( 'click', (e) => {
    if (isActiveInput.value) {
      isActiveInput.value = e.composedPath().includes((input.value as HTMLElement))
    }
  })
})
watch(isActiveInput, (value)=>{
  inputLayout.class = props.class+(value ? " outline-none ring-2 ring-inset ring-indigo-600 dark:ring-indigo-400": "")
})
// ---------------------------------------
function inputEvent ($event:any) {
  if (mask.value === "phone"){ toPhone($event) }
  if (mask.value === "number"){ toNumber($event, "", lengthInteger.value, lengthDecimal.value) }
  if (mask.value === "price"){ toNumber($event, " ", lengthInteger.value, lengthDecimal.value) }
  inputModelValue(($event.target as HTMLInputElement).value)
}
function inputModelValue(value:any) {
  emit('update:isInvalid', false)
  emit('update:modelValue', value)
}
function changeModelValue(value:any) {
  emit('change:modelValue', value)
}
function clear() {
  isActiveInput.value = false
  inputModelValue('')
}
</script>

<template>
  <InputLayout v-bind="inputLayout" @clear="clear">
    <input
      :id="id"
      ref="input"
      :name="id"
      :type="type"
      :disabled="isDisabled"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      :value="value"
      :class="props.paramsInput?.classInput"
      class="block w-full ring-0 border-0 bg-transparent py-1.5 px-1 h-[32px] my-1 rounded-md text-gray-900 dark:text-gray-100
      transition-all
      placeholder:text-transparent placeholder:select-none focus:placeholder:text-gray-400 focus:placeholder:dark:text-gray-600
      [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
      focus:outline-0 focus:ring-0"
      @click=""
      @focus="isActiveInput = true"
      @input="inputEvent($event)"
      @keydown="onkeydown($event)"
      @change="changeModelValue(($event.target as HTMLInputElement).value)"
    />
    <template #before><slot name="before"/></template>
    <template #after>
      <slot name="after"/>
      <EyeSlashIcon v-if="props.paramsInput?.type === 'password' && type === 'password'" class="h-5 w-5 mr-2 text-gray-400 dark:text-gray-600 hover:text-cyan-500 transition" aria-hidden="true" @click="type = 'text'" />
      <EyeIcon v-if="props.paramsInput?.type === 'password' && type === 'text'" class="h-5 w-5 mr-2 text-gray-400 dark:text-gray-600 hover:text-cyan-500 transition" aria-hidden="true" @click="type = 'password'" />
    </template>
  </InputLayout>
</template>