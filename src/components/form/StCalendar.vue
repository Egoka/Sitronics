<script setup lang="ts">
import {computed, getCurrentInstance, ref, useSlots, watch} from "vue";
// ---------------------------------------
import InputLayout, {type ILayout} from "@/components/functional/InputLayout.vue";
import { ArrowLongRightIcon, EllipsisVerticalIcon } from '@heroicons/vue/24/outline'
import { DatePicker } from "v-calendar";
import 'v-calendar/style.css';
// ---------------------------------------
import type {MoveOptions, MoveTarget} from "v-calendar/dist/types/src/use/calendar";
import type {UpdateOptions, ValueTarget} from "v-calendar/dist/types/src/use/datePicker";
import type {CalendarDay} from "v-calendar/dist/types/src/utils/page";
import type {PopoverEventHandlers, PopoverOptions} from "v-calendar/dist/types/src/utils/popovers";
import type {DateRangeSource, SimpleDateRange} from "v-calendar/src/utils/date/range";
import type {DateParts, DatePartsRules} from "v-calendar/dist/types/src/utils/date/helpers";
import type {DateRepeatConfig} from "v-calendar/dist/types/src/utils/date/repeat";
import type {AttributeConfig} from "v-calendar/src/utils/attribute";
import type {LocaleConfig} from "v-calendar/src/utils/locale";
import type {DateRange} from "v-calendar/dist/types/src/utils/date/range";
import type {Attribute} from "v-calendar/dist/types/src/utils/attribute";
import type {Theme} from "v-calendar/dist/types/src/utils/theme";
// ---------------------------------------
import {getParamsStructure} from "@/helpers/object";
// ---------------------------------------

type DateValueCalendar = Date | number | string | null
// https://vcalendar.io/i18n/masks.html
export type CalendarMask =
  "M"|"MM"|"MMM"|"MMMM"| //Month
  "D"|"DD"|"Do"| //Month Day
  "d"|"dd"| "W"|"WW"|"WWW"|"WWWW"| //Week Day
  "YY"|"YYYY"| //Year
  "h"|"hh"|"H"|"HH"| //Hour
  "m"|"mm"| //Minute
  "s"|"ss"| //Second
  "S"|"SS"|"SSS"| //Fractional Second
  "A"|"a"| //AM/PM
  "ZZ"|"ZZZ"|"ZZZZ"| //Timezone
  "L"| //Localized Date
  "DD MMMM YYYY"|"DD.MM.YYYY"|"YYYY/MM/DD"|string
export type ColorCalendarPicker = "primary"|"gray"|"red"|"orange"|"yellow"|"green"|"teal"|"blue"|"indigo"|"purple"|"pink"

export interface IRangeDate {
  start: string;
  end: string;
}
export interface ICalendarPicker {
  showCalendar: boolean
  datePickerPopoverId: string
  popoverRef: any;
  popoverEvents: Partial<PopoverEventHandlers>
  calendarRef: any;
  isRange: boolean
  isTimeMode: boolean
  isDateTimeMode: boolean
  is24hr: boolean
  hideTimeHeader: boolean
  timeAccuracy: number
  isDragging: boolean
  inputValue: string | IRangeDate
  inputEvents: {
    click?: ((e: MouseEvent) => void) | undefined;
    mousemove?: ((e: MouseEvent) => void) | undefined;
    mouseleave?: ((e: MouseEvent) => void) | undefined;
    focusin?: ((e: MouseEvent) => void) | undefined;
    focusout?: ((e: MouseEvent) => void) | undefined;
    input: (e: InputEvent) => void;
    change: (e: InputEvent) => void;
    keyup: (e: KeyboardEvent) => void;
  } | {
    start: {
      click?: ((e: MouseEvent) => void) | undefined;
      mousemove?: ((e: MouseEvent) => void) | undefined;
      mouseleave?: ((e: MouseEvent) => void) | undefined;
      focusin?: ((e: MouseEvent) => void) | undefined;
      focusout?: ((e: MouseEvent) => void) | undefined;
      input: (e: InputEvent) => void;
      change: (e: InputEvent) => void;
      keyup: (e: KeyboardEvent) => void;
    };
    end: {
      click?: ((e: MouseEvent) => void) | undefined;
      mousemove?: ((e: MouseEvent) => void) | undefined;
      mouseleave?: ((e: MouseEvent) => void) | undefined;
      focusin?: ((e: MouseEvent) => void) | undefined;
      focusout?: ((e: MouseEvent) => void) | undefined;
      input: (e: InputEvent) => void;
      change: (e: InputEvent) => void;
      keyup: (e: KeyboardEvent) => void;
    };
  };
  dateParts: (DateParts | null)[]
  attributes: any[]
  rules: DatePartsRules[]
  move: (target: MoveTarget, opts?: Partial<MoveOptions>) => Promise<any>;
  moveBy: (pages: number, opts?: Partial<MoveOptions>) => Promise<any>;
  moveToValue: (target: ValueTarget, opts?: Partial<MoveOptions>) => Promise<any>;
  updateValue: (value: any, opts?: Partial<UpdateOptions>) => Promise<string | number | Date | DateParts | {
    start: string | number | Date | DateParts | null;
    end: string | number | Date | DateParts | null;
  } | null>;
  showPopover: (opts?: Partial<PopoverOptions>) => void;
  hidePopover: (opts?: Partial<PopoverOptions>) => void;
  togglePopover: (opts: Partial<PopoverOptions>) => void;
  onDayClick: (day: CalendarDay, event: MouseEvent) => void;
  onDayKeydown: (day: CalendarDay, event: KeyboardEvent) => void;
  onDayMouseEnter: (day: CalendarDay, event: MouseEvent) => void;
  onPopoverBeforeShow: (el: HTMLElement) => void;
  onPopoverAfterShow: (el: HTMLElement) => void;
  onPopoverBeforeHide: (el: HTMLElement) => void;
  onPopoverAfterHide: (el: HTMLElement) => void;
  color: string
  isDark: boolean | "system" | import("vue-screen-utils").DarkModeClassConfig
  displayMode: "light" | "dark"
  theme: Theme
  locale: import("vue").ComputedRef<import("v-calendar/dist/types/src/utils/locale")>;
  masks: any
  disabledDates: DateRange[]
  disabledAttribute: Attribute
}

