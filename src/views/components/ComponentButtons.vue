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
const setColorScheme = (e: any) => {
  if (e.matches) {
    theme.value = "atom-one-dark"
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
function click(e:any) {
  console.log(e)
}
const modes = ref(["primary", "outline", "ghost"])
const sizes = ref(["xs", "sm","md","lg","xl"])
const colors1 = ref(["bg-red-50","bg-red-100","bg-red-200","bg-red-300","bg-red-400","bg-red-500","bg-red-600","bg-red-800","bg-red-900","bg-red-950"])
const colors = ref(["bg-theme-50","bg-theme-100","bg-theme-200","bg-theme-300","bg-theme-400","bg-theme-500","bg-theme-600","bg-theme-800","bg-theme-900","bg-theme-950"])
</script>

<template>
  <ComponentViews >
    <template #title>Buttons</template>
    <h2 class="text-xl font-semibold leading-7 text-gray-900 dark:text-gray-100">Базовое использование</h2>
    <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
      Тут продемонстрированны все варианты параметра <Badge class="mr-4">mode</Badge><br><Badge>Neutral</Badge> по умолчанию</p>
<!--    <div class="flex flex-wrap my-4 p-3 rounded-lg">-->
<!--      <div v-for="color in colors1" :key="color" class="w-5 h-5 rounded m-1 shadow-md shadow-neutral-300 dark:shadow-neutral-700" :class="color"> </div>-->
<!--    </div>-->
<!--    <div class="flex flex-wrap my-4 p-3 rounded-lg">-->
<!--      <div v-for="color in colors" :key="color" class="w-5 h-5 rounded m-1 shadow-md shadow-neutral-300 dark:shadow-neutral-700" :class="color"> </div>-->
<!--    </div>-->
<!--    <div v-for="mode in modes" :key="mode" class="flex flex-wrap my-4 p-3 rounded-lg">-->
<!--      <div class="flex">-->
<!--&lt;!&ndash;        <NewButton :mode="mode" size="xs" loading  text="theme">{{ mode }}</NewButton>&ndash;&gt;-->
<!--        <NewButton v-for="size in sizes" :key="size" :mode="mode" :size="size" color="theme">{{ mode }}</NewButton>-->
<!--        <NewButton :mode="mode" size="xl" loading  color="theme">{{ mode }}</NewButton>-->
<!--        <NewButton :mode="mode" size="xl" disabled  color="theme">{{ mode }}</NewButton>-->
<!--      </div>-->
<!--      <div class="flex">-->
<!--        <NewButton v-for="size in sizes" :key="size" :mode="mode" :size="size" color="neutral">{{ mode }}</NewButton>-->
<!--        <NewButton :mode="mode" size="xl" loading color="neutral">{{ mode }}</NewButton>-->
<!--        <NewButton :mode="mode" size="xl" disabled color="neutral">{{ mode }}</NewButton>-->
<!--      </div>-->
<!--    </div>-->
    <div v-for="mode in modes" :key="mode" class="flex flex-wrap my-4 p-3 rounded-lg">
      <div class="flex">
        <Button v-for="size in sizes" :key="size" :mode="mode" :size="size" type="button" rounded="lg" icon="photo" color="theme" border="">button</Button>
        <Button :mode="mode" size="xl" loading rounded="full" color="theme">button</Button>
        <Button :mode="mode" size="xl" disabled rounded="full" color="theme">button</Button>
      </div>
      <div class="flex">
        <Button v-for="size in sizes" :key="size" :mode="mode" :size="size" type="button" rounded="lg" icon="power" color="neutral">button</Button>
        <Button :mode="mode" size="xl" loading icon="power" rounded="full" color="neutral">button</Button>
        <Button :mode="mode" size="xl" disabled icon="power" rounded="full" color="neutral">button</Button>
      </div>
      <div class="flex">
        <Button v-for="size in sizes" :key="size" :mode="mode" :size="size" type="button" rounded="lg" icon="plus" color="creative">button</Button>
        <Button :mode="mode" size="xl" loading rounded="full" color="creative">button</Button>
        <Button :mode="mode" size="xl" disabled rounded="full" color="creative">button</Button>
      </div>
      <div class="flex">
        <Button v-for="size in sizes" :key="size" :mode="mode" :size="size" type="button" rounded="full" icon="x-mark" color="destructive">button</Button>
        <Button :mode="mode" size="xl" loading rounded="full" color="destructive">button</Button>
        <Button :mode="mode" size="xl" disabled rounded="full" color="destructive">button</Button>
      </div>
    </div>
    <div v-for="mode in modes" :key="mode" class="flex flex-wrap my-4 p-3 rounded-lg">
      <div class="flex w-full">
        <Button v-for="size in sizes" :key="size" :mode="mode" :size="size" type="icon" rounded="full" icon="photo" color="theme" class="mx-4"></Button>
        <Button :mode="mode" size="xl" loading type="icon" rounded="full" icon="photo" color="theme" class="mx-4"/>
        <Button :mode="mode" size="xl" disabled type="icon" rounded="full" icon="photo" color="theme" class="mx-4"/>
      </div>
      <div class="flex  w-full">
        <Button v-for="size in sizes" :key="size" :mode="mode" :size="size" type="icon" rounded="full" icon="power" color="neutral" class="mx-4"></Button>
        <Button :mode="mode" size="xl" loading type="icon" rounded="full" icon="photo" color="neutral" class="mx-4"/>
        <Button :mode="mode" size="xl" disabled type="icon" rounded="full" icon="photo" color="neutral" class="mx-4"/>
      </div>
      <div class="flex  w-full">
        <Button v-for="size in sizes" :key="size" :mode="mode" :size="size" type="icon" rounded="full" icon="plus" color="creative" class="mx-4"></Button>
        <Button :mode="mode" size="xl" loading type="icon" rounded="full" icon="photo" color="creative" class="mx-4"/>
        <Button :mode="mode" size="xl" disabled type="icon" rounded="full" icon="photo" color="creative" class="mx-4"/>
      </div>
      <div class="flex  w-full">
        <Button v-for="size in sizes" :key="size" :mode="mode" :size="size" type="icon"  rounded="full" icon="x-mark" color="destructive" class="mx-4"></Button>
        <Button :mode="mode" size="xl" loading type="icon" rounded="full" icon="photo" color="destructive" class="mx-4"/>
        <Button :mode="mode" size="xl" disabled type="icon" rounded="full" icon="photo" color="destructive" class="mx-4"/>
      </div>
    </div>
    <div v-for="mode in modes" :key="mode" class="flex flex-wrap my-4 p-3 rounded-lg">
      <div class="flex">
        <Button v-for="size in sizes" :key="size" :mode="mode" :size="size" type="link" rounded="none" icon="solar:arrow-right-broken" color="theme">Ссылка</Button>
        <Button :mode="mode" size="xl" disabled type="link" rounded="none" color="theme">Ссылка</Button>
      </div>
      <div class="flex">
        <Button v-for="size in sizes" :key="size" :mode="mode" :size="size" type="link" rounded="md" icon="power" color="neutral">Ссылка</Button>
        <Button :mode="mode" size="xl" disabled icon="power" type="link" rounded="md" color="neutral">Ссылка</Button>
      </div>
      <div class="flex">
        <Button v-for="size in sizes" :key="size" :mode="mode" :size="size" type="link" rounded="lg" icon="plus" color="creative">Ссылка</Button>
        <Button :mode="mode" size="xl" disabled type="link" rounded="lg" color="creative">Ссылка</Button>
      </div>
      <div class="flex">
        <Button v-for="size in sizes" :key="size" :mode="mode" :size="size" type="link" rounded="full" icon="x-mark" color="destructive">Ссылка</Button>
        <Button :mode="mode" size="xl" disabled type="link" rounded="full" color="destructive">Ссылка</Button>
      </div>
    </div>
    <div class="flex flex-wrap my-4 p-3 rounded-lg">
      <Button mode="primary" class="m-1" @click="click">Primary</Button>
      <Button mode="outline" class="m-1">Outline</Button>
      <Button mode="ghost" class="m-1">Ghost</Button>
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
      <Button class="rounded-full m-1 h-9 w-9 px-0">
        <Icons type="Pencil" class="h-4 w-4"/>
      </Button>
      <Button mode="secondary" class="rounded-md m-1 h-9 w-9 px-2">
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