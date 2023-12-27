<script setup lang="ts">
import {computed, onMounted, onUnmounted, reactive, ref, toRaw, useSlots, watch} from "vue";
import type {Ref, UnwrapRef} from "vue";
import {
  ArrowLongUpIcon, ArrowLongDownIcon,
  BarsArrowUpIcon, BarsArrowDownIcon,
  MagnifyingGlassIcon, FunnelIcon, TableCellsIcon
} from "@heroicons/vue/20/solid";
import * as LData from "lodash";
import dayjs from 'dayjs'
import { v4 as uuidv4, type v4 as uuid } from 'uuid';
import isBetween from 'dayjs/plugin/isBetween'
import Button from "@/components/functional/Button.vue";
import Tooltip from "@/components/functional/Tooltip.vue";
import Loading from "@/components/functional/Loading.vue";
import Pagination, {type IPagination} from "@/components/functional/Pagination.vue";
import StInput, {type IDataInput} from "@/components/form/StInput.vue";
import StSelect, {type IDateSelect} from "@/components/form/StSelect.vue";
import StCalendar, {type IDatePicker, type IRangeValue} from "@/components/form/StCalendar.vue";
import {convertToNumber, convertToPhone} from "@/helpers/numbers";
import type {StyleClass, IMode, IWidth, IHeight} from "@/components/BaseTypes";
import {cn} from "@/helpers/tailwind";
// ---TYPES-------------------------------
type DataField = string
type DataType = "string"|"number"|"select"|"date"
type Sort = "asc"|"desc"|null
type Search = string
type Page = number
type Loading = boolean
type Sorted = { [dataField:DataField]: Sort }
type Widths = { [dataField:DataField]: number }
type Filters = { [dataField:DataField]: any }
type ResultData = { [dataField:DataField]: Array<any> }
// ---INTERFACES--------------------------
export interface IToolbar {
  visible?:boolean
  search?:boolean
}
export interface ISort {
  visible?:boolean
  icon?:"Bars"|"Arrow"
}
export interface IFilter {
  visible?:boolean
  noFilter?:string
  isClearAllFilter?:boolean
}
export interface IGrouping {
  visible?:boolean
  groupField?:string
}
interface EditorCell {
  isEdit?:boolean
  paramsInput?: IDataInput
  paramsSelect?: IDateSelect
  paramsDatePicker?: Partial<IDatePicker>
}
export interface IColumn {
  dataField?:DataField
  name?:string
  caption?:string
  type?:DataType
  visible?:boolean
  width?:number
  minWidth?:number
  maxWidth?:number
  isFilter?:boolean
  isSort?:boolean
  isResized?:boolean
  edit?: boolean | EditorCell
  defaultFilter?: any
  defaultSort?: Sort
  mask?:IDataInput["mask"]
  paramsInput?: IDataInput
  paramsSelect?: IDateSelect
  paramsDatePicker?: Partial<IDatePicker>
  cellTemplate?: string
  setCellValue?(column:IColumn, value:any, data?:any):any,
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
interface IColumnPrivate extends Omit<IColumn, 'dataField'|'edit'> {
  id: string
  dataField:string
  isEdit: boolean
  edit: {
    paramsInput?: IDataInput
    paramsSelect?: IDateSelect
    paramsDatePicker?: Partial<IDatePicker>
  }
}
export interface ISummary {
  dataField?: string
  name?: string
  displayFormat?: string|"Sum: {0}"|"Min: {0}"|"Max: {0}"|"Avg: {0}"|"Count: {0}"
  type?: "sum"|"min"|"max"|"avg"|"count"
  dataType?: DataType
  customizeText?(summary:ISummary, result:string):string
}
interface ISummaryPrivate extends ISummary {
  id: string
  dataType: DataType
}
export interface ITablePagination extends Omit<IPagination, 'total'|'modelValue'> {
  visible?:boolean
  startPage?:number
}
type border = string|'border-neutral-200 dark:border-neutral-800'
export interface ITableStyles {
  class?: {
    body?: StyleClass
    toolbar?: StyleClass
    bodyTable?: StyleClass
    slotHeader?: StyleClass
    slotFooter?: StyleClass
    table?: StyleClass
    thead?: StyleClass
    tbody?: StyleClass
    tfoot?: StyleClass
    group?: StyleClass
    groupText?: StyleClass
    cellText?: StyleClass
    pagination?: StyleClass
  }
  width?: IWidth
  height?: IHeight
  animation?: "transition-all duration-500"|"transition-none"|string
  hoverRows?:string|"hover:bg-neutral-100/90 dark:hover:bg-neutral-900/50"|boolean
  isStripedRows?:boolean
  horizontalLines?:boolean
  verticalLines?:boolean
  borderRadiusPx?: number
  heightCell?:number
  filterLines?:boolean
  defaultWidthColumn?: "max-width: 600px;min-width:100px;width:auto"|string
  maskQuery?: "font-bold text-primary-700 dark:text-primary-300"|string
  border?: border|'border-0 border-b-0 border-t-0 border-r-0'|{
    table?: border|'border-0'
    header?: border|'border-b-0'
    filter?: border|'border-r-0'
    head?: border|'border-b-0'
    cell?: border|'border-r-0 border-b-0'
    summary?: border|'border-t-0'
    pagination?: border|'border-t-0'
    footer?: border|'border-t-0'
  }
}
// ---------------------------------------
export interface ITable {
  mode?:IMode
  dataSource?: Array<any>|[]
  toolbar?: IToolbar|boolean
  edit?:boolean
  sort?: ISort|boolean
  filter?: IFilter|boolean
  grouping?: IGrouping|string
  resizedColumns?:boolean
  pagination?: ITablePagination|boolean
  search?:boolean
  columns?: boolean|Array<IColumn>
  summary?: boolean|Array<ISummary>
  countVisibleRows?: number
  noData?:string
  noColumn?:string
  countDataOnLoading?:number|100|1000|10000
  totalCount?:number
  styles?:ITableStyles
}
// ---PROPS-EMITS-SLOTS-------------------
const props = defineProps<ITable>()
const emit = defineEmits<{
  (event: 'sort', payload: {dataColumns:Array<IColumn>, sortedFields:Sorted}): void
  (event: 'filter', payload: {dataColumns:Array<IColumn>, filteredFields: Filters}): void
  (event: 'search', payload: Search)
  (event: 'result-data', payload: ResultData)
  (event: 'switch-page', payload: Page)
  (event: 'switch-size-page', payload: Page)
  (event: 'before-edit-cell', payload: {newValue: any, oldValue: any, _key: uuid, column:IColumn})
  (event: 'after-edit-cell', payload: {newValue: any, oldValue: any, _key: uuid, column:IColumn})
  (event: 'before-edit-row', payload: {newValue: any, oldValue: any, _key: uuid})
  (event: 'after-edit-row', payload: {newValue: any, oldValue: any, _key: uuid})
  (event: 'add-row', payload: {value: any, index: number, _key: uuid})
  (event: 'delete-row', payload: {value: any, index: number, _key: uuid})
  (event: 'click-row', payload: { eventEl:HTMLElement, data:any, indexRow:number })
  (event: 'click-cell', payload: { eventEl:HTMLElement, column:IColumn, value:any, valueWithMarker:any, data:any, indexRow:number })
  (event: 'loading', payload:boolean)
  (event: 'clear-filter')
}>()
const slots = useSlots()
// ---REF-LINK----------------------------
const componentTable = ref<HTMLElement>()
const tableHeader = ref<HTMLElement>()
const tableToolbar = ref<HTMLElement>()
const tableBody = ref<HTMLElement>()
const table = ref<HTMLElement>()
const thead = ref<HTMLElement>()
const tbody = ref<HTMLElement>()
const tfoot = ref<HTMLElement>()
const pager = ref<HTMLElement>()
const tableFooter = ref<HTMLElement>()
// ---STATE-------------------------------
const queryTable = ref<Search>("")
const pageTable = ref<Page>(1)
const sizeTable = ref<Page>(5)
const widthsColumns = reactive<Widths>({})
const sortColumns = reactive<Sorted>({})
const filterColumns = reactive<Filters>({})
const allData = ref<ITable["dataSource"]>([])
const isLoading = ref<Loading>(false)
const editableCell = ref<{indexRow:number, indexCol:number}|null>()
// ---PROPS-------------------------------
const mode = computed<NonNullable<ITable["mode"]>>(()=> props.mode ?? "outlined")
const isVisibleToolbar = computed<boolean>(()=> (isSearch.value || !!props.toolbar) && ((props.toolbar as IToolbar)?.visible ?? true ))
const isSearch = computed<boolean>(()=> (props?.toolbar as IToolbar)?.search ?? props.search ?? false)
const isFilterClear = computed<boolean>(()=>((props.filter as IFilter)?.isClearAllFilter ?? false) && (!!noEmptyFilters(filterColumns).length || !!queryTable.value.length))
const isColumns = computed<boolean>(()=> typeof props.columns === "boolean" ? props.columns : Array.isArray(props.columns))
const isSummary = computed<boolean>(()=> typeof props.summary === "boolean" ? props.summary : Array.isArray(props.summary))
const countDataOnLoading = computed<ITable["countDataOnLoading"]>(()=> props.countDataOnLoading ?? 1000)
const classMaskQuery = computed<NonNullable<ITable["classMaskQuery"]>>(()=> props.styles?.maskQuery ?? "font-bold text-primary-700 dark:text-primary-400")
const noData = computed<NonNullable<ITable["noData"]>>(()=> props.noData ?? "Нет данных")
const noColumn = computed<NonNullable<ITable["noData"]>>(()=> props.noColumn ?? "Нет колонок")
const noFilter = computed<NonNullable<IFilter["noFilter"]>>(()=> (props.filter as IFilter)?.noFilter ?? "Не найдено подходящих данных")
const iconSort = computed<ISort["icon"]>(()=>(props?.sort as ISort)?.icon ?? "Arrow")
const resizedColumns = computed<ITable["resizedColumns"]>(()=>props.resizedColumns)
const isEditCells = computed<ITable["isEditCells"]>(()=>props.edit)
const lengthData = computed<number>(()=> props.totalCount ?? dataSource.value.length)
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
const isPagination = computed<boolean>(()=> countVisibleRows.value > 0 && (typeof props?.pagination === "object"
    ? typeof props?.pagination?.visible === "boolean" ? props.pagination.visible : true
    : typeof props?.pagination === "boolean" ? props.pagination : false) )
// ---PAGINATION--------------------------
const startPage = computed<NonNullable<ITablePagination["startPage"]>>(()=> (props.pagination as ITablePagination)?.startPage ?? 1)
const modePagination = computed<NonNullable<ITablePagination["mode"]>>(()=>(props.pagination as ITablePagination)?.mode ?? mode.value)
const sizePage = computed<NonNullable<ITablePagination["sizePage"]>>(()=>(props.pagination as ITablePagination)?.sizePage??countVisibleRows.value)
const visibleNumberPages = computed<ITablePagination["visibleNumberPages"]>(()=>(props.pagination as ITablePagination)?.visibleNumberPages)
const sizesSelector = computed<ITablePagination["sizesSelector"]>(()=>(props.pagination as ITablePagination)?.sizesSelector)
const isInfoText = computed<ITablePagination["isInfoText"]>(()=>(props.pagination as ITablePagination)?.isInfoText ?? false)
const isPageSizeSelector = computed<ITablePagination["isPageSizeSelector"]>(()=>(props.pagination as ITablePagination)?.isPageSizeSelector ?? false)
const isHiddenNavigationButtons = computed<ITablePagination["isHiddenNavigationButtons"]>(()=>(props.pagination as ITablePagination)?.isHiddenNavigationButtons ?? false)
// ---CELL--------------------------------
const heightCell = computed<number>(()=> props.styles?.heightCell ?? 24)
const countVisibleRows = computed<NonNullable<ITable["countVisibleRows"]>>(()=> props.countVisibleRows ?? 0)
// ---DATA--------------------------------
const dataSource = computed<Array<any>>(()=> {
  if (!(allData.value && allData.value?.length)){ return [] }
  let data = toRaw(allData.value)
  // Sort
  if (data && Object.keys(sortColumns).filter(i=>sortColumns[i] !== null).length){
    const sortedFields = getSorted(sortColumns) as any
    data = LData.orderBy(data, Object.keys(sortedFields), Object.values(sortedFields)) }
  // Filter
  if (data && noEmptyFilters(filterColumns).length){
    const filter = getFilters(filterColumns)
    data = LData.filter(data,(row) => Object.keys(filter)
      .filter(item => {
        const column = dataColumns.value.find(col=>col.dataField === item)
        return isEqualsValue(column, row[column.dataField], filter[column.dataField])
      }).length === Object.keys(filter).length) }
  // Search
  if (data && queryTable.value.length){
    data = LData.filter(data,(row) => !!dataColumns.value
      .filter(item => item.visible)
      .filter(item => isEqualsValue(item, row[item.dataField], queryTable.value)).length) }
  stopLoading()
  return data ?? []
})
const resultDataSource = computed<ResultData>(()=> {
  let resultData:any = toRaw(dataSource.value)
  if (isPagination.value) {
    if (isGroup.value) {
      resultData = Object.values(LData.groupBy(resultData, (item) => item[groupField.value])).flat() }
    resultData = LData.slice(resultData, sizeTable.value * (pageTable.value - 1), sizeTable.value * (pageTable.value)) }
  resultData = isGroup.value ? LData.groupBy(resultData, (item) => item[groupField.value]) : {0: resultData}
  emit('result-data', resultData)
  return resultData
})
const dataColumns = computed<Array<IColumnPrivate>>(()=> {
  let listFields:Array<string> = LData.uniq(LData.flatten(LData.map(allData.value, LData.keys))).filter(field=>field!=="_key")
  if (Array.isArray(props.columns) && props.columns?.length){
    return <Array<IColumnPrivate>>props.columns
      .map((column, index)=>{
        const fieldName = column.dataField ?? listFields[index] ?? ""
        if (fieldName === ""){ return false }
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
          isResized: typeof column.isResized === "boolean" ? column.isResized : resizedColumns.value,
          isEdit: typeof column.edit === "boolean" ? column.edit : column?.edit?.isEdit ?? isEditCells.value,
          edit: {},
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
            options.paramsInput = <IDataInput>{autocomplete: "off", ...column.paramsInput};
            options.edit.paramsInput = <IDataInput>{
              ...options.paramsInput,
              autoFocus:true,
              ...(column?.edit as EditorCell)?.paramsInput}
            break
          }
          case "number": {
            options.paramsInput = <IDataInput>{
              autocomplete: "off",
              mask: "number",
              ...column.paramsInput};
            options.edit.paramsInput = <IDataInput>{
              ...options.paramsInput,
              autoFocus:true,
              ...(column?.edit as EditorCell)?.paramsInput}
            break
          }
          case "select": {
            options.paramsSelect = <IDateSelect>{
              multiple: true,
              maxVisible: 0,
              classSelect: 'normal-case font-normal max-h-[25rem]',
              classSelectList: 'normal-case font-normal',
              dataSelect: LData.compact(LData.uniq(LData.map(allData.value, options.dataField ?? ""))) ?? [],
              paramsFixWindow: {
                position: 'bottom',
                ...column?.paramsSelect?.paramsFixWindow
              },
              ...column.paramsSelect};
            options.edit.paramsSelect = <IDateSelect>{
              ...options.paramsSelect,
              autoFocus:true,
              multiple: false,
              ...(column?.edit as EditorCell)?.paramsSelect,
              paramsFixWindow: {
                position: 'bottom',
                eventClose: "hover",
                ...(column?.edit as EditorCell)?.paramsSelect?.paramsFixWindow
              },
            }
            break
          }
          case "date": {
            options.paramsDatePicker = <Partial<IDatePicker>>{
              isRange: true,
              attributes: [{
                highlight: {
                  fillMode: 'light',
                },
                dates: LData.compact(LData.uniq(LData.map(allData.value, (item)=> item[options.dataField] ? String(item[options.dataField]) : null ))) ?? [],
              }],
              paramsFixWindow: {
                position: 'bottom',
                ...column?.paramsSelect?.paramsFixWindow
              },
              mask: column.paramsDatePicker?.masks?.modelValue ?? "DD.MM.YYYY",
              ...column.paramsDatePicker
            };
            options.edit.paramsDatePicker = <Partial<IDatePicker>>{
              ...options.paramsDatePicker,
              autoFocus:true,
              isRange: false,
              ...(column?.edit as EditorCell)?.paramsDatePicker,
              paramsFixWindow: {
                position: 'bottom',
                eventClose: "hover",
                ...(column?.edit as EditorCell)?.paramsSelect?.paramsFixWindow
              },
            }
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
        isResized: resizedColumns.value,
        isEdit: isEditCells.value,
        type: "string",
        class: {
          colFilterClass: "border-none font-normal",
          colFilterClassBody: "tm-0 my-1",
          colText: "text-left text-gray-400 dark:text-gray-500",
          td: "px-6 py-4 text-gray-800 dark:text-gray-300",
          cellText: "flex items-center whitespace-pre-line overflow-auto",
          sumText: "font-normal text-sm text-left text-gray-400 dark:text-gray-500"
        }
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
const baseTableHeight = 240 // 15rem
const heightTable = ref<string>(countVisibleRows.value ? `height: ${baseTableHeight}px` : "height: auto")
const styles = computed<ITableStyles>(()=>{
  const s = props.styles
  const sc = props.styles?.class
  const border = <object>props.styles?.border
  const hoverRows = typeof props.styles?.hoverRows === 'string'
    ? (props.styles?.hoverRows as string)
    : typeof props.styles?.hoverRows === 'boolean' && props.styles?.hoverRows
      ? "hover:bg-neutral-100/90 dark:hover:bg-neutral-900/50": ''
  const defaultBorder = typeof (border as string|object) === "string"
    ? border : "border-neutral-200 dark:border-neutral-800"
  return {
    class: {
      body: sc?.body, toolbar: sc?.toolbar, bodyTable: sc?.bodyTable,
      slotHeader: sc?.slotHeader, slotFooter: sc?.slotFooter,
      table: sc?.table, thead: sc?.thead, tbody: sc?.tbody, tfoot: sc?.tfoot,
      group: sc?.group, groupText: sc?.groupText,
      cellText: sc?.cellText, pagination: sc?.pagination,
    },
    hoverRows: hoverRows,
    width: s?.width? typeof s?.width === "number" ? `${s?.width}px` : s?.width : "",
    height: s?.height? typeof s?.height === "number" ? `${s?.height}px` : s?.height : "",
    animation: s?.animation ?? "transition-all duration-500",
    borderRadiusPx: s?.borderRadiusPx ?? (mode.value === 'underlined'? 0 : 7),
    isStripedRows: s?.isStripedRows ?? false,
    horizontalLines: s?.horizontalLines ?? true,
    verticalLines: s?.verticalLines ?? false,
    filterLines: s?.filterLines ?? false,
    defaultWidthColumn: s?.defaultWidthColumn ?? "max-width: 600px;min-width:100px;width:auto",
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
const tableBodyStyle = computed<string>(()=> {
  const borderTop = !(slots.header) ? `border-top-left-radius: ${styles.value.borderRadiusPx}px;border-top-right-radius: ${styles.value.borderRadiusPx}px;` : ''
  const borderBottom = !(isPagination.value || slots.footer) ? `border-bottom-left-radius: ${styles.value.borderRadiusPx}px;border-bottom-right-radius: ${styles.value.borderRadiusPx}px;` : ''
  return`${borderTop}${borderBottom}`
})
const modeStyle = computed<string>(()=>
  (mode.value === 'filled') ? 'bg-stone-100 dark:bg-stone-900' :
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
// ---IS-DARK-----------------------------
const isDark = ref<boolean>(window.matchMedia('(prefers-color-scheme: dark)')?.matches)
const colorSchemeQueryList = window.matchMedia('(prefers-color-scheme: dark)');
const setColorScheme = e => isDark.value = e.matches
setColorScheme(colorSchemeQueryList);
colorSchemeQueryList.addEventListener('change', setColorScheme);
// ---EXPOSE------------------------------
export interface ITableExpose {
  //---STATE-------------------------
  widthsColumns: Readonly<Widths>
  sortColumns: Readonly<Sorted>
  filterColumns: Readonly<Filters>
  queryTable: Readonly<Ref<UnwrapRef<Search>>>
  pageTable: Readonly<Ref<UnwrapRef<Page>>>
  sizeTable: Readonly<Ref<UnwrapRef<Page>>>
  allData: Readonly<Ref<UnwrapRef<ITable["dataSource"]>>>
  isLoading: Readonly<Ref<UnwrapRef<boolean>>>
  // ---PROPS-------------------------------
  mode: Readonly<Ref<UnwrapRef<ITable["mode"]>>>
  isVisibleToolbar: Readonly<Ref<UnwrapRef<boolean>>>
  isSearch: Readonly<Ref<UnwrapRef<boolean>>>
  isFilterClear: Readonly<Ref<UnwrapRef<boolean>>>
  isColumns: Readonly<Ref<UnwrapRef<boolean>>>
  isSummary: Readonly<Ref<UnwrapRef<boolean>>>
  countDataOnLoading: Readonly<Ref<UnwrapRef<ITable["countDataOnLoading"]>>>
  classMaskQuery: Readonly<Ref<UnwrapRef<ITable["classMaskQuery"]>>>
  noData: Readonly<Ref<UnwrapRef<ITable["noData"]>>>
  noColumn: Readonly<Ref<UnwrapRef<ITable["noData"]>>>
  noFilter: Readonly<Ref<UnwrapRef<IFilter["noFilter"]>>>
  iconSort: Readonly<Ref<UnwrapRef<ISort["icon"]>>>
  resizedColumns: Readonly<Ref<UnwrapRef<ITable["resizedColumns"]>>>
  lengthData: Readonly<Ref<UnwrapRef<number>>>
  groupField: Readonly<Ref<UnwrapRef<IGrouping["groupField"]|null>>>
  isFilter: Readonly<Ref<UnwrapRef<boolean>>>
  isSort: Readonly<Ref<UnwrapRef<boolean>>>
  isGroup: Readonly<Ref<UnwrapRef<boolean>>>
  isPagination: Readonly<Ref<UnwrapRef<boolean>>>
  // ---PAGINATION--------------------------
  startPage: Readonly<Ref<UnwrapRef<ITablePagination["startPage"]>>>
  modePagination: Readonly<Ref<UnwrapRef<ITablePagination["mode"]>>>
  sizePage: Readonly<Ref<UnwrapRef<ITablePagination["sizePage"]>>>
  visibleNumberPages: Readonly<Ref<UnwrapRef<ITablePagination["visibleNumberPages"]>>>
  sizesSelector: Readonly<Ref<UnwrapRef<ITablePagination["sizesSelector"]>>>
  isInfoText: Readonly<Ref<UnwrapRef<ITablePagination["isInfoText"]>>>
  isPageSizeSelector: Readonly<Ref<UnwrapRef<ITablePagination["isPageSizeSelector"]>>>
  isHiddenNavigationButtons: Readonly<Ref<UnwrapRef<ITablePagination["isHiddenNavigationButtons"]>>>
  // ---CELL--------------------------------
  heightCell: Readonly<Ref<UnwrapRef<number>>>
  countVisibleRows: Readonly<Ref<UnwrapRef<ITable["countVisibleRows"]>>>
  heightTable: Readonly<Ref<UnwrapRef<string>>>
  // ---DATA--------------------------------
  dataSource: Readonly<Ref<UnwrapRef<Array<any>>>>
  resultDataSource: Readonly<Ref<UnwrapRef<ResultData>>>
  dataColumns: Readonly<Ref<UnwrapRef<Array<IColumnPrivate>>>>
  dataSummary: Readonly<Ref<UnwrapRef<Array<ISummaryPrivate>>>>
  summaryColumns: Readonly<Ref<UnwrapRef<object>>>
  // ---STYLE-------------------------------
  styles: Readonly<Ref<UnwrapRef<ITableStyles>>>
  tableBodyStyle: Readonly<Ref<UnwrapRef<string>>>
  modeStyle: Readonly<Ref<UnwrapRef<string>>>
  isDark: Readonly<Ref<UnwrapRef<boolean>>>
  // ---METHODS-----------------------------
  addRow(data:any):number
  deleteRow(_key:uuid):false|any
  updateRow(_key:uuid, data:any):false|any
  updateCell(_key:uuid, column:IColumn, value: any):false|any
  getColumn(dataField:IColumn["dataField"], index?:number):IColumn
  sorting(dataField:IColumn["dataField"], value?:Sort):void
  filtering(dataField:IColumn["dataField"], value:any):void
  searching(value:Search):void
  switchPage(page:Page):void
  switchSizePage(sizePage:Page):void
  startLoading():void
  stopLoading():void
  clearFilter():void
  updateHeightTable():void
}
defineExpose<ITableExpose>({
  //---STATE-------------------------
  widthsColumns, sortColumns, filterColumns, queryTable, pageTable, sizeTable, allData, isLoading,
  // ---PROPS-------------------------------
  mode, isVisibleToolbar, isSearch, isFilterClear, isColumns, isSummary, countDataOnLoading, classMaskQuery,
  noData, noColumn, noFilter, iconSort, resizedColumns, lengthData, groupField, isFilter, isSort, isGroup, isPagination,
  // ---PAGINATION--------------------------
  startPage, modePagination, sizePage, visibleNumberPages, sizesSelector, isInfoText, isPageSizeSelector, isHiddenNavigationButtons,
  // ---CELL--------------------------------
  heightCell,countVisibleRows,heightTable,
  // ---DATA--------------------------------
  dataSource,resultDataSource,dataColumns,dataSummary,summaryColumns,
  // ---STYLE-------------------------------
  styles,tableBodyStyle,modeStyle,isDark,
  // ---METHODS-----------------------------
  addRow,deleteRow,updateRow,updateCell,
  getColumn,
  sorting,filtering,searching,
  switchPage,switchSizePage,
  clearFilter,
  startLoading,stopLoading,
  updateHeightTable
})
// ---MOUNT-UNMOUNT-----------------------
onMounted(()=>{
  if (tbody.value) { tableObserver.observe(tbody.value as Element) }
  const resultSort = dataColumns.value.map((column)=>[column.dataField,column.defaultSort??null])
  Object.assign(sortColumns, Object.fromEntries(new Map(resultSort)))
  const resultFilter = dataColumns.value.map((column)=>[column.dataField,column.defaultFilter??null])
  Object.assign(filterColumns, Object.fromEntries(new Map(resultFilter)))
  const resultWidths = dataColumns.value.map((column)=>[column.dataField,column.width??column.maxWidth??column.minWidth])
  Object.assign(widthsColumns, Object.fromEntries(new Map(resultWidths)))
  setTimeout(()=>updateHeightTable(),10)
})
onUnmounted(()=>{
  tableObserver.disconnect();
})
// ---WATCHERS----------------------------
watch(()=>[countVisibleRows.value, styles.value.height],(value, oldValue)=> {
  const timeout:number = value[0] === oldValue[0] && styles.value?.hoverRows !== "transition-none" ? 500 : 1
  setTimeout(() => updateHeightTable(), timeout)
})
watch(()=>props.dataSource,()=>{
  allData.value = props.dataSource?.length ? props.dataSource?.map(item => { return {...item, _key: uuidv4()} }) : []
},{immediate: true})
watch(()=>sortColumns, ()=> {
  emit('sort', {dataColumns: dataColumns.value, sortedFields: getSorted(sortColumns)})
}, {deep: true})
watch(()=>filterColumns, ()=> {
  switchPage(1)
  emit('filter', {dataColumns: dataColumns.value, filteredFields: getFilters(filterColumns)})
}, {deep: true})
watch(()=>queryTable.value.length, ()=> {
  switchPage(1)
  emit('search', queryTable.value)
})
watch(startPage,(numberPage:number)=>{
  setTimeout(()=>switchPage(numberPage),10)
}, {immediate: true})
watch(sizePage,(sizePageValue:number)=>{
  switchSizePage (sizePageValue ?? sizePage.value)
}, {immediate: true})
// ---METHODS-----------------------------
function getHeightVisibleRows () {
  if (countVisibleRows.value && tbody.value && componentTable.value) {
    const tagTrs = [...(tbody.value as HTMLElement)?.querySelectorAll(`tr:nth-child(-n+${countVisibleRows.value??1})`)]
    if (tagTrs) {
      return tagTrs.reduce((sum, item:HTMLElement)=>sum + item?.offsetHeight, 0)
    } else { return countVisibleRows.value * (32 + heightCell.value + 1) }
  }
}
function updateHeightTable() {
  if (styles.value.height) {
    const componentTableHeight = componentTable.value?.clientHeight -
      parseFloat(getComputedStyle(componentTable.value as HTMLElement).paddingTop) -
      parseFloat(getComputedStyle(componentTable.value as HTMLElement).paddingBottom)
    const height = (componentTableHeight ?? 0) - (tableToolbar.value?.clientHeight ?? 0) -
      (tableHeader.value?.clientHeight ?? 0) - (pager.value?.clientHeight ?? 0) - (tableFooter.value?.clientHeight ?? 0)
    heightTable.value = `height:${height>=0 ? height : 0}px;`
  } else if (countVisibleRows.value) {
    const resultHeight = (thead.value?.clientHeight ?? 0) + (tfoot.value?.clientHeight ?? 0) + getHeightVisibleRows() - 1
    heightTable.value = `height: ${resultHeight > 0 ? resultHeight : baseTableHeight}px;`
  } else { heightTable.value = "height: auto;" }
}
function getColumn(dataField:IColumn["dataField"], index?:number):IColumnPrivate {
  return dataColumns.value.find((column, item)=>dataField ? column.dataField === dataField : item === index)
}
function sorting(dataField:IColumn["dataField"], value?:Sort) {
  if (!dataField){ return }
  if (value === undefined) {
    value = (sortColumns[dataField] === null ? "asc"
        : sortColumns[dataField] === "asc" ? "desc"
        : sortColumns[dataField] === "desc" ? null : null) }
  let timeout = lengthData.value > countDataOnLoading.value ? 800 : 10
  if (timeout > 100){ startLoading() }
  setTimeout(()=>{
    sortColumns[dataField] = (value as Sort)
  },timeout)
}
function filtering(dataField:IColumn["dataField"], value:any) {
  if (!dataField){ return }
  const isLoading = typeof value === "object" || typeof value === "number"? true
    : (filterColumns[dataField] as string|Array<any>)?.length > (value as string|Array<any>)?.length
  let timeout = (allData.value?.length > countDataOnLoading.value)
    ? ((lengthData.value > countDataOnLoading.value)||value === null||value === ""||isLoading) && filterColumns[dataField] !== value
      ? 800 : 0 : 0
  if (timeout > 100){ startLoading() }
  setTimeout(()=>{
    filterColumns[dataField] = value
  },timeout)
}
function searching(value:Search|null) {
  const isLoading = queryTable.value?.length > value?.length
  let timeout = allData.value?.length > countDataOnLoading.value
    ? lengthData.value > countDataOnLoading.value||value === null||value === ""||isLoading ? 800 : 0 : 0
  if (timeout > 100){ startLoading() }
  setTimeout(()=>{
    queryTable.value = value??""
  },timeout)
}
function switchPage(page:Page) {
  pageTable.value = page
  emit('switch-page', pageTable.value)
}
function switchSizePage (sizePage:Page) {
  switchPage(1)
  sizeTable.value = sizePage
  emit('switch-size-page', sizeTable.value)
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
function setCell(column:IColumnPrivate, value:any, data?:any):string{
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
  } else if ("setCellValue" in column) {
    valueCell = column?.setCellValue(column, value, data)
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
function getSorted(sorted:Sorted):Sorted {
  return Object.keys(sorted).reduce((result, column)=>{
    if (sorted[column] === "asc" || sorted[column] === "desc"){
      result[column] = sorted[column] }
    return result }, {})
}
function getFilters(filters:Filters):Filters {
  return noEmptyFilters(filters)
    .reduce((result, column)=> {
      result[column] = filters[column]
      return result
    }, {})
}
function noEmptyFilters(filter: Filters):Array<any> {
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
  emit("clear-filter")
}
function clearEditableCell(indexRow: number, indexCol: number) {
  setTimeout(()=>{
    if (editableCell.value?.indexRow === indexRow && editableCell.value?.indexCol === indexCol) {
      editableCell.value = null
    }
  },500)
}
function startLoading() {
  isLoading.value = true
  emit( "loading", isLoading.value)
}
function stopLoading() {
  isLoading.value = false
  emit( "loading", isLoading.value)
}
function clickRow(key:string, data:any, indexRow:number) {
  emit( "click-row", {eventEl: (tbody.value as HTMLElement)?.querySelector(`.${key}`) as HTMLElement ?? null, data, indexRow})
}
function clickCell(key:string, column:IColumn, value:any, valueWithMarker:any, data:any, indexRow:number, indexCol:number) {
  if ((column as IColumnPrivate)?.isEdit) {
    editableCell.value = {indexRow, indexCol} }
  emit( "click-cell", {eventEl: (tbody.value as HTMLElement)?.querySelector(`.${key}`) as HTMLElement ?? null, column, value, valueWithMarker, data, indexRow})
}
function addRow(data:any):number {
  const newValueRow = {...data, _key: uuidv4()}
  const index:number = allData.value?.push(newValueRow) - 1
  emit('add-row', {value:newValueRow, index, _key: newValueRow._key})
  return index
}
function deleteRow(_key:uuid):false|any {
  if (_key && allData.value) {
    const index = allData.value?.findIndex(i=>i._key === _key)
    if (index >= 0){
      emit('delete-row', {value:allData.value[index], index, _key})
      return allData.value?.splice(index as number, 1)
    }
  } return false
}
function updateRow(_key:uuid, data:any):false|any {
  if (_key) {
    const index = allData.value?.findIndex(i=>i._key === _key)
    if (index >= 0){
      const newValueRow = {...allData.value[index], ...data}
      emit('before-edit-row', {newValue: newValueRow, oldValue: allData.value[index], _key})
      allData.value[index] = newValueRow
      emit('after-edit-row', {newValue: allData.value[index], oldValue: newValueRow, _key})
      return allData.value[index] 
    }
  } return false
}
function updateCell(_key:uuid, column:IColumn, value: any):false|any {
  if (_key && column) {
    const index = allData.value?.findIndex(i=>i._key === _key)
    if (index >= 0 && column.dataField in allData.value[index]){
      emit('before-edit-cell', {newValue: value, oldValue: allData.value[index][column.dataField], _key, column})
      allData.value[index][column.dataField] = value
      emit('after-edit-cell', {newValue: allData.value[index][column.dataField], oldValue: value, _key, column})
      return value
    }
  } return false
}
// ---RESIZE-COLUMN-----------------------
function resizeColumn($event: MouseEvent, columnId: string) {
  const columnEl: HTMLElement = (thead.value as HTMLElement)?.querySelector(`.${columnId}`);
  if (columnEl) {
    const column = <IColumnPrivate>dataColumns.value.find(item=>item.id === columnId)
    const rect = columnEl.getBoundingClientRect();
    let newW = $event.pageX - rect.left
    const maxW = column.maxWidth
    if (newW > maxW && maxW) { newW = maxW }
    const minW = column.minWidth ?? 100
    if (newW < minW && minW) { newW = minW }
    widthsColumns[column.dataField] = Math.round(newW)
  }
}
const resizableColumn = ref<string|null>(null)
function moveResizedColumns(ev: MouseEvent) {
  resizeColumn(ev, resizableColumn.value??"");
}
function startResizeColumn($event: MouseEvent, column: IColumnPrivate["id"]) {
  if($event.stopPropagation) $event.stopPropagation();
  if($event.preventDefault) $event.preventDefault();
  resizableColumn.value = column
  window.addEventListener('mousemove', moveResizedColumns);
  window.addEventListener('mouseup', stopResizeColumn);
}
function stopResizeColumn() {
  resizableColumn.value = null
  window.removeEventListener('mousemove', moveResizedColumns);
}
// ---------------------------------------
</script>

<template>
  <div ref="componentTable"
       :class="cn(
'componentTable classBody inline-block align-middle relative w-full p-1.5',
         styles?.animation, styles.class?.body)"
       :style="`width:${styles.width};height:${styles.height};`">
    <div v-if="isVisibleToolbar"
         ref="tableToolbar"
         :class="cn('classToolbar toolbar flex mb-2 justify-end items-end', styles?.animation, styles.class?.toolbar)">
      <div v-if="slots.toolbar" class="w-full">
        <slot name="toolbar"/>
      </div>
      <div class="ml-1">
        <StInput
          v-if="isSearch"
          :model-value="queryTable"
          label="Найти..."
          clear
          :mode="mode"
          label-mode="vanishing"
          :params-input="{autocomplete: 'off', classInput: 'min-w-[5rem] max-w-[5rem] focus:max-w-[8rem] focus:min-w-[8rem] sm:focus:max-w-[15rem] sm:focus:min-w-[15rem] transition-all duration-500'}"
          :class-body="`sticky top-1 rounded-md ease-out ${modeStyle}`"
          @change:model-value="(v)=>searching(v)"
          @update:model-value="(v)=>lengthData > 100||searching(v)">
          <template #before>
            <MagnifyingGlassIcon aria-hidden="true" class="h-5 w-5 text-gray-400 dark:text-gray-600"/>
          </template>
        </StInput>
      </div>
      <transition leave-active-class="transition ease-in duration-1000" leave-from-class="opacity-100" leave-to-class="opacity-0"
                  enter-active-class="transition ease-in duration-1000" enter-from-class="opacity-0" enter-to-class="opacity-100">
          <Button v-if="isFilterClear" class="group rounded-md ml-2 h-[38px] min-w-[38px] px-2 bg-stone-100 dark:bg-stone-900" @click="clearFilter">
            <FunnelIcon aria-hidden="true" class="h-4 w-4 text-gray-400 dark:text-gray-600 group-hover:text-red-400 group-hover:dark:text-red-600"/>
            <Tooltip>Очистить все фильтры</Tooltip>
          </Button>
      </transition>
    </div>
    <div :class="cn('flex flex-col border', (styles.border as {'table'})?.table)" :style="`border-radius: ${styles.borderRadiusPx}px;`">
      <div v-if="slots.header"
           ref="tableHeader"
           :class="cn('min-h-[1.5rem] text-gray-500', !(isSummary||isPagination)||'relative', modeStyle)"
           :style="`border-top-left-radius: ${styles.borderRadiusPx}px;border-top-right-radius: ${styles.borderRadiusPx}px;`">
        <div :class="cn('classSlotHeader p-2 border-b-2', styles.class?.slotHeader, (styles.border as {'header'})?.header)">
          <slot name="header"/>
        </div>
      </div>
      <div class="relative">
        <div ref="tableBody"
             :class="cn('classBodyTable overflow-x-auto', styles?.animation, styles.class?.bodyTable)"
             :style="[tableBodyStyle, heightTable, countVisibleRows > 0 ?'':`min-height: ${baseTableHeight}px;`]">
          <table ref="table" :class="cn('classTable min-w-full border-separate border-spacing-0', styles.class?.table)">
  <!-- -------------------------------- -->
            <thead v-if="isColumns"
                   ref="thead"
                   :class="cn('classTHead sticky top-0 z-20', styles.class?.thead || modeStyle)">
            <tr>
              <template v-for="(column, key) in dataColumns" :key="column.id">
                <th v-if="column.visible" scope="col"
                    :class="cn(column.id, column.class?.th, 'group/th', column.isFilter ? 'pl-1 pr-0 py-2' : 'pl-6 py-5', 'border-b', (styles.border as {'head'})?.head)"
                    :style="!widthsColumns[column.dataField] ? styles?.defaultWidthColumn :
                    `width: ${widthsColumns[column.dataField]}px;
                    min-width: ${widthsColumns[column.dataField]}px;
                    max-width: ${widthsColumns[column.dataField]}px;`">
                  <div :class="cn('group relative flex w-full', styles.filterLines ? 'border-r group-last/th:border-r-0' : '', (styles.border as {'filter'})?.filter)">
                    <div v-if="column.isFilter" :class="cn('w-full cursor-pointer', column.class?.colFilter, (column.isSort||isSort)||'px-1')">
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
                        :style="`min-width: ${widthsColumns[column.dataField]? widthsColumns[column.dataField]-30 : column.width||column.minWidth||50}px`"
                        clear
                        @change:model-value="(v)=>filtering(column?.dataField, v)"/>
                    </div>
                    <div v-else :class="cn('block text-sm font-medium truncate', column.class?.colText)">
                      {{ column.caption }}
                    </div>
                    <div v-if="column.isSort??isSort"
                         :class="cn(
                           'flex items-center transition-opacity duration-500 pr-1 cursor-pointer',
                            sortColumns[column?.dataField] === null ? 'opacity-0 group-hover:opacity-100' : 'opacity-100')"
                         @click="sorting(column?.dataField)">
                      <ArrowLongUpIcon v-if="iconSort === 'Arrow' && [null, 'asc'].includes(sortColumns[column?.dataField])" class="ml-1 h-4 w-4 text-gray-400"/>
                      <ArrowLongDownIcon v-if="iconSort === 'Arrow' && sortColumns[column?.dataField] === 'desc'" class="ml-1 h-4 w-4 text-gray-400"/>
                      <BarsArrowUpIcon v-if="iconSort === 'Bars' && [null, 'asc'].includes(sortColumns[column?.dataField])" class="ml-1 h-4 w-4 text-gray-400"/>
                      <BarsArrowDownIcon v-if="iconSort === 'Bars' && sortColumns[column?.dataField] === 'desc'" class="ml-1 h-4 w-4 text-gray-400"/>
                    </div>
                    <div
                      v-if="column.isResized??resizedColumns"
                      :class="cn(
                        'resizable absolute z-10 inset-y-0 flex items-center hover:opacity-100 px-2 cursor-ew-resize transition-opacity duration-500',
                        dataColumns.length-1 > key ? '-right-3' : 'right-3',
                        resizableColumn === column.id ? 'opacity-100': 'opacity-0')"
                      @mousedown="startResizeColumn($event, column.id)" @mouseup="stopResizeColumn">
                      <div :class="cn('h-8 w-1.5 bg-neutral-300 dark:bg-neutral-600',
                      !(mode === 'filled')||'rounded-full',
                      !(mode === 'outlined')||'rounded-full',
                      !(mode === 'underlined')||'rounded-none')"></div>
                    </div>
                  </div>
                </th>
              </template>
            </tr>
            </thead>
  <!-- -------------------------------- -->
            <tbody ref="tbody" :class="cn('classTBody overflow-y-auto', styles.class?.tbody)">
              <template v-for="(group, key) in resultDataSource" :key="key">
                <tr v-if="isGroup">
                  <th :colspan="dataColumns.length" scope="colgroup"
                      :style="`top:${thead?.clientHeight-1}px`"
                      :class="cn(
                        'classGroup sticky',
                        'border-t-2 border-b',
                        'font-medium text-base whitespace-nowrap',
                        'text-left text-gray-800 dark:text-gray-300 px-6 py-2 pr-3 pl-10 sm:pl-12',
                        styles.class?.group || modeStyle,
                        (styles.border as {'cell'})?.cell)">
                    <div
                      :class="cn('sticky classGroupText left-10 sm:left-12 flex items-center w-fit min-h-[2.5rem] truncate', styles.class?.groupText)"
                      :style="`min-height: ${heightCell}px`">
                      <slot name="group" :item="key" :length="group.length">
                        {{key}}
                      </slot>
                    </div>
                  </th>
                </tr>
                <tr v-for="(data, indexRow) in group" :key="indexRow"
                    :class="cn(`tr--${data?._key??indexRow} group/tr`,
                    styles.hoverRows && `${styles.hoverRows} transition-colors duration-200`, !styles.isStripedRows||
                    ((mode === 'filled') ? 'odd:bg-stone-100 even:bg-stone-50 dark:odd:bg-stone-900 dark:even:bg-stone-950' :
                    (mode === 'outlined') ? 'odd:bg-white even:bg-neutral-50 dark:odd:bg-neutral-950 dark:even:bg-neutral-900' :
                    (mode === 'underlined') ? 'odd:bg-stone-50 even:bg-stone-100 dark:odd:bg-stone-950 dark:even:bg-neutral-900' : ''))"
                    @click="clickRow(`tr--${data?._key??indexRow}`, data, indexRow)">
                  <template v-for="(column, indexCol) in dataColumns" :key="`${indexRow}-${indexCol}`">
                    <td v-if="column.visible"
                        :class="cn('ColumnClassTd', `td--${data?._key??indexRow}--${column?.name??indexCol}`,
                          'first:border-l-0 group-first/tr:border-t-0 last:border-r-0 group-last/tr:border-b-0',
                          'text-sm font-medium',
                          column.class?.td, styles.class?.cellText, (styles.border as {'cell'})?.cell,
                          styles.verticalLines ? 'border-r': 'border-r-0',
                          styles.horizontalLines ? 'border-b': 'border-b-0',
                          editableCell?.indexRow === indexRow && editableCell?.indexCol === indexCol ? '!px-1':'')"
                        :style="!widthsColumns[column.dataField] ? styles?.defaultWidthColumn :
                          `width: ${widthsColumns[column.dataField]}px;
                          min-width: ${widthsColumns[column.dataField]}px;
                          max-width: ${widthsColumns[column.dataField]}px;`"
                        @click="clickCell(`td--${data?._key??indexRow}--${column?.name??indexCol}`, column, data[column.dataField],
                          setMarker(column, setCell(column, data[column.dataField], data)), data, indexRow, indexCol)">
                      <div v-if="!column?.cellTemplate" :class="cn(column.class?.cellText, (editableCell?.indexRow === indexRow && editableCell?.indexCol === indexCol) && 'overflow-visible')"
                           :style="`min-height: ${heightCell}px;max-height: ${(heightCell*5)+2}px;`">
                        <div v-if="!(editableCell?.indexRow === indexRow && editableCell?.indexCol === indexCol)" v-html="setMarker(column, setCell(column, data[column.dataField], data))"/>
                        <template v-if="editableCell?.indexRow === indexRow && editableCell?.indexCol === indexCol">
                          <StInput
                            v-if="column.type === 'string'||column.type === 'number'"
                            :model-value="data[column.dataField]"
                            :label="column.caption"
                            :mode="mode"
                            :params-input="{
                              ...column.edit.paramsInput,
                              classInput: `pt-[5px] pl-[10px] ${styles.class?.cellText} ${column.edit.paramsInput?.classInput}`}"
                            class="border-none font-normal !bg-transparent"
                            class-body="pt-0 -my-3 w-full"
                            label-mode="vanishing"
                            @is-active="(isActive)=>isActive||clearEditableCell(indexRow, indexCol)"
                            @change:model-value="(value)=>updateCell(data?._key, column, value)"/>
                          <StSelect
                            v-if="column.type === 'select'"
                            :model-value="data[column.dataField]"
                            :label="column.caption"
                            :mode="mode"
                            :params-select="{
                              ...column.edit.paramsSelect,
                              paramsFixWindow: {scrollableEl: tableBody, ...column.edit.paramsSelect?.paramsFixWindow},
                              classSelect: `pl-[10px] ${styles.class?.cellText} ${column.edit.paramsSelect?.classSelect}`}"
                            class="border-none font-normal !bg-transparent"
                            class-body="pt-[2px] -my-3 w-full"
                            label-mode="vanishing"
                            @is-active="(isActive)=>isActive||clearEditableCell(indexRow, indexCol)"
                            @update:model-value="(value)=>{updateCell(data?._key, column, value)}"
                            />
                          <StCalendar
                            v-if="column.type === 'date'"
                            :model-value="data[column.dataField]"
                            :label="column.caption"
                            :mode="mode"
                            :params-date-picker="{
                              ...column.edit.paramsDatePicker,
                              paramsFixWindow: {scrollableEl: tableBody, ...column.edit.paramsDatePicker?.paramsFixWindow},
                              classDateText: `pt-[7px] pl-[10px] ${styles.class?.cellText} ${column.edit.paramsDatePicker?.classDateText}`}"
                            class="border-none font-normal !bg-transparent"
                            class-body="pt-0 -my-3 w-full"
                            label-mode="vanishing"
                            @is-active="(isActive)=>isActive||clearEditableCell(indexRow, indexCol)"
                            @change:model-value="(value)=>updateCell(data?._key, column, value)"/>
                        </template>
                      </div>
                      <div
                        v-else
                        :class="cn(column.class?.cellText)"
                        :style="`min-height: ${heightCell}px;max-height: ${(heightCell*5)+2}px;`">
                        <slot
                          :name="column?.cellTemplate"
                          :key="data?._key"
                          :column="column" :rowData="data" :value="setCell(column, data[column.dataField], data)"
                          :value-with-marker="setMarker(column, setCell(column, data[column.dataField], data))"
                          :is-close-editor="(isActive)=>isActive||clearEditableCell(indexRow, indexCol)"
                          :edit-valiue="(value)=>updateCell(data?._key, column, value)"
                        />
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
                   ref="tfoot" class="classTFoot sticky bottom-0"
                   :class="cn(styles.class?.tfoot || modeStyle)">
            <tr>
              <template v-for="column in dataColumns" :key="column.id">
                <th
                  v-if="column.visible"
                  scope="col"
                  :class="cn('px-3 py-3', column.class?.tf, 'border-t', (styles.border as {'summary'})?.summary)">
                  <div
                    :class="cn('block font-normal text-sm truncate', column.class?.sumText)"
                    v-html="summaryColumns[column.dataField]"/>
                </th>
              </template>
            </tr>
            </tfoot>
  <!-- -------------------------------- -->
          </table>
        </div>
  <!-- -------------------------------- -->
        <div v-if="isPagination && allData?.length" ref="pager"
             :class="cn(!isSummary||'relative sm:px-5', modeStyle)"
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
                      :class="cn('classPagination border-t sm:px-2', styles.class?.pagination, (styles.border as {'pagination'})?.pagination)"
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
          <div v-if="!isLoading && !allData?.length"
               class="absolute top-[40%] flex flex-col items-center left-0 w-full my-5 pointer-events-none text-center text-sm text-gray-500">
            <TableCellsIcon aria-hidden="true" class="h-5 w-5 text-gray-400 dark:text-gray-600"/>
            <div v-html="noData"/>
          </div>
        </transition>
        <transition leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100" leave-to-class="opacity-0"
                    enter-active-class="transition ease-in duration-200" enter-from-class="opacity-0" enter-to-class="opacity-100">
          <div v-if="!isLoading && allData?.length && !dataColumns?.length"
               class="absolute top-[50%] left-0 w-full my-5 pointer-events-none text-center text-sm text-gray-500" v-html="noColumn"/>
        </transition>
        <transition leave-active-class="transition-all ease-in duration-200" leave-from-class="opacity-100" leave-to-class="opacity-0"
                    enter-active-class="transition-all ease-in duration-200" enter-from-class="opacity-0" enter-to-class="opacity-100">
          <div v-if="!isLoading && allData?.length && dataColumns?.length && !dataSource.length"
               class="absolute top-[40%] flex flex-col items-center left-0 w-full my-5 pointer-events-none text-center text-sm text-gray-500">
            <FunnelIcon aria-hidden="true" class="h-5 w-5 text-gray-400 dark:text-gray-600"/>
            <div v-html="noFilter"/>
          </div>
        </transition>
      </div>
      <div
        v-if="slots.footer"
        ref="tableFooter"
        :class="cn('min-h-[1.5rem] -mt-[1px] text-gray-500', !(isSummary||isPagination)||'relative sm:px-5', modeStyle)"
        :style="`border-bottom-left-radius: ${styles.borderRadiusPx}px;border-bottom-right-radius: ${styles.borderRadiusPx}px;`">
        <div :class="cn('classSlotFooter p-2 border-t-2', styles.class?.slotFooter, (styles.border as {'footer'})?.footer)">
          <slot name="footer"/>
        </div>
      </div>
    </div>
  </div>
</template>