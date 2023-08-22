<script setup lang="ts">
import {computed, getCurrentInstance, onMounted, reactive, ref, watch} from "vue";
import InputLayout, {type ILayout} from "@/components/functional/inputLayout.vue";
import {ArrowsPointingOutIcon, ArrowsPointingInIcon} from "@heroicons/vue/20/solid";
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'
import {QuillEditor, type Delta} from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import '@vueup/vue-quill/dist/vue-quill.bubble.css';
import {getParamsStructure} from "@/helpers/object";
// ---------------------------------------
declare type ContentPropType = string | Delta | undefined | null;
declare type Module = {
  name: string;
  module: unknown;
  options?: object;
};
export interface IDataTextEditor {
  content: ContentPropType
  contentType: "delta" | "html" | "text"
  enable: boolean
  readOnly: boolean
  theme: "snow" | "bubble"
  toolbar: "essential" | "minimal" | "full" | string | object | Array<any>
  modules: Module | Module[]
  options: any
  globalOptions: any;
}
export interface ITextEditor extends Omit<ILayout, "value">{
  id?: string
  modelValue?: string|number|null|undefined,
  paramsTextEditor?: Partial<IDataTextEditor>
}
// ---------------------------------------
const props = defineProps<ITextEditor>()
const emit = defineEmits<{
  (event: 'update:modelValue', payload: string): void;
  (event: 'update:isInvalid', payload: boolean): void;
  (event: 'change:modelValue', payload: boolean): void;
}>();
// ---------------------------------------
const open = ref(false)
const quillEditor = ref<any>()
const isActiveTextEditor = ref<boolean>(false)
const additionalStyles = ref<string>('max-h-max h-max')
// ---------------------------------------
const id = ref<NonNullable<ITextEditor["id"]>>(String(props.id||getCurrentInstance()?.uid))
const theme = ref<NonNullable<IDataTextEditor["theme"]>>(props.paramsTextEditor?.theme || "bubble")
const value = computed<string>(()=> String(props.modelValue || ""))
const isValue = computed<boolean>(()=> Boolean(value.value ? String(value.value).length : value.value || isActiveTextEditor.value))
const mode = computed<NonNullable<ILayout["mode"]>>(()=> props.mode || "outlined")
const isDisabled = computed<NonNullable<ITextEditor["disabled"]>>(()=> props.disabled || false)
const isInvalid = computed<NonNullable<ITextEditor["isInvalid"]>>(()=> !isDisabled.value ? props.isInvalid : false)
const messageInvalid = computed<NonNullable<ITextEditor["messageInvalid"]>>(()=> props.messageInvalid || "")
const classLayout = computed<NonNullable<ILayout["class"]>>(()=> { return props.class ? props.class + additionalStyles.value : additionalStyles.value })
// ---------------------------------------
const inputLayout = reactive({value: "", isValue: isValue, mode: mode.value, label: props.label,
  labelMode: props.labelMode, isInvalid: isInvalid.value, messageInvalid: messageInvalid.value,
  required: props.required, loading: props.loading, disabled: isDisabled.value, help: props.help, clear: props.clear,
  classBody: props.classBody, class: classLayout.value})
