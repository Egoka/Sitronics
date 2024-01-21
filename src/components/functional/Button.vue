<script setup lang="ts">
import {computed} from "vue";
import { cva } from "class-variance-authority";
import {cn, getRegExpClass} from "@/helpers/tailwind";
import {removeParamsFromStructure} from "@/helpers/object";
import Icons from "@/components/functional/Icons.vue";
import Loading from "@/components/functional/Loading.vue";
import type {
  ButtonStyleVariants,
  ButtonStyle,
  IButton,
  ButtonType,
  IconType,
  LinkType,
} from "@/components/functional/Button";
// ---------------------------------------
const props = defineProps<IButton>()
// ---------------------------------------
const buttonVariants = cva<ButtonStyleVariants>(
  [
    "inline-flex",
    "gap-2",
    "m-1",
    "h-min",
    "rounded",
    "items-center",
    "justify-center",
    "leading-none",
    "focus-visible:ring-1",
    "transition-all",
    "duration-500",
    "disabled:opacity-50",
    "disabled:cursor-not-allowed",
    "data-[loading=true]:cursor-wait",
    "transition-all",
    "duration-200"
  ],
  {
    variants: {
      mode: {
        primary: [],
        outline: ["border", "disabled:hover:bg-transparent"],
        ghost: ["disabled:bg-transparent", "disabled:hover:bg-transparent",],
      },
      rounded: {
        none: "rounded-none",
        lg: "rounded-lg",
        md: "rounded-md",
        full: "rounded-full"
      },
      size: {
        xs: ["text-sm", "py-1", "px-3"],
        sm: ["text-sm", "py-1.5", "px-4"],
        md: ["text-sm", "py-2", "px-4"],
        lg: ["text-md", "py-2.5", "px-5"],
        xl: ["text-md", "py-3", "px-6"],
      },
      color: {
        theme: [],
        neutral: [],
        creative: [],
        destructive: []
      },
      type: { button: ["focus:outline-none"], reset: ["focus:outline-none"], submit: ["focus:outline-none"], icon: ["focus:outline-none"],
        link: ["relative after:absolute after:h-[2px] after:w-0 after:bottom-0 after:-translate-y-1 after:transition-all after:duration-300 focus-visible:ring-transparent"]
      },
    },
    compoundVariants: [
      { type: ["button", "reset", "submit", "icon"], mode: ["primary"], color: "theme",
        class: ["text-theme-200", "dark:text-theme-300", "hover:text-theme-100", "dark:hover:text-theme-200", "disabled:hover:text-theme-200", "disabled:dark:hover:text-theme-300",
          "bg-theme-500", "hover:bg-theme-400", "dark:bg-theme-700", "dark:hover:bg-theme-800", "disabled:hover:bg-theme-500", "disabled:dark:hover:bg-theme-700", "active:bg-theme-600", "active:dark:bg-theme-700", "focus-visible:bg-theme-600", "focus-visible:dark:bg-theme-600", "ring-theme-300", "dark:ring-theme-700"]},
      { type: ["button", "reset", "submit", "icon"], mode: ["primary"], color: "neutral",
        class: ["text-neutral-800", "dark:text-neutral-300", "hover:text-neutral-900", "dark:hover:text-neutral-200", "disabled:hover:text-neutral-800", "disabled:dark:hover:text-neutral-300",
          "bg-neutral-200", "hover:bg-neutral-200/80", "dark:bg-neutral-800", "dark:hover:bg-neutral-900", "disabled:hover:bg-neutral-200", "disabled:dark:hover:bg-neutral-800", "active:bg-neutral-300", "active:dark:bg-neutral-700", "focus-visible:bg-neutral-300", "focus-visible:dark:bg-neutral-700", "ring-neutral-300", "dark:ring-neutral-700"]},
      { type: ["button", "reset", "submit", "icon"], mode: ["primary"], color: "creative",
        class: ["text-green-100", "dark:text-green-300", "hover:text-green-100", "dark:hover:text-green-200", "disabled:hover:text-green-200", "disabled:dark:hover:text-green-300",
          "bg-green-500", "hover:bg-green-400", "dark:bg-green-800", "dark:hover:bg-green-900", "disabled:hover:bg-green-500", "disabled:dark:hover:bg-green-800", "active:bg-green-700", "active:dark:bg-green-700", "focus-visible:bg-green-600", "focus-visible:dark:bg-green-600", "ring-green-300", "dark:ring-green-700"]},
      { type: ["button", "reset", "submit", "icon"], mode: ["primary"], color: "destructive",
        class: ["text-red-100", "dark:text-red-300", "hover:text-red-100", "dark:hover:text-red-200", "disabled:hover:text-red-200", "disabled:dark:hover:text-red-300",
          "bg-red-500", "hover:bg-red-400", "dark:bg-red-800", "dark:hover:bg-red-900", "disabled:hover:bg-red-500", "disabled:dark:hover:bg-red-800", "active:bg-red-700", "active:dark:bg-red-700", "focus-visible:bg-red-600", "focus-visible:dark:bg-red-600", "ring-red-300", "dark:ring-red-700"]},
      { type: ["button", "reset", "submit", "icon"], mode: ["outline", "ghost"], color: "theme", class: ["text-theme-600", "dark:text-theme-400", "hover:text-theme-700", "dark:hover:text-theme-500", "disabled:hover:text-theme-800", "disabled:dark:hover:text-theme-300", "hover:bg-theme-200", "dark:hover:bg-theme-900", "ring-theme-300", "dark:ring-theme-800", "active:bg-theme-200", "dark:active:bg-theme-800"]},
      { type: ["button", "reset", "submit", "icon"], mode: ["outline", "ghost"], color: "neutral", class: ["text-neutral-600", "dark:text-neutral-400", "hover:text-neutral-700", "dark:hover:text-neutral-500", "disabled:hover:text-neutral-800", "disabled:dark:hover:text-neutral-300", "hover:bg-neutral-200", "dark:hover:bg-neutral-900", "ring-neutral-300", "dark:ring-neutral-800", "active:bg-neutral-200", "dark:active:bg-neutral-800"]},
      { type: ["button", "reset", "submit", "icon"], mode: ["outline", "ghost"], color: "creative", class: ["text-green-600", "dark:text-green-400", "hover:text-green-700", "dark:hover:text-green-500", "disabled:hover:text-green-800", "disabled:dark:hover:text-green-300", "hover:bg-green-100", "dark:hover:bg-green-900", "ring-green-300", "dark:ring-green-800", "active:bg-green-200", "dark:active:bg-green-800"]},
      { type: ["button", "reset", "submit", "icon"], mode: ["outline", "ghost"], color: "destructive", class: ["text-red-600", "dark:text-red-400", "hover:text-red-700", "dark:hover:text-red-500", "disabled:hover:text-red-800", "disabled:dark:hover:text-red-300", "hover:bg-red-100", "dark:hover:bg-red-900", "ring-red-300", "dark:ring-red-800", "active:bg-red-200", "dark:active:bg-red-800"]},
      { type: ["button", "reset", "submit", "icon"], mode: ["outline"], color: "theme", class: ["border-theme-600", "dark:border-theme-700"]},
      { type: ["button", "reset", "submit", "icon"], mode: ["outline"], color: "neutral", class: ["border-neutral-600", "dark:border-neutral-700"]},
      { type: ["button", "reset", "submit", "icon"], mode: ["outline"], color: "creative", class: ["border-green-600", "dark:border-green-700"]},
      { type: ["button", "reset", "submit", "icon"], mode: ["outline"], color: "destructive", class: ["border-red-600", "dark:border-red-700"]},
      { type: "link", color: "theme", class: ["after:bg-theme-400", "dark:after:bg-theme-700", "text-theme-600", "dark:text-theme-400", "hover:text-theme-700", "dark:hover:text-theme-500", "disabled:hover:text-theme-800", "disabled:dark:hover:text-theme-300"] },
      { type: "link", color: "neutral", class: ["after:bg-neutral-400", "dark:after:bg-neutral-700", "text-neutral-600", "dark:text-neutral-400", "hover:text-neutral-700", "dark:hover:text-neutral-500", "disabled:hover:text-neutral-800", "disabled:dark:hover:text-neutral-300"] },
      { type: "link", color: "creative", class: ["after:bg-green-400", "dark:after:bg-green-700", "text-green-600", "dark:text-green-400", "hover:text-green-700", "dark:hover:text-green-500", "disabled:hover:text-green-800", "disabled:dark:hover:text-green-300"] },
      { type: "link", color: "destructive", class: ["after:bg-red-400", "dark:after:bg-red-700", "text-red-600", "dark:text-red-400", "hover:text-red-700", "dark:hover:text-red-500", "disabled:hover:text-red-800", "disabled:dark:hover:text-red-300"] },
      { type: "link", mode: "primary", class: "after:left-[10%] hover:after:w-[80%]" },
      { type: "link", mode: "outline", class: "border-0 after:w-[80%] after:h-[0px] hover:after:h-[2px]" },
      { type: "link", mode: "ghost", class: "border-0 hover:after:w-[80%]" },
      { type: "icon", size: "xs", class: "p-0 h-7 w-7"},
      { type: "icon", size: "sm", class: "p-0 h-8 w-8" },
      { type: "icon", size: "md", class: "p-0 h-9 w-9" },
      { type: "icon", size: "lg", class: "p-0 h-11 w-11" },
      { type: "icon", size: "xl", class: "p-0 h-12 w-12" },
    ],
    defaultVariants: {
      mode: "primary",
      color: "neutral",
      size: "md",
      type: "button",
      rounded: "md",
    },
  }
);
// ---TYPE--------------------------------
const type = computed<IButton["type"]>(()=> props.type ? props.type : (props as LinkType).link ? "link" : "button")
// ---LINK--------------------------------
const link = computed<LinkType["link"]|null>(()=> type.value === "link" ? (props as LinkType).link ?? "" : null)
const linkReplace = computed<LinkType["linkReplace"]|null>(()=> type.value === "link" ? (props as LinkType).linkReplace : null)
// ---BUTTON------------------------------
const icon = computed<IButton["icon"]|null>(()=> props.icon ?? "")
const iconPosition = computed<IButton["iconPosition"]|null>(()=> props.iconPosition ?? "right")
const loading = computed<ButtonType["loading"]|null>(()=> (props as ButtonType).loading || null)
// ---------------------------------------
const classButton = computed<IButton["class"]>(()=> {
  type TypeLocal = ButtonStyle & IButton
  switch (type.value) {
    case "icon": return cn(buttonVariants({...removeParamsFromStructure<IconType & TypeLocal>(props as IconType, ["disabled", "icon"])}), props.class)
    case "link": return cn(buttonVariants({...removeParamsFromStructure<LinkType & TypeLocal>(props as LinkType, ["disabled", "link"])}), props.class)
    default: return cn(buttonVariants({...removeParamsFromStructure<ButtonType & TypeLocal>(props as ButtonType, ["disabled", "icon", "iconPosition", "loading"])}), props.class)
  }
})
const iconText = computed(()=> cn(getRegExpClass("text-", classButton.value)))
const iconSize = computed(()=>{
  if (!(type.value === "button"||type.value === "icon")){ return ""}
  const sizes = { xs: "h-3.5 w-3.5", sm:"h-4 w-4", md:"h-4 w-4", lg:"h-5 w-5", xl:"h-6 w-6" }
  return (props.size && Object.keys(sizes).includes(props.size)) ? sizes[props.size]: "h-4 w-4"
})
</script>

