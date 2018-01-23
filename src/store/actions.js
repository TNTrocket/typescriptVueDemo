import apiCall from '../util/xhr'
import * as types from './mutation-types'



export const login = ({ commit }, payload) => {
  apiCall.post("/user/login",{...payload}).then((data) => {
    commit(types.LOGIN, {
        ...data
    })
  })
}

