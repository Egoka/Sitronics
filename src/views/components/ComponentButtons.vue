<script setup lang="ts">
import ComponentViews from "@/components/ComponentViews.vue";
import Icons from "@/components/functional/Icons.vue";
import Button from "@/components/functional/Button.vue";
import Badge from "@/components/functional/Badge.vue";
import Tooltip from "@/components/functional/Tooltip.vue";
import {ref} from "vue";
import Table from "@/components/functional/Table.vue";
import type {ButtonStyle, IButton} from "@/components/functional/Button";
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
    <div class="border-b border-theme-700/50 dark:border-theme-500/50 pb-0 mt-10">
      <h2 class="ml-5 text-xl font-semibold leading-7 text-theme-600 dark:text-theme-500">Базовое использование</h2>
      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
<!--        Тут продемонстрированны все варианты параметра <Badge>mode</Badge>(<Badge>Primary</Badge> по умолчанию)-->
      </p>
      <div class="grid transition grid-cols-4 gap-x-5 gap-y-0">
        <div v-for="mode in ['primary', 'outline', 'ghost'] as Array<ButtonStyle['mode']>" :key="mode"  class="col-span-1 my-1">
          <Button :mode="mode" class="min-w-max">{{ mode }}</Button>
        </div>
      </div>
    </div>
    <div class="border-b border-theme-700/50 dark:border-theme-500/50 pb-0 mt-10">
      <h2 class="ml-5 text-xl font-semibold leading-7 text-theme-600 dark:text-theme-500">Размер</h2>
      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
        <!--        Тут продемонстрированны все варианты параметра <Badge>mode</Badge>(<Badge>Primary</Badge> по умолчанию)-->
      </p>
      <div v-for="mode in ['primary', 'outline', 'ghost'] as Array<ButtonStyle['mode']>" :key="mode" class="grid transition grid-cols-5 gap-x-5 gap-y-0">
        <div v-for="size in ['xs','sm','md','lg','xl'] as Array<ButtonStyle['size']>" :key="size" class="col-span-1 my-1">
          <Button :mode="mode" :size="size" class="min-w-max">{{ mode }} {{size}}</Button>
        </div>
      </div>
    </div>
    <div class="border-b border-theme-700/50 dark:border-theme-500/50 pb-0 mt-10">
      <h2 class="ml-5 text-xl font-semibold leading-7 text-theme-600 dark:text-theme-500">Скругление</h2>
      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
        <!--        Тут продемонстрированны все варианты параметра <Badge>mode</Badge>(<Badge>Primary</Badge> по умолчанию)-->
      </p>
      <div v-for="mode in ['primary', 'outline', 'ghost'] as Array<ButtonStyle['mode']>" :key="mode" class="grid transition grid-cols-5 gap-x-5 gap-y-0">
        <div v-for="rounded in ['none','md','lg','full'] as Array<ButtonStyle['rounded']>" :key="rounded" class="col-span-1 my-1">
          <Button :mode="mode" :rounded="rounded" class="min-w-max">{{ mode }} {{rounded}}</Button>
        </div>
      </div>
    </div>
    <div class="border-b border-theme-700/50 dark:border-theme-500/50 pb-0 mt-10">
      <h2 class="ml-5 text-xl font-semibold leading-7 text-theme-600 dark:text-theme-500">Тип</h2>
      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
        <!--        Тут продемонстрированны все варианты параметра <Badge>mode</Badge>(<Badge>Primary</Badge> по умолчанию)-->
      </p>
      <div v-for="mode in ['primary', 'outline', 'ghost'] as Array<ButtonStyle['mode']>" :key="mode" class="grid transition grid-cols-5 gap-x-5 gap-y-0 justify-items-center">
        <div v-for="type in ['button', 'icon', 'link'] as Array<IButton['type']>" :key="type" class="col-span-1 my-1 ">
          <Button :mode="mode" :type="type" class="min-w-max" icon="Pencil">{{ mode }} {{type}}</Button>
        </div>
      </div>
    </div>
    <div class="border-b border-theme-700/50 dark:border-theme-500/50 pb-0 mt-10">
      <h2 class="ml-5 text-xl font-semibold leading-7 text-theme-600 dark:text-theme-500">Цвет</h2>
      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
        <!--        Тут продемонстрированны все варианты параметра <Badge>mode</Badge>(<Badge>Primary</Badge> по умолчанию)-->
      </p>
      <div v-for="mode in ['primary', 'outline', 'ghost'] as Array<ButtonStyle['mode']>" :key="mode" class="grid transition grid-cols-4 gap-x-5 gap-y-0">
        <div v-for="color in ['theme', 'neutral', 'creative', 'destructive'] as Array<ButtonStyle['color']>" :key="color" class="col-span-1 my-1">
          <Button :mode="mode" :color="color" class="min-w-max">{{ mode }} {{color}}</Button>
        </div>
      </div>
    </div>
    <div class="border-b border-theme-700/50 dark:border-theme-500/50 pb-0 mt-10">
      <h2 class="ml-5 text-xl font-semibold leading-7 text-theme-600 dark:text-theme-500">С загрузкой</h2>
      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
        <!--        Тут продемонстрированны все варианты параметра <Badge>mode</Badge>(<Badge>Primary</Badge> по умолчанию)-->
      </p>
      <div v-for="mode in ['primary', 'outline', 'ghost'] as Array<ButtonStyle['mode']>" :key="mode" class="grid transition grid-cols-4 gap-x-5 gap-y-0">
        <div v-for="color in ['theme', 'neutral', 'creative', 'destructive'] as Array<ButtonStyle['color']>" :key="color" class="col-span-1 my-1">
          <Button :mode="mode" :color="color" class="min-w-max" loading>{{ mode }} {{color}}</Button>
        </div>
      </div>
    </div>
    <div class="border-b border-theme-700/50 dark:border-theme-500/50 pb-0 mt-10">
      <h2 class="ml-5 text-xl font-semibold leading-7 text-theme-600 dark:text-theme-500">Не активные</h2>
      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
        <!--        Тут продемонстрированны все варианты параметра <Badge>mode</Badge>(<Badge>Primary</Badge> по умолчанию)-->
      </p>
      <div v-for="mode in ['primary', 'outline', 'ghost'] as Array<ButtonStyle['mode']>" :key="mode" class="grid transition grid-cols-4 gap-x-5 gap-y-0">
        <div v-for="color in ['theme', 'neutral', 'creative', 'destructive'] as Array<ButtonStyle['color']>" :key="color" class="col-span-1 my-1">
          <Button :mode="mode" :color="color" class="min-w-max" disabled>{{ mode }} {{color}}</Button>
        </div>
      </div>
    </div>
    <div class="border-b border-theme-700/50 dark:border-theme-500/50 pb-0 mt-10">
      <h2 class="ml-5 text-xl font-semibold leading-7 text-theme-600 dark:text-theme-500">Разные стили</h2>
      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
        Тут продиманстированны разные приверы спользования кастомных стилей кнопки
      </p>
      <div class="grid transition grid-cols-4 gap-x-5 gap-y-0">
        <Button link="/components" mode="primary" class="min-w-max m-1 bg-blue-600 hover:bg-blue-600/80">Синяя кнопка</Button>
        <Button link="/components" mode="primary" class="min-w-max m-1 bg-gradient-to-br from-slate-100 to-stone-400 dark:from-slate-900 dark:to-stone-600">Серая с переливом</Button>
        <Button link="/components" mode="primary" class="min-w-max m-1 bg-gradient-to-br from-emerald-500 to-lime-400 dark:from-emerald-700 dark:to-lime-800">С зеленым градиентом</Button>
        <Button link="/components" mode="primary" class="min-w-max m-1 bg-gradient-to-r from-red-500 to-orange-500 dark:from-red-800 dark:to-orange-800">С красным градиентом</Button>
        <div class="flex flex-row items-center">
          <Button link="/components" mode="outline" class="mr-0 w-20 rounded-none rounded-l-xl">Левая</Button>
          <Button link="/components" mode="outline" class="ml-0 w-20 rounded-none rounded-r-xl border-l-0">Правая</Button>
        </div>
        <span class="relative inline-flex items-center mx-1">
          <Button link="/components" mode="outline" class="hover:bg-theme-100">С точкой</Button>
          <span class="flex absolute h-3 w-3 top-0 right-0 -mr-1">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-theme-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-3 w-3 bg-theme-500"></span>
          </span>
        </span>
      </div>
    </div>
  </ComponentViews>
</template>