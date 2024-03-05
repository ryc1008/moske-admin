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
                <div class="search-item" v-if="groups">
                    <el-select v-model="params.group_id" style="width: 120px" filterable size="small" @change="group">
                        <el-option :value="0" label="全部分组" ></el-option>
                        <el-option
                            v-for="(group,i) in groups"
                            :key="parseInt(i)"
                            :label="group.title"
                            :value="parseInt(group.id)">
                        </el-option>
                    </el-select>
                </div>
                <div class="search-item" v-if="types">
                    <el-select v-model="params.type_id" style="width: 120px" filterable size="small">
                        <el-option :value="0" label="全部类目" ></el-option>
                        <el-option
                            v-for="(type,i) in types"
                            :key="parseInt(i)"
                            :label="type.title"
                            :value="parseInt(type.id)">
                        </el-option>
                    </el-select>
                </div>
                <div class="search-item" v-if="configs">
                    <el-select v-model="params.topic_id" style="width: 120px" filterable size="small">
                        <el-option :value="0" label="全部专题" ></el-option>
                        <el-option
                            v-for="(topic,i) in configs.topics"
                            :key="parseInt(i)"
                            :label="topic"
                            :value="parseInt(i)">
                        </el-option>
                    </el-select>
                </div>
                <div class="search-item">
                    <el-input v-model="params.tag" placeholder="请输入标签" style="width: 150px" size="small" clearable></el-input>
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
                      v-loading="loading" @sort-change="sortable"
                      :data="datas.data" border @selection-change="multiple">
                <el-table-column type="selection" width="45" align="center"></el-table-column>
                <el-table-column prop="id" label="编号" width="80" align="center"></el-table-column>
                <el-table-column prop="thumb" label="封面" width="80" align="center">
                    <template slot-scope="scope">
                        <el-image class="board-table-image" :src="scope.row.thumb" :preview-src-list="[scope.row.thumb]"></el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="title" label="标题" width="200" show-overflow-tooltip></el-table-column>
                <el-table-column prop="time" label="时长" width="80" align="center"></el-table-column>
                <el-table-column prop="group.title" label="作者" width="80" align="center"></el-table-column>
                <el-table-column prop="type.title" label="作者" width="80" align="center"></el-table-column>
                <el-table-column prop="topic.title" label="专题" width="80" align="center"></el-table-column>
                <el-table-column prop="money" label="价格" width="80" align="center" sortable="custom"></el-table-column>
                <el-table-column prop="sale" label="销售" width="80" align="center" sortable="custom"></el-table-column>
                <el-table-column prop="show" label="人气" width="80" align="center" sortable="custom"></el-table-column>
                <el-table-column prop="hits" label="点赞" width="80" align="center" sortable="custom"></el-table-column>
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
                    <el-form-item label="分 组：" prop="group_id" required>
                        <el-radio-group v-model="form.group_id" size="medium" @change="group">
                            <el-radio v-for="(group,gi) in groups" :key="gi" :label="Number(group.id)" border>{{ group.title }}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="类 目：" prop="type_id" required>
                        <el-select v-model="form.type_id" size="medium">
                            <el-option :value="0" label="请选择类目" ></el-option>
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
                    <el-form-item label="封 面：" prop="thumb">
                        <el-popover
                            placement="bottom-start"
                            :disabled="form.thumb ? false : true"
                            trigger="hover">
                            <el-image class="board-thumb" :src="form.thumb"></el-image>
                            <el-input v-model="form.thumb" placeholder="请填写封面地址" prefix-icon="fa fa-image" size="medium" clearable slot="reference"></el-input>
                        </el-popover>
                    </el-form-item>
                    <el-form-item label="资 源：" prop="target">
                        <el-input v-model="form.target" placeholder="请填写资源地址" prefix-icon="fa fa-link" size="medium" clearable></el-input>
                    </el-form-item>
                    <el-form-item v-if="form.target" class="player">
                        <player ref="player" :url="form.target" :poster="form.thumb" @time="time"></player>
                    </el-form-item>
                    <el-form-item label="时 长：" prop="time">
                        <el-input v-model="form.time" placeholder="请填写资源时长" prefix-icon="fa fa-clock-o" size="medium" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="标 签：" prop="tag">
                        <div class="pool-select">
                            <el-tag class="s-tag" type="danger" closable v-for="(item,i) in form.tag" :key="i" @close="closeTag(i)" size="medium">
                                {{ item }}
                            </el-tag>
                        </div>
                        <div class="pool-tag">
                            <span v-for="(tag, ti) in configs.tags">
                                <el-tag v-if="form.tag.find(item => item == tag)" :key="ti" class="p-tag" alt="点我选择" title="点我选择"
                                        @click="selectTag(tag)" size="medium" effect="dark">{{ tag }}</el-tag>
                                <el-tag v-else :key="ti" class="p-tag" alt="点我选择" title="点我选择"
                                        @click="selectTag(tag)" size="medium">{{ tag }}</el-tag>
                            </span>
                        </div>
                    </el-form-item>
                    <el-form-item label="专 题：" prop="topic_id">
                        <el-select v-model="form.topic_id" size="medium">
                            <el-option :value="0" label="请选择专题" ></el-option>
                            <el-option
                                v-for="(topic,ti) in configs.topics"
                                :key="ti"
                                :label="topic"
                                :value="Number(ti)">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="价 格：" prop="money">
                        <el-input v-model="form.money" placeholder="请填写价格，0代表免费" prefix-icon="fa fa-money" size="medium" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="质 量：" prop="quality">
                        <el-radio-group v-model="form.quality" size="medium">
                            <el-radio v-for="(quality,index) in configs.qualitys"
                                      :key="index"
                                      :label="quality" border>{{ quality }}
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="人 气：" prop="show">
                        <el-input v-model="form.show" style="width: 50%;margin-right: 15px" placeholder="请填写人气值" prefix-icon="fa fa-eye" size="medium" clearable></el-input>
                        <el-button class="rand-btn" type="primary" size="medium" @click="form.show = $func.randNumber()">随机生产</el-button>
                    </el-form-item>
                    <el-form-item label="点 赞：" prop="hits">
                        <el-input v-model="form.hits" style="width: 50%;margin-right: 15px" placeholder="请填写点赞量" prefix-icon="fa fa-thumbs-o-up" size="medium" clearable></el-input>
                        <el-button class="rand-btn" type="primary" size="medium" @click="form.hits = $func.randNumber(50, 1000)">随机生产</el-button>
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
    VideoList,
    VideoUpdate,
    VideoLock,
    VideoActive,
    VideoGood,
    VideoDestroy,
    VideoConfig
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
                callback(new Error('请选择作者'))
            }
            callback();
        }
        return {
            loading: false,
            datas: null,
            configs: null,
            selection: [],
            params: {page: 1, kwd: '', status: 0, group_id: 0, topic_id: 0, type_id: 0, tag: '', sort: '', order: ''},
            button: {loading: false, disable: false, text: '提 交'},
            dialog: {title: '', show: false},
            form: null,
            groups: null,
            types: null,
            topics: null,
            rules: {
                type_id: [{required: true, message: '请选择作者', trigger: 'change'}, {validator, trigger: 'blur'}],
                title: [{required: true, message: '请填写标题', trigger: 'blur'}],
                thumb: [{required: true, message: '请填写封面图片地址', trigger: 'blur'}],
                target: [{required: true, message: '请填写播放地址', trigger: 'blur'}],
                time: [{required: true, message: '请填写时长', trigger: 'blur'}],
                tag: [{required: true, message: '请选择标签', trigger: 'blur'}],
            },
        }
    },
    activated() {
        this.config();
        this.list();
    },
    methods: {
        config() {
            VideoConfig().then((res) => {
                if (res.status) {
                    this.$func.error(res.message);
                } else {
                    this.configs = res.data;
                    this.groups = this.configs.types;
                    this.types = this.configs.types[0]['child'];
                }
            });
        },
        async list() {
            await this.$func.verify('video.list');
            this.loading = true;
            VideoList(this.params).then((res) => {
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
            await this.$func.verify('video.update');
            this.form = {
                id: 0,
                title: '',
                target: '',
                time: '',
                tag: [],
                thumb: '',
                quality: '高清',
                money: 0,
                group_id: this.groups[0]['id'],
                topic_id: 0,
                type_id: 0,
                show: 0,
                hits: 0,
                status: 1,
            };
            this.dialog.title = '新增视频';
            this.dialog.show = true;
            this.$nextTick(()=>{
                this.$refs['form'].clearValidate();
            });
        },
        async edit(detail) {
            await this.$func.verify('video.update');
            this.group(detail.group_id)
            this.form = {
                id: detail.id,
                title: detail.title,
                target: detail.target,
                thumb: detail.thumb,
                show: detail.show,
                time: detail.time,
                tag: detail.tag,
                quality: detail.quality,
                group_id: detail.group_id,
                topic_id: detail.topic_id,
                money: detail.money,
                hits: detail.hits,
                type_id: detail.type_id,
                status: detail.status,
            };
            this.dialog.title = '编辑视频';
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
                    VideoUpdate(this.form).then((res) => {
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
        async good(){
            await this.$func.verify('video.good');
            if(!this.selection.length){
                this.$func.error('请选择你要操作的数据'); return false;
            }
            VideoGood({id: this.selection}).then((res) => {
                if (res.status) {
                    this.$func.error(res.message);
                } else {
                    this.list();
                }
            });
        },
        async active(){
            await this.$func.verify('video.active');
            if(!this.selection.length){
                this.$func.error('请选择你要操作的数据'); return false;
            }
            VideoActive({id: this.selection}).then((res) => {
                if (res.status) {
                    this.$func.error(res.message);
                } else {
                    this.list();
                }
            });
        },
        async lock(){
            await this.$func.verify('video.lock');
            if(!this.selection.length){
                this.$func.error('请选择你要操作的数据'); return false;
            }
            VideoLock({id: this.selection}).then((res) => {
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
            await this.$func.verify('video.destroy');
            this.$confirm('您确定要删除选中的该条信息吗？', '提示', {
                type: 'warning',
                confirmButtonText: '确 定',
                cancelButtonText: '取 消'
            }).then(() => {
                VideoDestroy({id: id}).then((res) => {
                    if (res.status) {
                        this.$func.error(res.message);
                    } else {
                        this.list();
                    }
                });
            }).catch(() => {
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
        search() {
            this.params.page = 1;
            this.list();
        },
        page(val) {
            this.params.page = val;
            this.list();
        },
        selectTag(name){
            if(this.form.tag.length >= 5){
                return this.$func.error('最多只能选择5个标签');
            }
            if(!this.form.tag.includes(name)){
                this.form.tag.push(name)
            }
        },
        closeTag(index){
            this.form.tag.splice(index, 1);
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
        sortable(e){
            this.params.sort = e.prop;
            this.params.order = e.order;
            this.list();
        }
    }
}
</script>
<style scoped>
.pool-select{
    border: 1px solid #dfeffd;min-height:52px;border-radius: 5px;background-color: #fbfdff;
    margin-bottom: 15px;padding: 5px 15px;
}
.pool-tag{
    padding: 10px 15px;background-color: #fbfdff;border-radius: 5px;
    border: 1px solid #dfeffd;white-space: normal;font-size: 14px;
    color: #2f9de2;min-height: 50px;overflow: hidden;
}
.pool-tag .p-tag, .pool-select .s-tag{
    margin-right: 15px;cursor: pointer
}
.pool-tag .p-tag:hover{
    color: #fff;
    background-color: #2461ef;
    border-color: #2461ef;

}
</style>
