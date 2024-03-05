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
                <div class="search-item" v-if="configs">
                    <el-select v-model="params.group" size="small" filterable>
                        <el-option :value="0" label="全部分组"></el-option>
                        <el-option
                            v-for="(item,index) in configs.group"
                            :key="index"
                            :label="item"
                            :value="index">
                        </el-option>
                    </el-select>
                </div>
                <div class="search-item">
                    <el-input v-model="params.kwd" placeholder="请输入标题" size="small" clearable></el-input>
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
                <el-table-column prop="id" label="编号" width="65" align="center"></el-table-column>
                <el-table-column prop="title" label="标题" width="150"></el-table-column>
                <el-table-column prop="group_text" label="位置" width="80" align="center"></el-table-column>
                <el-table-column prop="width" label="宽度" width="80" align="center"></el-table-column>
                <el-table-column prop="height" label="高度" width="80" align="center"></el-table-column>
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
                <el-table-column label="操作" fixed="right" min-width="260">
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
                    <el-form-item label="位 置：" prop="group" required>
                        <el-select v-model="form.group" size="medium">
                            <el-option v-for="(g,i) in configs.group" :key="i" :label="g"
                                       :value="parseInt(i)"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="标 题：" prop="title">
                        <el-input v-model="form.title" placeholder="请填写标题" size="medium" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="尺 寸：">
                        <el-input v-model="form.width" style="width: 150px" placeholder="宽度,单位cm" size="medium"
                                  clearable></el-input>
                        X
                        <el-input v-model="form.height" style="width: 150px" placeholder="高度,单位cm" size="medium"
                                  clearable></el-input>
                    </el-form-item>
                    <el-form-item label="物 料：" style="margin-bottom: 15px">
                        <el-button type="primary" icon="fa fa-plus" @click="add()" size="mini"> 添加</el-button>
                        <em class="materiel-notice"><i class="fa fa-bell"></i> 拖动图片位置可以对物料进行排序</em>
                    </el-form-item>
                    <el-form-item>
                        <draggable v-model="form.materiel" handle=".materiel-thumb">
                            <div class="materiel" v-for="(materiel, mi) in form.materiel" :key="mi">
                                <div class="materiel-info">
                                    <el-input v-model="materiel.title" placeholder="请填写物料标题" size="mini"
                                              clearable></el-input>
                                    <el-input v-model="materiel.brief" placeholder="请填写物料描述" size="mini"
                                              clearable></el-input>
                                    <el-input v-model="materiel.link" placeholder="请填写物料地址" size="mini"
                                              clearable></el-input>
                                </div>
                                <div class="materiel-thumb">
                                    <el-upload name="image" class="materiel-uploader"
                                               accept="image/*"
                                               :action="upload"
                                               :show-file-list="false"
                                               :on-success="(res, file) => {return uploadSuccess(res, file, mi)}"
                                               :before-upload="uploadBefore">
                                        <img v-if="materiel.thumb" :src="materiel.thumb" class="materiel-thumb-img"/>
                                        <i v-else class="fa fa-cloud-upload materiel-uploader-icon"></i>
                                    </el-upload>
                                    <i v-if="mi > 0" class="fa fa-times close" @click="remove(mi)"></i>
                                </div>
                            </div>
                        </draggable>
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
import draggable from 'vuedraggable';
import {
    AdsenseList,
    AdsenseConfig,
    AdsenseUpdate,
    AdsenseLock,
    AdsenseActive,
    AdsenseDestroy,
} from '../../utils/request';
import * as imageConversion from "image-conversion";

