<script setup lang="ts">
import ComponentViews from "@/components/ComponentViews.vue";
import Icons from "@/components/functional/Icons.vue";
import Button from "@/components/functional/Button.vue";
import Badge from "@/components/functional/Badge.vue";
import Tooltip from "@/components/functional/Tooltip.vue";
import {ref} from "vue";
// ---------------------------------------
const theme = ref<"atom-one-light"|"atom-one-dark">(window.matchMedia('(prefers-color-scheme: light)')?.matches ? "atom-one-light" : "atom-one-dark")
const colorSchemeQueryList = window.matchMedia('(prefers-color-scheme: dark)');
const setColorScheme = e => {
  if (e.matches) {
    theme.value = "github-dark"
  } else {
    theme.value = "atom-one-light"
  }
}
setColorScheme(colorSchemeQueryList);
colorSchemeQueryList.addEventListener('change', setColorScheme);
// ---------------------------------------
const myCode1 =
`<Button class="m-1" @click="click">Primary</Button>
<Button mode="secondary" class="m-1">Secondary</Button>
<Button mode="creative" class="m-1">Creative</Button>
<Button mode="destructive" class="m-1">Destructive</Button>
<Button mode="outline" class="m-1">Outline</Button>
<Button mode="ghost" class="m-1">Ghost</Button>
<Button mode="link" class="m-1">Link</Button>
<Button mode="text" class="m-1">Text</Button>`
const myCode2 =
`<Button class="m-1">
  <Icons type="Pencil" class="mr-2 -ml-0.5 h-4 w-4"/>
  Primary
</Button>
<Button mode="secondary" class="m-1">
  Secondary
  <Icons type="FcGoogle" class="ml-2 -mr-0.5 h-4 w-4"/>
</Button>
<Button mode="creative" class="m-1">
  <Icons type="CoMathworks" class="mr-2 -ml-0.5 h-4 w-4"/>
  Creative
</Button>
<Button mode="destructive" class="m-1">
  <Icons type="CoMathworks" class="mr-2 -ml-0.5 h-4 w-4"/>
  Destructive
</Button>
<Button mode="outline" class="m-1">
  <Icons type="CoSoundcloud" class="mr-2 -ml-0.5 h-4 w-4"/>
  Outline
</Button>
<Button mode="ghost" class="m-1">
  <Icons type="HiSolidLink" class="mr-2 -ml-0.5 h-4 w-4"/>
  Ghost
</Button>
<Button mode="link" class="m-1">
  <Icons type="CoTelegramPlane" class="mr-2 -ml-0.5 h-4 w-4"/>
  Link  🍇
</Button>
<Button mode="text" class="m-1">
  <Icons type="Pencil" class="mr-2 -ml-0.5 h-4 w-4"/>
  Text  🍈
</Button>`
const myCode3 =
`<Button  disabled class="m-1">
  <Icons type="Pencil" class="mr-2 -ml-0.5 h-4 w-4"/>
  Primary
</Button>
<Button mode="secondary" disabled class="m-1">
  Secondary
  <Icons type="FcGoogle" class="ml-2 -mr-0.5 h-4 w-4"/>
</Button>
<Button mode="creative" disabled class="m-1">
  <Icons type="CoMathworks" class="mr-2 -ml-0.5 h-4 w-4"/>
  Creative
</Button>
<Button mode="destructive" disabled class="m-1">
  <Icons type="CoMathworks" class="mr-2 -ml-0.5 h-4 w-4"/>
  Destructive
</Button>
<Button mode="outline" disabled class="m-1">
  <Icons type="CoSoundcloud" class="mr-2 -ml-0.5 h-4 w-4"/>
  Outline
</Button>
<Button mode="ghost" disabled class="m-1">
  <Icons type="HiSolidLink" class="mr-2 -ml-0.5 h-4 w-4"/>
  Ghost
</Button>
<Button mode="link" disabled class="m-1">
  <Icons type="CoTelegramPlane" class="mr-2 -ml-0.5 h-4 w-4"/>
  Link  🍇
</Button>
<Button mode="text" disabled class="m-1">
  <Icons type="Pencil" class="mr-2 -ml-0.5 h-4 w-4"/>
  Text  🍈
</Button>`
function click(e) {
  console.log(e)
}
</script>

