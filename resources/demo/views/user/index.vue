<template>
    <div class="board-content">
        <div class="board-header">
            <div class="board-search">
                <div class="search-item">
                    <el-select v-model="params.aid" size="small" filterable>
                        <el-option :value="0" label="全部代理商"></el-option>
                        <el-option
                            v-for="item in agents"
                            :key="item.id"
                            :label="item.username"
                            :value="Number(item.id)">
                        </el-option>
                    </el-select>
                </div>
                <div class="search-item" style="width: 250px">
                    <el-input v-model="params.kwd" placeholder="请输入用户名/昵称/手机号/地址" size="small" clearable>
                    </el-input>
                </div>
                <div class="search-item">
                    <el-button type="primary" @click="search()" size="small" icon="el-icon-search">搜索</el-button>
                </div>
            </div>
            <div class="board-handle">
                <el-button type="warning" icon="fa fa-refresh" @click="list()" size="small"> 刷新</el-button>
            </div>
        </div>
        <div class="board-main">
            <el-table v-if="datas"  element-loading-text="努力加载中..."
                      element-loading-spinner="el-icon-loading"
                      ref="multipleHandle" stripe
                      tooltip-effect="dark" :height="tableHeight"
                      v-loading="loading"
                      :data="datas.data" border>
                <el-table-column prop="id" label="编号" width="90" align="center">
                    <template slot-scope="scope">
                        <span :style="scope.row.identity > 1 ? 'color:#2461EF' : ''">{{ scope.row.id}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="identity_text" label="身份" width="60" align="center">
                    <template slot-scope="scope">
                        <span :style="scope.row.identity > 1 ? 'color:#2461EF' : ''">{{ scope.row.identity_text}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="thumb" label="头像" width="70" align="center">
                    <template slot-scope="scope">
                        <el-image class="board-table-image" :src="scope.row.avatar" :preview-src-list="[scope.row.avatar]"></el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="username" label="姓名" width="100"></el-table-column>
                <el-table-column prop="mobile" label="手机号" width="120"></el-table-column>
                <el-table-column prop="nickname" label="昵称" width="120"></el-table-column>
                <el-table-column prop="address" label="地址" width="250" show-overflow-tooltip></el-table-column>
                <el-table-column prop="agent.username" label="所属代理" width="120">
                    <template slot-scope="scope">
                        {{ scope.row.agent ? scope.row.agent.username : '无' }}
                    </template>
                </el-table-column>
                <el-table-column prop="money" label="消费" width="100" align="center"></el-table-column>
                <el-table-column prop="login_at" label="最近登录" width="160">
                    <template slot-scope="scope">
                        {{ $moment(scope.row.login_at).format('YYYY-MM-DD HH:mm:ss') }}
                    </template>
                </el-table-column>
                <el-table-column prop="created_at" label="注册时间" width="160">
                    <template slot-scope="scope">
                        {{ $moment(scope.row.created_at).format('YYYY-MM-DD HH:mm:ss') }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" min-width="200">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="fa fa-edit" size="mini" plain @click="edit(scope.row)"> 编辑
                        </el-button>
                        <el-button type="success" icon="fa fa-eye" size="mini" plain @click="info(scope.row.id)"> 详情
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <pagination :datas="datas" @page="page"></pagination>
        <el-dialog class="board-dialog" fullscreen :close-on-click-modal="false"
                   :close-on-press-escape="false"
                   :title="dialog.title"
                   :visible.sync="dialog.show" center>
            <el-form v-if="form" :model="form" :rules="rules" ref="form" class="board-form" label-width="120px">
                <div class="board-item">
                    <div class="title-note"><span>* </span>为必填项</div>
                </div>
                <div class="board-form-item">
                    <el-form-item label="身 份：" prop="identity" required>
                        <el-radio-group v-model="form.identity" size="medium">
                            <el-radio v-for="(item,index) in configs.identity"
                                      :key="index"
                                      :label="Number(index)" border>{{ item }}
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item v-if="form.identity == 2" label="绑 定：" prop="aid" required>
                        <el-select v-model="form.aid" @change="select" size="medium" filterable placeholder="请绑定代理商">
                            <el-option
                                v-for="item in agents"
                                :key="item.id"
                                :label="item.username"
                                :value="Number(item.id)">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="姓 名：" prop="username">
                        <el-input v-model="form.username" placeholder="请填写真实姓名" size="medium" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="手机号：" prop="mobile">
                        <el-input v-model="form.mobile" placeholder="请填写手机号码" size="medium" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="地 址：" prop="address">
                        <el-input v-model="form.address" placeholder="请填写详细地址" size="medium" clearable></el-input>
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
import {mapState} from "vuex";
import {UserList, UserConfig, UserUpdate, AgentTree} from '../../utils/request';

export default {
    computed: {
        ...mapState({
            tableHeight: state => state.tableHeight,
        }),
    },
    data: function () {
        return {
            loading: false,
            agents: null,
            datas: null,
            configs: null,
            detail: null,
            params: {page: 1, kwd: '', aid: 0},
            button: {loading: false, disable: false, text: '提 交'},
            dialog: {title: '', show: false},
            form: null,
            rules: {
                aid: [{required: true, message: '请绑定代理商', trigger: 'change'}],
                username: [{required: true, message: '请填写真实姓名', trigger: 'blur'}],
                mobile: [{required: true, message: '请填写手机号码', trigger: 'blur'}],
                card: [{required: true, message: '请填写身份证号码', trigger: 'blur'}],
            }
        }
    },
    activated() {
        let aid = this.$route.query.aid;
        if(aid){
            this.params.aid = aid;
        }
        this.config();
        this.agent();
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
                identity: detail.identity,
                aid: detail.aid > 0 ? detail.aid : '',
                username: detail.username,
                mobile: detail.mobile,
                address: detail.address,
            };
            this.dialog.title = '编辑用户';
            this.dialog.show = true;
            this.$nextTick(() => {
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
        async info(id) {
            await this.$func.verify('user.info');
            this.$router.push({name: 'user_info', query:{id: id}});
        },
        search() {
            this.params.page = 1;
            this.list();
        },
        page(val) {
            this.params.page = val;
            this.list();
        },
        select(aid){
            this.agents.forEach((item) => {
                if(item.id == aid){
                    this.form.mobile = this.form.mobile ? this.form.mobile : item.mobile;
                    this.form.address = this.form.address ? this.form.address : item.address;
                }
            })
        },
        agent(){
            AgentTree().then((res)=>{
                if(res.status){
                    this.$func.error(res.message);
                }else{
                    this.agents = res.data;
                }
            });
        },
    }
}
</script>
<style scoped>
    .board-table-image{
        height: 35px;width: 35px;border-radius: 50%;
    }
</style>
