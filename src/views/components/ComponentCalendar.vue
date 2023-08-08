<script setup lang="ts">
import {reactive, ref, watch} from "vue";
import ComponentViews from "@/components/ComponentViews.vue";
import StCalendar from "@/components/form/StCalendar.vue";
const formFields = reactive({isInfo: ""})
</script>
<template>
  <ComponentViews>
    <template #title>Calendar</template>
    <StCalendar/>
    {{formFields['isInfo']}}
  </ComponentViews>
</template>