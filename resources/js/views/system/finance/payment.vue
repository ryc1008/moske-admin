<template>
    <div class="board-content">
        <div class="board-header">
            <div class="board-search">
                <div class="search-item" v-if="configs">
                    <el-select v-model="params.status" size="small" filterable>
                        <el-option :value="0" label="全部状态"></el-option>
                        <el-option
                            v-for="(item,index) in configs.status"
                            :key="index"
                            :label="item"
                            :value="index">
                        </el-option>
                    </el-select>
                </div>
                <div class="search-item">
                    <el-input v-model="params.account" placeholder="请输入用支付账户" size="small" clearable></el-input>
                </div>
                <div class="search-item">
                    <el-input v-model="params.kwd" placeholder="请输入支付名称" size="small" clearable></el-input>
                </div>
                <div class="search-item">
                    <el-button type="primary" @click="search()" size="small" icon="el-icon-search">搜索</el-button>
                </div>
            </div>
            <div class="board-handle">
                <el-button type="warning" icon="fa fa-refresh" @click="list()" size="small"> 刷新</el-button>
                <el-button type="primary" icon="fa fa-plus" @click="create()" size="small"> 新增</el-button>
                <el-button type="success" icon="fa fa-unlock-alt" @click="active()" size="small"> 启用</el-button>
                <el-button type="danger" icon="fa fa-lock" @click="lock()" size="small"> 锁定</el-button>
                <el-button type="info" icon="fa fa-trash" @click="del()" size="small"> 删除</el-button>
            </div>
        </div>
        <div class="board-main">
            <el-table v-if="datas" element-loading-text="努力加载中..."
                      element-loading-spinner="el-icon-loading"
                      ref="multipleHandle" stripe
                      tooltip-effect="dark" :height="tableHeight"
                      v-loading="loading"
                      :data="datas.data" border @selection-change="multiple">
                <el-table-column type="selection" width="45" align="center"></el-table-column>
                <el-table-column prop="id" label="编号" width="65" align="center"></el-table-column>
                <el-table-column prop="title" label="名称"  width="120"></el-table-column>
                <el-table-column prop="name" label="标识" width="120"></el-table-column>
                <el-table-column prop="type_text" label="方式" width="80" align="center"></el-table-column>
                <el-table-column prop="channel_text" label="通道" width="60" align="center"></el-table-column>
                <el-table-column prop="code_text" label="扫码" width="60" align="center">
                    <template slot-scope="scope">
                        <el-tag :type="$func.formatTag(scope.row.code)">{{ scope.row.code_text }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="number" label="商户号" width="120"></el-table-column>
                <el-table-column prop="account" label="账号" width="120"></el-table-column>
                <el-table-column prop="status_text" label="状态" width="80" align="center">
                    <template slot-scope="scope">
                        <el-tag :type="$func.formatTag(scope.row.status + 2)">{{ scope.row.status_text }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="created_at" label="创建时间" width="160">
                    <template slot-scope="scope">
                        {{  $func.formatDateTime(scope.row.created_at) }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" min-width="260">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="fa fa-edit" size="mini" plain @click="edit(scope.row)"> 编辑</el-button>
                        <el-button type="warning" icon="fa fa-copy" size="mini" plain @click="copy(scope.row)"> 复制</el-button>
                        <el-button type="info" icon="fa fa-trash" size="mini" plain @click="destroy(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <pagination :datas="datas" @page="page"></pagination>
        <el-dialog class="board-dialog"  fullscreen :close-on-click-modal="false"
                   :close-on-press-escape="false"
                   :title="dialog.title"
                   :visible.sync="dialog.show" center>
            <el-form v-if="form" :model="form" :rules="rules" ref="form" class="board-form" label-width="120px">
                <div class="item-title">基本信息<div class="title-note"><span>* </span>为必填项</div></div>
                <div class="form-item">
                    <el-form-item label="支付名称：" prop="title">
                        <el-input v-model="form.title" placeholder="请填写支付名称" prefix-icon="fa fa-bars" size="medium" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="支付标识：" prop="name">
                        <el-input v-model="form.name" placeholder="请填写支付唯一标识" prefix-icon="fa fa-bars" size="medium" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="通道地址：" prop="address">
                        <el-input v-model="form.address" placeholder="请填写通道地址" prefix-icon="fa fa-send" size="medium" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="商户编码：" prop="number">
                        <el-input v-model="form.number" placeholder="请填写支付商户编码" prefix-icon="fa fa-vcard" size="medium" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="商户秘钥：" prop="secret">
                        <el-input v-model="form.secret" placeholder="请填写商户秘钥" prefix-icon="fa fa-lock" size="medium" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="支付通道：" prop="type">
                        <el-radio-group v-model="form.type" size="medium">
                            <el-radio v-for="(item,index) in configs.types"
                                      :key="index"
                                      :label="Number(index)" border>{{ item }}
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="微信通道：" v-if="form.type == 1 || form.type == 3" prop="code_wechat">
                        <el-input v-model="form.code_wechat" placeholder="请填写微信通道编码" prefix-icon="fa fa-code" size="medium" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="支付宝通道：" v-if="form.type == 2 || form.type == 3" prop="code_alipay">
                        <el-input v-model="form.code_alipay" placeholder="请填写支付宝通道编码" prefix-icon="fa fa-code" size="medium" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="支付类型：" prop="channel">
                        <el-radio-group v-model="form.channel" size="medium">
                            <el-radio v-for="(item,index) in configs.channels"
                                      :key="index"
                                      :label="Number(index)" border>{{ item }}
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="扫码通道：" prop="code">
                        <el-radio-group v-model="form.code" size="medium">
                            <el-radio v-for="(item,index) in configs.codes"
                                      :key="index"
                                      :label="Number(index)" border>{{ item }}
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="请求方式：" prop="method">
                        <el-radio-group v-model="form.method" size="medium">
                            <el-radio v-for="(item,index) in configs.methods"
                                      :key="index"
                                      :label="Number(index)" border>{{ item }}
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="请求类型：" prop="way">
                        <el-radio-group v-model="form.way" size="medium">
                            <el-radio v-for="(item,index) in configs.ways"
                                      :key="index"
                                      :label="Number(index)" border>{{ item }}
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="状 态：" prop="status">
                        <el-radio-group v-model="form.status" size="medium">
                            <el-radio v-for="(item,index) in configs.status"
                                      :key="index"
                                      :label="Number(index)" border>{{ item }}
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>
                </div>
                <div class="item-title">账户信息</div>
                <div class="form-item">
                    <el-form-item label="支付网址：" prop="link">
                        <el-input v-model="form.link" placeholder="请填写支付网址" prefix-icon="fa fa-link" size="medium" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="支付账户：" prop="account">
                        <el-input v-model="form.account" placeholder="请填写支付账户" prefix-icon="fa fa-user" size="medium" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="支付密码：" prop="password">
                        <el-input v-model="form.password" placeholder="请填写支付密码" prefix-icon="fa fa-lock" size="medium" clearable></el-input>
                    </el-form-item>
                </div>
                <div class="item-title">回调信息</div>
                <div class="form-item">
                    <el-form-item label="回调标识：" prop="notify_name">
                        <el-input v-model="form.notify_name" placeholder="请填写回调标识" size="medium" clearable>
                            <template slot="prepend">{{ configs.notify }}</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="订单号字段：" prop="order_field">
                        <el-input v-model="form.order_field" placeholder="请填写订单号字段" prefix-icon="fa fa-bookmark" size="medium" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="成功字段：" prop="success_field">
                        <el-input v-model="form.success_field" placeholder="请填写成功字段" prefix-icon="fa fa-bookmark" size="medium" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="成功返回：" prop="success_msg">
                        <el-input v-model="form.success_msg" placeholder="请填写成功返回" prefix-icon="fa fa-file-text" size="medium" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="回调输出：" prop="return_msg">
                        <el-input v-model="form.return_msg" placeholder="请填写回调输出" prefix-icon="fa fa-file-text" size="medium" clearable></el-input>
                    </el-form-item>
                </div>
            </el-form>
            <span slot="footer" class="dialog-footer">
                    <el-button type="primary" :loading="button.loading" :disabled="button.disable"
                               @click="update">{{ button.text }}</el-button>
                    <el-button class="close-btn" @click="dialog.show = false">关 闭</el-button>
                </span>
        </el-dialog>
    </div>
</template>

<script>
import {mapState} from "vuex";
import {
    PaymentConfig,
    PaymentList,
    PaymentUpdate,
    PaymentLock,
    PaymentActive,
    PaymentDestroy
} from '@/request/system.js';

export default {
    computed: {
        ...mapState({
            tableHeight: state => state.tableHeight,
        }),
    },

    data: function () {
        return {
            loading: false,
            datas: null,
            configs: null,
            selection: [],
            params: {page: 1, kwd: '', status: 0, account: ''},
            button: {loading: false, disable: false, text: '提 交'},
            dialog: {title: '', show: false},
            form: null,
            rules: {
                title: [{required: true, message: '请填写支付名称', trigger: 'blur'}],
                name: [{required: true, message: '请填写支付标识', trigger: 'blur'}],
                number: [{required: true, message: '请填写支付商户编码', trigger: 'blur'}],
                secret: [{required: true, message: '请填写支付商户密钥', trigger: 'blur'}],
                address: [{required: true, message: '请填写通道地址', trigger: 'blur'}],
                notify_name: [{required: true, message: '请填写回调标识', trigger: 'blur'}],
                order_field: [{required: true, message: '请填写订单字段名称', trigger: 'blur'}],
                success_field: [{required: true, message: '请填写成功字段', trigger: 'blur'}],
                success_msg: [{required: true, message: '请填写成功返回', trigger: 'blur'}],
                link: [{required: true, message: '请填写支付网址', trigger: 'blur'}],
                account: [{required: true, message: '请填写支付账户', trigger: 'blur'}],
                password: [{required: true, message: '请填写支付密码', trigger: 'blur'}],
            },
        }
    },
    activated() {
        this.config();
        this.list();
    },
    methods: {
        config() {
            PaymentConfig().then((res) => {
                if (res.status) {
                    this.$func.error(res.message);
                } else {
                    this.configs = res.data;
                }
            });
        },
        async list() {
            await this.$func.verify('payment.list');
            this.loading = true;
            PaymentList(this.params).then((res) => {
                if (res.status) {
                    this.$func.error(res.message);
                } else {
                    this.datas = res.data;
                }
                this.loading = false;
            }).catch((e) => {
                this.loading = false;
            });
        },
        async create() {
            await this.$func.verify('payment.update');
            this.form = {
                id: 0,
                title: '',
                name: '',
                number: '',
                secret: '',
                address: '',
                code_wechat: '',
                code_alipay: '',
                notify_name: '',
                order_field: '',
                return_msg: '',
                success_field: '',
                success_msg: '',
                link: '',
                account: '',
                password: '',
                type: 1,
                channel: 1,
                method: 1,
                way: 1,
                code: 0,
                status: 1,
            };
            this.dialog.title = '新增支付';
            this.dialog.show = true;
            this.$nextTick(()=>{
                this.$refs['form'].clearValidate();
            });
        },
        async edit(detail) {
            await this.$func.verify('payment.update');
            this.form = {
                id: detail.id,
                title: detail.title,
                name: detail.name,
                number: detail.number,
                secret: detail.secret,
                address: detail.address,
                code_wechat: detail.code_wechat,
                code_alipay: detail.code_alipay,
                notify_name: detail.notify_name,
                order_field: detail.order_field,
                return_msg: detail.return_msg,
                success_field: detail.success_field,
                success_msg: detail.success_msg,
                link: detail.link,
                account: detail.account,
                password: detail.password,
                type: detail.type,
                channel: detail.channel,
                method: detail.method,
                way: detail.way,
                code: detail.code,
                status: detail.status,
            };
            this.dialog.title = '编辑支付';
            this.dialog.show = true;
            this.$nextTick(()=>{
                this.$refs['form'].clearValidate();
            });
        },
        async copy(detail) {
            await this.$func.verify('payment.update');
            this.form = {
                id: 0,
                title: detail.title,
                name: detail.name,
                number: detail.number,
                secret: detail.secret,
                address: detail.address,
                code_wechat: detail.code_wechat,
                code_alipay: detail.code_alipay,
                notify_name: detail.notify_name,
                order_field: detail.order_field,
                return_msg: detail.return_msg,
                success_field: detail.success_field,
                success_msg: detail.success_msg,
                link: detail.link,
                account: detail.account,
                password: detail.password,
                type: detail.type,
                channel: detail.channel,
                method: detail.method,
                way: detail.way,
                code: detail.code,
                status: detail.status,
            };
            this.dialog.title = '新增支付';
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
                    PaymentUpdate(this.form).then((res) => {
                        if (res.status) {
                            this.$func.error(res.message);
                        } else {
                            this.$func.success(res.message).then(() => {
                                this.dialog.show = false;
                                this.list();
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
        multiple(e){
            this.selection = [];
            if(e.length){
                e.forEach((item) =>{
                    this.selection.push(item.id)
                })
            }
        },
        async active(){
            await this.$func.verify('payment.active');
            if(!this.selection.length){
                this.$func.error('请选择你要操作的数据'); return false;
            }
            PaymentActive({id: this.selection}).then((res) => {
                if (res.status) {
                    this.$func.error(res.message);
                } else {
                    this.list();
                }
            });
        },
        async lock(){
            await this.$func.verify('payment.lock');
            if(!this.selection.length){
                this.$func.error('请选择你要操作的数据'); return false;
            }
            PaymentLock({id: this.selection}).then((res) => {
                if (res.status) {
                    this.$func.error(res.message);
                } else {
                    this.list();
                }
            });
        },
        del(){
            if(!this.selection.length){
                this.$func.error('请选择你要操作的数据'); return false;
            }
            this.destroy(this.selection);
        },
        async destroy(id) {
            await this.$func.verify('payment.destroy');
            this.$confirm('您确定要删除选中的该条信息吗？', '提示', {
                type: 'warning',
                confirmButtonText: '确 定',
                cancelButtonText: '取 消'
            }).then(() => {
                PaymentDestroy({id: id}).then((res) => {
                    if (res.status) {
                        this.$func.error(res.message);
                    } else {
                        this.list();
                    }
                });
            }).catch(() => {
            });
        },
        search() {
            this.params.page = 1;
            this.list();
        },
        page(val) {
            this.params.page = val;
            this.list();
        },
        select(a){
            this.form.avatar = a;
        }
    }
}
</script>
