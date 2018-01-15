import Vue from 'vue'
import Router from 'vue-router'
// import news from 'screens/news/news'
// import shareNews from 'screens/share/shareNews'
// import shareQuestion from 'screens/share/shareQuestion'
// import protocol from 'screens/protocol/protocol'


let routes, router;
Vue.use(Router);


routes = [
    {
        path: '/news',
        name: 'news',
        component: () => import('screens/news/news'),
        // meta: {
        //     title: '尚德机构商城'
        // }
    },
    {
        path: '/shareNews',
        name: 'shareNews',
        component: () => import('screens/share/shareNews')
    },
    {
        path: '/shareQuestion',
        name: 'shareQuestion',
        component: () => import('screens/share/shareQuestion')
    },
    {
        path: '/protocol',
        name: 'protocol',
        component: () => import('screens/protocol/protocol')
    }
];
router = new Router({
    routes
});
router.beforeEach((to, from, next) => {
    // document.title = to.meta.title;
    next()
});
export default router;