<template>
  <ComponentViews >
    <template #title>Buttons</template>
    <h2 class="text-xl font-semibold leading-7 text-gray-900 dark:text-gray-100">Базовое использование</h2>
    <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
      Тут продемонстрированны все варианты параметра <Badge class="mr-4">mode</Badge><br><Badge>Neutral</Badge> по умолчанию</p>
    <div class="flex flex-wrap my-4 p-3 rounded-lg">
      <Button mode="primary" class="m-1" @click="click">Primary</Button>
      <Button mode="secondary" class="m-1">Secondary</Button>
      <Button mode="creative" class="m-1">Creative</Button>
      <Button mode="destructive" class="m-1">Destructive</Button>
      <Button mode="neutral" class="m-1">Neutral</Button>
      <Button mode="outline" class="m-1">Outline</Button>
      <Button mode="ghost" class="m-1">Ghost</Button>
      <Button mode="link" class="m-1">Link</Button>
      <Button mode="text" class="m-1">Text</Button>
    <div class="w-full max-h-full rounded">
      <CodeBlock
        highlightjs
        :theme="theme"
        :code="myCode1"
        lang="html"
        class="mb-5"
        style="margin: 0.75rem 0 0 0!important;"
      />
    </div>
    </div>
    <h2 class="text-xl font-semibold leading-7 text-gray-900 dark:text-gray-100">С иконками</h2>
    <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
      В кнопку можно добавлять иконки </p>
    <div class="flex flex-wrap my-4 p-3 rounded-lg">
      <Button mode="primary" class="m-1">
        <Icons type="Pencil" class="mr-2 -ml-0.5 h-4 w-4"/>
        Primary
      </Button>
      <Button mode="secondary" class="m-1">
        Secondary
        <Icons type="FcGoogle" class="ml-2 -mr-0.5 h-4 w-4"/>
      </Button>
      <Button mode="creative" class="m-1">
        <Icons type="CoMathworks" class="mr-2 -ml-0.5 h-4 w-4"/>
        Creative
      </Button>
      <Button mode="destructive" class="m-1">
        <Icons type="CoMathworks" class="mr-2 -ml-0.5 h-4 w-4"/>
        Destructive
      </Button>
      <Button mode="outline" class="m-1">
        <Icons type="CoSoundcloud" class="mr-2 -ml-0.5 h-4 w-4"/>
        Outline
      </Button>
      <Button mode="ghost" class="m-1">
        <Icons type="HiSolidLink" class="mr-2 -ml-0.5 h-4 w-4"/>
        Ghost
      </Button>
      <Button mode="link" class="m-1">
        <Icons type="CoTelegramPlane" class="mr-2 -ml-0.5 h-4 w-4"/>
        Link  🍇
      </Button>
      <Button mode="text" class="m-1">
        <Icons type="Pencil" class="mr-2 -ml-0.5 h-4 w-4"/>
        Text  🍈
      </Button>
      <div class="w-full max-h-full rounded">
        <CodeBlock
          highlightjs
          :theme="theme"
          :code="myCode2"
          lang="html"
          class="mb-5"
          style="margin: 0.75rem 0 0 0!important;"
        />
      </div>
    </div>
    <h2 class="text-xl font-semibold leading-7 text-gray-900 dark:text-gray-100">Не активные</h2>
    <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
      Чтобы сделать кнопку неактивной необходимо добавить аргумент <Badge>disabled</Badge></p>
    <div class="flex flex-wrap my-4 p-3 rounded-lg">
      <Button mode="primary" disabled class="m-1">
        <Icons type="Pencil" class="mr-2 -ml-0.5 h-4 w-4"/>
        Primary
      </Button>
      <Button mode="secondary" disabled class="m-1">
        Secondary
        <Icons type="FcGoogle" class="ml-2 -mr-0.5 h-4 w-4"/>
      </Button>
      <Button mode="creative" disabled class="m-1">
        <Icons type="CoMathworks" class="mr-2 -ml-0.5 h-4 w-4"/>
        Creative
      </Button>
      <Button mode="destructive" disabled class="m-1">
        <Icons type="CoMathworks" class="mr-2 -ml-0.5 h-4 w-4"/>
        Destructive
      </Button>
      <Button mode="outline" disabled class="m-1">
        <Icons type="CoSoundcloud" class="mr-2 -ml-0.5 h-4 w-4"/>
        Outline
      </Button>
      <Button mode="ghost" disabled class="m-1">
        <Icons type="HiSolidLink" class="mr-2 -ml-0.5 h-4 w-4"/>
        Ghost
      </Button>
      <Button mode="link" disabled class="m-1">
        <Icons type="CoTelegramPlane" class="mr-2 -ml-0.5 h-4 w-4"/>
        Link  🍇
      </Button>
      <Button mode="text" disabled class="m-1">
        <Icons type="Pencil" class="mr-2 -ml-0.5 h-4 w-4"/>
        Text  🍈
      </Button>
      <div class="w-full max-h-full rounded">
        <CodeBlock
          highlightjs
          :theme="theme"
          :code="myCode3"
          lang="html"
          class="mb-5"
          style="margin: 0.75rem 0 0 0!important;"
        />
      </div>
    </div>
    <h2 class="text-xl font-semibold leading-7 text-gray-900 dark:text-gray-100">Подсказка</h2>
    <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
      Всплывающее окно, отображающее информацию, связанную с элементом, когда элемент получает фокус клавиатуры или наводится на него курсором мыши.
    </p>
    <div class="flex flex-wrap my-4 p-3 rounded-lg">
      <Button mode="primary" class="m-1">
        <Tooltip position="left">Кнопка Primary</Tooltip>
        <Icons type="Pencil" class="mr-2 -ml-0.5 h-4 w-4"/>
        Primary Test
      </Button>
      <Button mode="secondary" class="m-1">
        Secondary
        <Icons type="FcGoogle" class="ml-2 -mr-0.5 h-4 w-4"/>
        <Tooltip position="right">Кнопка Secondary</Tooltip>
      </Button>
      <Button mode="creative" class="m-1">
        <Icons type="CoMathworks" class="mr-2 -ml-0.5 h-4 w-4"/>
        Creative
        <Tooltip>Кнопка Creative</Tooltip>
      </Button>
      <Button mode="destructive" class="m-1">
        <Icons type="CoMathworks" class="mr-2 -ml-0.5 h-4 w-4"/>
        Destructive
        <Tooltip>Кнопка Destructive</Tooltip>
      </Button>
      <Button mode="outline" class="m-1">
        <Icons type="CoSoundcloud" class="mr-2 -ml-0.5 h-4 w-4"/>
        Outline
        <Tooltip>Кнопка Outline</Tooltip>
      </Button>
      <Button mode="ghost" class="m-1">
        <Icons type="HiSolidLink" class="mr-2 -ml-0.5 h-4 w-4"/>
        Ghost
        <Tooltip position="right">Кнопка Ghost</Tooltip>
      </Button>
      <Button mode="link" class="m-1">
        <Icons type="CoTelegramPlane" class="mr-2 -ml-0.5 h-4 w-4"/>
        Link
        <Tooltip>Кнопка Link</Tooltip>
      </Button>
      <Button mode="text" class="m-1">
        <Icons type="Pencil" class="mr-2 -ml-0.5 h-4 w-4"/>
        Text
        <Tooltip>Кнопка Text</Tooltip>
      </Button>
    </div>
    <h2 class="text-xl font-semibold leading-7 text-gray-900 dark:text-gray-100">Только иконки</h2>
    <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
      Конпка может быть вовсе без текста. Для ровноси иконки необходимо добавить классы <Badge>px-0</Badge></p>
    <div class="flex flex-wrap my-4 p-3 rounded-lg">
      <Button mode="primary" class="rounded-full m-1 h-9 w-9 px-2">
        <Icons type="Pencil" class="h-4 w-4"/>
      </Button>
      <Button mode="secondary" class="rounded-md m-1 h-9 w-9 px-2">
        <Icons type="FcGoogle" class="h-4 w-4"/>
      </Button>
      <Button mode="creative" class="rounded-md m-1 h-9 w-9 px-2">
        <Icons type="CoMathworks" class="h-4 w-4"/>
      </Button>
      <Button mode="destructive" class="rounded-md m-1 h-9 w-9 px-2">
        <Icons type="CoMathworks" class="h-4 w-4"/>
      </Button>
      <Button mode="outline" class="rounded-lg m-1 h-9 w-9 p-0">
        <Icons type="CoSoundcloud" class="fill-[#ff7d03] dark:fill-[#ff7d03] h-4 w-4"/>
      </Button>
      <Button mode="ghost" class="rounded-full m-1 h-9 w-9 px-2">
        <Icons type="HiSolidLink" class="h-4 w-4"/>
      </Button>
      <Button mode="link" class="rounded-full m-1 h-9 w-9 px-2 ">
        <Icons type="CoTelegramPlane" class="fill-[#23a2df] dark:fill-[#23a2df] h-4 w-4"/>
      </Button>
      <Button mode="text" class="rounded-full m-1 h-9 w-9 px-2">
        <Icons type="Pencil" class="h-4 w-4"/>
      </Button>
    </div>
    <h2 class="text-xl font-semibold leading-7 text-gray-900 dark:text-gray-100">Ссылки</h2>
    <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
      Кнопку так же можно сделать ссылкой. Для этого необходимо добавить параметр <Badge>link</Badge></p>
    <div class="flex flex-wrap my-4 p-3 rounded-lg">
      <Button link="/components" class="m-1">Primary</Button>
      <Button link="/components" mode="secondary" class="m-1">Secondary</Button>
      <Button link="/components" mode="creative" class="m-1">Creative</Button>
      <Button link="/components" mode="destructive" class="m-1">Destructive</Button>
      <Button link="/components" mode="outline" class="m-1">Outline</Button>
      <Button link="/components" mode="ghost" class="m-1">Ghost</Button>
      <Button link="/components" mode="link" class="m-1">Link</Button>
      <Button link="/components" mode="text" class="m-1">Text</Button>
    </div>
    <h2 class="text-xl font-semibold leading-7 text-gray-900 dark:text-gray-100">Ссылки без текста</h2>
    <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
      Так же как конпки, ссылки можно использовать без текста, оставив только иконку</p>
    <div class="flex flex-wrap my-4 p-3 rounded-lg">
      <Button link="1" class="rounded-full m-1 h-9 w-9 px-0">
        <Icons type="Pencil" class="h-4 w-4"/>
      </Button>
      <Button link="/1" mode="secondary" class="rounded-md m-1 h-9 w-9 px-2">
        <Icons type="FcGoogle" class="h-7 w-7"/>
      </Button>
      <Button link="/components" mode="creative" class="rounded-md m-1 h-9 w-9 py-0">
        <Icons type="CoMathworks" class="h-4 w-4"/>
      </Button>
      <Button link="/components" mode="destructive" class="rounded-md m-1 h-9 w-9 px-0">
        <Icons type="CoMathworks" class="h-4 w-4"/>
      </Button>
      <Button link="/components" mode="outline" class="rounded-lg m-1 h-9 w-9 p-0">
        <Icons type="CoSoundcloud" class="fill-[#ff7d03] dark:fill-[#ff7d03] h-7 w-7"/>
      </Button>
      <Button link="/components" mode="ghost" class="rounded-full m-1 h-9 w-9 px-0">
        <Icons type="HiSolidLink" class="h-4 w-4"/>
      </Button>
      <Button link="/components" mode="link" class="rounded-full m-1 h-9 w-9 px-2 ">
        <Icons type="CoTelegramPlane" class="fill-[#23a2df] dark:fill-[#23a2df] h-7 w-7"/>
      </Button>
      <Button link="/components" mode="text" class="rounded-full m-1 h-9 w-9 px-2">
        <Icons type="Pencil" class="h-4 w-4"/>
      </Button>
    </div>
    <h2 class="text-xl font-semibold leading-7 text-gray-900 dark:text-gray-100">Разные стили</h2>
    <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
      Тут продиманстированны разные приверы спользования кастомных стилей кнопки</p>
    <div class="flex flex-wrap my-4 p-3 rounded-lg">
      <Button link="/components" mode="primary" class="m-1 bg-blue-600 hover:bg-blue-600/80">Синяя кнопка</Button>
      <Button link="/components" mode="secondary" class="m-1 bg-gradient-to-br from-slate-100 to-stone-400 dark:from-slate-900 dark:to-stone-600">Серая с переливом</Button>
      <Button link="/components" mode="creative" class="m-1 bg-gradient-to-br from-emerald-500 to-lime-400 dark:from-emerald-700 dark:to-lime-800">С зеленым градиентом</Button>
      <Button link="/components" mode="destructive" class="m-1 bg-gradient-to-r from-red-500 to-orange-500 dark:from-red-800 dark:to-orange-800">С красным градиентом</Button>
      <div class="flex flex-row items-center">
        <Button link="/components" mode="outline" class="ml-1 w-20 rounded-l-xl">Левая</Button>
        <Button link="/components" mode="outline" class="mr-1 w-20 rounded-r-xl border-l-0">Правая</Button>
      </div>
      <span class="relative inline-flex items-center mx-1">
        <Button link="/components" mode="outline" class="hover:bg-theme-100">С точкой</Button>
        <span class="flex absolute h-3 w-3 top-0 right-0 -mr-1">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-theme-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-3 w-3 bg-theme-500"></span>
        </span>
      </span>
      <Button  mode="ghost" class="m-1 rounded-full h-9 w-9 px-2">
        <Icons type="BiHeart" class="h-6 w-6"/>
      </Button>
      <Button link="/components" mode="link" class="m-1 w-">Link</Button>
      <Button link="/components" mode="text" class="m-1">Text</Button>
    </div>
  </ComponentViews>
</template>