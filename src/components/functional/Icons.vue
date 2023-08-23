<script setup lang="ts">
import {convertToCamelCase, convertToDashCase, convertToSnakeCase} from "@/helpers/string";

export interface IIcon {
  type: string
  class?: "h-5 w-5 text-gray-400 dark:text-gray-600"|string|Array<string|boolean>
  style?: string
}
// ---------------------------------------
import * as HeroIcons from "@heroicons/vue/24/outline"
const heroIcons:any = HeroIcons
// ---------------------------------------
import { OhVueIcon, addIcons } from "oh-vue-icons";
import * as Icons from "oh-vue-icons/icons";
import type {CustomizeIconType} from "oh-vue-icons/types/icons";
const AllIcons = <Array<CustomizeIconType>>Object.values({ ...Icons });
const ohIcons:any = new Set(AllIcons.map(icon=>icon?.name))
addIcons(...AllIcons);
// ---------------------------------------
const props = defineProps<IIcon>()
</script>

<template>
  <component v-if="heroIcons[convertToCamelCase(props.type)+'Icon']" :is="heroIcons[convertToCamelCase(props.type)+'Icon']" :class="[props.class||'h-5 w-5 text-gray-400 dark:text-gray-600']" :style="style" aria-hidden="true"/>
  <OhVueIcon v-else-if="ohIcons.has(convertToDashCase(props.type))" :name="convertToDashCase(props.type)" :class="[props.class||'h-5 w-5 font-light text-gray-400 dark:text-gray-600 select-none']" aria-hidden="true"/>
<!--  <span v-else :class="props.class" class="material-symbols-sharp h-5 w-5 font-light text-gray-400 dark:text-gray-600 select-none" aria-hidden="true">{{ convertToSnakeCase(props.type) }}</span>-->
</template>