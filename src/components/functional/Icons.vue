<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import {convertToCamelCase} from "@/helpers/string";
import {cn} from "@/helpers/tailwind";
const props = defineProps<IIcon>()
const classIcon = computed(()=>cn('h-5 w-5 text-gray-900 dark:text-gray-100',props.class,'select-none'))
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
// https://icon-sets.iconify.design/
import {Icon, type IconifyIconName, loadIcons} from '@iconify/vue';
import type {IIcon} from "@/components/functional/Icons";
const isViewIcon = ref(false)
function loadTestIcons(icons: (IconifyIconName | string)[]) {
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
    .then((result:any)=>{
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
  <component v-if="heroIcons[convertToCamelCase(props.type)+'Icon']" :is="heroIcons[convertToCamelCase(props.type)+'Icon']" :class="classIcon" :style="props.style" aria-hidden="true"/>
  <Icon v-else-if="isViewIcon" :icon="props.type" :class="classIcon" :style="props.style" aria-hidden="true"/>
</template>