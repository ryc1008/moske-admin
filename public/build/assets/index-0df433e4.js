import{m as t}from"./vuex-fb1740e5.js";import{a$ as e,b0 as s,b1 as a,b2 as r,b3 as i,b4 as o,b5 as l}from"./app-64dc16a0.js";import{n}from"./vue-verify-code-21b6e9ae.js";import"./w-e6fba1f3.js";import"./axios-5ae1da96.js";import"./vue-9f7ddc78.js";import"./async-validator-68c927eb.js";import"./babel-runtime-b0e6bb14.js";import"./crypto-js-e93d4fbc.js";import"./element-tiptap-f39d3908.js";import"./tiptap-cd99e86f.js";import"./prosemirror-state-aff6b6a5.js";import"./prosemirror-model-e99bf1dc.js";import"./orderedmap-1ac72264.js";import"./prosemirror-transform-0ba15ba3.js";import"./prosemirror-view-e30b2d7a.js";import"./prosemirror-dropcursor-41f27ba8.js";import"./prosemirror-gapcursor-8cdc000d.js";import"./prosemirror-keymap-e0a1e6d1.js";import"./w3c-keyname-5afe5a41.js";import"./prosemirror-commands-994280f1.js";import"./prosemirror-inputrules-51b7290b.js";import"./tiptap-utils-1e7277fa.js";import"./tiptap-extensions-b74a4f9a.js";import"./tiptap-commands-9e395e16.js";import"./prosemirror-schema-list-a2d0a333.js";import"./highlight.js-45c9f23d.js";import"./fault-4bc10d66.js";import"./format-ca30c10a.js";import"./prosemirror-history-094ab62a.js";import"./rope-sequence-72d4f3ff.js";import"./prosemirror-utils-15148092.js";import"./prosemirror-tables-78b83e4c.js";import"./element-ui-85fcec33.js";import"./resize-observer-polyfill-26170312.js";import"./throttle-debounce-f2d3495b.js";import"./babel-helper-vue-jsx-merge-props-ae7f6986.js";import"./normalize-wheel-2c441d7d.js";import"./deepmerge-1c41bee1.js";import"./image-conversion-5dc521cd.js";import"./nprogress-e46a079b.js";import"./vue-cookie-f9b70f6c.js";import"./tiny-cookie-01c919d1.js";import"./moment-0b360bb8.js";/* empty css                     */import"./xgplayer-ddb6d22b.js";import"./eventemitter3-91a3dd57.js";import"./delegate-333e72eb.js";import"./downloadjs-bf7647fe.js";import"./xgplayer-hls-e482b1c5.js";import"./xgplayer-streaming-shared-a05e1a43.js";import"./xgplayer-transmuxer-2825904a.js";import"./xgplayer-music-47c62e3d.js";import"./vue-router-29840f2f.js";import"./vue-axios-5ff5ffea.js";import"./qs-7cd75b61.js";import"./side-channel-c3af32fe.js";import"./get-intrinsic-bac01933.js";import"./has-symbols-456daba2.js";import"./has-proto-4a87f140.js";import"./function-bind-72d06d3b.js";import"./has-885c3436.js";import"./call-bind-fae29077.js";import"./object-inspect-d5fba9a3.js";const m=n({computed:{...t({tableHeight:t=>t.tableHeight})},data:function(){return{loading:!1,datas:null,configs:null,roles:null,selection:[],params:{page:1,kwd:"",status:0,role_id:0},button:{loading:!1,disable:!1,text:"提 交"},dialog:{title:"",show:!1},avatars:[0,1,2,3,4,5,6,7,8,9],form:null,rules:{role_id:[{required:!0,message:"请选择角色",trigger:"change"},{validator:(t,e,s)=>{0===e&&s(new Error("请选择角色")),s()},trigger:"blur"}],username:[{required:!0,message:"请填写管理员账户",trigger:"blur"}],nickname:[{required:!0,message:"请填写管理员昵称",trigger:"blur"}]}}},activated(){this.role(),this.config(),this.list()},methods:{config(){e().then((t=>{t.status?this.$func.error(t.message):this.configs=t.data}))},role(){s().then((t=>{0===t.status&&(this.roles=t.data)}))},async list(){await this.$func.verify("manager.list"),this.loading=!0,a(this.params).then((t=>{t.status?this.$func.error(t.message):this.datas=t.data,this.loading=!1})).catch((t=>{this.loading=!1}))},async create(){await this.$func.verify("manager.update"),this.form={id:0,username:"",nickname:"",avatar:0,role_id:0,password:"",status:1},this.dialog.title="新增管理员",this.dialog.show=!0,this.$nextTick((()=>{this.$refs.form.clearValidate()}))},async edit(t){await this.$func.verify("manager.update"),this.form={id:t.id,nickname:t.nickname,avatar:t.avatar,username:t.username,role_id:t.role_id,password:"",status:t.status},this.dialog.title="编辑管理员",this.dialog.show=!0,this.$nextTick((()=>{this.$refs.form.clearValidate()}))},update(){this.$refs.form.validate((t=>{t&&(this.button.disabled=!0,this.button.loading=!0,this.button.text="提交中...",r(this.form).then((t=>{t.status?this.$func.error(t.message):this.$func.success(t.message).then((()=>{this.dialog.show=!1,this.list()})),this.button.disabled=!1,this.button.loading=!1,this.button.text="提 交"})).catch((t=>{this.button.disabled=!1,this.button.loading=!1,this.button.text="提 交"})))}))},multiple(t){this.selection=[],t.length&&t.forEach((t=>{this.selection.push(t.id)}))},async active(){if(await this.$func.verify("manager.active"),!this.selection.length)return this.$func.error("请选择你要操作的数据"),!1;i({id:this.selection}).then((t=>{t.status?this.$func.error(t.message):this.list()}))},async lock(){if(await this.$func.verify("manager.lock"),!this.selection.length)return this.$func.error("请选择你要操作的数据"),!1;o({id:this.selection}).then((t=>{t.status?this.$func.error(t.message):this.list()}))},del(){if(!this.selection.length)return this.$func.error("请选择你要操作的数据"),!1;this.destroy(this.selection)},async destroy(t){await this.$func.verify("manager.destroy"),this.$confirm("您确定要删除选中的该条信息吗？","提示",{type:"warning",confirmButtonText:"确 定",cancelButtonText:"取 消"}).then((()=>{l({id:t}).then((t=>{t.status?this.$func.error(t.message):this.list()}))})).catch((()=>{}))},search(){this.params.page=1,this.list()},page(t){this.params.page=t,this.list()},select(t){this.form.avatar=t}}},(function(){var t=this,e=t._self._c;return e("div",{staticClass:"board-content"},[e("div",{staticClass:"board-header"},[e("div",{staticClass:"board-search"},[t.configs?e("div",{staticClass:"search-item"},[e("el-select",{attrs:{size:"small",filterable:""},model:{value:t.params.status,callback:function(e){t.$set(t.params,"status",e)},expression:"params.status"}},[e("el-option",{attrs:{value:0,label:"全部状态"}}),t._l(t.configs.status,(function(t,s){return e("el-option",{key:s,attrs:{label:t,value:s}})}))],2)],1):t._e(),t.roles?e("div",{staticClass:"search-item"},[e("el-select",{attrs:{size:"small"},model:{value:t.params.role_id,callback:function(e){t.$set(t.params,"role_id",e)},expression:"params.role_id"}},[e("el-option",{attrs:{value:0,label:"全部角色"}}),t._l(t.roles,(function(t,s){return e("el-option",{key:parseInt(s),attrs:{label:t,value:parseInt(s)}})}))],2)],1):t._e(),e("div",{staticClass:"search-item"},[e("el-input",{attrs:{placeholder:"请输入用户名/昵称",size:"small",clearable:""},model:{value:t.params.kwd,callback:function(e){t.$set(t.params,"kwd",e)},expression:"params.kwd"}})],1),e("div",{staticClass:"search-item"},[e("el-button",{attrs:{type:"primary",size:"small",icon:"el-icon-search"},on:{click:function(e){return t.search()}}},[t._v("搜索")])],1)]),e("div",{staticClass:"board-handle"},[e("el-button",{attrs:{type:"warning",icon:"fa fa-refresh",size:"small"},on:{click:function(e){return t.list()}}},[t._v(" 刷新")]),e("el-button",{attrs:{type:"primary",icon:"fa fa-plus",size:"small"},on:{click:function(e){return t.create()}}},[t._v(" 新增")]),e("el-button",{attrs:{type:"success",icon:"fa fa-unlock-alt",size:"small"},on:{click:function(e){return t.active()}}},[t._v(" 启用")]),e("el-button",{attrs:{type:"danger",icon:"fa fa-lock",size:"small"},on:{click:function(e){return t.lock()}}},[t._v(" 锁定")]),e("el-button",{attrs:{type:"info",icon:"fa fa-trash",size:"small"},on:{click:function(e){return t.del()}}},[t._v(" 删除")])],1)]),e("div",{staticClass:"board-main"},[t.datas?e("el-table",{directives:[{name:"loading",rawName:"v-loading",value:t.loading,expression:"loading"}],ref:"multipleHandle",attrs:{"element-loading-text":"努力加载中...","element-loading-spinner":"el-icon-loading",stripe:"","tooltip-effect":"dark",height:t.tableHeight,data:t.datas.data,border:""},on:{"selection-change":t.multiple}},[e("el-table-column",{attrs:{type:"selection",width:"45",align:"center"}}),e("el-table-column",{attrs:{prop:"id",label:"编号",width:"65",align:"center"}}),e("el-table-column",{attrs:{prop:"thumb",label:"头像",width:"70",align:"center"},scopedSlots:t._u([{key:"default",fn:function(t){return[e("el-image",{staticClass:"board-table-image",attrs:{src:"/avatar/a"+t.row.avatar+".jpg","preview-src-list":["/avatar/a"+t.row.avatar+".jpg"]}})]}}],null,!1,3130040753)}),e("el-table-column",{attrs:{prop:"username",label:"用户名",width:"150"}}),e("el-table-column",{attrs:{prop:"nickname",label:"昵称",width:"150"}}),e("el-table-column",{attrs:{prop:"role.title",label:"角色",width:"140"}}),e("el-table-column",{attrs:{prop:"status_text",label:"状态",width:"80",align:"center"},scopedSlots:t._u([{key:"default",fn:function(s){return[e("el-tag",{attrs:{type:t.$func.formatTag(s.row.status+2)}},[t._v(t._s(s.row.status_text))])]}}],null,!1,826915959)}),e("el-table-column",{attrs:{prop:"created_at",label:"创建时间",width:"160"},scopedSlots:t._u([{key:"default",fn:function(e){return[t._v(" "+t._s(t.$func.formatDateTime(e.row.created_at))+" ")]}}],null,!1,1965584032)}),e("el-table-column",{attrs:{label:"操作",fixed:"right","min-width":"260"},scopedSlots:t._u([{key:"default",fn:function(s){return[e("el-button",{attrs:{type:"primary",icon:"fa fa-edit",size:"mini",plain:""},on:{click:function(e){return t.edit(s.row)}}},[t._v(" 编辑 ")]),e("el-button",{attrs:{type:"info",icon:"fa fa-trash",size:"mini",plain:""},on:{click:function(e){return t.destroy(s.row.id)}}},[t._v(" 删除 ")])]}}],null,!1,697974088)})],1):t._e()],1),e("pagination",{attrs:{datas:t.datas},on:{page:t.page}}),e("el-dialog",{staticClass:"board-dialog",attrs:{fullscreen:"","close-on-click-modal":!1,"close-on-press-escape":!1,title:t.dialog.title,visible:t.dialog.show,center:""},on:{"update:visible":function(e){return t.$set(t.dialog,"show",e)}}},[t.form?e("el-form",{ref:"form",staticClass:"board-form",attrs:{model:t.form,rules:t.rules,"label-width":"120px"}},[e("div",{staticClass:"item-title"},[t._v("基本信息"),e("div",{staticClass:"title-note"},[e("span",[t._v("* ")]),t._v("为必填项")])]),e("div",{staticClass:"form-item"},[e("el-form-item",{attrs:{label:"角 色：",prop:"role_id",required:""}},[e("el-select",{attrs:{size:"medium"},model:{value:t.form.role_id,callback:function(e){t.$set(t.form,"role_id",e)},expression:"form.role_id"}},[e("el-option",{attrs:{value:0,label:"选择角色"}}),t._l(t.roles,(function(t,s){return e("el-option",{key:parseInt(s),attrs:{label:t,value:parseInt(s)}})}))],2)],1),e("el-form-item",{attrs:{label:"账 户：",prop:"username"}},[e("el-input",{attrs:{placeholder:"请填写管理员账户","prefix-icon":"fa fa-user",size:"medium",clearable:""},model:{value:t.form.username,callback:function(e){t.$set(t.form,"username",e)},expression:"form.username"}})],1),e("el-form-item",{attrs:{label:"昵 称：",prop:"nickname"}},[e("el-input",{attrs:{placeholder:"请填写管理员昵称","prefix-icon":"fa fa-user-md",size:"medium",clearable:""},model:{value:t.form.nickname,callback:function(e){t.$set(t.form,"nickname",e)},expression:"form.nickname"}})],1),0==t.form.id?e("el-form-item",{attrs:{label:"密 码：",prop:"password"}},[e("el-input",{attrs:{placeholder:"请填写管理员密码，默认123456","prefix-icon":"fa fa-unlock-alt",size:"medium",clearable:"",onfocus:"this.type='password'"},model:{value:t.form.password,callback:function(e){t.$set(t.form,"password",e)},expression:"form.password"}})],1):e("el-form-item",{attrs:{label:"密 码：",prop:"password"}},[e("el-input",{attrs:{placeholder:"请填写管理员密码，不填写表示不修改密码","prefix-icon":"fa fa-unlock-alt",size:"medium",clearable:"",onfocus:"this.type='password'"},model:{value:t.form.password,callback:function(e){t.$set(t.form,"password",e)},expression:"form.password"}})],1),e("el-form-item",{attrs:{label:"头 像：",prop:"avatar"}},[e("div",{staticClass:"form-avatar"},t._l(t.avatars,(function(s,a){return e("img",{key:a,class:s==t.form.avatar?"active":"",attrs:{src:t.$func.assetsFile("avatar/a"+s+".jpg"),alt:""},on:{click:function(e){return t.select(s)}}})})),0)]),e("el-form-item",{attrs:{label:"状 态：",prop:"status"}},[e("el-radio-group",{attrs:{size:"medium"},model:{value:t.form.status,callback:function(e){t.$set(t.form,"status",e)},expression:"form.status"}},t._l(t.configs.status,(function(s,a){return e("el-radio",{key:a,attrs:{label:Number(a),border:""}},[t._v(t._s(s)+" ")])})),1)],1)],1)]):t._e(),e("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[e("el-button",{attrs:{type:"primary",loading:t.button.loading,disabled:t.button.disable},on:{click:t.update}},[t._v(t._s(t.button.text))]),e("el-button",{staticClass:"close-btn",on:{click:function(e){t.dialog.show=!1}}},[t._v("关 闭")])],1)],1)],1)}),[],!1,null,"640c7eee",null,null).exports;export{m as default};