<template>
    <div class="board-content info" v-if="form">
        <div class="board-main" style="min-height: calc(100vh - 130px)">
            <el-form ref="form" v-loading="loading" :model="form" :rules="rules" class="board-form" label-width="110px">
                <div class="item-title">基本信息<div class="title-note"><span>* </span>为必填项</div></div>
                <div class="form-item">
                    <el-form-item label="UUID：">
                        <el-input v-model="user.id" prefix-icon="fa fa-star" size="medium" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="账 户：">
                        <el-input v-model="user.username" prefix-icon="fa fa-user" size="medium" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="旧密码：" prop="old_password">
                        <el-input v-model="form.old_password" type="password" placeholder="请填写旧密码" prefix-icon="fa fa-lock" size="medium" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="新密码：" prop="new_password">
                        <el-input v-model="form.new_password" type="password" placeholder="请填写新密码" prefix-icon="fa fa-lock" size="medium" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码：" prop="check_password">
                        <el-input v-model="form.check_password" type="password" placeholder="请再次填写新密码" prefix-icon="fa fa-lock" size="medium" clearable></el-input>
                    </el-form-item>
                </div>
                <el-form-item class="form-button">
                    <el-button type="primary" :loading="button.loading" :disabled="button.disable"
                               @click="update">{{ button.text }}</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
import {mapState} from "vuex";
import {UserPassword} from '@/request/agent.js';

export default {
    computed: {
        ...mapState({
            tableHeight: state => state.tableHeight,
            user: state => state.user,
        }),
    },
    data(){
        const check = (rule, value, callback) => {
            if(this.form.new_password != value){
                callback(new Error('新密码两次输入不一致'))
            }
            callback();
        }
        const repeat = (rule, value, callback) => {
            if(this.form.new_password == this.form.old_password){
                callback(new Error('新密码不能和旧密码一样'))
            }
            callback();
        }
        return {
            loading: false,
            button: {loading: false, disable: false, text: '提 交'},
            form: {
                old_password: '',
                new_password: '',
                check_password: '',
            },
            rules: {
                old_password: [{required: true, message: '请填写旧密码', trigger: 'blur'}],
                new_password: [
                    {required: true, message: '请填写新密码', trigger: 'blur'},
                    { min: 6, message: '密码长度至少6位数', trigger: 'blur'},
                    {repeat, trigger: 'blur'}
                ],
                check_password: [
                    {required: true, message: '请再次填写新密码', trigger: 'blur'},
                    {check, trigger: 'blur'}
                ],
            },
        }
    },
    activated(){
        this.$nextTick(()=>{
            this.$refs['form'].clearValidate();
        });
    },
    methods: {
        update() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    this.button.disabled = true;
                    this.button.loading = true;
                    this.button.text = '提交中...';
                    UserPassword(this.form).then((res) => {
                        if (res.status) {
                            this.$func.error(res.message);
                        } else {
                            this.form.old_password = '';
                            this.form.new_password = '';
                            this.form.check_password = '';
                            this.$func.success(res.message);

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
    }
}
</script>
<style scoped>
.board-main{
    padding: 15px;
}
.form-item{
    max-width: 800px;
}
</style>
