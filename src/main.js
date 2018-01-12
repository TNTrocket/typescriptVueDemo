import Vue from 'vue'
import App from './app'
import router from './router'
import 'util/countRem'
// import 'mint-ui/lib/style.css'
import './common.less'

Vue.config.productionTip = false;
new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: { App }
})