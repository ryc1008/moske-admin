<template>
    <header id="header" class="header">
        <div class="header-logo">
            渠道<span>系统</span>
        </div>
        <div class="header-breadcrumb">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ name: 'admin_main' }">系统首页</el-breadcrumb-item>
                <el-breadcrumb-item v-for="(crumb, cindex) in breadcrumb" :key="this">
                    <span :class="breadcrumb.length == (cindex + 1) ? 'header-title current' : 'header-title'">{{crumb.title}}</span>
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="header-user" v-if="user">
            <div class="avatar"><img :src="$func.assetsFile('avatar/a'+ user.avatar +'.jpg')" alt=""></div>
            <div class="nickname">{{ user.nickname }}</div>
            <div @click="logout()" class="logout"><i class="fa fa-power-off"></i> 退出</div>
        </div>
    </header>
</template>

<script>
import {mapState} from "vuex";

export default {
    computed: {
        ...mapState({
            breadcrumb: state => state.breadcrumb,
            user: state => state.user
        }),
    },
    data: function () {
        return {
        }
    },
    created() {
    },
    methods: {
        logout() {
            this.$store.dispatch('userLogout').then(() => {
                this.$func.success('正在退出登录......').then(() => {
                    this.$router.push({name: 'admin_login'});
                });
            });
        },
    }
}
</script>
