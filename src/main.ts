import 'util/countRem'
import Vue from 'vue'

import router from './router'
import * as OfflinePluginRuntime from 'offline-plugin/runtime'
import "./validators"
import store from "./store/index"
import vuescroll from 'vue-scroll'
import Vue2Touch from 'vue2-touch'
import "babel-polyfill"
let App = require("./app");
Vue.use(Vue2Touch);
// Vue.use(vuescroll);


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