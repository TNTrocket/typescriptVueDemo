import apiCall from '../util/xhr'
import * as types from './mutation-types'



export const login = ({ commit }, payload) => {
  return  apiCall.post("/user/login",{...payload}).then((data) => {
    commit(types.LOGIN, {
        ...data
    })
  })
}

export const changeIsNew = ({ commit }, payload) => {
    return commit(types.CHANGESTATUS, {...payload})

}