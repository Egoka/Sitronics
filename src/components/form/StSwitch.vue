<script setup lang="ts">
import {computed, getCurrentInstance, ref} from 'vue'
import {QuestionMarkCircleIcon} from "@heroicons/vue/20/solid";
import { Switch, SwitchGroup, SwitchLabel } from '@headlessui/vue'
import Dropdown from "../functional/Dropdown.vue";
import Icons from "@/components/functional/Icons.vue";
import FixWindow from "@/components/functional/FixWindow.vue";
import {cn} from "@/helpers/tailwind";
import type {IDataSwitch, ISwitch} from "@/components/form/StSwitch";
// ---------------------------------------
const props = defineProps<ISwitch>()
// ---------------------------------------
const isActiveSwitch = ref<boolean>(false)
// ---------------------------------------
const id = ref(props.id ?? getCurrentInstance()?.uid)
const value = computed<boolean>(()=> Boolean(props.modelValue ?? false))
const switchingType = computed<IDataSwitch["switchingType"]>(()=> props.paramsSwitch?.switchingType ?? "checkbox")
const mode = computed<IDataSwitch["mode"]>(()=> props.paramsSwitch?.mode ?? props.mode ?? "none")
const label = computed<ISwitch["label"]>(()=> String(props.label ?? ""))
const isDisabled = computed<ISwitch["disabled"]>(()=>props.disabled ?? false)
const isRequired = computed<ISwitch["required"]>(()=>props.required ?? false)
const rounded = computed<number>(()=> props.paramsSwitch?.rounded === "full" ? 9999 : props.paramsSwitch?.rounded ?? 9999)
const iconActive = computed<IDataSwitch["iconActive"]>(()=> props.paramsSwitch?.iconActive ?? "")
const iconInactive = computed<IDataSwitch["iconInactive"]>(()=> props.paramsSwitch?.iconInactive ?? "")
// ---------------------------------------
function inputEvent (value:boolean) { inputModelValue(value) }
// ---------------------------------------
const emit = defineEmits<{
  (event: 'update:modelValue', payload: boolean): void;
  (event: 'updateModelValue', payload: boolean): void;
  (event: 'change:modelValue', payload: boolean): void;
}>();
function inputModelValue(value:any) {
  emit('update:modelValue', value)
  emit('updateModelValue', value)
}
function changeModelValue(value:any) {
  emit('change:modelValue', value)
}
// ---------------------------------------
</script>

