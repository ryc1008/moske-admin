<template>
    <div class="board-content">
        <el-form v-if="form" ref="form" :rules="rules" :model="form" class="board-form" label-width="120px">
            <div class="board-main board-card">
                <div class="board-item">基本信息
                    <div class="title-note"><span>* </span>为必填项</div>
                </div>
                <div class="board-form-item">
                    <el-form-item v-if="cates" label="类 目：" prop="cid">
                        <el-select v-model="form.cid" size="medium" filterable placeholder="请选择类目">
                            <el-option
                                v-for="item in cates[0]['children']"
                                :key="item.value"
                                :label="item.label"
                                :value="Number(item.value)">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="标 题：" prop="title">
                        <el-input v-model="form.title" placeholder="请填写标题" size="medium" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="价 格：" prop="money">
                        <el-input v-model="form.money" placeholder="请填写价格，单位元" size="medium" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="成 分：" prop="core">
                        <el-input v-model="form.core" type="textarea" rows="5" placeholder="请填写核心成分" size="medium"
                                  clearable></el-input>
                    </el-form-item>
                    <el-form-item label="图 片：" style="margin-bottom: 15px" prop="image">
                        <el-button type="primary" icon="fa fa-plus" @click="add()" size="mini"> 添加</el-button>
                        <div style="float: right;font-size: 12px">提示：第一张图片默认为封面图，可通过拖动图片进行调整</div>
                    </el-form-item>
                    <el-form-item>
                        <draggable v-model="form.image" handle=".materiel-thumb">
                            <div class="materiel" v-for="(mitem, mkey) in form.image" :key="mkey">
                                <div class="materiel-thumb">
                                    <el-upload name="image" class="materiel-uploader"
                                               accept="image/*"
                                               :action="upload"
                                               :show-file-list="false"
                                               :on-success="(res, file) => {return uploadSuccess(res, file, mkey)}"
                                               :before-upload="uploadBefore">
                                        <img v-if="mitem.m" :src="mitem.m" class="materiel-thumb-img"/>
                                        <i v-else class="fa fa-cloud-upload materiel-uploader-icon"></i>
                                    </el-upload>
                                    <div v-if="mkey == 0" class="materiel-tag"><span>封 面</span></div>
                                    <i v-if="mkey > 0" class="fa fa-times close" @click="remove(mkey)"></i>
                                </div>
                            </div>
                        </draggable>
                    </el-form-item>
                </div>
            </div>
            <div class="board-main board-card">
                <div class="board-item">其他信息</div>
                <div class="board-form-item">
                    <el-form-item label="详 细：" prop="content">
                        <editor v-model="form.content"></editor>
                    </el-form-item>
                    <el-form-item label="标 签：" prop="tags">
                        <el-input v-model="form.tags" placeholder="请填写标签，多个用|隔开，如：天然 | 安全 | 敏感肌" size="medium"
                                  clearable></el-input>
                    </el-form-item>
                    <el-form-item v-if="configs" label="推 荐：" prop="good">
                        <el-radio-group v-model="form.good" size="medium">
                            <el-radio v-for="(item,index) in configs.good"
                                      :key="index"
                                      :label="Number(index)" border>{{ item }}
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item v-if="configs" label="状 态：" prop="status">
                        <el-radio-group v-model="form.status" size="medium">
                            <el-radio v-for="(item,index) in configs.status"
                                      :key="index"
                                      :label="Number(index)" border>{{ item }}
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>
                </div>
                <el-form-item class="board-form-button">
                    <el-button type="primary" :loading="button.loading" :disabled="button.disable"
                               @click="update">{{ button.text }}
                    </el-button>
                    <el-button @click="$router.back()" class="back">返 回</el-button>
                </el-form-item>

            </div>
        </el-form>
    </div>
</template>
<script>
import {
    GoodInfo,
    GoodUpdate,
    CategoryTree,
    GoodConfig
} from "../../utils/request";
import draggable from 'vuedraggable';
import {mapState} from "vuex";
import * as imageConversion from 'image-conversion';

