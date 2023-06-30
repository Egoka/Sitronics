<script setup lang="ts">
import {computed, onMounted, reactive, ref, watch} from "vue";
import * as HeroIcons from "@heroicons/vue/24/outline"
import Icons, {type IPropsIconsType} from "@/components/functional/Icons.vue";
import StInput, {type IInput} from "@/components/form/StInput.vue";
import StSelect, {type ISelect} from "@/components/form/StSelect.vue";
import type {ILabelMode} from "@/components/functional/Label.vue";
import {getValidate, getAsyncValidate, type Rules} from "@/helpers/rules";
// ---------------------------------------
export type IMode = 'outlined'|'underlined'|'filled'
type classCol = "col-span-full"|'sm:col-span-3'|'sm:col-span-4'|'sm:col-span-5'|'sm:col-span-6'|string
// ---------------------------------------
interface IFields {
  name: string
  rules?: Rules
  classCol: classCol
}
interface IFormFields {[key:string]:any}
// ---------------------------------------
export interface IFieldsInput extends IFields, IInput {
  typeComponent: "StInput"
  beforeIcon?: string
  beforeText?: string
  afterIcon?: string
  afterText?: string
}
const calculatedFieldsInput = ['typeComponent', 'classCol', 'modelValue', 'isInvalid', 'name', 'rules', 'beforeIcon', 'beforeText', 'afterIcon', 'afterText']
export interface IFieldsSelect extends IFields, ISelect {
  typeComponent: "StSelect"
}
export type IFieldsType = IFieldsInput|IFieldsSelect
// ---------------------------------------
export interface IFormStructure {
  class?: "border-b border-gray-900/10 pb-12"|string
  classGrid?: "grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 mt-10"|string
  [key:string]: string
  fields: Array<IFieldsType>;
}
export interface IForm {
  structure: Array<IFormStructure>
  modeStyle?: IMode
  modeLabel?: ILabelMode
  modeValidate?: 'onSubmit'|'onChange'|'onInput'
  submitButton?: string
  structureClass?: "border-b border-gray-900/10 pb-12" | string
  structureClassGrid?: "grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 mt-10" | string
  disabled?:boolean
}
// ---------------------------------------
const props = defineProps<IForm>()
// ---------------------------------------
const emit = defineEmits<{
  (event: 'update:formFields', payload: IFormFields): void;
}>()
// ---------------------------------------
const modeStyle = computed<IMode>(()=>props.modeStyle || "outlined")
const modeLabel = computed<ILabelMode>(()=>props.modeLabel || "offsetDynamic")
const isDisabled = computed<Boolean>(()=>props.disabled || false)
const modeValidate = computed(()=>props.modeValidate || "onSubmit")
// ---------------------------------------
const formFields = reactive<IFormFields>({})
const formInvalidFields = reactive({})
const formStructure = computed<Array<IFormStructure>>(()=>getStructure(props.structure))
// ---------------------------------------
function getStructure (structures:Array<IFormStructure>):Array<IFormStructure> {
  return structures.map(structure=>{
    if (!structure.class?.length) structure.class = props.structureClass||"border-b border-gray-900/10 pb-12"
    if (!structure.classGrid?.length) structure.classGrid = props.structureClassGrid||"grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 mt-10"
    if (structure.fields){
      structure.fields = structure.fields.map((field:IFieldsType)=>{
        if (!field.name){
          field.name = "field"+Math.floor(Math.random() * 100)
          console.error(`There is no name field. Temporary name ${field.name} is set.`, field) }
        if (field.rules){
          field.isRequired = !!(field.rules['required'])||field?.isRequired||false
          if (field.isRequired && (!field.rules['required'] || typeof field.rules['required'] === "boolean")) {
            field.rules['required'] = "Обязательное поле"
          }
        } else { if (field?.isRequired) {
          field.rules = {required: "Обязательное поле"}
        }}
        if (!field.classCol?.length) field.classCol = "col-span-full"
        field.mode = field.mode || modeStyle.value
        field.labelMode = field.labelMode || modeLabel.value
        field.disabled = field.disabled || isDisabled.value
        return field
      })
    }
    return structure
  })
}
function getParamsStructure (structure, calculatedFields:Array<string>):{ [key:string]: string } {
  return Object.keys(structure).reduce((acc, key) => {
    calculatedFields.includes(key)||(acc[key] = structure[key])
    return acc
  }, {})
}
// ---------------------------------------
onMounted(()=>{
  props.structure?.map(item=>item.fields?.map(field=> {
    formFields[field.name] = field.modelValue
  }))
})
watch(formFields, (value:IFormFields)=>{
  emit('update:formFields', value)
})
// ---------------------------------------
async function validateField (field: IFieldsType) {
  if (field.rules) {
    let {isInvalid, message} = getValidate(formFields[field.name], field)
    if (!isInvalid && Object.keys(field.rules).includes("async")) {
      field.loading = true
      const result = await getAsyncValidate(formFields[field.name], field)
      field.loading = false
      isInvalid = result?.isInvalid || isInvalid
      message = result?.message || message
    }
    formInvalidFields[field.name] = isInvalid
    field["messageInvalid"] = message
  }
}
function validateAllField() {
  props.structure?.map(item=>item.fields?.map(field=> {
    if (!formInvalidFields[field.name] || formInvalidFields[field.name] === undefined){
      validateField(field)
    }
  }))
  setTimeout(()=>document.querySelector(".is-invalid")
    ?.scrollIntoView({block: "start", behavior: "smooth"}),10)
}
// ---------------------------------------
function inputField(field) {
  if (modeValidate.value === "onInput") {
    validateField(field)
  }
}
function changeField(field) {
  if (modeValidate.value === "onChange") {
    validateField(field)
  }
}
function submit(){
  validateAllField()
}
</script>

