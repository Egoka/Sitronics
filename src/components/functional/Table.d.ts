import type {StyleClass, IMode, TWidth, THeight} from "@/components/BaseTypes";
import type {IDataInput} from "@/components/form/StInput";
import type {IDateSelect} from "@/components/form/StSelect";
import type {IDatePicker} from "@/components/form/StCalendar";
import type {Ref, UnwrapRef} from "vue";
// ---TYPES-------------------------------
export type DataField = string
export type DataType = "string"|"number"|"select"|"date"
export type Sort = "asc"|"desc"|null
export type Search = string
export type Page = number
export type Sorted = { [dataField:DataField]: Sort }
export type Widths = { [dataField:DataField]: number }
export type Filters = { [dataField:DataField]: any }
export type ResultData = { [dataField:DataField]: Array<any> }
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
  edit?: {
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
  dataField: string
  dataType: DataType
}
export interface ITablePagination extends Omit<IPagination, 'total'|'modelValue'> {
  visible?:boolean
  startPage?:number
}
type border = string|'border-neutral-200 dark:border-neutral-800'
export type ITableStylesClass = {
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
export type ITableStylesBorder = {
  table?: border|'border-0'
  header?: border|'border-b-0'
  filter?: border|'border-r-0'
  head?: border|'border-b-0'
  cell?: border|'border-r-0 border-b-0'
  summary?: border|'border-t-0'
  pagination?: border|'border-t-0'
  footer?: border|'border-t-0'
}
export interface ITableStyles {
  class?: ITableStylesClass
  width?: TWidth
  height?: THeight
  animation?: "transition-all duration-500"|"transition-none"|string
  hoverRows?:string|"hover:bg-neutral-100/90 dark:hover:bg-neutral-900/50"|boolean
  isStripedRows?:boolean
  horizontalLines?:boolean
  verticalLines?:boolean
  borderRadiusPx?: number
  heightCell?:number
  filterLines?:boolean
  defaultWidthColumn?: "max-width: 600px;min-width:100px;width:auto"|string
  maskQuery?: "font-bold text-theme-700 dark:text-theme-300"|string
  border?: border|'border-0 border-b-0 border-t-0 border-r-0'|ITableStylesBorder
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
  deleteRow(_key:string):false|any
  updateRow(_key:string, data:any):false|any
  updateCell(_key:string, column:IColumn, value: any):false|any
  getColumn(dataField:IColumn["dataField"], index?:number):IColumn|undefined
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