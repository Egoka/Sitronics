import type {StyleClass} from "@/components/BaseTypes";

export type IAccordionItem = {
  title: string
  subtitle?: string
  open?: boolean
  template?: string
}
export type IAccordionStylesClass = {
  body?: StyleClass
  item?: StyleClass
  title?: StyleClass
  subtitle?: StyleClass
}
export interface IAccordion {
  dataSource?: Array<IAccordionItem|Record<string, any>>
  multiple?: boolean
  animationDuration?: number|100|200|300|500|1000|3000
  typeIcon?: "ChevronDown"|"ArrowDownCircle"|"Plus"
  class?: StyleClass
  styles?: IAccordionStylesClass
}