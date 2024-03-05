<template>
    <div>
        <el-menu class="menu"
                 :default-active="active" :collapse="isCollapse"
                 background-color="transparent"
                 text-color="#222b45"
                 :router="true"
                 :unique-opened="true"
                 active-text-color="#fff">
            <el-menu-item index="/main">
                <i class="fa fa-home fa-icon"></i>
                <span slot="title">我的首页</span>
            </el-menu-item>
            <el-menu-item index="/flow">
                <i class="fa fa-area-chart fa-icon"></i>
                <span slot="title">我的报表</span>
            </el-menu-item>
            <el-menu-item index="/trade">
                <i class="fa fa-money fa-icon"></i>
                <span slot="title">我的结算</span>
            </el-menu-item>
            <el-menu-item index="/route">
                <i class="fa fa-send fa-icon"></i>
                <span slot="title">渠道管理</span>
            </el-menu-item>
            <el-menu-item index="/info">
                <i class="fa fa-user fa-icon"></i>
                <span slot="title">我的资料</span>
            </el-menu-item>
            <el-menu-item index="/password">
                <i class="fa fa-lock fa-icon"></i>
                <span slot="title">修改密码</span>
            </el-menu-item>
        </el-menu>
        <div :class="isCollapse ? 'menu-collapse is-collapse' : 'menu-collapse'"><i class="fa fa-dedent" alt="折叠菜单" title="折叠菜单" @click="collapse"></i></div>
    </div>
</template>

<script>
import {mapState} from "vuex";

export default {
    computed: {
        ...mapState({
            active: state => state.active,
            isCollapse: state => state.isCollapse,
            routers: state => state.routers
        }),
    },
    created() {

    },
    methods: {
        collapse(){
            if(this.isCollapse){
                this.$store.dispatch('setState', {isCollapse: false});
            }else{
                this.$store.dispatch('setState', {isCollapse: true});
            }
        },
    }
}
</script>
