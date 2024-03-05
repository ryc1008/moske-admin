<template>
    <div class="board-content">
        <div class="board-header">
            <div class="board-tabs">
                <el-form v-if="form" :model="form" class="board-form" ref="form" label-width="120px">
                    <el-tabs v-model="active" type="card">
                        <el-tab-pane label="基本设置" name="first">

                            <div class="board-form-item">
                                <el-form-item label="网站名称：" prop="web_name">
                                    <el-input v-model="form.web_name" placeholder="网站/小程序名称" size="medium"></el-input>
                                </el-form-item>
                                <el-form-item label="开屏图片：" class="form-thumb" prop="applet_ping">
                                    <div class="board-uploader">
                                        <el-upload name="image" class="board-uploader"
                                                   accept="image/*" drag
                                                   :action="upload"
                                                   :show-file-list="false"
                                                   :on-success="(res, file) => {return uploadSuccess(res, file, 'applet_ping')}"
                                                   :before-upload="uploadBefore">
                                            <img v-if="form.applet_ping" :src="form.applet_ping"
                                                 class="board-uploader-image applet_share">
                                            <i v-else class="fa fa-cloud-upload board-uploader-icon applet_share"></i>
                                            <div slot="tip" class="board-uploader-tip">点击或者拖动上传jpg/png文件，且不超过2M</div>
                                        </el-upload>
                                    </div>
                                </el-form-item>
                                <el-form-item label="滚动通知：" prop="notice_msg">
                                    <el-input v-model="form.notice_msg" placeholder="滚动通知" size="medium"></el-input>
                                </el-form-item>
                                <el-form-item label="通知跳转：" prop="notice_link">
                                    <el-input v-model="form.notice_link" placeholder="通知跳转小程序地址"
                                              size="medium"></el-input>
                                </el-form-item>
                                <el-form-item label="分享图片：" class="form-thumb" prop="applet_share">
                                    <div class="board-uploader">
                                        <el-upload name="image" class="board-uploader"
                                                   accept="image/*" drag
                                                   :action="upload"
                                                   :show-file-list="false"
                                                   :on-success="(res, file) => {return uploadSuccess(res, file, 'applet_share')}"
                                                   :before-upload="uploadBefore">
                                            <img v-if="form.applet_share" :src="form.applet_share"
                                                 class="board-uploader-image applet_share">
                                            <i v-else class="fa fa-cloud-upload board-uploader-icon applet_share"></i>
                                            <div slot="tip" class="board-uploader-tip">点击或者拖动上传jpg/png文件，且不超过2M</div>
                                        </el-upload>
                                    </div>
                                </el-form-item>
                                <el-form-item label="合作文案：" prop="cooper_text">
                                    <el-input v-model="form.cooper_text" type="textarea" placeholder="合作文案"
                                              size="medium"></el-input>
                                </el-form-item>
                                <el-form-item label="后台分页：" prop="limit">
                                    <el-input v-model="form.limit" placeholder="后台内容分页数据数量" size="medium"></el-input>
                                </el-form-item>
                                <el-form-item label="版权信息：" prop="copyright">
                                    <el-input v-model="form.copyright" placeholder="版权信息" size="medium"></el-input>
                                </el-form-item>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="安全设置" name="second">
                            <div class="board-form-item">
                                <el-form-item label="小程序ID：" prop="applet_id">
                                    <el-input v-model="form.applet_id" placeholder="小程序ID" size="medium"></el-input>
                                </el-form-item>
                                <el-form-item label="小程序密钥：" prop="applet_key">
                                    <el-input v-model="form.applet_key" placeholder="小程序密钥" size="medium"></el-input>
                                </el-form-item>
                                <el-form-item label="微信商户号：" prop="applet_mch_id">
                                    <el-input v-model="form.applet_mch_id" placeholder="微信商户号" size="medium"></el-input>
                                </el-form-item>
                                <el-form-item label="支付回调：" prop="pay_notify_url">
                                    <el-input v-model="form.pay_notify_url" placeholder="支付回调" size="medium"></el-input>
                                </el-form-item>
                                <el-form-item label="微信V2密钥：" prop="v2_secret_key">
                                    <el-input v-model="form.v2_secret_key" placeholder="微信支付V2密钥"
                                              size="medium"></el-input>
                                </el-form-item>
                                <el-form-item label="微信V3密钥：" prop="v3_secret_key">
                                    <el-input v-model="form.v3_secret_key" placeholder="微信支付V3密钥"
                                              size="medium"></el-input>
                                </el-form-item>
                            </div>
                        </el-tab-pane>
                    </el-tabs>
                    <el-form-item class="board-form-button">
                        <el-button type="primary" :loading="button.loading" :disabled="button.disable"
                                   @click="update">{{ button.text }}
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>
<script>
import {mapState} from "vuex";
import {ConfigList, ConfigUpdate} from '../../utils/request';
import * as imageConversion from "image-conversion";

export default {
    computed: {
        ...mapState({
            title: state => state.title,
            upload: state => state.upload,
        }),
    },
    data() {
        return {
            loading: false,
            button: {loading: false, disable: false, text: '提 交'},
            form: null,
            active: 'first'
        }
    },
    activated() {
        this.config();
    },
    methods: {
        config() {
            this.loading = true;
            ConfigList().then((res) => {
                if (res.status) {
                    this.$func.error(res.message);
                } else {
                    this.form = res.data;
                }
                this.loading = false;
            }).catch((e) => {
                this.loading = false;
            });
        },
        async update() {
            await this.$func.verify('config.update');
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    this.button.disabled = true;
                    this.button.loading = true;
                    this.button.text = '提交中...';
                    ConfigUpdate(this.form).then((res) => {
                        if (res.status) {
                            this.$func.error(res.message);
                        } else {
                            this.$func.success(res.message);
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
        uploadSuccess(res, file, name) {
            this.uploadLoading.close();
            if (res.status) {
                this.$func.error(res.message);
            } else {
                this.form[name] = res.data;
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
    }
}
</script>
<style scoped>
.web_logo {
    width: 120px;
    height: 80px;
    line-height: 80px;
}

.web_ico {
    width: 80px;
    height: 80px;
    line-height: 80px;
}

.web_wechat {
    width: 100px;
    height: 100px;
    line-height: 100px;
}

.applet_share {
    width: 100px;
    height: 175px;
    line-height: 175px;
}

.board-form-item {
    padding-top: 0;
}
</style>
