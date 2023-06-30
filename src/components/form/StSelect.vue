<script setup lang="ts">
import {computed, ref, watch, getCurrentInstance} from 'vue'
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/vue'
import {
  CheckIcon,
  ChevronUpDownIcon,
  ChevronDownIcon,
  XCircleIcon,
  ExclamationCircleIcon, QuestionMarkCircleIcon
} from '@heroicons/vue/20/solid'
import Label, {ILabelMode} from "@/components/functional/Label.vue";
import Dropdown from "@/components/functional/Dropdown.vue";
import {Rules} from "@/helpers/rules";
import type {IMode} from "@/components/form/StForm.vue";
// ---------------------------------------
export interface ISelect {
  nameComponent?: string
  modelValue?: string|null,
  mode?: IMode
  label?: string
  labelMode?: ILabelMode
  placeholder?: string
  loading?:boolean
  disabled?:boolean
  items: Array<any>
  class?: string
  isRequired?: boolean
  selectIcon?: "ChevronUpDownIcon"|"ChevronDownIcon"
  clear?: boolean
  help?: string
  isInvalid?: boolean
  rules?: Rules
}
// ---------------------------------------
const props = defineProps<ISelect>()
const emit = defineEmits<{
  (event: 'update:modelValue', payload: string|null): void;
  (event: 'updateModelValue', payload: string|null): void;
}>();
// ---------------------------------------
const id = ref(props.nameComponent||getCurrentInstance()?.uid)
const selected = ref<any>(props.modelValue||null)
const selectIcon = computed(()=>props.selectIcon||"ChevronUpDownIcon")
const isInvalid = ref(props.isInvalid||false)
const messageValid = computed(()=>"Please provide a valid email address.")
const isRequired = computed(()=>false)
// ---------------------------------------
const input = ref(0)
const inputBody = ref(0)
const beforeInput = ref(0)
const afterInput = ref(0)
// ---------------------------------------
watch(selected, (value)=>{
  emit('update:modelValue', value)
  emit('updateModelValue', value)
})
// ---------------------------------------
</script>

<template>
  <Listbox as="div" v-model="selected">
    <div :id="id" ref="inputBody" class="relative my-6 w-full">
      <ListboxButton
        ref="input"
        class="peer relative w-full min-h-[36px] cursor-default rounded-md text-left text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6"
        :class="[!isInvalid||'ring-2 ring-red-500', props.class||'py-1.5 bg-white shadow-sm ring-1 ring-inset ring-gray-300 min-w-[10rem]']"
        :style="`padding-left: ${beforeInput['offsetWidth']||10}px; padding-right: ${afterInput['offsetWidth']||10}px;`"
      >
        <span v-if="selected" class="flex items-center">
          <slot name="selected" :selected="selected"/>
        </span>
        <div ref="beforeInput" class="absolute inset-y-0 left-0 flex items-center pl-3 pr-1">
          <slot name="before"/>
        </div>
        <span ref="afterInput" class="absolute inset-y-0 right-0 flex items-center">
          <ChevronUpDownIcon v-if="selectIcon==='ChevronUpDownIcon'" class="h-5 w-5 text-gray-400" aria-hidden="true" />
          <ChevronDownIcon v-else-if="selectIcon==='ChevronDownIcon'" class="h-5 w-5 text-gray-400" aria-hidden="true" />
          <slot name="after"/>
          <Dropdown v-if="help?.length" :content="help">
            <template #head>
              <QuestionMarkCircleIcon class="h-5 w-5 mr-2 mt-[6px] text-gray-400" aria-hidden="true" />
            </template>
          </Dropdown>
          <Dropdown v-if="isInvalid" :content="messageValid">
            <template #head>
              <ExclamationCircleIcon class="h-5 w-5 mr-2 mt-[6px] text-red-500" aria-hidden="true" />
            </template>
          </Dropdown>
          <transition leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100" leave-to-class="opacity-0"
                      enter-active-class="transition ease-in duration-200" enter-from-class="opacity-0" enter-to-class="opacity-100">
            <XCircleIcon v-if="clear && selected" class="h-5 w-5 mr-2 text-gray-400 z-30" aria-hidden="true" @click.stop="selected = null" />
          </transition>
        </span>
      </ListboxButton>
      <Label
        :title="label"
        :type="label?.length ? selected ? 'static' : 'dynamic':'none'"
        :is-required="isRequired"
        :translate-x="beforeInput['offsetWidth']||10"
        :max-width="input['offsetWidth']"
      />
      <p
        class="absolute block text-red-600 text-sm truncate ml-1"
        :class="[isInvalid ? 'visible' : 'invisible']"
        :style="`max-width: ${inputBody['offsetWidth']||10}px`"
      >
        {{ messageValid }}
      </p>
      <transition leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100" leave-to-class="opacity-0">
        <ListboxOptions class="absolute min-w-max z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          <ListboxOption as="template" v-for="(item, key) in items" :key="key" :value="item" v-slot="{ active, selected }">
            <li :class="[!selected || active ||'bg-indigo-100', active ? 'bg-indigo-600 text-white' : 'text-gray-900', 'relative cursor-default select-none py-2 pl-3 pr-9']">
              <div class="flex items-center">
                <slot name="item" :item="item"/>
              </div>
              <span v-if="selected" :class="[active ? 'text-white' : 'text-indigo-600', 'absolute inset-y-0 right-0 flex items-center pr-4']">
                <CheckIcon class="h-5 w-5" aria-hidden="true" />
              </span>
            </li>
          </ListboxOption>
          <div v-if="!items.length" class="my-2 text-center">
            Нет данных
          </div>
        </ListboxOptions>
      </transition>
    </div>
  </Listbox>
</template>