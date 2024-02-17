<script setup lang="ts">
import ComponentViews from "@/components/ComponentViews.vue";
import Table from "@/components/functional/Table.vue";
import type {IColumn, ISummary, ITableExpose, ITableStyles} from "@/components/functional/Table";
import Badge from "@/components/functional/Badge.vue";
import Button from "@/components/functional/Button.vue";
import { StarIcon as InStar } from "@heroicons/vue/24/outline";
import { StarIcon as OutStar } from "@heroicons/vue/24/solid";
import {onMounted, reactive, ref} from "vue";
import * as LData from "lodash";
import StSelect from "@/components/form/StSelect.vue";
import type {IMode} from "@/components/BaseTypes";
import dayjs from "dayjs";
import StSwitch from "@/components/form/StSwitch.vue";
import {useRoute} from "vue-router";
import Dialog from "@/components/functional/Dialog.vue";
import StForm from "@/components/form/StForm.vue";
import openAlert from "@/components/functional/Alert";
import {XMarkIcon, PlusIcon} from "@heroicons/vue/20/solid";
import type {IFormStructure} from "@/components/form/StForm";
onMounted(()=>{
  const route = useRoute();
  if (route.hash) {
    const hash = document.querySelector(route.hash)
    if (hash){
      console.log("hash", hash)
      hash.scrollIntoView({ block: "center", behavior: "smooth" })
    }
  }
})
function generateData (size:number) {
  return LData.times(size, (item) => {
    item = LData.random(size)
    return {
      key: item+1,
      name: `Car ${item+item}`,
      age: new Date(2023, item%12, item%25, 0, 0, 0),
      etc: `Etc ${item}`,
      t1: item%25,
      t2: item%6,
      t3: item%10,
      t4: item%15,
    };
  });
}
const data =reactive({
  generateData1000: generateData(1000),
  generateData100: generateData(100),
  generateData5: generateData(5)
})

const baseData = ref([
  {"name": "orange", "color": "orange", "shape": "round" },
  {"name": "banana", "color": "yellow", "shape": "long" },
  {"name": "grape", "color": "purple", "shape": "round" },
  {"name": "pear", "color": "green", "shape": "pear-shaped" },
  {"name": "grape", "color": "purple", "shape": "round" },
])
const baseTypeData = ref([
  {"name": "orange", "color": "orange", t1: 122530000, t2: 4, date: '2023-10-13T19:09:01.833Z'},
  {"name": "banana", "color": "yellow", t1: 122520000, t2: 3, date: '2023-11-12T19:09:01.833Z'},
  {"name": "grape", "color": "purple", t1: 122530000, t2: "5", date: '2023-10-17T19:09:01.833Z'},
  {"name": "pear", "color": "green", t1: 122530000, t2: 55, date: '2023-10-14T19:09:01.833Z'},
  {"name": "grape", "color": "purple", t1: 122530000, t2: "5", date: '2023-10-16T19:09:01.833Z'},
])
const baseCellData = ref([
  {"name": "orange", "color": "orange", t1: true, t2: 4, date: '2023-10-13T19:09:01.833Z'},
  {"name": "banana", "color": "yellow", t1: false, t2: 3, date: '2023-11-12T19:09:01.833Z'},
  {"name": "grape", "color": "purple", t1: true, t2: 5, date: '2023-10-17T19:09:01.833Z'},
  {"name": "pear", "color": "green", t1: false, t2: 1, date: '2023-10-14T19:09:01.833Z'},
  {"name": "grape", "color": "purple", t1: true, t2: 2, date: '2023-10-16T19:09:01.833Z'},
])
const baseSummaryData = ref([
  {"name": "orange", t1: 1, t2: 4, t3: 45, date: '2023-10-13T19:09:01.833Z'},
  {"name": "banana", t1: 10, t2: 3, t3: 44, date: '2023-11-12T19:09:01.833Z'},
  {"name": "grape", t1: 100, t2: 5, t3: 46, date: '2023-10-17T19:09:01.833Z'},
  {"name": "pear", t1: 1000, t2: 1, t3: 47, date: '2023-10-14T19:09:01.833Z'},
  {"name": "grape", t1: 10000, t2: 2, t3: 42, date: '2023-10-16T19:09:01.833Z'},
])
const countVisibleRowsExampleOne = ref<number>(3)
const countVisibleRowsExampleTwo = ref<number>(3)
const mode = ref<IMode>("filled")
const styles = reactive<ITableStyles>({horizontalLines:false})
const summary = <Array<ISummary>>[
  {
    dataField: "name",
    type: "count",
    displayFormat: "Количество: {0}"
  },
  {
    dataField: "color",
    type: "count",
    displayFormat: "Количество: {0}"
  },
  {
    dataField: "date",
    type: "min",
    dataType: "date",
    displayFormat: "Мин: {0}"
  }
]
const table = ref<ITableExpose>()
const entries = ref()
async function getEntries() {
  try {
    table.value?.startLoading()
    const response = await fetch("https://api.publicapis.org/entries")
    const result = await response.json()
    entries.value = result.entries
  } catch (e) {
    openAlert({title:"Не удалось загрузить данные таблицы", type: "error", displayTime: 3000, subtitle: `${e}`})
  } finally {
    table.value?.stopLoading()
  }
}
function switchSizePage() {
  getEntries()
}
const columnsApi = ref<Array<IColumn>>([
  {type: 'select'},
  {},
  {type: 'select'},
  {cellTemplate:'https', class:{cellText: "flex justify-center items-center whitespace-pre-line overflow-auto"}},
  {cellTemplate:'cors', type: 'select'},
  {cellTemplate:'link'},{}
])
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
const borderDataSelect = ref([
  {id: 'table', value: 'table', key: {table:'border-2 border-theme-200 dark:border-theme-700'},},
  {id: 'header', value: 'header', key: {header:'border-b-2 border-theme-200 dark:border-theme-700'},},
  {id: 'filter', value: 'filter', key: {filter:'border-r-2 border-theme-200 dark:border-theme-700'},},
  {id: 'head', value: 'head', key: {head:'border-b-2 border-theme-200 dark:border-theme-700'},},
  {id: 'cell', value: 'cell', key: {cell:'border-r-2 border-b-2 border-theme-200 dark:border-theme-700'},},
  {id: 'summary', value: 'summary', key: {summary:'border-t-2 border-theme-200 dark:border-theme-700'},},
  {id: 'pagination', value: 'pagination', key: {pagination:'border-t-2 border-theme-200 dark:border-theme-700'},},
  {id: 'footer', value: 'footer', key: {footer:'border-t-2 border-theme-200 dark:border-theme-700'},},
])
const classesDataSelect = ref([
  {id: 'body', value: 'Тело компонента', key: {body:'p-1.5 bg-theme-300 dark:bg-theme-800'}},
  {id: 'toolbar', value: 'toolbar', key: {toolbar:'justify-end items-end bg-theme-300 dark:bg-theme-800'}},
  {id: 'bodyTable', value: 'bodyTable', key: {bodyTable:'bg-theme-300 dark:bg-theme-800'}},
  {id: 'slotHeader', value: 'slotHeader', key: {slotHeader:'bg-theme-300 dark:bg-theme-800'}},
  {id: 'slotFooter', value: 'slotFooter', key: {slotFooter:'bg-theme-300 dark:bg-theme-800'}},
  {id: 'table', value: 'table', key: {table:'bg-theme-300 dark:bg-theme-800'}},
  {id: 'thead', value: 'thead', key: {thead:'bg-theme-300 dark:bg-theme-800'}},
  {id: 'tbody', value: 'tbody', key: {tbody:'bg-theme-300 dark:bg-theme-800'}},
  {id: 'tfoot', value: 'tfoot', key: {tfoot:'bg-theme-300 dark:bg-theme-800'}},
  {id: 'group', value: 'group', key: {group:'text-left text-gray-800 dark:text-gray-300 px-6 py-2 pr-3 pl-10 sm:pl-12 bg-theme-300 dark:bg-theme-800'}},
  {id: 'groupText', value: 'groupText', key: {groupText:'left-10 sm:left-12 flex items-center w-fit min-h-[2.5rem] truncate bg-theme-300 dark:bg-theme-800'}},
  {id: 'pagination', value: 'pagination', key: {pagination:'bg-theme-300 dark:bg-theme-800'}},
])
const activeRow = ref()
function clickRow(params: any) {
  if(params){
    const activeTr = params.eventEl.parentElement.querySelector(".active-tr")
    if (activeTr) {
      activeTr.classList.remove("active-tr", "!bg-theme-100", "dark:!bg-theme-900")
    }
    params.eventEl.classList.add("active-tr", "!bg-theme-100", "dark:!bg-theme-900")
    dialog.value = true
    activeRow.value = params.data._key
    formFields.value = params.data
  }
}
function addRow(){
  dialog.value = true
  formFields.value = {}
}
function deleteRow(key:any) {
  tableEdit.value?.deleteRow(key)
}
function submit(fields:any) {
  if (fields) {
    dialog.value = false
    if (activeRow.value) {
      tableEdit.value?.updateRow(activeRow.value, fields)
    } else {
      tableEdit.value?.addRow(fields)
    }
  }
}
const tableEdit = ref<ITableExpose>()
const dialog = ref(false)
const formFields = ref()
const structureDialog = ref<Array<IFormStructure>>([
  {
    title: "Данные записи",
    subTitle: "Эта информация будет отображаться публично, поэтому будьте осторожны с тем, чем вы делитесь.",
    fields:[
      {
        name: "key",
        typeComponent: "Input",
        label: "Идентификатор",
        classCol: "sm:col-span-2",
        required: true
      },
      {
        name: "name",
        typeComponent: "Input",
        label: "Имя",
        classCol: "sm:col-span-3",
        required: true
      },
      {
        name: "age",
        typeComponent: "Calendar",
        classCol: "sm:col-span-3",
        label: "Дата"
      },
      {
        name: "etc",
        typeComponent: "Input",
        classCol: "sm:col-span-3",
        label: "ЕТС"
      },
      {
        name: "t1",
        typeComponent: "Input",
        classCol: "sm:col-span-1",
        label: "T1"
      },
      {
        name: "t2",
        typeComponent: "Input",
        classCol: "sm:col-span-1",
        label: "T2"
      },
      {
        name: "t3",
        typeComponent: "Input",
        classCol: "sm:col-span-1",
        label: "T3"
      },
      {
        name: "t4",
        typeComponent: "Input",
        classCol: "sm:col-span-1",
        label: "T4"
      },
    ]
  }
])
</script>

