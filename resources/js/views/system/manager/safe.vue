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
                    <el-input v-model="params.kwd" placeholder="请输入用户名 / 登录IP" size="small" clearable></el-input>
                </div>
                <div class="search-item">
                    <el-button type="primary" @click="search()" size="small" icon="el-icon-search">搜索</el-button>
                </div>
            </div>
            <div class="board-handle">
                <el-button type="warning" icon="fa fa-refresh" @click="list()" size="small"> 刷新</el-button>
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
                <el-table-column prop="mobile_text" label="端口" width="80" align="center">
                    <template slot-scope="scope">
                        <el-tag :type="$func.formatTag(scope.row.mobile)">{{ scope.row.mobile_text }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="created_at" label="登录时间" width="160">
                    <template slot-scope="scope">
                        {{  $func.formatDateTime(scope.row.login_at) }}
                    </template>
                </el-table-column>
                <el-table-column prop="username" label="账户" width="80" show-overflow-tooltip></el-table-column>
                <el-table-column prop="login_ip" label="IP" width="150" show-overflow-tooltip></el-table-column>
                <el-table-column prop="address" label="地址" width="150" show-overflow-tooltip></el-table-column>
                <el-table-column prop="user_agent" label="User Agent" width="250" show-overflow-tooltip></el-table-column>
                <el-table-column prop="remark" label="说明" width="100" show-overflow-tooltip></el-table-column>
                <el-table-column prop="status_text" label="状态" width="80" align="center">
                    <template slot-scope="scope">
                        <el-tag :type="$func.formatTag(scope.row.status + 2)">{{ scope.row.status_text }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" min-width="100">
                    <template slot-scope="scope">
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
import {SafeList, SafeConfig, SafeDestroy} from '@/request/system.js';

export default {
    computed: {
        ...mapState({
            tableHeight: state => state.tableHeight,
        }),
    },
    data: function () {
        return {
            loading: false,
            datas: null,
            configs: null,
            selection: [],
            params: {page: 1, kwd: '', status: 0},
        }
    },
    activated() {
        this.config();
        this.list();
    },
    methods: {
        config() {
            SafeConfig().then((res) => {
                if (res.status) {
                    this.$func.error(res.message);
                } else {
                    this.configs = res.data;
                }
            });
        },
        async list() {
            await this.$func.verify('safe.list');
            this.loading = true;
            SafeList(this.params).then((res) => {
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
        async destroy(id) {
            await this.$func.verify('safe.destroy');
            this.$confirm('您确定要删除选中的该条信息吗？', '提示', {
                type: 'warning',
                confirmButtonText: '确 定',
                cancelButtonText: '取 消'
            }).then(() => {
                SafeDestroy({id: id}).then((res) => {
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
    .check-password{
        cursor: pointer; color: #F56C6C;
    }
</style>
