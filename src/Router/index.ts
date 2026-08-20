import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ServicesView from '../views/ServicesView.vue'
import ContactView from '../views/ContactView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/engines',
      alias: ['/services', '/motores'], // Soporta ambas rutas
      name: 'engines',
      component: ServicesView
    },
    {
      path: '/contact',
      alias: ['/soporte'],
      name: 'contact',
      component: ContactView
    }
  ]
})

export default router