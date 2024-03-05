<template>
    <div class="board-content">
        <div class="board-header">
            <div class="board-search">
                <div class="search-item">
                    <el-input v-model="params.kwd" placeholder="请输入用户ID" size="small" clearable></el-input>
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
                <el-table-column prop="user.avatar" label="头像" width="70" align="center">
                    <template slot-scope="scope">
                        <el-image class="board-table-image" :src="scope.row.user.avatar"
                                  :preview-src-list="[scope.row.user.avatar]"></el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="user.nickname" label="用户昵称" width="150"></el-table-column>
                <el-table-column prop="user.username" label="用户名" width="100"></el-table-column>
                <el-table-column prop="money" label="金额（元）" width="100" align="center"></el-table-column>
                <el-table-column prop="name" label="说明" width="250" show-overflow-tooltip></el-table-column>
                <el-table-column prop="created_at" label="消费时间" width="160">
                    <template slot-scope="scope">
                        {{ $moment(scope.row.created_at).format('YYYY-MM-DD HH:mm:ss') }}
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
import {CostList, CostDestroy} from '../../utils/request';

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
            slection: [],
            params: {page: 1, kwd: '', status: 0},
        }
    },
    activated() {
        this.list();
    },
    methods: {
        async list() {
            await this.$func.verify('cost.list');
            this.loading = true;
            CostList(this.params).then((res) => {
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
            await this.$func.verify('cost.destroy');
            this.$confirm('您确定要删除选中的该条信息吗？', '提示', {
                type: 'warning',
                confirmButtonText: '确 定',
                cancelButtonText: '取 消'
            }).then(() => {
                CostDestroy({id: id}).then((res) => {
                    if (res.status) {
                        this.$func.error(res.message);
                    } else {
                        this.list();
                    }
                });
            }).catch(() => {
            });
        },
        multiple(e) {
            this.slection = [];
            if (e.length) {
                e.forEach((item) => {
                    this.slection.push(item.id)
                })
            }
        },
        del() {
            if (!this.slection.length) {
                this.$func.error('请选择你要操作的数据');
                return false;
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
.board-table-image {
    height: 35px;
    width: 35px;
    border-radius: 50%;
}
</style>
