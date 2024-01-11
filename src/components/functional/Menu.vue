<script setup lang="ts">
import {computed, ref, useSlots} from "vue";
import {ChevronRightIcon} from "@heroicons/vue/20/solid";
import { v4 as uuidv4 } from 'uuid';
import type {_key} from "@/components/BaseTypes";
import Icons from "@/components/functional/Icons.vue";
import FixWindow from "@/components/functional/FixWindow.vue";
import Separator from "@/components/functional/Separator.vue";
import {removeParamsFromStructure} from "@/helpers/object";
import {cn} from "@/helpers/tailwind";
import type {
  IMenu,
  IItemMenuPrivate,
  IMenuSeparator,
  GroupsPrivate,
  IMenuItemPrivate,
  IMenuStyles,
  IGroupMenuPrivate, IMenuExpose
} from "@/components/functional/Menu";
import type {IFixWindow} from "@/components/functional/FixWindow";
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
const horizontal = computed<NonNullable<IMenu["horizontal"]>>(()=> props.horizontal)
const onlyIcons = computed<NonNullable<IMenu["onlyIcons"]>>(()=> props.onlyIcons)
const title = computed<NonNullable<IMenu["title"]>>(()=>props.title ?? "")
const iconSeparator = computed<IMenuSeparator["icon"]>(()=>props.separator?.icon)
const isSeparator = computed<NonNullable<IMenuSeparator["isVisible"]>>(()=>props.separator?.isVisible ?? true)
const listGroups = computed<GroupsPrivate>(()=> setItems(props as IMenuItemPrivate)?.groups ?? [])
const paramsWindowMenu = computed<IMenu["paramsWindowMenu"]>(()=> ({
    delay: 2,
    position: "right-top",
    eventOpen: onlyIcons.value ? "click" : "hover",
    eventClose: "hover",
    ...props?.paramsWindowMenu
  }))
const separator = computed<IMenuSeparator>(()=>({
  styles: { body: horizontal.value ? "my-1" : "-mx-1"},
  ...props.separator
}))
// ---STYLE-------------------------------
const styles = computed<IMenuStyles>(()=>{
  const s = props.styles
  return {
    class: {
    
    },
    width: s?.width? typeof s?.width === "number" ? `${s?.width}px` : s?.width : "",
    height: s?.height? typeof s?.height === "number" ? `${s?.height}px` : s?.height : "",
    animation: s?.animation ?? "transition-all duration-500",
    hoverRows: s?.animation ?? "hover:bg-neutral-100/90 dark:hover:bg-neutral-900/50"
  }
})
const modeStyle = computed<string>(()=>
  ((mode.value === "filled") ? "bg-stone-100 dark:bg-stone-900 rounded-md" :
    (mode.value === "outlined") ? "bg-white dark:bg-neutral-950 rounded-md" :
      (mode.value === "underlined") ? "bg-stone-50 dark:bg-stone-950" : ""))
