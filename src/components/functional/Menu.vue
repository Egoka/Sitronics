<script setup lang="ts">
import {computed, ref, useSlots} from "vue";
import type {Ref, UnwrapRef} from "vue";
import {ChevronRightIcon} from "@heroicons/vue/20/solid";
import { v4 as uuidv4, type v4 as uuid } from 'uuid';
import type {StyleClass, IMode, IWidth, IHeight} from "@/components/BaseTypes";
import Icons from "@/components/functional/Icons.vue";
import FixWindow, {type IFixWindow} from "@/components/functional/FixWindow.vue";
import {getParamsStructure} from "@/helpers/object";
import Separator, {type ISeparator} from "@/components/functional/Separator.vue";
// ---TYPES-------------------------------
type _key = uuid
type Groups = Array<IGroupMenu>|[]
type GroupsPrivate = Array<IGroupMenuPrivate>|[]
// ---INTERFACES--------------------------
export interface IItemMenu {
  title?: string
  icon?: string
  info?: string
  disabled?: boolean
  onActive?(event:MouseEvent, item:IItemMenuPrivate):void
  onInactive?(event:MouseEvent, item:IItemMenuPrivate):void
  onClick?(event:PointerEvent, item:IItemMenuPrivate):void
  class?: StyleClass | "items-center rounded px-2 py-1.5 text-sm"
  menu?: IMenuItem|null
}
export interface IItemMenuPrivate extends IItemMenu{
  _key: _key
}
interface ISlotsItemMenuPrivate extends Omit<IItemMenuPrivate,
  "menu"|"class"|"disabled"|"onClick"|"onActive"|"onInactive">{}
export interface IMenuSeparator extends Omit<ISeparator, "vertical">{
  icon?: string
  isVisible?: boolean
}
export interface IGroupMenu {
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
  width?: IWidth
  height?: IHeight
  animation?: "transition-all duration-500"|"transition-none"|string
  hoverRows?:string|"hover:bg-neutral-100/90 dark:hover:bg-neutral-900/50"|boolean
  border?: {
  
  }
}
export interface IMenuItem {
  title?: string
  separator?: IMenuSeparator
  paramsWindowMenu?: IFixWindow
  groups?: Groups
}
interface IMenuItemPrivate extends Omit<IMenuItem, "groups">{
  groups?: GroupsPrivate
}
// ---------------------------------------
export interface IMenu extends IMenuItem{
  mode?:IMode
  selected?:boolean
  styles?: IMenuStyles
}
// ---PROPS-EMITS-SLOTS-------------------
const props = defineProps<IMenu>()
const emit = defineEmits<{
  (e: "onActive", event: MouseEvent, item: IItemMenuPrivate):void
  (e: "onInactive", event: MouseEvent, item: IItemMenuPrivate):void
  (e: "onClick", event: PointerEvent, item: IItemMenuPrivate):void
}>()
const slots = useSlots()
// ---REF-LINK----------------------------
const menuRefLink = ref<HTMLElement>()
// ---STATE-------------------------------
const selectedItemIndex = ref<_key|null>(null)
const activeItemIndex = ref<_key|null>(null)
const notPublicParamsMenu = ref(["menu", "class", "disabled", "onClick", "onActive", "onInactive"] as Array<keyof IItemMenuPrivate>)
// ---PROPS-------------------------------
const mode = computed<NonNullable<IMenu["mode"]>>(()=> props.mode || "outlined")
const selected = computed<NonNullable<IMenu["selected"]>>(()=> props.selected)
const title = computed<NonNullable<IMenu["title"]>>(()=>props.title ?? "")
const iconSeparator = computed<IMenuSeparator["icon"]>(()=>props.separator?.icon)
const isSeparator = computed<NonNullable<IMenuSeparator["isVisible"]>>(()=>props.separator?.isVisible ?? true)
const listGroups = computed<GroupsPrivate>(()=> setItems(props as IMenuItemPrivate)?.groups ?? [])
const paramsWindowMenu = computed<IMenu["paramsWindowMenu"]>(()=>
  ({
    delay: 2,
    position: "right-top",
    eventOpen:"none",
    eventClose: "hover",
    ...props?.paramsWindowMenu
  }))
