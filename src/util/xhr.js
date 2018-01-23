import axios from 'axios';
import {cache} from 'util/global'
import store from '../store/'

axios.defaults.baseURL = '/ntce-c';
axios.defaults.headers.common['Cache-Control'] = 'no-cache';
axios.defaults.headers.common['Pragma'] = 'no-cache';
let isShowIngError = false;
axios.interceptors.response.use(function ({data, config, status}) {
    // Do something with response data
    if (status === 200) {
        if (data.code === 10000) {
            return Promise.resolve(data.data);
        } else {
            if (config.ignoreErrorModal) {
                return Promise.reject(data);
            } else {
                return Promise.reject(data.msg);
            }
        }
    } else {
        return Promise.reject(data);
    }
}, function (error) {
    if (!isShowIngError) {
        isShowIngError = true;
    }
    if (error.response.status === 404) {
        error = 404
    }
    return Promise.reject(error);
});

export default {
    get(url, params = {}, config = {}) {
        let {state: { user }} = store;
        return axios({
            method: 'get',
            url,
            params,
            ignoreErrorModal: config.ignoreErrorModal || false,
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'token': user.token || cache.get("token")
            }
        })
    },
    post(url, data, config = {}) {
        let {state: { user }} = store;
        return axios({
            method: 'post',
            url: url,
            data: data,
            ignoreErrorModal: config.ignoreErrorModal || false,
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'token': user.token || cache.get("token")
            }
        })
    },
    upload(url, formData, config) {
        return axios.post(url, formData, config);
    }
}