import Player from './player.vue';

const player = {
    install:function (Vue) {
        Vue.component('player', Player)
    }
};

// 导出组件
export default player
