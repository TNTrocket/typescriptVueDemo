import Vue from 'vue'
import * as types from './mutation-types'
import {cache} from 'util/global'

export default {

  [types.LOGIN] (state, data) {
      Vue.set(state, "user", {
          ...data
      });
      cache.set("token",data.token);
      cache.set("isNew",data.isNew);
  },
    [types.CHANGESTATUS] (state, data) {
        let cacheIsNew = cache.get("isNew");
        let isNew = data.isNew || cacheIsNew;
        Vue.set(state.user, "isNew", isNew);
    }
}
