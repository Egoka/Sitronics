import type {IMode} from "@/components/BaseTypes";

export type ILabelMode = "offsetDynamic"|"offsetStatic"|"dynamic"|"static"|"vanishing"|"none"
export interface ILabel {
  title?: string
  isRequired?: boolean
  // isDisabled?: boolean
  type?: ILabelMode
  mode?: IMode
  translateX?:number|undefined
  maxWidth?:number|undefined
}