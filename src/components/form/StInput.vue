<script setup lang="ts">
import {computed, getCurrentInstance, ref, watch, useSlots, onMounted} from "vue";
import InputLayout from "@/components/functional/InputLayout.vue";
import {convertToNumber, convertToPhone, onkeydown, toNumber, toPhone} from "@/helpers/numbers";
import {EyeIcon, EyeSlashIcon} from "@heroicons/vue/20/solid";
import {cn} from "@/helpers/tailwind";
import type {IInput, IInputExpose, IInputType} from "@/components/form/StInput";
import type {ILayout} from "@/components/functional/InputLayout";
// ---------------------------------------
const arrayInputType:Array<IInputType> = ['text','number','email','password']
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
const mask = computed<IInput["mask"]|null>(()=> props?.mask ?? null)
const value = ref<IInput["modelValue"]>()
watch(()=>props.modelValue,(modelValue)=>{
  value.value = String(modelValue ? toMask(modelValue) : modelValue ?? "")
},{immediate: true})
// ---------------------------------------
const id = ref<NonNullable<IInput["id"]>>(String(props.id ?? getCurrentInstance()?.uid))
const type = ref<IInput["type"]>(props?.type && arrayInputType.includes(props.type) ? props?.type : "text")
const autoFocus = computed<NonNullable<IInput["autoFocus"]>>(()=> props?.autoFocus ?? false)
const placeholder = computed<NonNullable<IInput["placeholder"]>>(()=> String(props?.placeholder ?? ""))
const autocomplete = computed<NonNullable<IInput["autocomplete"]>>(()=> props?.autocomplete ?? "on")
const lengthInteger = computed<NonNullable<IInput["lengthInteger"]>>(()=> +(props?.lengthInteger ?? 20))
const lengthDecimal = computed<NonNullable<IInput["lengthDecimal"]>>(()=> +(props?.lengthDecimal ?? 0))
const isValue = computed<boolean>(()=> !!value.value || isActiveInput.value)
const mode = computed<NonNullable<ILayout["mode"]>>(()=> props.mode ?? "outlined")
const isDisabled = computed<NonNullable<IInput["disabled"]>>(()=> props.disabled ?? false)
const isLoading = computed<NonNullable<IInput["isInvalid"]>>(()=> props.loading ?? false)
const isInvalid = computed<NonNullable<IInput["isInvalid"]>>(()=> !isDisabled.value ? props.isInvalid : false)
const messageInvalid = computed<NonNullable<IInput["messageInvalid"]>>(()=> props.messageInvalid ?? "")
// ---EXPOSE------------------------------
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
  classLayout.value = (props.class??"")+(value ? " border-theme-600 dark:border-theme-700 ring-2 ring-inset ring-theme-600 dark:ring-theme-700": "")
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
        'relative z-10 ring-0 border-0 w-full bg-transparent p-1 h-[28px] my-1 rounded-md text-gray-900 dark:text-gray-100',
        'placeholder:select-none focus:placeholder:text-gray-400 focus:placeholder:dark:text-gray-500',
        label?.length ? 'placeholder:text-transparent placeholder:transition-all' : '',
        '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
        'focus:outline-0 focus:ring-0 transition-all caret-theme-500',
        props?.classInput,
        'classInput flex')"
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
      <EyeSlashIcon v-if="props?.type === 'password' && type === 'password'" class="h-5 w-5 mr-2 text-gray-400 dark:text-gray-600 hover:text-cyan-500 transition cursor-pointer" aria-hidden="true" @click="type = 'text'" />
      <EyeIcon v-if="props?.type === 'password' && type === 'text'" class="h-5 w-5 mr-2 text-gray-400 dark:text-gray-600 hover:text-cyan-500 transition cursor-pointer" aria-hidden="true" @click="type = 'password'" />
    </template>
  </InputLayout>
</template>