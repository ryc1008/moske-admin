<template>
    <div class="board-content">
        <div class="board-header">
            <div class="board-search">
                <div class="search-item">
                    <el-input v-model="params.kwd" placeholder="请输入文章标题" size="small" clearable></el-input>
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
                <el-button type="warning" icon="fa fa-thumbs-up" @click="recommend()" size="small"> 推荐</el-button>
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
                <el-table-column prop="thumb" label="图片" width="110" align="center">
                    <template slot-scope="scope">
                        <el-image class="board-table-image" :src="scope.row.thumb"
                                  :preview-src-list="[scope.row.thumb]"></el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="title" label="标题" width="350" show-overflow-tooltip></el-table-column>
                <el-table-column prop="status_text" label="状态" width="80" align="center">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.status == 1" type="primary" size="medium">{{
                                scope.row.status_text
                            }}
                        </el-tag>
                        <el-tag v-if="scope.row.status == 2" type="danger" size="medium">{{
                                scope.row.status_text
                            }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="good_text" label="推荐" width="80" align="center">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.good == 1" type="primary" size="medium">{{
                                scope.row.good_text
                            }}
                        </el-tag>
                        <el-tag v-if="scope.row.good == 2" type="warning" size="medium">{{
                                scope.row.good_text
                            }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="view" label="浏览量" width="80" align="center"></el-table-column>
                <el-table-column prop="created_at" label="创建时间" width="160">
                    <template slot-scope="scope">
                        {{ $moment(scope.row.created_at).format('YYYY-MM-DD HH:mm:ss') }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" min-width="270">
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
                   :visible.sync="dialog.show" center @close="closeDialog">
            <el-form v-if="form" :model="form" :rules="rules" ref="form" class="board-form" label-width="120px">
                <div class="board-item">
                    <div class="title-note"><span>* </span>为必填项</div>
                </div>
                <div class="board-form-item">
                    <el-form-item label="标 题：" prop="title">
                        <el-input v-model="form.title" placeholder="请填写标题" size="medium" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="简 介：" prop="desc">
                        <el-input v-model="form.desc" type="textarea" placeholder="请填写简介" size="medium"
                                  clearable></el-input>
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
                            <div slot="tip" class="board-uploader-tip">点击或者拖动上传jpg/png文件，且不超过2M，尺寸：320x200</div>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="视 频：" prop="video">
                        <el-input placeholder="请填写视频地址或者上传视频" size="medium" v-model="form.video" @blur="player">
                            <template slot="append">
                                <el-upload name="file" accept="mp4/*" class="board-uploader"
                                           :action="upload_file"
                                           :show-file-list="false"
                                           :on-success="uploadFileSuccess"
                                           :before-upload="uploadFileBefore">
                                    <i class="fa fa-cloud-upload board-upload-button-input"></i>
                                </el-upload>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item v-if="configs" label="推 荐：" prop="good" required>
                        <el-radio-group v-model="form.good" size="medium">
                            <el-radio v-for="(item,index) in configs.good"
                                      :key="index"
                                      :label="Number(index)" border>{{ item }}
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item v-if="configs" label="状 态：" prop="status" required>
                        <el-radio-group v-model="form.status" size="medium">
                            <el-radio v-for="(item,index) in configs.status"
                                      :key="index"
                                      :label="Number(index)" border>{{ item }}
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="" v-if="this.form.video">
                        <div class="player-container">
                            <video-player class="vjs-custom-skin" ref="myPlayer"
                                          :options="playerOptions"></video-player>
                        </div>
                    </el-form-item>
                    <!--                    <el-form-item label="内 容：" prop="content">-->
                    <!--                        <editor v-model="form.content" :height="500"></editor>-->
                    <!--                    </el-form-item>-->
                </div>
            </el-form>
            <span slot="footer" class="dialog-footer">
                    <el-button type="primary" :loading="button.loading" :disabled="button.disable"
                               @click="update">{{ button.text }}</el-button>
                    <el-button class="close-btn" @click="closeDialog">关 闭</el-button>
                </span>
        </el-dialog>
    </div>
</template>

<script>
import {mapState} from "vuex";
import {
    ArticleRecommend, ArticleList, ArticleDestroy, ArticleUpdate, ArticleConfig,
    ArticleLock,
    ArticleActive
} from '../../utils/request.js';
//https://daofan.hongmj.com/storage/uploads/file/2023-09-19/白天使用流程.mp4
import {videoPlayer} from "vue-video-player";
import "video.js/dist/video-js.css";
import "vue-video-player/src/custom-theme.css";


export default {
    computed: {
        ...mapState({
            tableHeight: state => state.tableHeight,
            upload: state => state.upload,
            upload_file: state => state.upload_file,
        }),
    },
    components: {
        videoPlayer
    },
    data: function () {
        return {
            loading: false,
            datas: null,
            configs: null,
            slection: [],
            params: {page: 1, kwd: ''},
            button: {loading: false, disable: false, text: '提 交'},
            dialog: {title: '', show: false},
            form: null,
            uploadLoading: null,
            rules: {
                title: [{required: true, message: '请填写标题', trigger: 'blur'}],
                desc: [{required: true, message: '请填写简介', trigger: 'blur'}],
                thumb: [{required: true, message: '请上传封面图', trigger: 'change'}],
                video: [{required: true, message: '请填写视频地址或者上传视频', trigger: 'blur'}],
            },
            playerOptions: {
                playbackRates: [0.5, 1.0, 1.5, 2.0], // 可选的播放速度
                autoplay: false, //如果true,浏览器准备好时开始回放。
                controls: true, //控制条
                preload: 'auto', //视频预加载
                muted: false, //默认情况下将会消除任何音频。
                loop: false, //导致视频一结束就重新开始。
                language: 'zh-CN',
                aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
                fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
                sources: [],// type: 'video/mp4', type: 'application/x-mpegURL'
                poster: "", //你的封面地址
                notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
            }
        }
    },
    activated() {
        this.config();
        this.list();
    },
    methods: {
        player() {
            let type;
            type = "video/mp4";
            if (this.form.video.includes('m3u8')) {
                type = "application/x-mpegURL";
            }
            this.$set(this.playerOptions.sources, 0, {
                type: type,
                src: this.form.video,
            })
            this.playerOptions.poster = this.form.thumb;
        },
        closeDialog() {
            this.dialog.show = false;
            this.form = null;
        },
        config() {
            ArticleConfig().then((res) => {
                if (res.status) {
                    this.$func.error(res.message);
                } else {
                    this.configs = res.data;
                }
            });
        },
        async list() {
            await this.$func.verify('article.list');
            this.loading = true;
            ArticleList(this.params).then((res) => {
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
            await this.$func.verify('article.create');
            this.form = {
                id: 0,
                title: '',
                desc: '',
                thumb: '',
                status: 1,
                video: '',
                good: 1,
                content: '',
            };
            this.dialog.title = '新增文章';
            this.dialog.show = true;
            this.$nextTick(() => {
                this.$refs['form'].clearValidate();
            });
        },
        async edit(detail) {
            await this.$func.verify('article.edit');
            this.form = {
                id: detail.id,
                title: detail.title,
                desc: detail.desc,
                thumb: detail.thumb,
                status: detail.status,
                video: detail.video,
                good: detail.good,
                content: detail.content,
            };
            this.dialog.title = '编辑文章';
            this.dialog.show = true;
            this.$nextTick(() => {
                this.$refs['form'].clearValidate();
            });
            this.player();
        },
        update() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    this.button.disabled = true;
                    this.button.loading = true;
                    this.button.text = '提交中...';
                    ArticleUpdate(this.form).then((res) => {
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
        async recommend() {
            await this.$func.verify('article.recommend');
            if (!this.slection.length) {
                this.$func.error('请选择你要操作的数据');
                return false;
            }
            ArticleRecommend({id: this.slection}).then((res) => {
                if (res.status) {
                    this.$func.error(res.message);
                } else {
                    this.list();
                }
            });
        },
        async active() {
            await this.$func.verify('article.active');
            if (!this.slection.length) {
                this.$func.error('请选择你要操作的数据');
                return false;
            }
            ArticleActive({id: this.slection}).then((res) => {
                if (res.status) {
                    this.$func.error(res.message);
                } else {
                    this.list();
                }
            });
        },
        async lock() {
            await this.$func.verify('article.lock');
            if (!this.slection.length) {
                this.$func.error('请选择你要操作的数据');
                return false;
            }
            ArticleLock({id: this.slection}).then((res) => {
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
            await this.$func.verify('question.destroy');
            this.$confirm('您确定要删除选中的该条信息吗？', '提示', {
                type: 'warning',
                confirmButtonText: '确 定',
                cancelButtonText: '取 消'
            }).then(() => {
                ArticleDestroy({id: id}).then((res) => {
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
        uploadFileSuccess(res, file) {
            this.uploadLoading.close();
            if (res.status) {
                this.$func.error(res.message);
            } else {
                this.form.video = res.data;
                this.player();
            }
        },
        uploadFileBefore(file) {
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
<style scoped>
.board-table-image {
    width: 80px;
}

.board-uploader-icon, .board-uploader-image {
    width: 160px;
    height: 100px;
    line-height: 100px;
}
</style>
