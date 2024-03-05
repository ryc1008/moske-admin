import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

//解决router版本过高 重复点击路由控制台报错问题
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function (location) {
    return originalPush.call(this, location).catch(err => err);
};
const Layout = () => import('@/views/system/layout/layout.vue');
const Error = () => import('@/views/system/page/404.vue');
const Login = () => import('@/views/system/login/index.vue');
const Main = () => import('@/views/system/main/index.vue');

//系统管理
const Config = () => import('@/views/system/config/index.vue');//系统设置
const Setting = () => import('@/views/system/config/setting.vue');//配置管理
const Type = () => import('@/views/system/config/type.vue');//类目管理
const Tag = () => import('@/views/system/config/tag.vue');//标签管理
const Advert = () => import('@/views/system/config/advert.vue');//广告管理

//用户管理
const User = () => import('@/views/system/user/index.vue');//用户管理
const Vip = () => import('@/views/system/user/vip.vue');//会员管理
const Canal = () => import('@/views/system/user/canal.vue');//渠道管理
const Custom = () => import('@/views/system/user/custom.vue');//客服消息
const Trade = () => import('@/views/system/user/trade.vue');//结算管理

//数据报表
const Order = () => import('@/views/system/finance/order.vue');//订单管理
const Payment = () => import('@/views/system/finance/payment.vue');//支付管理
const Monitor = () => import('@/views/system/finance/monitor.vue');//监控中心
const Flow = () => import('@/views/system/finance/flow.vue');//流量趋势
const Report = () => import('@/views/system/finance/report.vue');//报表统计


//媒体管理
const Video = () => import('@/views/system/media/video.vue');//视频管理
const Playlet = () => import('@/views/system/media/playlet.vue');//短剧管理
const Live = () => import('@/views/system/media/live.vue');//直播管理
const Sound = () => import('@/views/system/media/sound.vue');//有声小说

//内容管理
const Novel = () => import('@/views/system/content/novel.vue');//长篇小说
const Story = () => import('@/views/system/content/story.vue');//短篇小说
const Photo = () => import('@/views/system/content/photo.vue');//套图管理
const Comic = () => import('@/views/system/content/comic.vue');//漫画管理
const Lady = () => import('@/views/system/content/lady.vue');//楼凤管理

//游戏中心
const Game = () => import('@/views/system/game/index.vue');//游戏管理
const Gamble = () => import('@/views/system/game/gamble.vue');//菠菜管理

//权限配置
const Manager = () => import('@/views/system/manager/index.vue');//管理人员
const Role = () => import('@/views/system/manager/role.vue');//角色管理
const Access = () => import('@/views/system/manager/access.vue');//角色授权
const Authen = () => import('@/views/system/manager/authen.vue');//权限管理
const Logger = () => import('@/views/system/manager/logger.vue');//系统日志
const Safe = () => import('@/views/system/manager/safe.vue');//登录日志




export const constantRouterMap = [
    {path: '/', name: 'admin_login', component: Login, meta: {title: '登录', login: true}},
    {path: '/main', component: Layout, children: [
        {path: '/main', name: 'admin_main', component: Main, meta: {title: '系统首页', show: true, 'icon': 'fa fa-home'}},
        {path: '/error', name: 'admin_error', component: Error, meta: {title: '错误异常', show: false}},
    ]}
];

