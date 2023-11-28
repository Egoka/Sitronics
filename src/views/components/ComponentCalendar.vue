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
      <Tooltip class="border-2 border-neutral-100 dark:border-neutral-900 bg-neutral-200 dark:bg-neutral-800 !p-5">
        
        
<!--          <div data-side="bottom" data-align="center" data-state="open" class="z-50 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 w-80" style="&#45;&#45;radix-hover-card-content-transform-origin: var(&#45;&#45;radix-popper-transform-origin); &#45;&#45;radix-hover-card-content-available-width: var(&#45;&#45;radix-popper-available-width); &#45;&#45;radix-hover-card-content-available-height: var(&#45;&#45;radix-popper-available-height); &#45;&#45;radix-hover-card-trigger-width: var(&#45;&#45;radix-popper-anchor-width); &#45;&#45;radix-hover-card-trigger-height: var(&#45;&#45;radix-popper-anchor-height); user-select: text;">-->
            <div class="flex justify-between space-x-4">
              <span class="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full">
                <img class="aspect-square h-full w-full" src="https://github.com/vercel.png">
              </span>
              <div class="space-y-1">
                <h4 class="text-sm font-semibold">@nextjs
                </h4>
                <p class="text-sm">The React Framework – created and maintained by @vercel.
                </p>
                <div class="flex items-center pt-2">
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" class="mr-2 h-4 w-4 opacity-70">
                    <path d="M4.5 1C4.77614 1 5 1.22386 5 1.5V2H10V1.5C10 1.22386 10.2239 1 10.5 1C10.7761 1 11 1.22386 11 1.5V2H12.5C13.3284 2 14 2.67157 14 3.5V12.5C14 13.3284 13.3284 14 12.5 14H2.5C1.67157 14 1 13.3284 1 12.5V3.5C1 2.67157 1.67157 2 2.5 2H4V1.5C4 1.22386 4.22386 1 4.5 1ZM10 3V3.5C10 3.77614 10.2239 4 10.5 4C10.7761 4 11 3.77614 11 3.5V3H12.5C12.7761 3 13 3.22386 13 3.5V5H2V3.5C2 3.22386 2.22386 3 2.5 3H4V3.5C4 3.77614 4.22386 4 4.5 4C4.77614 4 5 3.77614 5 3.5V3H10ZM2 6V12.5C2 12.7761 2.22386 13 2.5 13H12.5C12.7761 13 13 12.7761 13 12.5V6H2ZM7 7.5C7 7.22386 7.22386 7 7.5 7C7.77614 7 8 7.22386 8 7.5C8 7.77614 7.77614 8 7.5 8C7.22386 8 7 7.77614 7 7.5ZM9.5 7C9.22386 7 9 7.22386 9 7.5C9 7.77614 9.22386 8 9.5 8C9.77614 8 10 7.77614 10 7.5C10 7.22386 9.77614 7 9.5 7ZM11 7.5C11 7.22386 11.2239 7 11.5 7C11.7761 7 12 7.22386 12 7.5C12 7.77614 11.7761 8 11.5 8C11.2239 8 11 7.77614 11 7.5ZM11.5 9C11.2239 9 11 9.22386 11 9.5C11 9.77614 11.2239 10 11.5 10C11.7761 10 12 9.77614 12 9.5C12 9.22386 11.7761 9 11.5 9ZM9 9.5C9 9.22386 9.22386 9 9.5 9C9.77614 9 10 9.22386 10 9.5C10 9.77614 9.77614 10 9.5 10C9.22386 10 9 9.77614 9 9.5ZM7.5 9C7.22386 9 7 9.22386 7 9.5C7 9.77614 7.22386 10 7.5 10C7.77614 10 8 9.77614 8 9.5C8 9.22386 7.77614 9 7.5 9ZM5 9.5C5 9.22386 5.22386 9 5.5 9C5.77614 9 6 9.22386 6 9.5C6 9.77614 5.77614 10 5.5 10C5.22386 10 5 9.77614 5 9.5ZM3.5 9C3.22386 9 3 9.22386 3 9.5C3 9.77614 3.22386 10 3.5 10C3.77614 10 4 9.77614 4 9.5C4 9.22386 3.77614 9 3.5 9ZM3 11.5C3 11.2239 3.22386 11 3.5 11C3.77614 11 4 11.2239 4 11.5C4 11.7761 3.77614 12 3.5 12C3.22386 12 3 11.7761 3 11.5ZM5.5 11C5.22386 11 5 11.2239 5 11.5C5 11.7761 5.22386 12 5.5 12C5.77614 12 6 11.7761 6 11.5C6 11.2239 5.77614 11 5.5 11ZM7 11.5C7 11.2239 7.22386 11 7.5 11C7.77614 11 8 11.2239 8 11.5C8 11.7761 7.77614 12 7.5 12C7.22386 12 7 11.7761 7 11.5ZM9.5 11C9.22386 11 9 11.2239 9 11.5C9 11.7761 9.22386 12 9.5 12C9.77614 12 10 11.7761 10 11.5C10 11.2239 9.77614 11 9.5 11Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd">
                    
                    </path>
                  </svg>
                  <span class="text-xs text-muted-foreground">Joined December 2021
                  </span>
                </div>
              </div>
            </div>
<!--          </div>-->
        
      </Tooltip>
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