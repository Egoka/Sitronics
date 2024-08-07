<script setup lang="ts">
import {computed, onMounted, onUnmounted, ref, useSlots} from "vue";
import Label from "@/components/functional/Label.vue";
import {cn} from "@/helpers/tailwind";
import Dropdown from "@/components/functional/Dropdown.vue";
import FixWindow from "@/components/functional/FixWindow.vue";
import {
  CheckIcon, DocumentDuplicateIcon,
  ExclamationCircleIcon,
  QuestionMarkCircleIcon,
  XCircleIcon
} from "@heroicons/vue/20/solid";
import type {ILayout} from "@/components/functional/InputLayout";
import type {ILabelMode} from "@/components/functional/Label";
// ---------------------------------------
const props = defineProps<ILayout>()
// ---------------------------------------
const input = ref<HTMLElement|undefined>()
const inputBody = ref<HTMLElement|undefined>()
const beforeInput = ref<HTMLElement|undefined>()
const afterInput = ref<HTMLElement|undefined>()
// ---------------------------------------
const baseHeight = 38 //px
// ---------------------------------------
const value = computed<ILayout["value"]>(()=> props.value ?? null)
const isValue = computed<ILayout["value"]>(()=> props.isValue ?? false)
const mode = computed<ILayout["mode"]>(()=> props.mode ?? "outlined")
const label = computed<ILayout["label"]>(()=> String(props.label ?? ""))
const labelMode = computed<ILabelMode>(()=> props.labelMode ?? "offsetDynamic")
const labelType = computed<ILabelMode>(()=> getLabelType(isValue.value, label.value, labelMode.value))
const isRequired = computed<ILayout["required"]>(()=>props.required)
const isLoading = computed<ILayout["loading"]>(()=> props.loading ?? false)
const isDisabled = computed<ILayout["disabled"]>(()=>props.disabled ?? false)
const isInvalid = computed<ILayout["isInvalid"]>(()=>!isDisabled.value ? props.isInvalid : false)
const messageInvalid = computed<ILayout["messageInvalid"]>(()=> props.messageInvalid ?? "")
const help = computed<ILayout["help"]>(()=> String(props.help ?? ""))
const width = computed<ILayout["width"]>(()=> props?.width ? typeof props?.width === "number" ? `${props?.width}px` : props?.width : "")
const height = computed<ILayout["height"]>(()=> props?.height ? typeof props?.height === "number" ? `${props?.height}px` : props?.height : "")
const animation = computed<ILayout["animation"]>(()=> props?.animation ?? "transition-all duration-500")
// ---------------------------------------
const emit = defineEmits(["clear"]);
const slots = useSlots()
// ---------------------------------------
const beforeWidth = ref<number|null>(null)
const afterWidth = ref<number|null>(null)
const headerHeight = ref(0)
const isCopy = ref(false)
// ---------------------------------------
const tableObserver = new ResizeObserver(entries => {
  entries.forEach(() => {
    setWidthInput()
  });
});
const widthInput = ref<number>(0)
function setWidthInput() {
  const result = inputBody.value?.clientWidth
  widthInput.value = result ? result : 0
}
onMounted(()=>{
  if (inputBody.value) {
    tableObserver.observe(inputBody.value as Element);
  }
})
onUnmounted(()=>{
  tableObserver.disconnect();
})
// ---------------------------------------
onMounted(()=>{
  if (beforeInput.value) {
    new ResizeObserver(entries => {
      for (let entry of entries) {
        beforeWidth.value = (entry as any).target['offsetWidth']
      }
    }).observe((beforeInput.value as HTMLElement));
  }
  if (afterInput.value) {
    new ResizeObserver(entries => {
      for (let entry of entries) {
        afterWidth.value = (entry as any)?.target['offsetWidth']
      }
    }).observe((afterInput.value as HTMLElement));
  }
  headerHeight.value = <number>document.querySelector("header")?.offsetHeight
})
// ---------------------------------------
const getLabelType = (value:any, label:ILayout["label"], labelMode:ILabelMode)=> {
  if (label?.length) {
    if (!!(value)) {
      if (["offsetDynamic","offsetStatic"].includes(labelMode)){
        return "offsetStatic"
      } else if (["vanishing"].includes(labelMode)){
        return "none"
      } else { return "static" }
    } else { return labelMode }
  } else { return "none" }
}
async function copy() {
  try {
    await navigator.clipboard.writeText(String(value.value))
    isCopy.value = true
    setTimeout(()=>isCopy.value = false, 3000)
  } catch (err) { console.error('Failed to copy: ', err) }
}
</script>

