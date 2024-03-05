<template>
    <div id="vs" class="dplayer"></div>
</template>

<script>
import Player, {Events} from "xgplayer";
import HlsPlugin from 'xgplayer-hls';
import 'xgplayer/dist/index.min.css';
export default {
    name: "custom_player",
    props: {
        url: {
            type: String,
            value: ''
        },
        //图标地址不能包含特殊字符，有了个别符号封面图失效
        poster: {
            type: String,
            value: ''
        },
    },
    data: function () {
        return {
            options: {
                id: 'vs',
                url: '',
                poster: '',
                autoplay: false,
                //是否启用流式布局，启用流式布局时根据width、height计算播放器宽高比，若width和height不是Number类型，默认使用16:9比例
                fluid: false,
                width: '100%',
                height: 300,
                controls: {
                    autoHide: false
                },
                //pc端: 是否单击播放器区域切换播放/暂停   mobile端: closeVideoDblclick 为是否通关闭video的click/touchend行为切换播放暂停
                closeVideoClick: true,
                plugins: [HlsPlugin],
            },
            player: null
        }
    },
    created() {
        this.start();
    },
    watch:{
        url(){
            this.destroy();
            this.start();
        }
    },
    methods: {
        start(){
            this.$nextTick(()=>{
                this.options.url = this.url;
                this.options.poster = this.poster;
                this.player = new Player(this.options);
                this.player.on(Events.LOADED_DATA, () => {
                    this.$emit('time',this.$func.getVideoTime(this.player.duration));
                })
                this.player.on(Events.ERROR, (error) => {
                    this.$func.error(error.message);
                })
            })
        },
        destroy(){
            if(this.player){
                this.player.destroy();
                this.player = null;
            }
        }
    }
};
</script>
