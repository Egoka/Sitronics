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
      const header = document.querySelector("header")?.offsetHeight || 0
      return {
        behavior: 'smooth',
        top: -header,
      }
    }
  },
})

export default router
