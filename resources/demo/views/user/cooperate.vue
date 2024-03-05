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
                    <el-input v-model="params.kwd" placeholder="请输入用户名/电话/地址" size="small" clearable></el-input>
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
                <el-table-column prop="id" label="编号" width="65" align="center"></el-table-column>
                <el-table-column prop="username" label="用户名" width="100"></el-table-column>
                <el-table-column prop="mobile" label="电话" width="120"></el-table-column>
                <el-table-column prop="address" label="地址" width="350" show-overflow-tooltip></el-table-column>
                <el-table-column prop="status_text" label="状态" width="80" align="center">
                    <template slot-scope="scope">
                        <el-tag :type="$func.formatTag(scope.row.status)">{{ scope.row.status_text }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="created_at" label="提交时间" width="160">
                    <template slot-scope="scope">
                        {{ $moment(scope.row.created_at).format('YYYY-MM-DD HH:mm:ss') }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="fa fa-edit" size="mini" plain @click="edit(scope.row)"> 编辑
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
                    <el-form-item label="名 称：" prop="username">
                        <el-input v-model="form.username" placeholder="请填写角色名称" size="medium" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="描 述：" prop="mobile">
                        <el-input v-model="form.mobile" placeholder="请填写角色描述" size="medium" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="描 述：" prop="address">
                        <el-input v-model="form.address" placeholder="请填写角色描述" size="medium" clearable></el-input>
                    </el-form-item>
                    <el-form-item v-if="configs" label="状 态：" prop="status" required>
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
import {CooperateList, CooperateUpdate, CooperateConfig, CooperateDestroy} from '../../utils/request';

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
            params: {page: 1, kwd: '', status: 0},
            button: {loading: false, disable: false, text: '提 交'},
            dialog: {title: '', show: false},
            form: null,
            slection: [],
            rules: {}
        }
    },
    activated() {
        this.config();
        this.list();
    },
    methods: {
        config() {
            CooperateConfig().then((res) => {
                if (res.status) {
                    this.$func.error(res.message);
                } else {
                    this.configs = res.data;
                }
            });
        },
        async list() {
            await this.$func.verify('cooperatein.list');
            this.loading = true;
            CooperateList(this.params).then((res) => {
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
            await this.$func.verify('cooperatein.edit');
            this.form = {
                id: detail.id,
                username: detail.username,
                mobile: detail.mobile,
                address: detail.address,
                status: detail.status,
            };
            this.dialog.title = '编辑信息';
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
                    CooperateUpdate(this.form).then((res) => {
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
            await this.$func.verify('cooperatein.destroy');
            this.$confirm('您确定要删除选中的该条信息吗？', '提示', {
                type: 'warning',
                confirmButtonText: '确 定',
                cancelButtonText: '取 消'
            }).then(() => {
                CooperateDestroy({id: id}).then((res) => {
                    if (res.status) {
                        this.$func.error(res.message);
                    } else {
                        this.list();
                    }
                });
            }).catch(() => {
            });
        },
        multiple(e){
            this.slection = [];
            if(e.length){
                e.forEach((item) =>{
                    this.slection.push(item.id)
                })
            }
        },
        del(){
            if(!this.slection.length){
                this.$func.error('请选择你要操作的数据'); return false;
            }
            this.destroy(this.slection);
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
