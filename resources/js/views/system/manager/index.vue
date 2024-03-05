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
                <div class="search-item" v-if="roles">
                    <el-select v-model="params.role_id" size="small">
                        <el-option :value="0" label="全部角色" ></el-option>
                        <el-option
                            v-for="(role,i) in roles"
                            :key="parseInt(i)"
                            :label="role"
                            :value="parseInt(i)">
                        </el-option>
                    </el-select>
                </div>
                <div class="search-item">
                    <el-input v-model="params.kwd" placeholder="请输入用户名/昵称" size="small" clearable></el-input>
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
                <el-table-column prop="thumb" label="头像" width="70" align="center">
                    <template slot-scope="scope">
                        <el-image class="board-table-image" :src="'/avatar/a' + scope.row.avatar + '.jpg'" :preview-src-list="['/avatar/a' + scope.row.avatar + '.jpg']"></el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="username" label="用户名" width="150"></el-table-column>
                <el-table-column prop="nickname" label="昵称" width="150"></el-table-column>
                <el-table-column prop="role.title" label="角色" width="140"></el-table-column>
                <el-table-column prop="status_text" label="状态" width="80" align="center">
                    <template slot-scope="scope">
                        <el-tag :type="$func.formatTag(scope.row.status + 2)">{{ scope.row.status_text }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="created_at" label="创建时间" width="160">
                    <template slot-scope="scope">
                        {{  $func.formatDateTime(scope.row.created_at) }}
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
        <el-dialog class="board-dialog"  fullscreen :close-on-click-modal="false"
                   :close-on-press-escape="false"
                   :title="dialog.title"
                   :visible.sync="dialog.show" center>
            <el-form v-if="form" :model="form" :rules="rules" ref="form" class="board-form" label-width="120px">
                <div class="item-title">基本信息<div class="title-note"><span>* </span>为必填项</div></div>
                <div class="form-item">
                    <el-form-item label="角 色：" prop="role_id" required>
                        <el-select v-model="form.role_id" size="medium">
                            <el-option :value="0" label="选择角色" ></el-option>
                            <el-option
                                v-for="(role,i) in roles"
                                :key="parseInt(i)"
                                :label="role"
                                :value="parseInt(i)">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="账 户：" prop="username">
                        <el-input v-model="form.username" placeholder="请填写管理员账户" prefix-icon="fa fa-user" size="medium" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="昵 称：" prop="nickname">
                        <el-input v-model="form.nickname" placeholder="请填写管理员昵称" prefix-icon="fa fa-user-md" size="medium" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="密 码：" prop="password" v-if="form.id == 0">
                        <el-input v-model="form.password" placeholder="请填写管理员密码，默认123456" prefix-icon="fa fa-unlock-alt" size="medium" clearable
                                  onfocus="this.type='password'"></el-input>
                    </el-form-item>
                    <el-form-item label="密 码：" prop="password" v-else>
                        <el-input v-model="form.password" placeholder="请填写管理员密码，不填写表示不修改密码" prefix-icon="fa fa-unlock-alt" size="medium" clearable
                                  onfocus="this.type='password'"></el-input>
                    </el-form-item>
                    <el-form-item label="头 像：" prop="avatar">
                        <div class="form-avatar">
                            <img v-for="(avatar,a) in avatars" :src="$func.assetsFile('avatar/a'+ avatar +'.jpg')"
                                 :class="avatar == form.avatar ? 'active' : ''" @click="select(avatar)" :key="a" alt="">
                        </div>
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
    </div>
</template>

<script>
import {mapState} from "vuex";
import {
    ManagerList,
    ManagerUpdate,
    ManagerLock,
    ManagerActive,
    ManagerDestroy,
    RoleTree,ManagerConfig
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
                callback(new Error('请选择角色'))
            }
            callback();
        }
        return {
            loading: false,
            datas: null,
            configs: null,
            roles: null,
            selection: [],
            params: {page: 1, kwd: '', status: 0, role_id: 0},
            button: {loading: false, disable: false, text: '提 交'},
            dialog: {title: '', show: false},
            avatars: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
            form: null,
            rules: {
                role_id: [{required: true, message: '请选择角色', trigger: 'change'}, {validator, trigger: 'blur'}],
                username: [{required: true, message: '请填写管理员账户', trigger: 'blur'}],
                nickname: [{required: true, message: '请填写管理员昵称', trigger: 'blur'}],
            },
        }
    },
    activated() {
        this.role();
        this.config();
        this.list();
    },
    methods: {
        config() {
            ManagerConfig().then((res) => {
                if (res.status) {
                    this.$func.error(res.message);
                } else {
                    this.configs = res.data;
                }
            });
        },
        role(){
            RoleTree().then((res) => {
                if (res.status === 0) {
                    this.roles = res.data;
                }
            });
        },
        async list() {
            await this.$func.verify('manager.list');
            this.loading = true;
            ManagerList(this.params).then((res) => {
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
            await this.$func.verify('manager.update');
            this.form = {
                id: 0,
                username: '',
                nickname: '',
                avatar: 0,
                role_id: 0,
                password: '',
                status: 1,
            };
            this.dialog.title = '新增管理员';
            this.dialog.show = true;
            this.$nextTick(()=>{
                this.$refs['form'].clearValidate();
            });
        },
        async edit(detail) {
            await this.$func.verify('manager.update');
            this.form = {
                id: detail.id,
                nickname: detail.nickname,
                avatar: detail.avatar,
                username: detail.username,
                role_id: detail.role_id,
                password: '',
                status: detail.status,
            };
            this.dialog.title = '编辑管理员';
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
                    ManagerUpdate(this.form).then((res) => {
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
            await this.$func.verify('manager.active');
            if(!this.selection.length){
                this.$func.error('请选择你要操作的数据'); return false;
            }
            ManagerActive({id: this.selection}).then((res) => {
                if (res.status) {
                    this.$func.error(res.message);
                } else {
                    this.list();
                }
            });
        },
        async lock(){
            await this.$func.verify('manager.lock');
            if(!this.selection.length){
                this.$func.error('请选择你要操作的数据'); return false;
            }
            ManagerLock({id: this.selection}).then((res) => {
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
            await this.$func.verify('manager.destroy');
            this.$confirm('您确定要删除选中的该条信息吗？', '提示', {
                type: 'warning',
                confirmButtonText: '确 定',
                cancelButtonText: '取 消'
            }).then(() => {
                ManagerDestroy({id: id}).then((res) => {
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
        select(a){
            this.form.avatar = a;
        }
    }
}
</script>
<style scoped>
    .form-avatar{
        display: flex
    }
    .form-avatar img{
        height: 40px;width: 40px;border-radius: 50%;margin-right: 15px;cursor: pointer;
    }
    .form-avatar img.active{
        border: 3px solid #2461EF; padding: 2px;
    }
    .board-table-image{
        height: 35px;width: 35px;border-radius: 50%;
    }
</style>
