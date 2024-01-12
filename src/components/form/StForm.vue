<script setup lang="ts">
import {computed, nextTick, onMounted, reactive, ref, watch} from "vue";
import Icons from "@/components/functional/Icons.vue";
import StInput from "@/components/form/StInput.vue";
import StAria from "@/components/form/StAria.vue";
import StSelect from "@/components/form/StSelect.vue";
import StCalendar from "@/components/form/StCalendar.vue";
import StTextEditor from "@/components/form/StTextEditor.vue";
import StSwitch from "@/components/form/StSwitch.vue";
import Button from "@/components/functional/Button.vue";
import Badge from "@/components/functional/Badge.vue";
import {getValidate, getAsyncValidate} from "@/helpers/rules";
import {removeParamsFromStructure} from "@/helpers/object";
// ---------------------------------------
import type {IMode} from "@/components/BaseTypes";
import type {ILabelMode} from "@/components/functional/Label";
import type {
  IFieldsType,
  IFieldsUseInputLayout,
  IForm,
  IFormExpose,
  IFormFields,
  IFormStructure
} from "@/components/form/StForm";
// ---------------------------------------
const calculatedFieldsInput = <Array<keyof IFieldsType>>
  ["typeComponent", "classCol", "modelValue", "isInvalid", "name", "rules",
    "beforeIcon", "beforeText", "afterIcon", "afterText"]
// ---------------------------------------
const props = defineProps<IForm>()
// ---------------------------------------
const emit = defineEmits<{
  (event: 'update:formFields', payload: IFormFields): void;
  (event: 'submit', payload: IFormFields):void
}>()
// ---------------------------------------
const arrayFieldsValidate = ["Input", "Aria", "Select", "Calendar", "TextEditor"]
const baseInputs = {
  "Input": StInput,
  "Aria": StAria,
  "Select": StSelect,
  "Calendar": StCalendar,
  "TextEditor": StTextEditor,
  "Switch": StSwitch
}
// ---------------------------------------
const formRef = ref<HTMLElement>()
// ---------------------------------------
const name = computed<IForm["name"]>(()=>props.name ?? "")
const modeStyle = computed<IMode|undefined>(()=>props.modeStyle)
const modeLabel = computed<ILabelMode>(()=>props.modeLabel ?? "offsetDynamic")
const isDisabled = computed<boolean>(()=>props.disabled ?? false)
const autocomplete = computed<NonNullable<IForm["autocomplete"]>>(()=> props?.autocomplete ?? "on")
const modeValidate = computed(()=>props.modeValidate ?? "onChange")
// ---------------------------------------
const formFields = reactive<IFormFields>({})
const formInvalidFields = reactive<{[key:string]: boolean}>({})
const formStructure = computed<Array<IFormStructure>>(()=>getStructure(props.structure))
const submitButton = computed<IForm["submitButton"]>(()=>props.submitButton ?? 'Save')
// ---------------------------------------
defineExpose<IFormExpose>({
  formFields,
  setFieldValue,
  setFieldParam,
  getField,
  setStructureParam,
  validateFields,
})
// ---------------------------------------
function setFieldValue(fieldName: string, value: any) {
  formFields[fieldName] = value
}
function setFieldParam(fieldName:string, param: keyof IFieldsType, value: any): void {
  formStructure.value.forEach((structure,i:number)=>{
    structure.fields?.forEach((item:IFieldsType, j:number)=>{
      if (item.name === fieldName) {
        (formStructure.value[i].fields[j] as any)[param] = value
      }
    })
  })
}
function getField(fieldName:string):IFieldsType|null {
  let field = null
  formStructure.value.forEach(structure=>{
    structure.fields?.forEach((item:IFieldsType)=>{
      if (item.name === fieldName) { field = item }
    })
  })
  return field
}
function setStructureParam(indexStructure:number, param:keyof IFormStructure, value: any): void {
  formStructure.value.some((_,index:number)=>{
    if (index === indexStructure) {
      (formStructure.value[index] as any)[param] = value
    }
  })
}
// ---------------------------------------
function getStructure (structures:Array<IFormStructure>):Array<IFormStructure> {
  return structures.map(structure=>{
    if (!structure?.class?.length) { structure.class = props.structureClass ?? "border-b border-gray-900/10 pb-12" }
    if (!structure?.classGrid?.length) { structure.classGrid = props.structureClassGrid ?? "grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 mt-10" }
    if (structure.fields){
      structure.fields = structure.fields.map((field:IFieldsType)=>{
        if (!field.name){
          field.name = "field"+Math.floor(Math.random() * 100)
          console.error(`There is no name field. Temporary name ${field.name} is set.`, field) }
        if (arrayFieldsValidate.includes(field.typeComponent)) {
          field = field as IFieldsUseInputLayout
          if ("rules" in field && field?.rules){
            field.required = !!(field.rules['required'])||field?.required||false
            if (field.required && (!field.rules['required'] || typeof field.rules['required'] === "boolean")) {
              field.rules['required'] = "Обязательное поле"
            }
          } else if (field?.required) {
            field.rules = {required: "Обязательное поле"}
          }
          field.labelMode = field.labelMode ?? modeLabel.value
        }
        if (!field?.classCol?.length) field.classCol = "col-span-full"
        field.mode = field.mode || modeStyle.value
        field.disabled = field.disabled ?? isDisabled.value
        return field
      })
    }
    return structure
  })
}
// ---------------------------------------
onMounted(()=>{
  props.structure?.forEach(item=>item.fields?.forEach((field:IFieldsType)=> {
    formFields[field.name] = props.formFields?.[field.name] ?? field.modelValue
  }))
})
watch(formFields, (value:IFormFields)=>{
  emit('update:formFields', value)
})
// ---------------------------------------
async function validateField (field: IFieldsType) {
  if (arrayFieldsValidate.includes(field.typeComponent)) {
    field = field as IFieldsUseInputLayout
    if ("rules" in field && field?.rules) {
      let {isInvalid, message} = getValidate(formFields[field.name], field)
      if (!isInvalid && Object.keys(field.rules).includes("async")) {
        field.loading = true
        const result = await getAsyncValidate(formFields[field.name], field)
        field.loading = false
        isInvalid = result?.isInvalid ?? isInvalid
        message = result?.message ?? message
      }
      formInvalidFields[field.name] = isInvalid
      field.messageInvalid = message
    }
  }
}
function validateFields(nameField?:Array<string>|string):boolean {
  props.structure?.forEach(item=>
    item.fields?.forEach(field=> {
      if (nameField) {
        if ([nameField].flat().find((item:string)=>item === field.name)){
          validateField(field)
        }
      } else {
        if (!formInvalidFields[field.name]){
          validateField(field)
        }
      }
    })
  )
  const isValidateForm = Object.values(formInvalidFields).filter(i=>i)?.length > 0 ?? false
  if (isValidateForm) {
    nextTick(() => {
      document.querySelector(".is-invalid")
        ?.scrollIntoView({block: "start", behavior: "smooth"})
    })
    return isValidateForm
  } else { return isValidateForm }
}
// ---------------------------------------
function inputField(field:any) {
  if (modeValidate.value === "onInput") {
    validateField(field)
  }
}
function changeField(field:any) {
  if (modeValidate.value === "onChange") {
    validateField(field)
  }
}
function submit(){
  if (validateFields()) {
    emit('submit', formFields)
  }
}
</script>