export interface IMasksDate {
  title?: string
  weekdays?: string
  navMonths?: string
  dayPopover?: string
  data?: Array<string>
  modelValue?: CalendarMask
  input?:  Array<CalendarMask>
}
interface IAttributeConfig extends Omit<Partial<AttributeConfig>, "dates">  {
  dates: DateRangeSource|DateRangeSource[]
}
export interface IRangeValue {
  start: DateValueCalendar;
  end: DateValueCalendar;
  span: number;
  order: number;
  repeat: Partial<DateRepeatConfig>;
}
export interface IDatePicker {
  classPicker: string|Array<string|null>
  ///Calendar//////////////////////
  borderless: boolean
  transparent: boolean
  color: ColorCalendarPicker
  isDark: boolean|"system"
  expanded: boolean
  titlePosition: "center"|"left"|"right"
  view: "daily"|"weekly"|"monthly"
  showWeeknumbers: "left"|"left-outside"|"right"|"right-outside"
  trimWeeks: boolean
  rows: number
  columns: number
  step: number
  minDate: Date|string|null
  maxDate: Date|string|null
  popover: Partial<PopoverOptions>
  attributes: Partial<IAttributeConfig>[]
  ///DatePicker//////////////////////
  mode:'date' | 'dateTime' | 'time'
  isRange: boolean
  isRequired: boolean
  is24hr: boolean
  mask: CalendarMask
  masks: IMasksDate
  disabledDates: DateRangeSource | DateRangeSource[]
  selectAttribute: Partial<IAttributeConfig>
  rules: 'auto' | DatePartsRules
  locale: string | Partial<LocaleConfig>
  timezone: 'UTC'| string
  placeholder: string
  separator: "arrow"|"points"|"none"
}
export interface ICalendar extends Omit<ILayout, "value"|"isValue">{
  id?: string
  modelValue?: DateValueCalendar | Partial<IRangeValue>
  paramsDatePicker?: Partial<IDatePicker>
}
// ---------------------------------------
const props = defineProps<ICalendar>()
// ---------------------------------------
const emit = defineEmits<{
  (event: 'update:isInvalid', payload: ICalendar["isInvalid"]): void;
  (event: 'update:modelValue', payload: ICalendar["modelValue"]): void;
  (event: 'getCalendar', payload: ICalendarPicker): void;
}>()
const slots = useSlots()
// ---------------------------------------
const inputBody = ref<HTMLElement>()
const isOpenPicker = ref(false)
// ---------------------------------------
const datePicker = computed<Partial<IDatePicker>>(()=>{return {
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
}})
// ---------------------------------------
const classLayout = ref<ILayout["class"]>()
const calendar = ref<ICalendarPicker>();
const input = ref<HTMLElement|undefined>()
const id = ref(props.id ?? getCurrentInstance()?.uid)
const value = ref<ICalendar["modelValue"]>(
  (!!(props.modelValue as Partial<IRangeValue>)?.start && !!(props.modelValue as Partial<IRangeValue>)?.end)
  ?  props.paramsDatePicker?.isRange ? props.modelValue : null
  : !props.paramsDatePicker?.isRange ? props.modelValue ?? "" : {start: null, end: null} )
