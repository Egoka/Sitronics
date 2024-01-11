<script setup lang="ts">

import ComponentViews from "@/components/ComponentViews.vue";
import Menu from "@/components/functional/Menu.vue";
import {ref} from "vue";
import Button from "@/components/functional/Button.vue";
import openAlert from "@/components/functional/Alert";
import FixWindow from "@/components/functional/FixWindow.vue";
import {Bars3Icon, ChevronDownIcon} from "@heroicons/vue/20/solid";
import StSwitch from "@/components/form/StSwitch.vue";
import type {IGroups} from "@/components/functional/Menu";

const baseMenu1 = ref<IGroups>([{items: [{title: 'Profile',/*icon: 'user',info: '<div>+1</div>',*/},{title: 'Billing',/*icon: 'credit-card',info: '⌘B',*/},{title: 'Settings',/*icon: 'cog-6-tooth',info: '⌘S'*/},{title: 'Keyboard shortcuts', disabled: true, /*icon: 'solar:keyboard-outline',info: '⌘K'*/},]}])
const baseMenu2 = ref<IGroups>([{items: [{title: 'Profile',icon: 'user',/*info: '<div>+1</div>',*/},{title: 'Billing',icon: 'credit-card',/*info: '⌘B',*/},{title: 'Settings',icon: 'cog-6-tooth',/*info: '⌘S'*/},{title: 'Keyboard shortcuts',icon: 'solar:keyboard-outline',/*info: '⌘K'*/},]}])
const baseMenu21 = ref<IGroups>([{items: [{title: 'Profile',icon: 'chevron-right',/*info: '<div>+1</div>',*/},{title: 'Billing',icon: 'chevron-right',/*info: '⌘B',*/},{title: 'Settings',icon: 'chevron-right',/*info: '⌘S'*/},{title: 'Keyboard shortcuts',icon: 'chevron-right',/*info: '⌘K'*/},]}])
// const baseMenu22 = ref<IGroups>([{items: [{/*title: 'Electronics',*/icon: 'carbon:home',/*info: '<div>+1</div>',*/},{title: 'Electronics',icon: 'chevron-right',/*info: '<div>+1</div>',*/},{title: 'Computer',icon: 'chevron-right',/*info: '⌘B',*/},{title: 'Accessories',icon: 'chevron-right',/*info: '⌘S'*/},{title: 'Keyboard',icon: 'solar:keyboard-outline',/*info: '⌘K'*/},]}])
const baseMenu3 = ref<IGroups>([{items: [{title: 'Profile',icon: 'user',info: '<div>+1</div>'},{title: 'Billing',icon: 'credit-card',info: '⌘B'},{title: 'Settings',icon: 'cog-6-tooth',info: '⌘S'},{title: 'Keyboard shortcuts',icon: 'solar:keyboard-outline',info: '⌘K'}]}])
const baseMenu31 = ref<IGroups>([{items: [{title: 'Home',icon: 'carbon:home'}], separator: {isVisible: false}}, {items: [{title: 'Profile',icon: 'user'}]},{items: [{title: 'Billing',icon: 'credit-card',info: '⌘B'}]},{items: [{title: 'Settings',icon: 'cog-6-tooth',info: '⌘S'}]},{items: [{title: 'Keyboard shortcuts',icon: 'solar:keyboard-outline',info: '⌘K'}]}])
const baseMenu4 = ref<IGroups>([{title: "Пользователь", items: [{title: 'Profile',icon: '',info: '<div>+1</div>'},{title: 'Billing',icon: 'credit-card',info: '⌘B'},{title: 'Settings',icon: 'cog-6-tooth',info: '⌘S'},{title: 'Keyboard shortcuts',icon: 'solar:keyboard-outline',info: '⌘K'}]},{separator: {/*icon: 'akar-icons:github-outline-fill'*/},items: [{title: 'GitHub',icon: 'akar-icons:github-outline-fill',menu: {/*title: 'Test',*/groups: [{items: [{title: 'Email',icon: 'carbon:email'},{title: 'Message',icon: 'chat-bubble-left'},{title: 'More...',icon: 'plus-circle'}]}]}},{title: 'Support',icon: 'system-uicons:support',menu: {/*title: 'Test',*/groups: [{items: [{title: 'Email',icon: 'carbon:email'},{title: 'Message',icon: 'chat-bubble-left'},{title: 'More...',icon: 'plus-circle'}]}]}},{title: 'API',icon: 'bi:cloudy',info: '⌘+T',disabled: true},]}])
const groupsMenu = ref<IGroups>([
  {
    separator: {
      // icon: "user",
    },
    items: [
      {
        title: "Profile",
        icon: "user",
        info: "<div>+1</div>",
        // onClick(event: MouseEvent, item: IItemMenuPrivate) {
        //   eventClick.value = "Profile"
        // }
      },
      {
        title: "Billing",
        icon: "credit-card",
        info: "⌘B",
        // onClick(event: MouseEvent, item: IItemMenuPrivate) {
        //   eventClick.value = "Billing"
        // }
      },
      {
        title: "Settings",
        icon: "cog-6-tooth",
        info: "⌘S"
      },
      {
        title: "Keyboard shortcuts",
        icon: "solar:keyboard-outline",
        // info: "⌘K"
      },
    ]
  },
  {
    separator: {
      // icon: "users",
    },
    items: [
      {
        title: "Team",
        icon: "users",
      },
      {
        title: "Invite users",
        icon: "user-plus",
        menu: {
          // title: "Invite users",
          groups: [
            {
              items: [
                {
                  title: "Email",
                  icon: "envelope",
                  menu: {
                    // title: "Email",
                    groups: [
                      {
                        items: [
                          {
                            title: "Email",
                            icon: "envelope",
                            menu: {
                              // title: "Email",
                              groups: [
                                {
                                  items: [
                                    {
                                      title: "Email",
                                      icon: "envelope"
                                    },
                                    {
                                      title: "Message",
                                      icon: "chat-bubble-left"
                                    },
                                    {
                                      title: "More...",
                                      icon: "plus-circle"
                                    }
                                  ]
                                }
                              ]
                            }
                          },
                          {
                            title: "Message",
                            icon: "chat-bubble-left"
                          },
                          {
                            title: "More...",
                            icon: "plus-circle"
                          }
                        ]
                      }
                    ]
                  }
                },
                {
                  title: "Message",
                  icon: "chat-bubble-left",
                  // onClick(event: MouseEvent, item: IItemMenuPrivate) {
                  //   eventClick.value = "Message"
                  // }
                },
                {
                  title: "More...",
                  icon: "plus-circle",
                }
              ]
            },
            {
              items: [
                {
                  title: "More...",
                  icon: "plus-circle",
                }
              ]
            }
          ]
        }
      },
      {
        title: "New Team",
        icon: "plus",
        info: "⌘+T"
      },
    ]
  },
  {
    separator: {
      // icon: "RiGithubLine"
    },
    items: [
      {
        title: "GitHub",
        icon: "akar-icons:github-outline-fill",
        menu: {
          // title: "Test",
          groups: [
            {
              items: [
                {
                  title: "Email",
                  icon: "envelope"
                },
                {
                  title: "Message",
                  icon: "chat-bubble-left"
                },
                {
                  title: "More...",
                  icon: "plus-circle"
                }
              ]
            }
          ]
        }
      },
      {
        title: "Support",
        icon: "system-uicons:support",
        menu: {
          // title: "Test",
          groups: [
            {
              items: [
                {
                  title: "Email",
                  icon: "envelope"
                },
                {
                  title: "Message",
                  icon: "chat-bubble-left"
                },
                {
                  title: "More...",
                  icon: "plus-circle"
                }
              ]
            }
          ]
        }
      },
      {
        title: "API",
        icon: "bi:cloudy",
        info: "⌘+T",
        disabled: true
      },
    ]
  },
  {
    // separator: {
    //   icon: ""
    // },
    items: [
      {
        title: "Log out",
        icon: "ic:round-logout",
        info: "⇧⌘Q"
      }
    ]
  }
])
const onlyIcons = ref(true)
</script>

