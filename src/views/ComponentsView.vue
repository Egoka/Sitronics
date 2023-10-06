<script setup>
import {ref} from "vue";
import WithImageTiles from "@/components/WithImageTiles.vue";
import CardList from "@/components/CardList.vue";
import GridImage from "@/components/GridImage.vue";
import {useRoute} from "vue-router";
const baseUrl = useRoute().path

const gridImages = ref([
  ["https://horizon-ui.com/components/static/media/colors.995897fca2d7423ddbcac0012d3a20b8.svg", "https://horizon-ui.com/components/static/media/fixed.cccce69d2992295f5ea3bf4553584f23.svg"],
  ["https://horizon-ui.com/components/static/media/table.f3863230c647c43a196f08761e96cb78.svg", "https://horizon-ui.com/components/static/media/avatar.0943c821944146790f7ca3035508f323.svg", "https://horizon-ui.com/components/static/media/map.ea58bf83e9f9a53eb6356366ada1877a.svg"],
  ["https://horizon-ui.com/components/static/media/image.01ca45a099ca94bf6580f93f1f6fd20b.svg", "https://horizon-ui.com/components/static/media/charts.6fe90bdf4a0ff38477c02e7e5aec095e.svg"],
])
const button = ref({
  name: "Выбрать компонент",
  link: "#components",
  class: "bg-indigo-600 px-8 py-3 font-medium text-white hover:bg-indigo-700"
})

const items = ref([
  {
    name: 'All',
    href: baseUrl+'/all',
    imageSrc: 'https://upload.wikimedia.org/wikipedia/commons/c/c5/SITRONICS_group_logo_horisontal.png',
  },
  {
    name: 'Form',
    href: baseUrl+'/form',
    imageSrc: 'https://horizon-ui.com/components/static/media/kanban.cf017f7bd0041d71e562eff33ca7e91a.svg',
  },
  {
    name: 'Input',
    href: baseUrl+'/input',
    imageSrc: 'https://horizon-ui.com/components/static/media/input.a365e415996750938744749a0d659275.svg',
  },
  {
    name: 'Buttons',
    href: baseUrl+'/buttons',
    imageSrc: 'https://horizon-ui.com/components/static/media/buttons.761530616ae0046450b905904753b062.svg',
  },
  {
    name: 'List',
    href: baseUrl+'/select',
    imageSrc: 'https://horizon-ui.com/components/static/media/list.3f5491d88bae6288e55f2d69dafd8eca.svg',
  },
  {
    name: 'Calendar',
    href: baseUrl+'/calendar',
    imageSrc: 'https://horizon-ui.com/components/static/media/calendar.6f0efec158c880ac4debb167d18a1f45.svg',
  },
  {
    name: 'Switch',
    href: baseUrl+'/switch',
    imageSrc: 'https://horizon-ui.com/components/static/media/switch.f617ef9b0d24894e1002ce0bda81758e.svg',
  },
  {
    name: 'Aria',
    href: baseUrl+'/aria',
    imageSrc: 'https://horizon-ui.com/components/static/media/cards.0850c03325941f4fdff0c016aee796dd.svg',
  },
  {
    name: 'Text editor',
    href: baseUrl+'/text-editor',
    imageSrc: 'https://horizon-ui.com/components/static/media/quill.b64c9e63505fef0603aba10791c099c8.svg',
  },
  {
    name: 'Dialog',
    href: baseUrl+'/dialog',
    imageSrc: 'https://horizon-ui.com/components/static/media/modal.ef64b9f4cfc045fea9d07b2519b77dd6.svg',
  },
  {
    name: 'Badge',
    href: baseUrl+'/badge',
    imageSrc: 'https://horizon-ui.com/components/static/media/badge.54c9f7e22be4cca91ae518937964fea5.svg',
  },
  {
    name: 'Alert',
    href: baseUrl+'/alert',
    imageSrc: 'https://horizon-ui.com/components/static/media/alerts.708d67af66999bb564de6ee603d4de92.svg',
  },
])
</script>
<template>
  <WithImageTiles
    title="<span class='bg-gradient-to-r from-indigo-500 to-fuchsia-500 bg-clip-text text-transparent'>Компоненты</span> для ваших проектов"
    subtitle="Самые различные инструмны для создания форм, таблиц, карт и другой аналитики на вашем сайте"
    :button="button"
  >
    <template #visual-content>
      <GridImage :grid-image="gridImages">
        <template #default="{item}">
          <div class="h-24 w-24 sm:h-44 sm:w-44 overflow-hidden rounded-lg lg:opacity-100">
            <img :src="item" alt="" class="max-h-full w-full object-cover object-center dark:invert-[.9]" />
          </div>
        </template>
      </GridImage>
    </template>
  </WithImageTiles>
  <CardList id="components" :items="items">
    <template #default="{item}">
      <div v-if="item.name === 'All'" class="h-28 bg-center bg-cover" :style="`background-image: url(${item.imageSrc})`"/>
      <img v-else :src="item.imageSrc" :alt="item.imageAlt" class="h-28 m-auto object-cover object-center group-hover:opacity-75 dark:invert-[.9]" />
      <h3 class="m-4 mt-0 text-2xl font-medium text-gray-700 dark:text-gray-500">{{ item.name }}</h3>
    </template>
  </CardList>
</template>