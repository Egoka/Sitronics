<script setup lang="ts">
import {computed, getCurrentInstance, onMounted, ref, useSlots, watch} from "vue";
// ---------------------------------------
import InputLayout from "@/components/functional/InputLayout.vue";
import { ArrowLongRightIcon, EllipsisVerticalIcon } from '@heroicons/vue/24/outline'
import { DatePicker } from "v-calendar";
import 'v-calendar/style.css';
// ---------------------------------------
import {cn} from "@/helpers/tailwind";
import {removeParamsFromStructure} from "@/helpers/object";
import FixWindow from "@/components/functional/FixWindow.vue";
import {type ILayout} from "@/components/functional/InputLayout";
import type {
  ICalendar,
  ICalendarPicker, IParamsDatePicker,
  IRangeDate,
  IRangeValue,
} from "@/components/form/StCalendar";
// ---------------------------------------
const props = defineProps<ICalendar>()
// ---------------------------------------
const emit = defineEmits<{
  (event: 'update:isInvalid', payload: ICalendar["isInvalid"]): void;
  (event: 'update:modelValue', payload: ICalendar["modelValue"]): void;
  (event: 'change:modelValue', payload: ICalendar["modelValue"]): void;
  (event: 'getCalendar', payload: ICalendarPicker): void;
  (event: 'isActive', payload: boolean): void;
}>()
const slots = useSlots()
// ---------------------------------------
const dataPicker = ref<HTMLElement>()
const picker = ref<HTMLElement>()
const isOpenPicker = ref<boolean>(false)
// ---------------------------------------
const datePicker = computed<Partial<IParamsDatePicker>>(()=>({
  borderless: true,
  transparent: true,
  color: "primary",
  isDark: "system",
  expanded: true,
  trimWeeks: true,
  masks: {
    modelValue: props.paramsDatePicker?.mask??'DD MMMM YYYY',
    input: [props.paramsDatePicker?.mask??'DD MMMM YYYY']
  },
  ...props.paramsDatePicker
}))
// ---------------------------------------
const classLayout = ref<ILayout["class"]>()
const calendar = ref<ICalendarPicker>();
const id = ref(props.id ?? getCurrentInstance()?.uid)
// ---------------------------------------
const value = ref<ICalendar["modelValue"]>()
const visibleDate = ref<ICalendarPicker["inputValue"]>()
watch(()=>props.modelValue,(modelValue)=>{
  value.value = (!!(modelValue as Partial<IRangeValue>)?.start && !!(modelValue as Partial<IRangeValue>)?.end)
    ?  props.paramsDatePicker?.isRange ? modelValue : null
    : !props.paramsDatePicker?.isRange ? modelValue ?? "" : {start: null, end: null}
},{immediate: true})
// ---------------------------------------
const isValue = computed<boolean>(()=> {
  if (props.paramsDatePicker?.isRange) {
    return !!(visibleDate.value as Partial<IRangeValue>)?.start && !!(visibleDate.value as Partial<IRangeValue>)?.end || isOpenPicker.value
  } else {
    return !!visibleDate.value || isOpenPicker.value
  }
})
const autoFocus = computed<NonNullable<ICalendar["autoFocus"]>>(()=> props?.autoFocus ?? false)
const isNotCloseOnDateChange = computed<NonNullable<ICalendar["isNotCloseOnDateChange"]>>(()=> props?.isNotCloseOnDateChange ?? false)
const mode = computed<NonNullable<ILayout["mode"]>>(()=> props.mode ?? "outlined")
const placeholder = computed<IParamsDatePicker["placeholder"]> (()=> String(props.paramsDatePicker?.placeholder ?? ""))
const isLoading = computed<NonNullable<ILayout["loading"]>>(()=> props.loading ?? false)
const isDisabled = computed<NonNullable<ILayout["disabled"]>>(()=> props.disabled ?? false)
const isInvalid = computed<NonNullable<ILayout["isInvalid"]>>(()=> !isDisabled.value ? props.isInvalid : false)
const messageInvalid = computed<NonNullable<ILayout["messageInvalid"]>>(()=> props.messageInvalid ?? "")
const separator = computed<NonNullable<IParamsDatePicker["separator"]>>(()=> props.paramsDatePicker?.separator ?? "arrow")
const valueLayout = computed<string>(()=>datePicker.value?.isRange
    ? (visibleDate.value as IRangeDate)?.start && (visibleDate.value as IRangeDate)?.end
        ? `${(visibleDate.value as IRangeDate)?.start} > ${(visibleDate.value as IRangeDate)?.end}` : ''
    : !!visibleDate.value ? String(visibleDate.value) : '')