const borderColor = computed<string>(()=>"border-neutral-200 dark:border-neutral-800")
// ---EXPOSE------------------------------
defineExpose<IMenuExpose>({
  // ---STATE-------------------------
  activeItemIndex,
  // ---PROPS-------------------------
  mode, title, iconSeparator, isSeparator, listGroups,
  selected, horizontal, onlyIcons, paramsWindowMenu, separator, styles,
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
    item?.onActive(event, removeParamsFromStructure(item, (["onClick", "onActive", "onInactive"])) as IItemMenuPrivate)
}
function leaveItem (event:MouseEvent, item:IItemMenuPrivate) {
  setActiveItem(null)
  emit("onInactive", event, item)
  if (item?.onInactive)
    item?.onInactive(event, removeParamsFromStructure(item, (["onClick", "onActive", "onInactive"])) as IItemMenuPrivate)
}
function clickItem (event:PointerEvent, item:IItemMenuPrivate) {
  if (selected.value)
    setSelectedItem(item?._key??null)
  emit("onClick", event, item)
  if (item?.onClick)
    item?.onClick(event, removeParamsFromStructure(item, (["onClick", "onActive", "onInactive"])) as IItemMenuPrivate)
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
function setItems (menu:IMenuItemPrivate, depth:number=0):NonNullable<IMenuItemPrivate> {
  return {
    ...menu,
    groups: menu.groups
      ? menu.groups?.map((group): IGroupMenuPrivate => ({
        ...group,
        separator: {
          icon: group.separator?.icon ?? iconSeparator.value,
          isVisible: group.separator?.isVisible ?? isSeparator.value,
          styles: { body: horizontal.value ? "-my-1" : '-mx-1'},
          ...separator.value,
          ...group.separator
        },
        items: group.items?.map((item): IItemMenuPrivate => {
          return {
            ...item,
            _key: uuidv4(),
            menu: item?.menu ? setItems({
              paramsWindowMenu: {
                ...paramsWindowMenu.value,
                position: depth ? "right-top" : (horizontal.value ? "bottom-left" : "right-top"),
                ...item?.menu?.paramsWindowMenu,
              } as IFixWindow,
              ...item?.menu
            } as IMenuItemPrivate, depth > 0 ? depth + 1 : 1) : null
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
    :class="cn(
      'p-1 w-min max-w-4xl shadow-md border text-black dark:text-zinc-300',
      borderColor,
      !horizontal||'flex flex-row',
      modeStyle,
      'overflow-auto'
      )"
    :style="`width:${styles.width};height:${styles.height};`"
    tabindex="0">
    <div v-if="title.length || slots?.title" :class="cn('min-w-max px-2 py-1.5 text-sm font-semibold', modeStyle)">
      <slot name="title" :title="title">
        <div>{{ title }}</div>
      </slot>
    </div>
    <template v-for="(group, keyGroup) in listGroups" :key="keyGroup">
      <Separator
        v-if="
          (group?.separator?.isVisible ?? isSeparator) &&
          (listGroups.length !== 1) &&
          (keyGroup !== 0 || (group?.separator?.icon?.length ?? iconSeparator?.length) || title.length)"
        v-bind="group?.separator ?? separator"
        class="my-1"
        :vertical="horizontal">
        <Icons
          v-if="group?.separator?.icon?.length ?? iconSeparator?.length"
          :type="group.separator?.icon ?? iconSeparator ?? ''"
          class="h-4 w-4 text-neutral-200 dark:text-neutral-800"/>
      </Separator>
      <div role="group" :class="cn(!horizontal||'flex flex-row')">
        <div v-if="!onlyIcons && group.title" class="mt-2 ml-8 leading-4 text-neutral-400 dark:text-neutral-500 uppercase text-[10px] font-bold">
          {{ group.title }}
        </div>
        <div
          v-for="(item, keyItem) in group.items" :key="keyItem" role="menuitem"
          :data-collection-item="item?._key"
          :aria-disabled="item?.disabled ?? false"
          :tabindex="activeItemIndex === item?._key ? 0 : -1"
          @mouseover="(event)=>overItem(event, item)"
          @mouseleave="(event)=>leaveItem(event, item)"
          @click="(event)=>clickItem(event, item)"
          :class="cn(
            'items-center rounded mt-0.5 px-2 py-1.5 text-sm',
            item.class, !horizontal||'mr-0.5 last:mr-0',
            (activeItemIndex === item?._key) && 'bg-neutral-300/50 dark:bg-neutral-700/50',
            (selectedItemIndex === item?._key) && 'bg-neutral-300 dark:bg-neutral-700 font-semibold',
            item?.disabled && 'pointer-events-none opacity-50',
            'relative flex cursor-default select-none outline-none transition-colors'
            )">
          <slot name="item" :data="removeParamsFromStructure(item, notPublicParamsMenu)">
            <Icons v-if="item?.icon" :type="item.icon as string" class="h-5 w-4 opacity-60"/>
            <div v-else class="flex justify-center items-center h-5 w-4 opacity-60 text-sm font-extralight">{{ item?.title[0] }}</div>
            <template v-if="!onlyIcons">
                <span :class="cn('w-max', !item?.title||'mx-2')">{{ item?.title }}</span>
                <span :class="cn('ml-auto text-xs tracking-widest opacity-50', !item?.info||'pl-2')" v-html="item?.info"/>
            </template>
            <FixWindow v-else :position="horizontal ? 'top' : 'right'" :delay="5" :margin-px="10" :scrollable-el="menuRefLink" :mode="mode">
                <span class="w-max">{{ item?.title }}</span>
                <span :class="cn('ml-auto text-xs tracking-widest opacity-50', !item?.info||'pl-2')" v-html="item?.info"/>
            </FixWindow>
          </slot>
          <ChevronRightIcon v-if="item?.menu && !onlyIcons" class="h-4 w-4 opacity-60"/>
          <FixWindow
            v-if="!!item?.menu"
            v-bind="item?.menu?.paramsWindowMenu ?? paramsWindowMenu"
            :scrollable-el="menuRefLink"
            class="z-10">
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
      <Separator v-bind="separator" :styles="{body:'!px-0 !-mx-1'}"/>
      <slot name="footer"></slot>
    </template>
  </div>
</template>