const separator = computed<IMenuSeparator>(()=>({
  styles: { class: { body: "!px-0 !-mx-1"}},
  ...props.separator
}))
// ---STYLE-------------------------------
const modeStyle = computed<string>(()=>
  ((mode.value === "filled") ? "bg-stone-100 dark:bg-stone-900 rounded-md" :
    (mode.value === "outlined") ? "bg-white dark:bg-neutral-950 rounded-md" :
      (mode.value === "underlined") ? "bg-stone-50 dark:bg-stone-950" : ""))
// ---EXPOSE------------------------------
export interface IMenuExpose {
  // ---STATE-------------------------
  activeItemIndex: Readonly<Ref<UnwrapRef<_key|null>>>
  // ---PROPS-------------------------
  mode: Readonly<Ref<UnwrapRef<IMenu["mode"]>>>
  title: Readonly<Ref<UnwrapRef<IMenu["title"]>>>
  iconSeparator: Readonly<Ref<UnwrapRef<IMenu["iconSeparator"]>>>
  isSeparator: Readonly<Ref<UnwrapRef<IMenu["isSeparator"]>>>
  listGroups: Readonly<Ref<UnwrapRef<GroupsPrivate>>>
  // ---METHODS-----------------------
  setActiveItem (itemKey:_key|null):void
}
defineExpose<IMenuExpose>({
  // ---STATE-------------------------
  activeItemIndex,
  // ---PROPS-------------------------
  mode, title, iconSeparator, isSeparator, listGroups,
  // ---METHODS-----------------------
  setActiveItem
})
// ---MOUNT-UNMOUNT-----------------------
// ---WATCHERS----------------------------
// ---METHODS-----------------------------
function overItem (event:MouseEvent, item:IItemMenuPrivate) {
  setActiveItem(item?._key??null)
  emit("onActive", event, item)
  if (item?.onActive)
    item?.onActive(event, getParamsStructure(item, (["onClick", "onActive", "onInactive"] as Array<keyof IItemMenuPrivate>)) as IItemMenuPrivate)
}
function leaveItem (event:MouseEvent, item:IItemMenuPrivate) {
  setActiveItem(null)
  emit("onInactive", event, item)
  if (item?.onInactive)
    item?.onInactive(event, getParamsStructure(item, (["onClick", "onActive", "onInactive"] as Array<keyof IItemMenuPrivate>)) as IItemMenuPrivate)
}
function clickItem (event:PointerEvent, item:IItemMenuPrivate) {
  if (selected.value)
    setSelectedItem(item?._key??null)
  emit("onClick", event, item)
  if (item?.onClick)
    item?.onClick(event, getParamsStructure(item, (["onClick", "onActive", "onInactive"] as Array<keyof IItemMenuPrivate>)) as IItemMenuPrivate)
}
function setSelectedItem (itemKey:_key|null):void {
  if (itemKey || itemKey === null) {
    selectedItemIndex.value = itemKey
  }
}
function setActiveItem (itemKey:_key|null):void {
  if (itemKey || itemKey === null) {
    activeItemIndex.value = itemKey
  }
}
function setItems (menu:IMenuItemPrivate):NonNullable<IMenuItemPrivate> {
  return {
    ...menu,
    groups: menu.groups
      ? menu.groups?.map((group): IGroupMenuPrivate => ({
        ...group,
        separator: {
          icon: group.separator?.icon ?? iconSeparator.value,
          isVisible: group.separator?.isVisible ?? isSeparator.value,
          styles: { class: { body: "!px-0 !-mx-1"}},
          ...separator.value,
          ...group.separator
        },
        items: group.items?.map((item): IItemMenuPrivate => {
          return {
            ...item,
            _key: uuidv4(),
            class: item.class ?? "items-center rounded px-2 py-1.5 text-sm",
            menu: item?.menu ? setItems({
              paramsWindowMenu: {...paramsWindowMenu.value, translatePx: -10},
              ...item?.menu
            } as IMenuItemPrivate) : null
          }
        })
      })) : []
  }
}
</script>

