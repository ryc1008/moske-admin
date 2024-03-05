import{m as t}from"./vuex-fb1740e5.js";import{n as e}from"./vue-verify-code-21b6e9ae.js";const s=e({components:{vHeader:e({computed:{...t({breadcrumb:t=>t.breadcrumb,user:t=>t.user})},data:function(){return{}},created(){},methods:{logout(){this.$store.dispatch("userLogout").then((()=>{this.$func.success("正在退出登录......").then((()=>{this.$router.push({name:"admin_login"})}))}))}}},(function(){var t=this,e=t._self._c;return e("header",{staticClass:"header",attrs:{id:"header"}},[t._m(0),e("div",{staticClass:"header-breadcrumb"},[e("el-breadcrumb",{attrs:{separator:"/"}},[e("el-breadcrumb-item",{attrs:{to:{name:"admin_main"}}},[t._v("系统首页")]),t._l(t.breadcrumb,(function(s,a){return e("el-breadcrumb-item",{key:this},[e("span",{class:t.breadcrumb.length==a+1?"header-title current":"header-title"},[t._v(t._s(s.title))])])}))],2)],1),t.user?e("div",{staticClass:"header-user"},[e("div",{staticClass:"avatar"},[e("img",{attrs:{src:t.$func.assetsFile("avatar/a"+t.user.avatar+".jpg"),alt:""}})]),e("div",{staticClass:"nickname"},[t._v(t._s(t.user.nickname))]),e("div",{staticClass:"logout",on:{click:function(e){return t.logout()}}},[e("i",{staticClass:"fa fa-power-off"}),t._v(" 退出")])]):t._e()])}),[function(){var t=this,e=t._self._c;return e("div",{staticClass:"header-logo"},[t._v(" 渠道"),e("span",[t._v("系统")])])}],!1,null,null,null,null).exports,vMenu:e({computed:{...t({active:t=>t.active,isCollapse:t=>t.isCollapse,routers:t=>t.routers})},created(){},methods:{collapse(){this.isCollapse?this.$store.dispatch("setState",{isCollapse:!1}):this.$store.dispatch("setState",{isCollapse:!0})}}},(function(){var t=this,e=t._self._c;return e("div",[e("el-menu",{staticClass:"menu",attrs:{"default-active":t.active,collapse:t.isCollapse,"background-color":"transparent","text-color":"#222b45",router:!0,"unique-opened":!0,"active-text-color":"#fff"}},[e("el-menu-item",{attrs:{index:"/main"}},[e("i",{staticClass:"fa fa-home fa-icon"}),e("span",{attrs:{slot:"title"},slot:"title"},[t._v("我的首页")])]),e("el-menu-item",{attrs:{index:"/flow"}},[e("i",{staticClass:"fa fa-area-chart fa-icon"}),e("span",{attrs:{slot:"title"},slot:"title"},[t._v("我的报表")])]),e("el-menu-item",{attrs:{index:"/trade"}},[e("i",{staticClass:"fa fa-money fa-icon"}),e("span",{attrs:{slot:"title"},slot:"title"},[t._v("我的结算")])]),e("el-menu-item",{attrs:{index:"/route"}},[e("i",{staticClass:"fa fa-send fa-icon"}),e("span",{attrs:{slot:"title"},slot:"title"},[t._v("渠道管理")])]),e("el-menu-item",{attrs:{index:"/info"}},[e("i",{staticClass:"fa fa-user fa-icon"}),e("span",{attrs:{slot:"title"},slot:"title"},[t._v("我的资料")])]),e("el-menu-item",{attrs:{index:"/password"}},[e("i",{staticClass:"fa fa-lock fa-icon"}),e("span",{attrs:{slot:"title"},slot:"title"},[t._v("修改密码")])])],1),e("div",{class:t.isCollapse?"menu-collapse is-collapse":"menu-collapse"},[e("i",{staticClass:"fa fa-dedent",attrs:{alt:"折叠菜单",title:"折叠菜单"},on:{click:t.collapse}})])],1)}),[],!1,null,null,null,null).exports,vFooter:e({data:function(){return{start:(new Date).getFullYear()-2,end:(new Date).getFullYear()+2}}},(function(){var t=this;return(0,t._self._c)("div",{staticClass:"footer"},[t._v(" © "+t._s(t.start)+"-"+t._s(t.end)+" Powered By Management System ")])}),[],!1,null,null,null,null).exports},computed:{...t({isCollapse:t=>t.isCollapse})}},(function(){var t=this._self._c;return t("div",{staticClass:"board"},[t("v-header"),t("v-menu"),t("div",{class:this.isCollapse?"main main-collapse":"main"},[t("transition",{attrs:{name:"slide-fade",mode:"out-in"}},[t("keep-alive",[t("router-view")],1)],1)],1),t("v-footer")],1)}),[],!1,null,null,null,null).exports;export{s as default};