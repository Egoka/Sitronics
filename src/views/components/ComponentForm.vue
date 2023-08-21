<script setup lang="ts">
import ComponentViews from "@/components/ComponentViews.vue";
import StForm, {type IFormExpose, type IFormStructure} from "@/components/form/StForm.vue";
import {ref, watch} from "vue";
import {type IResultCallback} from "@/helpers/rules";
const form = ref<any>(null)
const formTest = ref<IFormExpose|null>(null)

const structures = ref<Array<IFormStructure>>([
  {
    title: "Профиль",
    subTitle: "Эта информация будет отображаться публично, поэтому будьте осторожны с тем, чем вы делитесь.",
    fields:[
      {
        typeComponent: "StInput",
        name: "name",
        label:"Имя",
        clear: true,
        // beforeIcon: "UserCircle",
        help: "<img src='https://cdn-icons-png.flaticon.com/512/1828/1828439.png' class='w-10 m-auto' alt=''> Ваше имя должно начинаться с большой буквы. Это поле будет выводиться публично",
        rules: {
          required: "Имя обязательно для заполнения"
        }
      },
      {
        typeComponent: "StInput",
        name: "nameDop",
        label:"Имя",
        clear: true,
        beforeIcon: "UserCircle",
        help: "<img src='https://cdn-icons-png.flaticon.com/512/1828/1828439.png' class='w-10 m-auto' alt=''> Ваше имя должно начинаться с большой буквы. Это поле будет выводиться публично",
        rules: {
          required: "Имя обязательно для заполнения"
        }
      },
      {
        typeComponent: "StInput",
        name: "surname",
        modelValue: "Bonda",
        paramsInput: {
          placeholder: "Bonda",
        },
        rules: {
          length: {
            min: 5,
            message: "Текст должен быть длиннее 5 символов"
          }
        },
        // disabled: true,
        label:"Фамилия",
        required: true,
        clear: true,
        beforeIcon: "User"
      },
      {
        typeComponent: "StInput",
        name: "age",
        modelValue: "25",
        label: "Возраст",
        required: true,
        paramsInput: {
          placeholder: "25",
          mask: "number",
          lengthInteger: 3,
          classInput: "text-right"
        },
        clear: true,
        afterText: "лет",
        classCol: "sm:col-span-3",
        beforeIcon: "manage_accounts",
      },
      {
        typeComponent: "StSelect",
        name: "professionType",
        label: "Профессия",
        beforeIcon: "BookOpen",
        paramsSelect: {
          dataSelect: ["apple", "banana", "cherry", "apple", "cherry", " t1", "t2", "t3"],
          keySelect: "value",
          valueSelect: "label",
          multiple: true,
        // dataSelect: [
        //   {value: 1, label: "Програмиист"},
        //   {value: 2, label: "HR"},
        //   {value: 3, label: "Дизайнер"},
        //   {value: 4, label: "1C"},
        // ],
        },
        clear: true,
        required: true,
        rules: {
          
          length: {
            message: "Максимальная длина 2",
            max: 3,
            min: 3
          },
        },
      },
      {
        typeComponent: "StSelect",
        name: "professionType1",
        label: "Профессия",
        beforeIcon: "BookOpen",
        // disabled: true,
        modelValue: ["apple"],
        paramsSelect: {
          dataSelect: ["apple", "banana", "cherry", "apple", "cherry"],
          keySelect: "value",
          valueSelect: "label",
          multiple: true,
        // dataSelect: [
        //   {value: 1, label: "Програмиист"},
        //   {value: 2, label: "HR"},
        //   {value: 3, label: "Дизайнер"},
        //   {value: 4, label: "1C"},
        // ],
        },
        clear: true,
        required: true,
        rules: {
          length: {
            message: "Максимальная длина 2",
            max: 4,
            min: 3
          },
        },
      },
      {
        typeComponent: "StCalendar",
        name: "birthday1",
        label: "День рождения",
        modelValue: "2023-08-02T21:00:00.000Z",
        afterIcon: "CoBirthdayCake",
        beforeIcon: "CoBirthdayCake",
        afterText: "Text",
        paramsDatePicker: {
          minDate: new Date('2023-08-01T21:00:00.000Z'),
        },
        // disabled: true,
        required: true,
        clear: true,
      },
      {
        typeComponent: "StCalendar",
        name: "birthday",
        // disabled: true,
        // modelValue: "2023-08-09T21:00:00.000Z",
        modelValue: { "start": "2023-08-02T21:00:00.000Z", "end": "2023-08-10T21:00:00.000Z" },
        paramsDatePicker: { isRange: true },
        label: "День рождения",
        beforeIcon: "CoBirthdayCake",
        help: "Dates",
        required: true,
        clear: true
      },
      {
        typeComponent: "StAria",
        name: "about",
        label: "About",
        beforeIcon: "BiChatLeftQuote",
        modelValue: "",
        required: true,
        clear: true,
        paramsAria:{
          maxLength: 30,
          rows: 2
        },
        rules: {
          length: {
            min: 5,
            message: "Текст должен быть длиннее 5 символов"
          }
        },
        // disabled: true
      },
      {
        typeComponent: "StSwitch",
        name: "isInfo",
        paramsSwitch: {
          switchingType: "checkbox",
          rounded: 9,
          mode: "none"
        },
        modelValue: false,
        // iconActive: "Sun",
        // iconInactive: "Moon",
        // disabled: true,
        label: "Указать персональную информацию",
        required: true,
        classCol: "sm:col-span-6",
        help: "Вся информация о пользователе"
      }
    ]
  },
  {
    title: "Персональная информация",
    subTitle: "Используйте постоянный адрес, на который вы можете получать почту.",
    class: "border-b border-gray-900/50 dark:border-gray-400/50 pb-0 mt-10 pl-10",
    isHidden: true,
    fields: [
      {
        typeComponent: "StInput",
        name: "price",
        modelValue: "",
        label: "Стоимость услуги",
        required: true,
        paramsInput: {
          mask: "price",
          lengthInteger: 6,
          classInput: "text-right",
        },
        clear: true,
        afterText: "рубля",
        beforeIcon: "currency_ruble"
        // classCol: "sm:col-span-3"
      },
      {
        typeComponent: "StInput",
        name: "phone",
        modelValue: "79992397588",
        label: "Номер телевона",
        required: true,
        clear: true,
        paramsInput: {
          placeholder: "+7 (000) 000-00-00",
          mask: "phone",
          lengthInteger: 6,
        },
        rules: {
          phone: "Не верный формат номера телефона"
        },
        // classCol: "sm:col-span-3"
        beforeIcon: "Phone"
      },
      {
        typeComponent: "StInput",
        name: "email",
        modelValue: "",
        label: "Почта",
        required: true,
        rules: {
          email: "Не верный формат почты"
        },
        clear: true,
        
        paramsInput: {
          placeholder: "test@gmail.com",
        },
        // classCol: "sm:col-span-3"
        beforeIcon: "Envelope"
      },
      {
        typeComponent: "StInput",
        name: "isNumeric",
        modelValue: "",
        label: "Возраст",
        // required: true,
        clear: true,
        paramsInput: {
          classInput: "text-right",
        },
        // beforeIcon: "counter_1",
        beforeIcon: "ai-hal",
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
        required: true,
        clear: true,
        beforeIcon: "AtSymbol",
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
        paramsInput: {
          type: "password",
        },
        required: true,
        clear: true,
        beforeIcon: "FingerPrint",
        help: "От 3 до 30 символов",
        rules: {
          async: {
            message: "Придумайте другой пароль",
            validationCallback(value: any):Promise<IResultCallback> {
              return new Promise((resolve)=>{
                setTimeout(()=> {
                  if (value === "123") {
                    resolve({isInvalid:true, message: "Пароль не должен быть равен 123"})
                  } else if (+value < 123){
                    resolve({isInvalid:true})
                  } else if (value === "1234"){
                    resolve({isInvalid:true, message: "Пароль не должен быть больше 1234"})
                  } else {
                    resolve({isInvalid:false, message: ""})
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
        paramsInput: {
          type: "password",
        },
        // required: true,
        clear: true,
        beforeIcon: "FingerPrint",
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
// setTimeout(()=>{
//   formTest.value?.setFieldValue("phone", "7999999")
//   formTest.value?.setFieldParam("age", "beforeIcon", "Fire")
//   formTest.value?.setFieldParam("age", "isHidden", true)
// },3000)
// setTimeout(()=>{
//   formTest.value?.setStructureParam(1, "isHidden", true)
//   formTest.value?.setFieldParam("age", "isHidden", false)
// },4000)
// setTimeout(()=>{
//   console.log(form.value)
//   formTest.value?.setFieldParam("age", "disabled", true)
//   formTest.value?.setStructureParam(1, "isHidden", false)
// },5000)
watch(form, ()=>{
  formTest.value?.setStructureParam(1, "isHidden", !form.value["isInfo"])
}, {deep:true})
</script>

<template>
  <ComponentViews>
    <template #title>Form</template>
    <StForm
      ref="formTest"
      :structure="structures"
      mode-style="outlined"
      mode-label="offsetDynamic"
      mode-validate="onChange"
      submit-button="Сохранить"
      structure-class="border-b border-gray-900/50 dark:border-gray-400/50 pb-0 mt-10"
      structure-class-grid="grid-cols-1 gap-x-6 gap-y-0 sm:grid-cols-6 mt-5"
      @update:form-fields="(formFields)=>form = formFields"
    >
      <template #itemTitle="{structure}">
        <h2 v-if="structure?.title?.length" class="text-xl font-semibold leading-7 text-gray-900 dark:text-gray-100">{{ structure?.title }}</h2>
        <p v-if="structure?.subTitle?.length" class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">{{ structure?.subTitle }}</p>
      </template>
    </StForm>
    <template v-if="form">
      <div v-for="field in Object.keys(form)" :key="field" class="text-gray-500">
        {{ field }} = {{form[field]}}
      </div>
    </template>
  </ComponentViews>
</template>