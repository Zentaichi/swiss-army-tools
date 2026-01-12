import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/Home.vue')
    },
    {
      path: '/gamepad',
      name: 'gamepad',
      component: () => import('../views/tools/GamepadTester.vue')
    },
    {
      path: '/keyboard',
      name: 'keyboard',
      component: () => import('../views/tools/KeyboardTester.vue')
    },
    {
      path: '/microphone',
      name: 'microphone',
      component: () => import('../views/tools/MicrophoneTester.vue')
    },
    {
      path: '/interest-calculator',
      name: 'interest',
      component: () => import('../views/tools/InterestCalculator.vue')
    },
    {
      path: '/unit-converter',
      name: 'converter',
      component: () => import('../views/tools/UnitConverter.vue')
    },
    {
      path: '/color-converter',
      name: 'color',
      component: () => import('../views/tools/ColorConverter.vue')
    },
    {
      path: '/text-tools',
      name: 'text',
      component: () => import('../views/tools/TextTools.vue')
    },
    {
      path: '/json-formatter',
      name: 'json',
      component: () => import('../views/tools/JsonFormatter.vue')
    },
    {
      path: '/timezone-converter',
      name: 'timezone',
      component: () => import('../views/tools/TimezoneConverter.vue')
    },
    {
      path: '/date-calculator',
      name: 'date',
      component: () => import('../views/tools/DateCalculator.vue')
    },
    {
      path: '/regex-tester',
      name: 'regex',
      component: () => import('../views/tools/RegexTester.vue')
    }
  ]
})

export default router