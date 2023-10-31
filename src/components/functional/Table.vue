<script setup lang="ts">
import {computed, onMounted, onUnmounted, reactive, ref, useSlots, watch} from "vue";
import {
  ArrowLongUpIcon, ArrowLongDownIcon,
  BarsArrowUpIcon, BarsArrowDownIcon,
  MagnifyingGlassIcon, FunnelIcon
} from "@heroicons/vue/20/solid";
import * as LData from "lodash";
import dayjs from 'dayjs'
import Loading from "@/components/functional/Loading.vue";
import Button from "@/components/functional/Button.vue";
import Tooltip from "@/components/functional/Tooltip.vue";
import Pagination, {type IPagination} from "@/components/functional/Pagination.vue";
import StInput, {type IDataInput} from "@/components/form/StInput.vue";
import StSelect, {type IDateSelect} from "@/components/form/StSelect.vue";
import StCalendar, {type IDatePicker, type IRangeValue} from "@/components/form/StCalendar.vue";
import isBetween from 'dayjs/plugin/isBetween'
import {convertToNumber, convertToPhone} from "@/helpers/numbers";
import type {StyleClass, IMode} from "@/components/BaseTypes";
// ---------------------------------------
type DataType = "string"|"number"|"select"|"date"
type Sort = "asc"|"desc"|null
// ---------------------------------------
export interface IToolbar {
  visible?:boolean
  search?:boolean
}
export interface ISort {
  visible?:boolean
  icon?:"Bars"|"Arrow"
}
export interface IFilter{
  visible?:boolean
  noFilter?:string
  isClearAllFilter?:boolean
}
export interface IGrouping{
  visible?:boolean
  groupField?:string
}
export interface IColumn {
  dataField?:string
  name?:string
  caption?:string
  type?:DataType
  visible?:boolean
  width?:number
  minWidth?:number
  maxWidth?:number
  isFilter?:boolean
  isSort?:boolean
  defaultFilter?: any
  defaultSort?: Sort
  mask?:IDataInput["mask"]
  paramsInput?: IDataInput
  paramsSelect?: IDateSelect
  paramsDatePicker?: Partial<IDatePicker>
  cellTemplate?: string
  class?:{
    th?: StyleClass
    colFilter?: StyleClass
    colFilterClass?: StyleClass|"border-none font-normal"
    colFilterClassBody?: StyleClass|"tm-0 my-1"
    colText?: StyleClass|"text-left text-gray-400 dark:text-gray-500"
    td?: StyleClass|"px-6 py-4 text-gray-800 dark:text-gray-300"
    cellText?: StyleClass|"flex items-center whitespace-pre-line overflow-auto"
    tf?: StyleClass
    sumText?: StyleClass|"text-left text-gray-400 dark:text-gray-500"
  }
}
interface IColumnPrivate extends IColumn {
  id: string
}
export interface ISummary {
  dataField?: string
  name?: string
  displayFormat?: string|"Sum: {0}"|"Min: {0}"|"Max: {0}"|"Avg: {0}"|"Count: {0}"
  type?: "sum"|"min"|"max"|"avg"|"count"
  dataType: DataType
  customizeText?(summary:ISummary, result:string):string
}
interface ISummaryPrivate extends ISummary {
  id: string
}
export interface ITablePagination extends Omit<IPagination, 'total'|'modelValue'> {
  visible?:boolean
  startPage?:number
}
export interface IStyles {
  class?: {
    body?: StyleClass|'p-1.5'
    toolbar?: StyleClass|'justify-end'
    bodyTable?: StyleClass
    slotHeader?: StyleClass
    slotFooter?: StyleClass
    table?: StyleClass
    thead?: StyleClass
    tbody?: StyleClass
    tfoot?: StyleClass
    group?: StyleClass|'text-left text-gray-800 dark:text-gray-300 px-6 py-2 pr-3 pl-10 sm:pl-12'
    groupText?: StyleClass|'left-10 sm:left-12 flex items-center w-fit min-h-[2.5rem] truncate'
    pagination?: StyleClass
  }
  hoverRows?:string|'hover:bg-neutral-100/90 dark:hover:bg-neutral-900/50'|boolean
  isStripedRows?:boolean
  horizontalLines?:boolean
  verticalLines?:boolean
  borderRadiusPx?: number
  filterLines?:boolean
  border?: string|'border-neutral-200 dark:border-neutral-800'|'border-0 border-b-0 border-t-0 border-r-0'|{
    table?: string|'border-neutral-200 dark:border-neutral-800'|'border-0'
    header?: string|'border-neutral-200 dark:border-neutral-800'|'border-b-0'
    filter?: string|'border-neutral-200 dark:border-neutral-800'|'border-r-0'
    head?: string|'border-neutral-200 dark:border-neutral-800'|'border-b-0'
    cell?: string|'border-neutral-200 dark:border-neutral-800'|'border-0'
    summary?: string|'border-neutral-200 dark:border-neutral-800'|'border-t-0'
    pagination?: string|'border-neutral-200 dark:border-neutral-800'|'border-t-0'
    footer?: string|'border-neutral-200 dark:border-neutral-800'|'border-t-0'
  }
}
export interface IStylesPrivate extends Omit<IStyles, 'border|hoverRows|class'> {
  class: {
    body: StyleClass
    toolbar: StyleClass
    bodyTable: StyleClass
    slotHeader: StyleClass
    slotFooter: StyleClass
    table: StyleClass
    thead: StyleClass
    tbody: StyleClass
    tfoot: StyleClass
    group: StyleClass
    groupText: StyleClass
    pagination: StyleClass
  }
  hoverRows: string
  border: {
    table: string
    header: string
    filter: string
    head: string
    cell: string
    summary: string
    pagination: string
    footer: string
  }
}
// ---------------------------------------
export interface ITable {
  mode?:IMode
  dataSource?: Array<any>|[]
  toolbar?: IToolbar|boolean
  sort?: ISort|boolean
  filter?: IFilter|boolean
  grouping?: IGrouping|string
  pagination?: ITablePagination|boolean
  search?:boolean
  columns?: boolean|Array<IColumn>
  summary?: boolean|Array<ISummary>
  countVisibleRows?: number
  heightCell?:number
  noData?:string
  noColumn?:string
  noFilter?:string
  unchangedColumns?:boolean
  classMaskQuery?: "font-bold text-primary-700 dark:text-primary-300"|string
  countDataOnLoading?:number|100|1000|10000
  styles?:IStyles
}
// ---------------------------------------
const props = defineProps<ITable>()
const emit = defineEmits<{
}>();
const slots = useSlots()
// ---------------------------------------
const tableBody = ref<HTMLElement>()
const tableFooter = ref<HTMLElement>()
const table = ref<HTMLElement>()
const thead = ref<HTMLElement>()
const tbody = ref<HTMLElement>()
const tfoot = ref<HTMLElement>()
const pager = ref<HTMLElement>()
// ---------------------------------------
let queryTable = ref<string>("")
let pageTable = ref<number>(1)
let sizeTable = ref<number>(5)
let widthsColumns = reactive<Array<number>|[]>([])
let sortColumns = reactive<{ [keys:string]: Sort }>({})
let filterColumns = reactive<object>({})
let dataOriginal = ref<ITable["dataSource"]>(props.dataSource ?? [])
// ---------------------------------------
const isLoading = ref<boolean>(false)
// ---------------------------------------
const mode = computed<NonNullable<ITable["mode"]>>(()=> props.mode ?? "outlined")
const isVisibleToolbar = computed<boolean>(()=> isSearch.value ?? (props.toolbar as IToolbar)?.visible ?? (!!props.toolbar ?? !!(Object.keys(props.toolbar).length)) ?? false)
const isSearch = computed<boolean>(()=> props.search ?? (props?.toolbar as IToolbar)?.search ?? false)
const isFilterClear = computed<boolean>(()=>((props.filter as IFilter)?.isClearAllFilter ?? false) && (!!noEmptyFilters(filterColumns).length ?? !!queryTable.value.length))
const isColumns = computed<boolean>(()=> typeof props.columns === "boolean" ? props.columns : Array.isArray(props.columns))
const isSummary = computed<boolean>(()=> typeof props.summary === "boolean" ? props.summary : Array.isArray(props.summary))
const countDataOnLoading = computed<ITable["countDataOnLoading"]>(()=> props.countDataOnLoading ?? 1000)
const classMaskQuery = computed<NonNullable<ITable["classMaskQuery"]>>(()=> props.classMaskQuery ?? "font-bold text-primary-700 dark:text-primary-400")
const noData = computed<NonNullable<ITable["noData"]>>(()=> props.noData ?? "Нет данных")
const noColumn = computed<NonNullable<ITable["noData"]>>(()=> props.noColumn ?? "Нет колонок")
const noFilter = computed<NonNullable<IFilter["noFilter"]>>(()=> props.noFilter ?? "Не найдено подходящих данных")
const iconSort = computed<ISort["icon"]>(()=>(props?.sort as ISort)?.icon ?? "Arrow")
const unchangedColumns = computed<ITable["unchangedColumns"]>(()=>props.unchangedColumns)
const lengthData = computed<number>(()=> dataSource.value.length)
const groupField = computed<IGrouping["groupField"]|null>(()=>typeof props?.grouping === "object"
  ? typeof props?.grouping?.groupField === "string" ? props.grouping.groupField : null
  : typeof props?.grouping === "string" ? props.grouping : null )
