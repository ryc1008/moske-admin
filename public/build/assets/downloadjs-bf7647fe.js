import{c as e,a as t}from"./async-validator-68c927eb.js";var n={exports:{}};const o=t(n.exports=function e(t,n,o){var a,r,i=window,d="application/octet-stream",s=o||d,l=t,c=!n&&!o&&l,u=document.createElement("a"),f=function(e){return String(e)},p=i.Blob||i.MozBlob||i.WebKitBlob||f,m=n||"download";if(p=p.call?p.bind(i):Blob,"true"===String(this)&&(s=(l=[l,s])[0],l=l[1]),c&&c.length<2048&&(m=c.split("/").pop().split("?")[0],u.href=c,-1!==u.href.indexOf(c))){var b=new XMLHttpRequest;return b.open("GET",c,!0),b.responseType="blob",b.onload=function(t){e(t.target.response,m,d)},setTimeout((function(){b.send()}),0),b}if(/^data:([\w+-]+\/[\w+.-]+)?[,;]/.test(l)){if(!(l.length>2096103.424&&p!==f))return navigator.msSaveBlob?navigator.msSaveBlob(g(l),m):y(l);s=(l=g(l)).type||d}else if(/([\x80-\xff])/.test(l)){for(var w=0,h=new Uint8Array(l.length),v=h.length;w<v;++w)h[w]=l.charCodeAt(w);l=new p([h],{type:s})}function g(e){for(var t=e.split(/[:;,]/),n=t[1],o=("base64"==t[2]?atob:decodeURIComponent)(t.pop()),a=o.length,r=0,i=new Uint8Array(a);r<a;++r)i[r]=o.charCodeAt(r);return new p([i],{type:n})}function y(e,t){if("download"in u)return u.href=e,u.setAttribute("download",m),u.className="download-js-link",u.innerHTML="downloading...",u.style.display="none",document.body.appendChild(u),setTimeout((function(){u.click(),document.body.removeChild(u),!0===t&&setTimeout((function(){i.URL.revokeObjectURL(u.href)}),250)}),66),!0;if(/(Version)\/(\d+)\.(\d+)(?:\.(\d+))?.*Safari\//.test(navigator.userAgent))return/^data:/.test(e)&&(e="data:"+e.replace(/^data:([\w\/\-\+]+)/,d)),window.open(e)||confirm("Displaying New Document\n\nUse Save As... to download, then click back to return to this page.")&&(location.href=e),!0;var n=document.createElement("iframe");document.body.appendChild(n),!t&&/^data:/.test(e)&&(e="data:"+e.replace(/^data:([\w\/\-\+]+)/,d)),n.src=e,setTimeout((function(){document.body.removeChild(n)}),333)}if(a=l instanceof p?l:new p([l],{type:s}),navigator.msSaveBlob)return navigator.msSaveBlob(a,m);if(i.URL)y(i.URL.createObjectURL(a),!0);else{if("string"==typeof a||a.constructor===f)try{return y("data:"+s+";base64,"+i.btoa(a))}catch(U){return y("data:"+s+","+encodeURIComponent(a))}(r=new FileReader).onload=function(e){y(this.result)},r.readAsDataURL(a)}return!0});export{o as d};