import Vue from 'vue'
import VueRouter from 'vue-router'
import Console from '@/views/console'
import Observable from '@/views/console/components/Observable'
import Operators from '@/views/console/components/Operators'
import Playground from '@/views/playground'
import Draggable from '@/views/playground/components/Draggable'
import Exception from '@/views/Exception'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/console'
  },
  {
    path: '/console',
    name: 'Console',
    component: Console,
    redirect: '/console/observable',
    children: [
      {
        path: '/console/observable',
        name: 'Observable',
        component: Observable
      },
      {
        path: '/console/operators',
        name: 'Operators',
        component: Operators
      }
    ]
  },
  {
    path: '/playground',
    name: 'Playground',
    component: Playground,
    redirect: '/playground/draggable',
    children: [
      {
        path: '/playground/draggable',
        name: 'Draggable',
        component: Draggable
      }
    ]
  },
  {
    path: '**',
    component: Exception
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
