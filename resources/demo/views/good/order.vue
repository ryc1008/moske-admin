<template>
    <div class="board-content">
        <div class="board-header">
            <div class="board-search">
                <div class="search-item" v-if="configs">
                    <el-select v-model="params.status" size="small" filterable style="width: 150px">
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
                    <el-select v-model="params.aid" size="small" filterable style="width: 150px">
                        <el-option :value="0" label="全部代理商"></el-option>
                        <el-option
                            v-for="item in agents"
                            :key="Number(item.id)"
                            :label="item.username"
                            :value="Number(item.id)">
                        </el-option>
                    </el-select>
                </div>
                <div class="search-item">
                    <el-input v-model="params.order" placeholder="请输入订单信息" size="small" clearable></el-input>
                </div>
                <div class="search-item">
                    <el-input v-model="params.express" placeholder="请输入快递信息" size="small" clearable></el-input>
                </div>
                <div class="search-item">
                    <el-date-picker style="width: 150px" v-model="params.datetime" placeholder="选择日期" size="small"
                                    type="date" clearable></el-date-picker>
                </div>
                <div class="search-item">
                    <el-input v-model="params.kwd" placeholder="请输入用户信息" size="small" clearable></el-input>
                </div>
                <div class="search-item">
                    <el-button type="primary" @click="search()" size="small" icon="el-icon-search">搜索</el-button>
                </div>
            </div>
            <div class="board-handle">
                <el-button type="warning" icon="fa fa-refresh" @click="list()" size="small"> 刷新</el-button>
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
                <el-table-column prop="order_sn" label="订单编号" width="170"></el-table-column>
                <el-table-column prop="title" label="商品" width="200" show-overflow-tooltip></el-table-column>
                <el-table-column prop="money" label="价格" width="100"></el-table-column>
                <el-table-column prop="username" label="用户" width="120"></el-table-column>
                <el-table-column prop="mobile" label="电话" width="120"></el-table-column>
                <el-table-column prop="express_card" label="快递号" width="150"></el-table-column>
                <el-table-column prop="status_text" label="状态" width="80" align="center">
                    <template slot-scope="scope">
                        <el-tag :type="$func.formatTag(scope.row.status + 1)">{{ scope.row.status_text }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="created_at" label="新增时间" width="160">
                    <template slot-scope="scope">
                        {{ $moment(scope.row.created_at).format('YYYY-MM-DD HH:mm:ss') }}
                    </template>
                </el-table-column>
                <el-table-column prop="pay_at" label="支付时间" width="160">
                    <template slot-scope="scope">
                        {{ scope.row.pay_at ? $moment(scope.row.pay_at).format('YYYY-MM-DD HH:mm:ss') : '' }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" min-width="270">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="fa fa-send" size="mini" plain
                                   @click="send(scope.row.id)" v-if="scope.row.status == 2"> 发货
                        </el-button>
                        <el-button type="danger" icon="fa fa-history" size="mini" plain
                                   @click="finish(scope.row.id)" v-if="scope.row.status == 3"> 完成
                        </el-button>
                        <el-button type="success" icon="fa fa-eye" size="mini" plain @click="info(scope.row.id)"> 详情
                        </el-button>
                        <el-button type="info" icon="fa fa-trash" size="mini" plain @click="destroy(scope.row.id)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <pagination :datas="datas" @page="page"></pagination>
        <el-dialog class="board-dialog" :close-on-click-modal="false"
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
import {mapState} from "vuex";
import {OrderList, OrderDestroy, OrderConfig, AgentTree, OrderUpdate, OrderFinish} from '../../utils/request';

export default {
    computed: {
        ...mapState({
            tableHeight: state => state.tableHeight
        }),
    },
    data: function () {
        return {
            loading: false,
            datas: null,
            configs: null,
            cates: null,
            agents: null,
            slection: [],
            params: {page: 1, status: 0, kwd: '', order: '', express: '', datetime: '', aid: 0, merit: 0},
            dialog: {title: '', show: false},
            button: {loading: false, disable: false, text: '提 交'},
            form: null,
            rules: {
                express_store: [{required: true, message: '请填写快递商家', trigger: 'blur'}],
                express_card: [{required: true, message: '请填写快递单号', trigger: 'blur'}],
            }
        }
    },
    activated() {
        this.agent();
        let aid = this.$route.query.aid;
        let merit = this.$route.query.merit;
        if (aid) {
            this.params.aid = aid;
            this.params.merit = merit;
        }
        this.config();
        this.list();
    },
    methods: {
        config() {
            OrderConfig().then((res) => {
                if (res.status) {
                    this.$func.error(res.message);
                } else {
                    this.configs = res.data;
                }
            });
        },
        async list() {
            await this.$func.verify('order.list');
            this.loading = true;
            OrderList(this.params).then((res) => {
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
        async send(id) {
            await this.$func.verify('order.update');
            this.form = {
                express_store: '',
                express_card: '',
                id: id,
            };
            this.dialog.title = '发货';
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
                    OrderUpdate(this.form).then((res) => {
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
        async info(id) {
            await this.$func.verify('order.info');
            this.$router.push({name: 'order_info', query: {id: id}});
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
        agent() {
            AgentTree().then((res) => {
                if (res.status) {
                    this.$func.error(res.message);
                } else {
                    this.agents = res.data;
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
        multiple(e) {
            this.slection = [];
            if (e.length) {
                e.forEach((item) => {
                    this.slection.push(item.id)
                })
            }
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
