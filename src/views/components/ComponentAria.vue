<script setup lang="ts">
import ComponentViews from "@/components/ComponentViews.vue";
import StAria from "@/components/form/StAria.vue";
import {ref} from "vue";
const aria = ref("This information will be displayed publicly so be careful what you share.")
</script>

<template>
  <ComponentViews>
    <template #title>Aria</template>
    <StAria v-model="aria" label="About" mode="underlined" clear help="Write a few sentences about yourself."/>
    <div class="col-span-full">
      <label for="about" class="block text-sm font-medium leading-6 text-gray-900">About</label>
      <div class="mt-2">
        <textarea id="about" name="about" rows="3" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
      </div>
      <p class="mt-3 text-sm leading-6 text-gray-600">Write a few sentences about yourself.</p>
    </div>
  </ComponentViews>
</template>

<style scoped>

</style>