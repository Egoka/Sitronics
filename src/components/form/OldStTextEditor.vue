<script setup lang="ts">
import {computed, getCurrentInstance, onMounted, reactive, ref, watch} from "vue";
import InputLayout, {type ILayout} from "@/components/functional/inputLayout.vue";
import {ArrowsPointingOutIcon, MagnifyingGlassIcon} from "@heroicons/vue/20/solid";
import {onkeydown} from "@/helpers/numbers";
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'
import Quill from "quill";
import "quill/dist/quill.core.css";
import "quill/dist/quill.bubble.css";
import "quill/dist/quill.snow.css";
// ---------------------------------------
export interface IDataTextEditor {
  placeholder?: string
  theme?: "bubble" | "snow"
}
export interface IAria extends Omit<ILayout, "value">{
  id?: string
  modelValue: string|number|null|undefined,
  paramsAria?: Partial<IDataTextEditor>
}
// ---------------------------------------
const props = defineProps<IAria>()
const emit = defineEmits<{
  (event: 'update:modelValue', payload: string): void;
  (event: 'update:isInvalid', payload: boolean): void;
  (event: 'change:modelValue', payload: boolean): void;
}>();
// ---------------------------------------
const QuillEl  = ref<Quill>()
const editor  = ref<Quill>()
const open = ref(false)
const isActiveAria = ref<boolean>(false)
const inputAria = ref<HTMLElement|undefined>()
const additionalStyles = ref<string>('max-h-max h-max')
// ---------------------------------------
const id = ref<NonNullable<IAria["id"]>>(String(props.id||getCurrentInstance()?.uid))
const theme = ref<NonNullable<IDataTextEditor["theme"]>>(props.paramsAria?.theme || "bubble")
const value = computed<string>(()=> String(props.modelValue || ""))
const placeholder = computed<NonNullable<IDataTextEditor["placeholder"]>>(()=> String(props.paramsAria?.placeholder || ""))
const isValue = computed<boolean>(()=> Boolean(value.value ? String(value.value).length : value.value || isActiveAria.value))
const mode = computed<NonNullable<ILayout["mode"]>>(()=> props.mode || "outlined")
const isDisabled = computed<NonNullable<IAria["disabled"]>>(()=> props.disabled || false)
const isInvalid = computed<NonNullable<IAria["isInvalid"]>>(()=> !isDisabled.value ? props.isInvalid : false)
const messageInvalid = computed<NonNullable<IAria["messageInvalid"]>>(()=> props.messageInvalid || "")
const classLayout = computed<NonNullable<ILayout["class"]>>(()=> {
  return props.class ? props.class + additionalStyles.value : additionalStyles.value
})
// ---------------------------------------
const inputLayout = reactive({value: value.value, isValue: isValue, mode: mode.value, label: props.label,
  labelMode: props.labelMode, isInvalid: isInvalid.value, messageInvalid: messageInvalid.value,
  required: props.required, loading: props.loading, disabled: isDisabled.value, help: props.help, clear: props.clear,
  classBody: props.classBody, class: classLayout.value})
// ---------------------------------------
onMounted(()=>{
  editor.value = <Quill>new Quill((QuillEl.value as Element), {
    theme: theme.value,
    placeholder: placeholder.value,
  });
  // console.log(editor.value)
  (editor.value as Quill).root.innerHTML = value.value;
  (editor.value as Quill).on("text-change", function () { return update() });
  
  document.addEventListener( 'click', (e) => {
    if (isActiveAria.value) {
      isActiveAria.value = e.composedPath().includes((inputAria.value as HTMLElement))
    }
  })
})
watch(value, (value)=>{
  inputLayout.value = value
})
watch(isInvalid, ()=>{
  inputLayout.isInvalid = isInvalid.value
})
watch(messageInvalid, ()=>{
  inputLayout.messageInvalid = messageInvalid.value
})
watch(theme, (theme)=>{
  open.value = theme === "snow" ? true : theme === "bubble" ? false : false
  setTimeout(()=>{
    editor.value = <Quill>new Quill((QuillEl.value as Element), {
      modules: {
        toolbar: [
          [{ header: [1, 2, false] }],
          ['bold', 'italic', 'underline'],
          ['image', 'code-block'],
        ]
      },
      theme: theme,
      formats: ["bold", "underline", "header", "italic", "link"],
      placeholder: placeholder.value,
    });
    (editor.value as Quill).root.innerHTML = value.value;
    (editor.value as Quill).on("text-change", function () { return update() });
  },10)
})
watch(isActiveAria, (value)=>{
  inputLayout.class = (props.class||"")+(value
    ? ` outline-none ring-2 ring-inset ring-indigo-600 dark:ring-indigo-400 ${additionalStyles.value}`
    : " " + additionalStyles.value)
})
// ---------------------------------------
function update() {
  inputModelValue((editor.value as Quill).getText() ?(editor.value as Quill).root.innerHTML : "")
}
function inputModelValue(value:any) {
  emit('update:isInvalid', false)
  emit('update:modelValue', value)
}
function changeModelValue(value:any) {
  emit('change:modelValue', value)
}
function clear() {
  isActiveAria.value = false
  inputModelValue('')
  changeModelValue('')
}

</script>

<template>
  {{theme}}
  <InputLayout v-bind="inputLayout" @clear="clear">
    <div class="editor-small max-h-20">
      <div v-if="theme ==='bubble'" ref="QuillEl"></div>
    </div>
    <template #body>
      <TransitionRoot as="template" :show="open">
        <Dialog as="div" class="relative z-10" @close="theme = 'bubble'">
          <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
            <div class="fixed inset-0 bg-gray-400 bg-opacity-75 dark:bg-gray-700 dark:bg-opacity-75 transition-opacity" />
          </TransitionChild>
          <div class="fixed inset-0 z-10 overflow-y-auto">
            <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leave-from="opacity-100 translate-y-0 sm:scale-100" leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
                <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl">
                  <div :class="['editor dark:text-gray-100',
                  !(mode === 'outlined')||'bg-white dark:bg-black',
                  !(mode === 'underlined')||'bg-stone-50 dark:bg-stone-950',
                  !(mode === 'filled')||'bg-stone-100 dark:bg-stone-900']">
                    <div v-if="theme ==='snow'" ref="QuillEl"></div>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </TransitionRoot>
    </template>
    <template #before><slot name="before"/></template>
    <template #after>
      <div class="relative flex text-left h-[36px]" @click.stop="theme = 'snow'">
        <div class="group inline-flex justify-center items-center text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 hover:dark:text-gray-100">
          <ArrowsPointingOutIcon aria-hidden="true" class="h-5 w-5 mx-2 text-gray-400 dark:text-gray-600"/>
        </div>
      </div>
      <slot name="after"/></template>
  </InputLayout>
</template>
<style scoped>
</style>
<style>
.editor .ql-toolbar{
  border: none;
}
.editor .ql-container{
  height: 30rem;
  padding: 0 1rem;
  border: none;
}
.editor-small .ql-editor{
  padding: 9px 5px;
}

</style>