import Vue from 'vue'
import App from './app'
import router from './router'
import 'util/countRem'
import * as OfflinePluginRuntime from 'offline-plugin/runtime';

if(process.env.NODE_ENV==="production"){
    OfflinePluginRuntime.install();
}

new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: { App }
})