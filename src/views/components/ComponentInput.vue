<script setup lang="ts">
import {ref, watch} from 'vue'
import { CubeIcon } from "@heroicons/vue/24/outline";
import ComponentViews from "@/components/ComponentViews.vue";
import StInput from "@/components/form/StInput.vue";
import StForm, {IFormExpose, IFormStructure} from "@/components/form/StForm.vue";
const isInvalid = ref(false)
const messageValid = ref("")
const dimension = ref("")
const badgesClass = "inline-flex items-center rounded-md bg-primary-50 dark:bg-primary-900 px-2 py-0.5 text-xs font-medium text-primary-600 dark:text-primary-400 ring-1 ring-inset ring-primary-500/10"
// ---------------------------------------
const form = ref<any>(null)
const formTest = ref<IFormExpose>()
const structures = ref<Array<IFormStructure>>([
  {
    title: "Поле ввода",
    subTitle: `Базовое использование компонента <span class="${badgesClass}">Input</span>.<br> Можно задать 3 базовых режима:
                <span class="${badgesClass}">Outlined</span> (по умолчанию),
                <span class="${badgesClass}">Filled</span>,
                <span class="${badgesClass}">Underlined</span>`,
    fields:[
      {
        typeComponent: "StInput",
        name: "baseOutlined",
        mode: "outlined"
      },
      {
        typeComponent: "StInput",
        name: "baseFilled",
        mode: "filled"
      },
      {
        typeComponent: "StInput",
        name: "baseUnderlined",
        mode: "underlined"
      }
    ]
  },
  {
    title: "Название поля",
    subTitle: `Каждому полю ввода можно добавить параметр <span class="${badgesClass}">label</span>.`,
    fields:[
      {
        typeComponent: "StInput",
        name: "labelOutlined",
        label: "Название outlined",
        mode: "outlined"
      },
      {
        typeComponent: "StInput",
        name: "labelFilled",
        label: "Название filled",
        mode: "filled"
      },
      {
        typeComponent: "StInput",
        name: "labelUnderlined",
        label: "Название underlined",
        mode: "underlined"
      }
    ]
  },
  {
    title: "Режим названия поля",
    subTitle: `Название поля может находиться в 5 режимах для аргумента <span class="${badgesClass}">labelMode</span>:
            <br><span class="${badgesClass}">offsetDynamic</span> (по умолчанию),
                <span class="${badgesClass}">offsetStatic</span>,
                <span class="${badgesClass}">dynamic</span>,
                <span class="${badgesClass}">static</span>,
                <span class="${badgesClass}">vanishing</span>`,
    fields:[
      {
        typeComponent: "StInput",
        name: "labelModeOffsetDynamic",
        label: "offsetDynamic",
        labelMode: "offsetDynamic",
      },
      {
        typeComponent: "StInput",
        name: "labelModeOutlinedOffsetStatic",
        label: "offsetStatic",
        labelMode: "offsetStatic",
      },
      {
        typeComponent: "StInput",
        name: "labelModeDynamic",
        label: "dynamic",
        labelMode: "dynamic",
      },
      {
        typeComponent: "StInput",
        name: "labelModeStatic",
        label: "static",
        labelMode: "static",
      },
      {
        typeComponent: "StInput",
        name: "labelModeVanishing",
        label: "vanishing",
        labelMode: "vanishing",
      },
    ]
  },
  {
    title: "Дополнительный контент",
    subTitle: `В любом поле ввода можно размещать в начало или конец любой <span class="${badgesClass}">текст</span> или <span class="${badgesClass}">значки</span>`,
    fields:[
      {
        typeComponent: "StInput",
        name: "before",
        label: "Имя",
        beforeIcon: "user-circle"
      },
      {
        typeComponent: "StInput",
        name: "after",
        label: "Стоимость",
        afterIcon: "circle-stack",
        afterText: "рубля",
        paramsInput: {
          mask: "price",
          classInput: "text-right"
        }
      },
      {
        typeComponent: "StInput",
        name: "beforeAndAfter",
        label: "ник",
        beforeIcon: "CoVk",
        beforeText: "https://vk.com/",
        afterText: ".php"
      },
    ]
  },
  {
    title: "Дополнительно",
    subTitle: `В любом поле ввода можно добавить атрибут <span class="${badgesClass}">autocomplete</span> для автозаполнения, <span class="${badgesClass}">Placeholder</span> для примера заполнения,<span class="${badgesClass}">clear</span> для очищения ввода, <span class="${badgesClass}">help</span> для любой вспомогательной инструкции и <span class="${badgesClass}">required</span> для выставления звездочки обязательного поля`,
    fields:[
      {
        typeComponent: "StInput",
        name: "autocomplete",
        label: "Отсутствие автозаполнения ↓",
        paramsInput: {
          autocomplete: "off",
        }
      },
      {
        typeComponent: "StInput",
        name: "placeholder",
        label: "Пример заполнения ↓",
        paramsInput: {
          placeholder: "Текст примера ввода"
        }
      },
      {
        typeComponent: "StInput",
        name: "clear",
        label: "Введите текст и появится крестик →",
        clear: true
      },
      {
        typeComponent: "StInput",
        name: "help",
        label: "Сложный инпут с подсказкой →",
        help: `Вспомогательная инструкция. Которая может состоять из сложнного текста. <span class="${badgesClass}">Например такой</span>`
      },
      {
        typeComponent: "StInput",
        name: "required",
        label: "Обязательный инпут со звездочкой →",
        required: true
      },
    ]
  },
  {
    subTitle: `Еще в любое поле ввода можно добавить атрибут <span class="${badgesClass}">disabled</span> для деактивации поля ввода`,
    fields:[
      {
        typeComponent: "StSwitch",
        name: "switch",
        label: "Переключить",
        modelValue: false,
        paramsSwitch: {
          switchingType: "switch"
        }
      },
      {
        typeComponent: "StInput",
        name: "disabled",
        label: "outlined",
        mode: "outlined",
        disabled: false
      },
      {
        typeComponent: "StInput",
        name: "disabled",
        label: "filled",
        mode: "filled",
        disabled: false
      },      {
        typeComponent: "StInput",
        name: "disabled",
        label: "underlined",
        mode: "underlined",
        disabled: false
      },
    ]
  },
  {
    title: "Маска ввода",
    subTitle: `Для специальных полей можно использовать маски ввода, для таких как числовой <span class="${badgesClass}">number</span>,
финансовый <span class="${badgesClass}">price</span>
и для ввода номеров телефонов <span class="${badgesClass}">phone</span>. <br>
Для числовых и финансовых масок можно добавить параметр <span class="${badgesClass}">lengthInteger</span> для ограничения длины целой части и <span class="${badgesClass}">lengthDecimal</span> для дробной. <br>
Для ввода номера телефона также уже установлены маски телефонов для <span class="${badgesClass}">России (7)</span>, <span class="${badgesClass}">Китая (86)</span>, <span class="${badgesClass}">США (1)</span>, <span class="${badgesClass}">Японии (81)</span>, <span class="${badgesClass}">Южной Кореи (82)</span>`,
    fields:[
      {
        typeComponent: "StInput",
        name: "number",
        label: "number",
        paramsInput: {
          mask: "number",
          lengthInteger: 3,
          lengthDecimal: 2
        },
        beforeIcon: "MdDiscount"
      },
      {
        typeComponent: "StInput",
        name: "price",
        label: "price",
        paramsInput: {
          mask: "price",
          classInput: "text-right",
          lengthInteger: 7,
          lengthDecimal: 2
        },
        beforeIcon: "FaRubleSign",
        afterText: "рубля"
      },
      {
        typeComponent: "StInput",
        name: "phone",
        label: "phone",
        paramsInput: {
          mask: "phone"
        },
        beforeIcon: "phone"
      },
    ]
  },
  {
    subTitle: `Дополнительно можно указать тип ввода для: <span class="${badgesClass}">text</span> (по умолчанию), <span class="${badgesClass}">number</span>, <span class="${badgesClass}">email</span>, <span class="${badgesClass}">password</span>`,
    fields:[
      {
        typeComponent: "StInput",
        name: "typeText",
        label: "text",
        paramsInput: {
          type: "text"
        },
        beforeIcon: "BiBodyText"
      },
      {
        typeComponent: "StInput",
        name: "typeNumber",
        label: "number",
        paramsInput: {
          type: "number"
        },
        beforeIcon: "OiNumber"
      },
      {
        typeComponent: "StInput",
        name: "typeEmail",
        label: "email",
        paramsInput: {
          type: "email"
        },
        beforeIcon: "MdAlternateemailSharp"
      },
      {
        typeComponent: "StInput",
        name: "typePassword",
        label: "password",
        paramsInput: {
          type: "password"
        },
        beforeIcon: "MdPassword"
      },
    ]
  },
  {
    title: "Кастомные",
    subTitle: `Тут приведены примеры как можно через аргументы <span class="${badgesClass}">classInput</span> изменить поле ввода`,
    fields:[
      {
        typeComponent: "StInput",
        name: "customOne",
        label: "text",
        paramsInput: {
          classInput: "!text-primary-700 dark:!text-primary-300"
        },
        beforeIcon: "BiBodyText"
      },
    ]
  }
])
watch(form, ()=>{
  if (form.value["switch"] === true || form.value["switch"] === false){
    formTest.value?.setFieldParam("disabled", "disabled", form.value["switch"])
  }
}, {deep: true})
</script>

