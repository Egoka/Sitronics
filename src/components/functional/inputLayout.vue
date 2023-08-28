<script setup lang="ts">
import {computed, onMounted, ref, useSlots} from "vue";
import type {IMode} from "@/components/form/StForm.vue";
import Label, {type ILabelMode} from "@/components/functional/Label.vue";
import {getLabelType} from "@/helpers/label";
import Dropdown from "@/components/functional/Dropdown.vue";
import {
  CheckIcon, DocumentDuplicateIcon,
  ExclamationCircleIcon,
  QuestionMarkCircleIcon,
  XCircleIcon
} from "@heroicons/vue/20/solid";
import Tooltip from "@/components/functional/Tooltip.vue";
// ---------------------------------------
export interface ILayout {
  value: any
  isValue?: boolean
  mode?: IMode
  label?: string
  labelMode?: ILabelMode
  isInvalid?: boolean
  messageInvalid?: string
  required?: boolean
  loading?: boolean
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
const isValue = computed<ILayout["value"]>(()=> props.isValue || false)
const mode = computed<ILayout["mode"]>(()=> props.mode || "outlined")
const label = computed<ILayout["label"]>(()=> String(props.label || ""))
const labelMode = computed<ILabelMode>(()=> props.labelMode || "offsetDynamic")
const labelType = computed<ILabelMode>(()=> getLabelType(isValue.value, label.value, labelMode.value))
const isRequired = computed<ILayout["required"]>(()=>props.required)
const isLoading = computed<ILayout["loading"]>(()=> props.loading || false)
const isDisabled = computed<ILayout["disabled"]>(()=>props.disabled || false)
const isInvalid = computed<ILayout["isInvalid"]>(()=>!isDisabled.value ? props.isInvalid : false)
const messageInvalid = computed<ILayout["messageInvalid"]>(()=> props.messageInvalid || "")

// ---------------------------------------
const input = ref<HTMLElement|undefined>()
const inputBody = ref<HTMLElement|undefined>()
const beforeInput = ref<HTMLElement|undefined>()
const afterInput = ref<HTMLElement|undefined>()
// ---------------------------------------
const emit = defineEmits(["clear"]);
const slots = useSlots()
// ---------------------------------------
const beforeWidth = ref<number|null>(null)
const afterWidth = ref<number|null>(null)
const headerHeight = ref(0)
const isCopy = ref(false)
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
// ---------------------------------------
async function copy() {
  try {
    await navigator.clipboard.writeText(String(value.value))
    isCopy.value = true
    setTimeout(()=>isCopy.value = false, 3000)
  } catch (err) {
    console.error('Failed to copy: ', err);
  }
}
</script>

<template>
  <div ref="inputBody" :class="['relative', !isInvalid||'is-invalid', props.classBody||'mb-6 rounded-md']" :style="`scroll-margin-top: ${headerHeight + 10}px;`">
    <div ref="beforeInput" class="absolute inset-y-0 left-0 flex items-center h-[38px] pl-3 pr-1">
      <slot name="before"/>
    </div>
    <div ref="input"
         :class="[props.class,
           !isInvalid||'border-red-500 ring-1 ring-inset ring-red-500 scroll-mt-10',
           !isDisabled||'bg-neutral-50 dark:bg-neutral-950 text-slate-500 dark:text-slate-500 border-slate-200 dark:border-slate-800 border-dashed shadow-none',
           !(mode === 'outlined')||'border-[1px] border-gray-300 dark:border-gray-600 bg-white dark:bg-neutral-950',
           !(mode === 'underlined')||'rounded-none border-0 border-gray-300 dark:border-gray-700 border-b-[1px] bg-stone-50 dark:bg-stone-950',
           !(mode === 'filled')||`${isDisabled ? 'border-dotted border-2 border-slate-200' : 'border-0 border-transparent'} bg-stone-100 dark:bg-stone-900`]"
         class="block peer w-full min-h-[38px] max-h-20 overflow-auto rounded-md text-gray-900 dark:text-gray-100 transition-all duration-500 sm:text-sm sm:leading-6"
         :style="`padding-left: ${beforeWidth||10}px; padding-right: ${afterWidth||10}px;`"
    ><slot/></div>
    <slot name="body"/>
    <Label :title="label"
           :type="labelType"
           :mode="mode"
           :is-required="isRequired"
           :is-disabled="isDisabled"
           :translate-x="beforeWidth||10"
           :max-width="input?.['offsetWidth']"/>
    <span ref="afterInput" class="absolute inset-y-0 right-0 flex items-center h-[38px]">
      <div v-if="slots.after" class="flex pr-2">
        <slot name="after"/>
      </div>
      <transition leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100" leave-to-class="opacity-0"
                  enter-active-class="transition ease-in duration-200" enter-from-class="opacity-0" enter-to-class="opacity-100">
        <div v-if="isLoading" class="relative mx-2">
          <div class="w-4 h-4 border-gray-200 dark:border-gray-800 border-2 rounded-full"></div>
          <div class="w-4 h-4 border-gray-700 dark:border-gray-300 border-t-2 animate-spin rounded-full absolute left-0 top-0"></div>
        </div>
      </transition>
      <Dropdown v-if="help?.length" :content="help">
        <template #head>
          <QuestionMarkCircleIcon class="h-5 w-5 mr-2 mt-[6px] text-gray-400 dark:text-gray-600 hover:text-yellow-500 transition" aria-hidden="true" />
          <Tooltip>Дополнителная информация</Tooltip>
        </template>
      </Dropdown>
      <template v-if="!isDisabled">
        <transition leave-active-class="transition ease-in duration-1000" leave-from-class="opacity-100" leave-to-class="opacity-0"
                    enter-active-class="transition ease-in duration-1000" enter-from-class="opacity-0" enter-to-class="opacity-100">
          <div>
            <Dropdown v-if="isInvalid&&messageInvalid" :content="messageInvalid">
              <template #head>
                <ExclamationCircleIcon class="h-5 w-5 mr-2 mt-[6px] text-red-500" aria-hidden="true" />
                <Tooltip class="text-red-500">{{ messageInvalid }}</Tooltip>
              </template>
            </Dropdown>
          </div>
        </transition>
        <transition leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100" leave-to-class="opacity-0"
                    enter-active-class="transition ease-in duration-200" enter-from-class="opacity-0" enter-to-class="opacity-100">
          <div v-if="clear && (value?.length||value>0)" class="h-5 w-5 mr-2">
            <XCircleIcon class="h-5 w-5 text-gray-400 dark:text-gray-600 hover:text-red-600 hover:dark:text-red-500 transition-all duration-300" aria-hidden="true" @click.stop="emit('clear')" />
            <Tooltip>Очисить</Tooltip>
          </div>
        </transition>
      </template>
      <template v-else-if="value?.length">
        <div v-if="!isCopy" class="flex items-center h-[38px]">
          <DocumentDuplicateIcon  class="h-5 w-5 mr-2 text-gray-400 dark:text-gray-600 hover:text-gray-600 hover:dark:text-gray-400 transition" aria-hidden="true" @click="copy"/>
          <Tooltip>Копировать</Tooltip>
        </div>
        <CheckIcon v-else class="h-5 w-5 mr-2 text-emerald-400 dark:text-emerald-600" aria-hidden="true" />
      </template>
    </span>
    <p
      class="absolute block text-red-600 dark:text-red-400 text-sm truncate ml-1"
      :class="[isInvalid ? 'visible' : 'invisible']"
      :style="`max-width: ${inputBody?.['offsetWidth']||10}px`">
      {{ messageInvalid }}
    </p>
  </div>
</template>