const isFilter = computed<boolean>(()=>typeof props?.filter === "object"
  ? typeof props?.filter?.visible === "boolean" ? props.filter.visible : true
  : typeof props?.filter === "boolean" ? props.filter : false )
const isSort = computed<boolean>(()=>typeof props?.sort === "object"
  ? typeof props?.sort?.visible === "boolean" ? props.sort.visible : true
  : typeof props?.sort === "boolean" ? props.sort : false )
const isGroup = computed<boolean>(()=>typeof props?.grouping === "object"
  ? typeof props?.grouping?.visible === "boolean" ? props.grouping.visible : true
  : typeof props?.grouping === "string" ? !!props.grouping.length : false )
const isPagination = computed<boolean>(()=>typeof props?.pagination === "object"
  ? typeof props?.pagination?.visible === "boolean" ? props.pagination.visible : true
  : typeof props?.pagination === "boolean" ? props.pagination : false )
// ---PAGINATION--------------------------
const startPage = computed<NonNullable<ITablePagination["startPage"]>>(()=>(props.pagination as ITablePagination).startPage ?? 1)
const modePagination = computed<NonNullable<ITablePagination["mode"]>>(()=>(props.pagination as ITablePagination).mode ?? mode.value)
const sizePage = computed<NonNullable<ITablePagination["sizePage"]>>(()=>(props.pagination as ITablePagination).sizePage??countVisibleRows.value)
const visibleNumberPages = computed<ITablePagination["visibleNumberPages"]>(()=>(props.pagination as ITablePagination).visibleNumberPages)
const sizesSelector = computed<ITablePagination["sizesSelector"]>(()=>(props.pagination as ITablePagination).sizesSelector)
const isInfoText = computed<ITablePagination["isInfoText"]>(()=>(props.pagination as ITablePagination).isInfoText ?? false)
const isPageSizeSelector = computed<ITablePagination["isPageSizeSelector"]>(()=>(props.pagination as ITablePagination).isPageSizeSelector ?? false)
const isHiddenNavigationButtons = computed<ITablePagination["isHiddenNavigationButtons"]>(()=>(props.pagination as ITablePagination).isHiddenNavigationButtons ?? false)
// ---CELL--------------------------------
const heightCell = computed<number>(()=> props.heightCell ?? 1.5)
const heightRow = computed<number>(()=> {
  const tagTr = (tbody.value as HTMLElement)?.querySelector("tr")
  if (tagTr) { return tagTr.offsetHeight
  } else { const basePadding = 2;return basePadding * 16 + heightCell.value * 16 + 1 }
})
const countVisibleRows = computed<NonNullable<ITable["countVisibleRows"]>>(()=> props.countVisibleRows ?? 5)
const heightTable = computed<number>(()=> {
  return (thead.value?.clientHeight ?? 0) + (tfoot.value?.clientHeight ?? 0) + countVisibleRows.value * (heightRow.value||2 * 16 + heightCell.value * 16 + 1) -1
})
// ---DATA--------------------------------
const dataSource = computed<Array<any>>(()=> {
  let data = dataOriginal.value
  // Sort
  if (data && Object.keys(sortColumns).filter(i=>sortColumns[i] !== null).length){
    const sortedFields = Object.keys(sortColumns).reduce((result, column)=>{
      if (sortColumns[column] === "asc" || sortColumns[column] === "desc"){
        result[column] = sortColumns[column] }
      return result }, {})
    data = LData.orderBy(data, Object.keys(sortedFields), Object.values(sortedFields))
  }
  // Filter
  if (data && noEmptyFilters(filterColumns).length){
    const filter = noEmptyFilters(filterColumns)
      .reduce((result, column)=> {
        result[column] = filterColumns[column]
        return result
      }, {})
    data = LData.filter(data,(row) => Object.keys(filter)
      .filter(item => {
        const column = dataColumns.value.find(col=>col.dataField === item)
        return isEqualsValue(column, row[column.dataField], filter[column.dataField])
      }).length === Object.keys(filter).length)
    pageTable.value = 1
  }
  // Search
  if (data && queryTable.value.length){
    data = LData.filter(data,(row) => !!dataColumns.value
      .filter(item => item.visible)
      .filter(item => isEqualsValue(item, row[item.dataField], queryTable.value)).length)
    pageTable.value = 1
  }
  isLoading.value = false
  return data ?? []
})
const resultDataSource = computed(()=> {
  let resultData:any = dataSource.value
  if (isPagination.value) {
    if (isGroup.value) {
      resultData = Object.values(LData.groupBy(resultData, (item) => item[groupField.value])).flat() }
    resultData = LData.slice(resultData, sizeTable.value * (pageTable.value - 1), sizeTable.value * (pageTable.value)) }
  resultData = isGroup.value ? LData.groupBy(resultData, (item) => item[groupField.value]) : {0: resultData}
  return resultData
})
const dataColumns = computed<Array<IColumnPrivate>>(()=> {
  let listFields:Array<string> = LData.uniq(LData.flatten(LData.map(dataOriginal.value, LData.keys)))
  if (Array.isArray(props.columns) && props.columns?.length){
    return <Array<IColumnPrivate>>props.columns
      .map((column, index)=>{
        const fieldName = column.dataField ?? listFields[index] ?? ""
        if (fieldName === ""){ return false}
        const options = <IColumnPrivate>{
          ...column,
          id: `Col-${fieldName}-${index}`,
          dataField: fieldName,
          name: `Col-${column.name ?? fieldName}`,
          caption: column.caption ??
            (/^\d+$/.test(fieldName) ? `Col ${fieldName}`
            :(fieldName as string).charAt(0).toUpperCase() + (fieldName as string).slice(1)),
          visible: typeof column?.visible === "boolean" ? column.visible : true,
          isFilter: typeof column.isFilter === "boolean" ? column.isFilter : isFilter.value,
          isSort: typeof column.isSort === "boolean" ? column.isSort : isSort.value,
          type: column.type ?? "string",
          class: {
            ...column.class,
            colFilterClass: column.class?.colFilterClass??"border-none font-normal",
            colFilterClassBody: column.class?.colFilterClassBody??"tm-0 my-1",
            colText: column.class?.colText??"text-left text-gray-400 dark:text-gray-500",
            td: column.class?.td??"px-6 py-4 text-gray-800 dark:text-gray-300",
            cellText: column.class?.cellText??"flex items-center whitespace-pre-line overflow-auto",
            sumText: column.class?.sumText??"font-normal text-sm text-left text-gray-400 dark:text-gray-500"
          }
        }
        switch (options.type) {
          case "string": {
            options.paramsInput = <IDataInput>{
              autocomplete: "off",
              ...column.paramsInput};break
          }
          case "number": {
            options.paramsInput = <IDataInput>{
              autocomplete: "off",
              mask: "number",
              ...column.paramsInput};break
          }
          case "select": {
            options.paramsSelect = <IDateSelect>{
              multiple: true,
              maxVisible: 0,
              classSelect: 'normal-case font-normal max-h-[25rem]',
              classSelectList: 'normal-case font-normal',
              dataSelect: LData.compact(LData.uniq(LData.map(dataOriginal.value, options.dataField ?? ""))) ?? [],
              ...column.paramsSelect};break
          }
          case "date": {
            options.paramsDatePicker = {
              isRange: true,
              attributes: [{
                highlight: {
                  fillMode: 'light',
                },
                dates: LData.compact(LData.uniq(LData.map(dataOriginal.value, (item)=> item[options.dataField] ? String(item[options.dataField]) : null ))) ?? [],
              }],
              mask: column.paramsDatePicker?.masks?.modelValue ?? "DD.MM.YYYY",
              ...column.paramsDatePicker
            };
            break
          }
        }
        return options
      }).filter(i=>i)
  } else {
    return <Array<IColumnPrivate>>listFields.map((column:string, index)=>{
      return {
        id: `Col-${column}-${index}`,
        dataField: column,
        name: `Col-${column}`,
        caption: /^\d+$/.test(column) ? `Col ${column}`
          : (column.charAt(0).toUpperCase() + column.slice(1))?.replace(/_/g, ' '),
        visible: true,
        isFilter: isFilter.value,
        isSorting: isSort.value,
        type: "string"
      }
    })
  }
})
const dataSummary = computed<Array<ISummaryPrivate>>(()=> {
  if (!isSummary.value) { return []}
  if (Array.isArray(props.summary) && props.summary?.length){
    return <Array<ISummaryPrivate>>props.summary.map((summary, index)=>{
      const column = getColumn(summary.dataField, index)
      const summaryName = summary.dataField ?? column.dataField
      return {
        id: `Sum-${summary.name ?? summaryName}-${index}`,
        name: `Sum-${summary.name ?? summaryName}`,
        dataField: summaryName,
        displayFormat: summary.displayFormat ?? (
                summary.type === "max" ? "Max: {0}"
              : summary.type === "min" ? "Min: {0}"
              : summary.type === "sum" ? "Sum: {0}"
              : summary.type === "avg" ? "Avg: {0}"
              : summary.type === "count"?"Count: {0}"
              : "Count: {0}" ) ??
          ((["string", "date"]).includes(column.type as string) ? "Кол. {0}"
          : (["number", "select"]).includes(column.type as string) ? "Сум. {0}"
            : "Кол. {0}"),
        type: summary.type ?? ((["string", "date", "select"]).includes(column.type as string) ? "count"
          : (["number"]).includes(column.type as string) ? "sum"
            : "count"),
        customizeText: summary.customizeText,
        dataType: summary.dataType ?? column.type
      }
    })
  } else {
    return <Array<ISummaryPrivate>>dataColumns.value.filter(item => item.visible).map(column=>{
      return {
        name: `Sum-${column.name}`,
        dataField: column.dataField,
        displayFormat: (["string", "date"]).includes(column.type as string) ? "Кол. {0}"
          : (["number", "select"]).includes(column.type as string) ? "Сум. {0}"
            : "Кол. {0}",
        type: (["string", "date", "select"]).includes(column.type as string) ? "count"
          : (["number"]).includes(column.type as string) ? "sum"
          : "count",
        dataType: column.type
      }
    })
  }
})
const summaryColumns = computed<object>(()=>{
  if (!isSummary.value || !dataSummary.value?.length) { return {}}
  return dataSummary.value
    .reduce((result, summary)=> {
      result[summary.dataField] = setSummary(summary)
      return result
    }, {})
})
// ---STYLE-------------------------------
const styles = computed<IStylesPrivate>(()=>{
  const st = props.styles?.class
  const border = <object>props.styles?.border
  const hoverRows = typeof props.styles?.hoverRows === 'string'
    ? (props.styles?.hoverRows as string)
    : typeof props.styles?.hoverRows === 'boolean' && props.styles?.hoverRows
      ? "hover:bg-neutral-100/90 dark:hover:bg-neutral-900/50": ''
  const defaultBorder = typeof border === "string"
    ? border : "border-neutral-200 dark:border-neutral-800"
  return {
    class: {
      body: st?.body ?? "p-1.5",
      toolbar: st?.toolbar ?? "justify-end",
      bodyTable: st?.bodyTable ?? "",
      slotHeader: st?.slotHeader ?? "",
      slotFooter: st?.slotFooter ?? "",
      table: st?.table ?? "",
      thead: st?.thead ?? "",
      tbody: st?.tbody ?? "",
      tfoot: st?.tfoot ?? "",
      group: st?.group ?? "text-left text-gray-800 dark:text-gray-300 px-6 py-2 pr-3 pl-10 sm:pl-12",
      groupText: st?.groupText ?? "left-10 sm:left-12 flex items-center w-fit min-h-[2.5rem] truncate",
      pagination: st?.pagination ?? "",
    },
    hoverRows: hoverRows,
    borderRadiusPx: props.styles?.borderRadiusPx ?? mode.value === 'underlined'? 0 : 7,
    isStripedRows: props.styles?.isStripedRows ?? false,
    horizontalLines: props.styles?.horizontalLines ?? true,
    verticalLines: props.styles?.verticalLines ?? false,
    filterLines: props.styles?.filterLines ?? false,
    border: {
      table: border?.table ?? defaultBorder,
      header: border?.header ?? defaultBorder,
      filter: border?.filter ?? defaultBorder,
      head: border?.head ?? defaultBorder,
      cell: border?.cell ?? defaultBorder,
      summary: border?.summary ?? defaultBorder,
      pagination: border?.pagination ?? defaultBorder,
      footer: border?.footer ?? defaultBorder,
    }
  }
})
const tableBodyStyle = computed(()=>`height: ${
  heightTable.value}px;${!(slots.header) ? `border-top-left-radius: ${styles.value.borderRadiusPx}px;border-top-right-radius: ${styles.value.borderRadiusPx}px;`:''}${
  !(isPagination.value || slots.footer) ? `border-bottom-left-radius: ${styles.value.borderRadiusPx}px;border-bottom-right-radius: ${styles.value.borderRadiusPx}px;`:''}`)
