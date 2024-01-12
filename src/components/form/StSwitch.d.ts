import type {IMode} from "@/components/BaseTypes";
import type {IIcon} from "@/components/functional/Icons";

type IModeSwitch = IMode|'none'

export interface IDataSwitch {
  switchingType:"checkbox"|"switch"
  rounded: 1|2|3|4|5|6|7|8|9|10|number|"full"
  iconActive: IIcon["type"]
  iconInactive: IIcon["type"]
  mode: IModeSwitch
}
export interface ISwitch extends Partial<IDataSwitch>{
  id?: string
  modelValue?: boolean|null|undefined,
  label?: string
  disabled?:boolean
  help?: string
  required?: boolean
  class?: string
}