<template>
  <form @submit.prevent="submit">
    <div v-for="(structure, key) in formStructure" :key="key" :class="structure.class">
      <slot name="itemTitle" :structure="getParamsStructure(structure, ['class', 'classGrid', 'fields'])"/>
      <div class="grid" :class="structure.classGrid">
        <div v-for="(field, itemKey) in structure.fields" :key="itemKey" :class="field.classCol">
          <!-- Inputs -->
          <StInput
            v-if="field.typeComponent === 'StInput'"
            v-model:model-value="formFields[field.name]"
            v-model:is-invalid="formInvalidFields[field.name]"
            v-bind="{...getParamsStructure(field, calculatedFieldsInput), id: field.name}"
            @update:model-value="inputField(field)"
            @change:model-value="changeField(field)"
          >
            <template #before>
              <template v-if="field.beforeIcon">
                <component v-if="HeroIcons[field?.beforeIcon]" :is="HeroIcons[field?.beforeIcon]" class="h-5 w-5 text-gray-400" aria-hidden="true" />
                <span v-else class="material-symbols-sharp font-light text-gray-400">{{ field?.beforeIcon }}</span>
              </template>
              <span v-if="field.beforeText" class="flex select-none items-center text-gray-500 sm:text-sm">{{ field.beforeText }}</span>
            </template>
            <template #after>
              <template v-if="field.afterIcon">
                <component v-if="HeroIcons[field?.afterIcon]" :is="HeroIcons[field?.afterIcon]" class="h-5 w-5 text-gray-400" aria-hidden="true" />
                <span v-else class="material-symbols-sharp font-light text-gray-400">{{ field?.afterIcon }}</span>
              </template>
              <p v-if="field.afterText && formFields[field.name]" class="ml-1 mr-3 text-gray-400 select-none">{{ field.afterText }}</p>
            </template>
          </StInput>
        </div>
      </div>
    </div>
    <div class="mt-6 flex items-center justify-end gap-x-6">
      <slot name="footer"></slot>
      <button type="submit" class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
        {{ props.submitButton||'Save' }}
      </button>
    </div>
  </form>
</template>
