import 'util/countRem'
import Vue from 'vue'
import App from './app'
import router from './router'
import * as OfflinePluginRuntime from 'offline-plugin/runtime'
import "./validators"
import store from "./store/index"
import { VueHammer } from 'vue2-hammer'
import vuescroll from 'vue-scroll'

Vue.use(vuescroll)
Vue.use(VueHammer);

if (process.env.NODE_ENV === "production") {
    OfflinePluginRuntime.install();
}


new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: {App}
})