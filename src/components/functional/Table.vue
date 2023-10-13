<script setup lang="ts">
import {computed, onMounted, onUnmounted, onUpdated, reactive, ref, watch} from "vue";
import {
  ArrowLongUpIcon, ArrowLongDownIcon,
  BarsArrowUpIcon, BarsArrowDownIcon,
  MagnifyingGlassIcon, FunnelIcon
} from "@heroicons/vue/20/solid";
import * as LData from "lodash";
import dayjs from 'dayjs'
import Loading from "@/components/functional/Loading.vue";
import StInput, {type IDataInput} from "@/components/form/StInput.vue";
import StSelect, {type IDateSelect} from "@/components/form/StSelect.vue";
import StCalendar, {type IDatePicker, type IRangeValue} from "@/components/form/StCalendar.vue";
import isBetween from 'dayjs/plugin/isBetween'
import {convertToNumber, convertToPhone} from "@/helpers/numbers";
import type {IMode} from "@/components/form/StForm.vue";
// ---------------------------------------
type DataType = "string"|"number"|"select"|"date"
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
export interface IPagination {

}
// ---------------------------------------
export interface ITable {
  mode?:IMode
  dataSource?: any
  toolbar?: IToolbar|boolean
  sort?: ISort|boolean
  filter?: IFilter|boolean
  isHiddenHead?:boolean
  isSummary?:boolean
  search?:boolean
  columns?: Array<IColumn>
  summary?: Array<ISummary>
  pagination?: IPagination
  noData?:string
  noColumn?:string
  classMaskQuery?: "font-bold text-primary-700 dark:text-primary-300"|string
  countDataOnLoading?:number|100|1000|10000
}
// ---------------------------------------
const props = defineProps<ITable>()
const emit = defineEmits<{
}>();
// ---------------------------------------