<template>
  <ComponentViews>
    <template #title>Menu</template>
    <div class="border-b border-theme-700/50 dark:border-theme-500/50 pb-0 mt-10">
      <h2 class="ml-5 text-xl font-semibold leading-7 text-theme-600 dark:text-theme-500">Menu</h2>
      <p class="my-4 text-sm leading-6 text-gray-600 dark:text-gray-400">
        Компонент меню в - это важный элемент пользовательского интерфейса, который обеспечивает навигацию по веб-приложению. Он обычно содержит список ссылок или действий, которые пользователи могут выбрать.
        Mеню предлагает большую гибкость и настраиваемость, что делает его полезным для различных сценариев использования. Например:
        <ul class="list-disc ml-4">
          <li>Многоуровневая навигация: С помощью свойства groups и menu можно создать многоуровневое меню, что особенно полезно для больших сайтов с множеством разделов.</li>
          <li>Настройка внешнего вида: Свойства mode, vertical и onlyIcons позволяют настроить внешний вид меню, чтобы он соответствовал дизайну вашего приложения.</li>
          <li>Интерактивность: Свойства onActive, onInactive и onClick позволяют добавить интерактивность в меню, реагируя на действия пользователя.</li>
          <li>Управление доступностью: С помощью свойства disabled можно контролировать доступность определенных элементов меню.</li>
        </ul>
        В целом, компонент меню помогает создать интуитивно понятный и удобный для пользователя интерфейс, облегчая навигацию по веб-приложению.
      </p>
    </div>
    <div class="border-b border-theme-700/50 dark:border-theme-500/50 pb-0 mt-10">
      <h2 class="ml-5 text-xl font-semibold leading-7 text-theme-600 dark:text-theme-500">Базовое использование</h2>
