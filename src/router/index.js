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
        meta: {
            title: '资讯详情'
        }
    },
    {
        path: '/shareNews',
        name: 'shareNews',
        component: () => import('screens/share/shareNews'),
        meta: {
            title: '分享'
        }
    },
    {
        path: '/shareQuestion',
        name: 'shareQuestion',
        component: () => import('screens/share/shareQuestion'),
        meta: {
            title: '分享'
        }
    },
    {
        path: '/protocol',
        name: 'protocol',
        component: () => import('screens/protocol/protocol'),
        meta: {
            title: '用户协议'
        }
    },
    {
        path: '/download',
        name: 'download',
        component: () => import('screens/download/download'),
        meta: {
            title: '下载'
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
