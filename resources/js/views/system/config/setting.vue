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
            </div>
        </div>
        <div class="board-main">
            <el-table v-if="datas" element-loading-text="努力加载中..."
                      element-loading-spinner="el-icon-loading"
                      ref="multipleHandle" stripe  default-expand-all
                      tooltip-effect="dark" :height="tableHeight" row-key="id"
                      v-loading="loading" :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
                      :data="datas" border @selection-change="multiple">
                <el-table-column type="selection" width="45" align="center"></el-table-column>
                <el-table-column prop="title" label="名称" width="150"></el-table-column>
                <el-table-column prop="name" label="标识" width="150"></el-table-column>
<!--                <el-table-column prop="value" label="默认值" width="100"></el-table-column>-->
                <el-table-column prop="icon" label="图标" width="120"></el-table-column>
                <el-table-column prop="type_text" label="类型" width="60" align="center"></el-table-column>
                <el-table-column prop="unit" label="单位" width="60" align="center"></el-table-column>
                <el-table-column prop="remark" label="说明" width="200" show-overflow-tooltip></el-table-column>
                <el-table-column prop="status_text" label="状态" width="80" align="center">
                    <template slot-scope="scope">
                        <el-tag :type="$func.formatTag(scope.row.status + 2)">{{ scope.row.status_text }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="created_at" label="创建时间" width="160">
                    <template slot-scope="scope">{{ $func.formatDateTime(scope.row.created_at) }}</template>
                </el-table-column>
                <el-table-column label="操作" min-width="270">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.parent_id > 1000" type="primary" icon="fa fa-edit" size="mini" plain @click="edit(scope.row)"> 编辑</el-button>
                        <el-button v-if="scope.row.parent_id > 1000" type="warning" icon="fa fa-copy" size="mini" plain @click="copy(scope.row)"> 复制</el-button>
                        <el-button v-if="scope.row.parent_id > 1000" type="info" icon="fa fa-trash" size="mini" plain @click="destroy(scope.row.id)"> 删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog class="board-dialog" :close-on-click-modal="false"
                   :close-on-press-escape="false" fullscreen
                   :title="dialog.title"
                   :visible.sync="dialog.show" center>
            <el-form v-if="form" :model="form" :rules="rules" ref="form" class="board-form" label-width="120px">
                <div class="item-title">基本信息
                    <div class="title-note"><span>* </span>为必填项</div>
                </div>
                <div class="form-item">
                    <el-form-item v-if="configs" label="分 组：" prop="parent_id">
                        <el-radio-group v-model="form.parent_id" size="medium">
                            <el-radio v-for="(group,index) in configs.groups" :key="index" :label="Number(index)" border>{{ group }}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item v-if="configs" label="类 型：" prop="type">
                        <el-radio-group v-model="form.type" size="medium">
                            <el-radio v-for="(type,index) in configs.types" :key="index" :label="index" border>{{ type }}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="标 题：" prop="title">
                        <el-input v-model="form.title" placeholder="请填写标题" prefix-icon="fa fa-bars" size="medium" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="标 识：" prop="name">
                        <el-input v-model="form.name" placeholder="请填写标识" prefix-icon="fa fa-flag" size="medium" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="默认值：" prop="value" v-if="!form.id">
                        <el-input v-model="form.value" :type="['textarea', 'transfer'].includes(form.type) ? 'textarea' : 'text'" rows="5"  placeholder="请填写默认值" prefix-icon="fa fa-file-text" size="medium" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="说 明：" prop="remark">
                        <el-input v-model="form.remark" placeholder="请填写说明备注" prefix-icon="fa fa-exclamation-triangle" size="medium" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="单 位：" prop="unit">
                        <el-input v-model="form.unit" placeholder="请填写单位，常用的有：单、元、%、个等" prefix-icon="fa fa-bold" size="medium" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="图 标：" prop="icon">
                        <el-input v-model="form.icon" placeholder="请填写fontawesome图标fa" prefix-icon="fa fa-image" size="medium" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="规 则：" prop="rule">
                        <el-input v-model="form.rule" type="textarea" rows="5" placeholder="请填写配置规则" size="medium" clearable></el-input>
                    </el-form-item>
                    <el-form-item v-if="configs" label="状 态：" prop="status">
                        <el-radio-group v-model="form.status" size="medium">
                            <el-radio v-for="(item,index) in configs.status"  :key="index" :label="Number(index)" border>{{ item }}</el-radio>
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
import {SettingList, SettingConfig, SettingUpdate, SettingDestroy} from '@/request/system.js';

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
            params: {page: 1, kwd: ''},
            button: {loading: false, disable: false, text: '提 交'},
            dialog: {title: '', show: false},
            form: null,
            selection: [],
            rules: {
                title: [{required: true, message: '请填写标题', trigger: 'blur'}],
                name: [{required: true, message: '请填写标识', trigger: 'blur'}],
            },
        }
    },
    activated() {
        this.config();
        this.list();
    },
    methods: {
        config() {
            SettingConfig().then((res) => {
                if (res.status) {
                    this.$func.error(res.message);
                } else {
                    this.configs = res.data;
                }
            });
        },
        async list() {
            await this.$func.verify('setting.list');
            this.loading = true;
            SettingList(this.params).then((res) => {
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
            await this.$func.verify('setting.update');
            this.form = {
                id: 0, title: '', name: '', value: '', remark: '',
                unit: '', icon: '', type: 'number', parent_id: 1001, rule: '', status: 1
            };
            this.dialog.title = '新增配置';
            this.dialog.show = true;
            this.$nextTick(() => {
                this.$refs['form'].clearValidate();
            });
        },
        async edit(detail) {
            await this.$func.verify('setting.update');
            this.form = {
                id: detail.id,
                title: detail.title,
                name: detail.name,
                // value: detail.value,
                remark: detail.remark,
                unit: detail.unit,
                type: detail.type,
                icon: detail.icon,
                parent_id: detail.parent_id,
                rule: detail.rule,
                status: detail.status,
            };
            this.quick = false;
            this.dialog.title = '编辑配置';
            this.dialog.show = true;
            this.$nextTick(() => {
                this.$refs['form'].clearValidate();
            });
        },
        async copy(detail){
            await this.$func.verify('setting.update');
            this.form = {
                id: 0,
                title: detail.title,
                name: detail.name,
                // value: detail.value,
                remark: detail.remark,
                unit: detail.unit,
                type: detail.type,
                icon: detail.icon,
                parent_id: detail.parent_id,
                rule: detail.rule,
                status: detail.status,
            };
            this.quick = false;
            this.dialog.title = '新增配置';
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
                    SettingUpdate(this.form).then((res) => {
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
        multiple(e) {
            this.selection = [];
            if (e.length) {
                e.forEach((item) => {
                    this.selection.push(item.id)
                })
            }
        },
        async destroy(id) {
            await this.$func.verify('setting.destroy');
            this.$confirm('您确定要删除选中的该条信息吗？', '提示', {
                type: 'warning',
                confirmButtonText: '确 定',
                cancelButtonText: '取 消'
            }).then(() => {
                SettingDestroy({id: id}).then((res) => {
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
            if (id == 1000) {
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
