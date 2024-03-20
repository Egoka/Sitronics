<script setup lang="ts">

import ComponentViews from "@/components/ComponentViews.vue";
import Split from "@/components/functional/Split.vue";

</script>

<template>
  <ComponentViews>
    <template #title>Split</template>
    
    <div class="preview flex min-h-[250px] w-full justify-center p-10 items-center h-[5rem]">
      <Split :panels="[{name:'t3'}, {name:'t2'}, {name:'t1'}]" units="pixels" direction="vertical" class="border  dark:border-gray-800">
        <template #t3>
          <div class="flex items-center justify-center p-6 w-full h-full">
            <span class="font-semibold">Three</span>
          </div>
        </template>
        <template #t2>
          <div class="flex items-center justify-center p-6">
            <span class="font-semibold">Two</span>
          </div>
        </template>
        <template #t1>
          <div class="flex items-center justify-center p-6">
            <span class="font-semibold">One</span>
          </div>
        </template>
      </Split>
    </div>
    <div class="preview flex min-h-[250px] w-full justify-center p-10 items-center h-[5rem]">
      <Split :panels="[{name:'t1', size: 100}, {name:'t2', size: 100}, {name:'t3',size: 100}, {name:'t4', size: 100}, {name:'t5', size: 100}]" units="pixels" direction="horizontal" class="rounded-lg border dark:border-gray-800">
        <template #t1>
          <div class="flex items-center justify-center p-6 h-full">
            <span class="font-semibold">One</span>
          </div>
        </template>
        <template #t2>
          <Split :panels="[{name:'t3'}, {name:'t2'}, {name:'t1'}]" units="pixels" direction="vertical">
            <template #t3>
              <div class="flex items-center justify-center p-6 w-full h-full">
                <span class="font-semibold">Three</span>
              </div>
            </template>
            <template #t2>
              <div class="flex items-center justify-center p-6">
                <span class="font-semibold">Two</span>
              </div>
            </template>
            <template #t1>
              <div class="flex items-center justify-center p-6">
                <span class="font-semibold">One</span>
              </div>
            </template>
          </Split>
        </template>
        <template #t3>
          <div class="flex items-center justify-center p-6 h-full">
            <span class="font-semibold">Three</span>
          </div>
        </template>
        <template #t4>
          <div class="flex items-center justify-center p-6 h-full">
            <span class="font-semibold">Fore</span>
          </div>
        </template>
        <template #t5>
          <div class="flex items-center justify-center p-6 h-full">
            <span class="font-semibold">Five</span>
          </div>
        </template>
      </Split>
    </div>
    <div class="preview flex min-h-[250px] w-full justify-center p-10 items-center h-[5rem]">
      <Split :panels="[{name: 'right'}, {name: 'left'}]" class="relative rounded-lg border dark:border-gray-800">
        <template #right>
          <div class="relative overflow-hidden bg-amber-500 w-full h-full flex justify-center items-center">
            <img class="absolute left-0 max-w-[448px]"  src="@/assets/pramod-tiwari-16-unsplash.jpg" alt=""/>
          </div>
        </template>
        <template #left>
          <div class="relative overflow-hidden bg-amber-500 w-full h-full flex justify-center items-center">
            <img class="absolute right-0 max-w-[448px]" src="@/assets/pramod-tiwari-17-unsplash.jpg" alt=""/>
          </div>
        </template>
      </Split>
    </div>
  </ComponentViews>
</template>

<style scoped>

</style>