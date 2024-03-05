<template>
    <div class="board-content">
        <div class="board-header">
            <div class="board-search">
                <div class="search-item" v-if="configs">
                    <el-select v-model="params.status" style="width: 120px" size="small" filterable>
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
                    <el-select v-model="params.type_id" style="width: 120px" filterable size="small">
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
                    <el-input v-model="params.kwd" placeholder="请输入用名称" size="small" clearable></el-input>
                </div>
                <div class="search-item">
                    <el-button type="primary" @click="search()" size="small" icon="el-icon-search">搜索</el-button>
                </div>
            </div>
            <div class="board-handle">
                <el-button type="warning" icon="fa fa-refresh" @click="list()" size="small"> 刷新</el-button>
                <el-button type="primary" icon="fa fa-plus" @click="create()" size="small"> 新增</el-button>
                <el-button type="good" icon="fa fa-thumbs-up" @click="good()" size="small"> 推荐</el-button>
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
                <el-table-column prop="avatar" label="头像" width="80" align="center">
                    <template slot-scope="scope">
                        <el-image fit="cover" class="board-table-image" :src="scope.row.avatar" :preview-src-list="[scope.row.avatar]"></el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="名称" width="150" show-overflow-tooltip></el-table-column>
                <el-table-column prop="type.title" label="类目" width="80" align="center"></el-table-column>
                <el-table-column prop="time" label="时长" width="80" align="center"></el-table-column>
                <el-table-column prop="hour" label="开播" width="90" align="center">
                    <template slot-scope="scope">
                        每日{{ scope.row.hour }}
                    </template>
                </el-table-column>
                <el-table-column prop="work_text" label="直播" width="70" align="center">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.work == 0" type="danger">{{ scope.row.work_text }}</el-tag>
                        <el-tag v-if="scope.row.work == 1" type="success">{{ scope.row.work_text }}</el-tag>
                        <el-tag v-if="scope.row.work == 2" type="info">{{ scope.row.work_text }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="show" label="人气" width="80" align="center"></el-table-column>
                <el-table-column prop="hits" label="点赞" width="80" align="center"></el-table-column>
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
                <el-table-column label="操作" fixed="right" min-width="260">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="fa fa-edit" size="mini" plain @click="edit(scope.row)"> 编辑</el-button>
                        <el-button type="info" icon="fa fa-trash" size="mini" plain @click="destroy(scope.row.id)"> 删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <pagination :datas="datas" @page="page"></pagination>
        <el-dialog class="board-dialog"  fullscreen :close-on-click-modal="false"
                   :close-on-press-escape="false"
                   :title="dialog.title" @close="closeDialog"
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
                    <el-form-item label="名 称：" prop="name">
                        <el-input v-model="form.name" placeholder="请填写名称" prefix-icon="fa fa-user" size="medium" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="标 题：" prop="title">
                        <el-input v-model="form.title" placeholder="请填写标题" prefix-icon="fa fa-bars" size="medium" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="头 像：" prop="avatar">
                        <el-popover
                            placement="bottom-start"
                            :disabled="form.avatar ? false : true"
                            trigger="hover">
                            <el-image class="board-thumb" :src="form.avatar"></el-image>
                            <el-input v-model="form.avatar" placeholder="请填写头像地址" prefix-icon="fa fa-image" size="medium" clearable slot="reference"></el-input>
                        </el-popover>
                    </el-form-item>
                    <el-form-item label="资 源：" prop="target">
                        <el-input v-model="form.target" placeholder="请填写资源地址" prefix-icon="fa fa-link" size="medium" clearable></el-input>
                    </el-form-item>
                    <el-form-item v-if="form.target" class="player">
                        <player ref="player" :url="form.target" :poster="form.avatar" @time="time"></player>
                    </el-form-item>
                    <el-form-item label="时 长：" prop="time">
                        <el-input v-model="form.time" placeholder="请填写资源时长" prefix-icon="fa fa-clock-o" size="medium" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="开 播：" prop="hour">
                        <el-time-select v-model="form.hour" prefix-icon="fa fa-calendar-minus-o"
                            :picker-options="{start: '08:00', step: '00:05', end: '20:30'}" size="medium"
                            placeholder="请填写每日开播时间">
                        </el-time-select>
                    </el-form-item>
                    <el-form-item label="人 气：" prop="show">
                        <el-input v-model="form.show" style="width: 50%;margin-right: 15px" placeholder="请填写人气值" prefix-icon="fa fa-eye" size="medium" clearable></el-input>
                        <el-button class="rand-btn" type="primary" size="medium" @click="form.show = $func.randNumber()">随机生产</el-button>
                    </el-form-item>
                    <el-form-item label="点 赞：" prop="hits">
                        <el-input v-model="form.hits" style="width: 50%;margin-right: 15px" placeholder="请填写点赞量" prefix-icon="fa fa-thumbs-o-up" size="medium" clearable></el-input>
                        <el-button class="rand-btn" type="primary" size="medium" @click="form.hits = $func.randNumber(50, 1000)">随机生产</el-button>
                    </el-form-item>
                    <el-form-item label="直 播：" prop="work">
                        <el-radio-group v-model="form.work" size="medium">
                            <el-radio v-for="(item,index) in configs.works"
                                      :key="index"
                                      :label="Number(index)" border>{{ item }}
                            </el-radio>
                        </el-radio-group>
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
    LiveList,
    LiveUpdate,
    LiveLock,
    LiveActive,
    LiveDestroy,
    LiveGood,
    LiveConfig
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
            loading: false,
            datas: null,
            configs: null,
            selection: [],
            params: {page: 1, kwd: '', status: 0, type_id: 0, tag: '', sort: '', order: ''},
            button: {loading: false, disable: false, text: '提 交'},
            dialog: {title: '', show: false},
            form: null,
            rules: {
                type_id: [{required: true, message: '请选择类目', trigger: 'change'}, {validator, trigger: 'blur'}],
                name: [{required: true, message: '请填写名称', trigger: 'blur'}],
                title: [{required: true, message: '请填写标题', trigger: 'blur'}],
                avatar: [{required: true, message: '请填写头像图片地址', trigger: 'blur'}],
                target: [{required: true, message: '请填写播放地址', trigger: 'blur'}],
            },
        }
    },
    activated() {
        this.config();
        this.list();
    },
    methods: {
        config() {
            LiveConfig().then((res) => {
                if (res.status) {
                    this.$func.error(res.message);
                } else {
                    this.configs = res.data;
                }
            });
        },
        async list() {
            await this.$func.verify('live.list');
            this.loading = true;
            LiveList(this.params).then((res) => {
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
            await this.$func.verify('live.update');
            this.form = {
                id: 0,
                name: '',
                target: '',
                title: '',
                time: '',
                hour: '12:00',
                avatar: '',
                type_id: 0,
                show: 0,
                hits: 0,
                status: 1,
                work: 0,
            };
            this.dialog.title = '新增直播';
            this.dialog.show = true;
            this.$nextTick(()=>{
                this.$refs['form'].clearValidate();
            });
        },
        async edit(detail) {
            await this.$func.verify('live.update');
            this.form = {
                id: detail.id,
                name: detail.name,
                target: detail.target,
                avatar: detail.avatar,
                title: detail.title,
                show: detail.show,
                time: detail.time,
                hour: detail.hour,
                hits: detail.hits,
                work: detail.work,
                type_id: detail.type_id,
                status: detail.status,
            };
            this.dialog.title = '编辑直播';
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
                    LiveUpdate(this.form).then((res) => {
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
            await this.$func.verify('live.active');
            if(!this.selection.length){
                this.$func.error('请选择你要操作的数据'); return false;
            }
            LiveActive({id: this.selection}).then((res) => {
                if (res.status) {
                    this.$func.error(res.message);
                } else {
                    this.list();
                }
            });
        },
        async lock(){
            await this.$func.verify('live.lock');
            if(!this.selection.length){
                this.$func.error('请选择你要操作的数据'); return false;
            }
            LiveLock({id: this.selection}).then((res) => {
                if (res.status) {
                    this.$func.error(res.message);
                } else {
                    this.list();
                }
            });
        },
        async good(){
            await this.$func.verify('live.good');
            if(!this.selection.length){
                this.$func.error('请选择你要操作的数据'); return false;
            }
            LiveGood({id: this.selection}).then((res) => {
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
            await this.$func.verify('live.destroy');
            this.$confirm('您确定要删除选中的该条信息吗？', '提示', {
                type: 'warning',
                confirmButtonText: '确 定',
                cancelButtonText: '取 消'
            }).then(() => {
                LiveDestroy({id: id}).then((res) => {
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
        closeDialog(){
            this.form = null;
            if(this.form){
                this.$refs['player'].destroy();
            }
        },
        time(t){
            this.form.time = t;
        },
    }
}
</script>
<style scoped>
.board-table-image{
    height: 45px ;width: 45px ;border-radius: 50% ;display: inline-grid;
}
</style>
