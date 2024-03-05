<template>
    <div class="board-content info" v-if="detail">
        <div class="board-main board-card info-header">
            <div class="user">
                <el-image class="user-avatar" :src="detail.avatar"></el-image>
                <div>
                    <div class="user-name">{{ detail.username ? detail.username : '未填写' }}</div>
                    <i v-if="detail.identity == 1" class="fa fa-user-o" title="普通用户" alt="普通用户"></i>
                    <i @click="proxy(detail.aid)" v-if="detail.identity == 2" class="fa fa-user-secret user-agent" title="我是代理" alt="我是代理"></i>
                </div>
            </div>
            <div class="board-card-handle">
                <el-button type="primary" icon="fa fa-edit" size="small" @click="edit(detail)"> 编辑</el-button>
                <el-button icon="fa fa-arrow-left" @click="$router.back()" size="small"> 返回</el-button>
            </div>
        </div>
        <div class="board-main board-card">
            <div class="board-item">基本信息</div>
            <el-descriptions class="margin-top" :column="3" size="large" border>
                <el-descriptions-item>
                    <template slot="label"><i class="fa fa-registered"></i> 编号</template>
                    {{ detail.id }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template slot="label"><i class="fa fa-user-o"></i> 昵称</template>
                    {{ detail.username }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template slot="label"><i class="fa fa-clock-o"></i> 代理</template>
                    <el-tag v-if="detail.agent" class="agentname" @click="agent(detail.agent_id)" size="small">{{ detail.agent.username }}</el-tag>
                    <el-tag v-else class="agentname" size="small">无</el-tag>
                </el-descriptions-item>
                <el-descriptions-item>
                    <template slot="label"><i class="el-icon-mobile-phone"></i> 手机号</template>
                    {{ detail.mobile }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template slot="label"><i class="el-icon-office-building"></i> 地址</template>
                    {{ detail.address }}
                </el-descriptions-item>
            </el-descriptions>
        </div>
        <div class="board-main board-card">
            <div class="board-item">其他信息</div>
            <el-descriptions class="margin-top" :column="3" size="large" border>
                <el-descriptions-item>
                    <template slot="label"><i class="fa fa-clock-o"></i> 注册时间</template>
                    {{ $moment(detail.created_at).format('YYYY-MM-DD HH:mm:ss') }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template slot="label"><i class="fa fa-sign-in"></i> 最近登录</template>
                    {{ $moment(detail.login_at).format('YYYY-MM-DD HH:mm:ss') }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template slot="label"><i class="fa fa-vcard-o"></i> 登录IP</template>
                    {{ detail.ip }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template slot="label"><i class="el-icon-location-outline"></i> 登录地址</template>
                    {{ detail.location }}
                </el-descriptions-item>
            </el-descriptions>
        </div>
        <el-dialog class="board-dialog" fullscreen :close-on-click-modal="false"
                   :close-on-press-escape="false"
                   :title="dialog.title"
                   :visible.sync="dialog.show" center>
            <el-form v-if="form" :model="form" :rules="rules" ref="form" class="board-form" label-width="120px">
                <div class="board-item">
                    <div class="title-note"><span>* </span>为必填项</div>
                </div>
                <div class="board-form-item">
                    <el-form-item label="身 份：" prop="identity" required>
                        <el-radio-group v-model="form.identity" size="medium">
                            <el-radio v-for="(item,index) in configs.identity"
                                      :key="index"
                                      :label="Number(index)" border>{{ item }}
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item v-if="form.identity == 2" label="绑 定：" prop="aid" required>
                        <el-select v-model="form.aid" @change="select" size="medium" filterable placeholder="请绑定代理商">
                            <el-option
                                v-for="item in agents"
                                :key="item.id"
                                :label="item.username"
                                :value="Number(item.id)">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="姓 名：" prop="username">
                        <el-input v-model="form.username" placeholder="请填写真实姓名" size="medium" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="手机号：" prop="mobile">
                        <el-input v-model="form.mobile" placeholder="请填写手机号码" size="medium" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="地 址：" prop="address">
                        <el-input v-model="form.address" placeholder="请填写详细地址" size="medium" clearable></el-input>
                    </el-form-item>
                </div>
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
import {AgentTree, UserConfig, UserInfo, UserUpdate} from "../../utils/request";

export default {
    data() {
        return {
            loading: false,
            button: {loading: false, disable: false, text: '提 交'},
            detail: null,
            agents: null,
            configs: null,
            dialog: {title: '', show: false},
            form: null,
            rules: {
                aid: [{required: true, message: '请绑定代理商', trigger: 'change'}],
                username: [{required: true, message: '请填写真实姓名', trigger: 'blur'}],
                mobile: [{required: true, message: '请填写手机号码', trigger: 'blur'}],
                card: [{required: true, message: '请填写身份证号码', trigger: 'blur'}],
            }
        }
    },
    activated() {
        this.$store.dispatch('setState', {active: '/user'});
        if (!this.$route.query.id) {
            this.$func.error('参数错误');
        }
        this.config();
        this.info(this.$route.query.id);
    },
    methods: {
        async info(id) {
            await this.$func.verify('user.info');
            UserInfo({id: id}).then((res) => {
                if (res.status) {
                    this.$func.error(res.message);
                } else {
                    this.detail = res.data;
                }
            });
        },
        async edit(detail) {
            await this.$func.verify('user.update');
            this.form = {
                id: detail.id,
                identity: detail.identity,
                aid: detail.aid > 0 ? detail.aid : '',
                username: detail.username,
                mobile: detail.mobile,
                address: detail.address,
            };
            this.dialog.title = '编辑用户';
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
                    UserUpdate(this.form).then((res) => {
                        if (res.status) {
                            this.$func.error(res.message);
                        } else {
                            this.$func.success(res.message).then(() => {
                                this.dialog.show = false;
                                this.info(this.$route.query.id);
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
        config() {
            UserConfig().then((res) => {
                if (res.status) {
                    this.$func.error(res.message);
                } else {
                    this.configs = res.data;
                }
            });
            AgentTree().then((res)=>{
                if(res.status){
                    this.$func.error(res.message);
                }else{
                    this.agents = res.data;
                }
            });
        },
        select(aid){
            this.agents.forEach((item) => {
                if(item.id == aid){
                    this.form.mobile = this.form.mobile ? this.form.mobile : item.mobile;
                    this.form.address = this.form.address ? this.form.address : item.address;
                }
            })
        },
        async agent(id) {
            await this.$func.verify('agent.list');
            this.$router.push({name: 'agent', query: {id: id}});
        },
        async proxy(id) {
            await this.$func.verify('agent.list');
            this.$router.push({name: 'agent', query: {id: id}});
        },
    }
}
</script>
<style scoped>

.user-avatar {
    border-radius: 50%;
    width: 65px;
    height: 65px;
}

.user{
    display: flex;justify-content: space-around;align-items: center;
}
.user .fa{
    margin-left: 15px;margin-top: 10px;cursor: pointer;
}
.user .user-agent{
    color: #2461EF;
}
.user .user-name{
    padding-left: 15px;font-weight: 700;
}
.agentname{
    cursor: pointer;
}
</style>