<!--      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">-->
<!--        <p></p>-->
<!--      </p>-->
      <div class="grid transition grid-cols-1 gap-x-6 gap-y-0 sm:grid-cols-6">
        <div class="col-span-2 my-5">
          <Menu :groups="baseMenu1" @on-click="(event, item) => {openAlert({title: item.title, displayTime: 2000})}"></Menu>
        </div>
        <div class="col-span-2 my-5">
          <Menu :groups="baseMenu2" @on-click="(event, item) => {openAlert({title: item.title, displayTime: 2000})}"></Menu>
        </div>
        <div class="col-span-2 my-5">
          <Menu :groups="baseMenu3" @on-click="(event, item) => {openAlert({title: item.title, displayTime: 2000})}"></Menu>
        </div>
      </div>
    </div>
    <div class="border-b border-theme-700/50 dark:border-theme-500/50 pb-0 mt-10">
      <h2 class="ml-5 text-xl font-semibold leading-7 text-theme-600 dark:text-theme-500">Вложенные под меню</h2>
<!--      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">-->
<!--        <p></p>-->
<!--      </p>-->
      <div class="grid transition grid-cols-1 gap-x-6 gap-y-0 sm:grid-cols-6">
        <div class="col-span-2 my-5">
          <Menu :groups="baseMenu4" @on-click="(event, item) => {openAlert({title: item.title, displayTime: 2000})}"></Menu>
        </div>
        <div class="col-span-2 my-5">
          <Menu :separator="{gradient: [20, 20]}" :groups="groupsMenu" selected :styles="{width: '14rem'}" @on-click="(event, item) => {openAlert({title: item.title, displayTime: 2000})}"/>
        </div>
        <div class="col-span-2 my-5"></div>
      </div>
    </div>
    <div class="border-b border-theme-700/50 dark:border-theme-500/50 pb-0 mt-10">
      <h2 class="ml-5 text-xl font-semibold leading-7 text-theme-600 dark:text-theme-500">Заголовок и разделитель</h2>