const baseDate = computed(()=>{
  if (calendar.value && calendar.value?.dateParts && calendar.value?.dateParts.length) {
    const dates = <Array<Date>>calendar.value?.dateParts.map(item=>item?.date)
    if (dates.length === 2) { return {start:dates[0], end: dates[1]}
    } else if (dates.length === 1) { return dates[0] }
  } else { return null }
})
const paramsFixWindow = computed<NonNullable<ICalendar["paramsFixWindow"]>>(()=> ({
  position: "bottom-left", eventOpen: "click", eventClose: "hover", marginPx: 5, ...props?.paramsFixWindow
}))
// ---------------------------------------
const inputLayout = computed(()=>({isValue: isValue.value, mode: mode.value, label: props.label,
  labelMode: props.labelMode, isInvalid: isInvalid.value, messageInvalid: messageInvalid.value,
  required: props.required, loading: isLoading.value, disabled: isDisabled.value, help: props.help, clear: props.clear,
  classBody: props.classBody, class: props.class}))
// ---------------------------------------
onMounted(()=>{
  if (autoFocus.value) { openCalendar() }
  setTimeout(()=>{
    visibleDate.value = <ICalendarPicker["inputValue"]>(calendar.value?.inputValue as ICalendarPicker["inputValue"])
  },1)
})
// ---------------------------------------
watch(calendar, ()=>{
  emit('getCalendar', (calendar.value as ICalendarPicker))
},{deep: true})
watch(isOpenPicker, (value)=>{
  if (value) {
    document.addEventListener("keydown", keydownCalendar)
  } else {
    document.removeEventListener("keydown", keydownCalendar)
  }
  focus(value)
  emit('isActive', value)
})
// ---------------------------------------
function keydownCalendar(evt:KeyboardEvent){
  let isEscape = false;
  if ("key" in evt) { isEscape = (evt.key === "Escape" || evt.key === "Esc") }
  if (isEscape) { isOpenPicker.value = false }
}
function closeCalendar(evt:MouseEvent) {
  if ((isOpenPicker.value ?? false) && ((dataPicker.value ?? false) || ((picker.value ?? false)))) {
    isOpenPicker.value = evt.composedPath().includes(dataPicker.value as HTMLElement) ||
                         evt.composedPath().includes(picker.value as HTMLElement)
  }
}
// ---------------------------------------
const modeStyle = computed<string>(()=>
  (mode.value === "filled") ? "border-0 bg-stone-100 dark:bg-stone-900" :
    (mode.value === "outlined") ? "border border-gray-300 dark:border-gray-600 bg-white dark:bg-black" :
      (mode.value === "underlined") ? "rounded-none border-0 border-gray-300 dark:border-gray-700 border-b bg-stone-50 dark:bg-stone-950" : "")
// ---------------------------------------
function changeDate (date:ICalendarPicker["inputValue"]) {
  visibleDate.value = date
  if (!isNotCloseOnDateChange.value) {
    isOpenPicker.value=false
  }
  emit('update:isInvalid', false)
  emit('update:modelValue', baseDate.value)
  emit('change:modelValue', baseDate.value)
}
function focus (isFocus:boolean=true) {
  classLayout.value = (props.class??"") +
    (isFocus ? " border-theme-600 dark:border-theme-700 ring-2 ring-inset ring-theme-600 dark:ring-theme-700": "")
}
function openCalendar () {
  if (isDisabled.value) { return }
  isOpenPicker.value = true
}
function clearDataPicker () {
  isOpenPicker.value = false
  emit('update:isInvalid', false)
  emit('update:modelValue', null)
  emit('change:modelValue', null)
}
</script>

