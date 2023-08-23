<script setup lang="ts">
// ---------------------------------------
import {computed, ref} from "vue";
import Button from "@/components/functional/Button.vue";

export interface IButton {
  type?: "button" | "reset" | "submit"
  link?: string | Location
  linkReplace?: boolean
  mode?:  "primary" | "secondary" | "creative" | "destructive" | "outline" | "ghost" | "link" | "text"
  class?: string| Array<string>
  disabled?: boolean
}
// ---------------------------------------
const link = computed<IButton["link"]>(()=> props.link)
const linkReplace = computed<NonNullable<IButton["linkReplace"]>>(()=> props.linkReplace||false)
const disabled = computed<NonNullable<IButton["disabled"]>>(()=> props.disabled||false)
const type = computed<NonNullable<IButton["type"]>>(()=> props.type|| "button")
const mode = computed<NonNullable<IButton["mode"]>>(()=> props.mode|| "primary")
const tag = computed<string>(()=> ['link', 'text'].includes(mode.value) ? 'button' : 'a')
const classButton = computed<Array<string>>(()=> ([props.class||false,
  "inline-flex items-center justify-center",
  typeof props.class === "string" && (props.class as string).includes("rounded") ? props.class : "rounded-md",
  typeof props.class === "string" && (props.class as string).includes("text") ? props.class : "text-sm",
  typeof props.class === "string" && (props.class as string).includes("font") ? props.class : "font-medium",
  typeof props.class === "string" && (props.class as string).includes("h-") ? props.class : "h-9",
  typeof props.class === "string" && ((props.class as string).includes("p-")||(props.class as string).includes("px-")||(props.class as string).includes("py-")) ? props.class : "px-4 py-2",
  "transition-colors duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  !(mode.value === "primary")|| "shadow bg-primary-600 text-neutral-100 hover:bg-primary-600/90 dark:bg-primary-700 dark:text-neutral-900 dark:hover:bg-primary-700/90",
  !(mode.value === "secondary")|| "shadow-sm bg-secondary-200 text-neutral-900 hover:bg-secondary-200/80 dark:bg-secondary-800 dark:text-neutral-100 dark:hover:bg-secondary-800/80",
  !(mode.value === "creative")|| "shadow-sm bg-green-500 text-neutral-100 hover:bg-green-500/90 dark:bg-green-900 dark:text-neutral-100 dark:hover:bg-green-900/90",
  !(mode.value === "destructive")|| "shadow-sm bg-red-500 text-neutral-100 hover:bg-red-500/90 dark:bg-red-900 dark:text-neutral-100 dark:hover:bg-red-900/90",
  !(mode.value === "outline")|| "shadow-sm text-primary-900 dark:text-primary-100 border border-primary-300 dark:border-primary-700 bg-transparent hover:bg-primary-200 dark:hover:bg-primary-900",
  !(mode.value === "ghost")|| "text-neutral-900 dark:text-neutral-100 hover:bg-neutral-200 dark:hover:bg-neutral-800",
  !(mode.value === "link")|| "text-neutral-900 dark:text-neutral-100 relative after:bg-black dark:after:bg-white after:absolute after:h-[1px] after:w-0 after:bottom-0 after:-translate-y-2 after:left-[10%] hover:after:w-[80%] after:transition-all after:duration-300",
  !(mode.value === "text")|| "text-neutral-900 dark:text-neutral-100",
].filter(item=>typeof item === "string") as Array<string>))
// ---------------------------------------
const props = defineProps<IButton>()
// ---------------------------------------
</script>

<template>
  <RouterLink v-if="link" :to="link" :class="classButton" :tag="tag" :replace="linkReplace">
    <slot name="default"/>
  </RouterLink>
  <button v-else :type="type" :class="classButton as any" :disabled="disabled">
    <slot name="default"/>
  </button>
<!--  <div data-radix-popper-content-wrapper=""-->
<!--       style="position: fixed; left: 0px; top: 0px; transform: translate(577.5px, 466px); min-width: max-content; &#45;&#45;radix-popper-transform-origin: 50% 34px; will-change: transform; z-index: 50; &#45;&#45;radix-popper-available-width: 1331px; &#45;&#45;radix-popper-available-height: 500px; &#45;&#45;radix-popper-anchor-width: 73.8203125px; &#45;&#45;radix-popper-anchor-height: 40px;">-->
<!--    -->
<!--    <div data-side="top" data-align="center" data-state="delayed-open" class="z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2" style="&#45;&#45;radix-tooltip-content-transform-origin: var(&#45;&#45;radix-popper-transform-origin); &#45;&#45;radix-tooltip-content-available-width: var(&#45;&#45;radix-popper-available-width); &#45;&#45;radix-tooltip-content-available-height: var(&#45;&#45;radix-popper-available-height); &#45;&#45;radix-tooltip-trigger-width: var(&#45;&#45;radix-popper-anchor-width); &#45;&#45;radix-tooltip-trigger-height: var(&#45;&#45;radix-popper-anchor-height);">-->
<!--      <p>Add to library-->
<!--      </p>-->
<!--      <span id="radix-:r109:" role="tooltip" style="position: absolute; border: 0px; width: 1px; height: 1px; padding: 0px; margin: -1px; overflow: hidden; clip: rect(0px, 0px, 0px, 0px); white-space: nowrap; overflow-wrap: normal;">-->
<!--        <p>Add to library-->
<!--        </p>-->
<!--      </span>-->
<!--    </div>-->
<!--  </div>-->
</template>