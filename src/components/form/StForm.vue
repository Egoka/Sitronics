<script setup lang="ts">
import {computed, onMounted, reactive, watch} from "vue";
import Icons from "@/components/functional/Icons.vue";
import StInput, {type IInput} from "@/components/form/StInput.vue";
import StAria, {type IAria} from "@/components/form/StAria.vue";
import StSelect, {type ISelect} from "@/components/form/StSelect.vue";
import StSwitch, {type ISwitch} from "@/components/form/StSwitch.vue";
import type {ILabelMode} from "@/components/functional/Label.vue";
import {getValidate, getAsyncValidate, type Rules} from "@/helpers/rules";
import {getParamsStructure} from "@/helpers/object";
import StCalendar, {type ICalendar} from "@/components/form/StCalendar.vue";
// ---------------------------------------
export type IMode = "outlined"|"underlined"|"filled"
type classCol = "col-span-full"|"sm:col-span-3"|"sm:col-span-4"|"sm:col-span-5"|"sm:col-span-6"|string
// ---------------------------------------
export interface IRulesInput extends Rules {}
export interface IRulesSelect extends Omit<Rules, "email"|"phone"|"numeric"|"regular"> {}
// ---------------------------------------
interface IFields {
  name: string
  classCol?: classCol
  isHidden?: boolean|undefined
}
interface IFormFields {[key:string]:any}
// ---------------------------------------
const calculatedFieldsInput = ["typeComponent", "classCol", "modelValue", "isInvalid", "name", "rules",
  "beforeIcon", "beforeText", "afterIcon", "afterText"]
