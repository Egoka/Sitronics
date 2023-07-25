<script setup lang="ts">
import Icons from "@/components/functional/Icons.vue";
import { ref } from 'vue'
import { Dialog, DialogPanel } from '@headlessui/vue'
import { Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline'
import Link from "@/components/functional/Link.vue";
import {useRoute} from "vue-router";
const baseUrl = useRoute().fullPath?.match(/\/(\w+)/)?.[1]|| ""

const navigation = [
  { name: 'components', href: '/components', title: "Компоненты" },
  // { name: 'Features', href: '#' },
  // { name: 'Marketplace', href: '#' },
  // { name: 'Company', href: '#' },
]
let isScroll = ref<boolean>(false)
document.addEventListener("scroll", () => { isScroll.value = window?.scrollY > 100 })
const mobileMenuOpen = ref(false)
</script>

<template>
  <header class="fixed inset-x-0 top-0 z-50">
    <nav class="flex items-center justify-between p-4 lg:px-8 transition-all" :class="[!isScroll||'bg-white/50 dark:bg-black/50 backdrop-blur-lg rounded']" aria-label="Global">
      <div class="flex lg:flex-1">
        <a href="/" class="-m-1.5 p-1.5">
          <span class="sr-only">Your Company</span>
          <Icons type="Sitronics" class="h-8 w-auto"/>
        </a>
      </div>
      <div class="flex lg:hidden">
        <button type="button" class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 dark:text-gray-500" @click="mobileMenuOpen = true">
          <span class="sr-only">Open main menu</span>
          <Bars3Icon class="h-6 w-6" aria-hidden="true" />
        </button>
      </div>
      <div class="hidden lg:flex lg:gap-x-12">
        <Link v-for="item in navigation" :key="item.title" :link="item.href" class="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-300" :class="[baseUrl !== item.name ||'router-link-active']">{{ item.title }}</Link>
      </div>
      <div class="hidden lg:flex lg:flex-1 lg:justify-end">
        <a href="#" class="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-300">Log in <span aria-hidden="true">&rarr;</span></a>
      </div>
    </nav>
    <Dialog as="div" class="lg:hidden" @close="mobileMenuOpen = false" :open="mobileMenuOpen">
      <div class="fixed inset-0 z-50" />
      <DialogPanel class="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white dark:bg-black px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
        <div class="flex items-center justify-between">
          <a href="#" class="-m-1.5 p-1.5">
            <span class="sr-only">Your Company</span>
            <Icons type="Sitronics" class="h-8 w-auto"/>
          </a>
          <button type="button" class="-m-2.5 rounded-md p-2.5 text-gray-700 dark:text-gray-300" @click="mobileMenuOpen = false">
            <span class="sr-only">Close menu</span>
            <XMarkIcon class="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div class="mt-6 flow-root">
          <div class="-my-6 divide-y divide-gray-500/10">
            <div class="space-y-2 py-6">
              <Link v-for="item in navigation" :key="item.name" :link="item.href" class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 dark:text-gray-300 hover:bg-gray-50 hover:dark:bg-gray-900">{{ item.name }}</Link>
            </div>
            <div class="py-6">
              <a href="#" class="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 dark:text-gray-300 hover:bg-gray-50 hover:dark:bg-gray-900">Log in</a>
            </div>
          </div>
        </div>
      </DialogPanel>
    </Dialog>
  </header>
</template>