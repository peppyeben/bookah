import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/tickets',
    name: 'tickets',
    component: () => import('../views/TicketsPage.vue')
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('../views/ProfilePage.vue'),
    children: [
      {
        path: '/profile/bought',
        name: 'bought',
        component: () => import('../components/BoughtTickets.vue'),
      },
      {
        path: '/profile/sold',
        name: 'sold',
        component: () => import('../components/SoldTickets.vue'),
      }
    ]
  },
  {
    path: '/:user',
    name: 'user',
    component: () => import('../views/UserTickets.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach(() => {
  if(document.querySelector("#navbarSupportedContent").classList.contains("show")) {
    document.querySelector("#navbarSupportedContent").classList.remove("show")
  }
})

export default router
