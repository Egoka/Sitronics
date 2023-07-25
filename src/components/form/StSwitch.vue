<script setup lang="ts">
import {computed, getCurrentInstance, onMounted, ref} from 'vue'
import type {IMode} from "./StForm.vue";
import {QuestionMarkCircleIcon} from "@heroicons/vue/20/solid";
import Dropdown from "../functional/Dropdown.vue";
type IModeSwitch = IMode|'none'

export interface ISwitch {
  id?: string
  modelValue?: boolean|null|undefined,
  mode?: IMode
  label?: string
  disabled?:boolean
  help?: string
  isRequired?: boolean
  class?: string
}
// ---------------------------------------
const props = defineProps<ISwitch>()
console.log(props)
// ---------------------------------------
const id = ref(props.id||getCurrentInstance()?.uid)
const value = computed(()=> String(props.modelValue||false))
const mode = computed<IModeSwitch>(()=> {
  console.log("props.mode", props.mode)
  return props.mode || "none"
})
const label = computed(()=> String(props.label || ""))
const isDisabled = computed<boolean>(()=>props.disabled || false)
const isRequired = computed(()=>props.isRequired)
// ---------------------------------------
function inputEvent ($event:any) {
  inputModelValue(($event.target as HTMLInputElement).checked)
}
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
  <div :class="['relative flex gap-x-3 my-4 py-[6px] px-2 rounded-md',
   !(mode === 'outlined')||`border-[1px] border-gray-300 dark:border-gray-600 bg-white dark:bg-black ${!isDisabled||'bg-slate-50 dark:bg-stone-950 border-dashed'}`,
   !(mode === 'underlined')||`rounded-none border-0 border-gray-300 dark:border-gray-700 border-b-[1px] shadow-none bg-stone-50 dark:bg-stone-950 ${!isDisabled||'border-dashed'}`,
   !(mode === 'filled')||` bg-stone-100 dark:bg-stone-900 ${!isDisabled||'border-2 border-dotted'}`,
   props.class
  ]">
    <div class="flex h-6 items-center">
      <input
        :id="id"
        :name="id"
        v-model="value"
        :disabled="isDisabled"
        type="checkbox"
        class="h-4 w-4 rounded border-gray-300 dark:border-gray-700 text-indigo-500 focus:ring-indigo-600 focus:dark:ring-indigo-400 transition
        disabled:bg-slate-500 disabled:text-slate-500 disabled:accent-slate-500"
        @input="inputEvent($event)"
        @change="changeModelValue(($event.target as HTMLInputElement).checked)"
      />
    </div>
    <div class="text-sm leading-6">
      <label :for="id" :class="[
        `font-medium text-gray-900 dark:text-gray-100`,
        !isDisabled||'text-slate-800 dark:text-slate-200',
        !isRequired||`after:content-['*'] after:text-red-500 after:ml-1`]">
        {{ label }}
      </label>
    </div>
    <div class="absolute inset-y-0 right-0 flex items-center pl-1">
      <Dropdown v-if="help?.length" :content="help">
        <template #head>
          <QuestionMarkCircleIcon class="h-5 w-5 mr-2 mt-[6px] text-gray-400 dark:text-gray-600 hover:text-yellow-500 transition" aria-hidden="true" />
        </template>
      </Dropdown>
    </div>
  </div>
</template>