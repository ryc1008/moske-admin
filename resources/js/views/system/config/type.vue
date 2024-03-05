<template>
    <div class="board-content">
        <div class="board-header">
            <div class="board-search">
                <div class="search-item">
                    <el-input v-model="params.kwd" placeholder="请输入名称" size="small" clearable></el-input>
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
            </div>
        </div>
        <div class="board-main">
<!--            default-expand-all-->
            <el-table v-if="datas" element-loading-text="努力加载中..."
                      element-loading-spinner="el-icon-loading"
                      ref="multipleHandle" stripe
                      tooltip-effect="dark" :height="tableHeight" row-key="id"
                      v-loading="loading" :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
                      :data="datas" border @selection-change="multiple">
                <el-table-column type="selection" width="45" align="center"></el-table-column>

                <el-table-column prop="title" label="名称" width="250"></el-table-column>

                <el-table-column prop="icon" label="图标" width="100" align="center">
                    <template slot-scope="scope">
                        <el-image v-if="scope.row.icon" class="board-table-image" :src="scope.row.icon" :preview-src-list="[scope.row.icon]"></el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="id" label="编号" width="65" align="center"></el-table-column>
                <el-table-column prop="status_text" label="状态" width="80" align="center">
                    <template slot-scope="scope">
                        <el-tag :type="$func.formatTag(scope.row.status + 2)">{{ scope.row.status_text }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="sort" label="排序" width="60" align="center"></el-table-column>
                <el-table-column prop="created_at" label="创建时间" width="160">
                    <template slot-scope="scope">{{ $func.formatDateTime(scope.row.created_at) }}</template>
                </el-table-column>
                <el-table-column label="操作" min-width="270">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="fa fa-edit" size="mini" plain @click="edit(scope.row)"> 编辑</el-button>
                        <el-button v-if="scope.row.id > 1" type="info" icon="fa fa-trash" size="mini" plain @click="destroy(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog class="board-dialog" :close-on-click-modal="false"
                   :close-on-press-escape="false"
                   :title="dialog.title"
                   :visible.sync="dialog.show" center>
            <el-form v-if="form" :model="form" :rules="rules" ref="form" class="board-form" label-width="120px">
                <div class="item-title">基本信息
                    <div class="title-note"><span>* </span>为必填项</div>
                </div>
                <div class="form-item">
                    <el-form-item label="上 级：" prop="parent_id">
                        <el-select v-model="form.parent_id" size="medium" filterable placeholder="请选择上级类目" @change="select">
                            <el-option
                                v-for="item in fomats"
                                :key="item.id"
                                v-html="item.title_show"
                                :label="$func.strToBlank(item.title_show)"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="名 称：" prop="title">
                        <el-input v-model="form.title" placeholder="请填写名称" prefix-icon="fa fa-bars" size="medium" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="图 片：" prop="icon">
                        <el-input v-model="form.icon" placeholder="请填写图标地址" prefix-icon="fa fa-image" size="medium" clearable></el-input>
                    </el-form-item>
                    <el-form-item v-if="form.icon">
                        <el-image class="board-form-icon" alt="预览" title="预览" :src="form.icon" :preview-src-list="[form.icon]"></el-image>
                    </el-form-item>
                    <el-form-item label="排 序：" prop="sort">
                        <el-input v-model="form.sort" placeholder="请填写排序" prefix-icon="fa fa-sort-numeric-asc" size="medium" clearable></el-input>
                    </el-form-item>
                    <el-form-item v-if="configs" label="状 态：" prop="status">
                        <el-radio-group v-model="form.status" size="medium">
                            <el-radio v-for="(item,index) in configs.status" :key="index" :label="Number(index)" border>{{ item }}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </div>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" :loading="button.loading" :disabled="button.disable" @click="update">{{ button.text }}</el-button>
                <el-button class="close-btn" @click="dialog.show = false">关 闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {mapState} from "vuex";
import {TypeList, TypeConfig, TypeTree, TypeUpdate, TypeLock, TypeActive, TypeDestroy} from '@/request/system.js';

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
            fomats: null,
            configs: null,
            params: {page: 1, kwd: ''},
            button: {loading: false, disable: false, text: '提 交'},
            dialog: {title: '', show: false},
            form: null,
            selection: [],
            rules: {
                name: [{required: true, message: '请填写名称', trigger: 'blur'}],
            },
        }
    },
    activated() {
        this.config();
        this.tree();
        this.list();
    },
    methods: {
        tree() {
            TypeTree().then((res) => {
                if (res.status === 0) {
                    this.fomats = res.data;
                }
            });
        },
        config() {
            TypeConfig().then((res) => {
                if (res.status) {
                    this.$func.error(res.message);
                } else {
                    this.configs = res.data;
                }
            });
        },
        async list() {
            await this.$func.verify('type.list');
            this.loading = true;
            TypeList(this.params).then((res) => {
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
            await this.$func.verify('type.update');
            this.form = {
                id: 0, title: '', parent_id: 10000, sort: '', icon: '', status: 1
            };
            this.select(this.form.parent_id)
            this.dialog.title = '新增类目';
            this.dialog.show = true;
            this.$nextTick(() => {
                this.$refs['form'].clearValidate();
            });
        },
        async edit(detail) {
            await this.$func.verify('type.update');
            this.form = {
                id: detail.id,
                parent_id: detail.parent_id,
                icon: detail.icon,
                title: detail.title,
                status: detail.status,
                sort: detail.sort == 0 ? '' : detail.sort,
            };
            this.quick = false;
            this.dialog.title = '编辑类目';
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
                    TypeUpdate(this.form).then((res) => {
                        if (res.status) {
                            this.$func.error(res.message);
                        } else {
                            this.$func.success(res.message).then(() => {
                                this.dialog.show = false;
                                this.list();
                                this.tree();
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
        async lock() {
            await this.$func.verify('type.lock');
            if(!this.selection.length){
                this.$func.error('请选择你要操作的数据'); return false;
            }
            TypeLock({id: this.selection}).then((res) => {
                if (res.status) {
                    this.$func.error(res.message);
                } else {
                    this.list();
                }
            });
        },
        async active() {
            await this.$func.verify('type.active');
            if(!this.selection.length){
                this.$func.error('请选择你要操作的数据'); return false;
            }
            TypeActive({id: this.selection}).then((res) => {
                if (res.status) {
                    this.$func.error(res.message);
                } else {
                    this.list();
                }
            });
        },
        multiple(e) {
            this.selection = [];
            if (e.length) {
                e.forEach((item) => {
                    this.selection.push(item.id)
                })
            }
        },
        async destroy(id) {
            await this.$func.verify('type.destroy');
            this.$confirm('您确定要删除选中的该条信息吗？', '提示', {
                type: 'warning',
                confirmButtonText: '确 定',
                cancelButtonText: '取 消'
            }).then(() => {
                TypeDestroy({id: id}).then((res) => {
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
            this.searchNode(this.datas, (res) => {
                this.datas = res;
            })

        },
        searchNode(arr, callback) {
            if (!this.params.kwd) {
                this.list();
            }
            arr.length && arr.filter((item) => {
                if (item.title.indexOf(this.params.kwd) !== -1) {
                    callback([item]);
                } else {
                    item.children && this.searchNode(item.children, callback);
                }
            });
        },
        page(val) {
            this.params.page = val;
            this.list();
        },
        select(id) {
            if (id == 10000) {
                this.form.sort = this.datas.length + 1;
            } else {
                this.recursion(this.form.parent_id, this.datas, (res) => {
                    this.form.sort = res.number;
                });
            }
        },
        //数组递归
        recursion(id, arr, callback) {
            arr.length && arr.filter((item) => {
                if (item.id == id) {
                    callback({number: item.children ? item.children.length + 1 : 1});
                } else {
                    item.children && this.recursion(id, item.children, callback);
                }
            });
        }
    }
}
</script>
<style scoped>
.board-table-image {
    height: 35px;
    width: 35px;
    border-radius: 50%;
}

.board-form-icon {
    height: 100px;
    width: 100px;
    border-radius: 50%;
}
</style>
