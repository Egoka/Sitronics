<script setup lang="ts">
import InputLayout, {type ILayout} from "@/components/functional/inputLayout.vue";
import {computed, getCurrentInstance, reactive, ref, watch} from "vue";
import {onkeydown} from "@/helpers/numbers";
// ---------------------------------------
export interface IDataAria {
  placeholder?: string
  autocomplete?: "on" | "off"
  wrap?: "soft" | "hard" | "off"
  rows?: number
  maxLength?: number
}
export interface IAria extends Omit<ILayout, "value"|"isValue">{
  id?: string
  modelValue?: string|number|null|undefined,
  paramsAria?: Partial<IDataAria>
}
// ---------------------------------------
const props = defineProps<IAria>()
const emit = defineEmits<{
  (event: 'update:modelValue', payload: string): void;
  (event: 'update:isInvalid', payload: boolean): void;
  (event: 'change:modelValue', payload: boolean): void;
}>();
// ---------------------------------------
const isActiveAria = ref<boolean>(false)
const inputAria = ref<HTMLElement|undefined>()
const additionalStyles = ref<string>('max-h-max')
// ---------------------------------------
const id = ref<NonNullable<IAria["id"]>>(String(props.id||getCurrentInstance()?.uid))
const value = computed<string>(()=> String(props.modelValue || ""))
const placeholder = computed<NonNullable<IDataAria["placeholder"]>>(()=> String(props.paramsAria?.placeholder || ""))
const autocomplete = computed<NonNullable<IDataAria["autocomplete"]>>(()=> props.paramsAria?.autocomplete || "on")
const wrap = computed<NonNullable<IDataAria["wrap"]>>(()=> props.paramsAria?.wrap || "soft")
const rows = computed<NonNullable<IDataAria["rows"]>>(()=> props.paramsAria?.rows || 3)
const maxLength = computed<NonNullable<IDataAria["maxLength"]>>(()=> props.paramsAria?.maxLength || 9999)
const isValue = computed<boolean>(()=> Boolean(value.value ? String(value.value).length : value.value || isActiveAria.value))
const mode = computed<NonNullable<ILayout["mode"]>>(()=> props.mode || "outlined")
const isDisabled = computed<NonNullable<IAria["disabled"]>>(()=> props.disabled || false)
const isLoading = computed<NonNullable<IAria["isInvalid"]>>(()=> props.loading || false)
const isInvalid = computed<NonNullable<IAria["isInvalid"]>>(()=> !isDisabled.value ? props.isInvalid : false)
const messageInvalid = computed<NonNullable<IAria["messageInvalid"]>>(()=> props.messageInvalid || "")
const classLayout = computed<NonNullable<ILayout["class"]>>(()=> {
  return props.class ? props.class + additionalStyles.value : additionalStyles.value
})
// ---------------------------------------
const inputLayout = reactive({value: value.value, isValue: isValue, mode: mode.value, label: props.label,
  labelMode: props.labelMode, isInvalid: isInvalid.value, messageInvalid: messageInvalid.value,
  required: props.required, loading: isLoading.value, disabled: isDisabled.value, help: props.help, clear: props.clear,
  classBody: props.classBody, class: classLayout.value})
// ---------------------------------------
watch(value, (value)=>{
  inputLayout.value = value
})
watch(isInvalid, ()=>{
  inputLayout.isInvalid = isInvalid.value
})
watch(messageInvalid, ()=>{
  inputLayout.messageInvalid = messageInvalid.value
})
watch(isActiveAria, (value)=>{
  if (value) {
    document.addEventListener("click", closeAria)
  } else {
    document.removeEventListener("click", closeAria)
  }
  inputLayout.class = (props.class||"")+(value
    ? ` border-primary-600 dark:border-primary-700 ring-2 ring-inset ring-primary-600 dark:ring-primary-700 ${additionalStyles.value}`
    : " " + additionalStyles.value)
})
watch(isLoading, (value)=>{
  inputLayout.loading = value
})
watch(isDisabled, (value)=>{
  inputLayout.disabled = value
})
// ---------------------------------------
function closeAria(evt:MouseEvent) {
  isActiveAria.value = evt.composedPath().includes((inputAria.value as HTMLElement))
}
// ---------------------------------------
function inputEvent ($event:any) {
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
  isActiveAria.value = false
  inputModelValue('')
  changeModelValue('')
}
</script>

<template>
  <InputLayout v-bind="inputLayout" @clear="clear">
      <textarea :id="id"
                ref="inputAria"
                :name="id"
                :rows="rows"
                :wrap="wrap"
                :value="value"
                :disabled="isDisabled"
                :maxlength="maxLength"
                :placeholder="placeholder"
                :autocomplete="autocomplete"
                class="block w-full ring-0 border-0 bg-transparent p-0 mt-2 mb-1 min-h-[24px] rounded-md text-gray-900 dark:text-gray-100
                placeholder:text-transparent placeholder:select-none focus:placeholder:text-gray-400 focus:placeholder:dark:text-gray-600
                [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
                focus:outline-0 focus:ring-0"
                @focus="isActiveAria = true"
                @input="inputEvent($event)"
                @keydown="onkeydown($event)"
                @change="changeModelValue(($event.target as HTMLInputElement).value)"/>
    <template #body><slot/></template>
    <template #before><slot name="before"/></template>
    <template #after><slot name="after"/></template>
  </InputLayout>
</template>