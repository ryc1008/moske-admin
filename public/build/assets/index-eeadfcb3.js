import{m as t}from"./vuex-fb1740e5.js";import{U as e,s,t as a,u as i,v as r}from"./app-64dc16a0.js";import{n as l}from"./vue-verify-code-21b6e9ae.js";import"./w-e6fba1f3.js";import"./axios-5ae1da96.js";import"./vue-9f7ddc78.js";import"./async-validator-68c927eb.js";import"./babel-runtime-b0e6bb14.js";import"./crypto-js-e93d4fbc.js";import"./element-tiptap-f39d3908.js";import"./tiptap-cd99e86f.js";import"./prosemirror-state-aff6b6a5.js";import"./prosemirror-model-e99bf1dc.js";import"./orderedmap-1ac72264.js";import"./prosemirror-transform-0ba15ba3.js";import"./prosemirror-view-e30b2d7a.js";import"./prosemirror-dropcursor-41f27ba8.js";import"./prosemirror-gapcursor-8cdc000d.js";import"./prosemirror-keymap-e0a1e6d1.js";import"./w3c-keyname-5afe5a41.js";import"./prosemirror-commands-994280f1.js";import"./prosemirror-inputrules-51b7290b.js";import"./tiptap-utils-1e7277fa.js";import"./tiptap-extensions-b74a4f9a.js";import"./tiptap-commands-9e395e16.js";import"./prosemirror-schema-list-a2d0a333.js";import"./highlight.js-45c9f23d.js";import"./fault-4bc10d66.js";import"./format-ca30c10a.js";import"./prosemirror-history-094ab62a.js";import"./rope-sequence-72d4f3ff.js";import"./prosemirror-utils-15148092.js";import"./prosemirror-tables-78b83e4c.js";import"./element-ui-85fcec33.js";import"./resize-observer-polyfill-26170312.js";import"./throttle-debounce-f2d3495b.js";import"./babel-helper-vue-jsx-merge-props-ae7f6986.js";import"./normalize-wheel-2c441d7d.js";import"./deepmerge-1c41bee1.js";import"./image-conversion-5dc521cd.js";import"./nprogress-e46a079b.js";import"./vue-cookie-f9b70f6c.js";import"./tiny-cookie-01c919d1.js";import"./moment-0b360bb8.js";/* empty css                     */import"./xgplayer-ddb6d22b.js";import"./eventemitter3-91a3dd57.js";import"./delegate-333e72eb.js";import"./downloadjs-bf7647fe.js";import"./xgplayer-hls-e482b1c5.js";import"./xgplayer-streaming-shared-a05e1a43.js";import"./xgplayer-transmuxer-2825904a.js";import"./xgplayer-music-47c62e3d.js";import"./vue-router-29840f2f.js";import"./vue-axios-5ff5ffea.js";import"./qs-7cd75b61.js";import"./side-channel-c3af32fe.js";import"./get-intrinsic-bac01933.js";import"./has-symbols-456daba2.js";import"./has-proto-4a87f140.js";import"./function-bind-72d06d3b.js";import"./has-885c3436.js";import"./call-bind-fae29077.js";import"./object-inspect-d5fba9a3.js";const o=l({computed:{...t({tableHeight:t=>t.tableHeight})},data:function(){return{loading:!1,datas:null,configs:null,selection:[],params:{page:1,kwd:"",status:0,vip:0,aid:"",system:0},button:{loading:!1,disable:!1,text:"提 交"},dialog:{title:"",show:!1},form:null,rules:{vip_id:[{required:!0,message:"请填写VIP等级",trigger:"blur"},{validator:(t,e,s)=>{0===e&&s(new Error("请填写VIP等级")),s()},trigger:"blur"}],vip_at:[{required:!0,message:"请选择VIP到期时间",trigger:["blur","change"]}]}}},activated(){this.config(),this.list()},methods:{config(){e().then((t=>{t.status?this.$func.error(t.message):this.configs=t.data}))},async list(){await this.$func.verify("user.list"),this.loading=!0,s(this.params).then((t=>{t.status?this.$func.error(t.message):this.datas=t.data,this.loading=!1})).catch((t=>{this.loading=!1}))},async edit(t){await this.$func.verify("user.update"),this.form={id:t.id,username:t.username,vip_id:1==t.vip_id?0:t.vip_id,vip_at:t.vip_at,name:t.name,bank:t.bank,card:t.card,status:t.status},this.dialog.title="编辑用户",this.dialog.show=!0,this.$nextTick((()=>{this.$refs.form.clearValidate()}))},update(){this.$refs.form.validate((t=>{t&&(this.button.disabled=!0,this.button.loading=!0,this.button.text="提交中...",a(this.form).then((t=>{t.status?this.$func.error(t.message):this.$func.success(t.message).then((()=>{this.dialog.show=!1,this.list()})),this.button.disabled=!1,this.button.loading=!1,this.button.text="提 交"})).catch((t=>{this.button.disabled=!1,this.button.loading=!1,this.button.text="提 交"})))}))},multiple(t){this.selection=[],t.length&&t.forEach((t=>{this.selection.push(t.id)}))},async active(){if(await this.$func.verify("user.active"),!this.selection.length)return this.$func.error("请选择你要操作的数据"),!1;i({id:this.selection}).then((t=>{t.status?this.$func.error(t.message):this.list()}))},async lock(){if(await this.$func.verify("user.lock"),!this.selection.length)return this.$func.error("请选择你要操作的数据"),!1;r({id:this.selection}).then((t=>{t.status?this.$func.error(t.message):this.list()}))},search(){this.params.page=1,this.list()},page(t){this.params.page=t,this.list()}}},(function(){var t=this,e=t._self._c;return e("div",{staticClass:"board-content"},[e("div",{staticClass:"board-header"},[e("div",{staticClass:"board-search"},[t.configs?e("div",{staticClass:"search-item"},[e("el-select",{staticStyle:{width:"120px"},attrs:{size:"small",filterable:""},model:{value:t.params.status,callback:function(e){t.$set(t.params,"status",e)},expression:"params.status"}},[e("el-option",{attrs:{value:0,label:"全部状态"}}),t._l(t.configs.status,(function(t,s){return e("el-option",{key:s,attrs:{label:t,value:Number(s)}})}))],2)],1):t._e(),t.configs?e("div",{staticClass:"search-item"},[e("el-select",{staticStyle:{width:"120px"},attrs:{size:"small",filterable:""},model:{value:t.params.system,callback:function(e){t.$set(t.params,"system",e)},expression:"params.system"}},[e("el-option",{attrs:{value:0,label:"全部系统"}}),t._l(t.configs.systems,(function(t,s){return e("el-option",{key:s,attrs:{label:t,value:s}})}))],2)],1):t._e(),t.configs?e("div",{staticClass:"search-item"},[e("el-select",{staticStyle:{width:"120px"},attrs:{size:"small",filterable:""},model:{value:t.params.vip,callback:function(e){t.$set(t.params,"vip",e)},expression:"params.vip"}},[e("el-option",{attrs:{value:0,label:"全部VIP"}}),t._l(t.configs.vips,(function(t,s){return e("el-option",{key:s,attrs:{label:t,value:s}})}))],2)],1):t._e(),e("div",{staticClass:"search-item"},[e("el-input",{staticStyle:{width:"150px"},attrs:{placeholder:"请输入渠道ID",size:"small",clearable:""},model:{value:t.params.aid,callback:function(e){t.$set(t.params,"aid",e)},expression:"params.aid"}})],1),e("div",{staticClass:"search-item"},[e("el-input",{attrs:{placeholder:"请输入用户名/ID/手机号",size:"small",clearable:""},model:{value:t.params.kwd,callback:function(e){t.$set(t.params,"kwd",e)},expression:"params.kwd"}})],1),e("div",{staticClass:"search-item"},[e("el-button",{attrs:{type:"primary",size:"small",icon:"el-icon-search"},on:{click:function(e){return t.search()}}},[t._v("搜索")])],1)]),e("div",{staticClass:"board-handle"},[e("el-button",{attrs:{type:"warning",icon:"fa fa-refresh",size:"small"},on:{click:function(e){return t.list()}}},[t._v(" 刷新")]),e("el-button",{attrs:{type:"success",icon:"fa fa-unlock-alt",size:"small"},on:{click:function(e){return t.active()}}},[t._v(" 启用")]),e("el-button",{attrs:{type:"danger",icon:"fa fa-lock",size:"small"},on:{click:function(e){return t.lock()}}},[t._v(" 锁定")])],1)]),e("div",{staticClass:"board-main"},[t.datas?e("el-table",{directives:[{name:"loading",rawName:"v-loading",value:t.loading,expression:"loading"}],ref:"multipleHandle",attrs:{"element-loading-text":"努力加载中...","element-loading-spinner":"el-icon-loading",stripe:"","tooltip-effect":"dark",height:t.tableHeight,data:t.datas.data,border:""},on:{"selection-change":t.multiple}},[e("el-table-column",{attrs:{type:"selection",width:"45",align:"center"}}),e("el-table-column",{attrs:{type:"expand"},scopedSlots:t._u([{key:"default",fn:function(s){return[e("div",{staticClass:"board-description"},[e("el-descriptions",{attrs:{title:"",size:"medium"}},[e("el-descriptions-item",{attrs:{label:"VIP到期"}},[t._v(t._s(s.row.vip_at?t.$func.formatDateTime(s.row.vip_at):""))]),e("el-descriptions-item",{attrs:{label:"绑定手机"}},[t._v(t._s(s.row.mobile))]),e("el-descriptions-item",{attrs:{label:"最近登录"}},[t._v(t._s(s.row.login_at?t.$func.formatDateTime(s.row.login_at):""))]),e("el-descriptions-item",{attrs:{label:"登录IP"}},[t._v(t._s(s.row.login_ip))]),e("el-descriptions-item",{attrs:{label:"手机型号"}},[t._v(t._s(s.row.app_model))]),e("el-descriptions-item",{attrs:{label:"系统版本"}},[t._v(t._s(s.row.app_release))]),e("el-descriptions-item",{attrs:{label:"网络状态"}},[t._v(t._s(s.row.app_network))]),e("el-descriptions-item",{attrs:{label:"ip地址库"}},[t._v(t._s(s.row.address))]),e("el-descriptions-item",{attrs:{label:"UUID"}},[t._v(t._s(s.row.uuid))]),e("el-descriptions-item",{attrs:{label:"总充值"}},[t._v(t._s(s.row.money))])],1)],1)]}}],null,!1,3480243127)}),e("el-table-column",{attrs:{prop:"canal_id",label:"渠道",width:"160"},scopedSlots:t._u([{key:"default",fn:function(e){return[t._v(" 【"+t._s(e.row.canal_id)+"】"+t._s(e.row.canal.username)+" ")]}}],null,!1,2100172763)}),e("el-table-column",{attrs:{prop:"username",label:"用户名",width:"240"},scopedSlots:t._u([{key:"default",fn:function(e){return[t._v(" 【"+t._s(e.row.id)+"】"+t._s(e.row.username)+" ")]}}],null,!1,1094986)}),e("el-table-column",{attrs:{prop:"vip",label:"VIP",width:"100",align:"center"},scopedSlots:t._u([{key:"default",fn:function(e){return[t._v(" "+t._s(e.row.vip.title?e.row.vip.title:"游客")+" ")]}}],null,!1,102316002)}),e("el-table-column",{attrs:{prop:"balance",label:"余额",width:"100",align:"center"}}),e("el-table-column",{attrs:{prop:"app_system",label:"系统",width:"50",align:"center"},scopedSlots:t._u([{key:"default",fn:function(s){return["Android"==s.row.app_system?e("img",{staticClass:"system-icon",attrs:{title:"安卓系统",src:t.$func.assetsFile("android.png"),alt:""}}):t._e(),"iOS"==s.row.app_system?e("img",{staticClass:"system-icon",attrs:{title:"苹果系统",src:t.$func.assetsFile("ios.png"),alt:""}}):t._e()]}}],null,!1,258377707)}),e("el-table-column",{attrs:{align:"center",prop:"app_vendor",label:"品牌","show-overflow-tooltip":!0,width:"100"}}),e("el-table-column",{attrs:{align:"center",prop:"app_version",label:"版本号",width:"75"}}),e("el-table-column",{attrs:{prop:"status_text",label:"状态",width:"80",align:"center"},scopedSlots:t._u([{key:"default",fn:function(s){return[e("el-tag",{attrs:{type:t.$func.formatTag(s.row.status+2)}},[t._v(t._s(s.row.status_text))])]}}],null,!1,826915959)}),e("el-table-column",{attrs:{prop:"created_at",label:"注册日期",width:"160"},scopedSlots:t._u([{key:"default",fn:function(e){return[t._v(" "+t._s(t.$func.formatDateTime(e.row.created_at))+" ")]}}],null,!1,1965584032)}),e("el-table-column",{attrs:{label:"操作",fixed:"right","min-width":"100"},scopedSlots:t._u([{key:"default",fn:function(s){return[e("el-button",{attrs:{type:"primary",icon:"fa fa-edit",size:"mini",plain:""},on:{click:function(e){return t.edit(s.row)}}},[t._v(" 编辑")])]}}],null,!1,51941323)})],1):t._e()],1),e("pagination",{attrs:{datas:t.datas},on:{page:t.page}}),e("el-dialog",{staticClass:"board-dialog",attrs:{fullscreen:"","close-on-click-modal":!1,"close-on-press-escape":!1,title:t.dialog.title,visible:t.dialog.show,center:""},on:{"update:visible":function(e){return t.$set(t.dialog,"show",e)}}},[t.form?e("el-form",{ref:"form",staticClass:"board-form",attrs:{model:t.form,rules:t.rules,"label-width":"120px"}},[e("div",{staticClass:"item-title"},[t._v("基本信息"),e("div",{staticClass:"title-note"},[e("span",[t._v("* ")]),t._v("为必填项")])]),e("div",{staticClass:"form-item"},[e("el-form-item",{attrs:{label:"账 户：",prop:"username"}},[e("el-input",{attrs:{placeholder:"请填写用户名","prefix-icon":"fa fa-user",readonly:"",size:"medium",clearable:""},model:{value:t.form.username,callback:function(e){t.$set(t.form,"username",e)},expression:"form.username"}})],1),e("el-form-item",{attrs:{label:"会 员：",prop:"vip_id"}},[e("el-select",{attrs:{size:"medium",clearable:""},model:{value:t.form.vip_id,callback:function(e){t.$set(t.form,"vip_id",e)},expression:"form.vip_id"}},[e("el-option",{attrs:{value:0,label:"选择会员等级"}}),t._l(t.configs.vips,(function(t,s){return e("el-option",{key:s,attrs:{label:t,value:Number(s)}})}))],2)],1),e("el-form-item",{attrs:{label:"时 间：",prop:"vip_at"}},[e("el-date-picker",{attrs:{clearable:"",type:"datetime","value-format":"yyyy-MM-dd HH:mm:ss",placeholder:"选择会员到期时间"},model:{value:t.form.vip_at,callback:function(e){t.$set(t.form,"vip_at",e)},expression:"form.vip_at"}})],1),e("el-form-item",{attrs:{label:"状 态：",prop:"status"}},[e("el-radio-group",{attrs:{size:"medium"},model:{value:t.form.status,callback:function(e){t.$set(t.form,"status",e)},expression:"form.status"}},t._l(t.configs.status,(function(s,a){return e("el-radio",{key:a,attrs:{label:Number(a),border:""}},[t._v(t._s(s)+" ")])})),1)],1)],1),e("div",{staticClass:"item-title"},[t._v("钱包信息")]),e("div",{staticClass:"form-item"},[e("el-form-item",{attrs:{label:"姓 名：",prop:"name"}},[e("el-input",{attrs:{placeholder:"请填写联系人名称","prefix-icon":"fa fa-user",size:"medium",clearable:""},model:{value:t.form.name,callback:function(e){t.$set(t.form,"name",e)},expression:"form.name"}})],1),e("el-form-item",{attrs:{label:"银 行：",prop:"bank"}},[e("el-input",{attrs:{placeholder:"请填写银行名称或者USDT","prefix-icon":"fa fa-bank",size:"medium",clearable:""},model:{value:t.form.bank,callback:function(e){t.$set(t.form,"bank",e)},expression:"form.bank"}})],1),e("el-form-item",{attrs:{label:"卡 号：",prop:"card"}},[e("el-input",{attrs:{placeholder:"请填写银行卡号或者钱包","prefix-icon":"fa fa-credit-card",size:"medium",clearable:""},model:{value:t.form.card,callback:function(e){t.$set(t.form,"card",e)},expression:"form.card"}})],1)],1)]):t._e(),e("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[e("el-button",{attrs:{type:"primary",loading:t.button.loading,disabled:t.button.disable},on:{click:t.update}},[t._v(t._s(t.button.text))]),e("el-button",{staticClass:"close-btn",on:{click:function(e){t.dialog.show=!1}}},[t._v("关 闭")])],1)],1)],1)}),[],!1,null,"480cc375",null,null).exports;export{o as default};
