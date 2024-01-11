// ---------------------------------------
import type {PositionShort, Size} from "@/components/BaseTypes";

export interface IDialog {
  modelValue: boolean
  class?: string
  size?: Size
  position?: PositionShort
  notAnimate?: boolean
  closeButton?: boolean
  withoutMargin?: boolean
  notCloseBackground?: boolean
  toTeleport?: string
}