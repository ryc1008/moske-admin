<template>
    <div class="board-content info" v-if="detail">
        <div class="board-main board-card info-header">
            <div class="good">
                <div class="good-title">{{ detail.title }}</div>
                <div class="good-id">{{ detail.order_sn }}</div>
            </div>
            <div class="board-card-handle">
                <el-button type="primary" icon="fa fa-send" size="small" @click="send(detail.id)" v-if="detail.status == 2"> 发货</el-button>
                <el-button type="danger" icon="fa fa-history" size="small"  @click="finish(detail.id)" v-if="detail.status == 3"> 完成</el-button>
                <el-button type="info" icon="fa fa-trash" size="small" @click="destroy(detail.id)"> 删除</el-button>
                <el-button icon="fa fa-arrow-left" @click="$router.back()" size="small"> 返回</el-button>
            </div>
        </div>
        <div class="board-main board-card">
            <div class="step">
                <el-steps :active="detail.step.active" align-center >
                    <el-step v-for="_item in detail.step.item" :key="this" :title="_item.title" :status="_item.status" :description="_item.date"></el-step>
                </el-steps>
            </div>
        </div>
        <div class="board-main board-card">
            <div class="board-item">基本信息</div>
            <div class="flex">
                <el-image class="good-thumb" :src="detail.goods.thumb"></el-image>
                <el-descriptions class="margin-top good-info" :column="2" size="large" border>
                    <el-descriptions-item>
                        <template slot="label"><i class="fa fa-shopping-cart"></i> 商品名称</template>
                        {{ detail.title }}
                    </el-descriptions-item>
                    <el-descriptions-item>
                        <template slot="label"><i class="fa fa-rmb"></i> 商品价格</template>
                        {{ detail.money }}元
                    </el-descriptions-item>
                    <el-descriptions-item>
                        <template slot="label"><i class="fa fa-user-o"></i> 联系人</template>
                        {{ detail.username }}
                    </el-descriptions-item>
                    <el-descriptions-item>
                        <template slot="label"><i class="el-icon-mobile-phone"></i> 手机号</template>
                        {{ detail.mobile }}
                    </el-descriptions-item>
                    <el-descriptions-item>
                        <template slot="label"><i class="el-icon-location-outline"></i> 收货地址</template>
                        {{ detail.address }}
                    </el-descriptions-item>
                </el-descriptions>
            </div>
        </div>
        <div class="board-main board-card" v-if="detail.status > 2">
            <div class="board-item">物流信息</div>
            <el-descriptions class="margin-top good-info" :column="2" size="large" border>
                <el-descriptions-item>
                    <template slot="label"><i class="el-icon-office-building"></i> 快递商家</template>
                    {{ detail.express_store }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template slot="label"><i class="fa fa-life-saver"></i> 快递单号</template>
                    {{ detail.express_card }}
                </el-descriptions-item>
            </el-descriptions>
        </div>
        <el-dialog class="board-dialog"  :close-on-click-modal="false"
                   :close-on-press-escape="false"
                   :title="dialog.title"
                   :visible.sync="dialog.show" center>
            <el-form v-if="form" :model="form" :rules="rules" ref="form" class="board-form" label-width="120px">
                <div class="board-item">
                    <div class="title-note"><span>* </span>为必填项</div>
                </div>
                <div class="board-form-item">
                    <el-form-item label="商 家：" prop="express_store">
                        <el-input v-model="form.express_store" placeholder="请填写快递商家" size="medium" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="单 号：" prop="express_card">
                        <el-input v-model="form.express_card" placeholder="请填写快递单号" size="medium" clearable></el-input>
                    </el-form-item>
                </div>
            </el-form>
            <span slot="footer" class="dialog-footer">
                    <el-button type="primary" :loading="button.loading" :disabled="button.disable"
                               @click="update">{{ button.text }}</el-button>
                    <el-button @click="dialog.show = false">关 闭</el-button>
                </span>
        </el-dialog>
    </div>
</template>
<script>
import {OrderConfig, OrderDestroy, OrderFinish, OrderInfo, OrderUpdate} from "../../utils/request";
import {mapState} from "vuex";

export default {
    computed: {
        ...mapState({
            title: state => state.title,
        }),
    },
    data() {
        return {
            loading: false,
            dialog: {title: '', show: false},
            button: {loading: false, disable: false, text: '提 交'},
            form: null,
            rules: {
                express_store: [{required: true, message: '请填写快递商家', trigger: 'blur'}],
                express_card: [{required: true, message: '请填写快递单号', trigger: 'blur'}],
            },
            detail: null,
            step: {
                active: 1,
                item: null,
            },
        }
    },
    activated() {
        this.$store.dispatch('setState', {active: '/order'});
        let id = this.$route.query.id;
        if(!id){
            this.$func.error('参数错误');
        }
        this.info(id);
    },
    methods: {
        async info(id){
            await this.$func.verify('order.info');
            OrderInfo({id: id}).then((res)=>{
                if(res.status){
                    this.$func.error(res.message);
                }else{
                    this.detail = res.data;
                }
            });
        },
        async send(id) {
            await this.$func.verify('order.update');
            this.form = {
                express_store: '',
                express_card: '',
                id: id,
            };
            this.dialog.title = '发货';
            this.dialog.show = true;
            this.$nextTick(()=>{
                this.$refs['form'].clearValidate();
            });
        },
        update() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    this.button.disabled = true;
                    this.button.loading = true;
                    this.button.text = '提交中...';
                    OrderUpdate(this.form).then((res) => {
                        if (res.status) {
                            this.$func.error(res.message);
                        } else {
                            this.$func.success(res.message).then(() => {
                                this.dialog.show = false;
                                this.info(this.$route.query.id);
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
        async finish(id) {
            await this.$func.verify('order.update');
            OrderFinish({id: id}).then((res) => {
                if (res.status) {
                    this.$func.error(res.message);
                } else {
                    this.list();
                }
            });
        },
        async destroy(id) {
            await this.$func.verify('order.destroy');
            this.$confirm('您确定要删除选中的该条信息吗？', '提示', {
                type: 'warning',
                confirmButtonText: '确 定',
                cancelButtonText: '取 消'
            }).then(() => {
                OrderDestroy({id: id}).then((res) => {
                    if (res.status) {
                        this.$func.error(res.message);
                    } else {
                        this.list();
                    }
                });
            }).catch(() => {
            });
        },
    }
}
</script>
<style scoped>
    .good-title{
        font-size: 16px;font-weight: 700;margin-bottom: 15px;
    }
    .good-thumb{
        width: 120px;height: 139px;
    }
    .good-info{
        margin-left: 15px;width: 100%;
    }
    .board-item{
        margin-left: 0;
    }
    .step{
        padding: 35px 0
    }
</style>
