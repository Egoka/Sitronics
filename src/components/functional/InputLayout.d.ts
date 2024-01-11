import type {THeight, IMode, TWidth} from "@/components/BaseTypes";
import type {ILabelMode} from "@/components/functional/Label.ts";

export interface ILayout {
  value: any
  isValue?: boolean
  mode?: IMode
  label?: string
  labelMode?: ILabelMode
  isInvalid?: boolean
  messageInvalid?: string
  required?: boolean
  loading?: boolean
  disabled?:boolean
  help?: string
  clear?: boolean
  width?: TWidth
  height?: THeight
  animation?: "transition-all duration-500"|"transition-none"|string
  classBody?: string|Array<string|null>|'mb-6 rounded-md'
  class?: string|Array<string>
}