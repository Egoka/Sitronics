<script setup lang="ts">
import ComponentViews from "@/components/ComponentViews.vue";
import StForm, {type IFormExpose, type IFormStructure} from "@/components/form/StForm.vue";
import {reactive, ref, watch} from "vue";
import StSwitch from "@/components/form/StSwitch.vue";
const formFields = reactive({isInfo: true})
</script>
<template>
  <ComponentViews>
    <template #title>Switch</template>
    <StSwitch
      v-model:model-value="formFields['isInfo']"
      label="Test"
      help="help"
      />
    {{formFields['isInfo']}}
  </ComponentViews>
</template>