const isValue = computed<boolean>(()=> {
  if (props.paramsDatePicker?.isRange) {
    return !!(visibleDate.value as Partial<IRangeValue>)?.start && !!(visibleDate.value as Partial<IRangeValue>)?.end || isOpenPicker.value
  } else {
    return !!visibleDate.value || isOpenPicker.value
  }
})
const mode = computed<NonNullable<ILayout["mode"]>>(()=> props.mode ?? "outlined")
const placeholder = computed<IDatePicker["placeholder"]> (()=> String(props.paramsDatePicker?.placeholder ?? ""))
const isLoading = computed<NonNullable<ILayout["loading"]>>(()=> props.loading ?? false)
const isDisabled = computed<NonNullable<ILayout["disabled"]>>(()=> props.disabled ?? false)
const isInvalid = computed<NonNullable<ILayout["isInvalid"]>>(()=> !isDisabled.value ? props.isInvalid : false)
const messageInvalid = computed<NonNullable<ILayout["messageInvalid"]>>(()=> props.messageInvalid ?? "")
const separator = computed<NonNullable<IDatePicker["separator"]>>(()=> props.paramsDatePicker?.separator ?? "arrow")
const visibleDate = ref<ICalendarPicker["inputValue"]>()
const valueLayout = computed<string>(()=>datePicker.value?.isRange
    ? (visibleDate.value as IRangeDate)?.start && (visibleDate.value as IRangeDate)?.end
        ? `${(visibleDate.value as IRangeDate)?.start} > ${(visibleDate.value as IRangeDate)?.end}` : ''
    : !!visibleDate.value ? String(visibleDate.value) : '')
const baseDate = computed<Date|SimpleDateRange|null>(()=>{
  if (calendar.value && calendar.value?.dateParts && calendar.value?.dateParts.length) {
    const dates = <Array<Date>>calendar.value?.dateParts.map(item=>item?.date)
    if (dates.length === 2) { return {start:dates[0], end: dates[1]}
    } else if (dates.length === 1) { return dates[0] }
  } else { return null }
})
// ---------------------------------------
const inputLayout = computed(()=>{return{isValue: isValue.value, mode: mode.value, label: props.label,
  labelMode: props.labelMode, isInvalid: props.isInvalid, messageInvalid: props.messageInvalid,
  required: props.required, loading: isLoading.value, disabled: isDisabled.value, help: props.help, clear: props.clear,
  classBody: props.classBody, class: props.class}})
// ---------------------------------------
watch(()=>props.modelValue, (modelValue)=>{
  value.value = modelValue
},{deep: true})
watch(calendar, ()=>{
  emit('getCalendar', (calendar.value as ICalendarPicker))
},{deep: true})
watch(isOpenPicker, (value)=>{
  if (value) {
    document.addEventListener("click", closeCalendar)
    document.addEventListener("keydown", keydownCalendar)
  } else {
    document.removeEventListener("click", closeCalendar);
    document.removeEventListener("keydown", keydownCalendar)
  }
  focus(value)
})
// ---------------------------------------
function keydownCalendar(evt:KeyboardEvent){
  let isEscape = false;
  if ("key" in evt) { isEscape = (evt.key === "Escape" || evt.key === "Esc") }
  if (isEscape) { isOpenPicker.value = false }
}
function closeCalendar(evt:MouseEvent) {
  visibleDate.value = <ICalendarPicker["inputValue"]>(calendar.value?.inputValue as ICalendarPicker["inputValue"])
  const dataPicker = document.getElementById(`dataPicker${id.value}`)
  const picker = document.getElementById(`picker${id.value}`)
  if (isOpenPicker.value && dataPicker && picker) {
    isOpenPicker.value = evt.composedPath().includes(dataPicker) || evt.composedPath().includes(picker)
  }
}
// ---------------------------------------
function changeDate (date:ICalendarPicker["inputValue"]) {
  visibleDate.value = date
  isOpenPicker.value=false
  emit('update:isInvalid', false)
  emit('update:modelValue', baseDate.value)
}
function focus (isFocus:boolean=true) {
  classLayout.value = (props.class??"") +
    (isFocus ? " border-primary-600 dark:border-primary-700 ring-2 ring-inset ring-primary-600 dark:ring-primary-700": "")
}
function open () {
  if (isDisabled.value) { return }
  isOpenPicker.value=true
}
function clear () {
  isOpenPicker.value=false
  emit('update:isInvalid', false)
  emit('update:modelValue', null)
}
</script>