<!--      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">-->
<!--        <p></p>-->
<!--      </p>-->
      <div class="grid transition grid-cols-1 gap-x-6 gap-y-0 sm:grid-cols-6">
        <div class="col-span-2 my-5">
          <Menu title="My Account" :groups="baseMenu4" @on-click="(event, item) => {openAlert({title: item.title, displayTime: 2000})}"/>
        </div>
        <div class="col-span-2 my-5">
          <Menu title="My Account" :groups="baseMenu4" :separator="{gradient:[10,50]}" @on-click="(event, item) => {openAlert({title: item.title, displayTime: 2000})}"/>
        </div>
        <div class="col-span-2 my-5">
          <Menu title="My Account" :groups="baseMenu4" :separator="{gradient:[10,50], icon: 'gala:add'}" @on-click="(event, item) => {openAlert({title: item.title, displayTime: 2000})}"/>
        </div>
      </div>
    </div>
    <div class="border-b border-theme-700/50 dark:border-theme-500/50 pb-0 mt-10">
      <h2 class="ml-5 text-xl font-semibold leading-7 text-theme-600 dark:text-theme-500">Только иконки</h2>
<!--      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">-->
<!--        <p></p>-->
<!--      </p>-->
      <div class="grid transition grid-cols-1 gap-x-6 gap-y-0 sm:grid-cols-6">
        <div class="col-span-2 my-5">
          <Menu :groups="baseMenu4" :separator="{gradient:[10,50]}" :only-icons="onlyIcons" @on-click="(event, item) => {openAlert({title: item.title, displayTime: 2000})}"/>
        </div>
        <div class="col-span-2 my-5">
          <Menu :separator="{gradient: [20, 20]}" :groups="groupsMenu" :only-icons="onlyIcons" selected @on-click="(event, item) => {openAlert({title: item.title, displayTime: 2000})}"/>
        </div>
        <div class="col-span-2 my-5">
          <StSwitch label="Только иконки" v-model="onlyIcons" :params-switch="{switchingType: 'switch'}"></StSwitch>
        </div>
      </div>
    </div>
    <div class="border-b border-theme-700/50 dark:border-theme-500/50 pb-0 mt-10">
      <h2 class="ml-5 text-xl font-semibold leading-7 text-theme-600 dark:text-theme-500">Горизонтальныое меню</h2>
<!--      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">-->
<!--        <p></p>-->
<!--      </p>-->
      <div class="grid transition grid-cols-1 gap-x-6 gap-y-0 sm:grid-cols-6">
        <div class=" col-span-full my-5">
          <Menu title="My Account" :groups="baseMenu4" :separator="{gradient:[10,50]}" horizontal class="max-w-3xl" @on-click="(event, item) => {openAlert({title: item.title, displayTime: 2000})}"/>
        </div>
        <div class=" col-span-full my-5">
          <Menu title="My Account" :groups="baseMenu4" :separator="{gradient:[10,50]}" horizontal only-icons class="max-w-3xl" @on-click="(event, item) => {openAlert({title: item.title, displayTime: 2000})}"/>
        </div>
        <div class=" col-span-full my-5">
          <Menu :separator="{gradient: [20, 20],}" :groups="groupsMenu" :params-window-menu="{eventOpen: 'click',eventClose: 'click'}" horizontal class="max-w-3xl" @on-click="(event, item) => {openAlert({title: item.title, displayTime: 2000})}"/>
        </div>
      </div>
    </div>
    <div class="border-b border-theme-700/50 dark:border-theme-500/50 pb-0 mt-10">
      <h2 class="ml-5 text-xl font-semibold leading-7 text-theme-600 dark:text-theme-500">Breadcrumb</h2>
      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
        <p>Breadcrumb предоставляет контекстную информацию об иерархии страниц.</p>
      </p>
      <div class="grid transition grid-cols-1 gap-x-6 gap-y-0 sm:grid-cols-6">
        <div class=" col-span-full my-5">
          <Menu :groups="baseMenu21" :separator="{gradient:[10,50], icon:'chevron-right', content:'full'}" horizontal class="max-w-3xl" @on-click="(event, item) => {openAlert({title: item.title, displayTime: 2000})}">
            <template #title="test">
              Home
            </template>
          </Menu>
        </div>
      </div>
