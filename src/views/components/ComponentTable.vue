<script setup lang="ts">
import ComponentViews from "@/components/ComponentViews.vue";
import Table, {ITable} from "@/components/functional/Table.vue";
import Button from "@/components/functional/Button.vue";
import {ref} from "vue";
const fruits = ref([
  {"name": "apple", "color": "red", "shape": "round", "taste": "sweet", "nutritional_value": "high", t1: 1225100000, t2: 3, date: '2023-10-11T19:09:01.833Z'},
  {"name": "orange", "color": "orange", "shape": "round", "taste": "sour", "nutritional_value": "high", t1: 122530000, t2: 4, date: '2023-10-13T19:09:01.833Z'},
  {"name": "banana", "color": "yellow", "shape": "long", "taste": "sweet", "nutritional_value": "medium", t1: 122520000, t2: 3, date: '2023-11-12T19:09:01.833Z'},
  {"name": "grape", "color": "purple", "shape": "round", "taste": "sweet", "nutritional_value": "high", t1: 122530000, t2: "5", date: '2023-10-17T19:09:01.833Z'},
  {"name": "pear", "color": "green", "shape": "pear-shaped", "taste": "sweet", "nutritional_value": "medium", t1: 122530000, t2: 55, date: '2023-10-14T19:09:01.833Z'},
  {"name": "grape", "color": "purple", "shape": "round", "taste": "sweet", "nutritional_value": "high", t1: 122530000, t2: "5", date: '2023-10-16T19:09:01.833Z'},
  {"name": "grape", "color": "purple", "shape": "round", "taste": "sweet", "nutritional_value": "high", t1: 122530000, t2: "5", date: '2023-10-15T19:09:01.833Z'},
  {"name": "grape", "color": "purple", "shape": "round", "taste": "sweet", "nutritional_value": "high", t1: 122530000, t2: "5", date: '2023-10-18T19:09:01.833Z'}
])
const columns = ref<ITable["columns"]>([
  {
    dataField: "color",
    caption: "Цвет",
    type: "select",
    maxWidth: 8,
    minWidth: 8,
    paramsSelect: {
      maxVisible: 0
    }
  },
  {
    caption: "Имя",
    dataField: "name",
    type: "string",
  },
  {
    caption: "Дата создания",
    dataField: "date",
    type: "date",
    minWidth: 9,
    paramsDatePicker: {
      isRange: false,
      // mask: "YYYY/MM/DD"
      masks: {
        modelValue: "DD.MM.YYYY",
      },
      separator: "none"
    }
  },
  {
    caption: "Стоимость",
    dataField: "t1",
    type: "select",
    mask: "price",
    paramsSelect: {
      mask: "price",
      maxVisible: 0
    }
  },
  {
    dataField: "t2",
    type: "number",
  },
])
</script>

<template>
  <ComponentViews>
    <template #title>Table</template>
    <div class="border-b border-primary-700/50 dark:border-primary-500/50 pb-0 mt-10">
      <h2 class="ml-5 text-xl font-semibold leading-7 text-primary-600 dark:text-primary-500">Table</h2>
      <p class="my-4 text-sm leading-6 text-gray-600 dark:text-gray-400">
        Table (таблица) - это элемент пользовательского интерфейса, который используется для организации и представления данных в виде сетки или матрицы. Он является одним из основных способов отображения структурированных данных.
        Основная цель использования таблицы - это упорядочение и систематизация информации. В таблице данные разбиваются на строки и столбцы, что позволяет легко читать и анализировать информацию. Каждая ячейка таблицы содержит отдельное значение или элемент данных.
        Table широко применяется в различных областях, включая веб-разработку, базы данных, научные исследования, финансы и многое другое. Он может быть использован для отображения любого типа данных, включая текст, числа, изображения и ссылки.
        Одна из важных функций таблицы - это возможность сортировки и фильтрации данных. Пользователь может выбирать определенные столбцы или строки для отображения, а также устанавливать критерии сортировки для упорядочивания данных по определенным параметрам.
        Table также предоставляет возможность форматирования данных, таких как изменение размера столбцов и строк, добавление заголовков и подзаголовков, применение стилей и цветовых схем. Это позволяет пользователю настроить внешний вид таблицы в соответствии с его потребностями и предпочтениями.
        В целом, таблица является мощным инструментом для организации и представления данных. Она облегчает чтение, анализ и визуализацию информации, что делает ее неотъемлемой частью многих приложений и систем.
      </p>
      <div class="grid transition grid-cols-1 gap-x-6 gap-y-0 sm:grid-cols-6 mt-5">
        <div class=" col-span-full m-5">
          <Table class="my-10" :data-source="fruits" filter sort search :columns="columns"></Table>
          <Table class="my-10" :data-source="fruits" filter></Table>
          <Table class="my-10" :data-source="fruits" sort filter :toolbar="{search: true}"></Table>
          <Table class="my-10" :data-source="fruits" sort filter></Table>
          <Table class="my-10" :data-source="fruits" sort></Table>
          <Table class="my-10" :data-source="fruits"></Table>
          <Table class="my-10" :data-source="fruits" is-hidden-head></Table>
          <Table class="my-10" :data-source="[]"></Table>
        </div>
      </div>
    </div>
  </ComponentViews>
</template>