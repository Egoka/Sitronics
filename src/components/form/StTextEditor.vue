<script setup lang="ts">
import {computed, getCurrentInstance, reactive, ref, watch} from "vue";
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
  placeholder: string
  theme: "snow" | "bubble"
  toolbar: "essential" | "minimal" | "full" | string | object | Array<any>
  modules: Module | Module[]
  options: any
  globalOptions: any;
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
const open = ref(false)
const isActiveAria = ref<boolean>(false)
const additionalStyles = ref<string>('max-h-max h-max')
// ---------------------------------------
const id = ref<NonNullable<IAria["id"]>>(String(props.id||getCurrentInstance()?.uid))
const theme = ref<NonNullable<IDataTextEditor["theme"]>>(props.paramsAria?.theme || "bubble")
const value = computed<string>(()=> String(props.modelValue || ""))
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
const paramsQuillEditor = computed<Partial<IDataTextEditor>>(()=>{return {
  content: value.value,
  contentType: "html",
  placeholder: "Ваш текст",
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
  ...props.paramsAria
} })
// ---------------------------------------
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
})
watch(isActiveAria, (value)=>{
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
  isActiveAria.value = false
  inputModelValue('<p></p>')
  changeModelValue('<p></p>')
}
</script>

<template>
  <InputLayout v-bind="inputLayout" @clear="clear">
    <div class="editor-small max-h-20">
      <QuillEditor v-if="theme ==='bubble'" theme="bubble" v-bind="getParamsStructure(paramsQuillEditor, ['theme'])" @update:content="inputModelValue" @focus="isActiveAria = true" @blur="isActiveAria = false" />
    </div>
    <template #body>
      <TransitionRoot as="template" :show="open">
        <Dialog as="div" class="relative z-10" @close="theme = 'bubble'">
          <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
            <div class="fixed inset-0 bg-gray-400 bg-opacity-75 dark:bg-gray-700 dark:bg-opacity-75 transition-opacity" />
          </TransitionChild>
          <div class="fixed inset-0 z-10 overflow-y-auto">
            <div class="flex min-h-full items-start justify-center p-4 text-center sm:items-center sm:p-0">
              <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leave-from="opacity-100 translate-y-0 sm:scale-100" leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
                <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:m-5 sm:w-full sm:max-w-5xl sm:max-h-[40rem]">
                  <div class="editor" :class="['dark:text-gray-100',
                  !(mode === 'outlined')||'bg-white dark:bg-black',
                  !(mode === 'underlined')||'bg-stone-50 dark:bg-stone-950',
                  !(mode === 'filled')||'bg-stone-100 dark:bg-stone-900']">
                    <QuillEditor v-if="theme ==='snow'" theme="snow" v-bind="getParamsStructure(paramsQuillEditor, ['theme'])" @update:content="inputModelValue"/>
                    <div class="absolute top-[5px] right-[5px] border-[1px] rounded-md flex text-left h-[36px] hover:bg-neutral-100" @click.stop="theme = 'bubble'">
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
      <div class="relative flex text-left h-[36px]" @click.stop="theme = 'snow'">
        <div class="group inline-flex justify-center items-center text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 hover:dark:text-gray-100">
          <ArrowsPointingOutIcon aria-hidden="true" class="h-5 w-5 mx-2 text-gray-400 dark:text-gray-600"/>
        </div>
      </div>
      <slot name="after"/></template>
  </InputLayout>
