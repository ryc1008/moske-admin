<template>
    <div class="board-content">
        <div class="board-main">
            <el-form v-loading="loading" :model="form" class="board-form" ref="form"  label-width="150px">
                <el-tabs v-model="active" type="card">
                    <el-tab-pane v-for="(config,ci) in configs" :label="config.title" :name="config.name" :key="ci">
                        <div class="board-scroll">
                            <el-form-item v-for="(child,hi) in config.children" :label="child.title + ':'" :prop="child.name" :key="hi">
                                <el-input v-model="form[child.name]" v-if="child.type == 'number' || child.type == 'string'"
                                          size="medium"  :prefix-icon="'fa fa-' + child.icon">
                                    <template slot="append" v-if="child.unit">{{ child.unit }}</template>
                                </el-input>
                                <el-radio-group v-model="form[child.name]" size="small" v-if="child.type == 'boole'">
                                    <el-radio-button v-for="(item,i) in child.rule" :label="Number(i)" :key="i">{{ item }}</el-radio-button>
                                </el-radio-group>
                                <el-input v-model="form[child.name]" type="textarea" rows="5" v-if="child.type == 'textarea'"></el-input>
                                <div v-if="child.type == 'transfer'">
                                    <!--微信宝-->
                                    <div v-if="child.name == 'channel_wechat'">
                                        <div class="payment-select">
                                            <el-tag class="select-tag" type="danger" closable v-for="(item,wi) in weiNames" :key="wi" @close="closePay('wei', wi)" size="medium">
                                                {{ item }}
                                            </el-tag>
                                        </div>
                                        <div class="payment-pool">
                                            <el-tag v-for="(wei, wi) in weiPays" :key="wi" :class="wei.code ? 'pool-tag tag-code' : 'pool-tag'" alt="点我选择" title="点我选择"
                                                    @click="selectPay(wei.title, wei.name, 'wei')" size="medium">
                                                {{ wei.title }}
                                            </el-tag>
                                        </div>
                                    </div>
                                    <!--支付宝-->
                                    <div v-if="child.name == 'channel_alipay'">
                                        <div class="payment-select">
                                            <el-tag class="select-tag" type="danger" closable v-for="(item,ai) in aliNames" :key="ai" @close="closePay('ali', ai)" size="medium">
                                                {{ item }}
                                            </el-tag>
                                        </div>
                                        <div class="payment-pool">
                                            <el-tag v-for="(ali, ai) in aliPays" :key="ai" :class="ali.code ? 'pool-tag tag-code' : 'pool-tag'" alt="点我选择" title="点我选择"
                                                    @click="selectPay(ali.title, ali.name, 'ali')">
                                                {{ ali.title }}
                                            </el-tag>
                                        </div>
                                    </div>
                                </div>
                                <div class="board-form_tip" v-if="child.remark">
                                    <i class="fa fa-exclamation-triangle"></i> {{ child.remark }}
                                </div>
                            </el-form-item>
                            <el-form-item class="form-button">
                                <el-button type="primary" :loading="button.loading" :disabled="button.disable" @click="update">{{ button.text }}</el-button>
                            </el-form-item>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
        </div>
    </div>
</template>
<script>
import {mapState} from "vuex";
import {PaymentTree, SettingList, SettingSave} from '@/request/system.js';

