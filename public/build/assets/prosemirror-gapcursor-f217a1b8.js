import{k as e}from"./prosemirror-keymap-f0b73aa1.js";import{S as t,P as r,N as n,T as o}from"./prosemirror-state-425d0e8b.js";import{F as i,S as s}from"./prosemirror-model-e99bf1dc.js";import{D as l,a}from"./prosemirror-view-0d94a9de.js";class c extends t{constructor(e){super(e,e)}map(e,r){let n=e.resolve(r.map(this.head));return c.valid(n)?new c(n):t.near(n)}content(){return s.empty}eq(e){return e instanceof c&&e.head==this.head}toJSON(){return{type:"gapcursor",pos:this.head}}static fromJSON(e,t){if("number"!=typeof t.pos)throw new RangeError("Invalid input for GapCursor.fromJSON");return new c(e.resolve(t.pos))}getBookmark(){return new p(this.anchor)}static valid(e){let t=e.parent;if(t.isTextblock||!function(e){for(let t=e.depth;t>=0;t--){let r=e.index(t),n=e.node(t);if(0!=r)for(let e=n.child(r-1);;e=e.lastChild){if(0==e.childCount&&!e.inlineContent||e.isAtom||e.type.spec.isolating)return!0;if(e.inlineContent)return!1}else if(n.type.spec.isolating)return!0}return!0}(e)||!function(e){for(let t=e.depth;t>=0;t--){let r=e.indexAfter(t),n=e.node(t);if(r!=n.childCount)for(let e=n.child(r);;e=e.firstChild){if(0==e.childCount&&!e.inlineContent||e.isAtom||e.type.spec.isolating)return!0;if(e.inlineContent)return!1}else if(n.type.spec.isolating)return!0}return!0}(e))return!1;let r=t.type.spec.allowGapCursor;if(null!=r)return r;let n=t.contentMatchAt(e.index()).defaultType;return n&&n.isTextblock}static findGapCursorFrom(e,t,r=!1){e:for(;;){if(!r&&c.valid(e))return e;let o=e.pos,i=null;for(let r=e.depth;;r--){let n=e.node(r);if(t>0?e.indexAfter(r)<n.childCount:e.index(r)>0){i=n.child(t>0?e.indexAfter(r):e.index(r)-1);break}if(0==r)return null;o+=t;let s=e.doc.resolve(o);if(c.valid(s))return s}for(;;){let s=t>0?i.firstChild:i.lastChild;if(!s){if(i.isAtom&&!i.isText&&!n.isSelectable(i)){e=e.doc.resolve(o+i.nodeSize*t),r=!1;continue e}break}i=s,o+=t;let l=e.doc.resolve(o);if(c.valid(l))return l}return null}}}c.prototype.visible=!1,c.findFrom=c.findGapCursorFrom,t.jsonID("gapcursor",c);class p{constructor(e){this.pos=e}map(e){return new p(e.map(this.pos))}resolve(e){let r=e.resolve(this.pos);return c.valid(r)?new c(r):t.near(r)}}function d(){return new r({props:{decorations:v,createSelectionBetween:(e,t,r)=>t.pos==r.pos&&c.valid(r)?new c(r):null,handleClick:h,handleKeyDown:u,handleDOMEvents:{beforeinput:m}}})}const u=e({ArrowLeft:f("horiz",-1),ArrowRight:f("horiz",1),ArrowUp:f("vert",-1),ArrowDown:f("vert",1)});function f(e,t){const r="vert"==e?t>0?"down":"up":t>0?"right":"left";return function(e,n,i){let s=e.selection,l=t>0?s.$to:s.$from,a=s.empty;if(s instanceof o){if(!i.endOfTextblock(r)||0==l.depth)return!1;a=!1,l=e.doc.resolve(t>0?l.after():l.before())}let p=c.findGapCursorFrom(l,t,a);return!!p&&(n&&n(e.tr.setSelection(new c(p))),!0)}}function h(e,t,r){if(!e||!e.editable)return!1;let o=e.state.doc.resolve(t);if(!c.valid(o))return!1;let i=e.posAtCoords({left:r.clientX,top:r.clientY});return!(i&&i.inside>-1&&n.isSelectable(e.state.doc.nodeAt(i.inside)))&&(e.dispatch(e.state.tr.setSelection(new c(o))),!0)}function m(e,t){if("insertCompositionText"!=t.inputType||!(e.state.selection instanceof c))return!1;let{$from:r}=e.state.selection,n=r.parent.contentMatchAt(r.index()).findWrapping(e.state.schema.nodes.text);if(!n)return!1;let l=i.empty;for(let o=n.length-1;o>=0;o--)l=i.from(n[o].createAndFill(null,l));let a=e.state.tr.replace(r.pos,r.pos,new s(l,0,0));return a.setSelection(o.near(a.doc.resolve(r.pos+1))),e.dispatch(a),!1}function v(e){if(!(e.selection instanceof c))return null;let t=document.createElement("div");return t.className="ProseMirror-gapcursor",l.create(e.doc,[a.widget(e.selection.head,t,{key:"gapcursor"})])}export{d as g};
