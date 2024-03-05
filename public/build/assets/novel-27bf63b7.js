import{m as t}from"./vuex-fb1740e5.js";import{aq as e,ar as s,as as a,at as r,au as i,av as o,aw as l,ax as n,ay as c}from"./app-64dc16a0.js";import{n as p}from"./vue-verify-code-21b6e9ae.js";import"./w-e6fba1f3.js";import"./axios-5ae1da96.js";import"./vue-9f7ddc78.js";import"./async-validator-68c927eb.js";import"./babel-runtime-b0e6bb14.js";import"./crypto-js-e93d4fbc.js";import"./element-tiptap-f39d3908.js";import"./tiptap-cd99e86f.js";import"./prosemirror-state-aff6b6a5.js";import"./prosemirror-model-e99bf1dc.js";import"./orderedmap-1ac72264.js";import"./prosemirror-transform-0ba15ba3.js";import"./prosemirror-view-e30b2d7a.js";import"./prosemirror-dropcursor-41f27ba8.js";import"./prosemirror-gapcursor-8cdc000d.js";import"./prosemirror-keymap-e0a1e6d1.js";import"./w3c-keyname-5afe5a41.js";import"./prosemirror-commands-994280f1.js";import"./prosemirror-inputrules-51b7290b.js";import"./tiptap-utils-1e7277fa.js";import"./tiptap-extensions-b74a4f9a.js";import"./tiptap-commands-9e395e16.js";import"./prosemirror-schema-list-a2d0a333.js";import"./highlight.js-45c9f23d.js";import"./fault-4bc10d66.js";import"./format-ca30c10a.js";import"./prosemirror-history-094ab62a.js";import"./rope-sequence-72d4f3ff.js";import"./prosemirror-utils-15148092.js";import"./prosemirror-tables-78b83e4c.js";import"./element-ui-85fcec33.js";import"./resize-observer-polyfill-26170312.js";import"./throttle-debounce-f2d3495b.js";import"./babel-helper-vue-jsx-merge-props-ae7f6986.js";import"./normalize-wheel-2c441d7d.js";import"./deepmerge-1c41bee1.js";import"./image-conversion-5dc521cd.js";import"./nprogress-e46a079b.js";import"./vue-cookie-f9b70f6c.js";import"./tiny-cookie-01c919d1.js";import"./moment-0b360bb8.js";/* empty css                     */import"./xgplayer-ddb6d22b.js";import"./eventemitter3-91a3dd57.js";import"./delegate-333e72eb.js";import"./downloadjs-bf7647fe.js";import"./xgplayer-hls-e482b1c5.js";import"./xgplayer-streaming-shared-a05e1a43.js";import"./xgplayer-transmuxer-2825904a.js";import"./xgplayer-music-47c62e3d.js";import"./vue-router-29840f2f.js";import"./vue-axios-5ff5ffea.js";import"./qs-7cd75b61.js";import"./side-channel-c3af32fe.js";import"./get-intrinsic-bac01933.js";import"./has-symbols-456daba2.js";import"./has-proto-4a87f140.js";import"./function-bind-72d06d3b.js";import"./has-885c3436.js";import"./call-bind-fae29077.js";import"./object-inspect-d5fba9a3.js";const m=p({computed:{...t({tableHeight:t=>t.tableHeight})},data:function(){return{loading:!1,datas:null,configs:null,chapters:[],selection:[],params:{page:1,kwd:"",status:0,type_id:0},button:{loading:!1,disable:!1,text:"提 交"},dialog:{title:"",show:!1},dialogChapter:{title:"",show:!1},form:null,formChapter:null,rules:{type_id:[{required:!0,message:"请选择类目",trigger:"change"},{validator:(t,e,s)=>{0===e&&s(new Error("请选择类目")),s()},trigger:"blur"}],title:[{required:!0,message:"请填写标题",trigger:"blur"}],thumb:[{required:!0,message:"请填写封面图片地址",trigger:"blur"}],blurb:[{required:!0,message:"请填写简介",trigger:"blur"}]},ruleChapters:{title:[{required:!0,message:"请填写标题",trigger:"blur"}],content:[{required:!0,message:"请填写内容",trigger:"blur"}]},novelId:0}},activated(){this.config(),this.list()},methods:{config(){e().then((t=>{t.status?this.$func.error(t.message):this.configs=t.data}))},async list(){await this.$func.verify("novel.list"),this.loading=!0,s(this.params).then((t=>{t.status?this.$func.error(t.message):this.datas=t.data,this.loading=!1})).catch((t=>{this.loading=!1}))},async create(){await this.$func.verify("novel.update"),this.form={id:0,title:"",blurb:"",thumb:"",money:"",show:0,free:3,type_id:0,status:1},this.dialog.title="新增小说",this.dialog.show=!0,this.$nextTick((()=>{this.$refs.form.clearValidate()}))},async edit(t){await this.$func.verify("novel.update"),this.form={id:t.id,title:t.title,blurb:t.blurb,money:t.money,thumb:t.thumb,show:t.show,free:t.free,type_id:t.type_id,status:t.status},this.dialog.title="编辑小说",this.dialog.show=!0,this.$nextTick((()=>{this.$refs.form.clearValidate()}))},update(){this.$refs.form.validate((t=>{t&&(this.button.disabled=!0,this.button.loading=!0,this.button.text="提交中...",a(this.form).then((t=>{t.status?this.$func.error(t.message):this.$func.success(t.message).then((()=>{this.dialog.show=!1,this.list()})),this.button.disabled=!1,this.button.loading=!1,this.button.text="提 交"})).catch((t=>{this.button.disabled=!1,this.button.loading=!1,this.button.text="提 交"})))}))},multiple(t){this.selection=[],t.length&&t.forEach((t=>{this.selection.push(t.id)}))},async active(){if(await this.$func.verify("novel.active"),!this.selection.length)return this.$func.error("请选择你要操作的数据"),!1;r({id:this.selection}).then((t=>{t.status?this.$func.error(t.message):this.list()}))},async lock(){if(await this.$func.verify("novel.lock"),!this.selection.length)return this.$func.error("请选择你要操作的数据"),!1;i({id:this.selection}).then((t=>{t.status?this.$func.error(t.message):this.list()}))},del(){if(!this.selection.length)return this.$func.error("请选择你要操作的数据"),!1;this.destroy(this.selection)},async destroy(t){await this.$func.verify("novel.destroy"),this.$confirm("您确定要删除选中的该条信息吗？","提示",{type:"warning",confirmButtonText:"确 定",cancelButtonText:"取 消"}).then((()=>{o({id:t}).then((t=>{t.status?this.$func.error(t.message):this.list()}))})).catch((()=>{}))},async chapter(t){await this.$func.verify("novel.chapter"),l({id:t}).then((e=>{e.status?this.$func.error(e.message):(this.chapters=e.data,this.dialogChapter.title="章节管理",this.dialogChapter.show=!0,this.novelId=t,this.createChapter())}))},createChapter(){this.formChapter={id:0,title:"",novel_id:this.novelId,content:""},this.$nextTick((()=>{this.$refs.formChapter.clearValidate()}))},editChapter(t){this.formChapter={id:t.id,novel_id:t.novel_id,title:t.title,content:t.content},this.novelId=t.novel_id,this.$nextTick((()=>{this.$refs.formChapter.clearValidate()}))},async updateChapter(){await this.$func.verify("novel.save"),this.$refs.formChapter.validate((t=>{t&&(this.button.disabled=!0,this.button.loading=!0,this.button.text="提交中...",n(this.formChapter).then((t=>{t.status?this.$func.error(t.message):this.$func.success(t.message).then((()=>{this.chapter(this.novelId)})),this.button.disabled=!1,this.button.loading=!1,this.button.text="提 交"})).catch((t=>{this.button.disabled=!1,this.button.loading=!1,this.button.text="提 交"})))}))},async destroyChapter(t){await this.$func.verify("novel.delete"),this.$confirm("您确定要删除选中的该条信息吗？","提示",{type:"warning",confirmButtonText:"确 定",cancelButtonText:"取 消"}).then((()=>{c({id:t}).then((t=>{t.status?this.$func.error(t.message):this.chapter(this.novelId)}))})).catch((()=>{}))},search(){this.params.page=1,this.list()},page(t){this.params.page=t,this.list()},random(){this.form.show=this.$func.randNumber()}}},(function(){var t=this,e=t._self._c;return e("div",{staticClass:"board-content"},[e("div",{staticClass:"board-header"},[e("div",{staticClass:"board-search"},[t.configs?e("div",{staticClass:"search-item"},[e("el-select",{attrs:{size:"small",filterable:""},model:{value:t.params.status,callback:function(e){t.$set(t.params,"status",e)},expression:"params.status"}},[e("el-option",{attrs:{value:0,label:"全部状态"}}),t._l(t.configs.status,(function(t,s){return e("el-option",{key:s,attrs:{label:t,value:s}})}))],2)],1):t._e(),t.configs?e("div",{staticClass:"search-item"},[e("el-select",{attrs:{size:"small"},model:{value:t.params.type_id,callback:function(e){t.$set(t.params,"type_id",e)},expression:"params.type_id"}},[e("el-option",{attrs:{value:0,label:"全部类目"}}),t._l(t.configs.types,(function(t,s){return e("el-option",{key:parseInt(s),attrs:{label:t,value:parseInt(s)}})}))],2)],1):t._e(),e("div",{staticClass:"search-item"},[e("el-input",{attrs:{placeholder:"请输入用标题",size:"small",clearable:""},model:{value:t.params.kwd,callback:function(e){t.$set(t.params,"kwd",e)},expression:"params.kwd"}})],1),e("div",{staticClass:"search-item"},[e("el-button",{attrs:{type:"primary",size:"small",icon:"el-icon-search"},on:{click:function(e){return t.search()}}},[t._v("搜索")])],1)]),e("div",{staticClass:"board-handle"},[e("el-button",{attrs:{type:"warning",icon:"fa fa-refresh",size:"small"},on:{click:function(e){return t.list()}}},[t._v(" 刷新")]),e("el-button",{attrs:{type:"primary",icon:"fa fa-plus",size:"small"},on:{click:function(e){return t.create()}}},[t._v(" 新增")]),e("el-button",{attrs:{type:"success",icon:"fa fa-unlock-alt",size:"small"},on:{click:function(e){return t.active()}}},[t._v(" 启用")]),e("el-button",{attrs:{type:"danger",icon:"fa fa-lock",size:"small"},on:{click:function(e){return t.lock()}}},[t._v(" 锁定")])],1)]),e("div",{staticClass:"board-main"},[t.datas?e("el-table",{directives:[{name:"loading",rawName:"v-loading",value:t.loading,expression:"loading"}],ref:"multipleHandle",attrs:{"element-loading-text":"努力加载中...","element-loading-spinner":"el-icon-loading",stripe:"","tooltip-effect":"dark",height:t.tableHeight,data:t.datas.data,border:""},on:{"selection-change":t.multiple}},[e("el-table-column",{attrs:{type:"selection",width:"45",align:"center"}}),e("el-table-column",{attrs:{prop:"id",label:"编号",width:"80",align:"center"}}),e("el-table-column",{attrs:{prop:"thumb",label:"封面",width:"80",align:"center"},scopedSlots:t._u([{key:"default",fn:function(t){return[e("el-image",{staticClass:"board-table-image",attrs:{src:t.row.thumb,"preview-src-list":[t.row.thumb]}})]}}],null,!1,3171925937)}),e("el-table-column",{attrs:{prop:"title",label:"标题",width:"250","show-overflow-tooltip":""}}),e("el-table-column",{attrs:{prop:"type.title",label:"类目",width:"80",align:"center"}}),e("el-table-column",{attrs:{prop:"money",label:"价格",width:"60",align:"center"}}),e("el-table-column",{attrs:{prop:"chapter",label:"章节",width:"60",align:"center"}}),e("el-table-column",{attrs:{prop:"show",label:"人气",width:"80",align:"center"}}),e("el-table-column",{attrs:{prop:"status_text",label:"状态",width:"70",align:"center"},scopedSlots:t._u([{key:"default",fn:function(s){return[e("el-tag",{attrs:{type:t.$func.formatTag(s.row.status+2)}},[t._v(t._s(s.row.status_text))])]}}],null,!1,826915959)}),e("el-table-column",{attrs:{prop:"created_at",label:"创建时间",width:"160"},scopedSlots:t._u([{key:"default",fn:function(e){return[t._v(" "+t._s(t.$func.formatDateTime(e.row.created_at))+" ")]}}],null,!1,1965584032)}),e("el-table-column",{attrs:{prop:"created_at",label:"最近更新",width:"160"},scopedSlots:t._u([{key:"default",fn:function(e){return[t._v(" "+t._s(t.$func.formatDateTime(e.row.updated_at))+" ")]}}],null,!1,8088405)}),e("el-table-column",{attrs:{label:"操作",fixed:"right","min-width":"260"},scopedSlots:t._u([{key:"default",fn:function(s){return[e("el-button",{attrs:{type:"primary",icon:"fa fa-edit",size:"mini",plain:""},on:{click:function(e){return t.edit(s.row)}}},[t._v(" 编辑")]),e("el-button",{attrs:{type:"warning",icon:"fa fa-sitemap",size:"mini",plain:""},on:{click:function(e){return t.chapter(s.row.id)}}},[t._v(" 章节")]),e("el-button",{attrs:{type:"info",icon:"fa fa-trash",size:"mini",plain:""},on:{click:function(e){return t.destroy(s.row.id)}}},[t._v(" 删除")])]}}],null,!1,30709465)})],1):t._e()],1),e("pagination",{attrs:{datas:t.datas},on:{page:t.page}}),e("el-dialog",{staticClass:"board-dialog",attrs:{fullscreen:"","close-on-click-modal":!1,"close-on-press-escape":!1,title:t.dialog.title,visible:t.dialog.show,center:""},on:{"update:visible":function(e){return t.$set(t.dialog,"show",e)}}},[t.form?e("el-form",{ref:"form",staticClass:"board-form",attrs:{model:t.form,rules:t.rules,"label-width":"120px"}},[e("div",{staticClass:"item-title"},[t._v("基本信息"),e("div",{staticClass:"title-note"},[e("span",[t._v("* ")]),t._v("为必填项")])]),e("div",{staticClass:"form-item"},[e("el-form-item",{attrs:{label:"类 目：",prop:"type_id",required:""}},[e("el-select",{attrs:{size:"medium"},model:{value:t.form.type_id,callback:function(e){t.$set(t.form,"type_id",e)},expression:"form.type_id"}},[e("el-option",{attrs:{value:0,label:"选择类目"}}),t._l(t.configs.types,(function(t,s){return e("el-option",{key:parseInt(s),attrs:{label:t,value:parseInt(s)}})}))],2)],1),e("el-form-item",{attrs:{label:"标 题：",prop:"title"}},[e("el-input",{attrs:{placeholder:"请填写标题","prefix-icon":"fa fa-bars",size:"medium",clearable:""},model:{value:t.form.title,callback:function(e){t.$set(t.form,"title",e)},expression:"form.title"}})],1),e("el-form-item",{attrs:{label:"封 面：",prop:"thumb"}},[e("el-popover",{attrs:{placement:"bottom-start",disabled:!t.form.thumb,trigger:"hover"}},[e("el-image",{staticClass:"board-thumb",attrs:{src:t.form.thumb}}),e("el-input",{attrs:{slot:"reference",placeholder:"请填写封面地址","prefix-icon":"fa fa-image",size:"medium",clearable:""},slot:"reference",model:{value:t.form.thumb,callback:function(e){t.$set(t.form,"thumb",e)},expression:"form.thumb"}})],1)],1),e("el-form-item",{attrs:{label:"简 介：",prop:"blurb"}},[e("el-input",{attrs:{type:"textarea",rows:"5",placeholder:"请填写简介",clearable:""},model:{value:t.form.blurb,callback:function(e){t.$set(t.form,"blurb",e)},expression:"form.blurb"}})],1),e("el-form-item",{attrs:{label:"价 格：",prop:"money"}},[e("el-input",{attrs:{placeholder:"请填写价格，0代表免费","prefix-icon":"fa fa-money",size:"medium",clearable:""},model:{value:t.form.money,callback:function(e){t.$set(t.form,"money",e)},expression:"form.money"}})],1),e("el-form-item",{attrs:{label:"免 费：",prop:"free"}},[e("el-input",{attrs:{placeholder:"请填写免费章节数","prefix-icon":"fa fa-share-alt",size:"medium",clearable:""},model:{value:t.form.free,callback:function(e){t.$set(t.form,"free",e)},expression:"form.free"}})],1),e("el-form-item",{attrs:{label:"人 气：",prop:"show"}},[e("el-input",{staticStyle:{width:"50%","margin-right":"15px"},attrs:{placeholder:"请填写人气","prefix-icon":"fa fa-eye",size:"medium",clearable:""},model:{value:t.form.show,callback:function(e){t.$set(t.form,"show",e)},expression:"form.show"}}),e("el-button",{staticClass:"rand-btn",attrs:{type:"primary",size:"medium"},on:{click:t.random}},[t._v("随机生产")])],1),e("el-form-item",{attrs:{label:"状 态：",prop:"status"}},[e("el-radio-group",{attrs:{size:"medium"},model:{value:t.form.status,callback:function(e){t.$set(t.form,"status",e)},expression:"form.status"}},t._l(t.configs.status,(function(s,a){return e("el-radio",{key:a,attrs:{label:Number(a),border:""}},[t._v(t._s(s)+" ")])})),1)],1)],1)]):t._e(),e("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[e("el-button",{attrs:{type:"primary",loading:t.button.loading,disabled:t.button.disable},on:{click:t.update}},[t._v(t._s(t.button.text))]),e("el-button",{staticClass:"close-btn",on:{click:function(e){t.dialog.show=!1}}},[t._v("关 闭")])],1)],1),e("el-dialog",{staticClass:"board-dialog dialog-chapter",attrs:{fullscreen:"","close-on-click-modal":!1,"close-on-press-escape":!1,title:t.dialogChapter.title,visible:t.dialogChapter.show,center:""},on:{"update:visible":function(e){return t.$set(t.dialogChapter,"show",e)}}},[e("div",{staticClass:"chapter"},[e("div",{staticClass:"chapter-box"},[e("div",{staticClass:"title"},[t._v("目录("+t._s(t.chapters.length)+")")]),e("div",{staticClass:"chapter-item-box"},t._l(t.chapters,(function(s,a){return e("div",{key:a,class:t.formChapter&&t.formChapter.id==s.id?"chapter-item active":"chapter-item",attrs:{title:"点我修改",alt:"点我修改"},on:{click:function(e){return t.editChapter(s)}}},[t._v(t._s(s.title))])})),0),e("div",{staticClass:"chapter-create",on:{click:t.createChapter}},[e("i",{staticClass:"fa fa-plus"}),t._v(" 章节")])]),e("div",{staticClass:"chapter-form"},[t.formChapter?e("el-form",{ref:"formChapter",staticClass:"board-form",attrs:{model:t.formChapter,rules:t.ruleChapters,"label-width":"120px"}},[e("div",{staticClass:"item-title"},[t._v("基本信息"),e("div",{staticClass:"title-note"},[e("span",[t._v("* ")]),t._v("为必填项")])]),e("div",{staticClass:"form-item"},[e("el-form-item",{attrs:{label:"标 题：",prop:"title"}},[e("el-input",{attrs:{placeholder:"请填写标题","prefix-icon":"fa fa-bars",size:"medium",clearable:""},model:{value:t.formChapter.title,callback:function(e){t.$set(t.formChapter,"title",e)},expression:"formChapter.title"}})],1),e("el-form-item",{attrs:{label:"内 容：",prop:"content"}},[e("editor",{attrs:{height:510},model:{value:t.formChapter.content,callback:function(e){t.$set(t.formChapter,"content",e)},expression:"formChapter.content"}})],1),e("div",{staticStyle:{"text-align":"center"}},[e("el-button",{attrs:{type:"primary",loading:t.button.loading,disabled:t.button.disable},on:{click:t.updateChapter}},[t._v(t._s(t.button.text))]),t.formChapter.id?e("el-button",{staticStyle:{"margin-left":"50px"},attrs:{type:"info"},on:{click:function(e){return t.destroyChapter(t.formChapter.id)}}},[t._v("删除")]):t._e()],1)],1)]):t._e()],1)])])],1)}),[],!1,null,null,null,null).exports;export{m as default};