<!--      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">-->
<!--        <p></p>-->
<!--      </p>-->
      <div class="grid transition grid-cols-1 gap-x-6 gap-y-0 sm:grid-cols-6">
        <div class=" col-span-full my-5">
          <Menu :groups="baseMenu31" :separator="{gradient:[10,50], icon:'chevron-right', content:'full'}" horizontal class="max-w-3xl" @on-click="(event, item) => {openAlert({title: item.title, displayTime: 2000})}"/>
        </div>
      </div>
<!--      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">-->
<!--        <p></p>-->
<!--      </p>-->
      <div class="grid transition grid-cols-1 gap-x-6 gap-y-0 sm:grid-cols-6">
        <div class=" col-span-full my-5">
          <Menu :groups="baseMenu31" :separator="{gradient:[10,50], icon:'chevron-right', content:'full'}" horizontal only-icons class="max-w-3xl" @on-click="(event, item) => {openAlert({title: item.title, displayTime: 2000})}"/>
        </div>
      </div>
    </div>
    <div class="border-b border-theme-700/50 dark:border-theme-500/50 pb-0 mt-10">
      <h2 class="ml-5 text-xl font-semibold leading-7 text-theme-600 dark:text-theme-500">ContextMenu</h2>
      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
        <p>ContextMenu отображает наложенное меню для отображения действий, связанных с элементом.</p>
      </p>
      <div class="grid transition grid-cols-1 gap-x-6 gap-y-0 sm:grid-cols-6">
        <div class=" col-span-full my-5">
          <div class="w-full h-44 bg-neutral-100 dark:bg-neutral-900 rounded border-2 border-dotted dark:border-neutral-600 flex justify-center items-center text-neutral-400">
            Right click here.
            <FixWindow event-open="contextmenu" event-close="hover" by-cursor position="center-top">
              <Menu title="My Account" :groups="baseMenu4" :separator="{gradient:[10,50]}" @on-click="(event, item) => {openAlert({title: item.title, displayTime: 2000})}"/>
            </FixWindow>
          </div>
        </div>
      </div>
    </div>
    <div class="border-b border-theme-700/50 dark:border-theme-500/50 pb-0 mt-10">
      <h2 class="ml-5 text-xl font-semibold leading-7 text-theme-600 dark:text-theme-500">Dropdown Menu</h2>
      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
        <p>Отображает пользователю меню, например набор действий или функций, активируемое кнопкой.</p>
      </p>
      <div class="grid transition grid-cols-1 gap-x-6 gap-y-0 sm:grid-cols-6">
        <div class=" col-span-1 my-5">
          <Button class="rounded-full h-9 w-9 px-0">
            <Bars3Icon class="h-4 w-4"/>
            <FixWindow event-open="click" event-close="hover">
              <Menu title="My Account" :groups="baseMenu4" :separator="{gradient:[10,50]}" @on-click="(event, item) => {openAlert({title: item.title, displayTime: 2000})}"/>
            </FixWindow>
          </Button>
        </div>
        <div class=" col-span-1 my-5">
          <Button>
            Menu
            <FixWindow event-open="click" event-close="hover">
              <Menu title="My Account" :groups="baseMenu4" :separator="{gradient:[10,50]}" @on-click="(event, item) => {openAlert({title: item.title, displayTime: 2000})}"/>
            </FixWindow>
          </Button>
        </div>
        <div class="col-span-1 my-5">
          <div class="flex flex-row items-center">
            <Button class="ml-1 w-20 rounded-none rounded-l-md rounded-r-0">Menu</Button>
            <Button class="h-9 w-9 px-0 mr-1 rounded-none rounded-r-md border-l-0">
              <ChevronDownIcon class="h-4 w-4"/>
              <FixWindow event-open="click" event-close="hover" position="bottom">
                <Menu title="My Account" :groups="baseMenu4" :separator="{gradient:[10,50]}" @on-click="(event, item) => {openAlert({title: item.title, displayTime: 2000})}"/>
              </FixWindow>
            </Button>
          </div>
        </div>
      </div>
    </div>
  </ComponentViews>
</template>