export interface IFieldsInput extends IFields, IInput {
  typeComponent: "StInput"
  rules?: IRulesInput
  beforeIcon?: string
  beforeText?: string
  afterIcon?: string
  afterText?: string
}
export interface IFieldsAria extends IFields, IAria {
  typeComponent: "StAria"
  rules?: IRulesInput
  beforeIcon?: string
  beforeText?: string
  afterIcon?: string
  afterText?: string
}
export interface IFieldsSelect extends IFields, ISelect {
  typeComponent: "StSelect"
  rules?: IRulesSelect
  beforeIcon?: string
  beforeText?: string
  afterIcon?: string
  afterText?: string
}
export interface IFieldsCalendar extends IFields, ICalendar {
  typeComponent: "StCalendar"
  rules?: IRulesSelect
  beforeIcon?: string
  beforeText?: string
  afterIcon?: string
  afterText?: string
}
export interface IFieldsSwitch extends IFields, ISwitch {
  typeComponent: "StSwitch"
}
export type IFieldsTypeKeys = keyof IFieldsInput|keyof IFieldsAria|keyof IFieldsSelect|keyof IFieldsCalendar|keyof IFieldsSwitch
export type IFieldsType = IFieldsInput|IFieldsAria|IFieldsSelect|IFieldsCalendar|IFieldsSwitch
export type IFieldsIS = IFieldsInput|IFieldsAria|IFieldsSelect|IFieldsCalendar
// ---------------------------------------
export interface IFormStructure {
  isHidden?: boolean
  class?: "border-b border-gray-900/10 pb-12"|string
  classGrid?: "grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 mt-10"|string
  fields: Array<IFieldsType>,
  [key:string]: any
}
export interface IForm {
  structure: Array<IFormStructure>
  modeStyle?: IMode
  modeLabel?: ILabelMode
  modeValidate?: "onSubmit"|"onChange"|"onInput"
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
const arrayFieldsValidate = ["StInput", "StAria", "StSelect", "StCalendar"]
// ---------------------------------------
const modeStyle = computed<IMode|undefined>(()=>props.modeStyle || undefined)
const modeLabel = computed<ILabelMode>(()=>props.modeLabel || "offsetDynamic")
const isDisabled = computed<boolean>(()=>props.disabled || false)
const modeValidate = computed(()=>props.modeValidate || "onChange")
// ---------------------------------------
const formFields = reactive<IFormFields>({})
const formInvalidFields = reactive<{[key:string]: boolean}>({})
const formStructure = computed<Array<IFormStructure>>(()=>getStructure(props.structure))
// ---------------------------------------
export interface IFormExpose {
  formFields:IFormFields,
  setFieldValue(fieldName:string, value:any): void
  setFieldParam(fieldName:string, param: IFieldsTypeKeys, value:any): void
  getField(fieldName:string): IFieldsType|null
  setStructureParam(indexStructure:number, param:keyof IFormStructure, value: any): void
}
defineExpose<IFormExpose>({
  formFields,
  setFieldValue,
  setFieldParam,
  getField,
  setStructureParam,
})
// ---------------------------------------
function setFieldValue(fieldName: string, value: any) {
  formFields[fieldName] = value
}
function setFieldParam(fieldName:string, param: IFieldsTypeKeys, value: any) {
  formStructure.value.map((structure,i:number)=>{
    structure.fields?.map((item:IFieldsType, j:number)=>{
      if (item.name === fieldName) {
        (formStructure.value[i].fields[j] as any)[param] = value
      }
    })
  })
}
function getField(fieldName:string):IFieldsType|null {
  let field = null
  formStructure.value.map(structure=>{
    structure.fields?.map((item:IFieldsType)=>{
      if (item.name === fieldName) { field = item }
    })
  })
  return field
}
function setStructureParam(indexStructure:number, param:keyof IFormStructure, value: any) {
  formStructure.value.map((_,index:number)=>{
    if (index === indexStructure) {
      (formStructure.value[index] as any)[param] = value
    }
  })
}
// ---------------------------------------
function getStructure (structures:Array<IFormStructure>):Array<IFormStructure> {
  return structures.map(structure=>{
    if (!structure?.class?.length) structure.class = props.structureClass||"border-b border-gray-900/10 pb-12"
    if (!structure?.classGrid?.length) structure.classGrid = props.structureClassGrid||"grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 mt-10"
    if (structure.fields){
      structure.fields = structure.fields.map((field:IFieldsType)=>{
        if (!field.name){
          field.name = "field"+Math.floor(Math.random() * 100)
          console.error(`There is no name field. Temporary name ${field.name} is set.`, field) }
        if (arrayFieldsValidate.includes(field.typeComponent)) {
          if ("rules" in field && field?.rules){
            field.required = !!(field.rules['required'])||field?.required||false
            if (field.required && (!field.rules['required'] || typeof field.rules['required'] === "boolean")) {
              field.rules['required'] = "Обязательное поле"
            }
          } else { if (field?.required) {
            (field as IFieldsIS).rules = {required: "Обязательное поле"}
          }}
        }
        if (!field?.classCol?.length) field.classCol = "col-span-full"
        field.mode = field.mode || modeStyle.value
        if (arrayFieldsValidate.includes(field.typeComponent)){
          (field as IFieldsIS).labelMode =
            (field as IFieldsIS).labelMode || modeLabel.value
        }
        field.disabled = field.disabled || isDisabled.value
        return field
      })
    }
    return structure
  })
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
  if (arrayFieldsValidate.includes(field.typeComponent)) {
    if ("rules" in field && field?.rules) {
      let {isInvalid, message} = getValidate(formFields[field.name], field)
      if (!isInvalid && Object.keys(field.rules).includes("async")) {
        if (arrayFieldsValidate.includes(field.typeComponent)) {
          (field as IFieldsIS).loading = true
        }
        const result = await getAsyncValidate(formFields[field.name], field)
        if (arrayFieldsValidate.includes(field.typeComponent)) {
          (field as IFieldsIS).loading = false
        }
        isInvalid = result?.isInvalid || isInvalid
        message = result?.message || message
      }
      formInvalidFields[field.name] = isInvalid
      field["messageInvalid"] = message
    }
  }
}
function validateAllField() {
  props.structure?.map(item=>item.fields?.map(field=> {
    if (!formInvalidFields[field.name]){
      validateField(field)
    }
  }))
  setTimeout(()=>document.querySelector(".is-invalid")
    ?.scrollIntoView({block: "start", behavior: "smooth"}),10)
}
// ---------------------------------------
function inputField(field:any) {
  if (modeValidate.value === "onInput") {
    validateField(field)
  }
}
function changeField(field:any) {
  console.log("changeField")
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
    <template v-for="(structure, key) in formStructure" :key="key">
      <transition leave-active-class="transition ease-in-out duration-500" leave-from-class="opacity-100" leave-to-class="opacity-0"
                  enter-active-class="transition ease-in-out duration-500" enter-from-class="opacity-0" enter-to-class="opacity-100">
        <div v-if="!structure.isHidden" :class="structure.class">
          <slot name="itemTitle" :structure="getParamsStructure(structure, ['class', 'classGrid', 'fields'])"/>
          <div class="grid transition" :class="structure.classGrid">
            <div v-for="(field, itemKey) in structure.fields" :key="itemKey" :class="field.classCol">
              <transition leave-active-class="transition ease-in-out duration-500" leave-from-class="opacity-100" leave-to-class="opacity-0"
                          enter-active-class="transition ease-in-out duration-500" enter-from-class="opacity-0" enter-to-class="opacity-100">
                <div v-if="!field.isHidden">
                  <!-- Input -->
                  <StInput
                    v-if="field.typeComponent === 'StInput'"
                    v-model:model-value="formFields[field.name]"
                    v-model:is-invalid="formInvalidFields[field.name]"
                    v-bind="{...getParamsStructure(field, calculatedFieldsInput), id: field.name}"
                    @update:model-value="inputField(field)"
                    @change:model-value="changeField(field)">
                    <template #before>
                      <Icons v-if="field.beforeIcon" :type="field.beforeIcon"/>
                      <span v-if="field.beforeText" class="flex select-none items-center text-gray-500 sm:text-sm">{{ field.beforeText }}</span>
                    </template>
                    <template #after>
                      <Icons v-if="field.afterIcon" :type="field.afterIcon"/>
                      <p v-if="field.afterText && formFields[field.name]" class="ml-1 mr-3 text-gray-400 dark:text-gray-600 select-none">{{ field.afterText }}</p>
                    </template>
                  </StInput>
                  <!-- Aria -->
                  <StAria
                    v-if="field.typeComponent === 'StAria'"
                    v-model:model-value="formFields[field.name]"
                    v-model:is-invalid="formInvalidFields[field.name]"
                    v-bind="{...getParamsStructure(field, calculatedFieldsInput), id: field.name}"
                    @update:model-value="inputField(field)"
                    @change:model-value="changeField(field)">
                    <template #before>
                      <Icons v-if="field.beforeIcon" :type="field.beforeIcon"/>
                      <span v-if="field.beforeText" class="flex select-none items-center text-gray-500 sm:text-sm">{{ field.beforeText }}</span>
                    </template>
                    <template #after>
                      <Icons v-if="field.afterIcon" :type="field.afterIcon"/>
                      <p v-if="field.afterText && formFields[field.name]" class="ml-1 mr-3 text-gray-400 dark:text-gray-600 select-none">{{ field.afterText }}</p>
                    </template>
                  </StAria>
                  <!-- Select -->
                  <StSelect
                    v-if="field.typeComponent === 'StSelect'"
                    v-model:model-value="formFields[field.name]"
                    v-model:is-invalid="formInvalidFields[field.name]"
                    :data-select="field?.paramsSelect?.dataSelect"
                    v-bind="{...getParamsStructure(field, calculatedFieldsInput), id: field.name}"
                    @update:model-value="inputField(field)"
                    @change:model-value="changeField(field)">
                    <template #default="{selected, key}">
                      <div v-if="field.paramsSelect?.multiple" class="m-[2px] bg-stone-200 dark:bg-stone-800 h-4 leading-4 px-1 rounded-[2px]">{{selected[key]}}</div>
                      <div v-else>{{selected[key]}}</div>
                    </template>
                    <template #item="{item}">
                      <div v-if="!field.paramsSelect?.noQuery" v-html="item?.marker" class="text-gray-600 dark:text-gray-400"/>
                      <div v-else class="text-gray-500">{{field.paramsSelect?.valueSelect ? item[field.paramsSelect.valueSelect] : item}}</div>
                    </template>
                    <template v-if="field.beforeIcon || field.beforeText" #before>
                      <Icons v-if="field.beforeIcon" :type="field.beforeIcon"/>
                      <span v-if="field.beforeText" class="flex select-none items-center text-gray-500 sm:text-sm">{{ field.beforeText }}</span>
                    </template>
                    <template v-if="field.afterIcon || field.afterText" #after>
                      <Icons v-if="field.afterIcon" :type="field.afterIcon"/>
                      <p v-if="field.afterText && formFields[field.name]" class="ml-1 mr-3 text-gray-400 dark:text-gray-600 select-none">{{ field.afterText }}</p>
                    </template>
                  </StSelect>
                  <!-- Calendar -->
                  <StCalendar
                    v-if="field.typeComponent === 'StCalendar'"
                    v-model:model-value="formFields[field.name]"
                    v-model:is-invalid="formInvalidFields[field.name]"
                    v-bind="{...getParamsStructure(field, calculatedFieldsInput), id: field.name}"
                    @update:model-value="inputField(field)"
                    @change:model-value="changeField(field)">
                    <template #footerPicker></template>
                    <template v-if="field.beforeIcon || field.beforeText" #before>
                      <Icons v-if="field.beforeIcon" :type="field.beforeIcon"/>
                      <span v-if="field.beforeText" class="flex select-none items-center text-gray-500 sm:text-sm">{{ field.beforeText }}</span>
                    </template>
                    <template v-if="field.afterIcon || field.afterText" #after>
                      <Icons v-if="field.afterIcon" :type="field.afterIcon"/>
                      <p v-if="field.afterText && formFields[field.name]" class="ml-1 mr-3 text-gray-400 dark:text-gray-600 select-none">{{ field.afterText }}</p>
                    </template>
                  </StCalendar>
                  <!-- Switch -->
                  <StSwitch
                    v-if="field.typeComponent === 'StSwitch'"
                    v-model:model-value="formFields[field.name]"
                    v-bind="{...getParamsStructure(field, calculatedFieldsInput), id: field.name}"
                    @update:model-value="inputField(field)"
                    @change:model-value="changeField(field)"/>
                </div>
              </transition>
            </div>
          </div>
        </div>
      </transition>
    </template>
    <div class="mt-6 flex items-center justify-end gap-x-6">
      <slot name="footer"></slot>
      <button type="submit" class="rounded-md bg-indigo-600 dark:bg-indigo-400 px-3 py-2 text-sm font-semibold text-white dark:text-black shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
        {{ props.submitButton||'Save' }}
      </button>
    </div>
  </form>
</template>
