<template>
    <div class="board-content">
        <div class="home-header">
            <div class="home-header-left">
                <el-card class="card user-card">
                    <div class="user-info">
                        <div class="user-avatar">
                            <img :src="$func.assetsFile('avatar/a'+ user.avatar +'.jpg')" alt="">
                        </div>
                        <div class="user-other">
                            <div class="nickname">{{ user.nickname }}</div>
                            <div>{{ user.role.title }}</div>
                        </div>
                    </div>
                    <div>
                        <div class="nickname">最近登录：{{ $moment(user.login_at).format('YYYY-MM-DD HH:mm') }}</div>
                    </div>
                </el-card>
                <el-card class="card handle-card">
                    <div slot="header" class="clearfix">
                        <span class="card-title"><i class="fa fa-hand-o-right"></i> 快捷操作</span>
                    </div>
                    <div class="handle-btns">
                        <el-button icon="fa fa-plus" plain	type="danger" @click="create('category')"> 添加类目</el-button>
                        <el-button icon="fa fa-plus" plain	type="success" @click="create('good')"> 添加商品</el-button>
                        <el-button icon="fa fa-plus" plain	type="primary" @click="create('agent')"> 添加代理</el-button>
                        <el-button icon="fa fa-plus" plain	type="warning" @click="create('manager')"> 添加管理</el-button>
                    </div>
                </el-card>
            </div>
            <div class="home-header-right">
                <div class="company">抖音视频综合管理后台</div>
                <div class="remark">信息统计技术服务</div>
                <el-card class="card order-card">
                    <div slot="header" class="clearfix">
                        <span class="card-title"><i class="fa fa-shopping-cart"></i> 订单概况</span>
                    </div>
                    <div class="order-box">
                        <div class="order-item">
                            <div>
                                <div class="order-item-round round1">
                                    <i class="fa fa-cart-arrow-down"></i>
                                </div>
                            </div>
                            <div class="order-item-info">
                                <div class="title">订单数</div>
                                <div class="count"><span>18</span> 单</div>
                            </div>
                        </div>
                        <div class="order-item">
                            <div>
                                <div class="order-item-round round2">
                                    <i class="fa fa-hourglass-half"></i>
                                </div>
                            </div>
                            <div class="order-item-info">
                                <div class="title">待付款</div>
                                <div class="count"><span>2</span> 单</div>
                            </div>
                        </div>
                        <div class="order-item">
                            <div>
                                <div  class="order-item-round round3">
                                    <i class="fa fa-money"></i>
                                </div>
                            </div>
                            <div class="order-item-info">
                                <div class="title">已付款</div>
                                <div class="count"><span>8</span> 单</div>
                            </div>
                        </div>
                        <div class="order-item">
                            <div>
                                <div  class="order-item-round round4">
                                    <i class="fa fa-paper-plane"></i>
                                </div>
                            </div>
                            <div class="order-item-info">
                                <div class="title">已发货</div>
                                <div class="count"><span>5</span> 单</div>
                            </div>
                        </div>
                        <div class="order-item">
                            <div>
                                <div  class="order-item-round round5">
                                    <i class="fa fa-snowflake-o"></i>
                                </div>
                            </div>
                            <div class="order-item-info">
                                <div class="title">已完成</div>
                                <div class="count"><span>3</span> 单</div>
                            </div>
                        </div>
                    </div>
                </el-card>
            </div>

        </div>
