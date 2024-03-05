import{P as t}from"./prosemirror-state-425d0e8b.js";import{d as e}from"./prosemirror-transform-0ba15ba3.js";function i(e={}){return new t({view:t=>new s(t,e)})}class s{constructor(t,e){var i;this.editorView=t,this.cursorPos=null,this.element=null,this.timeout=-1,this.width=null!==(i=e.width)&&void 0!==i?i:1,this.color=!1===e.color?void 0:e.color||"black",this.class=e.class,this.handlers=["dragover","dragend","drop","dragleave"].map((e=>{let i=t=>{this[e](t)};return t.dom.addEventListener(e,i),{name:e,handler:i}}))}destroy(){this.handlers.forEach((({name:t,handler:e})=>this.editorView.dom.removeEventListener(t,e)))}update(t,e){null!=this.cursorPos&&e.doc!=t.state.doc&&(this.cursorPos>t.state.doc.content.size?this.setCursor(null):this.updateOverlay())}setCursor(t){t!=this.cursorPos&&(this.cursorPos=t,null==t?(this.element.parentNode.removeChild(this.element),this.element=null):this.updateOverlay())}updateOverlay(){let t,e=this.editorView.state.doc.resolve(this.cursorPos),i=!e.parent.inlineContent;if(i){let i=e.nodeBefore,s=e.nodeAfter;if(i||s){let e=this.editorView.nodeDOM(this.cursorPos-(i?i.nodeSize:0));if(e){let o=e.getBoundingClientRect(),r=i?o.bottom:o.top;i&&s&&(r=(r+this.editorView.nodeDOM(this.cursorPos).getBoundingClientRect().top)/2),t={left:o.left,right:o.right,top:r-this.width/2,bottom:r+this.width/2}}}}if(!t){let e=this.editorView.coordsAtPos(this.cursorPos);t={left:e.left-this.width/2,right:e.left+this.width/2,top:e.top,bottom:e.bottom}}let s,o,r=this.editorView.dom.offsetParent;if(this.element||(this.element=r.appendChild(document.createElement("div")),this.class&&(this.element.className=this.class),this.element.style.cssText="position: absolute; z-index: 50; pointer-events: none;",this.color&&(this.element.style.backgroundColor=this.color)),this.element.classList.toggle("prosemirror-dropcursor-block",i),this.element.classList.toggle("prosemirror-dropcursor-inline",!i),!r||r==document.body&&"static"==getComputedStyle(r).position)s=-pageXOffset,o=-pageYOffset;else{let t=r.getBoundingClientRect();s=t.left-r.scrollLeft,o=t.top-r.scrollTop}this.element.style.left=t.left-s+"px",this.element.style.top=t.top-o+"px",this.element.style.width=t.right-t.left+"px",this.element.style.height=t.bottom-t.top+"px"}scheduleRemoval(t){clearTimeout(this.timeout),this.timeout=setTimeout((()=>this.setCursor(null)),t)}dragover(t){if(!this.editorView.editable)return;let i=this.editorView.posAtCoords({left:t.clientX,top:t.clientY}),s=i&&i.inside>=0&&this.editorView.state.doc.nodeAt(i.inside),o=s&&s.type.spec.disableDropCursor,r="function"==typeof o?o(this.editorView,i,t):o;if(i&&!r){let t=i.pos;if(this.editorView.dragging&&this.editorView.dragging.slice){let i=e(this.editorView.state.doc,t,this.editorView.dragging.slice);null!=i&&(t=i)}this.setCursor(t),this.scheduleRemoval(5e3)}}dragend(){this.scheduleRemoval(20)}drop(){this.scheduleRemoval(20)}dragleave(t){t.target!=this.editorView.dom&&this.editorView.dom.contains(t.relatedTarget)||this.setCursor(null)}}export{i as d};
