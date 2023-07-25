<script setup lang="ts">
import ComponentViews from "@/components/ComponentViews.vue";
import StForm, {type IFormExpose, type IFormStructure} from "@/components/form/StForm.vue";
import {reactive, ref, watch} from "vue";
import StSelect from "@/components/form/StSelect.vue";
import BaseListbox from "@/components/form/StSelect.vue";
const formFields = reactive({isInfo: true})

const people = ref([
  {value: 1, label: "Wade Cooper"},
  {value: 2, label: "Arlene Mccoy"},
  {value: 3, label: "Devon Webb"},
  {value: 4, label: "Tom Cook"},
  {value: 5, label: "Tanya Fox"},
  {value: 6, label: "Hellen Schmidt"},
])

const roles = ref([
  {value: 1, label: "Marketing"},
  {value: 2, label: "Front desk"},
  {value: 3, label: "Support"},
])

const form = ref({
  person_id: null,
  role_ids: []
});

</script>
<template>
  <ComponentViews>
    <template #title>Select</template>
<!--    <StSelect-->
<!--    />-->
<!--      v-model:model-value="formFields['isInfo']"-->
<!--      label="Test"-->
<!--      help="help"-->
<!--    {{formFields['isInfo']}}-->
    
    <BaseListbox
      placeholder="Select person"
      v-model="form.person_id"
      :options="people"
    />
    
    <BaseListbox
      placeholder="Select roles"
      v-model="form.role_ids"
      :options="roles"
      multiple
    />
    {{form}}
  </ComponentViews>
</template>