<script setup lang="ts">
import {onMounted, ref} from "vue";
import {convertToCamelCase, convertToDashCase, convertToSnakeCase} from "@/helpers/string";
import {cn} from "@/helpers/tailwind";

export interface IIcon {
  type: string
  class?: "h-5 w-5 text-gray-400 dark:text-gray-600"|string|Array<string|boolean>
  style?: string
}
const props = defineProps<IIcon>()
// ---------------------------------------
import * as HeroIcons from "@heroicons/vue/24/outline"
const heroIcons:any = HeroIcons
// ---------------------------------------
// import { OhVueIcon, addIcons } from "oh-vue-icons";
// import * as Icons from "oh-vue-icons/icons";
// import type {CustomizeIconType} from "oh-vue-icons/types/icons";
// const AllIcons = <Array<CustomizeIconType>>Object.values({ ...Icons });
// const ohIcons:any = new Set(AllIcons.map(icon=>icon?.name))
// addIcons(...AllIcons);
// ---------------------------------------
import {Icon, loadIcons} from '@iconify/vue';
const isViewIcon = ref(false)
function loadTestIcons(icons) {
  return new Promise((fulfill, reject) => {
    loadIcons(icons, (loaded, missing) => {
      if (missing.length) {
        reject({loaded, missing});
      } else {
        fulfill({
          loaded,
        });
      }
    });
  });
}
async function isIcon(iconName:string) {
  return loadTestIcons([iconName])
    .then((result)=>{
      return !!result.loaded?.length
    })
    .catch((err) => {
      console.error('Failed to load icons:', err.missing);
      return false
    })
}
onMounted(async ()=>{
  if (!heroIcons[convertToCamelCase(props.type)+'Icon']){
    isViewIcon.value = await isIcon(props.type)
  }
})
// ---------------------------------------
</script>

<template>
  <component
    v-if="heroIcons[convertToCamelCase(props.type)+'Icon']"
    :is="heroIcons[convertToCamelCase(props.type)+'Icon']"
    :class="cn(
      'h-5 w-5 text-gray-900 dark:text-gray-100',
      props.class,
      'select-none')"
    :style="style"
    aria-hidden="true"/>
  <Icon
    v-else-if="isViewIcon"
    :icon="props.type"
    :class="cn(
      'h-5 w-5 text-gray-900 dark:text-gray-100',
      props.class,
      'select-none')"
    aria-hidden="true"/>
</template>
<!--  <OhVueIcon v-else-if="ohIcons.has(convertToDashCase(props.type))" :name="convertToDashCase(props.type)" :class="[props.class||'h-5 w-5 font-light text-gray-400 dark:text-gray-600 select-none']" aria-hidden="true"/>-->
<!--  <span v-else :class="props.class" class="material-symbols-sharp h-5 w-5 font-light text-gray-400 dark:text-gray-600 select-none" aria-hidden="true">{{ convertToSnakeCase(props.type) }}</span>-->