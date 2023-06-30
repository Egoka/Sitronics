<script setup lang="ts">
import ComponentViews from "@/components/ComponentViews.vue";
import StForm, {IFormStructure} from "@/components/form/StForm.vue";
import {ref} from "vue";
import {IResultCallback} from "@/helpers/rules";
const form = ref<any>(null)
const structures = <Array<IFormStructure>>ref([
  {
    title: "Профиль",
    subTitle: "Эта информация будет отображаться публично, поэтому будьте осторожны с тем, чем вы делитесь.",
    fields:[
      {
        typeComponent: "StInput",
        name: "name",
        modelValue: "Egor",
        label:"Имя",
        clear: true,
        beforeIcon: "UserCircleIcon",
        help: "Ваше имя должно начинаться с большой буквы. Это поле будет выводиться публично",
        rules: {
          required: "Имя обязательно для заполнения"
        }
      },
      {
        typeComponent: "StInput",
        name: "surname",
        modelValue: "Bonda",
        label:"Фамилия",
        isRequired: true,
        clear: true,
        beforeIcon: "UserIcon"
      },
      {
        typeComponent: "StInput",
        name: "age",
        modelValue: "25",
        label: "Возраст",
        isRequired: true,
        mask: "number",
        lengthInteger: 3,
        clear: true,
        class: "text-right",
        afterText: "лет",
        classCol: "sm:col-span-3",
        beforeIcon: "manage_accounts"
      },
    ]
  },
  {
    title: "Персональная информация",
    subTitle: "Используйте постоянный адрес, на который вы можете получать почту.",
    fields: [
      {
        typeComponent: "StInput",
        name: "price",
        modelValue: "",
        label: "Стоимость услуги",
        isRequired: true,
        mask: "price",
        lengthInteger: 6,
        clear: true,
        class: "text-right",
        afterText: "рубля",
        beforeIcon: "currency_ruble"
        // classCol: "sm:col-span-3"
      },
      {
        typeComponent: "StInput",
        name: "phone",
        modelValue: "79992397588",
        label: "Номер телевона",
        isRequired: true,
        mask: "phone",
        lengthInteger: 6,
        clear: true,
        placeholder: "+7 (000) 000-00-00",
        rules: {
          phone: "Не верный формат номера телефона"
        },
        // classCol: "sm:col-span-3"
        beforeIcon: "PhoneIcon"
      },
      {
        typeComponent: "StInput",
        name: "email",
        modelValue: "",
        label: "Почта",
        isRequired: true,
        rules: {
          email: "Не верный формат почты"
        },
        clear: true,
        placeholder: "test@gmail.com",
        // classCol: "sm:col-span-3"
        beforeIcon: "EnvelopeIcon"
      },
      {
        typeComponent: "StInput",
        name: "isNumeric",
        modelValue: "",
        label: "Возраст",
        // isRequired: true,
        clear: true,
        class: "text-right",
        beforeIcon: "counter_1",
        help: "Поле должно состоять только из числа",
        rules: {
          range: {
            message: "Значение должно быть не меньше 6 и не больше 80",
            min: 6,
            max: 80
          },
          numeric: "Поле должно состоять только из числа",
        }
      },
    ]
  },
  {
    title: "Данные для входа",
    subTitle: "Эти данные необходимы вам будут для входа. Логин это ваша почта, а пароль должен быть надежным и не должен повторяться в других местах.",
    fields: [
      {
        typeComponent: "StInput",
        name: "login",
        modelValue: "",
        label: "Логин",
        isRequired: true,
        clear: true,
        beforeIcon: "AtSymbolIcon",
        help: "От 3 до 30 символов",
        rules: {
          custom: {
            message: "Не валидное поле",
            validationCallback(value: any): IResultCallback {
              return {isInvalid: value < 12, message: "Значение должно быть больше 12" }
            }
          },
          length: {
            message: "Длина не должна привышать 30 символов и не должна быть короче 3",
            min: 1,
            max: 30
          },
        }
      },
      {
        typeComponent: "StInput",
        name: "password",
        modelValue: "",
        label: "Пароль",
        type: "password",
        isRequired: true,
        clear: true,
        beforeIcon: "FingerPrintIcon",
        help: "От 3 до 30 символов",
        rules: {
          async: {
            message: "Придумайте другой пароль",
            async validationCallback(value: any):IResultCallback {
              return new Promise((resolve)=>{
                setTimeout(()=> {
                  if (value === "123") {
                    resolve({isInvalid:true, message: "Пароль не должен быть равен 123"})
                  } else if (+value < 123){
                    resolve({isInvalid:true})
                  } else if (value === "1234"){
                    resolve({isInvalid:true, message: "Пароль не должен быть больше 1234"})
                  } else {
                    resolve(false)
                  }
                },1000)
              })
            }
          },
          length: {
            message: "Длина не должна привышать 30 символов и не должна быть короче 3",
            min: 3,
            max: 30
          },
        }
      },
      {
        typeComponent: "StInput",
        name: "verificationPassword",
        modelValue: "",
        label: "Пароль для проерки",
        type: "password",
        // isRequired: true,
        clear: true,
        beforeIcon: "FingerPrintIcon",
        help: "От 3 до 30 символов",
        rules: {
          required: true,
          custom: {
            message: "Придумайте другой пароль",
            validationCallback(value: any):IResultCallback {
              return {isInvalid: form.value["password"] !== value, message: "Пароли не совпадают"}
            }
          },
          length: {
            message: "Длина не должна привышать 30 символов и не должна быть короче 3",
            min: 3,
            max: 30
          },
        }
      },
    ]
  },
])
function getValidate(value) {
  return new Promise((resolve)=>{
    setTimeout(()=> {
      if (value === "123") {
        resolve({isInvalid:true, message: "Пароль не должен быть равен 123"})
      } else if (+value < 123){
        resolve({isInvalid:true})
      } else if (value === "1234"){
        resolve({isInvalid:true, message: "Пароль не должен быть больше 1234"})
      } else {
        resolve(false)
      }
    },1000)
  })
}
</script>

<template>
  <ComponentViews>
    <template #title>Form</template>
    <StForm
      :structure="structures"
      mode-style="filled"
      mode-label="offsetDynamic"
      mode-validate="onChange"
      submit-button="Сохранить"
      structure-class="border-b border-gray-900/10 pb-0 mt-10"
      structure-class-grid="grid-cols-1 gap-x-6 gap-y-0 sm:grid-cols-6 mt-5"
      @update:form-fields="(formFields)=>form = formFields"
    >
      <template #itemTitle="{structure}">
        <h2 v-if="structure?.title?.length" class="text-xl font-semibold leading-7 text-gray-900">{{ structure?.title }}</h2>
        <p v-if="structure?.subTitle?.length" class="mt-1 text-sm leading-6 text-gray-600">{{ structure?.subTitle }}</p>
      </template>
    </StForm>
  </ComponentViews>
</template>

<style scoped>

</style>