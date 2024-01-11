import type {IMode} from "@/components/BaseTypes";
// ---------------------------------------
export type Page = number
export interface IPagination {
  modelValue?: Page
  mode?: IMode
  sizePage?: number|5|15|20|50|100|150
  sizesSelector?: [5,15,20,50,100,150]|Array<number>
  visibleNumberPages?:5|6|7|8|9|10|11
  total?: number
  isInfoText?:boolean
  isPageSizeSelector?:boolean
  isHiddenNavigationButtons?:boolean
}