const modeStyle = computed(()=> (mode.value === 'filled') ? 'bg-stone-100 dark:bg-stone-900' :
  (mode.value === 'outlined') ? 'bg-white dark:bg-neutral-950' :
  (mode.value === 'underlined') ? 'bg-stone-50 dark:bg-stone-950' : '')
// ---------------------------------------
const tableObserver = new ResizeObserver(entries => entries.forEach(() => setFooterPaddingHeight()))
const footerPaddingHeight = ref<number>(0)
function setFooterPaddingHeight() {
  const result = tableBody.value?.clientHeight -
    (thead.value?.clientHeight + tbody.value?.clientHeight + tfoot.value?.clientHeight)
  footerPaddingHeight.value = result ? result : 0
}
// ---------------------------------------
const isDark = ref<boolean>(window.matchMedia('(prefers-color-scheme: dark)')?.matches)
const colorSchemeQueryList = window.matchMedia('(prefers-color-scheme: dark)');
const setColorScheme = e => isDark.value = e.matches
setColorScheme(colorSchemeQueryList);
colorSchemeQueryList.addEventListener('change', setColorScheme);
// ---------------------------------------
onMounted(()=>{
  if (tbody.value) { tableObserver.observe(tbody.value as Element) }
  const resultSort = dataColumns.value.map((column)=>[column.dataField,column.defaultSort??null])
  Object.assign(sortColumns, Object.fromEntries(new Map(resultSort)))
  const resultFilter = dataColumns.value.map((column)=>[column.dataField,column.defaultFilter??null])
  Object.assign(filterColumns, Object.fromEntries(new Map(resultFilter)))
  const resultWidths = dataColumns.value.map((column)=>[column.dataField,column.width??column.maxWidth??column.minWidth])
  Object.assign(widthsColumns, Object.fromEntries(new Map(resultWidths)))
})
onUnmounted(()=>{
  tableObserver.disconnect();
})
// ---------------------------------------
watch(startPage,(numberPage:number)=>{
  pageTable.value = numberPage
}, {immediate: true})
watch(sizePage,(sizePageValue:number)=>{
  sizeTable.value = sizePageValue ?? sizePage.value
}, {immediate: true})
// ---------------------------------------
function getColumn(dataField:IColumn["dataField"], index?:number):IColumnPrivate {
  return dataColumns.value.find((column, item)=>dataField ? column.dataField === dataField : item === index)
}
function sorting(columnName:string|undefined, value?:Sort) {
  if (!columnName){ return }
  if (value === undefined) {
    value = (sortColumns[columnName] === null ? "asc"
        : sortColumns[columnName] === "asc" ? "desc"
        : sortColumns[columnName] === "desc" ? null : null) }
  let timeout = lengthData.value > countDataOnLoading.value ? 800 : 10
  if (timeout > 100){
    isLoading.value = true
  }
  setTimeout(()=>{
    sortColumns[columnName] = (value as Sort)
  },timeout)
}
function filtering(columnName:string|undefined, value:any) {
  if (!columnName){ return }
  let timeout = (dataOriginal.value?.length > countDataOnLoading.value)
    ? lengthData.value > countDataOnLoading.value||value === null||value === "" ? 800 : 0 : 0
  if (timeout > 100){
    isLoading.value = true
  }
  setTimeout(()=>{
    filterColumns[columnName] = value
  },timeout)
}
function searching(value:any) {
  let timeout = dataOriginal.value?.length > countDataOnLoading.value
    ? lengthData.value > countDataOnLoading.value||value === null||value === "" ? 800 : 0 : 0
  if (timeout > 100){
    isLoading.value = true
  }
  setTimeout(()=>{
    queryTable.value = value
  },timeout)
}
function switchPage(page:number) {
  pageTable.value = page
}
function switchSizePage (sizePage:number) {
  sizeTable.value = sizePage
  pageTable.value = 1
}
function isEqualsValue(column:IColumnPrivate, columnValue:any, value: any): boolean {
  if (columnValue === null || columnValue === undefined) { return false }
  switch (column.type) {
    case "string": return String(columnValue).includes(value)
    case "number": return columnValue === Number(value)
    case "select": {
      if (Array.isArray(value)){
        return (value as Array<string>).includes(columnValue)
      } else {
        return String(columnValue).includes(value)
      }
    }
    case "date": {
      if (value instanceof Date){
        return dayjs(dayjs(columnValue).startOf('day')).isSame(dayjs(value as Date).startOf('day'))
      } else {
        if (value?.start instanceof Date && value?.end instanceof Date) {
          dayjs.extend(isBetween)
          return dayjs(dayjs(columnValue).startOf('day')).isBetween(
            dayjs((value as IRangeValue)?.start as Date).startOf('day'),
            dayjs((value as IRangeValue)?.end as Date).startOf('day'),
            null, "[]")
        } else { return false }
      }
    }
  }
}
function setSummary(summary:ISummaryPrivate):string{
  let result:number|string|null|undefined = null
  const columnData:Array<any> = LData.map(dataSource.value, summary.dataField ?? "")
  switch (summary.type) {
    case "sum": {
      if ((["number"] as Array<DataType>).includes(summary.dataType)){
        result = LData.sumBy(LData.compact(columnData), i=>!isNaN(Number(i)) ? Number(i) : 0)
      } break
    }
    case "count": {
      if ((["string", "select", "number", "date"] as Array<DataType>).includes(summary.dataType)){
        result = LData.size(columnData)
      } break
    }
    case "min": {
      if ((["string", "select"] as Array<DataType>).includes(summary.dataType)) { result = LData.minBy(columnData,i=>String(i).length) }
      if (summary.dataType === "number") { result = LData.minBy(columnData,i=>!isNaN(Number(i)) ? Number(i) : 0) }
      if (summary.dataType === "date") { result = LData.minBy(columnData,i=>new Date(i).getTime()) }
      break
    }
    case "max": {
      if ((["string", "select"] as Array<DataType>).includes(summary.dataType)) { result = LData.maxBy(columnData,i=>String(i).length) }
      if (summary.dataType === "number") { result = LData.maxBy(columnData,i=>!isNaN(Number(i)) ? Number(i) : 0) }
      if (summary.dataType === "date") { result = LData.maxBy(columnData,i=>new Date(i).getTime()) }
      break
    }
    case "avg": {
      if ((["string", "select"] as Array<DataType>).includes(summary.dataType)) { result = LData.round(LData.meanBy(columnData,i=>String(i).length), 0) }
      if (summary.dataType === "number") { result = LData.round(LData.meanBy(columnData,i=>!isNaN(Number(i)) ? Number(i) : 0), 0) }
      if (summary.dataType === "date") { result = LData.meanBy(columnData,i=>new Date(i).getTime()) }
      break
    }
  }
  if (result === null || result === undefined) { return "" }
  result = setCell(getColumn(summary.dataField), String(result))
  if (summary?.customizeText) {
    return <string>summary?.customizeText(summary, result)
  } else {
    return String(summary?.displayFormat).replace(/\{0}/g, result)
  }
}
function setCell(column:IColumnPrivate, value:any):string{
  function toMask () {
    if (column?.mask === "phone") {
      return convertToPhone(String(value))
    } else if (column?.mask === "number") {
      return convertToNumber(value,
        column.paramsInput?.lengthInteger ?? 20,
        column.paramsInput?.lengthDecimal ?? 0,
        "")
    } else if (column?.mask === "price") {
      return convertToNumber(value,
        column.paramsInput?.lengthInteger ?? 20,
        column.paramsInput?.lengthDecimal ?? 0,
        " ")
    } else { return String(value) }
  }
  let valueCell
  if (value === null || value === undefined) {
    valueCell = null
  } else {
    switch (column.type) {
      case "string": valueCell = toMask();break
      case "number": valueCell = toMask();break
      case "select": valueCell = toMask();break
      case "date":   valueCell = dayjs(value).format(column.paramsDatePicker?.mask);break
      default: valueCell = value
    }
  }
  return valueCell
}
function setMarker (column:IColumnPrivate, valueCell:any):string {
  if (valueCell && (filterColumns[column.dataField]||queryTable.value.length)){
    valueCell = valueCell.replace(new RegExp(
        filterColumns[column.dataField] ?? queryTable.value, "gi"),
      `<span class="${classMaskQuery.value}">$&</span>`)
  }
  return valueCell
}
function noEmptyFilters(filter: object) {
  return Object.keys(filter).filter(i=>
    filter[i] !== undefined &&
    filter[i] !== null &&
    filter[i] !== '' &&
    JSON.stringify(filter[i]) !== JSON.stringify({start: undefined, end: undefined}))
}
function clearFilter() {
  Object.keys(filterColumns).map(filter=>sorting(filter, null))
  Object.keys(filterColumns).map(filter=>filtering(filter, null))
  searching("")
}
// ---RESIZE-COLUMN-----------------------
const defaultWidthColumn = ref<string>('max-width: 600px;min-width:100px;')
function resizeColumn($event: MouseEvent, columnId: string) {
  const columnEl: HTMLElement = (thead.value as HTMLElement)?.querySelector(`.${columnId}`);
  if (columnEl) {
    const column = <IColumnPrivate>dataColumns.value.find(item=>item.id === columnId)
    const rect = columnEl.getBoundingClientRect();
    let newW = $event.pageX - rect.left - 5
    const maxW = column.maxWidth
    if (newW > maxW && maxW) { newW = maxW }
    const minW = column.minWidth ?? 100
    if (newW < minW && minW) { newW = minW }
    widthsColumns[column.dataField] = newW
  }
}
const editableColumn = ref<string|null>(null)
function move(ev: MouseEvent) {
  resizeColumn(ev, editableColumn.value??"");
}
function startResizeColumn($event: MouseEvent, column: IColumnPrivate["id"]) {
  if($event.stopPropagation) $event.stopPropagation();
  if($event.preventDefault) $event.preventDefault();
  editableColumn.value = column
  window.addEventListener('mousemove', move);
  window.addEventListener('mouseup', stopResizeColumn);
}
function stopResizeColumn() {
  editableColumn.value = null
  window.removeEventListener('mousemove', move);
}
// ---------------------------------------
</script>

