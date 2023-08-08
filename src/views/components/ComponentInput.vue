<script setup lang="ts">

import {ref, onMounted, watch, VueElement, onRenderTriggered} from 'vue'
import Controller from "@/classes/Controller";
import type {IController, IStructure} from "@/classes/Controller.interface";
import {viewComponent} from "@/components/views";
import {ArrowsRightLeftIcon, CubeIcon, CurrencyYenIcon, PhoneIcon, UserGroupIcon} from "@heroicons/vue/24/outline";
const value = ref("50")
const isInvalid = ref(false)
const messageValid = ref("")
const country = ref("RU")
const currency = ref("₽")
const password = ref("")
const phone = ref("")
const price = ref("")
const count = ref("")
const length = ref("12234234.34")
const dimension = ref("")
const isInvalidDimension = ref(false)
const messageValidDimension = ref("")
const inputView = <IController>new Controller(<Array<IStructure>>[
  viewComponent("Input",[
    {
      component: "StInput",
      props: {
        modelValue: value,
        label: "Первое поле",
        type: "text",
        class: "text-right",
        help: "<img src='https://cdn-icons-png.flaticon.com/512/1828/1828439.png' class='w-20 m-auto' alt=''> Это тестовое поле предназначеное для проверки работы справодного поля",
        clear: true,
        isRequired: true,
        isInvalid: isInvalid,
        messageValid: messageValid,
        onUpdateModelValue: (e:any)=> value.value = e,
        onUpdateIsInvalid: (e:any)=> isInvalid.value = e
      },
      slots:{
        before:()=> [
          {
            component: "UserGroupIcon",
            props: {
              class: "h-5 w-5 text-gray-400",
              "aria-hidden": "true"
            },
          },
          {
            component: "label",
            props: {
              for: "country",
              class: "sr-only"
            },
            children:["Country"]
          },
          {
            component: "StSelect",
            props: {
              class: "ring-0 min-w-[3rem]",
              modelValue: country,
              onUpdateModelValue: (e:any)=>country.value = e,
              dataSelect: ['RU', 'US','CN'],
              selectIcon: "ChevronDownIcon"
            },
            slots:{
              selected:({selected})=> [selected],
              item: ({item})=>[item]
            }
          }
        ],
        after:()=>[
          {
            component: "label",
            props: {
              for: "currency",
              class: "sr-only"
            },
            children:["Currency"]
          },
          {
            component: "StSelect",
            props: {
              class: "ring-0 min-w-[3rem]",
              modelValue: currency,
              onUpdateModelValue: (e:any)=>currency.value = e,
              items: ['₽', '¥','$','€'],
              selectIcon: "ChevronDownIcon"
            },
            slots:{
              selected:({selected})=> [selected],
              item: ({item})=>[item]
            }
          }
        ]
      }
    },
    {
      component: "StInput", props: {
        modelValue: password,
        label:"Пароль",
        type:"password",
        isRequired: true,
        onUpdateModelValue: (e:any)=> password.value = e,
      },
      slots: {
        before: ()=>[
          {
            component: "span",
            props: {
              class: "flex select-none items-center text-gray-500 sm:text-sm"
            },
            children: ["Ваш пароль"]
          }
        ]
      }
    },
    {
      component: "StInput",
      props: {
        modelValue: phone,
        label: "Телефон",
        type: "text",
        clear: true,
        mask: "phone",
        onUpdateModelValue: (e:any)=> phone.value = e,
      },
      slots: {
        before: ()=>[
          {
            component: "PhoneIcon",
            props: {
              class: "h-5 w-5 text-gray-400",
              "aria-hidden": "true"
            }
          }
        ]
      }
    },
    {
      component: "StInput",
      props: {
        modelValue: price,
        label: "Цена",
        type: "text",
        mask: "price",
        labelMode: "dynamic",
        class: "text-right",
        lengthInteger: "7",
        lengthDecimal: "2",
        clear: true,
        onUpdateModelValue: (e:any)=> price.value = e,
      },
      slots: {
        before: ()=>[
          {
            component: "CurrencyYenIcon",
            props: {
              class: "h-5 w-5 text-gray-400",
              "aria-hidden": "true"
            }
          }
        ],
        after: ()=>[
          {
            component: "p",
            props: { class: "mx-2 text-gray-400"},
            children: ["¥"]
          }
        ]
      }
    },
    {
      component: "StInput",
      props: {
        modelValue: count,
        label: "Ширина",
        labelMode: "offsetDynamic",
        type: "text",
        mask: "price",
        mode: "underlined",
        class: "text-right",
        lengthInteger: "7",
        lengthDecimal: "1",
        clear: true,
        onUpdateModelValue: (e:any)=> count.value = e,
      },
      slots: {
        before: ()=>[
          {
            component: "ArrowsRightLeftIcon",
            props: {
              class: "h-5 w-5 text-gray-400",
              "aria-hidden": "true"
            }
          }
        ],
        after: ()=>[
          {
            component: "p",
            props: { class: "mx-2 text-gray-400"},
            children: [count.value ? "метра": ""]
          }
        ]
      }
    },
    {
      component: "StInput",
      props: {
        modelValue: length,
        label: "Длина",
        labelMode: "offsetDynamic",
        type: "text",
        mask: "number",
        mode: "underlined",
        class: "text-right",
        lengthInteger: "7",
        lengthDecimal: "1",
        help: "Вспомогательный текст",
        clear: true,
        disabled: true,
        onUpdateModelValue: (e:any)=> length.value = e,
      },
      slots: {
        before: ()=>[
          {
            component: "ArrowsRightLeftIcon",
            props: {
              class: "h-5 w-5 text-gray-400",
              "aria-hidden": "true"
            }
          }
        ],
        after: ()=>[
          {
            component: "p",
            props: { class: "mx-2 text-gray-400"},
            children: [!length.value||"метра"]
          }
        ]
      }
    },
    {
      component: "StInput",
      props: {
        modelValue: dimension,
        isInvalid: isInvalidDimension,
        label: "Степень негабаритности",
        placeholder: "H0000",
        type: "text",
        mode: "filled",
        help: "Вспомогательный текст",
        class: "text-right",
        clear: true,
        messageValid: messageValidDimension,
        onUpdateModelValue: (e:any)=> dimension.value = e,
        onUpdateIsInvalid: (e:any)=> isInvalidDimension.value = e
      },
      slots: {
        before: ()=>[
          {
            component: "CubeIcon",
            props: {
              class: "h-5 w-5 text-gray-400",
              "aria-hidden": "true"
            }
          }
        ],
        after: ()=>[
          {
            component: "p",
            props: { class: "mx-2 text-gray-400"},
            children: [dimension.value ? "степень" : ""]
          }
        ]
      }
    }
  ]),
  {
    component: "button",
    props: {
      type: "submit",
      class: "flex w-32 m-auto justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600",
      onClick: ()=> valid()
    },
    children: [
      "Валидация"
    ]
  }
], {UserGroupIcon, PhoneIcon, CurrencyYenIcon, ArrowsRightLeftIcon, CubeIcon})
function valid() {
  isInvalid.value = true
  isInvalidDimension.value = true
  messageValid.value = "Обязательное поле"
  messageValidDimension.value = "Обязательное поле"
}
onMounted(()=>{
  console.log(inputView)
})
</script>

