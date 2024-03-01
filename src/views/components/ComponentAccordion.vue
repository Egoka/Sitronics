<script setup lang="ts">
import ComponentViews from "@/components/ComponentViews.vue";
import {ref} from "vue";
import Accordion from "@/components/functional/Accordion.vue";
import type {IAccordion} from "@/components/functional/Accordion";
import Button from "@/components/functional/Button.vue";
const dataSource = ref<NonNullable<IAccordion["dataSource"]>>([
  {
    title: "What is your return policy?",
    subtitle: "You can return any items within 30 days of purchase.",
    open: false,
  },
  {
    title: "Do you offer customer support?",
    subtitle: "Yes, we offer 24/7 customer support.",
    open: false,
  },
  {
    title: "How can I track my order?",
    subtitle: "You can track your order using the tracking number provided in your confirmation email.",
    open: false,
  },
  {
    title: "Do you offer international shipping?",
    subtitle: "Yes, we ship worldwide.",
    open: false,
    template: "test",
    img: "https://images.unsplash.com/photo-1707343843982-f8275f3994c5?q=80&w=3864&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  {
    title: "How can I change my order?",
    subtitle: `Please contact our customer service to change your order. <div class="w-full max-w-6xl mx-auto mt-5 px-4 md:px-6 py-24 bg-slate-900 rounded-3xl">
      <!-- Cards Hover Effect -->
      <section class="grid md:grid-cols-3 gap-6 max-md:max-w-xs mx-auto">
        <!-- Card #1 -->
        <div class="group [background:linear-gradient(theme(colors.slate.900),theme(colors.slate.900))_padding-box,linear-gradient(45deg,theme(colors.slate.800),theme(colors.slate.600/.8),theme(colors.slate.800))_border-box] relative before:absolute before:inset-0 before:bg-[url('https://cruip-tutorials.vercel.app/cards-hover-effect/noise.png')] before:bg-[length:352px_382px] rounded-2xl border border-transparent">
          <div class="relative">
            <div class="px-6 py-5">
              <div class="font-nycd text-lg text-indigo-500 mb-1">Label</div>
              <div class="text-lg font-bold text-slate-200 mb-1">Daily Reports</div>
              <p class="text-sm text-slate-500">Building truly great products is both art and science. It's part intuition and part data.</p>
            </div>
            <div class="relative group-hover:-translate-y-1 transition-transform duration-500 ease-in-out">
              <img class="group-hover:opacity-0 transition-opacity duration-500" src="https://cruip-tutorials.vercel.app/cards-hover-effect/card-01.png" width="350" height="240" alt="Card image 01">
              <img class="absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" src="https://cruip-tutorials.vercel.app/cards-hover-effect/card-01-hover.png" width="350" height="240" alt="Card image 01 displaying on hover" aria-hidden="true">
            </div>
          </div>
        </div>
        <!-- Card #2 -->
        <div class="group [background:linear-gradient(theme(colors.slate.900),theme(colors.slate.900))_padding-box,linear-gradient(45deg,theme(colors.slate.800),theme(colors.slate.600/.8),theme(colors.slate.800))_border-box] relative before:absolute before:inset-0 before:bg-[url('https://cruip-tutorials.vercel.app/cards-hover-effect/noise.png')] before:bg-[length:352px_382px] rounded-2xl border border-transparent">
          <div class="relative">
            <div class="px-6 py-5">
              <div class="font-nycd text-lg text-indigo-500 mb-1">Label</div>
              <div class="text-lg font-bold text-slate-200 mb-1">Advanced Security</div>
              <p class="text-sm text-slate-500">Building truly great products is both art and science. It's part intuition and part data.</p>
            </div>
            <div class="relative group-hover:-translate-y-1 transition-transform duration-500 ease-in-out">
              <img class="group-hover:opacity-0 transition-opacity duration-500" src="https://cruip-tutorials.vercel.app/cards-hover-effect/card-02.png" width="350" height="240" alt="Card image 02">
              <img class="absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" src="https://cruip-tutorials.vercel.app/cards-hover-effect/card-02-hover.png" width="350" height="240" alt="Card image 02 displaying on hover" aria-hidden="true">
            </div>
          </div>
        </div>
        <!-- Card #3 -->
        <div class="group [background:linear-gradient(theme(colors.slate.900),theme(colors.slate.900))_padding-box,linear-gradient(45deg,theme(colors.slate.800),theme(colors.slate.600/.8),theme(colors.slate.800))_border-box] relative before:absolute before:inset-0 before:bg-[url('https://cruip-tutorials.vercel.app/cards-hover-effect/noise.png')] before:bg-[length:352px_382px] rounded-2xl border border-transparent">
          <div class="relative">
            <div class="px-6 py-5">
              <div class="font-nycd text-lg text-indigo-500 mb-1">Label</div>
              <div class="text-lg font-bold text-slate-200 mb-1">Powerful Analytics</div>
              <p class="text-sm text-slate-500">Building truly great products is both art and science. It's part intuition and part data.</p>
            </div>
            <div class="relative group-hover:-translate-y-1 transition-transform duration-500 ease-in-out">
              <img class="group-hover:opacity-0 transition-opacity duration-500" src="https://cruip-tutorials.vercel.app/cards-hover-effect/card-03.png" width="350" height="240" alt="Card image 03">
              <img class="absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" src="https://cruip-tutorials.vercel.app/cards-hover-effect/card-03-hover.png" width="350" height="240" alt="Card image 03 displaying on hover" aria-hidden="true">
            </div>
          </div>
        </div>
      </section>
      <!-- End: Cards Hover Effect -->
    
    </div>`,
    open: false,
  },
])
</script>

