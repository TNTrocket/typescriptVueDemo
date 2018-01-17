import Vue from 'vue'
import Router from 'vue-router'


let routes, router;
Vue.use(Router);


routes = [
    {
        path: '/login',
        name: 'login',
        component: () => import('screens/login/index'),
        meta: {
            title: '资讯详情'
        }
    }
];
router = new Router({
    routes
});
router.beforeEach((to, from, next) => {
    document.title = to.meta.title;
    next()
});
export default router;
