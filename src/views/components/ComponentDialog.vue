<script setup lang="ts">
import {ref} from "vue";
import Dialog from "@/components/functional/Dialog.vue";
import ComponentViews from "@/components/ComponentViews.vue";
import Button from "@/components/functional/Button.vue";

const isOpen1 = ref(false)
const isOpen2 = ref(false)
const isOpen3 = ref(false)
const isOpen4 = ref(false)
</script>

<template>
  <ComponentViews>
    <template #title>Dialog</template>
    <div class="flex mx-auto">
      <Button class="mx-2" @click="isOpen1 = true">Open dialog 1</Button>
      <Button class="mx-2" @click="isOpen2 = true">Open dialog 2</Button>
    </div>
    <Dialog v-model="isOpen1">
      <template #default="{closeDialog}">
        <h3 class="text-lg font-medium leading-6 text-gray-900 dark:text-gray-200">
          Payment successful
        </h3>
        <div class="my-2">
          <p class="text-sm text-gray-500">
            Your payment has been successfully submitted. We’ve sent you
            an email with all of the details of your order.
          </p>
        </div>
        <Button class="mt-5 mx-2" mode="destructive" @click="closeDialog">Close dialog</Button>
      </template>
    </Dialog>
    <Dialog v-model="isOpen2">
      <template #default="{closeDialog}">
        
        <Button class="mt-5 mx-2" mode="destructive" @click="closeDialog">Close dialog</Button>
      </template>
    </Dialog>
  </ComponentViews>
</template>

<style scoped>

</style>