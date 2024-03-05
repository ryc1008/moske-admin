<template>
    <div class="board-content info">
        <div class="board-main board-card" style="height: calc(100vh - 130px)">
            <div class="board-item">角色授权</div>
            <el-form ref="form" v-loading="loading" :model="form" class="board-form" label-width="110px">
                <div class="board-form-item" v-if="auths">
                    <div v-for="(group,g) in auths" :key="g">
                        <div class="access-title">{{ group.name}}</div>
                        <el-form-item v-for="(node,n) in group.children" :key="n" class="access-item">
                            <template slot="label"><span class="access-all" @click="all(node.children)" title="点击我选择全部">{{ node.name + '：' }}</span></template>
                            <el-checkbox-group v-model="form.rules" class="access-checkbox-group">
                                <el-checkbox class="access-checkbox" v-for="(auth,a) in node.children" :label="auth.access" :key="a">{{auth.name}}</el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </div>
                </div>
                <el-form-item class="form-button">
                    <el-button type="primary" :loading="button.loading" :disabled="button.disable"
                               @click="update">{{ button.text }}</el-button>
                    <el-button @click="$router.back()" class="back">返 回</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
import {mapState} from "vuex";
import {RoleAccess, RoleUpdate} from '@/request/system.js';

export default {
    computed: {
        ...mapState({
            tableHeight: state => state.tableHeight,
        }),
    },
    data(){
        return {
            loading: false,
            auths: null,
            button: {loading: false, disable: false, text: '提 交'},
            form: {id: 0, rules: []},
        }
    },
    activated(){
        let rid = this.$route.query.id;
        this.form.id = rid;
        this.$store.dispatch('setState', {active: '/role'});
        this.info(rid);
        this.$nextTick(()=>{
            this.$refs['form'].clearValidate();
        });
    },
    methods: {
        info(id) {
            this.loading = true;
            RoleAccess({id: id}).then((res) => {
                if (res.status) {
                    this.$func.error(res.message);
                } else {
                    this.form.rules = res.data.rules;
                    this.auths = res.data.auths;
                }
                this.loading = false;
            }).catch((e) => {
                this.loading = false;
            });
        },
        async update() {
            await this.$func.verify('role.update');
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    this.button.disabled = true;
                    this.button.loading = true;
                    this.button.text = '提交中...';
                    RoleUpdate(this.form).then((res) => {
                        if (res.status) {
                            this.$func.error(res.message);
                        } else {
                            this.$func.success(res.message).then(() => {
                                this.$router.back();
                            })
                        }
                        this.button.disabled = false;
                        this.button.loading = false;
                        this.button.text = '提 交';
                    }).catch((e) => {
                        this.button.disabled = false;
                        this.button.loading = false;
                        this.button.text = '提 交';
                    });
                }
            });
        },
        all(node){
            node.filter((n)=>{
                if(this.form.rules.includes(n.access)){
                    this.form.rules = this.form.rules.filter((val)=>{
                        return val !== n.access;
                    });
                }else{
                    this.form.rules.push(n.access);
                }
            });
        },
    }
}
</script>
<style scoped>
    .board-form .access-title{
        font-size: 15px;font-weight: 700;line-height: 35px;
    }
    .board-form .access-item {
        margin-bottom: 0;
    }
    .board-form .access-all{
        cursor: pointer;
    }
    .board-form .access-checkbox{
        margin-right: 15px;
    }
    .board-form-item{
        margin-left: 50px;padding-top: 0;
    }
</style>
