<script setup lang="ts">
import {computed, getCurrentInstance, ref, useSlots, watch} from "vue";
import InputLayout from "@/components/functional/InputLayout.vue";
import Button from "@/components/functional/Button.vue";
import Dialog from "@/components/functional/Dialog.vue";
import {ArrowsPointingOutIcon, ArrowsPointingInIcon} from "@heroicons/vue/20/solid";
import {QuillEditor} from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import '@vueup/vue-quill/dist/vue-quill.bubble.css';
import {cn} from "@/helpers/tailwind";
import type {ILayout} from "@/components/functional/InputLayout";
import type {IDataTextEditor, ITextEditor} from "@/components/form/StTextEditor";
// ---------------------------------------
const props = defineProps<ITextEditor>()
const emit = defineEmits<{
  (event: 'update:modelValue', payload: string): void;
  (event: 'update:isInvalid', payload: boolean): void;
  (event: 'change:modelValue', payload: boolean): void;
}>();
const slots = useSlots()
// ---------------------------------------
const valueLayout = ref<ILayout["value"]>()
const classLayout = ref<ILayout["class"]>()
const open = ref(false)
const quillEditor = ref<any>()
const isActiveTextEditor = ref<boolean>(false)
const additionalStyles = ref<string>('max-h-max h-max')
// ---------------------------------------
const id = ref<NonNullable<ITextEditor["id"]>>(String(props.id ?? getCurrentInstance()?.uid))
const theme = ref<NonNullable<ITextEditor["theme"]>>(props?.theme ?? "bubble")
const value = computed<string>(()=> String(props.modelValue ?? ""))
const isValue = computed<boolean>(()=> Boolean(value.value ? String(value.value).length : value.value ?? isActiveTextEditor.value))
const mode = computed<NonNullable<ILayout["mode"]>>(()=> props.mode ?? "outlined")
const isDisabled = computed<NonNullable<ITextEditor["disabled"]>>(()=> props.disabled ?? false)
const isLoading = computed<NonNullable<ITextEditor["isInvalid"]>>(()=> props.loading ?? false)
const isInvalid = computed<NonNullable<ITextEditor["isInvalid"]>>(()=> !isDisabled.value ? props.isInvalid : false)
const messageInvalid = computed<NonNullable<ITextEditor["messageInvalid"]>>(()=> props.messageInvalid ?? "")
const classStyle = computed<NonNullable<ILayout["class"]>>(()=> { return props.class ? props.class + additionalStyles.value : additionalStyles.value })
// ---------------------------------------
const inputLayout = computed(()=>({isValue: isValue.value, mode: mode.value, label: props.label,
  labelMode: props.labelMode, isInvalid: isInvalid.value, messageInvalid: messageInvalid.value,
  required: props.required, loading: isLoading.value, disabled: isDisabled.value, help: props.help, clear: props.clear,
  classBody: props.classBody, class: classStyle.value}))