</template>
<style>
.editor-small .ql-editor{
  padding: 9px 5px;
}
.editor .ql-toolbar{
  border: none;
  border-bottom: 1px solid #f2f2f2;
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
  border: 1px solid #f2f2f2;
  border-radius: 5px;
}
@media (max-width: 600px){
  .editor .ql-container{
    height: calc(100vh - 170px);
  }
}
.editor .ql-toolbar.ql-snow .ql-picker, .editor .ql-snow.ql-toolbar button{
  margin: 0;
}
.editor .ql-snow.ql-toolbar button:hover, .ql-snow .ql-toolbar button:hover, .ql-snow.ql-toolbar button:focus, .ql-snow .ql-toolbar button:focus, .ql-snow.ql-toolbar button.ql-active, .ql-snow .ql-toolbar button.ql-active, .ql-snow.ql-toolbar .ql-picker-label:hover, .ql-snow .ql-toolbar .ql-picker-label:hover, .ql-snow.ql-toolbar .ql-picker-label.ql-active, .ql-snow .ql-toolbar .ql-picker-label.ql-active, .ql-snow.ql-toolbar .ql-picker-item:hover, .ql-snow .ql-toolbar .ql-picker-item:hover, .ql-snow.ql-toolbar .ql-picker-item.ql-selected, .ql-snow .ql-toolbar .ql-picker-item.ql-selected{
  background-color: #f6f3f4;
  color: #b22137;
}
.editor .ql-snow.ql-toolbar button:hover .ql-fill, .ql-snow .ql-toolbar button:hover .ql-fill, .ql-snow.ql-toolbar button:focus .ql-fill, .ql-snow .ql-toolbar button:focus .ql-fill, .ql-snow.ql-toolbar button.ql-active .ql-fill, .ql-snow .ql-toolbar button.ql-active .ql-fill, .ql-snow.ql-toolbar .ql-picker-label:hover .ql-fill, .ql-snow .ql-toolbar .ql-picker-label:hover .ql-fill, .ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-fill, .ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-fill, .ql-snow.ql-toolbar .ql-picker-item:hover .ql-fill, .ql-snow .ql-toolbar .ql-picker-item:hover .ql-fill, .ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-fill, .ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-fill, .ql-snow.ql-toolbar button:hover .ql-stroke.ql-fill, .ql-snow .ql-toolbar button:hover .ql-stroke.ql-fill, .ql-snow.ql-toolbar button:focus .ql-stroke.ql-fill, .ql-snow .ql-toolbar button:focus .ql-stroke.ql-fill, .ql-snow.ql-toolbar button.ql-active .ql-stroke.ql-fill, .ql-snow .ql-toolbar button.ql-active .ql-stroke.ql-fill, .ql-snow.ql-toolbar .ql-picker-label:hover .ql-stroke.ql-fill, .ql-snow .ql-toolbar .ql-picker-label:hover .ql-stroke.ql-fill, .ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-stroke.ql-fill, .ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-stroke.ql-fill, .ql-snow.ql-toolbar .ql-picker-item:hover .ql-stroke.ql-fill, .ql-snow .ql-toolbar .ql-picker-item:hover .ql-stroke.ql-fill, .ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-stroke.ql-fill, .ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-stroke.ql-fill{
  fill: #cc0030;
}

.editor .ql-snow.ql-toolbar button:hover .ql-stroke, .ql-snow .ql-toolbar button:hover .ql-stroke, .ql-snow.ql-toolbar button:focus .ql-stroke, .ql-snow .ql-toolbar button:focus .ql-stroke, .ql-snow.ql-toolbar button.ql-active .ql-stroke, .ql-snow .ql-toolbar button.ql-active .ql-stroke, .ql-snow.ql-toolbar .ql-picker-label:hover .ql-stroke, .ql-snow .ql-toolbar .ql-picker-label:hover .ql-stroke, .ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-stroke, .ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-stroke, .ql-snow.ql-toolbar .ql-picker-item:hover .ql-stroke, .ql-snow .ql-toolbar .ql-picker-item:hover .ql-stroke, .ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-stroke, .ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-stroke, .ql-snow.ql-toolbar button:hover .ql-stroke-miter, .ql-snow .ql-toolbar button:hover .ql-stroke-miter, .ql-snow.ql-toolbar button:focus .ql-stroke-miter, .ql-snow .ql-toolbar button:focus .ql-stroke-miter, .ql-snow.ql-toolbar button.ql-active .ql-stroke-miter, .ql-snow .ql-toolbar button.ql-active .ql-stroke-miter, .ql-snow.ql-toolbar .ql-picker-label:hover .ql-stroke-miter, .ql-snow .ql-toolbar .ql-picker-label:hover .ql-stroke-miter, .ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-stroke-miter, .ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-stroke-miter, .ql-snow.ql-toolbar .ql-picker-item:hover .ql-stroke-miter, .ql-snow .ql-toolbar .ql-picker-item:hover .ql-stroke-miter, .ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-stroke-miter, .ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-stroke-miter{
  stroke: #b22137;
}
.editor .ql-snow.ql-toolbar button.ql-active .ql-stroke, .ql-snow .ql-toolbar button.ql-active .ql-stroke, .ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-stroke, .ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-stroke, .ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-stroke, .ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-stroke, .ql-snow.ql-toolbar button.ql-active .ql-stroke-miter, .ql-snow .ql-toolbar button.ql-active .ql-stroke-miter, .ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-stroke-miter, .ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-stroke-miter, .ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-stroke-miter, .ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-stroke-miter{
  stroke: #b22137;
}
.editor .ql-toolbar.ql-snow .ql-picker .ql-picker-label{
  border-color: transparent;
}
.editor .ql-snow .ql-tooltip[data-mode=link]::before{
  content: 'Ваша ссылка'
}
.editor .ql-snow .ql-tooltip.ql-editing a.ql-action::after{
  content: 'Сохранить';
}
.editor-small .ql-editor.ql-blank::before, .editor .ql-editor.ql-blank::before{
  font-style: normal;
}
.editor-small .ql-editor.ql-blank::before{
  left: 6px;
}
.editor .ql-editor.ql-blank::before{
  padding: 0 17px;
}
</style>