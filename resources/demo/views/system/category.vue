<template>
    <div class="board-content">
        <div class="board-header">
            <div class="board-search">
                <div class="search-item">
                    <el-input v-model="filterText" placeholder="请输入关键字进行过滤" size="small" clearable></el-input>
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
        <div class="flex">
            <div class="board-main board-card" style="height: calc(100vh - 254px)">
                <div class="main-tree">
                    <el-tree
                        class="filter-tree"
                        :data="trees" highlight-current
                        :props="defaultProps"
                        default-expand-all :expand-on-click-node="false"
                        :filter-node-method="filterNode"
                        ref="tree">
                        <div class="tree-node" slot-scope="{ node, data }">
                            <div class="tree-node-title">【{{ data.sort }}】{{ data.label }}</div>
                            <div class="button-box">
                                <el-button icon="fa fa-edit" type="text" title="修改" @click="edit(data)"></el-button>
                                <el-button icon="fa fa-trash" type="text" title="删除" class="destroy" @click="destroy(node, data.value)"></el-button>
                            </div>
                        </div>
                    </el-tree>
                </div>
            </div>
            <div class="board-main board-card" style="height: calc(100vh - 254px);margin-left: 0">
                <el-form v-if="form" :model="form" :rules="rules" ref="form"  class="board-form" label-width="80px">
                    <div class="board-item">
                        <div class="title-note"><span>* </span>为必填项</div>
                    </div>
                    <div class="board-form-item">
                    <el-form-item label="上 级：" prop="pid">
                        <el-select v-model="form.pid" size="medium" filterable placeholder="请选择上级类目">
                            <el-option
                                v-for="item in fomats"
                                :key="item.id"
                                v-html="item.title_show"
                                :label="toBlank(item.title_show)"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="名 称：" prop="title">
                        <el-input v-model="form.title" proper-class="mypopper" placeholder="请填写类目名称" size="medium" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="图 片：" class="form-thumb" prop="thumb">
                        <el-upload name="image" class="board-uploader"
                                   accept="image/*" drag
                                   :action="upload"
                                   :show-file-list="false"
                                   :on-success="uploadSuccess"
                                   :before-upload="uploadBefore">
                            <img v-if="form.thumb" :src="form.thumb" class="board-uploader-image">
                            <i v-else class="fa fa-cloud-upload board-uploader-icon"></i>
                            <div slot="tip" class="board-uploader-tip">点击或者拖动上传jpg/png文件，且不超过2M，尺寸：200x200</div>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="排 序：" prop="sort">
                        <el-input v-model="form.sort" placeholder="请填写排序" size="medium" clearable></el-input>
                    </el-form-item>
                    <el-form-item class="board-form-button">
                        <div class="dialog-footer">
                            <el-button type="primary" :loading="button.loading" :disabled="button.disable"
                                       @click="update">{{ button.text }}</el-button>
                        </div>
                    </el-form-item>
                    </div>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
import {mapState} from "vuex";
import {CategoryList, CategoryUpdate,CategoryDestroy} from '../../utils/request';

export default {
    computed: {
        ...mapState({
            upload: state => state.upload,
        }),
    },
    data: function () {
        return {
            loading: false,
            params: {page: 1, kwd: '', group: 0},
            button: {loading: false, disable: false, text: '提 交'},
            dialog: {title: '', show: false},
            form: null,
            trees: [],
            fomats: [],
            rules: {
                title: [{required: true, message: '请填写类目名称', trigger: 'blur'}],
                pid: [{required: true, message: '请选择上级类目', trigger: 'change'}],
            },
            uploadLoading: null,
            filterText: '',
            defaultProps: {children: 'children', label: 'title'},
        }
    },
    activated() {
        this.list();
        this.form = { title: '', pid: 0, sort: '', thumb: ''};
    },
    methods: {
        search(){
            this.$refs.tree.filter(this.filterText);
        },
        filterNode(value, data) {
            if (!value) return true;
            return data['label'].indexOf(value) !== -1;
        },
        async list() {
            await this.$func.verify('category.list');
            this.loading = true;
            CategoryList(this.params).then((res) => {
                if (res.status) {
                    this.$func.error(res.message);
                } else {
                    this.trees = res.data.tree;
                    this.fomats = res.data.fomat;
                }
                this.loading = false;
            }).catch((e) => {
                this.loading = false;
            });
        },
        async create() {
            await this.$func.verify('category.update');
            this.form = {
                title: '',
                pid: 0,
                sort: '',
                thumb: '',
            };
            this.$nextTick(() => {
                this.$refs['form'].clearValidate();
            });
        },
        async edit(detail) {
            await this.$func.verify('category.update');
            this.form = {
                id: detail.value,
                title: detail.label,
                pid: detail.pid,
                sort: detail.sort,
                thumb: detail.thumb,
            };
            this.$nextTick(() => {
                this.$refs['form'].clearValidate();
            });
        },
        async update() {
            await this.$func.verify('category.update');
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    this.button.disabled = true;
                    this.button.loading = true;
                    this.button.text = '提交中...';
                    CategoryUpdate(this.form).then((res) => {
                        if (res.status) {
                            this.$func.error(res.message);
                        } else {
                            this.$refs['form'].resetFields();
                            this.$func.success(res.message).then(() => {
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
        async destroy(obj,id) {
            await this.$func.verify('category.destroy');
            if(obj.childNodes.length){
                this.$func.error('抱歉，该类目存在子类目，请先删除子类目');
                return false;
            }
            this.$confirm('您确定要删除选中的该条信息吗？', '提示', {
                type: 'warning',
                confirmButtonText: '确 定',
                cancelButtonText: '取 消'
            }).then(() => {
                CategoryDestroy({id: id}).then((res) => {
                    if (res.status) {
                        this.$func.error(res.message);
                    } else {
                        this.list();
                    }
                });
            }).catch(() => {});
        },
        uploadSuccess(res, file) {
            this.uploadLoading.close();
            if (res.status) {
                this.$func.error(res.message);
            } else {
                this.form.thumb = res.data;
            }
        },
        uploadBefore(file) {
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                this.$func.error('上传的图片不能大于2M');
                return false;
            }
            this.uploadLoading = this.$loading({
                lock: true,
                spinner: 'el-icon-loading',
                text: '上传中...',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            return true;
        },
        toBlank(str){
            //把&nbsp;转成空格实体
            let data = encodeURI(str);
            data = data.replace(/&nbsp;/g,'%20');
            return decodeURI(data);
        },
    }
}
</script>
<style scoped>
.board-uploader-icon,.board-uploader-image{
    width: 80px;height: 80px;line-height: 80px;
}
.board-main{
    width: 100%;margin-top: 0;
}

.tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
}
.tree-node-icon{
    font-size: 35px;
}
.button-box .destroy{
    color: #909399;
}
.board-item{
    margin-right: 0;
}
.board-form-item{
    width: auto;
}
</style>
