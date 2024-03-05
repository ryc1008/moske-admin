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
                <div class="search-item" style="width: 250px">
                    <el-input v-model="params.kwd" placeholder="请输入姓名/手机号/身份证号/地址" size="small" clearable></el-input>
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
                <el-table-column prop="username" label="姓名" width="100"></el-table-column>
                <el-table-column prop="mobile" label="手机号" width="120"></el-table-column>
                <el-table-column prop="card" label="身份证号" width="180"></el-table-column>
                <el-table-column prop="sex_text" label="性别" width="70" align="center">
                    <template slot-scope="scope">
                        <el-tag :type="$func.formatTag(scope.row.sex)">{{ scope.row.sex_text }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="address" label="地址" width="250" show-overflow-tooltip></el-table-column>
                <el-table-column prop="status_text" label="状态" width="80" align="center">
                    <template slot-scope="scope">
                        <el-tag :type="$func.formatTag(scope.row.status + 2)">{{ scope.row.status_text }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="created_at" label="创建时间" width="160">
                    <template slot-scope="scope">
                        {{ $moment(scope.row.created_at).format('YYYY-MM-DD HH:mm:ss') }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" min-width="350">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="fa fa-edit" size="mini" plain @click="edit(scope.row)"> 编辑
                        </el-button>
                        <el-button type="warning" icon="fa fa-user" size="mini" plain @click="custom(scope.row.id)">
                            客户
                        </el-button>
                        <el-button type="success" icon="fa fa-paper-plane" size="mini" plain
                                   @click="merits(scope.row.id)"> 业绩
                        </el-button>
                        <el-button type="info" icon="fa fa-trash" size="mini" plain @click="destroy(scope.row.id)">
                            删除
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
                    <el-form-item label="性 别：" prop="status" required>
                        <el-radio-group v-model="form.sex" size="medium">
                            <el-radio v-for="(item,index) in configs.sex"
                                      :key="index"
                                      :label="Number(index)" border>{{ item }}
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="姓 名：" prop="username">
                        <el-input v-model="form.username" placeholder="请填写真实姓名" size="medium" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="手机号：" prop="mobile">
                        <el-input v-model="form.mobile" placeholder="请填写手机号码" size="medium" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="身份证：" prop="card">
                        <el-input v-model="form.card" placeholder="请填写身份证号码" size="medium" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="地 址：" prop="address">
                        <el-input v-model="form.address" placeholder="请填写详细地址" size="medium" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="状 态：" prop="status" required>
                        <el-radio-group v-model="form.status" size="medium">
                            <el-radio v-for="(item,index) in configs.status"
                                      :key="index"
                                      :label="Number(index)" border>{{ item }}
                            </el-radio>
                        </el-radio-group>
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
import {AgentList, AgentConfig, AgentUpdate, AgentDestroy, AgentActive, AgentLock} from '../../utils/request';

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
            params: {page: 1, kwd: '', status: 0, id: 0},
            button: {loading: false, disable: false, text: '提 交'},
            dialog: {title: '', show: false},
            form: null,
            slection: [],
            rules: {
                username: [{required: true, message: '请填写真实姓名', trigger: 'blur'}],
                mobile: [{required: true, message: '请填写手机号码', trigger: 'blur'}],
                card: [{required: true, message: '请填写身份证号码', trigger: 'blur'}],
            }
        }
    },
    activated() {
        let id = this.$route.query.id;
        if (id) {
            this.params.id = id;
        }
        this.config();
        this.list();
    },
    methods: {
        config() {
            AgentConfig().then((res) => {
                if (res.status) {
                    this.$func.error(res.message);
                } else {
                    this.configs = res.data;
                }
            });
        },
        async list() {
            await this.$func.verify('agent.list');
            this.loading = true;
            AgentList(this.params).then((res) => {
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
            await this.$func.verify('agent.update');
            this.form = {
                sex: 1,
                username: '',
                mobile: '',
                card: '',
                address: '',
                status: 1,
            };
            this.dialog.title = '新增代理';
            this.dialog.show = true;
            this.$nextTick(() => {
                this.$refs['form'].clearValidate();
            });
        },
        async edit(detail) {
            await this.$func.verify('agent.update');
            this.form = {
                id: detail.id,
                sex: detail.sex,
                username: detail.username,
                mobile: detail.mobile,
                card: detail.card,
                address: detail.address,
                status: detail.status,
            };
            this.dialog.title = '编辑代理';
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
                    AgentUpdate(this.form).then((res) => {
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
        async destroy(id) {
            await this.$func.verify('agent.destroy');
            this.$confirm('您确定要删除选中的该条信息吗？', '提示', {
                type: 'warning',
                confirmButtonText: '确 定',
                cancelButtonText: '取 消'
            }).then(() => {
                AgentDestroy({id: id}).then((res) => {
                    if (res.status) {
                        this.$func.error(res.message);
                    } else {
                        this.list();
                    }
                });
            }).catch(() => {
            });
        },
        async custom(id) {
            await this.$func.verify('user.list');
            this.$router.push({name: 'user', query: {aid: id}});
        },
        async merits(id) {
            await this.$func.verify('order.list');
            this.$router.push({name: 'order', query: {aid: id, merit: 1}});
        },
        search() {
            this.params.page = 1;
            this.list();
        },
        page(val) {
            this.params.page = val;
            this.list();
        },
        multiple(e) {
            this.slection = [];
            if (e.length) {
                e.forEach((item) => {
                    this.slection.push(item.id)
                })
            }
        },
        async active() {
            await this.$func.verify('agent.update');
            if (!this.slection.length) {
                this.$func.error('请选择你要操作的数据');
                return false;
            }
            AgentActive({id: this.slection}).then((res) => {
                if (res.status) {
                    this.$func.error(res.message);
                } else {
                    this.list();
                }
            });
        },
        async lock() {
            await this.$func.verify('agent.update');
            if (!this.slection.length) {
                this.$func.error('请选择你要操作的数据');
                return false;
            }
            AgentLock({id: this.slection}).then((res) => {
                if (res.status) {
                    this.$func.error(res.message);
                } else {
                    this.list();
                }
            });
        },
        del() {
            if (!this.slection.length) {
                this.$func.error('请选择你要操作的数据');
                return false;
            }
            this.destroy(this.slection);
        },
    }
}
</script>
