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
                    <el-form-item label="昵 称：" prop="nickname">
                        <el-input v-model="form.nickname" placeholder="请填写昵称" prefix-icon="fa fa-user-md" size="medium" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="头 像：" prop="avatar">
                        <div class="form-avatar">
                            <img v-for="(avatar,a) in avatars" :src="$func.assetsFile('avatar/a'+ avatar +'.jpg')"
                                 :class="avatar == form.avatar ? 'active' : ''" @click="select(avatar)" :key="a" alt="">
                        </div>
                    </el-form-item>
                    <el-form-item label="姓 名：" prop="name">
                        <el-input v-model="form.name" placeholder="请填写联系人名称" prefix-icon="fa fa-user" size="medium" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="联 系：" prop="contact">
                        <el-input v-model="form.contact" placeholder="请填写联系方式：电话/QQ/微信/SKYPE/电报等" prefix-icon="fa fa-address-book-o" size="medium" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="银 行：" prop="bank">
                        <el-input v-model="form.bank" placeholder="请填写银行名称或者USDT" prefix-icon="fa fa-bank" size="medium" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="卡 号：" prop="card">
                        <el-input v-model="form.card" placeholder="请填写银行卡号或者钱包" prefix-icon="fa fa-credit-card" size="medium" clearable></el-input>
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
import {UserUpdate} from '@/request/agent.js';

export default {
    computed: {
        ...mapState({
            tableHeight: state => state.tableHeight,
            user: state => state.user,
        }),
    },
    data(){
        return {
            loading: false,
            button: {loading: false, disable: false, text: '提 交'},
            form: null,
            avatars: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
            rules: {
                bank: [{required: true, message: '请填写银行名称或者USDT', trigger: 'blur'}],
                card: [{required: true, message: '请填写银行卡号或者钱包', trigger: 'blur'}],
            },
        }
    },
    activated(){
        this.$nextTick(()=>{
            this.$refs['form'].clearValidate();
        });
        this.form = {
            nickname: this.user.nickname,
            name: this.user.name,
            contact: this.user.contact,
            bank: this.user.bank,
            card: this.user.card,
            avatar: this.user.avatar,
        }
    },
    methods: {
        update() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    this.button.disabled = true;
                    this.button.loading = true;
                    this.button.text = '提交中...';
                    UserUpdate(this.form).then((res) => {
                        if (res.status) {
                            this.$func.error(res.message);
                        } else {
                            this.$func.success(res.message).then(()=>{
                                this.$store.dispatch('setState',{user: res.data});
                            });
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
        select(a){
            this.form.avatar = a;
        }
    }
}
</script>
<style scoped>
    .board-main{
        padding: 15px;
    }
    .form-avatar{
        display: flex
    }
    .form-avatar img{
        height: 40px;width: 40px;border-radius: 50%;margin-right: 15px;cursor: pointer;
    }
    .form-avatar img.active{
        border: 3px solid #2461EF; padding: 2px;
    }
    .form-item{
        max-width: 800px;
    }
</style>
