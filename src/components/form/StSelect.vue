<script setup>
import {computed} from "vue";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/vue";
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/20/solid'
import Label from "@/components/functional/Label.vue";

const props = defineProps({
  options: Array,
  modelValue: [String, Number, Array],
  placeholder: {
    type: String,
    default: "Select option",
  },
  multiple: Boolean,
  error: String
});

const emit = defineEmits(["update:modelValue"]);

const label = computed(() => {
  console.log(props.options)
  return props.options
    .filter(option => {
      if (Array.isArray(props.modelValue)) {
        return props.modelValue.includes(option.value);
      }
      
      return props.modelValue === option.value;
    })
    .map(option => option.label)
    .join(", ");
});
</script>
<template>
  <Listbox
    :model-value="props.modelValue"
    :multiple="props.multiple"
    @update:modelValue="value => emit('update:modelValue', value)"
  >
    <div class="relative mt-1">
      <ListboxButton
        ref="input"
        class="relative py-2 pr-10 pl-3 w-full text-left bg-white rounded-lg shadow-md cursor-default focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm"
      >
        <span
          v-if="label"
          class="block truncate"
        >{{ label }}</span
        >
        <span
          v-else
          class="text-gray-500"
        >{{ props.placeholder }}</span
        >
        <span
          class="flex absolute inset-y-0 right-0 items-center pr-2 pointer-events-none"
        >
          <ChevronUpDownIcon
            aria-hidden="true"
            class="w-5 h-5 text-gray-400"
          />
        </span>
      </ListboxButton>
      <Label :title="label"
             :type="labelType"
             :mode="mode"
             :is-required="isRequired"
             :is-disabled="isDisabled"
             :translate-x="beforeWidth||10"
             :max-width="input?.['offsetWidth']"
      />
      <transition
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <ListboxOptions
          class="overflow-auto absolute z-10 py-1 mt-1 w-full max-h-60 text-base bg-white rounded-md ring-1 ring-black ring-opacity-5 shadow-lg focus:outline-none sm:text-sm"
        >
          <ListboxOption
            v-for="option in props.options"
            :key="option.label"
            v-slot="{active, selected}"
            :value="option.value"
            as="template"
          >
            <li
              :class="[
                active ? 'bg-amber-100 text-amber-900' : 'text-gray-900',
                'relative cursor-default select-none py-2 pl-10 pr-4',
              ]"
            >
              <span
                :class="[
                  selected ? 'font-medium' : 'font-normal',
                  'block truncate',
                ]"
              >{{ option.label }}</span
              >
              <span
                v-if="selected"
                class="flex absolute inset-y-0 left-0 items-center pl-3 text-amber-600"
              >
                <CheckIcon
                  aria-hidden="true"
                  class="w-5 h-5"
                />
              </span>
            </li>
          </ListboxOption>
        </ListboxOptions>
      </transition>
      <div class="text-xs text-red-400 mt-1" v-if="props.error">{{ props.error }}</div>
    </div>
  </Listbox>
</template>