<template>
  <div class="inline-block align-middle relative w-full" :class="styles.class.body">
    <div v-if="isVisibleToolbar" class="toolbar flex mb-2 transition-transform" :class="styles.class.toolbar">
      <div v-if="slots.toolbar" class="w-full">
        <slot name="toolbar"/>
      </div>
      <StInput
        v-if="isSearch"
        :model-value="queryTable"
        label="Найти..."
        clear
        :mode="mode"
        label-mode="vanishing"
        :params-input="{autocomplete: 'off', classInput: 'max-w-[5rem] focus:max-w-[10rem] sm:focus:max-w-[20rem] transition-all duration-500'}"
        :class-body="`sticky top-1 rounded-md ease-out ${modeStyle}`"
        @change:model-value="(v)=>searching(v)"
        @update:model-value="(v)=>lengthData > 100||searching(v)">
        <template #before>
          <MagnifyingGlassIcon aria-hidden="true" class="h-5 w-5 text-gray-400 dark:text-gray-600"/>
        </template>
      </StInput>
      <transition leave-active-class="transition ease-in duration-1000" leave-from-class="opacity-100" leave-to-class="opacity-0"
                  enter-active-class="transition ease-in duration-1000" enter-from-class="opacity-0" enter-to-class="opacity-100">
          <Button v-if="isFilterClear" class="group rounded-md ml-2 h-[38px] min-w-[38px] px-2 bg-stone-100 dark:bg-stone-900" @click="clearFilter">
            <FunnelIcon aria-hidden="true" class="h-4 w-4 text-gray-400 dark:text-gray-600 group-hover:text-red-400 group-hover:dark:text-red-600"/>
            <Tooltip>Очистить все фильтры</Tooltip>
          </Button>
      </transition>
    </div>
    <div class="flex flex-col border" :class="[styles.border?.table]" :style="`border-radius: ${styles.borderRadiusPx}px;`">
      <div v-if="slots.header"
           ref="tableFooter"
           class="min-h-[1.5rem] text-gray-500"
           :class="[!(isSummary||isPagination)||'relative', modeStyle]"
           :style="`border-top-left-radius: ${styles.borderRadiusPx}px;border-top-right-radius: ${styles.borderRadiusPx}px;`">
        <div class="p-2 border-b" :class="[styles.class.slotHeader, styles.border?.header]">
          <slot name="header"/>
        </div>
      </div>
      <div class="relative">
        <div ref="tableBody" class="overflow-x-auto" :class="styles.class.bodyTable" :style="tableBodyStyle">
          <table ref="table" class="min-w-full border-separate border-spacing-0" :class="styles.class.table">
  <!-- -------------------------------- -->
            <thead v-if="isColumns"
                   ref="thead"
                   class="sticky top-0 z-10"
                   :class="[styles.class.thead, modeStyle]">
            <tr>
              <template v-for="(column, key) in dataColumns" :key="column.id">
                <th v-if="column.visible" scope="col"
                    :class="[column.id, column.class?.th, 'group/th', column.isFilter ? 'pl-1 pr-0 py-2' : 'pl-6 py-5', 'border-b', styles.border?.head]"
                    :style="!widthsColumns[column.dataField] ? defaultWidthColumn :
                    `width: ${widthsColumns[column.dataField]}px;
                    min-width: ${widthsColumns[column.dataField]}px;
                    max-width: ${widthsColumns[column.dataField]}px;`">
                  <div class="group relative flex w-full cursor-pointer" :class="[styles.filterLines ? 'border-r group-last/th:border-r-0' : '', styles.border?.filter]">
                    <div v-if="column.isFilter" class="w-full" :class="[column.class?.colFilter]">
                      <StInput
                        v-if="column.type === 'string'||column.type === 'number'"
                        :model-value="filterColumns[column?.dataField]"
                        :label="column.caption"
                        :mode="mode"
                        :params-input="column?.paramsInput"
                        :class="column.class?.colFilterClass"
                        :class-body="column.class?.colFilterClassBody"
                        :style="`min-width: ${column.minWidth||70}px`"
                        label-mode="offsetDynamic"
                        clear
                        @change:model-value="(v)=>filtering(column?.dataField, v)"
                        @update:model-value="(v)=>lengthData > 100||filtering(column?.dataField, v)"
                        @clear="filtering(column?.dataField, null)"/>
                      <StSelect
                        v-if="column.type === 'select'"
                        :model-value="filterColumns[column?.dataField]"
                        :label="column.caption"
                        :params-select="column?.paramsSelect"
                        :mode="mode"
                        :class="column.class?.colFilterClass"
                        :class-body="column.class?.colFilterClassBody"
                        :style="`min-width: ${column.width||column.minWidth||50}px`"
                        clear
                        @update:model-value="(v)=>filtering(column?.dataField, v)"/>
                      <StCalendar
                        v-if="column.type === 'date'"
                        :model-value="filterColumns[column?.dataField]"
                        :label="column.caption"
                        :mode="mode"
                        :params-date-picker="column?.paramsDatePicker"
                        label-mode="offsetDynamic"
                        :class="column.class?.colFilterClass"
                        :class-body="column.class?.colFilterClassBody"
                        :style="`min-width: ${column.width||column.minWidth||50}px`"
                        clear
                        @update:model-value="(v)=>filtering(column?.dataField, v)"/>
                    </div>
                    <div v-else
                         class="block text-sm font-medium truncate"
                         :class="[column.class?.colText]">
                      {{ column.caption }}
                    </div>
                    <div v-if="column.isSort||isSort"
                         class="flex items-center transition-opacity duration-500 pr-1"
                         :class="[sortColumns[column?.dataField] === null ? 'opacity-0 group-hover:opacity-100' : 'opacity-100']"
                         @click="sorting(column?.dataField)">
                      <ArrowLongUpIcon v-if="iconSort === 'Arrow' && [null, 'asc'].includes(sortColumns[column?.dataField])" class="ml-1 h-4 w-4 text-gray-400"/>
                      <ArrowLongDownIcon v-if="iconSort === 'Arrow' && sortColumns[column?.dataField] === 'desc'" class="ml-1 h-4 w-4 text-gray-400"/>
                      <BarsArrowUpIcon v-if="iconSort === 'Bars' && [null, 'asc'].includes(sortColumns[column?.dataField])" class="ml-1 h-4 w-4 text-gray-400"/>
                      <BarsArrowDownIcon v-if="iconSort === 'Bars' && sortColumns[column?.dataField] === 'desc'" class="ml-1 h-4 w-4 text-gray-400"/>
                    </div>
                    <div v-if="!unchangedColumns" class="resizable absolute z-10 inset-y-0 flex items-center hover:opacity-100 px-2 cursor-ew-resize transition-opacity duration-500 "
                         :class="[dataColumns.length-1 > key ? '-right-3' : 'right-3', editableColumn === column.id ? 'opacity-100': 'opacity-0']"
                         @mousedown="startResizeColumn($event, column.id)" @mouseup="stopResizeColumn">
                      <div class="h-8 w-1.5 rounded-full bg-neutral-300 dark:bg-neutral-600"></div>
                    </div>
                  </div>
                </th>
              </template>
            </tr>
            </thead>
  <!-- -------------------------------- -->
            <tbody ref="tbody" class="overflow-y-auto" :class="styles.class.tbody">
              <template v-for="(group, key) in resultDataSource" :key="key">
                <tr v-if="isGroup">
                  <th :colspan="dataColumns.length" scope="colgroup"
                      :style="`top:${thead?.clientHeight-1}px`"
                      :class="['sticky','border-t-2 border-b', 'font-medium text-base whitespace-nowrap',
                      styles.class?.group, styles.border?.cell, modeStyle]">
                    <div class="sticky"
                         :class="[styles.class.groupText]"
                         :style="`min-height: ${heightCell}rem`">
                      <slot name="group" :item="key" :length="group.length">
                        {{key}}
                      </slot>
                    </div>
                  </th>
                </tr>
                <tr v-for="(data, index) in group" :key="index" class="group/tr"
                    :class="[!styles.hoverRows?.length||`${styles.hoverRows} transition-colors duration-100`, !styles.isStripedRows||
                    ((mode === 'filled') ? 'odd:bg-stone-100 even:bg-stone-50 dark:odd:bg-stone-900 dark:even:bg-stone-950' :
                    (mode === 'outlined') ? 'odd:bg-white even:bg-neutral-50 dark:odd:bg-neutral-950 dark:even:bg-neutral-900' :
                    (mode === 'underlined') ? 'odd:bg-stone-50 even:bg-stone-100 dark:odd:bg-stone-950 dark:even:bg-neutral-900' : '')]">
                  <template v-for="(column, key) in dataColumns" :key="`${index}-${key}`">
                    <td v-if="column.visible"
                        class="text-sm font-medium border-b border-r last:border-r-0 group-last/tr:border-b-0"
                        :class="[column.class?.td, styles.border?.cell, styles.verticalLines ? 'border-r-px': 'border-r-0', styles.horizontalLines ? 'border-b-px': 'border-b-0']"
                        :style="!widthsColumns[column.dataField] ? defaultWidthColumn :
                        `width: ${widthsColumns[column.dataField]}px;
                        min-width: ${widthsColumns[column.dataField]}px;
                        max-width: ${widthsColumns[column.dataField]}px;`">
                      <div v-if="!column?.cellTemplate" :class="[column.class?.cellText]"
                           :style="`min-height: ${heightCell}rem;max-height: ${(heightCell*5)*16+2}px;`"
                           v-html="setMarker(column, setCell(column, data[column.dataField]))"/>
                      <div v-else :class="[column.class?.cellText]"
                           :style="`min-height: ${heightCell}rem;max-height: ${(heightCell*5)*16+2}px;`">
                        <slot :name="column?.cellTemplate"
                              :column="column" :rowData="data" :value="setCell(column, data[column.dataField])"
                              :value-with-marker="setMarker(column, setCell(column, data[column.dataField]))"/>
                      </div>
                    </td>
                  </template>
                </tr>
              </template>
            </tbody>
  <!-- -------------------------------- -->
            <tr v-if="footerPaddingHeight" class="border-none" :style="`height: ${footerPaddingHeight-1}px`"></tr>
  <!-- -------------------------------- -->
            <tfoot v-if="isSummary && Object.keys(summaryColumns).length"
                   ref="tfoot" class="sticky bottom-0"
                   :class="[styles.class.tfoot, modeStyle]">
            <tr>
              <template v-for="column in dataColumns" :key="column.id">
                <th v-if="column.visible" scope="col" class="px-3 py-3"
                    :class="[column.class?.tf, 'border-t', styles.border?.summary]">
                    <div class="block font-normal text-sm truncate"
                         :class="column.class?.sumText"
                         v-html="summaryColumns[column.dataField]"/>
                </th>
              </template>
            </tr>
            </tfoot>
  <!-- -------------------------------- -->
          </table>
        </div>
  <!-- -------------------------------- -->
        <div v-if="isPagination" ref="pager"
             :class="[!isSummary||'relative sm:px-5', modeStyle]"
             :style="!slots.footer ?`border-bottom-left-radius: ${styles.borderRadiusPx}px;border-bottom-right-radius: ${styles.borderRadiusPx}px;`:''">
          <Pagination :model-value="pageTable"
                      :size-page="+sizeTable"
                      :mode="modePagination"
                      :total="lengthData"
                      :visible-number-pages="visibleNumberPages"
                      :is-info-text="isInfoText"
                      :sizes-selector="sizesSelector"
                      :is-page-size-selector="isPageSizeSelector"
                      :is-hidden-navigation-buttons="isHiddenNavigationButtons"
                      :class="['border-t', styles.class.pagination, styles.border?.pagination]"
                      @update:model-value="switchPage"
                      @update:size-page="switchSizePage"/></div>
  <!-- -------------------------------- -->
        <transition leave-active-class="transition ease-in duration-500" leave-from-class="opacity-100" leave-to-class="opacity-0"
                    enter-active-class="transition ease-in duration-500" enter-from-class="opacity-0" enter-to-class="opacity-100">
          <div v-if="isLoading" class="absolute z-30 top-0 bottom-0 left-0 w-full select-none text-center text-sm text-gray-500">
            <div class="flex justify-center items-center h-full w-full rounded-lg bg-neutral-100/70 dark:bg-neutral-800/50">
              <Loading type="Fingerprint" :size="100" :color="isDark? 'primary.800' : 'primary.500'"/>
            </div>
          </div>
        </transition>
  <!-- -------------------------------- -->
        <transition leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100" leave-to-class="opacity-0"
                    enter-active-class="transition ease-in duration-200" enter-from-class="opacity-0" enter-to-class="opacity-100">
          <div v-if="!isLoading && !dataOriginal?.length"
               class="absolute top-[40%] left-0 w-full my-5 pointer-events-none text-center text-sm text-gray-500" v-html="noData"/>
        </transition>
        <transition leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100" leave-to-class="opacity-0"
                    enter-active-class="transition ease-in duration-200" enter-from-class="opacity-0" enter-to-class="opacity-100">
          <div v-if="!isLoading && dataOriginal?.length && !dataColumns?.length"
               class="absolute top-[50%] left-0 w-full my-5 pointer-events-none text-center text-sm text-gray-500" v-html="noColumn"/>
        </transition>
        <transition leave-active-class="transition-all ease-in duration-200" leave-from-class="opacity-100" leave-to-class="opacity-0"
                    enter-active-class="transition-all ease-in duration-200" enter-from-class="opacity-0" enter-to-class="opacity-100">
          <div v-if="!isLoading && dataOriginal?.length && dataColumns?.length && !dataSource.length"
               class="absolute top-[40%] flex flex-col items-center left-0 w-full my-5 pointer-events-none text-center text-sm text-gray-500">
            <FunnelIcon aria-hidden="true" class="h-5 w-5 text-gray-400 dark:text-gray-600"/>
            <div v-html="noFilter"/>
          </div>
        </transition>
      </div>
      <div v-if="slots.footer"
           ref="tableFooter"
           class="min-h-[1.5rem] -mt-[1px] text-gray-500"
           :class="[!(isSummary||isPagination)||'relative sm:px-5', modeStyle]"
           :style="`border-bottom-left-radius: ${styles.borderRadiusPx}px;border-bottom-right-radius: ${styles.borderRadiusPx}px;`">
        <div class="p-2 border-t" :class="[styles.class.slotFooter, styles.border?.footer]">
          <slot name="footer"/>
        </div>
      </div>
    </div>
  </div>
</template>