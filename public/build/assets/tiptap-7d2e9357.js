import{E as t,P as e,a as s,T as i}from"./prosemirror-state-425d0e8b.js";import{E as n}from"./prosemirror-view-0d94a9de.js";import{d as o,c as r,D as a}from"./prosemirror-model-e99bf1dc.js";import{d as h}from"./prosemirror-dropcursor-b97670e4.js";import{g as c}from"./prosemirror-gapcursor-f217a1b8.js";import{a as d}from"./prosemirror-keymap-f0b73aa1.js";import{s as u,b as l}from"./prosemirror-commands-5439721d.js";import{i as p,u as m}from"./prosemirror-inputrules-f48e44a0.js";import{m as f,g,n as v,a as b,b as w}from"./tiptap-utils-dfe96f8c.js";import{V as y}from"./vue-9f7ddc78.js";class k{constructor(t,{editor:e,extension:s,parent:i,node:n,view:o,decorations:r,getPos:a}){this.component=t,this.editor=e,this.extension=s,this.parent=i,this.node=n,this.view=o,this.decorations=r,this.isNode=!!this.node.marks,this.isMark=!this.isNode,this.getPos=this.isMark?this.getMarkPos:a,this.captureEvents=!0,this.dom=this.createDOM(),this.contentDOM=this.vm.$refs.content}createDOM(){const t=y.extend(this.component),e={editor:this.editor,node:this.node,view:this.view,getPos:()=>this.getPos(),decorations:this.decorations,selected:!1,options:this.extension.options,updateAttrs:t=>this.updateAttrs(t)};return"function"==typeof this.extension.setSelection&&(this.setSelection=this.extension.setSelection),"function"==typeof this.extension.update&&(this.update=this.extension.update),this.vm=new t({parent:this.parent,propsData:e}).$mount(),this.vm.$el}update(t,e){return t.type===this.node.type&&(t===this.node&&this.decorations===e||(this.node=t,this.decorations=e,this.updateComponentProps({node:t,decorations:e})),!0)}updateComponentProps(t){if(!this.vm._props)return;const e=y.config.silent;y.config.silent=!0,Object.entries(t).forEach((([t,e])=>{this.vm._props[t]=e})),y.config.silent=e}updateAttrs(t){if(!this.view.editable)return;const{state:e}=this.view,{type:s}=this.node,i=this.getPos(),n={...this.node.attrs,...t},o=this.isMark?e.tr.removeMark(i.from,i.to,s).addMark(i.from,i.to,s.create(n)):e.tr.setNodeMarkup(i,null,n);this.view.dispatch(o)}ignoreMutation(t){return"selection"!==t.type&&(!this.contentDOM||!this.contentDOM.contains(t.target))}stopEvent(t){if("function"==typeof this.extension.stopEvent)return this.extension.stopEvent(t);const e=!!this.extension.schema.draggable;if(e&&"mousedown"===t.type){const e=t.target.closest&&t.target.closest("[data-drag-handle]");e&&(this.dom===e||this.dom.contains(e))&&(this.captureEvents=!1,document.addEventListener("dragend",(()=>{this.captureEvents=!0}),{once:!0}))}const s="copy"===t.type,i="paste"===t.type,n="cut"===t.type,o=t.type.startsWith("drag")||"drop"===t.type;return!(e&&o||s||i||n)&&this.captureEvents}selectNode(){this.updateComponentProps({selected:!0})}deselectNode(){this.updateComponentProps({selected:!1})}getMarkPos(){const t=this.view.posAtDOM(this.dom),e=this.view.state.doc.resolve(t);return w(e,this.node.type)}destroy(){this.vm.$destroy()}}class x{on(t,e){return this._callbacks=this._callbacks||{},this._callbacks[t]||(this._callbacks[t]=[]),this._callbacks[t].push(e),this}emit(t,...e){this._callbacks=this._callbacks||{};const s=this._callbacks[t];return s&&s.forEach((t=>t.apply(this,e))),this}off(t,e){if(arguments.length){const s=this._callbacks?this._callbacks[t]:null;s&&(e?this._callbacks[t]=s.filter((t=>t!==e)):delete this._callbacks[t])}else this._callbacks={};return this}}class M{constructor(t={}){this.options={...this.defaultOptions,...t}}init(){return null}bindEditor(t=null){this.editor=t}get name(){return null}get type(){return"extension"}get defaultOptions(){return{}}get plugins(){return[]}inputRules(){return[]}pasteRules(){return[]}keys(){return{}}}class P{constructor(t=[],e){t.forEach((t=>{t.bindEditor(e),t.init()})),this.extensions=t}get nodes(){return this.extensions.filter((t=>"node"===t.type)).reduce(((t,{name:e,schema:s})=>({...t,[e]:s})),{})}get options(){const{view:t}=this;return this.extensions.reduce(((e,s)=>({...e,[s.name]:new Proxy(s.options,{set(e,s,i){const n=e[s]!==i;return Object.assign(e,{[s]:i}),n&&t.updateState(t.state),!0}})})),{})}get marks(){return this.extensions.filter((t=>"mark"===t.type)).reduce(((t,{name:e,schema:s})=>({...t,[e]:s})),{})}get plugins(){return this.extensions.filter((t=>t.plugins)).reduce(((t,{plugins:e})=>[...t,...e]),[])}keymaps({schema:t}){return[...this.extensions.filter((t=>["extension"].includes(t.type))).filter((t=>t.keys)).map((e=>e.keys({schema:t}))),...this.extensions.filter((t=>["node","mark"].includes(t.type))).filter((t=>t.keys)).map((e=>e.keys({type:t[`${e.type}s`][e.name],schema:t})))].map((t=>d(t)))}inputRules({schema:t,excludedExtensions:e}){if(!(e instanceof Array)&&e)return[];const s=e instanceof Array?this.extensions.filter((t=>!e.includes(t.name))):this.extensions;return[...s.filter((t=>["extension"].includes(t.type))).filter((t=>t.inputRules)).map((e=>e.inputRules({schema:t}))),...s.filter((t=>["node","mark"].includes(t.type))).filter((t=>t.inputRules)).map((e=>e.inputRules({type:t[`${e.type}s`][e.name],schema:t})))].reduce(((t,e)=>[...t,...e]),[])}pasteRules({schema:t,excludedExtensions:e}){if(!(e instanceof Array)&&e)return[];const s=e instanceof Array?this.extensions.filter((t=>!e.includes(t.name))):this.extensions;return[...s.filter((t=>["extension"].includes(t.type))).filter((t=>t.pasteRules)).map((e=>e.pasteRules({schema:t}))),...s.filter((t=>["node","mark"].includes(t.type))).filter((t=>t.pasteRules)).map((e=>e.pasteRules({type:t[`${e.type}s`][e.name],schema:t})))].reduce(((t,e)=>[...t,...e]),[])}commands({schema:t,view:e}){return this.extensions.filter((t=>t.commands)).reduce(((s,i)=>{const{name:n,type:o}=i,r={},a=i.commands({schema:t,...["node","mark"].includes(o)?{type:t[`${o}s`][n]}:{}}),h=(t,s)=>!!e.editable&&(e.focus(),t(s)(e.state,e.dispatch,e)),c=(t,e)=>{Array.isArray(e)?r[t]=t=>e.forEach((e=>h(e,t))):"function"==typeof e&&(r[t]=t=>h(e,t))};return"object"==typeof a?Object.entries(a).forEach((([t,e])=>{c(t,e)})):c(n,a),{...s,...r}}),{})}}class A extends M{constructor(t={}){super(t)}get type(){return"mark"}get view(){return null}get schema(){return null}command(){return()=>{}}}function S(t=0,e=0,s=0){return Math.min(Math.max(parseInt(t,10),e),s)}class E extends M{constructor(t={}){super(t)}get type(){return"node"}get view(){return null}get schema(){return null}command(){return()=>{}}}class N extends E{get name(){return"doc"}get schema(){return{content:"block+"}}}class O extends E{get name(){return"paragraph"}get schema(){return{content:"inline*",group:"block",draggable:!1,parseDOM:[{tag:"p"}],toDOM:()=>["p",0]}}commands({type:t}){return()=>u(t)}}class C extends E{get name(){return"text"}get schema(){return{group:"inline"}}}class R extends x{constructor(t={}){super(),this.defaultOptions={editorProps:{},editable:!0,autoFocus:null,extensions:[],content:"",topNode:"doc",emptyDocument:{type:"doc",content:[{type:"paragraph"}]},useBuiltInExtensions:!0,disableInputRules:!1,disablePasteRules:!1,dropCursor:{},enableDropCursor:!0,enableGapCursor:!0,parseOptions:{},injectCSS:!0,onInit:()=>{},onTransaction:()=>{},onUpdate:()=>{},onFocus:()=>{},onBlur:()=>{},onPaste:()=>{},onDrop:()=>{}},this.events=["init","transaction","update","focus","blur","paste","drop"],this.init(t)}init(t={}){this.setOptions({...this.defaultOptions,...t}),this.focused=!1,this.selection={from:0,to:0},this.element=document.createElement("div"),this.extensions=this.createExtensions(),this.nodes=this.createNodes(),this.marks=this.createMarks(),this.schema=this.createSchema(),this.plugins=this.createPlugins(),this.keymaps=this.createKeymaps(),this.inputRules=this.createInputRules(),this.pasteRules=this.createPasteRules(),this.view=this.createView(),this.commands=this.createCommands(),this.setActiveNodesAndMarks(),this.options.injectCSS&&function(t){{const e=document.createElement("style");e.type="text/css",e.textContent=t;const{head:s}=document,{firstChild:i}=s;i?s.insertBefore(e,i):s.appendChild(e)}}('.ProseMirror {\n  position: relative;\n}\n\n.ProseMirror {\n  word-wrap: break-word;\n  white-space: pre-wrap;\n  -webkit-font-variant-ligatures: none;\n  font-variant-ligatures: none;\n}\n\n.ProseMirror pre {\n  white-space: pre-wrap;\n}\n\n.ProseMirror-gapcursor {\n  display: none;\n  pointer-events: none;\n  position: absolute;\n}\n\n.ProseMirror-gapcursor:after {\n  content: "";\n  display: block;\n  position: absolute;\n  top: -2px;\n  width: 20px;\n  border-top: 1px solid black;\n  animation: ProseMirror-cursor-blink 1.1s steps(2, start) infinite;\n}\n\n@keyframes ProseMirror-cursor-blink {\n  to {\n    visibility: hidden;\n  }\n}\n\n.ProseMirror-hideselection *::selection {\n  background: transparent;\n}\n\n.ProseMirror-hideselection *::-moz-selection {\n  background: transparent;\n}\n\n.ProseMirror-hideselection * {\n  caret-color: transparent;\n}\n\n.ProseMirror-focused .ProseMirror-gapcursor {\n  display: block;\n}\n'),null!==this.options.autoFocus&&this.focus(this.options.autoFocus),this.events.forEach((t=>{var e;this.on(t,this.options[(e=`on ${t}`,e.replace(/(?:^\w|[A-Z]|\b\w)/g,((t,e)=>0===e?t.toLowerCase():t.toUpperCase())).replace(/\s+/g,""))]||(()=>{}))})),this.emit("init",{view:this.view,state:this.state}),this.extensions.view=this.view}setOptions(t){this.options={...this.options,...t},this.view&&this.state&&this.view.updateState(this.state)}get builtInExtensions(){return this.options.useBuiltInExtensions?[new N,new C,new O]:[]}get state(){return this.view?this.view.state:null}createExtensions(){return new P([...this.builtInExtensions,...this.options.extensions],this)}createPlugins(){return this.extensions.plugins}createKeymaps(){return this.extensions.keymaps({schema:this.schema})}createInputRules(){return this.extensions.inputRules({schema:this.schema,excludedExtensions:this.options.disableInputRules})}createPasteRules(){return this.extensions.pasteRules({schema:this.schema,excludedExtensions:this.options.disablePasteRules})}createCommands(){return this.extensions.commands({schema:this.schema,view:this.view})}createNodes(){return this.extensions.nodes}createMarks(){return this.extensions.marks}createSchema(){return new o({topNode:this.options.topNode,nodes:this.nodes,marks:this.marks})}createState(){return t.create({schema:this.schema,doc:this.createDocument(this.options.content),plugins:[...this.plugins,p({rules:this.inputRules}),...this.pasteRules,...this.keymaps,d({Backspace:m}),d(l),...this.options.enableDropCursor?[h(this.options.dropCursor)]:[],...this.options.enableGapCursor?[c()]:[],new e({key:new s("editable"),props:{editable:()=>this.options.editable}}),new e({props:{attributes:{tabindex:0},handleDOMEvents:{focus:(t,e)=>{this.focused=!0,this.emit("focus",{event:e,state:t.state,view:t});const s=this.state.tr.setMeta("focused",!0);this.view.dispatch(s)},blur:(t,e)=>{this.focused=!1,this.emit("blur",{event:e,state:t.state,view:t});const s=this.state.tr.setMeta("focused",!1);this.view.dispatch(s)}}}}),new e({props:this.options.editorProps})]})}createDocument(t,e=this.options.parseOptions){if(null===t)return this.schema.nodeFromJSON(this.options.emptyDocument);if("object"==typeof t)try{return this.schema.nodeFromJSON(t)}catch(s){return console.warn("[tiptap warn]: Invalid content.","Passed value:",t,"Error:",s),this.schema.nodeFromJSON(this.options.emptyDocument)}if("string"==typeof t){const s=`<div>${t}</div>`,i=(new window.DOMParser).parseFromString(s,"text/html").body.firstElementChild;return r.fromSchema(this.schema).parse(i,e)}return!1}createView(){return new n(this.element,{state:this.createState(),handlePaste:(...t)=>{this.emit("paste",...t)},handleDrop:(...t)=>{this.emit("drop",...t)},dispatchTransaction:this.dispatchTransaction.bind(this)})}setParentComponent(t=null){t&&this.view.setProps({nodeViews:this.initNodeViews({parent:t,extensions:[...this.builtInExtensions,...this.options.extensions]})})}initNodeViews({parent:t,extensions:e}){return e.filter((t=>["node","mark"].includes(t.type))).filter((t=>t.view)).reduce(((e,s)=>({...e,[s.name]:(e,i,n,o)=>{const r=s.view;return new k(r,{editor:this,extension:s,parent:t,node:e,view:i,getPos:n,decorations:o})}})),{})}dispatchTransaction(t){const e=this.state.apply(t);this.view.updateState(e),this.selection={from:this.state.selection.from,to:this.state.selection.to},this.setActiveNodesAndMarks(),this.emit("transaction",{getHTML:this.getHTML.bind(this),getJSON:this.getJSON.bind(this),state:this.state,transaction:t}),t.docChanged&&!t.getMeta("preventUpdate")&&this.emitUpdate(t)}emitUpdate(t){this.emit("update",{getHTML:this.getHTML.bind(this),getJSON:this.getJSON.bind(this),state:this.state,transaction:t})}resolveSelection(t=null){if(this.selection&&null===t)return this.selection;if("start"===t||!0===t)return{from:0,to:0};if("end"===t){const{doc:t}=this.state;return{from:t.content.size,to:t.content.size}}return{from:t,to:t}}focus(t=null){if(this.view.focused&&null===t||!1===t)return;const{from:e,to:s}=this.resolveSelection(t);this.setSelection(e,s),setTimeout((()=>this.view.focus()),10)}setSelection(t=0,e=0){const{doc:s,tr:n}=this.state,o=S(t,0,s.content.size),r=S(e,0,s.content.size),a=i.create(s,o,r),h=n.setSelection(a);this.view.dispatch(h)}blur(){this.view.dom.blur()}getSchemaJSON(){return JSON.parse(JSON.stringify({nodes:this.extensions.nodes,marks:this.extensions.marks}))}getHTML(){const t=document.createElement("div"),e=a.fromSchema(this.schema).serializeFragment(this.state.doc.content);return t.appendChild(e),t.innerHTML}getJSON(){return this.state.doc.toJSON()}setContent(t={},e=!1,s){const{doc:n,tr:o}=this.state,r=this.createDocument(t,s),a=i.create(n,0,n.content.size),h=o.setSelection(a).replaceSelectionWith(r,!1).setMeta("preventUpdate",!e);this.view.dispatch(h)}clearContent(t=!1){this.setContent(this.options.emptyDocument,t)}setActiveNodesAndMarks(){this.activeMarks=Object.entries(this.schema.marks).reduce(((t,[e,s])=>({...t,[e]:(t={})=>f(this.state,s)})),{}),this.activeMarkAttrs=Object.entries(this.schema.marks).reduce(((t,[e,s])=>({...t,[e]:g(this.state,s)})),{}),this.activeNodes=Object.entries(this.schema.nodes).reduce(((t,[e,s])=>({...t,[e]:(t={})=>v(this.state,s,t)})),{})}getMarkAttrs(t=null){return this.activeMarkAttrs[t]}getNodeAttrs(t=null){return{...b(this.state,this.schema.nodes[t])}}get isActive(){return Object.entries({...this.activeMarks,...this.activeNodes}).reduce(((t,[e,s])=>({...t,[e]:(t={})=>s(t)})),{})}registerPlugin(t=null,e){const s="function"==typeof e?e(t,this.state.plugins):[t,...this.state.plugins],i=this.state.reconfigure({plugins:s});this.view.updateState(i)}unregisterPlugin(t=null){if(!t||!this.view.docView)return;const e=this.state.reconfigure({plugins:this.state.plugins.filter((e=>!e.key.startsWith(`${t}$`)))});this.view.updateState(e)}destroy(){this.view&&this.view.destroy()}}var H={props:{editor:{default:null,type:Object}},watch:{editor:{immediate:!0,handler(t){t&&t.element&&this.$nextTick((()=>{this.$el.appendChild(t.element.firstChild),t.setParentComponent(this)}))}}},render:t=>t("div"),beforeDestroy(){this.editor.element=this.$el}};class D{constructor({options:t}){this.options=t,this.preventHide=!1,this.mousedownHandler=this.handleClick.bind(this),this.options.element.addEventListener("mousedown",this.mousedownHandler,{capture:!0}),this.blurHandler=()=>{this.preventHide?this.preventHide=!1:this.options.editor.emit("menubar:focusUpdate",!1)},this.options.editor.on("blur",this.blurHandler)}handleClick(){this.preventHide=!0}destroy(){this.options.element.removeEventListener("mousedown",this.mousedownHandler),this.options.editor.off("blur",this.blurHandler)}}var j={props:{editor:{default:null,type:Object}},data:()=>({focused:!1}),watch:{editor:{immediate:!0,handler(t){t&&this.$nextTick((()=>{var i;t.registerPlugin((i={editor:t,element:this.$el},new e({key:new s("menu_bar"),view:t=>new D({editorView:t,options:i})}))),this.focused=t.focused,t.on("focus",(()=>{this.focused=!0})),t.on("menubar:focusUpdate",(t=>{this.focused=t}))}))}}},render(){return this.editor?this.$scopedSlots.default({focused:this.focused,focus:this.editor.focus,commands:this.editor.commands,isActive:this.editor.isActive,getMarkAttrs:this.editor.getMarkAttrs.bind(this.editor),getNodeAttrs:this.editor.getNodeAttrs.bind(this.editor)}):null}};function $(t,e,s){const i=document.createRange();return i.setEnd(t,null==s?t.nodeValue.length:s),i.setStart(t,Math.max(e,0)),i}function T(t,e){const s=t.getClientRects();return s.length?s[e<0?0:s.length-1]:t.getBoundingClientRect()}function _(t,e,s=!1){const{node:i,offset:n}=t.docView.domFromPos(e);let o,r;if(3===i.nodeType)s&&n<i.nodeValue.length?(r=T($(i,n-1,n),-1),o="right"):n<i.nodeValue.length&&(r=T($(i,n,n+1),-1),o="left");else if(i.firstChild){if(n<i.childNodes.length){const t=i.childNodes[n];r=T(3===t.nodeType?$(t):t,-1),o="left"}if((!r||r.top===r.bottom)&&n){const t=i.childNodes[n-1];r=T(3===t.nodeType?$(t):t,1),o="right"}}else r=i.getBoundingClientRect(),o="left";const a=r[o];return{top:r.top,bottom:r.bottom,left:a,right:a}}class I{constructor({options:t,editorView:e}){this.options={element:null,keepInBounds:!0,onUpdate:()=>!1,...t},this.editorView=e,this.isActive=!1,this.left=0,this.bottom=0,this.top=0,this.preventHide=!1,this.mousedownHandler=this.handleClick.bind(this),this.options.element.addEventListener("mousedown",this.mousedownHandler,{capture:!0}),this.focusHandler=({view:t})=>{this.update(t)},this.options.editor.on("focus",this.focusHandler),this.blurHandler=({event:t})=>{this.preventHide?this.preventHide=!1:this.hide(t)},this.options.editor.on("blur",this.blurHandler)}handleClick(){this.preventHide=!0}update(t,e){const{state:s}=t;if(t.composing)return;if(e&&e.doc.eq(s.doc)&&e.selection.eq(s.selection))return;if(s.selection.empty)return void this.hide();const{from:i,to:n}=s.selection,o=_(t,i),r=_(t,n,!0),a=this.options.element.offsetParent;if(!a)return void this.hide();const h=a.getBoundingClientRect(),c=this.options.element.getBoundingClientRect(),d=(o.left+r.left)/2-h.left;this.left=Math.round(this.options.keepInBounds?Math.min(h.width-c.width/2,Math.max(d,c.width/2)):d),this.bottom=Math.round(h.bottom-o.top),this.top=Math.round(r.bottom-h.top),this.isActive=!0,this.sendUpdate()}sendUpdate(){this.options.onUpdate({isActive:this.isActive,left:this.left,bottom:this.bottom,top:this.top})}hide(t){t&&t.relatedTarget&&this.options.element.parentNode&&this.options.element.parentNode.contains(t.relatedTarget)||(this.isActive=!1,this.sendUpdate())}destroy(){this.options.element.removeEventListener("mousedown",this.mousedownHandler),this.options.editor.off("focus",this.focusHandler),this.options.editor.off("blur",this.blurHandler)}}var B={props:{editor:{default:null,type:Object},keepInBounds:{default:!0,type:Boolean}},data:()=>({menu:{isActive:!1,left:0,bottom:0}}),watch:{editor:{immediate:!0,handler(t){t&&this.$nextTick((()=>{var i;t.registerPlugin((i={editor:t,element:this.$el,keepInBounds:this.keepInBounds,onUpdate:t=>{t.isActive&&!1===this.menu.isActive?this.$emit("show",t):t.isActive||!0!==this.menu.isActive||this.$emit("hide",t),this.menu=t}},new e({key:new s("menu_bubble"),view:t=>new I({editorView:t,options:i})})))}))}}},render(){return this.editor?this.$scopedSlots.default({focused:this.editor.view.focused,focus:this.editor.focus,commands:this.editor.commands,isActive:this.editor.isActive,getMarkAttrs:this.editor.getMarkAttrs.bind(this.editor),getNodeAttrs:this.editor.getNodeAttrs.bind(this.editor),menu:this.menu}):null},beforeDestroy(){this.editor.unregisterPlugin("menu_bubble")}};export{N as D,M as E,A as M,E as N,O as P,C as T,R as a,j as b,B as c,H as d};
