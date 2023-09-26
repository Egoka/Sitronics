<script setup lang="ts">
import {reactive, ref} from "vue";

const dB = reactive({
  b1: true,
  b2: true,
  b3: true,
  b4: true,
  b5: true,
  b6: true,
})
const styleOne = reactive({
  gray: "m-1 text-xs bg-gray-100 text-gray-600 ring-gray-500/10 dark:bg-gray-950 dark:text-gray-400 dark:ring-gray-500/10",
  red: "m-1 text-xs bg-red-50 text-red-700 ring-red-600/10 dark:bg-red-950 dark:text-red-300 dark:ring-red-400/10",
  yellow: "m-1 text-xs bg-yellow-50 text-yellow-800 ring-yellow-600/20 dark:bg-yellow-950 dark:text-yellow-200 dark:ring-yellow-400/20",
  green: "m-1 text-xs bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-950 dark:text-green-300 dark:ring-green-400/20",
  blue: "m-1 text-xs bg-blue-50 text-blue-700 ring-blue-700/10 dark:bg-blue-950 dark:text-blue-300 dark:ring-blue-300/10",
  indigo: "m-1 text-xs bg-indigo-50 text-indigo-700 ring-indigo-700/10 dark:bg-indigo-950 dark:text-indigo-300 dark:ring-indigo-300/10",
  purple: "m-1 text-xs bg-purple-50 text-purple-700 ring-purple-700/10 dark:bg-purple-950 dark:text-purple-300 dark:ring-purple-300/10",
  pink: "m-1 text-xs bg-pink-50 text-pink-700 ring-pink-700/10 dark:bg-pink-950 dark:text-pink-300 dark:ring-pink-300/10",
})
const styleTwo = reactive({
  gray: "m-1 text-xs bg-gray-200 text-gray-600 dark:bg-gray-800 dark:text-gray-400 ring-transparent",
  red: "m-1 text-xs bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 ring-transparent",
  yellow: "m-1 text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 ring-transparent",
  green: "m-1 text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 ring-transparent",
  blue: "m-1 text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 ring-transparent",
  indigo: "m-1 text-xs bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 ring-transparent",
  purple: "m-1 text-xs bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 ring-transparent",
  pink: "m-1 text-xs bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300 ring-transparent",
})
import ComponentViews from "@/components/ComponentViews.vue";
import Badge from "@/components/functional/Badge.vue";
</script>

