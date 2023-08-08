<script setup lang="ts">
import { Calendar, DatePicker,Popover, PopoverRow } from 'v-calendar';
import 'v-calendar/style.css';
// ---------------------------------------
import {computed, getCurrentInstance, reactive, ref} from "vue";
import InputLayout, {type ILayout} from "@/components/functional/inputLayout.vue";
// ---------------------------------------
const arrayInputType:Array<ICalendarType> = ['date','datetime-local','month','time','week']
export type ICalendarType = 'date'|'datetime-local'|'month'|'time'|'week'
/*
* export interface ILayout {
  value: any
  mode?: IMode
  label?: string
  labelMode?: ILabelMode
  invalid?: boolean
  messageInvalid?: string
  required?: boolean
  disabled?:boolean
  help?: string
  clear?: boolean
  classBody?: string|Array<string|null>
  class?: string|Array<string|null>
}
* */
export interface ICalendar extends Omit<ILayout, "value">{
  id?: string
  modelValue?: Date|number|string|null
  type?: ICalendarType
}
// ---------------------------------------
const props = defineProps<ICalendar>()
// ---------------------------------------
const id = ref(props.id||getCurrentInstance()?.uid)
const type = ref(props.type && arrayInputType.includes(props.type) ? props.type : "text")
const value = computed<ICalendar["modelValue"]>(()=> {
  if (props.modelValue){
    if (typeof props.modelValue === "number") return new Date(props.modelValue)
    if (typeof props.modelValue === "string" && props.modelValue.length) return new Date(props.modelValue)
  } else { return new Date() }
})
const isValue = computed<boolean>(()=>value.value)
const mode = computed<ILayout["mode"]>(()=> props.mode || "outlined")
// ---------------------------------------
const inputLayout = reactive({value: isValue, mode, label: props.label,
  labelMode: props.labelMode, invalid: props.invalid, messageInvalid: props.messageInvalid,
  required: props.required, disabled: props.disabled, help: props.help, clear: props.clear,
  classBody: props.classBody, class: props.class})
// ---------------------------------------

// const date = ref(new Date());
// const masks = ref({
//   input: 'YYYY-MM-DD',
// });
</script>

<template>
<!--  <Calendar  v-model="date"/>-->
  <InputLayout v-bind="inputLayout" @clear="">
    <div class="flex w-full min-h-[22px] max-h-16 overflow-auto" @click.stop="">
      <div class="flex items-center flex-wrap">
        <div class="relative max-w-sm">
          <input
            :id="id"
            ref="input"
            :name="id"
            :type="type"
            :disabled="isDisabled"
            :placeholder="placeholder"
            :autocomplete="autocomplete"/>
        </div>
      </div>
    </div>
    <template #body>
      <div
           ref="list"
           class="overflow-auto absolute z-50 py-1 mt-1 w-96 max-h-max text-base rounded-md ring-1 ring-black ring-opacity-5 shadow-lg focus:outline-none sm:text-sm"
           :class="[
               !(mode === 'outlined')||'border-[1px] border-gray-300 dark:border-gray-600 bg-white dark:bg-black',
               !(mode === 'underlined')||'rounded-none border-0 border-gray-300 dark:border-gray-700 border-b-[1px] shadow-none bg-stone-50 dark:bg-stone-950',
               !(mode === 'filled')||'border-0 bg-stone-100 dark:bg-stone-900'
               ]">
        <Calendar borderless expanded />
      </div>
    </template>
    <template #before><slot name="before"/></template>
    <template #after><slot name="after"/></template>
  </InputLayout>
</template>