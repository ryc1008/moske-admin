import Vue from 'vue'
import axios from 'axios';
import VueAxios from 'vue-axios';
import Qs from 'qs';
import VueCookie from "vue-cookie";
import {Notification} from 'element-ui';
import router from '@/router/agent.js';
import store from '@/store/agent.js';

Vue.use(VueAxios, axios);

axios.interceptors.request.use(function (config) {
    config.headers['Accept'] = 'application/json';
    const token = JSON.parse(VueCookie.get('agent:token'));
    if(token){
        config.headers['Authorization'] = 'Bearer ' + token;
    }
    return config;
}, function (error) {
    return Promise.reject(error);
});


axios.interceptors.response.use(function (response) {
    return response.data;
}, function (error) {
    switch(error.response.status){
        case 401:
            store.dispatch('userLogout').then(() => {
                Notification.error({
                    title: '错误',
                    duration: '1500',
                    message: '登录信息已过期，正在退出...',
                    onClose: () => {
                        return router.push({name: 'login'});
                    }
                });
            });
            break;
        default:
            Notification.error({
                title: '错误',
                duration: '1500',
                message: error.response.data.message + '，网络状态：' + error.response.status,
            });
            break;
    }
});


let agentApi = '/agent';

export const LoginSubmit = params => { return axios.post(`${agentApi}/login`, Qs.stringify(params)).then(res => res)};
export const UserAuthorize = params => { return axios.post(`${agentApi}/authorize`, Qs.stringify(params)).then(res => res)};
export const UserInfo = params => { return axios.get(`${agentApi}/user`, {params:params}).then(res => res)};
export const UserUpdate = params => { return axios.post(`${agentApi}/user/update`, Qs.stringify(params)).then(res => res)};
export const UserPassword = params => { return axios.post(`${agentApi}/user/password`, Qs.stringify(params)).then(res => res)};

















































