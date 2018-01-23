import Vue from 'vue'
import Vuex from 'vuex'
import * as getters from './getters'
import * as actions from './actions'
import mutations from './mutations'
import createLogger from './logger'

Vue.use(Vuex)

const state = {
    user: {

    },
    messages: {

    }
}

export default new Vuex.Store({
    state,
    getters,
    actions,
    mutations,
    plugins: process.env.NODE_ENV !== 'production'
        ? [createLogger()]
        : []
})

