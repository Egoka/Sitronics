<script setup lang="ts">
import {computed, getCurrentInstance, ref, watch, useSlots, onMounted} from "vue";
import type {Ref, UnwrapRef} from "vue";
import InputLayout, {type ILayout} from "@/components/functional/InputLayout.vue";
import {convertToNumber, convertToPhone, onkeydown, toNumber, toPhone} from "@/helpers/numbers";
import {EyeIcon, EyeSlashIcon} from "@heroicons/vue/20/solid";
import {cn} from "@/helpers/tailwind";
// ---------------------------------------
const arrayInputType:Array<IInputType> = ['text','number','email','password']
export type IInputType = 'text'|'number'|'email'|'password'
export type IInputMask = 'phone'|'number'|'price'
export interface IDataInput {
  type?: NonNullable<IInputType>
  autoFocus?: boolean
  placeholder?: string
  autocomplete?: "on"|"off"
  mask?: IInputMask
  lengthInteger?: number
  lengthDecimal?: number
  classInput?: string|Array<string|null>
}
export interface IInput extends Omit<ILayout, "value"|"isValue">{
  id?: string
  modelValue?: string|number|null|undefined
  paramsInput?: Partial<IDataInput>
}
// ---------------------------------------
const props = defineProps<IInput>()
const emit = defineEmits<{
  (event: 'clear', payload: string): void;
  (event: 'focus', env: FocusEvent): void;
  (event: 'blur', env: FocusEvent): void;
  (event: 'update:modelValue', payload: string): void;
  (event: 'change:modelValue', payload: string): void;
  (event: 'update:isInvalid', payload: boolean): void;
  (event: 'isActive', payload: boolean): void;
}>();
const slots = useSlots()
// ---------------------------------------
const inputRef = ref<HTMLElement>()
// ---------------------------------------
const classLayout = ref<ILayout["class"]>()
const isActiveInput = ref<boolean>(false)
const mask = computed<IDataInput["mask"]|null>(()=> props.paramsInput?.mask ?? null)
const value = ref<IInput["modelValue"]>()
watch(()=>props.modelValue,(modelValue)=>{
  value.value = String(modelValue ? toMask(modelValue) : modelValue ?? "")
},{immediate: true})
// ---------------------------------------
const id = ref<NonNullable<IInput["id"]>>(String(props.id ?? getCurrentInstance()?.uid))
const type = ref<IDataInput["type"]>(props.paramsInput?.type && arrayInputType.includes(props.paramsInput.type) ? props.paramsInput?.type : "text")
const autoFocus = computed<NonNullable<IDataInput["autoFocus"]>>(()=> props.paramsInput?.autoFocus ?? false)
const placeholder = computed<NonNullable<IDataInput["placeholder"]>>(()=> String(props.paramsInput?.placeholder ?? ""))
const autocomplete = computed<NonNullable<IDataInput["autocomplete"]>>(()=> props.paramsInput?.autocomplete ?? "on")
const lengthInteger = computed<NonNullable<IDataInput["lengthInteger"]>>(()=> +(props.paramsInput?.lengthInteger ?? 20))
const lengthDecimal = computed<NonNullable<IDataInput["lengthDecimal"]>>(()=> +(props.paramsInput?.lengthDecimal ?? 0))
const isValue = computed<boolean>(()=> !!value.value || isActiveInput.value)
const mode = computed<NonNullable<ILayout["mode"]>>(()=> props.mode ?? "outlined")
const isDisabled = computed<NonNullable<IInput["disabled"]>>(()=> props.disabled ?? false)
const isLoading = computed<NonNullable<IInput["isInvalid"]>>(()=> props.loading ?? false)
const isInvalid = computed<NonNullable<IInput["isInvalid"]>>(()=> !isDisabled.value ? props.isInvalid : false)
const messageInvalid = computed<NonNullable<IInput["messageInvalid"]>>(()=> props.messageInvalid ?? "")
// ---EXPOSE------------------------------
export interface IInputExpose {
  //---STATE-------------------------
  // inputRef: Readonly<Ref<UnwrapRef<HTMLElement>>>
  isActiveInput: Readonly<Ref<UnwrapRef<boolean>>>
  // ---PROPS-------------------------------
  id: Readonly<Ref<UnwrapRef<IInput["id"]>>>
  type: Readonly<Ref<UnwrapRef<IInput["type"]>>>
  value: Readonly<Ref<UnwrapRef<IInput["modelValue"]>>>
  autoFocus: Readonly<Ref<UnwrapRef<IInput["autoFocus"]>>>
  placeholder: Readonly<Ref<UnwrapRef<IInput["placeholder"]>>>
  autocomplete: Readonly<Ref<UnwrapRef<IInput["autocomplete"]>>>
  lengthInteger: Readonly<Ref<UnwrapRef<IInput["lengthInteger"]>>>
  lengthDecimal: Readonly<Ref<UnwrapRef<IInput["lengthDecimal"]>>>
  isValue: Readonly<Ref<UnwrapRef<boolean>>>
  mode: Readonly<Ref<UnwrapRef<IInput["mode"]>>>
  isDisabled: Readonly<Ref<UnwrapRef<IInput["disabled"]>>>
  isLoading: Readonly<Ref<UnwrapRef<IInput["isInvalid"]>>>
  isInvalid: Readonly<Ref<UnwrapRef<IInput["isInvalid"]>>>
  messageInvalid: Readonly<Ref<UnwrapRef<IInput["messageInvalid"]>>>
  // ---METHODS-----------------------------
  toMask(baseValue:string|number): string
  inputModelValue(valueResult:any): void
  changeModelValue(valueResult:any): void
  clear(): void
  focus(env:FocusEvent): void
  blur(env:FocusEvent): void
}
defineExpose<IInputExpose>({
  //---STATE-------------------------
  // inputRef,
  isActiveInput,
  // ---PROPS-------------------------------
  id,type,value,autoFocus,placeholder,autocomplete,lengthInteger,lengthDecimal,isValue,mode,isDisabled,isLoading,isInvalid,messageInvalid,
  // ---METHODS-----------------------------
  toMask,inputModelValue, changeModelValue, clear, focus, blur
})
// ---------------------------------------
const inputLayout = computed(()=>({isValue: isValue.value, mode: mode.value, label: props.label,
  labelMode: props.labelMode, isInvalid: isInvalid.value, messageInvalid: messageInvalid.value,
  required: props.required, loading: isLoading.value, disabled: isDisabled.value, help: props.help, clear: props.clear,
  classBody: props.classBody, class: props.class}))
