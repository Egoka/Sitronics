<script setup lang="ts">
import InputLayout from "@/components/functional/InputLayout.vue";
import {computed, getCurrentInstance, ref, useSlots, watch} from "vue";
import {onkeydown} from "@/helpers/numbers";
import {cn} from "@/helpers/tailwind";
import type {IAria} from "@/components/form/StAria";
import type {ILayout} from "@/components/functional/InputLayout";
// ---------------------------------------
const props = defineProps<IAria>()
const emit = defineEmits<{
  (event: 'update:modelValue', payload: string): void;
  (event: 'update:isInvalid', payload: boolean): void;
  (event: 'change:modelValue', payload: boolean): void;
}>();
const slots = useSlots()
// ---------------------------------------
const classLayout = ref<ILayout["class"]>()
const isActiveAria = ref<boolean>(false)
const inputAria = ref<HTMLElement|undefined>()
const additionalStyles = ref<string>('max-h-max')
// ---------------------------------------
const id = ref<NonNullable<IAria["id"]>>(String(props.id ?? getCurrentInstance()?.uid))
const value = computed<string>(()=> String(props.modelValue ?? ""))
const placeholder = computed<NonNullable<IAria["placeholder"]>>(()=> String(props?.placeholder ?? ""))
const autocomplete = computed<NonNullable<IAria["autocomplete"]>>(()=> props?.autocomplete ?? "on")
const wrap = computed<NonNullable<IAria["wrap"]>>(()=> props?.wrap ?? "soft")
const rows = computed<NonNullable<IAria["rows"]>>(()=> props?.rows ?? 3)
const maxLength = computed<NonNullable<IAria["maxLength"]>>(()=> props?.maxLength ?? 9999)
const isValue = computed<boolean>(()=> !!value.value || isActiveAria.value)
const mode = computed<NonNullable<ILayout["mode"]>>(()=> props.mode ?? "outlined")
const isDisabled = computed<NonNullable<IAria["disabled"]>>(()=> props.disabled ?? false)
const isLoading = computed<NonNullable<IAria["isInvalid"]>>(()=> props.loading ?? false)
const isInvalid = computed<NonNullable<IAria["isInvalid"]>>(()=> !isDisabled.value ? props.isInvalid : false)
const messageInvalid = computed<NonNullable<IAria["messageInvalid"]>>(()=> props.messageInvalid ?? "")
const classStyle = computed<NonNullable<ILayout["class"]>>(()=> {
  return props.class ? props.class + additionalStyles.value : additionalStyles.value
})
// ---------------------------------------
const inputLayout = computed(()=>({isValue: isValue.value, mode: mode.value, label: props.label,
  labelMode: props.labelMode, isInvalid: isInvalid.value, messageInvalid: messageInvalid.value,
  required: props.required, loading: isLoading.value, disabled: isDisabled.value, help: props.help, clear: props.clear,
  classBody: props.classBody, class: classStyle.value}))
// ---------------------------------------
watch(isActiveAria, (value)=>{
  if (value) { document.addEventListener("click", closeAria)
  } else { document.removeEventListener("click", closeAria) }
  classLayout.value = (props.class??"")+(value
    ? ` border-theme-600 dark:border-theme-700 ring-2 ring-inset ring-theme-600 dark:ring-theme-700 ${additionalStyles.value}`
    : " " + additionalStyles.value)
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
  <InputLayout
    :value="value"
    :class="classLayout"
    v-bind="inputLayout"
    @clear="clear">
      <textarea
        :id="id"
        ref="inputAria"
        :name="id"
        :rows="rows"
        :wrap="wrap"
        :value="value"
        :disabled="isDisabled"
        :maxlength="maxLength"
        :placeholder="placeholder"
        :autocomplete="autocomplete"
        :class="cn(
          'w-full ring-0 border-0 bg-transparent p-0 mt-2 mb-1 min-h-[28px] max-h-[10rem] rounded-md text-gray-900 dark:text-gray-100',
          'placeholder:text-transparent placeholder:select-none focus:placeholder:text-gray-400 focus:placeholder:dark:text-gray-600',
          '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
          'focus:outline-0 focus:ring-0 caret-theme-500',
          props?.classInput,
          'classInput block'
        )"
        @focus="isActiveAria = true"
        @input="inputEvent"
        @keydown="onkeydown"
        @change="changeModelValue(($event.target as HTMLInputElement).value)"/>
    <template #body><slot/></template>
    <template v-if="slots.before" #before><slot name="before"/></template>
    <template v-if="slots.after" #after><slot name="after"/></template>
  </InputLayout>
</template>