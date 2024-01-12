// ---------------------------------------
import type {IMode, Position, RefLink, StyleClass} from "@/components/BaseTypes";
import type {Ref, UnwrapRef} from "vue";

export type EventFixWindow = "hover"|"click"|"mousedown"|"mouseup"|"dblclick"|"contextmenu"|"none"
export type IFixWindow = {
  modelValue?: boolean
  el?: RefLink
  scrollableEl?: RefLink
  position?: Position
  class?: StyleClass
  classBody?: StyleClass
  mode?: IMode
  eventOpen?: EventFixWindow
  eventClose?: EventFixWindow
  delay?: number|1|5|10|15|20
  marginPx?: number|2|5|10
  translatePx?: number|2|5|10
  paddingWindow?: number|2|5|10
  byCursor?: boolean
  closeButton?: boolean
}
export interface IFixWindowExpose {
  // ---STATE-------------------------
  x: Readonly<Ref<UnwrapRef<number>>>
  y: Readonly<Ref<UnwrapRef<number>>>
  isOpen: Readonly<Ref<UnwrapRef<boolean>>>
  // ---PROPS-------------------------
  position: Readonly<Ref<UnwrapRef<IFixWindow["position"]>>>
  delay: Readonly<Ref<UnwrapRef<IFixWindow["delay"]>>>
  marginPx: Readonly<Ref<UnwrapRef<IFixWindow["marginPx"]>>>
  isCloseButton: Readonly<Ref<UnwrapRef<IFixWindow["closeButton"]>>>
  eventOpen: Readonly<Ref<UnwrapRef<EventFixWindow>>>
  eventClose: Readonly<Ref<UnwrapRef<EventFixWindow>>>
  element: Readonly<Ref<UnwrapRef<HTMLElement>>>
  // ---METHODS-----------------------
  open():void
  close():void
  updatePosition():void
}