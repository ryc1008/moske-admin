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
<!--            default-expand-all-->
            <el-table v-if="datas" element-loading-text="努力加载中..."
                      element-loading-spinner="el-icon-loading"
                      stripe
                      tooltip-effect="dark" :height="tableHeight" row-key="id"
                      v-loading="loading" :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
                      :data="datas" border>
                <el-table-column prop="name" label="名称" width="140"></el-table-column>
                <el-table-column prop="access" label="节点" width="200"></el-table-column>
                <el-table-column prop="mark" label="标识" width="200"></el-table-column>
                <el-table-column prop="sort" label="排序" width="60" align="center"></el-table-column>
                <el-table-column prop="created_at" label="创建时间" width="160">
                    <template slot-scope="scope">
                        {{  $func.formatDateTime(scope.row.created_at) }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" min-width="270">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="fa fa-edit" size="mini" plain @click="edit(scope.row)"> 编辑
                        </el-button>
                        <el-button v-if="scope.row.id > 1" type="info" icon="fa fa-trash" size="mini" plain @click="destroy(scope.row.id)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog class="board-dialog"  :close-on-click-modal="false"
                   :close-on-press-escape="false"
                   :title="dialog.title"
                   :visible.sync="dialog.show" center>
            <el-form v-if="form" :model="form" :rules="rules" ref="form" class="board-form" label-width="120px">
                <div class="item-title">基本信息<div class="title-note"><span>* </span>为必填项</div></div>
                <div class="form-item">
                    <el-form-item label="上 级：" prop="parent_id">
                        <el-select v-model="form.parent_id" size="medium" @change="select">
                            <el-option
                                v-for="(auth, i) in auths"
                                :key="i"
                                :label="$func.strToBlank(auth.title_show)"
                                v-html="auth.title_show"
                                :value="auth.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="名 称：" prop="name">
                        <el-input v-model="form.name" placeholder="请填写权限名称, 多个用 | 隔开" prefix-icon="fa fa-bars" size="medium" clearable></el-input>
                    </el-form-item>
                    <el-form-item v-if="quick">
                        <div class="tag-box">
                            <el-tag @click="access('list', '列表')" class="h-tag">列表</el-tag>
                            <el-tag @click="access('update', '更新')" class="h-tag">更新【新增、编辑】</el-tag>
                            <el-tag @click="access('info', '详情')" class="h-tag">详情</el-tag>
                            <el-tag @click="access('copy', '复制')" class="h-tag">复制</el-tag>
                            <el-tag @click="access('active', '启用')" class="h-tag">启用</el-tag>
                            <el-tag @click="access('lock', '锁定')" class="h-tag">锁定</el-tag>
                            <el-tag @click="access('destroy', '删除')" class="h-tag">删除</el-tag>
                        </div>
                    </el-form-item>
                    <el-form-item label="标 识：" prop="mark">
                        <el-input v-model="form.mark" placeholder="请填写权限标识, 多个用 | 隔开" prefix-icon="fa fa-fire" size="medium" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="节 点：" prop="access">
                        <el-input v-model="form.access" placeholder="请填写权限节点, 多个用 | 隔开" prefix-icon="fa fa-code-fork" size="medium" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="排 序：" prop="sort">
                        <el-input v-model="form.sort" placeholder="请填写排列顺序，同级数字越小，排名越靠前, 多个用 | 隔开" prefix-icon="fa fa-sort-numeric-asc" size="medium" clearable></el-input>
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
import {AuthenList, AuthenTree, AuthenUpdate, AuthenDestroy} from '@/request/system.js';

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
            auths: null,
            quick: false,//显示快捷操作
            params: {page: 1, kwd: ''},
            button: {loading: false, disable: false, text: '提 交'},
            dialog: {title: '', show: false},
            form: null,
            selection: [],
            rules: {
                name: [{required: true, message: '请填写角色名称', trigger: 'blur'}],
            },
            nameArr: [], markArr: [], accessArr: [], sortArr: []
        }
    },
    activated() {
        this.tree();
        this.list();
    },
    methods: {
        tree(){
            AuthenTree().then((res) => {
                if (res.status === 0) {
                    this.auths = res.data;
                }
            });
        },
        async list() {
            await this.$func.verify('authen.list');
            this.loading = true;
            AuthenList(this.params).then((res) => {
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
            await this.$func.verify('authen.update');
            this.form = {
                id: 0,
                name: '',
                mark: '',
                parent_id: 10000,
                access: '',
                sort: '',
            };
            this.quick = false;
            this.nameArr = [];
            this.markArr = [];
            this.accessArr = [];
            this.sortArr = [];
            this.select(this.form.parent_id)
            this.dialog.title = '新增权限';
            this.dialog.show = true;
            this.$nextTick(() => {
                this.$refs['form'].clearValidate();
            });
        },
        async edit(detail) {
            await this.$func.verify('authen.update');
            this.form = {
                id: detail.id,
                parent_id: detail.parent_id,
                mark: detail.mark,
                name: detail.name,
                access: detail.access,
                sort: detail.sort == 0 ? '' : detail.sort,
            };
            this.quick = false;
            this.dialog.title = '编辑权限';
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
                    AuthenUpdate(this.form).then((res) => {
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
        multiple(e){
            this.selection = [];
            if(e.length){
                e.forEach((item) =>{
                    this.selection.push(item.id)
                })
            }
        },
        del(){
            if(!this.selection.length){
                this.$func.error('请选择你要操作的数据'); return false;
            }
            this.destroy(this.selection);
        },
        async destroy(id) {
            await this.$func.verify('authen.destroy');
            this.$confirm('您确定要删除选中的该条信息吗？', '提示', {
                type: 'warning',
                confirmButtonText: '确 定',
                cancelButtonText: '取 消'
            }).then(() => {
                AuthenDestroy({id: id}).then((res) => {
                    if (res.status) {
                        this.$func.error(res.message);
                    } else {
                        this.list();
                    }
                });
            }).catch(() => {
            });
        },
        access(sign, name) {
            this.recursion(this.form.parent_id, this.datas, (res)=>{
                if(res.mark){
                    this.nameArr.push(name);
                    this.markArr.push(res.mark + '.' + sign);
                    this.accessArr.push(res.mark + '.' + sign);
                    this.sortArr.push(this.nameArr.length);
                    this.form.name = this.nameArr.join('|');
                    this.form.mark = this.markArr.join('|');
                    this.form.access = this.accessArr.join('|');
                    this.form.sort = this.sortArr.join('|');
                }
            });
        },
        search() {
            this.searchNode(this.datas, (res) =>{
                this.datas = res;
            })

        },
        searchNode(arr, callback){
            if(!this.params.kwd){
                this.list();
            }
            arr.length && arr.filter((item)=>{
                if(item.name.indexOf(this.params.kwd) !== -1){
                    callback([item]);
                }else{
                    item.children && !item.mark && this.searchNode(item.children, callback);
                }
            });
        },
        page(val) {
            this.params.page = val;
            this.list();
        },
        select(id){
            if(id == 10000){
                this.form.sort = this.datas.length + 1;
                this.quick = false;
            }else{
                this.recursion(this.form.parent_id, this.datas, (res)=>{
                    this.form.sort = res.number;
                    this.quick = res.mark ? true : false;//快捷通道
                });
            }
        },
        //数组递归
        recursion(id, arr, callback){
            arr.length && arr.filter((item)=>{
                if(item.id == id){
                    callback({number: item.children ? item.children.length + 1 : 1, mark: item.mark});
                }else{
                    item.children && this.recursion(id, item.children, callback);
                }
            });
        }
    }
}
</script>
<style scoped>
    .tag-box .h-tag{
        margin-right: 10px;cursor: pointer;
    }
</style>