<!--        <div class="home-main">-->
<!--            <div class="home-main-left">-->
<!--                <div class="main-assay">-->
<!--                    <div class="assay-title">今日订单</div>-->
<!--                    <div class="assay-box">-->
<!--                        <div class="assay-data"><span>25 </span>单 <i class="fa fa-arrow-up"></i></div>-->
<!--                        <div id="order-echarts" style="width: 100%;height: 200px;"></div>-->
<!--                    </div>-->
<!--                    <div class="assay-more" @click="order()">查看更多 <i class="fa fa-angle-right"></i></div>-->
<!--                </div>-->
<!--                <div class="main-assay">-->
<!--                    <div class="assay-title">用户新增</div>-->
<!--                    <div class="assay-box">-->
<!--                        <div class="assay-data"><span>25 </span>人 <i class="fa fa-arrow-up"></i></div>-->
<!--                        <div id="user-echarts" style="width: 100%;height: 200px;"></div>-->
<!--                    </div>-->
<!--                    <div class="assay-more" @click="user()">查看更多 <i class="fa fa-angle-right"></i></div>-->
<!--                </div>-->
<!--            </div>-->
<!--            <div class="home-main-right">-->
<!--                <el-card class="month-card">-->
<!--                    <div style="text-align: center;margin-top: 30px">-->
<!--                        <el-date-picker-->
<!--                            v-model="params.month" size="small"-->
<!--                            type="month" @change="select"-->
<!--                            placeholder="选择月">-->
<!--                        </el-date-picker>-->
<!--                    </div>-->
<!--                    <div id="month-echarts" style="width: 100%;height: 350px;"></div>-->
<!--                </el-card>-->
<!--            </div>-->
<!--        </div>-->
    </div>
</template>
<script>
import {mapState} from "vuex";
import * as echarts from 'echarts';
import {MainMonthAssay} from "@/request/system.js";

export default {
    computed: {
        ...mapState({
            title: state => state.title,
            user: state => state.user,
        }),
    },
    data: function () {
        return {
            loading: false,
            listData: [],
            params: {month: ''},
        }
    },
    activated() {
        console.log(this.user)
        this.params.month = this.$moment(new Date()).format('YYYY-MM');
        // this.oassay();
        // this.uassay();
        // this.massay();
    },
    methods: {
        order() {
            this.$router.push({name: 'order'});
        },
        // user() {
        //     this.$router.push({name: 'user'});
        // },
        select(e){
            this.massay(this.$moment(e).format('YYYY-MM'));
        },
        create(type){
            this.$router.push({name: type});
        },
        oassay() {
            // RecordPie().then((res) => {
            //     if (res.status) {
            //         this.$func.error(res.message);
            //     } else {
            this.$nextTick(()=>{
                var myChart = echarts.init(document.getElementById('order-echarts'));
                myChart.setOption({
                    xAxis: [
                        {
                            type: 'category',
                            data: ['Mon', 'Tue', 'Wed', 'Thu'],
                            show: false //不显示坐标
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            show: false //不显示坐标
                        }
                    ],
                    series: [
                        {
                            symbol:"none", //不显示连接点
                            type: 'line',
                            smooth: true, //平滑设置
                            data: [150, 50, 224, 30],
                            lineStyle: {
                                color: 'white' //线条颜色
                            }
                        }
                    ]
                })
            })
            //     }
            // });
        },
        uassay() {
            // RecordPie().then((res) => {
            //     if (res.status) {
            //         this.$func.error(res.message);
            //     } else {
            this.$nextTick(()=>{
                var myChart = echarts.init(document.getElementById('user-echarts'));
                myChart.setOption({
                    xAxis: [
                        {
                            type: 'category',
                            data: ['Mon', 'Tue', 'Wed', 'Thu'],
                            show: false //不显示坐标
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            show: false //不显示坐标
                        }
                    ],
                    series: [
                        {
                            symbol:"none", //不显示连接点
                            type: 'line',
                            smooth: true, //平滑设置
                            data: [80, 20, 50, 124],
                            lineStyle: {
                                color: 'white' //线条颜色
                            }
                        }
                    ]
                })
            })
            //     }
            // });
        },
        massay(date) {
            MainMonthAssay(this.params).then((res) => {
                if (res.status) {
                    this.$func.error(res.message);
                } else {
                    this.$nextTick(()=>{
                        var myChart = echarts.init(document.getElementById('month-echarts'));
                        myChart.setOption({
                            xAxis: [
                                {
                                    type: 'category',
                                    data: res.data.day,
                                }
                            ],
                            yAxis: [
                                {
                                    type: 'value',
                                }
                            ],
                            series: [
                                {
                                    type: 'bar',
                                    data: res.data.money,
                                    lineStyle: {
                                        color: 'white' //线条颜色
                                    }
                                }
                            ]
                        })
                    })
                }
            });
        },
    }
}
</script>
<style scoped>

