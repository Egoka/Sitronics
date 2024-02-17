import type {Rules} from "@/helpers/rules";
import type {IMode, StyleClass} from "@/components/BaseTypes";
import type {ILabelMode} from "@/components/functional/Label";
import type {IInput} from "@/components/form/StInput";
import type {ISelect} from "@/components/form/StSelect";
import type {ICalendar} from "@/components/form/StCalendar";
import type {ITextEditor} from "@/components/form/StTextEditor";
import type {IAria} from "@/components/form/StAria";
import type {ISwitch} from "@/components/form/StSwitch";
//--------------------------------------------------------------
type classCol = "col-span-full"|"sm:col-span-3"|"sm:col-span-4"|"sm:col-span-5"|"sm:col-span-6"|string
export type IFormFields = {[key:string]: unknown}
//--------------------------------------------------------------
export type IFields = {
  name: string
  classCol?: classCol
  isHidden?: boolean|undefined
  rules?: Rules
}
export type IFieldsAdditional = {
  slots?: {
    beforeIcon?: string
    beforeText?: string
    afterIcon?: string
    afterText?: string
  }
}
//--------------------------------------------------------------
export type IFieldsInput = IFields & IFieldsAdditional & IInput & {
  typeComponent: "Input"
}
export type IFieldsAria = IFields & IFieldsAdditional & IAria & {
  typeComponent: "Aria"
}
export type IFieldsSelect = IFields & IFieldsAdditional & ISelect & {
  typeComponent: "Select"
  rules?: Omit<Rules, "email"|"phone"|"numeric"|"regular">
}
export type IFieldsCalendar = IFields & IFieldsAdditional & ICalendar & {
  typeComponent: "Calendar"
  rules?: Omit<Rules, "email"|"phone"|"numeric"|"regular">
}
export type IFieldsTextEditor = IFields & IFieldsAdditional & ITextEditor & {
  typeComponent: "TextEditor"
  rules?: Omit<Rules, "email"|"phone"|"numeric"|"regular">
}
export type IFieldsSwitch = IFields & ISwitch & {
  typeComponent: "Switch"
}
export type IFieldsCustom = IFields & {
  typeComponent: "Custom"
  nameTemplate: string
  modelValue?: any
  isValue?: boolean
  [key:string]: unknown
}
//--------------------------------------------------------------
export type IFieldsType =
  | IFieldsInput
  | IFieldsAria
  | IFieldsSelect
  | IFieldsCalendar
  | IFieldsTextEditor
  | IFieldsSwitch
  | IFieldsCustom
export type IFieldsUseInputLayout =
  | IFieldsInput
  | IFieldsAria
  | IFieldsSelect
  | IFieldsCalendar
  | IFieldsTextEditor
//--------------------------------------------------------------
export interface IFormStructure {
  isHidden?: boolean
  class?: "border-b border-gray-900/10 pb-12"|string
  classGrid?: "grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 mt-10"|string
  fields: Array<IFieldsType>,
  [key:string]: unknown
}
export interface IForm {
  name?: string
  structure: Array<IFormStructure>
  formFields?: IFormFields
  class?: StyleClass
  modeStyle?: IMode
  modeLabel?: ILabelMode
  modeValidate?: "onSubmit"|"onChange"|"onInput"
  submitButton?: string|"Save"
  structureClass?: "border-b border-gray-900/10 pb-12" | string
  structureClassGrid?: "grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 mt-10" | string
  disabled?:boolean
  autocomplete?: "on" | "off"
}
export interface IFormExpose {
  formFields:IFormFields,
  setFieldValue(fieldName:string, value:any): void
  setFieldParam(fieldName:string, param: keyof IFieldsType, value:any): void
  getField(fieldName:string): IFieldsType|null
  setStructureParam(indexStructure:number, param:keyof IFormStructure, value: any): void
  validateFields(nameField?:Array<string>|string): boolean
}