<template>
  <ComponentViews>
    <template #title>Table</template>
    <div class="border-b border-theme-700/50 dark:border-theme-500/50 pb-0 mt-10">
      <h2 class="ml-5 text-xl font-semibold leading-7 text-theme-600 dark:text-theme-500">Table</h2>
      <p class="my-4 text-sm leading-6 text-gray-600 dark:text-gray-400">
        Table (таблица) - это элемент пользовательского интерфейса, который используется для организации и представления данных в виде сетки или матрицы. Он является одним из основных способов отображения структурированных данных.
        Основная цель использования таблицы - это упорядочение и систематизация информации. В таблице данные разбиваются на строки и столбцы, что позволяет легко читать и анализировать информацию. Каждая ячейка таблицы содержит отдельное значение или элемент данных.
      </p>
    </div>
    <div class="border-b border-theme-700/50 dark:border-theme-500/50 pb-0 mt-10">
      <h2 class="ml-5 text-xl font-semibold leading-7 text-theme-600 dark:text-theme-500">Базовое использование</h2>
      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
        <p>Для базового использования достаточно просто подать данные.</p>
      </p>
      <div class="grid transition grid-cols-1 gap-x-6 gap-y-0 sm:grid-cols-6">
        <div class=" col-span-full my-5">
          <Table :data-source="baseData"></Table>
        </div>
      </div>
      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400"><p><Badge mode="outline">noData</Badge>: Свойство noData типа string позволяет настроить текст, который будет отображаться в случае отсутствия данных в таблице.</p></p>
      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
        <p>Не подав в таблицу данных она выдаст сообщение об отсутствии данных</p>
      </p>
      <div class="grid transition grid-cols-1 gap-x-6 gap-y-0 sm:grid-cols-6">
        <div class=" col-span-full my-5">
          <Table no-data="Текст при отсутствии данных" ></Table>
        </div>
      </div>
    </div>
    <div class="border-b border-theme-700/50 dark:border-theme-500/50 pb-0 mt-10">
      <h2 class="ml-5 text-xl font-semibold leading-7 text-theme-600 dark:text-theme-500">Колонки</h2>
      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
        <p>Колонка в компоненте таблицы представляет собой отдельный столбец данных, который отображается в таблице.
          Каждая колонка имеет свои уникальные свойства, которые определяют её поведение и внешний вид.
        </p>
      </p>
      <div class="grid transition grid-cols-1 gap-x-6 gap-y-0 sm:grid-cols-6">
        <div class=" col-span-full my-5">
          <Table :data-source="baseData" columns></Table>
        </div>
      </div>
      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400 mb-5">
        <p>Некоторые из основных свойств колонки могут включать:</p>
      </p>
      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
        <p>
          <Badge mode="outline">dataField</Badge>: Это свойство определяет поле данных, связанное с колонкой. Оно указывает, какие данные должны быть отображены в колонке.
          Также с помощью него можно задавать порядок колонок.
        </p>
      </p>
      <div class="grid transition grid-cols-1 gap-x-6 gap-y-0 sm:grid-cols-6">
        <div class=" col-span-full my-5">
          <Table :data-source="baseData" :columns="[{dataField: 'name'}, {dataField: 'shape'}, {dataField:'color'}]"></Table>
        </div>
      </div>
      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400 mb-5"><p><Badge mode="outline">name</Badge>: Свойство name используется для задания имени или идентификатора колонки. Оно может быть использовано для обращения к колонке в коде или для описания её назначения.</p></p>
      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
        <p>
          <Badge mode="outline">isSort</Badge>: Свойство isSort определяет, может ли колонка использоваться для сортировки данных. Если установлено значение true, колонка может быть использована для сортировки.
        </p>
      </p>
      <div class="grid transition grid-cols-1 gap-x-6 gap-y-0 sm:grid-cols-6">
        <div class=" col-span-full my-5">
          <Table :data-source="baseData" :columns="[{dataField: 'name', isSort:true}, {dataField: 'shape', isSort:true}, {dataField:'color', isSort:true}]"></Table>
        </div>
      </div>
      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
        <p>
          <Badge mode="outline">isFilter</Badge>: Свойство isFilter указывает, должна ли колонка использоваться в качестве фильтра. Если установлено значение true, колонка будет использоваться для фильтрации данных.
        </p>
      </p>
      <div class="grid transition grid-cols-1 gap-x-6 gap-y-0 sm:grid-cols-6">
        <div class=" col-span-full my-5">
          <Table class="min-h-[23rem]" :data-source="baseData" :columns="[{dataField: 'name', isFilter:true}, {dataField: 'shape', isFilter:true}, {dataField:'color', isFilter:true}]"></Table>
        </div>
      </div>
      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400"><p><Badge mode="outline">caption</Badge>: Свойство caption позволяет установить заголовок или метку для колонки. Обычно оно используется для предоставления понятного описания колонки для пользователя.</p></p>
      <div class="grid transition grid-cols-1 gap-x-6 gap-y-0 sm:grid-cols-6">
        <div class=" col-span-full my-5">
          <Table :data-source="baseData" :columns="[{dataField: 'name', caption: 'Название'}, {dataField: 'shape', caption: 'Форма'}, {dataField:'color', caption: 'Цвет'}]"></Table>
        </div>
      </div>
      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400"><p><Badge mode="outline">type</Badge>: Свойство type определяет тип данных колонки. Оно может использоваться для проверки данных или форматирования отображаемых данных.</p></p>
      <div class="grid transition grid-cols-1 gap-x-6 gap-y-0 sm:grid-cols-6">
        <div class=" col-span-full my-5">
          <Table class="min-h-[23rem]" :data-source="baseTypeData" :columns="[
            {dataField: 'name', caption: 'Название', type: 'string', isSort:true, isFilter:true},
            {dataField: 'color', caption: 'Цвет', type: 'select', isSort:true, isFilter:true},
            {dataField: 'date', type: 'date', isSort:true, isFilter:true},
            {dataField: 't1', type: 'number', mask:'price', isSort:true, isFilter:true},
            ]"></Table>
        </div>
      </div>
      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400"><p><Badge mode="outline">cellTemplate</Badge>: Свойство cellTemplate позволяет задать пользовательский шаблон для ячейки колонки.</p></p>
      <div class="grid transition grid-cols-1 gap-x-6 gap-y-0 sm:grid-cols-6">
        <div class=" col-span-full my-5">
          <Table class="min-h-[23rem]" :data-source="baseCellData" :columns="[
            {dataField: 'name', caption: 'Название', type: 'string', isSort:true, isFilter:true, width: 130},
            {dataField: 'color', caption: 'Цвет', type: 'select', isSort:true, isFilter:true},
            {dataField: 'date', type: 'date', isSort:true, isFilter:true},
            {dataField: 't1', caption: 'Status', isSort:true, cellTemplate: 'status'},
            {dataField: 't2', caption: 'Rating', type: 'select', isSort:true, isFilter:true, cellTemplate:'rating'},
            ]">
            <template #rating="{value:countStars}">
              <InStar v-for="star in 5-countStars" :key="star" class="w-5 h-5 text-neutral-300 dark:text-neutral-700"></InStar>
              <OutStar v-for="star in Number(countStars)" :key="star" class="w-5 h-5 text-amber-300 dark:text-amber-700"></OutStar>
            </template>
            <template #status="{value}">
              <Badge v-if="value === 'true'" mode="neutral" :class="styleOne.green">yes</Badge>
              <Badge v-else-if="value === 'false'" mode="neutral" :class="styleOne.red">no</Badge>
            </template>
          </Table>
        </div>
      </div>
      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400 mb-5"><p><Badge mode="outline">visible</Badge>: Свойство visible определяет, должна ли колонка быть видимой или скрытой. Установка значения false скроет колонку.</p></p>
      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400"><p><Badge mode="outline">width</Badge>: Это свойство задает ширину колонки в пикселях. Оно позволяет контролировать размер колонки в таблице.</p></p>
      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400"><p><Badge mode="outline">minWidth</Badge>: Свойство minWidth устанавливает минимальную ширину, которую может иметь колонка.</p></p>
      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400"><p><Badge mode="outline">maxWidth</Badge>: Свойство maxWidth устанавливает максимальную ширину, которую может иметь колонка.</p></p>
      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400"><p><Badge mode="outline">defaultFilter</Badge>: Свойство defaultFilter позволяет установить значение фильтра по умолчанию для колонки.</p></p>
      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400"><p><Badge mode="outline">defaultSort</Badge>: Свойство defaultSort позволяет установить сортировку по умолчанию для колонки.</p></p>
      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400"><p><Badge mode="outline">mask</Badge>: Свойство mask определяет маску ввода и отображения для колонки.</p></p>
      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400"><p><Badge mode="outline">paramsInput</Badge>: Свойство paramsInput позволяет передать параметры ввода для колонки.</p></p>
      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400"><p><Badge mode="outline">paramsSelect</Badge>: Свойство paramsSelect позволяет передать параметры выбора даты для колонки.</p></p>
      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400"><p><Badge mode="outline">paramsDatePicker</Badge>: Свойство paramsDatePicker позволяет передать частичные параметры выбора даты для колонки.</p></p>
      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400"><p><Badge mode="outline">setCellValue</Badge>: Метод setCellValue позволяет установить значение ячейки колонки.</p></p>
      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400"><p><Badge mode="outline">class</Badge>: Свойство class содержит набор классов стилей для различных элементов интерфейса, таких как заголовок (th), фильтр (colFilter), текст колонки (colText) и т.д. Каждый класс стиля может быть настроен отдельно.</p></p>
    </div>
    <div class="border-b border-theme-700/50 dark:border-theme-500/50 pb-0 mt-10">
      <h2 class="ml-5 text-xl font-semibold leading-7 text-theme-600 dark:text-theme-500">Работа с данными</h2>
      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400"><p><Badge mode="outline">toolbar</Badge>: Свойство toolbar позволяет настроить панель инструментов для интерфейса. Вы можете указать объект с свойствами visible и search для определения видимости и наличия поля поиска в панели инструментов. Если вы установите значение в true, будет отображена стандартная панель инструментов.</p></p>
      <div class="grid transition grid-cols-1 gap-x-6 gap-y-0 sm:grid-cols-6">
        <div class=" col-span-full my-5">
          <Table :data-source="baseData" columns toolbar>
            <template #toolbar>
              <div class="border-2 rounded-lg border-theme-100 dark:border-theme-950 dark:bg-theme-800 dark:text-neutral-300">
                <Badge mode="outline">Toolbar</Badge> в котором может располагаться текст, кастомные кнопки или другие инструменты.
              </div>
            </template>
          </Table>
        </div>
      </div>
      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400"><p><Badge mode="outline">sort</Badge>: Свойство sort позволяет включить сортировку данных в интерфейсе. Вы можете указать объект с свойствами visible и icon для определения видимости и вида иконки сортировки. Возможные значения для свойства icon: "Bars" или "Arrow".</p></p>
      <div class="grid transition grid-cols-1 gap-x-6 gap-y-0 sm:grid-cols-6">
        <div class=" col-span-full my-5">
          <Table :data-source="baseData" columns sort>
          </Table>
        </div>
      </div>
      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400"><p><Badge mode="outline">filter</Badge>: Свойство filter позволяет включить фильтрацию данных в интерфейсе. Вы можете указать объект с свойствами visible, noFilter и isClearAllFilter для определения видимости, отображения вашего сообщения в случае пустого результата поиска и возможности очистки всех фильтров. Если вы установите значение в true, будет использована стандартная фильтрация.</p></p>
      <div class="grid transition grid-cols-1 gap-x-6 gap-y-0 sm:grid-cols-6">
        <div class=" col-span-full my-5">
          <Table :data-source="baseData" columns toolbar :filter="{isClearAllFilter: true, visible: true}">
          </Table>
        </div>
      </div>
      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400"><p><Badge mode="outline">search</Badge>: Свойство search позволяет включить поиск данных в интерфейсе. Если вы установите значение в true, будет отображено поле поиска, в которое пользователь может вводить ключевые слова для поиска соответствующих данных.</p></p>
      <div class="grid transition grid-cols-1 gap-x-6 gap-y-0 sm:grid-cols-6">
        <div class=" col-span-full my-5">
          <Table :data-source="baseData" columns search>
          </Table>
        </div>
      </div>
      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400"><p><Badge mode="outline">grouping</Badge>: Свойство grouping позволяет включить группировку данных в интерфейсе. Вы можете указать объект с свойствами visible и groupField или строку, чтобы определить видимость и поле группировки. Группировка позволяет пользователю сгруппировать данные по определенным критериям.</p></p>
      <div class="grid transition grid-cols-1 gap-x-6 gap-y-0 sm:grid-cols-6">
        <div class=" col-span-full my-5">
          <Table :data-source="baseData" columns grouping="color">
          </Table>
        </div>
      </div>
    </div>
    <div class="border-b border-theme-700/50 dark:border-theme-500/50 pb-0 mt-10">
      <h2 class="ml-5 text-xl font-semibold leading-7 text-theme-600 dark:text-theme-500">Cводная информация</h2>
      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400"><p><Badge mode="outline">summary</Badge>: параметр сводной информации в таблице. Может передавать булево значение или массив настроек для столбцов. При значении true включает итоговую информацию по умолчанию</p></p>
      <div class="grid transition grid-cols-1 gap-x-6 gap-y-0 sm:grid-cols-6">
        <div class=" col-span-full my-5">
          <Table :data-source="baseData" columns summary>
          </Table>
        </div>
      </div>
      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400"><p><Badge mode="outline">dataField</Badge>: Строка, указывающая поле данных, для которого будет рассчитана сводная информация.</p></p>
      <div class="grid transition grid-cols-1 gap-x-6 gap-y-0 sm:grid-cols-6">
        <div class=" col-span-full my-5">
          <Table :data-source="baseData" columns :summary="[{dataField:'name'}]"/>
        </div>
      </div>
      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400"><p><Badge mode="outline">name</Badge>: Строка, содержащая имя сводной информации.</p></p>
      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400"><p><Badge mode="outline">dataType</Badge>: Перечисление DataType, указывающее тип данных для сводного столбца.</p></p>
      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400"><p><Badge mode="outline">type</Badge>: Строка, указывающая тип сводной информации. Возможные значения: "sum" (сумма), "min" (минимум), "max" (максимум), "avg" (среднее значение), "count" (количество).</p></p>
      <div class="grid transition grid-cols-1 gap-x-6 gap-y-0 sm:grid-cols-6">
        <div class=" col-span-full my-5">
          <Table :data-source="baseSummaryData" :columns="[{},{type:'number'},{type:'number'},{type:'number'},{type:'date'}]" :summary="[{dataField:'name', type:'count'}, {dataField:'t1', type: 'max'}, {dataField:'t2', type:'avg'}, {dataField:'t3', type:'sum'}, {dataField:'date', type:'max', dataType: 'date'}]"/>
        </div>
      </div>
      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400"><p><Badge mode="outline">displayFormat</Badge>: Строка, определяющая формат отображения сводной информации. Возможные значения: "Sum: {0}", "Min: {0}", "Max: {0}", "Avg: {0}", "Count: {0}". В этих строках "{0}" будет заменено на фактическое значение сводной информации.</p></p>
      <div class="grid transition grid-cols-1 gap-x-6 gap-y-0 sm:grid-cols-6">
        <div class=" col-span-full my-5">
          <Table :data-source="baseSummaryData"
                 :columns="[{},{type:'number'},{type:'number'},{type:'number'},{type:'date'}]"
                 :summary="[{dataField:'name', type:'count', displayFormat: 'Количество: {0}'}, {dataField:'t1', type: 'min', displayFormat:'Минимальное: {0}'}, {dataField:'t2', type:'avg', displayFormat:'Среднее: {0}'}, {dataField:'t3', type:'sum', displayFormat:'Сумма: {0}'}, {dataField:'date', type:'max', dataType: 'date', displayFormat:'Максимальное: {0}'}]"/>
        </div>
      </div>
      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400"><p><Badge mode="outline">customizeText</Badge>: Функция, которая позволяет настроить текст отображения сводной информации. Принимает два параметра: summary (объект ISummary) и result (строка с фактическим значением сводной информации). Функция должна вернуть строку, которая будет отображаться вместо фактического значения.</p></p>
      <div class="grid transition grid-cols-1 gap-x-6 gap-y-0 sm:grid-cols-6"><div class=" col-span-full my-5"></div></div>
    </div>
    <div class="border-b border-theme-700/50 dark:border-theme-500/50 pb-0 mt-10">
      <h2 class="ml-5 text-xl font-semibold leading-7 text-theme-600 dark:text-theme-500">Пагинация</h2>
      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400"><p><Badge mode="outline">Pagination</Badge>: параметр пагинации в таблице. Может передавать булево значение или объект настроек. При значении true включает пагинацию по умолчанию</p></p>
      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400"><p><Badge mode="outline">visible</Badge>: Булево значение, указывающее, видима ли пагинация в таблице. Если установлено значение true, пагинация будет отображаться, в противном случае - скрыта.</p></p>
      <div class="grid transition grid-cols-1 gap-x-6 gap-y-0 sm:grid-cols-6">
        <div class=" col-span-full my-5">
          <Table :data-source="data.generateData1000" :columns="[{},{width: 120},{type:'date'},{width: 130},{},{},{},{}]" pagination :count-visible-rows="3">
          </Table>
        </div>
      </div>
      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400"><p><Badge mode="outline">startPage</Badge>: Число, указывающее начальную страницу пагинации.</p></p>
      <div class="grid transition grid-cols-1 gap-x-6 gap-y-0 sm:grid-cols-6">
        <div class=" col-span-full my-5">
          <Table :data-source="data.generateData1000" :columns="[{},{width: 120},{type:'date'},{width: 130},{},{},{},{}]" :pagination="{startPage:20}" :count-visible-rows="3">
          </Table>
        </div>
      </div>
      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400"><p><Badge mode="outline">sizePage</Badge>: Число или предопределенное значение (5, 15, 20, 50, 100, 150), указывающее количество элементов на странице.</p></p>
      <div class="grid transition grid-cols-1 gap-x-6 gap-y-0 sm:grid-cols-6">
        <div class=" col-span-full my-5">
          <Table :data-source="data.generateData1000" :columns="[{},{width: 120},{type:'date'},{width: 130},{},{},{},{}]" :pagination="{sizePage:20}" :count-visible-rows="3">
          </Table>
        </div>
      </div>
      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400"><p><Badge mode="outline">visibleNumberPages</Badge>: Число, указывающее количество видимых номеров страниц в пагинации.</p></p>
      <div class="grid transition grid-cols-1 gap-x-6 gap-y-0 sm:grid-cols-6">
        <div class=" col-span-full my-5">
          <Table :data-source="data.generateData1000"
                 :columns="[{},{width: 120},{type:'date'},{width: 130},{},{},{},{}]"
                 :pagination="{sizePage:20,visible:true,startPage:20,visibleNumberPages:9}"
                 :count-visible-rows="3"/>
        </div>
      </div>
      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400"><p><Badge mode="outline">isInfoText</Badge>: Булево значение, указывающее, должен ли быть отображен текст с информацией о текущей странице и общем количестве элементов.</p></p>
      <div class="grid transition grid-cols-1 gap-x-6 gap-y-0 sm:grid-cols-6">
        <div class=" col-span-full my-5">
          <Table :data-source="data.generateData1000"
                 :columns="[{},{width: 120},{type:'date'},{width: 130},{},{},{},{}]"
                 :pagination="{sizePage:20,visible:true,startPage:20,isInfoText:true}"
                 :count-visible-rows="3"/>
        </div>
      </div>
      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400"><p><Badge mode="outline">isHiddenNavigationButtons</Badge>: Булево значение, указывающее, должны ли быть скрыты кнопки навигации (предыдущая/следующая страница).</p></p>
      <div class="grid transition grid-cols-1 gap-x-6 gap-y-0 sm:grid-cols-6">
        <div class=" col-span-full my-5">
          <Table :data-source="data.generateData1000"
                 :columns="[{},{width: 120},{type:'date'},{width: 130},{},{},{},{}]"
                 :pagination="{sizePage:20,visible:true,startPage:20,isHiddenNavigationButtons:true}"
                 :count-visible-rows="3"/>
        </div>
      </div>
      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400"><p><Badge mode="outline">isPageSizeSelector</Badge>: Булево значение, указывающее, должен ли быть отображен селектор для выбора количества элементов на странице.</p></p>
      <div class="grid transition grid-cols-1 gap-x-6 gap-y-0 sm:grid-cols-6">
        <div class=" col-span-full my-5">
          <Table :data-source="data.generateData1000"
                 :columns="[{},{width: 120},{type:'date'},{width: 130},{},{},{},{}]"
                 :pagination="{sizePage:20,visible:true,startPage:20,isPageSizeSelector:true}"
                 :count-visible-rows="3"/>
        </div>
      </div>
      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400"><p><Badge mode="outline">sizesSelector</Badge>: Массив чисел или предопределенный массив ([5, 15, 20, 50, 100, 150]), определяющий доступные варианты количества элементов на странице.</p></p>
      <div class="grid transition grid-cols-1 gap-x-6 gap-y-0 sm:grid-cols-6">
        <div class=" col-span-full my-5">
          <Table :data-source="data.generateData1000"
                 :columns="[{},{width: 120},{type:'date'},{width: 130},{},{},{},{}]"
                 :pagination="{sizePage:3,visible:true,startPage:20,sizesSelector:[3,6,9]}"
                 :count-visible-rows="3"/>
        </div>
      </div>
      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400"><p><Badge mode="outline">mode</Badge>: Объект типа IMode, определяющий визуальный стиль пагинации.</p></p>
      <div class="grid transition grid-cols-1 gap-x-6 gap-y-0 sm:grid-cols-6"><div class=" col-span-full my-5"></div></div>
    </div>
    <div class="border-b border-theme-700/50 dark:border-theme-500/50 pb-0 mt-10">
      <h2 class="ml-5 text-xl font-semibold leading-7 text-theme-600 dark:text-theme-500">Дополнительные настройки</h2>
      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400"><p><Badge mode="outline">countVisibleRows</Badge>: Число, указывающее количество видимых строк в таблице.</p></p>
      <div class="grid transition grid-cols-1 gap-x-6 gap-y-0 sm:grid-cols-6">
        <div class=" col-span-full my-5">
          <Table :data-source="data.generateData100" toolbar :columns="[{},{width: 120},{type:'date'},{width: 130},{},{},{},{}]" :pagination="{isInfoText:true}" :count-visible-rows="countVisibleRowsExampleOne">
            <template #toolbar>
              <StSelect label="Количество видимых строк" v-model="countVisibleRowsExampleOne" :data-select="[3, 5, 10, 15]"></StSelect>
            </template>
          </Table>
        </div>
      </div>
      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400"><p><Badge mode="outline">resizedColumns</Badge>: Булево значение, указывающее, должны ли быть изменяемы размеры столбцов таблицы.</p></p>
      <div class="grid transition grid-cols-1 gap-x-6 gap-y-0 sm:grid-cols-6">
        <div class=" col-span-full my-5">
          <Table :data-source="data.generateData5" :columns="[{},{width: 120},{type:'date'},{width: 130},{},{},{},{}]" resized-columns/>
        </div>
      </div>
      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400"><p><Badge mode="outline">countDataOnLoading</Badge>: Число или предопределенное значение (100, 1000, 10000), указывающее количество данных, при котором начнет работать анимация загрузки.</p></p>
      <div class="grid transition grid-cols-1 gap-x-6 gap-y-0 sm:grid-cols-6">
        <div class=" col-span-full my-5">
          <Table :data-source="data.generateData1000" filter resized-columns
                 :columns="[{},{width: 120},{type:'date'},{width: 130},{},{},{},{}]"
                 :count-visible-rows="5"
                 :count-data-on-loading="100"/>
        </div>
      </div>
    </div>
    <div class="border-b border-theme-700/50 dark:border-theme-500/50 pb-0 mt-10">
      <h2 class="ml-5 text-xl font-semibold leading-7 text-theme-600 dark:text-theme-500">Вставка данных</h2>
      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400"><p><Badge mode="outline">#toolbar</Badge>: Шаблон, который позволяет настроить содержимое панели инструментов таблицы. В этом слоте можно разместить дополнительные элементы управления или информацию.</p></p>
      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400"><p><Badge mode="outline">#group</Badge>: Шаблон, который позволяет настроить отображение группировки данных в таблице. В этом слоте можно определить, каким образом будут отображаться группы данных и какие элементы управления будут доступны для работы с группами.</p></p>
      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400"><p><Badge mode="outline">#header</Badge>: Шаблон, который позволяет настроить отображение заголовка таблицы. В этом слоте можно определить, какие столбцы будут отображаться в заголовке и какие элементы управления будут доступны для сортировки и фильтрации данных.</p></p>
      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400"><p><Badge mode="outline">#footer</Badge>: Шаблон, который позволяет настроить отображение подвала таблицы. В этом слоте можно разместить дополнительную информацию или элементы управления, связанные с таблицей.</p></p>
      <div class="grid transition grid-cols-1 gap-x-6 gap-y-0 sm:grid-cols-6">
        <div class="col-span-full my-5">
          <Table :data-source="data.generateData100"
                 search
                 toolbar
                 :columns="[{},{width: 120},{type:'date'},{width: 130},{},{},{},{}]"
                 grouping="age"
                 :count-visible-rows="5">
            <template #toolbar>
              <div class="flex justify-center items-center min-h-[3rem] w-full h-full rounded-lg border dark:border-neutral-800 text-center p-2 bg-theme-50 dark:bg-theme-950 text-theme-700 dark:text-theme-300">#toolbar</div>
            </template>
            <template #group="{item, length}">
              <div class="flex justify-center items-center w-full h-full rounded-lg border dark:border-neutral-800 text-center p-2 bg-theme-50 dark:bg-theme-950 text-theme-700 dark:text-theme-300">#group {{ dayjs(item).format('DD.MM.YYYY')  }}</div>
            </template>
            <template #header>
              <div class="flex justify-center items-center min-h-[3rem] w-full h-full rounded-lg border dark:border-neutral-800 text-center p-2 bg-theme-50 dark:bg-theme-950 text-theme-700 dark:text-theme-300">#header</div>
            </template>
            <template #footer>
              <div class="flex justify-center items-center min-h-[3rem] w-full h-full rounded-lg border dark:border-neutral-800 text-center p-2 bg-theme-50 dark:bg-theme-950 text-theme-700 dark:text-theme-300">#footer</div>
            </template>
          </Table>
        </div>
      </div>
    </div>
    <div class="border-b border-theme-700/50 dark:border-theme-500/50 pb-0 mt-10">
      <h2 id="styles" class="ml-5 text-xl font-semibold leading-7 text-theme-600 dark:text-theme-500">Стилизация</h2>
      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400"><p><Badge mode="outline">mode</Badge>: Режим стилизации таблицы. Доступно три разных стиля: filled, outlined, underlined</p></p>
      <div class="grid transition grid-cols-1 gap-x-6 gap-y-0 sm:grid-cols-6">
        <div class="col-span-full my-5">
          <Table
            key="TableMode"
            :data-source="data.generateData1000"
            :count-visible-rows="5"
            filter
            sort
            resized-columns
            search
            :mode="mode"
            :columns="[{},{width: 110},{type:'date'},{type:'select'},{type:'select'},{type:'select'},{type:'select'},{type:'select'}]"
            :summary="[{type:'count'},{type:'min'},{type:'max'},{type:'count'},{type:'max'},{type:'max'},{type:'max'},{type:'max'}]"
            :pagination="{sizePage:100}"
            toolbar
          >
            <template #toolbar>
              <StSelect label="Стиль" :data-select="['filled', 'outlined', 'underlined']" v-model="mode" :mode="mode" class-body="w-[9rem] mb-0 rounded-md"/>
            </template>
          </Table>
        </div>
      </div>
      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400"><p><Badge mode="outline">horizontalLines</Badge>: Булево значение, указывающее, должны ли отображаться горизонтальные линии между строками таблицы.</p></p>
      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400"><p><Badge mode="outline">verticalLines</Badge>: Булево значение, указывающее, должны ли отображаться вертикальные линии между столбцами таблицы.</p></p>
      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400"><p><Badge mode="outline">filterLines</Badge>: Булево значение, указывающее, должны ли отображаться линии между фильтрами столбцов таблицы.</p></p>
      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400"><p><Badge mode="outline">hoverRows</Badge>: Строка или булево значение, определяющее стиль при наведении на строки таблицы. Может принимать значения "hover:bg-neutral-100/90 dark:hover:bg-neutral-900/50" для применения фонового цвета при наведении, или true/false для включения/отключения стиля при наведении.</p></p>
      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400"><p><Badge mode="outline">isStripedRows</Badge>: Булево значение, указывающее, должны ли строки таблицы иметь полосатый фон.</p></p>
      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400"><p><Badge mode="outline">borderRadiusPx</Badge>: Число, определяющее радиус скругления углов таблицы в пикселях.</p></p>
      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400"><p><Badge mode="outline">heightCell</Badge>: Число, определяющее высоту ячейки таблицы в пикселях.</p></p>
      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400"><p><Badge mode="outline">maskQuery</Badge>: Строка, определяющая стиль для выделения поискового запроса в тексте таблицы.</p></p>
      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400"><p><Badge mode="outline">class</Badge>: Объект, содержащий классы стилей для различных элементов таблицы. Внутри объекта можно задать классы для следующих элементов: body, toolbar, bodyTable, slotHeader, slotFooter, table, thead, tbody, tfoot, group, groupText, pagination.</p></p>
      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400"><p><Badge mode="outline">border</Badge>: Строка или объект, определяющий стили границ таблицы и ее элементов. Может принимать значения "border-neutral-200 dark:border-neutral-800" для применения стандартной границы, "border-0 border-b-0 border-t-0 border-r-0" для отключения границы, или объект с ключами table, header, filter, head, cell, summary, pagination, footer, определяющими стили границ для соответствующих элементов таблицы.</p></p>
      <div class="grid transition grid-cols-1 gap-x-6 gap-y-0 sm:grid-cols-6">
        <div class="col-span-full my-5">
          <Table
            :data-source="data.generateData1000"
            :count-visible-rows="countVisibleRowsExampleTwo ?? 5"
            filter
            sort
            resized-columns
            search
            :columns="[{},{width: 110},{type:'date'},{type:'select'},{type:'select'},{type:'select'},{type:'select'},{type:'select'}]"
            :summary="[{type:'count'},{type:'min'},{type:'max'},{type:'count'},{type:'max'},{type:'max'},{type:'max'},{type:'max'}]"
            :pagination="{sizePage:100}"
            toolbar
            :count-data-on-loading="100.0"
            :styles="{...styles}"
          >
            <template #header>
              <div class="flex flex-wrap m-2">
                <StSwitch label="Горизонтальные линии" v-model="styles.horizontalLines" :params-switch="{switchingType: 'switch'}"></StSwitch>
                <StSwitch label="Вертикальные линии" v-model="styles.verticalLines" :params-switch="{switchingType: 'switch'}"></StSwitch>
                <StSwitch label="Разделители заголовков" v-model="styles.filterLines" :params-switch="{switchingType: 'switch'}"></StSwitch>
                <StSwitch label="Выделение при наведении" v-model="styles.hoverRows" :params-switch="{switchingType: 'switch'}"></StSwitch>
                <StSwitch label="Чередующиеся строки" v-model="styles.isStripedRows" :params-switch="{switchingType: 'switch'}"></StSwitch>
              </div>
              <div class="flex flex-wrap m-2">
                <StSelect label="Радиус" :params-select="{classSelect:'justify-end pr-px', dataSelect:[1, 3, 5, 7, 9, 13, 17, 25, 30], noQuery:true}" v-model="styles.borderRadiusPx" class-body="m-2 w-[9rem] mb-0 rounded-md" clear>
                  <template v-if="styles.borderRadiusPx" #after>px</template>
                </StSelect>
                <StSelect label="Высота ячейки" :params-select="{classSelect:'justify-end pr-px', dataSelect:[20, 30, 40, 60, 80, 100], noQuery:true}" v-model="styles.heightCell" class-body="m-2 w-[9rem] mb-0 rounded-md" clear>
                  <template v-if="styles.heightCell" #after>px</template>
                </StSelect>
                <StSelect label="Рамка" class-body="m-2 w-[9rem] mb-0 rounded-md" clear :params-select="{multiple: true, maxVisible: 0, noQuery:true, dataSelect:borderDataSelect}"
                          @update:model-value="(value)=>styles.border = (value as [])?.reduce((result,item)=>Object.assign(result, borderDataSelect.find(i=>i.id===item).key),{})"/>
                <StSelect label="Зоны таблицы" class-body="m-2 w-[9rem] mb-0 rounded-md" clear :params-select="{multiple: true, maxVisible: 0, noQuery:true, dataSelect:classesDataSelect}"
                          @update:model-value="(value)=>styles.class = (value as [])?.reduce((result,item)=>Object.assign(result, classesDataSelect.find(i=>i.id===item).key),{})"/>
              </div>
              <div class="flex flex-wrap m-2">
                <StSelect label="Ширина" :params-select="{classSelect:'justify-end pr-px',dataSelect:[400, 500, 700, 900, 1300, 1700, 2500, 3000], noQuery:true}" v-model="styles.width" class-body="m-2 w-[9rem] mb-0 rounded-md" clear>
                  <template v-if="styles.width" #after>px</template>
                </StSelect>
                <StSelect label="Высота" class-select="justify-end pr-px" :data-select="[600, 700, 900, 1300, 1700, 2500, 3000]" no-query v-model="styles.height" class-body="m-2 w-[9rem] mb-0 rounded-md" clear>
                  <template v-if="styles.height" #after>px</template>
                </StSelect>
                <StSelect label="Количество видимых строк" class-select="justify-end pr-px" :data-select="[1, 3, 5, 7, 9, 13, 17, 25, 30]" no-query v-model="countVisibleRowsExampleTwo" class-body="m-2 w-[15rem] mb-0 rounded-md" clear>
                  <template v-if="countVisibleRowsExampleTwo" #after>строк</template>
                </StSelect>
              </div>
            </template>
            <template #footer>
              <div class="flex w-full justify-end">
                <tfoot class="text-right">
                <tr>
                  <th scope="row" colspan="3" class="md atn auc ave avm awa awf axr bxt cgi">Subtotal</th>
                  <td class="atm aue ave avm awa axr cgp">$8,800.00</td></tr>
                </tfoot>
              </div>
            </template>
          </Table>
          <div class="col-span-full my-5">
            <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">Пример таблицы без интерфейсов управления</p>
            <Table
              :data-source="data.generateData100" :count-visible-rows="5"
              :columns="[{},{width: 110},{type:'date'},{type:'select'},{type:'select'},{type:'select'},{type:'select'},{type:'select'}]"
              :styles="{horizontalLines: false, verticalLines: true, class: {thead: 'hidden'}, borderRadiusPx: 3}"/>
          </div>
        </div>
      </div>
    </div>
    <div class="border-b border-theme-700/50 dark:border-theme-500/50 pb-0 mt-10">
      <h2 id="styles" class="ml-5 text-xl font-semibold leading-7 text-theme-600 dark:text-theme-500">Редактирование данных</h2>