<template>
  <RouterLink v-if="type === 'link'" :to="link" :class="classButton" :replace="linkReplace">
    <Icons v-if="icon && iconPosition === 'left'" :type="icon" :class="cn(iconText, '-ml-1', iconSize)"/>
    <slot name="default"/>
    <Icons v-if="icon && iconPosition === 'right'" :type="icon" :class="cn(iconText, '-mr-1', iconSize)"/>
  </RouterLink>
  <button v-else-if="type === 'icon'" :type="type" :class="classButton" :data-loading="loading" :disabled="disabled">
    <Icons v-if="icon" :type="icon" :class="cn(iconText, {'blur-[2px]': loading}, iconSize)"/>
    <Loading v-if="loading" type="simple" :size="25" :class="cn('absolute', iconText)"/>
  </button>
  <button v-else :type="type" :class="classButton" :data-loading="loading" :disabled="disabled">
    <Icons v-if="icon && iconPosition === 'left'" :type="icon" :class="cn(iconText, '-ml-1', iconSize)"/>
    <slot name="default"/>
    <Icons v-if="icon && iconPosition === 'right'" :type="icon" :class="cn(iconText, '-mr-1', iconSize)"/>
    <Loading v-if="loading" type="simple" :class="cn('-mr-2', iconText)"/>
  </button>
</template>