<template>
  <ComponentViews >
    <template #title>Badge</template>
    <div class="border-b border-primary-700/50 dark:border-primary-500/50 pb-0 my-5">
      <h2 class="ml-5 text-xl font-semibold leading-7 text-primary-600 dark:text-primary-500">Badge</h2>
      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
        Стилизованный компонент, предназначенный выделить слово или словосочетание из общего интерфейса.<br/>
        Доступны несколько готовых стилей: <Badge mode="outline">primary</Badge>, <Badge mode="outline">secondary</Badge>, <Badge mode="outline">outline</Badge>, <Badge mode="outline">neutral</Badge>
      </p>
      <div class="flex flex-wrap m-2">
        <Badge mode="primary">primary</Badge>
        <Badge mode="secondary">secondary</Badge>
        <Badge mode="outline">outline</Badge>
      </div>
      <div class="flex flex-wrap m-2">
        <Badge mode="primary" class="rounded-full">primary</Badge>
        <Badge mode="secondary" class="rounded-full">secondary</Badge>
        <Badge mode="outline" class="rounded-full">outline</Badge>
      </div>
    </div>
    <div class="border-b border-primary-700/50 dark:border-primary-500/50 pb-0 my-5">
      <h2 class="ml-5 text-xl font-semibold leading-7 text-primary-600 dark:text-primary-500">Добавление точки</h2>
      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
        Для иного выделения Badge можно добавить параметр <Badge mode="outline">point</Badge>, который добавит дочку в начале
      </p>
      <div class="flex flex-wrap m-2">
        <Badge mode="primary" point>primary</Badge>
        <Badge mode="secondary" point>secondary</Badge>
        <Badge mode="outline" point>outline</Badge>
        <Badge mode="primary" point class="rounded-full">primary</Badge>
        <Badge mode="secondary" point class="rounded-full">secondary</Badge>
        <Badge mode="outline" point class="rounded-full">outline</Badge>
      </div>
    </div>
    <div class="border-b border-primary-700/50 dark:border-primary-500/50 pb-0 my-5">
      <h2 class="ml-5 text-xl font-semibold leading-7 text-primary-600 dark:text-primary-500">Добавление кнопки удаления</h2>
      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
        Чтобы можно было удалить Badge можно добавить аргумент <Badge mode="outline">close-button</Badge>, который добавит в конце кнопку удаления.
      </p>
      <div class="flex flex-wrap m-2">
        <Badge v-if="dB.b1" mode="primary" close-button @delete="dB.b1=!dB.b1">mode</Badge>
        <Badge v-if="dB.b2" mode="secondary" close-button @delete="dB.b2=!dB.b2">mode</Badge>
        <Badge v-if="dB.b3" mode="outline" close-button @delete="dB.b3=!dB.b3">mode</Badge>
        <Badge v-if="dB.b4" mode="primary" close-button class="rounded-full" @delete="dB.b4=!dB.b4">mode</Badge>
        <Badge v-if="dB.b5" mode="secondary" close-button class="rounded-full" @delete="dB.b5=!dB.b5">mode</Badge>
        <Badge v-if="dB.b6" mode="outline" close-button class="rounded-full" @delete="dB.b6=!dB.b6">mode</Badge>
      </div>
    </div>
    <div class="border-b border-primary-700/50 dark:border-primary-500/50 pb-0 my-5">
      <h2 class="ml-5 text-xl font-semibold leading-7 text-primary-600 dark:text-primary-500">Режим neutral</h2>
      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
        В этом режиме обраты все цветовые стили для полной кастомизации <Badge mode="outline">Badge</Badge>.
        Ниже приведены примеры, того как можно использовать Badge с другими цветами
      </p>
      <div class="flex flex-wrap m-2">
        <Badge mode="neutral" :class="styleOne.gray">Badge</Badge>
        <Badge mode="neutral" :class="styleOne.red">Badge</Badge>
        <Badge mode="neutral" :class="styleOne.yellow">Badge</Badge>
        <Badge mode="neutral" :class="styleOne.green">Badge</Badge>
        <Badge mode="neutral" :class="styleOne.blue">Badge</Badge>
        <Badge mode="neutral" :class="styleOne.indigo">Badge</Badge>
        <Badge mode="neutral" :class="styleOne.purple">Badge</Badge>
        <Badge mode="neutral" :class="styleOne.pink">Badge</Badge>
      </div>
      <div class="flex flex-wrap m-2">
        <Badge mode="neutral" :class="[styleOne.gray, 'rounded-full']">Badge</Badge>
        <Badge mode="neutral" :class="[styleOne.red, 'rounded-full']">Badge</Badge>
        <Badge mode="neutral" :class="[styleOne.yellow, 'rounded-full']">Badge</Badge>
        <Badge mode="neutral" :class="[styleOne.green, 'rounded-full']">Badge</Badge>
        <Badge mode="neutral" :class="[styleOne.blue, 'rounded-full']">Badge</Badge>
        <Badge mode="neutral" :class="[styleOne.indigo, 'rounded-full']">Badge</Badge>
        <Badge mode="neutral" :class="[styleOne.purple, 'rounded-full']">Badge</Badge>
        <Badge mode="neutral" :class="[styleOne.pink, 'rounded-full']">Badge</Badge>
      </div>
      <div class="flex flex-wrap m-2">
        <Badge mode="neutral" :class="styleTwo.gray">Badge</Badge>
        <Badge mode="neutral" :class="styleTwo.red">Badge</Badge>
        <Badge mode="neutral" :class="styleTwo.yellow">Badge</Badge>
        <Badge mode="neutral" :class="styleTwo.green">Badge</Badge>
        <Badge mode="neutral" :class="styleTwo.blue">Badge</Badge>
        <Badge mode="neutral" :class="styleTwo.indigo">Badge</Badge>
        <Badge mode="neutral" :class="styleTwo.purple">Badge</Badge>
        <Badge mode="neutral" :class="styleTwo.pink">Badge</Badge>
      </div>
      <div class="flex flex-wrap m-2">
        <Badge mode="neutral" :class="[styleTwo.gray, 'rounded-full']">Badge</Badge>
        <Badge mode="neutral" :class="[styleTwo.red, 'rounded-full']">Badge</Badge>
        <Badge mode="neutral" :class="[styleTwo.yellow, 'rounded-full']">Badge</Badge>
        <Badge mode="neutral" :class="[styleTwo.green, 'rounded-full']">Badge</Badge>
        <Badge mode="neutral" :class="[styleTwo.blue, 'rounded-full']">Badge</Badge>
        <Badge mode="neutral" :class="[styleTwo.indigo, 'rounded-full']">Badge</Badge>
        <Badge mode="neutral" :class="[styleTwo.purple, 'rounded-full']">Badge</Badge>
        <Badge mode="neutral" :class="[styleTwo.pink, 'rounded-full']">Badge</Badge>
      </div>
      
      <div class="flex flex-wrap m-2">
        <Badge mode="neutral" close-button :class="styleOne.gray" class-content="fill-gray-500">Badge</Badge>
        <Badge mode="neutral" close-button :class="styleOne.red" class-content="fill-red-500">Badge</Badge>
        <Badge mode="neutral" close-button :class="styleOne.yellow" class-content="fill-yellow-500">Badge</Badge>
        <Badge mode="neutral" close-button :class="styleOne.green" class-content="fill-green-500">Badge</Badge>
        <Badge mode="neutral" close-button :class="styleOne.blue" class-content="fill-blue-500">Badge</Badge>
        <Badge mode="neutral" close-button :class="styleOne.indigo" class-content="fill-indigo-500">Badge</Badge>
        <Badge mode="neutral" close-button :class="styleOne.purple" class-content="fill-purple-500">Badge</Badge>
        <Badge mode="neutral" close-button :class="styleOne.pink" class-content="fill-pink-500">Badge</Badge>
      </div>
      <div class="flex flex-wrap m-2">
        <Badge mode="neutral" close-button :class="[styleOne.gray, 'rounded-full']" class-content="fill-gray-500">Badge</Badge>
        <Badge mode="neutral" close-button :class="[styleOne.red, 'rounded-full']" class-content="fill-red-500">Badge</Badge>
        <Badge mode="neutral" close-button :class="[styleOne.yellow, 'rounded-full']" class-content="fill-yellow-500">Badge</Badge>
        <Badge mode="neutral" close-button :class="[styleOne.green, 'rounded-full']" class-content="fill-green-500">Badge</Badge>
        <Badge mode="neutral" close-button :class="[styleOne.blue, 'rounded-full']" class-content="fill-blue-500">Badge</Badge>
        <Badge mode="neutral" close-button :class="[styleOne.indigo, 'rounded-full']" class-content="fill-indigo-500">Badge</Badge>
        <Badge mode="neutral" close-button :class="[styleOne.purple, 'rounded-full']" class-content="fill-purple-500">Badge</Badge>
        <Badge mode="neutral" close-button :class="[styleOne.pink, 'rounded-full']" class-content="fill-pink-500">Badge</Badge>
      </div>
      <div class="flex flex-wrap m-2">
        <Badge mode="neutral" close-button :class="styleTwo.gray" class-content="fill-gray-500">Badge</Badge>
        <Badge mode="neutral" close-button :class="styleTwo.red" class-content="fill-red-500">Badge</Badge>
        <Badge mode="neutral" close-button :class="styleTwo.yellow" class-content="fill-yellow-500">Badge</Badge>
        <Badge mode="neutral" close-button :class="styleTwo.green" class-content="fill-green-500">Badge</Badge>
        <Badge mode="neutral" close-button :class="styleTwo.blue" class-content="fill-blue-500">Badge</Badge>
        <Badge mode="neutral" close-button :class="styleTwo.indigo" class-content="fill-indigo-500">Badge</Badge>
        <Badge mode="neutral" close-button :class="styleTwo.purple" class-content="fill-purple-500">Badge</Badge>
        <Badge mode="neutral" close-button :class="styleTwo.pink" class-content="fill-pink-500">Badge</Badge>
      </div>
      <div class="flex flex-wrap m-2">
        <Badge mode="neutral" close-button :class="[styleTwo.gray, 'rounded-full']" class-content="fill-gray-500">Badge</Badge>
        <Badge mode="neutral" close-button :class="[styleTwo.red, 'rounded-full']" class-content="fill-red-500">Badge</Badge>
        <Badge mode="neutral" close-button :class="[styleTwo.yellow, 'rounded-full']" class-content="fill-yellow-500">Badge</Badge>
        <Badge mode="neutral" close-button :class="[styleTwo.green, 'rounded-full']" class-content="fill-green-500">Badge</Badge>
        <Badge mode="neutral" close-button :class="[styleTwo.blue, 'rounded-full']" class-content="fill-blue-500">Badge</Badge>
        <Badge mode="neutral" close-button :class="[styleTwo.indigo, 'rounded-full']" class-content="fill-indigo-500">Badge</Badge>
        <Badge mode="neutral" close-button :class="[styleTwo.purple, 'rounded-full']" class-content="fill-purple-500">Badge</Badge>
        <Badge mode="neutral" close-button :class="[styleTwo.pink, 'rounded-full']" class-content="fill-pink-500">Badge</Badge>
      </div>
      <div class="flex flex-wrap m-2">
        <Badge mode="neutral" point close-button :class="styleOne.gray" class-content="fill-gray-500">Badge</Badge>
        <Badge mode="neutral" point close-button :class="styleOne.red" class-content="fill-red-500">Badge</Badge>
        <Badge mode="neutral" point close-button :class="styleOne.yellow" class-content="fill-yellow-500">Badge</Badge>
        <Badge mode="neutral" point close-button :class="styleOne.green" class-content="fill-green-500">Badge</Badge>
        <Badge mode="neutral" point close-button :class="styleOne.blue" class-content="fill-blue-500">Badge</Badge>
        <Badge mode="neutral" point close-button :class="styleOne.indigo" class-content="fill-indigo-500">Badge</Badge>
        <Badge mode="neutral" point close-button :class="styleOne.purple" class-content="fill-purple-500">Badge</Badge>
        <Badge mode="neutral" point close-button :class="styleOne.pink" class-content="fill-pink-500">Badge</Badge>
      </div>
      <div class="flex flex-wrap m-2">
        <Badge mode="neutral" point close-button :class="[styleOne.gray, 'rounded-full']" class-content="fill-gray-500">Badge</Badge>
        <Badge mode="neutral" point close-button :class="[styleOne.red, 'rounded-full']" class-content="fill-red-500">Badge</Badge>
        <Badge mode="neutral" point close-button :class="[styleOne.yellow, 'rounded-full']" class-content="fill-yellow-500">Badge</Badge>
        <Badge mode="neutral" point close-button :class="[styleOne.green, 'rounded-full']" class-content="fill-green-500">Badge</Badge>
        <Badge mode="neutral" point close-button :class="[styleOne.blue, 'rounded-full']" class-content="fill-blue-500">Badge</Badge>
        <Badge mode="neutral" point close-button :class="[styleOne.indigo, 'rounded-full']" class-content="fill-indigo-500">Badge</Badge>
        <Badge mode="neutral" point close-button :class="[styleOne.purple, 'rounded-full']" class-content="fill-purple-500">Badge</Badge>
        <Badge mode="neutral" point close-button :class="[styleOne.pink, 'rounded-full']" class-content="fill-pink-500">Badge</Badge>
      </div>
      <div class="flex flex-wrap m-2">
        <Badge mode="neutral" point close-button :class="styleTwo.gray" class-content="fill-gray-500">Badge</Badge>
        <Badge mode="neutral" point close-button :class="styleTwo.red" class-content="fill-red-500">Badge</Badge>
        <Badge mode="neutral" point close-button :class="styleTwo.yellow" class-content="fill-yellow-500">Badge</Badge>
        <Badge mode="neutral" point close-button :class="styleTwo.green" class-content="fill-green-500">Badge</Badge>
        <Badge mode="neutral" point close-button :class="styleTwo.blue" class-content="fill-blue-500">Badge</Badge>
        <Badge mode="neutral" point close-button :class="styleTwo.indigo" class-content="fill-indigo-500">Badge</Badge>
        <Badge mode="neutral" point close-button :class="styleTwo.purple" class-content="fill-purple-500">Badge</Badge>
        <Badge mode="neutral" point close-button :class="styleTwo.pink" class-content="fill-pink-500">Badge</Badge>
      </div>
      <div class="flex flex-wrap m-2">
        <Badge mode="neutral" point close-button :class="[styleTwo.gray, 'rounded-full']" class-content="fill-gray-500">Badge</Badge>
        <Badge mode="neutral" point close-button :class="[styleTwo.red, 'rounded-full']" class-content="fill-red-500">Badge</Badge>
        <Badge mode="neutral" point close-button :class="[styleTwo.yellow, 'rounded-full']" class-content="fill-yellow-500">Badge</Badge>
        <Badge mode="neutral" point close-button :class="[styleTwo.green, 'rounded-full']" class-content="fill-green-500">Badge</Badge>
        <Badge mode="neutral" point close-button :class="[styleTwo.blue, 'rounded-full']" class-content="fill-blue-500">Badge</Badge>
        <Badge mode="neutral" point close-button :class="[styleTwo.indigo, 'rounded-full']" class-content="fill-indigo-500">Badge</Badge>
        <Badge mode="neutral" point close-button :class="[styleTwo.purple, 'rounded-full']" class-content="fill-purple-500">Badge</Badge>
        <Badge mode="neutral" point close-button :class="[styleTwo.pink, 'rounded-full']" class-content="fill-pink-500">Badge</Badge>
      </div>
    </div>
  </ComponentViews>
</template>

<style scoped>

</style>