<template>
    <div class="board-content">
        <div class="board-header">
            <div class="board-search">
                <div class="search-item">
                    <el-input v-model="params.kwd" placeholder="请输入标签名称" size="small" clearable></el-input>
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
        <div class="board-main" style="max-height: calc(100vh - 250px);height: calc(100vh - 207px);overflow-y: auto">
            <el-tag class="tag" :key="tag.id" v-for="tag in datas" closable @close="destroy(tag.id)">{{tag.name}}</el-tag>
        </div>
        <el-dialog class="board-dialog"  :close-on-click-modal="false"
                   :close-on-press-escape="false"
                   :title="dialog.title"
                   :visible.sync="dialog.show" center>
            <el-form v-if="form" :model="form" :rules="rules" ref="form" class="board-form" label-width="120px">
                <div class="item-title">基本信息<div class="title-note"><span>* </span>为必填项</div></div>
                <div class="form-item">
                    <el-form-item label="名 称：" prop="name" required>
                        <el-input v-model="form.name" type="textarea" rows="8" placeholder="请填写名称，多个名称一行一个"></el-input>
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
import {TagList, TagUpdate, TagDestroy} from '@/request/system.js';

export default {
    data(){
        const validator = (rule, value, callback) => {
            if(!value.trim()){
                callback(new Error('请填写标签名称'))
            }
            callback();
        }
        return {
            datas: null,
            params: {kwd: ''},
            button: {loading: false, disable: false, text: '提 交'},
            dialog: {title: '', show: false},
            form: null,
            rules: {
                name: [{validator, trigger: 'blur'}],
            },
        }
    },
    activated(){
        this.list();
    },
    methods: {
        async list() {
            await this.$func.verify('tag.list');
            TagList(this.params).then((res) => {
                if (res.status) {
                    this.$func.error(res.message);
                } else {
                    this.datas = res.data;
                }
            });
        },
        async create() {
            await this.$func.verify('tag.update');
            this.form = {name: ''};
            this.dialog.title = '新增标签';
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
                    TagUpdate(this.form).then((res) => {
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
            await this.$func.verify('tag.destroy');
            this.$confirm('您确定要删除选中的该条信息吗？', '提示', {
                type: 'warning',
                confirmButtonText: '确 定',
                cancelButtonText: '取 消'
            }).then(() => {
                TagDestroy({id: id}).then((res) => {
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
            this.list();
        },
    }
}
</script>
<style scoped>
    .board-main{
        padding: 15px;
    }
    .tag{
        margin: 0 15px 15px 0;
    }
    .add-tag {
        width: 100px;
    }
</style>
