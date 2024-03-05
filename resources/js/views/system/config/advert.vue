<template>
    <div class="board-content">
        <div class="board-header">
            <div class="board-search">
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
                <el-table-column prop="title" label="标题" width="200" show-overflow-tooltip></el-table-column>
                <el-table-column prop="group.title" label="应用" width="100"></el-table-column>
                <el-table-column prop="type.title" label="位置" width="100"></el-table-column>
                <el-table-column prop="size" label="尺寸" width="100" align="center"></el-table-column>
                <el-table-column prop="status_text" label="状态" width="70" align="center">
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
                        <el-button type="primary" icon="fa fa-edit" size="mini" plain @click="edit(scope.row)"> 编辑</el-button>
                        <el-button type="info" icon="fa fa-trash" size="mini" plain @click="destroy(scope.row.id)">删除</el-button>
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
                <el-form-item label="应 用：" prop="group_id" required>
                    <el-radio-group v-model="form.group_id" size="medium" @change="group">
                        <el-radio v-for="(gitem,gi) in groups" :key="gi" :label="Number(gitem.id)" border>{{ gitem.title }}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="位 置：" prop="type_id" required>
                    <el-select v-model="form.type_id" size="medium">
                        <el-option :value="0" label="请选择位置" ></el-option>
                        <el-option
                            v-for="(type,ti) in types"
                            :key="ti"
                            :label="type.title"
                            :value="Number(type.id)">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="标 题：" prop="title">
                    <el-input v-model="form.title" placeholder="请填写标题" prefix-icon="fa fa-bars" size="medium" clearable></el-input>
                </el-form-item>
                <el-form-item label="尺 寸：" prop="size">
                    <el-input v-model="form.size" placeholder="请填写长宽比例,如3:4" prefix-icon="fa fa-cut" size="medium" clearable></el-input>
                </el-form-item>
                <el-form-item label="物 料：" style="margin-bottom: 15px">
                    <el-button type="primary" icon="fa fa-plus" @click="add()" size="mini"> 添加</el-button>
                    <em class="materiel-notice"><i class="fa fa-bell"></i> 拖动图片位置可以对物料进行排序</em>
                </el-form-item>
                <el-form-item>
                    <draggable v-model="form.matter" handle=".materiel-thumb">
                        <div class="materiel" v-for="(item, mi) in form.matter" :key="mi">
                            <div class="materiel-info">
                                <el-input v-model="item.title" placeholder="请填写物料标题" prefix-icon="fa fa-bars" size="medium" clearable></el-input>
                                <el-input v-model="item.thumb" placeholder="请填写物料地址:图片地址" prefix-icon="fa fa-image" size="medium" clearable></el-input>
                                <el-input v-model="item.link" placeholder="请填写物料指向:跳转链接" prefix-icon="fa fa-link" size="medium" clearable></el-input>
                                <div class="info-item">
                                    <el-radio-group v-model="item.target" size="medium">
                                        <el-radio label="0" border>原窗口</el-radio>
                                        <el-radio label="1" border>新窗口</el-radio>
                                    </el-radio-group>
                                </div>
                            </div>
                            <div class="materiel-thumb">
                                <el-image v-if="item.thumb" class="materiel-image" :src="item.thumb" :preview-src-list="[item.thumb]"></el-image>
                                <el-image v-else class="materiel-image">
                                    <div slot="error" class="image-slot">
                                        <i class="fa fa-image"></i>
                                    </div>
                                </el-image>
                                <i v-if="mi > 0" class="fa fa-times close" @click="remove(mi)"></i>
                            </div>
                        </div>
                    </draggable>
                </el-form-item>
                <el-form-item label="状 态：" prop="status">
                    <el-radio-group v-model="form.status" size="medium">
                        <el-radio v-for="(item,index) in configs.status"
                                  :key="index"
                                  :label="Number(index)" border>{{ item }}
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
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
import {AdvertList, AdvertConfig, AdvertUpdate, AdvertLock, AdvertActive, AdvertDestroy} from '@/request/system.js';

