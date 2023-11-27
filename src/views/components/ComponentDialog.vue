<script setup lang="ts">
import {ref, watch} from "vue";
import Dialog, {type IDialog} from "@/components/functional/Dialog.vue";
import ComponentViews from "@/components/ComponentViews.vue";
import Button from "@/components/functional/Button.vue";
import StForm, {IFormExpose, IFormStructure} from "@/components/form/StForm.vue";
import {IResultCallback} from "@/helpers/rules";
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'
import Icons from "@/components/functional/Icons.vue";
import Badge from "@/components/functional/Badge.vue";
const form = ref<any>(null)
const formTest = ref<IFormExpose|null>(null)
const structures = ref<Array<IFormStructure>>([
  {
    title: "Профиль",
    subTitle: "Эта информация будет отображаться публично, поэтому будьте осторожны с тем, чем вы делитесь.",
    fields:[
      {
        typeComponent: "Input",
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
        typeComponent: "Input",
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
        typeComponent: "Input",
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
        typeComponent: "Input",
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
        typeComponent: "Select",
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
          
          // length: {
          //   message: "Максимальная длина 2",
          //   max: 3,
          //   min: 3
          // },
        },
      },
      {
        typeComponent: "Select",
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
        typeComponent: "Calendar",
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
        typeComponent: "Calendar",
        name: "birthday",
        // disabled: true,
        // modelValue: "2023-08-09T21:00:00.000Z",
        modelValue: { "start": "2023-08-02T21:00:00.000Z", "end": "2023-08-10T21:00:00.000Z" },
        paramsDatePicker: { isRange: true, masks: {modelValue :"DD.MM.YYYY"} },
        label: "День рождения",
        beforeIcon: "CoBirthdayCake",
        help: "Dates",
        required: true,
        clear: true
      },
      {
        typeComponent: "Aria",
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
        typeComponent: "TextEditor",
        name: "text",
        modelValue: "<h2>Тестовый </h2><p>текст с описанием </p><p>Этот текст тоже должен быть скопирован</p>",
        label: "Приложенные правила",
        // disabled: true,
        beforeIcon: "attach_file"
      },
      {
        typeComponent: "Switch",
        name: "isInfo",
        paramsSwitch: {
          switchingType: "switch",
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
        typeComponent: "Input",
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
        typeComponent: "Input",
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
        typeComponent: "Input",
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
        typeComponent: "Input",
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
        typeComponent: "Input",
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
        typeComponent: "Input",
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
        typeComponent: "Input",
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
const isOpen1 = ref(false)
const isOpen2 = ref(false)
const isOpen3 = ref(false)
const isOpen4 = ref(false)
const isOpen5 = ref(false)
const isOpen6 = ref(false)
const positionDialog1 = ref<IDialog["position"]>("center")
const positionDialog2 = ref<IDialog["position"]>("center")
const positionDialog3 = ref<IDialog["position"]>("top")
const positionDialog4 = ref<IDialog["position"]>("top")
const positionDialog5 = ref<IDialog["position"]>("top")
const positionDialog6 = ref<IDialog["position"]>("top")
const sizeDialog6 = ref<IDialog["size"]>()
watch(form, ()=>{
  formTest.value?.setStructureParam(1, "isHidden", !form.value["isInfo"])
}, {deep:true})
</script>

<template>
  <ComponentViews>
    <template #title>Dialog</template>
<!---------------------------->
    <div class="border-b border-primary-700/50 dark:border-primary-500/50 pb-0 mt-10">
      <h2 class="ml-5 text-xl font-semibold leading-7 text-primary-600 dark:text-primary-500">Диалоговое окно</h2>
      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
        <p>Задача диалогового окна создать отделенный интерфейс от остального, что бы сосредоточить внимание пользователя на важной информации.</p>
        <p>Промером такой информации могут быть предупреждения, окно выбора, где есть ответ да или нет, формы заполнения данных и другие.</p><br/>
      </p>
    </div>
    <div class="border-b border-primary-700/50 dark:border-primary-500/50 pb-0 mt-10">
      <h2 class="ml-5 text-xl font-semibold leading-7 text-primary-600 dark:text-primary-500">Расположение</h2>
      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
        <p>Диалоговому окну можно задать расположение. Доступные следующие значения <Badge mode="outline">center</Badge> (по умолчанию), <Badge mode="outline">top</Badge>,
          <Badge mode="outline">bottom</Badge>,
          <Badge mode="outline">left</Badge>,
          <Badge mode="outline">right</Badge>,
          <Badge mode="outline">bottom-left</Badge>,
          <Badge mode="outline">top-left</Badge>,
          <Badge mode="outline">bottom-right</Badge>,
          <Badge mode="outline">top-right</Badge>.
        </p>
      </p>
      <div class="grid transition grid-cols-1 gap-x-6 gap-y-0 sm:grid-cols-6 mt-5">
        <div class=" col-span-full m-5">
          <Button class="m-2" @click="isOpen1 = true;positionDialog1 = 'center'">center</Button>
          <Button class="m-2" @click="isOpen1 = true;positionDialog1 = 'top'">top</Button>
          <Button class="m-2" @click="isOpen1 = true;positionDialog1 = 'bottom'">bottom</Button>
          <Button class="m-2" @click="isOpen1 = true;positionDialog1 = 'left'">left</Button>
          <Button class="m-2" @click="isOpen1 = true;positionDialog1 = 'right'">right</Button>
          <Button class="m-2" @click="isOpen1 = true;positionDialog1 = 'bottom-left'">bottom-left</Button>
          <Button class="m-2" @click="isOpen1 = true;positionDialog1 = 'top-left'">top-left</Button>
          <Button class="m-2" @click="isOpen1 = true;positionDialog1 = 'bottom-right'">bottom-right</Button>
          <Button class="m-2" @click="isOpen1 = true;positionDialog1 = 'top-right'">top-right</Button>
        </div>
      </div>
    </div>
    <div class="border-b border-primary-700/50 dark:border-primary-500/50 pb-0 mt-10">
      <h2 class="ml-5 text-xl font-semibold leading-7 text-primary-600 dark:text-primary-500">С формой</h2>
      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
        <p>В диалоговом окне можно сделать сложную форму с валидацией</p>
      </p>
      <div class="col-span-full m-5">
        <Button class="m-2" @click="isOpen2 = true;positionDialog2 = 'left'">Форма слева</Button>
        <Button class="m-2" @click="isOpen2 = true;positionDialog2 = 'right'">Форма справа</Button>
      </div>
    </div>
    <div class="border-b border-primary-700/50 dark:border-primary-500/50 pb-0 mt-10">
      <h2 class="ml-5 text-xl font-semibold leading-7 text-primary-600 dark:text-primary-500">С видео</h2>
      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
        <p>В диалоговом окне можно добавить видео</p>
      </p>
      <div class="col-span-full m-5">
        <Button class="m-2" @click="isOpen3 = true;positionDialog3='bottom'">Открыть</Button>
      </div>
    </div>
    <div class="border-b border-primary-700/50 dark:border-primary-500/50 pb-0 mt-10">
      <h2 class="ml-5 text-xl font-semibold leading-7 text-primary-600 dark:text-primary-500">Закрытие только по нажатию на кнопку</h2>
      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
        <p>У диалогового окна есть параметр <Badge mode="outline">notCloseBackground</Badge> при включении которого закрытие диалогового окна будет срабатывать только по кнопкам которе настроены на закрытие.
        </p>
      </p>
      <div class="col-span-full m-5">
        <Button class="m-2" @click="isOpen4 = true">Открыть</Button>
      </div>
    </div>
    <div class="border-b border-primary-700/50 dark:border-primary-500/50 pb-0 mt-10">
      <h2 class="ml-5 text-xl font-semibold leading-7 text-primary-600 dark:text-primary-500">Копка закрытия</h2>
      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
        <p>Указав параметр <Badge mode="outline">closeButton</Badge> диалоговому окну, добавится кнопка закрытия.</p>
      </p>
      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
        <div class="col-span-full m-5">
          <Button class="m-2" @click="isOpen5 = true">Открыть</Button>
        </div>
      </p>
    </div>
    <div class="border-b border-primary-700/50 dark:border-primary-500/50 pb-0 mt-10">
      <h2 class="ml-5 text-xl font-semibold leading-7 text-primary-600 dark:text-primary-500">Ширина</h2>
      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
        <p>Указав параметр <Badge mode="outline">size</Badge> диалоговому окну, можно задать его ширину.</p>
      </p>
      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
        <div class="col-span-full m-5">
          <Button class="m-2" @click="isOpen6 = true;sizeDialog6 = 'size1'">Размер 1</Button>
          <Button class="m-2" @click="isOpen6 = true;sizeDialog6 = 'size2'">Размер 2</Button>
          <Button class="m-2" @click="isOpen6 = true;sizeDialog6 = 'size3'">Размер 3</Button>
          <Button class="m-2" @click="isOpen6 = true;sizeDialog6 = 'size4'">Размер 4</Button>
          <Button class="m-2" @click="isOpen6 = true;sizeDialog6 = 'size5'">Размер 5</Button>
        </div>
      </p>
    </div>
<!---------------------------->
    <Dialog v-model="isOpen1" :position="positionDialog1" class="">
      <template #default="{closeDialog}">
        <h3 class="text-lg font-medium leading-6 text-gray-900 dark:text-gray-200">
          Пример заголовка
        </h3>
        <div class="my-2">
          <p class="text-sm text-gray-500">
            Тут может быть любой текст, изображения, инструкции, формы заполнения и вообще любой интерфейс
          </p>
        </div>
        <Button class="mt-5 mx-2" mode="destructive" @click="closeDialog">Нет</Button>
        <Button class="mt-5 mx-2" mode="creative" @click="closeDialog">Да</Button>
        <Button class="mt-5 mx-2 absolute right-3" mode="neutral" @click="closeDialog">Неопределенность</Button>
      </template>
    </Dialog>
    <Dialog v-model="isOpen2" :position="positionDialog2" close-button without-margin class="bg-white dark:bg-neutral-900 h-screen border-[1px] border-neutral-200 dark:border-neutral-700 rounded-none">
      <template #default="{closeDialog}">
        <StForm
          ref="formTest"
          :structure="structures"
          class="mt-8 max-h-[80vh] overflow-y-auto overscroll-contain [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'10px']"
          mode-style="filled"
          mode-label="offsetDynamic"
          mode-validate="onChange"
          submit-button="Сохранить"
          structure-class="border-b border-gray-900/50 dark:border-gray-400/50 pb-0 mt-10"
          structure-class-grid="grid-cols-1 gap-x-6 gap-y-0 sm:grid-cols-6 mt-5"
          @update:form-fields="(formFields)=>form = formFields">
          <template #itemTitle="{structure}">
            <h2 v-if="structure?.title?.length" class="text-xl font-semibold leading-7 text-gray-900 dark:text-gray-100">{{ structure?.title }}</h2>
            <p v-if="structure?.subTitle?.length" class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">{{ structure?.subTitle }}</p>
          </template>
          <template #footer>
            <Button type="submit" class="mt-2 mx-2">Сохранить</Button>
          </template>
        </StForm>
      </template>
    </Dialog>
    <Dialog v-model="isOpen3" :position="positionDialog3" class="max-w-[60vw] m-5 p-0">
      <iframe allow="autoplay; encrypted-media" allowfullscreen class="w-full aspect-video" src="https://www.youtube.com/embed/t2I3Yd27dGw?feature=oembed&autoplay=1"></iframe>
    </Dialog>
    <Dialog v-model="isOpen4" :position="positionDialog4" not-close-background class="p-0">
      <template #default="{closeDialog}">
        <div class="bg-gray-100 dark:bg-gray-900 px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-800 sm:mx-0 sm:h-10 sm:w-10">
              <ExclamationTriangleIcon class="h-6 w-6 text-red-600 dark:text-red-300" aria-hidden="true" />
            </div>
            <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
              <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-gray-100">Деактивировать аккаунт</h3>
              <div class="mt-2">
                <p class="text-sm text-gray-500">Вы уверены, что хотите деактивировать свою учетную запись? Все ваши данные будут удалены навсегда. Это действие не может быть отменено.</p>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 dark:bg-gray-950 px-4 py-3 flex justify-center sm:justify-start sm:flex-row-reverse sm:px-6">
          <Button class="mx-2" mode="destructive" @click="closeDialog">Деактивировать</Button>
          <Button class="mx-2" mode="neutral" @click="closeDialog">Отмена</Button>
        </div>
      </template>
    </Dialog>
    <Dialog v-model="isOpen5" :position="positionDialog5" close-button class="p-0">
      <template #default="{closeDialog}">
        <div class="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-800">
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white"> NEOM </h3>
        </div>
        <!-- Modal body -->
        <div class="p-6 space-y-6">
          <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
            Nature Reserve – NEOM, Saudi Arabia | The NEOM Nature Reserve region is being designed to deliver protection and restoration of biodiversity across 95% of NEOM.
          </p>
          <img class="rounded-lg" src="https://images.unsplash.com/photo-1682687220989-cbbd30be37e9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3870&q=80" alt="">
          <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
            Nature Reserve – NEOM, Saudi Arabia
          </p>
        </div>
        <!-- Modal footer -->
        <div class="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-800">
          <Button class="mx-2" mode="primary" @click="closeDialog">Скачать</Button>
          <Button class="mx-2 px-2" mode="ghost" @click="closeDialog"><Icons type="shopping-bag" class="h-4 w-4"/></Button>
          <Button class="mx-2 px-2" mode="ghost" @click="closeDialog"><Icons type="link" class="h-4 w-4"/></Button>
        </div>
      </template>
    </Dialog>
    <Dialog v-model="isOpen6" position="top" :size="sizeDialog6" close-button class="p-0">
      <template #default="{closeDialog}">
        <div class="bg-gray-100 dark:bg-gray-900 px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-800 sm:mx-0 sm:h-10 sm:w-10">
              <ExclamationTriangleIcon class="h-6 w-6 text-red-600 dark:text-red-300" aria-hidden="true" />
            </div>
            <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
              <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-gray-100">Деактивировать аккаунт</h3>
              <div class="mt-2">
                <p class="text-sm text-gray-500">Вы уверены, что хотите деактивировать свою учетную запись? Все ваши данные будут удалены навсегда. Это действие не может быть отменено.</p>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 dark:bg-gray-950 px-4 py-3 flex justify-center sm:justify-start sm:flex-row-reverse sm:px-6">
          <Button class="mx-2" mode="destructive" @click="closeDialog">Деактивировать</Button>
        </div>
      </template>
    </Dialog>
  </ComponentViews>
</template>

<style scoped>

</style>