export default {
    components: {
        draggable,
    },
    computed: {
        ...mapState({
            tableHeight: state => state.tableHeight,
            upload: state => state.upload,
        }),
    },
    data: function () {
        return {
            loading: false,
            datas: null,
            configs: null,
            params: {page: 1, kwd: '', status: 0, group: 0},
            button: {loading: false, disable: false, text: '提 交'},
            dialog: {title: '', show: false},
            form: null,
            slection: [],
            rules: {
                title: [{required: true, message: '请填写标题', trigger: 'blur'}],
            },
            uploadLoading: null,
        }
    },
    activated() {
        this.config();
        this.list();
    },
    methods: {
        config() {
            AdsenseConfig().then((res) => {
                if (res.status) {
                    this.$func.error(res.message);
                } else {
                    this.configs = res.data;
                }
            });
        },
        async list() {
            await this.$func.verify('adsense.list');
            this.loading = true;
            AdsenseList(this.params).then((res) => {
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
            await this.$func.verify('adsense.update');
            this.form = {
                group: 1,
                title: '',
                width: '',
                height: '',
                status: 1,
                materiel: [
                    {thumb: '', title: '', brief: '', link: '', target: '0', nofollow: '0'}
                ],
            };
            this.dialog.title = '新增广告';
            this.dialog.show = true;
            this.$nextTick(() => {
                this.$refs['form'].clearValidate();
            });
        },
        async edit(detail) {
            await this.$func.verify('adsense.update');
            this.form = {
                id: detail.id,
                group: detail.group,
                title: detail.title,
                width: detail.width,
                height: detail.height,
                materiel: detail.materiel,
                status: detail.status,
            };
            this.dialog.title = '编辑广告';
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
                    AdsenseUpdate(this.form).then((res) => {
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
            this.slection = [];
            if (e.length) {
                e.forEach((item) => {
                    this.slection.push(item.id)
                })
            }
        },
        async active() {
            await this.$func.verify('adsense.update');
            if (!this.slection.length) {
                this.$func.error('请选择你要操作的数据');
                return false;
            }
            AdsenseActive({id: this.slection}).then((res) => {
                if (res.status) {
                    this.$func.error(res.message);
                } else {
                    this.list();
                }
            });
        },
        async lock() {
            await this.$func.verify('adsense.update');
            if (!this.slection.length) {
                this.$func.error('请选择你要操作的数据');
                return false;
            }
            AdsenseLock({id: this.slection}).then((res) => {
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
        async destroy(id) {
            await this.$func.verify('adsense.destroy');
            this.$confirm('您确定要删除选中的该条信息吗？', '提示', {
                type: 'warning',
                confirmButtonText: '确 定',
                cancelButtonText: '取 消'
            }).then(() => {
                AdsenseDestroy({id: id}).then((res) => {
                    if (res.status) {
                        this.$func.error(res.message);
                    } else {
                        this.list();
                    }
                });
            }).catch(() => {
            });
        },
        add() {
            this.form.materiel.push({thumb: '', title: '', brief: '', link: '', target: '0', nofollow: '0'});
        },
        remove(i) {
            this.form.materiel.splice(i, 1);
        },
        uploadSuccess(res, file, mi) {
            this.uploadLoading.close();
            if (res.status) {
                this.$func.error(res.message);
            } else {
                this.form.materiel[mi].thumb = res.data
            }
        },
        async uploadBefore(file) {
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
            return await imageConversion.compressAccurately(file, 100);
        },
        search() {
            this.params.page = 1;
            this.list();
        },
        page(val) {
            this.params.page = val;
            this.list();
        }
    }
}
</script>
<style scoped>
.materiel {
    border: 1px dashed #ebebeb;
    margin-bottom: 15px;
    border-radius: 5px;
    width: 100%;
    padding: 10px 0 10px 15px;
    position: relative;
    cursor: pointer;
    display: flex;
    align-items: center;
}

.materiel-notice {
    color: #F56C6C;
    font-size: 12px;
    float: right;
    position: relative;
    top: 15px;
}

.materiel-info {
    width: 100%;
}

.materiel-thumb {
    width: 250px;
}

.materiel .materiel-info .info-item {
    display: inline-block;
}

.materiel .materiel-info .el-input {
    margin-bottom: 5px;
}

.materiel .materiel-uploader {
    text-align: center;
}

.materiel .materiel-uploader-icon, .materiel .materiel-thumb-img {
    font-size: 28px;
    border-radius: 6px;
    color: #2461EF;
    background: #F2FBFF;
    height: 100px;
    line-height: 100px;
    width: 150px;
    margin-top: 15px;
}

.close {
    position: absolute;
    font-size: 16px;
    top: 5px;
    right: 5px;
}

.close:hover {
    color: #2461EF;
}

</style>
