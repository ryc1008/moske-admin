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
// import mavonEditor from 'mavon-editor';
// import 'mavon-editor/dist/css/index.css';
import '@/static/theme/index.css';
import '@/static/css/common.css';
//每个大模块不同的地方
import router from '@/router/agent.js';
import Store from '@/store/agent.js';
import Func from "@/function/agent.js";
import '@/static/css/agent.css';

// Vue.use(mavonEditor)
Vue.use(ElementUI);
Vue.use(VueCookie);
Vue.use(Pagination);
Vue.use(Editor);

Vue.prototype.$store = Store;
Vue.prototype.$moment = Moment;
Vue.prototype.$crypto = Crypto;
Vue.prototype.$bus = Bus;
Vue.prototype.$func = Func;

router.beforeEach((to, from, next) => {
    NProgress.start();//开启进度条
    if (to.meta.title){
        document.title = to.meta.title + '-渠道系统';//动态化每个页面的标题
    }
    //组装面包屑
    const breadcrumbBox = [];
    to.matched.forEach((item) =>{
        item.meta.title && breadcrumbBox.push({title: item.meta.title});
    })
    Store.dispatch('setState', {active: to.path, title: to.meta.title, breadcrumb: breadcrumbBox});
    if(to.name == 'agent_authorize'){
        next();
    }else{
        const whiteList = ['agent_login'];
        const token = VueCookie.get('agent:token');
        if (token) {
            //访问登录界面则跳转到后台主页
            if (whiteList.includes(to.name)) {
                next({name: 'agent_main'});
            } else {
                if(Store.state.user){
                    next();
                }else{
                    Store.dispatch('generateRoutes').then(() => {
                        next();
                    });
                }
            }
        } else {
            if (whiteList.includes(to.name)) {
                next();
            } else {
                // token不存在，全部重定向到登录页
                next({name: 'agent_login'});
            }
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