export default {
    computed: {
        ...mapState({
            tableHeight: state => state.tableHeight,
        }),
    },
    data(){
        return {
            loading: false,
            button: {loading: false, disable: false, text: '提 交'},
            form: {},
            configs: null,
            weiPays: null,
            aliPays: null,
            active: 'base',
            weiSelect: [],
            aliSelect: [],
            weiNames: [],
            aliNames: [],
        }
    },
    activated(){
        this.tree();
    },
    methods: {
        tree(){
            this.loading = true;
            PaymentTree().then((res) => {
                if (res.status === 0) {
                    this.weiPays = res.data.wei;
                    this.aliPays = res.data.ali;
                    this.config();
                }
            });
        },
        async config() {
            await this.$func.verify('setting.list');
            SettingList(this.params).then((res) => {
                if (res.status) {
                    this.$func.error(res.message);
                } else {
                    this.configs = res.data;
                    this.weiSelect= [];
                    this.aliSelect= [];
                    this.weiNames= [];
                    this.aliNames= [];
                    this.configs.forEach((item) => {
                        item.children.forEach((child) => {
                            if(child.name == 'channel_wechat'){
                                this.weiSelect = child.value ? child.value.split("\n") : [];
                                this.weiSelect.forEach((name)=>{
                                    this.weiPays.forEach((wei)=>{
                                        if(wei.name == name){
                                            this.weiNames.push(wei.title);
                                        }
                                    })
                                });
                            }
                            if(child.name == 'channel_alipay'){
                                this.aliSelect = child.value ? child.value.split("\n") : [];
                                this.aliSelect.forEach((name)=>{
                                    this.aliPays.forEach((ali)=>{
                                        if(ali.name == name){
                                            this.aliNames.push(ali.title);
                                        }
                                    })
                                })
                            }
                            this.$set(this.form, child.name, child.value)
                        })
                    });
                }
                this.loading = false;
            }).catch((e) => {
                this.loading = false;
            });
        },
        async update() {
            await this.$func.verify('setting.save');
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    this.button.disabled = true;
                    this.button.loading = true;
                    this.button.text = '提交中...';
                    SettingSave(this.form).then((res) => {
                        if (res.status) {
                            this.$func.error(res.message);
                        } else {
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
        selectPay(title, name, flag){
            if(flag == 'wei'){
                if(this.weiNames.length < 10){
                    this.weiNames.push(title);
                    this.weiSelect.push(name);
                    this.form.channel_wechat = this.weiSelect.join("\n");
                }else{
                    this.$func.error('最多只能添加10个');
                }
            }
            if(flag == 'ali'){
                if(this.aliNames.length < 10){
                    this.aliNames.push(title);
                    this.aliSelect.push(name);
                    this.form.channel_alipay = this.aliSelect.join("\n");
                }else{
                    this.$func.error('最多只能添加10个');
                }
            }
        },
        closePay(flag, index){
            if(flag == 'wei'){
                this.weiNames.splice(index, 1);
                this.weiSelect.splice(index, 1);
                this.form.channel_wechat = this.weiSelect.join("\n");
            }
            if(flag == 'ali'){
                this.aliNames.splice(index, 1);
                this.aliSelect.splice(index, 1);
                this.form.channel_alipay = this.aliSelect.join("\n");
            }
        },
        uploadSuccess(res, file, name) {
            this.uploadLoading.close();
            if (res.status) {
                this.$func.error(res.message);
            } else {
                this.form[name] = res.data;
            }
        },
        uploadBefore(file) {
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                this.$func.error('上传的图片不能大于2M');
                return false;
            }
            this.uploadLoading = this.$loading({
                lock: true,
                spinner: 'el-icon-loading',
                text: '上传中...',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            return true;
        },
    }
}
</script>
<style scoped>
.board-scroll{
    min-height: calc(100vh - 175px); max-height: calc(100vh - 175px);overflow-y: auto;
    padding: 15px 100px 15px 0;
}

.payment-select{
    border: 1px solid #dfeffd;min-height:52px;border-radius: 5px;background-color: #fbfdff;
    margin-bottom: 15px;padding: 5px 15px;
}
.payment-pool{
    padding: 10px 15px;background-color: #fbfdff;border-radius: 5px;
    border: 1px solid #dfeffd;white-space: normal;font-size: 14px;
    color: #2f9de2;min-height: 50px;overflow: hidden;
}
.payment-pool .pool-tag, .payment-select .select-tag{
    margin-right: 15px;cursor: pointer
}
.payment-pool .pool-tag.tag-code{
    color: #fa6900;
}

</style>
