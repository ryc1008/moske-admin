import{m as t}from"./vuex-fb1740e5.js";import{be as e,bf as s,bg as i}from"./app-64dc16a0.js";import{n as r}from"./vue-verify-code-21b6e9ae.js";import"./w-e6fba1f3.js";import"./axios-5ae1da96.js";import"./vue-9f7ddc78.js";import"./async-validator-68c927eb.js";import"./babel-runtime-b0e6bb14.js";import"./crypto-js-e93d4fbc.js";import"./element-tiptap-f39d3908.js";import"./tiptap-cd99e86f.js";import"./prosemirror-state-aff6b6a5.js";import"./prosemirror-model-e99bf1dc.js";import"./orderedmap-1ac72264.js";import"./prosemirror-transform-0ba15ba3.js";import"./prosemirror-view-e30b2d7a.js";import"./prosemirror-dropcursor-41f27ba8.js";import"./prosemirror-gapcursor-8cdc000d.js";import"./prosemirror-keymap-e0a1e6d1.js";import"./w3c-keyname-5afe5a41.js";import"./prosemirror-commands-994280f1.js";import"./prosemirror-inputrules-51b7290b.js";import"./tiptap-utils-1e7277fa.js";import"./tiptap-extensions-b74a4f9a.js";import"./tiptap-commands-9e395e16.js";import"./prosemirror-schema-list-a2d0a333.js";import"./highlight.js-45c9f23d.js";import"./fault-4bc10d66.js";import"./format-ca30c10a.js";import"./prosemirror-history-094ab62a.js";import"./rope-sequence-72d4f3ff.js";import"./prosemirror-utils-15148092.js";import"./prosemirror-tables-78b83e4c.js";import"./element-ui-85fcec33.js";import"./resize-observer-polyfill-26170312.js";import"./throttle-debounce-f2d3495b.js";import"./babel-helper-vue-jsx-merge-props-ae7f6986.js";import"./normalize-wheel-2c441d7d.js";import"./deepmerge-1c41bee1.js";import"./image-conversion-5dc521cd.js";import"./nprogress-e46a079b.js";import"./vue-cookie-f9b70f6c.js";import"./tiny-cookie-01c919d1.js";import"./moment-0b360bb8.js";/* empty css                     */import"./xgplayer-ddb6d22b.js";import"./eventemitter3-91a3dd57.js";import"./delegate-333e72eb.js";import"./downloadjs-bf7647fe.js";import"./xgplayer-hls-e482b1c5.js";import"./xgplayer-streaming-shared-a05e1a43.js";import"./xgplayer-transmuxer-2825904a.js";import"./xgplayer-music-47c62e3d.js";import"./vue-router-29840f2f.js";import"./vue-axios-5ff5ffea.js";import"./qs-7cd75b61.js";import"./side-channel-c3af32fe.js";import"./get-intrinsic-bac01933.js";import"./has-symbols-456daba2.js";import"./has-proto-4a87f140.js";import"./function-bind-72d06d3b.js";import"./has-885c3436.js";import"./call-bind-fae29077.js";import"./object-inspect-d5fba9a3.js";const a=r({computed:{...t({tableHeight:t=>t.tableHeight})},data:function(){return{loading:!1,datas:null,configs:null,selection:[],params:{page:1,kwd:"",file:"",level:"",model:""}}},activated(){this.config()},methods:{config(){e().then((t=>{t.status?this.$func.error(t.message):(this.configs=t.data,this.params.file=this.configs.logs[0],this.list())}))},async list(){await this.$func.verify("logger.list"),this.loading=!0,s(this.params).then((t=>{t.status?this.$func.error(t.message):this.datas=t.data,this.loading=!1})).catch((t=>{this.loading=!1}))},async destroy(t){await this.$func.verify("logger.destroy"),this.$confirm("您确定要删除选中的该条信息吗？","提示",{type:"warning",confirmButtonText:"确 定",cancelButtonText:"取 消"}).then((()=>{i({file:this.params.file}).then((t=>{t.status?this.$func.error(t.message):this.config()}))})).catch((()=>{}))},multiple(t){this.selection=[],t.length&&t.forEach((t=>{this.selection.push(t.id)}))},del(){this.destroy()},search(){this.params.page=1,this.list()},page(t){this.params.page=t,this.list()},selectFile(t){this.params.file=t,this.search()}}},(function(){var t=this,e=t._self._c;return e("div",{staticClass:"board-content"},[e("div",{staticClass:"board-header"},[e("div",{staticClass:"board-search"},[t.configs?e("div",{staticClass:"search-item"},[e("el-select",{attrs:{size:"small",filterable:"",clearable:""},model:{value:t.params.level,callback:function(e){t.$set(t.params,"level",e)},expression:"params.level"}},[e("el-option",{attrs:{value:"",label:"全部级别"}}),t._l(t.configs.levels,(function(t,s){return e("el-option",{key:s,attrs:{label:t,value:t}})}))],2)],1):t._e(),t.configs?e("div",{staticClass:"search-item"},[e("el-select",{attrs:{size:"small",filterable:"",clearable:""},model:{value:t.params.model,callback:function(e){t.$set(t.params,"model",e)},expression:"params.model"}},[e("el-option",{attrs:{value:"",label:"全部模块"}}),t._l(t.configs.models,(function(t,s){return e("el-option",{key:s,attrs:{label:t,value:t}})}))],2)],1):t._e(),e("div",{staticClass:"search-item"},[e("el-input",{attrs:{placeholder:"请输入关键字",size:"small",clearable:""},model:{value:t.params.kwd,callback:function(e){t.$set(t.params,"kwd",e)},expression:"params.kwd"}})],1),e("div",{staticClass:"search-item"},[e("el-button",{attrs:{type:"primary",size:"small",icon:"el-icon-search"},on:{click:function(e){return t.search()}}},[t._v("搜索")])],1)]),e("div",{staticClass:"board-handle"},[e("el-button",{attrs:{type:"warning",icon:"fa fa-refresh",size:"small"},on:{click:function(e){return t.config()}}},[t._v(" 刷新")]),e("el-button",{attrs:{type:"info",icon:"fa fa-trash",size:"small"},on:{click:function(e){return t.del()}}},[t._v(" 删除")])],1)]),e("div",{staticStyle:{display:"flex","align-content":"space-between"}},[t.configs?e("div",{staticClass:"log-box"},[e("div",{staticClass:"title"},[t._v("日志文件")]),e("div",{staticClass:"log-item-box"},t._l(t.configs.logs,(function(s,i){return e("div",{key:i,class:t.params.file==s?"log-item active":"log-item",attrs:{title:"点我修改",alt:"点我修改"},on:{click:function(e){return t.selectFile(s)}}},[t._v(t._s(s))])})),0)]):t._e(),e("div",{staticClass:"log-list"},[t.datas?e("el-table",{directives:[{name:"loading",rawName:"v-loading",value:t.loading,expression:"loading"}],attrs:{"element-loading-text":"努力加载中...","element-loading-spinner":"el-icon-loading","tooltip-effect":"dark",height:t.tableHeight,"row-key":"",data:t.datas.data,border:""}},[e("el-table-column",{attrs:{type:"index",label:"编号",width:"80",align:"center"}}),e("el-table-column",{attrs:{prop:"created_at",label:"日期",width:"160"},scopedSlots:t._u([{key:"default",fn:function(e){return[t._v(" "+t._s(t.$func.formatDateTime(e.row.date))+" ")]}}],null,!1,1220163070)}),e("el-table-column",{attrs:{prop:"context",label:"模块",width:"80",align:"center"}}),e("el-table-column",{attrs:{prop:"level",label:"级别",width:"80",align:"center"},scopedSlots:t._u([{key:"default",fn:function(s){return[e("span",{staticClass:"log-level",class:s.row.class},[t._v(t._s(s.row.level))])]}}],null,!1,3875134207)}),e("el-table-column",{attrs:{prop:"name",label:"名称",width:"130"}}),e("el-table-column",{attrs:{prop:"status_text",label:"日志","min-width":"80","show-overflow-tooltip":""},scopedSlots:t._u([{key:"default",fn:function(s){return[e("div",{staticClass:"log-context",class:s.row.class},[s.row.text.length?e("div",["error"==s.row.level?e("div",[t._v("错误："+t._s(s.row.text[0]))]):e("div",[t._v("信息："+t._s(s.row.text))]),s.row.text.length>2?e("div",{staticClass:"path"},[t._v("链接："+t._s(s.row.text[1]))]):t._e(),s.row.text.length>2?e("div",{staticClass:"region"},[t._v("位置："+t._s(s.row.text[2]+"["+s.row.text[3]+"]"))]):t._e()]):e("div",[e("div",[t._v("信息："+t._s(s.row.text))])])])]}}],null,!1,2903549725)})],1):t._e()],1)]),e("pagination",{attrs:{datas:t.datas},on:{page:t.page}})],1)}),[],!1,null,"8944f043",null,null).exports;export{a as default};