<template>
  <InputLayout
    :value="valueLayout"
    :class="classLayout"
    v-bind="inputLayout"
    @clear="clear">
    <div :id="`dataPicker${id}`"
         ref="inputBody"
         tabindex="0"
         class="flex w-full min-h-[36px] max-h-16 overflow-auto focus:outline-0 focus:ring-0"
         @focusin="focus(true)"
         @focusout="focus(false)"
         @click="open">
      <div v-if="datePicker?.isRange" class="flex flex-wrap items-center z-10 max-h-max cursor-default">
        {{(visibleDate as IRangeValue)?.start}}
        <ArrowLongRightIcon
          v-if="separator === 'arrow' &&(visibleDate as IRangeValue)?.start && (visibleDate as IRangeValue)?.end"
          :class="[isDisabled ? 'text-slate-500 dark:text-slate-500' : 'text-gray-600 dark:text-gray-400']"
          class="h-5 w-5 mx-1"/>
        <EllipsisVerticalIcon
          v-if="separator === 'points' && (visibleDate as IRangeValue)?.start && (visibleDate as IRangeValue)?.end"
          :class="[isDisabled ? 'text-slate-500 dark:text-slate-500' : 'text-gray-600 dark:text-gray-400']"
          class="h-5 w-5"/>
        <div v-if="separator === 'none' && (visibleDate as IRangeValue)?.start && (visibleDate as IRangeValue)?.end" class="h-5 w-1"/>
        <div v-if="!(visibleDate as IRangeValue)?.start && !(visibleDate as IRangeValue)?.end&&isOpenPicker" class="text-gray-400 dark:text-gray-600">{{placeholder}}</div>
        {{(visibleDate as IRangeValue)?.end}}
      </div>
      <div v-else :class="[isDisabled ? 'text-slate-500 dark:text-slate-500' : '']"
           class="block flex-1 border-0 w-full bg-transparent py-1.5 pl-1 cursor-default text-gray-900 dark:text-gray-100 placeholder:text-gray-400 placeholder:dark:text-gray-600 focus:ring-0 sm:text-sm sm:leading-6 transition-all">
        <span v-if="!visibleDate&&isOpenPicker" class="text-gray-400 dark:text-gray-600">{{placeholder}}</span>
        {{visibleDate}}
      </div>
    </div>
    <template #body>
      <transition leave-active-class="transition ease-in-out duration-200" leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 -translate-y-5"
                        enter-active-class="transition ease-in-out duration-200" enter-from-class="opacity-0 -translate-y-5" enter-to-class="opacity-100 translate-y-0">
        <div v-show="isOpenPicker"
             :id="`picker${id}`"
             class="vc-primary absolute z-50 mt-1 w-min min-w-min max-w-lg max-h-max overflow-auto text-base rounded-md ring-1 ring-black ring-opacity-5 shadow-xl focus:outline-none sm:text-sm"
             :class="[ props.paramsDatePicker?.classPicker,
               !(mode === 'outlined')||'border-[1px] border-gray-300 dark:border-gray-600 bg-white dark:bg-black',
               !(mode === 'underlined')||'rounded-none border-0 border-gray-300 dark:border-gray-700 border-b-[1px] bg-stone-50 dark:bg-stone-950',
               !(mode === 'filled')||'border-0 bg-stone-100 dark:bg-stone-900'
               ]">
          <DatePicker v-if="datePicker?.isRange" v-model.range.string="value" v-bind="getParamsStructure(datePicker, ['isRange'])" ref="calendar" @update:modelValue="changeDate"><template #footer><slot name="footerPicker"/></template></DatePicker>
          <DatePicker v-else v-model.string="value" v-bind="getParamsStructure(datePicker, ['isRange'])" ref="calendar" @update:modelValue="changeDate"><template #footer><slot name="footerPicker"/></template></DatePicker>
        </div>
      </transition>
      <slot/>
    </template>
    <template v-if="slots.before" #before><slot name="before"/></template>
    <template #after><slot name="after"/></template>
  </InputLayout>
</template>
<style>
.vc-primary {
  --vc-accent-50: theme("colors.primary.50");
  --vc-accent-100: theme("colors.primary.100");
  --vc-accent-200: theme("colors.primary.200");
  --vc-accent-300: theme("colors.primary.300");
  --vc-accent-400: theme("colors.primary.400");
  --vc-accent-500: theme("colors.primary.500");
  --vc-accent-600: theme("colors.primary.600");
  --vc-accent-700: theme("colors.primary.700");
  --vc-accent-800: theme("colors.primary.800");
  --vc-accent-900: theme("colors.primary.900");
}
</style>