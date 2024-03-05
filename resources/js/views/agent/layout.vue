<template>
    <div class="board">
        <v-header></v-header>
        <v-menu></v-menu>
        <div :class=" isCollapse ? 'main main-collapse' : 'main'">
            <transition name="slide-fade" mode="out-in">
                <keep-alive>
                    <router-view/>
                </keep-alive>
            </transition>
        </div>
        <v-footer></v-footer>
    </div>
</template>
<script>
import vHeader from '@/views/agent/header.vue';
import vMenu from '@/views/agent/menu.vue';
import vFooter from '@/views/agent/footer.vue';
import {mapState} from "vuex";

export default {
    components: {vHeader, vMenu, vFooter},
    computed: {
        ...mapState({
            isCollapse: state => state.isCollapse,
        }),
    }
}
</script>
