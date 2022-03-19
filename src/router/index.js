import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'simple-table',
        component: () => import('@/demo/table.vue')
    }
]

const router = new VueRouter({
    // mode: 'history',
    routes
})

export default router