// ---------------------------------------
const paramsQuillEditor = computed<NonNullable<Partial<IDataTextEditor>>>(()=>({
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
}))
// ---------------------------------------
watch(theme, (theme)=>{
  open.value = theme === "snow" ? true : theme === "bubble" ? false : false
})
watch(isActiveTextEditor, (value)=>{
  classLayout.value = (props.class??"")+(value
    ? ` border-theme-600 dark:border-theme-700 ring-2 ring-inset ring-theme-600 dark:ring-theme-700 ${additionalStyles.value}`
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
  setTimeout(()=> { valueLayout.value = quillEditor.value.editor.innerText },100)
}
// ---------------------------------------
</script>

<template>
  <InputLayout
    :value="valueLayout"
    :class="classLayout"
    v-bind="inputLayout"
    @clear="clear">
    <div class="editor-small max-h-20 caret-theme-500">
      <QuillEditor
        v-if="theme ==='bubble'"
        ref="quillEditor"
        theme="bubble"
        v-bind="paramsQuillEditor"
        @update:content="inputModelValue" @focus="isActiveTextEditor = true"
        @blur="isActiveTextEditor = false" @ready="ready"/>
    </div>
    <template #body>
      <Dialog
        v-model="open"
        @update:modelValue="theme = 'bubble'"
        class="p-0 max-w-screen-sm sm:max-w-5xl sm:m-3 sm:w-[90%] max-h-screen">
        <div
          :class="cn(
            'border rounded-md border-neutral-200 dark:border-neutral-800 dark:text-gray-400',
            !(mode === 'outlined')||'bg-white dark:bg-black',
            !(mode === 'underlined')||'bg-stone-50 dark:bg-stone-950',
            !(mode === 'filled')||'bg-stone-100 dark:bg-stone-900',
            'editor st-text-editor caret-theme-500'
            )">
          <QuillEditor
            v-if="theme ==='snow'"
            theme="snow"
            v-bind="paramsQuillEditor"
            @update:content="inputModelValue"/>
          <div class="absolute top-[5px] right-[5px]" @click="theme = 'bubble'">
            <Button
              type="icon"
              mode="outline"
              icon="ArrowsPointingIn"
              class-icon="text-neutral-500 dark:text-neutral-500"/>
          </div>
        </div>
      </Dialog>
      <slot/>
    </template>
    <template v-if="slots.before" #before><slot name="before"/></template>
    <template #after>
      <div class="relative flex text-left h-[36px]" @click="theme = 'snow'">
        <div class="group inline-flex justify-center items-center text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 hover:dark:text-gray-100 cursor-pointer">
          <ArrowsPointingOutIcon aria-hidden="true" class="h-5 w-5 mx-2 text-gray-400 dark:text-gray-600"/>
        </div>
      </div>
      <slot v-if="slots.after" name="after"/></template>
  </InputLayout>
</template>
<style>
.editor .ql-snow.ql-toolbar button:hover, .ql-snow .ql-toolbar button:hover, .ql-snow.ql-toolbar button:focus, .ql-snow .ql-toolbar button:focus, .ql-snow.ql-toolbar button.ql-active, .ql-snow .ql-toolbar button.ql-active, .ql-snow.ql-toolbar .ql-picker-label:hover, .ql-snow .ql-toolbar .ql-picker-label:hover, .ql-snow.ql-toolbar .ql-picker-label.ql-active, .ql-snow .ql-toolbar .ql-picker-label.ql-active, .ql-snow.ql-toolbar .ql-picker-item:hover, .ql-snow .ql-toolbar .ql-picker-item:hover, .ql-snow.ql-toolbar .ql-picker-item.ql-selected, .ql-snow .ql-toolbar .ql-picker-item.ql-selected{
  color: theme("colors.theme.500")
}
.editor .ql-snow.ql-toolbar button:hover .ql-fill, .ql-snow .ql-toolbar button:hover .ql-fill, .ql-snow.ql-toolbar button:focus .ql-fill, .ql-snow .ql-toolbar button:focus .ql-fill, .ql-snow.ql-toolbar button.ql-active .ql-fill, .ql-snow .ql-toolbar button.ql-active .ql-fill, .ql-snow.ql-toolbar .ql-picker-label:hover .ql-fill, .ql-snow .ql-toolbar .ql-picker-label:hover .ql-fill, .ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-fill, .ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-fill, .ql-snow.ql-toolbar .ql-picker-item:hover .ql-fill, .ql-snow .ql-toolbar .ql-picker-item:hover .ql-fill, .ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-fill, .ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-fill, .ql-snow.ql-toolbar button:hover .ql-stroke.ql-fill, .ql-snow .ql-toolbar button:hover .ql-stroke.ql-fill, .ql-snow.ql-toolbar button:focus .ql-stroke.ql-fill, .ql-snow .ql-toolbar button:focus .ql-stroke.ql-fill, .ql-snow.ql-toolbar button.ql-active .ql-stroke.ql-fill, .ql-snow .ql-toolbar button.ql-active .ql-stroke.ql-fill, .ql-snow.ql-toolbar .ql-picker-label:hover .ql-stroke.ql-fill, .ql-snow .ql-toolbar .ql-picker-label:hover .ql-stroke.ql-fill, .ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-stroke.ql-fill, .ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-stroke.ql-fill, .ql-snow.ql-toolbar .ql-picker-item:hover .ql-stroke.ql-fill, .ql-snow .ql-toolbar .ql-picker-item:hover .ql-stroke.ql-fill, .ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-stroke.ql-fill, .ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-stroke.ql-fill{
  fill:theme("colors.theme.500")
}
.editor .ql-snow.ql-toolbar button:hover .ql-stroke, .ql-snow .ql-toolbar button:hover .ql-stroke, .ql-snow.ql-toolbar button:focus .ql-stroke, .ql-snow .ql-toolbar button:focus .ql-stroke, .ql-snow.ql-toolbar button.ql-active .ql-stroke, .ql-snow .ql-toolbar button.ql-active .ql-stroke, .ql-snow.ql-toolbar .ql-picker-label:hover .ql-stroke, .ql-snow .ql-toolbar .ql-picker-label:hover .ql-stroke, .ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-stroke, .ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-stroke, .ql-snow.ql-toolbar .ql-picker-item:hover .ql-stroke, .ql-snow .ql-toolbar .ql-picker-item:hover .ql-stroke, .ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-stroke, .ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-stroke, .ql-snow.ql-toolbar button:hover .ql-stroke-miter, .ql-snow .ql-toolbar button:hover .ql-stroke-miter, .ql-snow.ql-toolbar button:focus .ql-stroke-miter, .ql-snow .ql-toolbar button:focus .ql-stroke-miter, .ql-snow.ql-toolbar button.ql-active .ql-stroke-miter, .ql-snow .ql-toolbar button.ql-active .ql-stroke-miter, .ql-snow.ql-toolbar .ql-picker-label:hover .ql-stroke-miter, .ql-snow .ql-toolbar .ql-picker-label:hover .ql-stroke-miter, .ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-stroke-miter, .ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-stroke-miter, .ql-snow.ql-toolbar .ql-picker-item:hover .ql-stroke-miter, .ql-snow .ql-toolbar .ql-picker-item:hover .ql-stroke-miter, .ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-stroke-miter, .ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-stroke-miter{
  stroke: theme("colors.theme.500")
}
.editor .ql-snow.ql-toolbar button.ql-active .ql-stroke, .ql-snow .ql-toolbar button.ql-active .ql-stroke, .ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-stroke, .ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-stroke, .ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-stroke, .ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-stroke, .ql-snow.ql-toolbar button.ql-active .ql-stroke-miter, .ql-snow .ql-toolbar button.ql-active .ql-stroke-miter, .ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-stroke-miter, .ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-stroke-miter, .ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-stroke-miter, .ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-stroke-miter{
  stroke: theme("colors.theme.500")
}
@media (prefers-color-scheme: light) {
  :root{
    --background-quill-toolbar: theme("colors.neutral.50");
    --border-quill-editor: theme("colors.neutral.200");
    --placeholder-quill-editor: #00000099;
    --background-quill-editor: #f6f3f4;
    --background-picker-options-quill-editor: #f5f5f5;
  }
}
@media (prefers-color-scheme: dark) {
  :root {
    --background-quill-toolbar: theme("colors.neutral.900");
    --border-quill-editor: theme("colors.neutral.800");
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
  border-top-left-radius: 0.375rem;
  border-top-right-radius: 0.375rem;
  background:var(--background-quill-toolbar);
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
.editor .ql-snow.ql-toolbar button:hover, .ql-snow .ql-toolbar button:hover, .ql-snow.ql-toolbar button:focus, .ql-snow .ql-toolbar button:focus, .ql-snow.ql-toolbar button.ql-active, .ql-snow .ql-toolbar button.ql-active, .ql-snow.ql-toolbar .ql-picker-label:hover, .ql-snow .ql-toolbar .ql-picker-label:hover, .ql-snow.ql-toolbar .ql-picker-label.ql-active, .ql-snow .ql-toolbar .ql-picker-label.ql-active, .ql-snow.ql-toolbar .ql-picker-item:hover, .ql-snow .ql-toolbar .ql-picker-item:hover, .ql-snow.ql-toolbar .ql-picker-item.ql-selected, .ql-snow .ql-toolbar .ql-picker-item.ql-selected {
  background-color: var(--background-quill-editor);
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