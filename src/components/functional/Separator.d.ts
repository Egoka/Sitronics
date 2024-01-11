import type {StyleClass} from "@/components/BaseTypes";
// ---TYPES-------------------------------
export type Gradient = 0|5|10|20|30|40|50
export type GradientLength = 0|5|10|20|30|40|50
export type Depth = 0|1|2|3|4|5|6|7
// ---INTERFACES--------------------------
export interface ISeparatorStyles {
  body?: StyleClass
  bodyLine?: StyleClass
  line?:StyleClass
  content?: StyleClass
  bodyLineLeft?: StyleClass
  lineLeft?:StyleClass
  bodyLineRight?: StyleClass
  lineRight?:StyleClass
}
export interface ISeparator {
  vertical?: boolean
  content?: "right"|"left"|"center"|"full"
  gradient?: Gradient|[Gradient, GradientLength]|boolean
  depth?: Depth
  styles?: ISeparatorStyles
  class?: StyleClass
}