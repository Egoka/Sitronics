<script setup lang="ts">
import Button from "@/components/functional/Button.vue";
</script>

<template>
  <div class="relative isolate px-6 pt-14 lg:px-8">
    <div class="fixed animate-[customAniLeft_30s_infinite] inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
      <div class="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-theme-500 to-theme-900 opacity-50 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"></div>
    </div>
    <div class="fixed animate-[customAniLeft_38s_infinite] inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
      <div class="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-theme-500 to-theme-900 opacity-50 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"></div>
    </div>
    <div class="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
      <div class="text-center mt-20">
        <h1 class="font-extrabold text-6xl tracking-tight text-gray-900 sm:text-6xl bg-clip-text text-transparent bg-gradient-to-tr from-theme-300 to-theme-900 dark:from-theme-900 dark:to-theme-300"
            style="font-family: 'Istok Web', sans-serif;">
          Разработка для Sitronic
        </h1>
        <p class="mt-6 text-lg leading-8 text-gray-500">Демонстрация готовых компонентов с примерами их работы</p>
        <div class="mt-10 flex items-center justify-center gap-x-6">
          <Button link="/components" mode="primary" color="theme">
            Попробовать
          </Button>
          <Button type="link" link="/components" mode="ghost" >
            Узнать больше<span aria-hidden="true" class="ml-1">→</span>
          </Button>
        </div>
      </div>
    </div>
    <div class="fixed animate-[customAniLeft_35s_infinite] inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]" aria-hidden="true">
      <div class="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-theme-500 to-theme-900 opacity-50 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"></div>
    </div>
    <div class="fixed animate-[customAniLeft_27s_infinite] inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]" aria-hidden="true">
      <div class="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-theme-500 to-theme-900 opacity-50 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"></div>
    </div>
  </div>
</template>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Istok+Web:wght@700&display=swap');
</style>
<style>
@keyframes customAniLeft {
  0% {
    transform: rotate(0);
    transform-origin: left;
  }
  100% {
    transform: rotate(360deg);
    transform-origin: right;
  }
}
@keyframes customAniLeft {
  0% {
    transform: rotate(0);
    transform-origin: right;
  }
  100% {
    transform: rotate(360deg);
    transform-origin: left;
  }
}
</style>