import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

//解决router版本过高 重复点击路由控制台报错问题
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function (location) {
    return originalPush.call(this, location).catch(err => err);
};

const Error = () => import('@/views/agent/404.vue');
const Layout = () => import('@/views/agent/layout.vue');
const Login = () => import('@/views/agent/login.vue');
const Authorize = () => import('@/views/agent/authorize.vue');// 授权登录
const Main = () => import('@/views/agent/main.vue');//我的首页
const Flow = () => import('@/views/agent/flow.vue');// 效果报表
const Route = () => import('@/views/agent/route.vue');// 渠道管理
const Info = () => import('@/views/agent/info.vue');// 基本设置
const Trade = () => import('@/views/agent/trade.vue');// 结算信息
const Password = () => import('@/views/agent/password.vue');// 修改密码



export const constantRouterMap = [
    {path: '/', name: 'agent_login', component: Login, meta: {title: '登录注册', login: true}},
    {path: '/authorize', name: 'agent_authorize', component: Authorize, meta: {title: '授权登录'}},
    {path: '/main', component: Layout, children: [
        {path: '/main', name: 'agent_main', component: Main, meta: {title: '我的首页'}},
        {path: '/flow', name: 'agent_flow',  component: Flow,  meta: {title: '我的报表'}},
        {path: '/trade',name: 'agent_trade', component: Trade, meta: {title: '我的结算'}},
        {path: '/route', name: 'agent_route',  component: Route,  meta: {title: '渠道管理'}},
        {path: '/info', name: 'agent_info',  component: Info,  meta: {title: '我的资料'}},
        {path: '/password',name: 'agent_password', component: Password, meta: {title: '修改密码'}},
        {path: '/error', name: 'agent_error', component: Error, meta: {title: '错误异常'}},
    ]},
    {path: '*', redirect: '/error'}
];

const router = new VueRouter({
    mode: 'history', base: '/canal', routes: constantRouterMap
});

export default router;
