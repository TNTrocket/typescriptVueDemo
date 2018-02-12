import 'util/countRem'
import Vue from 'vue'
import router from './router'
import * as OfflinePluginRuntime from 'offline-plugin/runtime'
import "./validators"
import store from "./store/index"
import vuescroll from 'vue-scroll/dist/vue-scroll.esm'
import Vue2Touch from 'vue2-touch'
import "babel-polyfill"
import App from  './app.vue';

Vue.use(Vue2Touch);
// console.log(vuescroll)
// Vue.use(vuescroll);

declare const process: {
    env: {
        NODE_ENV: string
    }
}

if (process.env.NODE_ENV === "production") {
    OfflinePluginRuntime.install();
}
interface LabelledValue {
    label: string;
}

function printLabel(labelledObj: LabelledValue) {
    console.log(labelledObj.label);
}

let myObj = {size: 10, label: "Size 10 Object"};
printLabel(myObj);

new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: {App}
})