export const asyncRouterMap = [
    {path: '/config', component: Layout, meta: {title: '系统管理', icon: 'fa fa-cog'}, children: [
        {path: '/config', name: 'admin_config', component: Config, meta: {title: '系统设置', show: true, auth: 'config.list'}},
        {path: '/setting', name: 'admin_setting', component: Setting, meta: {title: '配置管理', show: true, auth: 'setting.list'}},
        {path: '/type', name: 'admin_type', component: Type, meta: {title: '类目管理', show: true, auth: 'type.list'}},
        {path: '/tag', name: 'admin_tag', component: Tag, meta: {title: '标签管理', show: true, auth: 'tag.list'}},
        {path: '/advert', name: 'admin_advert', component: Advert, meta: {title: '广告管理', show: true, auth: 'advert.list'}},
    ]},
    {path: '/user', component: Layout, meta: {title: '用户中心', icon: 'fa fa-user'}, children: [
        {path: '/user', name: 'admin_user', component: User, meta: {title: '用户管理', show: true, auth: 'user.list'}},
        {path: '/vip', name: 'admin_vip', component: Vip, meta: {title: '会员管理', show: true, auth: 'vip.list'}},
        {path: '/canal', name: 'admin_canal', component: Canal, meta: {title: '渠道管理', show: true, auth: 'canal.list'}},
        {path: '/custom', name: 'admin_custom', component: Custom, meta: {title: '客服消息', show: true, auth: 'custom.list'}},
        {path: '/trade', name: 'admin_trade', component: Trade, meta: {title: '结算管理', show: true, auth: 'trade.list'}}
    ]},
    {path: '/order', component: Layout, meta: {title: '数据报表', icon: 'fa fa-area-chart'}, children: [
        {path: '/order', name: 'admin_order', component: Order, meta: {title: '订单管理', show: true, auth: 'order.list'}},
        {path: '/payment', name: 'admin_payment', component: Payment, meta: {title: '支付管理', show: true, auth: 'payment.list'}},
        {path: '/monitor', name: 'admin_monitor', component: Monitor, meta: {title: '监控中心', show: true, auth: 'monitor.list'}},
        {path: '/flow', name: 'admin_flow', component: Flow, meta: {title: '流量趋势', show: true, auth: 'flow.list'}},
        {path: '/report', name: 'admin_report', component: Report, meta: {title: '报表统计', show: true, auth: 'report.list'}},
    ]},
    {path: '/video', component: Layout, meta: {title: '媒体管理', icon: 'fa fa-video-camera'}, children: [
        {path: '/video', name: 'admin_video', component: Video, meta: {title: '视频管理', show: true, auth: 'video.list'}},
        {path: '/playlet', name: 'admin_playlet', component: Playlet, meta: {title: '短剧管理', show: true, auth: 'playlet.list'}},
        {path: '/live', name: 'admin_live', component: Live, meta: {title: '直播管理', show: true, auth: 'live.list'}},
        {path: '/sound', name: 'admin_sound', component: Sound, meta: {title: '有声小说', show: true, auth: 'sound.list'}},
    ]},
    {path: '/video', component: Layout, meta: {title: '内容管理', icon: 'fa fa-file-text'}, children: [
        {path: '/story', name: 'admin_story', component: Story, meta: {title: '短篇小说', show: true, auth: 'story.list'}},
        {path: '/novel', name: 'admin_novel', component: Novel, meta: {title: '长篇小说', show: true, auth: 'novel.list'}},
        {path: '/comic', name: 'admin_comic', component: Comic, meta: {title: '漫画管理', show: true, auth: 'comic.list'}},
        {path: '/photo', name: 'admin_photo', component: Photo, meta: {title: '套图管理', show: true, auth: 'photo.list'}},
        {path: '/lady', name: 'admin_lady', component: Lady, meta: {title: '楼凤管理', show: true, auth: 'lady.list'}}
    ]},
    {path: '/game', component: Layout, meta: {title: '游戏中心', icon: 'fa fa-gamepad'}, children: [
        {path: '/game', name: 'admin_game', component: Game, meta: {title: '游戏管理', show: true, auth: 'game.list'}},
        {path: '/gamble', name: 'admin_gamble', component: Gamble, meta: {title: '菠菜管理', show: true, auth: 'gamble.list'}},
    ]},
    {path: '/manager', component: Layout, meta: {title: '权限配置', icon: 'fa fa-gavel'}, children: [
        {path: '/manager', name: 'admin_manager', component: Manager, meta: {title: '管理人员', show: true, auth: 'manager.list'}},
        {path: '/role', name: 'admin_role', component: Role, meta: {title: '角色管理', show: true, auth: 'role.list'}},
        {path: '/access', name: 'admin_access', component: Access, meta: {title: '角色授权', show: false, auth: 'role.access'}},
        {path: '/authen', name: 'admin_authen', component: Authen, meta: {title: '权限管理', show: true, auth: 'authen.list'}},
        {path: '/logger', name: 'admin_logger', component: Logger, meta: {title: '系统日志', show: true, auth: 'logger.list'}},
        {path: '/safe', name: 'admin_safe', component: Safe, meta: {title: '登录日志', show: true, auth: 'safe.list'}}

    ]},

    {path: '*', redirect: '/error'}
];

const router = new VueRouter({
    mode: 'history', base: '/system', routes: constantRouterMap
});

export default router;
