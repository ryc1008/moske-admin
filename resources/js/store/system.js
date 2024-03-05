import Vue from 'vue'
import Vuex from 'vuex'
import VueCookie from 'vue-cookie';
import {constantRouterMap, asyncRouterMap} from '@/router/system.js';
import {ManagerUser} from '@/request/system.js';

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
            VueCookie.set('admin:token', JSON.stringify(param.token), {expires: param.expires_in + 's'});
        },
        USER_LOGOUT() {
            VueCookie.delete('admin:token');
        },
    },
    actions: {
        setState({commit}, param) {
            commit('SET_STATE', param);
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
                ManagerUser().then((res) => {
                    if(res.status == 0){
                        let user = res.data.user;
                        let rules = res.data.user.role.rules;
                        let accessedRouters = asyncRouterMap.filter((r) => {
                            if(user.role_id == 1){
                                return true;
                            }
                            if(r.children){
                                return r.children = r.children.filter((v) => {
                                    return rules.includes(v.meta.auth);
                                });
                            }
                            return true;
                        });
                        commit('SET_STATE', {routers: accessedRouters, rules: rules, user: user});
                        resolve();
                    }
                }).catch((e) => {
                    console.log(e);
                });
            });
        },
    }
})