export default {
    components: {
        draggable,
    },
    computed: {
        ...mapState({
            tableHeight: state => state.tableHeight,
        }),
    },
    data: function () {
        const validator = (rule, value, callback) => {
            if(value === 0){
                callback(new Error('请选择位置'))
            }
            callback();
        }
        return {
            loading: false,
            datas: null,
            configs: null,
            groups: null,
            types: null,
            selection: [],
            params: {page: 1, kwd: '', status: 0},
            button: {loading: false, disable: false, text: '提 交'},
            dialog: {title: '', show: false},
            form: null,
            rules: {
                type_id: [{validator, trigger: ['blur', 'change']}],
                title: [{required: true, message: '请填写标题', trigger: 'blur'}],
            },
        }
    },
    activated() {
        this.config();
        this.list();
    },
    methods: {
        config() {
            AdvertConfig().then((res) => {
                if (res.status) {
                    this.$func.error(res.message);
                } else {
                    this.configs = res.data;
                    this.groups = this.configs.types;
                    this.types = this.configs.types[0]['child'];
                }
            });
        },
        group(id){
            this.groups.forEach((item) => {
                if(item.id == id){
                    this.types = item['child'];
                    if(this.form) this.form.type_id = 0;
                }
            })
        },
        async list() {
            await this.$func.verify('advert.list');
            this.loading = true;
            AdvertList(this.params).then((res) => {
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
            await this.$func.verify('advert.update');
            this.form = {
                id: 0,
                title: '',
                group_id: this.groups[0]['id'],
                type_id: 0,
                size: '',
                status: 1,
                matter: [
                    {title: '', thumb: '', link: '', target: '0'}
                ],
            };
            this.dialog.title = '新增广告';
            this.dialog.show = true;
            this.$nextTick(() => {
                this.$refs['form'].clearValidate();
            });
        },
        async edit(detail) {
            await this.$func.verify('advert.update');
            this.group(detail.group_id);
            this.form = {
                id: detail.id,
                group_id: detail.group_id,
                type_id: detail.type_id,
                size: detail.size,
                title: detail.title,
                matter: detail.matter,
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
                    AdvertUpdate(this.form).then((res) => {
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
        async lock() {
            await this.$func.verify('advert.lock');
            if(!this.selection.length){
                this.$func.error('请选择你要操作的数据'); return false;
            }
            AdvertLock({id: this.selection}).then((res) => {
                if (res.status) {
                    this.$func.error(res.message);
                } else {
                    this.list();
                }
            });
        },
        async active() {
            await this.$func.verify('advert.active');
            if(!this.selection.length){
                this.$func.error('请选择你要操作的数据'); return false;
            }
            AdvertActive({id: this.selection}).then((res) => {
                if (res.status) {
                    this.$func.error(res.message);
                } else {
                    this.list();
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
        del(){
            if(!this.selection.length){
                this.$func.error('请选择你要操作的数据'); return false;
            }
            this.destroy(this.selection);
        },
        async destroy(id) {
            await this.$func.verify('advert.destroy');
            this.$confirm('您确定要删除选中的该条信息吗？', '提示', {
                type: 'warning',
                confirmButtonText: '确 定',
                cancelButtonText: '取 消'
            }).then(() => {
                AdvertDestroy({id: id}).then((res) => {
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
            this.form.matter.push({title: '', thumb: '', link: '', target: '0'});
        },
        remove(i){
            this.form.matter.splice(i,1);
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
    .materiel{
        border: 1px dashed #ebebeb;margin-bottom: 15px;border-radius: 5px;width: 100%;
        padding: 10px 0 10px 15px;position: relative;align-items: center;align-content: space-around;
        display: flex;
    }
    .materiel-notice{
        color: #F56C6C;font-size: 12px;float: right;position: relative;top:15px;font-style: normal;
    }
    .materiel-thumb{
        width: 550px;cursor: pointer;
        text-align: center;
    }
    .materiel .materiel-info .info-item{
        display: inline-block;
    }
    .materiel .fa-image{
        font-size: 20px;line-height: 100px;color: #0BB4C8;
    }
    .materiel .materiel-image{
        border-radius: 8px;
        background: #ebedf0;
        width: 320px;
        height: 100px;
    }
    .materiel .close{
        position: absolute;font-size: 16px;
        top: 10px;right: 10px;color: #2461ef;
    }
    .materiel .close:hover{
        color: #0BB4C8;
    }
    .materiel .el-input{
        margin-bottom: 10px;
    }
</style>
