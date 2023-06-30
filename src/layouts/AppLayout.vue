<template>
  <component :is="layout" :key="layout">
    <slot />
  </component>
</template>

<script>
import { markRaw } from "vue";
import LayoutDefault from './Default.vue'
import LayoutHome from './Home.vue'

export default {
  name: "AppLayout",
  data: () => ({
    layout: LayoutDefault,
    layoutList: {
      default: markRaw(LayoutDefault),
      home: markRaw(LayoutHome),
    }
  }),
  watch: {
    "$route": {
      immediate: true,
      async handler(route) {
        try {
          this.layout = this.layoutList[route.meta.layout]||LayoutDefault
        } catch (e) {
          this.layout = LayoutDefault
        }
      }
    }
  }
}
</script>