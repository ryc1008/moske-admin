import '@/bootstrap';
import Vue from 'vue';
import App from '@/App.vue';
import NProgress from 'nprogress';
import Bus from '@/utils/bus';
import VueCookie from 'vue-cookie';
import ElementUI from 'element-ui';
import Moment from 'moment';
import Crypto from "@/utils/crypto";
import 'element-ui/lib/theme-chalk/index.css';
import 'font-awesome/css/font-awesome.css';
import 'nprogress/nprogress.css';
import Pagination from '@/views/components/pagination';
import Editor from '@/views/components/editor';
import Player from '@/views/components/player';
import Music from '@/views/components/music';
// import mavonEditor from 'mavon-editor';
// import 'mavon-editor/dist/css/index.css';
//这里必须重新命名一个不同的文件。不然主题样式多端口都不会生效
import '@/static/theme/agent.css';
//每个大模块不同的地方
import router from '@/router/system.js';
import Store from '@/store/system.js';
import Func from "@/function/system.js";
import '@/static/css/system.css';


Vue.use(ElementUI);
Vue.use(VueCookie);
Vue.use(Pagination);
Vue.use(Editor);
Vue.use(Player);
Vue.use(Music);

Vue.prototype.$store = Store;
Vue.prototype.$moment = Moment;
Vue.prototype.$crypto = Crypto;
Vue.prototype.$bus = Bus;
Vue.prototype.$func = Func;

router.beforeEach((to, from, next) => {
    NProgress.start();//开启进度条
    if (to.meta.title){
        document.title = to.meta.title + '-管理系统';//动态化每个页面的标题
    }
    //组装面包屑
    const breadcrumbBox = [];
    to.matched.forEach((item) =>{
        item.meta.title && breadcrumbBox.push({title: item.meta.title});
    })
    Store.dispatch('setState', {active: to.path, title: to.meta.title, breadcrumb: breadcrumbBox});
    const whiteList = ['admin_login'];
    const token = VueCookie.get('admin:token');
    if (token) {
        //访问登录界面则跳转到后台主页
        if (whiteList.includes(to.name)) {
            next({name: 'admin_main'});
        } else {
            //动态路由挂载
            if (Store.state.routers.length) {
                next();
            } else {
                Store.dispatch('generateRoutes').then(() => {
                    // 动态添加可访问路由表
                    Store.state.routers.forEach((r)=>{
                        router.addRoute(r);
                    });
                    //hack方法 确保addRoute已完成
                    next({...to});
                });
            }
        }
    } else {
        if (whiteList.includes(to.name)) {
            next();
        } else {
            // token不存在，全部重定向到登录页
            next({name: 'admin_login'});
        }
    }
});

//取消右上角的进度环
NProgress.configure({ showSpinner: false });

//关闭进度条
router.afterEach((transition) => {
    NProgress.done();
});

new Vue({
    router,
    Store,
    render: h => h(App)
}).$mount('#app');
