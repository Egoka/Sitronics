<script setup lang="ts">
import {IPropsIconsType} from "@/components/functional/Icons.vue";
export interface IPropsTitleListLi {
  name:string
  data?: string|number
  nameIcon?:IPropsIconsType
  ul?:Array<IPropsTitleListLi>
}
defineProps<{
  list: Array<IPropsTitleListLi>
}>()
</script>

<template>
  <ul>
    <li v-for="(li, key) in list" :key="key">
      <slot :li="li"/>
    </li>
  </ul>
</template>

<style scoped>

</style>