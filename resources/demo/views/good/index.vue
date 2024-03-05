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
                <div class="search-item">
                    <el-select v-if="cates" v-model="params.cid" size="small" filterable>
                        <el-option :value="0" label="全部类目"></el-option>
                        <el-option
                            v-for="item in cates[0]['children']"
                            :key="item.value"
                            :label="item.label"
                            :value="Number(item.value)">
                        </el-option>
                    </el-select>
                </div>
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
                <el-table-column prop="id" label="编号" width="80" align="center"></el-table-column>
                <el-table-column prop="thumb" label="图片" width="90" align="center">
                    <template slot-scope="scope">
                        <el-image class="board-table-image" :src="scope.row.thumb" :preview-src-list="[scope.row.thumb]"></el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="title" label="标题" width="250" show-overflow-tooltip></el-table-column>
                <el-table-column prop="money" label="价格" width="150">
                    <template slot-scope="scope">
                        {{ scope.row.money }}元
                    </template>
                </el-table-column>
                <el-table-column prop="category.title" label="类目" width="120" align="center"></el-table-column>
                <el-table-column prop="status_text" label="状态" width="80" align="center">
                    <template slot-scope="scope">
                        <el-tag :type="$func.formatTag(scope.row.status)">{{ scope.row.status_text }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="good_text" label="推荐" width="80" align="center">
                    <template slot-scope="scope">
                        <el-tag :type="$func.formatTag(scope.row.good)">{{ scope.row.good_text }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="created_at" label="新增时间" width="160">
                    <template slot-scope="scope">
                        {{ $moment(scope.row.created_at).format('YYYY-MM-DD HH:mm:ss') }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" min-width="250">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="fa fa-edit" size="mini" plain @click="edit(scope.row.id)"> 编辑
                        </el-button>
                        <el-button type="info" icon="fa fa-trash" size="mini" plain @click="destroy(scope.row.id)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <pagination :datas="datas" @page="page"></pagination>
    </div>
</template>

<script>
import {mapState} from "vuex";
import {
    GoodList,
    GoodDestroy,
    CategoryTree,
    GoodConfig,
    GoodLock,
    GoodActive
} from '../../utils/request';

export default {
    computed: {
        ...mapState({
            tableHeight: state => state.tableHeight
        }),
    },
    data: function () {
        return {
            loading: false,
            datas: null,
            configs: null,
            slection: [],
            cates: null,
            params: {page: 1, status: 0, kwd: '', cid: 0},
        }
    },
    activated() {
        this.category();
        this.config();
        this.list();
    },
    methods: {
        config(){
            GoodConfig().then((res)=>{
                if(res.status){
                    this.$func.error(res.message);
                }else{
                    this.configs = res.data;
                }
            });
        },
        category(){
            CategoryTree({pid: 1000}).then((res)=>{
                if(res.status){
                    this.$func.error(res.message);
                }else{
                    this.cates = res.data;
                }
            });
        },
        async list() {
            await this.$func.verify('good.list');
            this.loading = true;
            GoodList(this.params).then((res) => {
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
            await this.$func.verify('good.update');
            this.$router.push({name: 'good_update'});
        },
        async edit(id) {
            await this.$func.verify('good.update');
            this.$router.push({name: 'good_update', query: {id: id}});
        },
        async destroy(id) {
            await this.$func.verify('good.destroy');
            this.$confirm('您确定要删除选中的该条信息吗？', '提示', {
                type: 'warning',
                confirmButtonText: '确 定',
                cancelButtonText: '取 消'
            }).then(() => {
                GoodDestroy({id: id}).then((res) => {
                    if (res.status) {
                        this.$func.error(res.message);
                    } else {
                        this.list();
                    }
                });
            }).catch(() => {
            });
        },
        multiple(e){
            this.slection = [];
            if(e.length){
                e.forEach((item) =>{
                    this.slection.push(item.id)
                })
            }
        },
        async active(){
            await this.$func.verify('good.update');
            if(!this.slection.length){
                this.$func.error('请选择你要操作的数据'); return false;
            }
            GoodActive({id: this.slection}).then((res) => {
                if (res.status) {
                    this.$func.error(res.message);
                } else {
                    this.list();
                }
            });
        },
        async lock(){
            await this.$func.verify('good.update');
            if(!this.slection.length){
                this.$func.error('请选择你要操作的数据'); return false;
            }
            GoodLock({id: this.slection}).then((res) => {
                if (res.status) {
                    this.$func.error(res.message);
                } else {
                    this.list();
                }
            });
        },
        del(){
            if(!this.slection.length){
                this.$func.error('请选择你要操作的数据'); return false;
            }
            this.destroy(this.slection);
        },
        search() {
            this.params.page = 1;
            this.list();
        },
        page(val) {
            this.params.page = val;
            this.list();
        },
    }
}
</script>
<style scoped>
    .board-table-image{
        width: 65px;
    }
</style>
