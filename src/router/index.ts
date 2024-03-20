import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        layout: 'home'
      }
    },
    {
      path: '/components',
      name: 'components',
      meta: {
        layout: 'home'
      },
      component: () => import('../views/ComponentsView.vue')
    },
    {
      path: '/components/form',
      name: 'form',
      meta: {
        layout: 'home'
      },
      component: () => import('../views/components/ComponentForm.vue')
    },
    {
      path: '/components/input',
      name: 'input',
      meta: {
        layout: 'home'
      },
      component: () => import('../views/components/ComponentInput.vue')
    },
    {
      path: '/components/switch',
      name: 'switch',
      meta: {
        layout: 'home'
      },
      component: () => import('../views/components/ComponentSwitch.vue')
    },
    {
      path: '/components/select',
      name: 'select',
      meta: {
        layout: 'home'
      },
      component: () => import('../views/components/ComponentSelect.vue')
    },
    {
      path: '/components/calendar',
      name: 'calendar',
      meta: {
        layout: 'home'
      },
      component: () => import('../views/components/ComponentCalendar.vue')
    },
    {
      path: '/components/aria',
      name: 'aira',
      meta: {
        layout: 'home'
      },
      component: () => import('../views/components/ComponentAria.vue')
    },
    {
      path: '/components/text-editor',
      name: 'textEditor',
      meta: {
        layout: 'home'
      },
      component: () => import('../views/components/ComponentTextEditor.vue')
    },
    {
      path: '/components/buttons',
      name: 'buttons',
      meta: {
        layout: 'home'
      },
      component: () => import('../views/components/ComponentButtons.vue')
    },
    {
      path: '/components/table',
      name: 'table',
      meta: {
        layout: 'home'
      },
      component: () => import('../views/components/ComponentTable.vue')
    },
    {
      path: '/components/dialog',
      name: 'dialog',
      meta: {
        layout: 'home'
      },
      component: () => import('../views/components/ComponentDialog.vue')
    },
    {
      path: '/components/alert',
      name: 'alert',
      meta: {
        layout: 'home'
      },
      component: () => import('../views/components/ComponentAlert.vue')
    },
    {
      path: '/components/badge',
      name: 'badge',
      meta: {
        layout: 'home'
      },
      component: () => import('../views/components/ComponentBadge.vue')
    },
    {
      path: '/components/pagination',
      name: 'pagination',
      meta: {
        layout: 'home'
      },
      component: () => import('../views/components/ComponentPagination.vue')
    },
    {
      path: '/components/accordion',
      name: 'accordion',
      meta: {
        layout: 'home'
      },
      component: () => import('../views/components/ComponentAccordion.vue')
    },
    {
      path: '/components/menu',
      name: 'menu',
      meta: {
        layout: 'home'
      },
      component: () => import('../views/components/ComponentMenu.vue')
    },
    {
      path: '/components/split',
      name: 'split',
      meta: {
        layout: 'home'
      },
      component: () => import('../views/components/ComponentSplit.vue')
    },
    {
      path: '/components/all',
      name: 'componentsAll',
      meta: {
        layout: 'home'
      },
      component: () => import('../views/ComponentSlugView.vue')
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      const header = document.querySelector("header")?.offsetHeight ?? 0
      return {
        behavior: 'smooth',
        top: -header,
      }
    }
  },
})

export default router
