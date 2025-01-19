import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import Error from '@/views/Error.vue'
import Main from '@/views/Main.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', redirect: '/login' },
        { path: '/login', component: Login },
        { path: '/register', component: Register },
        { path: '/main', component: Main },
        { path: '/error/:msg', component: Error },
        { path: '/:pathMatch(.*)*', redirect: '/404' },
        { path: '/404', redirect: '/error/msg=404' },
    ]
})
// 将后端改为java并配置JWT之后再开启前端全局守卫
// 全局前置守卫
// router.beforeEach((to, from, next) => {
//     const userInfo = sessionStorage.getItem('user_info');
//     console.log('beforeEach: ', userInfo)
//     if (to.path === '/' || to.path === '/login' || to.path === '/register' || userInfo) {
//         next();
//     } else {
//         next('/'); // 继续导航
//     }
// });

export default router;