<template>
  <div
    ref="inputBody"
    :class="cn('inputBody',
         'mb-6 rounded-md',
         animation,
         'classBody relative',
         props.classBody,
         !isInvalid||'is-invalid'
        )"
    :style="`scroll-margin-top: ${headerHeight + 10}px;`">
    <div v-if="slots.before" ref="beforeInput"
         :class="cn('absolute inset-y-0 left-0 flex items-center', 'pr-1', beforeInput?.['offsetWidth'] > 16 ? 'pl-3' : 'pl-1')"
         :style="`height: ${height};max-height: 4rem;`">
      <slot name="before"/>
    </div>
    <div
      ref="input"
      :class="cn(
        'classLayout rounded-md w-full max-h-20 text-gray-900 dark:text-gray-100 sm:text-sm sm:leading-6 focus-visible:ring-0',
        !(mode === 'outlined')||'border border-gray-300 dark:border-gray-600 bg-white dark:bg-neutral-950',
        !(mode === 'underlined')||'rounded-none border-0 border-gray-300 dark:border-gray-700 border-b bg-stone-50 dark:bg-stone-950',
        !(mode === 'filled')||`${isDisabled ? 'border-dotted border-2 border-slate-200' : 'border-0 border-transparent'} bg-stone-100 dark:bg-stone-900`,
        animation,
        props.class,
        !isInvalid||'border-red-500 dark:border-red-500 ring-1 ring-inset ring-red-500 dark:ring-red-500 scroll-mt-10',
        !isDisabled||'bg-neutral-50 dark:bg-neutral-950 text-slate-500 dark:text-slate-500 border-slate-200 dark:border-slate-800 border-dashed shadow-none',
        'block peer overflow-auto'
        )"
      :style="`width:${width};height:${height};min-height: ${baseHeight}px;padding-left: ${beforeWidth||10}px; padding-right: ${afterWidth||10}px;`">
      <slot/>
    </div>
    <slot name="body"/>
    <Label
      :title="label"
      :type="labelType"
      :mode="mode"
      :is-required="isRequired"
      :is-disabled="isDisabled"
      :translate-x="beforeWidth||15"
      :max-width="widthInput"/>
    <span ref="afterInput" class="absolute inset-y-0 right-0 flex items-center"
          :style="`height: ${height};max-height: 4rem;`">
      <div v-if="slots.after" class="flex pr-2">
        <slot name="after"/>
      </div>
      <transition leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100" leave-to-class="opacity-0"
                  enter-active-class="transition ease-in duration-200" enter-from-class="opacity-0" enter-to-class="opacity-100">
        <div v-if="isLoading" class="relative mx-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" class="sbui-icon animate-spin dark:text-theme-300"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>
        </div>
      </transition>
      <Dropdown v-if="help?.length" :content="help">
        <template #head>
          <QuestionMarkCircleIcon class="h-5 w-5 mr-2 mt-[6px] text-gray-400 dark:text-gray-600 hover:text-yellow-500 transition cursor-help" aria-hidden="true" />
          <FixWindow :mode="mode" :delay="10" :padding-window="40">Дополнительная информация</FixWindow>
        </template>
      </Dropdown>
      <template v-if="!isDisabled">
        <Dropdown v-if="isInvalid&&messageInvalid" :content="messageInvalid">
          <template #head>
            <ExclamationCircleIcon class="h-5 w-5 mr-2 mt-[6px] text-red-500 cursor-pointer" aria-hidden="true" />
            <FixWindow :mode="mode" :delay="10" :padding-window="40" class="text-red-500">{{ messageInvalid }}</FixWindow>
          </template>
        </Dropdown>
        <transition leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100" leave-to-class="opacity-0"
                    enter-active-class="transition ease-in duration-200" enter-from-class="opacity-0" enter-to-class="opacity-100">
          <div v-if="clear && (value?.length||value>0)" class="relative h-5 w-5 mr-2">
            <div>
              <XCircleIcon class="h-5 w-5 text-gray-400 dark:text-gray-600 hover:text-red-600 hover:dark:text-red-500 transition-all duration-300 cursor-pointer" aria-hidden="true" @click.stop="emit('clear')" />
              <FixWindow :mode="mode" :delay="10" :padding-window="40">Очистить</FixWindow>
            </div>
          </div>
        </transition>
      </template>
      <template v-else-if="value?.length">
        <div v-if="!isCopy" class="relative h-5 w-5 mr-2">
          <div>
            <DocumentDuplicateIcon class="h-5 w-5 mr-2 text-gray-400 dark:text-gray-600 hover:text-gray-600 hover:dark:text-gray-400 transition" aria-hidden="true" @click="copy"/>
            <FixWindow :mode="mode" :delay="10" :padding-window="40">Копировать</FixWindow>
          </div>
        </div>
        <CheckIcon v-else class="h-5 w-5 mr-2 text-emerald-400 dark:text-emerald-600" aria-hidden="true" />
      </template>
    </span>
    <p
      :data-invalid="isInvalid"
      :class="cn('absolute block text-red-600 dark:text-red-400 text-sm truncate ml-1 data-[invalid=true]:visible invisible')"
      :style="`max-width: ${inputBody?.['offsetWidth']||10}px`">
      {{ messageInvalid }}
    </p>
  </div>
</template>