// ---------------------------------------
const paramsQuillEditor = computed<NonNullable<Partial<IDataTextEditor>>>(()=>{return {
  content: value.value,
  readOnly: isDisabled.value,
  contentType: "html",
  toolbar: [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],

    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
    [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
    // [{ 'direction': 'rtl' }],                         // text direction

    // [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'font': [] }],
    [{ 'align': [] }],
    [ 'link', 'image' ],

    ['clean']                                         // remove formatting button
  ],
  ...props.paramsTextEditor
} })
// ---------------------------------------
watch(isInvalid, ()=>{
  inputLayout.isInvalid = isInvalid.value
})
watch(messageInvalid, ()=>{
  inputLayout.messageInvalid = messageInvalid.value
})
watch(theme, (theme)=>{
  open.value = theme === "snow" ? true : theme === "bubble" ? false : false
})
watch(isActiveTextEditor, (value)=>{
  inputLayout.class = (props.class||"")+(value
    ? ` outline-none ring-2 ring-inset ring-indigo-600 dark:ring-indigo-400 ${additionalStyles.value}`
    : " " + additionalStyles.value)
})
// ---------------------------------------
function inputModelValue(value:any) {
  emit('update:isInvalid', false)
  emit('update:modelValue', value)
}
function changeModelValue(value:any) {
  emit('change:modelValue', value)
}
function clear() {
  isActiveTextEditor.value = false
  inputModelValue('<p></p>')
  changeModelValue('<p></p>')
}
function ready() {
  setTimeout(()=> { inputLayout.value = quillEditor.value.editor.innerText },100)
}
</script>

<template>
  <InputLayout v-bind="inputLayout" @clear="clear">
    <div class="editor-small max-h-20">
      <QuillEditor v-if="theme ==='bubble'"
                   ref="quillEditor"
                   theme="bubble"
                   v-bind="getParamsStructure(paramsQuillEditor, ['theme'])"
                   @update:content="inputModelValue" @focus="isActiveTextEditor = true"
                   @blur="isActiveTextEditor = false" @ready="ready"/>
    </div>
    <template #body>
      <TransitionRoot as="template" :show="open">
        <Dialog as="div" class="relative z-10" @close="theme = 'bubble'">
          <TransitionChild as="template"
                           enter="ease-out duration-1000" enter-from="opacity-0" enter-to="opacity-100"
                           leave="ease-in duration-500" leave-from="opacity-100" leave-to="opacity-0">
            <div class="fixed inset-0 bg-gray-400 bg-opacity-75 dark:bg-gray-700 dark:bg-opacity-75 transition-opacity" />
          </TransitionChild>
          <div class="fixed inset-0 z-10 overflow-y-auto">
            <div class="flex min-h-full items-start justify-center p-4 text-center sm:items-center sm:p-0">
              <TransitionChild as="template"
                               enter="ease-in-out duration-1000" enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to="opacity-100 translate-y-0 sm:scale-100"
                               leave="ease-in-out duration-500" leave-from="opacity-100 translate-y-0 sm:scale-100" leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
                <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:m-5 sm:w-full sm:max-w-5xl sm:max-h-[40rem]">
                  <div class="editor" :class="['dark:text-gray-400',
                  !(mode === 'outlined')||'bg-white dark:bg-black',
                  !(mode === 'underlined')||'bg-stone-50 dark:bg-stone-950',
                  !(mode === 'filled')||'bg-stone-100 dark:bg-stone-900']">
                    <QuillEditor v-if="theme ==='snow'" theme="snow" v-bind="getParamsStructure(paramsQuillEditor, ['theme'])" @update:content="inputModelValue"/>
                    <div class="absolute top-[5px] right-[5px] border-[1px] dark:border-neutral-800 rounded-md flex text-left h-[36px] hover:bg-neutral-100 dark:hover:bg-neutral-800" @click="theme = 'bubble'">
                      <div class="group inline-flex justify-center items-center text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 hover:dark:text-gray-100">
                        <ArrowsPointingInIcon aria-hidden="true" class="h-5 w-5 mx-2 text-gray-600 dark:text-gray-600"/>
                      </div>
                    </div>
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
      <div class="relative flex text-left h-[36px]" @click="theme = 'snow'">
        <div class="group inline-flex justify-center items-center text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 hover:dark:text-gray-100">
          <ArrowsPointingOutIcon aria-hidden="true" class="h-5 w-5 mx-2 text-gray-400 dark:text-gray-600"/>
        </div>
      </div>
      <slot name="after"/></template>
  </InputLayout>
