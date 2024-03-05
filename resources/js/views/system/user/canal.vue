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
                    <el-input v-model="params.agent_id" placeholder="请输入代理ID查询所有渠道" size="small" clearable></el-input>
                </div>
                <div class="search-item">
                    <el-input v-model="params.kwd" placeholder="请输入用户名/昵称/ID" size="small" clearable></el-input>
                </div>
                <div class="search-item">
                    <el-button type="primary" @click="search()" size="small" icon="el-icon-search">搜索</el-button>
                </div>
            </div>
            <div class="board-handle">
                <el-button type="warning" icon="fa fa-refresh" @click="list()" size="small"> 刷新</el-button>
                <el-button type="primary" icon="fa fa-plus" @click="create(0)" size="small"> 新增</el-button>
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
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <div class="board-description">
                            <el-descriptions title="" size="medium">
                                <el-descriptions-item label="创建时间">{{  $func.formatDateTime(props.row.created_at) }}</el-descriptions-item>
                                <el-descriptions-item label="最近登录">{{ props.row.login_at ? $func.formatDateTime(props.row.login_at) : '' }}</el-descriptions-item>
                                <el-descriptions-item label="登录终端">{{ props.row.mobile_text }}</el-descriptions-item>
                                <el-descriptions-item label="登录IP">{{ props.row.login_ip }}</el-descriptions-item>
                                <el-descriptions-item label="登录地址">{{ props.row.address }}</el-descriptions-item>
                                <el-descriptions-item label="联系人">{{ props.row.name }}</el-descriptions-item>
                                <el-descriptions-item label="联系方式">{{ props.row.contact }}</el-descriptions-item>
                                <el-descriptions-item label="银行名称">{{ props.row.bank }}</el-descriptions-item>
                                <el-descriptions-item label="银行卡号">{{ props.row.card }}</el-descriptions-item>
                                <el-descriptions-item label="UA信息">{{ props.row.user_agent }}</el-descriptions-item>
                            </el-descriptions>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="id" label="编号" width="65" align="center"></el-table-column>
                <el-table-column prop="thumb" label="头像" width="70" align="center">
                    <template slot-scope="scope">
                        <el-image class="board-table-image" :src="'/avatar/a' + scope.row.avatar + '.jpg'" :preview-src-list="['/avatar/a' + scope.row.avatar + '.jpg']"></el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="username" label="用户名" width="100"></el-table-column>
                <el-table-column prop="nickname" label="昵称" width="100"></el-table-column>
                <el-table-column prop="balance" label="余额" width="100" align="center"></el-table-column>
                <el-table-column prop="profit" label="分利" width="60" align="center">
                    <template slot-scope="scope">
                        {{ scope.row.profit }}%
                    </template>
                </el-table-column>
                <el-table-column prop="rebate" label="佣金" width="60" align="center">
                    <template slot-scope="scope">
                        {{ scope.row.rebate}}%
                    </template>
                </el-table-column>
                <el-table-column prop="agent_id" label="代理ID" width="65" align="center">
                    <template slot-scope="scope">
                        {{ scope.row.agent_id ? scope.row.agent_id : '无' }}
                    </template>
                </el-table-column>
                <el-table-column prop="status_text" label="状态" width="80" align="center">
                    <template slot-scope="scope">
                        <el-tag :type="$func.formatTag(scope.row.status + 2)">{{ scope.row.status_text }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" min-width="350">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="fa fa-edit" size="mini" plain @click="edit(scope.row)"> 编辑
                        </el-button>
                        <el-button type="success" icon="fa fa-sign-in" size="mini" plain @click="login(scope.row.id)"> 授权
                        </el-button>
                        <el-button type="warning" icon="fa fa-plus" size="mini" plain  @click="create(scope.row.id)"> 下级
                        </el-button>
<!--                        <el-button type="success" icon="fa fa-sitemap" size="mini" plain  @click="canal(scope.row.id)"> 渠道-->
<!--                        </el-button>-->
                        <el-button type="info" icon="fa fa-trash" size="mini" plain @click="destroy(scope.row.id)"> 删除
                        </el-button>
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
                    <el-form-item label="代 理：" prop="agent_id">
                        <el-select v-model="form.agent_id" filterable  size="medium">
                            <el-option :value="0" label="选择代理" ></el-option>
                            <el-option
                                v-for="(agent,i) in agents"
                                :key="parseInt(i)"
                                :label="agent"
                                :value="parseInt(i)">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="账 户：" prop="username">
                        <el-input v-model="form.username" placeholder="请填写用户名" prefix-icon="fa fa-user" size="medium" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="昵 称：" prop="nickname">
                        <el-input v-model="form.nickname" placeholder="请填写昵称" prefix-icon="fa fa-user-md" size="medium" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="密 码：" prop="password" v-if="form.id == 0">
                        <el-input v-model="form.password" placeholder="请填写密码，默认123456" prefix-icon="fa fa-unlock-alt" size="medium" clearable
                                  onfocus="this.type='password'"></el-input>
                    </el-form-item>
                    <el-form-item label="密 码：" prop="password" v-else>
                        <el-input v-model="form.password" placeholder="请填写密码，不填写表示不修改密码" prefix-icon="fa fa-unlock-alt" size="medium" clearable
                                  onfocus="this.type='password'"></el-input>
                    </el-form-item>
                    <el-form-item label="头 像：" prop="avatar">
                        <div class="form-avatar">
                            <img v-for="(avatar,a) in avatars" :src="$func.assetsFile('avatar/a'+ avatar +'.jpg')"
                                 :class="avatar == form.avatar ? 'active' : ''" @click="select(avatar)" :key="a" alt="">
                        </div>
                    </el-form-item>
                    <el-form-item label="包 名：" prop="apk">
                        <el-input v-model="form.apk" placeholder="请填写apk名称，默认id.apk" prefix-icon="fa fa-android" size="medium" clearable></el-input>
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
                <div class="item-title">钱包信息</div>
                <div class="form-item">
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
                <div class="item-title">扣量信息</div>
                <div class="form-item">
                    <el-form-item label="分 利：" prop="profit">
                        <el-input v-model="form.profit" placeholder="请填写分利：充值代理分成比例" prefix-icon="fa fa-money" size="medium" clearable>
                            <template slot="append">%</template>
                        </el-input>
                        <div class="board-form_tip">
                            <i class="fa fa-exclamation-triangle"></i> 分利：充值代理分成比例
                        </div>
                    </el-form-item>
                    <el-form-item label="佣 金：" prop="rebate">
                        <el-input v-model="form.rebate" placeholder="请填写佣金：代理分成比例" prefix-icon="fa fa-money" size="medium" clearable>
                            <template slot="append">%</template>
                        </el-input>
                        <div class="board-form_tip">
                            <i class="fa fa-exclamation-triangle"></i> 佣金：代理分成比例
                        </div>
                    </el-form-item>
                    <el-form-item label="注 册：" prop="deduct_reg">
                        <el-input v-model="form.deduct_reg" placeholder="请填写注册扣量" prefix-icon="fa fa-life-ring" size="medium" clearable>
                            <template slot="append">%</template>
                        </el-input>
                        <div class="board-form_tip">
                            <i class="fa fa-exclamation-triangle"></i> 注册扣量
                        </div>
                    </el-form-item>
                    <el-form-item label="日 卡：" prop="deduct_day">
                        <el-input v-model="form.deduct_day" placeholder="请填写日卡扣量" prefix-icon="fa fa-life-ring" size="medium" clearable>
                            <template slot="append">%</template>
                        </el-input>
                        <div class="board-form_tip">
                            <i class="fa fa-exclamation-triangle"></i> 日卡扣量
                        </div>
                    </el-form-item>
                    <el-form-item label="月 卡：" prop="deduct_month">
                        <el-input v-model="form.deduct_month" placeholder="请填写月卡扣量" prefix-icon="fa fa-life-ring" size="medium" clearable>
                            <template slot="append">%</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="半年卡：" prop="deduct_half">
                        <el-input v-model="form.deduct_half" placeholder="请填写半年卡扣量" prefix-icon="fa fa-life-ring" size="medium" clearable>
                            <template slot="append">%</template>
                        </el-input>
                        <div class="board-form_tip">
                            <i class="fa fa-exclamation-triangle"></i> 半年卡扣量
                        </div>
                    </el-form-item>
                    <el-form-item label="年 卡：" prop="deduct_year">
                        <el-input v-model="form.deduct_year" placeholder="请填写年卡扣量" prefix-icon="fa fa-life-ring" size="medium" clearable>
                            <template slot="append">%</template>
                        </el-input>
                        <div class="board-form_tip">
                            <i class="fa fa-exclamation-triangle"></i> 年卡扣量
                        </div>
                    </el-form-item>
                    <el-form-item label="终生卡：" prop="deduct_forever">
                        <el-input v-model="form.deduct_forever" placeholder="请填写终生卡扣量" prefix-icon="fa fa-life-ring" size="medium" clearable>
                            <template slot="append">%</template>
                        </el-input>
                        <div class="board-form_tip">
                            <i class="fa fa-exclamation-triangle"></i> 终生卡扣量
                        </div>
                    </el-form-item>
                    <el-form-item label="免单数：" prop="order_free">
                        <el-input v-model="form.order_free" placeholder="请填写免单订单数，单个用户总订单数没到该值前不扣量" prefix-icon="fa fa-shopping-cart" size="medium" clearable>
                            <template slot="append">单</template>
                        </el-input>
                        <div class="board-form_tip">
                            <i class="fa fa-exclamation-triangle"></i> 免单订单数，单个用户总订单数没到该值前不扣量
                        </div>
                    </el-form-item>
                    <el-form-item label="订单数：" prop="order_total">
                        <el-input v-model="form.order_total" placeholder="请填写总订单数：总订单数大于免单订单数则开始扣量" prefix-icon="fa fa-shopping-cart" size="medium" clearable>
                            <template slot="append">单</template>
                        </el-input>
                        <div class="board-form_tip">
                            <i class="fa fa-exclamation-triangle"></i> 总订单数：总订单数大于免单订单数则开始扣量,默认跟随订单自动增长
                        </div>
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
    CanalList,
    CanalUpdate,
    CanalLock,
    CanalActive,
    CanalDestroy,
    CanalTree,
    CanalConfig,
    CanalLogin
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
            agents: null,
            selection: [],
            params: {page: 1, kwd: '', status: 0, agent_id: ''},
            button: {loading: false, disable: false, text: '提 交'},
            dialog: {title: '', show: false},
            avatars: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
            form: null,
            rules: {
                username: [{required: true, message: '请填写管理员账户', trigger: 'blur'}],
            },
        }
    },
    activated() {
        this.agent();
        this.config();
        this.list();
    },
    methods: {
        agent(){
            CanalTree().then((res) => {
                if (res.status === 0) {
                    this.agents = res.data;
                }
            });
        },
        config() {
            CanalConfig().then((res) => {
                if (res.status) {
                    this.$func.error(res.message);
                } else {
                    this.configs = res.data;
                }
            });
        },
        async login(id){
            await this.$func.verify('canal.login');
            CanalLogin({id: id}).then((res) => {
                if (res.status) {
                    this.$func.error(res.message);
                } else {
                    let target = this.configs.domain + "authorize";
                    window.open(target, '_blank');
                }
            });

            // console.log(this.$crypto.decrypt(params));

        },
        async list() {
            await this.$func.verify('canal.list');
            this.loading = true;
            CanalList(this.params).then((res) => {
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
        async create(id) {
            await this.$func.verify('canal.update');
            this.form = {
                id: 0,
                username: '',
                nickname: '',
                password: '',
                name: '',
                contact: '',
                bank: '',
                card: '',
                apk: '',
                avatar: 0,
                agent_id: id,
                deduct_day: '',
                deduct_month: '',
                deduct_half: '',
                deduct_year: '',
                deduct_forever: '',
                deduct_reg: '',
                order_free: '',
                order_total: '',
                profit: 90,
                rebate: 5,
                status: 1,
            };
            this.dialog.title = '新增渠道';
            this.dialog.show = true;
            this.$nextTick(()=>{
                this.$refs['form'].clearValidate();
            });
        },
        async edit(detail) {
            await this.$func.verify('canal.update');
            this.form = {
                id: detail.id,
                username: detail.username,
                nickname: detail.nickname,
                password: '',
                name: detail.name,
                contact: detail.contact,
                bank: detail.bank,
                card: detail.card,
                apk: detail.apk,
                avatar: detail.avatar,
                agent_id: detail.agent_id,
                deduct_day: detail.deduct_day ? detail.deduct_day : '',
                deduct_month: detail.deduct_month ? detail.deduct_month : '',
                deduct_half: detail.deduct_half ? detail.deduct_half : '',
                deduct_year: detail.deduct_year ? detail.deduct_year : '',
                deduct_forever: detail.deduct_forever ? detail.deduct_forever : '',
                deduct_reg: detail.deduct_reg ? detail.deduct_reg : '',
                order_free: detail.order_free ? detail.order_free : '',
                order_total: detail.order_total ? detail.order_total : '',
                profit: detail.profit ? detail.profit : '',
                rebate: detail.rebate ? detail.rebate : '',
                status: detail.status,
            };
            this.dialog.title = '编辑渠道';
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
                    CanalUpdate(this.form).then((res) => {
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
            await this.$func.verify('canal.active');
            if(!this.selection.length){
                this.$func.error('请选择你要操作的数据'); return false;
            }
            CanalActive({id: this.selection}).then((res) => {
                if (res.status) {
                    this.$func.error(res.message);
                } else {
                    this.list();
                }
            });
        },
        async lock(){
            await this.$func.verify('canal.lock');
            if(!this.selection.length){
                this.$func.error('请选择你要操作的数据'); return false;
            }
            CanalLock({id: this.selection}).then((res) => {
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
            await this.$func.verify('canal.destroy');
            this.$confirm('您确定要删除选中的该条信息吗？', '提示', {
                type: 'warning',
                confirmButtonText: '确 定',
                cancelButtonText: '取 消'
            }).then(() => {
                CanalDestroy({id: id}).then((res) => {
                    if (res.status) {
                        this.$func.error(res.message);
                    } else {
                        this.list();
                    }
                });
            }).catch(() => {
            });
        },
        canal(id){
            this.params.agent_id = id;
            this.list();
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
<style scoped>
.form-avatar{
    display: flex
}
.form-avatar img{
    height: 40px;width: 40px;border-radius: 50%;margin-right: 15px;cursor: pointer;
}
.form-avatar img.active{
    border: 3px solid #2461EF; padding: 2px;
}
.board-table-image{
    height: 35px;width: 35px;border-radius: 50%;
}

</style>
