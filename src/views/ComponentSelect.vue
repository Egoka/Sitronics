<script setup lang="ts">
import ComponentViews from "@/components/ComponentViews.vue";
import StForm, {type IFormExpose, type IFormStructure} from "@/components/form/StForm.vue";
import {reactive, ref, watch} from "vue";
import StSelect from "@/components/form/StSelect.vue";
import {CheckIcon} from "@heroicons/vue/20/solid";
import InputLayout from "@/components/functional/inputLayout.vue";
import Icons from "@/components/functional/Icons.vue";
import Select from "@/components/form/StSelect.vue";
const formFields = reactive({isInfo: ""})

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
    <Select
      v-model="formFields.isInfo"
      mode="outlined"
      label="Профессия"
      label-mode="offsetDynamic"
      required
      :data-select="roles"
      key-select="value"
      help="Test field"
      multiple
      clear>
<!--      <template #default="{selected}">-->
<!--        <div class="m-[2px] bg-indigo-100 h-4 leading-4 px-1 rounded-md">-->
<!--&lt;!&ndash;          {{ selected?.label }}&ndash;&gt;-->
<!--          {{selected.item}}-->
<!--        </div>-->
<!--      </template>-->
<!--      <template #item="{item}">-->
<!--&lt;!&ndash;        {{ item?.value }} {{ item?.label }}&ndash;&gt;-->
<!--        {{item.item}}-->
<!--      </template>-->
      <template #before>
        <Icons type="SunIcon"/>
      </template>
    </Select>
<!--    <InputLayout-->
<!--      value="123"-->
<!--      mode="filled"-->
<!--      label="test"-->
<!--      label-mode="vanishing"-->
<!--      invalid-->
<!--      message-invalid="Error"-->
<!--      required-->
<!--      help="Test field"-->
<!--      clear-->
<!--      @clear="console.log('clear')"-->
<!--    >-->
<!--      <template #before>-->
<!--        <Icons type="SunIcon"/>-->
<!--      </template>-->
<!--      <template #after>-->
<!--        test-->
<!--        <Icons type="MoonIcon" class="h-5 w-5 text-gray-400 dark:text-gray-600 mx-2"/>-->
<!--      </template>-->
<!--    </InputLayout>-->
<!--    <Select-->
<!--      label="Select person"-->
<!--      v-model="form.person_id"-->
<!--      clear-->
<!--      :items="people">-->
<!--      <template #selected="{selected}">-->
<!--&lt;!&ndash;        {{selected}}&ndash;&gt;-->
<!--&lt;!&ndash;        <div v-for="select in selected" :key="select" >&ndash;&gt;-->
<!--          {{ selected }}-->
<!--&lt;!&ndash;        </div>&ndash;&gt;-->
<!--      </template>-->
<!--      <template #item="{option, active, selected}">-->
<!--        <li-->
<!--          :class="[-->
<!--                active ? 'bg-indigo-100 text-indigo-900' : 'text-gray-900',-->
<!--                'relative cursor-default select-none py-2 pl-10 pr-4',-->
<!--              ]"-->
<!--        >-->
<!--              <span-->
<!--                :class="[-->
<!--                  selected ? 'font-medium' : 'font-normal',-->
<!--                  'block truncate',-->
<!--                ]"-->
<!--              >{{ option.label }}</span-->
<!--              >-->
<!--          <span-->
<!--            v-if="selected"-->
<!--            class="flex absolute inset-y-0 left-0 items-center pl-3 text-indigo-600"-->
<!--          >-->
<!--                <CheckIcon-->
<!--                  aria-hidden="true"-->
<!--                  class="w-5 h-5"-->
<!--                />-->
<!--              </span>-->
<!--        </li>-->
<!--      </template>-->
<!--    </Select>-->
<!--    <Select-->
<!--      label="Select roles"-->
<!--      v-model="form.role_ids"-->
<!--      :items="roles"-->
<!--      multiple-->
<!--      clear-->
<!--    >-->
<!--      <template #selected="{selected}">-->
<!--        <div v-for="select in selected" :key="select" class="m-[2px] bg-indigo-100 h-5 leading-5 px-1 rounded-md">-->
<!--          {{ select.label }}-->
<!--        </div>-->
<!--      </template>-->
<!--      <template #item="{option, active, selected}">-->
<!--        <li-->
<!--          :class="[-->
<!--                active ? 'bg-indigo-100 text-indigo-900' : 'text-gray-900',-->
<!--                'relative cursor-default select-none py-2 pl-10 pr-4',-->
<!--              ]"-->
<!--        >-->
<!--              <span-->
<!--                :class="[-->
<!--                  selected ? 'font-medium' : 'font-normal',-->
<!--                  'block truncate',-->
<!--                ]"-->
<!--              >{{ option.label }}</span-->
<!--              >-->
<!--          <span-->
<!--            v-if="selected"-->
<!--            class="flex absolute inset-y-0 left-0 items-center pl-3 text-indigo-600"-->
<!--          >-->
<!--                <CheckIcon-->
<!--                  aria-hidden="true"-->
<!--                  class="w-5 h-5"-->
<!--                />-->
<!--              </span>-->
<!--        </li>-->
<!--      </template>-->
<!--    </Select>-->
    {{form}}{{formFields}}
  </ComponentViews>
</template>