</template>
<style>
@media (prefers-color-scheme: light) {
  :root{
    --active-color-quill-editor: #cc0030;
    --border-quill-editor: #f2f2f2;
    --placeholder-quill-editor: #00000099;
    --background-quill-editor: #f6f3f4;
    --background-picker-options-quill-editor: #f5f5f5;
  }
}
@media (prefers-color-scheme: dark) {
  :root {
    --active-color-quill-editor: #cc0030;
    --border-quill-editor: #212121;
    --placeholder-quill-editor: #ffffff99;
    --background-quill-editor: #212121;
    --background-picker-options-quill-editor: #131313;
  }
}
.editor-small .ql-editor{
  padding: 9px 5px;
}
.editor .ql-toolbar{
  border: none;
  border-bottom: 1px solid var(--border-quill-editor);
  padding-right: 2rem;
}
.editor .ql-toolbar .ql-formats{
  margin-right: 10px;
}
.editor .ql-container{
  height: calc(100vh - 40vh);
  padding: 0 1rem;
  border: none;
}
.editor .ql-editor::-webkit-scrollbar {
  display: none;
}
.editor .ql-formats{
  margin: 2px;
  border: 1px solid var(--border-quill-editor);
  border-radius: 5px;
}
@media (max-width: 600px){
  .editor .ql-container{
    height: calc(100vh - 170px);
  }
}
.editor .ql-toolbar.ql-snow .ql-picker, .editor .ql-snow.ql-toolbar button{
  margin: 0;
  border-radius: 3px;
}
.editor .ql-toolbar .ql-picker .ql-picker-label{
  border-color: transparent;
  border-radius: 3px;
}
.editor .ql-toolbar .ql-picker.ql-expanded .ql-picker-options{
  border-color: transparent;
  border-radius: 5px;
  margin-top: 5px;
  background-color: var(--background-picker-options-quill-editor);
}
.editor .ql-snow .ql-picker-options .ql-picker-item{
  border-radius: 3px;
}
.editor .ql-toolbar.ql-snow .ql-picker.ql-expanded .ql-picker-label {
  border: 1px solid var(--border-quill-editor);
}
.editor .ql-snow.ql-toolbar button:hover, .ql-snow .ql-toolbar button:hover, .ql-snow.ql-toolbar button:focus, .ql-snow .ql-toolbar button:focus, .ql-snow.ql-toolbar button.ql-active, .ql-snow .ql-toolbar button.ql-active, .ql-snow.ql-toolbar .ql-picker-label:hover, .ql-snow .ql-toolbar .ql-picker-label:hover, .ql-snow.ql-toolbar .ql-picker-label.ql-active, .ql-snow .ql-toolbar .ql-picker-label.ql-active, .ql-snow.ql-toolbar .ql-picker-item:hover, .ql-snow .ql-toolbar .ql-picker-item:hover, .ql-snow.ql-toolbar .ql-picker-item.ql-selected, .ql-snow .ql-toolbar .ql-picker-item.ql-selected{
  background-color: var(--background-quill-editor);
  color: var(--active-color-quill-editor);
}
.editor .ql-snow.ql-toolbar button:hover .ql-fill, .ql-snow .ql-toolbar button:hover .ql-fill, .ql-snow.ql-toolbar button:focus .ql-fill, .ql-snow .ql-toolbar button:focus .ql-fill, .ql-snow.ql-toolbar button.ql-active .ql-fill, .ql-snow .ql-toolbar button.ql-active .ql-fill, .ql-snow.ql-toolbar .ql-picker-label:hover .ql-fill, .ql-snow .ql-toolbar .ql-picker-label:hover .ql-fill, .ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-fill, .ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-fill, .ql-snow.ql-toolbar .ql-picker-item:hover .ql-fill, .ql-snow .ql-toolbar .ql-picker-item:hover .ql-fill, .ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-fill, .ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-fill, .ql-snow.ql-toolbar button:hover .ql-stroke.ql-fill, .ql-snow .ql-toolbar button:hover .ql-stroke.ql-fill, .ql-snow.ql-toolbar button:focus .ql-stroke.ql-fill, .ql-snow .ql-toolbar button:focus .ql-stroke.ql-fill, .ql-snow.ql-toolbar button.ql-active .ql-stroke.ql-fill, .ql-snow .ql-toolbar button.ql-active .ql-stroke.ql-fill, .ql-snow.ql-toolbar .ql-picker-label:hover .ql-stroke.ql-fill, .ql-snow .ql-toolbar .ql-picker-label:hover .ql-stroke.ql-fill, .ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-stroke.ql-fill, .ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-stroke.ql-fill, .ql-snow.ql-toolbar .ql-picker-item:hover .ql-stroke.ql-fill, .ql-snow .ql-toolbar .ql-picker-item:hover .ql-stroke.ql-fill, .ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-stroke.ql-fill, .ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-stroke.ql-fill{
  fill: var(--active-color-quill-editor);
}

