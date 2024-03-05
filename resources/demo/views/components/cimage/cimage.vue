<template>
    <div>
        <div class="el-tooltip el-tiptap-editor__command-button el-popover__reference" @click="onClick">
            <i class="el-icon-picture"></i>
        </div>
        <el-dialog class="board-dialog image-dialog"
                   :close-on-press-escape="false" :modal="false"
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
    name: "cimage",
    computed: {
        ...mapState({
            upload: state => state.upload,
        }),
    },
    data: function () {
        return {
            dialog: {title: '上传本地图片', show: false},
        }
    },
    methods: {
        onClick(e) {
            this.dialog.show = true;
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
    padding-bottom: 60px;
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
</style>
