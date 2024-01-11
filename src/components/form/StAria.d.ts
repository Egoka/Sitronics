import type {ILayout} from "@/components/functional/InputLayout";

export interface IDataAria {
  placeholder?: string
  autocomplete?: "on" | "off"
  wrap?: "soft" | "hard" | "off"
  rows?: number
  maxLength?: number
  classInput?: string|Array<string|null>
}
export interface IAria extends Omit<ILayout, "value"|"isValue">{
  id?: string
  modelValue?: string|number|null|undefined,
  paramsAria?: Partial<IDataAria>
}