<!--<template>-->
<!--  <StInput-->
<!--    v-model.trim="value"-->
<!--    label="Первое поле"-->
<!--    type="text"-->
<!--    help="Это тестовое поле предназначеное для проверки работы справодного поля"-->
<!--    clear-->
<!--    :rules="['required',{}]"-->
<!--  >-->
<!--    <template #before>-->
<!--      <UserGroupIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />-->
<!--      <label for="country" class="sr-only">Country</label>-->
<!--      <StSelect class="ring-0 min-w-[3rem]" v-model="country" :items="['RU', 'US','CN']" select-icon="ChevronDownIcon">-->
<!--        <template #selected="{selected}">-->
<!--          {{ selected }}-->
<!--        </template>-->
<!--        <template #item="{item}">-->
<!--          {{ item }}-->
<!--        </template>-->
<!--      </StSelect>-->
<!--    </template>-->
<!--    <template #after>-->
<!--      <label for="currency" class="sr-only">Currency</label>-->
<!--      <StSelect class="ring-0 min-w-[1rem]" v-model="currency" :items="['₽', '¥','$','€']">-->
<!--        <template #selected="{selected}">-->
<!--          {{ selected }}-->
<!--        </template>-->
<!--        <template #item="{item}">-->
<!--          {{ item }}-->
<!--        </template>-->
<!--      </StSelect>-->
<!--    </template>-->
<!--  </StInput>-->
<!--  <StInput-->
<!--    v-model.trim="value"-->
<!--    label="Пароль"-->
<!--    type="password"-->
<!--    :rules="['required',{}]"-->
<!--  >-->
<!--    <template #before>-->
<!--      <span class="flex select-none items-center text-gray-500 sm:text-sm">Ваш пароль</span>-->
<!--    </template>-->
<!--  </StInput>-->
<!--  <StInput-->
<!--    v-model.trim="phone"-->
<!--    label="Телефон"-->
<!--    type="text"-->
<!--    clear-->
<!--    mask="phone"-->
<!--  >-->
<!--    <template #before>-->
<!--      <PhoneIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />-->
<!--    </template>-->
<!--  </StInput>-->
<!--  <StInput-->
<!--    v-model.trim="price"-->
<!--    label="Цена"-->
<!--    type="text"-->
<!--    mask="price"-->
<!--    class="text-right"-->
<!--    length-integer="7"-->
<!--    length-decimal="2"-->
<!--    clear-->
<!--  >-->
<!--    <template #before>-->
<!--      <CurrencyYenIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />-->
<!--    </template>-->
<!--    <template #after>-->
<!--      <p class="mx-2 text-gray-400">¥</p>-->
<!--    </template>-->
<!--  </StInput>-->
<!--  <StInput-->
<!--    v-model.trim="count"-->
<!--    label="Ширина"-->
<!--    label-mode="offsetDynamic"-->
<!--    type="text"-->
<!--    mask="price"-->
<!--    mode="underlined"-->
<!--    class="text-right"-->
<!--    length-integer="7"-->
<!--    length-decimal="1"-->
<!--    clear-->
<!--  >-->
<!--    <template #before>-->
<!--      <ArrowsRightLeftIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />-->
<!--    </template>-->
<!--    <template #after>-->
<!--      <p v-if="count" class="mx-2 text-gray-400">метра</p>-->
<!--    </template>-->
<!--  </StInput>-->
<!--  <StInput-->
<!--    v-model.trim="length"-->
<!--    label="Длина"-->
<!--    label-mode="offsetDynamic"-->
<!--    type="text"-->
<!--    mask="number"-->
<!--    mode="underlined"-->
<!--    class="text-right"-->
<!--    length-integer="7"-->
<!--    help="Вспомогательный текст"-->
<!--    length-decimal="1"-->
<!--    clear-->
<!--    disabled-->
<!--  >-->
<!--    <template #before>-->
<!--      <ArrowsRightLeftIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />-->
<!--    </template>-->
<!--    <template #after>-->
<!--      <p v-if="length" class="ml-1 mr-3 text-gray-400 select-none">метра</p>-->
<!--    </template>-->
<!--  </StInput>-->
<!--  <StInput-->
<!--    v-model.trim="dimension"-->
<!--    label="Степень негабаритности"-->
<!--    placeholder="H0000"-->
<!--    type="text"-->
<!--    mode="filled"-->
<!--    help="Вспомогательный текст"-->
<!--    clear-->
<!--    class="text-right"-->
<!--    v-model:is-invalid="isInvalid"-->
<!--    :message-valid="messageValid"-->
<!--  >-->
<!--    <template #before>-->
<!--      <CubeIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />-->
<!--    </template>-->
<!--    <template #after>-->
<!--      <p v-if="dimension" class="ml-1 mr-3 text-gray-400 select-none">степень</p>-->
<!--    </template>-->
<!--  </StInput>-->
<!--</template>-->