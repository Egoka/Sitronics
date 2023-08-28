<template>
  <main class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-24">
      <h1 class="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-300">
        <slot name="title"></slot>
      </h1>
    </div>
    <section aria-labelledby="products-heading" class="pb-24 pt-6">
      <div class="w-full max-h-full bg-stone-100 dark:bg-stone-900 rounded mt-1 p-3">
        <div class="flex flex-col justify-center w-full bg-stone-50 dark:bg-stone-950 rounded m-auto py-10 px-4 xl:px-56">
          <slot></slot>
        </div>
      </div>
    </section>
  </main>
</template>