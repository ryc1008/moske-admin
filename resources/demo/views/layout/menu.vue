<template>
    <el-menu class="menu"
              :default-active="active" :collapse="isCollapse"
              background-color="transparent"
              text-color="#222b45"
              :router="true"
              :unique-opened="true"
              active-text-color="#fff">
        <el-menu-item index="/main">
            <i class="fa fa-home fa-icon"></i>
            <span slot="title">系统首页</span>
        </el-menu-item>
        <el-submenu v-for="(router,index) in routers" v-if="router.children && router.children.length" :index="'index_'+index" :key="'index_'+index">
            <template slot="title">
                <i :class="router.meta.icon" class="fa-icon"></i>
                <span>{{ router.meta.title }}</span>
            </template>
            <el-menu-item-group>
                <el-menu-item v-for="(child,c) in router.children" v-if="child.meta.show" :index="child.path" :key="c+1">
                    <i class="fa fa-icon fa-angle-right"></i>{{ child.meta.title}}
                </el-menu-item>
            </el-menu-item-group>
        </el-submenu>
    </el-menu>
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
}
</script>