.editor .ql-snow.ql-toolbar button:hover .ql-stroke, .ql-snow .ql-toolbar button:hover .ql-stroke, .ql-snow.ql-toolbar button:focus .ql-stroke, .ql-snow .ql-toolbar button:focus .ql-stroke, .ql-snow.ql-toolbar button.ql-active .ql-stroke, .ql-snow .ql-toolbar button.ql-active .ql-stroke, .ql-snow.ql-toolbar .ql-picker-label:hover .ql-stroke, .ql-snow .ql-toolbar .ql-picker-label:hover .ql-stroke, .ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-stroke, .ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-stroke, .ql-snow.ql-toolbar .ql-picker-item:hover .ql-stroke, .ql-snow .ql-toolbar .ql-picker-item:hover .ql-stroke, .ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-stroke, .ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-stroke, .ql-snow.ql-toolbar button:hover .ql-stroke-miter, .ql-snow .ql-toolbar button:hover .ql-stroke-miter, .ql-snow.ql-toolbar button:focus .ql-stroke-miter, .ql-snow .ql-toolbar button:focus .ql-stroke-miter, .ql-snow.ql-toolbar button.ql-active .ql-stroke-miter, .ql-snow .ql-toolbar button.ql-active .ql-stroke-miter, .ql-snow.ql-toolbar .ql-picker-label:hover .ql-stroke-miter, .ql-snow .ql-toolbar .ql-picker-label:hover .ql-stroke-miter, .ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-stroke-miter, .ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-stroke-miter, .ql-snow.ql-toolbar .ql-picker-item:hover .ql-stroke-miter, .ql-snow .ql-toolbar .ql-picker-item:hover .ql-stroke-miter, .ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-stroke-miter, .ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-stroke-miter{
  stroke: var(--active-color-quill-editor);
}
.editor .ql-snow.ql-toolbar button.ql-active .ql-stroke, .ql-snow .ql-toolbar button.ql-active .ql-stroke, .ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-stroke, .ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-stroke, .ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-stroke, .ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-stroke, .ql-snow.ql-toolbar button.ql-active .ql-stroke-miter, .ql-snow .ql-toolbar button.ql-active .ql-stroke-miter, .ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-stroke-miter, .ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-stroke-miter, .ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-stroke-miter, .ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-stroke-miter{
  stroke: var(--active-color-quill-editor);
}
.editor .ql-snow .ql-tooltip[data-mode=link]::before{
  content: 'Ваша ссылка'
}
.editor .ql-snow .ql-tooltip.ql-editing a.ql-action::after{
  content: 'Сохранить';
}
.editor-small .ql-editor.ql-blank::before, .editor .ql-editor.ql-blank::before{
  font-style: normal;
  color: var(--placeholder-quill-editor);
}
.editor-small .ql-editor.ql-blank::before{
  left: 6px;
}
.editor .ql-editor.ql-blank::before{
  padding: 0 17px;
}
</style>