export default {
    components: {draggable},
    computed: {
        ...mapState({
            upload: state => state.upload,
        }),
    },
    data() {
        return {
            editor: null,
            uploadLoading: null,
            loading: false,
            button: {loading: false, disable: false, text: '提 交'},
            form: null,
            title: '',
            rules: {
                cid: [{required: true, message: '请选择类目', trigger: 'change'}],
                title: [{required: true, message: '请填写标题', trigger: 'blur'}],
                money: [{required: true, message: '请填写价格', trigger: 'money'}],
                image: [{required: true, message: '请上传图片', trigger: 'blur'}],
                core: [{required: true, message: '请填写核心成分', trigger: 'blur'}],
                content: [{required: true, message: '请填写商品详情', trigger: 'blur'}],
            },
            cates: null,
            configs: null,
        }
    },
    activated() {
        this.form = {
            id: 0,
            title: '',
            thumb: '',
            image: [{m: ''}],
            cid: '',
            status: 1,
            money: '',
            tags: '',
            core: '',
            good: 1,
            content: '',
        };
        this.$store.dispatch('setState', {active: '/good'});
        this.category();
        this.config();
        this.ready();
    },
    methods: {
        category() {
            CategoryTree().then((res) => {
                if (res.status) {
                    this.$func.error(res.message);
                } else {
                    this.cates = res.data;
                }
            });
        },
        config() {
            GoodConfig().then((res) => {
                if (res.status) {
                    this.$func.error(res.message);
                } else {
                    this.configs = res.data;
                }
            });
        },
        ready() {
            let id = this.$route.query.id;
            if (id) {
                this.form.id = id;
                this.info(id);
            }
            this.$nextTick(() => {
                this.$refs['form'].clearValidate();
            });
        },
        info(id) {
            GoodInfo({id: id}).then((res) => {
                if (res.status) {
                    this.$func.error(res.message);
                } else {
                    let detail = res.data;
                    this.form = {
                        id: detail.id,
                        title: detail.title,
                        content: detail.content,
                        cid: detail.cid,
                        status: detail.status,
                        image: detail.image,
                        good: detail.good,
                        money: detail.money ? detail.money : '',
                        tags: detail.tags,
                        core: detail.core
                    };
                }
            });
        },
        async update() {
            await this.$func.verify('good.update');
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    this.button.disabled = true;
                    this.button.loading = true;
                    this.button.text = '提交中...';
                    GoodUpdate(this.form).then((res) => {
                        if (res.status) {
                            this.$func.error(res.message);
                        } else {
                            this.$func.success(res.message).then(() => {
                                this.$router.back();
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
        uploadSuccess(res, file, index) {
            this.uploadLoading.close();
            if (res.status) {
                this.$func.error(res.message);
            } else {
                this.form.image[index]['m'] = res.data
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
        add() {
            this.form.image.push({m: ''});
        },
        remove(i) {
            this.form.image.splice(i, 1);
        },
    },
}
</script>
<style scoped>
.materiel-thumb {
    display: inline-block;
    border: 1px dashed #ebebeb;
    margin-bottom: 15px;
    border-radius: 5px;
    padding: 15px 300px 0px 65px;
    position: relative;
    cursor: pointer;
    overflow: hidden;
}

.materiel-tag {
    /* 右上角飘带 */
    background-color: #2461EF; /* 左上角飘带的背景颜色 */
    overflow: hidden;
    white-space: nowrap; /* 文字不换行*/
    position: absolute; /* 绝对定位 */
    left: -50px;
    top: 0;
    transform: rotate(-45deg); /* 旋转45°*/
    box-shadow: 0 0 10px #888; /* 飘带的阴影*/
    line-height: 30px;
}

.materiel-tag span {
    color: #fff;
    padding: 5px 50px;
    text-align: center;
    font-size: 12px;
}

.materiel .materiel-uploader-icon {
    font-size: 20px;
    border-radius: 6px;
    color: #2461EF;
    background: #F2FBFF;
    margin-bottom: 15px;
    height: 100px;
    line-height: 100px;
    width: 150px;
}

.materiel .materiel-thumb-img {
    font-size: 20px;
    border-radius: 6px;
    color: #2461EF;
    background: #F2FBFF;
    height: 100px;
    line-height: 100px;
    width: 150px;
}

.close {
    position: absolute;
    font-size: 16px;
    top: 10px;
    right: 10px;
}

.close:hover {
    color: #2461EF;
}
</style>
