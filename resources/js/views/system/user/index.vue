<template>
    <div class="board-content">
        <div class="board-header">
            <div class="board-search">
                <div class="search-item" v-if="configs">
                    <el-select v-model="params.status" style="width: 120px" size="small" filterable>
                        <el-option :value="0" label="全部状态"></el-option>
                        <el-option
                            v-for="(item,index) in configs.status"
                            :key="index"
                            :label="item"
                            :value="Number(index)">
                        </el-option>
                    </el-select>
                </div>
                <div class="search-item" v-if="configs">
                    <el-select v-model="params.system" style="width: 120px" size="small" filterable>
                        <el-option :value="0" label="全部系统"></el-option>
                        <el-option
                            v-for="(item,index) in configs.systems"
                            :key="index"
                            :label="item"
                            :value="index">
                        </el-option>
                    </el-select>
                </div>
                <div class="search-item" v-if="configs">
                    <el-select v-model="params.vip" style="width: 120px" size="small" filterable>
                        <el-option :value="0" label="全部VIP"></el-option>
                        <el-option
                            v-for="(item,index) in configs.vips"
                            :key="index"
                            :label="item"
                            :value="index">
                        </el-option>
                    </el-select>
                </div>
                <div class="search-item">
                    <el-input v-model="params.aid" style="width: 150px" placeholder="请输入渠道ID" size="small" clearable></el-input>
                </div>
                <div class="search-item">
                    <el-input v-model="params.kwd" placeholder="请输入用户名/ID/手机号" size="small" clearable></el-input>
                </div>
                <div class="search-item">
                    <el-button type="primary" @click="search()" size="small" icon="el-icon-search">搜索</el-button>
                </div>
            </div>
            <div class="board-handle">
                <el-button type="warning" icon="fa fa-refresh" @click="list()" size="small"> 刷新</el-button>
                <el-button type="success" icon="fa fa-unlock-alt" @click="active()" size="small"> 启用</el-button>
                <el-button type="danger" icon="fa fa-lock" @click="lock()" size="small"> 锁定</el-button>
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
                                <el-descriptions-item label="VIP到期">{{props.row.vip_at ? $func.formatDateTime(props.row.vip_at) : '' }}</el-descriptions-item>
                                <el-descriptions-item label="绑定手机">{{ props.row.mobile }}</el-descriptions-item>
                                <el-descriptions-item label="最近登录">{{ props.row.login_at ? $func.formatDateTime(props.row.login_at) : '' }}</el-descriptions-item>
                                <el-descriptions-item label="登录IP">{{ props.row.login_ip}}</el-descriptions-item>
                                <el-descriptions-item label="手机型号">{{ props.row.app_model }}</el-descriptions-item>
                                <el-descriptions-item label="系统版本">{{ props.row.app_release }}</el-descriptions-item>
                                <el-descriptions-item label="网络状态">{{ props.row.app_network }}</el-descriptions-item>
                                <el-descriptions-item label="ip地址库">{{ props.row.address }}</el-descriptions-item>
                                <el-descriptions-item label="UUID">{{ props.row.uuid }}</el-descriptions-item>
                                <el-descriptions-item label="总充值">{{ props.row.money }}</el-descriptions-item>
                            </el-descriptions>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="canal_id" label="渠道"  width="160" >
                    <template slot-scope="scope">
                        【{{ scope.row.canal_id }}】{{ scope.row.canal.username }}
                    </template>
                </el-table-column>
                <el-table-column prop="username" label="用户名" width="240">
                    <template slot-scope="scope">
                        【{{ scope.row.id }}】{{ scope.row.username }}
                    </template>
                </el-table-column>
                <el-table-column prop="vip" label="VIP" width="100" align="center">
                    <template slot-scope="scope">
                        {{scope.row.vip.title ? scope.row.vip.title : '游客' }}
                    </template>
                </el-table-column>
                <el-table-column prop="balance" label="余额" width="100" align="center"></el-table-column>
                <el-table-column prop="app_system" label="系统" width="50" align="center">
                    <template slot-scope="scope">
                        <img class="system-icon" title="安卓系统" v-if="scope.row.app_system == 'Android'" :src="$func.assetsFile('android.png')" alt="">
                        <img class="system-icon" title="苹果系统" v-if="scope.row.app_system == 'iOS'" :src="$func.assetsFile('ios.png')" alt="">
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="app_vendor" label="品牌" :show-overflow-tooltip="true" width="100"></el-table-column>
                <el-table-column align="center" prop="app_version" label="版本号" width="75"></el-table-column>
                <el-table-column prop="status_text" label="状态" width="80" align="center">
                    <template slot-scope="scope">
                        <el-tag :type="$func.formatTag(scope.row.status + 2)">{{ scope.row.status_text }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="created_at" label="注册日期" width="160">
                    <template slot-scope="scope">
                        {{  $func.formatDateTime(scope.row.created_at) }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" min-width="100">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="fa fa-edit" size="mini" plain @click="edit(scope.row)"> 编辑</el-button>
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
                    <el-form-item label="账 户：" prop="username">
                        <el-input v-model="form.username" placeholder="请填写用户名" prefix-icon="fa fa-user" readonly size="medium" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="会 员：" prop="vip_id">
                        <el-select v-model="form.vip_id" size="medium" clearable>
                            <el-option :value="0" label="选择会员等级" ></el-option>
                            <el-option
                                v-for="(item,index) in configs.vips"
                                :key="index"
                                :label="item"
                                :value="Number(index)">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="时 间：" prop="vip_at">
                        <el-date-picker clearable
                            v-model="form.vip_at"
                            type="datetime"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            placeholder="选择会员到期时间">
                        </el-date-picker>
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
                    <el-form-item label="银 行：" prop="bank">
                        <el-input v-model="form.bank" placeholder="请填写银行名称或者USDT" prefix-icon="fa fa-bank" size="medium" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="卡 号：" prop="card">
                        <el-input v-model="form.card" placeholder="请填写银行卡号或者钱包" prefix-icon="fa fa-credit-card" size="medium" clearable></el-input>
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
    UserList,
    UserUpdate,
    UserLock,
    UserActive,
    UserConfig
} from '@/request/system.js';

export default {
    computed: {
        ...mapState({
            tableHeight: state => state.tableHeight,
        }),
    },

    data: function () {
        const validator = (rule, value, callback) => {
            if(value === 0){
                callback(new Error('请填写VIP等级'))
            }
            callback();
        }
        return {
            loading: false,
            datas: null,
            configs: null,
            selection: [],
            params: {page: 1, kwd: '', status: 0, vip: 0, aid: '', system: 0},
            button: {loading: false, disable: false, text: '提 交'},
            dialog: {title: '', show: false},
            form: null,
            rules: {
                vip_id: [{required: true, message: '请填写VIP等级', trigger: 'blur'}, {validator, trigger: 'blur'}],
                vip_at: [{required: true, message: '请选择VIP到期时间', trigger: ['blur', 'change']}],
            },
        }
    },
    activated() {
        this.config();
        this.list();
    },
    methods: {
        config() {
            UserConfig().then((res) => {
                if (res.status) {
                    this.$func.error(res.message);
                } else {
                    this.configs = res.data;
                }
            });
        },
        async list() {
            await this.$func.verify('user.list');
            this.loading = true;
            UserList(this.params).then((res) => {
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
        async edit(detail) {
            await this.$func.verify('user.update');
            this.form = {
                id: detail.id,
                username: detail.username,
                vip_id: detail.vip_id == 1 ? 0 : detail.vip_id,
                vip_at: detail.vip_at,
                name: detail.name,
                bank: detail.bank,
                card: detail.card,
                status: detail.status,
            };
            this.dialog.title = '编辑用户';
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
                    UserUpdate(this.form).then((res) => {
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
            await this.$func.verify('user.active');
            if(!this.selection.length){
                this.$func.error('请选择你要操作的数据'); return false;
            }
            UserActive({id: this.selection}).then((res) => {
                if (res.status) {
                    this.$func.error(res.message);
                } else {
                    this.list();
                }
            });
        },
        async lock(){
            await this.$func.verify('user.lock');
            if(!this.selection.length){
                this.$func.error('请选择你要操作的数据'); return false;
            }
            UserLock({id: this.selection}).then((res) => {
                if (res.status) {
                    this.$func.error(res.message);
                } else {
                    this.list();
                }
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
