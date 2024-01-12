import type {ILayout} from "@/components/functional/InputLayout";
import type {IFixWindow} from "@/components/functional/FixWindow";
import type {IDataInput} from "@/components/form/StInput";

type IDataItem = {[key:string]: any}
type BaseDataItem = string|number|IDataItem
export interface IDateSelect {
  dataSelect: Array<BaseDataItem>
  autoFocus: boolean
  keySelect: string|"id"
  valueSelect: string|"value"
  multiple:boolean
  maxVisible:number
  noData: string
  noQuery: boolean
  classSelect: string|"justify-end"
  classSelectList: string
  classMaskQuery: "font-bold text-theme-700 dark:text-theme-300"|string
  paramsFixWindow: Omit<IFixWindow, "modelValue">
}
export interface ISelect extends Omit<ILayout, "value"|"isValue">, Partial<IDateSelect>{
  id?: string
  modelValue?: number|string|{}|null|Array<number|string|{}|null>
}
export interface ISelectExpose {
  focusSelect(isFocus:boolean):void
  openSelect():void
  closeSelect(evt:MouseEvent):void
  select(selectValue:BaseDataItem|null):void
}