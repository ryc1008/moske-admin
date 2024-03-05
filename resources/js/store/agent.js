import Vue from 'vue'
import Vuex from 'vuex'
import VueCookie from 'vue-cookie';
import {UserInfo} from "@/request/agent.js";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        active: '',//左侧菜单当前选中
        isCollapse: false, //左侧菜单是否折叠
        title: '',//页面标题/左侧菜单名称
        routers: [],//权限路由
        rules: [],//操作权限
        breadcrumb: [], //面包屑容器 65 30 109 15 33 35
        tableHeight: 'calc(100vh - 287px)',//表格固定高度
        user: null,//登录用户信息
        upload: '/api/upload/image/',//图片上传地址
        upload_file: '/api/upload/file/',//文件上传地址

    },
    mutations: {
        SET_STATE(state, param) {
            state = Object.assign(state, param);
        },
        USER_LOGIN(state, param) {
            VueCookie.set('agent:token', JSON.stringify(param.token), {expires: param.expires_in + 's'});
        },
        USER_LOGOUT() {
            VueCookie.delete('agent:token');
        },
    },
    actions: {
        setState({commit}, param) {
            commit('SET_STATE', param);
            // console.log(this.state.user.nickname);
        },
        //登陆
        userLogin({commit}, param) {
            return new Promise((resolve) => {
                commit('USER_LOGIN', param);
                resolve();
            });
        },
        //退出登录
        userLogout({commit}) {
            return new Promise((resolve) => {
                commit('USER_LOGOUT');
                resolve();
            });
        },
        generateRoutes({commit}) {
            //全部执行完再返回
            return new Promise(resolve => {
                UserInfo().then((res) => {
                    if(res.status == 0){
                        commit('SET_STATE', {user: res.data.user});
                        resolve();
                    }
                }).catch((e) => {
                    console.log(e);
                });
            });
        },
    }
})
