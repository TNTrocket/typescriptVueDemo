import Vue from 'vue'
import Router from 'vue-router'
import {cache} from 'util/global'
import {MessageBox} from 'mint-ui';


let routes, router;
Vue.use(Router);


routes = [

    {
        path: '/',
        redirect: to => {
            // const {hash, params, query} = to
          if(cache.get("token")){
              return { path: '/index' }

          }else{
              return { path: '/login' }
          }
        }
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('screens/login/index')
    },
    {
        path: '/index',
        name: 'index',
        component: () => import('screens/index/index')
    },
    {
        path: '/recite',
        name: 'recite',
        component: () => import('screens/recite/index')
    },
    {
        path: '/result',
        name: 'result',
        component: () => import('screens/result/index')
    },
    {
        path: '/practiced',
        name: 'practiced',
        component: () => import('screens/practiced/index')
    },
    {
        path: '/practicedResult',
        name: 'practicedResult',
        component: () => import('screens/moduleResult/moduleResult')
    },
    {
        path: '/wrongTxt',
        name: 'wrongTxt',
        component: () => import('screens/wrongTxt/wrongTxt')
    }, {
        path: '/wrongResult',
        name: 'wrongResult',
        component: () => import('screens/wrongResult/wrongResult')
    }
];
router = new Router({
    routes
});
router.beforeEach((to, from, next) => {
    if(to.name!=="login" && from.name!=="login"){
      if(!cache.get("token")){
          MessageBox.alert('会话过期').then(action => {
              next({path: '/login'});
          });

          return
      }
    }
    // document.title = to.meta.title;
    next()
});
export default router;
