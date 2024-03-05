import Vue from 'vue'
import axios from 'axios';
import VueAxios from 'vue-axios';
import Qs from 'qs';
import VueCookie from "vue-cookie";
import {Notification} from 'element-ui';
import router from '@/router/system.js';
import store from '@/store/system.js';

Vue.use(VueAxios, axios);

axios.interceptors.request.use(function (config) {
    config.headers['Accept'] = 'application/json';
    const token = JSON.parse(VueCookie.get('admin:token'));
    if(token){
        config.headers['Authorization'] = 'Bearer ' + token;
    }
    return config;
}, function (error) {
    return Promise.reject(error);
});


axios.interceptors.response.use((response) => {
    return response.data;
}, (error) => {
    switch(error.response.status){
        case 401:
            store.dispatch('userLogout').then(() => {
                Notification.error({
                    title: '错误',
                    duration: '1500',
                    message: '登录信息已过期，正在退出...',
                    onClose: () => {
                        return router.push({name: 'admin_login'});
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


let adminApi = '/admin';



//注册登录
export const LoginSubmit = params => { return axios.post(`${adminApi}/login`, Qs.stringify(params)).then(res => res)};
//主页统计
export const Main = params => { return axios.get(`${base}/main`, params).then(res => res)};
export const MainMonthAssay = params => { return axios.get(`${adminApi}/main/month`, {params:params}).then(res => res)};
export const MainUserAssay = params => { return axios.get(`${adminApi}/main/user`, {params:params}).then(res => res)};
export const MainCountAssay = params => { return axios.get(`${adminApi}/main/count`, {params:params}).then(res => res)};
//系统设置
export const SettingConfig = params => { return axios.get(`${adminApi}/setting/config`, {params:params}).then(res => res)};
export const SettingList = params => { return axios.get(`${adminApi}/setting/list`, {params:params}).then(res => res)};
export const SettingUpdate = params => { return axios.post(`${adminApi}/setting/update`, Qs.stringify(params)).then(res => res)};
export const SettingSave = params => { return axios.post(`${adminApi}/setting/save`, Qs.stringify(params)).then(res => res)};
export const SettingDestroy = params => { return axios.post(`${adminApi}/setting/destroy`, Qs.stringify(params)).then(res => res)};
//类目管理
export const TypeList = params => { return axios.get(`${adminApi}/type/list`, {params:params}).then(res => res)};
export const TypeTree = params => { return axios.get(`${adminApi}/type/tree`, {params:params}).then(res => res)};
export const TypeConfig = params => { return axios.get(`${adminApi}/type/config`, {params:params}).then(res => res)};
export const TypeUpdate = params => { return axios.post(`${adminApi}/type/update`, Qs.stringify(params)).then(res => res)};
export const TypeLock = params => { return axios.post(`${adminApi}/type/lock`, Qs.stringify(params)).then(res => res)};
export const TypeActive = params => { return axios.post(`${adminApi}/type/active`, Qs.stringify(params)).then(res => res)};
export const TypeDestroy = params => { return axios.post(`${adminApi}/type/destroy`, Qs.stringify(params)).then(res => res)};
//标签管理
export const TagList = params => { return axios.get(`${adminApi}/tag/list`, {params:params}).then(res => res)};
export const TagUpdate = params => { return axios.post(`${adminApi}/tag/update`, Qs.stringify(params)).then(res => res)};
export const TagDestroy = params => { return axios.post(`${adminApi}/tag/destroy`, Qs.stringify(params)).then(res => res)};
//广告管理
export const AdvertList = params => { return axios.get(`${adminApi}/advert/list`, {params:params}).then(res => res)};
export const AdvertConfig = params => { return axios.get(`${adminApi}/advert/config`, {params:params}).then(res => res)};
export const AdvertUpdate = params => { return axios.post(`${adminApi}/advert/update`, Qs.stringify(params)).then(res => res)};
export const AdvertLock = params => { return axios.post(`${adminApi}/advert/lock`, Qs.stringify(params)).then(res => res)};
export const AdvertActive = params => { return axios.post(`${adminApi}/advert/active`, Qs.stringify(params)).then(res => res)};
export const AdvertDestroy = params => { return axios.post(`${adminApi}/advert/destroy`, Qs.stringify(params)).then(res => res)};
//用户管理
export const UserList = params => { return axios.get(`${adminApi}/user/list`, {params:params}).then(res => res)};
export const UserConfig = params => { return axios.get(`${adminApi}/user/config`, {params:params}).then(res => res)};
export const UserUpdate = params => { return axios.post(`${adminApi}/user/update`, Qs.stringify(params)).then(res => res)};
export const UserLock = params => { return axios.post(`${adminApi}/user/lock`, Qs.stringify(params)).then(res => res)};
export const UserActive = params => { return axios.post(`${adminApi}/user/active`, Qs.stringify(params)).then(res => res)};
//会员管理
export const VipList = params => { return axios.get(`${adminApi}/vip/list`, {params:params}).then(res => res)};
export const VipConfig = params => { return axios.get(`${adminApi}/vip/config`, {params:params}).then(res => res)};
export const VipUpdate = params => { return axios.post(`${adminApi}/vip/update`, Qs.stringify(params)).then(res => res)};
export const VipLock = params => { return axios.post(`${adminApi}/vip/lock`, Qs.stringify(params)).then(res => res)};
export const VipActive = params => { return axios.post(`${adminApi}/vip/active`, Qs.stringify(params)).then(res => res)};
export const VipDestroy = params => { return axios.post(`${adminApi}/vip/destroy`, Qs.stringify(params)).then(res => res)};
//渠道管理
export const CanalList = params => { return axios.get(`${adminApi}/canal/list`, {params:params}).then(res => res)};
export const CanalTree = params => { return axios.get(`${adminApi}/canal/tree`, {params:params}).then(res => res)};
export const CanalConfig = params => { return axios.get(`${adminApi}/canal/config`, {params:params}).then(res => res)};
export const CanalUpdate = params => { return axios.post(`${adminApi}/canal/update`, Qs.stringify(params)).then(res => res)};
export const CanalLock = params => { return axios.post(`${adminApi}/canal/lock`, Qs.stringify(params)).then(res => res)};
export const CanalActive = params => { return axios.post(`${adminApi}/canal/active`, Qs.stringify(params)).then(res => res)};
export const CanalDestroy = params => { return axios.post(`${adminApi}/canal/destroy`, Qs.stringify(params)).then(res => res)};
export const CanalLogin = params => { return axios.post(`${adminApi}/canal/login`, Qs.stringify(params)).then(res => res)};
//客服消息
//结算管理
//订单管理
//支付管理
export const PaymentList = params => { return axios.get(`${adminApi}/payment/list`, {params:params}).then(res => res)};
export const PaymentConfig = params => { return axios.get(`${adminApi}/payment/config`, {params:params}).then(res => res)};
export const PaymentTree = params => { return axios.get(`${adminApi}/payment/tree`, {params:params}).then(res => res)};
export const PaymentUpdate = params => { return axios.post(`${adminApi}/payment/update`, Qs.stringify(params)).then(res => res)};
export const PaymentLock = params => { return axios.post(`${adminApi}/payment/lock`, Qs.stringify(params)).then(res => res)};
export const PaymentActive = params => { return axios.post(`${adminApi}/payment/active`, Qs.stringify(params)).then(res => res)};
export const PaymentDestroy = params => { return axios.post(`${adminApi}/payment/destroy`, Qs.stringify(params)).then(res => res)};
//监控中心
//流量趋势
//报表统计
//视频管理
export const VideoList = params => { return axios.get(`${adminApi}/video/list`, {params:params}).then(res => res)};
export const VideoConfig = params => { return axios.get(`${adminApi}/video/config`, {params:params}).then(res => res)};
export const VideoUpdate = params => { return axios.post(`${adminApi}/video/update`, Qs.stringify(params)).then(res => res)};
export const VideoLock = params => { return axios.post(`${adminApi}/video/lock`, Qs.stringify(params)).then(res => res)};
export const VideoActive = params => { return axios.post(`${adminApi}/video/active`, Qs.stringify(params)).then(res => res)};
export const VideoGood = params => { return axios.post(`${adminApi}/video/good`, Qs.stringify(params)).then(res => res)};
export const VideoDestroy = params => { return axios.post(`${adminApi}/video/destroy`, Qs.stringify(params)).then(res => res)};
//短剧管理
export const PlayletList = params => { return axios.get(`${adminApi}/playlet/list`, {params:params}).then(res => res)};
export const PlayletConfig = params => { return axios.get(`${adminApi}/playlet/config`, {params:params}).then(res => res)};
export const PlayletUpdate = params => { return axios.post(`${adminApi}/playlet/update`, Qs.stringify(params)).then(res => res)};
export const PlayletLock = params => { return axios.post(`${adminApi}/playlet/lock`, Qs.stringify(params)).then(res => res)};
export const PlayletActive = params => { return axios.post(`${adminApi}/playlet/active`, Qs.stringify(params)).then(res => res)};
export const PlayletGood = params => { return axios.post(`${adminApi}/playlet/good`, Qs.stringify(params)).then(res => res)};
export const PlayletDestroy = params => { return axios.post(`${adminApi}/playlet/destroy`, Qs.stringify(params)).then(res => res)};
//直播管理
export const LiveList = params => { return axios.get(`${adminApi}/live/list`, {params:params}).then(res => res)};
export const LiveConfig = params => { return axios.get(`${adminApi}/live/config`, {params:params}).then(res => res)};
export const LiveUpdate = params => { return axios.post(`${adminApi}/live/update`, Qs.stringify(params)).then(res => res)};
export const LiveLock = params => { return axios.post(`${adminApi}/live/lock`, Qs.stringify(params)).then(res => res)};
export const LiveActive = params => { return axios.post(`${adminApi}/live/active`, Qs.stringify(params)).then(res => res)};
export const LiveGood = params => { return axios.post(`${adminApi}/live/good`, Qs.stringify(params)).then(res => res)};
export const LiveDestroy = params => { return axios.post(`${adminApi}/live/destroy`, Qs.stringify(params)).then(res => res)};
//有声小说
export const SoundList = params => { return axios.get(`${adminApi}/sound/list`, {params:params}).then(res => res)};
export const SoundConfig = params => { return axios.get(`${adminApi}/sound/config`, {params:params}).then(res => res)};
export const SoundChapter = params => { return axios.get(`${adminApi}/sound/chapter`, {params:params}).then(res => res)};
export const SoundSave = params => { return axios.post(`${adminApi}/sound/save`, Qs.stringify(params)).then(res => res)};
export const SoundUpdate = params => { return axios.post(`${adminApi}/sound/update`, Qs.stringify(params)).then(res => res)};
export const SoundLock = params => { return axios.post(`${adminApi}/sound/lock`, Qs.stringify(params)).then(res => res)};
export const SoundActive = params => { return axios.post(`${adminApi}/sound/active`, Qs.stringify(params)).then(res => res)};
export const SoundDestroy = params => { return axios.post(`${adminApi}/sound/destroy`, Qs.stringify(params)).then(res => res)};
export const SoundGood = params => { return axios.post(`${adminApi}/sound/good`, Qs.stringify(params)).then(res => res)};
export const SoundDelete = params => { return axios.post(`${adminApi}/sound/delete`, Qs.stringify(params)).then(res => res)};
//短篇小说
export const StoryList = params => { return axios.get(`${adminApi}/story/list`, {params:params}).then(res => res)};
export const StoryConfig = params => { return axios.get(`${adminApi}/story/config`, {params:params}).then(res => res)};
export const StoryUpdate = params => { return axios.post(`${adminApi}/story/update`, Qs.stringify(params)).then(res => res)};
export const StoryLock = params => { return axios.post(`${adminApi}/story/lock`, Qs.stringify(params)).then(res => res)};
export const StoryActive = params => { return axios.post(`${adminApi}/story/active`, Qs.stringify(params)).then(res => res)};
export const StoryGood = params => { return axios.post(`${adminApi}/story/good`, Qs.stringify(params)).then(res => res)};
export const StoryDestroy = params => { return axios.post(`${adminApi}/story/destroy`, Qs.stringify(params)).then(res => res)};
//长篇小说及章节
export const NovelList = params => { return axios.get(`${adminApi}/novel/list`, {params:params}).then(res => res)};
export const NovelConfig = params => { return axios.get(`${adminApi}/novel/config`, {params:params}).then(res => res)};
export const NovelChapter = params => { return axios.get(`${adminApi}/novel/chapter`, {params:params}).then(res => res)};
export const NovelSave = params => { return axios.post(`${adminApi}/novel/save`, Qs.stringify(params)).then(res => res)};
export const NovelUpdate = params => { return axios.post(`${adminApi}/novel/update`, Qs.stringify(params)).then(res => res)};
export const NovelLock = params => { return axios.post(`${adminApi}/novel/lock`, Qs.stringify(params)).then(res => res)};
export const NovelActive = params => { return axios.post(`${adminApi}/novel/active`, Qs.stringify(params)).then(res => res)};
export const NovelGood = params => { return axios.post(`${adminApi}/novel/good`, Qs.stringify(params)).then(res => res)};
export const NovelDestroy = params => { return axios.post(`${adminApi}/novel/destroy`, Qs.stringify(params)).then(res => res)};
export const NovelDelete = params => { return axios.post(`${adminApi}/novel/delete`, Qs.stringify(params)).then(res => res)};
//漫画及章节
export const ComicList = params => { return axios.get(`${adminApi}/comic/list`, {params:params}).then(res => res)};
export const ComicConfig = params => { return axios.get(`${adminApi}/comic/config`, {params:params}).then(res => res)};
export const ComicChapter = params => { return axios.get(`${adminApi}/comic/chapter`, {params:params}).then(res => res)};
export const ComicSave = params => { return axios.post(`${adminApi}/comic/save`, Qs.stringify(params)).then(res => res)};
export const ComicUpdate = params => { return axios.post(`${adminApi}/comic/update`, Qs.stringify(params)).then(res => res)};
export const ComicLock = params => { return axios.post(`${adminApi}/comic/lock`, Qs.stringify(params)).then(res => res)};
export const ComicActive = params => { return axios.post(`${adminApi}/comic/active`, Qs.stringify(params)).then(res => res)};
export const ComicGood = params => { return axios.post(`${adminApi}/comic/good`, Qs.stringify(params)).then(res => res)};
export const ComicDestroy = params => { return axios.post(`${adminApi}/comic/destroy`, Qs.stringify(params)).then(res => res)};
export const ComicDelete = params => { return axios.post(`${adminApi}/comic/delete`, Qs.stringify(params)).then(res => res)};
//图片管理
export const PhotoList = params => { return axios.get(`${adminApi}/photo/list`, {params:params}).then(res => res)};
export const PhotoConfig = params => { return axios.get(`${adminApi}/photo/config`, {params:params}).then(res => res)};
export const PhotoUpdate = params => { return axios.post(`${adminApi}/photo/update`, Qs.stringify(params)).then(res => res)};
export const PhotoLock = params => { return axios.post(`${adminApi}/photo/lock`, Qs.stringify(params)).then(res => res)};
export const PhotoActive = params => { return axios.post(`${adminApi}/photo/active`, Qs.stringify(params)).then(res => res)};
export const PhotoGood = params => { return axios.post(`${adminApi}/photo/good`, Qs.stringify(params)).then(res => res)};
export const PhotoDestroy = params => { return axios.post(`${adminApi}/photo/destroy`, Qs.stringify(params)).then(res => res)};
//楼凤管理
export const LadyList = params => { return axios.get(`${adminApi}/lady/list`, {params:params}).then(res => res)};
export const LadyConfig = params => { return axios.get(`${adminApi}/lady/config`, {params:params}).then(res => res)};
export const LadyUpdate = params => { return axios.post(`${adminApi}/lady/update`, Qs.stringify(params)).then(res => res)};
export const LadyLock = params => { return axios.post(`${adminApi}/lady/lock`, Qs.stringify(params)).then(res => res)};
export const LadyActive = params => { return axios.post(`${adminApi}/lady/active`, Qs.stringify(params)).then(res => res)};
export const LadyGood = params => { return axios.post(`${adminApi}/lady/good`, Qs.stringify(params)).then(res => res)};
export const LadyDestroy = params => { return axios.post(`${adminApi}/lady/destroy`, Qs.stringify(params)).then(res => res)};
//游戏管理
export const GameList = params => { return axios.get(`${adminApi}/game/list`, {params:params}).then(res => res)};
export const GameConfig = params => { return axios.get(`${adminApi}/game/config`, {params:params}).then(res => res)};
export const GameUpdate = params => { return axios.post(`${adminApi}/game/update`, Qs.stringify(params)).then(res => res)};
export const GameLock = params => { return axios.post(`${adminApi}/game/lock`, Qs.stringify(params)).then(res => res)};
export const GameActive = params => { return axios.post(`${adminApi}/game/active`, Qs.stringify(params)).then(res => res)};
export const GameDestroy = params => { return axios.post(`${adminApi}/game/destroy`, Qs.stringify(params)).then(res => res)};
//菠菜管理
//管理人员
export const ManageUser = params => { return axios.get(`${adminApi}/manager/user`, {params:params}).then(res => res)};
export const ManagerList = params => { return axios.get(`${adminApi}/manager/list`, {params:params}).then(res => res)};
export const ManagerUser = params => { return axios.get(`${adminApi}/manager/user`, {params:params}).then(res => res)};
export const ManagerConfig = params => { return axios.get(`${adminApi}/manager/config`, {params:params}).then(res => res)};
export const ManagerUpdate = params => { return axios.post(`${adminApi}/manager/update`, Qs.stringify(params)).then(res => res)};
export const ManagerLock = params => { return axios.post(`${adminApi}/manager/lock`, Qs.stringify(params)).then(res => res)};
export const ManagerActive = params => { return axios.post(`${adminApi}/manager/active`, Qs.stringify(params)).then(res => res)};
export const ManagerDestroy = params => { return axios.post(`${adminApi}/manager/destroy`, Qs.stringify(params)).then(res => res)};
//角色管理
export const RoleList = params => { return axios.get(`${adminApi}/role/list`, {params:params}).then(res => res)};
export const RoleTree = params => { return axios.get(`${adminApi}/role/tree`, {params:params}).then(res => res)};
export const RoleAccess = params => { return axios.get(`${adminApi}/role/access`, {params:params}).then(res => res)};
export const RoleUpdate = params => { return axios.post(`${adminApi}/role/update`, Qs.stringify(params)).then(res => res)};
export const RoleDestroy = params => { return axios.post(`${adminApi}/role/destroy`, Qs.stringify(params)).then(res => res)};
//权限管理
export const AuthenList = params => { return axios.get(`${adminApi}/authen/list`, {params:params}).then(res => res)};
export const AuthenTree = params => { return axios.get(`${adminApi}/authen/tree`, {params:params}).then(res => res)};
export const AuthenUpdate = params => { return axios.post(`${adminApi}/authen/update`, Qs.stringify(params)).then(res => res)};
export const AuthenDestroy = params => { return axios.post(`${adminApi}/authen/destroy`, Qs.stringify(params)).then(res => res)};
//系统日志
export const LoggerList = params => { return axios.get(`${adminApi}/logger/list`, {params:params}).then(res => res)};
export const LoggerConfig = params => { return axios.get(`${adminApi}/logger/config`, {params:params}).then(res => res)};
export const LoggerDestroy = params => { return axios.post(`${adminApi}/logger/destroy`, Qs.stringify(params)).then(res => res)};
//登录日志
export const SafeList = params => { return axios.get(`${adminApi}/safe/list`, {params:params}).then(res => res)};
export const SafeConfig = params => { return axios.get(`${adminApi}/safe/config`, {params:params}).then(res => res)};
export const SafeDestroy = params => { return axios.post(`${adminApi}/safe/destroy`, Qs.stringify(params)).then(res => res)};













































































