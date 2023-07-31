<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import type {IMode} from "@/components/form/StForm.vue";
import Label, {type ILabelMode} from "@/components/functional/Label.vue";
import {getLabelType} from "@/helpers/label";
import Dropdown from "@/components/functional/Dropdown.vue";
import {
  ExclamationCircleIcon,
  QuestionMarkCircleIcon,
  XCircleIcon
} from "@heroicons/vue/20/solid";
// ---------------------------------------
export interface ILayout {
  value: any
  mode?: IMode
  label?: string
  labelMode?: ILabelMode
  invalid?: boolean
  messageInvalid?: string
  required?: boolean
  disabled?:boolean
  help?: string
  clear?: boolean
  classBody?: string|Array<string|null>
  class?: string|Array<string|null>
}
// ---------------------------------------
const props = defineProps<ILayout>()
// ---------------------------------------
const value = computed<ILayout["value"]>(()=> props.value || null)
const mode = computed<ILayout["mode"]>(()=> props.mode || "outlined")
const label = computed<ILayout["label"]>(()=> String(props.label || ""))
const labelMode = computed<ILabelMode>(()=> props.labelMode || "offsetDynamic")
const labelType = computed<ILabelMode>(()=> getLabelType(value.value, label.value, labelMode.value))
const isRequired = computed<ILayout["required"]>(()=>props.required)
const isDisabled = computed<ILayout["disabled"]>(()=>props.disabled || false)
const isInvalid = computed<ILayout["invalid"]>(()=>!isDisabled.value ? props.invalid : false)
const messageInvalid = computed<ILayout["messageInvalid"]>(()=> props.messageInvalid || "")

// ---------------------------------------
const input = ref<HTMLElement|undefined>()
const inputBody = ref<HTMLElement|undefined>()
const beforeInput = ref<HTMLElement|undefined>()
const afterInput = ref<HTMLElement|undefined>()
// ---------------------------------------
const emit = defineEmits(["clear"]);
// ---------------------------------------
const beforeWidth = ref<number|null>(null)
const afterWidth = ref<number|null>(null)
const headerHeight = ref(0)
// ---------------------------------------
onMounted(()=>{
  new ResizeObserver(entries => {
    for (let entry of entries) {
      beforeWidth.value = (entry as any).target['offsetWidth']
    }
  }).observe((beforeInput.value as HTMLElement));
  new ResizeObserver(entries => {
    for (let entry of entries) {
      afterWidth.value = (entry as any)?.target['offsetWidth']
      afterWidth.value = afterWidth.value && afterWidth.value > 10 ? afterWidth.value : 10
    }
  }).observe((afterInput.value as HTMLElement));
  headerHeight.value = <number>document.querySelector("header")?.offsetHeight
})
</script>

<template>
  <div ref="inputBody" :class="['relative', props.classBody||'mb-6 rounded-md']">
    <div ref="beforeInput" class="absolute inset-y-0 left-0 flex items-center pl-3 pr-1">
      <slot name="before"/>
    </div>
    <div ref="input" class="block peer w-full min-h-[38px] max-h-20 overflow-auto rounded-md py-1.5 pt-2 text-gray-900 dark:text-gray-100 ring-0 ring-inset ring-gray-300 transition-all sm:text-sm sm:leading-6"
         :class="[!isInvalid||'is-invalid ring-2 ring-red-500 scroll-mt-10',
         !isDisabled||'bg-slate-50 dark:bg-slate-950 text-slate-500 border-slate-200 dark:border-slate-800 border-dashed shadow-none',
      !(mode === 'outlined')||'border-[1px] border-gray-300 dark:border-gray-600 bg-white dark:bg-black',
      !(mode === 'underlined')||'rounded-none border-0 border-gray-300 dark:border-gray-700 border-b-[1px] shadow-none bg-stone-50 dark:bg-stone-950',
      !(mode === 'filled')||`border-0 bg-stone-100 dark:bg-stone-900 ${!isDisabled||'border-dotted border-2 border-slate-200'}`,
      props.class]"
         :style="`padding-left: ${beforeWidth||10}px; padding-right: ${afterWidth||10}px; scroll-margin-top: ${headerHeight + 10}px;`"
    ><slot/></div><slot name="body"/>
    <Label :title="label"
           :type="labelType"
           :mode="mode"
           :is-required="isRequired"
           :is-disabled="isDisabled"
           :translate-x="beforeWidth||10"
           :max-width="input?.['offsetWidth']"/>
    <span ref="afterInput" class="absolute inset-y-0 right-0 flex items-center">
      <slot name="after"/>
      <Dropdown v-if="help?.length" :content="help">
        <template #head>
          <QuestionMarkCircleIcon class="h-5 w-5 mr-2 mt-[6px] text-gray-400" aria-hidden="true" />
        </template>
      </Dropdown>
      <Dropdown v-if="isInvalid" :content="messageInvalid">
        <template #head>
          <ExclamationCircleIcon class="h-5 w-5 mr-2 mt-[6px] text-red-500" aria-hidden="true" />
        </template>
      </Dropdown>
      <transition leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100" leave-to-class="opacity-0"
                  enter-active-class="transition ease-in duration-200" enter-from-class="opacity-0" enter-to-class="opacity-100">
        <XCircleIcon v-if="clear && value" class="h-5 w-5 mr-2 text-gray-400 dark:text-gray-600 z-30" aria-hidden="true"
                     @click.stop="emit('clear')" />
      </transition>
    </span>
    <p
      class="absolute block text-red-600 dark:text-red-400 text-sm truncate  ml-1"
      :class="[isInvalid ? 'visible' : 'invisible']"
      :style="`max-width: ${inputBody?.['offsetWidth']||10}px`">
      {{ messageInvalid }}
    </p>
  </div>
</template>