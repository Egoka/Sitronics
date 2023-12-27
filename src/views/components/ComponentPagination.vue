<script setup lang="ts">
import ComponentViews from "@/components/ComponentViews.vue";
import Badge from "@/components/functional/Badge.vue";
import Pagination from "@/components/functional/Pagination.vue";
import {ref} from "vue";
const activePage = ref<number>(3)
</script>

<template>
  <ComponentViews>
    <template #title>Aria</template>
    <div class="border-b border-theme-700/50 dark:border-theme-500/50 pb-0 my-5">
      <h2 class="ml-5 text-xl font-semibold leading-7 text-theme-600 dark:text-theme-500">Badge</h2>
      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
        Стилизованный компонент, предназначенный выделить слово или словосочетание из общего интерфейса.<br/>
        Доступны несколько готовых стилей: <Badge mode="outline">primary</Badge>, <Badge mode="outline">secondary</Badge>, <Badge mode="outline">outline</Badge>, <Badge mode="outline">neutral</Badge>
      </p>
      <div class="flex flex-wrap m-2">
        <Pagination v-model="activePage" mode="filled" :total="113" :visible-number-pages="5" :size-page="5" is-page-size-selector></Pagination>
      </div>
    </div>
  </ComponentViews>
</template>

<style scoped>

</style>