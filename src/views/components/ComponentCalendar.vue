<script setup lang="ts">
import { Calendar, DatePicker } from 'v-calendar';
import {reactive, ref, watch} from "vue";
import ComponentViews from "@/components/ComponentViews.vue";
import StCalendar, {type ICalendarPicker} from "@/components/form/StCalendar.vue";
import Icons from "@/components/functional/Icons.vue";
import Tooltip from "@/components/functional/Tooltip.vue";
const formFields = reactive({isInfo:
  // null
    "2023-08-09T21:00:00.000Z"
    // { start: "2023-08-09T21:00:00.000Z", end: null }
})
const calendar = ref()
const customer = reactive({
  name: 'Nathan Reyes',
  birthday: '1983-01-21',
});
const masks = ref({
  modelValue: 'DD MMMM YYYY',
});
// attributes: [
//   {
//     key: 'today',
//     dates: { start: new Date(year, month, 10), end: new Date(year, month, 12)},
//     highlight: {
//       start: { fillMode: 'outline' },
//       base: { fillMode: 'light' },
//       end: { fillMode: 'outline' },
//     },
//   },
//   {
//     popover: {
//       label: "Take Noah to basketball practice.",
//       placement: "top",
//       visibility: "hover-focus"
//     },
//     // highlight: true,
//
//     // content: {
//     //   color: "red"
//     // },
//     highlight: {
//       color: "orange",
//       fillMode: 'light',
//     },
//     customData: { a: 1},
//     dates: new Date(year, month, 18),
//     order: 1
//   },
//   {
//     popover: {
//       placement: "top",
//       label:"Test ",
//       visibility: "hover"
//     },
//     highlight: {
//       color: 'purple',
//       fillMode: 'outline',
//       contentClass: 'italic',
//     },
//     dates: new Date(year, month, 14),
//   },
//   {
//     highlight: 'blue',
//     popover: {
//       label: "Take Noah to basketball practice.",
//       placement: "top",
//       visibility: "hover-focus"
//     },
//     dates: [
//       new Date(year, month, 4),
//       [new Date(year, month, 7), new Date(year, month, 9)],
//     ],
//   },
//   {
//     highlight: {
//       color: 'purple',
//       fillMode: 'outline',
//       contentClass: 'italic',
//     },
//     // Wrap lone date range in separate array to avoid rendering as multiple dates
//     dates: {start: new Date(year, month, 7), repeat: {
//         on: ({weekdayOrdinalFromEnd, weekday, day}) =>
//           (weekdayOrdinalFromEnd === 1 && weekday === 2) || day === 15,
//         every: [2, 'months']
//     }},
//   },
//   {
//     highlight: 'green',
//     dates: [[new Date(year, month, 20), new Date(year, month, 23)],],
//   },
// ]
async function togglePopover() {
  await (calendar.value as ICalendarPicker).moveBy(1);
}
const range = ref({
  start: new Date(2020, 0, 6),
  end: new Date(2020, 0, 10)
});
</script>
<template>
  <ComponentViews>
    <template #title>Calendar</template>
<!--    <div class="dark:text-amber-50 mb-6">-->
<!--    formFields{{formFields['isInfo']}}-->
<!--    </div>-->
    {{formFields['isInfo']}}
    <StCalendar v-model:model-value="formFields['isInfo']" :params-date-picker="{isRange: false}" clear/>
    <StCalendar :model-value="formFields['isInfo']" :params-date-picker="{isRange: true}" clear>
<!--      <template #footerPicker>-->
<!--        <div class="w-full flex justify-center">-->
<!--          <button-->
<!--            class="px-3 py-2 my-1 bg-indigo-600 text-sm text-white font-semibold rounded-md"-->
<!--            @click="togglePopover">-->
<!--            Следющий месяц-->
<!--          </button>-->
<!--        </div>-->
<!--      </template>-->
      <template #before>
        <Icons  type="CoBirthdayCake"/>
      </template>
      <Tooltip>Test</Tooltip>
    </StCalendar>
<!--    {{customer.birthday}}-->
<!--    <DatePicker v-model.string="customer.birthday" :masks="masks" />-->
<!--    {{range}}-->
<!--    <DatePicker v-model.sting.range="range" mode="date" :popover=" { visibility: 'click',placement: 'bottom-start'}">-->

<!--    </DatePicker>-->
<!--    <DatePicker v-model="date">-->
<!--      <template #default="{ togglePopover }">-->
<!--        <button-->
<!--          class="px-3 py-2 bg-blue-500 text-sm text-white font-semibold rounded-md"-->
<!--          @click="togglePopover"-->
<!--        >-->
<!--          Select date-->
<!--        </button>-->
<!--      </template>-->
<!--    </DatePicker>-->
<!--    <DatePicker v-model="range" is-range>-->
<!--      <template #default="{ inputValue, inputEvents }">-->
<!--        <div class="flex justify-center items-center">-->
<!--          <BaseInput :value="inputValue.start" v-on="inputEvents.start" />-->
<!--          <IconArrowRight />-->
<!--          <BaseInput :value="inputValue.end" v-on="inputEvents.end" />-->
<!--        </div>-->
<!--      </template>-->
<!--    </DatePicker>-->
  
  </ComponentViews>
</template>