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
                    <el-select v-model="params.type_id" size="small">
                        <el-option :value="0" label="全部类目" ></el-option>
                        <el-option
                            v-for="(type,i) in configs.types"
                            :key="parseInt(i)"
                            :label="type"
                            :value="parseInt(i)">
                        </el-option>
                    </el-select>
                </div>
                <div class="search-item">
                    <el-input v-model="params.kwd" placeholder="请输入用标题" size="small" clearable></el-input>
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
                <el-table-column prop="id" label="编号" width="80" align="center"></el-table-column>
                <el-table-column prop="thumb" label="封面" width="80" align="center">
                    <template slot-scope="scope">
                        <el-image class="board-table-image" :src="scope.row.thumb" :preview-src-list="[scope.row.thumb]"></el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="title" label="标题" width="250" show-overflow-tooltip></el-table-column>
                <el-table-column prop="type.title" label="类目" width="80" align="center"></el-table-column>
                <el-table-column prop="money" label="价格" width="60" align="center"></el-table-column>
                <el-table-column prop="chapter" label="章节" width="60" align="center"></el-table-column>
                <el-table-column prop="show" label="人气" width="80" align="center"></el-table-column>
                <el-table-column prop="status_text" label="状态" width="70" align="center">
                    <template slot-scope="scope">
                        <el-tag :type="$func.formatTag(scope.row.status + 2)">{{ scope.row.status_text }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="created_at" label="创建时间" width="160">
                    <template slot-scope="scope">
                        {{  $func.formatDateTime(scope.row.created_at) }}
                    </template>
                </el-table-column>
                <el-table-column prop="created_at" label="最近更新" width="160">
                    <template slot-scope="scope">
                        {{  $func.formatDateTime(scope.row.updated_at) }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" min-width="260">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="fa fa-edit" size="mini" plain @click="edit(scope.row)"> 编辑</el-button>
                        <el-button type="warning" icon="fa fa-sitemap" size="mini" plain  @click="chapter(scope.row.id)"> 章节</el-button>
                        <el-button type="info" icon="fa fa-trash" size="mini" plain @click="destroy(scope.row.id)"> 删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <pagination :datas="datas" @page="page"></pagination>
        <el-dialog class="board-dialog"  fullscreen :close-on-click-modal="false"
                   :close-on-press-escape="false"
                   :title="dialog.title"
                   :visible.sync="dialog.show" center>
            <el-form v-if="form" :model="form" :rules="rules" ref="form" class="board-form" label-width="120px">
                <div class="item-title">基本信息<div class="title-note"><span>* </span>为必填项</div></div>
                <div class="form-item">
                    <el-form-item label="类 目：" prop="type_id" required>
                        <el-select v-model="form.type_id" size="medium">
                            <el-option :value="0" label="选择类目" ></el-option>
                            <el-option
                                v-for="(type,i) in configs.types"
                                :key="parseInt(i)"
                                :label="type"
                                :value="parseInt(i)">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="标 题：" prop="title">
                        <el-input v-model="form.title" placeholder="请填写标题" prefix-icon="fa fa-bars" size="medium" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="封 面：" prop="thumb">
                        <el-popover
                            placement="bottom-start"
                            :disabled="form.thumb ? false : true"
                            trigger="hover">
                            <el-image class="board-thumb" :src="form.thumb"></el-image>
                            <el-input v-model="form.thumb" placeholder="请填写封面地址" prefix-icon="fa fa-image" size="medium" clearable slot="reference"></el-input>
                        </el-popover>
                    </el-form-item>
                    <el-form-item label="简 介：" prop="blurb">
                        <el-input v-model="form.blurb" type="textarea" rows="5" placeholder="请填写简介" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="价 格：" prop="money">
                        <el-input v-model="form.money" placeholder="请填写价格,0代表免费" prefix-icon="fa fa-money" size="medium" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="免 费：" prop="free">
                        <el-input v-model="form.free" placeholder="请填写免费章节数" prefix-icon="fa fa-share-alt" size="medium" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="人 气：" prop="show">
                        <el-input v-model="form.show" style="width: 50%;margin-right: 15px" placeholder="请填写人气" prefix-icon="fa fa-eye" size="medium" clearable></el-input>
                        <el-button class="rand-btn" type="primary" size="medium" @click="random">随机生产</el-button>
                    </el-form-item>
                    <el-form-item label="状 态：" prop="status">
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
                    <el-button class="close-btn" @click="dialog.show = false">关 闭</el-button>
                </span>
        </el-dialog>
        <el-dialog class="board-dialog dialog-chapter"  fullscreen :close-on-click-modal="false"
                   :close-on-press-escape="false"
                   :title="dialogChapter.title"
                   :visible.sync="dialogChapter.show" center>
            <div class="chapter">
                <div class="chapter-box">
                    <div class="title">目录({{ chapters.length }})</div>
                    <div class="chapter-item-box">
                        <div :class="formChapter && formChapter.id == chapter.id ? 'chapter-item active' : 'chapter-item'"
                             v-for="(chapter,index) in chapters" :key="index" title="点我修改" alt="点我修改"
                             @click="editChapter(chapter)">{{  chapter.title  }}</div>
                    </div>
                    <div class="chapter-create" @click="createChapter"><i class="fa fa-plus"></i> 章节</div>
                </div>
                <div class="chapter-form">
                    <el-form v-if="formChapter" :model="formChapter" :rules="ruleChapters" ref="formChapter" class="board-form" label-width="120px">
                        <div class="item-title">基本信息<div class="title-note"><span>* </span>为必填项</div></div>
                        <div class="form-item">
                            <el-form-item label="标 题：" prop="title">
                                <el-input v-model="formChapter.title" placeholder="请填写标题" prefix-icon="fa fa-bars" size="medium" clearable></el-input>
                            </el-form-item>
                            <el-form-item label="内 容：" prop="content">
                                <editor v-model="formChapter.content" :height="510"></editor>
                            </el-form-item>
                            <div style="text-align: center">
                                <el-button type="primary" :loading="button.loading" :disabled="button.disable"
                                           @click="updateChapter">{{ button.text }}</el-button>
                                <el-button v-if="formChapter.id" type="info" style="margin-left: 50px" @click="destroyChapter(formChapter.id)">删除</el-button>

                            </div>
                        </div>
                    </el-form>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {mapState} from "vuex";
import {
    ComicList,
    ComicUpdate,
    ComicLock,
    ComicActive,
    ComicDestroy,
    ComicChapter,
    ComicSave,
    ComicConfig, ComicDelete
} from '@/request/system.js';

export default {
    computed: {
        ...mapState({
            tableHeight: state => state.tableHeight,
        }),
    },
    data: function () {
        const validator = (rule, value, callback) => {
            if(value === 0){
                callback(new Error('请选择类目'))
            }
            callback();
        }
        return {
            visible: false,
            loading: false,
            datas: null,
            configs: null,
            chapters: [],
            selection: [],
            params: {page: 1, kwd: '', status: 0, type_id: 0},
            button: {loading: false, disable: false, text: '提 交'},
            dialog: {title: '', show: false},
            dialogChapter: {title: '', show: false},
            form: null,
            formChapter: null,
            rules: {
                type_id: [{required: true, message: '请选择类目', trigger: 'change'}, {validator, trigger: 'blur'}],
                title: [{required: true, message: '请填写标题', trigger: 'blur'}],
                thumb: [{required: true, message: '请填写封面图片地址', trigger: 'blur'}],
                blurb: [{required: true, message: '请填写简介', trigger: 'blur'}],
            },
            ruleChapters: {
                title: [{required: true, message: '请填写标题', trigger: 'blur'}],
                content: [{required: true, message: '请填写内容', trigger: 'blur'}],
            },
            comicId: 0,
        }
    },
    activated() {
        this.config();
        this.list();
    },
    methods: {
        config() {
            ComicConfig().then((res) => {
                if (res.status) {
                    this.$func.error(res.message);
                } else {
                    this.configs = res.data;
                }
            });
        },
        async list() {
            await this.$func.verify('comic.list');
            this.loading = true;
            ComicList(this.params).then((res) => {
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
            await this.$func.verify('comic.update');
            this.form = {
                id: 0,
                title: '',
                blurb: '',
                thumb: '',
                money: '',
                show: 0,
                free: 3,
                type_id: 0,
                status: 1,
            };
            this.dialog.title = '新增漫画';
            this.dialog.show = true;
            this.$nextTick(()=>{
                this.$refs['form'].clearValidate();
            });
        },
        async edit(detail) {
            await this.$func.verify('comic.update');
            this.form = {
                id: detail.id,
                title: detail.title,
                blurb: detail.blurb,
                money: detail.money,
                thumb: detail.thumb,
                show: detail.show,
                free: detail.free,
                type_id: detail.type_id,
                status: detail.status,
            };
            this.dialog.title = '编辑漫画';
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
                    ComicUpdate(this.form).then((res) => {
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
        multiple(e){
            this.selection = [];
            if(e.length){
                e.forEach((item) =>{
                    this.selection.push(item.id)
                })
            }
        },
        async active(){
            await this.$func.verify('comic.active');
            if(!this.selection.length){
                this.$func.error('请选择你要操作的数据'); return false;
            }
            ComicActive({id: this.selection}).then((res) => {
                if (res.status) {
                    this.$func.error(res.message);
                } else {
                    this.list();
                }
            });
        },
        async lock(){
            await this.$func.verify('comic.lock');
            if(!this.selection.length){
                this.$func.error('请选择你要操作的数据'); return false;
            }
            ComicLock({id: this.selection}).then((res) => {
                if (res.status) {
                    this.$func.error(res.message);
                } else {
                    this.list();
                }
            });
        },
        del(){
            if(!this.selection.length){
                this.$func.error('请选择你要操作的数据'); return false;
            }
            this.destroy(this.selection);
        },
        async destroy(id) {
            await this.$func.verify('comic.destroy');
            this.$confirm('您确定要删除选中的该条信息吗？', '提示', {
                type: 'warning',
                confirmButtonText: '确 定',
                cancelButtonText: '取 消'
            }).then(() => {
                ComicDestroy({id: id}).then((res) => {
                    if (res.status) {
                        this.$func.error(res.message);
                    } else {
                        this.list();
                    }
                });
            }).catch(() => {
            });
        },
        async chapter(id) {
            await this.$func.verify('comic.chapter');
            ComicChapter({id: id}).then((res) => {
                if (res.status) {
                    this.$func.error(res.message);
                } else {
                    this.chapters = res.data;
                    this.dialogChapter.title = '章节管理';
                    this.dialogChapter.show = true;
                    this.comicId = id;
                    this.createChapter();
                }
            })
        },
        createChapter() {
            this.formChapter = {
                id: 0,
                title: '',
                comic_id: this.comicId,
                content: ''
            };
            this.$nextTick(()=>{
                this.$refs['formChapter'].clearValidate();
            });
        },
        editChapter(detail) {
            this.formChapter = {
                id: detail.id,
                comic_id: detail.comic_id,
                title: detail.title,
                content: detail.content,
            };
            this.comicId = detail.comic_id;
            this.$nextTick(()=>{
                this.$refs['formChapter'].clearValidate();
            });
        },
        async updateChapter() {
            await this.$func.verify('comic.save');
            this.$refs['formChapter'].validate((valid) => {
                if (valid) {
                    this.button.disabled = true;
                    this.button.loading = true;
                    this.button.text = '提交中...';
                    ComicSave(this.formChapter).then((res) => {
                        if (res.status) {
                            this.$func.error(res.message);
                        } else {
                            this.$func.success(res.message).then(() => {
                                this.chapter(this.comicId);
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
        async destroyChapter(id) {
            await this.$func.verify('comic.delete');
            this.$confirm('您确定要删除选中的该条信息吗？', '提示', {
                type: 'warning',
                confirmButtonText: '确 定',
                cancelButtonText: '取 消'
            }).then(() => {
                ComicDelete({id: id}).then((res) => {
                    if (res.status) {
                        this.$func.error(res.message);
                    } else {
                        this.chapter(this.comicId);
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
        random(){
            this.form.show = this.$func.randNumber();
        },
    }
}
</script>
