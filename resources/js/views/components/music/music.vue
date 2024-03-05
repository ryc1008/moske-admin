<template>
    <div class="music">
        <div class="disc">
            <div :style="{backgroundImage: 'url('+ poster +')'}" ref="rotate" class="rotate"></div>
        </div>
        <div id="mse"></div>
    </div>
</template>

<script>
import Player, {Events} from "xgplayer";
import MusicPreset from 'xgplayer-music';
export default {
    name: "custom_music",
    props: {
        url: {
            type: String,
            value: ''
        },
        poster: {
            type: String,
            value: ''
        },
    },
    data: function () {
        return {
            options: {
                id: 'mse',
                mediaType: 'audio',
                volume: 0.8,
                width: '100%',
                height: 250,
                url: null,
                controls: {
                    autoHide: false,
                    initShow: true,
                    mode: 'flex'
                },
                presets: ['default', MusicPreset],// 如果要同时使用默认preset，那么配置是['default', MusicPreset]
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
                this.player = new Player(this.options);
                this.player.on(Events.LOADED_DATA, () => {
                    this.$emit('time',this.$func.getVideoTime(this.player.duration));
                })
                this.player.on(Events.PLAY, () => {
                    if(this.$refs.rotate) this.$refs.rotate.style.animationPlayState = 'running';
                })
                this.player.on(Events.PAUSE, () => {
                    if(this.$refs.rotate) this.$refs.rotate.style.animationPlayState = 'paused';
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