<template>
  <div
    ref="menuRefLink"
    role="menu"
    class="p-1 z-50 min-w-[8rem] w-60 overflow-auto border border-neutral-200 dark:text-zinc-50 dark:border-neutral-800 shadow-md"
    :class="modeStyle"
    tabindex="-1">
<!--    :style="`width:${styles.width};height:${styles.height};`"-->
    <template v-if="title.length">
      <slot name="title" :title="title">
        <div class="px-2 py-1.5 text-sm font-semibold">{{ title }}</div>
      </slot>
    </template>
    <template v-for="(group, keyGroup) in listGroups" :key="keyGroup">
      <Separator
        v-if="(group?.separator?.isVisible ?? isSeparator) && listGroups.length !== 1"
        v-bind="group?.separator ?? separator"
      >
        <Icons
          v-if="group?.separator?.icon?.length ?? iconSeparator?.length"
          :type="group.separator?.icon ?? iconSeparator ?? ''"
          class="h-4 w-4 opacity-60"/>
      </Separator>
      <div role="group">
        <div
          v-for="(item, keyItem) in group.items" :key="keyItem" role="menuitem"
          :data-collection-item="item?._key"
          :aria-disabled="item?.disabled ?? false"
          :data-disabled="item?.disabled ?? false"
          :data-selected="selectedItemIndex === item?._key"
          :data-active="activeItemIndex === item?._key"
          :tabindex="activeItemIndex === item?._key ? 0 : -1"
          @mouseover="(event)=>overItem(event, item)"
          @mouseleave="(event)=>leaveItem(event, item)"
          @click="(event)=>clickItem(event, item)"
          class="relative flex mt-0.5 cursor-default select-none outline-none transition-colors"
          :class="[
            item.class,
            'data-[selected=true]:bg-primary-100 dark:data-[selected=true]:bg-primary-900 data-[selected=true]:font-semibold',
            'data-[active=true]:bg-neutral-300/50 dark:data-[active=true]:bg-neutral-700/50',
            'data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50']">
          <slot name="item" :data="getParamsStructure(item, notPublicParamsMenu) as ISlotsItemMenuPrivate">
            <Icons v-if="item?.icon" :type="item?.icon??''" class="mr-2 h-4 w-4 opacity-60"/>
            <div v-else class="mr-2 h-4 w-4"/>
            <span>{{ item?.title }}</span>
            <span class="ml-auto pl-2 text-xs tracking-widest opacity-50">{{ item?.info }}</span>
          </slot>
          <ChevronRightIcon v-if="item?.menu" class="ml-auto h-4 w-4 opacity-60"/>
          <FixWindow
            v-if="!!item?.menu"
            :model-value="activeItemIndex === item?._key"
            v-bind="paramsWindowMenu">
            <Menu
              v-bind="item?.menu"
              :mode="mode"
              :selected="selected"
              class="font-normal"
              @on-active="(event, itemChild)=>emit('onActive', event, itemChild)"
              @on-inactive="(event, itemChild)=>emit('onInactive', event, itemChild)"
              @on-click="(event, itemChild)=>emit('onClick', event, itemChild)"
            />
          </FixWindow>
        </div>
      </div>
    </template>
    <template v-if="slots?.footer">
      <Separator v-bind="separator" :styles="{class:{body:'!px-0 !-mx-1'}}"/>
      <slot name="footer"></slot>
    </template>
  </div>
</template>