<template>
  <SwitchGroup
    v-if="switchingType === 'switch'"
    as="div"
    :class="cn(
      'my-4 py-[6px] px-2 rounded-md',
      !(mode === 'outlined')||`border border-gray-300 dark:border-gray-600 bg-white dark:bg-black ${!isDisabled||'bg-slate-50 dark:bg-stone-950 border-dashed'}`,
      !(mode === 'underlined')||`rounded-none border-0 border-gray-300 dark:border-gray-700 border-b shadow-none bg-stone-50 dark:bg-stone-950 ${!isDisabled||'border-dashed'}`,
      !(mode === 'filled')||`bg-stone-100 dark:bg-stone-900 ${!isDisabled||'border-2 border-dotted'}`,
      props.class,
      !isActiveSwitch || mode === 'none'||'border-theme-600 dark:border-theme-700 ring-2 ring-inset ring-theme-600 dark:ring-theme-700',
      'relative flex gap-x-3 transition-all'
      )">
    <div class="flex h-6 items-center">
      <Switch
        :modelValue="value" @update:model-value="inputEvent"
        :class="cn(
          !isDisabled||`pointer-events-none border-dotted border-2 border-transparent w-9 ${value ? 'bg-gray-600 dark:bg-gray-400' : 'bg-gray-200 dark:bg-gray-800'}`,
          value ? 'bg-theme-600 dark:bg-theme-400' : 'bg-gray-200 dark:bg-gray-800',
          'flex w-8 flex-none cursor-pointer p-px ring-2 ring-inset ring-gray-900/5 transition-colors duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-theme-600')"
        :style="`border-radius: ${rounded}px`"
        @focus="isActiveSwitch = true"
        @blur="isActiveSwitch = false">
        <Icons
          v-if="iconActive && iconInactive"
          :type="value ? iconActive : iconInactive"
          :class="cn(
            value ? 'translate-x-3.5 bg-theme-100 dark:bg-theme-900' : 'translate-x-0 bg-gray-100 dark:bg-gray-950',
            'h-4 w-4 transform shadow-sm ring-1 ring-gray-900/5 transition duration-200 ease-in-out text-gray-400 dark:text-gray-600')"
          :style="`border-radius: ${rounded-1}px`"/>
        <span
          v-else
          aria-hidden="true"
          :class="cn(
            value ? 'translate-x-3.5 bg-theme-100 dark:bg-theme-900' : 'translate-x-0 bg-gray-100 dark:bg-gray-950',
            'h-4 w-4 transform shadow-sm ring-1 ring-gray-900/5 transition duration-200 ease-in-out')"
          :style="`border-radius: ${rounded-1}px`"/>
      </Switch>
    </div>
    <SwitchLabel
      :class="cn(
        'font-medium text-sm leading-6 text-gray-900 dark:text-gray-100',
        !isDisabled||'pointer-events-none text-slate-800 dark:text-slate-200',
        !isRequired||`after:content-['*'] after:text-red-500 after:ml-1`)">
      {{ label }}
    </SwitchLabel>
    <slot/>
    <div class="absolute inset-y-0 right-0 flex items-center pl-1">
      <Dropdown v-if="help?.length" :content="help">
        <template #head>
          <QuestionMarkCircleIcon class="h-5 w-5 mr-2 mt-[6px] text-gray-400 dark:text-gray-600 hover:text-yellow-500 transition" aria-hidden="true" />
        </template>
      </Dropdown>
    </div>
  </SwitchGroup>
  <div
    v-else-if="switchingType === 'checkbox'"
    :class="cn(
      'gap-x-3 my-4 py-[6px] px-2 rounded-md',
      !(mode === 'outlined')||`border border-gray-300 dark:border-gray-600 bg-white dark:bg-black ${!isDisabled||'bg-slate-50 dark:bg-stone-950 border-dashed'}`,
      !(mode === 'underlined')||`rounded-none border-0 border-gray-300 dark:border-gray-700 border-b shadow-none bg-stone-50 dark:bg-stone-950 ${!isDisabled||'border-dashed'}`,
      !(mode === 'filled')||` bg-stone-100 dark:bg-stone-900 ${!isDisabled||'border-2 border-dotted'}`,
      props.class,
      'relative flex'
      )">
    <div class="flex h-6 items-center">
      <input
        :id="id"
        :name="id"
        :checked="value"
        :disabled="isDisabled"
        type="checkbox"
        :class="cn(
          'h-4 w-4 bg-stone-50 dark:bg-stone-950',
          'border border-gray-300 dark:border-gray-700',
          'text-theme-500 dark:text-theme-700',
          'focus:ring-offset-0 focus:ring-theme-200 focus:dark:ring-theme-800',
          'transition cursor-pointer',
          'disabled:bg-slate-500 disabled:text-slate-500 disabled:accent-slate-500'
          )"
        :style="`border-radius: ${rounded-1}px`"
        @focus="isActiveSwitch = true"
        @blur="isActiveSwitch = false"
        @input="inputEvent(($event.target as HTMLInputElement).checked)"
        @change="changeModelValue(($event.target as HTMLInputElement).checked)"
      />
    </div>
    <div class="text-sm leading-6">
      <label
        :for="id"
        :class="cn(
          'font-medium text-gray-600 dark:text-gray-400 cursor-pointer',
          !isDisabled||'text-slate-800 dark:text-slate-200',
          !isRequired||`after:content-['*'] after:text-red-500 after:dark:text-red-800 after:ml-1`
          )">
        {{ label }}
      </label>
    </div>
    <slot/>
    <div class="absolute inset-y-0 right-0 flex items-center pl-1">
      <Dropdown v-if="help?.length" :content="help">
        <template #head>
          <QuestionMarkCircleIcon class="h-5 w-5 mr-2 mt-[6px] text-gray-400 dark:text-gray-600 hover:text-yellow-500 transition cursor-help" aria-hidden="true" />
          <FixWindow :mode="mode">Дополнительная информация</FixWindow>
        </template>
      </Dropdown>
    </div>
  </div>
</template>