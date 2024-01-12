import type {ILayout} from "@/components/functional/InputLayout";
import type {Ref, UnwrapRef} from "vue";

export type IInputType = 'text'|'number'|'email'|'password'
export type IInputMask = 'phone'|'number'|'price'
export interface IDataInput {
  type: IInputType
  autoFocus: boolean
  placeholder: string
  autocomplete: "on"|"off"
  mask: IInputMask
  lengthInteger: number
  lengthDecimal: number
  classInput: string|Array<string|null>
}
export interface IInput extends Omit<ILayout, "value"|"isValue">, Partial<IDataInput>{
  id?: string
  modelValue?: string|number|null|undefined
}
export interface IInputExpose {
  //---STATE-------------------------
  // inputRef: Readonly<Ref<UnwrapRef<HTMLElement>>>
  isActiveInput: Readonly<Ref<UnwrapRef<boolean>>>
  // ---PROPS-------------------------------
  id: Readonly<Ref<UnwrapRef<IInput["id"]>>>
  type: Readonly<Ref<UnwrapRef<IInput["type"]>>>
  value: Readonly<Ref<UnwrapRef<IInput["modelValue"]>>>
  autoFocus: Readonly<Ref<UnwrapRef<IInput["autoFocus"]>>>
  placeholder: Readonly<Ref<UnwrapRef<IInput["placeholder"]>>>
  autocomplete: Readonly<Ref<UnwrapRef<IInput["autocomplete"]>>>
  lengthInteger: Readonly<Ref<UnwrapRef<IInput["lengthInteger"]>>>
  lengthDecimal: Readonly<Ref<UnwrapRef<IInput["lengthDecimal"]>>>
  isValue: Readonly<Ref<UnwrapRef<boolean>>>
  mode: Readonly<Ref<UnwrapRef<IInput["mode"]>>>
  isDisabled: Readonly<Ref<UnwrapRef<IInput["disabled"]>>>
  isLoading: Readonly<Ref<UnwrapRef<IInput["isInvalid"]>>>
  isInvalid: Readonly<Ref<UnwrapRef<IInput["isInvalid"]>>>
  messageInvalid: Readonly<Ref<UnwrapRef<IInput["messageInvalid"]>>>
  // ---METHODS-----------------------------
  toMask(baseValue:string|number): string
  inputModelValue(valueResult:any): void
  changeModelValue(valueResult:any): void
  clear(): void
  focus(env:FocusEvent): void
  blur(env:FocusEvent): void
}