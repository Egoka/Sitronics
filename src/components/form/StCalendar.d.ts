import type {PopoverEventHandlers, PopoverOptions} from "v-calendar/dist/types/src/utils/popovers";
import type {DateParts, DatePartsRules} from "v-calendar/dist/types/src/utils/date/helpers";
import type {MoveOptions, MoveTarget} from "v-calendar/dist/types/src/use/calendar";
import type {UpdateOptions, ValueTarget} from "v-calendar/dist/types/src/use/datePicker";
import type {CalendarDay} from "v-calendar/dist/types/src/utils/page";
import type {Theme} from "v-calendar/dist/types/src/utils/theme";
import type {DateRange} from "v-calendar/dist/types/src/utils/date/range";
import type {Attribute} from "v-calendar/dist/types/src/utils/attribute";
import type {AttributeConfig} from "v-calendar/src/utils/attribute";
import type {DateRangeSource} from "v-calendar/src/utils/date/range";
import type {DateRepeatConfig} from "v-calendar/dist/types/src/utils/date/repeat";
import type {StyleClass} from "@/components/BaseTypes";
import type {IFixWindow} from "@/components/functional/FixWindow";
import type {LocaleConfig} from "v-calendar/src/utils/locale";
import type {ILayout} from "@/components/functional/InputLayout";

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
export interface SimpleDateRange {
  start: Date;
  end: Date;
}
export interface IRangeValue {
  start: DateValueCalendar;
  end: DateValueCalendar;
  span: number;
  order: number;
  repeat: Partial<DateRepeatConfig>;
}
export interface IParamsDatePicker {
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
export interface IDatePicker {
  paramsDatePicker?: Partial<IParamsDatePicker>
  autoFocus?: boolean
  isNotCloseOnDateChange?: boolean
  classDataPicker?: StyleClass
  classPicker?: StyleClass
  classDateText?: StyleClass
  paramsFixWindow?: IFixWindow
}
export interface ICalendar extends Omit<ILayout, "value"|"isValue">, Partial<IDatePicker>{
  id?: string
  modelValue?: DateValueCalendar | Partial<IRangeValue>
}