<template>
  <form :name="name" :autocomplete="autocomplete" @submit.prevent="submit">
    <div ref="formRef" :class="props?.class">
      <template v-for="(structure, key) in formStructure" :key="key">
        <transition leave-active-class="transition ease-in-out duration-500" leave-from-class="opacity-100" leave-to-class="opacity-0"
                    enter-active-class="transition ease-in-out duration-500" enter-from-class="opacity-0" enter-to-class="opacity-100">
          <div v-show="!structure.isHidden" :class="structure.class">
            <slot name="itemTitle" :structure="removeParamsFromStructure(structure, ['class', 'classGrid', 'fields'])"/>
            <div class="grid transition" :class="structure.classGrid">
              <div v-for="(field, itemKey) in structure.fields" :key="itemKey" :class="field.classCol">
                <transition leave-active-class="transition ease-in-out duration-500" leave-from-class="opacity-100" leave-to-class="opacity-0"
                            enter-active-class="transition ease-in-out duration-500" enter-from-class="opacity-0" enter-to-class="opacity-100">
                  <div v-show="!field.isHidden">
                    <component
                      :is="baseInputs[field.typeComponent]"
                      v-model:model-value="formFields[field.name]"
                      v-model:is-invalid="formInvalidFields[field.name]"
                      v-bind="{...removeParamsFromStructure(field, calculatedFieldsInput), id: field.name}"
                      @update:model-value="inputField(field)"
                      @change:model-value="changeField(field)">
                      <template #before>
                        <Icons v-if="(field as IFieldsUseInputLayout)?.slots?.beforeIcon" :type="(field as IFieldsUseInputLayout)?.slots?.beforeIcon" class="mr-2 h-5 w-5 text-gray-400 dark:text-gray-600"/>
                        <span v-if="(field as IFieldsUseInputLayout)?.slots?.beforeText" class="flex select-none items-center text-gray-500 sm:text-sm">{{ (field as IFieldsUseInputLayout)?.slots?.beforeText }}</span>
                      </template>
                      <template #after>
                        <p v-if="(field as IFieldsUseInputLayout)?.slots?.afterText && formFields[field.name]" class="ml-1 mr-3 text-gray-400 dark:text-gray-600 select-none">{{ (field as IFieldsUseInputLayout)?.slots?.afterText }}</p>
                        <Icons v-if="(field as IFieldsUseInputLayout)?.slots?.afterIcon" :type="(field as IFieldsUseInputLayout)?.slots?.afterIcon" class="mr-2 h-5 w-5 text-gray-400 dark:text-gray-600"/>
                      </template>
                      <template #values="{selected, key, deleteSelect}">
                        <Badge mode="neutral" close-button class-content="fill-theme-500" @delete="deleteSelect(selected)"
                               :class="['m-1 mb-0 text-xs bg-theme-50 text-theme-700 ring-theme-600/20 dark:bg-theme-950 dark:text-theme-300 dark:ring-theme-400/20']">
                          {{selected[key]}}
                        </Badge>
                      </template>
                      <template #item="{item, key, isQuery}">
                        <div v-if="!isQuery" v-html="item?.marker??item[key]"
                             class="text-gray-600 dark:text-gray-300 group-hover:text-theme-700 dark:group-hover:text-theme-400"/>
                        <div v-else class="text-gray-500">{{item[key]}}</div>
                      </template>
                      <template #footerPicker></template>
                    </component>
                  </div>
                </transition>
              </div>
            </div>
          </div>
        </transition>
      </template>
    </div>
    <div class="mt-6 flex items-center justify-end gap-x-6">
      <slot name="footer">
        <Button v-if="submitButton" type="submit">{{ submitButton }}</Button>
      </slot>
    </div>
  </form>
</template>
