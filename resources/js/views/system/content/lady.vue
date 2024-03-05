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
<!--                <div class="search-item" v-if="configs">-->
<!--                    <el-select v-model="params.type_id" style="width: 120px" filterable size="small">-->
<!--                        <el-option :value="0" label="全部类目" ></el-option>-->
<!--                        <el-option-->
<!--                            v-for="(type,i) in configs.types"-->
<!--                            :key="parseInt(i)"-->
<!--                            :label="type"-->
<!--                            :value="parseInt(i)">-->
<!--                        </el-option>-->
<!--                    </el-select>-->
<!--                </div>-->
                <div class="search-item">
                    <el-input v-model="params.kwd" placeholder="请输入用标题\省份\城市" size="small" clearable></el-input>
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
                <el-table-column prop="thumb" label="封面" width="80" align="center">
                    <template slot-scope="scope">
                        <el-image fit="cover" class="board-table-image" :src="scope.row.thumb" :preview-src-list="[scope.row.thumb]"></el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="title" label="标题" width="250" show-overflow-tooltip></el-table-column>
<!--                <el-table-column prop="type.title" label="类目" width="80" align="center"></el-table-column>-->
                <el-table-column prop="province" label="地区" width="150"  show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{ scope.row.province }}-{{ scope.row.city }}
                    </template>
                </el-table-column>
                <el-table-column prop="money" label="价格" width="80" align="center"></el-table-column>
                <el-table-column prop="sale" label="销售" width="80" align="center"></el-table-column>
                <el-table-column prop="show" label="人气" width="80" align="center"></el-table-column>
                <el-table-column prop="favor" label="收藏" width="80" align="center"></el-table-column>
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
                   :title="dialog.title"
                   :visible.sync="dialog.show" center>
            <el-form v-if="form" :model="form" :rules="rules" ref="form" class="board-form" label-width="120px">
                <div class="item-title">基本信息<div class="title-note"><span>* </span>为必填项</div></div>
                <div class="form-item">