const tableBody = ref<HTMLElement>()
const table = ref<HTMLElement>()
const thead = ref<HTMLElement>()
const tbody = ref<HTMLElement>()
const tfoot = ref<HTMLElement>()
// ---------------------------------------
let queryTable = ref<string>("")
let orderColumns = reactive<object>({})
let filterColumns = reactive<object>({})
let dataOriginal = reactive<Array<any>|null>(props.dataSource)
// ---------------------------------------
const loading = ref<boolean>(false)
const isLoading = computed<boolean>({
  get() { return loading.value },
  set(newValue:boolean) {
    loading.value = newValue
  }
})
// ---------------------------------------
const lengthData = computed(()=> dataSource.value.length)
const countDataOnLoading = computed<ITable["countDataOnLoading"]>(()=> props.countDataOnLoading||1000)
const dataSource = computed(()=> {
  let data = dataOriginal
  // Order
  if (data && Object.keys(orderColumns).filter(i=>orderColumns[i] !== null).length){
    const orderingNameColumns = Object.keys(orderColumns).filter(i=>orderColumns[i] !== null)
    const orderingDirections = orderingNameColumns.map(i=>orderColumns[i]? "asc" :"desc")
    data = LData.orderBy(data, orderingNameColumns, orderingDirections)
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
  }
  // Search
  if (data && queryTable.value.length){
    data = LData.filter(data,(row) => !!dataColumns.value
      .filter(item => item.visible)
      .filter(item => isEqualsValue(item, row[item.dataField], queryTable.value)).length)
  }
  if (dataOriginal?.length > countDataOnLoading.value) {
    isLoading.value = false
  }
  return data || []
})
const dataColumns = computed<Array<IColumnPrivate>>(()=> {
  const listFields = LData.uniq(LData.flatten(LData.map(dataOriginal, LData.keys)))
  if (props.columns){
    return <Array<IColumnPrivate>>props.columns
      .map((column, index)=>{
        const fieldName = column.dataField||listFields[index]
        const options = <IColumnPrivate>{
          id: `Col-${fieldName}-${index}`,
          dataField: fieldName,
          name: `Col-${column.name||fieldName}`,
          caption: column.caption||
            (/^\d+$/.test(fieldName) ? `Col ${fieldName}`
            :(fieldName as string).charAt(0).toUpperCase() + (fieldName as string).slice(1)),
          visible: typeof column.visible === "boolean" ? column.visible : true,
          isFilter: typeof column.isFilter === "boolean" ? column.isFilter : isFilter.value,
          isSort: typeof column.isSort === "boolean" ? column.isSort : isSort.value,
          type: column.type||"string",
          mask: column.mask||null,
          width: column.width||null,
          minWidth: column.minWidth||null,
          maxWidth: column.maxWidth||null
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
              dataSelect: LData.compact(LData.uniq(LData.map(dataOriginal, options.dataField||"")))||[],
              ...column.paramsSelect};break
          }
          case "date": {
            options.paramsDatePicker = {
              isRange: true,
              attributes: [{
                highlight: {
                  fillMode: 'light',
                },
                dates: LData.compact(LData.uniq(LData.map(dataOriginal, options.dataField||""))).map((item:string)=>new Date(item))||[],
              }],
              classPicker: "-left-1/2",
              mask: column.paramsDatePicker?.masks?.modelValue||"DD.MM.YYYY",
              ...column.paramsDatePicker
            };
            break
          }
        }
        return options
      })
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
        type: (["string", "date"]).includes(column.type as string) ? "count"
          : (["number", "select"]).includes(column.type as string) ? "sum"
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
const classMaskQuery = computed<NonNullable<ITable["classMaskQuery"]>>(()=> props.classMaskQuery||"font-bold text-primary-700 dark:text-primary-300")
const mode = computed<NonNullable<ITable["mode"]>>(()=> props.mode||"filled")
const noData = computed<NonNullable<ITable["noData"]>>(()=> props.noData || "Нет данных")
const noColumn = computed<NonNullable<ITable["noData"]>>(()=> props.noColumn || "Нет колонок")
const isHiddenHead = computed<ITable["isHiddenHead"]>(()=> props.isHiddenHead||false)
const isSummary = computed<ITable["isSummary"]>(()=> props.isSummary||!!props.summary?.length||false)
const noFilter = computed<NonNullable<IFilter["noFilter"]>>(()=> props.noData || "Не найдено подходящих данных")
const isVisibleToolbar = computed<boolean>(()=> isSearch.value || (props.toolbar as IToolbar)?.visible || (!!props.toolbar || !!(Object.keys(props.toolbar).length))||false)
const isFilter = computed<boolean>(()=>typeof props?.filter === "object"
  ? typeof props?.filter?.visible === "boolean" ? props.filter.visible : false
  : typeof props?.filter === "boolean" ? props.filter : false )
const isSort = computed<boolean>(()=>typeof props?.sort === "object"
  ? typeof props?.sort?.visible === "boolean" ? props.sort.visible : false
  : typeof props?.sort === "boolean" ? props.sort : false )
const iconSort = computed<ISort["icon"]>(()=>(props?.sort as ISort)?.icon||"Arrow")
const isSearch = computed<boolean>(()=> props.search||(props?.toolbar as IToolbar)?.search||false)
const isSearchActive = ref<boolean>()
// ---------------------------------------
const tableObserver = new ResizeObserver(entries => {
  entries.forEach(() => {
    setFooterPaddingHeight()
    const result = tableBody.value?.clientHeight - (thead.value?.clientHeight + tbody.value?.clientHeight + tfoot.value?.clientHeight)
    footerPaddingHeight.value = result ? result : 0
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
  Object.assign(orderColumns, Object.fromEntries(new Map(result)))
  Object.assign(filterColumns, Object.fromEntries(new Map(result)))
})
onUnmounted(()=>{
  tableObserver.disconnect();
})
// ---------------------------------------
function getColumn(dataField:IColumn["dataField"], index?:number):IColumnPrivate {
  return dataColumns.value.find((column, item)=>dataField ? column.dataField === dataField : item === index)
}
function sorting(columnName:string|undefined) {
  if (!columnName){ return }
  let timeout = lengthData.value > countDataOnLoading.value ? 800 : 10
  if (timeout > 100){
    isLoading.value = true
  }
  setTimeout(()=>{
    orderColumns[columnName] = orderColumns[columnName] !== false ? !orderColumns[columnName]: null
  },timeout)
}
function filtering(columnName:string|undefined, value:any) {
  if (!columnName){ return }
  let timeout = (dataOriginal?.length > countDataOnLoading.value)
    ? lengthData.value > countDataOnLoading.value||value === null||value === "" ? 800 : 0 : 0
  if (timeout > 100){
    isLoading.value = true
  }
  setTimeout(()=>{
    filterColumns[columnName] = value
  },timeout)
}
function searching(value:any) {
  let timeout = dataOriginal?.length > countDataOnLoading.value
    ? lengthData.value > countDataOnLoading.value||value === null||value === "" ? 800 : 0 : 0
  if (timeout > 100){
    isLoading.value = true
  }
  setTimeout(()=>{
    queryTable.value = value
  },timeout)
}
function isEqualsValue(column:IColumnPrivate, columnValue:any, value: any): boolean {
  if (columnValue === null || columnValue === undefined) { return false}
  switch (column.type) {
    case "string": return String(columnValue).includes(value)
    case "number": return columnValue === Number(value)
    case "select": return (value as Array<string>).includes(columnValue)
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
  let result:number|string|null = null
  const columnData:Array<any> = LData.compact(LData.map(dataSource.value, summary.dataField||""))
  switch (summary.type) {
    case "sum": {
      if ((["number"] as Array<DataType>).includes(summary.dataType)){
        result = LData.sumBy(columnData, i=>!isNaN(Number(i)) ? Number(i) : 0)
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
      if ((["string", "select"] as Array<DataType>).includes(summary.dataType)) { result = LData.meanBy(columnData,i=>String(i).length) }
      if (summary.dataType === "number") { result = LData.meanBy(columnData,i=>!isNaN(Number(i)) ? Number(i) : 0) }
      if (summary.dataType === "date") { result = LData.meanBy(columnData,i=>new Date(i).getTime()) }
      break
    }
  }
  if (result === null || result === undefined) { return "" }
  result =  setCell(getColumn(summary.dataField), String(result))
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
      case "string": valueCell =  toMask();break
      case "number": valueCell = toMask();break
      case "select": valueCell = toMask();break
      case "date": valueCell = dayjs(value).format(column.paramsDatePicker?.mask);break
      default: valueCell = value
    }
  }
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
</script>

<template>
  <div class="flex flex-col">
    <div class="inline-block align-middle relative w-full p-1.5">
      <div v-if="isVisibleToolbar" class="toolbar flex justify-end transition-transform">
        <StInput
          v-if="isSearch"
          :model-value="queryTable"
          label="Найти..."
          clear
          :mode="mode"
          label-mode="vanishing"
          :params-input="{autocomplete: 'off'}"
          :class-body="`mb-2 sticky top-1 z-20 rounded-md ease-out ${
            (mode === 'outlined') ? 'ring-white dark:ring-black' :
            (mode === 'underlined') ? 'ring-stone-50 dark:ring-stone-950' :
            (mode === 'filled') ? 'ring-stone-100 dark:ring-stone-900': '' }`"
          :style="`max-width: ${isSearchActive||queryTable.length?20:8}rem`"
          @is-active="(active)=>{isSearchActive = active}"
          @change:model-value="(v)=>searching(v)"
          @update:model-value="(v)=>lengthData > 100||searching(v)">
          <template #before>
            <MagnifyingGlassIcon aria-hidden="true" class="h-5 w-5 text-gray-400 dark:text-gray-600"/>
          </template>
        </StInput>
      </div>
      <div ref="tableBody" class="flex flex-col overflow-x-auto border rounded-lg border-neutral-200 dark:border-neutral-800 min-h-[21rem]"
           :style="`height: ${28}rem`">
        <table ref="table" class="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
<!-- -------------------------------- -->
          <thead v-if="!isHiddenHead" ref="thead" class="bg-stone-100 dark:bg-stone-900 sticky top-0 z-10">
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
                  <div v-else class="block text-sm font-medium text-gray-400 dark:text-gray-500 truncate" :style="columnStyle('filter', column)">
                    {{ column.caption }}
                  </div>
                  <div v-if="column.isSort||isSort"
                       class="flex items-center transition-opacity duration-500"
                       :class="[orderColumns[column?.dataField] ===null ? 'opacity-0 group-hover:opacity-100' : 'opacity-100']"
                       @click="sorting(column?.dataField)">
                    <ArrowLongUpIcon v-if="iconSort === 'Arrow' && orderColumns[column?.dataField]" class="ml-1 h-4 w-4 text-gray-400"/>
                    <ArrowLongDownIcon v-if="iconSort === 'Arrow' && !orderColumns[column?.dataField]" class="ml-1 h-4 w-4 text-gray-400"/>
                    <BarsArrowUpIcon v-if="iconSort === 'Bars' && orderColumns[column?.dataField]" class="ml-1 h-4 w-4 text-gray-400"/>
                    <BarsArrowDownIcon v-if="iconSort === 'Bars' && !orderColumns[column?.dataField]" class="ml-1 h-4 w-4 text-gray-400"/>
                  </div>
                </div>
              </th>
            </template>
          </tr>
          </thead>
<!-- -------------------------------- -->
          <tbody ref="tbody" class="divide-y divide-gray-200 dark:divide-gray-800 overflow-y-auto">
          <tr v-for="(data, index) in dataSource" :key="index" class="max-h-8">
            <template v-for="(column, key) in dataColumns" :key="`${index}-${key}`">
              <td v-if="column.visible" class="px-6 py-4 text-sm text-gray-800 dark:text-gray-300 whitespace-nowrap font-medium"
                  :style="columnStyle('filter', column)">
                <div class="flex items-center min-h-[1.5rem]" v-html="setCell(column, data[column.dataField])"/>
              </td>
            </template>
          </tr>
          </tbody>
<!-- -------------------------------- -->
          <div v-if="footerPaddingHeight" class="border-none" :style="`height: ${footerPaddingHeight-1}px`"></div>
<!-- -------------------------------- -->
          <tfoot v-if="isSummary && Object.keys(summaryColumns).length" ref="tfoot" class="bg-stone-100 dark:bg-stone-900 sticky bottom-0">
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
      <transition leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100" leave-to-class="opacity-0"
                  enter-active-class="transition ease-in duration-200" enter-from-class="opacity-0" enter-to-class="opacity-100">
        <div v-if="isLoading" class="absolute z-30 top-0 bottom-0 left-0 w-full p-1.5 select-none text-center text-sm text-gray-500">
          <div class="flex justify-center items-center h-full w-full rounded-lg bg-neutral-100/50 dark:bg-neutral-800/50">
            <Loading type="Semipolar" :size="40" :color="isDark? 'primary.800' : 'primary.500'"/>
          </div>
        </div>
      </transition>
      <transition leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100" leave-to-class="opacity-0"
                  enter-active-class="transition ease-in duration-200" enter-from-class="opacity-0" enter-to-class="opacity-100">
        <div v-if="!dataOriginal?.length" class="absolute top-[40%] left-0 w-full my-5 select-none text-center text-sm text-gray-500" v-html="noData"/>
      </transition>
      <transition leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100" leave-to-class="opacity-0"
                  enter-active-class="transition ease-in duration-200" enter-from-class="opacity-0" enter-to-class="opacity-100">
        <div v-if="dataOriginal?.length && !dataColumns?.length" class="absolute top-[50%] left-0 w-full my-5 select-none text-center text-sm text-gray-500" v-html="noColumn"/>
      </transition>
      <transition leave-active-class="transition-all ease-in duration-200" leave-from-class="opacity-100" leave-to-class="opacity-0"
                  enter-active-class="transition-all ease-in duration-200" enter-from-class="opacity-0" enter-to-class="opacity-100">
        <div v-if="dataOriginal?.length && dataColumns?.length && !dataSource.length" class="absolute top-[40%] flex flex-col items-center left-0 w-full my-5 select-none text-center text-sm text-gray-500">
          <FunnelIcon aria-hidden="true" class="h-5 w-5 text-gray-400 dark:text-gray-600"/>
          <div v-html="noFilter"/>
        </div>
      </transition>
    </div>
  </div>
</template>