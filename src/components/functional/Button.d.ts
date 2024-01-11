import type {StyleClass} from "@/components/BaseTypes";

export type ButtonStyle = {
  mode?: "primary"|"outline"|"ghost"
  size?: "xs"|"sm"|"md"|"lg"|"xl"
  rounded?: "none"|"md"|"lg"|"full"
  color?: "theme"|"neutral"|"creative"|"destructive"
  class?: StyleClass
}
export type ButtonStyleVariants = {
  mode: Record<NonNullable<ButtonStyle["mode"]>,string|string[]>
  size: Record<NonNullable<ButtonStyle["size"]>,string|string[]>
  rounded: Record<NonNullable<ButtonStyle["rounded"]>,string|string[]>
  type: Record<NonNullable<IButton["type"]>,string|string[]>
  color: Record<NonNullable<IButton["color"]>,string|string[]>
}
export type ButtonType = {
  type?: "button"|"reset"|"submit"
  loading?: boolean
}
export type IconType = {
  type?: "icon"
}
export type LinkType = {
  type?: "link"
  link?: string | Location
  linkReplace?: boolean
}
export type IButton = (
  ButtonType & ButtonStyle |
  IconType & ButtonStyle |
  LinkType & ButtonStyle
  ) &
  {
    icon?: string
    iconPosition?: "left"|"right"
    disabled?: boolean
  }