.home-header{
    display:flex;padding: 15px 15px 0;
}
.home-header .home-header-left{
    flex: 1;margin-right: 15px;
}
.home-header .company{
    font-size: 22px;color: #303133;text-align: center;
}
.home-header .remark{
    color: #909399;margin: 10px 0 20px;text-align: center;
}
.card.order-card{
    height: 200px;
}
.card.handle-card{
    width: 300px;height: 218px
}
.card .card-title{
    font-size: 16px;
}
.card .card-title .fa{
    font-size: 18px;
}
.card .order-box{
    display: flex;justify-content: space-between;padding: 15px 20px;
}
.card .order-item{
    display: flex;justify-items: center;justify-content: space-around;
}
.card .order-item .order-item-round{
    border-radius: 50%;width: 65px;height: 65px;text-align: center;line-height: 65px;
}
.card .order-item .order-item-round.round1{
    color: #2461EF;background: #D3DFFC;
}
.card .order-item .order-item-round.round2{
    color: #0BB4C8;background: #CEF0F4;
}
.card .order-item .order-item-round.round3{
    color: #FA6900;background: #FEE1CC;
}
.card .order-item .order-item-round.round4{
    color: #FF6C60;background: #FFE2DF;
}
.card .order-item .order-item-round.round5{
    color: #800080;background: #E6CCE6;
}
.card .order-item .order-item-round .fa{
    font-size: 22px;
}
.card .order-item .order-item-info{
    padding-left: 10px;
}
.card .order-item .order-item-info .title{
    font-size: 14px;margin-top: 5px;
}
.card .order-item .order-item-info .count{
    font-size: 14px;margin-top: 10px;
}
.card .order-item .order-item-info .count span{
    font-size: 20px;font-weight: 700;
}
.card .handle-btns{
    display: flex;flex-wrap: wrap;justify-content: space-around;padding-top: 5px;
}
.el-button {
    margin-left: 0px !important;
    margin-bottom: 15px !important;
    padding: 15px 20px;
}
.home-main{
    display: flex;
    justify-content: space-between;
}
.home-main .home-main-left{
    margin-right: 30px;
}
.home-main .home-main-right{
    width: 100%;
}
.home-main .main-assay{
    background: #2461EF;height: 200px;width: 320px;
    margin-bottom: 15px;padding: 15px;border-radius: 5px;
    color: #ffffff;position: relative;
}
.home-main .assay-box{
    display: flex;height: 130px;
    justify-content: space-around;
}
.home-main .assay-box .assay-data{
    width: 120px;padding-top: 40px;
}
.home-main .assay-box .assay-data span{
    font-size: 30px;font-weight: 700;
}
#order-echarts, #user-echarts{
    position: relative;
    top: -35px;right: -15px;
}
.home-main .main-assay .assay-more{
    position: absolute;right: 15px;
    cursor: pointer;
}
.home-header .user-card{
    width: 300px;height: 150px;margin-bottom: 15px;
}
.home-header .user-card .user-info{
    display: flex;justify-items: center;margin-bottom: 10px;
}
.home-header .user-card .user-avatar{
    width: 100px;
}
.home-header .user-card .user-other{
    margin-top: 10px;
}
.home-header .user-card .user-other .nickname{
    margin-bottom: 5px;font-weight: 700;font-size: 18px;
}
.home-header .user-card .user-avatar img{
    width: 80px;height: 80px;border-radius: 50%;
}
</style>
