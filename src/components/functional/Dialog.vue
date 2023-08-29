<script setup lang="ts">
import {computed, ref} from "vue";
import {Dialog, DialogPanel, TransitionChild, TransitionRoot} from "@headlessui/vue";
import Button from "@/components/functional/Button.vue";

// ---------------------------------------
export interface IDialog {
  modelValue: boolean
  class?: string
  position?: "top"|"bottom"|"left"|"right"|"center"
}
// ---------------------------------------
const props = defineProps<IDialog>()
const emit = defineEmits<{
  (event: 'update:modelValue', payload: boolean): void;
}>();
// ---------------------------------------
const isOpen = computed<boolean>(()=>props.modelValue||false)
// ---------------------------------------
const classDialog = computed<Array<string>>(()=> {
  const arrayDialog = !!props.class
    ? Array.isArray(props.class)
      ? (props.class as Array<string>).flat().map(item=>item.split(" ")).flat()
      : (props.class as string)?.split(" ")
    : [];
  [{reg: "^w-", class: "w-full"},
    {reg: "^max-w-", class: "max-w-md"},
    {reg: "rounded-", class: "rounded-2xl"},
    {reg: "bg-", class: "bg-neutral-100 dark:bg-neutral-950"},
    {reg: "^p-", class: "p-6"},
    {reg: "^text-", class: "text-left"},
    {reg: "^shadow-", class: "shadow-lg"},
    {reg: "^border-", class: "border-2 border-primary-300 dark:border-primary-800"},
  ].map((item:{reg: string, class: string})=>{
    if(!arrayDialog?.some(classItem=>classItem.match(new RegExp(item.reg)))){
      arrayDialog.push(item.class)
    }
  })
  arrayDialog.push("transform overflow-hidden align-middle transition-all")
  return arrayDialog
})
// ---------------------------------------
function closeModal() {
  emit('update:modelValue', false)
}
</script>

<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="closeModal" class="relative z-50">
      <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100" leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
        <slot name="background">
          <div class="fixed inset-0 bg-white dark:bg-black bg-opacity-60 dark:bg-opacity-60" />
        </slot>
      </TransitionChild>
      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95" enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100" leave-to="opacity-0 scale-95">
            <DialogPanel :class="classDialog">
              <slot :closeDialog="closeModal"></slot>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>