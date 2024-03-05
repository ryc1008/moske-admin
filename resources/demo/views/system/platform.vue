<template>
    <div class="board-content">
        <div class="board-body">
            <div class="board-header">
                <div class="board-title">
                    {{ title }}
                </div>
                <div class="board-tabs">
                    <el-tabs v-if="configs" v-model="params.status" type="card" @tab-click="list">
                        <el-tab-pane label="全部" name="0"></el-tab-pane>
                        <el-tab-pane v-for="(item,index) in configs.status" :label="item" :key="index" :name="index.toString()"></el-tab-pane>
                    </el-tabs>
                </div>
            </div>
            <div class="board-main">
                <div class="board-handle">
                    <div class="board-button">
                        <el-button type="warning" icon="fa fa-refresh" @click="list()" size="small"> 刷新</el-button>
                        <el-button type="primary" icon="fa fa-plus" @click="create()" size="small"> 新增</el-button>
                    </div>
                    <div class="board-search">
                        <div class="search-item">
                            <el-input v-model="params.kwd" placeholder="请输入平台名称" size="medium" clearable
                                      @input="search()">
                                <el-button slot="append" type="success" @click="search()"
                                           icon="el-icon-search"></el-button>
                            </el-input>
                        </div>
                    </div>
                </div>
                <el-table v-if="datas" element-loading-text="努力加载中..."
                          element-loading-spinner="el-icon-loading"
                          ref="multipleHandle"
                          tooltip-effect="dark"
                          v-loading="loading"
                          :data="datas.data" border>
                    <el-table-column prop="id" label="编号" width="65" align="center"></el-table-column>
                    <el-table-column prop="thumb" label="图片" width="120" align="center">
                        <template slot-scope="scope">
                            <el-image class="board-table-image" :src="scope.row.thumb" :preview-src-list="[scope.row.thumb]"></el-image>
                        </template>
                    </el-table-column>
                    <el-table-column prop="title" label="名称" width="150"  align="center"></el-table-column>
                    <el-table-column prop="status_text" label="状态" width="80" align="center">
                        <template slot-scope="scope">
                            <el-tag :type="$func.formatTag(scope.row.status)">{{ scope.row.status_text }}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="created_at" label="创建时间" width="160">
                        <template slot-scope="scope">
                            {{ $func.formatDateTime(scope.row.created_at) }}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" fixed="right" min-width="160">
                        <template slot-scope="scope">
                            <el-button type="primary" icon="fa fa-edit" size="mini" plain @click="edit(scope.row)"> 编辑
                            </el-button>
                            <el-button type="info" icon="fa fa-trash" size="mini" plain @click="destroy(scope.row.id)">
                                删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <pagination :datas="datas" @page="page"></pagination>
            </div>
        </div>

        <el-dialog class="board-dialog" fullscreen :close-on-click-modal="false"
                   :close-on-press-escape="false"
                   :title="dialog.title"
                   :visible.sync="dialog.show" center>
            <el-form v-if="form" :model="form" :rules="rules" ref="form" class="board-form" label-width="120px">
                <el-form-item label="名 称：" prop="title">
                    <el-input v-model="form.title" placeholder="请填写平台名称" size="medium" clearable></el-input>
                </el-form-item>
                <el-form-item label="图 片：" prop="thumb">
                    <el-input placeholder="请填写或者上传图片" size="medium" v-model="form.thumb">
                        <template slot="prepend">
                            <el-popover
                                placement="bottom"
                                trigger="click">
                                <img :src="form.thumb" height="200" alt=""/>
                                <el-button slot="reference"><i class="fa fa-image"></i></el-button>
                            </el-popover>
                        </template>
                        <template slot="append">
                            <el-upload name="image" accept="image/*" class="board-input-uploader"
                                       :action="upload"
                                       :show-file-list="false"
                                       :on-success="uploadSuccess"
                                       :before-upload="uploadBefore">
                                <i class="fa fa-cloud-upload board-upload-button-input"></i>
                            </el-upload>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item label="状 态：" prop="status">
                    <el-radio-group v-model="form.status" size="medium">
                        <el-radio  v-for="(item,index) in configs.status"
                                   :key="index"
                                   :label="Number(index)" border>{{ item }}</el-radio>
                    </el-radio-group>
                </el-form-item>
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
import {PlatformList, PlatformConfig, PlatformUpdate, PlatformDestroy} from '../../utils/request';

export default {
    computed: {
        ...mapState({
            title: state => state.title,
            upload: state => state.upload,
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
            rules: {
                title: [{required: true, message: '请填写平台名称', trigger: 'blur'}],
                thumb: [{required: true, message: '请上传平台图片', trigger: 'blur'}],
            },
        }
    },
    activated() {
        this.config();
        this.list();
    },
    methods: {
        config() {
            PlatformConfig().then((res) => {
                if (res.status) {
                    this.$func.error(res.message);
                } else {
                    this.configs = res.data;
                }
            });
        },
        async list() {
            await this.$func.verify('platform.list');
            this.loading = true;
            PlatformList(this.params).then((res) => {
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
            await this.$func.verify('platform.update');
            this.form = {
                title: '',
                thumb: '',
                status: 1,
            };
            this.dialog.title = '新增平台';
            this.dialog.show = true;
            this.$nextTick(()=>{
                this.$refs['form'].clearValidate();
            });
        },
        async edit(detail) {
            await this.$func.verify('platform.update');
            this.form = {
                id: detail.id,
                title: detail.title,
                status: detail.status,
                thumb: detail.thumb,
            };
            this.dialog.title = '编辑平台';
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
                    PlatformUpdate(this.form).then((res) => {
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
            await this.$func.verify('platform.destroy');
            this.$confirm('您确定要删除选中的该条信息吗？', '提示', {
                type: 'warning',
                confirmButtonText: '确 定',
                cancelButtonText: '取 消'
            }).then(() => {
                PlatformDestroy({id: id}).then((res) => {
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
            this.params.page = 1;
            this.list();
        },
        page(val) {
            this.params.page = val;
            this.list();
        },
        uploadSuccess(res, file) {
            this.uploadLoading.close();
            if (res.status) {
                this.$func.error(res.message);
            } else {
                this.form.thumb = res.data.path;
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
    }
}
</script>
<style>
    .board-table-image{
        width: 70px;height: 35px;
    }
    .board-table-image img{
        width: 70px;height: 35px;
    }
</style>
