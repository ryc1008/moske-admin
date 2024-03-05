<template>
    <div>
        <el-tooltip effect="dark" content="插入图片" placement="top">
            <el-popover placement="bottom"
                        trigger="click" v-model="visible">
                <div class="upload-type" @click="openDialog(false)">插入网络图片</div>
                <div class="upload-type" @click="openDialog(true)">上传本地图片</div>
                <div class="el-tooltip el-tiptap-editor__command-button el-popover__reference" slot="reference">
                    <i class="el-icon-picture"></i>
                </div>
            </el-popover>
        </el-tooltip>
        <el-dialog class="board-dialog image-dialog" append-to-body
                   :close-on-press-escape="false" :close-on-click-modal="false" :modal="true"
                   :title="dialog.title"
                   :visible.sync="dialog.show" center @close="closeDialog">
            <el-upload
                name="image"
                accept="image/*" drag multiple
                :action="upload"
                :show-file-list="false"
                :on-success="uploadSuccess"
                :before-upload="uploadBefore">
                <div class="cimage-upload">
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                </div>
            </el-upload>
        </el-dialog>
    </div>
</template>

<script>
import {mapState} from "vuex";
import * as imageConversion from "image-conversion";

export default {
    name: "custom_image",
    computed: {
        ...mapState({
            upload: state => state.upload,
        }),
    },
    data: function () {
        return {
            dialog: {title: '上传本地图片', show: false},
            visible: false
        }
    },
    methods: {
        openDialog(local) {
            this.visible = false;
            if(local){
                this.dialog.show = true;
            }else{
                this.$prompt('', '插入网络图片', {
                    confirmButtonText: '插入',
                    cancelButtonText: '取消',
                    closeOnClickModal: false,
                    customClass: 'insert-img',
                    inputType: 'textarea',
                    inputPlaceholder: '输入网络图片链接,多个链接一行一个',
                    beforeClose: (action, instance, done) => {
                        if(action == 'confirm'){
                            let value = instance._data.inputValue.trim();
                            if(!value){
                                return this.$func.error('请输入网络图片链接');
                            }
                            let images = value.split("\n");
                            let error = '';
                            images.filter((image) => {
                                if(!this.$func.isImage(image)){
                                    error = image;
                                }
                            })
                            if(error){
                                return this.$func.error('"' + error + '"格式错误');
                            }
                            done();
                        }else{
                            done();
                        }
                    }
                }).then(({ value }) => {
                    let images = value.trim().split("\n");
                    images.forEach((image) => {
                        if(image){
                            this.$emit("insert", image);
                        }
                    })
                }).catch(() => {});
            }
        },
        uploadSuccess(res, file) {
            if (res.status) {
                this.$func.error(res.message);
            } else {
                this.dialog.show = false;
                this.$emit("insert", res.data);
            }
        },
        async uploadBefore(file) {
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                this.$func.error('上传的图片不能大于2M');
                return false;
            }
            return await imageConversion.compressAccurately(file, 100);
        },
        closeDialog() {
            this.dialog.show = false;
        },
    }
};
</script>
<style lang="css">
.upload-type{
    line-height: 30px;color: #000;text-align: center;
    cursor: pointer;
}
.upload-type:hover{
    color: #2461ef
}
.el-icon-picture {
    font-size: 18px;
    color: #000;
}
.image-dialog .el-dialog__body {
    padding: 0 !important;
    height: auto !important;
}

.image-dialog .el-dialog__header {
    padding-top: 15px !important;
    border-bottom: none !important;
}

.image-dialog .el-upload {
    width: 100%;
    padding-bottom: 100px;
}

.image-dialog .el-icon-upload {
    color: #2461EF !important;
    font-size: 50px !important;
}

.image-dialog .el-upload-dragger {
    width: 100%;
    height: 100%;
    border: none;
    text-align: center !important;
}

.image-dialog .cimage-upload {
    width: 100%;
    text-align: center;
}
.insert-img{
    width: calc(40vw) !important;
}
.insert-img textarea{
    height: 150px !important;
}
</style>
