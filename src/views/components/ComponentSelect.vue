<script setup lang="ts">
import ComponentViews from "@/components/ComponentViews.vue";
import {type IFormExpose, type IFormStructure} from "@/components/form/StForm.vue";
import {reactive, ref} from "vue";
import StSelect from "@/components/form/StSelect.vue";
import Icons from "@/components/functional/Icons.vue";
import Select from "@/components/form/StSelect.vue";
const formFields = reactive({isInfo1: 123, isInfo2: [123]})

// const people = ref([
//   {value: 1, label: "Wade Cooper"},
//   {value: 2, label: "Arlene Mccoy"},
//   {value: 3, label: "Devon Webb"},
//   {value: 4, label: "Tom Cook"},
//   {value: 5, label: "Tanya Fox"},
//   {value: 6, label: "Hellen Schmidt"},
// ])
//
// const roles = ref([
//   {value: 1, label: "Marketing "},
//   {value: 2, label: "Front desk "},
//   {value: 3, label: "Support awda wdaw awd awd"},
//   {value: 4, label: "Support awda wdaw awd awd"},
//   {value: 11, label: "Wade Cooper"},
//   {value: 12, label: "Arlene Mccoy"},
//   {value: 13, label: "Devon Webb"},
//   {value: 14, label: "Tom Cook"},
//   {value: 15, label: "Tanya Fox"},
//   {value: 16, label: "Hellen Schmidt"},
// ])

const test = [123, '12314124 23123 ', 214124, 3, 2]
const form = ref({
  person_id: null,
  role_ids: []
});
const mode = ref()

</script>
<template>
  <ComponentViews>
    <template #title>Select</template>
    {{formFields}}
    <Select
      v-model="formFields.isInfo1"
      :mode="mode"
      label="Профессия"
      label-mode="vanishing"
      required
      :data-select="test"
      key-select="value"
      :multiple="false"
      :max-visible="2"
      help="Test field"
      clear>
      <template #before>
        <Icons type="Sun"/>
      </template>
    </Select>
    <StSelect label="Mode select" :data-select="['filled', 'outlined', 'underlined']"  v-model="mode"/>
    <Select
      v-model="formFields.isInfo2"
      mode="filled"
      label="Профессия"
      label-mode="vanishing"
      required
      :data-select="test"
      key-select="value"
      :multiple="true"
      :max-visible="2"
      help="Test field"
      clear>
      <template #before>
        <Icons type="Sun"/>
      </template>
    </Select>
<!--    <Select-->
<!--      v-model="formFields.isInfo"-->
<!--      mode="underlined"-->
<!--      label="Профессия"-->
<!--      label-mode="vanishing"-->
<!--      required-->
<!--      :params-select="{-->
<!--        dataSelect: roles,-->
<!--        keySelect: 'value',-->
<!--      }"-->
<!--      help="Test field"-->
<!--      clear>-->
<!--      <template #before>-->
<!--        <Icons type="Sun"/>-->
<!--      </template>-->
<!--    </Select>-->
  </ComponentViews>
</template>