<!--      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400"><p><Badge mode="outline">mode</Badge>: Режим стилизации таблицы. Доступно три разных стиля: filled, outlined, underlined</p></p>-->
      <div class="grid transition grid-cols-1 gap-x-6 gap-y-0 sm:grid-cols-6">
        <div class="col-span-full my-5">
          <div class="flex flex-wrap my-2">
          </div>
          <Table filter sort edit resized-columns
            :columns="[{width: 110, edit: true},{width: 110},{width: 125, type:'date'},{type:'select'},{type:'select'},{type:'select'},{type:'select'},{type:'select'}]"
            :data-source="data.generateData100"
            :count-visible-rows="7"
            :styles="{ verticalLines: true}"
          />
          <Table
            ref="tableEdit"
            :data-source="data.generateData1000"
            :count-visible-rows="7" :filter="{isClearAllFilter: true}" sort resized-columns search
            :columns="[{},{width: 110},{type:'date'},{type:'select'},{type:'select'},{type:'select'},{type:'select'},{type:'select'},{dataField: 'delete',caption: '', cellTemplate:'delete', maxWidth: 50, class:{td:'px-0 py-0 text-gray-800 dark:text-gray-300 sticky right-0', cellText: 'flex justify-center items-center whitespace-pre-line overflow-auto'}, isFilter: false, isSort: false, isResized: false}]"
            :pagination="{sizePage:50, isHiddenNavigationButtons: true, isInfoText: true}"
            toolbar
            :count-data-on-loading="100.0"
            @clickRow="clickRow"
          >
            <template #toolbar>
                <Button mode="neutral" class="h-9" @click.stop="addRow">
                  Создать
                  <PlusIcon aria-hidden="true" class="ml-1 h-5 w-5 fill-neutral-500 dark:fill-neutral-500"/>
                </Button>
            </template>
            <template #delete="{key}">
              <div class="bg-stone-50 dark:bg-stone-950 rounded-lg">
              <Button mode="ghost" class="px-[5px] h-9 w-9 m-0" @click.stop="deleteRow(key)">
                <XMarkIcon aria-hidden="true" class="h-5 w-5 fill-neutral-500 dark:fill-neutral-500"/>
              </Button>
              </div>
            </template>
          </Table>
        </div>
      </div>
    </div>
    <div class="grid transition grid-cols-1 gap-x-6 gap-y-0 sm:grid-cols-6 mt-5">
      <div class="col-span-full ms:m-5">
          <Button @click="switchSizePage">Загрузить таблицу</Button>
      </div>
    </div>
    <Table
      ref="table"
      :data-source="entries"
      :columns="columnsApi"
      filter
      resized-columns
      :count-visible-rows="6"
      :pagination="{sizePage: 50, isInfoText: true, isPageSizeSelector: true}"
      no-data="Загрузите данные"
      :styles="{verticalLines: true, horizontalLines: false}">
      <template #cors="{value}">
        <Badge v-if="value === 'yes'" mode="neutral" :class="styleOne.green">yes</Badge>
        <Badge v-else-if="value === 'no'" mode="neutral" :class="styleOne.red">no</Badge>
        <Badge v-else-if="value === 'unknown'" mode="neutral" :class="styleOne.gray">unknown</Badge>
      </template>
      <template #link="{value}">
        <a :href="value">{{value.replace('https://', '').replace('http://', '')}}</a>
      </template>
      <template #https="{value}">
        <span v-if="value==='true'" class="flex relative h-3 w-3 ml-1">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
        </span>
        <span v-else-if="value==='false'" class="flex relative h-3 w-3 ml-1">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        </span>
      </template>
    </Table>
    <Dialog v-model="dialog" close-button>
      <StForm :structure="structureDialog"
              :form-fields="formFields"
              submit-button="Сохранить"
              structure-class="border-b border-gray-300/50 dark:border-gray-600/50 pb-0 mt-10"
              structure-class-grid="grid-cols-1 gap-x-6 gap-y-0 sm:grid-cols-6 mt-5"
              @submit="submit">
        <template #itemTitle="{structure}">
          <h2 v-if="structure?.title?.length" class="text-xl font-semibold leading-7 text-gray-900 dark:text-gray-100">{{ structure?.title }}</h2>
          <p v-if="structure?.subTitle?.length" class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">{{ structure?.subTitle }}</p>
        </template>
      </StForm>
    </Dialog>
  </ComponentViews>
</template>