<template>
  <InputLayout
    :value="valueLayout"
    :class="classLayout"
    v-bind="inputLayout"
    @clear="clearDataPicker">
    <div ref="dataPicker" tabindex="0"
         :class="cn('w-full focus:outline-0 focus:ring-0 items-center', props?.classDataPicker, 'flex min-h-[36px] max-h-16 overflow-auto')"
         @focusin="focus(true)"
         @focusout="focus(false)"
         @click="openCalendar">
      <div v-if="datePicker?.isRange" :class="cn( props?.classDateText, 'flex flex-wrap items-center z-10 max-h-max cursor-default leading-3')">
        {{(visibleDate as IRangeValue)?.start}}
        <ArrowLongRightIcon
          v-if="separator === 'arrow' &&(visibleDate as IRangeValue)?.start && (visibleDate as IRangeValue)?.end"
          :class="cn(isDisabled ? 'text-slate-500 dark:text-slate-500' : 'text-gray-600 dark:text-gray-400')"
          class="h-5 w-5 mx-1"/>
        <EllipsisVerticalIcon
          v-if="separator === 'points' && (visibleDate as IRangeValue)?.start && (visibleDate as IRangeValue)?.end"
          :class="cn(isDisabled ? 'text-slate-500 dark:text-slate-500' : 'text-gray-600 dark:text-gray-400', 'h-5 w-5')"/>
        <div v-if="separator === 'none' && (visibleDate as IRangeValue)?.start && (visibleDate as IRangeValue)?.end" class="h-5 w-1"/>
        <div v-if="!(visibleDate as IRangeValue)?.start && !(visibleDate as IRangeValue)?.end&&isOpenPicker" class="text-gray-400 dark:text-gray-600">{{placeholder}}</div>
        {{(visibleDate as IRangeValue)?.end}}
      </div>
      <div v-else :class="cn(
        'border-0 w-full bg-transparent py-1.5 pl-1 cursor-default text-gray-900 dark:text-gray-100 placeholder:text-gray-400 placeholder:dark:text-gray-600 focus:ring-0 sm:text-sm sm:leading-6',
        props?.classDateText,
        isDisabled ? 'text-slate-500 dark:text-slate-500' : '',
        'block flex-1'
        )">
        <span v-if="!visibleDate&&isOpenPicker" class="text-gray-400 dark:text-gray-600">{{placeholder}}</span>
        {{visibleDate}}
      </div>
    </div>
    <template #body>
      <FixWindow v-bind="paramsFixWindow" :model-value="isOpenPicker" class-body="z-30" @close="env => closeCalendar(env)">
        <div
          ref="picker"
          :class="cn(
            'mt-1 w-min min-w-min max-w-lg max-h-max text-base sm:text-sm rounded-md ring-1 ring-black ring-opacity-5 shadow-xl',
            modeStyle,
            props?.classPicker,
            'vc-primary overflow-auto focus:outline-none'
            )">
          <DatePicker
            v-if="datePicker?.isRange"
            v-model.range.string="value"
            v-bind="removeParamsFromStructure(datePicker, ['isRange'])"
            ref="calendar"
            class="vc-primary"
            @update:modelValue="changeDate">
            <template #footer>
              <slot name="footerPicker"/>
            </template>
          </DatePicker>
          <DatePicker
            v-else
            v-model.string="value"
            v-bind="removeParamsFromStructure(datePicker, ['isRange'])"
            ref="calendar"
            class="vc-primary"
            @update:modelValue="changeDate">
            <template #footer>
              <slot name="footerPicker"/>
            </template>
          </DatePicker>
        </div>
      </FixWindow>
      <slot/>
    </template>
    <template v-if="slots.before" #before><slot name="before"/></template>
    <template v-if="slots.after" #after><slot name="after"/></template>
  </InputLayout>
</template>
<style scoped>
.vc-primary {
  --vc-accent-50: theme("colors.theme.50");
  --vc-accent-100: theme("colors.theme.100");
  --vc-accent-200: theme("colors.theme.200");
  --vc-accent-300: theme("colors.theme.300");
  --vc-accent-400: theme("colors.theme.400");
  --vc-accent-500: theme("colors.theme.500");
  --vc-accent-600: theme("colors.theme.600");
  --vc-accent-700: theme("colors.theme.700");
  --vc-accent-800: theme("colors.theme.800");
  --vc-accent-900: theme("colors.theme.900");
}
</style>