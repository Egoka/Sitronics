import type {IIcon} from "@/components/functional/Icons";
import type {StyleClass} from "@/components/BaseTypes";
export type CursorType = "center" | "left" | "right"
export type Size = number
export type ISplitStyles = {

}
export type Panel = {
  name: string
  size?: Size
  maxSize?: Size
  minSize?: Size
}
export type Group = {
  units?: "percentages"|"pixels"
  panels: Array<Panel>
  direction?: "vertical"|"horizontal"
}
export type ISplit = {
  autoSaveName?: string
  separatorType?: "strip"|"hexagon"|IIcon["type"]
  separatorNotHoverOpacity?: boolean
  class?: StyleClass
  styles?: ISplitStyles
} & Group