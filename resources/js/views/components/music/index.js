import Music from './music.vue';

const music = {
    install:function (Vue) {
        Vue.component('music', Music)
    }
};

// 导出组件
export default music
