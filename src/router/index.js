import { createRouter,createWebHistory} from 'vue-router'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import Error from '@/views/Error.vue'
import Main from '@/views/Main.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/',redirect: '/login'},
        { path: '/login', component: Login},
        { path: '/register', component: Register},
        { path: '/main', component: Main},
        { path: '/error/:msg', component: Error},
        { path: '/:pathMatch(.*)*', redirect: '/404'},
        { path: '/404', redirect: '/error/msg=404'},
    ]
})
export default router;