// ---------------------------------------
onMounted(()=>{
  if (autoFocus.value) { inputRef.value?.focus() }
})
// ---------------------------------------
watch(isActiveInput, (value)=>{
  classLayout.value = (props.class??"")+(value ? " border-primary-600 dark:border-primary-700 ring-2 ring-inset ring-primary-600 dark:ring-primary-700": "")
  emit('isActive', value)
})
// ---------------------------------------
function toMask(baseValue:string|number):string {
  if (!mask?.value){
    return String(baseValue)
  } else if (mask?.value === "phone"){
    return convertToPhone(String(baseValue))
  } else if (mask?.value === "number"){
    return convertToNumber(baseValue, lengthInteger.value, lengthDecimal.value, "")
  } else if (mask?.value === "price"){
    return convertToNumber(baseValue, lengthInteger.value, lengthDecimal.value, " ")
  } else { return String(baseValue) }
}
// ---------------------------------------
function inputEvent ($event:InputEvent) {
  if (mask.value === "phone"){ toPhone($event) }
  if (mask.value === "number"){ toNumber($event, "", lengthInteger.value, lengthDecimal.value) }
  if (mask.value === "price"){ toNumber($event, " ", lengthInteger.value, lengthDecimal.value) }
  inputModelValue(($event.target as HTMLInputElement).value)
}
function inputModelValue(valueResult:any) {
  value.value = valueResult
  emit('update:isInvalid', false)
  emit('update:modelValue', valueResult)
}
function changeModelValue(valueResult:any) {
  emit('change:modelValue', valueResult)
}
function clear() {
  isActiveInput.value = false
  inputModelValue('')
  changeModelValue('')
  emit('clear', '')
}
function focus(env:FocusEvent) {
  inputRef.value?.focus()
  isActiveInput.value = true
  emit('focus', env)
}
function blur(env:FocusEvent) {
  isActiveInput.value = false
  emit('blur', env)
}
</script>

<template>
  <InputLayout
    :value="value"
    :class="classLayout"
    v-bind="inputLayout"
    @clear="clear">
    <input
      ref="inputRef"
      :id="id"
      :name="id"
      :type="type"
      :disabled="isDisabled"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      :value="value"
      :class="cn(
        'ring-0 border-0 w-full bg-transparent p-1 h-[28px] my-1 rounded-md text-gray-900 dark:text-gray-100',
        'placeholder:text-transparent placeholder:select-none focus:placeholder:text-gray-400 focus:placeholder:dark:text-gray-600',
        '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
        'focus:outline-0 focus:ring-0 transition-all',
        props.paramsInput?.classInput,
        'classInput flex'
        )"
      @focus="focus"
      @blur="blur"
      @input="inputEvent"
      @keydown="onkeydown"
      @change="changeModelValue(($event.target as HTMLInputElement).value)"
    />
    <template #body><slot/></template>
    <template v-if="slots.before" #before><slot name="before"/></template>
    <template #after>
      <slot v-if="slots.after" name="after"/>
      <EyeSlashIcon v-if="props.paramsInput?.type === 'password' && type === 'password'" class="h-5 w-5 mr-2 text-gray-400 dark:text-gray-600 hover:text-cyan-500 transition cursor-pointer" aria-hidden="true" @click="type = 'text'" />
      <EyeIcon v-if="props.paramsInput?.type === 'password' && type === 'text'" class="h-5 w-5 mr-2 text-gray-400 dark:text-gray-600 hover:text-cyan-500 transition cursor-pointer" aria-hidden="true" @click="type = 'password'" />
    </template>
  </InputLayout>
</template>