<!--<script setup lang="ts">-->
<!--import {computed, ref, watch, getCurrentInstance, onMounted} from 'vue'-->
<!--import {-->
<!--  Combobox,-->
<!--  ComboboxInput,-->
<!--  ComboboxButton,-->
<!--  ComboboxOptions,-->
<!--  ComboboxOption,-->
<!--  TransitionRoot,-->
<!--} from '@headlessui/vue'-->
<!--import { XCircleIcon, ExclamationCircleIcon, QuestionMarkCircleIcon, CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/20/solid'-->
<!--import Label, { type ILabelMode} from "@/components/functional/Label.vue";-->
<!--import Dropdown from "@/components/functional/Dropdown.vue";-->
<!--import type {IMode} from "./StForm.vue";-->
<!--// -&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;-->
<!--export interface ISelect {-->
<!--  id?: string-->
<!--  modelValue?: any-->
<!--  key?: string-->
<!--  indexKey?:number-->
<!--  visibleKey?: string-->
<!--  mode?: IMode-->
<!--  label?: string-->
<!--  labelMode?: ILabelMode-->
<!--  loading?:boolean-->
<!--  disabled?:boolean-->
<!--  clear?: boolean-->
<!--  help?: string-->
<!--  isInvalid?: boolean-->
<!--  messageInvalid?: string-->
<!--  isRequired?: boolean-->
<!--  selectIcon?: "ChevronUpDownIcon"|"ChevronDownIcon"-->
<!--  class?: string-->
<!--  items: Array<any>-->
<!--}-->
<!--// -&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;-->
<!--const props = defineProps<ISelect>()-->
<!--// -&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;-->
<!--const id = ref(props.id||getCurrentInstance()?.uid)-->
<!--const selected = computed(()=> props.modelValue||props.items[props.indexKey||0])-->
<!--const key = computed<ISelect["key"]>(()=>getKey(props.key))-->
<!--const indexKey = computed<ISelect["indexKey"]>(()=> props.indexKey || 0)-->
<!--const visibleKey = computed<ISelect["visibleKey"]>(()=>getKey(props.visibleKey))-->
<!--const mode = computed<IMode>(()=> props.mode || "outlined")-->
<!--const label = computed(()=> String(props.label || ""))-->
<!--const labelMode = computed<ILabelMode>(()=> props.labelMode || "offsetDynamic")-->
<!--const labelType = computed<ILabelMode>(()=> getLabelType())-->
<!--const isLoading = computed<ISelect["loading"]>(()=>props.loading || false)-->
<!--const isDisabled = computed<ISelect["disabled"]>(()=>props.disabled || false)-->
<!--const isInvalid = computed<boolean>(()=>!isDisabled.value ? props.isInvalid : false)-->
<!--const messageInvalid = computed<string>(()=> props.messageInvalid || "")-->
<!--const isRequired = computed(()=>props.isRequired)-->
<!--const isCopy = ref(false)-->
<!--const selectIcon = computed(()=>props.selectIcon||"ChevronUpDownIcon")-->
<!--// -&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;-->
<!--const people = [-->
<!--  { id: 1, name: 'Wade Cooper' },-->
<!--  { id: 2, name: 'Arlene Mccoy' },-->
<!--  { id: 3, name: 'Devon Webb' },-->
<!--  { id: 4, name: 'Tom Cook' },-->
<!--  { id: 5, name: 'Tanya Fox' },-->
<!--  { id: 6, name: 'Hellen Schmidt' },-->
<!--]-->

<!--let query = ref('')-->
<!--let filteredPeople = computed(() =>-->
<!--  query.value === ''-->
<!--    ? props.items-->
<!--    : props.items.filter((person) =>-->
<!--      person[person.key]-->
<!--        // .toLowerCase()-->
<!--        // .replace(/\s+/g, '')-->
<!--        // .includes(query.value.toLowerCase().replace(/\s+/g, ''))-->
<!--    )-->
<!--)-->
<!--// -&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;-->
<!--const input = ref<HTMLElement|undefined>()-->
<!--const inputBody = ref<HTMLElement|undefined>()-->
<!--const beforeInput = ref<HTMLElement|undefined>()-->
<!--const afterInput = ref<HTMLElement|undefined>()-->
<!--// -&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;-->
<!--const emit = defineEmits<{-->
<!--  (event: 'update:modelValue', payload: string|null): void;-->
<!--  (event: 'updateModelValue', payload: string|null): void;-->
<!--}>();-->
<!--watch(selected, (value:any)=>{-->
<!--  emit('update:modelValue', value)-->
<!--  emit('updateModelValue', value)-->
<!--})-->
<!--function getKey(key:string|undefined) {-->
<!--  if (key) {-->
<!--    return key-->
<!--  } else if (typeof props.items[props.indexKey || 0] === "object"){-->
<!--    return Object.keys(props.items[props.indexKey || 0])[0]-->
<!--  } else {-->
<!--    return props.items[props.indexKey || 0]-->
<!--  }-->
<!--}-->
<!--function getLabelType() {-->
<!--  if (label.value?.length) {-->
<!--    if (!!(selected.value)) {-->
<!--      if (['offsetDynamic','offsetStatic'].includes(labelMode.value)){-->
<!--        return "offsetStatic"-->
<!--      } else {return "static"}-->
<!--    } else { return labelMode.value }-->
<!--  } else { return "none" }-->
<!--}-->
<!--// -&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;-->
<!--const beforeWidth = ref<number|null>(null)-->
<!--const afterWidth = ref<number|null>(null)-->
<!--const headerHeight = ref(0)-->
<!--// -&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;-->
<!--onMounted(()=>{-->
<!--  new ResizeObserver(entries => {-->
<!--    for (let entry of entries) {-->
<!--      beforeWidth.value = (entry as any).target['offsetWidth']-->
<!--    }-->
<!--  }).observe((beforeInput.value as HTMLElement));-->
<!--  new ResizeObserver(entries => {-->
<!--    for (let entry of entries) {-->
<!--      afterWidth.value = (entry as any)?.target['offsetWidth']-->
<!--      afterWidth.value = afterWidth.value && afterWidth.value > 10 ? afterWidth.value : 10-->
<!--    }-->
<!--  }).observe((afterInput.value as HTMLElement));-->
<!--  headerHeight.value = <number>document.querySelector("header")?.offsetHeight-->
<!--})-->
<!--</script>-->

<!--<template>-->
<!--  <Combobox v-model="selected">-->
<!--    <div class="relative mt-1">-->
<!--      <div-->
<!--        class="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm"-->
<!--      >-->
<!--        <ComboboxInput-->
<!--          class="peer relative w-full min-h-[36px] cursor-default rounded-md text-left text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6"-->
<!--          :class="[!isInvalid||'is-invalid ring-2 ring-red-500 scroll-mt-10',-->
<!--      !(mode === 'outlined')||'border-[1px] border-gray-300 dark:border-gray-600 bg-white dark:bg-black focus:ring-2 focus:border-transparent',-->
<!--      !(mode === 'underlined')||'rounded-none border-0 border-gray-300 dark:border-gray-700 border-b-[1px] shadow-none bg-stone-50 dark:bg-stone-950 focus:border-b-[1px] focus:border-indigo-400 focus:dark:border-indigo-600 focus:ring-0',-->
<!--      !(mode === 'filled')||'border-0 bg-stone-100 dark:bg-stone-900 focus:ring-2 disabled:bg-stone-100 disabled:dark:bg-stone-900 disabled:border-dotted disabled:border-2 disabled:border-slate-200',-->
<!--      props.class]"-->
<!--          :displayValue="(person) => person.name"-->
<!--          @change="query = $event.target.value"-->
<!--        />-->
<!--&lt;!&ndash;          class="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"&ndash;&gt;-->
<!--        <ComboboxButton-->
<!--          class="absolute inset-y-0 right-0 flex items-center pr-2"-->
<!--        >-->
<!--          <span v-if="selected" class="flex items-center">-->
<!--            <slot name="selected" :selected="selected"/>-->
<!--          </span>-->
<!--          <div ref="beforeInput" class="absolute inset-y-0 left-0 flex items-center pl-3 pr-1">-->
<!--            <slot name="before"/>-->
<!--          </div>-->
<!--          <span ref="afterInput" class="absolute inset-y-0 right-0 flex items-center">-->
<!--            <ChevronUpDownIcon v-if="selectIcon==='ChevronUpDownIcon'" class="h-5 w-5 text-gray-400" aria-hidden="true" />-->
<!--            <ChevronDownIcon v-else-if="selectIcon==='ChevronDownIcon'" class="h-5 w-5 text-gray-400" aria-hidden="true" />-->
<!--            <slot name="after"/>-->
<!--            <Dropdown v-if="help?.length" :content="help">-->
<!--              <template #head>-->
<!--                <QuestionMarkCircleIcon class="h-5 w-5 mr-2 mt-[6px] text-gray-400" aria-hidden="true" />-->
<!--              </template>-->
<!--            </Dropdown>-->
<!--            <Dropdown v-if="isInvalid" :content="messageInvalid">-->
<!--              <template #head>-->
<!--                <ExclamationCircleIcon class="h-5 w-5 mr-2 mt-[6px] text-red-500" aria-hidden="true" />-->
<!--              </template>-->
<!--            </Dropdown>-->
<!--            <transition leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100" leave-to-class="opacity-0"-->
<!--                        enter-active-class="transition ease-in duration-200" enter-from-class="opacity-0" enter-to-class="opacity-100">-->
<!--              <XCircleIcon v-if="clear && selected" class="h-5 w-5 mr-2 text-gray-400 z-30" aria-hidden="true" @click.stop="selected = ''" />-->
<!--            </transition>-->
<!--          </span>-->
<!--        </ComboboxButton>-->
<!--        <Label :title="label"-->
<!--               :type="labelType"-->
<!--               :mode="mode"-->
<!--               :is-required="isRequired"-->
<!--               :is-disabled="isDisabled"-->
<!--               :translate-x="beforeWidth||10"-->
<!--               :max-width="input?.['offsetWidth']"/>-->
<!--      </div>-->
<!--      <TransitionRoot-->
<!--        leave="transition ease-in duration-100"-->
<!--        leaveFrom="opacity-100"-->
<!--        leaveTo="opacity-0"-->
<!--        @after-leave="query = ''"-->
<!--      >-->
<!--        <ComboboxOptions-->
<!--          class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-50"-->
<!--        >-->
<!--          <div-->
<!--            v-if="filteredPeople.length === 0 && query !== ''"-->
<!--            class="relative cursor-default select-none py-2 px-4 text-gray-700"-->
<!--          >-->
<!--            Nothing found.-->
<!--          </div>-->
<!--          -->
<!--          <ComboboxOption-->
<!--            v-for="person in filteredPeople"-->
<!--            as="template"-->
<!--            :key="person.id"-->
<!--            :value="person"-->
<!--            v-slot="{ selected, active }"-->
<!--          >-->
<!--            <li-->
<!--              class="relative cursor-default select-none py-2 pl-10 pr-4"-->
<!--              :class="{-->
<!--                  'bg-teal-600 text-white': active,-->
<!--                  'text-gray-900': !active,-->
<!--                }"-->
<!--            >-->
<!--                <span-->
<!--                  class="block truncate"-->
<!--                  :class="{ 'font-medium': selected, 'font-normal': !selected }"-->
<!--                >-->
<!--                  {{ person.name }}-->
<!--                </span>-->
<!--              <span-->
<!--                v-if="selected"-->
<!--                class="absolute inset-y-0 left-0 flex items-center pl-3"-->
<!--                :class="{ 'text-white': active, 'text-teal-600': !active }"-->
<!--              >-->
<!--                  <CheckIcon class="h-5 w-5" aria-hidden="true" />-->
<!--                </span>-->
<!--            </li>-->
<!--          </ComboboxOption>-->
<!--        </ComboboxOptions>-->
<!--      </TransitionRoot>-->
<!--    </div>-->
<!--  </Combobox>-->
<!--&lt;!&ndash;  <Listbox as="div" v-model="selected" @update:model-value="">&ndash;&gt;-->
<!--&lt;!&ndash;    <div :id="id" ref="inputBody" class="relative my-6 w-full">&ndash;&gt;-->
<!--&lt;!&ndash;      <ListboxButton&ndash;&gt;-->
<!--&lt;!&ndash;        ref="input"&ndash;&gt;-->
<!--&lt;!&ndash;        :placeholder="placeholder"&ndash;&gt;-->
<!--&lt;!&ndash;        :autocomplete="autocomplete"&ndash;&gt;-->
<!--&lt;!&ndash;        class="peer relative w-full min-h-[36px] cursor-default rounded-md text-left text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6"&ndash;&gt;-->
<!--&lt;!&ndash;        :class="[!isInvalid||'ring-2 ring-red-500', props.class||'py-1.5 bg-white shadow-sm ring-1 ring-inset ring-gray-300 min-w-[10rem]']"&ndash;&gt;-->
<!--&lt;!&ndash;        :style="`padding-left: ${beforeInput?.['offsetWidth']||10}px; padding-right: ${afterInput?.['offsetWidth']||10}px;`"&ndash;&gt;-->
<!--&lt;!&ndash;      >&ndash;&gt;-->
<!--&lt;!&ndash;        <span v-if="selected" class="flex items-center">&ndash;&gt;-->
<!--&lt;!&ndash;          <slot name="selected" :selected="selected"/>&ndash;&gt;-->
<!--&lt;!&ndash;        </span>&ndash;&gt;-->
<!--&lt;!&ndash;        <div ref="beforeInput" class="absolute inset-y-0 left-0 flex items-center pl-3 pr-1">&ndash;&gt;-->
<!--&lt;!&ndash;          <slot name="before"/>&ndash;&gt;-->
<!--&lt;!&ndash;        </div>&ndash;&gt;-->
<!--&lt;!&ndash;        <span ref="afterInput" class="absolute inset-y-0 right-0 flex items-center">&ndash;&gt;-->
<!--&lt;!&ndash;          <ChevronUpDownIcon v-if="selectIcon==='ChevronUpDownIcon'" class="h-5 w-5 text-gray-400" aria-hidden="true" />&ndash;&gt;-->
<!--&lt;!&ndash;          <ChevronDownIcon v-else-if="selectIcon==='ChevronDownIcon'" class="h-5 w-5 text-gray-400" aria-hidden="true" />&ndash;&gt;-->
<!--&lt;!&ndash;          <slot name="after"/>&ndash;&gt;-->
<!--&lt;!&ndash;          <Dropdown v-if="help?.length" :content="help">&ndash;&gt;-->
<!--&lt;!&ndash;            <template #head>&ndash;&gt;-->
<!--&lt;!&ndash;              <QuestionMarkCircleIcon class="h-5 w-5 mr-2 mt-[6px] text-gray-400" aria-hidden="true" />&ndash;&gt;-->
<!--&lt;!&ndash;            </template>&ndash;&gt;-->
<!--&lt;!&ndash;          </Dropdown>&ndash;&gt;-->
<!--&lt;!&ndash;          <Dropdown v-if="isInvalid" :content="messageInvalid">&ndash;&gt;-->
<!--&lt;!&ndash;            <template #head>&ndash;&gt;-->
<!--&lt;!&ndash;              <ExclamationCircleIcon class="h-5 w-5 mr-2 mt-[6px] text-red-500" aria-hidden="true" />&ndash;&gt;-->
<!--&lt;!&ndash;            </template>&ndash;&gt;-->
<!--&lt;!&ndash;          </Dropdown>&ndash;&gt;-->
<!--&lt;!&ndash;          <transition leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100" leave-to-class="opacity-0"&ndash;&gt;-->
<!--&lt;!&ndash;                      enter-active-class="transition ease-in duration-200" enter-from-class="opacity-0" enter-to-class="opacity-100">&ndash;&gt;-->
<!--&lt;!&ndash;            <XCircleIcon v-if="clear && selected" class="h-5 w-5 mr-2 text-gray-400 z-30" aria-hidden="true" @click.stop="selected = ''" />&ndash;&gt;-->
<!--&lt;!&ndash;          </transition>&ndash;&gt;-->
<!--&lt;!&ndash;        </span>&ndash;&gt;-->
<!--&lt;!&ndash;      </ListboxButton>&ndash;&gt;-->
<!--&lt;!&ndash;      <Label :title="label"&ndash;&gt;-->
<!--&lt;!&ndash;             :type="labelType"&ndash;&gt;-->
<!--&lt;!&ndash;             :mode="mode"&ndash;&gt;-->
<!--&lt;!&ndash;             :is-required="isRequired"&ndash;&gt;-->
<!--&lt;!&ndash;             :is-disabled="isDisabled"&ndash;&gt;-->
<!--&lt;!&ndash;             :translate-x="beforeWidth||10"&ndash;&gt;-->
<!--&lt;!&ndash;             :max-width="input?.['offsetWidth']"&ndash;&gt;-->
<!--&lt;!&ndash;      />&ndash;&gt;-->
<!--&lt;!&ndash;      <p&ndash;&gt;-->
<!--&lt;!&ndash;        class="absolute block text-red-600 text-sm truncate ml-1"&ndash;&gt;-->
<!--&lt;!&ndash;        :class="[isInvalid ? 'visible' : 'invisible']"&ndash;&gt;-->
<!--&lt;!&ndash;        :style="`max-width: ${inputBody?.['offsetWidth']||10}px`"&ndash;&gt;-->
<!--&lt;!&ndash;      >&ndash;&gt;-->
<!--&lt;!&ndash;        {{ messageInvalid }}&ndash;&gt;-->
<!--&lt;!&ndash;      </p>&ndash;&gt;-->
<!--&lt;!&ndash;      <transition leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100" leave-to-class="opacity-0">&ndash;&gt;-->
<!--&lt;!&ndash;        <ListboxOptions class="absolute min-w-max z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">&ndash;&gt;-->
<!--&lt;!&ndash;          <ListboxOption as="template" v-for="(item, key) in items" :key="key" :value="item" v-slot="{ active, selected }">&ndash;&gt;-->
<!--&lt;!&ndash;            <li :class="[!selected || active ||'bg-indigo-100', active ? 'bg-indigo-600 text-white' : 'text-gray-900', 'relative cursor-default select-none py-2 pl-3 pr-9']">&ndash;&gt;-->
<!--&lt;!&ndash;              <div class="flex items-center">&ndash;&gt;-->
<!--&lt;!&ndash;                <slot name="item" :item="item"/>&ndash;&gt;-->
<!--&lt;!&ndash;              </div>&ndash;&gt;-->
<!--&lt;!&ndash;              <span v-if="selected" :class="[active ? 'text-white' : 'text-indigo-600', 'absolute inset-y-0 right-0 flex items-center pr-4']">&ndash;&gt;-->
<!--&lt;!&ndash;                <CheckIcon class="h-5 w-5" aria-hidden="true" />&ndash;&gt;-->
<!--&lt;!&ndash;              </span>&ndash;&gt;-->
<!--&lt;!&ndash;            </li>&ndash;&gt;-->
<!--&lt;!&ndash;          </ListboxOption>&ndash;&gt;-->
<!--&lt;!&ndash;          <div v-if="!items.length" class="my-2 text-center">&ndash;&gt;-->
<!--&lt;!&ndash;            Нет данных&ndash;&gt;-->
<!--&lt;!&ndash;          </div>&ndash;&gt;-->
<!--&lt;!&ndash;        </ListboxOptions>&ndash;&gt;-->
<!--&lt;!&ndash;      </transition>&ndash;&gt;-->
<!--&lt;!&ndash;    </div>&ndash;&gt;-->
<!--&lt;!&ndash;  </Listbox>&ndash;&gt;-->
<!--</template>-->