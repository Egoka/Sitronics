import type {StyleClass} from "@/components/BaseTypes";

export interface IBadge {
  type?: "button" | "reset" | "submit"
  mode?:  "primary" | "secondary" | "outline" | "neutral"
  class?: StyleClass
  classContent?: StyleClass
  point?: boolean
  closeButton?:boolean
}