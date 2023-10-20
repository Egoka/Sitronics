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
import type {IMode} from "@/components/BaseTypes";
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
  mask?:IDataInput["mask"]
  paramsInput?: IDataInput
  paramsSelect?: IDateSelect
  paramsDatePicker?: Partial<IDatePicker>
  cellTemplate?: string
}
interface IColumnPrivate extends IColumn { id: string }
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
// ---------------------------------------
export interface ITable {
  mode?:IMode
  dataSource?: Array<any>|[]
  toolbar?: IToolbar|boolean
  sort?: ISort|boolean
  filter?: IFilter|boolean
  pagination?: ITablePagination|boolean
  isHiddenHead?:boolean
  isSummary?:boolean
  search?:boolean
  columns?: Array<IColumn>
  summary?: Array<ISummary>
  countVisibleRows?: number
  heightCell?:number
  noData?:string
  noColumn?:string
  classMaskQuery?: "font-bold text-primary-700 dark:text-primary-300"|string
  countDataOnLoading?:number|100|1000|10000
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
let sortColumns = reactive<{ [keys:string]: Sort }>({})
let sortOrders = ref<Array<{field:string, direction: NonNullable<Sort>}>>([])
let filterColumns = reactive<object>({})
let dataOriginal = ref<ITable["dataSource"]>(props.dataSource||[])
// ---------------------------------------
const isLoading = ref<boolean>(false)
// ---------------------------------------
const lengthData = computed<number>(()=> dataSource.value.length)
const countDataOnLoading = computed<ITable["countDataOnLoading"]>(()=> props.countDataOnLoading||1000)
const dataSource = computed<Array<any>>(()=> {
  let data = dataOriginal.value
  // Order
  if (data && Object.keys(sortColumns).filter(i=>sortColumns[i] !== null).length){
    data = LData.orderBy(data, sortOrders.value.map(i=>i.field), sortOrders.value.map(i=>i.direction))
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
  return data || []
})
const resultDataSource = computed<Array<any>>(()=> isPagination.value
    ? LData.slice(dataSource.value, sizeTable.value * (pageTable.value - 1), sizeTable.value * (pageTable.value))
    : dataSource.value)
const dataColumns = computed<Array<IColumnPrivate>>(()=> {
  let listFields:Array<string> = LData.uniq(LData.flatten(LData.map(dataOriginal.value, LData.keys)))
  if (props.columns && props.columns?.length){
    return <Array<IColumnPrivate>>props.columns
      .map((column, index)=>{
        const fieldName = column.dataField||listFields[index]||""
        if (fieldName === ""){ return false}
        const options = <IColumnPrivate>{
          ...column,
          id: `Col-${fieldName}-${index}`,
          dataField: fieldName,
          name: `Col-${column.name||fieldName}`,
          caption: column.caption||
            (/^\d+$/.test(fieldName) ? `Col ${fieldName}`
            :(fieldName as string).charAt(0).toUpperCase() + (fieldName as string).slice(1)),
          visible: typeof column?.visible === "boolean" ? column.visible : true,
          isFilter: typeof column.isFilter === "boolean" ? column.isFilter : isFilter.value,
          isSort: typeof column.isSort === "boolean" ? column.isSort : isSort.value,
          type: column.type||"string",
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
              dataSelect: LData.compact(LData.uniq(LData.map(dataOriginal.value, options.dataField||"")))||[],
              ...column.paramsSelect};break
          }
          case "date": {
            options.paramsDatePicker = {
              isRange: true,
              attributes: [{
                highlight: {
                  fillMode: 'light',
                },
                dates: LData.compact(LData.uniq(LData.map(dataOriginal.value, options.dataField||""))).map((item:string)=>new Date(item))||[],
              }],
              classPicker: "-left-1/2",
              mask: column.paramsDatePicker?.masks?.modelValue||"DD.MM.YYYY",
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
  if (props.summary){
    return <Array<ISummaryPrivate>>props.summary.map((summary, index)=>{
      const column = getColumn(summary.dataField, index)
      const summaryName = summary.dataField||column.dataField
      return {
        id: `Sum-${summary.name||summaryName}-${index}`,
        name: `Sum-${summary.name||summaryName}`,
        dataField: summaryName,
        displayFormat: summary.displayFormat||(
                summary.type === "max" ? "Max: {0}"
              : summary.type === "min" ? "Min: {0}"
              : summary.type === "sum" ? "Sum: {0}"
              : summary.type === "avg" ? "Avg: {0}"
              : summary.type === "count"?"Count: {0}"
              : "Count: {0}"
          )||
          ((["string", "date"]).includes(column.type as string) ? "Кол. {0}"
          : (["number", "select"]).includes(column.type as string) ? "Сум. {0}"
            : "Кол. {0}"),
        type: summary.type||((["string", "date", "select"]).includes(column.type as string) ? "count"
          : (["number"]).includes(column.type as string) ? "sum"
            : "count"),
        customizeText: summary.customizeText,
        dataType: summary.dataType||column.type
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
const classMaskQuery = computed<NonNullable<ITable["classMaskQuery"]>>(()=> props.classMaskQuery||"font-bold text-primary-700 dark:text-primary-400")
const mode = computed<NonNullable<ITable["mode"]>>(()=> props.mode||"outlined")
const noData = computed<NonNullable<ITable["noData"]>>(()=> props.noData || "Нет данных")
const noColumn = computed<NonNullable<ITable["noData"]>>(()=> props.noColumn || "Нет колонок")
const isHiddenHead = computed<ITable["isHiddenHead"]>(()=> props.isHiddenHead||false)
const isSummary = computed<ITable["isSummary"]>(()=> props.isSummary||!!props.summary?.length||false)
const noFilter = computed<NonNullable<IFilter["noFilter"]>>(()=> props.noData || "Не найдено подходящих данных")
const isVisibleToolbar = computed<boolean>(()=> isSearch.value || (props.toolbar as IToolbar)?.visible || (!!props.toolbar || !!(Object.keys(props.toolbar).length))||false)
const isFilter = computed<boolean>(()=>typeof props?.filter === "object"
  ? typeof props?.filter?.visible === "boolean" ? props.filter.visible : true
  : typeof props?.filter === "boolean" ? props.filter : false )
const isSort = computed<boolean>(()=>typeof props?.sort === "object"
  ? typeof props?.sort?.visible === "boolean" ? props.sort.visible : true
  : typeof props?.sort === "boolean" ? props.sort : false )
const isPagination = computed<ITablePagination["visible"]>(()=>typeof props?.pagination === "object"
  ? typeof props?.pagination?.visible === "boolean" ? props.pagination.visible : true
  : typeof props?.pagination === "boolean" ? props.pagination : false )
const iconSort = computed<ISort["icon"]>(()=>(props?.sort as ISort)?.icon||"Arrow")
const isSearch = computed<boolean>(()=> props.search||(props?.toolbar as IToolbar)?.search||false)
const isFilterClear = computed<boolean>(()=>((props.filter as IFilter)?.isClearAllFilter || false) && (!!noEmptyFilters(filterColumns).length || !!queryTable.value.length))
// ---------------------------------------
const startPage = computed<NonNullable<ITablePagination["startPage"]>>(()=>(props.pagination as ITablePagination).startPage||1)
const modePagination = computed<NonNullable<ITablePagination["mode"]>>(()=>(props.pagination as ITablePagination).mode||mode.value)
const sizePage = computed<NonNullable<ITablePagination["sizePage"]>>(()=>(props.pagination as ITablePagination).sizePage??countVisibleRows.value)
const visibleNumberPages = computed<ITablePagination["visibleNumberPages"]>(()=>(props.pagination as ITablePagination).visibleNumberPages)
const sizesSelector = computed<ITablePagination["sizesSelector"]>(()=>(props.pagination as ITablePagination).sizesSelector)
const isInfoText = computed<ITablePagination["isInfoText"]>(()=>(props.pagination as ITablePagination).isInfoText??false)
const isPageSizeSelector = computed<ITablePagination["isPageSizeSelector"]>(()=>(props.pagination as ITablePagination).isPageSizeSelector??false)
const isHiddenNavigationButtons = computed<ITablePagination["isHiddenNavigationButtons"]>(()=>(props.pagination as ITablePagination).isHiddenNavigationButtons??false)
// ---------------------------------------
const heightCell = computed<number>(()=> props.heightCell||1.5)
const heightRow = computed<number>(()=> {
  const tagTr = (tbody.value as HTMLElement)?.querySelector("tr")
  if (tagTr) { return tagTr.offsetHeight
  } else { const basePadding = 2;return basePadding * 16 + heightCell.value * 16 + 1 }
})
const countVisibleRows = computed<NonNullable<ITable["countVisibleRows"]>>(()=> props.countVisibleRows||5)
const heightTable = computed<number>(()=> {
  return (thead.value?.clientHeight||0) + (tfoot.value?.clientHeight||0) + countVisibleRows.value * (heightRow.value||2 * 16 + heightCell.value * 16 + 1)
})
// ---------------------------------------
const tableObserver = new ResizeObserver(entries => {
  entries.forEach(() => {
    setFooterPaddingHeight()
  });
});
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
  if (tbody.value) {
    tableObserver.observe(tbody.value as Element);
  }
  const result = dataColumns.value.map((column)=>[column.dataField,null])
  Object.assign(sortColumns, Object.fromEntries(new Map(result)))
  Object.assign(filterColumns, Object.fromEntries(new Map(result)))
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
    const index = sortOrders.value.findIndex(order=>order.field === columnName)
    if (index > -1) {
      if (value === null) { sortOrders.value.splice(index, 1)
      } else { sortOrders.value[index].direction = (value as NonNullable<Sort>) }
    } else {sortOrders.value.push({field: columnName, direction: "asc"})}
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
function columnStyle(el:"filter", column:IColumnPrivate) {
  switch (el) {
    case "filter": return [
      !column.minWidth||`min-width: ${column.minWidth}rem`,
      !column.width||`width: ${column.width}rem`,
      !column.maxWidth||`max-width: ${column.maxWidth}rem`
    ]
  }
}
function setSummary(summary:ISummaryPrivate):string{
  let result:number|string|null|undefined = null
  const columnData:Array<any> = LData.map(dataSource.value, summary.dataField||"")
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
        column.paramsInput?.lengthInteger||20,
        column.paramsInput?.lengthDecimal||0,
        "")
    } else if (column?.mask === "price") {
      return convertToNumber(value,
        column.paramsInput?.lengthInteger||20,
        column.paramsInput?.lengthDecimal||0,
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
        filterColumns[column.dataField]||queryTable.value, "gi"),
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
</script>

<template>
  <div class="flex flex-col">
    <div class="inline-block align-middle relative w-full p-1.5">
      <div v-if="isVisibleToolbar" class="toolbar flex justify-end mb-2 transition-transform">
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
          :class-body="`sticky top-1 rounded-md ease-out ${
            (mode === 'outlined') ? 'ring-white dark:ring-black' :
            (mode === 'underlined') ? 'ring-stone-50 dark:ring-stone-950' :
            (mode === 'filled') ? 'ring-stone-100 dark:ring-stone-900': '' }`"
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
      <div class="flex flex-col border rounded-lg border-neutral-200 dark:border-neutral-800" >
        <div v-if="slots.header"
             ref="tableFooter"
             class="min-h-[1.5rem] rounded-t-[7px] text-gray-500"
             :class="[!(isSummary||isPagination)||'relative',
             (mode === 'filled') ? 'bg-stone-100 dark:bg-stone-900' :
             (mode === 'outlined') ? 'bg-white dark:bg-neutral-950' :
             (mode === 'underlined') ? 'bg-stone-50 dark:bg-stone-950' : ''
             ]">
          <div class="p-2 border-b border-gray-200 dark:border-gray-800">
            <slot name="header"/>
          </div>
        </div>
        <div class="relative rounded-[7px]">
          <div ref="tableBody" class="overflow-x-auto"
               :class="[!(slots.header) ? 'rounded-t-[7px]':'', !(isPagination || slots.footer) ? 'rounded-b-[7px]':'']"
               :style="`height: ${heightTable}px`">
            <table ref="table" class="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
    <!-- -------------------------------- -->
              <thead v-if="!isHiddenHead"
                     ref="thead"
                     class="sticky top-0 z-10"
                     :class="[
                       (mode === 'filled') ? 'bg-stone-100 dark:bg-stone-900' :
                       (mode === 'outlined') ? 'bg-white dark:bg-neutral-950' :
                       (mode === 'underlined') ? 'bg-stone-50 dark:bg-stone-950' : ''
                     ]">
              <tr>
                <template v-for="column in dataColumns" :key="column.id">
                  <th v-if="column.visible" scope="col"
                    :class="[column.isFilter ? 'pl-2 pt-1' : 'pl-6 py-5']">
                    <div class="group flex w-max cursor-pointer">
                      <div v-if="column.isFilter"
                        :style="columnStyle('filter', column)">
                        <StInput
                          v-if="column.type === 'string'||column.type === 'number'"
                          :model-value="filterColumns[column?.dataField]"
                          :label="column.caption"
                          :mode="mode"
                          label-mode="offsetDynamic"
                          class-body="m-0 my-2"
                          :params-input="column?.paramsInput"
                          class="border-none font-normal"
                          :style="`max-width: ${column.width||column.minWidth||6}rem`"
                          clear
                          @change:model-value="(v)=>filtering(column?.dataField, v)"
                          @update:model-value="(v)=>lengthData > 100||filtering(column?.dataField, v)"
                          @clear="filtering(column?.dataField, null)"/>
                        <StSelect
                          v-if="column.type === 'select'"
                          :model-value="filterColumns[column?.dataField]"
                          :label="column.caption"
                          :params-select="{
                            classSelect: 'normal-case font-normal max-h-[25rem]',
                            classSelectList: 'normal-case font-normal',
                            ...column?.paramsSelect}"
                          :mode="mode"
                          :style="`min-width: ${column.width||column.minWidth||10}rem`"
                          class-body="m-0 my-2"
                          class="border-none font-normal"
                          clear
                          @update:model-value="(v)=>filtering(column?.dataField, v)"/>
                        <StCalendar
                          v-if="column.type === 'date'"
                          :model-value="filterColumns[column?.dataField]"
                          :label="column.caption"
                          :mode="mode"
                          label-mode="offsetDynamic"
                          class-body="m-0 my-2"
                          class="border-none font-normal"
                          :style="`min-width: ${column.width||column.minWidth||8}rem`"
                          :params-date-picker="column?.paramsDatePicker"
                          clear
                          @update:model-value="(v)=>filtering(column?.dataField, v)"/>
                      </div>
                      <div v-else class="block text-left text-sm font-medium text-gray-400 dark:text-gray-500 truncate" :style="columnStyle('filter', column)">
                        {{ column.caption }}
                      </div>
                      <div v-if="column.isSort||isSort"
                           class="flex items-center transition-opacity duration-500"
                           :class="[sortColumns[column?.dataField] === null ? 'opacity-0 group-hover:opacity-100' : 'opacity-100']"
                           @click="sorting(column?.dataField)">
                        <ArrowLongUpIcon v-if="iconSort === 'Arrow' && [null, 'asc'].includes(sortColumns[column?.dataField])" class="ml-1 h-4 w-4 text-gray-400"/>
                        <ArrowLongDownIcon v-if="iconSort === 'Arrow' && sortColumns[column?.dataField] === 'desc'" class="ml-1 h-4 w-4 text-gray-400"/>
                        <BarsArrowUpIcon v-if="iconSort === 'Bars' && [null, 'asc'].includes(sortColumns[column?.dataField])" class="ml-1 h-4 w-4 text-gray-400"/>
                        <BarsArrowDownIcon v-if="iconSort === 'Bars' && sortColumns[column?.dataField] === 'desc'" class="ml-1 h-4 w-4 text-gray-400"/>
                      </div>
                    </div>
                  </th>
                </template>
              </tr>
              </thead>
    <!-- -------------------------------- -->
              <tbody ref="tbody" class="divide-y divide-gray-200 dark:divide-gray-800 overflow-y-auto">
              <tr v-for="(data, index) in resultDataSource" :key="index" class="max-h-8">
                <template v-for="(column, key) in dataColumns" :key="`${index}-${key}`">
                  <td v-if="column.visible" class="px-6 py-4 text-sm text-gray-800 dark:text-gray-300 whitespace-nowrap font-medium"
                      :style="columnStyle('filter', column)">
                    <div v-if="!column?.cellTemplate" class="flex items-center min-h-[2.5rem]" :style="`min-height: ${heightCell}rem`" v-html="setMarker(column, setCell(column, data[column.dataField]))"/>
                    <div v-else class="flex items-center min-h-[2.5rem]" :style="`min-height: ${heightCell}rem`">
                      <slot :name="column?.cellTemplate"
                            :column="column"
                            :value="setCell(column, data[column.dataField])"
                            :value-with-marker="setMarker(column, setCell(column, data[column.dataField]))"/>
                    </div>
                  </td>
                </template>
              </tr>
              </tbody>
    <!-- -------------------------------- -->
              <tr v-if="footerPaddingHeight" class="border-none" :style="`height: ${footerPaddingHeight-1}px`"></tr>
    <!-- -------------------------------- -->
              <tfoot v-if="isSummary && Object.keys(summaryColumns).length"
                     ref="tfoot"
                     class="sticky bottom-0"
                     :class="[
                       (mode === 'filled') ? 'bg-stone-100 dark:bg-stone-900' :
                       (mode === 'outlined') ? 'bg-white dark:bg-neutral-950' :
                       (mode === 'underlined') ? 'bg-stone-50 dark:bg-stone-950' : ''
                     ]">
              <tr>
                <template v-for="column in dataColumns" :key="column.id">
                  <th v-if="column.visible" scope="col" class="pl-6 py-3">
                      <div class="block text-sm font-normal text-gray-400 dark:text-gray-500 truncate text-left"
                           :style="columnStyle('filter', column)"
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
               :class="[!isSummary||'relative sm:px-5', (!slots.footer) ? 'rounded-b-[7px]':'',
               (mode === 'filled') ? 'bg-stone-100 dark:bg-stone-900' :
               (mode === 'outlined') ? 'bg-white dark:bg-neutral-950' :
               (mode === 'underlined') ? 'bg-stone-50 dark:bg-stone-950': '']">
            <Pagination :model-value="pageTable"
                        :size-page="+sizeTable"
                        :mode="modePagination"
                        :total="lengthData"
                        :visible-number-pages="visibleNumberPages"
                        :is-info-text="isInfoText"
                        :sizes-selector="sizesSelector"
                        :is-page-size-selector="isPageSizeSelector"
                        :is-hidden-navigation-buttons="isHiddenNavigationButtons"
                        class="border-t border-gray-200"
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
             class="min-h-[1.5rem] -mt-[1px] rounded-b-[7px] text-gray-500"
             :class="[!(isSummary||isPagination)||'relative sm:px-5',
             (mode === 'filled') ? 'bg-stone-100 dark:bg-stone-900' :
             (mode === 'outlined') ? 'bg-white dark:bg-neutral-950' :
             (mode === 'underlined') ? 'bg-stone-50 dark:bg-stone-950' : ''
             ]">
          <div class="p-2 border-t border-gray-200 dark:border-gray-800">
            <slot name="footer"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>