<!--                    <el-form-item label="类 目：" prop="type_id" required>-->
<!--                        <el-select v-model="form.type_id" size="medium">-->
<!--                            <el-option :value="0" label="选择类目" ></el-option>-->
<!--                            <el-option-->
<!--                                v-for="(type,i) in configs.types"-->
<!--                                :key="parseInt(i)"-->
<!--                                :label="type"-->
<!--                                :value="parseInt(i)">-->
<!--                            </el-option>-->
<!--                        </el-select>-->
<!--                    </el-form-item>-->
                    <el-form-item label="地 区：" prop="area">
                        <el-cascader
                            v-model="form.area"
                            :options="area"
                            @change="selectArea"></el-cascader>
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
                    <el-form-item label="图 集：" prop="content">
                        <div class="board-photo">
                            <el-input v-model="form.content" type="textarea" style="width: 80%" @blur="image" rows="8" placeholder="请填写图集，多个图片地址一行一个"></el-input>
                            <el-image v-if="images" alt="点我预览所有图集" title="点我预览所有图集" :src="images[0]" :preview-src-list="images"></el-image>
                        </div>
                    </el-form-item>
                    <el-form-item label="价 格：" prop="money">
                        <el-input v-model="form.money" placeholder="请填写价格" prefix-icon="fa fa-money" size="medium" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="联 系：" prop="contact">
                        <el-input v-model="form.contact" placeholder="请填写联系方式" prefix-icon="fa fa-mobile" size="medium" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="介 绍：" prop="blurb">
                        <el-input v-model="form.blurb" type="textarea" rows="6" placeholder="请填写介绍"></el-input>
                    </el-form-item>
                    <el-form-item label="项 目：" prop="project">
                        <el-input v-model="form.project" placeholder="请填写项目" prefix-icon="fa fa-windows" size="medium" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="营 业：" prop="time">
                        <el-input v-model="form.time" placeholder="请填写营业时间" prefix-icon="fa fa-clock-o" size="medium" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="消 费：" prop="price">
                        <el-input v-model="form.price" placeholder="请填写消费水平" prefix-icon="fa fa-cny" size="medium" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="年 龄：" prop="age">
                        <el-input v-model="form.age" placeholder="请填写年龄" prefix-icon="fa fa-heart-o" size="medium" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="数 量：" prop="number">
                        <el-input v-model="form.number" placeholder="请填写数量" prefix-icon="fa fa-terminal" size="medium" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="人 气：" prop="show">
                        <el-input v-model="form.show" style="width: 50%;margin-right: 15px" placeholder="请填写人气值" prefix-icon="fa fa-eye" size="medium" clearable></el-input>
                        <el-button class="rand-btn" type="primary" size="medium" @click="random()">随机生产</el-button>
                    </el-form-item>
                    <el-form-item label="收 藏：" prop="favor">
                        <el-input v-model="form.favor" style="width: 50%;margin-right: 15px" placeholder="请填写收藏量" prefix-icon="fa fa-star-half-full" size="medium" clearable></el-input>
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
import AreaList from '@/utils/area.js';
import {
    LadyList,
    LadyUpdate,
    LadyLock,
    LadyActive,
    LadyDestroy,
    LadyGood,
    LadyConfig
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
                // type_id: [{required: true, message: '请选择类目', trigger: 'change'}, {validator, trigger: 'blur'}],
                title: [{required: true, message: '请填写标题', trigger: 'blur'}],
                thumb: [{required: true, message: '请填写封面图片地址', trigger: 'blur'}],
                content: [{required: true, message: '请填写图集地址', trigger: 'blur'}],
                province: [{required: true, message: '请选择省份', trigger: 'change'}],
                area: [{required: true, message: '请选择城市', trigger: 'change'}],
                money: [{required: true, message: '请填写价格', trigger: 'blur'}],
                contact: [{required: true, message: '请填写联系方式', trigger: 'blur'}],

            },
            area: [],
            images: null,
        }
    },
    activated() {
        this.region();
        this.config();
        this.list();
    },
    methods: {
        region() {
            for (let pkey in AreaList.province_list) {
                let child = [];
                for (let ckey in AreaList.city_list) {
                    if (pkey.substring(0,1) === '9' && ckey.substring(0,1) === '9') {
                        //海外特殊处理
                        child.push({value: AreaList.city_list[ckey], label: AreaList.city_list[ckey]})
                    } else {
                        if (pkey.substring(0,2) === ckey.substring(0,2)) {
                            child.push({value: AreaList.city_list[ckey], label: AreaList.city_list[ckey]})
                        }
                    }
                }
                this.area.push({value: AreaList.province_list[pkey], label: AreaList.province_list[pkey], children: child});
            }
        },
        config() {
            LadyConfig().then((res) => {
                if (res.status) {
                    this.$func.error(res.message);
                } else {
                    this.configs = res.data;
                }
            });
        },
        async list() {
            await this.$func.verify('lady.list');
            this.loading = true;
            LadyList(this.params).then((res) => {
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
            await this.$func.verify('lady.update');
            this.form = {
                id: 0,
                title: '',
                project: '',
                time: '',
                content: '',
                thumb: '',
                type_id: 0,
                age: '',
                price: '',
                number: '',
                blurb: '',
                show: 0,
                province: '',
                city: '',
                contact: '',
                area: '',
                money: '',
                favor: 0,
                status: 1,
            };
            this.dialog.title = '新增楼凤';
            this.dialog.show = true;
            this.$nextTick(()=>{
                this.$refs['form'].clearValidate();
            });
        },
        async edit(detail) {
            await this.$func.verify('lady.update');
            this.form = {
                id: detail.id,
                title: detail.title,
                content: detail.content,
                thumb: detail.thumb,
                show: detail.show,
                time: detail.time,
                project: detail.project,
                favor: detail.favor,
                age: detail.age,
                blurb: detail.blurb,
                number: detail.number,
                province: detail.province,
                contact: detail.contact,
                city: detail.city,
                area: [detail.province, detail.city],
                price: detail.price,
                money: detail.money,
                type_id: detail.type_id,
                status: detail.status,
            };
            this.images = detail.content.split("\n");
            this.dialog.title = '编辑楼凤';
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
                    LadyUpdate(this.form).then((res) => {
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
            await this.$func.verify('lady.active');
            if(!this.selection.length){
                this.$func.error('请选择你要操作的数据'); return false;
            }
            LadyActive({id: this.selection}).then((res) => {
                if (res.status) {
                    this.$func.error(res.message);
                } else {
                    this.list();
                }
            });
        },
        async lock(){
            await this.$func.verify('lady.lock');
            if(!this.selection.length){
                this.$func.error('请选择你要操作的数据'); return false;
            }
            LadyLock({id: this.selection}).then((res) => {
                if (res.status) {
                    this.$func.error(res.message);
                } else {
                    this.list();
                }
            });
        },
        async good(){
            await this.$func.verify('lady.good');
            if(!this.selection.length){
                this.$func.error('请选择你要操作的数据'); return false;
            }
            LadyGood({id: this.selection}).then((res) => {
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
            await this.$func.verify('lady.destroy');
            this.$confirm('您确定要删除选中的该条信息吗？', '提示', {
                type: 'warning',
                confirmButtonText: '确 定',
                cancelButtonText: '取 消'
            }).then(() => {
                LadyDestroy({id: id}).then((res) => {
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
        selectArea(e){
            this.form.province = e[0];
            this.form.city = e[1];
        },
        image(){
            let data = this.form.content.trim();
            if(data){
                this.images = data.split("\n");
            }
        },
        random(){
            this.form.show = this.$func.randNumber();
            this.form.favor = this.$func.randNumber(10, 150);
        }
    }
}
</script>


