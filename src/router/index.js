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
        component: () => import('screens/login/login')
    },
    {
        path: '/index',
        name: 'index',
        component: () => import('screens/index/index')
    },
    // {
    //     path: '/recite',
    //     name: 'recite',
    //     component: () => import('screens/recite/recite')
    // },
    // {
    //     path: '/result',
    //     name: 'result',
    //     component: () => import('screens/result/result')
    // },
    {
        path: '/practiced',
        name: 'practiced',
        component: () => import('screens/practiced/practiced')
    },
    // {
    //     path: '/practicedResult',
    //     name: 'practicedResult',
    //     component: () => import('screens/practicedResult/practicedResult')
    // },
    // {
    //     path: '/wrongTxt',
    //     name: 'wrongTxt',
    //     component: () => import('screens/wrongTxt/wrongTxt')
    // }, {
    //     path: '/wrongResult',
    //     name: 'wrongResult',
    //     component: () => import('screens/wrongResult/wrongResult')
    // }
];
router = new Router({
    routes
});
router.beforeEach((to, from, next) => {
    // if(to.name!=="login" && from.name!=="login"){
    //   if(!cache.get("token")){
    //       MessageBox({
    //           message:"会话过期",
    //           showConfirmButton: true,
    //           title:"",
    //           confirmButtonText:"确认",
    //           closeOnClickModal:false
    //       }).then(action => {
    //           if(action === "confirm"){
    //               next({path: '/login'});
    //           }
    //
    //       });
    //
    //       return
    //   }
    // }
    // document.title = to.meta.title;
    next()
});
export default router;