<template>
  <ComponentViews>
    <template #title>Input</template>
    <StForm
      ref="formTest"
      :structure="structures"
      structure-class="border-b border-primary-700/50 dark:border-primary-500/50 pb-0 mt-10"
      structure-class-grid="grid-cols-1 gap-x-6 gap-y-0 sm:grid-cols-6 mt-5"
      @update:form-fields="(formFields)=>form = formFields"
    >
      <template #itemTitle="{structure}">
        <h2 v-if="structure?.title?.length" class="ml-5 text-xl font-semibold leading-7 text-primary-600 dark:text-primary-500">{{ structure?.title }}</h2>
        <p v-if="structure?.subTitle?.length" class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400" v-html="structure?.subTitle"/>
      </template>
    </StForm>
    <StInput
      v-model.trim="dimension"
      label="Степень негабаритности"
      :params-input="{
        placeholder: 'H0000',
        type: 'text',
      }"
      mode="filled"
      help="Вспомогательный текст"
      clear
      class="text-right mb-5"
      v-model:is-invalid="isInvalid"
      :message-valid="messageValid"
    >
      <template #before>
        <CubeIcon class="h-5 w-5 text-primary-500" aria-hidden="true" />
      </template>
      <template #after>
        <p v-if="dimension" class="ml-1 mr-3 text-gray-400 select-none">степень</p>
      </template>
    </StInput>
  </ComponentViews>
</template>