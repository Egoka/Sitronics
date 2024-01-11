import type {_key, THeight, IMode, TWidth, StyleClass} from "@/components/BaseTypes";
import type {IFixWindow} from "@/components/functional/FixWindow";
import type {ISeparator} from "@/components/functional/Separator.vue";
import type {Ref, UnwrapRef} from "vue";

export type IGroups = Array<IGroupMenu>|[]
export type GroupsPrivate = Array<IGroupMenuPrivate>|[]
// ---INTERFACES--------------------------
export interface IItemMenu {
  title?: string
  icon?: string
  info?: string
  disabled?: boolean
  onActive?(event:MouseEvent, item:IItemMenuPrivate):void
  onInactive?(event:MouseEvent, item:IItemMenuPrivate):void
  onClick?(event:PointerEvent, item:IItemMenuPrivate):void
  class?: StyleClass
  menu?: IMenuItem|null
}
export interface IItemMenuPrivate extends IItemMenu{
  _key: _key
}
export interface IMenuSeparator extends Omit<ISeparator, "vertical">{
  icon?: string
  isVisible?: boolean
}
export interface IGroupMenu {
  title?: string
  items?: Array<IItemMenu>
  class?: StyleClass
  separator?: IMenuSeparator
}
interface IGroupMenuPrivate extends Omit<IGroupMenu, "items"> {
  items?: Array<IItemMenuPrivate>
}
export interface IMenuStyles {
  class?: {

  }
  width?: TWidth
  height?: THeight
  animation?: "transition-all duration-500"|"transition-none"|string
  hoverRows?:string|"hover:bg-neutral-100/90 dark:hover:bg-neutral-900/50"|boolean
  border?: {

  }
}
export interface IMenuItem {
  title?: string
  separator?: IMenuSeparator
  paramsWindowMenu?: IFixWindow
  groups?: IGroups
}
interface IMenuItemPrivate extends Omit<IMenuItem, "groups">{
  groups?: GroupsPrivate
}
// ---------------------------------------
export interface IMenu extends IMenuItem{
  mode?:IMode
  selected?:boolean
  horizontal?: boolean
  onlyIcons?: boolean
  styles?: IMenuStyles
}
export interface IMenuExpose {
  // ---STATE-------------------------
  activeItemIndex: Readonly<Ref<UnwrapRef<_key|null>>>
  // ---PROPS-------------------------
  mode: Readonly<Ref<UnwrapRef<IMenu["mode"]>>>
  title: Readonly<Ref<UnwrapRef<IMenu["title"]>>>
  iconSeparator: Readonly<Ref<UnwrapRef<IMenuSeparator["iconSeparator"]>>>
  isSeparator: Readonly<Ref<UnwrapRef<IMenuSeparator["isSeparator"]>>>
  listGroups: Readonly<Ref<UnwrapRef<GroupsPrivate>>>
  selected: Readonly<Ref<UnwrapRef<IMenu["selected"]>>>
  horizontal: Readonly<Ref<UnwrapRef<IMenu["horizontal"]>>>
  onlyIcons: Readonly<Ref<UnwrapRef<IMenu["onlyIcons"]>>>
  paramsWindowMenu: Readonly<Ref<UnwrapRef<IMenu["paramsWindowMenu"]>>>
  separator: Readonly<Ref<UnwrapRef<IMenuSeparator>>>
  styles: Readonly<Ref<UnwrapRef<IMenuStyles>>>
  // ---METHODS-----------------------
  setActiveItem (itemKey:_key|null):void
}