<template>
  <ComponentViews>
    <template #title>Accordion</template>
    <div class="border-b border-theme-700/50 dark:border-theme-500/50 pb-0 mt-10">
      <h2 class="ml-5 text-xl font-semibold leading-7 text-theme-600 dark:text-theme-500">Menu</h2>
      <p class="my-4 text-sm leading-6 text-gray-600 dark:text-gray-400">
        Интерфейс IAccordion используется для определения структуры и поведения компонента аккордеона в программном приложении. Вот краткое описание его ключевых компонентов:
        
        <ul class="list-disc ml-4">
          <li>IAccordionItem:
            <ul class="list-disc ml-4">
              <li>Этот тип представляет отдельный элемент в аккордеоне.</li>
              <li>Включает следующие свойства:</li>
              <ul class="list-disc ml-4">
                <li>title: строка, представляющая заголовок элемента аккордеона.</li>
                <li>subtitle: необязательная строка, предоставляющая дополнительную информацию об элементе.</li>
                <li>open: необязательное булево значение, указывающее, открыт ли элемент изначально.</li>
                <li>template: необязательная строка, определяющая шаблон для элемента.</li>
              </ul>
            </ul>
          </li>
          <li>IAccordionStylesClass:
            <ul class="list-disc ml-4">
              <li>Этот интерфейс определяет классы стилей для различных частей аккордеона.</li>
              <li>Включает следующие свойства:</li>
              <ul class="list-disc ml-4">
                <li>body: StyleClass для тела аккордеона.</li>
                <li>item: StyleClass для отдельных элементов в аккордеоне.</li>
                <li>title: StyleClass для заголовка элемента аккордеона.</li>
                <li>subtitle: StyleClass для подзаголовка элемента аккордеона.</li>
              </ul>
            </ul>
          </li>
          <li>IAccordion:
            <ul class="list-disc ml-4">
              <li>Этот интерфейс представляет общую конфигурацию компонента аккордеона.</li>
              <li>Включает следующие свойства:</li>
              <ul class="list-disc ml-4">
                <li>dataSource: Массив IAccordionItem или обобщенная запись, служащая в качестве источника данных для аккордеона.</li>
                <li>multiple: Булево значение, указывающее, может ли быть открыто несколько элементов одновременно.</li>
                <li>animationDuration: Число, представляющее продолжительность анимации открытия и закрытия элементов аккордеона.</li>
                <li>typeIcon: Строка, определяющая тип иконки для аккордеона (например, "ChevronDown", "ArrowDownCircle", "Plus").</li>
                <li>class: StyleClass для общего компонента аккордеона.</li>
                <li>styles: Экземпляр IAccordionStylesClass, определяющий конкретные стили для различных частей аккордеона.</li>
              </ul>
            </ul>
          </li>
        </ul>
      </p>
    </div>
    <div class="border-b border-theme-700/50 dark:border-theme-500/50 pb-0 mt-10">
      <h2 class="ml-5 text-xl font-semibold leading-7 text-theme-600 dark:text-theme-500">Базовое использование</h2>
      <!--      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">-->
      <!--        <p></p>-->
      <!--      </p>-->
      <div class="grid transition grid-cols-1 gap-x-6 gap-y-0 sm:grid-cols-6">
        <div class="col-span-full my-5">
          <div>
            <Button @click="dataSource.forEach((item)=>item.open = true)">Открыть все</Button>
            <Button @click="dataSource.forEach((item)=>item.open = false)">Закрыть все</Button>
          </div>
          <Accordion :data-source="dataSource" type-icon="ChevronDown">
            <template #test="{subtitle, img}">
              <div>
                {{subtitle}}
                <div class="m-5">
                  <img :src="img" alt="" class="rounded">
                </div>
              </div>
            </template>
          </Accordion>
        </div>
      </div>
    </div>
    
  </ComponentViews>
</template>

<style scoped>

</style>