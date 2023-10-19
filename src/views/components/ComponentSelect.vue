<script setup lang="ts">
import ComponentViews from "@/components/ComponentViews.vue";
import StForm, {type IFormExpose, type IFormStructure} from "@/components/form/StForm.vue";
import {reactive, ref, watch} from "vue";
import StSelect from "@/components/form/StSelect.vue";
import {CheckIcon} from "@heroicons/vue/20/solid";
import InputLayout from "@/components/functional/InputLayout.vue";
import Icons from "@/components/functional/Icons.vue";
import Select from "@/components/form/StSelect.vue";
import StInput from "@/components/form/StInput.vue";
const formFields = reactive({isInfo1: null, isInfo2: 1233})

const people = ref([
  {value: 1, label: "Wade Cooper"},
  {value: 2, label: "Arlene Mccoy"},
  {value: 3, label: "Devon Webb"},
  {value: 4, label: "Tom Cook"},
  {value: 5, label: "Tanya Fox"},
  {value: 6, label: "Hellen Schmidt"},
])

const roles = ref([
  {value: 1, label: "Marketing "},
  {value: 2, label: "Front desk "},
  {value: 3, label: "Support awda wdaw awd awd"},
  {value: 4, label: "Support awda wdaw awd awd"},
  {value: 11, label: "Wade Cooper"},
  {value: 12, label: "Arlene Mccoy"},
  {value: 13, label: "Devon Webb"},
  {value: 14, label: "Tom Cook"},
  {value: 15, label: "Tanya Fox"},
  {value: 16, label: "Hellen Schmidt"},
])

const test = [123, '12314124 23123 ', 214124, 3, 2]
const form = ref({
  person_id: null,
  role_ids: []
});

</script>
<template>
  <ComponentViews>
    <template #title>Select</template>
    {{formFields}}
    <Select
      v-model="formFields.isInfo1"
      mode="filled"
      label="Профессия"
      label-mode="vanishing"
      required
      :params-select="{
        dataSelect: test,
        keySelect: 'value',
        multiple: false,
        maxVisible: 2
      }"
      help="Test field"
      clear>
      <template #before>
        <Icons type="Sun"/>
      </template>
    </Select>
    <Select
      v-model="formFields.isInfo2"
      mode="filled"
      label="Профессия"
      label-mode="vanishing"
      required
      :params-select="{
        dataSelect: test,
        keySelect: 'value',
        multiple: true,
        maxVisible: 2
      }"
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