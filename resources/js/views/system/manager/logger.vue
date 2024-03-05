<template>
    <div class="board-content">
        <div class="board-header">
            <div class="board-search">
                <div class="search-item" v-if="configs">
                    <el-select v-model="params.level" size="small" filterable clearable>
                        <el-option value="" label="全部级别"></el-option>
                        <el-option
                            v-for="(item,index) in configs.levels"
                            :key="index"
                            :label="item"
                            :value="item">
                        </el-option>
                    </el-select>
                </div>
                <div class="search-item" v-if="configs">
                    <el-select v-model="params.model" size="small" filterable clearable>
                        <el-option value="" label="全部模块"></el-option>
                        <el-option
                            v-for="(item,index) in configs.models"
                            :key="index"
                            :label="item"
                            :value="item">
                        </el-option>
                    </el-select>
                </div>
                <div class="search-item">
                    <el-input v-model="params.kwd" placeholder="请输入关键字" size="small" clearable></el-input>
                </div>
                <div class="search-item">
                    <el-button type="primary" @click="search()" size="small" icon="el-icon-search">搜索</el-button>
                </div>
            </div>
            <div class="board-handle">
                <el-button type="warning" icon="fa fa-refresh" @click="config()" size="small"> 刷新</el-button>
                <el-button type="info" icon="fa fa-trash" @click="del()" size="small"> 删除</el-button>
            </div>
        </div>
        <div style="display: flex;align-content: space-between">
            <div class="log-box" v-if="configs">
                <div class="title">日志文件</div>
                <div class="log-item-box">
                    <div v-for="(log,index) in configs.logs"
                         :class="params.file == log ? 'log-item active' : 'log-item'"
                         :key="index" title="点我修改" alt="点我修改"
                         @click="selectFile(log)">{{  log  }}</div>
                </div>
<!--                    <div class="chapter-create" @click="createChapter"><i class="fa fa-plus"></i> 章节</div>-->
            </div>
            <div class="log-list">
                <el-table v-if="datas" element-loading-text="努力加载中..."
                          element-loading-spinner="el-icon-loading"
                          tooltip-effect="dark" :height="tableHeight"
                          v-loading="loading" row-key
                          :data="datas.data" border>
                    <el-table-column type="index" label="编号" width="80" align="center"></el-table-column>
                    <el-table-column prop="created_at" label="日期" width="160">
                        <template slot-scope="scope">
                            {{  $func.formatDateTime(scope.row.date) }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="context" label="模块" width="80" align="center"></el-table-column>
                    <el-table-column prop="level" label="级别" width="80" align="center">
                        <template slot-scope="scope">
                            <span :class="scope.row.class" class="log-level">{{ scope.row.level }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" label="名称" width="130"></el-table-column>
                    <el-table-column prop="status_text" label="日志" min-width="80" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <div :class="scope.row.class" class="log-context">
                                <div v-if="scope.row.text.length">
                                    <div v-if="scope.row.level == 'error'">错误：{{ scope.row.text[0] }}</div>
                                    <div v-else>信息：{{ scope.row.text }}</div>
                                    <div class="path" v-if="scope.row.text.length > 2">链接：{{ scope.row.text[1] }}</div>
                                    <div class="region" v-if="scope.row.text.length > 2">位置：{{ scope.row.text[2] + '[' + scope.row.text[3] +']' }}</div>
                                </div>
                                <div v-else>
                                    <div>信息：{{ scope.row.text }}</div>
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <pagination :datas="datas" @page="page"></pagination>
    </div>
</template>

<script>
import {mapState} from "vuex";
import {LoggerConfig, LoggerDestroy, LoggerList} from '@/request/system.js';

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
            params: {page: 1, kwd: '', file: '', level: '', model: ''},//http
        }
    },
    activated() {
        this.config();

    },
    methods: {
        config() {
            LoggerConfig().then((res) => {
                if (res.status) {
                    this.$func.error(res.message);
                } else {
                    this.configs = res.data;
                    this.params.file = this.configs['logs'][0];
                    this.list();
                }
            });
        },
        async list() {
            await this.$func.verify('logger.list');
            this.loading = true;
            LoggerList(this.params).then((res) => {
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
            await this.$func.verify('logger.destroy');
            this.$confirm('您确定要删除选中的该条信息吗？', '提示', {
                type: 'warning',
                confirmButtonText: '确 定',
                cancelButtonText: '取 消'
            }).then(() => {
                LoggerDestroy({file: this.params.file}).then((res) => {
                    if (res.status) {
                        this.$func.error(res.message);
                    } else {
                        this.config();
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
            this.destroy();
        },
        search() {
            this.params.page = 1;
            this.list();
        },
        page(val) {
            this.params.page = val;
            this.list();
        },
        selectFile(name){
            this.params.file = name;
            this.search();
        }
    }
}
</script>
<style scoped>

.log-box, .log-list {
    border-radius: 5px;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 5px 0px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px;
}
.log-box{
    margin: 0 15px 15px;
    text-align: center;
}
.log-box .title{
    padding: 10px 0 10px;background: #8604bb;color: #fff;margin-bottom: 5px;
    border-radius: 5px 5px 0 0;
}
.log-box .log-item{
    margin: 0 15px;
    font-size: 14px;
    white-space: nowrap; /* 防止换行 */
    padding: 15px 0;cursor: pointer;
    border-bottom: 1px dashed #f3f3f6;

}
.log-box .log-item:hover, .log-box .log-item.active{
    color: #2461ef;
}
.log-list{
    width: 100%;margin: 0 15px 15px 0;
}
.text-danger{
    color: #ff6c60;
}
.text-warning{
    color: #fa6900;
}
.text-primary{
    color: #2461ef;
}
.text-info{
    color: #0bb4c8;
}
.log-context{
    font-size: 12px;
}
.log-context .path{
    color: #8604bb
}

.log-context .region{
    color: #2461ef
}

</style>
