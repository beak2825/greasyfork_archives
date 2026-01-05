// ==UserScript==
// @name        SGv2 Dark 1.4.8
// @author      SquishedPotatoe
// @namespace   steamgifts
// @include     *://www.steamgifts.com/*
// @include     *://www.steamtrades.com/*
// @include     *://www.sgtools.info/*
// @run-at      document-start
// @noframes
// @version     1.4.8
// @description Dark theme with a settings menu to customize steamgifts.com and steamtrades.com and sgtools.info.
// @icon 		data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD//gA7Q1JFQVRPUjogZ2QtanBlZyB2MS4wICh1c2luZyBJSkcgSlBFRyB2NjIpLCBxdWFsaXR5ID0gOTAK/9sAQwADAgIDAgIDAwMDBAMDBAUIBQUEBAUKBwcGCAwKDAwLCgsLDQ4SEA0OEQ4LCxAWEBETFBUVFQwPFxgWFBgSFBUU/9sAQwEDBAQFBAUJBQUJFA0LDRQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQU/8AAEQgAIAAgAwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/EAB8BAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKC//EALURAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/aAAwDAQACEQMRAD8A+SdZ8dalqkQgswY2VfmW3JI+p44/E1wt14p1W3kmSa4Tf/Essiiux8KfCDxR428K3+uSu+n6Fp8ElzlVBbYgLEkgDPA715LoXgNPEE11d63rCaBp8dpJdLcSwSTbmUZWIBBwzdASQPfoKyqVYUlebOqhhq2JbVKN7b9l6vZG1D451O0iljWKK5hcnKGTcPqDjitLw544tggt71XgZvnjlXh4m7c9wa4vw94FmudS0pJrk2lpfTpbrdBh+7ZyApK9xkjPtmtzxv4N1bwNrf8AZXiKARspxDdp9xvT6U4TjUV4u5FahVw8lGrGzevyPs34T+OIfBngC/8AC/i60kfw/qFrJZpqtou+Py5FKFZCB8jAHv8AyrwS8bSoNAm8H63d2ltKEa2TVmB8i4iHCSxsOMkYyp6c55wB9FeGPEFlo+nKkUiwgLtIz1XHT6Vy3iWbwrfSi5utF0uZwCCUh8ks2ep8vbk9OTn/AA4sbgoY2MVJtOLumujPaybOquTVJyhBTjNcsovZr5bPzPEbeHRNW8U6THDdpH4c0q4juLi/PCOqEERRjq7EgDjpk/jpftDePk+IMMaR2H2KwTAiluF/euPUL1H48+1dVqT+GrOHzLCwhglAywRMs57Auece1ed+Kbn+0ruKRbdbq7k+WOJV4XnitsLho4WkqUXfzfU5c1zKpm2KeJqRUb6JLZJdD//Z
// @downloadURL https://update.greasyfork.org/scripts/7834/SGv2%20Dark%20148.user.js
// @updateURL https://update.greasyfork.org/scripts/7834/SGv2%20Dark%20148.meta.js
// ==/UserScript==

/*! jQuery v3.1.1 | (c) jQuery Foundation | jquery.org/license */
!function(a,b){"use strict";"object"==typeof module&&"object"==typeof module.exports?module.exports=a.document?b(a,!0):function(a){if(!a.document)throw new Error("jQuery requires a window with a document");return b(a)}:b(a)}("undefined"!=typeof window?window:this,function(a,b){"use strict";var c=[],d=a.document,e=Object.getPrototypeOf,f=c.slice,g=c.concat,h=c.push,i=c.indexOf,j={},k=j.toString,l=j.hasOwnProperty,m=l.toString,n=m.call(Object),o={};function p(a,b){b=b||d;var c=b.createElement("script");c.text=a,b.head.appendChild(c).parentNode.removeChild(c)}var q="3.1.1",r=function(a,b){return new r.fn.init(a,b)},s=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,t=/^-ms-/,u=/-([a-z])/g,v=function(a,b){return b.toUpperCase()};r.fn=r.prototype={jquery:q,constructor:r,length:0,toArray:function(){return f.call(this)},get:function(a){return null==a?f.call(this):a<0?this[a+this.length]:this[a]},pushStack:function(a){var b=r.merge(this.constructor(),a);return b.prevObject=this,b},each:function(a){return r.each(this,a)},map:function(a){return this.pushStack(r.map(this,function(b,c){return a.call(b,c,b)}))},slice:function(){return this.pushStack(f.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},eq:function(a){var b=this.length,c=+a+(a<0?b:0);return this.pushStack(c>=0&&c<b?[this[c]]:[])},end:function(){return this.prevObject||this.constructor()},push:h,sort:c.sort,splice:c.splice},r.extend=r.fn.extend=function(){var a,b,c,d,e,f,g=arguments[0]||{},h=1,i=arguments.length,j=!1;for("boolean"==typeof g&&(j=g,g=arguments[h]||{},h++),"object"==typeof g||r.isFunction(g)||(g={}),h===i&&(g=this,h--);h<i;h++)if(null!=(a=arguments[h]))for(b in a)c=g[b],d=a[b],g!==d&&(j&&d&&(r.isPlainObject(d)||(e=r.isArray(d)))?(e?(e=!1,f=c&&r.isArray(c)?c:[]):f=c&&r.isPlainObject(c)?c:{},g[b]=r.extend(j,f,d)):void 0!==d&&(g[b]=d));return g},r.extend({expando:"jQuery"+(q+Math.random()).replace(/\D/g,""),isReady:!0,error:function(a){throw new Error(a)},noop:function(){},isFunction:function(a){return"function"===r.type(a)},isArray:Array.isArray,isWindow:function(a){return null!=a&&a===a.window},isNumeric:function(a){var b=r.type(a);return("number"===b||"string"===b)&&!isNaN(a-parseFloat(a))},isPlainObject:function(a){var b,c;return!(!a||"[object Object]"!==k.call(a))&&(!(b=e(a))||(c=l.call(b,"constructor")&&b.constructor,"function"==typeof c&&m.call(c)===n))},isEmptyObject:function(a){var b;for(b in a)return!1;return!0},type:function(a){return null==a?a+"":"object"==typeof a||"function"==typeof a?j[k.call(a)]||"object":typeof a},globalEval:function(a){p(a)},camelCase:function(a){return a.replace(t,"ms-").replace(u,v)},nodeName:function(a,b){return a.nodeName&&a.nodeName.toLowerCase()===b.toLowerCase()},each:function(a,b){var c,d=0;if(w(a)){for(c=a.length;d<c;d++)if(b.call(a[d],d,a[d])===!1)break}else for(d in a)if(b.call(a[d],d,a[d])===!1)break;return a},trim:function(a){return null==a?"":(a+"").replace(s,"")},makeArray:function(a,b){var c=b||[];return null!=a&&(w(Object(a))?r.merge(c,"string"==typeof a?[a]:a):h.call(c,a)),c},inArray:function(a,b,c){return null==b?-1:i.call(b,a,c)},merge:function(a,b){for(var c=+b.length,d=0,e=a.length;d<c;d++)a[e++]=b[d];return a.length=e,a},grep:function(a,b,c){for(var d,e=[],f=0,g=a.length,h=!c;f<g;f++)d=!b(a[f],f),d!==h&&e.push(a[f]);return e},map:function(a,b,c){var d,e,f=0,h=[];if(w(a))for(d=a.length;f<d;f++)e=b(a[f],f,c),null!=e&&h.push(e);else for(f in a)e=b(a[f],f,c),null!=e&&h.push(e);return g.apply([],h)},guid:1,proxy:function(a,b){var c,d,e;if("string"==typeof b&&(c=a[b],b=a,a=c),r.isFunction(a))return d=f.call(arguments,2),e=function(){return a.apply(b||this,d.concat(f.call(arguments)))},e.guid=a.guid=a.guid||r.guid++,e},now:Date.now,support:o}),"function"==typeof Symbol&&(r.fn[Symbol.iterator]=c[Symbol.iterator]),r.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "),function(a,b){j["[object "+b+"]"]=b.toLowerCase()});function w(a){var b=!!a&&"length"in a&&a.length,c=r.type(a);return"function"!==c&&!r.isWindow(a)&&("array"===c||0===b||"number"==typeof b&&b>0&&b-1 in a)}var x=function(a){var b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u="sizzle"+1*new Date,v=a.document,w=0,x=0,y=ha(),z=ha(),A=ha(),B=function(a,b){return a===b&&(l=!0),0},C={}.hasOwnProperty,D=[],E=D.pop,F=D.push,G=D.push,H=D.slice,I=function(a,b){for(var c=0,d=a.length;c<d;c++)if(a[c]===b)return c;return-1},J="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",K="[\\x20\\t\\r\\n\\f]",L="(?:\\\\.|[\\w-]|[^\0-\\xa0])+",M="\\["+K+"*("+L+")(?:"+K+"*([*^$|!~]?=)"+K+"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|("+L+"))|)"+K+"*\\]",N=":("+L+")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|"+M+")*)|.*)\\)|)",O=new RegExp(K+"+","g"),P=new RegExp("^"+K+"+|((?:^|[^\\\\])(?:\\\\.)*)"+K+"+$","g"),Q=new RegExp("^"+K+"*,"+K+"*"),R=new RegExp("^"+K+"*([>+~]|"+K+")"+K+"*"),S=new RegExp("="+K+"*([^\\]'\"]*?)"+K+"*\\]","g"),T=new RegExp(N),U=new RegExp("^"+L+"$"),V={ID:new RegExp("^#("+L+")"),CLASS:new RegExp("^\\.("+L+")"),TAG:new RegExp("^("+L+"|[*])"),ATTR:new RegExp("^"+M),PSEUDO:new RegExp("^"+N),CHILD:new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+K+"*(even|odd|(([+-]|)(\\d*)n|)"+K+"*(?:([+-]|)"+K+"*(\\d+)|))"+K+"*\\)|)","i"),bool:new RegExp("^(?:"+J+")$","i"),needsContext:new RegExp("^"+K+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+K+"*((?:-\\d)?\\d*)"+K+"*\\)|)(?=[^-]|$)","i")},W=/^(?:input|select|textarea|button)$/i,X=/^h\d$/i,Y=/^[^{]+\{\s*\[native \w/,Z=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,$=/[+~]/,_=new RegExp("\\\\([\\da-f]{1,6}"+K+"?|("+K+")|.)","ig"),aa=function(a,b,c){var d="0x"+b-65536;return d!==d||c?b:d<0?String.fromCharCode(d+65536):String.fromCharCode(d>>10|55296,1023&d|56320)},ba=/([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,ca=function(a,b){return b?"\0"===a?"\ufffd":a.slice(0,-1)+"\\"+a.charCodeAt(a.length-1).toString(16)+" ":"\\"+a},da=function(){m()},ea=ta(function(a){return a.disabled===!0&&("form"in a||"label"in a)},{dir:"parentNode",next:"legend"});try{G.apply(D=H.call(v.childNodes),v.childNodes),D[v.childNodes.length].nodeType}catch(fa){G={apply:D.length?function(a,b){F.apply(a,H.call(b))}:function(a,b){var c=a.length,d=0;while(a[c++]=b[d++]);a.length=c-1}}}function ga(a,b,d,e){var f,h,j,k,l,o,r,s=b&&b.ownerDocument,w=b?b.nodeType:9;if(d=d||[],"string"!=typeof a||!a||1!==w&&9!==w&&11!==w)return d;if(!e&&((b?b.ownerDocument||b:v)!==n&&m(b),b=b||n,p)){if(11!==w&&(l=Z.exec(a)))if(f=l[1]){if(9===w){if(!(j=b.getElementById(f)))return d;if(j.id===f)return d.push(j),d}else if(s&&(j=s.getElementById(f))&&t(b,j)&&j.id===f)return d.push(j),d}else{if(l[2])return G.apply(d,b.getElementsByTagName(a)),d;if((f=l[3])&&c.getElementsByClassName&&b.getElementsByClassName)return G.apply(d,b.getElementsByClassName(f)),d}if(c.qsa&&!A[a+" "]&&(!q||!q.test(a))){if(1!==w)s=b,r=a;else if("object"!==b.nodeName.toLowerCase()){(k=b.getAttribute("id"))?k=k.replace(ba,ca):b.setAttribute("id",k=u),o=g(a),h=o.length;while(h--)o[h]="#"+k+" "+sa(o[h]);r=o.join(","),s=$.test(a)&&qa(b.parentNode)||b}if(r)try{return G.apply(d,s.querySelectorAll(r)),d}catch(x){}finally{k===u&&b.removeAttribute("id")}}}return i(a.replace(P,"$1"),b,d,e)}function ha(){var a=[];function b(c,e){return a.push(c+" ")>d.cacheLength&&delete b[a.shift()],b[c+" "]=e}return b}function ia(a){return a[u]=!0,a}function ja(a){var b=n.createElement("fieldset");try{return!!a(b)}catch(c){return!1}finally{b.parentNode&&b.parentNode.removeChild(b),b=null}}function ka(a,b){var c=a.split("|"),e=c.length;while(e--)d.attrHandle[c[e]]=b}function la(a,b){var c=b&&a,d=c&&1===a.nodeType&&1===b.nodeType&&a.sourceIndex-b.sourceIndex;if(d)return d;if(c)while(c=c.nextSibling)if(c===b)return-1;return a?1:-1}function ma(a){return function(b){var c=b.nodeName.toLowerCase();return"input"===c&&b.type===a}}function na(a){return function(b){var c=b.nodeName.toLowerCase();return("input"===c||"button"===c)&&b.type===a}}function oa(a){return function(b){return"form"in b?b.parentNode&&b.disabled===!1?"label"in b?"label"in b.parentNode?b.parentNode.disabled===a:b.disabled===a:b.isDisabled===a||b.isDisabled!==!a&&ea(b)===a:b.disabled===a:"label"in b&&b.disabled===a}}function pa(a){return ia(function(b){return b=+b,ia(function(c,d){var e,f=a([],c.length,b),g=f.length;while(g--)c[e=f[g]]&&(c[e]=!(d[e]=c[e]))})})}function qa(a){return a&&"undefined"!=typeof a.getElementsByTagName&&a}c=ga.support={},f=ga.isXML=function(a){var b=a&&(a.ownerDocument||a).documentElement;return!!b&&"HTML"!==b.nodeName},m=ga.setDocument=function(a){var b,e,g=a?a.ownerDocument||a:v;return g!==n&&9===g.nodeType&&g.documentElement?(n=g,o=n.documentElement,p=!f(n),v!==n&&(e=n.defaultView)&&e.top!==e&&(e.addEventListener?e.addEventListener("unload",da,!1):e.attachEvent&&e.attachEvent("onunload",da)),c.attributes=ja(function(a){return a.className="i",!a.getAttribute("className")}),c.getElementsByTagName=ja(function(a){return a.appendChild(n.createComment("")),!a.getElementsByTagName("*").length}),c.getElementsByClassName=Y.test(n.getElementsByClassName),c.getById=ja(function(a){return o.appendChild(a).id=u,!n.getElementsByName||!n.getElementsByName(u).length}),c.getById?(d.filter.ID=function(a){var b=a.replace(_,aa);return function(a){return a.getAttribute("id")===b}},d.find.ID=function(a,b){if("undefined"!=typeof b.getElementById&&p){var c=b.getElementById(a);return c?[c]:[]}}):(d.filter.ID=function(a){var b=a.replace(_,aa);return function(a){var c="undefined"!=typeof a.getAttributeNode&&a.getAttributeNode("id");return c&&c.value===b}},d.find.ID=function(a,b){if("undefined"!=typeof b.getElementById&&p){var c,d,e,f=b.getElementById(a);if(f){if(c=f.getAttributeNode("id"),c&&c.value===a)return[f];e=b.getElementsByName(a),d=0;while(f=e[d++])if(c=f.getAttributeNode("id"),c&&c.value===a)return[f]}return[]}}),d.find.TAG=c.getElementsByTagName?function(a,b){return"undefined"!=typeof b.getElementsByTagName?b.getElementsByTagName(a):c.qsa?b.querySelectorAll(a):void 0}:function(a,b){var c,d=[],e=0,f=b.getElementsByTagName(a);if("*"===a){while(c=f[e++])1===c.nodeType&&d.push(c);return d}return f},d.find.CLASS=c.getElementsByClassName&&function(a,b){if("undefined"!=typeof b.getElementsByClassName&&p)return b.getElementsByClassName(a)},r=[],q=[],(c.qsa=Y.test(n.querySelectorAll))&&(ja(function(a){o.appendChild(a).innerHTML="<a id='"+u+"'></a><select id='"+u+"-\r\\' msallowcapture=''><option selected=''></option></select>",a.querySelectorAll("[msallowcapture^='']").length&&q.push("[*^$]="+K+"*(?:''|\"\")"),a.querySelectorAll("[selected]").length||q.push("\\["+K+"*(?:value|"+J+")"),a.querySelectorAll("[id~="+u+"-]").length||q.push("~="),a.querySelectorAll(":checked").length||q.push(":checked"),a.querySelectorAll("a#"+u+"+*").length||q.push(".#.+[+~]")}),ja(function(a){a.innerHTML="<a href='' disabled='disabled'></a><select disabled='disabled'><option/></select>";var b=n.createElement("input");b.setAttribute("type","hidden"),a.appendChild(b).setAttribute("name","D"),a.querySelectorAll("[name=d]").length&&q.push("name"+K+"*[*^$|!~]?="),2!==a.querySelectorAll(":enabled").length&&q.push(":enabled",":disabled"),o.appendChild(a).disabled=!0,2!==a.querySelectorAll(":disabled").length&&q.push(":enabled",":disabled"),a.querySelectorAll("*,:x"),q.push(",.*:")})),(c.matchesSelector=Y.test(s=o.matches||o.webkitMatchesSelector||o.mozMatchesSelector||o.oMatchesSelector||o.msMatchesSelector))&&ja(function(a){c.disconnectedMatch=s.call(a,"*"),s.call(a,"[s!='']:x"),r.push("!=",N)}),q=q.length&&new RegExp(q.join("|")),r=r.length&&new RegExp(r.join("|")),b=Y.test(o.compareDocumentPosition),t=b||Y.test(o.contains)?function(a,b){var c=9===a.nodeType?a.documentElement:a,d=b&&b.parentNode;return a===d||!(!d||1!==d.nodeType||!(c.contains?c.contains(d):a.compareDocumentPosition&&16&a.compareDocumentPosition(d)))}:function(a,b){if(b)while(b=b.parentNode)if(b===a)return!0;return!1},B=b?function(a,b){if(a===b)return l=!0,0;var d=!a.compareDocumentPosition-!b.compareDocumentPosition;return d?d:(d=(a.ownerDocument||a)===(b.ownerDocument||b)?a.compareDocumentPosition(b):1,1&d||!c.sortDetached&&b.compareDocumentPosition(a)===d?a===n||a.ownerDocument===v&&t(v,a)?-1:b===n||b.ownerDocument===v&&t(v,b)?1:k?I(k,a)-I(k,b):0:4&d?-1:1)}:function(a,b){if(a===b)return l=!0,0;var c,d=0,e=a.parentNode,f=b.parentNode,g=[a],h=[b];if(!e||!f)return a===n?-1:b===n?1:e?-1:f?1:k?I(k,a)-I(k,b):0;if(e===f)return la(a,b);c=a;while(c=c.parentNode)g.unshift(c);c=b;while(c=c.parentNode)h.unshift(c);while(g[d]===h[d])d++;return d?la(g[d],h[d]):g[d]===v?-1:h[d]===v?1:0},n):n},ga.matches=function(a,b){return ga(a,null,null,b)},ga.matchesSelector=function(a,b){if((a.ownerDocument||a)!==n&&m(a),b=b.replace(S,"='$1']"),c.matchesSelector&&p&&!A[b+" "]&&(!r||!r.test(b))&&(!q||!q.test(b)))try{var d=s.call(a,b);if(d||c.disconnectedMatch||a.document&&11!==a.document.nodeType)return d}catch(e){}return ga(b,n,null,[a]).length>0},ga.contains=function(a,b){return(a.ownerDocument||a)!==n&&m(a),t(a,b)},ga.attr=function(a,b){(a.ownerDocument||a)!==n&&m(a);var e=d.attrHandle[b.toLowerCase()],f=e&&C.call(d.attrHandle,b.toLowerCase())?e(a,b,!p):void 0;return void 0!==f?f:c.attributes||!p?a.getAttribute(b):(f=a.getAttributeNode(b))&&f.specified?f.value:null},ga.escape=function(a){return(a+"").replace(ba,ca)},ga.error=function(a){throw new Error("Syntax error, unrecognized expression: "+a)},ga.uniqueSort=function(a){var b,d=[],e=0,f=0;if(l=!c.detectDuplicates,k=!c.sortStable&&a.slice(0),a.sort(B),l){while(b=a[f++])b===a[f]&&(e=d.push(f));while(e--)a.splice(d[e],1)}return k=null,a},e=ga.getText=function(a){var b,c="",d=0,f=a.nodeType;if(f){if(1===f||9===f||11===f){if("string"==typeof a.textContent)return a.textContent;for(a=a.firstChild;a;a=a.nextSibling)c+=e(a)}else if(3===f||4===f)return a.nodeValue}else while(b=a[d++])c+=e(b);return c},d=ga.selectors={cacheLength:50,createPseudo:ia,match:V,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(a){return a[1]=a[1].replace(_,aa),a[3]=(a[3]||a[4]||a[5]||"").replace(_,aa),"~="===a[2]&&(a[3]=" "+a[3]+" "),a.slice(0,4)},CHILD:function(a){return a[1]=a[1].toLowerCase(),"nth"===a[1].slice(0,3)?(a[3]||ga.error(a[0]),a[4]=+(a[4]?a[5]+(a[6]||1):2*("even"===a[3]||"odd"===a[3])),a[5]=+(a[7]+a[8]||"odd"===a[3])):a[3]&&ga.error(a[0]),a},PSEUDO:function(a){var b,c=!a[6]&&a[2];return V.CHILD.test(a[0])?null:(a[3]?a[2]=a[4]||a[5]||"":c&&T.test(c)&&(b=g(c,!0))&&(b=c.indexOf(")",c.length-b)-c.length)&&(a[0]=a[0].slice(0,b),a[2]=c.slice(0,b)),a.slice(0,3))}},filter:{TAG:function(a){var b=a.replace(_,aa).toLowerCase();return"*"===a?function(){return!0}:function(a){return a.nodeName&&a.nodeName.toLowerCase()===b}},CLASS:function(a){var b=y[a+" "];return b||(b=new RegExp("(^|"+K+")"+a+"("+K+"|$)"))&&y(a,function(a){return b.test("string"==typeof a.className&&a.className||"undefined"!=typeof a.getAttribute&&a.getAttribute("class")||"")})},ATTR:function(a,b,c){return function(d){var e=ga.attr(d,a);return null==e?"!="===b:!b||(e+="","="===b?e===c:"!="===b?e!==c:"^="===b?c&&0===e.indexOf(c):"*="===b?c&&e.indexOf(c)>-1:"$="===b?c&&e.slice(-c.length)===c:"~="===b?(" "+e.replace(O," ")+" ").indexOf(c)>-1:"|="===b&&(e===c||e.slice(0,c.length+1)===c+"-"))}},CHILD:function(a,b,c,d,e){var f="nth"!==a.slice(0,3),g="last"!==a.slice(-4),h="of-type"===b;return 1===d&&0===e?function(a){return!!a.parentNode}:function(b,c,i){var j,k,l,m,n,o,p=f!==g?"nextSibling":"previousSibling",q=b.parentNode,r=h&&b.nodeName.toLowerCase(),s=!i&&!h,t=!1;if(q){if(f){while(p){m=b;while(m=m[p])if(h?m.nodeName.toLowerCase()===r:1===m.nodeType)return!1;o=p="only"===a&&!o&&"nextSibling"}return!0}if(o=[g?q.firstChild:q.lastChild],g&&s){m=q,l=m[u]||(m[u]={}),k=l[m.uniqueID]||(l[m.uniqueID]={}),j=k[a]||[],n=j[0]===w&&j[1],t=n&&j[2],m=n&&q.childNodes[n];while(m=++n&&m&&m[p]||(t=n=0)||o.pop())if(1===m.nodeType&&++t&&m===b){k[a]=[w,n,t];break}}else if(s&&(m=b,l=m[u]||(m[u]={}),k=l[m.uniqueID]||(l[m.uniqueID]={}),j=k[a]||[],n=j[0]===w&&j[1],t=n),t===!1)while(m=++n&&m&&m[p]||(t=n=0)||o.pop())if((h?m.nodeName.toLowerCase()===r:1===m.nodeType)&&++t&&(s&&(l=m[u]||(m[u]={}),k=l[m.uniqueID]||(l[m.uniqueID]={}),k[a]=[w,t]),m===b))break;return t-=e,t===d||t%d===0&&t/d>=0}}},PSEUDO:function(a,b){var c,e=d.pseudos[a]||d.setFilters[a.toLowerCase()]||ga.error("unsupported pseudo: "+a);return e[u]?e(b):e.length>1?(c=[a,a,"",b],d.setFilters.hasOwnProperty(a.toLowerCase())?ia(function(a,c){var d,f=e(a,b),g=f.length;while(g--)d=I(a,f[g]),a[d]=!(c[d]=f[g])}):function(a){return e(a,0,c)}):e}},pseudos:{not:ia(function(a){var b=[],c=[],d=h(a.replace(P,"$1"));return d[u]?ia(function(a,b,c,e){var f,g=d(a,null,e,[]),h=a.length;while(h--)(f=g[h])&&(a[h]=!(b[h]=f))}):function(a,e,f){return b[0]=a,d(b,null,f,c),b[0]=null,!c.pop()}}),has:ia(function(a){return function(b){return ga(a,b).length>0}}),contains:ia(function(a){return a=a.replace(_,aa),function(b){return(b.textContent||b.innerText||e(b)).indexOf(a)>-1}}),lang:ia(function(a){return U.test(a||"")||ga.error("unsupported lang: "+a),a=a.replace(_,aa).toLowerCase(),function(b){var c;do if(c=p?b.lang:b.getAttribute("xml:lang")||b.getAttribute("lang"))return c=c.toLowerCase(),c===a||0===c.indexOf(a+"-");while((b=b.parentNode)&&1===b.nodeType);return!1}}),target:function(b){var c=a.location&&a.location.hash;return c&&c.slice(1)===b.id},root:function(a){return a===o},focus:function(a){return a===n.activeElement&&(!n.hasFocus||n.hasFocus())&&!!(a.type||a.href||~a.tabIndex)},enabled:oa(!1),disabled:oa(!0),checked:function(a){var b=a.nodeName.toLowerCase();return"input"===b&&!!a.checked||"option"===b&&!!a.selected},selected:function(a){return a.parentNode&&a.parentNode.selectedIndex,a.selected===!0},empty:function(a){for(a=a.firstChild;a;a=a.nextSibling)if(a.nodeType<6)return!1;return!0},parent:function(a){return!d.pseudos.empty(a)},header:function(a){return X.test(a.nodeName)},input:function(a){return W.test(a.nodeName)},button:function(a){var b=a.nodeName.toLowerCase();return"input"===b&&"button"===a.type||"button"===b},text:function(a){var b;return"input"===a.nodeName.toLowerCase()&&"text"===a.type&&(null==(b=a.getAttribute("type"))||"text"===b.toLowerCase())},first:pa(function(){return[0]}),last:pa(function(a,b){return[b-1]}),eq:pa(function(a,b,c){return[c<0?c+b:c]}),even:pa(function(a,b){for(var c=0;c<b;c+=2)a.push(c);return a}),odd:pa(function(a,b){for(var c=1;c<b;c+=2)a.push(c);return a}),lt:pa(function(a,b,c){for(var d=c<0?c+b:c;--d>=0;)a.push(d);return a}),gt:pa(function(a,b,c){for(var d=c<0?c+b:c;++d<b;)a.push(d);return a})}},d.pseudos.nth=d.pseudos.eq;for(b in{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})d.pseudos[b]=ma(b);for(b in{submit:!0,reset:!0})d.pseudos[b]=na(b);function ra(){}ra.prototype=d.filters=d.pseudos,d.setFilters=new ra,g=ga.tokenize=function(a,b){var c,e,f,g,h,i,j,k=z[a+" "];if(k)return b?0:k.slice(0);h=a,i=[],j=d.preFilter;while(h){c&&!(e=Q.exec(h))||(e&&(h=h.slice(e[0].length)||h),i.push(f=[])),c=!1,(e=R.exec(h))&&(c=e.shift(),f.push({value:c,type:e[0].replace(P," ")}),h=h.slice(c.length));for(g in d.filter)!(e=V[g].exec(h))||j[g]&&!(e=j[g](e))||(c=e.shift(),f.push({value:c,type:g,matches:e}),h=h.slice(c.length));if(!c)break}return b?h.length:h?ga.error(a):z(a,i).slice(0)};function sa(a){for(var b=0,c=a.length,d="";b<c;b++)d+=a[b].value;return d}function ta(a,b,c){var d=b.dir,e=b.next,f=e||d,g=c&&"parentNode"===f,h=x++;return b.first?function(b,c,e){while(b=b[d])if(1===b.nodeType||g)return a(b,c,e);return!1}:function(b,c,i){var j,k,l,m=[w,h];if(i){while(b=b[d])if((1===b.nodeType||g)&&a(b,c,i))return!0}else while(b=b[d])if(1===b.nodeType||g)if(l=b[u]||(b[u]={}),k=l[b.uniqueID]||(l[b.uniqueID]={}),e&&e===b.nodeName.toLowerCase())b=b[d]||b;else{if((j=k[f])&&j[0]===w&&j[1]===h)return m[2]=j[2];if(k[f]=m,m[2]=a(b,c,i))return!0}return!1}}function ua(a){return a.length>1?function(b,c,d){var e=a.length;while(e--)if(!a[e](b,c,d))return!1;return!0}:a[0]}function va(a,b,c){for(var d=0,e=b.length;d<e;d++)ga(a,b[d],c);return c}function wa(a,b,c,d,e){for(var f,g=[],h=0,i=a.length,j=null!=b;h<i;h++)(f=a[h])&&(c&&!c(f,d,e)||(g.push(f),j&&b.push(h)));return g}function xa(a,b,c,d,e,f){return d&&!d[u]&&(d=xa(d)),e&&!e[u]&&(e=xa(e,f)),ia(function(f,g,h,i){var j,k,l,m=[],n=[],o=g.length,p=f||va(b||"*",h.nodeType?[h]:h,[]),q=!a||!f&&b?p:wa(p,m,a,h,i),r=c?e||(f?a:o||d)?[]:g:q;if(c&&c(q,r,h,i),d){j=wa(r,n),d(j,[],h,i),k=j.length;while(k--)(l=j[k])&&(r[n[k]]=!(q[n[k]]=l))}if(f){if(e||a){if(e){j=[],k=r.length;while(k--)(l=r[k])&&j.push(q[k]=l);e(null,r=[],j,i)}k=r.length;while(k--)(l=r[k])&&(j=e?I(f,l):m[k])>-1&&(f[j]=!(g[j]=l))}}else r=wa(r===g?r.splice(o,r.length):r),e?e(null,g,r,i):G.apply(g,r)})}function ya(a){for(var b,c,e,f=a.length,g=d.relative[a[0].type],h=g||d.relative[" "],i=g?1:0,k=ta(function(a){return a===b},h,!0),l=ta(function(a){return I(b,a)>-1},h,!0),m=[function(a,c,d){var e=!g&&(d||c!==j)||((b=c).nodeType?k(a,c,d):l(a,c,d));return b=null,e}];i<f;i++)if(c=d.relative[a[i].type])m=[ta(ua(m),c)];else{if(c=d.filter[a[i].type].apply(null,a[i].matches),c[u]){for(e=++i;e<f;e++)if(d.relative[a[e].type])break;return xa(i>1&&ua(m),i>1&&sa(a.slice(0,i-1).concat({value:" "===a[i-2].type?"*":""})).replace(P,"$1"),c,i<e&&ya(a.slice(i,e)),e<f&&ya(a=a.slice(e)),e<f&&sa(a))}m.push(c)}return ua(m)}function za(a,b){var c=b.length>0,e=a.length>0,f=function(f,g,h,i,k){var l,o,q,r=0,s="0",t=f&&[],u=[],v=j,x=f||e&&d.find.TAG("*",k),y=w+=null==v?1:Math.random()||.1,z=x.length;for(k&&(j=g===n||g||k);s!==z&&null!=(l=x[s]);s++){if(e&&l){o=0,g||l.ownerDocument===n||(m(l),h=!p);while(q=a[o++])if(q(l,g||n,h)){i.push(l);break}k&&(w=y)}c&&((l=!q&&l)&&r--,f&&t.push(l))}if(r+=s,c&&s!==r){o=0;while(q=b[o++])q(t,u,g,h);if(f){if(r>0)while(s--)t[s]||u[s]||(u[s]=E.call(i));u=wa(u)}G.apply(i,u),k&&!f&&u.length>0&&r+b.length>1&&ga.uniqueSort(i)}return k&&(w=y,j=v),t};return c?ia(f):f}return h=ga.compile=function(a,b){var c,d=[],e=[],f=A[a+" "];if(!f){b||(b=g(a)),c=b.length;while(c--)f=ya(b[c]),f[u]?d.push(f):e.push(f);f=A(a,za(e,d)),f.selector=a}return f},i=ga.select=function(a,b,c,e){var f,i,j,k,l,m="function"==typeof a&&a,n=!e&&g(a=m.selector||a);if(c=c||[],1===n.length){if(i=n[0]=n[0].slice(0),i.length>2&&"ID"===(j=i[0]).type&&9===b.nodeType&&p&&d.relative[i[1].type]){if(b=(d.find.ID(j.matches[0].replace(_,aa),b)||[])[0],!b)return c;m&&(b=b.parentNode),a=a.slice(i.shift().value.length)}f=V.needsContext.test(a)?0:i.length;while(f--){if(j=i[f],d.relative[k=j.type])break;if((l=d.find[k])&&(e=l(j.matches[0].replace(_,aa),$.test(i[0].type)&&qa(b.parentNode)||b))){if(i.splice(f,1),a=e.length&&sa(i),!a)return G.apply(c,e),c;break}}}return(m||h(a,n))(e,b,!p,c,!b||$.test(a)&&qa(b.parentNode)||b),c},c.sortStable=u.split("").sort(B).join("")===u,c.detectDuplicates=!!l,m(),c.sortDetached=ja(function(a){return 1&a.compareDocumentPosition(n.createElement("fieldset"))}),ja(function(a){return a.innerHTML="<a href='#'></a>","#"===a.firstChild.getAttribute("href")})||ka("type|href|height|width",function(a,b,c){if(!c)return a.getAttribute(b,"type"===b.toLowerCase()?1:2)}),c.attributes&&ja(function(a){return a.innerHTML="<input/>",a.firstChild.setAttribute("value",""),""===a.firstChild.getAttribute("value")})||ka("value",function(a,b,c){if(!c&&"input"===a.nodeName.toLowerCase())return a.defaultValue}),ja(function(a){return null==a.getAttribute("disabled")})||ka(J,function(a,b,c){var d;if(!c)return a[b]===!0?b.toLowerCase():(d=a.getAttributeNode(b))&&d.specified?d.value:null}),ga}(a);r.find=x,r.expr=x.selectors,r.expr[":"]=r.expr.pseudos,r.uniqueSort=r.unique=x.uniqueSort,r.text=x.getText,r.isXMLDoc=x.isXML,r.contains=x.contains,r.escapeSelector=x.escape;var y=function(a,b,c){var d=[],e=void 0!==c;while((a=a[b])&&9!==a.nodeType)if(1===a.nodeType){if(e&&r(a).is(c))break;d.push(a)}return d},z=function(a,b){for(var c=[];a;a=a.nextSibling)1===a.nodeType&&a!==b&&c.push(a);return c},A=r.expr.match.needsContext,B=/^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i,C=/^.[^:#\[\.,]*$/;function D(a,b,c){return r.isFunction(b)?r.grep(a,function(a,d){return!!b.call(a,d,a)!==c}):b.nodeType?r.grep(a,function(a){return a===b!==c}):"string"!=typeof b?r.grep(a,function(a){return i.call(b,a)>-1!==c}):C.test(b)?r.filter(b,a,c):(b=r.filter(b,a),r.grep(a,function(a){return i.call(b,a)>-1!==c&&1===a.nodeType}))}r.filter=function(a,b,c){var d=b[0];return c&&(a=":not("+a+")"),1===b.length&&1===d.nodeType?r.find.matchesSelector(d,a)?[d]:[]:r.find.matches(a,r.grep(b,function(a){return 1===a.nodeType}))},r.fn.extend({find:function(a){var b,c,d=this.length,e=this;if("string"!=typeof a)return this.pushStack(r(a).filter(function(){for(b=0;b<d;b++)if(r.contains(e[b],this))return!0}));for(c=this.pushStack([]),b=0;b<d;b++)r.find(a,e[b],c);return d>1?r.uniqueSort(c):c},filter:function(a){return this.pushStack(D(this,a||[],!1))},not:function(a){return this.pushStack(D(this,a||[],!0))},is:function(a){return!!D(this,"string"==typeof a&&A.test(a)?r(a):a||[],!1).length}});var E,F=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,G=r.fn.init=function(a,b,c){var e,f;if(!a)return this;if(c=c||E,"string"==typeof a){if(e="<"===a[0]&&">"===a[a.length-1]&&a.length>=3?[null,a,null]:F.exec(a),!e||!e[1]&&b)return!b||b.jquery?(b||c).find(a):this.constructor(b).find(a);if(e[1]){if(b=b instanceof r?b[0]:b,r.merge(this,r.parseHTML(e[1],b&&b.nodeType?b.ownerDocument||b:d,!0)),B.test(e[1])&&r.isPlainObject(b))for(e in b)r.isFunction(this[e])?this[e](b[e]):this.attr(e,b[e]);return this}return f=d.getElementById(e[2]),f&&(this[0]=f,this.length=1),this}return a.nodeType?(this[0]=a,this.length=1,this):r.isFunction(a)?void 0!==c.ready?c.ready(a):a(r):r.makeArray(a,this)};G.prototype=r.fn,E=r(d);var H=/^(?:parents|prev(?:Until|All))/,I={children:!0,contents:!0,next:!0,prev:!0};r.fn.extend({has:function(a){var b=r(a,this),c=b.length;return this.filter(function(){for(var a=0;a<c;a++)if(r.contains(this,b[a]))return!0})},closest:function(a,b){var c,d=0,e=this.length,f=[],g="string"!=typeof a&&r(a);if(!A.test(a))for(;d<e;d++)for(c=this[d];c&&c!==b;c=c.parentNode)if(c.nodeType<11&&(g?g.index(c)>-1:1===c.nodeType&&r.find.matchesSelector(c,a))){f.push(c);break}return this.pushStack(f.length>1?r.uniqueSort(f):f)},index:function(a){return a?"string"==typeof a?i.call(r(a),this[0]):i.call(this,a.jquery?a[0]:a):this[0]&&this[0].parentNode?this.first().prevAll().length:-1},add:function(a,b){return this.pushStack(r.uniqueSort(r.merge(this.get(),r(a,b))))},addBack:function(a){return this.add(null==a?this.prevObject:this.prevObject.filter(a))}});function J(a,b){while((a=a[b])&&1!==a.nodeType);return a}r.each({parent:function(a){var b=a.parentNode;return b&&11!==b.nodeType?b:null},parents:function(a){return y(a,"parentNode")},parentsUntil:function(a,b,c){return y(a,"parentNode",c)},next:function(a){return J(a,"nextSibling")},prev:function(a){return J(a,"previousSibling")},nextAll:function(a){return y(a,"nextSibling")},prevAll:function(a){return y(a,"previousSibling")},nextUntil:function(a,b,c){return y(a,"nextSibling",c)},prevUntil:function(a,b,c){return y(a,"previousSibling",c)},siblings:function(a){return z((a.parentNode||{}).firstChild,a)},children:function(a){return z(a.firstChild)},contents:function(a){return a.contentDocument||r.merge([],a.childNodes)}},function(a,b){r.fn[a]=function(c,d){var e=r.map(this,b,c);return"Until"!==a.slice(-5)&&(d=c),d&&"string"==typeof d&&(e=r.filter(d,e)),this.length>1&&(I[a]||r.uniqueSort(e),H.test(a)&&e.reverse()),this.pushStack(e)}});var K=/[^\x20\t\r\n\f]+/g;function L(a){var b={};return r.each(a.match(K)||[],function(a,c){b[c]=!0}),b}r.Callbacks=function(a){a="string"==typeof a?L(a):r.extend({},a);var b,c,d,e,f=[],g=[],h=-1,i=function(){for(e=a.once,d=b=!0;g.length;h=-1){c=g.shift();while(++h<f.length)f[h].apply(c[0],c[1])===!1&&a.stopOnFalse&&(h=f.length,c=!1)}a.memory||(c=!1),b=!1,e&&(f=c?[]:"")},j={add:function(){return f&&(c&&!b&&(h=f.length-1,g.push(c)),function d(b){r.each(b,function(b,c){r.isFunction(c)?a.unique&&j.has(c)||f.push(c):c&&c.length&&"string"!==r.type(c)&&d(c)})}(arguments),c&&!b&&i()),this},remove:function(){return r.each(arguments,function(a,b){var c;while((c=r.inArray(b,f,c))>-1)f.splice(c,1),c<=h&&h--}),this},has:function(a){return a?r.inArray(a,f)>-1:f.length>0},empty:function(){return f&&(f=[]),this},disable:function(){return e=g=[],f=c="",this},disabled:function(){return!f},lock:function(){return e=g=[],c||b||(f=c=""),this},locked:function(){return!!e},fireWith:function(a,c){return e||(c=c||[],c=[a,c.slice?c.slice():c],g.push(c),b||i()),this},fire:function(){return j.fireWith(this,arguments),this},fired:function(){return!!d}};return j};function M(a){return a}function N(a){throw a}function O(a,b,c){var d;try{a&&r.isFunction(d=a.promise)?d.call(a).done(b).fail(c):a&&r.isFunction(d=a.then)?d.call(a,b,c):b.call(void 0,a)}catch(a){c.call(void 0,a)}}r.extend({Deferred:function(b){var c=[["notify","progress",r.Callbacks("memory"),r.Callbacks("memory"),2],["resolve","done",r.Callbacks("once memory"),r.Callbacks("once memory"),0,"resolved"],["reject","fail",r.Callbacks("once memory"),r.Callbacks("once memory"),1,"rejected"]],d="pending",e={state:function(){return d},always:function(){return f.done(arguments).fail(arguments),this},"catch":function(a){return e.then(null,a)},pipe:function(){var a=arguments;return r.Deferred(function(b){r.each(c,function(c,d){var e=r.isFunction(a[d[4]])&&a[d[4]];f[d[1]](function(){var a=e&&e.apply(this,arguments);a&&r.isFunction(a.promise)?a.promise().progress(b.notify).done(b.resolve).fail(b.reject):b[d[0]+"With"](this,e?[a]:arguments)})}),a=null}).promise()},then:function(b,d,e){var f=0;function g(b,c,d,e){return function(){var h=this,i=arguments,j=function(){var a,j;if(!(b<f)){if(a=d.apply(h,i),a===c.promise())throw new TypeError("Thenable self-resolution");j=a&&("object"==typeof a||"function"==typeof a)&&a.then,r.isFunction(j)?e?j.call(a,g(f,c,M,e),g(f,c,N,e)):(f++,j.call(a,g(f,c,M,e),g(f,c,N,e),g(f,c,M,c.notifyWith))):(d!==M&&(h=void 0,i=[a]),(e||c.resolveWith)(h,i))}},k=e?j:function(){try{j()}catch(a){r.Deferred.exceptionHook&&r.Deferred.exceptionHook(a,k.stackTrace),b+1>=f&&(d!==N&&(h=void 0,i=[a]),c.rejectWith(h,i))}};b?k():(r.Deferred.getStackHook&&(k.stackTrace=r.Deferred.getStackHook()),a.setTimeout(k))}}return r.Deferred(function(a){c[0][3].add(g(0,a,r.isFunction(e)?e:M,a.notifyWith)),c[1][3].add(g(0,a,r.isFunction(b)?b:M)),c[2][3].add(g(0,a,r.isFunction(d)?d:N))}).promise()},promise:function(a){return null!=a?r.extend(a,e):e}},f={};return r.each(c,function(a,b){var g=b[2],h=b[5];e[b[1]]=g.add,h&&g.add(function(){d=h},c[3-a][2].disable,c[0][2].lock),g.add(b[3].fire),f[b[0]]=function(){return f[b[0]+"With"](this===f?void 0:this,arguments),this},f[b[0]+"With"]=g.fireWith}),e.promise(f),b&&b.call(f,f),f},when:function(a){var b=arguments.length,c=b,d=Array(c),e=f.call(arguments),g=r.Deferred(),h=function(a){return function(c){d[a]=this,e[a]=arguments.length>1?f.call(arguments):c,--b||g.resolveWith(d,e)}};if(b<=1&&(O(a,g.done(h(c)).resolve,g.reject),"pending"===g.state()||r.isFunction(e[c]&&e[c].then)))return g.then();while(c--)O(e[c],h(c),g.reject);return g.promise()}});var P=/^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;r.Deferred.exceptionHook=function(b,c){a.console&&a.console.warn&&b&&P.test(b.name)&&a.console.warn("jQuery.Deferred exception: "+b.message,b.stack,c)},r.readyException=function(b){a.setTimeout(function(){throw b})};var Q=r.Deferred();r.fn.ready=function(a){return Q.then(a)["catch"](function(a){r.readyException(a)}),this},r.extend({isReady:!1,readyWait:1,holdReady:function(a){a?r.readyWait++:r.ready(!0)},ready:function(a){(a===!0?--r.readyWait:r.isReady)||(r.isReady=!0,a!==!0&&--r.readyWait>0||Q.resolveWith(d,[r]))}}),r.ready.then=Q.then;function R(){d.removeEventListener("DOMContentLoaded",R),
a.removeEventListener("load",R),r.ready()}"complete"===d.readyState||"loading"!==d.readyState&&!d.documentElement.doScroll?a.setTimeout(r.ready):(d.addEventListener("DOMContentLoaded",R),a.addEventListener("load",R));var S=function(a,b,c,d,e,f,g){var h=0,i=a.length,j=null==c;if("object"===r.type(c)){e=!0;for(h in c)S(a,b,h,c[h],!0,f,g)}else if(void 0!==d&&(e=!0,r.isFunction(d)||(g=!0),j&&(g?(b.call(a,d),b=null):(j=b,b=function(a,b,c){return j.call(r(a),c)})),b))for(;h<i;h++)b(a[h],c,g?d:d.call(a[h],h,b(a[h],c)));return e?a:j?b.call(a):i?b(a[0],c):f},T=function(a){return 1===a.nodeType||9===a.nodeType||!+a.nodeType};function U(){this.expando=r.expando+U.uid++}U.uid=1,U.prototype={cache:function(a){var b=a[this.expando];return b||(b={},T(a)&&(a.nodeType?a[this.expando]=b:Object.defineProperty(a,this.expando,{value:b,configurable:!0}))),b},set:function(a,b,c){var d,e=this.cache(a);if("string"==typeof b)e[r.camelCase(b)]=c;else for(d in b)e[r.camelCase(d)]=b[d];return e},get:function(a,b){return void 0===b?this.cache(a):a[this.expando]&&a[this.expando][r.camelCase(b)]},access:function(a,b,c){return void 0===b||b&&"string"==typeof b&&void 0===c?this.get(a,b):(this.set(a,b,c),void 0!==c?c:b)},remove:function(a,b){var c,d=a[this.expando];if(void 0!==d){if(void 0!==b){r.isArray(b)?b=b.map(r.camelCase):(b=r.camelCase(b),b=b in d?[b]:b.match(K)||[]),c=b.length;while(c--)delete d[b[c]]}(void 0===b||r.isEmptyObject(d))&&(a.nodeType?a[this.expando]=void 0:delete a[this.expando])}},hasData:function(a){var b=a[this.expando];return void 0!==b&&!r.isEmptyObject(b)}};var V=new U,W=new U,X=/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,Y=/[A-Z]/g;function Z(a){return"true"===a||"false"!==a&&("null"===a?null:a===+a+""?+a:X.test(a)?JSON.parse(a):a)}function $(a,b,c){var d;if(void 0===c&&1===a.nodeType)if(d="data-"+b.replace(Y,"-$&").toLowerCase(),c=a.getAttribute(d),"string"==typeof c){try{c=Z(c)}catch(e){}W.set(a,b,c)}else c=void 0;return c}r.extend({hasData:function(a){return W.hasData(a)||V.hasData(a)},data:function(a,b,c){return W.access(a,b,c)},removeData:function(a,b){W.remove(a,b)},_data:function(a,b,c){return V.access(a,b,c)},_removeData:function(a,b){V.remove(a,b)}}),r.fn.extend({data:function(a,b){var c,d,e,f=this[0],g=f&&f.attributes;if(void 0===a){if(this.length&&(e=W.get(f),1===f.nodeType&&!V.get(f,"hasDataAttrs"))){c=g.length;while(c--)g[c]&&(d=g[c].name,0===d.indexOf("data-")&&(d=r.camelCase(d.slice(5)),$(f,d,e[d])));V.set(f,"hasDataAttrs",!0)}return e}return"object"==typeof a?this.each(function(){W.set(this,a)}):S(this,function(b){var c;if(f&&void 0===b){if(c=W.get(f,a),void 0!==c)return c;if(c=$(f,a),void 0!==c)return c}else this.each(function(){W.set(this,a,b)})},null,b,arguments.length>1,null,!0)},removeData:function(a){return this.each(function(){W.remove(this,a)})}}),r.extend({queue:function(a,b,c){var d;if(a)return b=(b||"fx")+"queue",d=V.get(a,b),c&&(!d||r.isArray(c)?d=V.access(a,b,r.makeArray(c)):d.push(c)),d||[]},dequeue:function(a,b){b=b||"fx";var c=r.queue(a,b),d=c.length,e=c.shift(),f=r._queueHooks(a,b),g=function(){r.dequeue(a,b)};"inprogress"===e&&(e=c.shift(),d--),e&&("fx"===b&&c.unshift("inprogress"),delete f.stop,e.call(a,g,f)),!d&&f&&f.empty.fire()},_queueHooks:function(a,b){var c=b+"queueHooks";return V.get(a,c)||V.access(a,c,{empty:r.Callbacks("once memory").add(function(){V.remove(a,[b+"queue",c])})})}}),r.fn.extend({queue:function(a,b){var c=2;return"string"!=typeof a&&(b=a,a="fx",c--),arguments.length<c?r.queue(this[0],a):void 0===b?this:this.each(function(){var c=r.queue(this,a,b);r._queueHooks(this,a),"fx"===a&&"inprogress"!==c[0]&&r.dequeue(this,a)})},dequeue:function(a){return this.each(function(){r.dequeue(this,a)})},clearQueue:function(a){return this.queue(a||"fx",[])},promise:function(a,b){var c,d=1,e=r.Deferred(),f=this,g=this.length,h=function(){--d||e.resolveWith(f,[f])};"string"!=typeof a&&(b=a,a=void 0),a=a||"fx";while(g--)c=V.get(f[g],a+"queueHooks"),c&&c.empty&&(d++,c.empty.add(h));return h(),e.promise(b)}});var _=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,aa=new RegExp("^(?:([+-])=|)("+_+")([a-z%]*)$","i"),ba=["Top","Right","Bottom","Left"],ca=function(a,b){return a=b||a,"none"===a.style.display||""===a.style.display&&r.contains(a.ownerDocument,a)&&"none"===r.css(a,"display")},da=function(a,b,c,d){var e,f,g={};for(f in b)g[f]=a.style[f],a.style[f]=b[f];e=c.apply(a,d||[]);for(f in b)a.style[f]=g[f];return e};function ea(a,b,c,d){var e,f=1,g=20,h=d?function(){return d.cur()}:function(){return r.css(a,b,"")},i=h(),j=c&&c[3]||(r.cssNumber[b]?"":"px"),k=(r.cssNumber[b]||"px"!==j&&+i)&&aa.exec(r.css(a,b));if(k&&k[3]!==j){j=j||k[3],c=c||[],k=+i||1;do f=f||".5",k/=f,r.style(a,b,k+j);while(f!==(f=h()/i)&&1!==f&&--g)}return c&&(k=+k||+i||0,e=c[1]?k+(c[1]+1)*c[2]:+c[2],d&&(d.unit=j,d.start=k,d.end=e)),e}var fa={};function ga(a){var b,c=a.ownerDocument,d=a.nodeName,e=fa[d];return e?e:(b=c.body.appendChild(c.createElement(d)),e=r.css(b,"display"),b.parentNode.removeChild(b),"none"===e&&(e="block"),fa[d]=e,e)}function ha(a,b){for(var c,d,e=[],f=0,g=a.length;f<g;f++)d=a[f],d.style&&(c=d.style.display,b?("none"===c&&(e[f]=V.get(d,"display")||null,e[f]||(d.style.display="")),""===d.style.display&&ca(d)&&(e[f]=ga(d))):"none"!==c&&(e[f]="none",V.set(d,"display",c)));for(f=0;f<g;f++)null!=e[f]&&(a[f].style.display=e[f]);return a}r.fn.extend({show:function(){return ha(this,!0)},hide:function(){return ha(this)},toggle:function(a){return"boolean"==typeof a?a?this.show():this.hide():this.each(function(){ca(this)?r(this).show():r(this).hide()})}});var ia=/^(?:checkbox|radio)$/i,ja=/<([a-z][^\/\0>\x20\t\r\n\f]+)/i,ka=/^$|\/(?:java|ecma)script/i,la={option:[1,"<select multiple='multiple'>","</select>"],thead:[1,"<table>","</table>"],col:[2,"<table><colgroup>","</colgroup></table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:[0,"",""]};la.optgroup=la.option,la.tbody=la.tfoot=la.colgroup=la.caption=la.thead,la.th=la.td;function ma(a,b){var c;return c="undefined"!=typeof a.getElementsByTagName?a.getElementsByTagName(b||"*"):"undefined"!=typeof a.querySelectorAll?a.querySelectorAll(b||"*"):[],void 0===b||b&&r.nodeName(a,b)?r.merge([a],c):c}function na(a,b){for(var c=0,d=a.length;c<d;c++)V.set(a[c],"globalEval",!b||V.get(b[c],"globalEval"))}var oa=/<|&#?\w+;/;function pa(a,b,c,d,e){for(var f,g,h,i,j,k,l=b.createDocumentFragment(),m=[],n=0,o=a.length;n<o;n++)if(f=a[n],f||0===f)if("object"===r.type(f))r.merge(m,f.nodeType?[f]:f);else if(oa.test(f)){g=g||l.appendChild(b.createElement("div")),h=(ja.exec(f)||["",""])[1].toLowerCase(),i=la[h]||la._default,g.innerHTML=i[1]+r.htmlPrefilter(f)+i[2],k=i[0];while(k--)g=g.lastChild;r.merge(m,g.childNodes),g=l.firstChild,g.textContent=""}else m.push(b.createTextNode(f));l.textContent="",n=0;while(f=m[n++])if(d&&r.inArray(f,d)>-1)e&&e.push(f);else if(j=r.contains(f.ownerDocument,f),g=ma(l.appendChild(f),"script"),j&&na(g),c){k=0;while(f=g[k++])ka.test(f.type||"")&&c.push(f)}return l}!function(){var a=d.createDocumentFragment(),b=a.appendChild(d.createElement("div")),c=d.createElement("input");c.setAttribute("type","radio"),c.setAttribute("checked","checked"),c.setAttribute("name","t"),b.appendChild(c),o.checkClone=b.cloneNode(!0).cloneNode(!0).lastChild.checked,b.innerHTML="<textarea>x</textarea>",o.noCloneChecked=!!b.cloneNode(!0).lastChild.defaultValue}();var qa=d.documentElement,ra=/^key/,sa=/^(?:mouse|pointer|contextmenu|drag|drop)|click/,ta=/^([^.]*)(?:\.(.+)|)/;function ua(){return!0}function va(){return!1}function wa(){try{return d.activeElement}catch(a){}}function xa(a,b,c,d,e,f){var g,h;if("object"==typeof b){"string"!=typeof c&&(d=d||c,c=void 0);for(h in b)xa(a,h,c,d,b[h],f);return a}if(null==d&&null==e?(e=c,d=c=void 0):null==e&&("string"==typeof c?(e=d,d=void 0):(e=d,d=c,c=void 0)),e===!1)e=va;else if(!e)return a;return 1===f&&(g=e,e=function(a){return r().off(a),g.apply(this,arguments)},e.guid=g.guid||(g.guid=r.guid++)),a.each(function(){r.event.add(this,b,e,d,c)})}r.event={global:{},add:function(a,b,c,d,e){var f,g,h,i,j,k,l,m,n,o,p,q=V.get(a);if(q){c.handler&&(f=c,c=f.handler,e=f.selector),e&&r.find.matchesSelector(qa,e),c.guid||(c.guid=r.guid++),(i=q.events)||(i=q.events={}),(g=q.handle)||(g=q.handle=function(b){return"undefined"!=typeof r&&r.event.triggered!==b.type?r.event.dispatch.apply(a,arguments):void 0}),b=(b||"").match(K)||[""],j=b.length;while(j--)h=ta.exec(b[j])||[],n=p=h[1],o=(h[2]||"").split(".").sort(),n&&(l=r.event.special[n]||{},n=(e?l.delegateType:l.bindType)||n,l=r.event.special[n]||{},k=r.extend({type:n,origType:p,data:d,handler:c,guid:c.guid,selector:e,needsContext:e&&r.expr.match.needsContext.test(e),namespace:o.join(".")},f),(m=i[n])||(m=i[n]=[],m.delegateCount=0,l.setup&&l.setup.call(a,d,o,g)!==!1||a.addEventListener&&a.addEventListener(n,g)),l.add&&(l.add.call(a,k),k.handler.guid||(k.handler.guid=c.guid)),e?m.splice(m.delegateCount++,0,k):m.push(k),r.event.global[n]=!0)}},remove:function(a,b,c,d,e){var f,g,h,i,j,k,l,m,n,o,p,q=V.hasData(a)&&V.get(a);if(q&&(i=q.events)){b=(b||"").match(K)||[""],j=b.length;while(j--)if(h=ta.exec(b[j])||[],n=p=h[1],o=(h[2]||"").split(".").sort(),n){l=r.event.special[n]||{},n=(d?l.delegateType:l.bindType)||n,m=i[n]||[],h=h[2]&&new RegExp("(^|\\.)"+o.join("\\.(?:.*\\.|)")+"(\\.|$)"),g=f=m.length;while(f--)k=m[f],!e&&p!==k.origType||c&&c.guid!==k.guid||h&&!h.test(k.namespace)||d&&d!==k.selector&&("**"!==d||!k.selector)||(m.splice(f,1),k.selector&&m.delegateCount--,l.remove&&l.remove.call(a,k));g&&!m.length&&(l.teardown&&l.teardown.call(a,o,q.handle)!==!1||r.removeEvent(a,n,q.handle),delete i[n])}else for(n in i)r.event.remove(a,n+b[j],c,d,!0);r.isEmptyObject(i)&&V.remove(a,"handle events")}},dispatch:function(a){var b=r.event.fix(a),c,d,e,f,g,h,i=new Array(arguments.length),j=(V.get(this,"events")||{})[b.type]||[],k=r.event.special[b.type]||{};for(i[0]=b,c=1;c<arguments.length;c++)i[c]=arguments[c];if(b.delegateTarget=this,!k.preDispatch||k.preDispatch.call(this,b)!==!1){h=r.event.handlers.call(this,b,j),c=0;while((f=h[c++])&&!b.isPropagationStopped()){b.currentTarget=f.elem,d=0;while((g=f.handlers[d++])&&!b.isImmediatePropagationStopped())b.rnamespace&&!b.rnamespace.test(g.namespace)||(b.handleObj=g,b.data=g.data,e=((r.event.special[g.origType]||{}).handle||g.handler).apply(f.elem,i),void 0!==e&&(b.result=e)===!1&&(b.preventDefault(),b.stopPropagation()))}return k.postDispatch&&k.postDispatch.call(this,b),b.result}},handlers:function(a,b){var c,d,e,f,g,h=[],i=b.delegateCount,j=a.target;if(i&&j.nodeType&&!("click"===a.type&&a.button>=1))for(;j!==this;j=j.parentNode||this)if(1===j.nodeType&&("click"!==a.type||j.disabled!==!0)){for(f=[],g={},c=0;c<i;c++)d=b[c],e=d.selector+" ",void 0===g[e]&&(g[e]=d.needsContext?r(e,this).index(j)>-1:r.find(e,this,null,[j]).length),g[e]&&f.push(d);f.length&&h.push({elem:j,handlers:f})}return j=this,i<b.length&&h.push({elem:j,handlers:b.slice(i)}),h},addProp:function(a,b){Object.defineProperty(r.Event.prototype,a,{enumerable:!0,configurable:!0,get:r.isFunction(b)?function(){if(this.originalEvent)return b(this.originalEvent)}:function(){if(this.originalEvent)return this.originalEvent[a]},set:function(b){Object.defineProperty(this,a,{enumerable:!0,configurable:!0,writable:!0,value:b})}})},fix:function(a){return a[r.expando]?a:new r.Event(a)},special:{load:{noBubble:!0},focus:{trigger:function(){if(this!==wa()&&this.focus)return this.focus(),!1},delegateType:"focusin"},blur:{trigger:function(){if(this===wa()&&this.blur)return this.blur(),!1},delegateType:"focusout"},click:{trigger:function(){if("checkbox"===this.type&&this.click&&r.nodeName(this,"input"))return this.click(),!1},_default:function(a){return r.nodeName(a.target,"a")}},beforeunload:{postDispatch:function(a){void 0!==a.result&&a.originalEvent&&(a.originalEvent.returnValue=a.result)}}}},r.removeEvent=function(a,b,c){a.removeEventListener&&a.removeEventListener(b,c)},r.Event=function(a,b){return this instanceof r.Event?(a&&a.type?(this.originalEvent=a,this.type=a.type,this.isDefaultPrevented=a.defaultPrevented||void 0===a.defaultPrevented&&a.returnValue===!1?ua:va,this.target=a.target&&3===a.target.nodeType?a.target.parentNode:a.target,this.currentTarget=a.currentTarget,this.relatedTarget=a.relatedTarget):this.type=a,b&&r.extend(this,b),this.timeStamp=a&&a.timeStamp||r.now(),void(this[r.expando]=!0)):new r.Event(a,b)},r.Event.prototype={constructor:r.Event,isDefaultPrevented:va,isPropagationStopped:va,isImmediatePropagationStopped:va,isSimulated:!1,preventDefault:function(){var a=this.originalEvent;this.isDefaultPrevented=ua,a&&!this.isSimulated&&a.preventDefault()},stopPropagation:function(){var a=this.originalEvent;this.isPropagationStopped=ua,a&&!this.isSimulated&&a.stopPropagation()},stopImmediatePropagation:function(){var a=this.originalEvent;this.isImmediatePropagationStopped=ua,a&&!this.isSimulated&&a.stopImmediatePropagation(),this.stopPropagation()}},r.each({altKey:!0,bubbles:!0,cancelable:!0,changedTouches:!0,ctrlKey:!0,detail:!0,eventPhase:!0,metaKey:!0,pageX:!0,pageY:!0,shiftKey:!0,view:!0,"char":!0,charCode:!0,key:!0,keyCode:!0,button:!0,buttons:!0,clientX:!0,clientY:!0,offsetX:!0,offsetY:!0,pointerId:!0,pointerType:!0,screenX:!0,screenY:!0,targetTouches:!0,toElement:!0,touches:!0,which:function(a){var b=a.button;return null==a.which&&ra.test(a.type)?null!=a.charCode?a.charCode:a.keyCode:!a.which&&void 0!==b&&sa.test(a.type)?1&b?1:2&b?3:4&b?2:0:a.which}},r.event.addProp),r.each({mouseenter:"mouseover",mouseleave:"mouseout",pointerenter:"pointerover",pointerleave:"pointerout"},function(a,b){r.event.special[a]={delegateType:b,bindType:b,handle:function(a){var c,d=this,e=a.relatedTarget,f=a.handleObj;return e&&(e===d||r.contains(d,e))||(a.type=f.origType,c=f.handler.apply(this,arguments),a.type=b),c}}}),r.fn.extend({on:function(a,b,c,d){return xa(this,a,b,c,d)},one:function(a,b,c,d){return xa(this,a,b,c,d,1)},off:function(a,b,c){var d,e;if(a&&a.preventDefault&&a.handleObj)return d=a.handleObj,r(a.delegateTarget).off(d.namespace?d.origType+"."+d.namespace:d.origType,d.selector,d.handler),this;if("object"==typeof a){for(e in a)this.off(e,b,a[e]);return this}return b!==!1&&"function"!=typeof b||(c=b,b=void 0),c===!1&&(c=va),this.each(function(){r.event.remove(this,a,c,b)})}});var ya=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi,za=/<script|<style|<link/i,Aa=/checked\s*(?:[^=]|=\s*.checked.)/i,Ba=/^true\/(.*)/,Ca=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;function Da(a,b){return r.nodeName(a,"table")&&r.nodeName(11!==b.nodeType?b:b.firstChild,"tr")?a.getElementsByTagName("tbody")[0]||a:a}function Ea(a){return a.type=(null!==a.getAttribute("type"))+"/"+a.type,a}function Fa(a){var b=Ba.exec(a.type);return b?a.type=b[1]:a.removeAttribute("type"),a}function Ga(a,b){var c,d,e,f,g,h,i,j;if(1===b.nodeType){if(V.hasData(a)&&(f=V.access(a),g=V.set(b,f),j=f.events)){delete g.handle,g.events={};for(e in j)for(c=0,d=j[e].length;c<d;c++)r.event.add(b,e,j[e][c])}W.hasData(a)&&(h=W.access(a),i=r.extend({},h),W.set(b,i))}}function Ha(a,b){var c=b.nodeName.toLowerCase();"input"===c&&ia.test(a.type)?b.checked=a.checked:"input"!==c&&"textarea"!==c||(b.defaultValue=a.defaultValue)}function Ia(a,b,c,d){b=g.apply([],b);var e,f,h,i,j,k,l=0,m=a.length,n=m-1,q=b[0],s=r.isFunction(q);if(s||m>1&&"string"==typeof q&&!o.checkClone&&Aa.test(q))return a.each(function(e){var f=a.eq(e);s&&(b[0]=q.call(this,e,f.html())),Ia(f,b,c,d)});if(m&&(e=pa(b,a[0].ownerDocument,!1,a,d),f=e.firstChild,1===e.childNodes.length&&(e=f),f||d)){for(h=r.map(ma(e,"script"),Ea),i=h.length;l<m;l++)j=e,l!==n&&(j=r.clone(j,!0,!0),i&&r.merge(h,ma(j,"script"))),c.call(a[l],j,l);if(i)for(k=h[h.length-1].ownerDocument,r.map(h,Fa),l=0;l<i;l++)j=h[l],ka.test(j.type||"")&&!V.access(j,"globalEval")&&r.contains(k,j)&&(j.src?r._evalUrl&&r._evalUrl(j.src):p(j.textContent.replace(Ca,""),k))}return a}function Ja(a,b,c){for(var d,e=b?r.filter(b,a):a,f=0;null!=(d=e[f]);f++)c||1!==d.nodeType||r.cleanData(ma(d)),d.parentNode&&(c&&r.contains(d.ownerDocument,d)&&na(ma(d,"script")),d.parentNode.removeChild(d));return a}r.extend({htmlPrefilter:function(a){return a.replace(ya,"<$1></$2>")},clone:function(a,b,c){var d,e,f,g,h=a.cloneNode(!0),i=r.contains(a.ownerDocument,a);if(!(o.noCloneChecked||1!==a.nodeType&&11!==a.nodeType||r.isXMLDoc(a)))for(g=ma(h),f=ma(a),d=0,e=f.length;d<e;d++)Ha(f[d],g[d]);if(b)if(c)for(f=f||ma(a),g=g||ma(h),d=0,e=f.length;d<e;d++)Ga(f[d],g[d]);else Ga(a,h);return g=ma(h,"script"),g.length>0&&na(g,!i&&ma(a,"script")),h},cleanData:function(a){for(var b,c,d,e=r.event.special,f=0;void 0!==(c=a[f]);f++)if(T(c)){if(b=c[V.expando]){if(b.events)for(d in b.events)e[d]?r.event.remove(c,d):r.removeEvent(c,d,b.handle);c[V.expando]=void 0}c[W.expando]&&(c[W.expando]=void 0)}}}),r.fn.extend({detach:function(a){return Ja(this,a,!0)},remove:function(a){return Ja(this,a)},text:function(a){return S(this,function(a){return void 0===a?r.text(this):this.empty().each(function(){1!==this.nodeType&&11!==this.nodeType&&9!==this.nodeType||(this.textContent=a)})},null,a,arguments.length)},append:function(){return Ia(this,arguments,function(a){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var b=Da(this,a);b.appendChild(a)}})},prepend:function(){return Ia(this,arguments,function(a){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var b=Da(this,a);b.insertBefore(a,b.firstChild)}})},before:function(){return Ia(this,arguments,function(a){this.parentNode&&this.parentNode.insertBefore(a,this)})},after:function(){return Ia(this,arguments,function(a){this.parentNode&&this.parentNode.insertBefore(a,this.nextSibling)})},empty:function(){for(var a,b=0;null!=(a=this[b]);b++)1===a.nodeType&&(r.cleanData(ma(a,!1)),a.textContent="");return this},clone:function(a,b){return a=null!=a&&a,b=null==b?a:b,this.map(function(){return r.clone(this,a,b)})},html:function(a){return S(this,function(a){var b=this[0]||{},c=0,d=this.length;if(void 0===a&&1===b.nodeType)return b.innerHTML;if("string"==typeof a&&!za.test(a)&&!la[(ja.exec(a)||["",""])[1].toLowerCase()]){a=r.htmlPrefilter(a);try{for(;c<d;c++)b=this[c]||{},1===b.nodeType&&(r.cleanData(ma(b,!1)),b.innerHTML=a);b=0}catch(e){}}b&&this.empty().append(a)},null,a,arguments.length)},replaceWith:function(){var a=[];return Ia(this,arguments,function(b){var c=this.parentNode;r.inArray(this,a)<0&&(r.cleanData(ma(this)),c&&c.replaceChild(b,this))},a)}}),r.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(a,b){r.fn[a]=function(a){for(var c,d=[],e=r(a),f=e.length-1,g=0;g<=f;g++)c=g===f?this:this.clone(!0),r(e[g])[b](c),h.apply(d,c.get());return this.pushStack(d)}});var Ka=/^margin/,La=new RegExp("^("+_+")(?!px)[a-z%]+$","i"),Ma=function(b){var c=b.ownerDocument.defaultView;return c&&c.opener||(c=a),c.getComputedStyle(b)};!function(){function b(){if(i){i.style.cssText="box-sizing:border-box;position:relative;display:block;margin:auto;border:1px;padding:1px;top:1%;width:50%",i.innerHTML="",qa.appendChild(h);var b=a.getComputedStyle(i);c="1%"!==b.top,g="2px"===b.marginLeft,e="4px"===b.width,i.style.marginRight="50%",f="4px"===b.marginRight,qa.removeChild(h),i=null}}var c,e,f,g,h=d.createElement("div"),i=d.createElement("div");i.style&&(i.style.backgroundClip="content-box",i.cloneNode(!0).style.backgroundClip="",o.clearCloneStyle="content-box"===i.style.backgroundClip,h.style.cssText="border:0;width:8px;height:0;top:0;left:-9999px;padding:0;margin-top:1px;position:absolute",h.appendChild(i),r.extend(o,{pixelPosition:function(){return b(),c},boxSizingReliable:function(){return b(),e},pixelMarginRight:function(){return b(),f},reliableMarginLeft:function(){return b(),g}}))}();function Na(a,b,c){var d,e,f,g,h=a.style;return c=c||Ma(a),c&&(g=c.getPropertyValue(b)||c[b],""!==g||r.contains(a.ownerDocument,a)||(g=r.style(a,b)),!o.pixelMarginRight()&&La.test(g)&&Ka.test(b)&&(d=h.width,e=h.minWidth,f=h.maxWidth,h.minWidth=h.maxWidth=h.width=g,g=c.width,h.width=d,h.minWidth=e,h.maxWidth=f)),void 0!==g?g+"":g}function Oa(a,b){return{get:function(){return a()?void delete this.get:(this.get=b).apply(this,arguments)}}}var Pa=/^(none|table(?!-c[ea]).+)/,Qa={position:"absolute",visibility:"hidden",display:"block"},Ra={letterSpacing:"0",fontWeight:"400"},Sa=["Webkit","Moz","ms"],Ta=d.createElement("div").style;function Ua(a){if(a in Ta)return a;var b=a[0].toUpperCase()+a.slice(1),c=Sa.length;while(c--)if(a=Sa[c]+b,a in Ta)return a}function Va(a,b,c){var d=aa.exec(b);return d?Math.max(0,d[2]-(c||0))+(d[3]||"px"):b}function Wa(a,b,c,d,e){var f,g=0;for(f=c===(d?"border":"content")?4:"width"===b?1:0;f<4;f+=2)"margin"===c&&(g+=r.css(a,c+ba[f],!0,e)),d?("content"===c&&(g-=r.css(a,"padding"+ba[f],!0,e)),"margin"!==c&&(g-=r.css(a,"border"+ba[f]+"Width",!0,e))):(g+=r.css(a,"padding"+ba[f],!0,e),"padding"!==c&&(g+=r.css(a,"border"+ba[f]+"Width",!0,e)));return g}function Xa(a,b,c){var d,e=!0,f=Ma(a),g="border-box"===r.css(a,"boxSizing",!1,f);if(a.getClientRects().length&&(d=a.getBoundingClientRect()[b]),d<=0||null==d){if(d=Na(a,b,f),(d<0||null==d)&&(d=a.style[b]),La.test(d))return d;e=g&&(o.boxSizingReliable()||d===a.style[b]),d=parseFloat(d)||0}return d+Wa(a,b,c||(g?"border":"content"),e,f)+"px"}r.extend({cssHooks:{opacity:{get:function(a,b){if(b){var c=Na(a,"opacity");return""===c?"1":c}}}},cssNumber:{animationIterationCount:!0,columnCount:!0,fillOpacity:!0,flexGrow:!0,flexShrink:!0,fontWeight:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{"float":"cssFloat"},style:function(a,b,c,d){if(a&&3!==a.nodeType&&8!==a.nodeType&&a.style){var e,f,g,h=r.camelCase(b),i=a.style;return b=r.cssProps[h]||(r.cssProps[h]=Ua(h)||h),g=r.cssHooks[b]||r.cssHooks[h],void 0===c?g&&"get"in g&&void 0!==(e=g.get(a,!1,d))?e:i[b]:(f=typeof c,"string"===f&&(e=aa.exec(c))&&e[1]&&(c=ea(a,b,e),f="number"),null!=c&&c===c&&("number"===f&&(c+=e&&e[3]||(r.cssNumber[h]?"":"px")),o.clearCloneStyle||""!==c||0!==b.indexOf("background")||(i[b]="inherit"),g&&"set"in g&&void 0===(c=g.set(a,c,d))||(i[b]=c)),void 0)}},css:function(a,b,c,d){var e,f,g,h=r.camelCase(b);return b=r.cssProps[h]||(r.cssProps[h]=Ua(h)||h),g=r.cssHooks[b]||r.cssHooks[h],g&&"get"in g&&(e=g.get(a,!0,c)),void 0===e&&(e=Na(a,b,d)),"normal"===e&&b in Ra&&(e=Ra[b]),""===c||c?(f=parseFloat(e),c===!0||isFinite(f)?f||0:e):e}}),r.each(["height","width"],function(a,b){r.cssHooks[b]={get:function(a,c,d){if(c)return!Pa.test(r.css(a,"display"))||a.getClientRects().length&&a.getBoundingClientRect().width?Xa(a,b,d):da(a,Qa,function(){return Xa(a,b,d)})},set:function(a,c,d){var e,f=d&&Ma(a),g=d&&Wa(a,b,d,"border-box"===r.css(a,"boxSizing",!1,f),f);return g&&(e=aa.exec(c))&&"px"!==(e[3]||"px")&&(a.style[b]=c,c=r.css(a,b)),Va(a,c,g)}}}),r.cssHooks.marginLeft=Oa(o.reliableMarginLeft,function(a,b){if(b)return(parseFloat(Na(a,"marginLeft"))||a.getBoundingClientRect().left-da(a,{marginLeft:0},function(){return a.getBoundingClientRect().left}))+"px"}),r.each({margin:"",padding:"",border:"Width"},function(a,b){r.cssHooks[a+b]={expand:function(c){for(var d=0,e={},f="string"==typeof c?c.split(" "):[c];d<4;d++)e[a+ba[d]+b]=f[d]||f[d-2]||f[0];return e}},Ka.test(a)||(r.cssHooks[a+b].set=Va)}),r.fn.extend({css:function(a,b){return S(this,function(a,b,c){var d,e,f={},g=0;if(r.isArray(b)){for(d=Ma(a),e=b.length;g<e;g++)f[b[g]]=r.css(a,b[g],!1,d);return f}return void 0!==c?r.style(a,b,c):r.css(a,b)},a,b,arguments.length>1)}});function Ya(a,b,c,d,e){return new Ya.prototype.init(a,b,c,d,e)}r.Tween=Ya,Ya.prototype={constructor:Ya,init:function(a,b,c,d,e,f){this.elem=a,this.prop=c,this.easing=e||r.easing._default,this.options=b,this.start=this.now=this.cur(),this.end=d,this.unit=f||(r.cssNumber[c]?"":"px")},cur:function(){var a=Ya.propHooks[this.prop];return a&&a.get?a.get(this):Ya.propHooks._default.get(this)},run:function(a){var b,c=Ya.propHooks[this.prop];return this.options.duration?this.pos=b=r.easing[this.easing](a,this.options.duration*a,0,1,this.options.duration):this.pos=b=a,this.now=(this.end-this.start)*b+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),c&&c.set?c.set(this):Ya.propHooks._default.set(this),this}},Ya.prototype.init.prototype=Ya.prototype,Ya.propHooks={_default:{get:function(a){var b;return 1!==a.elem.nodeType||null!=a.elem[a.prop]&&null==a.elem.style[a.prop]?a.elem[a.prop]:(b=r.css(a.elem,a.prop,""),b&&"auto"!==b?b:0)},set:function(a){r.fx.step[a.prop]?r.fx.step[a.prop](a):1!==a.elem.nodeType||null==a.elem.style[r.cssProps[a.prop]]&&!r.cssHooks[a.prop]?a.elem[a.prop]=a.now:r.style(a.elem,a.prop,a.now+a.unit)}}},Ya.propHooks.scrollTop=Ya.propHooks.scrollLeft={set:function(a){a.elem.nodeType&&a.elem.parentNode&&(a.elem[a.prop]=a.now)}},r.easing={linear:function(a){return a},swing:function(a){return.5-Math.cos(a*Math.PI)/2},_default:"swing"},r.fx=Ya.prototype.init,r.fx.step={};var Za,$a,_a=/^(?:toggle|show|hide)$/,ab=/queueHooks$/;function bb(){$a&&(a.requestAnimationFrame(bb),r.fx.tick())}function cb(){return a.setTimeout(function(){Za=void 0}),Za=r.now()}function db(a,b){var c,d=0,e={height:a};for(b=b?1:0;d<4;d+=2-b)c=ba[d],e["margin"+c]=e["padding"+c]=a;return b&&(e.opacity=e.width=a),e}function eb(a,b,c){for(var d,e=(hb.tweeners[b]||[]).concat(hb.tweeners["*"]),f=0,g=e.length;f<g;f++)if(d=e[f].call(c,b,a))return d}function fb(a,b,c){var d,e,f,g,h,i,j,k,l="width"in b||"height"in b,m=this,n={},o=a.style,p=a.nodeType&&ca(a),q=V.get(a,"fxshow");c.queue||(g=r._queueHooks(a,"fx"),null==g.unqueued&&(g.unqueued=0,h=g.empty.fire,g.empty.fire=function(){g.unqueued||h()}),g.unqueued++,m.always(function(){m.always(function(){g.unqueued--,r.queue(a,"fx").length||g.empty.fire()})}));for(d in b)if(e=b[d],_a.test(e)){if(delete b[d],f=f||"toggle"===e,e===(p?"hide":"show")){if("show"!==e||!q||void 0===q[d])continue;p=!0}n[d]=q&&q[d]||r.style(a,d)}if(i=!r.isEmptyObject(b),i||!r.isEmptyObject(n)){l&&1===a.nodeType&&(c.overflow=[o.overflow,o.overflowX,o.overflowY],j=q&&q.display,null==j&&(j=V.get(a,"display")),k=r.css(a,"display"),"none"===k&&(j?k=j:(ha([a],!0),j=a.style.display||j,k=r.css(a,"display"),ha([a]))),("inline"===k||"inline-block"===k&&null!=j)&&"none"===r.css(a,"float")&&(i||(m.done(function(){o.display=j}),null==j&&(k=o.display,j="none"===k?"":k)),o.display="inline-block")),c.overflow&&(o.overflow="hidden",m.always(function(){o.overflow=c.overflow[0],o.overflowX=c.overflow[1],o.overflowY=c.overflow[2]})),i=!1;for(d in n)i||(q?"hidden"in q&&(p=q.hidden):q=V.access(a,"fxshow",{display:j}),f&&(q.hidden=!p),p&&ha([a],!0),m.done(function(){p||ha([a]),V.remove(a,"fxshow");for(d in n)r.style(a,d,n[d])})),i=eb(p?q[d]:0,d,m),d in q||(q[d]=i.start,p&&(i.end=i.start,i.start=0))}}function gb(a,b){var c,d,e,f,g;for(c in a)if(d=r.camelCase(c),e=b[d],f=a[c],r.isArray(f)&&(e=f[1],f=a[c]=f[0]),c!==d&&(a[d]=f,delete a[c]),g=r.cssHooks[d],g&&"expand"in g){f=g.expand(f),delete a[d];for(c in f)c in a||(a[c]=f[c],b[c]=e)}else b[d]=e}function hb(a,b,c){var d,e,f=0,g=hb.prefilters.length,h=r.Deferred().always(function(){delete i.elem}),i=function(){if(e)return!1;for(var b=Za||cb(),c=Math.max(0,j.startTime+j.duration-b),d=c/j.duration||0,f=1-d,g=0,i=j.tweens.length;g<i;g++)j.tweens[g].run(f);return h.notifyWith(a,[j,f,c]),f<1&&i?c:(h.resolveWith(a,[j]),!1)},j=h.promise({elem:a,props:r.extend({},b),opts:r.extend(!0,{specialEasing:{},easing:r.easing._default},c),originalProperties:b,originalOptions:c,startTime:Za||cb(),duration:c.duration,tweens:[],createTween:function(b,c){var d=r.Tween(a,j.opts,b,c,j.opts.specialEasing[b]||j.opts.easing);return j.tweens.push(d),d},stop:function(b){var c=0,d=b?j.tweens.length:0;if(e)return this;for(e=!0;c<d;c++)j.tweens[c].run(1);return b?(h.notifyWith(a,[j,1,0]),h.resolveWith(a,[j,b])):h.rejectWith(a,[j,b]),this}}),k=j.props;for(gb(k,j.opts.specialEasing);f<g;f++)if(d=hb.prefilters[f].call(j,a,k,j.opts))return r.isFunction(d.stop)&&(r._queueHooks(j.elem,j.opts.queue).stop=r.proxy(d.stop,d)),d;return r.map(k,eb,j),r.isFunction(j.opts.start)&&j.opts.start.call(a,j),r.fx.timer(r.extend(i,{elem:a,anim:j,queue:j.opts.queue})),j.progress(j.opts.progress).done(j.opts.done,j.opts.complete).fail(j.opts.fail).always(j.opts.always)}r.Animation=r.extend(hb,{tweeners:{"*":[function(a,b){var c=this.createTween(a,b);return ea(c.elem,a,aa.exec(b),c),c}]},tweener:function(a,b){r.isFunction(a)?(b=a,a=["*"]):a=a.match(K);for(var c,d=0,e=a.length;d<e;d++)c=a[d],hb.tweeners[c]=hb.tweeners[c]||[],hb.tweeners[c].unshift(b)},prefilters:[fb],prefilter:function(a,b){b?hb.prefilters.unshift(a):hb.prefilters.push(a)}}),r.speed=function(a,b,c){var e=a&&"object"==typeof a?r.extend({},a):{complete:c||!c&&b||r.isFunction(a)&&a,duration:a,easing:c&&b||b&&!r.isFunction(b)&&b};return r.fx.off||d.hidden?e.duration=0:"number"!=typeof e.duration&&(e.duration in r.fx.speeds?e.duration=r.fx.speeds[e.duration]:e.duration=r.fx.speeds._default),null!=e.queue&&e.queue!==!0||(e.queue="fx"),e.old=e.complete,e.complete=function(){r.isFunction(e.old)&&e.old.call(this),e.queue&&r.dequeue(this,e.queue)},e},r.fn.extend({fadeTo:function(a,b,c,d){return this.filter(ca).css("opacity",0).show().end().animate({opacity:b},a,c,d)},animate:function(a,b,c,d){var e=r.isEmptyObject(a),f=r.speed(b,c,d),g=function(){var b=hb(this,r.extend({},a),f);(e||V.get(this,"finish"))&&b.stop(!0)};return g.finish=g,e||f.queue===!1?this.each(g):this.queue(f.queue,g)},stop:function(a,b,c){var d=function(a){var b=a.stop;delete a.stop,b(c)};return"string"!=typeof a&&(c=b,b=a,a=void 0),b&&a!==!1&&this.queue(a||"fx",[]),this.each(function(){var b=!0,e=null!=a&&a+"queueHooks",f=r.timers,g=V.get(this);if(e)g[e]&&g[e].stop&&d(g[e]);else for(e in g)g[e]&&g[e].stop&&ab.test(e)&&d(g[e]);for(e=f.length;e--;)f[e].elem!==this||null!=a&&f[e].queue!==a||(f[e].anim.stop(c),b=!1,f.splice(e,1));!b&&c||r.dequeue(this,a)})},finish:function(a){return a!==!1&&(a=a||"fx"),this.each(function(){var b,c=V.get(this),d=c[a+"queue"],e=c[a+"queueHooks"],f=r.timers,g=d?d.length:0;for(c.finish=!0,r.queue(this,a,[]),e&&e.stop&&e.stop.call(this,!0),b=f.length;b--;)f[b].elem===this&&f[b].queue===a&&(f[b].anim.stop(!0),f.splice(b,1));for(b=0;b<g;b++)d[b]&&d[b].finish&&d[b].finish.call(this);delete c.finish})}}),r.each(["toggle","show","hide"],function(a,b){var c=r.fn[b];r.fn[b]=function(a,d,e){return null==a||"boolean"==typeof a?c.apply(this,arguments):this.animate(db(b,!0),a,d,e)}}),r.each({slideDown:db("show"),slideUp:db("hide"),slideToggle:db("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(a,b){r.fn[a]=function(a,c,d){return this.animate(b,a,c,d)}}),r.timers=[],r.fx.tick=function(){var a,b=0,c=r.timers;for(Za=r.now();b<c.length;b++)a=c[b],a()||c[b]!==a||c.splice(b--,1);c.length||r.fx.stop(),Za=void 0},r.fx.timer=function(a){r.timers.push(a),a()?r.fx.start():r.timers.pop()},r.fx.interval=13,r.fx.start=function(){$a||($a=a.requestAnimationFrame?a.requestAnimationFrame(bb):a.setInterval(r.fx.tick,r.fx.interval))},r.fx.stop=function(){a.cancelAnimationFrame?a.cancelAnimationFrame($a):a.clearInterval($a),$a=null},r.fx.speeds={slow:600,fast:200,_default:400},r.fn.delay=function(b,c){return b=r.fx?r.fx.speeds[b]||b:b,c=c||"fx",this.queue(c,function(c,d){var e=a.setTimeout(c,b);d.stop=function(){a.clearTimeout(e)}})},function(){var a=d.createElement("input"),b=d.createElement("select"),c=b.appendChild(d.createElement("option"));a.type="checkbox",o.checkOn=""!==a.value,o.optSelected=c.selected,a=d.createElement("input"),a.value="t",a.type="radio",o.radioValue="t"===a.value}();var ib,jb=r.expr.attrHandle;r.fn.extend({attr:function(a,b){return S(this,r.attr,a,b,arguments.length>1)},removeAttr:function(a){return this.each(function(){r.removeAttr(this,a)})}}),r.extend({attr:function(a,b,c){var d,e,f=a.nodeType;if(3!==f&&8!==f&&2!==f)return"undefined"==typeof a.getAttribute?r.prop(a,b,c):(1===f&&r.isXMLDoc(a)||(e=r.attrHooks[b.toLowerCase()]||(r.expr.match.bool.test(b)?ib:void 0)),
void 0!==c?null===c?void r.removeAttr(a,b):e&&"set"in e&&void 0!==(d=e.set(a,c,b))?d:(a.setAttribute(b,c+""),c):e&&"get"in e&&null!==(d=e.get(a,b))?d:(d=r.find.attr(a,b),null==d?void 0:d))},attrHooks:{type:{set:function(a,b){if(!o.radioValue&&"radio"===b&&r.nodeName(a,"input")){var c=a.value;return a.setAttribute("type",b),c&&(a.value=c),b}}}},removeAttr:function(a,b){var c,d=0,e=b&&b.match(K);if(e&&1===a.nodeType)while(c=e[d++])a.removeAttribute(c)}}),ib={set:function(a,b,c){return b===!1?r.removeAttr(a,c):a.setAttribute(c,c),c}},r.each(r.expr.match.bool.source.match(/\w+/g),function(a,b){var c=jb[b]||r.find.attr;jb[b]=function(a,b,d){var e,f,g=b.toLowerCase();return d||(f=jb[g],jb[g]=e,e=null!=c(a,b,d)?g:null,jb[g]=f),e}});var kb=/^(?:input|select|textarea|button)$/i,lb=/^(?:a|area)$/i;r.fn.extend({prop:function(a,b){return S(this,r.prop,a,b,arguments.length>1)},removeProp:function(a){return this.each(function(){delete this[r.propFix[a]||a]})}}),r.extend({prop:function(a,b,c){var d,e,f=a.nodeType;if(3!==f&&8!==f&&2!==f)return 1===f&&r.isXMLDoc(a)||(b=r.propFix[b]||b,e=r.propHooks[b]),void 0!==c?e&&"set"in e&&void 0!==(d=e.set(a,c,b))?d:a[b]=c:e&&"get"in e&&null!==(d=e.get(a,b))?d:a[b]},propHooks:{tabIndex:{get:function(a){var b=r.find.attr(a,"tabindex");return b?parseInt(b,10):kb.test(a.nodeName)||lb.test(a.nodeName)&&a.href?0:-1}}},propFix:{"for":"htmlFor","class":"className"}}),o.optSelected||(r.propHooks.selected={get:function(a){var b=a.parentNode;return b&&b.parentNode&&b.parentNode.selectedIndex,null},set:function(a){var b=a.parentNode;b&&(b.selectedIndex,b.parentNode&&b.parentNode.selectedIndex)}}),r.each(["tabIndex","readOnly","maxLength","cellSpacing","cellPadding","rowSpan","colSpan","useMap","frameBorder","contentEditable"],function(){r.propFix[this.toLowerCase()]=this});function mb(a){var b=a.match(K)||[];return b.join(" ")}function nb(a){return a.getAttribute&&a.getAttribute("class")||""}r.fn.extend({addClass:function(a){var b,c,d,e,f,g,h,i=0;if(r.isFunction(a))return this.each(function(b){r(this).addClass(a.call(this,b,nb(this)))});if("string"==typeof a&&a){b=a.match(K)||[];while(c=this[i++])if(e=nb(c),d=1===c.nodeType&&" "+mb(e)+" "){g=0;while(f=b[g++])d.indexOf(" "+f+" ")<0&&(d+=f+" ");h=mb(d),e!==h&&c.setAttribute("class",h)}}return this},removeClass:function(a){var b,c,d,e,f,g,h,i=0;if(r.isFunction(a))return this.each(function(b){r(this).removeClass(a.call(this,b,nb(this)))});if(!arguments.length)return this.attr("class","");if("string"==typeof a&&a){b=a.match(K)||[];while(c=this[i++])if(e=nb(c),d=1===c.nodeType&&" "+mb(e)+" "){g=0;while(f=b[g++])while(d.indexOf(" "+f+" ")>-1)d=d.replace(" "+f+" "," ");h=mb(d),e!==h&&c.setAttribute("class",h)}}return this},toggleClass:function(a,b){var c=typeof a;return"boolean"==typeof b&&"string"===c?b?this.addClass(a):this.removeClass(a):r.isFunction(a)?this.each(function(c){r(this).toggleClass(a.call(this,c,nb(this),b),b)}):this.each(function(){var b,d,e,f;if("string"===c){d=0,e=r(this),f=a.match(K)||[];while(b=f[d++])e.hasClass(b)?e.removeClass(b):e.addClass(b)}else void 0!==a&&"boolean"!==c||(b=nb(this),b&&V.set(this,"__className__",b),this.setAttribute&&this.setAttribute("class",b||a===!1?"":V.get(this,"__className__")||""))})},hasClass:function(a){var b,c,d=0;b=" "+a+" ";while(c=this[d++])if(1===c.nodeType&&(" "+mb(nb(c))+" ").indexOf(b)>-1)return!0;return!1}});var ob=/\r/g;r.fn.extend({val:function(a){var b,c,d,e=this[0];{if(arguments.length)return d=r.isFunction(a),this.each(function(c){var e;1===this.nodeType&&(e=d?a.call(this,c,r(this).val()):a,null==e?e="":"number"==typeof e?e+="":r.isArray(e)&&(e=r.map(e,function(a){return null==a?"":a+""})),b=r.valHooks[this.type]||r.valHooks[this.nodeName.toLowerCase()],b&&"set"in b&&void 0!==b.set(this,e,"value")||(this.value=e))});if(e)return b=r.valHooks[e.type]||r.valHooks[e.nodeName.toLowerCase()],b&&"get"in b&&void 0!==(c=b.get(e,"value"))?c:(c=e.value,"string"==typeof c?c.replace(ob,""):null==c?"":c)}}}),r.extend({valHooks:{option:{get:function(a){var b=r.find.attr(a,"value");return null!=b?b:mb(r.text(a))}},select:{get:function(a){var b,c,d,e=a.options,f=a.selectedIndex,g="select-one"===a.type,h=g?null:[],i=g?f+1:e.length;for(d=f<0?i:g?f:0;d<i;d++)if(c=e[d],(c.selected||d===f)&&!c.disabled&&(!c.parentNode.disabled||!r.nodeName(c.parentNode,"optgroup"))){if(b=r(c).val(),g)return b;h.push(b)}return h},set:function(a,b){var c,d,e=a.options,f=r.makeArray(b),g=e.length;while(g--)d=e[g],(d.selected=r.inArray(r.valHooks.option.get(d),f)>-1)&&(c=!0);return c||(a.selectedIndex=-1),f}}}}),r.each(["radio","checkbox"],function(){r.valHooks[this]={set:function(a,b){if(r.isArray(b))return a.checked=r.inArray(r(a).val(),b)>-1}},o.checkOn||(r.valHooks[this].get=function(a){return null===a.getAttribute("value")?"on":a.value})});var pb=/^(?:focusinfocus|focusoutblur)$/;r.extend(r.event,{trigger:function(b,c,e,f){var g,h,i,j,k,m,n,o=[e||d],p=l.call(b,"type")?b.type:b,q=l.call(b,"namespace")?b.namespace.split("."):[];if(h=i=e=e||d,3!==e.nodeType&&8!==e.nodeType&&!pb.test(p+r.event.triggered)&&(p.indexOf(".")>-1&&(q=p.split("."),p=q.shift(),q.sort()),k=p.indexOf(":")<0&&"on"+p,b=b[r.expando]?b:new r.Event(p,"object"==typeof b&&b),b.isTrigger=f?2:3,b.namespace=q.join("."),b.rnamespace=b.namespace?new RegExp("(^|\\.)"+q.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,b.result=void 0,b.target||(b.target=e),c=null==c?[b]:r.makeArray(c,[b]),n=r.event.special[p]||{},f||!n.trigger||n.trigger.apply(e,c)!==!1)){if(!f&&!n.noBubble&&!r.isWindow(e)){for(j=n.delegateType||p,pb.test(j+p)||(h=h.parentNode);h;h=h.parentNode)o.push(h),i=h;i===(e.ownerDocument||d)&&o.push(i.defaultView||i.parentWindow||a)}g=0;while((h=o[g++])&&!b.isPropagationStopped())b.type=g>1?j:n.bindType||p,m=(V.get(h,"events")||{})[b.type]&&V.get(h,"handle"),m&&m.apply(h,c),m=k&&h[k],m&&m.apply&&T(h)&&(b.result=m.apply(h,c),b.result===!1&&b.preventDefault());return b.type=p,f||b.isDefaultPrevented()||n._default&&n._default.apply(o.pop(),c)!==!1||!T(e)||k&&r.isFunction(e[p])&&!r.isWindow(e)&&(i=e[k],i&&(e[k]=null),r.event.triggered=p,e[p](),r.event.triggered=void 0,i&&(e[k]=i)),b.result}},simulate:function(a,b,c){var d=r.extend(new r.Event,c,{type:a,isSimulated:!0});r.event.trigger(d,null,b)}}),r.fn.extend({trigger:function(a,b){return this.each(function(){r.event.trigger(a,b,this)})},triggerHandler:function(a,b){var c=this[0];if(c)return r.event.trigger(a,b,c,!0)}}),r.each("blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(" "),function(a,b){r.fn[b]=function(a,c){return arguments.length>0?this.on(b,null,a,c):this.trigger(b)}}),r.fn.extend({hover:function(a,b){return this.mouseenter(a).mouseleave(b||a)}}),o.focusin="onfocusin"in a,o.focusin||r.each({focus:"focusin",blur:"focusout"},function(a,b){var c=function(a){r.event.simulate(b,a.target,r.event.fix(a))};r.event.special[b]={setup:function(){var d=this.ownerDocument||this,e=V.access(d,b);e||d.addEventListener(a,c,!0),V.access(d,b,(e||0)+1)},teardown:function(){var d=this.ownerDocument||this,e=V.access(d,b)-1;e?V.access(d,b,e):(d.removeEventListener(a,c,!0),V.remove(d,b))}}});var qb=a.location,rb=r.now(),sb=/\?/;r.parseXML=function(b){var c;if(!b||"string"!=typeof b)return null;try{c=(new a.DOMParser).parseFromString(b,"text/xml")}catch(d){c=void 0}return c&&!c.getElementsByTagName("parsererror").length||r.error("Invalid XML: "+b),c};var tb=/\[\]$/,ub=/\r?\n/g,vb=/^(?:submit|button|image|reset|file)$/i,wb=/^(?:input|select|textarea|keygen)/i;function xb(a,b,c,d){var e;if(r.isArray(b))r.each(b,function(b,e){c||tb.test(a)?d(a,e):xb(a+"["+("object"==typeof e&&null!=e?b:"")+"]",e,c,d)});else if(c||"object"!==r.type(b))d(a,b);else for(e in b)xb(a+"["+e+"]",b[e],c,d)}r.param=function(a,b){var c,d=[],e=function(a,b){var c=r.isFunction(b)?b():b;d[d.length]=encodeURIComponent(a)+"="+encodeURIComponent(null==c?"":c)};if(r.isArray(a)||a.jquery&&!r.isPlainObject(a))r.each(a,function(){e(this.name,this.value)});else for(c in a)xb(c,a[c],b,e);return d.join("&")},r.fn.extend({serialize:function(){return r.param(this.serializeArray())},serializeArray:function(){return this.map(function(){var a=r.prop(this,"elements");return a?r.makeArray(a):this}).filter(function(){var a=this.type;return this.name&&!r(this).is(":disabled")&&wb.test(this.nodeName)&&!vb.test(a)&&(this.checked||!ia.test(a))}).map(function(a,b){var c=r(this).val();return null==c?null:r.isArray(c)?r.map(c,function(a){return{name:b.name,value:a.replace(ub,"\r\n")}}):{name:b.name,value:c.replace(ub,"\r\n")}}).get()}});var yb=/%20/g,zb=/#.*$/,Ab=/([?&])_=[^&]*/,Bb=/^(.*?):[ \t]*([^\r\n]*)$/gm,Cb=/^(?:about|app|app-storage|.+-extension|file|res|widget):$/,Db=/^(?:GET|HEAD)$/,Eb=/^\/\//,Fb={},Gb={},Hb="*/".concat("*"),Ib=d.createElement("a");Ib.href=qb.href;function Jb(a){return function(b,c){"string"!=typeof b&&(c=b,b="*");var d,e=0,f=b.toLowerCase().match(K)||[];if(r.isFunction(c))while(d=f[e++])"+"===d[0]?(d=d.slice(1)||"*",(a[d]=a[d]||[]).unshift(c)):(a[d]=a[d]||[]).push(c)}}function Kb(a,b,c,d){var e={},f=a===Gb;function g(h){var i;return e[h]=!0,r.each(a[h]||[],function(a,h){var j=h(b,c,d);return"string"!=typeof j||f||e[j]?f?!(i=j):void 0:(b.dataTypes.unshift(j),g(j),!1)}),i}return g(b.dataTypes[0])||!e["*"]&&g("*")}function Lb(a,b){var c,d,e=r.ajaxSettings.flatOptions||{};for(c in b)void 0!==b[c]&&((e[c]?a:d||(d={}))[c]=b[c]);return d&&r.extend(!0,a,d),a}function Mb(a,b,c){var d,e,f,g,h=a.contents,i=a.dataTypes;while("*"===i[0])i.shift(),void 0===d&&(d=a.mimeType||b.getResponseHeader("Content-Type"));if(d)for(e in h)if(h[e]&&h[e].test(d)){i.unshift(e);break}if(i[0]in c)f=i[0];else{for(e in c){if(!i[0]||a.converters[e+" "+i[0]]){f=e;break}g||(g=e)}f=f||g}if(f)return f!==i[0]&&i.unshift(f),c[f]}function Nb(a,b,c,d){var e,f,g,h,i,j={},k=a.dataTypes.slice();if(k[1])for(g in a.converters)j[g.toLowerCase()]=a.converters[g];f=k.shift();while(f)if(a.responseFields[f]&&(c[a.responseFields[f]]=b),!i&&d&&a.dataFilter&&(b=a.dataFilter(b,a.dataType)),i=f,f=k.shift())if("*"===f)f=i;else if("*"!==i&&i!==f){if(g=j[i+" "+f]||j["* "+f],!g)for(e in j)if(h=e.split(" "),h[1]===f&&(g=j[i+" "+h[0]]||j["* "+h[0]])){g===!0?g=j[e]:j[e]!==!0&&(f=h[0],k.unshift(h[1]));break}if(g!==!0)if(g&&a["throws"])b=g(b);else try{b=g(b)}catch(l){return{state:"parsererror",error:g?l:"No conversion from "+i+" to "+f}}}return{state:"success",data:b}}r.extend({active:0,lastModified:{},etag:{},ajaxSettings:{url:qb.href,type:"GET",isLocal:Cb.test(qb.protocol),global:!0,processData:!0,async:!0,contentType:"application/x-www-form-urlencoded; charset=UTF-8",accepts:{"*":Hb,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/\bxml\b/,html:/\bhtml/,json:/\bjson\b/},responseFields:{xml:"responseXML",text:"responseText",json:"responseJSON"},converters:{"* text":String,"text html":!0,"text json":JSON.parse,"text xml":r.parseXML},flatOptions:{url:!0,context:!0}},ajaxSetup:function(a,b){return b?Lb(Lb(a,r.ajaxSettings),b):Lb(r.ajaxSettings,a)},ajaxPrefilter:Jb(Fb),ajaxTransport:Jb(Gb),ajax:function(b,c){"object"==typeof b&&(c=b,b=void 0),c=c||{};var e,f,g,h,i,j,k,l,m,n,o=r.ajaxSetup({},c),p=o.context||o,q=o.context&&(p.nodeType||p.jquery)?r(p):r.event,s=r.Deferred(),t=r.Callbacks("once memory"),u=o.statusCode||{},v={},w={},x="canceled",y={readyState:0,getResponseHeader:function(a){var b;if(k){if(!h){h={};while(b=Bb.exec(g))h[b[1].toLowerCase()]=b[2]}b=h[a.toLowerCase()]}return null==b?null:b},getAllResponseHeaders:function(){return k?g:null},setRequestHeader:function(a,b){return null==k&&(a=w[a.toLowerCase()]=w[a.toLowerCase()]||a,v[a]=b),this},overrideMimeType:function(a){return null==k&&(o.mimeType=a),this},statusCode:function(a){var b;if(a)if(k)y.always(a[y.status]);else for(b in a)u[b]=[u[b],a[b]];return this},abort:function(a){var b=a||x;return e&&e.abort(b),A(0,b),this}};if(s.promise(y),o.url=((b||o.url||qb.href)+"").replace(Eb,qb.protocol+"//"),o.type=c.method||c.type||o.method||o.type,o.dataTypes=(o.dataType||"*").toLowerCase().match(K)||[""],null==o.crossDomain){j=d.createElement("a");try{j.href=o.url,j.href=j.href,o.crossDomain=Ib.protocol+"//"+Ib.host!=j.protocol+"//"+j.host}catch(z){o.crossDomain=!0}}if(o.data&&o.processData&&"string"!=typeof o.data&&(o.data=r.param(o.data,o.traditional)),Kb(Fb,o,c,y),k)return y;l=r.event&&o.global,l&&0===r.active++&&r.event.trigger("ajaxStart"),o.type=o.type.toUpperCase(),o.hasContent=!Db.test(o.type),f=o.url.replace(zb,""),o.hasContent?o.data&&o.processData&&0===(o.contentType||"").indexOf("application/x-www-form-urlencoded")&&(o.data=o.data.replace(yb,"+")):(n=o.url.slice(f.length),o.data&&(f+=(sb.test(f)?"&":"?")+o.data,delete o.data),o.cache===!1&&(f=f.replace(Ab,"$1"),n=(sb.test(f)?"&":"?")+"_="+rb++ +n),o.url=f+n),o.ifModified&&(r.lastModified[f]&&y.setRequestHeader("If-Modified-Since",r.lastModified[f]),r.etag[f]&&y.setRequestHeader("If-None-Match",r.etag[f])),(o.data&&o.hasContent&&o.contentType!==!1||c.contentType)&&y.setRequestHeader("Content-Type",o.contentType),y.setRequestHeader("Accept",o.dataTypes[0]&&o.accepts[o.dataTypes[0]]?o.accepts[o.dataTypes[0]]+("*"!==o.dataTypes[0]?", "+Hb+"; q=0.01":""):o.accepts["*"]);for(m in o.headers)y.setRequestHeader(m,o.headers[m]);if(o.beforeSend&&(o.beforeSend.call(p,y,o)===!1||k))return y.abort();if(x="abort",t.add(o.complete),y.done(o.success),y.fail(o.error),e=Kb(Gb,o,c,y)){if(y.readyState=1,l&&q.trigger("ajaxSend",[y,o]),k)return y;o.async&&o.timeout>0&&(i=a.setTimeout(function(){y.abort("timeout")},o.timeout));try{k=!1,e.send(v,A)}catch(z){if(k)throw z;A(-1,z)}}else A(-1,"No Transport");function A(b,c,d,h){var j,m,n,v,w,x=c;k||(k=!0,i&&a.clearTimeout(i),e=void 0,g=h||"",y.readyState=b>0?4:0,j=b>=200&&b<300||304===b,d&&(v=Mb(o,y,d)),v=Nb(o,v,y,j),j?(o.ifModified&&(w=y.getResponseHeader("Last-Modified"),w&&(r.lastModified[f]=w),w=y.getResponseHeader("etag"),w&&(r.etag[f]=w)),204===b||"HEAD"===o.type?x="nocontent":304===b?x="notmodified":(x=v.state,m=v.data,n=v.error,j=!n)):(n=x,!b&&x||(x="error",b<0&&(b=0))),y.status=b,y.statusText=(c||x)+"",j?s.resolveWith(p,[m,x,y]):s.rejectWith(p,[y,x,n]),y.statusCode(u),u=void 0,l&&q.trigger(j?"ajaxSuccess":"ajaxError",[y,o,j?m:n]),t.fireWith(p,[y,x]),l&&(q.trigger("ajaxComplete",[y,o]),--r.active||r.event.trigger("ajaxStop")))}return y},getJSON:function(a,b,c){return r.get(a,b,c,"json")},getScript:function(a,b){return r.get(a,void 0,b,"script")}}),r.each(["get","post"],function(a,b){r[b]=function(a,c,d,e){return r.isFunction(c)&&(e=e||d,d=c,c=void 0),r.ajax(r.extend({url:a,type:b,dataType:e,data:c,success:d},r.isPlainObject(a)&&a))}}),r._evalUrl=function(a){return r.ajax({url:a,type:"GET",dataType:"script",cache:!0,async:!1,global:!1,"throws":!0})},r.fn.extend({wrapAll:function(a){var b;return this[0]&&(r.isFunction(a)&&(a=a.call(this[0])),b=r(a,this[0].ownerDocument).eq(0).clone(!0),this[0].parentNode&&b.insertBefore(this[0]),b.map(function(){var a=this;while(a.firstElementChild)a=a.firstElementChild;return a}).append(this)),this},wrapInner:function(a){return r.isFunction(a)?this.each(function(b){r(this).wrapInner(a.call(this,b))}):this.each(function(){var b=r(this),c=b.contents();c.length?c.wrapAll(a):b.append(a)})},wrap:function(a){var b=r.isFunction(a);return this.each(function(c){r(this).wrapAll(b?a.call(this,c):a)})},unwrap:function(a){return this.parent(a).not("body").each(function(){r(this).replaceWith(this.childNodes)}),this}}),r.expr.pseudos.hidden=function(a){return!r.expr.pseudos.visible(a)},r.expr.pseudos.visible=function(a){return!!(a.offsetWidth||a.offsetHeight||a.getClientRects().length)},r.ajaxSettings.xhr=function(){try{return new a.XMLHttpRequest}catch(b){}};var Ob={0:200,1223:204},Pb=r.ajaxSettings.xhr();o.cors=!!Pb&&"withCredentials"in Pb,o.ajax=Pb=!!Pb,r.ajaxTransport(function(b){var c,d;if(o.cors||Pb&&!b.crossDomain)return{send:function(e,f){var g,h=b.xhr();if(h.open(b.type,b.url,b.async,b.username,b.password),b.xhrFields)for(g in b.xhrFields)h[g]=b.xhrFields[g];b.mimeType&&h.overrideMimeType&&h.overrideMimeType(b.mimeType),b.crossDomain||e["X-Requested-With"]||(e["X-Requested-With"]="XMLHttpRequest");for(g in e)h.setRequestHeader(g,e[g]);c=function(a){return function(){c&&(c=d=h.onload=h.onerror=h.onabort=h.onreadystatechange=null,"abort"===a?h.abort():"error"===a?"number"!=typeof h.status?f(0,"error"):f(h.status,h.statusText):f(Ob[h.status]||h.status,h.statusText,"text"!==(h.responseType||"text")||"string"!=typeof h.responseText?{binary:h.response}:{text:h.responseText},h.getAllResponseHeaders()))}},h.onload=c(),d=h.onerror=c("error"),void 0!==h.onabort?h.onabort=d:h.onreadystatechange=function(){4===h.readyState&&a.setTimeout(function(){c&&d()})},c=c("abort");try{h.send(b.hasContent&&b.data||null)}catch(i){if(c)throw i}},abort:function(){c&&c()}}}),r.ajaxPrefilter(function(a){a.crossDomain&&(a.contents.script=!1)}),r.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/\b(?:java|ecma)script\b/},converters:{"text script":function(a){return r.globalEval(a),a}}}),r.ajaxPrefilter("script",function(a){void 0===a.cache&&(a.cache=!1),a.crossDomain&&(a.type="GET")}),r.ajaxTransport("script",function(a){if(a.crossDomain){var b,c;return{send:function(e,f){b=r("<script>").prop({charset:a.scriptCharset,src:a.url}).on("load error",c=function(a){b.remove(),c=null,a&&f("error"===a.type?404:200,a.type)}),d.head.appendChild(b[0])},abort:function(){c&&c()}}}});var Qb=[],Rb=/(=)\?(?=&|$)|\?\?/;r.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var a=Qb.pop()||r.expando+"_"+rb++;return this[a]=!0,a}}),r.ajaxPrefilter("json jsonp",function(b,c,d){var e,f,g,h=b.jsonp!==!1&&(Rb.test(b.url)?"url":"string"==typeof b.data&&0===(b.contentType||"").indexOf("application/x-www-form-urlencoded")&&Rb.test(b.data)&&"data");if(h||"jsonp"===b.dataTypes[0])return e=b.jsonpCallback=r.isFunction(b.jsonpCallback)?b.jsonpCallback():b.jsonpCallback,h?b[h]=b[h].replace(Rb,"$1"+e):b.jsonp!==!1&&(b.url+=(sb.test(b.url)?"&":"?")+b.jsonp+"="+e),b.converters["script json"]=function(){return g||r.error(e+" was not called"),g[0]},b.dataTypes[0]="json",f=a[e],a[e]=function(){g=arguments},d.always(function(){void 0===f?r(a).removeProp(e):a[e]=f,b[e]&&(b.jsonpCallback=c.jsonpCallback,Qb.push(e)),g&&r.isFunction(f)&&f(g[0]),g=f=void 0}),"script"}),o.createHTMLDocument=function(){var a=d.implementation.createHTMLDocument("").body;return a.innerHTML="<form></form><form></form>",2===a.childNodes.length}(),r.parseHTML=function(a,b,c){if("string"!=typeof a)return[];"boolean"==typeof b&&(c=b,b=!1);var e,f,g;return b||(o.createHTMLDocument?(b=d.implementation.createHTMLDocument(""),e=b.createElement("base"),e.href=d.location.href,b.head.appendChild(e)):b=d),f=B.exec(a),g=!c&&[],f?[b.createElement(f[1])]:(f=pa([a],b,g),g&&g.length&&r(g).remove(),r.merge([],f.childNodes))},r.fn.load=function(a,b,c){var d,e,f,g=this,h=a.indexOf(" ");return h>-1&&(d=mb(a.slice(h)),a=a.slice(0,h)),r.isFunction(b)?(c=b,b=void 0):b&&"object"==typeof b&&(e="POST"),g.length>0&&r.ajax({url:a,type:e||"GET",dataType:"html",data:b}).done(function(a){f=arguments,g.html(d?r("<div>").append(r.parseHTML(a)).find(d):a)}).always(c&&function(a,b){g.each(function(){c.apply(this,f||[a.responseText,b,a])})}),this},r.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(a,b){r.fn[b]=function(a){return this.on(b,a)}}),r.expr.pseudos.animated=function(a){return r.grep(r.timers,function(b){return a===b.elem}).length};function Sb(a){return r.isWindow(a)?a:9===a.nodeType&&a.defaultView}r.offset={setOffset:function(a,b,c){var d,e,f,g,h,i,j,k=r.css(a,"position"),l=r(a),m={};"static"===k&&(a.style.position="relative"),h=l.offset(),f=r.css(a,"top"),i=r.css(a,"left"),j=("absolute"===k||"fixed"===k)&&(f+i).indexOf("auto")>-1,j?(d=l.position(),g=d.top,e=d.left):(g=parseFloat(f)||0,e=parseFloat(i)||0),r.isFunction(b)&&(b=b.call(a,c,r.extend({},h))),null!=b.top&&(m.top=b.top-h.top+g),null!=b.left&&(m.left=b.left-h.left+e),"using"in b?b.using.call(a,m):l.css(m)}},r.fn.extend({offset:function(a){if(arguments.length)return void 0===a?this:this.each(function(b){r.offset.setOffset(this,a,b)});var b,c,d,e,f=this[0];if(f)return f.getClientRects().length?(d=f.getBoundingClientRect(),d.width||d.height?(e=f.ownerDocument,c=Sb(e),b=e.documentElement,{top:d.top+c.pageYOffset-b.clientTop,left:d.left+c.pageXOffset-b.clientLeft}):d):{top:0,left:0}},position:function(){if(this[0]){var a,b,c=this[0],d={top:0,left:0};return"fixed"===r.css(c,"position")?b=c.getBoundingClientRect():(a=this.offsetParent(),b=this.offset(),r.nodeName(a[0],"html")||(d=a.offset()),d={top:d.top+r.css(a[0],"borderTopWidth",!0),left:d.left+r.css(a[0],"borderLeftWidth",!0)}),{top:b.top-d.top-r.css(c,"marginTop",!0),left:b.left-d.left-r.css(c,"marginLeft",!0)}}},offsetParent:function(){return this.map(function(){var a=this.offsetParent;while(a&&"static"===r.css(a,"position"))a=a.offsetParent;return a||qa})}}),r.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(a,b){var c="pageYOffset"===b;r.fn[a]=function(d){return S(this,function(a,d,e){var f=Sb(a);return void 0===e?f?f[b]:a[d]:void(f?f.scrollTo(c?f.pageXOffset:e,c?e:f.pageYOffset):a[d]=e)},a,d,arguments.length)}}),r.each(["top","left"],function(a,b){r.cssHooks[b]=Oa(o.pixelPosition,function(a,c){if(c)return c=Na(a,b),La.test(c)?r(a).position()[b]+"px":c})}),r.each({Height:"height",Width:"width"},function(a,b){r.each({padding:"inner"+a,content:b,"":"outer"+a},function(c,d){r.fn[d]=function(e,f){var g=arguments.length&&(c||"boolean"!=typeof e),h=c||(e===!0||f===!0?"margin":"border");return S(this,function(b,c,e){var f;return r.isWindow(b)?0===d.indexOf("outer")?b["inner"+a]:b.document.documentElement["client"+a]:9===b.nodeType?(f=b.documentElement,Math.max(b.body["scroll"+a],f["scroll"+a],b.body["offset"+a],f["offset"+a],f["client"+a])):void 0===e?r.css(b,c,h):r.style(b,c,e,h)},b,g?e:void 0,g)}})}),r.fn.extend({bind:function(a,b,c){return this.on(a,null,b,c)},unbind:function(a,b){return this.off(a,null,b)},delegate:function(a,b,c,d){return this.on(b,a,c,d)},undelegate:function(a,b,c){return 1===arguments.length?this.off(a,"**"):this.off(b,a||"**",c)}}),r.parseJSON=JSON.parse,"function"==typeof define&&define.amd&&define("jquery",[],function(){return r});var Tb=a.jQuery,Ub=a.$;return r.noConflict=function(b){return a.$===r&&(a.$=Ub),b&&a.jQuery===r&&(a.jQuery=Tb),r},b||(a.jQuery=a.$=r),r});

/*! jQuery UI - v1.12.1 - 2016-12-12
* http://jqueryui.com
* Includes: widget.js, position.js, data.js, disable-selection.js, focusable.js, form-reset-mixin.js, keycode.js, labels.js, scroll-parent.js, tabbable.js, unique-id.js, widgets/draggable.js, widgets/resizable.js, widgets/button.js, widgets/checkboxradio.js, widgets/controlgroup.js, widgets/dialog.js, widgets/mouse.js, widgets/tooltip.js
* Copyright jQuery Foundation and other contributors; Licensed MIT */
(function(t){"function"==typeof define&&define.amd?define(["jquery"],t):t(jQuery)})(function(t){function e(t){for(var e=t.css("visibility");"inherit"===e;)t=t.parent(),e=t.css("visibility");return"hidden"!==e}t.ui=t.ui||{},t.ui.version="1.12.1";var i=0,s=Array.prototype.slice;t.cleanData=function(e){return function(i){var s,n,o;for(o=0;null!=(n=i[o]);o++)try{s=t._data(n,"events"),s&&s.remove&&t(n).triggerHandler("remove")}catch(a){}e(i)}}(t.cleanData),t.widget=function(e,i,s){var n,o,a,r={},l=e.split(".")[0];e=e.split(".")[1];var h=l+"-"+e;return s||(s=i,i=t.Widget),t.isArray(s)&&(s=t.extend.apply(null,[{}].concat(s))),t.expr[":"][h.toLowerCase()]=function(e){return!!t.data(e,h)},t[l]=t[l]||{},n=t[l][e],o=t[l][e]=function(t,e){return this._createWidget?(arguments.length&&this._createWidget(t,e),void 0):new o(t,e)},t.extend(o,n,{version:s.version,_proto:t.extend({},s),_childConstructors:[]}),a=new i,a.options=t.widget.extend({},a.options),t.each(s,function(e,s){return t.isFunction(s)?(r[e]=function(){function t(){return i.prototype[e].apply(this,arguments)}function n(t){return i.prototype[e].apply(this,t)}return function(){var e,i=this._super,o=this._superApply;return this._super=t,this._superApply=n,e=s.apply(this,arguments),this._super=i,this._superApply=o,e}}(),void 0):(r[e]=s,void 0)}),o.prototype=t.widget.extend(a,{widgetEventPrefix:n?a.widgetEventPrefix||e:e},r,{constructor:o,namespace:l,widgetName:e,widgetFullName:h}),n?(t.each(n._childConstructors,function(e,i){var s=i.prototype;t.widget(s.namespace+"."+s.widgetName,o,i._proto)}),delete n._childConstructors):i._childConstructors.push(o),t.widget.bridge(e,o),o},t.widget.extend=function(e){for(var i,n,o=s.call(arguments,1),a=0,r=o.length;r>a;a++)for(i in o[a])n=o[a][i],o[a].hasOwnProperty(i)&&void 0!==n&&(e[i]=t.isPlainObject(n)?t.isPlainObject(e[i])?t.widget.extend({},e[i],n):t.widget.extend({},n):n);return e},t.widget.bridge=function(e,i){var n=i.prototype.widgetFullName||e;t.fn[e]=function(o){var a="string"==typeof o,r=s.call(arguments,1),l=this;return a?this.length||"instance"!==o?this.each(function(){var i,s=t.data(this,n);return"instance"===o?(l=s,!1):s?t.isFunction(s[o])&&"_"!==o.charAt(0)?(i=s[o].apply(s,r),i!==s&&void 0!==i?(l=i&&i.jquery?l.pushStack(i.get()):i,!1):void 0):t.error("no such method '"+o+"' for "+e+" widget instance"):t.error("cannot call methods on "+e+" prior to initialization; "+"attempted to call method '"+o+"'")}):l=void 0:(r.length&&(o=t.widget.extend.apply(null,[o].concat(r))),this.each(function(){var e=t.data(this,n);e?(e.option(o||{}),e._init&&e._init()):t.data(this,n,new i(o,this))})),l}},t.Widget=function(){},t.Widget._childConstructors=[],t.Widget.prototype={widgetName:"widget",widgetEventPrefix:"",defaultElement:"<div>",options:{classes:{},disabled:!1,create:null},_createWidget:function(e,s){s=t(s||this.defaultElement||this)[0],this.element=t(s),this.uuid=i++,this.eventNamespace="."+this.widgetName+this.uuid,this.bindings=t(),this.hoverable=t(),this.focusable=t(),this.classesElementLookup={},s!==this&&(t.data(s,this.widgetFullName,this),this._on(!0,this.element,{remove:function(t){t.target===s&&this.destroy()}}),this.document=t(s.style?s.ownerDocument:s.document||s),this.window=t(this.document[0].defaultView||this.document[0].parentWindow)),this.options=t.widget.extend({},this.options,this._getCreateOptions(),e),this._create(),this.options.disabled&&this._setOptionDisabled(this.options.disabled),this._trigger("create",null,this._getCreateEventData()),this._init()},_getCreateOptions:function(){return{}},_getCreateEventData:t.noop,_create:t.noop,_init:t.noop,destroy:function(){var e=this;this._destroy(),t.each(this.classesElementLookup,function(t,i){e._removeClass(i,t)}),this.element.off(this.eventNamespace).removeData(this.widgetFullName),this.widget().off(this.eventNamespace).removeAttr("aria-disabled"),this.bindings.off(this.eventNamespace)},_destroy:t.noop,widget:function(){return this.element},option:function(e,i){var s,n,o,a=e;if(0===arguments.length)return t.widget.extend({},this.options);if("string"==typeof e)if(a={},s=e.split("."),e=s.shift(),s.length){for(n=a[e]=t.widget.extend({},this.options[e]),o=0;s.length-1>o;o++)n[s[o]]=n[s[o]]||{},n=n[s[o]];if(e=s.pop(),1===arguments.length)return void 0===n[e]?null:n[e];n[e]=i}else{if(1===arguments.length)return void 0===this.options[e]?null:this.options[e];a[e]=i}return this._setOptions(a),this},_setOptions:function(t){var e;for(e in t)this._setOption(e,t[e]);return this},_setOption:function(t,e){return"classes"===t&&this._setOptionClasses(e),this.options[t]=e,"disabled"===t&&this._setOptionDisabled(e),this},_setOptionClasses:function(e){var i,s,n;for(i in e)n=this.classesElementLookup[i],e[i]!==this.options.classes[i]&&n&&n.length&&(s=t(n.get()),this._removeClass(n,i),s.addClass(this._classes({element:s,keys:i,classes:e,add:!0})))},_setOptionDisabled:function(t){this._toggleClass(this.widget(),this.widgetFullName+"-disabled",null,!!t),t&&(this._removeClass(this.hoverable,null,"ui-state-hover"),this._removeClass(this.focusable,null,"ui-state-focus"))},enable:function(){return this._setOptions({disabled:!1})},disable:function(){return this._setOptions({disabled:!0})},_classes:function(e){function i(i,o){var a,r;for(r=0;i.length>r;r++)a=n.classesElementLookup[i[r]]||t(),a=e.add?t(t.unique(a.get().concat(e.element.get()))):t(a.not(e.element).get()),n.classesElementLookup[i[r]]=a,s.push(i[r]),o&&e.classes[i[r]]&&s.push(e.classes[i[r]])}var s=[],n=this;return e=t.extend({element:this.element,classes:this.options.classes||{}},e),this._on(e.element,{remove:"_untrackClassesElement"}),e.keys&&i(e.keys.match(/\S+/g)||[],!0),e.extra&&i(e.extra.match(/\S+/g)||[]),s.join(" ")},_untrackClassesElement:function(e){var i=this;t.each(i.classesElementLookup,function(s,n){-1!==t.inArray(e.target,n)&&(i.classesElementLookup[s]=t(n.not(e.target).get()))})},_removeClass:function(t,e,i){return this._toggleClass(t,e,i,!1)},_addClass:function(t,e,i){return this._toggleClass(t,e,i,!0)},_toggleClass:function(t,e,i,s){s="boolean"==typeof s?s:i;var n="string"==typeof t||null===t,o={extra:n?e:i,keys:n?t:e,element:n?this.element:t,add:s};return o.element.toggleClass(this._classes(o),s),this},_on:function(e,i,s){var n,o=this;"boolean"!=typeof e&&(s=i,i=e,e=!1),s?(i=n=t(i),this.bindings=this.bindings.add(i)):(s=i,i=this.element,n=this.widget()),t.each(s,function(s,a){function r(){return e||o.options.disabled!==!0&&!t(this).hasClass("ui-state-disabled")?("string"==typeof a?o[a]:a).apply(o,arguments):void 0}"string"!=typeof a&&(r.guid=a.guid=a.guid||r.guid||t.guid++);var l=s.match(/^([\w:-]*)\s*(.*)$/),h=l[1]+o.eventNamespace,c=l[2];c?n.on(h,c,r):i.on(h,r)})},_off:function(e,i){i=(i||"").split(" ").join(this.eventNamespace+" ")+this.eventNamespace,e.off(i).off(i),this.bindings=t(this.bindings.not(e).get()),this.focusable=t(this.focusable.not(e).get()),this.hoverable=t(this.hoverable.not(e).get())},_delay:function(t,e){function i(){return("string"==typeof t?s[t]:t).apply(s,arguments)}var s=this;return setTimeout(i,e||0)},_hoverable:function(e){this.hoverable=this.hoverable.add(e),this._on(e,{mouseenter:function(e){this._addClass(t(e.currentTarget),null,"ui-state-hover")},mouseleave:function(e){this._removeClass(t(e.currentTarget),null,"ui-state-hover")}})},_focusable:function(e){this.focusable=this.focusable.add(e),this._on(e,{focusin:function(e){this._addClass(t(e.currentTarget),null,"ui-state-focus")},focusout:function(e){this._removeClass(t(e.currentTarget),null,"ui-state-focus")}})},_trigger:function(e,i,s){var n,o,a=this.options[e];if(s=s||{},i=t.Event(i),i.type=(e===this.widgetEventPrefix?e:this.widgetEventPrefix+e).toLowerCase(),i.target=this.element[0],o=i.originalEvent)for(n in o)n in i||(i[n]=o[n]);return this.element.trigger(i,s),!(t.isFunction(a)&&a.apply(this.element[0],[i].concat(s))===!1||i.isDefaultPrevented())}},t.each({show:"fadeIn",hide:"fadeOut"},function(e,i){t.Widget.prototype["_"+e]=function(s,n,o){"string"==typeof n&&(n={effect:n});var a,r=n?n===!0||"number"==typeof n?i:n.effect||i:e;n=n||{},"number"==typeof n&&(n={duration:n}),a=!t.isEmptyObject(n),n.complete=o,n.delay&&s.delay(n.delay),a&&t.effects&&t.effects.effect[r]?s[e](n):r!==e&&s[r]?s[r](n.duration,n.easing,o):s.queue(function(i){t(this)[e](),o&&o.call(s[0]),i()})}}),t.widget,function(){function e(t,e,i){return[parseFloat(t[0])*(u.test(t[0])?e/100:1),parseFloat(t[1])*(u.test(t[1])?i/100:1)]}function i(e,i){return parseInt(t.css(e,i),10)||0}function s(e){var i=e[0];return 9===i.nodeType?{width:e.width(),height:e.height(),offset:{top:0,left:0}}:t.isWindow(i)?{width:e.width(),height:e.height(),offset:{top:e.scrollTop(),left:e.scrollLeft()}}:i.preventDefault?{width:0,height:0,offset:{top:i.pageY,left:i.pageX}}:{width:e.outerWidth(),height:e.outerHeight(),offset:e.offset()}}var n,o=Math.max,a=Math.abs,r=/left|center|right/,l=/top|center|bottom/,h=/[\+\-]\d+(\.[\d]+)?%?/,c=/^\w+/,u=/%$/,d=t.fn.position;t.position={scrollbarWidth:function(){if(void 0!==n)return n;var e,i,s=t("<div style='display:block;position:absolute;width:50px;height:50px;overflow:hidden;'><div style='height:100px;width:auto;'></div></div>"),o=s.children()[0];return t("body").append(s),e=o.offsetWidth,s.css("overflow","scroll"),i=o.offsetWidth,e===i&&(i=s[0].clientWidth),s.remove(),n=e-i},getScrollInfo:function(e){var i=e.isWindow||e.isDocument?"":e.element.css("overflow-x"),s=e.isWindow||e.isDocument?"":e.element.css("overflow-y"),n="scroll"===i||"auto"===i&&e.width<e.element[0].scrollWidth,o="scroll"===s||"auto"===s&&e.height<e.element[0].scrollHeight;return{width:o?t.position.scrollbarWidth():0,height:n?t.position.scrollbarWidth():0}},getWithinInfo:function(e){var i=t(e||window),s=t.isWindow(i[0]),n=!!i[0]&&9===i[0].nodeType,o=!s&&!n;return{element:i,isWindow:s,isDocument:n,offset:o?t(e).offset():{left:0,top:0},scrollLeft:i.scrollLeft(),scrollTop:i.scrollTop(),width:i.outerWidth(),height:i.outerHeight()}}},t.fn.position=function(n){if(!n||!n.of)return d.apply(this,arguments);n=t.extend({},n);var u,p,f,g,m,_,v=t(n.of),b=t.position.getWithinInfo(n.within),y=t.position.getScrollInfo(b),w=(n.collision||"flip").split(" "),k={};return _=s(v),v[0].preventDefault&&(n.at="left top"),p=_.width,f=_.height,g=_.offset,m=t.extend({},g),t.each(["my","at"],function(){var t,e,i=(n[this]||"").split(" ");1===i.length&&(i=r.test(i[0])?i.concat(["center"]):l.test(i[0])?["center"].concat(i):["center","center"]),i[0]=r.test(i[0])?i[0]:"center",i[1]=l.test(i[1])?i[1]:"center",t=h.exec(i[0]),e=h.exec(i[1]),k[this]=[t?t[0]:0,e?e[0]:0],n[this]=[c.exec(i[0])[0],c.exec(i[1])[0]]}),1===w.length&&(w[1]=w[0]),"right"===n.at[0]?m.left+=p:"center"===n.at[0]&&(m.left+=p/2),"bottom"===n.at[1]?m.top+=f:"center"===n.at[1]&&(m.top+=f/2),u=e(k.at,p,f),m.left+=u[0],m.top+=u[1],this.each(function(){var s,r,l=t(this),h=l.outerWidth(),c=l.outerHeight(),d=i(this,"marginLeft"),_=i(this,"marginTop"),x=h+d+i(this,"marginRight")+y.width,C=c+_+i(this,"marginBottom")+y.height,D=t.extend({},m),T=e(k.my,l.outerWidth(),l.outerHeight());"right"===n.my[0]?D.left-=h:"center"===n.my[0]&&(D.left-=h/2),"bottom"===n.my[1]?D.top-=c:"center"===n.my[1]&&(D.top-=c/2),D.left+=T[0],D.top+=T[1],s={marginLeft:d,marginTop:_},t.each(["left","top"],function(e,i){t.ui.position[w[e]]&&t.ui.position[w[e]][i](D,{targetWidth:p,targetHeight:f,elemWidth:h,elemHeight:c,collisionPosition:s,collisionWidth:x,collisionHeight:C,offset:[u[0]+T[0],u[1]+T[1]],my:n.my,at:n.at,within:b,elem:l})}),n.using&&(r=function(t){var e=g.left-D.left,i=e+p-h,s=g.top-D.top,r=s+f-c,u={target:{element:v,left:g.left,top:g.top,width:p,height:f},element:{element:l,left:D.left,top:D.top,width:h,height:c},horizontal:0>i?"left":e>0?"right":"center",vertical:0>r?"top":s>0?"bottom":"middle"};h>p&&p>a(e+i)&&(u.horizontal="center"),c>f&&f>a(s+r)&&(u.vertical="middle"),u.important=o(a(e),a(i))>o(a(s),a(r))?"horizontal":"vertical",n.using.call(this,t,u)}),l.offset(t.extend(D,{using:r}))})},t.ui.position={fit:{left:function(t,e){var i,s=e.within,n=s.isWindow?s.scrollLeft:s.offset.left,a=s.width,r=t.left-e.collisionPosition.marginLeft,l=n-r,h=r+e.collisionWidth-a-n;e.collisionWidth>a?l>0&&0>=h?(i=t.left+l+e.collisionWidth-a-n,t.left+=l-i):t.left=h>0&&0>=l?n:l>h?n+a-e.collisionWidth:n:l>0?t.left+=l:h>0?t.left-=h:t.left=o(t.left-r,t.left)},top:function(t,e){var i,s=e.within,n=s.isWindow?s.scrollTop:s.offset.top,a=e.within.height,r=t.top-e.collisionPosition.marginTop,l=n-r,h=r+e.collisionHeight-a-n;e.collisionHeight>a?l>0&&0>=h?(i=t.top+l+e.collisionHeight-a-n,t.top+=l-i):t.top=h>0&&0>=l?n:l>h?n+a-e.collisionHeight:n:l>0?t.top+=l:h>0?t.top-=h:t.top=o(t.top-r,t.top)}},flip:{left:function(t,e){var i,s,n=e.within,o=n.offset.left+n.scrollLeft,r=n.width,l=n.isWindow?n.scrollLeft:n.offset.left,h=t.left-e.collisionPosition.marginLeft,c=h-l,u=h+e.collisionWidth-r-l,d="left"===e.my[0]?-e.elemWidth:"right"===e.my[0]?e.elemWidth:0,p="left"===e.at[0]?e.targetWidth:"right"===e.at[0]?-e.targetWidth:0,f=-2*e.offset[0];0>c?(i=t.left+d+p+f+e.collisionWidth-r-o,(0>i||a(c)>i)&&(t.left+=d+p+f)):u>0&&(s=t.left-e.collisionPosition.marginLeft+d+p+f-l,(s>0||u>a(s))&&(t.left+=d+p+f))},top:function(t,e){var i,s,n=e.within,o=n.offset.top+n.scrollTop,r=n.height,l=n.isWindow?n.scrollTop:n.offset.top,h=t.top-e.collisionPosition.marginTop,c=h-l,u=h+e.collisionHeight-r-l,d="top"===e.my[1],p=d?-e.elemHeight:"bottom"===e.my[1]?e.elemHeight:0,f="top"===e.at[1]?e.targetHeight:"bottom"===e.at[1]?-e.targetHeight:0,g=-2*e.offset[1];0>c?(s=t.top+p+f+g+e.collisionHeight-r-o,(0>s||a(c)>s)&&(t.top+=p+f+g)):u>0&&(i=t.top-e.collisionPosition.marginTop+p+f+g-l,(i>0||u>a(i))&&(t.top+=p+f+g))}},flipfit:{left:function(){t.ui.position.flip.left.apply(this,arguments),t.ui.position.fit.left.apply(this,arguments)},top:function(){t.ui.position.flip.top.apply(this,arguments),t.ui.position.fit.top.apply(this,arguments)}}}}(),t.ui.position,t.extend(t.expr[":"],{data:t.expr.createPseudo?t.expr.createPseudo(function(e){return function(i){return!!t.data(i,e)}}):function(e,i,s){return!!t.data(e,s[3])}}),t.fn.extend({disableSelection:function(){var t="onselectstart"in document.createElement("div")?"selectstart":"mousedown";return function(){return this.on(t+".ui-disableSelection",function(t){t.preventDefault()})}}(),enableSelection:function(){return this.off(".ui-disableSelection")}}),t.ui.focusable=function(i,s){var n,o,a,r,l,h=i.nodeName.toLowerCase();return"area"===h?(n=i.parentNode,o=n.name,i.href&&o&&"map"===n.nodeName.toLowerCase()?(a=t("img[usemap='#"+o+"']"),a.length>0&&a.is(":visible")):!1):(/^(input|select|textarea|button|object)$/.test(h)?(r=!i.disabled,r&&(l=t(i).closest("fieldset")[0],l&&(r=!l.disabled))):r="a"===h?i.href||s:s,r&&t(i).is(":visible")&&e(t(i)))},t.extend(t.expr[":"],{focusable:function(e){return t.ui.focusable(e,null!=t.attr(e,"tabindex"))}}),t.ui.focusable,t.fn.form=function(){return"string"==typeof this[0].form?this.closest("form"):t(this[0].form)},t.ui.formResetMixin={_formResetHandler:function(){var e=t(this);setTimeout(function(){var i=e.data("ui-form-reset-instances");t.each(i,function(){this.refresh()})})},_bindFormResetHandler:function(){if(this.form=this.element.form(),this.form.length){var t=this.form.data("ui-form-reset-instances")||[];t.length||this.form.on("reset.ui-form-reset",this._formResetHandler),t.push(this),this.form.data("ui-form-reset-instances",t)}},_unbindFormResetHandler:function(){if(this.form.length){var e=this.form.data("ui-form-reset-instances");e.splice(t.inArray(this,e),1),e.length?this.form.data("ui-form-reset-instances",e):this.form.removeData("ui-form-reset-instances").off("reset.ui-form-reset")}}},t.ui.keyCode={BACKSPACE:8,COMMA:188,DELETE:46,DOWN:40,END:35,ENTER:13,ESCAPE:27,HOME:36,LEFT:37,PAGE_DOWN:34,PAGE_UP:33,PERIOD:190,RIGHT:39,SPACE:32,TAB:9,UP:38},t.ui.escapeSelector=function(){var t=/([!"#$%&'()*+,./:;<=>?@[\]^`{|}~])/g;return function(e){return e.replace(t,"\\$1")}}(),t.fn.labels=function(){var e,i,s,n,o;return this[0].labels&&this[0].labels.length?this.pushStack(this[0].labels):(n=this.eq(0).parents("label"),s=this.attr("id"),s&&(e=this.eq(0).parents().last(),o=e.add(e.length?e.siblings():this.siblings()),i="label[for='"+t.ui.escapeSelector(s)+"']",n=n.add(o.find(i).addBack(i))),this.pushStack(n))},t.fn.scrollParent=function(e){var i=this.css("position"),s="absolute"===i,n=e?/(auto|scroll|hidden)/:/(auto|scroll)/,o=this.parents().filter(function(){var e=t(this);return s&&"static"===e.css("position")?!1:n.test(e.css("overflow")+e.css("overflow-y")+e.css("overflow-x"))}).eq(0);return"fixed"!==i&&o.length?o:t(this[0].ownerDocument||document)},t.extend(t.expr[":"],{tabbable:function(e){var i=t.attr(e,"tabindex"),s=null!=i;return(!s||i>=0)&&t.ui.focusable(e,s)}}),t.fn.extend({uniqueId:function(){var t=0;return function(){return this.each(function(){this.id||(this.id="ui-id-"+ ++t)})}}(),removeUniqueId:function(){return this.each(function(){/^ui-id-\d+$/.test(this.id)&&t(this).removeAttr("id")})}}),t.ui.ie=!!/msie [\w.]+/.exec(navigator.userAgent.toLowerCase());var n=!1;t(document).on("mouseup",function(){n=!1}),t.widget("ui.mouse",{version:"1.12.1",options:{cancel:"input, textarea, button, select, option",distance:1,delay:0},_mouseInit:function(){var e=this;this.element.on("mousedown."+this.widgetName,function(t){return e._mouseDown(t)}).on("click."+this.widgetName,function(i){return!0===t.data(i.target,e.widgetName+".preventClickEvent")?(t.removeData(i.target,e.widgetName+".preventClickEvent"),i.stopImmediatePropagation(),!1):void 0}),this.started=!1},_mouseDestroy:function(){this.element.off("."+this.widgetName),this._mouseMoveDelegate&&this.document.off("mousemove."+this.widgetName,this._mouseMoveDelegate).off("mouseup."+this.widgetName,this._mouseUpDelegate)},_mouseDown:function(e){if(!n){this._mouseMoved=!1,this._mouseStarted&&this._mouseUp(e),this._mouseDownEvent=e;var i=this,s=1===e.which,o="string"==typeof this.options.cancel&&e.target.nodeName?t(e.target).closest(this.options.cancel).length:!1;return s&&!o&&this._mouseCapture(e)?(this.mouseDelayMet=!this.options.delay,this.mouseDelayMet||(this._mouseDelayTimer=setTimeout(function(){i.mouseDelayMet=!0},this.options.delay)),this._mouseDistanceMet(e)&&this._mouseDelayMet(e)&&(this._mouseStarted=this._mouseStart(e)!==!1,!this._mouseStarted)?(e.preventDefault(),!0):(!0===t.data(e.target,this.widgetName+".preventClickEvent")&&t.removeData(e.target,this.widgetName+".preventClickEvent"),this._mouseMoveDelegate=function(t){return i._mouseMove(t)},this._mouseUpDelegate=function(t){return i._mouseUp(t)},this.document.on("mousemove."+this.widgetName,this._mouseMoveDelegate).on("mouseup."+this.widgetName,this._mouseUpDelegate),e.preventDefault(),n=!0,!0)):!0}},_mouseMove:function(e){if(this._mouseMoved){if(t.ui.ie&&(!document.documentMode||9>document.documentMode)&&!e.button)return this._mouseUp(e);if(!e.which)if(e.originalEvent.altKey||e.originalEvent.ctrlKey||e.originalEvent.metaKey||e.originalEvent.shiftKey)this.ignoreMissingWhich=!0;else if(!this.ignoreMissingWhich)return this._mouseUp(e)}return(e.which||e.button)&&(this._mouseMoved=!0),this._mouseStarted?(this._mouseDrag(e),e.preventDefault()):(this._mouseDistanceMet(e)&&this._mouseDelayMet(e)&&(this._mouseStarted=this._mouseStart(this._mouseDownEvent,e)!==!1,this._mouseStarted?this._mouseDrag(e):this._mouseUp(e)),!this._mouseStarted)},_mouseUp:function(e){this.document.off("mousemove."+this.widgetName,this._mouseMoveDelegate).off("mouseup."+this.widgetName,this._mouseUpDelegate),this._mouseStarted&&(this._mouseStarted=!1,e.target===this._mouseDownEvent.target&&t.data(e.target,this.widgetName+".preventClickEvent",!0),this._mouseStop(e)),this._mouseDelayTimer&&(clearTimeout(this._mouseDelayTimer),delete this._mouseDelayTimer),this.ignoreMissingWhich=!1,n=!1,e.preventDefault()},_mouseDistanceMet:function(t){return Math.max(Math.abs(this._mouseDownEvent.pageX-t.pageX),Math.abs(this._mouseDownEvent.pageY-t.pageY))>=this.options.distance},_mouseDelayMet:function(){return this.mouseDelayMet},_mouseStart:function(){},_mouseDrag:function(){},_mouseStop:function(){},_mouseCapture:function(){return!0}}),t.ui.plugin={add:function(e,i,s){var n,o=t.ui[e].prototype;for(n in s)o.plugins[n]=o.plugins[n]||[],o.plugins[n].push([i,s[n]])},call:function(t,e,i,s){var n,o=t.plugins[e];if(o&&(s||t.element[0].parentNode&&11!==t.element[0].parentNode.nodeType))for(n=0;o.length>n;n++)t.options[o[n][0]]&&o[n][1].apply(t.element,i)}},t.ui.safeActiveElement=function(t){var e;try{e=t.activeElement}catch(i){e=t.body}return e||(e=t.body),e.nodeName||(e=t.body),e},t.ui.safeBlur=function(e){e&&"body"!==e.nodeName.toLowerCase()&&t(e).trigger("blur")},t.widget("ui.draggable",t.ui.mouse,{version:"1.12.1",widgetEventPrefix:"drag",options:{addClasses:!0,appendTo:"parent",axis:!1,connectToSortable:!1,containment:!1,cursor:"auto",cursorAt:!1,grid:!1,handle:!1,helper:"original",iframeFix:!1,opacity:!1,refreshPositions:!1,revert:!1,revertDuration:500,scope:"default",scroll:!0,scrollSensitivity:20,scrollSpeed:20,snap:!1,snapMode:"both",snapTolerance:20,stack:!1,zIndex:!1,drag:null,start:null,stop:null},_create:function(){"original"===this.options.helper&&this._setPositionRelative(),this.options.addClasses&&this._addClass("ui-draggable"),this._setHandleClassName(),this._mouseInit()},_setOption:function(t,e){this._super(t,e),"handle"===t&&(this._removeHandleClassName(),this._setHandleClassName())},_destroy:function(){return(this.helper||this.element).is(".ui-draggable-dragging")?(this.destroyOnClear=!0,void 0):(this._removeHandleClassName(),this._mouseDestroy(),void 0)},_mouseCapture:function(e){var i=this.options;return this.helper||i.disabled||t(e.target).closest(".ui-resizable-handle").length>0?!1:(this.handle=this._getHandle(e),this.handle?(this._blurActiveElement(e),this._blockFrames(i.iframeFix===!0?"iframe":i.iframeFix),!0):!1)},_blockFrames:function(e){this.iframeBlocks=this.document.find(e).map(function(){var e=t(this);return t("<div>").css("position","absolute").appendTo(e.parent()).outerWidth(e.outerWidth()).outerHeight(e.outerHeight()).offset(e.offset())[0]})},_unblockFrames:function(){this.iframeBlocks&&(this.iframeBlocks.remove(),delete this.iframeBlocks)},_blurActiveElement:function(e){var i=t.ui.safeActiveElement(this.document[0]),s=t(e.target);s.closest(i).length||t.ui.safeBlur(i)},_mouseStart:function(e){var i=this.options;return this.helper=this._createHelper(e),this._addClass(this.helper,"ui-draggable-dragging"),this._cacheHelperProportions(),t.ui.ddmanager&&(t.ui.ddmanager.current=this),this._cacheMargins(),this.cssPosition=this.helper.css("position"),this.scrollParent=this.helper.scrollParent(!0),this.offsetParent=this.helper.offsetParent(),this.hasFixedAncestor=this.helper.parents().filter(function(){return"fixed"===t(this).css("position")}).length>0,this.positionAbs=this.element.offset(),this._refreshOffsets(e),this.originalPosition=this.position=this._generatePosition(e,!1),this.originalPageX=e.pageX,this.originalPageY=e.pageY,i.cursorAt&&this._adjustOffsetFromHelper(i.cursorAt),this._setContainment(),this._trigger("start",e)===!1?(this._clear(),!1):(this._cacheHelperProportions(),t.ui.ddmanager&&!i.dropBehaviour&&t.ui.ddmanager.prepareOffsets(this,e),this._mouseDrag(e,!0),t.ui.ddmanager&&t.ui.ddmanager.dragStart(this,e),!0)},_refreshOffsets:function(t){this.offset={top:this.positionAbs.top-this.margins.top,left:this.positionAbs.left-this.margins.left,scroll:!1,parent:this._getParentOffset(),relative:this._getRelativeOffset()},this.offset.click={left:t.pageX-this.offset.left,top:t.pageY-this.offset.top}},_mouseDrag:function(e,i){if(this.hasFixedAncestor&&(this.offset.parent=this._getParentOffset()),this.position=this._generatePosition(e,!0),this.positionAbs=this._convertPositionTo("absolute"),!i){var s=this._uiHash();if(this._trigger("drag",e,s)===!1)return this._mouseUp(new t.Event("mouseup",e)),!1;this.position=s.position}return this.helper[0].style.left=this.position.left+"px",this.helper[0].style.top=this.position.top+"px",t.ui.ddmanager&&t.ui.ddmanager.drag(this,e),!1},_mouseStop:function(e){var i=this,s=!1;return t.ui.ddmanager&&!this.options.dropBehaviour&&(s=t.ui.ddmanager.drop(this,e)),this.dropped&&(s=this.dropped,this.dropped=!1),"invalid"===this.options.revert&&!s||"valid"===this.options.revert&&s||this.options.revert===!0||t.isFunction(this.options.revert)&&this.options.revert.call(this.element,s)?t(this.helper).animate(this.originalPosition,parseInt(this.options.revertDuration,10),function(){i._trigger("stop",e)!==!1&&i._clear()}):this._trigger("stop",e)!==!1&&this._clear(),!1},_mouseUp:function(e){return this._unblockFrames(),t.ui.ddmanager&&t.ui.ddmanager.dragStop(this,e),this.handleElement.is(e.target)&&this.element.trigger("focus"),t.ui.mouse.prototype._mouseUp.call(this,e)},cancel:function(){return this.helper.is(".ui-draggable-dragging")?this._mouseUp(new t.Event("mouseup",{target:this.element[0]})):this._clear(),this},_getHandle:function(e){return this.options.handle?!!t(e.target).closest(this.element.find(this.options.handle)).length:!0},_setHandleClassName:function(){this.handleElement=this.options.handle?this.element.find(this.options.handle):this.element,this._addClass(this.handleElement,"ui-draggable-handle")},_removeHandleClassName:function(){this._removeClass(this.handleElement,"ui-draggable-handle")},_createHelper:function(e){var i=this.options,s=t.isFunction(i.helper),n=s?t(i.helper.apply(this.element[0],[e])):"clone"===i.helper?this.element.clone().removeAttr("id"):this.element;return n.parents("body").length||n.appendTo("parent"===i.appendTo?this.element[0].parentNode:i.appendTo),s&&n[0]===this.element[0]&&this._setPositionRelative(),n[0]===this.element[0]||/(fixed|absolute)/.test(n.css("position"))||n.css("position","absolute"),n},_setPositionRelative:function(){/^(?:r|a|f)/.test(this.element.css("position"))||(this.element[0].style.position="relative")},_adjustOffsetFromHelper:function(e){"string"==typeof e&&(e=e.split(" ")),t.isArray(e)&&(e={left:+e[0],top:+e[1]||0}),"left"in e&&(this.offset.click.left=e.left+this.margins.left),"right"in e&&(this.offset.click.left=this.helperProportions.width-e.right+this.margins.left),"top"in e&&(this.offset.click.top=e.top+this.margins.top),"bottom"in e&&(this.offset.click.top=this.helperProportions.height-e.bottom+this.margins.top)},_isRootNode:function(t){return/(html|body)/i.test(t.tagName)||t===this.document[0]},_getParentOffset:function(){var e=this.offsetParent.offset(),i=this.document[0];return"absolute"===this.cssPosition&&this.scrollParent[0]!==i&&t.contains(this.scrollParent[0],this.offsetParent[0])&&(e.left+=this.scrollParent.scrollLeft(),e.top+=this.scrollParent.scrollTop()),this._isRootNode(this.offsetParent[0])&&(e={top:0,left:0}),{top:e.top+(parseInt(this.offsetParent.css("borderTopWidth"),10)||0),left:e.left+(parseInt(this.offsetParent.css("borderLeftWidth"),10)||0)}},_getRelativeOffset:function(){if("relative"!==this.cssPosition)return{top:0,left:0};var t=this.element.position(),e=this._isRootNode(this.scrollParent[0]);return{top:t.top-(parseInt(this.helper.css("top"),10)||0)+(e?0:this.scrollParent.scrollTop()),left:t.left-(parseInt(this.helper.css("left"),10)||0)+(e?0:this.scrollParent.scrollLeft())}},_cacheMargins:function(){this.margins={left:parseInt(this.element.css("marginLeft"),10)||0,top:parseInt(this.element.css("marginTop"),10)||0,right:parseInt(this.element.css("marginRight"),10)||0,bottom:parseInt(this.element.css("marginBottom"),10)||0}},_cacheHelperProportions:function(){this.helperProportions={width:this.helper.outerWidth(),height:this.helper.outerHeight()}},_setContainment:function(){var e,i,s,n=this.options,o=this.document[0];return this.relativeContainer=null,n.containment?"window"===n.containment?(this.containment=[t(window).scrollLeft()-this.offset.relative.left-this.offset.parent.left,t(window).scrollTop()-this.offset.relative.top-this.offset.parent.top,t(window).scrollLeft()+t(window).width()-this.helperProportions.width-this.margins.left,t(window).scrollTop()+(t(window).height()||o.body.parentNode.scrollHeight)-this.helperProportions.height-this.margins.top],void 0):"document"===n.containment?(this.containment=[0,0,t(o).width()-this.helperProportions.width-this.margins.left,(t(o).height()||o.body.parentNode.scrollHeight)-this.helperProportions.height-this.margins.top],void 0):n.containment.constructor===Array?(this.containment=n.containment,void 0):("parent"===n.containment&&(n.containment=this.helper[0].parentNode),i=t(n.containment),s=i[0],s&&(e=/(scroll|auto)/.test(i.css("overflow")),this.containment=[(parseInt(i.css("borderLeftWidth"),10)||0)+(parseInt(i.css("paddingLeft"),10)||0),(parseInt(i.css("borderTopWidth"),10)||0)+(parseInt(i.css("paddingTop"),10)||0),(e?Math.max(s.scrollWidth,s.offsetWidth):s.offsetWidth)-(parseInt(i.css("borderRightWidth"),10)||0)-(parseInt(i.css("paddingRight"),10)||0)-this.helperProportions.width-this.margins.left-this.margins.right,(e?Math.max(s.scrollHeight,s.offsetHeight):s.offsetHeight)-(parseInt(i.css("borderBottomWidth"),10)||0)-(parseInt(i.css("paddingBottom"),10)||0)-this.helperProportions.height-this.margins.top-this.margins.bottom],this.relativeContainer=i),void 0):(this.containment=null,void 0)},_convertPositionTo:function(t,e){e||(e=this.position);var i="absolute"===t?1:-1,s=this._isRootNode(this.scrollParent[0]);return{top:e.top+this.offset.relative.top*i+this.offset.parent.top*i-("fixed"===this.cssPosition?-this.offset.scroll.top:s?0:this.offset.scroll.top)*i,left:e.left+this.offset.relative.left*i+this.offset.parent.left*i-("fixed"===this.cssPosition?-this.offset.scroll.left:s?0:this.offset.scroll.left)*i}},_generatePosition:function(t,e){var i,s,n,o,a=this.options,r=this._isRootNode(this.scrollParent[0]),l=t.pageX,h=t.pageY;return r&&this.offset.scroll||(this.offset.scroll={top:this.scrollParent.scrollTop(),left:this.scrollParent.scrollLeft()}),e&&(this.containment&&(this.relativeContainer?(s=this.relativeContainer.offset(),i=[this.containment[0]+s.left,this.containment[1]+s.top,this.containment[2]+s.left,this.containment[3]+s.top]):i=this.containment,t.pageX-this.offset.click.left<i[0]&&(l=i[0]+this.offset.click.left),t.pageY-this.offset.click.top<i[1]&&(h=i[1]+this.offset.click.top),t.pageX-this.offset.click.left>i[2]&&(l=i[2]+this.offset.click.left),t.pageY-this.offset.click.top>i[3]&&(h=i[3]+this.offset.click.top)),a.grid&&(n=a.grid[1]?this.originalPageY+Math.round((h-this.originalPageY)/a.grid[1])*a.grid[1]:this.originalPageY,h=i?n-this.offset.click.top>=i[1]||n-this.offset.click.top>i[3]?n:n-this.offset.click.top>=i[1]?n-a.grid[1]:n+a.grid[1]:n,o=a.grid[0]?this.originalPageX+Math.round((l-this.originalPageX)/a.grid[0])*a.grid[0]:this.originalPageX,l=i?o-this.offset.click.left>=i[0]||o-this.offset.click.left>i[2]?o:o-this.offset.click.left>=i[0]?o-a.grid[0]:o+a.grid[0]:o),"y"===a.axis&&(l=this.originalPageX),"x"===a.axis&&(h=this.originalPageY)),{top:h-this.offset.click.top-this.offset.relative.top-this.offset.parent.top+("fixed"===this.cssPosition?-this.offset.scroll.top:r?0:this.offset.scroll.top),left:l-this.offset.click.left-this.offset.relative.left-this.offset.parent.left+("fixed"===this.cssPosition?-this.offset.scroll.left:r?0:this.offset.scroll.left)}},_clear:function(){this._removeClass(this.helper,"ui-draggable-dragging"),this.helper[0]===this.element[0]||this.cancelHelperRemoval||this.helper.remove(),this.helper=null,this.cancelHelperRemoval=!1,this.destroyOnClear&&this.destroy()},_trigger:function(e,i,s){return s=s||this._uiHash(),t.ui.plugin.call(this,e,[i,s,this],!0),/^(drag|start|stop)/.test(e)&&(this.positionAbs=this._convertPositionTo("absolute"),s.offset=this.positionAbs),t.Widget.prototype._trigger.call(this,e,i,s)},plugins:{},_uiHash:function(){return{helper:this.helper,position:this.position,originalPosition:this.originalPosition,offset:this.positionAbs}}}),t.ui.plugin.add("draggable","connectToSortable",{start:function(e,i,s){var n=t.extend({},i,{item:s.element});s.sortables=[],t(s.options.connectToSortable).each(function(){var i=t(this).sortable("instance");
i&&!i.options.disabled&&(s.sortables.push(i),i.refreshPositions(),i._trigger("activate",e,n))})},stop:function(e,i,s){var n=t.extend({},i,{item:s.element});s.cancelHelperRemoval=!1,t.each(s.sortables,function(){var t=this;t.isOver?(t.isOver=0,s.cancelHelperRemoval=!0,t.cancelHelperRemoval=!1,t._storedCSS={position:t.placeholder.css("position"),top:t.placeholder.css("top"),left:t.placeholder.css("left")},t._mouseStop(e),t.options.helper=t.options._helper):(t.cancelHelperRemoval=!0,t._trigger("deactivate",e,n))})},drag:function(e,i,s){t.each(s.sortables,function(){var n=!1,o=this;o.positionAbs=s.positionAbs,o.helperProportions=s.helperProportions,o.offset.click=s.offset.click,o._intersectsWith(o.containerCache)&&(n=!0,t.each(s.sortables,function(){return this.positionAbs=s.positionAbs,this.helperProportions=s.helperProportions,this.offset.click=s.offset.click,this!==o&&this._intersectsWith(this.containerCache)&&t.contains(o.element[0],this.element[0])&&(n=!1),n})),n?(o.isOver||(o.isOver=1,s._parent=i.helper.parent(),o.currentItem=i.helper.appendTo(o.element).data("ui-sortable-item",!0),o.options._helper=o.options.helper,o.options.helper=function(){return i.helper[0]},e.target=o.currentItem[0],o._mouseCapture(e,!0),o._mouseStart(e,!0,!0),o.offset.click.top=s.offset.click.top,o.offset.click.left=s.offset.click.left,o.offset.parent.left-=s.offset.parent.left-o.offset.parent.left,o.offset.parent.top-=s.offset.parent.top-o.offset.parent.top,s._trigger("toSortable",e),s.dropped=o.element,t.each(s.sortables,function(){this.refreshPositions()}),s.currentItem=s.element,o.fromOutside=s),o.currentItem&&(o._mouseDrag(e),i.position=o.position)):o.isOver&&(o.isOver=0,o.cancelHelperRemoval=!0,o.options._revert=o.options.revert,o.options.revert=!1,o._trigger("out",e,o._uiHash(o)),o._mouseStop(e,!0),o.options.revert=o.options._revert,o.options.helper=o.options._helper,o.placeholder&&o.placeholder.remove(),i.helper.appendTo(s._parent),s._refreshOffsets(e),i.position=s._generatePosition(e,!0),s._trigger("fromSortable",e),s.dropped=!1,t.each(s.sortables,function(){this.refreshPositions()}))})}}),t.ui.plugin.add("draggable","cursor",{start:function(e,i,s){var n=t("body"),o=s.options;n.css("cursor")&&(o._cursor=n.css("cursor")),n.css("cursor",o.cursor)},stop:function(e,i,s){var n=s.options;n._cursor&&t("body").css("cursor",n._cursor)}}),t.ui.plugin.add("draggable","opacity",{start:function(e,i,s){var n=t(i.helper),o=s.options;n.css("opacity")&&(o._opacity=n.css("opacity")),n.css("opacity",o.opacity)},stop:function(e,i,s){var n=s.options;n._opacity&&t(i.helper).css("opacity",n._opacity)}}),t.ui.plugin.add("draggable","scroll",{start:function(t,e,i){i.scrollParentNotHidden||(i.scrollParentNotHidden=i.helper.scrollParent(!1)),i.scrollParentNotHidden[0]!==i.document[0]&&"HTML"!==i.scrollParentNotHidden[0].tagName&&(i.overflowOffset=i.scrollParentNotHidden.offset())},drag:function(e,i,s){var n=s.options,o=!1,a=s.scrollParentNotHidden[0],r=s.document[0];a!==r&&"HTML"!==a.tagName?(n.axis&&"x"===n.axis||(s.overflowOffset.top+a.offsetHeight-e.pageY<n.scrollSensitivity?a.scrollTop=o=a.scrollTop+n.scrollSpeed:e.pageY-s.overflowOffset.top<n.scrollSensitivity&&(a.scrollTop=o=a.scrollTop-n.scrollSpeed)),n.axis&&"y"===n.axis||(s.overflowOffset.left+a.offsetWidth-e.pageX<n.scrollSensitivity?a.scrollLeft=o=a.scrollLeft+n.scrollSpeed:e.pageX-s.overflowOffset.left<n.scrollSensitivity&&(a.scrollLeft=o=a.scrollLeft-n.scrollSpeed))):(n.axis&&"x"===n.axis||(e.pageY-t(r).scrollTop()<n.scrollSensitivity?o=t(r).scrollTop(t(r).scrollTop()-n.scrollSpeed):t(window).height()-(e.pageY-t(r).scrollTop())<n.scrollSensitivity&&(o=t(r).scrollTop(t(r).scrollTop()+n.scrollSpeed))),n.axis&&"y"===n.axis||(e.pageX-t(r).scrollLeft()<n.scrollSensitivity?o=t(r).scrollLeft(t(r).scrollLeft()-n.scrollSpeed):t(window).width()-(e.pageX-t(r).scrollLeft())<n.scrollSensitivity&&(o=t(r).scrollLeft(t(r).scrollLeft()+n.scrollSpeed)))),o!==!1&&t.ui.ddmanager&&!n.dropBehaviour&&t.ui.ddmanager.prepareOffsets(s,e)}}),t.ui.plugin.add("draggable","snap",{start:function(e,i,s){var n=s.options;s.snapElements=[],t(n.snap.constructor!==String?n.snap.items||":data(ui-draggable)":n.snap).each(function(){var e=t(this),i=e.offset();this!==s.element[0]&&s.snapElements.push({item:this,width:e.outerWidth(),height:e.outerHeight(),top:i.top,left:i.left})})},drag:function(e,i,s){var n,o,a,r,l,h,c,u,d,p,f=s.options,g=f.snapTolerance,m=i.offset.left,_=m+s.helperProportions.width,v=i.offset.top,b=v+s.helperProportions.height;for(d=s.snapElements.length-1;d>=0;d--)l=s.snapElements[d].left-s.margins.left,h=l+s.snapElements[d].width,c=s.snapElements[d].top-s.margins.top,u=c+s.snapElements[d].height,l-g>_||m>h+g||c-g>b||v>u+g||!t.contains(s.snapElements[d].item.ownerDocument,s.snapElements[d].item)?(s.snapElements[d].snapping&&s.options.snap.release&&s.options.snap.release.call(s.element,e,t.extend(s._uiHash(),{snapItem:s.snapElements[d].item})),s.snapElements[d].snapping=!1):("inner"!==f.snapMode&&(n=g>=Math.abs(c-b),o=g>=Math.abs(u-v),a=g>=Math.abs(l-_),r=g>=Math.abs(h-m),n&&(i.position.top=s._convertPositionTo("relative",{top:c-s.helperProportions.height,left:0}).top),o&&(i.position.top=s._convertPositionTo("relative",{top:u,left:0}).top),a&&(i.position.left=s._convertPositionTo("relative",{top:0,left:l-s.helperProportions.width}).left),r&&(i.position.left=s._convertPositionTo("relative",{top:0,left:h}).left)),p=n||o||a||r,"outer"!==f.snapMode&&(n=g>=Math.abs(c-v),o=g>=Math.abs(u-b),a=g>=Math.abs(l-m),r=g>=Math.abs(h-_),n&&(i.position.top=s._convertPositionTo("relative",{top:c,left:0}).top),o&&(i.position.top=s._convertPositionTo("relative",{top:u-s.helperProportions.height,left:0}).top),a&&(i.position.left=s._convertPositionTo("relative",{top:0,left:l}).left),r&&(i.position.left=s._convertPositionTo("relative",{top:0,left:h-s.helperProportions.width}).left)),!s.snapElements[d].snapping&&(n||o||a||r||p)&&s.options.snap.snap&&s.options.snap.snap.call(s.element,e,t.extend(s._uiHash(),{snapItem:s.snapElements[d].item})),s.snapElements[d].snapping=n||o||a||r||p)}}),t.ui.plugin.add("draggable","stack",{start:function(e,i,s){var n,o=s.options,a=t.makeArray(t(o.stack)).sort(function(e,i){return(parseInt(t(e).css("zIndex"),10)||0)-(parseInt(t(i).css("zIndex"),10)||0)});a.length&&(n=parseInt(t(a[0]).css("zIndex"),10)||0,t(a).each(function(e){t(this).css("zIndex",n+e)}),this.css("zIndex",n+a.length))}}),t.ui.plugin.add("draggable","zIndex",{start:function(e,i,s){var n=t(i.helper),o=s.options;n.css("zIndex")&&(o._zIndex=n.css("zIndex")),n.css("zIndex",o.zIndex)},stop:function(e,i,s){var n=s.options;n._zIndex&&t(i.helper).css("zIndex",n._zIndex)}}),t.ui.draggable,t.widget("ui.resizable",t.ui.mouse,{version:"1.12.1",widgetEventPrefix:"resize",options:{alsoResize:!1,animate:!1,animateDuration:"slow",animateEasing:"swing",aspectRatio:!1,autoHide:!1,classes:{"ui-resizable-se":"ui-icon ui-icon-gripsmall-diagonal-se"},containment:!1,ghost:!1,grid:!1,handles:"e,s,se",helper:!1,maxHeight:null,maxWidth:null,minHeight:10,minWidth:10,zIndex:90,resize:null,start:null,stop:null},_num:function(t){return parseFloat(t)||0},_isNumber:function(t){return!isNaN(parseFloat(t))},_hasScroll:function(e,i){if("hidden"===t(e).css("overflow"))return!1;var s=i&&"left"===i?"scrollLeft":"scrollTop",n=!1;return e[s]>0?!0:(e[s]=1,n=e[s]>0,e[s]=0,n)},_create:function(){var e,i=this.options,s=this;this._addClass("ui-resizable"),t.extend(this,{_aspectRatio:!!i.aspectRatio,aspectRatio:i.aspectRatio,originalElement:this.element,_proportionallyResizeElements:[],_helper:i.helper||i.ghost||i.animate?i.helper||"ui-resizable-helper":null}),this.element[0].nodeName.match(/^(canvas|textarea|input|select|button|img)$/i)&&(this.element.wrap(t("<div class='ui-wrapper' style='overflow: hidden;'></div>").css({position:this.element.css("position"),width:this.element.outerWidth(),height:this.element.outerHeight(),top:this.element.css("top"),left:this.element.css("left")})),this.element=this.element.parent().data("ui-resizable",this.element.resizable("instance")),this.elementIsWrapper=!0,e={marginTop:this.originalElement.css("marginTop"),marginRight:this.originalElement.css("marginRight"),marginBottom:this.originalElement.css("marginBottom"),marginLeft:this.originalElement.css("marginLeft")},this.element.css(e),this.originalElement.css("margin",0),this.originalResizeStyle=this.originalElement.css("resize"),this.originalElement.css("resize","none"),this._proportionallyResizeElements.push(this.originalElement.css({position:"static",zoom:1,display:"block"})),this.originalElement.css(e),this._proportionallyResize()),this._setupHandles(),i.autoHide&&t(this.element).on("mouseenter",function(){i.disabled||(s._removeClass("ui-resizable-autohide"),s._handles.show())}).on("mouseleave",function(){i.disabled||s.resizing||(s._addClass("ui-resizable-autohide"),s._handles.hide())}),this._mouseInit()},_destroy:function(){this._mouseDestroy();var e,i=function(e){t(e).removeData("resizable").removeData("ui-resizable").off(".resizable").find(".ui-resizable-handle").remove()};return this.elementIsWrapper&&(i(this.element),e=this.element,this.originalElement.css({position:e.css("position"),width:e.outerWidth(),height:e.outerHeight(),top:e.css("top"),left:e.css("left")}).insertAfter(e),e.remove()),this.originalElement.css("resize",this.originalResizeStyle),i(this.originalElement),this},_setOption:function(t,e){switch(this._super(t,e),t){case"handles":this._removeHandles(),this._setupHandles();break;default:}},_setupHandles:function(){var e,i,s,n,o,a=this.options,r=this;if(this.handles=a.handles||(t(".ui-resizable-handle",this.element).length?{n:".ui-resizable-n",e:".ui-resizable-e",s:".ui-resizable-s",w:".ui-resizable-w",se:".ui-resizable-se",sw:".ui-resizable-sw",ne:".ui-resizable-ne",nw:".ui-resizable-nw"}:"e,s,se"),this._handles=t(),this.handles.constructor===String)for("all"===this.handles&&(this.handles="n,e,s,w,se,sw,ne,nw"),s=this.handles.split(","),this.handles={},i=0;s.length>i;i++)e=t.trim(s[i]),n="ui-resizable-"+e,o=t("<div>"),this._addClass(o,"ui-resizable-handle "+n),o.css({zIndex:a.zIndex}),this.handles[e]=".ui-resizable-"+e,this.element.append(o);this._renderAxis=function(e){var i,s,n,o;e=e||this.element;for(i in this.handles)this.handles[i].constructor===String?this.handles[i]=this.element.children(this.handles[i]).first().show():(this.handles[i].jquery||this.handles[i].nodeType)&&(this.handles[i]=t(this.handles[i]),this._on(this.handles[i],{mousedown:r._mouseDown})),this.elementIsWrapper&&this.originalElement[0].nodeName.match(/^(textarea|input|select|button)$/i)&&(s=t(this.handles[i],this.element),o=/sw|ne|nw|se|n|s/.test(i)?s.outerHeight():s.outerWidth(),n=["padding",/ne|nw|n/.test(i)?"Top":/se|sw|s/.test(i)?"Bottom":/^e$/.test(i)?"Right":"Left"].join(""),e.css(n,o),this._proportionallyResize()),this._handles=this._handles.add(this.handles[i])},this._renderAxis(this.element),this._handles=this._handles.add(this.element.find(".ui-resizable-handle")),this._handles.disableSelection(),this._handles.on("mouseover",function(){r.resizing||(this.className&&(o=this.className.match(/ui-resizable-(se|sw|ne|nw|n|e|s|w)/i)),r.axis=o&&o[1]?o[1]:"se")}),a.autoHide&&(this._handles.hide(),this._addClass("ui-resizable-autohide"))},_removeHandles:function(){this._handles.remove()},_mouseCapture:function(e){var i,s,n=!1;for(i in this.handles)s=t(this.handles[i])[0],(s===e.target||t.contains(s,e.target))&&(n=!0);return!this.options.disabled&&n},_mouseStart:function(e){var i,s,n,o=this.options,a=this.element;return this.resizing=!0,this._renderProxy(),i=this._num(this.helper.css("left")),s=this._num(this.helper.css("top")),o.containment&&(i+=t(o.containment).scrollLeft()||0,s+=t(o.containment).scrollTop()||0),this.offset=this.helper.offset(),this.position={left:i,top:s},this.size=this._helper?{width:this.helper.width(),height:this.helper.height()}:{width:a.width(),height:a.height()},this.originalSize=this._helper?{width:a.outerWidth(),height:a.outerHeight()}:{width:a.width(),height:a.height()},this.sizeDiff={width:a.outerWidth()-a.width(),height:a.outerHeight()-a.height()},this.originalPosition={left:i,top:s},this.originalMousePosition={left:e.pageX,top:e.pageY},this.aspectRatio="number"==typeof o.aspectRatio?o.aspectRatio:this.originalSize.width/this.originalSize.height||1,n=t(".ui-resizable-"+this.axis).css("cursor"),t("body").css("cursor","auto"===n?this.axis+"-resize":n),this._addClass("ui-resizable-resizing"),this._propagate("start",e),!0},_mouseDrag:function(e){var i,s,n=this.originalMousePosition,o=this.axis,a=e.pageX-n.left||0,r=e.pageY-n.top||0,l=this._change[o];return this._updatePrevProperties(),l?(i=l.apply(this,[e,a,r]),this._updateVirtualBoundaries(e.shiftKey),(this._aspectRatio||e.shiftKey)&&(i=this._updateRatio(i,e)),i=this._respectSize(i,e),this._updateCache(i),this._propagate("resize",e),s=this._applyChanges(),!this._helper&&this._proportionallyResizeElements.length&&this._proportionallyResize(),t.isEmptyObject(s)||(this._updatePrevProperties(),this._trigger("resize",e,this.ui()),this._applyChanges()),!1):!1},_mouseStop:function(e){this.resizing=!1;var i,s,n,o,a,r,l,h=this.options,c=this;return this._helper&&(i=this._proportionallyResizeElements,s=i.length&&/textarea/i.test(i[0].nodeName),n=s&&this._hasScroll(i[0],"left")?0:c.sizeDiff.height,o=s?0:c.sizeDiff.width,a={width:c.helper.width()-o,height:c.helper.height()-n},r=parseFloat(c.element.css("left"))+(c.position.left-c.originalPosition.left)||null,l=parseFloat(c.element.css("top"))+(c.position.top-c.originalPosition.top)||null,h.animate||this.element.css(t.extend(a,{top:l,left:r})),c.helper.height(c.size.height),c.helper.width(c.size.width),this._helper&&!h.animate&&this._proportionallyResize()),t("body").css("cursor","auto"),this._removeClass("ui-resizable-resizing"),this._propagate("stop",e),this._helper&&this.helper.remove(),!1},_updatePrevProperties:function(){this.prevPosition={top:this.position.top,left:this.position.left},this.prevSize={width:this.size.width,height:this.size.height}},_applyChanges:function(){var t={};return this.position.top!==this.prevPosition.top&&(t.top=this.position.top+"px"),this.position.left!==this.prevPosition.left&&(t.left=this.position.left+"px"),this.size.width!==this.prevSize.width&&(t.width=this.size.width+"px"),this.size.height!==this.prevSize.height&&(t.height=this.size.height+"px"),this.helper.css(t),t},_updateVirtualBoundaries:function(t){var e,i,s,n,o,a=this.options;o={minWidth:this._isNumber(a.minWidth)?a.minWidth:0,maxWidth:this._isNumber(a.maxWidth)?a.maxWidth:1/0,minHeight:this._isNumber(a.minHeight)?a.minHeight:0,maxHeight:this._isNumber(a.maxHeight)?a.maxHeight:1/0},(this._aspectRatio||t)&&(e=o.minHeight*this.aspectRatio,s=o.minWidth/this.aspectRatio,i=o.maxHeight*this.aspectRatio,n=o.maxWidth/this.aspectRatio,e>o.minWidth&&(o.minWidth=e),s>o.minHeight&&(o.minHeight=s),o.maxWidth>i&&(o.maxWidth=i),o.maxHeight>n&&(o.maxHeight=n)),this._vBoundaries=o},_updateCache:function(t){this.offset=this.helper.offset(),this._isNumber(t.left)&&(this.position.left=t.left),this._isNumber(t.top)&&(this.position.top=t.top),this._isNumber(t.height)&&(this.size.height=t.height),this._isNumber(t.width)&&(this.size.width=t.width)},_updateRatio:function(t){var e=this.position,i=this.size,s=this.axis;return this._isNumber(t.height)?t.width=t.height*this.aspectRatio:this._isNumber(t.width)&&(t.height=t.width/this.aspectRatio),"sw"===s&&(t.left=e.left+(i.width-t.width),t.top=null),"nw"===s&&(t.top=e.top+(i.height-t.height),t.left=e.left+(i.width-t.width)),t},_respectSize:function(t){var e=this._vBoundaries,i=this.axis,s=this._isNumber(t.width)&&e.maxWidth&&e.maxWidth<t.width,n=this._isNumber(t.height)&&e.maxHeight&&e.maxHeight<t.height,o=this._isNumber(t.width)&&e.minWidth&&e.minWidth>t.width,a=this._isNumber(t.height)&&e.minHeight&&e.minHeight>t.height,r=this.originalPosition.left+this.originalSize.width,l=this.originalPosition.top+this.originalSize.height,h=/sw|nw|w/.test(i),c=/nw|ne|n/.test(i);return o&&(t.width=e.minWidth),a&&(t.height=e.minHeight),s&&(t.width=e.maxWidth),n&&(t.height=e.maxHeight),o&&h&&(t.left=r-e.minWidth),s&&h&&(t.left=r-e.maxWidth),a&&c&&(t.top=l-e.minHeight),n&&c&&(t.top=l-e.maxHeight),t.width||t.height||t.left||!t.top?t.width||t.height||t.top||!t.left||(t.left=null):t.top=null,t},_getPaddingPlusBorderDimensions:function(t){for(var e=0,i=[],s=[t.css("borderTopWidth"),t.css("borderRightWidth"),t.css("borderBottomWidth"),t.css("borderLeftWidth")],n=[t.css("paddingTop"),t.css("paddingRight"),t.css("paddingBottom"),t.css("paddingLeft")];4>e;e++)i[e]=parseFloat(s[e])||0,i[e]+=parseFloat(n[e])||0;return{height:i[0]+i[2],width:i[1]+i[3]}},_proportionallyResize:function(){if(this._proportionallyResizeElements.length)for(var t,e=0,i=this.helper||this.element;this._proportionallyResizeElements.length>e;e++)t=this._proportionallyResizeElements[e],this.outerDimensions||(this.outerDimensions=this._getPaddingPlusBorderDimensions(t)),t.css({height:i.height()-this.outerDimensions.height||0,width:i.width()-this.outerDimensions.width||0})},_renderProxy:function(){var e=this.element,i=this.options;this.elementOffset=e.offset(),this._helper?(this.helper=this.helper||t("<div style='overflow:hidden;'></div>"),this._addClass(this.helper,this._helper),this.helper.css({width:this.element.outerWidth(),height:this.element.outerHeight(),position:"absolute",left:this.elementOffset.left+"px",top:this.elementOffset.top+"px",zIndex:++i.zIndex}),this.helper.appendTo("body").disableSelection()):this.helper=this.element},_change:{e:function(t,e){return{width:this.originalSize.width+e}},w:function(t,e){var i=this.originalSize,s=this.originalPosition;return{left:s.left+e,width:i.width-e}},n:function(t,e,i){var s=this.originalSize,n=this.originalPosition;return{top:n.top+i,height:s.height-i}},s:function(t,e,i){return{height:this.originalSize.height+i}},se:function(e,i,s){return t.extend(this._change.s.apply(this,arguments),this._change.e.apply(this,[e,i,s]))},sw:function(e,i,s){return t.extend(this._change.s.apply(this,arguments),this._change.w.apply(this,[e,i,s]))},ne:function(e,i,s){return t.extend(this._change.n.apply(this,arguments),this._change.e.apply(this,[e,i,s]))},nw:function(e,i,s){return t.extend(this._change.n.apply(this,arguments),this._change.w.apply(this,[e,i,s]))}},_propagate:function(e,i){t.ui.plugin.call(this,e,[i,this.ui()]),"resize"!==e&&this._trigger(e,i,this.ui())},plugins:{},ui:function(){return{originalElement:this.originalElement,element:this.element,helper:this.helper,position:this.position,size:this.size,originalSize:this.originalSize,originalPosition:this.originalPosition}}}),t.ui.plugin.add("resizable","animate",{stop:function(e){var i=t(this).resizable("instance"),s=i.options,n=i._proportionallyResizeElements,o=n.length&&/textarea/i.test(n[0].nodeName),a=o&&i._hasScroll(n[0],"left")?0:i.sizeDiff.height,r=o?0:i.sizeDiff.width,l={width:i.size.width-r,height:i.size.height-a},h=parseFloat(i.element.css("left"))+(i.position.left-i.originalPosition.left)||null,c=parseFloat(i.element.css("top"))+(i.position.top-i.originalPosition.top)||null;i.element.animate(t.extend(l,c&&h?{top:c,left:h}:{}),{duration:s.animateDuration,easing:s.animateEasing,step:function(){var s={width:parseFloat(i.element.css("width")),height:parseFloat(i.element.css("height")),top:parseFloat(i.element.css("top")),left:parseFloat(i.element.css("left"))};n&&n.length&&t(n[0]).css({width:s.width,height:s.height}),i._updateCache(s),i._propagate("resize",e)}})}}),t.ui.plugin.add("resizable","containment",{start:function(){var e,i,s,n,o,a,r,l=t(this).resizable("instance"),h=l.options,c=l.element,u=h.containment,d=u instanceof t?u.get(0):/parent/.test(u)?c.parent().get(0):u;d&&(l.containerElement=t(d),/document/.test(u)||u===document?(l.containerOffset={left:0,top:0},l.containerPosition={left:0,top:0},l.parentData={element:t(document),left:0,top:0,width:t(document).width(),height:t(document).height()||document.body.parentNode.scrollHeight}):(e=t(d),i=[],t(["Top","Right","Left","Bottom"]).each(function(t,s){i[t]=l._num(e.css("padding"+s))}),l.containerOffset=e.offset(),l.containerPosition=e.position(),l.containerSize={height:e.innerHeight()-i[3],width:e.innerWidth()-i[1]},s=l.containerOffset,n=l.containerSize.height,o=l.containerSize.width,a=l._hasScroll(d,"left")?d.scrollWidth:o,r=l._hasScroll(d)?d.scrollHeight:n,l.parentData={element:d,left:s.left,top:s.top,width:a,height:r}))},resize:function(e){var i,s,n,o,a=t(this).resizable("instance"),r=a.options,l=a.containerOffset,h=a.position,c=a._aspectRatio||e.shiftKey,u={top:0,left:0},d=a.containerElement,p=!0;d[0]!==document&&/static/.test(d.css("position"))&&(u=l),h.left<(a._helper?l.left:0)&&(a.size.width=a.size.width+(a._helper?a.position.left-l.left:a.position.left-u.left),c&&(a.size.height=a.size.width/a.aspectRatio,p=!1),a.position.left=r.helper?l.left:0),h.top<(a._helper?l.top:0)&&(a.size.height=a.size.height+(a._helper?a.position.top-l.top:a.position.top),c&&(a.size.width=a.size.height*a.aspectRatio,p=!1),a.position.top=a._helper?l.top:0),n=a.containerElement.get(0)===a.element.parent().get(0),o=/relative|absolute/.test(a.containerElement.css("position")),n&&o?(a.offset.left=a.parentData.left+a.position.left,a.offset.top=a.parentData.top+a.position.top):(a.offset.left=a.element.offset().left,a.offset.top=a.element.offset().top),i=Math.abs(a.sizeDiff.width+(a._helper?a.offset.left-u.left:a.offset.left-l.left)),s=Math.abs(a.sizeDiff.height+(a._helper?a.offset.top-u.top:a.offset.top-l.top)),i+a.size.width>=a.parentData.width&&(a.size.width=a.parentData.width-i,c&&(a.size.height=a.size.width/a.aspectRatio,p=!1)),s+a.size.height>=a.parentData.height&&(a.size.height=a.parentData.height-s,c&&(a.size.width=a.size.height*a.aspectRatio,p=!1)),p||(a.position.left=a.prevPosition.left,a.position.top=a.prevPosition.top,a.size.width=a.prevSize.width,a.size.height=a.prevSize.height)},stop:function(){var e=t(this).resizable("instance"),i=e.options,s=e.containerOffset,n=e.containerPosition,o=e.containerElement,a=t(e.helper),r=a.offset(),l=a.outerWidth()-e.sizeDiff.width,h=a.outerHeight()-e.sizeDiff.height;e._helper&&!i.animate&&/relative/.test(o.css("position"))&&t(this).css({left:r.left-n.left-s.left,width:l,height:h}),e._helper&&!i.animate&&/static/.test(o.css("position"))&&t(this).css({left:r.left-n.left-s.left,width:l,height:h})}}),t.ui.plugin.add("resizable","alsoResize",{start:function(){var e=t(this).resizable("instance"),i=e.options;t(i.alsoResize).each(function(){var e=t(this);e.data("ui-resizable-alsoresize",{width:parseFloat(e.width()),height:parseFloat(e.height()),left:parseFloat(e.css("left")),top:parseFloat(e.css("top"))})})},resize:function(e,i){var s=t(this).resizable("instance"),n=s.options,o=s.originalSize,a=s.originalPosition,r={height:s.size.height-o.height||0,width:s.size.width-o.width||0,top:s.position.top-a.top||0,left:s.position.left-a.left||0};t(n.alsoResize).each(function(){var e=t(this),s=t(this).data("ui-resizable-alsoresize"),n={},o=e.parents(i.originalElement[0]).length?["width","height"]:["width","height","top","left"];t.each(o,function(t,e){var i=(s[e]||0)+(r[e]||0);i&&i>=0&&(n[e]=i||null)}),e.css(n)})},stop:function(){t(this).removeData("ui-resizable-alsoresize")}}),t.ui.plugin.add("resizable","ghost",{start:function(){var e=t(this).resizable("instance"),i=e.size;e.ghost=e.originalElement.clone(),e.ghost.css({opacity:.25,display:"block",position:"relative",height:i.height,width:i.width,margin:0,left:0,top:0}),e._addClass(e.ghost,"ui-resizable-ghost"),t.uiBackCompat!==!1&&"string"==typeof e.options.ghost&&e.ghost.addClass(this.options.ghost),e.ghost.appendTo(e.helper)},resize:function(){var e=t(this).resizable("instance");e.ghost&&e.ghost.css({position:"relative",height:e.size.height,width:e.size.width})},stop:function(){var e=t(this).resizable("instance");e.ghost&&e.helper&&e.helper.get(0).removeChild(e.ghost.get(0))}}),t.ui.plugin.add("resizable","grid",{resize:function(){var e,i=t(this).resizable("instance"),s=i.options,n=i.size,o=i.originalSize,a=i.originalPosition,r=i.axis,l="number"==typeof s.grid?[s.grid,s.grid]:s.grid,h=l[0]||1,c=l[1]||1,u=Math.round((n.width-o.width)/h)*h,d=Math.round((n.height-o.height)/c)*c,p=o.width+u,f=o.height+d,g=s.maxWidth&&p>s.maxWidth,m=s.maxHeight&&f>s.maxHeight,_=s.minWidth&&s.minWidth>p,v=s.minHeight&&s.minHeight>f;s.grid=l,_&&(p+=h),v&&(f+=c),g&&(p-=h),m&&(f-=c),/^(se|s|e)$/.test(r)?(i.size.width=p,i.size.height=f):/^(ne)$/.test(r)?(i.size.width=p,i.size.height=f,i.position.top=a.top-d):/^(sw)$/.test(r)?(i.size.width=p,i.size.height=f,i.position.left=a.left-u):((0>=f-c||0>=p-h)&&(e=i._getPaddingPlusBorderDimensions(this)),f-c>0?(i.size.height=f,i.position.top=a.top-d):(f=c-e.height,i.size.height=f,i.position.top=a.top+o.height-f),p-h>0?(i.size.width=p,i.position.left=a.left-u):(p=h-e.width,i.size.width=p,i.position.left=a.left+o.width-p))}}),t.ui.resizable;var o=/ui-corner-([a-z]){2,6}/g;t.widget("ui.controlgroup",{version:"1.12.1",defaultElement:"<div>",options:{direction:"horizontal",disabled:null,onlyVisible:!0,items:{button:"input[type=button], input[type=submit], input[type=reset], button, a",controlgroupLabel:".ui-controlgroup-label",checkboxradio:"input[type='checkbox'], input[type='radio']",selectmenu:"select",spinner:".ui-spinner-input"}},_create:function(){this._enhance()},_enhance:function(){this.element.attr("role","toolbar"),this.refresh()},_destroy:function(){this._callChildMethod("destroy"),this.childWidgets.removeData("ui-controlgroup-data"),this.element.removeAttr("role"),this.options.items.controlgroupLabel&&this.element.find(this.options.items.controlgroupLabel).find(".ui-controlgroup-label-contents").contents().unwrap()},_initWidgets:function(){var e=this,i=[];t.each(this.options.items,function(s,n){var o,a={};return n?"controlgroupLabel"===s?(o=e.element.find(n),o.each(function(){var e=t(this);e.children(".ui-controlgroup-label-contents").length||e.contents().wrapAll("<span class='ui-controlgroup-label-contents'></span>")}),e._addClass(o,null,"ui-widget ui-widget-content ui-state-default"),i=i.concat(o.get()),void 0):(t.fn[s]&&(a=e["_"+s+"Options"]?e["_"+s+"Options"]("middle"):{classes:{}},e.element.find(n).each(function(){var n=t(this),o=n[s]("instance"),r=t.widget.extend({},a);if("button"!==s||!n.parent(".ui-spinner").length){o||(o=n[s]()[s]("instance")),o&&(r.classes=e._resolveClassesValues(r.classes,o)),n[s](r);var l=n[s]("widget");t.data(l[0],"ui-controlgroup-data",o?o:n[s]("instance")),i.push(l[0])}})),void 0):void 0}),this.childWidgets=t(t.unique(i)),this._addClass(this.childWidgets,"ui-controlgroup-item")},_callChildMethod:function(e){this.childWidgets.each(function(){var i=t(this),s=i.data("ui-controlgroup-data");s&&s[e]&&s[e]()})},_updateCornerClass:function(t,e){var i="ui-corner-top ui-corner-bottom ui-corner-left ui-corner-right ui-corner-all",s=this._buildSimpleOptions(e,"label").classes.label;this._removeClass(t,null,i),this._addClass(t,null,s)},_buildSimpleOptions:function(t,e){var i="vertical"===this.options.direction,s={classes:{}};return s.classes[e]={middle:"",first:"ui-corner-"+(i?"top":"left"),last:"ui-corner-"+(i?"bottom":"right"),only:"ui-corner-all"}[t],s},_spinnerOptions:function(t){var e=this._buildSimpleOptions(t,"ui-spinner");return e.classes["ui-spinner-up"]="",e.classes["ui-spinner-down"]="",e},_buttonOptions:function(t){return this._buildSimpleOptions(t,"ui-button")},_checkboxradioOptions:function(t){return this._buildSimpleOptions(t,"ui-checkboxradio-label")},_selectmenuOptions:function(t){var e="vertical"===this.options.direction;return{width:e?"auto":!1,classes:{middle:{"ui-selectmenu-button-open":"","ui-selectmenu-button-closed":""},first:{"ui-selectmenu-button-open":"ui-corner-"+(e?"top":"tl"),"ui-selectmenu-button-closed":"ui-corner-"+(e?"top":"left")},last:{"ui-selectmenu-button-open":e?"":"ui-corner-tr","ui-selectmenu-button-closed":"ui-corner-"+(e?"bottom":"right")},only:{"ui-selectmenu-button-open":"ui-corner-top","ui-selectmenu-button-closed":"ui-corner-all"}}[t]}},_resolveClassesValues:function(e,i){var s={};return t.each(e,function(n){var a=i.options.classes[n]||"";a=t.trim(a.replace(o,"")),s[n]=(a+" "+e[n]).replace(/\s+/g," ")}),s},_setOption:function(t,e){return"direction"===t&&this._removeClass("ui-controlgroup-"+this.options.direction),this._super(t,e),"disabled"===t?(this._callChildMethod(e?"disable":"enable"),void 0):(this.refresh(),void 0)},refresh:function(){var e,i=this;this._addClass("ui-controlgroup ui-controlgroup-"+this.options.direction),"horizontal"===this.options.direction&&this._addClass(null,"ui-helper-clearfix"),this._initWidgets(),e=this.childWidgets,this.options.onlyVisible&&(e=e.filter(":visible")),e.length&&(t.each(["first","last"],function(t,s){var n=e[s]().data("ui-controlgroup-data");if(n&&i["_"+n.widgetName+"Options"]){var o=i["_"+n.widgetName+"Options"](1===e.length?"only":s);o.classes=i._resolveClassesValues(o.classes,n),n.element[n.widgetName](o)}else i._updateCornerClass(e[s](),s)}),this._callChildMethod("refresh"))}}),t.widget("ui.checkboxradio",[t.ui.formResetMixin,{version:"1.12.1",options:{disabled:null,label:null,icon:!0,classes:{"ui-checkboxradio-label":"ui-corner-all","ui-checkboxradio-icon":"ui-corner-all"}},_getCreateOptions:function(){var e,i,s=this,n=this._super()||{};return this._readType(),i=this.element.labels(),this.label=t(i[i.length-1]),this.label.length||t.error("No label found for checkboxradio widget"),this.originalLabel="",this.label.contents().not(this.element[0]).each(function(){s.originalLabel+=3===this.nodeType?t(this).text():this.outerHTML}),this.originalLabel&&(n.label=this.originalLabel),e=this.element[0].disabled,null!=e&&(n.disabled=e),n},_create:function(){var t=this.element[0].checked;this._bindFormResetHandler(),null==this.options.disabled&&(this.options.disabled=this.element[0].disabled),this._setOption("disabled",this.options.disabled),this._addClass("ui-checkboxradio","ui-helper-hidden-accessible"),this._addClass(this.label,"ui-checkboxradio-label","ui-button ui-widget"),"radio"===this.type&&this._addClass(this.label,"ui-checkboxradio-radio-label"),this.options.label&&this.options.label!==this.originalLabel?this._updateLabel():this.originalLabel&&(this.options.label=this.originalLabel),this._enhance(),t&&(this._addClass(this.label,"ui-checkboxradio-checked","ui-state-active"),this.icon&&this._addClass(this.icon,null,"ui-state-hover")),this._on({change:"_toggleClasses",focus:function(){this._addClass(this.label,null,"ui-state-focus ui-visual-focus")},blur:function(){this._removeClass(this.label,null,"ui-state-focus ui-visual-focus")}})},_readType:function(){var e=this.element[0].nodeName.toLowerCase();this.type=this.element[0].type,"input"===e&&/radio|checkbox/.test(this.type)||t.error("Can't create checkboxradio on element.nodeName="+e+" and element.type="+this.type)},_enhance:function(){this._updateIcon(this.element[0].checked)},widget:function(){return this.label},_getRadioGroup:function(){var e,i=this.element[0].name,s="input[name='"+t.ui.escapeSelector(i)+"']";return i?(e=this.form.length?t(this.form[0].elements).filter(s):t(s).filter(function(){return 0===t(this).form().length}),e.not(this.element)):t([])},_toggleClasses:function(){var e=this.element[0].checked;this._toggleClass(this.label,"ui-checkboxradio-checked","ui-state-active",e),this.options.icon&&"checkbox"===this.type&&this._toggleClass(this.icon,null,"ui-icon-check ui-state-checked",e)._toggleClass(this.icon,null,"ui-icon-blank",!e),"radio"===this.type&&this._getRadioGroup().each(function(){var e=t(this).checkboxradio("instance");e&&e._removeClass(e.label,"ui-checkboxradio-checked","ui-state-active")})},_destroy:function(){this._unbindFormResetHandler(),this.icon&&(this.icon.remove(),this.iconSpace.remove())},_setOption:function(t,e){return"label"!==t||e?(this._super(t,e),"disabled"===t?(this._toggleClass(this.label,null,"ui-state-disabled",e),this.element[0].disabled=e,void 0):(this.refresh(),void 0)):void 0
},_updateIcon:function(e){var i="ui-icon ui-icon-background ";this.options.icon?(this.icon||(this.icon=t("<span>"),this.iconSpace=t("<span> </span>"),this._addClass(this.iconSpace,"ui-checkboxradio-icon-space")),"checkbox"===this.type?(i+=e?"ui-icon-check ui-state-checked":"ui-icon-blank",this._removeClass(this.icon,null,e?"ui-icon-blank":"ui-icon-check")):i+="ui-icon-blank",this._addClass(this.icon,"ui-checkboxradio-icon",i),e||this._removeClass(this.icon,null,"ui-icon-check ui-state-checked"),this.icon.prependTo(this.label).after(this.iconSpace)):void 0!==this.icon&&(this.icon.remove(),this.iconSpace.remove(),delete this.icon)},_updateLabel:function(){var t=this.label.contents().not(this.element[0]);this.icon&&(t=t.not(this.icon[0])),this.iconSpace&&(t=t.not(this.iconSpace[0])),t.remove(),this.label.append(this.options.label)},refresh:function(){var t=this.element[0].checked,e=this.element[0].disabled;this._updateIcon(t),this._toggleClass(this.label,"ui-checkboxradio-checked","ui-state-active",t),null!==this.options.label&&this._updateLabel(),e!==this.options.disabled&&this._setOptions({disabled:e})}}]),t.ui.checkboxradio,t.widget("ui.button",{version:"1.12.1",defaultElement:"<button>",options:{classes:{"ui-button":"ui-corner-all"},disabled:null,icon:null,iconPosition:"beginning",label:null,showLabel:!0},_getCreateOptions:function(){var t,e=this._super()||{};return this.isInput=this.element.is("input"),t=this.element[0].disabled,null!=t&&(e.disabled=t),this.originalLabel=this.isInput?this.element.val():this.element.html(),this.originalLabel&&(e.label=this.originalLabel),e},_create:function(){!this.option.showLabel&!this.options.icon&&(this.options.showLabel=!0),null==this.options.disabled&&(this.options.disabled=this.element[0].disabled||!1),this.hasTitle=!!this.element.attr("title"),this.options.label&&this.options.label!==this.originalLabel&&(this.isInput?this.element.val(this.options.label):this.element.html(this.options.label)),this._addClass("ui-button","ui-widget"),this._setOption("disabled",this.options.disabled),this._enhance(),this.element.is("a")&&this._on({keyup:function(e){e.keyCode===t.ui.keyCode.SPACE&&(e.preventDefault(),this.element[0].click?this.element[0].click():this.element.trigger("click"))}})},_enhance:function(){this.element.is("button")||this.element.attr("role","button"),this.options.icon&&(this._updateIcon("icon",this.options.icon),this._updateTooltip())},_updateTooltip:function(){this.title=this.element.attr("title"),this.options.showLabel||this.title||this.element.attr("title",this.options.label)},_updateIcon:function(e,i){var s="iconPosition"!==e,n=s?this.options.iconPosition:i,o="top"===n||"bottom"===n;this.icon?s&&this._removeClass(this.icon,null,this.options.icon):(this.icon=t("<span>"),this._addClass(this.icon,"ui-button-icon","ui-icon"),this.options.showLabel||this._addClass("ui-button-icon-only")),s&&this._addClass(this.icon,null,i),this._attachIcon(n),o?(this._addClass(this.icon,null,"ui-widget-icon-block"),this.iconSpace&&this.iconSpace.remove()):(this.iconSpace||(this.iconSpace=t("<span> </span>"),this._addClass(this.iconSpace,"ui-button-icon-space")),this._removeClass(this.icon,null,"ui-wiget-icon-block"),this._attachIconSpace(n))},_destroy:function(){this.element.removeAttr("role"),this.icon&&this.icon.remove(),this.iconSpace&&this.iconSpace.remove(),this.hasTitle||this.element.removeAttr("title")},_attachIconSpace:function(t){this.icon[/^(?:end|bottom)/.test(t)?"before":"after"](this.iconSpace)},_attachIcon:function(t){this.element[/^(?:end|bottom)/.test(t)?"append":"prepend"](this.icon)},_setOptions:function(t){var e=void 0===t.showLabel?this.options.showLabel:t.showLabel,i=void 0===t.icon?this.options.icon:t.icon;e||i||(t.showLabel=!0),this._super(t)},_setOption:function(t,e){"icon"===t&&(e?this._updateIcon(t,e):this.icon&&(this.icon.remove(),this.iconSpace&&this.iconSpace.remove())),"iconPosition"===t&&this._updateIcon(t,e),"showLabel"===t&&(this._toggleClass("ui-button-icon-only",null,!e),this._updateTooltip()),"label"===t&&(this.isInput?this.element.val(e):(this.element.html(e),this.icon&&(this._attachIcon(this.options.iconPosition),this._attachIconSpace(this.options.iconPosition)))),this._super(t,e),"disabled"===t&&(this._toggleClass(null,"ui-state-disabled",e),this.element[0].disabled=e,e&&this.element.blur())},refresh:function(){var t=this.element.is("input, button")?this.element[0].disabled:this.element.hasClass("ui-button-disabled");t!==this.options.disabled&&this._setOptions({disabled:t}),this._updateTooltip()}}),t.uiBackCompat!==!1&&(t.widget("ui.button",t.ui.button,{options:{text:!0,icons:{primary:null,secondary:null}},_create:function(){this.options.showLabel&&!this.options.text&&(this.options.showLabel=this.options.text),!this.options.showLabel&&this.options.text&&(this.options.text=this.options.showLabel),this.options.icon||!this.options.icons.primary&&!this.options.icons.secondary?this.options.icon&&(this.options.icons.primary=this.options.icon):this.options.icons.primary?this.options.icon=this.options.icons.primary:(this.options.icon=this.options.icons.secondary,this.options.iconPosition="end"),this._super()},_setOption:function(t,e){return"text"===t?(this._super("showLabel",e),void 0):("showLabel"===t&&(this.options.text=e),"icon"===t&&(this.options.icons.primary=e),"icons"===t&&(e.primary?(this._super("icon",e.primary),this._super("iconPosition","beginning")):e.secondary&&(this._super("icon",e.secondary),this._super("iconPosition","end"))),this._superApply(arguments),void 0)}}),t.fn.button=function(e){return function(){return!this.length||this.length&&"INPUT"!==this[0].tagName||this.length&&"INPUT"===this[0].tagName&&"checkbox"!==this.attr("type")&&"radio"!==this.attr("type")?e.apply(this,arguments):(t.ui.checkboxradio||t.error("Checkboxradio widget missing"),0===arguments.length?this.checkboxradio({icon:!1}):this.checkboxradio.apply(this,arguments))}}(t.fn.button),t.fn.buttonset=function(){return t.ui.controlgroup||t.error("Controlgroup widget missing"),"option"===arguments[0]&&"items"===arguments[1]&&arguments[2]?this.controlgroup.apply(this,[arguments[0],"items.button",arguments[2]]):"option"===arguments[0]&&"items"===arguments[1]?this.controlgroup.apply(this,[arguments[0],"items.button"]):("object"==typeof arguments[0]&&arguments[0].items&&(arguments[0].items={button:arguments[0].items}),this.controlgroup.apply(this,arguments))}),t.ui.button,t.widget("ui.dialog",{version:"1.12.1",options:{appendTo:"body",autoOpen:!0,buttons:[],classes:{"ui-dialog":"ui-corner-all","ui-dialog-titlebar":"ui-corner-all"},closeOnEscape:!0,closeText:"Close",draggable:!0,hide:null,height:"auto",maxHeight:null,maxWidth:null,minHeight:150,minWidth:150,modal:!1,position:{my:"center",at:"center",of:window,collision:"fit",using:function(e){var i=t(this).css(e).offset().top;0>i&&t(this).css("top",e.top-i)}},resizable:!0,show:null,title:null,width:300,beforeClose:null,close:null,drag:null,dragStart:null,dragStop:null,focus:null,open:null,resize:null,resizeStart:null,resizeStop:null},sizeRelatedOptions:{buttons:!0,height:!0,maxHeight:!0,maxWidth:!0,minHeight:!0,minWidth:!0,width:!0},resizableRelatedOptions:{maxHeight:!0,maxWidth:!0,minHeight:!0,minWidth:!0},_create:function(){this.originalCss={display:this.element[0].style.display,width:this.element[0].style.width,minHeight:this.element[0].style.minHeight,maxHeight:this.element[0].style.maxHeight,height:this.element[0].style.height},this.originalPosition={parent:this.element.parent(),index:this.element.parent().children().index(this.element)},this.originalTitle=this.element.attr("title"),null==this.options.title&&null!=this.originalTitle&&(this.options.title=this.originalTitle),this.options.disabled&&(this.options.disabled=!1),this._createWrapper(),this.element.show().removeAttr("title").appendTo(this.uiDialog),this._addClass("ui-dialog-content","ui-widget-content"),this._createTitlebar(),this._createButtonPane(),this.options.draggable&&t.fn.draggable&&this._makeDraggable(),this.options.resizable&&t.fn.resizable&&this._makeResizable(),this._isOpen=!1,this._trackFocus()},_init:function(){this.options.autoOpen&&this.open()},_appendTo:function(){var e=this.options.appendTo;return e&&(e.jquery||e.nodeType)?t(e):this.document.find(e||"body").eq(0)},_destroy:function(){var t,e=this.originalPosition;this._untrackInstance(),this._destroyOverlay(),this.element.removeUniqueId().css(this.originalCss).detach(),this.uiDialog.remove(),this.originalTitle&&this.element.attr("title",this.originalTitle),t=e.parent.children().eq(e.index),t.length&&t[0]!==this.element[0]?t.before(this.element):e.parent.append(this.element)},widget:function(){return this.uiDialog},disable:t.noop,enable:t.noop,close:function(e){var i=this;this._isOpen&&this._trigger("beforeClose",e)!==!1&&(this._isOpen=!1,this._focusedElement=null,this._destroyOverlay(),this._untrackInstance(),this.opener.filter(":focusable").trigger("focus").length||t.ui.safeBlur(t.ui.safeActiveElement(this.document[0])),this._hide(this.uiDialog,this.options.hide,function(){i._trigger("close",e)}))},isOpen:function(){return this._isOpen},moveToTop:function(){this._moveToTop()},_moveToTop:function(e,i){var s=!1,n=this.uiDialog.siblings(".ui-front:visible").map(function(){return+t(this).css("z-index")}).get(),o=Math.max.apply(null,n);return o>=+this.uiDialog.css("z-index")&&(this.uiDialog.css("z-index",o+1),s=!0),s&&!i&&this._trigger("focus",e),s},open:function(){var e=this;return this._isOpen?(this._moveToTop()&&this._focusTabbable(),void 0):(this._isOpen=!0,this.opener=t(t.ui.safeActiveElement(this.document[0])),this._size(),this._position(),this._createOverlay(),this._moveToTop(null,!0),this.overlay&&this.overlay.css("z-index",this.uiDialog.css("z-index")-1),this._show(this.uiDialog,this.options.show,function(){e._focusTabbable(),e._trigger("focus")}),this._makeFocusTarget(),this._trigger("open"),void 0)},_focusTabbable:function(){var t=this._focusedElement;t||(t=this.element.find("[autofocus]")),t.length||(t=this.element.find(":tabbable")),t.length||(t=this.uiDialogButtonPane.find(":tabbable")),t.length||(t=this.uiDialogTitlebarClose.filter(":tabbable")),t.length||(t=this.uiDialog),t.eq(0).trigger("focus")},_keepFocus:function(e){function i(){var e=t.ui.safeActiveElement(this.document[0]),i=this.uiDialog[0]===e||t.contains(this.uiDialog[0],e);i||this._focusTabbable()}e.preventDefault(),i.call(this),this._delay(i)},_createWrapper:function(){this.uiDialog=t("<div>").hide().attr({tabIndex:-1,role:"dialog"}).appendTo(this._appendTo()),this._addClass(this.uiDialog,"ui-dialog","ui-widget ui-widget-content ui-front"),this._on(this.uiDialog,{keydown:function(e){if(this.options.closeOnEscape&&!e.isDefaultPrevented()&&e.keyCode&&e.keyCode===t.ui.keyCode.ESCAPE)return e.preventDefault(),this.close(e),void 0;if(e.keyCode===t.ui.keyCode.TAB&&!e.isDefaultPrevented()){var i=this.uiDialog.find(":tabbable"),s=i.filter(":first"),n=i.filter(":last");e.target!==n[0]&&e.target!==this.uiDialog[0]||e.shiftKey?e.target!==s[0]&&e.target!==this.uiDialog[0]||!e.shiftKey||(this._delay(function(){n.trigger("focus")}),e.preventDefault()):(this._delay(function(){s.trigger("focus")}),e.preventDefault())}},mousedown:function(t){this._moveToTop(t)&&this._focusTabbable()}}),this.element.find("[aria-describedby]").length||this.uiDialog.attr({"aria-describedby":this.element.uniqueId().attr("id")})},_createTitlebar:function(){var e;this.uiDialogTitlebar=t("<div>"),this._addClass(this.uiDialogTitlebar,"ui-dialog-titlebar","ui-widget-header ui-helper-clearfix"),this._on(this.uiDialogTitlebar,{mousedown:function(e){t(e.target).closest(".ui-dialog-titlebar-close")||this.uiDialog.trigger("focus")}}),this.uiDialogTitlebarClose=t("<button type='button'></button>").button({label:t("<a>").text(this.options.closeText).html(),icon:"ui-icon-closethick",showLabel:!1}).appendTo(this.uiDialogTitlebar),this._addClass(this.uiDialogTitlebarClose,"ui-dialog-titlebar-close"),this._on(this.uiDialogTitlebarClose,{click:function(t){t.preventDefault(),this.close(t)}}),e=t("<span>").uniqueId().prependTo(this.uiDialogTitlebar),this._addClass(e,"ui-dialog-title"),this._title(e),this.uiDialogTitlebar.prependTo(this.uiDialog),this.uiDialog.attr({"aria-labelledby":e.attr("id")})},_title:function(t){this.options.title?t.text(this.options.title):t.html("&#160;")},_createButtonPane:function(){this.uiDialogButtonPane=t("<div>"),this._addClass(this.uiDialogButtonPane,"ui-dialog-buttonpane","ui-widget-content ui-helper-clearfix"),this.uiButtonSet=t("<div>").appendTo(this.uiDialogButtonPane),this._addClass(this.uiButtonSet,"ui-dialog-buttonset"),this._createButtons()},_createButtons:function(){var e=this,i=this.options.buttons;return this.uiDialogButtonPane.remove(),this.uiButtonSet.empty(),t.isEmptyObject(i)||t.isArray(i)&&!i.length?(this._removeClass(this.uiDialog,"ui-dialog-buttons"),void 0):(t.each(i,function(i,s){var n,o;s=t.isFunction(s)?{click:s,text:i}:s,s=t.extend({type:"button"},s),n=s.click,o={icon:s.icon,iconPosition:s.iconPosition,showLabel:s.showLabel,icons:s.icons,text:s.text},delete s.click,delete s.icon,delete s.iconPosition,delete s.showLabel,delete s.icons,"boolean"==typeof s.text&&delete s.text,t("<button></button>",s).button(o).appendTo(e.uiButtonSet).on("click",function(){n.apply(e.element[0],arguments)})}),this._addClass(this.uiDialog,"ui-dialog-buttons"),this.uiDialogButtonPane.appendTo(this.uiDialog),void 0)},_makeDraggable:function(){function e(t){return{position:t.position,offset:t.offset}}var i=this,s=this.options;this.uiDialog.draggable({cancel:".ui-dialog-content, .ui-dialog-titlebar-close",handle:".ui-dialog-titlebar",containment:"document",start:function(s,n){i._addClass(t(this),"ui-dialog-dragging"),i._blockFrames(),i._trigger("dragStart",s,e(n))},drag:function(t,s){i._trigger("drag",t,e(s))},stop:function(n,o){var a=o.offset.left-i.document.scrollLeft(),r=o.offset.top-i.document.scrollTop();s.position={my:"left top",at:"left"+(a>=0?"+":"")+a+" "+"top"+(r>=0?"+":"")+r,of:i.window},i._removeClass(t(this),"ui-dialog-dragging"),i._unblockFrames(),i._trigger("dragStop",n,e(o))}})},_makeResizable:function(){function e(t){return{originalPosition:t.originalPosition,originalSize:t.originalSize,position:t.position,size:t.size}}var i=this,s=this.options,n=s.resizable,o=this.uiDialog.css("position"),a="string"==typeof n?n:"n,e,s,w,se,sw,ne,nw";this.uiDialog.resizable({cancel:".ui-dialog-content",containment:"document",alsoResize:this.element,maxWidth:s.maxWidth,maxHeight:s.maxHeight,minWidth:s.minWidth,minHeight:this._minHeight(),handles:a,start:function(s,n){i._addClass(t(this),"ui-dialog-resizing"),i._blockFrames(),i._trigger("resizeStart",s,e(n))},resize:function(t,s){i._trigger("resize",t,e(s))},stop:function(n,o){var a=i.uiDialog.offset(),r=a.left-i.document.scrollLeft(),l=a.top-i.document.scrollTop();s.height=i.uiDialog.height(),s.width=i.uiDialog.width(),s.position={my:"left top",at:"left"+(r>=0?"+":"")+r+" "+"top"+(l>=0?"+":"")+l,of:i.window},i._removeClass(t(this),"ui-dialog-resizing"),i._unblockFrames(),i._trigger("resizeStop",n,e(o))}}).css("position",o)},_trackFocus:function(){this._on(this.widget(),{focusin:function(e){this._makeFocusTarget(),this._focusedElement=t(e.target)}})},_makeFocusTarget:function(){this._untrackInstance(),this._trackingInstances().unshift(this)},_untrackInstance:function(){var e=this._trackingInstances(),i=t.inArray(this,e);-1!==i&&e.splice(i,1)},_trackingInstances:function(){var t=this.document.data("ui-dialog-instances");return t||(t=[],this.document.data("ui-dialog-instances",t)),t},_minHeight:function(){var t=this.options;return"auto"===t.height?t.minHeight:Math.min(t.minHeight,t.height)},_position:function(){var t=this.uiDialog.is(":visible");t||this.uiDialog.show(),this.uiDialog.position(this.options.position),t||this.uiDialog.hide()},_setOptions:function(e){var i=this,s=!1,n={};t.each(e,function(t,e){i._setOption(t,e),t in i.sizeRelatedOptions&&(s=!0),t in i.resizableRelatedOptions&&(n[t]=e)}),s&&(this._size(),this._position()),this.uiDialog.is(":data(ui-resizable)")&&this.uiDialog.resizable("option",n)},_setOption:function(e,i){var s,n,o=this.uiDialog;"disabled"!==e&&(this._super(e,i),"appendTo"===e&&this.uiDialog.appendTo(this._appendTo()),"buttons"===e&&this._createButtons(),"closeText"===e&&this.uiDialogTitlebarClose.button({label:t("<a>").text(""+this.options.closeText).html()}),"draggable"===e&&(s=o.is(":data(ui-draggable)"),s&&!i&&o.draggable("destroy"),!s&&i&&this._makeDraggable()),"position"===e&&this._position(),"resizable"===e&&(n=o.is(":data(ui-resizable)"),n&&!i&&o.resizable("destroy"),n&&"string"==typeof i&&o.resizable("option","handles",i),n||i===!1||this._makeResizable()),"title"===e&&this._title(this.uiDialogTitlebar.find(".ui-dialog-title")))},_size:function(){var t,e,i,s=this.options;this.element.show().css({width:"auto",minHeight:0,maxHeight:"none",height:0}),s.minWidth>s.width&&(s.width=s.minWidth),t=this.uiDialog.css({height:"auto",width:s.width}).outerHeight(),e=Math.max(0,s.minHeight-t),i="number"==typeof s.maxHeight?Math.max(0,s.maxHeight-t):"none","auto"===s.height?this.element.css({minHeight:e,maxHeight:i,height:"auto"}):this.element.height(Math.max(0,s.height-t)),this.uiDialog.is(":data(ui-resizable)")&&this.uiDialog.resizable("option","minHeight",this._minHeight())},_blockFrames:function(){this.iframeBlocks=this.document.find("iframe").map(function(){var e=t(this);return t("<div>").css({position:"absolute",width:e.outerWidth(),height:e.outerHeight()}).appendTo(e.parent()).offset(e.offset())[0]})},_unblockFrames:function(){this.iframeBlocks&&(this.iframeBlocks.remove(),delete this.iframeBlocks)},_allowInteraction:function(e){return t(e.target).closest(".ui-dialog").length?!0:!!t(e.target).closest(".ui-datepicker").length},_createOverlay:function(){if(this.options.modal){var e=!0;this._delay(function(){e=!1}),this.document.data("ui-dialog-overlays")||this._on(this.document,{focusin:function(t){e||this._allowInteraction(t)||(t.preventDefault(),this._trackingInstances()[0]._focusTabbable())}}),this.overlay=t("<div>").appendTo(this._appendTo()),this._addClass(this.overlay,null,"ui-widget-overlay ui-front"),this._on(this.overlay,{mousedown:"_keepFocus"}),this.document.data("ui-dialog-overlays",(this.document.data("ui-dialog-overlays")||0)+1)}},_destroyOverlay:function(){if(this.options.modal&&this.overlay){var t=this.document.data("ui-dialog-overlays")-1;t?this.document.data("ui-dialog-overlays",t):(this._off(this.document,"focusin"),this.document.removeData("ui-dialog-overlays")),this.overlay.remove(),this.overlay=null}}}),t.uiBackCompat!==!1&&t.widget("ui.dialog",t.ui.dialog,{options:{dialogClass:""},_createWrapper:function(){this._super(),this.uiDialog.addClass(this.options.dialogClass)},_setOption:function(t,e){"dialogClass"===t&&this.uiDialog.removeClass(this.options.dialogClass).addClass(e),this._superApply(arguments)}}),t.ui.dialog,t.widget("ui.tooltip",{version:"1.12.1",options:{classes:{"ui-tooltip":"ui-corner-all ui-widget-shadow"},content:function(){var e=t(this).attr("title")||"";return t("<a>").text(e).html()},hide:!0,items:"[title]:not([disabled])",position:{my:"left top+15",at:"left bottom",collision:"flipfit flip"},show:!0,track:!1,close:null,open:null},_addDescribedBy:function(e,i){var s=(e.attr("aria-describedby")||"").split(/\s+/);s.push(i),e.data("ui-tooltip-id",i).attr("aria-describedby",t.trim(s.join(" ")))},_removeDescribedBy:function(e){var i=e.data("ui-tooltip-id"),s=(e.attr("aria-describedby")||"").split(/\s+/),n=t.inArray(i,s);-1!==n&&s.splice(n,1),e.removeData("ui-tooltip-id"),s=t.trim(s.join(" ")),s?e.attr("aria-describedby",s):e.removeAttr("aria-describedby")},_create:function(){this._on({mouseover:"open",focusin:"open"}),this.tooltips={},this.parents={},this.liveRegion=t("<div>").attr({role:"log","aria-live":"assertive","aria-relevant":"additions"}).appendTo(this.document[0].body),this._addClass(this.liveRegion,null,"ui-helper-hidden-accessible"),this.disabledTitles=t([])},_setOption:function(e,i){var s=this;this._super(e,i),"content"===e&&t.each(this.tooltips,function(t,e){s._updateContent(e.element)})},_setOptionDisabled:function(t){this[t?"_disable":"_enable"]()},_disable:function(){var e=this;t.each(this.tooltips,function(i,s){var n=t.Event("blur");n.target=n.currentTarget=s.element[0],e.close(n,!0)}),this.disabledTitles=this.disabledTitles.add(this.element.find(this.options.items).addBack().filter(function(){var e=t(this);return e.is("[title]")?e.data("ui-tooltip-title",e.attr("title")).removeAttr("title"):void 0}))},_enable:function(){this.disabledTitles.each(function(){var e=t(this);e.data("ui-tooltip-title")&&e.attr("title",e.data("ui-tooltip-title"))}),this.disabledTitles=t([])},open:function(e){var i=this,s=t(e?e.target:this.element).closest(this.options.items);s.length&&!s.data("ui-tooltip-id")&&(s.attr("title")&&s.data("ui-tooltip-title",s.attr("title")),s.data("ui-tooltip-open",!0),e&&"mouseover"===e.type&&s.parents().each(function(){var e,s=t(this);s.data("ui-tooltip-open")&&(e=t.Event("blur"),e.target=e.currentTarget=this,i.close(e,!0)),s.attr("title")&&(s.uniqueId(),i.parents[this.id]={element:this,title:s.attr("title")},s.attr("title",""))}),this._registerCloseHandlers(e,s),this._updateContent(s,e))},_updateContent:function(t,e){var i,s=this.options.content,n=this,o=e?e.type:null;return"string"==typeof s||s.nodeType||s.jquery?this._open(e,t,s):(i=s.call(t[0],function(i){n._delay(function(){t.data("ui-tooltip-open")&&(e&&(e.type=o),this._open(e,t,i))})}),i&&this._open(e,t,i),void 0)},_open:function(e,i,s){function n(t){h.of=t,a.is(":hidden")||a.position(h)}var o,a,r,l,h=t.extend({},this.options.position);if(s){if(o=this._find(i))return o.tooltip.find(".ui-tooltip-content").html(s),void 0;i.is("[title]")&&(e&&"mouseover"===e.type?i.attr("title",""):i.removeAttr("title")),o=this._tooltip(i),a=o.tooltip,this._addDescribedBy(i,a.attr("id")),a.find(".ui-tooltip-content").html(s),this.liveRegion.children().hide(),l=t("<div>").html(a.find(".ui-tooltip-content").html()),l.removeAttr("name").find("[name]").removeAttr("name"),l.removeAttr("id").find("[id]").removeAttr("id"),l.appendTo(this.liveRegion),this.options.track&&e&&/^mouse/.test(e.type)?(this._on(this.document,{mousemove:n}),n(e)):a.position(t.extend({of:i},this.options.position)),a.hide(),this._show(a,this.options.show),this.options.track&&this.options.show&&this.options.show.delay&&(r=this.delayedShow=setInterval(function(){a.is(":visible")&&(n(h.of),clearInterval(r))},t.fx.interval)),this._trigger("open",e,{tooltip:a})}},_registerCloseHandlers:function(e,i){var s={keyup:function(e){if(e.keyCode===t.ui.keyCode.ESCAPE){var s=t.Event(e);s.currentTarget=i[0],this.close(s,!0)}}};i[0]!==this.element[0]&&(s.remove=function(){this._removeTooltip(this._find(i).tooltip)}),e&&"mouseover"!==e.type||(s.mouseleave="close"),e&&"focusin"!==e.type||(s.focusout="close"),this._on(!0,i,s)},close:function(e){var i,s=this,n=t(e?e.currentTarget:this.element),o=this._find(n);return o?(i=o.tooltip,o.closing||(clearInterval(this.delayedShow),n.data("ui-tooltip-title")&&!n.attr("title")&&n.attr("title",n.data("ui-tooltip-title")),this._removeDescribedBy(n),o.hiding=!0,i.stop(!0),this._hide(i,this.options.hide,function(){s._removeTooltip(t(this))}),n.removeData("ui-tooltip-open"),this._off(n,"mouseleave focusout keyup"),n[0]!==this.element[0]&&this._off(n,"remove"),this._off(this.document,"mousemove"),e&&"mouseleave"===e.type&&t.each(this.parents,function(e,i){t(i.element).attr("title",i.title),delete s.parents[e]}),o.closing=!0,this._trigger("close",e,{tooltip:i}),o.hiding||(o.closing=!1)),void 0):(n.removeData("ui-tooltip-open"),void 0)},_tooltip:function(e){var i=t("<div>").attr("role","tooltip"),s=t("<div>").appendTo(i),n=i.uniqueId().attr("id");return this._addClass(s,"ui-tooltip-content"),this._addClass(i,"ui-tooltip","ui-widget ui-widget-content"),i.appendTo(this._appendTo(e)),this.tooltips[n]={element:e,tooltip:i}},_find:function(t){var e=t.data("ui-tooltip-id");return e?this.tooltips[e]:null},_removeTooltip:function(t){t.remove(),delete this.tooltips[t.attr("id")]},_appendTo:function(t){var e=t.closest(".ui-front, dialog");return e.length||(e=this.document[0].body),e},_destroy:function(){var e=this;t.each(this.tooltips,function(i,s){var n=t.Event("blur"),o=s.element;n.target=n.currentTarget=o[0],e.close(n,!0),t("#"+i).remove(),o.data("ui-tooltip-title")&&(o.attr("title")||o.attr("title",o.data("ui-tooltip-title")),o.removeData("ui-tooltip-title"))}),this.liveRegion.remove()}}),t.uiBackCompat!==!1&&t.widget("ui.tooltip",t.ui.tooltip,{options:{tooltipClass:null},_tooltip:function(){var t=this._superApply(arguments);return this.options.tooltipClass&&t.tooltip.addClass(this.options.tooltipClass),t}}),t.ui.tooltip});

function getSettings() {
	return JSON.parse(localStorage.getItem('SGv2 Dark Colors'));
}

function Color(hex, hue, sat, lum, alpha) {
	function clamp(num, min, max) {
		if (num < min) { return min; }
		if (max < num) { return max; }
		return num;
	}
	hex = (hex + '').replace(/#/, '');
	var rgb = [];
	for (var i = 0; i < 3; i++) {
		rgb.push(parseInt(hex.substr(i * 2, 2), 16));
		rgb[rgb.length - 1].toString() === 'NaN';
	}
	alpha = Math.round(alpha * 1000) / 1000 || 1;
	var hsl = rgbToHsl(rgb[0], rgb[1], rgb[2]), Hue = (hsl[0] + hue), Saturation = (hsl[1] + sat), Luminance = (hsl[2] + lum);
	return 'hsla(' + clamp(Hue, 0, 360) + ',' + clamp(Saturation, 0, 100) + '%' + ',' + clamp(Luminance, 0, 100) + '%' + ',' + clamp(alpha, 0, 1) + ')';
}

function rgbToHsl(r,g,b) {
	var h, s, l; r = r / 255, g = g / 255, b = b / 255;
	var max = Math.max(r, g, b), min = Math.min(r, g, b), isGrayScale = false, sub = max - min, sum = max + min;
	if (r === g && g === b) {isGrayScale = true;}
	if (sub === 0) {h = 0;} else if (r === max) {h = ((60 * (g - b) / sub) + 360) % 360;} else if (g === max) {h = (60 * (b - r) / sub) + 120;} else {h = (60 * (r - g) / sub) + 240;}
	l = sum / 2;
	if (l === 0 || l === 1) {s = l;} else if (l <= 0.5) {s = sub / sum;} else {s = sub / (2 - sum);}
	if (isGrayScale) {s = 0;}
	return [ Math.round(h), Math.round(s * 100), Math.round(l * 100) ];
}

function ModifyColor(rgb) {
	if (rgb.length > 3) {
		var text = config[0][273].match(/\d+/g);
	} else {
		text = rgbToHsl(rgb[0], rgb[1], rgb[2]);
	}

	var background = (config[0][173]).match(/\d+/g);
	var difference = Math.abs(background[2] - text[2]);
	if (difference <= 38) {
		if (background[2] <= 50) {
			var lum = text[2] + (((-difference) / 2) + 25);
			var sat = text[1] + 5;
		} else {
			lum = text[2] - (45 - ((difference * 80) / 100));
			sat = text[1];
		}
		return 'hsl(' + text[0] + ',' + sat + '%' + ',' + lum + '%' + ')';
	}
	return 'hsl(' + text[0] + ',' + (text[1]+3) + '%' + ',' + (text[2]-7) + '%' + ')';
}

var CustomColorsConfig = (function () {
	function CustomColorsConfig(callback) {
		var _this = this;
		var current = getSettings();
		this.background = $('<div>', { 'class': 'SGv2_Dark__colorModal_background' }).appendTo('body');
		this.content = $('<div class="SGv2_Dark__colorModal SGv2_Dark_popup"><div class="SGv2_Presets"><div class="popup__heading">Edit Settings For SGv2 Dark</div><i class="popup__icon fa fa-pencil-square-o "></i><span>Theme:</span><input type="radio" name="radioPreset" value="Preset1" id="radio1"><label for="radio1">1<span></span></label><input type="radio" name="radioPreset" value="Preset2" id="radio2"><label for="radio2">2<span></span></label><input type="radio" name="radioPreset" value="Preset3" id="radio3"><label for="radio3">3<span></span></label></div><div class="SGv2_Dark__tabs"><div id="SGv2_Dark__tab-1" class="SGv2_Dark__tab-active">A - G</div><div id="SGv2_Dark__tab-2">G - R</div><div id="SGv2_Dark__tab-3">S - Z</div></div><div class="SGv2_Dark__config"><div class="SGv2_Dark__OptionsContainer" id="SGv2_Dark__OptionsContainer-1"></div><div class="SGv2_Dark__OptionsContainer" id="SGv2_Dark__OptionsContainer-2"></div><div class="SGv2_Dark__OptionsContainer" id="SGv2_Dark__OptionsContainer-3"></div><div class="SGv2_Dark__Buttons"></div><div class="SGv2_Dark__Settings_Container"><div class="SGv2_Dark__Settings_Header">Import/Export Settings</div><div class="SGv2_Dark__Settings_Content"><div class="SGv2_Dark__Current_Settings"><div class="form__heading__text" style="width: 187px; margin-top: 3px;">Current Settings:</div><input type="text" id="current_settings" value="'+ current.splice(1,(current.length-2)) +'"></div><div class="SGv2_Dark__Import_Settings"><div class="form__heading__text" style="width: 275px; margin-top: 3px;">Import Settings:</div><input type="text" id="import_settings" value=""><div class="comment__submit-button SGv2_Dark">Save to File</div><input id="loadFile" class="SGv2__Dark-loadfile" type="file" style="display: none;"><label for="loadFile" class="comment__submit-button" style="width: 155px;">Load from File</label></div><div class="SGv2_Dark__Preset_Settings"><div class="form__heading__text" style="width: 187px; margin-top: 3px;">Theme #1:</div><input type="text" name="Preset" id="Preset1" value=""></div><div class="SGv2_Dark__Preset_Settings"><div class="form__heading__text" style="width: 187px; margin-top: 3px;">Theme #2:</div><input type="text" name="Preset" id="Preset2" value=""></div><div class="SGv2_Dark__Preset_Settings" style="padding-bottom: 20px;"><div class="form__heading__text" style="width: 187px; margin-top: 3px;">Theme #3:</div><input type="text" name="Preset" id="Preset3" value=""></div></div></div></div>').appendTo('body');
		this.config = [];
		this.update = function (config) {
			for (var i = 0; i < _this.config.length; i++) {
				_this.config[i].val(config[i]);
			};
			return _this;
		};
		this.show = function () {
			_this.background.show();
			_this.content.show();
			return _this;
		};
		this.hide = function () {
			_this.background.hide();
			_this.content.hide();
			return _this;
		};
		this.save = function () {
			var args = [];
			for (var i = 0; i < _this.config.length; i++)
				{args.push(_this.config[i].val());}
			_this.callback(args);
			applyStyles('save');
			$('style[id="SGv2 Temp"]').remove();
			confirmMessage('Settings Saved');
		};
		this.reset = function () {
			localStorage.removeItem('SGv2 Dark Colors');
			applyStyles('reset');
			$('style[id="SGv2 Temp"]').remove();
			confirmMessage('Settings Reset To Default');
		};
		this.callback = callback;
		var optionline = function (optionName, inputType, id) {
			var input = $('<input>', { type: inputType });
			_this.config.push(input);
			return $('<div class="SGv2_Dark__Option" id="' + id + '"><span class="form__heading__text">' + optionName + '</span></div>').add(input);
		};
		var options=[["Settings","text"],["Image Opacity","text","210"],["Page Background","color","260"],["Heading/Giveaway Name Text","color","190"],["Links","color","230"],["Content Background","color","80"],["Comment Children Background","color","70"],["Sidebar/Breadcrumbs Text","color","370"],["General Text","color","130"],["Secondary Text","color","310"],["Sidebar/Table Heading Text","color","380"],["Input Background","color","220"],["Table Heading Background","color","400"],["Giveaway Columns Background","color","140"],["Image background","color","200"],["Page Heading/Menus Background","color","270"],["Sidebar Background","color","360"],["Developer Giveaway Background","color","100"],["Green Buttons Background","color","150"],["red Buttons Background","color","280"],["Yellow Buttons Background","color","480"],["Silver Buttons Background","color","390"],["Group Button Background","color","170"],["Whitelist Button Background","color","470"],["Text Shadows","color","410"],["Text Shadow Opacity","text","420"],["Content Opacity","text","90"],["Header/Footer Background","color","180"],["Nav Button Background","color","240"],["Background Image Opacity","text","40"],["Background Image Brightness","text","30"],["Background Image Blur","text","20"],["Background Image Saturation","text","50"],["Background Image","text","10"],["Shadows","color","340"],["Shadow Opacity","text","350"],["Green Icons/Text","color","160"],["Red Icons/Text","color","290"],["Featured Background","color","110"],["Visited Threads","color","490"],["Colored Name/Level","text","60"],["Trade Have Background","color","450"],["Trade Want Background","color","460"],["Navigation Text","color","250"],["Selection Highlight Background","color","320"],["Selection Highlight Text","color","330"],["Scrollbar","color","300"],["Featured Background Image","text","120"],["Tooltip Background","color","430"],["Tooltip Text","color","440"],["Fixed Page Width","text","125"],["Button Hover Brightness","text","51"],["Nav Button Hover Brightness","text","245"],["Nav Button Hover Saturation","text","248"],["Code Background","color","57"],["Code Text","color","58"],["List Text","color","235"],["Blockquote Background","color","52"],["Blockquote Text","color","53"],["Poll Background","color","272"],["Chart Background","color","54"],["Chart Heading Text","color","55"],["Heading Size 1 Text","color","192"],["Heading Size 2 Text","color","195"],["Heading Size 3 Text","color","198"],["Poll Text","color","274"],["Poll Question Text","color","277"],["Row Hover Brightness","text","295"],["Chart Text","color","56"]];
		var optionLength = options.length;
		var SGv2Options =[];
		for (var i = 0; i < optionLength ; i++) {
			SGv2Options.push((optionline(options[i][0], options[i][1], options[i][2], options[i][3], options[i][4], options[i][5], options[i][6], options[i][7], options[i][8], options[i][9], options[i][10], options[i][11], options[i][12], options[i][13], options[i][14], options[i][15], options[i][16], options[i][17], options[i][18], options[i][19], options[i][20], options[i][21], options[i][22], options[i][23], options[i][24], options[i][25], options[i][26], options[i][27], options[i][28], options[i][29], options[i][30], options[i][31], options[i][32], options[i][33], options[i][34], options[i][35], options[i][36], options[i][37], options[i][38], options[i][39], options[i][40], options[i][41], options[i][42], options[i][43], options[i][44], options[i][45], options[i][46], options[i][47], options[i][48], options[i][49], options[i][50], options[i][51], options[i][52], options[i][53], options[i][54], options[i][55], options[i][56], options[i][57], options[i][58], options[i][59], options[i][60], options[i][61], options[i][62], options[i][63], options[i][64], options[i][65], options[i][66], options[i][67])));
		}
		SGv2Options.splice(0,1);
 		SGv2Options.sort(function (a, b) {
			return +a[0].id - +b[0].id;
		});
 		$('#SGv2_Dark__OptionsContainer-1').append(SGv2Options.slice(0, 24)); $('#SGv2_Dark__OptionsContainer-2').append(SGv2Options.slice(24, 48)); $('#SGv2_Dark__OptionsContainer-3').append(SGv2Options.slice(48, 72));
		$('.SGv2_Dark__Buttons').append($('<div>', { 'class': 'SGv2_Dark__sidebar__entry-insert', text: 'save', click: this.save }), $('<div>', { 'class': 'SGv2_Dark__sidebar__entry-delete', text: 'reset', click: this.reset }), $('<div>', { 'class': 'SGv2_Dark__sidebar__error', text: 'cancel', click: this.hide  }));
		$('.SGv2_Dark__config input').change(function () {
			var args = [];
			for (var i = 0; i < _this.config.length; i++)
				{args.push(_this.config[i].val());}
			new CustomColors().calcSettings(args);
			$('style[id="SGv2 Temp"]').remove();
			addCss('Temp', args, 'SGv2 Temp');
		});
		this.background.click(this.hide);
		this.hide();
	}
	return CustomColorsConfig;
})();

var CustomColors = (function () {


	function CustomColors() {

		this.updateCache = function (config) {
				new CustomColors().calcSettings(config);
				localStorage.setItem('SGv2 Dark Colors', JSON.stringify(config));
		};

		this.calcSettings = function (config) {
				config[0] = {'5': Color(config[17], 0, 0, 0, (config[26])),'6': Color(config[6], 0, 0, 0, (config[26])),'7': Color(config[11], 0, 0, 0, (config[26])),'8': Color(config[5], 0, 0, 0, (config[26])),'9': Color(config[2], 0, 0, 0, (config[29])),'10': Color(config[24], 0, 0, 0, (+config[25]+ (+0.999))), '11': Color(config[24], 0, 0, 0, (+config[25]+ (+0.7))), '12': Color(config[24], 0, 0, 0, (+config[25]+ (+0.8))), '13': Color(config[24], 0, 0, 0, (+config[25]+ (+0.5))), '14': Color(config[24], 0, 0, 0, (+config[25]+ (+0.4))), '15': Color(config[24], 0, 0, 0, (+config[25]+ (+0.6))), '16': Color(config[15], 0, 0, -7), '17': Color(config[28], 0, 0, 2), '18': Color(config[28], 0, 7, 12), '19': Color(config[28], 0, 2, -12), '20': Color(config[27], 0, -4, 11), '21': Color(config[27], 0, -4, 2), '22': Color(config[28], 0, 7, 16), '23': Color(config[28], 0, 8, -8), '24': Color(config[5], 0, 0, 13), '25': Color(config[21], 0, 0, 11), '26': Color(config[21], 0, 0, -15), '27': Color(config[21], 0, 0, 27), '28': Color(config[21], 0, 0, 18), '29': Color(config[21], 0, 0, 8), '30': Color(config[3], 0, 0, 15), '31': Color(config[21], 0, 0, 35), '32': Color(config[6], 0, 4, 7), '33': Color(config[8], 0, 0, 15), '34': Color(config[6], 0, 7, 15), '35': Color(config[5], 0, 0, 6), '36': Color(config[43], 0, 0, 10), '37': Color(config[5], 0, 0, -7), '38': Color(config[5], 0, 0, 12), '39': Color(config[13], 0, 0, -3), '40': Color(config[13], 0, 0, -11), '41': Color(config[13], 0, 0, 9), '42': Color(config[13], 0, 0, 4, 0.35), '43': Color(config[28], 0, -6, 22), '44': Color(config[28], 0, -6, 17), '45': Color(config[28], 0, -6, -3),
'46': Color(config[5], 0, 0, 22), '47': Color(config[8], 0, 0, 2), '48': Color(config[28], 0, 12, -8), '49': Color(config[28], 0, 12, -12), '50': Color(config[14], 0, 0, 15), '51': Color(config[20], 3, 8, 28), '52': Color(config[20], -3, -13, -8), '53': Color(config[20], -3, 14, -23), '54': Color(config[20], -3, 28, -33), '55': Color(config[5], 0, 0, 20), '56': Color(config[20], 0, 0, -5), '57': Color(config[6], 0, 17, 27), '58': Color(config[8], 0, 0, -3), '59': Color(config[8], 0, 0, 7), '60': Color(config[15], 0, 7, -20), '61': Color(config[15], 0, 0, 5), '62': Color(config[15], 0, 0, -6), '63': Color(config[18], 1, -24, 13), '64': Color(config[18], -3, 7, -11), '65': Color(config[18], -5, -13, 25), '66': Color(config[18], -4, 2, 9), '67': Color(config[18], 0, 1, 5), '68': Color(config[9], 0, 0, 8), '69': Color(config[18], 15, -15, 48), '70': Color(config[18], 1, -24, 7), '71': Color(config[18], 0, -13, 5), '72': Color(config[18], 0, 3, 9), '73': Color(config[18], 0, 0, 14), '74': Color(config[9], 0, 15, 12), '75': Color(config[18], -3, -32, 23), '76': Color(config[18], 3, 39, 58), '77': Color(config[19], 0, -11, 10), '78': Color(config[19], 0, 19, -11), '79': Color(config[19], 0, -6, 21), '80': Color(config[19], 0, 45, 49), '81': Color(config[19], 0, 0, 15), '82': Color(config[19], 0, 14, 12), '83': Color(config[17], 0, -12, -5, (config[26])), '84': Color(config[17], 0, -5, 12), '85': Color(config[17], 0, 0, -9), '86': Color(config[17], 0, 0, 4), '87': Color(config[4], 4, 13, 14), '88': Color(config[4], 0, 28, 11), '89': Color(config[11], 0, 0, -5), '90': Color(config[11], 0, 0, 17, 0.6), '91': Color(config[11], 0, 0, 13),
'92': Color(config[11], 0, 0, 9), '93': Color(config[11], 0, 0, 36), '94': Color(config[11], 0, 0, 38), '95': Color(config[19], 0, 11, 32), '96': Color(config[19], 0, -9, 15), '97': Color(config[19], 0, 2, 7), '98': Color(config[11], 0, 0, 51), '99': Color(config[19], 0, 45, 50), '100': Color(config[20], -3, -3, -7), '101': Color(config[20], -3, 23, -25), '102': Color(config[20], -2, 38, -33), '103': Color(config[20], -3, 13, 15), '104': Color(config[20], -2, 15, -17), '105': Color(config[58], 0, -28, -13), '106': Color(config[20], 0, -31, 2), '107': Color(config[58], 0, -28, 0, 0.64), '108': Color(config[41], 0, 40, 40, 0.37), '109': Color(config[41], 0, 0, 0, 0.37), '110': Color(config[42], 0, 0, 0, 0.37), '111': Color(config[42], 0, 36, 30, 0.37), '112': Color(config[18], 3, -15, 52), '113': Color(config[21], 0, 0, -50, 0.75), '114': Color(config[21], 0, 0, -25, 0.5), '115': Color(config[21], 0, 0, -50, 0.5), '116': Color(config[21], 0, 0, -45, 0.5), '117': Color(config[21], 0, 0, 0, 0.05), '118': Color(config[21], 0, 0, 0, 0.5), '119': Color(config[18], 0, -10, 58), '120': Color(config[21], 0, 0, 6), '121': Color(config[21], 0, 0, -27), '122': Color(config[21], 0, 0, 17), '123': Color(config[21], 0, 0, 4), '124': Color(config[21], 0, 0, -2), '125': Color(config[14], 0, 0, -5), '126': Color(config[14], 0, 0, 10), '127': Color(config[21], 0, 0, 24), '128': Color(config[21], 0, 0, -19), '129': Color(config[21], 0, 0, -37), '130': Color(config[21], 0, 0, -40), '131': Color(config[18], 0, -11, 22, 0.5), '132': Color(config[18], 0, -11, -28, 0.5), '133': Color(config[18], 0, -11, -23, 0.5), '134': Color(config[18], 0, -11, 22, 0.05),
'135': Color(config[21], 0, 0, 3), '136': Color(config[18], 0, -29, -17), '137': Color(config[21], 0, 0, 21), '138': Color(config[18], 0, -11, -28, 0.75), '139': Color(config[18], 0, -11, -3, 0.5), '140': Color(config[21], 0, 0, -1), '141': Color(config[2], 0, 0, -35, 1), '142': Color(config[2], 0, 0, -15, 0.55), '143': Color(config[21], 0, 0, 38), '144': Color(config[16], 0, 0, -5, (config[26])), '145': Color(config[16], 0, 0, -14.5, (config[26])), '146': Color(config[16], 0, 0, 7), '147': Color(config[16], 0, 0, 5, 1), '148': Color(config[16], 0, 0, 5, 0.5), '149': Color(config[16], 0, 0, 2, 1), '150': Color(config[34], 0, 0, 0, (+config[35]+ (-0.001))), '151': Color(config[7], 0, -48, -12), '152': Color(config[16], 0, 0, 2), '153': Color(config[8], 0, 0, 7, 0.7), '154': Color(config[37], 0, -31, -12, 1), '155': Color(config[36], 0, -11, -3, 1), '156': Color(config[36], 0, 0, 0, 0.55), '157': Color(config[36], 0, 0, -5, 1), '158': Color(config[16], 0, 0, 48), '159': Color(config[8], 0, 0, 0, 0.18), '160': Color(config[11], 0, 0, 9), '161': Color(config[8], 0, 0, 0, 0.8), '162': Color(config[21], 0, 0, 6), '163': Color(config[21], 0, 0, -38), '164': Color(config[21], 0, 0, 21), '165': Color(config[21], 0, 0, 4), '166': Color(config[21], 0, 0, -7),'167': Color(config[21], 0, 0, 30), '168': Color(config[8], 0, 0, 0, 0.3), '170': Color(config[15], 0, 0, -6, 1), '171': Color(config[9], 0, -10, 0, 0.8), '172': Color(config[38], 0, 0, -14.5, (config[26])), '173': Color(config[38], 0, 0, 2, 1), '174': Color(config[37], 0, 10, 5, 1), '175': Color(config[37], 0, -9, -15, 1), '176': Color(config[46], 0, 0, -5),
'177': Color(config[46], 0, 0, -6),'178': Color(config[46], 0, 0, 4), '179': Color(config[21], 0, 0, -13), '180': Color(config[21], 0, 0, -41), '181': Color(config[21], 0, 0, -4), '182': Color(config[21], 0, 0, -9), '183': Color(config[21], 0, 0, -16), '184': Color(config[37], 0, -6, -25), '185': Color(config[16], 0, 0, -10.5, 1), '186': Color(config[48], 0, 0, 13), '187': Color(config[19], 0, 13, -8), '188': Color(config[48], 0, 0, -3), '189': Color(config[2], 0, 0, 3, 1), '190': Color(config[2], 0, 0, 9, 1), '191': Color(config[10], 0, 0, 7, 1), '192': Color(config[16], 0, 0, 48, 0.5), '193': Color(config[23], 0, -22, 4), '194': Color(config[23], 0, -18, -7), '195': Color(config[23], 0, -8, -21), '196': Color(config[23], 0, 12, 7), '197': Color(config[23], 0, 7, -5), '198': Color(config[23], 0, 7, 22), '199': Color(config[5], 0, -2, 14), '200': Color(config[10], 0, -10, -40), '201': Color(config[2], 0, -5, 10), '202': Color(config[18], -3, 7, -11), '203': Color(config[18], -4, -13, 25), '204': Color(config[8], 0, 0, 7, 0.5), '205': Color(config[2], 0, 0, -20, 0.2), '206': Color(config[2], 0, 0, -35, 0.35), '207': Color(config[18], 3, -3, 50), '208': Color(config[18], 3, -21, 15), '209': Color(config[18], 3, -16, 3), '210': Color(config[18], 3, -1, -7), '211': Color(config[18], 3, -4, 31), '212': Color(config[18], 3, -11, 17), '213': Color(config[18], 3, -8, 9), '214': Color(config[34], 0, 0, 0, (+config[35]+ (-0.3))), '215': Color(config[18], 3, -15, 53), '216': Color(config[16], 0, 0, -5), '217': Color(config[16], 0, 0, -14.5), '218': Color(config[34], 0, 0, 0, (+config[35]+ (-0.55))), '220': Color(config[54], 0, 0, 13),
'221': Color(config[57], 0, 0, 0, 0.3), '222': Color(config[59], 0, 0, 0, (config[26])), '223': Color(config[59], 0, 0, 13), '224': Color(config[59], 0, -4, 4), '225': Color(config[59], 0, 0, -7), '226': Color(config[59], 0, 0, 12), '227': Color(config[60], 0, 2, 3, (+config[26]+ (-0.35))), '228': Color(config[60], 0, 2, 17), '229': Color(config[59], 0, 0, 17), '230': Color(config[60], 0, 2, 8), '231': Color(config[65], 0, 0, -4), '232': Color(config[66], 0, -6, -15), '233': Color(config[37], 0, -14, -5), '234': Color(config[28], 0, 1, -8), '235': Color(config[28], 0, -100, -8), '236': Color(config[22], -3, -14, 1),'237': Color(config[22], 3, -10, -9), '238': Color(config[22], 0, 0, -20), '239': Color(config[22], -3, 12, 17), '240': Color(config[22], 0, 7, -5), '241': Color(config[22], -3, 24, 25), '242': Color(config[22], -3, 30, 35), '243': Color(config[28], 0, 7, 3), '249': Color(config[23], 0, -3, 39), '256': Color(config[21], 0, 0, 35), '258': Color(config[18], -3, -16, 3), '261': Color(config[18], 3, -11, 16), '265': Color(config[21], 0, 0, 9), '271': Color(config[21], 0, 0, 30), '272': Color(config[11], 0, 0, 46), '273': Color(config[8], 0, 0, 12),'275': Color(config[5], 0, 0, 3), '276': Color(config[5], 0, 0, 16), '286': Color(config[8], 0, 0, 5), '287': Color(config[5], 0, 0, 69), '288': Color(config[21], 0, 0, 42), '289': Color(config[21], 0, 0, 43), '290': Color(config[21], 0, 0, -3), '291': Color(config[21], 0, 0, 7), '292': Color(config[23], 0, -2, 44), '293': Color(config[23], 0, 8, 4) , '294': Color(config[23], 0, 5, -4), '295': Color(config[23], 0, -8, -19), '296': Color(config[23], 0, -18, -7), '297': Color(config[23], 0, -22, -4), '298': Color(config[23], 0, -8, 11), '299': Color(config[2], 0, 0, 50)};
				config.push('SGv2 Dark Version ' + GM_info.script.version + '');
				return config;
			};
	}

	CustomColors.prototype.render = function () {
		var _this = this;
		this.colorConfigModal = new CustomColorsConfig(this.updateCache);
		config = getSettings();
		$('.SGv2-Dark-button').on('click', '.SGv2_edit', function () {
			$('style[id="SGv2 Temp"]').remove();
			showConfigValues();
			_this.colorConfigModal.update(config).show();
		});
	};
	return CustomColors;
})();

var defaultconfig = function () {
	return [{"5":"hsla(208,18%,14%,1)","6":"hsla(180,3%,13%,1)","7":"hsla(0,0%,20%,1)","8":"hsla(60,4%,9%,1)","9":"hsla(60,12%,7%,1)","10":"hsla(0,0%,0%,0.999)","11":"hsla(0,0%,0%,0.7)","12":"hsla(0,0%,0%,0.8)","13":"hsla(0,0%,0%,0.5)","14":"hsla(0,0%,0%,0.4)","15":"hsla(0,0%,0%,0.6)","16":"hsla(0,0%,22%,1)","17":"hsla(225,16%,40%,1)","18":"hsla(215,13%,50%,1)","19":"hsla(225,18%,26%,1)","20":"hsla(210,8%,21%,1)","21":"hsla(210,8%,12%,1)","22":"hsla(215,13%,54%,1)","23":"hsla(215,14%,30%,1)","24":"hsla(60,2%,23%,1)","25":"hsla(0,0%,61%,1)","26":"hsla(0,0%,35%,1)","27":"hsla(0,0%,77%,1)","28":"hsla(0,0%,68%,1)","29":"hsla(0,0%,58%,1)","30":"hsla(0,0%,79%,1)","31":"hsla(0,0%,85%,1)","32":"hsla(180,7%,20%,1)","33":"hsla(0,0%,78%,1)","34":"hsla(180,10%,28%,1)","35":"hsla(60,2%,16%,1)","36":"hsla(0,0%,88%,1)","37":"hsla(60,2%,4%,1)","38":"hsla(60,2%,21%,1)","39":"hsla(60,1%,20%,1)","40":"hsla(60,1%,12%,1)","41":"hsla(60,1%,32%,1)","42":"hsla(60,1%,27%,0.35)","43":"hsla(215,0%,60%,1)","44":"hsla(215,0%,55%,1)","45":"hsla(215,0%,35%,1)","46":"hsla(60,2%,32%,1)","47":"hsla(0,0%,65%,1)","48":"hsla(215,18%,30%,1)","49":"hsla(215,18%,26%,1)","50":"hsla(0,0%,33%,1)","51":"hsla(63,70%,85%,1)","52":"hsla(57,49%,49%,1)","53":"hsla(57,76%,34%,1)","54":"hsla(57,90%,24%,1)","55":"hsla(60,2%,30%,1)","56":"hsla(60,62%,52%,1)","57":"hsla(180,20%,40%,1)","58":"hsla(0,0%,60%,1)","59":"hsla(0,0%,70%,1)","60":"hsla(0,7%,9%,1)","61":"hsla(0,0%,34%,1)","62":"hsla(0,0%,23%,1)","63":"hsla(92,37%,41%,1)","64":"hsla(88,68%,17%,1)","65":"hsla(86,48%,53%,1)","66":"hsla(87,63%,37%,1)","67":"hsla(91,62%,33%,1)","68":"hsla(213,13%,64%,1)","69":"hsla(106,46%,76%,1)","70":"hsla(92,37%,35%,1)","71":"hsla(91,48%,33%,1)","72":"hsla(91,64%,37%,1)","73":"hsla(91,61%,42%,1)","74":"hsla(213,28%,68%,1)","75":"hsla(88,29%,51%,1)","76":"hsla(94,100%,86%,1)","77":"hsla(0,44%,45%,1)","78":"hsla(0,74%,24%,1)","79":"hsla(0,49%,56%,1)","80":"hsla(0,100%,84%,1)","81":"hsla(0,55%,50%,1)","82":"hsla(0,69%,47%,1)","83":"hsla(208,6%,9%,1)","84":"hsla(208,13%,26%,1)","85":"hsla(208,18%,5%,1)","86":"hsla(208,18%,18%,1)","87":"hsla(205,56%,71%,1)","88":"hsla(201,71%,68%,1)","89":"hsla(0,0%,15%,1)","90":"hsla(0,0%,37%,0.6)","91":"hsla(0,0%,33%,1)","92":"hsla(0,0%,29%,1)","93":"hsla(0,0%,56%,1)","94":"hsla(0,0%,58%,1)","95":"hsla(0,66%,67%,1)","96":"hsla(0,46%,50%,1)","97":"hsla(0,57%,42%,1)","98":"hsla(0,0%,71%,1)","99":"hsla(0,68%,80%,1)","100":"hsla(57,59%,50%,1)","101":"hsla(57,85%,32%,1)","102":"hsla(58,100%,24%,1)","103":"hsla(57,75%,72%,1)","104":"hsla(58,77%,40%,1)","105":"hsla(60,2%,50%,1)","106":"hsla(60,31%,59%,1)","107":"hsla(60,2%,63%,0.64)","108":"hsla(0,60%,71%,0.37)","109":"hsla(0,20%,31%,0.37)","110":"hsla(184,17%,33%,0.37)","111":"hsla(184,53%,63%,0.37)","112":"hsla(94,46%,80%,1)","113":"hsla(0,0%,0%,0.75)","114":"hsla(0,0%,25%,0.5)","115":"hsla(0,0%,0%,0.5)","116":"hsla(0,0%,5%,0.5)","117":"hsla(0,0%,50%,0.05)","118":"hsla(0,0%,50%,0.5)","119":"hsla(91,51%,86%,1)","120":"hsla(0,0%,56%,1)","121":"hsla(0,0%,23%,1)","122":"hsla(0,0%,67%,1)","123":"hsla(0,0%,54%,1)","124":"hsla(0,0%,48%,1)","125":"hsla(0,0%,13%,1)","126":"hsla(0,0%,28%,1)","127":"hsla(0,0%,74%,1)","128":"hsla(0,0%,31%,1)","129":"hsla(0,0%,13%,1)","130":"hsla(0,0%,10%,1)","131":"hsla(91,50%,50%,0.5)","132":"hsla(91,50%,0%,0.5)","133":"hsla(91,50%,5%,0.5)","134":"hsla(91,50%,50%,0.05)","135":"hsla(0,0%,53%,1)","136":"hsla(91,32%,11%,1)","137":"hsla(0,0%,71%,1)","138":"hsla(91,50%,0%,0.75)","139":"hsla(91,50%,25%,0.5)","140":"hsla(0,0%,49%,1)","141":"hsla(60,12%,0%,1)","142":"hsla(60,12%,0%,0.55)","143":"hsla(0,0%,88%,1)","144":"hsla(0,0%,17%,1)","145":"hsla(0,0%,7.5%,1)","146":"hsla(0,0%,29%,1)","147":"hsla(0,0%,27%,1)","148":"hsla(0,0%,27%,0.5)","149":"hsla(0,0%,24%,1)","150":"hsla(0,0%,0%,0.799)","151":"hsla(202,14%,55%,1)","152":"hsla(0,0%,24%,1)","153":"hsla(0,0%,70%,0.7)","154":"hsla(0,49%,48%,1)","155":"hsla(90,39%,47%,1)","156":"hsla(90,50%,50%,0.55)","157":"hsla(90,50%,45%,1)","158":"hsla(0,0%,70%,1)","159":"hsla(0,0%,63%,0.18)","160":"hsla(0,0%,29%,1)","161":"hsla(0,0%,63%,0.8)","162":"hsla(0,0%,56%,1)","163":"hsla(0,0%,12%,1)","164":"hsla(0,0%,71%,1)","165":"hsla(0,0%,54%,1)","166":"hsla(0,0%,43%,1)","167":"hsla(0,0%,80%,1)","168":"hsla(0,0%,63%,0.3)","170":"hsla(0,0%,23%,1)","171":"hsla(213,3%,56%,0.8)","172":"hsla(0,0%,7.5%,1)","173":"hsla(0,0%,24%,1)","174":"hsla(0,76%,60%,1)","175":"hsla(0,71%,45%,1)","176":"hsla(0,0%,10%,1)","177":"hsla(0,0%,9%,1)","178":"hsla(0,0%,19%,1)","179":"hsla(0,0%,37%,1)","180":"hsla(0,0%,9%,1)","181":"hsla(0,0%,46%,1)","182":"hsla(0,0%,41%,1)","183":"hsla(0,0%,34%,1)","184":"hsla(0,60%,30%,1)","185":"hsla(0,0%,11.5%,1)","186":"hsla(0,0%,25%,1)","187":"hsla(0,68%,27%,1)","188":"hsla(0,0%,9%,1)","189":"hsla(60,15%,8%,1)","190":"hsla(60,12%,16%,1)","191":"hsla(213,19%,70%,1)","192":"hsla(0,0%,70%,0.5)","193":"hsla(185,31%,45%,1)","194":"hsla(185,35%,34%,1)","195":"hsla(185,45%,20%,1)","196":"hsla(185,65%,48%,1)","197":"hsla(185,60%,36%,1)","198":"hsla(185,60%,63%,1)","199":"hsla(60,0%,24%,1)","200":"hsla(213,9%,23%,1)","201":"hsla(60,10%,15%,1)","202":"hsla(88,68%,17%,1)","203":"hsla(87,48%,53%,1)","204":"hsla(0,0%,70%,0.5)","205":"hsla(60,12%,0%,0.2)","206":"hsla(60,12%,0%,0.35)","207":"hsla(94,58%,78%,1)","208":"hsla(94,40%,43%,1)","209":"hsla(94,45%,31%,1)","210":"hsla(94,60%,21%,1)","211":"hsla(94,57%,59%,1)","212":"hsla(94,50%,45%,1)","213":"hsla(94,53%,37%,1)","214":"hsla(0,0%,0%,0.5)","215":"hsla(94,46%,81%,1)","216":"hsla(0,0%,17%,1)","217":"hsla(0,0%,7.5%,1)","218":"hsla(0,0%,0%,0.25)","220":"hsla(60,2%,26%,1)","221":"hsla(0,0%,0%,0.3)","222":"hsla(60,4%,9%,1)","223":"hsla(60,2%,23%,1)","224":"hsla(0, 0%, 13%,1)","225":"hsla(60,4%,2%,1)","226":"hsla(60,4%,21%,1)","227":"hsla(60,2%,16%,0.65)","228":"hsla(60,2%,30%,1)","229":"hsla(60,4%,26%,1)","230":"hsla(60,4%,21%,1)","231":"hsla(0,0%,60%,1)","232":"hsla(213,13%,48%,1)","233":"hsla(0,66%,55%,1)","234":"hsla(225,17%,30%,1)","235":"hsla(225,0%,30%,1)","236":"hsla(113,30%,46%,1)","237":"hsla(119,34%,36%,1)","238":"hsla(116,44%,25%,1)","239":"hsla(113,56%,62%,1)","240":"hsla(116,51%,40%,1)","241":"hsla(113,68%,70%,1)","242":"hsla(113,74%,80%,1)","243":"hsla(225,23%,41%,1)","249":"hsla(185,50%,80%,1)","256":"hsla(0,0%,85%,1)","258":"hsla(88,45%,31%,1)","261":"hsla(94,50%,44%,1)","265":"hsla(0,0%,59%,1)","271":"hsla(0,0%,80%,1)","272":"hsla(0,0%,66%,1)","273":"hsla(0,0%,75%,1)","275":"hsla(60,2%,13%,1)","276":"hsla(60,2%,26%,1)","286":"hsla(0,0%,68%,1)","287":"hsla(60,2%,79%,1)","288":"hsla(0,0%,92%,1)","289":"hsla(0,0%,93%,1)","290":"hsla(0,0%,47%,1)","291":"hsla(0,0%,57%,1)","292":"hsla(185,51%,85%,1)","293":"hsla(185,61%,45%,1)","294":"hsla(185,58%,37%,1)","295":"hsla(185,45%,22%,1)","296":"hsla(185,35%,34%,1)","297":"hsla(185,31%,37%,1)","298":"hsla(185,45%,52%,1)"},"0.8","#0f0f0b","#a4a4a4","#619ec0","#191917","#212323","#75b9df","#a0a0a0","#808d9d","#8f9fb3","#343434","#212121","#3c3c3b","#2f2f2f","#4b4b4b","#373737","#1e252b","#46721c","#882828","#d5d54e","#808080","#46a640","#3197a0","#000000","0","1","#171a1c","#515970","1","1","0","1","","#000000","0.8","#80bf40","#eb4747","#373737","#84AF59","1","#5f3f3f","#466062","#d1d1d1","#4d4d4d","#53bff9","#262626","1","#1f1f1f","#a6a6a6","0","1.25","1.25","1.5","#222220","#b7b776","#d84141","#000000","#a0a0a0","#191917","#212121","#8f9fb3","#adadad","#adadad","#adadad","#a4a4a4","#8f9fb3","1.25","#a0a0a0",'SGv2 Dark Version ' + GM_info.script.version + ''];
};

function getCss(temp) {
	if (temp !== undefined) {
		config = temp;
	} else {
		var settings = getSettings();
		if (settings === null) {
			var config = defaultconfig();
			localStorage.setItem('SGv2 Dark Colors', JSON.stringify(config));
		} else {
			config = settings;
		}
	}
	if (config[47] == '1') {
		this.background = '';
	} else {
		this.background = 'background-image: linear-gradient(' + config[0][173] + ' 0%, ' + config[0][172] + ' 100%)';
	}
	if (config[50] == '1') {
		this.width = 'max-width: 1400px';
		this.rwidth = 'max-width: 1169px';
		this.wwidth = 'max-width: 1041px';
		this.lwidth = 'max-width: 980px !important';
	} else {
		this.width = '';
		this.rwidth = '';
		this.wwidth = '';
		this.lwidth = '';
	}
	if (window.location.host == 'www.sgtools.info') {
		this.zindex = 'z-index: 0';
		this.backcolor = 'background-color: ' + config[2] + ' !important';
	} else {
		this.zindex = 'z-index: -1';
		this.backcolor = '';
	}
	if (config[33] == '') {
		this.bshadow = 'box-shadow: -9px 0 0 0 ' + config[2] + ', 50px 0 0 0 ' + config[2] + '';
		this.bborder = 'border-bottom: 1px solid ' + config[0][24] + '';
		this.bimage = '';
		this.filter = '';
	} else {
		this.bshadow = '';
		this.bborder = 'border-bottom: 1px solid ' + config[0][299] + '';
		this.bimage = 'background: url(' + config[33] + ') top center/cover no-repeat fixed';
		this.filter = 'filter: opacity(' + config[29] + ') brightness(' + config[30] + ') blur(' + config[31] + 'px) saturate(' + config[32] + ')';
	}
	if (window.location.pathname.match(/^\/giveaway\//)) {
		this.esgstsidebar = 'min-width: 334px; max-width: 334px';
		this.esgstfmph = 'width: calc(100% - 409px) !important';
		this.mwidth = wwidth;
	} else {
		this.esgstsidebar = '';
		this.esgstfmph = '';
		this.mwidth = '';
	}

var css = '\
/* SGv2 Dark Stylesheet */\
html {\
	' + backcolor + ';\
	background-image: none;\
}\
body {\
	background-color: ' + config[2] + ' !important;\
	background-image: none;\
}\
.sidebar__entry-insert, .sidebar__action-button, .nav__sits, .form__submit-button, .form__sync-default, .featured__action-button, #content button[type="submit"], #content #activated_send, #content #real_cv_send, #content #multiple_wins_send, #content #giveaway_Create, .entry.validEntry, #content .rulePassed, .SGv2_Dark__sidebar__entry-insert, .btn_action.green, #content .manageGa a, #content #gaurl a, #content .back-guide a, #content .gaButton, .giveaway__column--contributor-level--positive, .featured__column--contributor-level--positive, .cmGame:not(.notFound), .cmGame.whitelisted, #content .showBundledDeals, #content #giveaway_filters_Update, .page__heading__button--green, .page_heading_btn.green, .notification--success, .notification.green, .sale-savings--high, .offer__discount, #content .deal_game_discount, .btn-success, #btn-get, .esgst-notification-success, .esgst-sttb-button, .sgapi__alert.alert.alert-info {\
	background-image: linear-gradient(' + config[0][63] + ' 0%, ' + config[18] + '  50%, ' + config[0][64] + ' 100%) !important;\
	background-color:transparent!important;\
	border-color: ' + config[0][65] + ' ' + config[0][66] + ' ' + config[0][67] + ' ' + config[0][66] + ' !important;\
	color: ' + config[0][112] + ' !important;\
	cursor: pointer;\
	text-shadow: 1px 1px ' + config[0][13] + ', 0 0 2px ' + config[0][10] + ' !important;\
	transition: filter 0.35s ease-in;\
	will-change: filter;\
}\
#content #gaurl a {\
	border: none !important;\
	box-shadow: 0 0 1px #000;\
	padding: 9px 36px 10px !important;\
}\
#content .center.left p:last-of-type {margin-top:20px;}\
.featured__outer-wrap--giveaway:last-of-type, #help ~ .featured__outer-wrap:last-of-type {margin-bottom: 25px;}\
#content .pagination {\
	border: none !important;\
	box-shadow: none !important;\
}\
.nav_btn:not(.is_selected) .message_count, .nav__button .nav__notification {\
	transition: filter 0.35s ease-in;\
	will-change: filter;\
}\
#content .rulePassed {\
	border-radius: 4px;\
	cursor: default;\
	filter: saturate(2);\
}\
#dateBtn {\
	margin-top: 15px;\
	line-height: 27px;\
	height: 27px !important;\
}\
.SGPP__gridTileIcons > * {border: 1px solid;}\
.author_avatar.is_icon {\
	color: ' + config[37] + ';\
	background-color: ' + config[14] + ';\
	border: 1px solid ' + config[0][50] + ';\
}\
.align-button-container > .comment__submit-button + .comment__submit-button {margin: 0 0 0 5px !important;}\
a.featured__column.featured__column--group {color: ' + config[0][242] + ' !important;}\
.b-modal, .esgst-popup-modal {\
	background-color: hsla(0, 0%, 8%, 1) !important;\
	opacity: 0.8;\
}\
.sg2o-modal-dialog {background-color: hsla(0,0%,8%,0.7) !important;}\
blockquote {\
	border-left: 1em solid #eee;\
	margin: 0.8em -1000px 0.75em 1em;\
	max-width: calc(100% - 90px);\
	padding: .6em 2.3em !important;\
	position: relative;\
	quotes: "“" "”" "“" "”";\
}\
blockquote:before {\
	color: ' + config[58] + ';\
	content: open-quote;\
	font-size: 4em;\
	left: 5px;\
	line-height: .1em;\
	margin-right: .25em;\
	position: absolute;\
	top: 22px;\
	vertical-align: -.4em;\
}\
blockquote::after {content: "";}\
.btn_action.green .fa-check:before {\
	color: inherit;\
	text-shadow: inherit;\
}\
.chart__heading {text-shadow: 1px 1px 1px ' + config[0][10] + ', 0 0 1px ' + config[0][10] + ';}\
.chart__heading__medium {color: ' + config[10] + ';}\
.chart__subheading {\
	color: ' + config[8] + ';\
	text-shadow: 1px 1px ' + config[0][12] + ';\
	opacity: 0.75;\
}\
.chart__subheading__green {color: ' + config[36] + ';}\
.chart:nth-of-type(even):not(#cvChartContainer), #charts, div#GaFormRealCV, div#GaFormRules, div#GaFormMisc, div#GaFormAdvanced, .creatorTools, .modTools, .cmGame.notFound {\
	background-color: ' + config[0][205] + ';\
	border: 1px solid ' + config[0][206] + ';\
}\
.chart--genre > .highcharts-container , .chart--giveaways-created > .highcharts-container, .chart--price > .highcharts-container {right: 4px;}\
.chart--metascore > .highcharts-container, .chart--release_date > .highcharts-container {right: 15px;}\
.chart__tooltip-header, .highcharts-tooltip p[style*="#808D9C"] {\
	color: ' + config[10] + ';\
	text-shadow: 1px 1px 1px ' + config[0][10] + ', 0 0 1px ' + config[0][10] + ' !important;\
}\
.chart__tooltip-point{text-shadow: 1px 1px 1px ' + config[0][10] + ', 0 0 1px ' + config[0][10] + ' !important;}\
.highcharts-tooltip p[style*="#6286D3"] {\
	color: ' + config[8] + ' !important;\
	text-shadow: 1px 1px 1px ' + config[0][10] + ', 0 0 1px ' + config[0][10] + ' !important;\
}\
#charts {\
	border-radius: 8px;\
	display: flex;\
	height: 325px !important;\
	padding-top: 10px;\
}\
#charts + .separator:before {\
	content: "Breakdown statistics";\
	color: hsl(213, 19%, 63%);\
	display: flex;\
	font-size: 24px;\
	font-weight: bold;\
	justify-content: center;\
	text-shadow: -1px 1px hsla(0, 0%, 0%, 0.99), 1px 1px hsla(0, 0%, 0%, 0.99), 0 0 1px hsla(0, 0%, 0%, 0.99), 0 0 1px hsla(0, 0%, 0%, 0.99);\
	position: relative;\
	bottom: 320px;\
}\
#content #charts h2.center, #content .sidebar__navigation:last-of-type + div, .is-hidden, #SGv2_Dark__OptionsContainer-2, #SGv2_Dark__OptionsContainer-3, .SGv2_Dark__Dialog .ui-dialog-titlebar, .SGv2_Presets input[type="radio"], .SGv2_Presets input[type="radio"] + label:before, img[title*="Extended Steamgifts"] {display: none;}\
#content form[name="giveaway_filters"] {width: 940px;}\
#content .sidebar--wide {min-width: inherit !important;}\
#content .sidebar__navigation {\
	margin-top: 5px;\
	padding: 4px;\
}\
#content .sidebar a {border: 1px solid transparent !important;}\
#content .sidebar__navigation__item__link:hover {\
	border: 1px solid !important;\
	border-color: ' + config[0][146] + ' ' + config[0][147] + ' ' + config[0][147] + ' ' + config[0][147] + ' !important;\
}\
#content .deal_game_image.global__image-outer-wrap {padding: 4px 4px 1px;}\
#content a.game_deal_wrapper.bundled {\
	background-color: hsla(0, 60%, 31%, 0.2);\
	border-color: hsla(0, 60%, 45%, 0.2) !important;\
}\
#content .game_deal_wrapper .deal_game_price {width: 100px;}\
#content .game_deal_wrapper .deal_game_title {\
	font-size: 17px;\
	margin-bottom: -10px;\
}\
#content .game_deal_wrapper:last-of-type {margin-bottom: 20px;}\
#content .deal_game_discount {font-size: 16px;}\
#content #keySellers, #content #resellers {margin-bottom: 15px;}\
#content .discount_percentage {color: ' + config[0][215] + ';}\
#content .store-entry .discount_percentage {color: hsl(94, 27%, 55%);}\
#content .discount_original_price {\
	color: ' + config[8] + ';\
	opacity: 0.6;\
}\
#content .stores h3 {\
	font-size: 24px;\
	font-weight: bold;\
	margin-bottom: 10px;\
}\
#content .fa-spinner {text-indent: 0;}\
#content .chart {\
	width: 254px;\
	margin-left: auto;\
	margin-right: auto;\
}\
.left .chart > div {left: 15px;}\
#charts svg {filter: brightness(80%);}\
#charts svg rect {fill: hsla(0, 0%, 0%, 0);}\
#content g path[fill="#cccccc"], #content g path[FILL="#cccccc"] {\
	fill: rgb(0, 0, 0);\
}\
#content g path[fill="#ffffff"], #content g path[FILL="#ffffff"] {fill: #444;}\
#content g path[stroke="#cccccc"], #content g path[STROKE="#cccccc"], #content g path[STROKE="#ffffff"], #content g path[stroke="#ffffff"], g ellipse[stroke="#ffffff"], #content g path[FILL="#ffffff"], #content g ellipse[STROKE="#ffffff"] {stroke: #000;}\
#content g text {text-shadow: none;}\
#content g g g text, #content g > g text {\
	fill: ' + config[49] + ';\
	text-shadow: 1px 1px 1px ' + config[0][10] + ', 0 0 1px ' + config[0][10] + ' !important;\
}\
div#GaFormRealCV, div#GaFormRules, div#GaFormMisc, div#GaFormAdvanced {\
	border-radius: 8px;\
	margin-left: 6px;\
	padding-left: 7px;\
	padding-top: 10px;\
}\
div#GaFormAdvanced {padding: 8px;}\
div#GaFormMisc {margin-top: 6px;}\
#GaFormAdvanced + .center {\
	background-color: transparent !important;\
	border: none !important;\
	box-shadow: none !important;\
	display: flex;\
	justify-content: center;\
}\
#GaFormAdvanced + .center #Update {width: 417px;}\
#content input#filterCustomRule, #content input[type="number"], #content input[type="text"]:not(#username) {\
	border-radius: 4px;\
	color: ' + config[0][286] + ' !important;\
	font-weight: 600;\
	text-indent: 5px;\
}\
::-webkit-input-placeholder {\
	color: ' + config[0][204] + ' !important;\
	text-shadow: 1px 1px hsla(0,0%,0%,0.7);\
}\
#content input#filterCustomRule:focus, #content input[type="number"]:focus, #content input[type="text"]:focus:not(#username) {\
	border-radius: 4px;\
	color: ' + config[0][273] + ' !important;\
	font-weight: 600;\
	text-indent: 5px;\
}\
#content textarea {\
	border-radius: 4px;\
	font-weight: 600;\
	padding: 5px 5px 3px;\
}\
#content #giveaway_giveawayUrl {width: 402px;}\
input#filterCustomRule {\
	margin-top: 10px;\
	width: 912px;\
}\
.creatorTools, .modTools {\
	border-radius: 8px;\
	display: flex;\
	justify-content: space-around;\
	flex-wrap: wrap;\
}\
.creatorTools h2, .modTools h2, .creatorTools p, .modTools p {\
	display: flex;\
	justify-content: center;\
	width: 100%;\
}\
#content p[style*="red"] {color: ' + config[37] + ' !important;}\
.entry.validEntry,.entry.notvalidEntry {\
    border-radius: 4px;\
    cursor: default !important;\
    max-width: 45%;\
    margin: 0 auto -10px;\
}\
.entry.validEntry {\
    border-color: hsl(88, 90%, 25%) !important;\
    background-image: linear-gradient(hsla(88,65%,44%,0.2) 0%,hsla(88,74%,21%,0.9) 100%) !important;\
}\
.entry.notvalidEntry {\
    background-color: transparent !important;\
    background-image: linear-gradient(hsla(0,65%,44%,0.23) 0%,hsla(0,74%,24%,0.9) 100%) !important;\
    border-color: #800 !important;\
    color: hsla(0,68%,80%,1) !important;\
}\
#content .rules {padding: 20px;}\
#content .featured__outer-wrap + .entry.validEntry, #content .featured__outer-wrap + .entry.notvalidEntry {margin-top: 25px;}\
#content .entries {margin-top: 40px;}\
#content .featured__outer-wrap {\
	background-color: transparent !important;\
	background-image: none;\
	border-radius: 4px;\
	max-width: 96%;\
	padding: 0;\
}\
#content .featured__inner-wrap {\
	background-image: url(https://cdn.steamgifts.com/img/bg.png);\
	' + background + ';\
	background-position: center top;\
	background-repeat: no-repeat;\
	background-size: cover;\
	border: 1px solid ' + config[0][24] + ';\
	border-radius: 4px;\
	padding: 25px 10px 25px 25px;\
}\
#content .featured__summary {padding: 0 10px 10px;}\
.gamanageicons {\
	left: -50px;\
	margin-left: 3px;\
	margin-right: -38px;\
	position: relative;\
}\
.gamanageicons .fa-trash-o {margin-left: 5px;}\
.gamanageicons .fa-pencil {margin-left: 8px;}\
.gastatus {margin-left: -28px;}\
.gastatus a {border: none !important;}\
.gastatus + a.global__image-outer-wrap.global__image-outer-wrap--game-large, .gamanageicons + a.global__image-outer-wrap.global__image-outer-wrap--game-large {\
	border: 1px solid ' + config[0][50] + ';\
	padding:5px !important;\
	border-radius:4px !important;\
	margin: 5px 5px 5px 16px !important;\
	background-color: hsla(0, 0%, 100%, 0.05) !important;\
	box-shadow: 2px 2px 3px hsla(0, 0%, 0%, 0.4) !important;\
	border-bottom-color: hsla(0, 0%, 100%, 0.05) !important;\
	border-left-color: hsla(0, 0%, 0%, 0.5) !important;\
	border-right-color: hsla(0, 0%, 100%, 0.05) !important;\
	border-top-color: hsla(0, 0%, 0%, 0.5) !important;\
}\
.gastatus + a.global__image-outer-wrap.global__image-outer-wrap--game-large:hover, .gamanageicons + a.global__image-outer-wrap.global__image-outer-wrap--game-large:hover, #content .deal_game_image.global__image-outer-wrap:hover {\
	background-color: hsla(0, 0%, 63%, 0.1) !important;\
	border: 1px solid ' + config[0][159] + ' !important;\
}\
.gamanageicons + a.global__image-outer-wrap.global__image-outer-wrap--game-large {margin: 10px 5px!important;}\
.gastatus + a + .featured__summary .featured__heading, .gamanageicons + a + .featured__summary .featured__heading {margin: 10px 0 0;}\
.gastatus + a + .featured__summary .featured__heading__small, .gamanageicons + a + .featured__summary .featured__heading__small {font-size: 14px;}\
#content .manageGa a, #content #gaurl a, #content .showBundledDeals, #content .back-guide a {\
	border: 1px solid;\
	border-radius: 4px;\
	font: bold 13.33px "Lato", sans-serif;\
	padding: 6px 10px;\
}\
#content .manageGa a:before, #content #gaurl a:before, #content .showBundledDeals:before, #content .back-guide a:before {margin-right: 5px;}\
#content .fa-exclamation {font-family: inherit;}\
#content .fa-pencil::before, #content .fa-exclamation:before, #content .fa-eye:before, #content .fa-eye-slash:before, #content .fa-arrow-left:before {font: normal normal normal 14px/1 FontAwesome;}\
#content .fa-exclamation:before {color: hsla(187,43%,55%,1);}\
#content input[type="checkbox"], .sgun__checkbox, input[id*="Checkbox"], input[id*="Endless"], input[id*="Merge"] {\
	filter: invert(0.9);\
}\
#content .featured__column:not(.featured__column--contributor-level--positive) {\
	color: ' + config[0][47] + ' !important;\
	background-color: hsla(0, 0%, 0%, 0.15);\
	border: 1px solid hsla(0, 0%, 0%, 0.2) !important;\
}\
#content .featured__heading {color: ' + config[0][273] + ' !important;}\
#content .featured__heading__medium {font-size: 20px;}\
#content .featured__heading__small {\
	color: ' + config[0][286] + ' !important;\
	font-size: 16px;\
}\
#content .featured__column a[style*="rgb(173,112,112)"], #content .featured__column i[style*="rgb(173,112,112)"] {\
	color: ' + config[37] + ' !important;\
	opacity: 1;\
}\
.manageGa + br ~ .featured__outer-wrap .featured__inner-wrap, #help ~ .featured__outer-wrap .featured__inner-wrap, #content .game_deal_wrapper {\
	background-image: none !important;\
	background-color: ' + config[0][205] + ';\
	border: 1px solid ' + config[0][206] + ' !important;\
}\
#content .featured__outer-wrap .global__image-outer-wrap--game-large img, .nav__button-container--notification {border-radius: 4px;}\
#content .featured__outer-wrap a:not(.global__image-outer-wrap) {border-bottom:transparent!important;}\
#content .global__image-outer-wrap--game-large.global__image-outer-wrap--missing-image-small {font-size: 42px;}\
#content .global__image-outer-wrap--game-large.global__image-outer-wrap--missing-image-small > .centerFa {width: 140px;}\
.goog-tooltip div, .esgst-feature-description, .jqstooltip {\
	background: ' + config[48] + ' !important;\
	border: 1px solid ' + config[0][186] + ' !important;\
	box-shadow: 2px 2px 8px 0 ' + config[0][150] + ' !important;\
	border-radius: 4px !important;\
	color: ' + config[49] + ' !important;\
	font-size: 12px;\
	padding: 4px !important;\
}\
.cmGame {\
	border-radius: 4px;\
	max-width: 85%;\
	margin: auto auto 4px auto;\
	height: 36px;\
	overflow: hidden;\
	padding: 0 5px;\
}\
.cmGame.multiplewins {\
	font: 0.95em/1.5em Open Sans, sans-serif;\
	height: auto;\
	line-height: 1.3em;\
	margin-bottom: 4px;\
	padding: 10px 5px;\
}\
.total + .separator + .cmGame:not(.multiplewins):not(.notActivatedGame) {\
	font-size: 15px;\
	width: 525px;\
	background-color: hsla(0, 65%, 44%, 0) !important;\
	border-color: hsl(88, 90%, 25%) !important;\
	background-image: linear-gradient(hsla(88, 65%, 44%, 0.2) 0%, hsla(88, 74%, 21%, 0.9) 100%) !important;\
}\
.total + .separator + .cmGame:not(.multiplewins), .cmGame.notActivatedGame {\
	font-size: 20px;\
	font-weight: bold;\
	line-height: 36px;\
}\
.total + .separator + .cmGame:not(.multiplewins) h2 {color: hsla(94, 46%, 80%, 0.9) !important;}\
#content:not(.entry):not(.cmGame) {\
	font-size: .95em;\
	padding: 65px 25px 0;\
	min-width: 950px;\
	margin-left: auto;\
	text-shadow: 1px 1px ' + config[0][12] + ';\
}\
.entry, .cmGame, #content .alert-danger {font-size: initial;}\
#content .alert-danger {padding: 10px;}\
#content a {border-bottom: none;}\
#content .left-column {position: inherit;}\
#content .left-column input[type=image] {background-color: inherit;}\
.img_ad:hover {filter: brightness(0.6) !important;}\
#content .center:not(h2) {\
	background-color: ' + config[0][8] + ';\
	border: 1px solid ' + config[0][24] + ';\
	border-radius: 4px;\
	box-shadow: 0 0 6px 2px ' + config[0][150] + ';\
	margin-left: 15px;\
	padding: 20px;\
	text-shadow: 1px 1px ' + config[0][10] + ';\
}\
#content .center.left {margin-left: 25px;}\
#content #form {margin-left: auto;}\
#content #help {\
	text-align: left;\
	margin-top: 25px;\
}\
#content h1 {font-size: 34px;}\
#content h2 {\
	font-weight: bold;\
	line-height: 36px;\
}\
#content label[for="order"] {\
	text-align: center;\
	padding-right: 0;\
}\
#content td, #content .left .list li, .container img, .description, .description a, .ascii, .comment_body_default, .comment_body_delete, .comment_body_collapse, .page__heading__breadcrumbs i, .sidebar .last_updated, .popup_heading_h2, .sgun_note_date, .SGPP_EntryComm > i  {color: ' + config[8] + ';}\
#content .legend {\
	margin-right: 5px;\
	font-weight: 600;\
	width: 175px;\
}\
#content .subtitle {\
	margin-bottom: 40px;\
	margin-top: -10px;\
}\
.tab-content {\
	margin-left: auto;\
	max-width: calc(100% - 190px);\
}\
.tab-content .cmGame, .form__sync-default, .form__sync-loading {margin-left: 0 !important;}\
.tab-links {\
	padding-left: 0;\
	margin-left: 200px;\
}\
.tab-links a {\
	border: 1px solid;\
	border-radius: 4px 4px 0 0;\
	margin-bottom: -1px;\
	padding: 9px 5px;\
}\
.tab-links li {margin: 0 2px;}\
#content .total {\
	background-image: linear-gradient(' + config[0][5] + ' 0%, ' + config[0][83] + ' 100%);\
	border-color: ' + config[0][84] + ';\
	border-radius: 8px;\
	padding: 5px;\
	margin-left: auto;\
	margin-right: auto;\
	height: inherit;\
	display: block;\
	width: 84.5%;\
	min-width: 700px;\
}\
.store-entry-steam img {filter: invert(0.8);}\
.store-entry img {\
	background-color: rgba(129, 129, 129, 0.2);\
	border-radius: 4px;\
	margin-top: 6px;\
	padding: 2px;\
}\
#wrapper {\
	background-color: transparent;\
	color: ' + config[8] + ';\
	text-shadow: 1px 1px ' + config[0][12] + ';\
}\
input#real_cv_order {border-color: white !important;}\
* :focus, * :hover, .bootstrap-select .dropdown-toggle:focus {outline: none !important;}\
input.form-control {margin-bottom: 0 !important;}\
.btn-default {\
	color: #a0a0a0!important;\
	background-color: #404040 !important;\
	border-color: #000 !important;\
	text-shadow: 1px 1px hsla(0, 0%, 0%, 0.5), 0 0 2px hsla(0, 0%, 0%, 0.999);\
}\
.btn-primary {\
	color: #a0a0a0;\
	background-color: hsla(208, 56%, 26%, 1);\
	border-color: #000000 !important;\
	text-shadow: 1px 1px hsla(0, 0%, 0%, 0.5), 0 0 2px hsla(0, 0%, 0%, 0.999);\
}\
.btn-primary:hover {\
	color: #dadada !important;\
	background-color: hsl(208, 57%, 33%);\
}\
.btn-primary.active, .btn-primary:active, .open>.dropdown-toggle.btn-primary {\
	color: #dadada !important;\
	background-color: hsl(208, 57%, 33%);\
	border-color: #000000!important;\
}\
.btn-primary.disabled.focus, .btn-primary.disabled:focus, .btn-primary.disabled:hover, .btn-primary[disabled].focus, .btn-primary[disabled]:focus, .btn-primary[disabled]:hover, fieldset[disabled] .btn-primary.focus, fieldset[disabled] .btn-primary:focus, fieldset[disabled] .btn-primary:hover {background-color: hsl(208, 56%, 23%);}\
.dropdown-menu {\
	background-color: #333;\
	border: 1px solid rgba(0,0,0,.5);\
	box-shadow: none;\
}\
.dropdown-menu>li>a, .datepicker-dropdown {\
	color: #a0a0a0 !important;\
	text-shadow: 1px 1px hsla(0, 0%, 0%, 0.5), 0 0 2px hsla(0, 0%, 0%, 0.999);\
}\
.dropdown-menu>li>a:focus, .dropdown-menu>li>a:hover,.bootstrap-select.btn-group .dropdown-menu li a span.text:hover {\
	color: #dadada !important;\
	background-color: #252525;\
	outline: none;\
}\
.bootstrap-select.btn-group .dropdown-menu li a span.text:hover, .btn.focus, .btn:focus:not(.btn-success):not(.btn-danger), .btn:hover:not(.btn-success):not(.btn-danger) {color: #dadada !important;}\
button.btn.dropdown-toggle.btn-inverse.btn-xs, .btn-group.open .dropdown-toggle {\
	background-color: #3e3e3e !important;\
	box-shadow: none !important;\
	text-shadow: 1px 1px hsla(0, 0%, 0%, 0.5), 0 0 2px hsla(0, 0%, 0%, 0.999) !important;\
}\
.btn-info {\
	color: #dadada !important;\
	background-color: hsl(194, 66%, 30%) !important;\
	border-color: hsl(194, 56%, 45%) hsl(194, 66%, 45%) hsl(194, 80%, 45%) hsl(194, 46%, 45%) !important;\
	margin-right: 1px;\
	text-shadow: 1px 1px hsla(0, 0%, 0%, 0.35), 0 0 2px hsla(0, 0%, 0%, 1) !important;\
}\
.btn.disabled, .btn[disabled], fieldset[disabled] .btn {opacity: 0.35!important;}\
.popover.left>.arrow {border-left-color: #000000 !important;}\
.popover.left>.arrow:after {\
	border-left-color: #444 !important;\
	background-color: rgba(28, 28, 28, 0) !important;\
}\
.popover {\
	background-color: #444;\
	border: 1px solid #000;\
	box-shadow: none;\
	color: #a0a0a0;\
	text-shadow: 1px 1px hsla(0, 0%, 0%, 0.5), 0 0 2px hsla(0, 0%, 0%, 0.999) !important;\
}\
.query-builder .rule-container, .query-builder .rule-placeholder {\
	border: 1px solid hsla(0, 0%, 0%, 0.7) !important;\
	background: hsla(0, 0%, 13%, 0.5) !important;\
}\
.query-builder .rules-group-container {\
	background: hsla(0, 0%, 20%, 0.4) !important;\
	border: 1px solid rgba(0, 0, 0, 0.6) !important;\
}\
.query-builder .rule-value-container {\
	border-left: 1px solid hsl(0, 0%, 20%) !important;\
	box-shadow: -1px 0 0 #000 !important;\
}\
.query-builder .error-container {color: hsla(0, 70%, 55%, 0.95) !important;}\
.error .bootstrap-select .dropdown-toggle, .has-error .bootstrap-select .dropdown-toggle {border-color: #800 !important;}\
.query-builder .has-error, #content .alert-danger, .cmGame.multiplewins, .cmGame.notActivatedGame {\
	background-color: transparent !important;\
	background-image: linear-gradient(hsla(0, 65%, 44%, 0.23) 0%, hsla(0, 74%, 24%, 0.9) 100%) !important;\
	border-color:#800 !important;\
}\
#content .alert-danger, .cmGame.multiplewins, .cmGame.notActivatedGame {\
	color: hsla(0, 68%, 80%, 1) !important;\
	margin-left: auto;\
	margin-right: auto;\
	text-align: center;\
	width: 65%;\
}\
.query-builder .rules-list>::after, .query-builder .rules-list>::before {border-color: rgba(0, 0, 0, 0.6) !important;}\
.query-builder .error-container+.tooltip .tooltip-inner {\
color: hsla(0, 70%, 55%, 0.95) !important;\
	background-color: #444;\
	border: 1px solid #000;\
	box-shadow: none;\
	text-shadow: 1px 1px hsla(0, 0%, 0%, 0.99), 0 0 1px hsla(0, 0%, 0%, 0.99) !important;\
}\
.tooltip.right .tooltip-arrow {\
	border-right-color: #444;\
	left: 1px;\
	filter: drop-shadow(-1px 0 0 #000);\
}\
.tooltip.fade.in {opacity: 1 !important;}\
.query-builder p.filter-description {\
	background: rgba(0,170,255,0.2) !important;\
	border: 1px solid #346F7B !important;\
	color: #AAD1E4 !important;\
}\
.query-builder .rule-placeholder {\
	border: 1px dashed #545454 !important;\
	opacity: 0.7!important;\
}\
.datepicker-dropdown.datepicker-orient-top:before {border-top: 7px solid #000;}\
.datepicker-dropdown.datepicker-orient-top:after {border-top: 6px solid #333;}\
.datepicker .datepicker-switch:hover, .datepicker .next:hover, .datepicker .prev:hover, .datepicker tfoot tr th:hover, .datepicker table tr td.day.focused, .datepicker table tr td.day:hover {\
	background: hsla(0, 0%, 13%, 0.5);\
	box-shadow: 0 0 0 1px #000;\
}\
.datepicker table tr td.today, .datepicker table tr td.today.disabled, .datepicker table tr td.today.disabled:hover, .datepicker table tr td.today:hover {\
	background-color: hsl(208, 57%, 33%) !important;\
	background-image: none;\
	border: none;\
	box-shadow: 0 0 0 1px #000;\
	color: #a0a0a0 !important;\
}\
.datepicker table tr td.active.active {\
	background-color: #365924!important;\
	background-image: none;\
	border: none;\
	box-shadow: 0 0 0 1px #000;\
	color: #a0a0a0 !important;\
	text-shadow: 1px 1px hsla(0, 0%, 0%, 0.99), 0 0 1px hsla(0, 0%, 0%, 0.99);\
}\
.datepicker table tr td.new, .datepicker table tr td.old {color: #515151;}\
.caret {filter: drop-shadow(0px 1px 0 #000);}\
.comment__actions, .page__description__edit, .action_list, .patreon_reward_summary_color_cancel {\
	color: ' + config[9] + ';\
}\
.action_list, .comment_collapse_btn, .comment_expand_btn, .author_name:not(.is_op), .author_small, .author_permalink {text-shadow: 1px 1px ' + config[0][10] + ';}\
.comment__collapse-button, .comment__expand-button, .comment_collapse_btn, .comment_expand_btn, #content a, #content a :hover, #content a :focus, .comment__author i {color: inherit;}\
.comment__birthday {opacity: 0.55;}\
.comment__child, .comment_children .comment_outer > .comment_inner, .review_flex, .reply_form > form, .comment_inner + .comment_children > .MRBox {\
	background-color: ' + config[0][6] + ';\
	border: 1px solid ' + config[0][34] + ';\
	box-shadow: 1px 1px 0 ' + config[0][32] + ' inset, 0 2px 3px ' + config[0][32] + ' inset;\
	border-radius: 4px;\
	padding: 15px;\
}\
.comments, .page__description {margin-bottom: 8px;}\
.comment__cancel-button, .form__edit-button, .form__logout-button, .page__description__cancel {color: ' + config[0][22] + ';}\
.comment__children:not(.comment__children--no-indent), .comment_children {\
	border-left: 1px solid ' + config[0][275] + ' !important;\
	box-shadow: 1px 0 0 ' + config[0][276] + ' inset !important;\
	padding-left: 25px;\
}\
.comment__children:not(.comment__children--no-indent):hover, .comment_children:hover {\
	box-shadow: 1px 0 0 ' + config[0][57] + ' inset !important;\
}\
.comment__delete-state .comment__description {color: ' + config[0][171] + ' !important;}\
.comment__description.markdown.markdown--resize-body > p {text-shadow: 0 0 2px ' + config[0][12] + ';}\
.comments__entity {\
	background-color: ' + config[0][35] + ';\
	border: 1px solid ' + config[0][24] + ';\
	border-radius: 4px 4px 0 0;\
	color: ' + config[8] + ';\
	max-height: 51px;\
	max-width: 100%;\
	padding: 10px 10px 5px;\
	text-shadow: 1px 1px ' + config[0][10] + ';\
	-moz-transition: max-height 2s ease-in-out;\
	-webkit-transition: max-height 2s ease-in-out;\
	-o-transition: max-height 2s ease-in-out;\
	transition: max-height 2s ease-in-out;\
	will-change: transition;\
}\
.comments__entity:hover {\
	-webkit-transition-delay: 0.5s;\
	-moz-transition-delay: 0.5s;\
	-o-transition-delay: 0.5s;\
	transition-delay: 0.5s;\
	max-height: 1000px;\
}\
.comments__entity blockquote {margin: 6px 0 10px 10px;}\
.comments__entity__name {margin-top: -6px;}\
.comment__envelope, .comment_unread {\
	background-color: ' + config[21] + ';\
	background-image: linear-gradient(' + config[0][25] + ' 0%, ' + config[21] + ' 50%, ' + config[0][128] + ' 100%);\
	border: 1px solid;\
	border-color: ' + config[0][27] + ' ' + config[0][28] + ' ' + config[0][135] + ' ' + config[0][28] + ';\
	color: ' + config[36] + ';\
	text-shadow: 1px 1px 1px ' + config[0][11] + ', 0 0 1px ' + config[0][12] + ';\
}\
.comment_unread i {color: inherit;}\
.comment__parent {\
	max-width: calc(100% - 50px);\
	margin-right: -1000px;\
}\
.comment__permalink {color: ' + config[0][157] + ';}\
.comment__username:not(.comment__username--op) a:not(.esgst-namwc-highlight):not(.esgst-wbh-highlight), .author_name:not(.esgst-namwc-highlight):not(.esgst-wbh-highlight), .form__heading__text, .form__level, .giveaway__links span, .giveaway-summary__links span, .giveaway__username:not(.esgst-namwc-highlight):not(.esgst-wbh-highlight), .markdown a:not(.esgst-gc), .pagination__navigation a:not(.is-selected), .pagination_navigation a, .popup__actions, .popup_actions, .popup__description__small, .table__column__secondary-link:not(.esgst-namwc-highlight):not(.esgst-wbh-highlight), .comments__entity__name, .table .underline:not(.esgst-namwc-highlight):not(.esgst-wbh-highlight), #content strong a, #content td a, form .heading .name, .header_search .description .blue, .esgst-ggl-member, .esgst-form-heading-text, .patreon_reward:not(.is_locked) .patreon_reward_summary_name {\
	color: ' + config[4] + ' !important;\
	text-shadow: 1px 1px ' + config[0][10] + ';\
}\
.dropdown > div, .esgst-header-menu-relative-dropdown > div {\
	background-color: hsla(0,0%,0%,0) !important;\
}\
.dropdown_btn:not(.nav__row), .MTBox {\
	background-image: linear-gradient(' + config[15] + ' 0%, ' + config[0][16] + ' 100%);\
	text-shadow: 1px 1px ' + config[0][11] + ', 0 0 1px ' + config[0][10] + ';\
	transition: color 0.5s;\
}\
.header_search > div:first-child > div > div:last-child {background-color: ' + config[4] + ' !important;}\
.header_search > div:last-child > div > div:last-child {background-color: ' + config[0][233] + ';}\
.header_search > div > div > div:last-child {\
	filter: brightness(0.8);\
	transition: filter 0.35s ease-in;\
	will-change: filter;\
}\
.header_search > div > div > div:last-child:hover:not(:active) {\
	background-image: none;\
	filter: brightness(1.1);\
}\
.header_search .description{\
	color: ' + config[8] + ';\
	text-shadow: 1px 1px ' + config[0][10] + ';\
	will-change: transform;\
}\
.comment__summary[style="opacity: 0.5;"] {opacity: 0.3 !important;}\
.comment__username--deleted {color: ' + config[9] + ';}\
.comment__username--op, a.author_name.is_op {background-color: #254595;}\
.comment__username--op a:not(.esgst-namwc-highlight):not(.esgst-wbh-highlight), .comment__username--permalink a, a.author_name.is_op:not(.esgst-namwc-highlight):not(.esgst-wbh-highlight) {\
	color: #BBBBBB !important;\
	text-shadow: 1px 1px hsla(0, 0%, 0%, 0.99), 0 0 1px hsla(0, 0%, 0%, 0.99), 0 0 1px hsla(0, 0%, 0%, 0.99) !important;\
}\
.comment__username--op a:not(.esgst-namwc-highlight):not(.esgst-wbh-highlight) {text-shadow: 1px 1px hsla(0, 0%, 0%, 0.99), 0 0 1px hsla(0, 0%, 0%, 0.99), 0 0 1px hsla(0, 0%, 0%, 0.99) !important;}\
.description a{border-bottom-color: ' + config[8] + ';}\
.ascii{opacity: 0.5;}\
img[src="https://cdn.steamgifts.com/img/logo.png"], img[src="https://cdn.steamtrades.com/img/logo.png"] {opacity: 0.7;}\
div > .table__column--width-fill > form > strong {color: #6db563;}\
.fa-envelope-o:before {\
	content: "\\f0e0";\
	font-size: 16px;\
}\
.featured__container {background-color: transparent;}\
.featured__column, .featured__outer-wrap .global__image-outer-wrap:not(.is_icon) {\
	color: ' + config[0][47] + ';\
	background-color: hsla(0, 0%, 0%, 0.09);\
	border: 1px solid hsla(0, 0%, 0%, 0.17);\
	text-shadow: 1px 1px 1px ' + config[0][10] + ', 0 0 1px ' + config[0][10] + ';\
}\
.featured__columns .fa-thumbs-up {opacity: 1;}\
.featured__heading, .featured__table a {\
	color: ' + config[0][273] + ';\
	text-shadow: 1px 1px 1px ' + config[0][10] + ', 0 0 2px ' + config[0][10] + ';\
}\
.featured__table a[style*="color"], .featured__column > [style*="color"] {filter: saturate(1.65) opacity(0.95);}\
.featured__heading__small {color: ' + config[0][286] + ';}\
.featured__table__row {\
	text-shadow: 1px 1px ' + config[0][10] + ', 0 0 2px ' + config[0][10] + ';\
	border-top: 1px solid ' + config[0][159] + ';\
}\
.featured__table__row__left, #sg_dyepb_toolbar span + a {color: ' + config[0][286] + ';}\
.featured__table__row__right, #sg_dyepb_toolbar span {color: ' + config[0][58] + ';}\
.featured__online-now {color: ' + config[0][155] + ' !important;}\
.featured__container > .featured__outer-wrap {\
	background-color: transparent !important;\
	box-shadow: 0 6px 10px 0 ' + config[0][150] + ';\
	' + background + ';\
	width: 100%;\
	background-size: cover;\
}\
#footer {\
	bottom: -18px;\
	position: relative;\
}\
.footer__inner-wrap, #footer, .footer_inner_wrap {\
	color: ' + config[0][58] + ';\
	text-shadow: 1px 1px 1px ' + config[0][10] + ', 1px 1px 2px ' + config[0][14] + ';\
}\
.footer__inner-wrap a, #footer a, .footer_inner_wrap a {color: ' + config[0][153] + ';}\
.footer__inner-wrap a:hover, #footer a:hover, .footer_inner_wrap a:hover {\
	color: ' + config[0][59] + ';\
	border-bottom: 1px dotted ' + config[0][59] + ';\
}\
.footer__inner-wrap i, .footer_inner_wrap i {color: ' + config[0][59] + ';}\
.footer_inner_wrap {padding: 15px 25px;}\
.footer__outer-wrap, #footer, footer {\
	background: ' + config[27] + ' !important;\
	border-bottom: 1px solid ' + config[0][141] + ';\
	border-top: 1px solid ' + config[0][141] + ';\
}\
.form__checkbox, .my__checkbox.is-disabled {color: ' + config[9] + ' !important;}\
.form__checkbox.is-selected, .my__checkbox.is-selected, .fa-check:before, .form_list_item_check, .rhCheckbox .fa-check-circle, .esgst-checkbox .fa-check-circle, .esgst-gf-legend .fa-check-circle, .fa-check-circle.esgst-positive, .fa-thumbs-up.esgst-positive, .esgst-positive {\
	color: ' + config[0][155] + ' !important;\
	text-shadow: 1px 1px ' + config[0][10] + ';\
}\
.esgst-gf-type-filter .esgst-checkbox .fa-circle, .esgst-gf-category-filter .esgst-checkbox .fa-circle, .esgst-gf-legend .fa-circle {color: hsla(36, 89%, 42%, 0.8) !important;}\
.esgst-gf-exception-filters .fa-circle {color: inherit !important;}\
.form__checkbox:not(:last-of-type), .my__checkbox:not(:last-of-type) {border-bottom: 1px dotted ' + config[0][46] + ';}\
.form_list {\
	border: 1px solid transparent;\
	background-color: ' + config[0][89] + ';\
	box-shadow: 1px -1px ' + config[0][90] + ', 1px 1px ' + config[0][90] + ', -1px 1px ' + config[0][90] + ', -1px -1px ' + config[0][90] + ';\
}\
.form_list_item:not(:last-child) {border-bottom: 1px solid ' + config[0][90] + ';}\
.form_list_item_summary_name {color: ' + config[0][94] + ';}\
.form_list_item_summary_users {color: ' + config[9] + ';}\
.form_list_item.is-selected {\
	background-image: linear-gradient(' + config[0][91] + ' 0, ' + config[0][92] + ' 25px);\
	box-shadow: 0 0 1px ' + config[0][93] + ' inset;\
}\
.form_list_item.is-selected .form_list_item_summary_name {color: ' + config[0][98] + ';}\
.form_list_item.is-selected .form_list_item_summary_users {color: ' + config[0][68] + ';}\
.form_list_navigation span {\
    color: ' + config[8] + ';\
    opacity: 0.55;\
    text-shadow: inherit;\
}\
.form__rows, .forms__rows, .page_inner_wrap.medium form {\
	background-color: ' + config[0][8] + ';\
	background-image: none;\
	border: 1px solid ' + config[0][24] + ';\
	border-radius: 4px;\
	box-shadow: 0 0 6px 2px ' + config[0][150] + ';\
	margin-bottom: 8px;\
	margin-top: 8px;\
	padding: 0 20px !important;\
	text-shadow: 1px 1px ' + config[0][12] + ';\
}\
form[method="post"] .form__rows .form__row + .form__submit-button, [key*="esg"] + .form__submit-button {margin-bottom: 20px;}\
.form__row:first-of-type {margin-top: 14px;}\
.form__heading__number, .form__heading__optional, form .heading .number, form .heading .optional {color: ' + config[0][287] + ';}\
form .heading {text-shadow: 1px 1px ' + config[0][12] + ';}\
.form__input-description, .tooltip_row i[style*="color: #77899"] {color: ' + config[9] + ' !important;}\
.form__input-small.is-disabled {opacity: 0.4;}\
.form__row__error {color: ' + config[37] + ';}\
.form__row__indent, form .indent, .esgst-form-row-indent {\
	border-left: 1px solid ' + config[0][38] + ' !important;\
	box-shadow: -1px 0 0 ' + config[0][37] + ' !important;\
}\
.form__submit-button.sgtoolsBtn {line-height: 27px;}\
.giveaway__column--contributor-level--positive, .featured__column--contributor-level--positive{\
	cursor: default !important;\
	filter: hue-rotate(10deg) saturate(0.9) brightness(1.05);\
}\
.giveaway__column--negative, .negative, .negative i {color: ' + config[37] + ' !important;}\
.giveaway__column--group, .featured__column--group {\
	background-image: linear-gradient(' + config[0][236] + ' 0%, ' + config[0][237] + '  50%, ' + config[0][238] + ' 100%) !important;\
	border-color: ' + config[0][239] + ' ' + config[22] + ' ' + config[0][240] + ' ' + config[22] + ';\
	color: ' + config[0][241] + ';\
	text-shadow: 1px 1px 1px ' + config[0][11] + ', 0 0 1px ' + config[0][12] + ';\
}\
.giveaway__column--whitelist, .featured__column--whitelist, .giveaway__columns--badges .giveaway__column--whitelist {\
	background-image: linear-gradient(' + config[0][193] + ' 0%, ' + config[0][194] + '  50%, ' + config[0][195] + ' 100%);\
	border-color: ' + config[0][196] + ' ' + config[23] + ' ' + config[0][197] + ' ' + config[23] + ' !important;\
	color: ' + config[0][198] + ';\
	text-shadow: 1px 1px 1px ' + config[0][11] + ', 0 0 1px ' + config[0][12] + ' !important;\
}\
.featured__column--whitelist {color: ' + config[0][249] + ';}\
.giveaway__column--invite-only, .giveaway__column--community-voted, .giveaway__column--region-restricted, .featured__column--invite-only, .featured__column--community-voted, .featured__column--region-restricted, .giveaway__columns--badges .giveaway__column--region-restricted {\
	background-image: linear-gradient(' + config[0][25] + ' 0%, ' + config[21] + ' 50%, ' + config[0][128] + ' 100%);\
	border-color: ' + config[0][27] + ' ' + config[0][28] + ' ' + config[0][135] + ' ' + config[0][28] + ' !important;\
	color: ' + config[0][256] + ' !important;\
	text-shadow: 1px 1px 1px ' + config[0][11] + ', 0 0 1px ' + config[0][12] + ';\
 }\
.giveaway__column--positive, .author_small .is_positive, .table .reputation .is_positive, .rating_checkbox.is_positive.is_selected, .positive, .positive i {color: ' + config[0][155] + ' !important;}\
.giveaway__columns:not(.esgst-gv-icons) > :not(.giveaway__column--group):not(.giveaway__column--whitelist):not(.giveaway__column--invite-only):not(.giveaway__column--community-voted):not(.giveaway__column--contributor-level):not(.giveaway__column--region-restricted):not(form):not(.mt-more-like-this):not(.esgst-elgb-button):not(.giveaway__column--new):not(.giveaway__column--wish):not(.esgst-button-set), #help ~ .featured__outer-wrap .featured__inner-wrap .featured__column:not(.featured__column--contributor-level--positive):not(.esgst-gwc):not(.esgst-gwr) {\
	background-image: linear-gradient(' + config[13] + ' 0, ' + config[0][39] + ' 6px, ' + config[0][40] + ' 100%);\
	border-color: ' + config[0][41] + ' ' + config[0][42] + ' ' + config[0][39] + ' ' + config[0][42] + ' !important;\
	box-shadow: 1px 1px 0 ' + config[0][42] + ' inset !important;\
	color: ' + config[9] + ';\
}\
.giveaway__columns .fa-clock-o {margin-bottom: 2px;}\
.giveaway__heading {\
	height: inherit;\
	padding-bottom: 3px;\
}\
.giveaway__heading__name, .table__column__heading, .table h3, .esgst-ugd-table ~ .esgst-text-center .esgst-bold:not(span), .FTB-online-string {\
	color: ' + config[3] + ';\
	text-shadow: 1px 1px ' + config[0][10] + ', 1px 1px 2px ' + config[0][10] + ';\
}\
.giveaway__heading__thin:not(.copies__tagged) {color: ' + config[0][22] + ';}\
.giveaway__hide, .giveaway__icon, .esgst-gt-panel i {opacity: 0.55;}\
.giveaway__links i {\
	color: ' + config[0][46] + ';\
	text-shadow: 1px 1px ' + config[0][10] + ';\
}\
.giveaway_image_thumbnail, .giveaway_image_avatar, .giveaway_image_thumbnail_missing, .featured_giveaway_image_avatar, .table_image_avatar, .table_image_avatar_missing, .table_image_thumbnail, .table_image_thumbnail_missing, .table_image_flag, .table_image_flag_missing, .esgst-popup .global__image-outer-wrap {box-shadow: 0 0 0 1px ' + config[0][50] + ';}\
esgst-popup .global__image-inner-wrap {filter: brightness(' + config[1] + ');}\
.esgst-gv-view .giveaway_image_thumbnail, .esgst-gv-view .giveaway_image_thumbnail_missing, .SGPP__gridTile .giveaway_image_thumbnail, .SGPP__gridTile .giveaway_image_thumbnail_missing, .esgst-gv-box .global__image-inner-wrap {filter: brightness(' + (+config[1]+ (-0.1)) + ');}\
.esgst-gv-container:hover .giveaway_image_thumbnail, .esgst-gv-container:hover .giveaway_image_thumbnail_missing, .esgst-gv-container:hover .esgst-gv-icons, .SGPP__gridTile:hover .giveaway_image_thumbnail, .SGPP__gridTile:hover .giveaway_image_thumbnail_missing, .giveaway-gridview:hover .faded, .giveaway-gridview:hover .giveaway_image_thumbnail, .giveaway-gridview:hover .giveaway_image_thumbnail_missing, .esgst-gv-box:hover .global__image-inner-wrap {\
	filter: brightness(' + (+config[1]+ (0.1)) + ');\
	opacity: 1;\
}\
.esgst-gv-container:hover .giveaway_image_thumbnail, .esgst-gv-container:hover .giveaway_image_thumbnail_missing {box-shadow: 0 0 0 1px ' + config[0][50] + ' !important;}\
.giveaway_image_thumbnail_missing, .table_image_thumbnail_missing, .table_image_avatar_missing, .table_image_flag_missing {\
	background-color: ' + config[14] + ';\
	border: none;\
}\
.giveaway__row-outer-wrap {padding: 11px 0;}\
.giveaway_image_thumbnail_missing i, .table_image_thumbnail_missing i, .table_image_avatar_missing i, .global__image-outer-wrap--missing-image i, .featured__outer-wrap .global__image-outer-wrap--missing-image i {\
	color: ' + config[0][161] + ';\
	box-shadow: none;\
}\
header.small, header.large, header, #header {\
	background-image: linear-gradient(' + config[0][21] + ' 0%, ' + config[0][20] + ' 100%);\
	box-shadow: 0 1px 10px 3px ' + config[0][150] + ', 0 -1px 0 ' + config[0][141] + ' inset, 0 -10px 10px -3px ' + config[0][142] + ' inset;\
	z-index: 1000 !important;\
}\
header.large {\
	height: 150px !important;\
}\
header.small {height: 39px !important;}\
#header {\
	position: fixed;\
	width: 100%;\
	min-width: 1100px;\
	z-index: 1;\
}\
.header_search {\
	border-top: 1px solid ' + config[0][38] + ';\
	box-shadow: 0 -1px 0 ' + config[0][37] + ';\
	margin-top: 5px;\
	padding: 0;\
}\
.header_search input, .header_search > div > div > div:last-child {height: 34px;}\
.header_search input {border: 1px solid;}\
#header input[type="image"] {margin-bottom: -3px;}\
.highcharts-axis-labels text, .highcharts-button text {fill: ' + config[8] + ' !important;}\
.highcharts-axis path, .highcharts-grid path {stroke: ' + config[8] + ' !important;}\
.highcharts-tooltip path, .highcharts-button rect {\
	stroke: ' + config[0][186] + ' !important;\
	fill: '+ config[0][188] +';\
}\
.highcharts-button rect[stroke="#68A"] {\
	stroke: ' + config[0][164] + ' !important;\
	fill: '+ config[0][166] +';\
}\
.highcharts-button rect + text {fill: ' + config[0][28] + ' !important;}\
.highcharts-button rect[stroke="#68A"] + text {fill: ' + config[0][167] + ' !important;}\
.highcharts-tooltip p[style*="rgba(98, 134, 211, 0.5)"] {\
	color: ' + config[0][161] + ' !important;\
	text-shadow: 1px 1px 1px ' + config[0][10] + ', 0 0 1px ' + config[0][10] + ' !important;\
}\
h3.sidebar__heading {margin-top: 8px;}\
input#user, input#username, input#steamid, select#mode, select#type, select#giveawayUrl, button[type="submit"] {\
	background-color: ' + config[11] + ';\
	border: 1px solid;\
	border-color: ' + config[0][160] + ';\
	border-radius: 4px;\
	color: ' + config[0][161] + ';\
	text-indent: 5px;\
	text-shadow: 1px 1px 1px ' + config[0][10] + ';\
}\
input,textarea {box-shadow: none !important;}\
.icon_to_clipboard[style*="rgb(91, 178, 190)"] {color: ' + config[0][155] + ' !important;}\
.icon-green, i.fa.fa-check-circle-o.green, .sg-icon-green, .sidebar_table > div:not(.is_warning) i, .table i.green, .author_permalink, .comment__permalink, .is_permalink, .dropdown_btn i.green, .popup.is_success .popup_icon i, #filter, .esgst-header-menu-row i.green, .tooltip_row i[style*="color: #96c468"], .sidebar__navigation__item:not(.is-selected) i.fa-chevron-circle-right {color: ' + config[0][155] + ' !important;}\
.icon-grey, .sg-icon-grey, .dropdown_btn i.grey, .esgst-header-menu-row i.grey {color: #9FAAB4 !important;}\
.esgst-unknown, .esgst-user-icon i.esgst-unknown {color: hsla(209, 5%, 40%, 1) !important;}\
.icon-yellow, .esgst-ged-icon, .esgst-header-menu-row i.yellow {color: hsla(40,89%,60%,1) !important;}\
#content i.fa.fa-check-circle-o.orange {filter: brightness(82%);}\
input[name="region"] ~ [data-checkbox-value="6"], input[name="region"] ~ [data-checkbox-value="2"], input[name="region"] ~ [data-checkbox-value="3"], input[name="region"] ~ [data-checkbox-value="1"] {border-bottom: 1px dotted ' + config[0][46] + ';}\
input:focus, select:focus, textarea:focus {color: ' + config[0][286] + ' !important;}\
input:focus, select:focus, button:focus, rect:focus, textarea:focus {outline: none;}\
.is-faded:not(em), .giveaway__row-inner-wrap.is-faded + .esgst-ged-source, .giveaway-gridview .faded, .giveaway__row-inner-wrap.esgst-faded {opacity: 0.25;}\
.leaderboard {margin: 12px auto -12px auto !important;}\
#legend {margin-bottom: 40px;}\
.markdown blockquote {\
	background-color: ' + config[0][221] + ';\
	border-left: 3px solid ' + config[0][105] + ';\
	border-radius: 6px;\
	border-right: 2px solid ' + config[0][105] + ';\
	box-shadow: 0 1px 4px 1px ' + config[0][107] + ';\
    color: ' + config[58] + ';\
}\
.markdown blockquote blockquote {\
	border-left: 3px solid ' + config[0][105] + ';\
	max-width: calc(100% - 65px);\
	opacity: 1;\
	padding: 10px 25px;\
}\
.markdown .comment__toggle-attached, .nonactivated-dlcs, .nonactivated-nolonger, .nonactivated-whitelisted, .nonactivated-cantcheckactivated, .markdown .view_attached {\
	color: ' + config[0][154] + ';\
	padding: 0;\
}\
.have {\
	background-color: ' + config[0][109] + ';\
	border-left-color: ' + config[0][108] + ';\
	border-radius: 4px;\
	color: ' + config[0][273] + ' !important;\
}\
.have hr, .want hr {\
	border-top: 1px solid hsla(0, 0%, 0%, 0.85) !important;\
	border-bottom: 1px solid ' + config[0][108] + ' !important;\
}\
.markdown h1, .markdown h2, .markdown h3, .markdown h4, .markdown h5, .markdown h6, #content h1, #content h2, #content h3:not(.sidebar__heading), #content .subtitle, #content .wrap .left .before-list, .header_search .name {\
	color: ' + config[0][286] + ';\
	text-shadow: 2px 2px 2px ' + config[0][10] + ', 1px 1px ' + config[0][10] + ';\
	filter: brightness(1);\
}\
.markdown h1 > strong, .markdown h2 > strong, .markdown h3 > strong, #content h1 > strong, #content h2 > strong, #content h3 > strong {filter: brightness(1) !important;}\
.markdown h1, #content h1 {\
	color: ' + config[62] + ';\
	font-weight: 900;\
}\
.markdown h2, #content h2 {color: ' + config[63] + ';}\
.markdown h3, #content h3:not(.sidebar__heading) {color: ' + config[64] + ';}\
.markdown h4, .markdown h5, .markdown h6 {color: ' + config[0][286] + ';}\
.markdown hr, hr {\
	border-top: 1px solid ' + config[0][37] + ';\
	border-bottom: 1px solid ' + config[0][38] + ';\
	border-left: none;\
	border-right: none;\
}\
.markdown img[src*="reforced.nl"] {\
	background-color: transparent;\
	border: none;\
}\
.markdown img, .global__image-outer-wrap:not(.SGPP__gridTileInfo):not(.esgst-gv-popout):not(.group-border):not(.whitelist-group):not(.contributor-below-border):not(.group-contributor-below-border):not(.group-contributor-above-border):not(.whitelist):not(.contributor-above-border):not(.wishlist-border):not(.group-wishlist-border):not(.whitelist-wishlist):not(.contributor-above-wishlist-border):not(.contributor-below-wishlist) {\
	background-color: ' + config[14] + ';\
	border: 1px solid ' + config[0][50] + ';\
}\
.featured__outer-wrap .global__image-outer-wrap:not([style*="border-color"]) {\
	background-color: hsla(0, 0%, 0%, 0.09);\
	border: 1px solid hsla(0, 0%, 0%, 0.17);\
}\
.featured__outer-wrap a.global__image-outer-wrap:hover {border: 1px solid ' + config[0][168] + ' !important;}\
.featured__outer-wrap .global__image-outer-wrap--game-xlarge, .featured__outer-wrap .global__image-outer-wrap--game-large, .featured__container > .featured__outer-wrap .global__image-outer-wrap--avatar-large:not([style*="border-color"]) {\
	background-color: hsla(0, 0%, 0%, 0.2) !important;\
	border-bottom-color: hsla(0, 0%, 100%, 0.1) !important;\
	border-left-color: hsla(0, 0%, 0%, 0.35) !important;\
	border-right-color: hsla(0, 0%, 100%, 0.1) !important;\
	border-top-color: hsla(0, 0%, 0%, 0.35) !important;\
	box-shadow: 3px 3px 4px hsla(0, 0%, 0%, 0.2) inset !important;\
}\
.markdown li:before {\
	color: ' + config[56] + ';\
}\
.markdown pre {\
	background-color: ' + config[54] + ';\
	border: 1px solid ' + config[0][220] + ';\
	color: ' + config[55] + ';\
	margin-right: -10000px;\
	max-width: calc(100% - 33px);\
	text-shadow: 1px 1px 1px ' + config[0][10] + ', 1px 1px 2px ' + config[0][13] + ';\
}\
.markdown code {color: ' + config[55] + ';}\
.markdown .spoiler {padding: 3px;}\
.markdown .spoiler:not(:hover) {\
	background-color: ' + config[0][38] + ';\
	box-shadow: 0 0 1px 0 hsla(0, 0%, 0%, 0.5);\
}\
.markdown .spoiler:not(:hover) a {\
	color: transparent !important;\
	text-shadow: none;\
}\
.markdown .spoiler:hover a, .markdown .spoiler:not(:hover) strong, #content g text {\
	text-shadow: none!important;\
}\
.esgst-popup .global__image-outer-wrap {\
	background-color: transparent;\
	border: none !important;\
	border-radius: 2px;\
}\
.esgst-ugd-table .table__rows .table__row-outer-wrap:hover {background-color: hsla(0, 0%, 100%, 0.1)!important;}\
.markdown table {\
	background-color: ' + config[0][227] + ';\
	border-radius: 4px;\
	border: 1px solid ' + config[0][228] + ';\
	border-spacing: 0;\
	border-collapse: separate;\
}\
.markdown td:not(:last-child), .markdown th:not(:last-child) {border-right: 1px solid ' + config[0][228] + ' !important;}\
.markdown th {border-bottom: 1px solid hsla(0,0%,0%,0.5) !important;}\
.markdown th:first-child {border-top-left-radius: 4px;}\
.markdown th:last-child {border-top-right-radius: 4px;}\
.markdown thead {\
	background-color: ' + config[0][230] + ';\
}\
.markdown tr:not(:last-child) td {\
	border-bottom: 1px solid ' + config[0][228] + ' !important;\
}\
.markdown tbody tr {\
	background-color: ' + config[0][227] + ';\
	color: ' + config[68] + ';\
}\
.markdown tbody tr[style*="background"] td {\
	color: ' + config[0][33] + ';\
	text-shadow: 1px 1px ' + config[0][12] + ';\
}\
.markdown tbody tr[style*="background"] td a {\
	color: ' + config[0][33] + ' !important;\
	text-shadow: 0 0 5px ' + config[0][12] + ', 1px 1px ' + config[0][10] + ';\
}\
tbody tr:last-child td:first-child {border-bottom-left-radius: 4px;}\
tbody tr:last-child td:last-child {border-bottom-right-radius: 4px;}\
.markdown tr:not(:last-child) {border-bottom: 1px solid ' + config[0][228] + ';}\
.want {\
	background-color: ' + config[0][110] + ';\
	border-left-color: ' + config[0][111] + ';\
	border-radius: 4px;\
	color: ' + config[0][273] + ' !important;\
}\
.trade_heading {color: ' + config[0][111] + ';}\
.trade_heading:first-of-type {color: ' + config[0][108] + ' !important;}\
.want hr {\
	border-bottom: 1px solid ' + config[0][111] + ' !important;\
}\
nav {padding: 0 25px;}\
.nav__absolute-dropdown, .dropdown > div, .esgst-header-menu-absolute-dropdown, .esgst-header-menu-relative-dropdown > div {\
	box-shadow: 0 0 5px ' + config[0][11] + ', 2px 2px 5px ' + config[0][12] + ', 1px 1px 2px ' + config[0][10] + ' !important;\
}\
.nav__avatar-inner-wrap, .global__image-inner-wrap, .global__image-outer-wrap--game-large img, .global__image-outer-wrap--game-xlarge img, .featured__column.featured__column--width-fill.text-right > a, .profile_avatar, .nav_avatar, .table .avatar, .author_avatar, [data-google-query-id], .adsbygoogle, .giveaway_image_thumbnail, .giveaway_image_avatar, .giveaway_image_thumbnail_missing, .featured_giveaway_image_avatar, .table_image_avatar, .table_image_avatar_missing, .table_image_thumbnail, .table_image_thumbnail_missing, .table_image_flag, .table_image_flag_missing, .gridview-avatar {opacity: ' + config[1] + ';}\
.nav__button, .nav_btn, .message_count {\
	color: ' + config[43] + ';\
	opacity: 1;\
	padding: 0 10px;\
	text-shadow: 1px 1px ' + config[0][13] + ', 0 0 1px ' + config[0][10] + ' !important;\
}\
nav a:focus, nav a:hover {color: ' + config[43] + ' !important;}\
.nav_btn {border-color: hsla(215,8%,5%,1);}\
.nav_btn:hover:not(.is_selected), .nav__button-container.is-selected .nav__button, .nav__button:hover, #header .nav__left-container .nav__button-container.is-selected:first-of-type .nav__button:hover, #header .nav__right-container .nav__button-container.is-selected:first-of-type .nav__button:hover, .esgst-header-menu-button:hover:not(.is_selected) {filter: brightness(' + config[52] + ') saturate(' + config[53] + ');}\
.nav_btn_container {height: 29px;}\
.nav__button--is-dropdown-arrow {\
	border-radius: 0 4px 4px 0 !important;\
	padding: 0 8px;\
}\
.nav__button-container--notification .nav__button {padding: 0 12px;}\
.nav__button-container--active i, .nav__button .fa-star.esgst-positive {\
	color: ' + config[36] + ' !important;\
	text-shadow: 1px 1px 0 ' + config[0][10] + ';\
}\
.nav__button-container--inactive i, .sg-info {\
	color: ' + config[43] + ';\
	text-shadow: 1px 1px 0 ' + config[0][10] + ';\
}\
.nav__button-container .new_icon {\
	top: -1px;\
	z-index: 1;\
	filter: saturate(1) brightness(1);\
}\
@supports (not (-ms-ime-align:auto)) {\
	.nav__button-container .new_icon, .nav__button-container.nav__button-container--notification.nav__button-container--active {\
		z-index: 1;\
	}\
	.nav_btn:hover:not(.is_selected) .message_count, .nav__button:hover .nav__notification {\
		filter: brightness(1) saturate(0.55) !important;\
	}\
}\
.nav__button-container.is-selected .nav__button {\
	color: ' + config[43] + ' !important;\
	filter: brightness(1.2) saturate(0);\
}\
.nav__button.is-selected, .nav__button.nav__button--is-dropdown-arrow:not(.nav_btn_right).is-selected, .esgst-header-menu-button.arrow.selected {box-shadow: 3px 3px 5px rgba(0,0,0,0.3) inset, 1px 1px 0 0 hsla(215,8%,5%,1), 0 -1px 0 0 hsla(215,8%,5%,1),0px 1px 0 rgba(255, 255, 255, 0.10) inset, 0 1px 0 rgba(255, 255, 255, 0.05) inset !important;}\
.nav_btn_dropdown.is_selected {box-shadow: 3px 3px 5px rgba(0,0,0,0.3) inset;}\
.nav__button, #header .nav__button-container.is-selected .nav__button, .nav_btn {\
	background-image: linear-gradient(' + config[0][17] + ' 0, ' + config[28] + ' 5px, ' + config[0][19] + ' 100%) !important;\
	box-shadow: 0 0 0 1px hsla(215,8%,5%,1), 1px 1px 1px rgba(255, 255, 255, 0.12) inset,1px 1px 0 rgba(255, 255, 255, 0.07) inset;\
	transition: filter 0.35s ease-in;\
	will-change: filter;\
}\
.nav_btn {box-shadow: 1px 1px 1px rgba(255, 255, 255, 0.12) inset,1px 1px 0 rgba(255, 255, 255, 0.07) inset;}\
.nav_btn_left {box-shadow: 1px 1px 1px rgba(255, 255, 255, 0.12) inset,1px 1px 0 rgba(255, 255, 255, 0.07) inset;}\
.nav_btn_right {box-shadow: 0 1px 0 rgba(255, 255, 255, 0.10) inset, 0 1px 0 rgba(255, 255, 255, 0.06) inset;}\
#header .nav__left-container .nav__button-container.is-selected:first-of-type .nav__button:not(:hover):not(.is-selected), #header .nav__right-container .nav__button-container.is-selected:first-of-type .nav__button:not(:hover) {filter: brightness(1) saturate(1) !important;}\
.nav__button-container.is-selected .nav__button.nav__button--is-dropdown-arrow.is-selected, .nav__button.is-selected, .nav_btn_dropdown.is_selected, .esgst-header-menu-button.arrow.selected {\
	opacity: 1;\
	filter: brightness(0.9) saturate(0) !important;\
}\
.nav__button--is-dropdown-arrow:not(.nav_btn_right), .esgst-header-menu-button.arrow {\
	box-shadow: 1px 1px 0 0 hsla(215,8%,5%,1), 0 -1px 0 0 hsla(215,8%,5%,1),0px 1px 0 rgba(255, 255, 255, 0.10) inset, 0 1px 0 rgba(255, 255, 255, 0.05) inset !important;\
	margin-left: -1px;\
}\
.nav__left-container {margin-right: 5px;}\
.nav_logo > a {\
	background-size: 80%;\
	opacity: 0.8;\
}\
nav .nav_avatar {\
	height: 29px;\
	width: 29px;\
}\
.nav__notification, .message_count {\
	color: hsla(0,0%,92%,1);\
	background-color: ' + config[0][175] + ';\
	box-shadow: 0 0 1px 0 ' + config[0][150] + ';\
	margin-left: 7px;\
	margin-top: -27px;\
	text-shadow: 1px 1px 1px ' + config[0][10] + ', 0 0 1px ' + config[0][10] + ';\
	z-index: 1000;\
}\
.message_count {padding: 0 3px 0 2px;}\
.nav__row {\
	background-image: linear-gradient(' + config[15] + ' 0%, ' + config[0][16] + ' 100%);\
	border-radius: 0 !important;\
	text-shadow: 1px 1px ' + config[0][11] + ', 0 0 1px ' + config[0][10] + ';\
}\
.sg-info-row {text-shadow: 1px 1px hsla(0, 0%, 0%, 0.99), 0 0 1px hsla(0, 0%, 0%, 0.99), 0 0 1px hsla(0, 0%, 0%, 0.99) !important;}\
.nav__row .fa-tag{font-size:28px !important;}\
.nav__row:not(:first-child) {border-top: 1px dashed hsla(0,0%,17%,1);}\
.dropdown_btn:not(:last-child), .nav_logo + .esgst-header-menu .esgst-header-menu-row:not(:last-child) {border-bottom: 1px dashed hsla(0,0%,17%,1);}\
.nav__row.dropdown_btn {border-bottom: none;}\
.nav__row:hover .nav__row__summary__name, .nav__row:hover i:not(.__mh_bookmark_item_remove_btn), .page__heading__row:hover .page__heading__row__name, .page__heading__row:hover i, .dropdown:hover .dropdown_btn:not(.nav__row):not(:hover) i, nav a:focus, nav a:hover, .esgst-header-menu-row:hover .esgst-header-menu-name, .nav__button-container + .esgst-header-menu .esgst-header-menu-row:hover i  {color: ' + config[0][36] + ' !important;}\
.nav__row:hover .nav__row__summary__description {color: hsla(0, 0%, 60%, 1);}\
.nav__row:hover, .page__heading__row:hover, .dropdown_btn:hover {\
	background-image: linear-gradient(' + config[0][48] + ' 0%, ' + config[0][49] + ' 100%);\
	color: ' + config[0][36] + ';\
	text-shadow: 1px 1px ' + config[0][10] + ', 0 0 1px ' + config[0][10] + ';\
}\
.dropdown_btn:hover {background-color: hsla(0,0%,0%,0);}\
.nav__row__summary__description {color: ' + config[0][74] + ';}\
.nav__row__summary__name, .page__heading__row__name {\
	color: ' + config[0][88] + ';\
	filter: brightness(1.1);\
}\
.dropdown_btn {color: ' + config[0][88] + ';}\
.notification--success, .notification.green, .esgst-notification-success, .sgapi__alert.alert.alert-info {\
	cursor:default;\
	filter: hue-rotate(30deg) saturate(0.5) opacity(0.7);\
	font-family: "Open Sans", sans-serif;\
	font-weight: 600;\
	margin-right: 5px;\
}\
.sgapi__alert.alert.alert-info {filter: hue-rotate(30deg) saturate(0.5) opacity(1);}\
.notification--success.notification--margin-top-small {margin-right: 0;}\
.notification.green {\
	margin-right: 0;\
	padding: 7px 15px;\
}\
.notification i {margin-right: 2px;}\
.notification--warning, .notification.yellow, .esgst-notification-warning {\
	background-image: linear-gradient(' + config[0][52] + ' 0%, ' + config[0][53] + '  50%, ' + config[0][54] + ' 100%) !important;\
	border-color: ' + config[0][103] + ' ' + config[0][56] + ' ' + config[0][104] + ' ' + config[0][56] + ' !important;\
	color: ' + config[0][51] + ' !important;\
	text-shadow: 1px 1px ' + config[0][11] + ', 0 0 2px ' + config[0][10] + ';\
}\
.page__heading ~ div:not(.esgst-fmph-background):not(.esgst-fmph-placeholder):not(.esgst-button-set):not(.row-spacer):not(.align-button-container):not(#filterControls):not(.btn_actions):not(.notification):not(.pagination):not(.page__heading):not(.table__heading):not(.widget-container):not(.form__row):not(.giveaway__row-outer-wrap):not(.leaderboard):not(.esgst-gf-container), .page_heading ~ div:not(.esgst-fmph-background):not(.esgst-fmph-placeholder):not(.esgst-button-set):not(.row-spacer):not(.align-button-container):not(.btn_actions):not(.notification):not(.pagination):not(.page_heading):not(.table_heading):not(.widget-container):not(.form__row):not(.giveaway__row-outer-wrap):not(.leaderboard), .comments:not(.esgst-text-left), .pagination.pagination--no-results, .pagination_no_results, .esgst-gv-view:not(.pinned-giveaways__inner-wrap), .esgst-glwc-results .table {\
	background-color: ' + config[0][8] + ';\
	background-image: none;\
	border: 1px solid ' + config[0][24] + ';\
	border-radius: 4px;\
	box-shadow: 0 0 6px 2px ' + config[0][150] + ';\
	min-width:850px;\
	margin-bottom: 8px;\
	margin-top: 8px;\
	padding: 5px 10px;\
	text-shadow: 1px 1px ' + config[0][12] + ';\
}\
.page_inner_wrap .MTContainer {border-radius: 3px;}\
.page_flex > .sidebar {\
	min-width: 330px;\
	margin-left: -75px;\
}\
.page_heading_btn {padding: 5px 10px;}\
.page__heading > :not(.esgst-fmph-background), .page_heading > :not(.esgst-fmph-background), .esgst-cfh-panel .page_heading_btn, .page_inner_wrap .MTButton {\
	background-image: linear-gradient(' + config[0][170] + ' 0%, ' + config[0][60] + ' 100%);\
	border-color: ' + config[0][61] + ' ' + config[15] + ' ' + config[0][62] + ' ' + config[15] + ';\
}\
.page__heading:not(.esgst-cfh-panel), .page__inner-wrap--narrow {min-width: 750px!important;}\
.page__limit-width .page__heading {min-width: 872px!important;}\
.page__heading > *:not(.page__heading__button--green):not(.page__heading__button--red), .page__heading__breadcrumbs a, .page_heading_breadcrumbs a, .sidebar__navigation__item__name, .popup__keys__heading, .sidebar_table a, .page_heading_breadcrumbs, .page_heading_btn:not(.esgst-cfh-emojis) {color: ' + config[7] + ';}\
.pagination_navigation.page_heading_btn > *:not(:last-child) {margin-right: 0;}\
.sidebar__navigation__item__name:hover, .pagination__navigation.page_heading_btn a, .pagination_navigation.page_heading_btn a, .page_heading > .esgst-un-button, .page_heading > .esgst-heading-button {color: ' + config[7] + ' !important;}\
.page__heading__absolute-dropdown  {\
	border: none;\
	box-shadow: 0 0 5px hsla(0, 0%, 0%, 0.7), 2px 2px 5px hsla(0, 0%, 0%, 0.8), 1px 1px 2px hsla(0, 0%, 0%, 0.9);\
}\
.page__heading__breadcrumbs a, .page_heading_breadcrumbs, .page_heading_btn, .page__heading, .esgst-page-heading {text-shadow: 1px 1px 1px ' + config[0][10] + ', 1px 1px 2px ' + config[0][11] + ';}\
.page__heading__breadcrumbs>*:not(:last-child) {flex-shrink: 1;}\
.page__heading__button--green, .page_heading_btn.green, .page__heading__button--red {filter: hue-rotate(5deg) saturate(0.8);}\
.page__heading__button--green.page__heading__button--is-dropdown.is-selected, .page__heading__button--red.page__heading__button--is-dropdown.is-selected {\
	box-shadow: none;\
	z-index: 2;\
}\
.page__heading__button--red, .header__error, #infraction, .btn_action.red, .page_heading_btn.red, .sidebar__error, .sidebar__suspension, #content button#check[style*="rgb(204, 184, 188)"], .ruleFailed, .SGv2_Dark__sidebar__error, .giveaway__column--contributor-level--negative, .featured__column--contributor-level--negative, .cmGame.bundled, .entry.notvalidEntry, .btn-danger {\
	background-image: linear-gradient(' + config[0][77] + ' 0%, ' + config[19] + '  50%, ' + config[0][78] + ' 100%) !important;\
	border-color: ' + config[0][95] + ' ' + config[0][96] + ' ' + config[0][97] + ' ' + config[0][96] + ' !important;\
	color: ' + config[0][99] + ' !important;\
	text-shadow: 1px 1px 1px ' + config[0][11] + ', 0 0 1px ' + config[0][12] + ';\
	transition: filter 0.35s ease-in;\
	will-change: filter;\
}\
.alert-danger {\
	background-color: ' + config[0][78] + ';\
	border-color: ' + config[0][97] + ' !important;\
	color: ' + config[0][99] + ' !important;\
	text-shadow: 1px 1px 1px ' + config[0][11] + ', 0 0 1px ' + config[0][12] + ';\
}\
.sidebar__suspension--flat-bottom {\
	background-image: linear-gradient(' + config[0][77] + ' 0%, ' + config[19] + '  80%, ' + config[0][78] + ' 200%) !important;\
	border-bottom: none !important;\
}\
.cmGame.not5entries {\
	background-image: linear-gradient(' + config[0][179] + ' 0%, ' + config[0][180] + ' 100%) !important;\
	border-color: ' + config[0][181] + ' ' + config[0][182] + ' ' + config[0][183] + ' ' + config[0][182] + ' !important;\
	filter: saturate(0);\
}\
.cmGame.dmed, .cmGame.notActivatedDLC, .cmGame.cantCheckActivated {\
	background-image: linear-gradient(hsla(39, 86%, 42%, 1) 0%, hsla(39, 86%, 35%, 1) 50%, hsla(39, 86%, 28%, 1) 100%) !important;\
	border-color: hsla(39, 96%, 60%, 1) hsla(39, 96%, 45%, 1) hsla(39, 96%, 40%, 1) hsla(39, 96%, 45%, 1) !important;\
	color: hsl(39, 50%, 80%) !important;\
}\
.page__heading i {vertical-align: inherit;}\
.pagination__navigation[style*="border"] {padding: 5px 10px !important;}\
.page__heading__row {\
	background-image: linear-gradient(' + config[15] + ' 0%, ' + config[0][16] + ' 100%);\
	text-shadow: 1px 1px ' + config[0][10] + ';\
}\
.page__heading__row:not(:first-child) {border-top: 1px dashed #252A3A;}\
.page__heading ~ div > .table__heading:not(.sg2o-table-heading) {\
	margin: -5px -10px 5px;\
	border-top: none !important;\
	border-radius: 3px 3px 0 0 !important;\
}\
.page__heading ~ div > .table__heading ~ .table__heading:not(.sg2o-table-heading) {\
	margin: -1px -10px 5px !important;\
	border-top: 1px solid ' + config[0][24] + ' !important;\
	border-radius: 0 !important;\
}\
.page__heading + div > .table__heading {border-radius: 0 !important;}\
.page__heading ~ div > .table__rows:first-of-type > .table__heading {\
	margin: -5px -10px 5px;\
	border-top: none !important;\
	padding-top: 15px;\
	border-radius: 3px 3px 0 0;\
}\
.page__heading ~ script ~ .table__heading{\
	border-radius: 3px;\
	border-bottom-left-radius: 0;\
	border-bottom-right-radius: 0;\
	margin: 8px 0 -8px;\
	border: 1px solid ' + config[0][24] + ' !important;\
	box-shadow: 0 0 6px 2px ' + config[0][150] + ';\
}\
.page__heading ~ script ~ .table__heading + .chart {\
	border-top: none !important;\
	border-top-left-radius: 0 !important;\
	border-top-right-radius: 0 !important;\
	box-shadow: 0 4px 6px 2px ' + config[0][150] + ' !important;\
}\
.page__heading + .table__heading {\
	margin:5px 0 -8px;\
	border: 1px solid ' + config[0][24] + ' !important;\
	box-shadow: 0 0 6px 1px ' + config[0][150] + ' !important;\
}\
.page__heading + .table__heading + .table {\
	border-top-left-radius:0!important;\
	border-top-right-radius:0!important;\
	border-top:none!important;\
	box-shadow: 0 3px 6px 1px ' + config[0][150] + ' !important;\
}\
.page_inner_wrap .reply_form > .heading {margin-top: 0;}\
.page__inner-wrap--narrow, .page__limit-width {max-width: 70% !important;}\
.page__inner-wrap--narrow .page__heading + .notification--success {margin: 5px 0 -5px;}\
.page__inner-wrap--narrow .page__heading + .notification--success i {margin-bottom: 3px;}\
.page__inner-wrap, nav, #header nav, #content, .footer__inner-wrap, .featured__inner-wrap, .offer__inner-wrap {\
	max-width: 100%;\
	' + width + ';\
}\
.page__outer-wrap, .page_outer_wrap, #sg_dyepb_toolbar, .esgst-popup {\
	background-color: transparent;\
	color: ' + config[8] + ';\
	text-shadow: 1px 1px ' + config[0][12] + ';\
}\
.page_outer_wrap {border-top: none;}\
.page_outer_wrap textarea, .page_outer_wrap input, .page_outer_wrap select {\
	box-shadow: none;\
	border-color: ' + config[0][160] + ';\
	color: ' + config[0][161] + ';\
	text-shadow: 1px 1px 1px ' + config[0][10] + ';\
	background-color: ' + config[0][7] + ';\
}\
.pagination {\
	border-top: 1px solid ' + config[0][37] + ';\
	box-shadow: 0 1px 0 ' + config[0][38] + ' inset !important;\
	color: ' + config[9] + ';\
	margin-top: 5px;\
}\
.pagination.pagination--no-results, .pagination_no_results {\
	border-top-color: ' + config[0][24] + ';\
	box-shadow: 0 0 6px 2px ' + config[0][150] + ' !important;\
	color: ' + config[37] + ';\
	font-weight: 600;\
	margin-top: 5px;\
}\
.pagination + div[style*="margin-top: 25px"], .sidebar div[style*="margin-top: 10px"], .sidebar div[style*="padding-top: 15px"] {\
	background: none !important;\
	border: none !important;\
	box-shadow: none !important;\
}\
div[style*="margin-top: 25px"] > div {\
	margin-left: auto;\
	margin-right: auto;\
	height: auto !important;\
}\
div[style*="padding-top: 35px"] a[href*="patreon"] {\
	color: hsla(0, 0%, 76%, 0.9)!important;\
	background-image: linear-gradient(hsl(151, 98%, 17%) 0%, hsl(138, 98%, 17%) 100%) !important;\
	border: 1px solid transparent !important;\
	text-shadow: 1px 1px ' + config[0][12] + ' !important;\
}\
div[style*="padding-top: 35px"] a[href*="patreon"] > span {border-bottom: 1px dotted hsla(0, 0%, 76%, 0.6) !important;}\
.comment__author [href*="patreon"] i {\
    color: ' + config[8] + ' !important;\
    opacity: .55;\
    text-shadow: 0 1px hsla(0, 0%, 0%, 1), 0 -1px hsla(0, 0%, 0%, 1), 1px 0 hsla(0, 0%, 0%, 1), -1px 0 hsla(0, 0%, 0%, 1) !important;\
}\
.patreon_hero {padding: 25px !important;}\
.patreon_hero_step_action_btn {color: hsla(0, 0%, 80%, 0.95);}\
.patreon_hero_step_action_avatar {border: 1px solid ' + config[0][50] + ';}\
.patreon_hero_step_description {color: ' + config[9] + ';}\
.patreon_hero_step_action_btn.is_loading {\
    background-image: none !important;\
    background-color: hsla(0, 0%, 25%, 1) !important;\
    border-color: #000 !important;\
}\
.patreon_hero_step:not(:last-child), .patreon_reward_avatar > div:not(:last-child) {\
    border-right: 1px solid ' + config[0][37] + '!important;\
    box-shadow: 1px 0 0 ' + config[0][38] + ' !important;\
}\
.patreon_reward:not(:last-child) {border-bottom: 1px dotted ' + config[0][38] + ';}\
.patreon_reward.is_locked .patreon_reward_icon {border: 1px dashed ' + config[9] + ';}\
.patreon_reward.is_locked .patreon_reward_icon i, .patreon_reward.is_locked .patreon_reward_summary_name, .patreon_reward_summary_description {color: ' + config[9] + ';}\
.patreon_reward:not(.is_locked) .patreon_reward_icon i {color: hsla(90, 50%, 47%, 0.8)!important;}\
.patreon_reward:not(.is_locked) .patreon_reward_icon {\
    background-image: linear-gradient(hsla(88, 65%, 44%, 0.12) 0%, hsla(88, 72%, 21%, 0.5) 100%)!important;\
    border: 1px solid hsl(90, 90%, 30%)!important;\
}\
.patreon_hero_step:nth-child(1) .patreon_hero_step_number {color: hsla(13, 68%, 45%, 1);}\
.patreon_hero_step:nth-child(3) .patreon_hero_step_number {color: hsla(144, 87%, 30%, 1);}\
.patreon_hero_step:nth-child(1) .patreon_hero_step_action_btn {\
    background-image: linear-gradient(hsla(13, 68%, 48%, 0.9) 0%, hsla(13, 68%, 40%, 0.9) 100%);\
    background-color: hsla(13, 68%, 40%, 0.9);\
}\
.patreon_hero_step:nth-child(2) .patreon_hero_step_action_btn {\
    background-color: hsla(210, 85%, 36%, 0.9);\
    background-image: linear-gradient(hsla(210, 75%, 45%, 0.9) 0%, hsla(210, 85%, 36%, 0.9) 100%);\
}\
.patreon_hero_step:nth-child(3) .patreon_hero_step_action_btn {\
    background-color: hsla(144, 87%, 22%, 0.9);\
    background-image: linear-gradient(hsla(144, 95%, 30%, 0.9) 0%, hsla(144, 87%, 22%, 0.9) 100%);\
}\
.patreon_hero_step:nth-child(2) .patreon_hero_step_action_outline, .patreon_hero_step:nth-child(2) .fa-check:before {color: hsla(201, 43%, 57%, 0.85)!important;}\
.patreon_hero_step:nth-child(2) .patreon_hero_step_action_outline {\
    background-image: linear-gradient(hsla(201, 43%, 57%, 0.12) 0%, hsla(201, 53%, 27%, 0.5) 100%) !important;\
    border-color: hsla(201, 43%, 57%, 0.85);\
}\
.patreon_hero_step:nth-child(3) .patreon_hero_step_action_btn {\
    background-color: hsla(144, 87%, 22%, 0.9);\
    background-image: linear-gradient(hsla(144, 95%, 30%, 0.9) 0%, hsla(144, 87%, 22%, 0.9) 100%);\
}\
.patreon_hero_step:nth-child(3) .patreon_hero_step_action_outline, .patreon_hero_step:nth-child(3) .fa-star:before {color: hsla(144, 87%, 30%, 1)!important;}\
.patreon_hero_step:nth-child(3) .patreon_hero_step_action_outline {\
    background-image: linear-gradient(hsla(144, 95%, 35%, 0.12) 0%, hsla(144, 70%, 20%, 0.5) 100%) !important;\
    border-color: hsla(144, 87%, 30%, 1);\
}\
.patreon_reward_summary_checkbox i, .patreon_reward_gif_option > div i {\
    color: hsla(0, 0%, 80%, 0.95);\
	text-shadow: 1px 1px ' + config[0][12] + ';\
}\
.patreon_reward_summary_checkbox.is_selected .patreon_reward_summary_checkbox_inner {background-color: hsla(144, 87%, 22%, 0.9);}\
.patreon_reward_summary_color_image_inner, .patreon_reward_summary_checkbox_inner {background-color: #000000;}\
.patreon_reward_summary_color_image_outer, .patreon_reward_summary_checkbox_outer {\
	background-color: ' + config[14] + ';\
	border: 1px solid ' + config[0][50] + ';\
}\
.patreon_reward_summary_color.is_inactive .patreon_reward_summary_color_image_inner {background-image: repeating-linear-gradient(45deg, transparent, transparent 5px, hsl(0, 0%, 28%) 5px, hsl(0, 0%, 28%) 10px);}\
.patreon_reward_summary_color_name, .patreon_reward_summary_checkbox, .patreon_reward_avatar_slider_name, .patreon_reward_gif_heading {color: hsl(210, 6%, 60%)!important;}\
.patreon_reward_avatar_style_solid, .patreon_reward_avatar_style_dashed, .patreon_reward_avatar_style_dotted, .patreon_reward_avatar_style_double {border-color: hsl(0, 0%, 50%)!important;}\
.patreon_reward_avatar_preview {\
    border-color: hsl(0, 0%, 50%)!important;\
    background-color: hsl(0, 0%, 25%);\
}\
.patreon_reward_gif_option, .patreon_reward_gif_selected {border: 1px solid ' + config[0][50] + ';}\
.patreon_reward_gif_heading, .patreon_reward_gif_divider {\
    border-bottom: 1px solid ' + config[0][37] + ';\
    box-shadow: 0 1px 0 ' + config[0][38] + ';\
}\
.patreon_reward_gif > div:last-child {\
    border-left: 1px solid ' + config[0][38] + ';\
    box-shadow: -1px 0 0 ' + config[0][37] + ';\
}\
.patreon_reward_gif_option.is_loading > div {background-color: hsla(0, 0%, 25%, 1);}\
.patreon_reward_gif_option.is_selected > div {background-color: hsla(144, 87%, 22%, 0.9);}\
.pinned-giveaways__outer-wrap {margin-top: 8px;}\
.pinned-giveaways__button, .pinned-giveaways__inner-wrap {\
	background-color: transparent;\
	background-image: linear-gradient(' + config[0][5] + ' 0%, ' + config[0][83] + ' 100%);\
	border: 1px solid ' + config[0][84] + ';\
}\
.pinned-giveaways__inner-wrap > .giveaway__row-outer-wrap:not(:last-child) {\
	border-bottom: 1px solid ' + config[0][85] + ';\
	box-shadow: 0 1px 0 ' + config[0][86] + ';\
}\
.pinned-giveaways__button {border-top: none;}\
.pinned-giveaways__button:hover, .esgst-pgb-button:hover, .esgst-gf-button:hover {\
	background-image: linear-gradient(' + config[0][86] + ' 0%, ' + config[0][83] + ' 100%);\
	filter: brightness(1.15);\
}\
.pinned-giveaways__inner-wrap:not(.esgst-gv-view) * .giveaway__heading__thin:not(.copies__tagged) {color: ' + config[0][87] + ';}\
.pinned-giveaways__outer-wrap {\
	box-shadow: 0 0 6px 2px ' + config[0][150] + ';\
	border-radius: 4px;\
}\
.poll, .homepage_heading + .table {\
	background-color: ' + config[0][222] + ' !important;\
	border: 1px solid ' + config[0][223] + ' !important;\
}\
.poll__answer-container--negative .poll__vote-graph {\
	background-image: linear-gradient(hsl(220, 3%, 40%) 0%, hsl(220, 3%, 20%) 100%);\
	border-color: hsl(220, 2%, 52%) hsl(220, 2%, 45%) hsl(220, 3%, 40%) hsl(220, 2%, 45%);\
}\
.poll__answer-container--positive .poll__vote-graph {\
	background-image: linear-gradient(hsl(98, 43%, 44%) 0%, hsl(110, 69%, 24%) 100%);\
	border-color: hsl(84, 34%, 58%) hsl(84, 34%, 45%) hsl(84, 34%, 40%) hsl(84, 34%, 45%);\
}\
.poll__description {opacity: 0.85;}\
.poll__vote-button--voted > .icon-green {color: ' + config[36] + ' !important;}\
.poll__vote-button--voted:active > .icon-green {color: ' + config[0][156] + ';}\
.poll__vote-results__total, .poll__description {color: ' + config[0][231] + ';}\
.poll__vote-results__percentage {color: ' + config[0][232] + ';}\
.poll .table__heading {\
	background-color: ' + config[0][224] + ';\
	border-bottom: 1px solid ' + config[0][223] + ' !important;\
	color: ' + config[66] + ';\
}\
.poll .table__column__heading {color: ' + config[65] + ';}\
.poll .table__row-outer-wrap:not(:last-of-type) {\
	border-bottom: 1px solid ' + config[0][225] + ';\
	box-shadow: 0 1px 0 ' + config[0][226] + ';\
}\
.popup, .esgst-popup, .SGv2_Dark_popup {\
	background-color: ' + config[2] + ';\
	border: solid 1px ' + config[0][24] + ';\
	box-shadow: 0 0 15px ' + config[34] + ', 2px 2px 5px ' + config[0][214] + ', 1px 1px 2px ' + config[0][218] + ';\
	text-shadow: 1px 1px 1px ' + config[0][10] + ';\
}\
.popup img {\
	background-color: ' + config[0][201] + ';\
	box-shadow: 0 0 10px 3px ' + config[34] + ';\
	filter: brightness(0.8);\
}\
.popup__heading, .popup_heading_h1, .esgst-popup-title {color: ' + config[10] + ';}\
.popup__actions > *, .popup_actions > * {box-shadow: 0 1px 0 rgba(255,255,255,0.3);}\
.popup__icon {\
	background-color: ' + config[0][200] + ';\
	border: 1px solid ' + config[10] + ';\
	color: ' + config[10] + ';\
}\
.popup__icon.fa.fa-gift {padding: 10px;}\
.popup__keys__list {\
	background-color: ' + config[0][8] + ';\
	border-color: transparent;\
	box-shadow: 1px -1px ' + config[0][90] + ', 1px 1px ' + config[0][90] + ', -1px 1px ' + config[0][90] + ', -1px -1px ' + config[0][90] + ';\
	color: ' + config[8] + ';\
	margin-bottom: 20px;\
	max-height: 109px;\
	padding: 5px 10px;\
	text-shadow: inherit;\
}\
.popup.popup--getting-started > p.popup__heading {font: 600 24px "Open Sans",sans-serif;}\
.popup.popup--getting-started {padding: 35px 75px;}\
.review_description.markdown {margin-right: 25px;}\
.reviews + form, .page_inner_wrap.medium form {padding: 3px 10px 8px 10px !important;}\
.review_reply {\
	background-image: linear-gradient(' + config[0][6] + ' -10%, hsla(0,0%,0%,0) 90%);\
	border-bottom: none;\
	box-shadow: 0 1px 0 ' + config[0][34] + ' inset;\
	position: relative;\
	text-shadow: inherit;\
}\
.review_reply:before {\
	background-size: 100%;\
	background-image: linear-gradient(to bottom, ' + config[0][34] + ' 0%, rgba(0, 0, 0, 0));\
	width: 1px;\
	height: 100%;\
	position: absolute;\
	left: 0;\
	top: 2px;\
	content: "";\
}\
.review_reply:after {\
	background-size: 100%;\
	background-image: linear-gradient(to bottom, ' + config[0][34] + ' 0%, rgba(0, 0, 0, 0));\
	width: 1px;\
	height: 100%;\
	position: absolute;\
	right: 0;\
	top: 2px;\
	content: "";\
}\
.review_rating {\
	border: 1px solid ' + config[0][34] + ';\
	border-left: none;\
}\
.review_rating.is_positive {\
	background-color: ' + config[0][6] + ';\
	background-image: linear-gradient(' + config[18] + ' -40%, hsla(0,0%,0%,0) 100%);\
	border-radius: 0 3px 3px 0;\
}\
.review_rating.is_positive > div {\
	background-color: transparent;\
	background-image: none;\
	color: ' + config[0][112] + ' !important;\
	text-shadow: 1px 1px ' + config[0][13] + ', 0 0 2px ' + config[0][10] + ';\
}\
.review_rating.is_negative {\
	background-color: ' + config[0][6] + ';\
	background-image: linear-gradient(' + config[19] + ' -40%, hsla(0,0%,0%,0) 100%);\
	border-radius: 0 3px 3px 0;\
}\
.review_rating.is_negative > div {\
	background-color: hsla(0,0%,0%,0);\
	background-image: none;\
	color: ' + config[0][99] + ' !important;\
	text-shadow: 1px 1px ' + config[0][11] + ', 0 0 2px ' + config[0][12] + ';\
}\
.review_flex {\
	border-radius: 3px 0 0 3px;\
	padding: 10px 15px;\
}\
.row-spacer {\
	background-color: ' + config[0][38] + ';\
	border-left: 1px solid ' + config[0][38] + ';\
	border-right: 1px solid ' + config[0][38] + ';\
	box-shadow: 0 1px 0 ' + config[0][38] + ';\
}\
.sale-savings--high, .offer__discount, #content .deal_game_discount {\
	cursor: inherit;\
}\
.sg-info {\
	background-image: linear-gradient(' + config[0][21] + ' 0%, ' + config[0][20] + ' 100%) !important;\
	filter: saturate(0.6);\
}\
.sg-info, .sg-info-txt {\
	color: ' + config[0][36] + ';\
	cursor: context-menu;\
}\
.SGv2_Dark__Option {\
	width: 265px;\
	float: left;\
}\
.SGv2_Dark__Option .form__heading__text, .SGv2_Dark__Settings_Content .form__heading__text {\
	font: 700 14px "Open Sans",sans-serif;\
	vertical-align: middle;\
}\
.SGv2_Dark__sidebar__entry-insert, .SGv2_Dark__sidebar__entry-delete, .SGv2_Dark__sidebar__error {\
	box-sizing: initial;\
	font: 600 13px/20px "Open Sans",sans-serif;\
	margin-right: 10px;\
	margin-bottom: 6px;\
	width: 55px;\
	border-style: solid;\
	border-width: 1px;\
	cursor: pointer !important;\
	padding: 0 15px;\
	text-align: center;\
	border-radius: 4px;\
	padding-bottom: 2px;\
}\
.SGv2_Dark__colorModal.popup {\
	padding: 0;\
	background-color: ' + config[2] + ';\
}\
.SGv2_Dark__colorModal_background {\
	background-color: hsla(0, 0%, 6%, 0.0);\
	cursor: pointer;\
	height: 100%;\
	left: 0;\
	position: fixed;\
	top: 0;\
	width: 100%;\
	z-index: 99998;\
}\
.SGv2_Dark__colorModal {\
	border-radius: 8px;\
	left: 50%;\
	margin-left: -500px;\
	position: fixed;\
	top: 20px;\
	width: 1000px;\
	z-index: 99999;\
}\
.SGv2_Dark__colorModal .popup__icon {\
	background-color: transparent;\
	border: none;\
	font-size: 38px;\
	margin: -16px 0 0 20px;\
	padding: 0;\
}\
.SGv2_Dark__Dialog {\
	border-radius: 12px !important;\
	border: 1px solid !important;\
	background-image: linear-gradient(' + config[0][63] + ' 0%, ' + config[18] + '  50%, ' + config[0][64] + ' 100%) !important;\
	border-color: ' + config[0][65] + ' ' + config[0][66] + ' ' + config[0][67] + ' ' + config[0][66] + ' !important;\
	box-shadow: 0 0 3px #000000 !important;\
	filter: hue-rotate(20deg) saturate(0.7);\
	text-shadow: 1px 1px hsla(0,0%,0%,1), 0 0 2px hsla(0,0%,0%,1);\
	padding: 0;\
	height: 70px !important;\
	width: 305px !important;\
}\
.SGv2_Dark__Dialog #dialog-message {padding: 0;}\
.SGv2_Dark__Message {\
	display: flex;\
	color: ' + config[0][112] + ' !important;\
	justify-content: center;\
	margin-top: 23px;\
	font: 700 18px "Open Sans",sans-serif;\
}\
.SGv2_Dark__OptionsContainer {\
	-webkit-column-count: 3;\
	-webkit-column-gap: 30px;\
	-moz-column-count: 3;\
	-moz-column-gap: 30px;\
	column-count: 3;\
	column-gap: 30px;\
	margin: 20px 13px 20px 20px;\
}\
.SGv2_Dark__OptionsContainer input{\
	display: inline-block;\
	float: none;\
}\
.SGv2_Dark__config input {\
	-webkit-box-sizing: border-box;\
	box-sizing: border-box;\
	box-shadow: none;\
	height: inherit;\
	line-height: normal !important;\
	padding: 0 2px;\
	text-align: center;\
}\
.SGv2_Dark__config input[type="color"] {\
	block-size: 20px !important;\
	border: none;\
	background-color: hsla(0,0%,0%,0) !important;\
	height: 20px;\
	padding-block-start: 3px;\
	padding-block-end: 2px;\
	width: 35px;\
}\
.SGv2_Dark__config input[type="text"] {\
	block-size: 16px !important;\
	border: 1px solid;\
	border-radius: 2px;\
	font: 12px Arial,sans-serif;\
	margin: 2px 3px;\
	width: 29px;\
}\
#SGv2_Dark__OptionsContainer-1 .SGv2_Dark__Option:first-of-type + input[type="text"] {\
	margin-left: -118px;\
	width: 150px !important;\
}\
.SGv2_Dark__Overlay {\
	background: url(' + config[33] + ') top center/cover no-repeat fixed;\
	filter: opacity(' + config[29] + ') brightness(' + config[30] + ') blur(' + config[31] + 'px) saturate(' + config[32] + ');\
	height: 100%;\
	left: 0;\
	position: fixed;\
	top: 0;\
	width: 100%;\
	' + zindex + ';\
}\
.SGv2_Dark__settings {\
	cursor: pointer;\
	padding-left: 20px;\
}\
.SGv2_Dark__Buttons{\
	display: flex;\
	justify-content: center;\
	margin: 5px;\
}\
.SGv2_Dark__Current_Settings input[type="text"], .SGv2_Dark__Import_Settings input[type="text"], .SGv2_Dark__Preset_Settings input[type="text"] {\
	border: 1px solid;\
	border-radius: 4px;\
	box-shadow: none;\
	font: 12px Arial,sans-serif;\
	height: inherit !important;\
	line-height: 1em;\
	margin-bottom: initial;\
	padding: 5px 8px;\
	width: 90%;\
}\
.SGv2_Presets input[name="Preset"] {width: 100%;}\
.SGv2_Dark__Preset_Settings {\
	display: flex;\
	justify-content: flex-end;\
	margin: 10px 0 -5px 15px;\
	width: 95%;\
}\
.SGv2_Presets input[type="radio"] + label {\
	color: ' + config[10] + ';\
	margin-bottom: 0;\
	padding-right: initial;\
	width: 40px;\
}\
.SGv2_Presets input[type="radio"] + label span {\
	border-radius: 50%;\
	cursor: pointer;\
	display: inline-block;\
	height: 12px;\
	margin: 0 12px 3px 3px;\
	vertical-align: middle;\
	width: 12px;\
}\
.SGv2_Presets input[type="radio"] + label span {background-color: ' + config[2] + ';}\
.SGv2_Presets input[type="radio"]:checked + label span {background-color: ' + config[19] + ';}\
.SGv2_Presets input[type="radio"] + label span, input[type="radio"]:checked + label span {\
	-webkit-transition: background-color 0.3s linear;\
	-o-transition: background-color 0.3s linear;\
	-moz-transition: background-color 0.3s linear;\
	transition: background-color 0.3s linear;\
}\
.SGv2_Presets input[type="radio"] + label > span:before {\
	content:"";\
	box-shadow: 0 0 1px 1px ' + config[0][161] + ' inset;\
	border-radius:50%;\
	display:inline-block;\
	height:12px;\
	margin: -10px 0 0 -1px;\
	vertical-align:middle;\
	width:12px;\
}\
.SGv2_Presets input[type="radio"] + label:hover > span:before{\
	box-shadow: 0 0 1px 1px ' + config[0][286] + ' inset;\
	margin: -10px 0 0 -1px;\
}\
.SGv2_Presets .popup__heading {\
	margin-bottom: 0;\
	font: 600 18px/18px "Open Sans",sans-serif;\
}\
.SGv2_Dark__Current_Settings {\
	display: flex;\
	justify-content: flex-end;\
	margin: 10px 0 0 15px;\
	width: 95%;\
}\
.SGv2_Dark__Import_Settings {\
	display: flex;\
	justify-content: flex-end;\
	margin: 5px 0 0 15px;\
	padding-bottom: 10px;\
	width: 94.6%;\
}\
.SGv2_Dark__Import_Settings .comment__submit-button {\
	border: 1px solid;\
	border-radius: 4px !important;\
	box-sizing: initial;\
	cursor: pointer;\
	font: 700 13px/22px "Open Sans",sans-serif;\
	height: 24px;\
	margin-top: 2px !important;\
	margin-bottom: 0;\
	padding: 0 14px;\
	text-align: center;\
	width: 125px;\
}\
.SGv2_Dark__Import_Settings .SGv2_Dark, .SGv2_Dark__Import_Settings #import_settings {margin-right: 5px;}\
.SGv2_Presets {\
	background-color: ' + config[0][189] + ';\
	border-bottom: 1px solid ' + config[0][190] + ';\
	border-radius: 8px 8px 0 0;\
	box-shadow: 0 2px 3px ' + config[0][218] + ', 0 1px 2px ' + config[0][218] + ',0px 2px 3px ' + config[0][218] + ', 0 1px 2px ' + config[0][218] + ';\
	color: ' + config[10] + ';\
	cursor: move;\
	display: flex;\
	font: 600 18px/18px "Open Sans",sans-serif;\
	justify-content: center;\
	padding-top: 3px;\
	text-shadow: 1px 1px 1px ' + config[0][10] + ';\
}\
.SGv2_Presets span {margin: 0 10px;}\
.SGv2_Dark__Settings_Container {\
	background-color: ' + config[0][189] + ';\
	border-radius: 0 0 8px 8px;\
	box-shadow: 0 -2px 3px ' + config[0][218] + ', 0 -1px 2px ' + config[0][218] + ',0px -2px 3px ' + config[0][218] + ', 0 -1px 2px ' + config[0][218] + ';\
	text-align: left;\
}\
.SGv2_Dark__Settings_Container:hover .SGv2_Dark__Settings_Content {\
	-webkit-transition-delay: 0s;\
	-moz-transition-delay: 0s;\
	-o-transition-delay: 0s;\
	max-height: 195px;\
	transition-delay: 0s;\
}\
.SGv2_Dark__Settings_Content {\
	-moz-transition: max-height 1s ease-in-out;\
	-webkit-transition: max-height 1s ease-in-out;\
	-o-transition: max-height 1s ease-in-out;\
	-webkit-transition-delay: 5s;\
	-moz-transition-delay: 5s;\
	-o-transition-delay: 5s;\
	background-color: ' + config[0][189] + ';\
	border-bottom-left-radius: 8px;\
	border-bottom-right-radius: 8px;\
	transition: max-height 1s ease-in-out;\
	transition-delay: 5s;\
	max-height: 0;\
	overflow: hidden;\
}\
.SGv2_Dark__Settings_Container .SGv2_Dark__Settings_Header {\
	background-color: ' + config[0][189] + ';\
	border-radius: 0 0 8px 8px;\
	border-top: 1px solid ' + config[0][190] + ';\
	color: ' + config[10] + ';\
	font: 600 16px/18px "Open Sans",sans-serif;\
	padding: 3px 10px 4px;\
	text-align: center;\
	text-shadow: 1px 1px 1px ' + config[0][10] + ';\
}\
.SGv2_Dark__Settings_Container:hover .SGv2_Dark__Settings_Header {color: ' + config[0][191] + ';}\
.SGv2_Dark__tabs {\
	display: flex;\
	justify-content: center;\
}\
#SGv2_Dark__tab-1, #SGv2_Dark__tab-2, #SGv2_Dark__tab-3 {\
	background-color: ' + config[0][189] + ';\
	border: 1px solid ' + config[0][190] + ';\
	border-radius: 0 0 8px 8px;\
	border-top: none;\
	box-shadow: 2px 2px 3px ' + config[0][218] + ', 1px 1px 2px ' + config[0][218] + ',-2px 2px 3px ' + config[0][218] + ', -1px 1px 2px ' + config[0][218] + ';\
	color: ' + config[10] + ';\
	cursor: pointer;\
	font: 600 12px "Open Sans",sans-serif;\
	margin-right: 4px;\
	opacity: 0.4;\
	padding: 3px 15px;\
}\
#SGv2_Dark__tab-1:hover, #SGv2_Dark__tab-2:hover, #SGv2_Dark__tab-3:hover {opacity: 1 !important;}\
.SGv2_Dark__tab-active {opacity: 1 !important;}\
.SGv2_tooltip {\
	background: ' + config[48] + ' !important;\
	border: 1px solid ' + config[0][186] + ' !important;\
	box-shadow: 2px 2px 8px 0 ' + config[0][150] + ' !important;\
	border-radius: 4px !important;\
	color: ' + config[49] + ' !important;\
	font-size: 12px;\
	max-width: 50% !important;\
	opacity: 1;\
	padding: 5px 8px;\
	position: absolute;\
	z-index: 9999 !important;\
}\
#groupTooltip {\
	background-image: linear-gradient(' + config[16] + '  0, ' + config[0][216] + '  6px, ' + config[0][217] + ' 100%);\
	border: 1px solid ' + config[0][24] + ' !important;\
	border-radius: 4px;\
	width: inherit !important;\
	z-index: 999;\
}\
#groupTooltip .table__row-outer-wrap {\
	padding: 5px 10px 5px 5px;\
}\
#content button#check[style*="rgb(204, 184, 188)"], .ruleFailed {\
	border-radius: 4px;\
	box-shadow: none;\
	color: ' + config[0][99] + ' !important;\
}\
.sidebar__entry-delete, #content button#check[style*="rgb(219, 219, 160)"], .SGv2_Dark__sidebar__entry-delete {\
	background-image: linear-gradient(' + config[0][100] + ' 0%, ' + config[0][101] + '  50%, ' + config[0][102] + ' 100%) !important;\
	border-color: ' + config[0][103] + ' ' + config[20] + ' ' + config[0][104] + ' ' + config[20] + ' !important;\
	color: ' + config[0][51] + ' !important;\
	text-shadow: 1px 1px ' + config[0][11] + ', 0 0 2px ' + config[0][10] + ';\
	transition: filter 0.35s ease-in;\
	will-change: filter;\
}\
#content button#check[style*="rgb(219, 219, 160)"] {\
	box-shadow: none;\
	color: ' + config[0][51] + ' !important;\
}\
.sidebar__entry-insert:not(.is-disabled):not(:active):hover, .sidebar__action-button:not(.is-disabled):not(:active):hover, .nav__sits:not(.is-disabled):not(:active):hover, .form__submit-button:not(.is-disabled):not(:active):hover, .form__sync-default:not(.is-disabled):not(:active):hover, .featured__action-button:not(.is-disabled):not(:active):hover, #content button[type="submit"]:hover, #content #activated_send:not(:active):hover, #content #real_cv_send:not(:active):hover, #content #multiple_wins_send:not(:active):hover, #content #giveaway_Create:not(:active):hover, .SGv2_Dark__sidebar__entry-insert:not(:active):hover, .btn_action.green:hover:not(.is_saving):not(.is_disabled):not(:active), .sidebar__shortcut-inner-wrap > :not(.is-disabled):not(:active):not([style*="border: none;"]):hover, .tab-links a:not(:active):hover, .btn_action.white:hover:not(.is_saving):not(.is_disabled):not(:active), .btn_action.grey:hover:not(.is_saving):not(.is_disabled):not(:active), .btn_action.red:hover:not(.is_saving):not(.is_disabled):not(:active), .comment__submit-button:not(.is-disabled):not(:active):hover, .SGv2_Dark__sidebar__error:not(:active):hover, #SGv2_Dark__tab-1:hover, #SGv2_Dark__tab-2:hover, .sidebar__entry-loading:not(.is-disabled):hover, .comment__action-button:not(.is-disabled):hover, .page__description__save:not(.is-disabled):hover, .poll__vote-button:not(.is-disabled):hover, .form__add-answer-button:not(.is-disabled):hover, .form__sync-loading:not(.is-disabled):hover, .form__verify-default:not(.is-disabled):hover, li.active a:hover, .sidebar__entry-insert[style*="border-color: rgb(147, 187, 211)"]:hover, #content #gaurl a:hover, #content .manageGa a:hover, #content .showBundledDeals:hover, #content .back-guide a:hover, #content .gaButton:hover, #content #giveaway_filters_Update:hover, #content .deal_game_discount:hover, #btn-get:hover, .btn-success:hover, .btn-danger:hover, .GDCBPButton:hover, .sp-container button:not(:active):hover, .esgst-sm-colors-default:hover, .view_key_btn:not(:active):hover, .esgst-sgpb-button:not(:active):hover, .esgst-sttb-button:hover {filter: brightness(' + config[51] + ');}\
.sidebar__entry-delete:not(:active):hover, .SGv2_Dark__sidebar__entry-delete:not(:active):hover {filter: brightness(' + (+config[51]+ (-0.05)) + ');}\
.sidebar__entry-insert[style*="border-color: rgb(147, 187, 211)"] {\
	background-image: linear-gradient(' + config[0][193] + ' 0%, ' + config[0][194] + '  50%, ' + config[0][195] + ' 100%) !important;\
	border-color: ' + config[0][196] + ' ' + config[23] + ' ' + config[0][197] + ' ' + config[23] + ' !important;\
	color: ' + config[0][249] + ' !important;\
}\
.sidebar__entry-loading, .comment__action-button, .page__description__save, .poll__vote-button, .form__add-answer-button, .form__sync-loading, .form__verify-default, li.active a, .btn_action.grey, .btn_action.white, .sale-savings--medium, .comment__action-button, .form__verify-default, .comment__submit-button, .form__saving-button, .mt-more-like-this, .sp-container button, .view_key_btn, .sidebar__shortcut-inner-wrap > *:not(.sidebar__search-container), .btn_action + .esgst-sgpb-button {\
	background-image: linear-gradient(' + config[0][120] + ' 0%, ' + config[0][121] + ' 100%) !important;\
	border-color: ' + config[0][122] + ' ' + config[0][123] + ' ' + config[0][124] + ' ' + config[0][123] + ' !important;\
	color: ' + config[0][31] + ' !important;\
	text-shadow: 1px 1px 1px ' + config[0][10] + ';\
	transition: filter 0.35s ease-in;\
	will-change: filter;\
}\
.sp-container button {\
	background-color: transparent !important;\
	text-shadow: 1px 1px 1px hsla(0, 0%, 0%, 0.999) !important;\
}\
.sidebar__entry__points {font-weight: 600;}\
.sidebar__error, .sidebar__suspension, #content button#check[style*="rgb(204, 184, 188)"], .ruleFailed, .SGv2_Dark__sidebar__error, .cmGame {\
	cursor: default !important;\
}\
.sidebar__heading {\
	border-bottom: none;\
	box-shadow: none;\
	color: ' + config[10] + ';\
	font-size: 100% !important;\
	text-shadow: 1px 1px ' + config[0][10] + ';\
}\
.sidebar > .heading, .reply_form > .heading {\
	color: ' + config[10] + ';\
	text-shadow: 1px 1px ' + config[0][10] + ';\
}\
.sidebar_table > div:not(:first-child) {border-top: none;}\
.sidebar__mpu {\
	margin-bottom: 0;\
	height: auto !important;\
	display: block;\
}\
.sidebar.sidebar--wide > .sidebar__mpu + .sidebar__search-container, .sidebar.sidebar--wide > .sidebar__outer-wrap > .sidebar__mpu + .sidebar__search-container {margin-top: 8px;}\
.sidebar.sidebar--wide > .sidebar__mpu[style*="none"] + .sidebar__search-container {margin-top: 0;}\
.sidebar__navigation, #sidebar_sgpp_filters, .sgun_notes_panel, .sidebar_table, .esgst-ags-panel, .sidebar .esgst-adots {\
	background-image: linear-gradient(' + config[16] + '  0, ' + config[0][144] + '  6px, ' + config[0][145] + ' 100%);\
	border: 1px solid;\
	border-color: ' + config[0][146] + ' ' + config[0][147] + ' ' + config[0][149] + ' ' + config[0][147] + ';\
	border-radius: 4px;\
	box-shadow: 1px 1px 2px ' + config[0][148] + ' inset;\
	margin-top: 5px;\
	padding: 4px;\
	text-shadow: 1px 1px ' + config[0][12] + ';\
}\
.sidebar_table {\
	color: inherit;\
	margin-top: 1px;\
	padding: 0 15px;\
}\
.sidebar_table > div {padding: 10px 5px;}\
.sidebar__navigation__item__count {color: ' + config[0][151] + ';}\
.sidebar__navigation__item__link:hover {\
	background-image: linear-gradient(' + config[0][152] + ' 0%, ' + config[0][145] + ' 100%);\
	border: 1px solid;\
	border-color: ' + config[0][146] + ' ' + config[0][147] + ' ' + config[0][147] + ' ' + config[0][147] + ';\
	border-radius: 4px;\
}\
.sidebar__navigation__item__link:not(:hover) .sidebar__navigation__item__underline{\
	border-bottom: 1px dotted ' + config[0][158] + ';\
	box-shadow: 0 1px 0 ' + config[0][147] + ';\
}\
.sidebar__navigation__item__underline {opacity: 0.5;}\
.sidebar__search-container i, .header_search > div > div > div:last-child {\
	color: ' + config[0][272] + ';\
	text-shadow: 1px 1px 1px ' + config[0][10] + ';\
}\
.header_search i {filter: brightness(1.15);}\
.sidebar__search-container, input:not(.comment__submit-button):not(.ui_tpicker_time_input):not(.sp-input):not([type="file"]), select, textarea, .sp-light, .bootstrap-select.btn-group:not(.input-group-btn), .bootstrap-select.btn-group[class*=col-] {\
	background-color: ' + config[11] + ' !important;\
	border-color: ' + config[0][160] + ' !important;\
	border-radius:4px;\
	color: ' + config[0][161] + ' !important;\
	text-shadow: 1px 1px 1px ' + config[0][10] + ';\
}\
input.ui_tpicker_time_input, input.sp-input {\
	color: ' + config[8] + ';\
	text-shadow: 1px 1px ' + config[0][12] + ';\
}\
.SGv2_Dark__config input:not(.comment__submit-button):not([type="file"])[type="color"] {\
	background-color: hsla(0,0%,0%,0) !important;\
}\
.sidebar__shortcut-inner-wrap > *:not(.sidebar__search-container):not(:active), .tab-links a, .profile_links .btn_action.white:not(:active), .esgst-sgpb-button:not(:active) {\
	background-image: linear-gradient(' + config[0][179] + ' 0%, ' + config[0][180] + ' 100%) !important;\
	border-color: ' + config[0][181] + ' ' + config[0][182] + ' ' + config[0][183] + ' ' + config[0][182] + ' !important;\
	color: ' + config[0][164] + ' !important;\
	text-shadow: 1px 1px 1px ' + config[0][10] + ';\
	transition: filter 0.35s, opacity .35s;\
	will-change: filter, opacity;\
}\
.sidebar__shortcut-inner-wrap > *.is-selected.sidebar__shortcut__blacklist {\
	background-image: linear-gradient(' + config[0][77] + ' 0%, ' + config[19] + '  50%, ' + config[0][187] + ' 100%) !important;\
	border-color: ' + config[0][95] + ' ' + config[0][96] + ' ' + config[0][97] + ' ' + config[0][96] + ' !important;\
	color: ' + config[0][99] + ' !important;\
	text-shadow: 1px 1px 1px ' + config[0][11] + ', 0 0 1px ' + config[0][12] + ';\
}\
.sidebar__navigation__item.is-selected .sidebar__navigation__item__name, .sidebar__navigation__item.is-selected i, .icon-red, .author_small .is_negative, .table i.red, .table .reputation .is_negative, .pagination__navigation a.is-selected, .pagination_navigation a.is_selected, i.fa.fa-times-circle-o.red, .poll__delete-input, .sg-icon-red, .header_search .description .red, .dropdown_btn i.red, .popup.is_error .popup_icon i, .rating_checkbox.is_negative.is_selected, .sidebar_table > div.is_warning i, .FTB-suspension-string, .sidebar__shortcut__blacklist.esgst-blacklist, .fa-ban.esgst-blacklist, .esgst-blacklist, .fa-times-circle.esgst-negative, .fa-thumbs-down.esgst-negative, .esgst-negative, #SGIgnore-QuickButton-ProfileAddUser i, .esgst-header-menu-row i.red, .esgst-ap-suspended >*, .form__row span[style*="color: #da5d88"], .esgst-popup .esgst-warning, .tooltip_row i[style*="color: #ec8583"], .esgst-red, .table__column__deleted {color: ' + config[37] + ' !important;}\
.sidebar__shortcut-inner-wrap > *.is-selected.sidebar__shortcut__whitelist {\
	background-image: linear-gradient(' + config[0][193] + ' 0%, ' + config[0][194] + '  50%, ' + config[0][195] + ' 100%) !important;\
	border-color: ' + config[0][196] + ' ' + config[23] + ' ' + config[0][197] + ' ' + config[23] + ' !important;\
	color: ' + config[0][198] + ' !important;\
	text-shadow: 1px 1px 1px ' + config[0][11] + ', 0 0 1px ' + config[0][12] + ' !important;\
}\
.sidebar--wide{max-width: 334px;}\
.bundles_section .sidebar__navigation__item__name {\
	display: flex;\
	flex-direction: column;\
}\
.sidebar__navigation__item__name {max-width: 225px;}\
.bundles_section .sidebar__navigation__item__underline {\
	margin: 0 2px;\
	min-width: 2px;\
}\
a.sidebar__navigation__item__link span.bundleShop {\
	color: #b550ae !important;\
	padding-left: 0 !important;\
}\
.bundles_section {max-width: calc(100% - 10px);}\
.sidebar__navigation.bundles_section .sidebar__navigation__item__name ~ .sidebar__navigation__item__count {margin-bottom: -10px;}\
a.sidebar__navigation__item__link.expired *:not(.sidebar__navigation__item__underline) {opacity: 0.8;}\
.icon-blue, .icon_to_clipboard, .dropdown_btn i.blue, .sidebar__shortcut__whitelist.esgst-whitelist, .esgst-whitelist, .sg-icon-blue, .esgst-header-menu-row i.blue, .tooltip_row i[style*="color: #84cfda"] {color: hsla(187,43%,55%,1) !important;}\
.sidebar__shortcut-tooltip-relative {\
	-webkit-transition: visibility 0s linear .3s,opacity .3s ease 0s,top .3s ease 0s;\
	transition: visibility 0s linear .3s,opacity .3s ease 0s,top .3s ease 0s;\
}\
.header_search > div > div > div:last-child:active, .header_search > div > div > div:last-child:active, .sidebar__shortcut-inner-wrap > *:not(.is-disabled):active, .sidebar__entry-loading:not(.is-disabled):active, .comment__submit-button:not(.is-disabled):active, .page__description__save:not(.is-disabled):active, .poll__vote-button:not(.is-disabled):active, .form__add-answer-button:not(.is-disabled):active, .form__sync-loading:not(.is-disabled):active, .btn_action:active:not(.is_saving):not(.is_disabled), .sidebar__entry-insert:not(.is-disabled):active, .sidebar__action-button:not(.is-disabled):active, .nav__sits:not(.is-disabled):active, .form__submit-button:not(.is-disabled):active, .form__sync-default:not(.is-disabled):active, .featured__action-button:not(.is-disabled):active, .SGv2_Dark__sidebar__entry-insert:active, .sidebar__entry-delete:active, .SGv2_Dark__sidebar__entry-delete:active, .SGv2_Dark__sidebar__error:active, #content #gaurl a:active, #content .manageGa a:active, #content .showBundledDeals:active, #content button[type="submit"]:active, #content #activated_send:active, #content #real_cv_send:active, #content #multiple_wins_send:active, #content #giveaway_Create:active, #content .back-guide a:active, #content .gaButton:active, #content #giveaway_filters_Update:active, .sp-container button:active, .esgst-sm-colors-default:active, .view_key_btn:active, .esgst-sgpb-button:active {\
	border-color: hsla(0,0%,0%,0.75) hsla(0,0%,55%,0.5) hsla(0,0%,55%,0.5) hsla(0,0%,0%,0.75) !important;\
	border: 1px solid;\
	box-shadow: 2px 2px 2px hsla(0,0%,0%,0.5) inset, 7px 7px 10px hsla(0, 0%, 5%, 0.5) inset !important;\
	margin-top: 0;\
	margin-left: 0;\
	text-shadow: 1px 1px 1px ' + config[0][10] + ' !important;\
	filter: brightness(0.35);\
	transition: filter 0.01s;\
	will-change: filter;\
}\
.header_search > div > div > div:last-child:active, .header_search > div > div > div:last-child:active {\
	color: rgb(255, 255, 255);\
	margin: -2px  -2px 0 0;\
}\
#content .showBundledDeals:active {\
	margin-top: 20px;\
	margin-bottom: 15px;\
}\
#content button[type="submit"], #content #activated_send:active, #content #real_cv_send:active, #content #multiple_wins_send:active, #content #giveaway_Create:active, #content .gaButton, #content #giveaway_filters_Update {margin-top: 10px !important;}\
.sidebar__search-input {\
	background-color: ' + config[11] + ';\
	color: ' + config[0][161] + ' !important;\
	text-shadow: 1px 1px 1px ' + config[0][10] + ';\
}\
.sidebar__shortcut-tooltip-absolute:not(.sgun_notes_panel) {\
	background-image: linear-gradient(' + config[0][100] + ' 0%, ' + config[0][101] + '  50%, ' + config[0][102] + ' 100%);\
	border-color: ' + config[0][103] + ' ' + config[20] + ' ' + config[0][104] + ' ' + config[20] + ';\
	box-shadow: none;\
	color: ' + config[0][51] + ';\
	font-size: 12px;\
	font-weight: 600;\
	text-shadow: 1px 1px ' + config[0][11] + ', 0 0 2px ' + config[0][10] + ';\
}\
.sidebar__shortcut-tooltip-absolute.tooltip {\
	background: ' + config[48] + ' !important;\
	border: 1px solid ' + config[0][186] + ' !important;\
	box-shadow: 2px 2px 8px 0 ' + config[0][150] + ' !important;\
	border-radius: 4px !important;\
	color: ' + config[49] + ' !important;\
	margin-top: 5px;\
}\
.sidebar__suspension-time {\
	background-image: linear-gradient(' + config[19] + ' 18%, ' + config[0][78] + ' 100%) !important;\
	border-color: ' + config[0][95] + ' ' + config[0][96] + ' ' + config[0][97] + ' ' + config[0][96] + ' !important;\
	color: ' + config[0][99] + ';\
	margin-top: -10px;\
	padding: 0 5px;\
	text-shadow: 1px 1px 1px ' + config[0][12] + ', 0 0 1px ' + config[0][12] + ';\
}\
.sidebar {min-width: 206px;}\
.sidebar--wide {\
	min-width: 334px;\
	max-width: 334px;\
}\
.sp-input {\
	filter: brightness(.8);\
	border-color: ' + config[0][160] + ' !important;\
}\
.sp-button-container {will-change: transform;}\
.sp-picker-container {border-left: 1px solid ' + config[0][160] + ';}\
.sp-palette-container {border-right: 1px solid ' + config[0][37] + ';}\
.sp-palette .sp-thumb-el {border: 1px solid ' + config[0][37] + ' !important;}\
.sp-replacer {margin: 1px;}\
strong {filter: brightness(1.25);}\
.table__column__secondary-link:not(.esgst-namwc-highlight):not(.esgst-wbh-highlight), .pagination__navigation a:not(.is-selected) span, .pagination_navigation a:not(.is_selected) span, .comment__cancel-button span, .page__description__cancel span, .form__edit-button span, .form__logout-button span, .comment__username a:not(.esgst-namwc-highlight):not(.esgst-wbh-highlight), a.author_name:not(.is_op):not(.esgst-namwc-highlight):not(.esgst-wbh-highlight), .comment__actions__button, .page__description__edit, .giveaway__username, .giveaway__links span, .action_list a, .popup__actions > *, .popup__description__small a {\
	border-bottom: 1px dotted;\
	box-shadow: 0 1px 0 ' + config[0][199] + ' !important;\
}\
.table__column--width-medium {width: 26%;}\
.table__column--width-small {\
	min-width: 97px;\
}\
.table__column--width-fill > a > .fa-heart {vertical-align: baseline;}\
.table__heading, .markdown th, #content th {\
	color: ' + config[10] + ';\
	font-size: 100%;\
	text-shadow: 1px 1px 1px ' + config[0][10] + ', 0 0 1px ' + config[0][10] + ';\
}\
.markdown th {color: ' + config[61] + ';}\
.table__heading {\
	background-color: ' + config[12] + ';\
	border: none !important;\
	border-radius: 3px;\
	border-bottom: 1px solid ' + config[0][24] + ' !important;\
	border-bottom-left-radius: 0;\
	border-bottom-right-radius: 0;\
	margin: -5px -10px 5px;\
}\
.table__heading ~ .table__heading {\
	margin: -1px -10px 5px;\
	border-top: 1px solid ' + config[0][24] + ' !important;\
	border-radius: 0;\
}\
.table > .table__heading + .table__rows > .table__heading, .table__rows > .table__heading {\
	border-radius: 0;\
	border-top: none !important;\
	margin: -20px -10px 5px;\
	padding: 0 1px;\
}\
.table__rows > .table__heading {\
	margin: 5px -10px 5px;\
	border-top: 1px solid ' + config[0][24] + ' !important;\
}\
.table .header {\
	color: ' + config[10] + ';\
	margin: -5px -10px 5px;\
	border-radius: 3px 3px 0 0 !important;\
	background-color: ' + config[12] + ';\
	border: none !important;\
	border-bottom: 1px solid ' + config[0][24] + ' !important;\
}\
.table__row-inner-wrap.is-faded .table__column__heading, h3 a:visited:not(.esgst-float-right), .endless_new_comments .table__column__heading, .endless_no_new_comments .table__column__heading, .table__column--width-fill[style*="opacity"] .table__column__heading, .esgst-ct-visited .table__column__heading {color: ' + config[39] + ';}\
.table__row-inner-wrap.is-faded:hover, .giveaway__row-inner-wrap:not(.esgst-gv-box).is-faded:hover {opacity: 0.5;}\
.table__row-inner-wrap:hover .table__column__heading, .table__row-inner-wrap:hover .homepage_table_column_heading, .table .row_outer_wrap:hover h3, .giveaway__row-inner-wrap:hover .giveaway__heading__name {filter: brightness(' + config[67] + ');}\
.table__row-outer-wrap[style*="rgba(255, 255, 255, 0.3)"]:not(.esgst-dh-highlighted) {background-color: rgba(0, 0, 0, 0.5) !important;}\
.table__row-outer-wrap, .table .row_outer_wrap, .popup__keys__description {color: ' + config[9] + ';}\
.table__row-outer-wrap:not(:last-of-type), .table .row_outer_wrap:not(:last-of-type), .comments > .comment_outer:not(:last-child), .giveaway__row-outer-wrap:not(:last-child):not(.esgst-gv-container), .comments > .comment:not(:last-child), .popup__keys__list>div:not(:last-of-type), .sgun_note:not(:last-of-type), .profile_summary, #content .store-entry a, .__table_row_banned, .sidebar_table > div:not(:last-child) {\
	border-bottom: 1px solid ' + config[0][37] + ' !important;\
	box-shadow: 0 1px 0 ' + config[0][38] + ';\
}\
textarea {\
	background-color: ' + config[0][7] + ';\
	overflow: hidden;\
}\
.ui-widget {\
	background: hsla(0,0%,0%,0.13);\
	border-radius: 2px;\
	border: none;\
	box-shadow: 0 0 1px #000000;\
	z-index: 997;\
}\
.ui-datepicker {\
	background: hsla(0,0%,8%,1);\
	border-radius: 4px 4px 0 0;\
	box-shadow: 0 0 15px rgba(0,0,0,0.02),2px 2px 5px rgba(0,0,0,0.05),1px 1px 2px rgba(0,0,0,0.1);\
	color: #788EA8;\
	font-size: 11px;\
	overflow: hidden;\
	padding: 0;\
	width: 218px;\
}\
.ui-datepicker-header {\
	background: hsla(0,0%,25%,1);\
	border-radius: 4px 4px 0 0;\
	border: 1px solid #000;\
	color: #BEBEBE;\
	font-size: 14px;\
	text-shadow: 1px 1px hsla(0,0%,0%,0.7),0 0 2px hsla(0,0%,0%,0.999);\
}\
.ui-datepicker-next.ui-state-disabled,.ui-datepicker-prev.ui-state-disabled {opacity: 0.25;}\
.ui-datepicker-next:not(:hover):not(.ui-state-disabled),.ui-datepicker-prev:not(:hover):not(.ui-state-disabled) {opacity: 0.8;}\
.ui-datepicker-other-month .ui-state-default {opacity: 0.4;}\
.ui-datepicker-other-month .ui-state-default:hover {color: hsl(125,56%,65%) !important;}\
.ui-datepicker-unselectable .ui-state-default {opacity: 0.25;}\
.ui-datepicker table {\
	border-left: 1px solid #000000;\
	border-right: 1px solid #000000;\
}\
.ui-datepicker thead {\
	background-color: hsla(0,0%,35%,0.42);\
	border-bottom: 1px solid #000000;\
}\
.ui-datepicker th {\
	line-height: 29px;\
	text-shadow: 1px 1px hsla(0,0%,0%,0.999);\
}\
.ui-datepicker tbody tr {border-bottom: 1px solid #000000;}\
.ui-datepicker td {\
	border-right: 1px solid #000000;\
	border-top: 1px solid #000000;\
}\
.ui-datepicker tbody td:not(:last-child) {border-right: 1px solid #000000;}\
.ui-datepicker td:last-child {border-right :none;}\
.ui-state-default {\
	color: #6CACD0;\
	font-size: 12px;\
}\
.ui-datepicker td:not(.datepicker-highlight-range) .ui-state-highlight:not(.ui-state-active) {color: hsl(0,53%,53%);}\
.ui-state-disabled .ui-state-default, .ui-datepicker-unselectable  .ui-state-default:hover {color: #9CAEDB !important;}\
.ui-datepicker td span,.ui-datepicker td a {text-shadow: 1px 1px 0 hsla(0,0%,0%,0.7),0 0 2px hsla(0,0%,0%,0.999);}\
.ui-datepicker td:not(.datepicker-highlight-range) a:not(.ui-state-active):hover {\
	background-image: linear-gradient(#424242 0%,#373737 100%);\
	color: hsl(125,36%,43%);\
}\
.ui-datepicker-calendar .ui-state-active,.ui-datepicker-calendar td.datepicker-highlight-range a {\
	background-color: rgba(89,185,96,0.6);\
	color: #bebebe;\
	text-shadow: 1px 1px 1px hsla(0,0%,0%,0.6),-1px 1px 1px hsla(0,0%,0%,0.6);\
}\
.ui-datepicker-calendar td:not(.datepicker-highlight-range) .ui-state-default:not(.ui-state-active) {\
	background-image: linear-gradient(hsl(0,0%,36%) 0%,hsl(0,0%,36%) 100%);\
	box-shadow: inset 1px 1px 1px rgba(255,255,255,0.2);\
}\
.ui-datepicker-calendar .ui-state-active {\
	background: rgba(89,185,96,0.6);\
	box-shadow: 1px 1px 0 hsla(0,0%,27%,0.8) inset;\
}\
.ui-timepicker-div {\
	background-color: hsla(0,0%,35%,0.42);\
	border-bottom: 1px solid #000000;\
	border-left: 1px solid #000000;\
	border-right: 1px solid #000000;\
	box-shadow: none;\
	text-shadow: 1px 1px hsla(0,0%,0%,0.999);\
}\
.ui-datepicker-buttonpane {\
	border-bottom: 1px solid #000000;\
	border-left: 1px solid #000000;\
	border-right: 1px solid #000000;\
}\
.ui-datepicker-buttonpane button:not(:last-child) {border-right: 1px solid #000;}\
.ui-datepicker-buttonpane button {\
	background-image: linear-gradient(hsl(0,0%,26%) 0%,hsl(240,1%,17%) 100%);\
	border-left: 1px solid rgba(255,255,255,0.08);\
	border-top: 1px solid rgba(255,255,255,0.15);\
	color: hsla(201,43%,57%,0.9);\
	text-shadow: 1px 1px hsla(0,0%,0%,0.7),0 0 2px hsla(0,0%,0%,0.999);\
}\
.ui-datepicker-buttonpane button:hover {background-image: linear-gradient(hsl(0,0%,35%) 0%,hsl(0,0%,19%) 100%);}\
.ui-slider-horizontal .ui-slider-handle {\
	background: #2B3A51;\
	border: 1px solid #444;\
	box-shadow: 5px 5px 4px rgba(0, 0, 0, 0.2), 3px 3px 2px rgba(0, 0, 0, 0.2), 2px 2px 1px rgba(0, 0, 0, 0.2);\
	margin-top: -3px;\
}\
.ui-slider-horizontal .ui-slider-handle.ui-state-active {margin-top: -6px;}\
.ui-slider .ui-slider-range {\
	background-image: linear-gradient(#a5da70 0%, #4b890e 100%);\
	border-radius: 2px;\
	box-shadow: 0 0 1px #41454C;\
}\
progress {\
	-webkit-appearance: none;\
	-moz-appearance: none;\
	appearance: none;\
	border: none;\
}\
progress[value], .esgst-progress-bar.ui-widget {	\
	background-color: #1C1C1C !important;\
	border-radius: 8px;\
	border: 1px solid !important;\
	border-color: hsla(0, 0%, 0%, 0.8) hsla(0, 0%, 55%, 0.12) hsla(0, 0%, 55%, 0.12) hsla(0, 0%, 0%, 0.8) !important;\
	color: hsl(98, 40%, 30%);\
	margin-top: 5px;\
	margin-bottom: -5px;\
}\
progress::-webkit-progress-bar {\
	background: none !important;\
	border-radius: 8px;\
}\
progress::-webkit-progress-value, .esgst-progress-bar .ui-progressbar-value {\
	background-image: linear-gradient(#a5da70 0%, #4b890e 100%);\
	border-radius: 6px;\
	box-shadow: 0 0 3px #41454C;\
}\
progress::-moz-progress-bar {\
	background-image: -moz-linear-gradient(#a5da70 0%, #4b890e 100%);\
	border-radius: 6px !important;\
}\
.ui-tooltip, .arrow:after {\
	color: #A0A0A0;\
	background-color: #1C1C1C;\
	border: 2px solid #252525;\
}\
.widget-container > div:not(:first-child), .page_flex > div:not(:first-child) {\
	border-left: none;\
	box-shadow: none;\
	padding-left: 0;\
}\
::-moz-selection {\
	background: ' + config[44] + ';\
	color: ' + config[45] + ';\
	text-shadow: none;\
}\
::selection {\
	background: ' + config[44] + ';\
	color: ' + config[45] + ';\
	text-shadow: none;\
}\
::-webkit-scrollbar {background: transparent;}\
::-webkit-scrollbar-button, ::-webkit-scrollbar-corner {\
	background: ' + config[46] + ' center no-repeat;\
	border: 1px solid ' + config[0][177] + ';\
}\
::-webkit-scrollbar-track {\
	background: ' + config[0][176] + ' center no-repeat;\
	border: 1px solid ' + config[0][177] + ';\
}\
::-webkit-scrollbar-track:horizontal, ::-webkit-scrollbar-thumb:horizontal {\
	border-left: 0;\
	border-right: 0;\
}\
::-webkit-scrollbar-track:vertical, ::-webkit-scrollbar-thumb:vertical {\
	border-bottom: 0;\
	border-top: 0;\
}\
::-webkit-scrollbar-thumb {\
	background: ' + config[46] + ' center no-repeat;\
	box-shadow: 0 0 1px 1px hsla(0, 0%, 0%, 0.6) inset;\
}\
::-webkit-scrollbar-track:vertical {background: ' + config[0][176] + ';}\
::-webkit-scrollbar-track:horizontal {background: ' + config[0][176] + ';}\
::-webkit-scrollbar-button:hover, ::-webkit-scrollbar-thumb:hover {background-color: ' + config[0][178] + ';}\
::-webkit-scrollbar-thumb {background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAJCAYAAADgkQYQAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAD9JREFUeNpi/P//PwMhwAQibly/9h8fzUi0SefPnfuPjybepKNHjvxHpQ+j0MSbtGvXzv/I9G44vYN4kwACDAA7RESWY5qxTAAAAABJRU5ErkJggg==);}\
::-webkit-scrollbar-button:vertical:decrement {\
	background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAFCAYAAACXU8ZrAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAD9JREFUeNpi+P//PwMyTk6I+48uxsSABFIS4//7+PqDaWRxJnQFIICukAldAQwgK2QEuQFdATLYsnkjA0CAAQCJHDCKKVQLaAAAAABJRU5ErkJggg==);\
	background-position: center 7px;\
	border-radius: 0 4px 0 0;\
	height: 23px;\
}\
::-webkit-scrollbar-button:vertical:increment {\
	background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAFCAYAAACXU8ZrAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAENJREFUeNpiTE6I++/j68+AC2zZvJGBac78hYwgBi4FIHkmEAebQpgCMOf///9wDLJ6/dq1/0E0sjiKIphCdDGAAAMAtQVIOLvLsjoAAAAASUVORK5CYII=);\
	background-position: center 9px;\
	border-radius: 0 0 4px 0;\
	height: 23px;\
}\
::-webkit-scrollbar-button:horizontal:decrement {\
	background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAJCAYAAAD6reaeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAEZJREFUeNpi+P//PwMyTk6I+8/EgARSEuP/+/j6MzChC4AAE7oACDA/eXgfRQCscs78hYxbNm9EFQQR6BJwi1AksLkTIMAAsFg1w4z04pgAAAAASUVORK5CYII=);\
	width: 23px;\
}\
::-webkit-scrollbar-button:horizontal:increment {\
	background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAJCAYAAAD6reaeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAENJREFUeNpiSE6I+w8EDMiYycfXnyElMf4/AxJgAhHoEkwwBrIEE7I2mASK4JbNGxnmzF/IyIQuANeOLAAG2NwJEGAAuVg0Qtlxn1kAAAAASUVORK5CYII=);\
	width: 23px;\
}\
/* Mahermen Styles */\
.sgun_note_text {\
	color: ' + config[8] + ';\
	filter: brightness(1.25);\
}\
.sgun_note_type .fa {\
	color: hsla(187,43%,55%,1);\
	font-size: 18px;\
	margin: 3px;\
}\
.sgun_note:not(:last-of-type) {padding-bottom: 3px;}\
.sgun_note {margin-top: 3px;}\
.sgun__infobox_line a, .sgapi__info_box_line a {color: ' + config[4] + ';}\
.sgun__notes_present i.sgun__badge {\
	color: ' + config[8] + ';\
	filter: brightness(1.5);\
	font-size: 0.66em;\
	font-weight:900;\
	margin-left: 6px;\
	margin-top: -6px;\
	text-shadow: 1px 1px 1px ' + config[0][10] + ', 0 0 1px ' + config[0][10] + ';\
}\
div.sgun_note:first-of-type {padding-top: 5px;}\
.sgun_button {\
	position: relative;\
	left: 25px;\
}\
.sgun__info_box, .sgapi__info_box {\
	background: rgba(255, 255, 255, 0.025) !important;\
	border-color: hsla(0,0%,0%,0.75) ' + config[0][35] + ' ' + config[0][35] + ' hsla(0,0%,0%,0.75) !important;\
	border-radius: 4px;\
	box-shadow: 2px 2px 2px hsla(0,0%,0%,0.5) inset, 7px 7px 10px hsla(0, 0%, 5%, 0.5) inset !important;\
	margin: 10px;\
	padding: 10px 20px;\
}\
.sgun_notes_panel {\
	background-image: linear-gradient(' + config[16] + '  0, ' + config[0][216] + '  6px, ' + config[0][217] + ' 100%);\
	margin-top: 0;\
	padding: 0 4px;\
}\
.sgun_notes_panel div:not(.sgun_note) {\
	color: ' + config[8] + ';\
	font-size: 12px;\
	font-weight: 600;\
	text-align: center;\
}\
.___mh_bookmark_outer_container {\
	position: absolute;\
	top: 7px !important;\
	z-index: 999 !important;\
}\
.__mh_bookmark_container .nav__row {background-color: transparent !important;}\
.__mh_ended .__mh_nav_row_img, .__mh_ended .nav__row__summary {opacity: 0.3;}\
.__mh_train_tracks {opacity: 0.5 !important;}\
.__mh_state_owned {background-image: linear-gradient(' + config[0][77] + ' 0%, ' + config[19] + '  50%, ' + config[0][78] + ' 100%) !important;}\
.__mh_state_owned *:not(.__mh_bookmark_item_remove_btn), .__mh_state_owned:hover *:not(.__mh_bookmark_item_remove_btn) {color: ' + config[0][99] + ' !important;}\
.__mh_state_owned:hover:not(.__mh_bookmark_item_remove_btn) {filter: saturate(0.7) contrast(1.15);}\
.__mh_state_entered {filter: brightness(0.7);}\
.syntaxhighlighter {\
	background-color: hsla(210,8%,16%,0.8) !important;\
	border-radius: 4px;\
	border: 1px solid ' + config[0][24] + ';\
}\
.syntaxhighlighter code, .syntaxhighlighter a, #SGLCdlg-GameName {\
	text-shadow: none;\
	box-shadow: none;\
}\
.syntaxhighlighter table {table-layout: auto;}\
.syntaxhighlighter table td.code .container textarea {\
	background: ' + config[44] + ' !important;\
	color: ' + config[45] + ';\
	text-shadow: none;\
}\
.syntaxhighlighter .line.alt1,.syntaxhighlighter .line.alt2 {background-color: hsla(210,8%,16%,0.8) !important;}\
.syntaxhighlighter .gutter .line {border-right: 2px solid rgba(67,90,95,0.6) !important;}\
.__table_row_banned .fa-ban {color: hsla(0,80%,60%,0.9);}\
.__table_row_banned a.tags, .__mh_free_games_rows .global__image-outer-wrap {\
	background: hsl(0, 0%, 21%);\
	border :none;\
	border-radius: 4px;\
	padding: 2px 5px;\
}\
.tags, .__mh_free_games_rows .global__image-outer-wrap {box-shadow: 0 0 0 1px #000;}\
.sgapi__alert.alert-info {\
	color: hsl(210, 65%, 72%);\
	background-color: transparent;\
	border-color: hsl(210, 100%, 30%);\
	background-image: linear-gradient(hsla(210, 65%, 44%, 0.23) 0%, hsla(210, 72%, 24%, 0.9) 100%) !important;\
}\
.sgapi__alert.alert-success {\
	color: hsl(88, 50%, 68%);\
	background-color: hsla(0, 65%, 44%, 0) !important;\
	border-color: hsl(88, 90%, 27%) !important;\
	background-image: linear-gradient(hsla(88, 65%, 44%, 0.2) 0%, hsla(88, 72%, 21%, 0.9) 100%) !important;\
}\
.sgapi__alert.alert-warning {\
	color: hsla(62, 60%, 72%, 0.9) !important;\
	background-image: linear-gradient(hsla(62, 65%, 44%, 0.23) 0%, hsla(62, 72%, 24%, 0.9) 100%) !important;\
	background-color: transparent;\
	border-color: hsl(62, 100%, 27%);\
}\
.sgapi__alert.alert-danger {\
	color: hsla(0, 75%, 72%, 1) !important;\
	background-color: transparent;\
	border-color: hsl(0, 100%, 27%) !important;\
	background-image: linear-gradient(hsla(0, 65%, 44%, 0.23) 0%, hsla(0, 72%, 24%, 0.9) 100%) !important;\
}\
.sgapi__alert .fa.sgapi_button {color: inherit !important;}\
/* ESGST Styles */\
.esgst-popout {color: ' + config[8] + ' !important;}\
.sidebar + div .esgst-fmph, .sidebar + div .esgst-fmph-background, .sidebar--wide + div .esgst-gf-container-fixed {\
	' + rwidth + ';\
}\
.sidebar--wide + div .esgst-fmph, .sidebar--wide + div .esgst-fmph-background, .sidebar--wide + div .esgst-gf-container-fixed {\
	' + wwidth + ';\
}\
.page__limit-width .esgst-fmph, .page__limit-width .esgst-fmph-background {\
	' + lwidth + ';\
}\
.esgst-fmph-background {\
	background-color: ' + config[2] + ';\
	border-radius: 0;\
	padding: 0 0 3px 0 !important;\
	' + bborder + ' !important;\
	' + bshadow + ';\
	' + bimage + ';\
	' + filter + ';\
}\
.page__outer-wrap[style*="margin-top: 39px"] {margin-top: 38px !important;}\
.giveaway__columns > .giveaway__column--width-fill.text-right span[data-timestamp] {\
	margin-right: 3px;\
	white-space: normal !important;\
}\
.sidebar--wide + div .esgst-gf-container {width: 100% !important;}\
.sidebar + div .esgst-fmph-background, .sidebar + div .esgst-fmph, .sidebar--wide + div .esgst-gf-container-fixed {\
	min-width: 872px !important;\
	width: calc(100% - 281px) !important;\
}\
.sidebar--wide + div .esgst-fmph-background, .sidebar--wide + div .esgst-fmph, .sidebar--wide + div .esgst-gf-container-fixed {width: calc(100% - 409px) !important;}\
.page__limit-width .esgst-fmph, .page__inner-wrap--narrow .esgst-fmph, .page__limit-width .esgst-fmph-background, .page__inner-wrap--narrow .esgst-fmph-background {\
	width: calc(100% - (30% + 35px)) !important;\
	min-width: 750px;\
}\
.sidebar + .page__limit-width .esgst-fmph, .sidebar + .page__limit-width .esgst-fmph-background {width: calc(100% - (30% + 35px)) !important;}\
.esgst-button-set {box-shadow: none !important;}\
.page_inner_wrap > .esgst-fmph {margin-top: 1px;}\
.esgst-hidden + .row-spacer, .comment.comment--submit + .row-spacer, .esgst-cfh-panel + .pagination, .esgst-cfh-panel + .pagination + .row-spacer, .ESCommentBox .pagination, .ESContext, .esgst-gv-view .row-spacer, .featured__container .featured__inner-wrap > .esgst-gm-checkbox {display: none;}\
.page_inner_wrap, .header_inner_wrap, .footer_inner_wrap, .page_inner_wrap .esgst-fmph-background, .page_inner_wrap .esgst-fmph {\
	min-width: 1075px;\
	max-width: 1075px;\
}\
.page_flex > .sidebar + div .esgst-fmph-background, .page_flex > .sidebar + div .esgst-fmph {\
	min-width: 872px;\
	max-width: 872px;\
}\
.EGBDescriptionPopup {max-height: 75%;}\
.MTBox, .GTSView + .rhPopout {\
	background-image: linear-gradient(' + config[0][170] + ' 0%, ' + config[0][60] + ' 100%);\
	border: 1px solid !important;\
	border-color: ' + config[0][61] + ' ' + config[15] + ' ' + config[0][62] + ' ' + config[15] + ' !important;\
	text-shadow: 1px 1px hsla(0, 0%, 0%, 0.7), 0 0 1px hsla(0, 0%, 0%, 0.99) !important;\
}\
.esgst-cfh-popout {\
	background-color: ' + config[5] + ' !important;\
	border: 1px solid ' + config[0][24] + ' !important;\
	filter: brightness(1.15);\
	will-change: transform;\
}\
.esgst-popup-icon {\
	border-radius: 50%;\
	font-size: 44px !important;\
	margin: 0 0 20px 0 !important;\
	padding: 10px;\
}\
.esgst-popup > .popup_summary > .popup_icon {margin-right: 0;}\
.fa-file-text.esgst-popup-icon, .fa-bar-chart.esgst-popup-icon, .fa-table.esgst-popup-icon, .fa-file.esgst-popup-icon, .fa-users.esgst-popup-icon, .fa-sticky-note.esgst-popup-icon, .fa-file.esgst-popup-icon, .fa-sort-amount-desc.esgst-popup-icon, .fa-sort-amount-asc.esgst-popup-icon {\
	font-size: 38px !important;\
	line-height: 48px;\
}\
.esgst-cfh-panel .form__saving-button, .esgst-cfh-panel .form__saving-button:active {margin: 5px !important;}\
.esgst-cfh-panel {\
	margin: 0 0 5px !important;\
	max-width:900px;\
}\
.esgst-cfh-panel span, .esgst-cfh-panel span .page_heading_btn {border-radius: 4px;}\
.esgst-cfh-panel .page_heading_btn:hover {filter: brightness(1.25);}\
.esgst-cfh-emojis {background-image: none;}\
.esgst-cfh-emojis >* {filter: brightness(0.8);}\
.esgst-cfh-emojis > :hover {filter: brightness(1.1) saturate(1.5);}\
.esgst-ap-popout {\
	background-color: ' + config[14] + ';\
	' + background + ';\
	box-shadow: 0 0 0 1px #000, 0 0 10px 2px ' + config[0][150] + ';\
	overflow: visible;\
	min-width: 420px !important;\
	max-width: none;\
}\
.esgst-ap-popout.esgst-popout {\
	text-shadow: 1px 1px ' + config[0][12] + ';\
}\
.esgst-ap-popout .featured__outer-wrap:not(.esgst-uh-box) {\
	background-size: cover;\
	box-shadow: none !important;\
	border-radius: 5px;\
	padding: 5px 10px 5px 5px !important;\
}\
.esgst-ap-popout .featured__heading {height: 17px;}\
.esgst-ap-popout .sidebar__shortcut-inner-wrap {width: 75px;}\
.esgst-ap-popout .sidebar__shortcut-inner-wrap * {width: 45px;}\
.esgst-ap-link .global__image-outer-wrap--avatar-large {margin: 0 5px !important;}\
.esgst-ap-popout .featured__inner-wrap {padding: 5px 0 !important;}\
.esgst-ap-popout .featured__summary {margin-left: 2px;}\
.esgst-ap-popout .global__image-outer-wrap--avatar-large:not([style*="border-color"]) {border: 1px solid ' + config[0][50] + ' !important;}\
.esgst-ap-popout .global__image-outer-wrap--avatar-large:hover {background-color: hsla(0, 0%, 10%, 0.2) !important;}\
.esgst-ap-popout .global__image-inner-wrap, .SGPP_UserInfo_balloon .global__image-inner-wrap {background-size: cover !important;}\
.RWSCVLLink ~ span {margin-left: 3px;}\
.esgst-ut-button:not(.esgst-faded) .fa-tag, .table__row-outer-wrap .esgst-dh-button, .table__row-outer-wrap .esgst-df-button, .table__row-outer-wrap .esgst-egh-button, [id*="SpecificIgnore"], .esgst-codb-button {opacity: .5;}\
.esgst-ut-button .fa-tag:hover {opacity: 1 !important;}\
.esgst-gv-popout .esgst-ut-button:hover, .esgst-gv-popout .esgst-gt-button:hover {opacity: 0.5 !important;}\
.markdown a.esgst-gt-button, .markdown a.esgst-egh-button {color: inherit!important;}\
.esgst-ged-icon {opacity: .6 !important;}\
.esgst-mpp-visible {\
	padding: 0 !important;\
	border-top: none;\
}\
.esgst-mpp-hidden {\
	background-color: ' + config[2] + ';\
	border: 1px solid ' + config[0][24] + ';\
	border-radius: 4px;\
	box-shadow: 0 0 6px 2px ' + config[0][150] + ';\
	height: inherit !important;\
	max-height: 75% !important;\
}\
.esgst-uh-box {\
	background-color: ' + config[14] + ' !important;\
	' + background + ';\
	border: 1px solid ' + config[0][50] + ';\
	border-radius: 4px !important;\
	padding: 10px !important;\
	width:auto;\
	z-index: 999;\
	filter: brightness(1.15);\
}\
.esgst-uh-title {margin: 0 0 10px !important;}\
.esgst-uh-title a {margin-left: 5px;}\
.esgst-uh-list li {margin-bottom: 2px;}\
.esgst-gc {\
	margin: 3px 0 3px 2px !important;\
	text-shadow: none !important;\
}\
.esgst-gv-popout .esgst-gc {margin: 0 0 3px 2px !important;}\
.esgst-es-pause-button .fa-play {width: 12px;}\
.esgst-fmph-background + .table__heading {\
	margin: 5px 0 -8px;\
	border: 1px solid ' + config[0][24] + ' !important;\
}\
.esgst-fmph-background + .table__heading + .table {\
	border-top-left-radius: 0 !important;\
	border-top-right-radius: 0 !important;\
}\
.pagination strong {filter: initial !important;}\
.esgst-popup-scrollable > .esgst-text-left div > .giveaway__row-outer-wrap:not(.esgst-gv-container) {\
	background-color: ' + config[0][8] + ';\
	border: 1px solid ' + config[0][24] + ';\
	border-radius: 4px;\
	box-shadow: 0 1px 0 ' + config[0][37] + ' !important;\
	margin-bottom: 15px !important;\
	padding: 8px 10px;\
}\
.esgst-uh-popup a:not(.esgst-ut-button) {\
	border-bottom: 1px dotted !important;\
	box-shadow: 0 1px 0 hsla(60, 0%, 24%, 1) !important;\
	color: hsla(201, 43%, 57%, 0.85) !important;\
}\
.esgst-uh-popup div {margin-bottom: 3px;}\
.sp-button-container {will-change: transform;}\
.esgst-user-icon i.esgst-whitelist, .esgst-user-icon i.esgst-blacklist, .esgst-user-icon i.esgst-positive, .esgst-user-icon i.esgst-negative, .esgst-user-icon i.esgst-unknown, .esgst-whitelist, .esgst-blacklist, .esgst-positive, .esgst-negative, .esgst-unknown {\
	border: 0 !important;\
	text-shadow: 1px 1px hsla(0, 0%, 0%, 0.99), 0 1px hsla(0, 0%, 0%, 0.99), 1px 0 hsla(0, 0%, 0%, 0.99), 0 -1px hsla(0, 0%, 0%, 0.99), -1px 0 hsla(0, 0%, 0%, 0.99) !important;\
}\
.esgst-wbh-highlight.whitelisted, .esgst-wbh-highlight.blacklisted {\
	box-shadow: 0 0 1px #000, 0 0 1px #000, 0 0 1px #000, 0 0 1px #000 !important;\
	opacity: 0.8;\
	padding: 1px 4px 0 3px !important;\
	text-shadow: none !important;\
	vertical-align: middle;\
}\
.featured__heading .esgst-un-button {color: inherit;}\
.widget-container > div:not(:first-child)[style*="230px"] {margin-left: 231px !important;}\
.esgst-fs, .esgst-fh, .nav__left-container, .nav__right-container, #footer, footer {will-change: transform;}\
.esgst-fh, .nav__left-container, .nav__right-container, .esgst-qgs-container {z-index: 1000 !important;}\
.sidebar__mpu.esgst-hidden + .sidebar__search-container {margin-top: 0!important;}\
.table__row-outer-wrap:hover .table__row-inner-wrap:hover .table__column--width-fill[style*="opacity"] {opacity: .8 !important;}\
.esgst-adots {margin: 8px 0 0 !important;}\
.pinned-giveaways__inner-wrap.esgst-gv-view {padding: 5px;}\
.esgst-giveaway-panel {margin: 5px 0 -4px !important;}\
.esgst-gv-view {\
	min-width: 870px!important;\
	padding: 5px 0px !important;\
}\
.esgst-gv-container {\
	background-color: transparent!important;\
	padding: 0 !important;\
}\
.esgst-popup .popup__keys__list .esgst-ggl-member, .esgst-dh-highlighted, .esgst-dh-highlighted.table__row-outer-wrap, .esgst-green-highlight {background-color: hsla(95, 69%, 37%, 0.15) !important;}\
.table .esgst-gh-highlight {background-color: hsla(95, 69%, 37%, 0.15) !important}\
.popup__keys__list .esgst-ggl-member {color: hsla(0, 0%, 63%, 0.95) !important;}\
.esgst-ged-icon {\
	border: none !important;\
	text-shadow: 1px 1px hsla(0, 0%, 0%, 0.99), 0 1px hsla(0, 0%, 0%, 0.99), 1px 0 hsla(0, 0%, 0%, 0.99), 0 -1px hsla(0, 0%, 0%, 0.99), -1px 0 hsla(0, 0%, 0%, 0.99) !important;\
}\
.giveaway__column--width-fill.text-right .fa {margin: 0 -5px 0 5px;}\
.profile_avatar, .nav_avatar, .table .avatar, .author_avatar {box-shadow: 0 0 0 1px hsla(0, 0%, 33%, 1);}\
.esgst-popup-scrollable > .table:not(.esgst-text-left) {\
	width: calc(100% - 35px);\
	margin-right: auto;\
}\
.esgst-popup-scrollable .esgst-ugd-table ~ .esgst-text-center > ol {\
	-webkit-column-count: 3;\
	-webkit-column-gap: 5px;\
	-moz-column-count: 3;\
	-moz-column-gap: 5px;\
	column-count: 3;\
	column-gap: 5px;\
	padding: 5px;\
	border-radius: 4px;\
	background-color: hsla(60, 4%, 9%, 1);\
	background-image: none;\
	border: 1px solid hsla(60, 2%, 23%, 1);\
	margin: 0;\
	min-width: 983px;\
}\
@media screen and (max-width: 1365px) {\
	.esgst-popup-scrollable .esgst-ugd-table ~ .esgst-text-center > ol {\
		-webkit-column-count: 2;\
		-moz-column-count: 2;\
		column-count: 2;\
		min-width: 600px;\
	}\
}\
.esgst-popup-scrollable .esgst-ugd-table ~ .esgst-text-center > ol li:first-of-type {margin-top: 0;}\
.esgst-popup-scrollable .esgst-ugd-table ~ .esgst-text-center > ol li {\
	background-color: hsla(60, 2%, 21%, 0.8);\
	border-radius: 3px;\
	display: flex;\
	font-size: 11px;\
	justify-content: space-between;\
	line-height: 18px;\
	margin-left: 28px;\
	margin-right: 0;\
	min-width: 300px;\
	padding: 0;\
}\
.esgst-popup-scrollable .esgst-ugd-table ~ .esgst-text-center > ol li .esgst-bold {\
	background-color: hsla(0, 0%, 28%, 0.5);\
	border-left: 1px solid hsla(0, 0%, 0%, 0.5);\
	border-radius: 0 3px 3px 0;\
	margin-left: 5px;\
	width: 50px;\
}\
.esgst-popup-scrollable .esgst-ugd-table ~ .esgst-text-center > .esgst-bold {\
	font-size: 18px;\
	margin: 10px;\
}\
.esgst-popup-title {	\
	font-weight: 600;\
	text-shadow: 1px 1px hsla(0, 0%, 0%, 0.99), 1px 1px 1px hsla(0, 0%, 0%, 0.99), 0 0 1px hsla(0, 0%, 0%, 0.99), 0 0 1px hsla(0, 0%, 0%, 0.99);\
}\
.GDCBPButton {width: 29px;}\
.esgst-sgpb-button img, .page__inner-wrap--narrow img[src*="favicon"], .page__inner-wrap--narrow img[src*="dropbox"], .page__inner-wrap--narrow img[src*="data"] {filter: invert(0.8) brightness(70%);}\
.nav__button-container:not(.nav__button-container--notification):not(.nav_btn_container), .nav__left-container .nav__button-container.nav_btn_container {\
	background-image: none;\
	box-shadow: 0 0 0 1px hsl(0, 0%, 0%);\
}\
.nav__sits {border: none !important;}\
.featured__heading {height: 33px;}\
.table__column__secondary-link + .CTPanel a {opacity: .5;}\
.table__column__secondary-link + .CTPanel a:hover {\
	filter: brightness(1.7);\
	opacity: .5 !important;\
}\
.rating_checkbox, .form_list_item_uncheck {color: hsl(0, 0%, 40%);}\
.page__heading.esgst-es-page-heading {margin-top: 15px !important;}\
.esgst-gc-panel .esgst-gc-rating i {\
	color: inherit !important;\
	text-shadow: 1px 1px hsla(0, 0%, 0%, 0.99), 0 1px hsla(0, 0%, 0%, 0.99), 1px 0 hsla(0, 0%, 0%, 0.99), 0 -1px hsla(0, 0%, 0%, 0.99), -1px 0px hsla(0, 0%, 0%, 0.99);\
}\
.esgst-gc-panel .esgst-gc-rating {text-shadow: 0 0 3px rgb(0, 0, 0) !important;}\
.esgst-gc-panel .esgst-gc-rating-positive {\
	background-color: ' + config[18] + ';\
	color: ' + config[0][112] + ' !important;\
}\
.esgst-gc-panel .esgst-gc-rating-negative {\
	background-color: ' + config[19] + ';\
	color: ' + config[0][99] + ' !important;\
}\
.esgst-gc-panel .esgst-gc-rating-mixed {\
	background-color: ' + config[0][52] + ' !important;\
	color: ' + config[0][51] + ' !important;\
}\
.esgst-sm-colors-default {\
	border-radius: 4px;\
	cursor: pointer;\
	display: inline-block;\
	line-height: 12px !important;\
	text-shadow: 1px 1px ' + config[0][12] + ' !important;\
	vertical-align: bottom;\
}\
.esgst-sm-colors-default + .fa-question-circle {vertical-align: super;}\
.esgst-sm-colors-default, .esgst-sm-colors-default:active {margin: 2px 0;}\
.sidebar__shortcut-inner-wrap > *[style*="opacity: 0.5"] {opacity: 0.2 !important;}\
.esgst-ap-popout .featured__table__row {height: 14px;}\
.comment__parent.esgst-ct-comment-read {\
	background-color: hsla(0, 0%, 100%, 0.03) !important;\
	box-shadow: 0 0 1px hsla(0, 0%, 0%, 1), 0 0 1px hsla(0, 0%, 0%, 1), 1px 1px 0 hsla(0, 0%, 30%, .3) inset;\
	border-radius: 4px;\
	padding: 5px 15px 10px 5px;\
}\
.comment__parent.esgst-ct-comment-read:hover {\
	background-color: transparent !important;\
	box-shadow: none;\
}\
.comment__child.esgst-ct-comment-read {background-color: hsla(0, 0%, 100%, 0.03) !important;}\
.comment__child.esgst-ct-comment-read:hover {background-color: hsla(210, 8%, 16%, 0.8) !important;}\
.esgst-ap-popout > .fa-circle-o-notch.fa-spin + span, .esgst-ap-popout > .fa-circle-o-notch.fa-spin {\
	left: 25px;\
	padding: 5px 0;\
	position: relative;\
}\
.esgst-ggl-popout > .fa-circle-o-notch.fa-spin, .esgst-ggl-popout > .fa-times-circle, .esgst-gcl-popout.esgst-popout .fa-spin {\
	margin: 8px;\
	text-shadow: 1px 1px ' + config[0][12] + ';\
}\
.esgst-ggl-popout > .fa-circle-o-notch.fa-spin, .esgst-ggl-popout > .fa-circle-o-notch.fa-spin +span, .esgst-ggl-popout > .fa-times-circle + span, .esgst-gcl-popout.esgst-popout .fa-spin + span {\
	margin-right: 6px!important;\
	text-shadow: 1px 1px ' + config[0][12] + ';\
}\
.esgst-ggl-panel {\
	padding: 0px !important;\
	margin: 5px 5px -5px 5px;\
	display: flex;\
	flex-wrap: wrap;\
}\
.esgst-ggl-panel i {box-shadow: none !important;}\
.esgst-ggl-panel > * {padding-top: 2px;}\
.esgst-ggl-panel > *:not(.esgst-ggl-member) {color: ' + config[9] + ';}\
.esgst-popup-description .table.esgst-text-left, .esgst-ugd-table.table, .esgst-popup-scrollable > .table:not(.esgst-text-left) {\
	background-color: ' + config[0][8] + ';\
	border: 1px solid ' + config[0][24] + ';\
	border-radius: 4px;\
	padding: 5px 10px;\
}\
.esgst-popup-description .table.esgst-text-left > div:not(:last-of-type) .esgst-dh-highlighted .table__column--width-small {width: inherit;}\
.esgst-popup-description .esgst-text-left > .comment:first-of-type {padding: 10px 15px 5px;}\
.featured__heading .esgst-gb-button:hover > i {opacity: 1;}\
.featured__heading .esgst-gb-button > i {\
	opacity: .6;\
	transition: opacity .2s;\
}\
.esgst-gb-highlighted.ending .nav__button, .esgst-gb-highlighted.started .nav__button {filter: brightness(1.25) saturate(1.5);}\
.esgst-gb-highlighted.ending .nav__button i {color: hsla(0, 71%, 38%, 1);}\
.esgst-gb-highlighted.started .nav__button i {color: ' + config[36] + ';}\
.esgst-gb-highlighted.ending.started .nav__button i {color: hsl(36, 78%, 38%);}\
.esgst-heading-button .fa-check:before {color: ' + config[9] + ' !important;}\
.esgst-giveaway-panel .esgst-button-set > * {\
	padding: 0 10px !important;\
	min-width: 60px;\
	width: auto !important;\
}\
.esgst-gv-icons {\
	filter: brightness(' + (+config[1]+ (0.05)) + ');\
	position: relative;\
	bottom: -1px;\
}\
.esgst-gv-time i {margin-bottom: 1px !important}\
.table .esgst-ct-comment-read:hover, .table .esgst-ct-visited:hover {background-color: hsla(0, 0%, 45%, 0.08) !important;}\
.esgst-popup .giveaway__row-outer-wrap .fa-clock-o[style*="color"] {filter: saturate(2) opacity(0.8);}\
.table__row-outer-wrap .esgst-dh-button i, .table__row-outer-wrap .esgst-egh-button i {margin-bottom: 2px;}\
.esgst-gf-container {\
	background-color: transparent !important;\
	margin-top: 5px;\
}\
.esgst-popup-scrollable .table__row-outer-wrap {\
	background-color: ' + config[0][8] + ';\
	border: 1px solid ' + config[0][24] + ';\
	border-radius: 4px;\
	margin: 0 0 10px 0;\
	text-align: left;\
	padding: 10px !important;\
}\
.esgst-es-refresh-button .fa-spin {margin: 0 5px;}\
.esgst-es-refresh-all-button .fa-spin {margin: -1px;}\
.esgst-es-resume-button .fa-play {margin-left: 1px;}\
.esgst-button-set {\
	background: none !important;\
	box-shadow: none !important;\
}\
.esgst-popup {\
	padding: 25px 65px !important;\
}\
.esgst-popup-description .comments__entity {\
	border-radius: 4px;\
	margin-top: 10px;\
}\
.esgst-popup-description .comment_outer, .esgst-popup-description .table.esgst-text-left, .esgst-popup-description .comments__entity + .comment__children {margin-bottom: 15px;}\
.esgst-popup-description .comment_outer > .comment > .comment__child {margin-top: 0px;}\
.esgst-popup-description .comment_outer > .comment > .comment__parent {margin-top: -8px;}\
.esgst-popup .popup__keys__list > div {padding: 10px 5px;}\
.esgst-sm-colors input {\
	margin: 2px 5px 2px 0;\
	text-indent: 5px;\
}\
.esgst-gm-section .pinned-giveaways__outer-wrap {box-shadow: none;}\
.esgst-gm-section .pinned-giveaways__inner-wrap {\
	background-color: hsla(0, 0%, 18%, 0.55) !important;\
	border: none;\
	background-image: none;\
	box-shadow: 0 0 0 1px hsla(0, 0%, 0%, 0.5) inset;\
}\
.esgst-gm-giveaway {\
	background-color: hsl(0, 0%, 30%) !important;\
	border: 1px solid #000 !important;\
	color: hsla(0, 0%, 86%, 0.9);\
	opacity: 0.6;\
	text-shadow: 1px 1px ' + config[0][12] + ';\
}\
.esgst-gm-giveaway.error {background-color: hsla(0, 71%, 45%, 0.8) !important;}\
.esgst-gm-giveaway.success {background-color: hsla(90, 39%, 47%, 0.8) !important;}\
.esgst-gm-giveaway.connected {opacity: 1;}\
.esgst-gv-icons >* {border-radius: 5px 0 0 0 !important;}\
.esgst-gv-icons >*:not(:last-child) {\
    margin-right: -2px !important;\
    border-radius: 5px 1px 4px 0 !important;\
}\
.esgst-gv-icons > *:last-child {border-radius: 5px 0 2px 0 !important;}\
.esgst-ap-popout .global__image-outer-wrap--avatar-large[style*="border-color"] {margin: -3px 0 0 !important;}\
.view_key_btn span {border-bottom: none;}\
.esgst-ags-panel.esgst-popout {\
	background-image: linear-gradient(' + config[16] + '  0, ' + config[0][216] + '  6px, ' + config[0][217] + ' 100%);\
    margin-top: -1px !important;\
}\
.esgst-ags-panel {max-width: 324px !important;}\
.esgst-ags-filter >* {\
    width: 145px !important;\
    height: 20px;\
}\
.esgst-ags-checkbox-filter { margin: 5px 10px !important;}\
.esgst-ags-checkbox-filter i {vertical-align: baseline;}\
.sidebar .esgst-adots {\
	background-color: ' + config[0][8] + ';\
	background-image: none;\
	margin-top: -4px !important;\
	max-height: 355px !important;\
	width: 324px !important;\
	border-top-left-radius: 0;\
}\
.sidebar .table.esgst-adots .table__row-outer-wrap {padding: 7px 0 5px !important;}\
.sidebar .esgst-adots .table__row-outer-wrap:not(:last-of-type) {box-shadow: 0 1px 0 ' + config[0][38] + ' !important;}\
.sidebar .esgst-adots .table__row-inner-wrap {\
	display: flex !important;\
	flex-wrap: wrap;\
	justify-content: flex-end;\
}\
.sidebar .esgst-adots .table__column--width-fill {\
	font-size: 10px;\
	font-weight: 600;\
    padding-right: 0;\
}\
.sidebar .esgst-adots .homepage_table_column_heading, .sidebar .esgst-adots .table__column__heading {\
	max-width: 270px;\
	font-size: 12px !important;\
	padding-right: 2px;\
}\
.sidebar .esgst-adots .table__row-outer-wrap {padding: 5px 0 !important;}\
.sidebar .esgst-adots .table__row-outer-wrap:first-of-type {margin-top: -3px;}\
.sidebar .esgst-adots .table__row-inner-wrap > :last-child {margin: 0 2px 0 5px !important;}\
.esgst-oadd .table__row-inner-wrap > .table__column--width-small.text-center {min-width: 150px !important;}\
.sidebar .esgst-adots .table__row-inner-wrap > .table__column--width-small.text-center {min-width: 282px !important;}\
.esgst-dh-button, .esgst-df-button {margin: 0 2px 0 0;}\
.esgst-adots .esgst-dh-button i {margin: 0;}\
.sidebar .esgst-adots .icon-heading + .homepage_table_column_heading, .sidebar .esgst-adots .esgst-dh-button + .esgst-df-button + .homepage_table_column_heading, .sidebar .esgst-adots .icon-heading + .table__column__heading, .sidebar .esgst-adots .esgst-dh-button + .esgst-df-button + .table__column__heading {max-width: 230px !important;}\
.sidebar .esgst-adots .esgst-dh-button + .homepage_table_column_heading, .sidebar .esgst-adots .esgst-df-button + .homepage_table_column_heading, .sidebar .esgst-adots .esgst-dh-button + .table__column__heading, .sidebar .esgst-adots .esgst-df-button + .table__column__heading {max-width: 245px !important;}\
.sidebar .esgst-adots .esgst-dh-button + .icon-heading + .homepage_table_column_heading, .sidebar .esgst-adots .esgst-df-button + .icon-heading + .homepage_table_column_heading, .sidebar .esgst-adots .esgst-dh-button + .icon-heading + .table__column__heading, .sidebar .esgst-adots .esgst-df-button + .icon-heading + .table__column__heading, .sidebar .esgst-adots .esgst-codb-button + .homepage_table_column_heading {max-width: 215px !important;}\
.sidebar .esgst-adots .esgst-dh-button + .esgst-df-button + .icon-heading + .homepage_table_column_heading, .sidebar .esgst-adots .esgst-dh-button + .esgst-df-button + .icon-heading + .table__column__heading {max-width: 211px !important;}\
.esgst-gf-basic-filter >* {margin: 0 0 5px 0 !important;}\
.esgst-gf-basic-filter .esgst-float-right {margin: -3px -8px 0 0;}\
.esgst-gf-container input {\
	height: 18px !important;\
	padding: 0 4px !important;\
	width: 70px !important;\
}\
.esgst-gv-icons .fa {font-size: 13px !important;}\
.esgst-popup .global__image-outer-wrap:not(.is_icon) {padding: 0 !important;}\
.esgst-gv-popout, .esgst-popup .esgst-gv-popout.global__image-outer-wrap, .esgst-gcl-popout, .esgst-ggl-popout {\
	background-color: ' + config[14] + ';\
	border: none !important;\
	box-shadow: 0 0 0 1px ' + config[0][50] + ';\
}\
.esgst-gv-popout, .esgst-popup .esgst-gv-popout.global__image-outer-wrap {\
	padding: 5px !important;\
}\
.esgst-gv-popout[style*="margin-top: 1px;"] {margin-top: 0px !important;}\
.esgst-gv-popout .giveaway__heading {padding: 0 5px 5px;}\
.giveaway__row-inner-wrap:hover .esgst-gv-popout .giveaway__heading__name {filter: brightness(1.0) !important;}\
.giveaway__row-inner-wrap:hover .esgst-gv-popout .giveaway__heading__name:hover, .esgst-gv-popout .giveaway__heading i:hover, .esgst-gv-popout .esgst-ut-button:hover, .esgst-gv-popout .esgst-gt-button:hover {filter: brightness(1.2) !important;}\
.esgst-gc-panel {margin: 0 0 2px 0 !important;}\
.esgst-gv-popout .esgst-giveaway-links, .esgst-gv-popout .esgst-giveaway-panel {float: none !important;}\
.esgst-gv-popout .esgst-giveaway-panel {\
	background-color: hsla(60, 4%, 9%, 0.35);\
	border: 1px solid ' + config[0][50] + ' !important;\
	margin: 5px 0 0 0 !important;\
	border-radius: 4px;\
	padding: 5px !important;\
}\
.esgst-gv-popout .esgst-gwc, .esgst-gv-popout .esgst-gwr, .esgst-gv-popout .esgst-ttec {\
	background-image: linear-gradient(' + config[13] + ' 0, ' + config[0][39] + ' 6px, ' + config[0][40] + ' 100%);\
	border-color: ' + config[0][41] + ' ' + config[0][42] + ' ' + config[0][39] + ' ' + config[0][42] + ' !important;\
	box-shadow: 1px 1px 0 ' + config[0][42] + ' inset !important;\
	color: ' + config[9] + ';\
	filter: brightness(1.05);\
	margin: 5px 3px 0 3px !important;\
	padding: 0 8px !important;\
	width: 57px !important;\
}\
.esgst-gv-popout .esgst-ggl-panel {\
	background-color: hsla(60, 4%, 9%, 0.35);\
	border: 1px solid ' + config[0][50] + ' !important;\
	border-radius: 4px;\
	margin: 3px 0 0;\
	padding: 8px 5px !important;\
}\
.esgst-gv-popout .giveaway__columns:not(.esgst-giveaway-panel) > :not(.giveaway__column--group):not(.giveaway__column--whitelist):not(.giveaway__column--invite-only):not(.giveaway__column--community-voted):not(.giveaway__column--contributor-level):not(.giveaway__column--region-restricted):not(form):not(.mt-more-like-this):not(.esgst-elgb-button):not(.giveaway__column--new):not(.giveaway__column--wish) {\
	border: none;\
	background: none !important;\
	box-shadow: none !important;\
}\
.esgst-gv-popout .GPLinks, .esgst-gv-popout .esgst-giveaway-panel, .esgst-gv-popout .giveaway__columns, .esgst-gv-popout .text-right, .esgst-gv-popout .giveaway__heading, .esgst-gv-popout .giveaway__columns:not(.esgst-giveaway-panel):not(.esgst-gv-icons) > * {\
	justify-content: center !important;\
	text-align: center !important;\
}\
.esgst-gv-popout .giveaway_image_avatar, .esgst-gv-popout .featured_giveaway_image_avatar {\
	display: block !important;\
	margin-top: 3px;\
	height: 28px;\
	width: 28px;\
	position: absolute;\
	right: 2px !important;\
}\
.esgst-gv-creator, .esgst-gv-popout .giveaway__links {\
	line-height: 16px;\
	margin: 0 !important;\
	overflow: hidden;\
	text-overflow: ellipsis;\
	white-space: nowrap;\
}\
.esgst-popup .giveaway__column--width-fill span[data-timestamp] + a {margin-left: 5px;}\
.esgst-popup .giveaway__heading__name.giveaway__icon {opacity: initial;}\
.esgst-gv-container .giveaway__icon {line-height: 16px;}\
.esgst-wbc-button i:not(:last-child), .esgst-namwc-button i:not(:last-child), .esgst-nrf-button i:not(:last-child) {margin-right: 3px;}\
.esgst-popup-description .esgst-text-left:not(.esgst-gf-filters), .esgst-popup-scrollable > .esgst-settings-menu {margin-right: 15px !important;}\
.esgst-ct-count {color: hsla(0, 50%, 50%, 0.95) !important;}\
.esgst-toggle-switch-slider {\
	background-color: ' + config[11] + ' !important;\
	box-shadow: 0 0 0 1px #000;\
}\
.esgst-toggle-switch-slider:before {\
	background-image: linear-gradient(to bottom, hsl(0, 0%, 20%) 40%, hsl(0, 0%, 9%)) !important;\
	filter: drop-shadow(0 0 1px hsl(0, 0%, 65%));\
}\
input:checked + .esgst-toggle-switch-slider {background-color: hsla(90, 39%, 47%, 0.8) !important;}\
.esgst-toggle-switch-container:not(.inline) {margin: 3px !important;}\
.esgst-last-sync {will-change: transform;}\
.esgst-uh-title, .esgst-uh-list {	color: ' + config[0][273] + ' !important;}\
.esgst-ggl-panel .table_image_avatar {margin-right: 3px;}\
.esgst-ggl-panel a:last-child {\
	box-shadow: 0 1px 0 hsla(210, 6%, 50%, 0.3) !important;\
	border-color: hsla(210, 6%, 50%, 0.6);\
}\
.esgst-ggl-panel .esgst-ggl-member a:last-child {\
	border-color: ' + config[4] + ' !important;\
	box-shadow: 0 1px 0 ' + config[0][199] + ' !important;\
}\
.esgst-ggl-panel .fa-user {\
	color: ' + config[0][155] + ' !important;\
	text-shadow: 0 1px ' + config[0][12] + ', 0 -1px ' + config[0][12] + ', 1px 0 ' + config[0][12] + ', -1px 0 ' + config[0][12] + ' !important;\
}\
.esgst-gv-popout .esgst-ggl-panel .fa-user {\
	margin: -5px 0 5px 0;\
	width: 100%;\
}\
.esgst-gv-popout .esgst-ggl-panel .fa-user:after {\
	content: "Groups";\
	font: 11px Arial, sans-serif;\
	font-weight: 600;\
	margin-left: 5px;\
}\
.esgst-gv-popout .esgst-egh-button + .esgst-gb-button + .giveaway__heading__name {max-width: 130px !important;}\
.comments.esgst-text-left .markdown li:before {margin-left: 0 0 0 -20px !important;}\
.esgst-popup-scrollable .esgst-ugd-table ~ .esgst-text-center > ol li:before {margin: 0 0 0 -25px!important;}\
.esgst-header-menu-button {\
	background-image: linear-gradient(' + config[0][17] + ' 0, ' + config[28] + ' 5px, ' + config[0][19] + ' 100%) !important;\
	border-color: hsla(215, 8%, 5%, 1) !important;\
	box-shadow: 0 0 0 1px hsla(215,8%,5%,1), 1px 1px 1px rgba(255, 255, 255, 0.12) inset,1px 1px 0 rgba(255, 255, 255, 0.07) inset !important;\
	color: ' + config[43] + ' !important;\
	opacity: 1 !important;\
	padding: 0 10px !important;\
	text-shadow: 1px 1px ' + config[0][13] + ', 0 0 1px ' + config[0][10] + ' !important;\
	transition: filter .35s ease-in !important;\
	will-change: filter;\
}\
.esgst-header-menu-row {\
	background-image: linear-gradient(' + config[15] + ' 0%, ' + config[0][16] + ' 100%) !important;\
	border-radius: 0 !important;\
	text-shadow: 1px 1px ' + config[0][11] + ', 0 0 1px ' + config[0][10] + ' !important;\
}\
.esgst-header-menu-row:not(:first-child) {border-top: 1px dashed hsla(0, 0%, 17%, 1) !important;}\
.esgst-header-menu-row:not(:first-child):hover, .esgst.header-menu-button:hover + .esgst-header-menu-button, .esgst-header-menu-row:hover + .esgst-header-menu-row:hover  {border-top-color: transparent !important;}\
.esgst-header-menu-name {\
	color: ' + config[0][88] + ' !important;\
	filter: brightness(1.1);\
}\
.esgst-header-menu-description {color: ' + config[0][74] + ' !important;}\
.esgst-header-menu-row:hover {\
	background-color: transparent !important;\
	background-image: linear-gradient(' + config[0][48] + ' 0%, ' + config[0][49] + ' 100%) !important;\
}\
.esgst-header-menu-row:hover .esgst-header-menu-description {color: hsla(0, 0%, 60%, 1) !important;}\
.esgst-popup-description .esgst-description {\
	color: inherit !important;\
	font-size: 100%;\
	font-style: normal;\
	margin-bottom: 15px !important;\
}\
.esgst-gf-preset-panel .esgst-description {\
	color: hsl(210, 6%, 50%) !important;\
	font-size: 11px !important;\
	font-style: italic !important;\
	margin-bottom: 0 !important;\
}\
.esgst-progress-bar {margin: 5px !important;}\
.esgst-progress-bar .ui-progressbar-value {margin: 0 !important;}\
.popup_summary + .esgst-popup-description > .esgst-toggle-switch-container span {\
	margin-right: 5px;\
	margin-left: 5px;\
}\
.popup_summary + .esgst-popup-description > .esgst-toggle-switch-container {\
	display: flex;\
	margin: 5px !important;\
}\
.popup_summary + .esgst-popup-description > .esgst-button-set {margin: 10px;}\
.pinned-giveaways__inner-wrap.esgst-pgb-container {border-radius: 4px 4px 0 0 !important;}\
.esgst-pgb-button, .esgst-gf-button {\
	background-color: ' + config[2] + ' !important;\
	background-image: linear-gradient(' + config[0][5] + ' 0%, ' + config[0][83] + ' 100%) !important;\
	border-color: ' + config[0][84] + ' !important;\
	padding: 3px 25px !important;\
}\
.esgst-gf-type-filter i, .esgst-gf-category-filter i, .esgst-gf-exception-filter i, .esgst-gf-legend i {margin-right: 2px;}\
.esgst-gf-type-filter, .esgst-gf-category-filter, .esgst-gf-exception-filter, .esgst-gf-legend {display: table;}\
.esgst-popup .featured_giveaway_image_avatar {margin-left: 0;}\
.esgst-popup .esgst-gf-container:not(.esgst-gf-filters) {margin: 5px 15px 15px 0 !important;}\
.homepage_heading, .patreon_hero_step_name {\
	background-image: linear-gradient(' + config[0][20] + ' 0%, ' + config[0][21] + ' 100%);\
	border: 1px solid ' + config[0][223] + ';\
	border-bottom-color: ' + config[0][229] + ';\
	border-radius: 4px;\
	color: ' + config[43] + ' !important;\
	padding: 5px 15px;\
	text-shadow: 1px 1px ' + config[0][13] + ', 0 0 1px ' + config[0][10] + ' !important;\
}\
.homepage_heading + .poll, .homepage_heading + .table {\
	border-radius: 4px;\
	margin-bottom: 8px;\
	padding: 0 10px;\
}\
.homepage_heading + .poll .table__heading {margin: 0px -10px 5px;}\
.homepage_table_column_heading {color: ' + config[3] + ' !important;}\
.esgst-adots h3 a:visited {color: ' + config[39] + ' !important;}\
.esgst-adots .table__row-outer-wrap {padding: 10px 0 !important;}\
.esgst-adots .esgst-dh-highlighted, .esgst-dh-highlighted.table__row-outer-wrap {padding: 10px 5px !important;}\
.esgst-adots-tab-heading {\
	background-image: linear-gradient(' + config[0][20] + ' 0%, ' + config[0][21] + ' 100%) !important;\
	border: 1px solid ' + config[0][146] + ';\
	color: ' + config[43] + ' !important;\
	margin-top: 3px;\
	text-shadow: 1px 1px ' + config[0][13] + ', 0 0 1px ' + config[0][10] + ' !important;\
}\
.esgst-adots-tab-heading + .sidebar__navigation__item__name {margin: 10px 8px 0;}\
.esgst-gv-icons .esgst-gv-time {\
	background-image: linear-gradient(hsl(60, 1%, 40%) 0, hsla(60, 1%, 30%, 1) 6px, hsla(60, 1%, 22%, 1) 100%) !important;\
	border-color: hsla(60, 1%, 50%, 1) hsla(60, 1%, 45%, 1) hsla(60, 1%, 37%, 1) hsla(60, 1%, 48%, 1) !important;\
	box-shadow: none !important;\
	color: hsla(210, 6%, 73%, 1) !important;\
	padding: 1px 4px 1px 3px !important;\
}\
.esgst-gv-box .esgst-gv-icons .esgst-ged-source {\
	background-image: linear-gradient(hsla(208, 24%, 35%, 1) 0%, hsla(208, 16%, 25%, 1) 100%) !important;\
	border-color: hsla(208, 13%, 26%, 1) !important;\
	border-color: hsla(208, 13%, 50%, 1) hsla(208, 13%, 45%, 1) hsla(208, 13%, 37%, 1) hsla(208, 13%, 48%, 1) !important;\
	box-shadow: none !important;\
	color: hsla(210, 6%, 78%, 1) !important;\
	padding: 2px 4px 2px 3px !important;\
}\
.esgst-gv-icons .giveaway__column--invite-only, .esgst-gv-icons .giveaway__column--group {padding: 1px 6px !important;}\
.esgst-gv-icons .giveaway__column--whitelist {padding: 1px 5px 1px 4px !important;}\
.esgst-gv-icons .giveaway__column--region-restricted {padding: 1px 4px 1px 2px !important;}\
.esgst-gm-section .esgst-button-set {margin-left: 0;}\
.giveaway__columns:not(.esgst-gv-icons) .esgst-ged-source {\
	background-color: transparent !important;\
	background-image: linear-gradient(hsla(208, 24%, 26%, 0.6) 0%, hsla(208, 16%, 18%, 0.6) 100%) !important;\
	margin: 0 5px 0 0 !important;\
	padding: 0 8px !important;\
}\
.esgst-popup-scrollable {margin-bottom: 10px;}\
.esgst-popup li {\
	display: table;\
	margin: 6px 0;\
	vertical-align: text-top;\
}\
.esgst-popup li i {vertical-align: text-top;}\
.esgst-popup li .fa { margin: 0 5px;}\
.esgst-popup .popup__actions > * {margin: 5px;}\
.esgst-ib-user, .esgst-ib-game {\
	background-color: #2f2f2f !important;\
	border: none !important;\
}\
.esgst-ib-game {\
	height: 79px;\
	width: 194px !important;\
}\
.esgst-ib-game ~ .esgst-gv-icons > *:last-child {border-radius: 5px 0 4px 0 !important;}\
.esgst-ib-user {\
	background-position: center !important;\
	height: 42px !important;\
	width: 42px !important;\
}\
.esgst-gv-popout .giveaway_image_avatar {filter: unset;}\
.esgst-gv-popout .esgst-ib-user {\
	background-size: cover;\
	border: 3px solid hsla(60, 4%, 9%, 0.35) !important;\
	background-color: transparent !important;\
	height: 31px !important;\
	width: 31px !important;\
}\
.esgst-ib-game ~ .esgst-gv-popout {\
	max-width: 184px !important;\
	width: 184px !important;\
}\
.esgst-popup-scrollable > .esgst-text-left > div a[href*="://www.sgtools.info/giveaways/"] {\
	background-image: linear-gradient(' + config[0][193] + ' 0%, ' + config[0][194] + '  50%, ' + config[0][195] + ' 100%) !important;\
	border: 1px solid;\
	border-color: ' + config[0][196] + ' ' + config[23] + ' ' + config[0][197] + ' ' + config[23] + ' !important;\
	border-radius: 4px;\
	color: ' + config[0][249] + ' !important;\
	line-height: 32px;\
	margin-left: 5px;\
	padding: 5px 10px;\
}\
.esgst-text-left.esgst-float-left.markdown[style*="border-right"] {\
	border-right: 1px solid ' + config[0][37] + ' !important;\
	box-shadow: 1px 0 0 ' + config[0][38] + ';\
}\
.esgst-description {color: hsl(210, 6%, 50%) !important;}\
.esgst-fmph-background + .notification {margin-top: 8px;}\
.esgst-ut-preview > *, .esgst-gt-preview > * {margin: 1px 3px !important;}\
.esgst-ut-tags > .author_avatar, .esgst-gt-tags > .author_avatar {\
	border: none !important;\
	box-shadow: 0 0 0 1px ' + config[15] + ' !important;\
	filter: initial !important;\
}\
.esgst-cfh-sr-summary {\
	background-color: hsla(60, 4%, 19%, 0.25);\
	border: 1px solid ' + config[15] + ';\
	margin: 5px;\
	border-radius: 4px;\
}\
.esgst-cfh-sr-summary:hover {\
	background-color: hsla(0, 0%, 24%, 0.3) !important;\
	color: inherit !important;\
	filter: brightness(1.2);\
}\
.esgst-cfh-sr-box:not(:first-child) {\
	border-top: 1px solid ' + config[0][37] + ' !important;\
	box-shadow: 0 1px 0 ' + config[0][38] + ' inset;\
}\
.esgst-gas-popout, .esgst-ds-popout, .esgst-gm-popout, .esgst-gv-spacing {\
	background-image: linear-gradient(' + config[0][170] + ' 0%, ' + config[0][60] + ' 100%) !important;\
	border-color: ' + config[0][61] + ' ' + config[15] + ' ' + config[0][62] + ' ' + config[15] + ' !important;\
	color: ' + config[8] + ' !important;\
	text-shadow: 1px 1px 1px hsla(0, 0%, 0%, 0.999), 1px 1px 2px hsla(0, 0%, 0%, 0.7);\
}\
:root {\
	--esgst-lpv-button: linear-gradient(' + config[0][17] + ' 0, ' + config[28] + ' 5px, ' + config[0][19] + ' 100%) !important;\
	--esgst-lpv-button-hover: var(--esgst-lpv-button);\
	--esgst-lpv-button-selected: var(--esgst-lpv-button);\
	--esgst-lpv-button-selected-hover: var(--esgst-lpv-button);\
	--esgst-lpv-arrow-selected: var(--esgst-lpv-button);\
	--esgst-lpv-bar: hsl(100, 75%, 24%);\
	--esgst-lpv-bar-hover: var(--esgst-lpv-bar);\
	--esgst-lpv-bar-selected: var(--esgst-lpv-bar);\
    --esgst-lpv-bar-projected: hsl(180, 79%, 29%);\
    --esgst-lpv-bar-hover-projected: var(--esgst-lpv-bar-projected);\
    --esgst-lpv-bar-selected-projected: var(--esgst-lpv-bar-projected);\
}\
.esgst-lpv-container .nav__button {\
	background-image: none !important;\
	padding: 0 15px !important;\
}\
.esgst-lpv-container .nav__button--is-dropdown {\
	box-shadow: 0 0 0 0 hsl(0, 0%, 0%), 1px 1px 1px rgba(255, 255, 255, 0.12) inset, 1px 1px 0 rgba(255, 255, 255, 0.07) inset !important}\
.esgst-lpv-container .nav__button--is-dropdown-arrow:not(.nav_btn_right) {\
	margin-left: 0;\
	box-shadow: 0 1px 0 rgba(255, 255, 255, 0.10) inset, 0 1px 0 rgba(255, 255, 255, 0.06) inset !important;\
	padding: 0 10px !important;\
}\
.esgst-lpv-container .nav__button--is-dropdown-arrow:not(.nav_btn_right).is-selected {box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.3) inset, 1px 1px 0 0 hsla(215, 8%, 5%, 1), 0 -1px 0 0 hsla(215, 8%, 5%, 1), 0 1px 0 rgba(255, 255, 255, 0.10) inset, 0 1px 0 rgba(255, 255, 255, 0.05) inset !important;}\
.esgst-lpv-container:not(.is-selected) {\
	transition: filter .35s ease-in;\
	will-change: filter;\
}\
.esgst-gas-popout select, .esgst-ds-popout select {margin: 8px 0;}\
.esgst-gf-filters > div:last-child > div:first-child ~ input, .esgst-gf-filters > div:last-child > div:first-child ~ .esgst-button-set {margin-top: 5px;}\
.esgst-heading-button .esgst-toggle-switch-container.inline {height: 14px !important;}\
.esgst-gf-container .esgst-gf-box {\
	background-color: transparent !important;\
	background-image: linear-gradient(' + config[0][5] + ' 0%, ' + config[0][83] + ' 100%);\
	border: 1px solid ' + config[0][84] + ' !important;\
	border-radius: 4px 4px 0 0 !important;\
	padding: 0 5px !important;\
}\
.esgst-gf-container.esgst-gf-filters {\
	display: flex;\
	justify-content: space-around;\
}\
.esgst-gf-filters:not(.esgst-gf-container) {\
	display: grid;\
	grid-template-areas: "basic type category space legend" "basic type category space preset";\
	grid-template-columns: 1fr max-content auto 1fr max-content;\
	margin: 5px 0 5px 5px;\
	min-height: 0;\
}\
.esgst-gf-basic-filters {grid-area: basic;}\
.esgst-gf-type-filters {grid-area: type;}\
.esgst-gf-category-filters {grid-area: category;}\
.esgst-gf-legend-panel {\
	align-self: start;\
	grid-area: legend;\
}\
.esgst-gf-preset-panel {\
	align-self: end;\
	grid-area: preset;\
}\
.esgst-gf-type-filter, .esgst-gf-category-filter, .esgst-gf-exception-filter, .esgst-gf-legend, .esgst-gf-preset-panel >* {margin: 3px !important;}\
.esgst-gf-legend-panel > div:first-child, .esgst-gf-filters > div:last-child > div:first-child, .esgst-gf-exception-filters > div:first-child, .esgst-gf-basic-filters > div:first-child, .esgst-gf-type-filters > div:first-child, .esgst-gf-category-filters > div:first-child {\
	color: hsla(202, 62%, 67%, 0.9);\
	font-weight: 600;\
	font-size: 14px;\
	margin-bottom: 5px !important;\
}\
.esgst-gf-legend-panel, .esgst-gf-preset-panel {\
	background-color: ' + config[0][205] + ';\
	background-image: none;\
	border: 1px solid ' + config[0][206] + ';\
	border-radius: 4px;\
	padding: 4px 10px 10px;\
	position: unset;\
	text-align: unset;\
}\
.esgst-gf-legend-panel > div:first-child, .esgst-gf-preset-panel > div:first-child {text-align: center;}\
.esgst-gf-button {\
	border-radius: 4px !important;\
	border-top: 1px solid ' + config[0][84] + ' !important;\
	margin-top: -4px;\
}\
.esgst-popup > .popup_summary {\
	display: block;\
	justify-content: center;\
}\
.esgst-sgpb-button img {vertical-align: baseline !important;}\
.esgst-settings-menu .form__row__indent > div {padding-bottom: 3px;}\
.esgst-popup-scrollable .global__image-outer-wrap.page_heading_btn.esgst-cfh-emojis {\
	min-height: 24px;\
	padding: 5px !important;\
	margin: 15px !important;\
}\
.esgst-popup-scrollable textarea {border: 1px solid;}\
.esgst-button-set .btn_action {display: inline-block;}\
.esgst-gv-popout .giveaway__heading__thin {line-height: 14px;}\
.ui-tooltip-content .tooltip {\
	background-image: linear-gradient(' + config[48] + ' 0%, ' + config[48] + ' 100%);\
	box-shadow:  0 0 0 1px ' + config[0][186] + ', 2px 2px 8px 0 ' + config[0][150] + ';\
	color: ' + config[4] + ' !important;\
	margin: -3px;\
}\
.tooltip_row:only-child {padding: 0 10px 0 5px;}\
.tooltip_row [style*="color: #8f96a6"] {color: ' + config[8] + ' !important;}\
.tooltip_row:not(:last-child) {border-bottom: 1px dotted ' + config[0][186] + ';}\
.tooltip i {text-shadow: 1px 1px ' + config[0][10] + ';}\
.ui-tooltip {z-index: 99999 !important;}\
.form__rows > .esgst-button-set {margin-bottom: 20px !important;}\
.esgst-form-row-indent > div {line-height: 16px;}\
.esgst-tab-menu {\
	color: ' + config[8] + ' !important;\
	text-shadow: 1px 1px ' + config[0][12] + ' !important;\
}\
.esgst-popup-scrollable .row-spacer {margin-bottom: 12px;}\
.esgst-settings-menu .esgst-form-sync {max-width: 583px;}\
.esgst-settings-menu .esgst-steam-api-key {max-width: 578px;}\
.esgst-form-heading-number {\
	color: ' + config[0][287] + ' !important;\
	font-weight: 600!important;\
	filter: brightness(85%);\
}\
.esgst-sm-small-number {\
	font-size: 11px!important;\
	filter: brightness(75%);\
}\
.esgst-page-heading >* {\
	background-image: linear-gradient(' + config[0][170] + ' 0%, ' + config[0][60] + ' 100%) !important;\
	border-color: ' + config[0][61] + ' ' + config[15] + ' ' + config[0][62] + ' ' + config[15] + ';\
	color: ' + config[7] + ' !important;\
}\
.esgst-settings-menu .esgst-notification-warning {margin-right: 5px;}\
.esgst-settings-menu > .esgst-button-set {margin: 10px 0 10px;}\
.esgst-gm-popout.esgst-popout .esgst-button-set, .esgst-mt-popout.esgst-popout .esgst-button-set {margin: 3px;}\
.esgst-gm-popout.esgst-popout .esgst-button-set:nth-child(2) {margin-right: 6px;}\
.esgst-gm-popout.esgst-popout .esgst-button-set:not(:nth-child(3)), .esgst-mt-popout.esgst-popout .esgst-button-set {float: left;}\
.esgst-gm-popout.esgst-popout .esgst-button-set:nth-child(7) {margin-bottom: 10px;}\
.esgst-gm-popout.esgst-popout .esgst-button-set >*, .esgst-mt-popout.esgst-popout .esgst-button-set >* {\
	font-size: 12px;\
	line-height: 25px;\
	padding: 0 8px !important;\
	width: auto !important;\
}\
.esgst-gm-popout .esgst-cfh-panel {margin-top: 5px !important;}\
.esgst-gm-popout .esgst-description {min-width: 0 !important;}\
.esgst-feature-description.markdown.esgst-popout {\
	width: auto !important;\
	max-width: 33.3%;\
}\
.esgst-feature-description .esgst-description.markdown {\
	color: #a6a6a6 !important;\
	font-style: normal;\
	font-size: 12px;\
	padding: 0 10px;\
}\
.esgst-popup-description input[type="file"] {\
	background-color: transparent;\
	color: hsla(0, 0%, 42%, 1) !important;\
	border: none;\
}\
.esgst-popup-description input[type="file"]::-webkit-file-upload-button {\
	background-image: linear-gradient(' + config[0][120] + ' 0%, ' + config[0][121] + ' 100%) !important;\
	border-color: ' + config[0][122] + ' ' + config[0][123] + ' ' + config[0][124] + ' ' + config[0][123] + ' !important;\
	border-radius: 4px;\
	color: ' + config[0][31] + ' !important;\
	cursor: pointer !important;\
	font: 700 13px/32px "Open Sans",sans-serif;\
	outline: none;\
	padding: 0 10px;\
	text-shadow: 1px 1px 1px ' + config[0][10] + ';\
	transition: filter .35s ease-in;\
	will-change: filter;\
}\
.esgst-popup-description input[type="file"]::-webkit-file-upload-button:hover {filter: brightness(1.25);}\
.esgst-popup-description input[type="file"]::-webkit-file-upload-button:active {\
	border-color: hsla(0, 0%, 0%, 0.75) hsla(0, 0%, 55%, 0.5) hsla(0, 0%, 55%, 0.5) hsla(0, 0%, 0%, 0.75) !important;\
	border: 1px solid;\
	box-shadow: 2px 2px 2px hsla(0, 0%, 0%, 0.5) inset, 7px 7px 10px hsla(0, 0%, 5%, 0.5) inset !important;\
	margin-top: 0;\
	margin-left: 0;\
	text-shadow: 1px 1px 1px ' + config[0][10] + ' !important;\
	filter: brightness(0.35);\
	transition: filter .01s;\
	will-change: filter;\
}\
.esgst-cerb-button {color: #737373;}\
.esgst-cerb-button i, .esgst-cerb-reply-button i {color: #505050;}\
.esgst-form-row-indent {margin-right: 10px;}\
.esgst-gv-popout .esgst-gf-hide-button, .esgst-gv-popout .esgst-gf-unhide-button, .esgst-gv-popout .esgst-gb-button, .esgst-gv-popout .esgst-egh-button {margin-right: 3px !important;}\
.esgst-gv-popout .giveaway__heading > div + div + .giveaway__heading__name, .esgst-gv-popout .giveaway__heading > div + .esgst-egh-button + .giveaway__heading__name {max-width: 130px !important;}\
.esgst-gv-popout .giveaway__heading > div + div + .esgst-egh-button + .giveaway__heading__name, .esgst-gv-popout .giveaway__heading > div + .esgst-egh-button + .esgst-gb-button + .giveaway__heading__name {max-width: 115px!important;}\
.comment__parent.esgst-ct-comment-read .esgst-cerb-reply-button {margin-top: 50px !important;}\
.esgst-popup .esgst-gf-basic-filter {width: 250px;}\
.esgst-popup .esgst-gf-container + .esgst-text-left:not(.esgst-gv-view) {\
	background: none !important;\
	border: none !important;\
	box-shadow: none !important;\
}\
.esgst-aic-right-button, .esgst-aic-left-button {\
	background-color: ' + config[14] + ';\
	border: 1px solid ' + config[0][50] + ';\
	border-radius: 4px;\
	padding: 8px 10px;\
}\
.esgst-aic-right-button {right: 15px;}\
.esgst-aic-left-button {left: 15px;}\
.esgst-es-page-divisor {margin: -1px -10px 5px;}\
.esgst-gv-view .esgst-es-page-divisor {margin: 5px 0;}\
.esgst-es-page-divisor > .page__heading__breadcrumbs.page_heading_breadcrumbs {\
	border-radius: 0px;\
	border-left: none;\
	border-right: none;\
}\
.esgst-popup .popup__keys__list {\
	border: none;\
	font-size: 12px;\
	margin: 1px !important;\
	padding: 0;\
}\
.esgst-hidden-buttons {\
	background-color: ' + config[2] + ' !important;\
	border-color: ' + config[0][61] + ' ' + config[15] + ' ' + config[0][62] + ' ' + config[15] + ' !important;\
}\
.esgst-popup-scrollable > table ~ .form__saving-button.btn_action.white {margin-right: 5px !important;}\
.esgst-cfh-popout.esgst-popout input[type="text"] {margin-bottom: 5px;}\
.esgst-cfh-sr-controls i {text-shadow: 1px 1px hsla(0, 0%, 0%, 0.99), 0 0 1px hsla(0, 0%, 0%, 0.99), 0 0 1px hsla(0, 0%, 0%, 0.99);}\
.esgst-popup .esgst-cerb-reply-button, .esgst-popup .esgst-ct-comment-read .esgst-cerb-reply-button {\
	margin-top: 40px !important;\
	position: relative !important;\
	width: 0 !important;\
	left: 10px;\
}\
.description.esgst-hidden.esgst-popup-progress {border-top: none;}\
input[type="date"]:focus {text-shadow: none !important;}\
input[type=date]::-webkit-calendar-picker-indicator:hover {\
	background-color: transparent;\
	color: hsla(0, 0%, 63%, 0.8);\
}\
.esgst-popup-description .esgst-text-left.esgst-float-right.table {padding: 5px 10px !important}\
.esgst-popup-scrollable .table__rows .table__row-outer-wrap {\
	padding: 10px 0px 10px 10px !important;\
	text-align: unset !important;\
}\
.esgst-ugd-table.table {margin-bottom: 15px !important;}\
.esgst-gp-button .btn_action.grey {\
	filter: brightness(0.8) contrast(1.1);\
	min-width: 20px;\
	width: 20px !important;\
}\
.esgst-gp-button .btn_action.grey:hover:not(:active) {filter: brightness(0.9)!important}\
.esgst-gv-popout .esgst-gp-button { margin: 5px 3px 0 3px !important;}\
.esgst-gv-popout .esgst-gp-button .btn_action.grey {min-width: 53px !important;}\
.esgst-gc-border {\
	height: 3px !important;\
	margin-left: auto !important;\
	margin-right: auto !important;\
	max-width: 184px !important;\
}\
.sidebar .esgst-button-set > * {width: 304px!important;}\
.esgst-gcl-popout input {\
	border: none;\
	border-bottom: 1px solid ' + config[0][37] + ' !important;\
	border-radius: 4px 4px 0 0!important;\
	filter: brightness(1.15);\
}\
.esgst-gv-popout {\
	max-width: 174px;\
	width: 174px;\
}\
.esgst-cfh-panel > * {\
	background-image: linear-gradient(' + config[0][170] + ' 0%, ' + config[0][60] + ' 100%);\
	border-color: ' + config[0][61] + ' ' + config[15] + ' ' + config[0][62] + ' ' + config[15] + ';\
	color: ' + config[7] + ';\
}\
.esgst-sttb-button {\
	bottom: 52px;\
	right: 15px;\
	text-shadow: 1px 1px hsla(0, 0%, 0%, 0.99), 0 1px hsla(0, 0%, 0%, 0.99), 1px 0 hsla(0, 0%, 0%, 0.99), 0 -1px hsla(0, 0%, 0%, 0.99), -1px 0 hsla(0, 0%, 0%, 0.99)!important;\
}\
.esgst-glwc-heading {\
	font: 700 24px/24px "Open Sans", sans-serif !important;\
	letter-spacing: -0.02em;\
	text-shadow: -1px 1px hsla(0, 0%, 0%, 0.99), 1px 1px hsla(0, 0%, 0%, 0.99), 0 0 1px hsla(0, 0%, 0%, 0.99), 0 0 1px hsla(0, 0%, 0%, 0.99);\
}\
.esgst-glwc-heading + input {height: 34px;}\
.esgst-glwc-results .table {min-width: 0 !important;}\
.esgst-gv-popout .esgst-ggl-panel a:last-child {\
	display: inline-block;\
	max-width: 130px;\
	overflow: hidden;\
	text-overflow: ellipsis;\
	vertical-align: middle;\
	white-space: nowrap;\
}\
.esgst-qgs-container {\
	background-color: ' + config[11] + ' !important;\
	border-color: ' + config[0][160] + ' !important;\
}\
.esgst-qgs-container ::placeholder, .esgst-gcl-popout ::placeholder{\
	color: ' + config[0][161] + ' !important;\
	text-shadow: 1px 1px hsla(0, 0%, 0%, 0.99), 0 0 1px hsla(0, 0%, 0%, 0.99) !important;\
}\
.esgst-qgs-container i {\
	color: ' + config[0][272] + ';\
	text-shadow: 1px 1px hsla(0, 0%, 0%, 0.99), 0 0 1px hsla(0, 0%, 0%, 0.99);\
}\
.esgst-ggl-heading {\
	color: ' + config[10] + ';\
	display: block;\
	font-size: 14px;\
	font-weight: 600;\
	margin: 5px;\
	text-align: center;\
	text-shadow: 1px 1px hsla(0, 0%, 0%, 0.99), 1px 1px 1px hsla(0, 0%, 0%, 0.99), 0 0 1px hsla(0, 0%, 0%, 0.99), 0 0 1px hsla(0, 0%, 0%, 0.99);\
}\
.esgst-ggl-heading + input[placeholder*="Search"] {border-radius: 0!important;}\
.esgst-popup input[placeholder*="Search"] + .esgst-text-left.table .table__row-inner-wrap {padding-right: 5px;}\
.featured__container .esgst-giveaway-panel .featured__column {margin-top: 3px;}\
.esgst-popup .esgst-gv-popout {margin-left: -1px;}\
.esgst-ib-game + .esgst-gv-icons {right: 2px;}\
.sidebar {' + esgstsidebar + ';}\
.sidebar + div .esgst-fmph, .sidebar + div .esgst-fmph-background {' + esgstfmph + '; ' + mwidth + ';}\
/* SG2O Styles */\
.nav__button-container:last-child a[href="#sg2o-overlay-settings"] {border-radius: 4px !important;}\
.giveaway-gridview {margin: 5px !important;}\
.giveaway-gridview, .giveaway-gridview .giveaway_image_thumbnail, .giveaway-gridview .giveaway_image_thumbnail_missing {box-shadow: none !important;}\
.gridview-info {\
	background-color: ' + config[14] + ' !important;\
	border: 1px solid ' + config[0][50] + ' !important;\
	border-radius: 0 0 3px 3px !important;\
	color: ' + config[8] + ';\
	margin-top: -2px !important;\
	text-shadow: 1px 1px ' + config[0][12] + ';\
}\
.gridview-info .ga-name {\
	border-bottom: 1px solid ' + config[0][37] + ' !important;\
	box-shadow: 0 1px 0 ' + config[0][38] + ';\
	color: ' + config[3] + ';\
	min-height: 18px;\
	text-align: center;\
	text-shadow: 1px 1px ' + config[0][10] + ', 1px 1px 2px ' + config[0][10] + ';\
}\
.gridview-avatar {\
	border-radius: 4px !important;\
	background-color: ' + config[14] + ';\
	background-size: cover;\
	border: 1px solid ' + config[0][50] + ' !important;\
	box-shadow: none !important;\
	margin-left: 5px;\
	margin-bottom: 5px;\
}\
.gridview-info .giveaway__column--contributor-level {\
	border: 1px solid;\
	border-radius: 4px;\
	margin-top: 4px;\
	padding: 2px 4px;\
}\
.sg2o-tooltip {\
	border-bottom: 1px dotted ' + config[0][192] + ' !important;\
	margin-top: -8px;\
	text-shadow: inherit !important;\
}\
.sg2o-tooltip > span {\
	background: ' + config[48] + ' !important;\
	border: 1px solid ' + config[0][186] + ' !important;\
	box-shadow: 2px 2px 2px ' + config[0][150] + ', 2px 2px 8px ' + config[0][150] + ' !important;\
	color: ' + config[49] + ' !important;\
	line-height: 16px;\
	padding: 5px 5px 5px 8px !important;\
	width: 190px !important;\
}\
.sg2o-tooltip:hover > span {\
	margin-left: -75px !important;\
	margin-top: 30px !important;\
}\
.sg2o-tooltip span b {\
	background: ' + config[48] + ' !important;\
	box-shadow: none !important;\
	border-top: 1px solid ' + config[0][186] + ' !important;\
	border-right: 1px solid ' + config[0][186] + ' !important;\
	margin-top: -14px !important;\
}\
.pinned-gridview-container {\
	background-image: linear-gradient(' + config[0][5] + ' 0%, ' + config[0][83] + ' 100%) !important;\
	border: 1px solid ' + config[0][84] + ' !important;\
}\
.table__heading.sg2o-table-heading {\
	padding: 0 10px;\
	border-top: 1px solid ' + config[0][24] + ' !important;\
	margin: 5px -10px;\
}\
.pagination > .table__heading.sg2o-table-heading {\
	margin: -6px -1px;\
	border-radius: 4px !important;\
	border: 1px solid ' + config[0][24] + ' !important;\
}\
.sg2o-gridview-container, .pinned-gridview-container, .sg2o-gridview-container .table__heading.sg2o-table-heading + div {\
	display: flex;\
	flex-wrap: wrap;\
	justify-content: center;\
}\
.group-border, .whitelist-group, .contributor-below-border, .group-contributor-below-border, .group-contributor-above-border, .whitelist, .contributor-above-border, .wishlist-border, .group-wishlist-border, .whitelist-wishlist, .contributor-above-wishlist-border, .contributor-below-wishlist {border: 1px solid ' + config[0][50] + ';}\
#powerTip {background-color: #1F1F1f !important;}\
#powerTip.ne:before, #powerTip.nw:before, #powerTip.n:before {border-top: 10px solid #1f1f1f !important;}\
#powerTip.se:before, #powerTip.sw:before, #powerTip.s:before {border-bottom: 10px solid #1f1f1f !important;}\
#powerTip.w:before {border-left: 10px solid #1f1f1f !important;}\
#powerTip.e:before {border-right: 10px solid #1f1f1f !important;}\
.sg2o-modal-dialog > div {\
	background-image: linear-gradient(' + config[0][152] + ' 0%, ' + config[0][185] + ' 100%) !important;\
	border: 1px solid;\
	border-color: ' + config[0][146] + ' ' + config[0][147] + ' ' + config[0][149] + ' ' + config[0][147] + ';\
	max-width: 75%;\
	min-width: 600px;\
}\
.sg2o-settings-tabs-navigation li:first-child a {border-top-left-radius: 12px !important;}\
.sg2o-settings-tabs-navigation li:last-child a {border-top-right-radius: 12px !important;}\
.sg2o-settings-tabs nav {box-shadow: rgba(0, 0, 0, 0.15) 0 -4px 0 inset !important;}\
.sg2o-settings-tabs-navigation {box-shadow: rgba(0, 0, 0, 0.05) 0 -2px 2px inset !important;}\
.sg2o-settings-tabs-navigation a.sg2o-settings-tab-selected {\
	background-color: rgba(0, 0, 0, 0.3) !important;\
	box-shadow: rgb(114, 35, 33) 0 2px 0 inset !important;\
	color: rgb(161, 49, 49);\
}\
.sg2o-settings-tabs-navigation a {\
	background-color: rgba(0, 0, 0, 0.15) !important;\
	box-shadow: rgb(114, 35, 33) 0 2px 0 inset !important;\
}\
.sg2o-settings-tabs-navigation a:hover {\
	color: rgb(132, 132, 132) !important;\
	background-color: rgba(44, 44, 44, 0.3) !important;\
}\
.sg2o-settings-head, .sg2o-settings-color-input {color: #858585 !important;}\
.sg2o-settings-color-input input {\
	background-color: #232323!important;\
	border-color: hsl(0, 0%, 20%) !important;\
}\
#sg2o-level-slider, #sg2o-points-slider, #sg2o-chance-slider {\
	margin-top: 7px;\
	margin-bottom: 2em;\
}\
.ui-slider-pips .ui-slider-label {\
	top: 0 !important;\
	text-indent: 0;\
}\
.ui-slider-pips .ui-slider-line {top: -7px;}\
.ui-slider-pips:not(.ui-slider-disabled) .ui-slider-pip:hover .ui-slider-label {color: hsla(0,0%,88%,1) !important;}\
.ui-slider-pips [class*=ui-slider-pip-initial], .ui-slider-pips .ui-slider-pip-initial-2 {color: ' + config[7] + ';}\
.ui-slider-pips [class*=i-slider-pip-selected], .ui-slider-pips .ui-slider-pip-selected-2 {color: ' + config[37] + ' !important;}\
.ui-slider-float .ui-slider-tip, .ui-slider-float .ui-slider-tip-label {\
	background: ' + config[48] + ' !important;\
	border: 1px solid ' + config[0][186] + ' !important;\
	border-radius: 4px !important;\
	color: ' + config[49] + ' !important;\
	text-indent: 0;\
}\
.ui-slider-float .ui-slider-tip:before, .ui-slider-float .ui-slider-pip .ui-slider-tip-label:before {border-top-color: inherit !important;}\
.ui-slider-float .ui-slider-tip:after, .ui-slider-float .ui-slider-pip .ui-slider-tip-label:after {border-top-color: ' + config[48] + ' !important;}\
.sidebar__navigation:last-of-type + div:not(.floating-pagination) {\
	background-image: linear-gradient(' + config[16] + '  0, ' + config[0][144] + '  6px, ' + config[0][145] + ' 100%);\
	border: 1px solid;\
	border-color: ' + config[0][146] + ' ' + config[0][147] + ' ' + config[0][149] + ' ' + config[0][147] + ';\
	border-radius: 4px;\
	box-shadow: 1px 1px 2px ' + config[0][148] + ' inset;\
	margin-top: 28px;\
	padding: 10px 20px 5px 20px;\
	text-shadow: 1px 1px ' + config[0][12] + ';\
}\
.sidebar__navigation:last-of-type + div:not(.floating-pagination)[style^="padding-top: 10px"] {\
	background-image: none;\
	border: none;\
	box-shadow: none;\
	margin-top: 0;\
}\
.sidebar__navigation:last-of-type + div > div {text-indent: 10px;}\
.sidebar__navigation:last-of-type + div h3 {\
	margin-left: -20px;\
	margin-top: -30px;\
	padding-bottom: 18px;\
}\
/* ESG Styles */\
.pagination__results, .pagination__navigation {text-indent: 0 !important;}\
.cb__three {\
	color: ' + config[0][155] + ';\
	text-shadow: 1px 1px ' + config[0][10] + ';\
}\
.comment__tools {\
	margin-bottom: 8px !important;\
	margin-top: 3px;\
}\
.comment__tools > .comment__submit-button, .comment__submit-button.serperator {\
	border: none !important;\
	box-shadow: 0 0 0 1px #000;\
	margin-right: 1px;\
}\
.emoticons {\
	background: ' + config[11] + ';\
	border: 1px solid ' + config[0][160] + ' !important;\
	border-radius: 4px;\
}\
.emoticons .comment__submit-button {\
	font: 300 18px/22px "Open Sans",sans-serif;\
	height: 24px!important;\
	margin: 0.12em 0;\
	padding: 2px !important;\
	text-shadow: none;\
	width: 27px!important;\
}\
.nav__row[href*="#esg_about"] i {color: hsla(187,43%,55%,1) !important;}\
.nav__row:hover[href*="#esg_about"] i {color: ' + config[0][36] + ' !important;}\
.giveaway__chance[style="color:red"] {color: ' + config[37] + ' !important;}\
.giveaway__chance {opacity: 0.65;}\
.giveaway__heading__name font.ga-mark {color: hsla(60,75%,37%,1);}\
.giveaway__columns > form {\
	background-image: none;\
	border: none;\
	box-shadow: none !important;\
}\
.sidebar__entry-insert.enterall {\
	margin: 0 5px 0 0;\
	padding: 4px 10px 5px 5px;\
}\
.sidebar__entry-insert.enterall i {\
	font: inherit !important;\
	font-size: 13px !important;\
}\
.sidebar__entry-insert.enterall i:before {font: normal normal normal 14px/1 FontAwesome;}\
.sidebar__navigation__itemz {height: 60px;}\
.sidebar__navigation__itemz .sidebar__navigation__item__link {padding: 3px 5px;}\
.sidebar__navigation__itemz .sidebar__navigation__item__link .sidebar__navigation__item__underline {\
	color: ' + config[9] + ';\
	border: 1px solid transparent;\
	font-size: 11px;\
	opacity: 1;\
	text-shadow: 1px 1px ' + config[0][12] + ';\
	white-space: nowrap;\
}\
.sidebar__navigation__itemz .sidebar__navigation__item__link:not(:hover) .sidebar__navigation__item__underline {\
	border-bottom: 1px dotted ' + config[0][192] + ';\
	box-shadow: 0 1px 0 ' + config[0][148] + ';\
}\
.sidebar__navigation__item__title {\
	color: ' + config[3] + ';\
	font-size: 13px !important;\
	padding-bottom: 4px;\
	text-overflow: ellipsis;\
	text-shadow: 1px 1px ' + config[0][10] + ', 1px 1px 2px ' + config[0][10] + ';\
}\
.sidebar__navigation__item__title + i {\
	bottom: 2px;\
	color: ' + config[0][46] + ' !important;\
	position: relative;\
	text-shadow: 1px 1px ' + config[0][10] + ' !important;\
}\
.sidebar__navigation__itemz .sidebar__navigation__item__name {\
	color: ' + config[4] + ' !important;\
	margin-bottom: -12px;\
	position: relative;\
	text-shadow: 1px 1px ' + config[0][10] + ';\
}\
.sidebar__navigation__itemz .sidebar__navigation__item__name:nth-child(4) {\
	color: ' + config[9] + ' !important;\
	top: -15px;\
}\
div.sidebar__entry-custom {margin: -1px -9px !important;}\
.filter-content {padding: 2px 0 5px 0 !important;}\
.filter_table {\
	margin: 0 0 5px 0 !important;\
	padding: 0 5%;\
}\
.filter_table td {\
	border: none !important;\
	padding: 2px !important;\
}\
.filter_table tr td:first-child {text-indent: 15px;}\
.filter_table tr:last-child td:nth-child(2) {\
	background-color: rgba(0, 0, 0, 0.27);\
	border-radius: 4px;\
	border: 1px solid hsla(0, 0%, 0%, 0.27) !important;\
	cursor: default;\
}\
.filter_table tr:last-child td:nth-child(2) span {\
	margin-right: 220px !important;\
	padding-left: 15px;\
}\
.filter_table tr:last-child td:last-child {\
	color: ' + config[7] + ' !important;\
	cursor: default;\
	text-indent: -220px;\
}\
.filter_table tr:last-child td:last-child i {\
	margin: -1px 0 0 15px !important;\
	text-indent: 0;\
}\
.filter_table tr:first-of-type td:not(:first-child) {\
	position: relative;\
	top: 58px;\
}\
.floating-pagination {\
	margin-bottom: 3px;\
	max-width: 194px !important;\
	min-width: 194px !important;\
}\
.sidebar--wide .floating-pagination {\
	max-width: 322px;\
	z-index: 1;\
}\
.floating-pagination .pagination__results {margin-bottom: 5px;}\
.floating-pagination .pagination__navigation a {padding: 0 3px;}\
.form__slider_filter--level, .form__slider_filter--chance, .form__slider_filter--points {margin-top: 2px;}\
.popup--content.page__description {word-break: normal !important;}\
.popup__desc-display .popup__heading {margin-top: -40px;}\
.popup__desc-display .popup__heading__bold {\
	font-size: 32px;\
	position: relative;\
	right: 50px;\
	top: -35px;\
}\
.popup__desc-display.popup {padding: 35px 75px;}\
.popup__desc-display i {\
	font-size: 32px;\
	margin-right: -190px;\
	padding: 15px;\
	text-indent: 2px;\
}\
.popup__desc-error.popup .fa-exclamation-circle {padding: 6px 10px;}\
.pinned-giveaways__button[collapsed="1"] {margin-top: -15px !important;}\
.nav__right-container .nav__button[style*="box-shadow"] + .nav__button--is-dropdown-arrow:not(.is-selected) {box-shadow: 1px 1px 0 0 hsla(0, 0%, 0%, 1) !important;}\
.giveaway__columns > .giveaway__column--width-fill.text-right {\
	display: flex;\
	justify-content: flex-end;\
	flex-wrap: wrap;\
	align-items: center;\
}\
.giveaway__column--width-fill.text-right .giveaway__username {\
	line-height: normal;\
	margin-left: 5px;\
}\
.scroll-top {\
	bottom: -20px !important;\
	right: 50px !important;\
	z-index: 1000 !important;\
	transform-origin: left top 0;\
	text-shadow: 1px 1px hsla(0, 0%, 0%, 0.99), -1px -1px hsla(0, 0%, 0%, 0.99), -1px 0 hsla(0, 0%, 0%, 0.99), 0 -1px hsla(0, 0%, 0%, 0.99) !important;\
}\
.mt-more-like-this.sidebar__entry-loading {line-height: 26px;}\
.mt-more-like-this {box-shadow: none !important;}\
.mt-search {height: 29px;}\
@media screen and (max-width: 1280px){\
	.giveaway__columns > form {\
		margin-right: 0 !important;\
	}\
	.sidebar__navigation__itemz .sidebar__navigation__item__link .sidebar__navigation__item__underline {\
		max-width: 222px;\
	}\
	.sidebar__navigation__item__title {\
		font-size: 12px !important;\
		padding-bottom: 5px;\
	}\
	div.sidebar__entry-custom {\
		padding: 0 4px !important;\
		margin: 0 -4px !important;\
		min-width: 40px !important;\
		font-size: 10px !important;\
		line-height: 22px !important;\
	}\
	.popup__desc-display.popup {\
		max-width: 780px !important;\
	}\
}\
@media screen and (max-width: 1024px){\
	.filter-content.pinned-giveaways .form__slider {\
		width: 190px;\
	}\
	.filter-content ~ div .global__image-outer-wrap--game-medium {\
		width: 145px;\
		height: 54px;\
	}\
	.filter-content ~ div .giveaway__row-inner-wrap>:not(:last-child) {\
		margin-right: 5px !important;\
	}\
	.floating-pagination {\
		max-width: 208px !important;\
	}\
	.giveaway__chance {\
		white-space: normal !important;\
	}\
	.giveaway__columns > form {\
		position: relative;\
		bottom: -28px;\
		margin-right: -8px !important;\
		margin-left: -70px !important;\
	}\
}\
/* SGPP Styles */\
.pull-right.endless_control_element .fa-refresh {margin-right: 8px;}\
.tile_view_header {\
	border-bottom: 1px solid ' + config[0][125] + ' !important;\
	box-shadow: 0 1px 0 ' + config[0][126] + ' !important;\
	margin-bottom: 7px !important;\
	padding-bottom: 6px;\
	word-wrap: break-word;\
}\
.SGPP_FixedFooter_outerWrap {\
	background: ' + config[27] + ' !important;\
}\
.SGPP__gridAvatar_outer {margin-bottom: 2px;}\
.SGPP__gridAvatar_outer + div > div:first-of-type {margin-bottom: 3px;}\
.SGPP__gridTileInfo .giveaway__icon {\
	position: relative;\
	top: -2px;\
}\
.SGPP__gridTileInfo {\
	background-color: ' + config[14] + ' !important;\
	border: none !important;\
	box-shadow: 0 0 0 1px ' + config[0][50] + ';\
}\
.SGPP__gridTile:hover > .SGPP__gridTileInfo {border-top: 1px dotted ' + config[0][50] + ' !important;}\
.SGPP__gridTileTime {background-color: ' + config[14] + ' !important;}\
.SGPP__gridTileIcons > :last-child {border-bottom-right-radius: 2px;}\
.SGPP__gridTileIcons i{\
	font-size: inherit;\
	color: inherit;\
}\
.SGPP__gridTile.is-faded:hover {opacity: 1;}\
.SGPP__gridView {margin: 5px -5px !important;}\
.SGPP_EntryComm_comment > i.fa.fa-check, .SGPP_EntryComm_comment > i.fa.fa-times {font-size: 0.8em;}\
.SGPP_EntryComm_comment > i.fa.fa-check {color: ' + config[0][155] + ';}\
.SGPP_EntryComm_comment > i.fa.fa-times {color: ' + config[37] + ';}\
.SGPP_EntryComm_comment .fa-comment-o {font: 16px/1.7 FontAwesome;}\
.SGPP_EntryComm_comment {\
	vertical-align: middle;\
	margin-top: -25px;\
}\
.endless_badge_new, .endless_badge_new_child {\
	background-color: ' + config[0][184] + ' !important;\
	box-shadow: 0 0 1px 0 ' + config[0][150] + ';\
	color: #B8B8B8 !important;\
	padding: 1px 3px 1px 2px !important;\
	text-shadow: 1px 1px ' + config[0][10] + ' !important;\
}\
.message-filter i {\
	width: 13px;\
	margin-top: -2px;\
}\
#esc_reply_header {margin-bottom: 8px;}\
.SGPP__Module:before, .SGPP__optionTitle:before {color: ' + config[0][287] + ';}\
.SGPP__settings-checkbox.form__checkbox:not(:hover) {\
	color: ' + config[4] + ' !important;\
	text-shadow: 1px 1px ' + config[0][10] + ';\
}\
.SGPP__settings-checkbox.form__checkbox:hover, input:checked + label:before {color: ' + config[0][155] + ';}\
input:checked + label:hover:before, input:checked + .SGPP__settings-checkbox.form__checkbox:hover {color: ' + config[37] + ';}\
label.SGPP__settings-checkbox:before {\
	margin-top: 1px;\
	padding-right: 4px;\
}\
.SGPP__settings-checkbox > .fa-circle-o, .SGPP__settings-checkbox > .fa-circle,  .SGPP__settings-checkbox > .fa-check-circle, label.SGPP__settings-checkbox {\
	margin-top: -3px;\
	padding-right: 4px;\
}\
.SGPP_UserInfo_balloon .SGPP_UserOnline {\
	background: none !important;\
	box-shadow: 3px 3px 4px hsla(96, 100%, 50%, 1) inset, -3px -3px 4px hsla(96, 100%, 50%, 1) inset, 0 0 6px 2px hsla(96, 100%, 50%, 1);\
	z-index: 99999;\
}\
.SGPP_UserInfo_balloon .global__image-inner-wrap {opacity: 1;}\
.SGPP_UserInfo_balloon .SGPP_UserOnline .global__image-inner-wrap, .page_inner_wrap .search_trades {box-shadow: none;}\
.SGPP_UserInfo_balloon .global__image-outer-wrap {\
	box-sizing: content-box !important;\
	margin: 7px 10px 0 0 !important;\
	height: 48px !important;\
	width: 48px !important;\
}\
.SGPP_UserInfo_balloon .SGPP_UserOffline {filter: sepia(1);}\
.SGPP_UserInfo_balloon .global__image-outer-wrap--avatar-large[style*="border-color"].SGPP_UserOffline {background: none !important;}\
.SGPP_UserInfo_balloon .sidebar__shortcut-inner-wrap > :not(.is-disabled):active {\
	background-image: linear-gradient(hsla(0,0%,23%,1) 0%, hsla(0,0%,20%,1) 100%);\
	border-color: hsla(0,0%,0%,0.75) hsla(0, 0%, 51%, 0.5) hsla(0,0%,51%,0.5) hsla(0,0%,0%,0.75);\
	box-shadow: 2px 2px 2px hsla(0,0%,5%,0.5) inset, 7px 7px 7px hsla(0,0%,10%,0.5) inset, 1px 1px 0 hsla(0, 0%, 55%, 0.05);\
	color: hsla(0, 0%, 53%, 0.67);\
}\
.SGPP_UserInfo_balloon .sidebar__shortcut-inner-wrap > * {\
	background-image: linear-gradient(hsla(0, 0%, 65%, 0.8) 0%, hsla(0, 0%, 0%, 0.18) 100%);\
	border: 1px solid hsla(220, 1%, 55%, 1) !important;\
	color: hsla(0, 0%, 71%, 1);\
	padding: 1px 0 2px 0;\
	text-shadow: 1px 1px hsla(0, 0%, 0%, 1), 0 0 1px hsla(0, 0%, 0%, 1) !important;\
}\
.SGPP_UserInfo_balloon .featured__outer-wrap.featured__outer-wrap--user {\
	border-radius: 6px;\
	box-shadow: none;\
}\
.SGPP_UserInfo_balloon {\
	background-color: ' + config[34] + ' !important;\
	border: solid 1px ' + config[34] + ' !important;\
	border-radius: 8px;\
	box-shadow: ' + config[0][150] + ' 0 -1px 20px 0, ' + config[0][150] + ' 0 5px 15px inset, ' + config[0][150] + ' 1px 3px 3px, ' + config[0][150] + ' 1px 1px 0;\
	margin:2px 2px 0;\
}\
.SGPP_UserInfo_balloon:after {\
	border-color:transparent ' + config[34] + ' !important;\
	top:8px !important;\
	filter:drop-shadow(-1px 0 0 #000);\
}\
.SGPP_UserInfo_balloon.right:after {\
	filter:drop-shadow(1px 0 0 #000);\
}\
.SGPP_UserInfo_balloon .sidebar__shortcut-inner-wrap {margin-top: 3px;}\
.SGPP_UserInfo_balloon .featured__heading {height: 60px;}\
.SGPP_UserInfo_balloon .featured__table a + span {color: ' + config[0][174] + ' !important;}\
.SGPP__popup_giveaway {\
	background-color: ' + config[2] + ';\
	box-shadow: 0 0 10px 3px ' + config[0][150] + ';\
	border-radius: 4px;\
	min-width:900px;\
	text-align: inherit;\
}\
.SGPP__popup_giveaway .page__outer-wrap {\
	background: transparent;\
	border-top: none;\
	box-shadow: none;\
	padding: 10px 15px 8px 15px !important;\
}\
.SGPP__popup_giveaway .featured__outer-wrap form {\
	float:left;\
	height:34px;\
	margin:5px 5px 0 0;\
}\
.SGPP__popup_giveaway .featured__outer-wrap--giveaway {\
	border: 1px solid ' + config[0][24] + ';\
	border-radius: 4px;\
	box-shadow: 0 0 6px 2px ' + config[0][150] + ';\
	margin-top: 15px !important;\
	width: 96.8%;\
}\
.SGPP__popup_giveaway .global__image-outer-wrap--game-large:first-of-type {\
	height: 136px;\
	width: 292px;\
}\
.SGPP__popup_giveaway .sidebar__entry-loading, .SGPP__popup_giveaway .sidebar__error, .SGPP__popup_giveaway .sidebar__entry-insert, .SGPP__popup_giveaway .sidebar__entry-delete {width: 200px;}\
.SGPP__popup_giveaway .sidebar__error, #load_games {margin-top: 5px;}\
.SGPP__popup_giveaway .comment__parent {\
	max-width: 100%;\
	padding: 10px !important;\
}\
.SGPP__popup_giveaway .featured__heading__medium {\
	font: 600 18px "Open Sans",sans-serif;\
	letter-spacing: -0.04em;\
}\
.SGPP__popup_giveaway .featured__heading__small {\
	color: inherit;\
	font: 300 13px "Open Sans",sans-serif;\
	letter-spacing: -0.7px;\
}\
.SGPP__popup_giveaway .featured__heading > *:not(:first-child) {margin-left: 7px;}\
.SGPP__tagModal_background {background-color: hsla(0, 0%, 6%, 0.8) !important;}\
.endless_badge_new + .markcomments_controls > .markcomments_forget {\
	font-size: 12px;\
	margin-bottom: -3px;\
}\
.markcomments_forget {font-size: 12px;}\
.markcomments_controls.pull-right {\
	float: none;\
	margin-left: 1px;\
}\
.comment.comment--submit.message_filter_visible > .comment__parent > .comment__summary, .comment.comment--submit > .comment__parent > .comment__summary {\
	margin-top: 0 !important;\
	padding-top: 4px !important;\
}\
#sidebar_sgpp_filters {\
	margin-top: 28px;\
	padding: 0 !important;\
}\
#sidebar_sgpp_filters > h3 {\
	position: relative;\
	top: -29px;\
	font-size: 12px !important;\
}\
#sidebar_sgpp_filters .filter_row {\
	color: ' + config[7] + ';\
	cursor: pointer;\
	padding: 2px 0 2px 15px !important;\
	position: relative;\
	top: -13px;\
}\
.forms__rows .page__heading__breadcrumbs {\
	border-radius: 0;\
	width: 100%;\
	margin: 0 -20px;\
	border-left: none;\
	border-right: none;\
	border-bottom: 1px solid ' + config[0][24] + ';\
}\
.forms__rows .page__heading:first-of-type > .page__heading__breadcrumbs {\
	margin-top: -1px;\
	border-top-left-radius: 3px !important;\
	border-top-right-radius: 3px !important;\
}\
.comments__entity + .comments {\
	box-shadow: none;\
	border-radius: 0 0 4px 4px;\
	margin-top: -1px;\
}\
/* Ribbit Styles */\
header.fixed ~ .page__outer-wrap .sidebar:not(.sidebar--wide) + div > .page__heading + .pagination + .table__heading {\
	margin: 5px 0 -9px;\
	border: 1px solid hsla(60, 2%, 23%, 1) !important;\
}\
header.fixed ~ .page__outer-wrap .sidebar:not(.sidebar--wide) + div > div:nth-child(3):not(.page__heading):not(.table):not(.table__heading):not(.poll), header.fixed ~ .page__outer-wrap .sidebar--wide + div > div:nth-child(4):not(.esgst-fh):not(.pagination):not(.comment--submit) {\
	margin-bottom: auto !important;\
	height: calc(100% - 68px);\
	padding: 15px 10px 0 20px !important;\
}\
header.fixed ~ .page__outer-wrap .sidebar--wide + div > div:nth-child(4):not(.pagination):not(.comment--submit) {height: calc(100% - 443px) !important;}\
header.fixed ~ .page__outer-wrap .sidebar:not(.sidebar--wide) + div > div[style*="clear"]:nth-child(3) .giveaway__row-outer-wrap, header.fixed ~ .page__outer-wrap .sidebar--wide + div > div[style*="clear"]:nth-child(4):not(.esgst-fh) .giveaway__row-outer-wrap {\
	max-width: 13.4%;\
	margin-right: .2%;\
	margin-left: .5%;\
}\
header.fixed ~ .page__outer-wrap .sidebar--wide + div .pinned-giveaways__outer-wrap[style*="clear"] .giveaway__row-outer-wrap {\
	max-width: 13.4%;\
	margin-right: 3%;\
	margin-left: 3.5%;\
}\
.align-button-container-top .form__add-answer-button {margin-right: 2px;}\
.user__whitened .fa, .user__blackened .fa {\
	margin: 0 !important;\
	font: normal normal normal 13px/1.3 FontAwesome;\
}\
a.user__whitened, a.user__blackened, .comment__username:not(.comment__username--op) a.user__whitened, .comment__username:not(.comment__username--op) a.user__blackened {\
	border-bottom: none;\
	box-shadow: 0 0 0 1px black !important;\
	padding: 2px 5px !important;\
	line-height: 18px !important;\
	text-shadow: 1px 1px hsla(0, 0%, 0%, 0.99), 0 0 1px hsla(0, 0%, 0%, 0.99), 0 0 1px hsla(0, 0%, 0%, 0.99) !important;\
}\
.giveaway__column--width-fill.text-right .user__whitened, .giveaway__column--width-fill.text-right .user__blackened {\
	padding: 2px 5px 0 !important;\
	line-height: 14px !important;\
}\
#sub_debugging + .form__submit-button {margin-bottom: 20px;}\
.sidebar__entry-loading + form[style*="background-image"] {background-image: none !important;}\
.giveaway__columns--badges .giveaway__column--new, .giveaway__columns--badges .giveaway__column--wish {filter: saturate(2) opacity(0.8);}\
.nav__buton--is-dropdown[href*="ribbit"] {border-radius: 4px 0 0 4px;}\
@media screen and (min-width: 1480px) {\
	.pinned-giveaways__inner-wrap--minimized.esgst-gv-view .giveaway__row-outer-wrap:nth-child(-n+12) {\
		display: inline-block;\
	}\
}\
@media screen and (min-width: 1690px) {\
	.pinned-giveaways__inner-wrap--minimized.esgst-gv-view .giveaway__row-outer-wrap:nth-child(-n+14) {\
		display: inline-block;\
	}\
}\
@media screen and (min-width: 1890px) {\
	.pinned-giveaways__inner-wrap--minimized.esgst-gv-view .giveaway__row-outer-wrap:nth-child(-n+16) {\
		display: inline-block;\
	}\
}\
@media screen and (min-width: 2090px) {\
	.pinned-giveaways__inner-wrap--minimized.esgst-gv-view .giveaway__row-outer-wrap:nth-child(-n+18) {\
		display: inline-block;\
	}\
}\
@media screen and (max-width: 1280px){\
	nav {\
		padding: 0 20px;\
	}\
	.nav__button {\
		padding: 0 9px;\
		white-space: nowrap;\
	}\
	.featured__outer-wrap .global__image-outer-wrap--game-xlarge, .featured__outer-wrap .global__image-outer-wrap--game-large, .featured__outer-wrap .global__image-outer-wrap--avatar-large {\
		margin-right: 15px;\
		max-width: 400px;\
	}\
	.featured__outer-wrap .global__image-outer-wrap--game-xlarge img {\
		max-width: 400px;\
		min-height: 187px;\
		min-width: 400px;\
	}\
	.giveaway__icon, .giveaway__icon .fa, .giveaway__columns:not(.esgst-gv-icons) .fa, .giveaway__heading .fa, .fa-comment, .fa-tag {\
		font-size: 12px !important;\
	}\
	.giveaway__columns .fa-clock-o {\
		margin-bottom: 1px;\
	}\
	.giveaway__heading__thin {\
		font-size: 100%;\
		white-space: nowrap;\
	}\
	.giveaway__heading__name:not(.tile_view_header) {\
		font-size: 15px;\
		margin-bottom: 2px;\
	}\
	.giveaway__chance {\
		font-size: 10px;\
	}\
	.giveaway__columns:not(.esgst-gv-icons) > * {\
		line-height: 22px;\
		padding: 0 4px;\
		white-space: nowrap;\
		overflow: hidden;\
	}\
	.giveaway__summary + .global__image-outer-wrap--avatar-small {\
		padding: 3px;\
		margin-right: 5px;\
	}\
	.global__image-outer-wrap--game-medium {\
		padding: 4px;\
	}\
	.giveaway__heading__name font[color] {\
		font-size: 10px;\
	}\
	.featured__action-button .fa {\
		margin-bottom: 2px;\
	}\
	.mt-more-like-this.sidebar__entry-loading {\
		line-height: 22px !important;\
		height: inherit !important;\
		padding: 0 2px !important;\
	}\
	.mt-more-like-this.sidebar__entry-loading i {\
		font-size: 11px;\
	}\
	.tab-links a {\
		font-size: 13px !important;\
	}\
}\
@media screen and (max-width: 1130px) {\
	.tab-links a {\
		font-size: 11px !important;\
	}\
}\
@media screen and (max-width: 1024px) {\
	nav {\
		padding: 0 15px;\
	}\
	.nav__button {\
		padding: 0 8px;\
		white-space: nowrap;\
	}\
	.nav__right-container {\
		margin-left: 5px;\
	}\
	.featured__outer-wrap {\
		padding: 15px 0;\
	}\
	.featured__inner-wrap {\
		padding: 0 15px;\
	}\
	.featured__outer-wrap .global__image-outer-wrap--game-xlarge img {\
		max-width: 275px;\
		min-height: 128px;\
		min-width: 275px;\
	}\
	.giveaway__heading__name:not(.tile_view_header) {\
		font-size: 12px;\
	}\
	.giveaway__row-outer-wrap {\
		padding: 6px 0;\
	}\
	.table__column__heading {\
		font-size: 12px;\
	}\
	.table__row-outer-wrap {\
		font-size: 10px;\
	}\
	.SGv2_Dark__Import_Settings .comment__submit-button {\
		padding: 0 8px;\
	}\
	.SGv2_Dark__Option {\
		width: 240px;\
	}\
	.SGv2_Dark__Option .form__heading__text, .SGv2_Dark__Settings_Content .form__heading__text {\
		font: 700 12px "Open Sans",sans-serif;\
	}\
	.SGv2_Dark__OptionsContainer {\
		-webkit-column-gap: 20px;\
		-moz-column-gap: 20px;\
		column-gap: 20px;\
		margin: 15px 8px 15px 15px;\
	}\
	.SGv2_Dark__colorModal {\
		margin-left: -450px;\
		width: 900px;\
	}\
	.giveaway__heading .mt-more-like-this {\
		display: block !important;\
	}\
	.giveaway__columns .mt-more-like-this {\
		display: none !important;\
	}\
}\
.global__image-outer-wrap--game-large img {\
	min-width: 292px;\
	min-height: 136px;\
}\
#content .global__image-outer-wrap--game-large img {\
	min-width: 150px;\
	min-height: 70px;\
}\
.global__image-outer-wrap--game-xlarge img {\
	min-width: 460px;\
	min-height: 215px;\
}\
div[style*="margin-top: 25px"], div[style*="padding-top: 35px"] {\
	margin: 0 0 8px !important;\
	height: auto !important;\
	display: block !important;\
	background: none !important;\
	border: none !important;\
}\
div[style*="padding-top: 35px"] {\
    box-shadow: none !important;\
	margin: 15px 0 8px !important;\
	padding: 0 !important;\
}\
.page_inner_wrap > div[style*="padding-bottom: 25px"] {padding: 0 !important;}\
.comment__role-name {color: #c3793f;}\
@supports (not (-ms-ime-align: auto)) {\
	.nav__button-container.nav__button-container--notification.nav__button-container--active {\
		z-index: 1;\
	}\
	.nav_btn:hover:not(.is_selected) .message_count, .nav__button:hover .nav__notification {\
		filter: brightness(1) saturate(0.55) !important;\
	}\
}\
.touhou_info_container_fixed .__mh_bookmark_button, .touhou_info_container .__mh_bookmark_button {display: none;}\
.page__heading ~ div:not(.comments:not(.esgst-fmph-background)), .page_heading ~ div:not(.comments):not(.esgst-fmph-background), .pinned-giveaways__outer-wrap {will-change: transform;}\
.page__heading ~ div:hover:not(.sg2o-gridview-container), .page_heading ~ div:hover, .pinned-giveaways__outer-wrap:hover {will-change: unset}';

	if (window.location.host == 'www.steamtrades.com') {
	css = steamtradesCss(css);
	};
	if (window.location.pathname.match(/^\/sgpp/)) {
	css = sgppCss(css, config);
	}
	return css;
}

function steamtradesCss (css) {
var tradesCss = '' + css + '\
.esgst-header-menu-button {\
	border: none !important;\
	height: 27px;\
}\
.esgst-header-menu {margin: 0 !important;}\
.esgst-header-menu-row:not(:first-child) {border-top: none !important;}\
.btn_action + .esgst-sgpb-button:active {margin: 0 0 0 5px !important;}\
.esgst-popup .form__saving-button, .esgst-popout .form__saving-button {display: inline-block;}\
.esgst-popup select, .esgst-popup input, .esgst-popout select, .esgst-popout input {\
	border-radius: 4px;\
	border-width: 1px;\
	border-style: solid;\
	line-height: 1.5em;\
}\
.esgst-sync-frequency, .esgst-steam-api-key {padding: 5px 10px;}\
.esgst-sync {\
	font: 700 13px/32px "Open Sans", sans-serif;\
	padding: 0 15px;\
	text-align: center;\
	border-radius: 4px;\
}';
	return tradesCss;
}

function sgppCss (css, config) {
var missingCss = '' + css + '\
body {\
    margin: 0;\
    min-width: 1000px;\
}\
header {\
    margin: 0;\
    padding: 5px 0px;\
}\
.nav__left-container {\
    align-items: center;\
    height: 29px;\
}\
.nav__logo-outer-wrap {\
    background-image: linear-gradient(#dce9ff 0%, #4d8cff 100%);\
    background-image: -moz-linear-gradient(#dce9ff 0%, #4d8cff 100%);\
    border-radius: 2px !important;\
    box-shadow: 1px 1px 0 hsla(0, 0%, 100%, 0.2) inset, 0 0 10px hsla(219, 100%, 65%, 0.4);\
    display: block;\
    height: 11px;\
    margin: 0 5px;\
    padding: 2px;\
    width: 11px;\
}\
.nav__logo-inner-wrap {\
    background-color: hsla(212, 27%, 22%, 1);\
    border-radius: 1px;\
    box-shadow: 0 0 5px hsla(219, 100%, 65%, 0.4) inset, 0 1px 0 hsla(0, 0%, 100%, 0.4);\
    height: 100%;\
    width: 100%;\
}\
.page__outer-wrap {padding: 25px;}\
.page__inner-wrap {margin: 0 auto;}\
.widget-container, .nav__left-container {display: flex;}\
.widget-container > div:not(.sidebar), .nav__left-container {flex: 1;}\
.sidebar__heading {\
    margin-bottom: 3px;\
    font: bold 11px/15px Arial, sans-serif;\
}\
.forms__rows {padding-right: 0 !important;}\
.forms__rows .page__heading > * {\
    border-top: 1px solid;\
    border-color: ' + config[0][61] + ';\
    font: 700 14px/22px "Open Sans", sans-serif;\
    padding: 5px 10px;\
}\
.forms__rows .form__row {margin-bottom: 10px;}\
.forms__rows .form__heading__text {\
    font: 700 14px "Open Sans", sans-serif;\
    margin-bottom: 5px;\
}\
.forms__rows label {cursor: pointer;}\
.forms__rows .form__row__indent {\
    margin-left: 5px;\
    padding: 3px 0 3px 20px;\
}\
.forms__rows .form__input-description {\
    font: italic 11px Arial, sans-serif;\
    margin-top: 10px;}';
	return missingCss;
}

function getbuttonStyle () {
	var settings = getSettings();
	if (settings === null) {
		var config = defaultconfig();
		localStorage.setItem('SGv2 Dark Colors', JSON.stringify(config));
	} else {
		config = settings;
}

var buttonStyle = '\
/* SGv2 Dark (button) Stylesheet */\
.SGv2-Dark-button {\
	cursor: pointer;\
	font: 12px Arial,sans-serif;\
	position: fixed;\
	width: 100px;\
	height: 30px;\
	top: 3px;\
	right: -92px;\
	z-index: 999999999;\
	display: flex;\
	background-image: linear-gradient(' + config[0][21] + ' 0%, ' + config[0][20] + ' 100%);\
	box-shadow: 0 0 8px 2px ' + config[0][150] + ', 0 -1px 0 ' + config[0][141] + ' inset, 0 -10px 10px -3px ' + config[0][142] + ' inset;\
	border: 1px solid ' + config[0][141] + ';\
	border-right:none;\
	border-radius:8px 0 0 8px;\
	color: ' + config[43] + ';\
	text-shadow: 1px 1px ' + config[0][12] + ';\
}\
.SGv2-Dark-button * {\
	padding: 7px 8px\
}\
.themetoggle {\
	margin-left: 2px;\
}\
.light {\
	color: white!important;\
	background-image: linear-gradient(hsla(219, 11%, 59%, 1) 0, hsla(219, 10%, 51%, 1) 8px, hsla(222, 12%, 42%, 1) 100%) !important;\
	border: 1px solid hsla(0, 0%, 21%, 1) !important;\
	border-right: none!important;\
	box-shadow: 0 0 8px 2px hsla(220, 13%, 28%, 1), 0 -1px 0 hsla(219, 15%, 22%, 1) inset, 0 -10px 10px -3px hsla(0, 0%, 22%, 0.2) inset;\
	text-shadow: 1px 1px hsla(0, 0%, 0%, 0.8);}';
	return buttonStyle;
}

var theme = getTheme();

if (theme == 'Light') {
	switchToLight();
} else {
	setTheme('Dark');
	switchToDark();
}

if (window.top == window) {
	addButtonCss();
	$('<div class="SGv2-Dark-button"><span class="themetoggle">' + theme + '</span><div class="SGv2_edit">Settings</div>').appendTo('html');
	if (theme == 'Light') {
		$('.SGv2-Dark-button').toggleClass('light');
		$('div .SGv2_edit').toggle('slow');
	}
	$('div.SGv2-Dark-button').hover(function () {
		$(this).stop(true, false).animate({ right: 0 }, 400);
	}, function () {
		$(this).stop(true, false).animate({ right: -92 }, 800);
	}).on('click', '.themetoggle', function () {
		if (theme == 'Dark') {
			switchToLight();
		} else {
			switchToDark();
		}
		this.innerHTML = '' + theme + '';
		$('.SGv2-Dark-button').toggleClass('light');
		$('div .SGv2_edit').toggle('slow');
	});
}

function switchToDark() {
	addCss('Theme SGv2 Dark');
	setTheme('Dark');
	if (!document.querySelector(".SGv2_Dark__Overlay") && !!document.querySelector('body')) {
		document.querySelector('body').insertAdjacentHTML('afterbegin', '<div class="SGv2_Dark__Overlay"></div>');
	}
	if ($('body').tooltip('instance') === undefined) {
		tooltip();
	}
	if (!document.querySelector(".SGv2_Dark__colorModal") && document.readyState === "complete") {
		setTimeout(function () {
			new CustomColors().render();
		}, 1000);
	}
}

function addCss(themeName, arg, id) {
	var css = getCss(arg);
	var idName = id || 'SGv2 Dark';
	var node = document.createElement('style');
	node.setAttribute('type', 'text/css');
	node.setAttribute('name', themeName);
	node.setAttribute('id', idName);
	node.textContent = css;
	document.documentElement.appendChild(node);
}

function addButtonCss() {
	var css = getbuttonStyle();
	var node = document.createElement('style');
	node.setAttribute('type', 'text/css');
	node.setAttribute('name', 'SGv2 Dark Button');
	node.textContent = css;
	document.documentElement.appendChild(node);
}

document.onreadystatechange = function () {
    makeSureRan();
}

var makeSureRan = (function () {
	var called = false;
	return function runOnce() {
		if (!called) {
			if (theme == 'Dark' && window.location.host == 'www.steamgifts.com') {
				if (config[40] == '1') {
					var generatedColor = true;
				} else {
					generatedColor = false;
				}
				if (window.location.pathname == '/') {
					this.page = ['', 'giveaways'];
				} else {
					this.page = window.location.pathname.split('/');
				}
				if (this.page[1] == 'discussion') {
					$( ".comments" ).first().addClass( "SGv2_Dark-OP" );
				}
				if (this.page[1] == 'giveaways' || this.page[1] == 'giveaway' || this.page[1] == 'user') {
					if ($('.featured__column i').length || ($('.featured__table a').length)) {
						if ($('.featured__table a').length) {
							var originalColor = $('.featured__table a').css('color').match(/\d+/g);
						} else {
							originalColor = $('.featured__column i').css('color').match(/\d+/g);
						}
						var modifiedColor = ModifyColor(originalColor);
						$('.featured__column .fa-clock-o, .featured__column a[href*="user"], .featured__column .fa-tag, .featured__table a').css('color', modifiedColor);
						if (generatedColor) {
							$('.featured__table__row__right .fa-circle, .featured__table__row__right .fa-circle-o, .featured__heading__small, .featured__heading__medium').css('color', modifiedColor);
							$('.featured__heading__small').css('opacity', '0.8');
						}
					}
				}
				setTimeout(function () {
					if ($('.SGPP_UserInfo_balloon').length) {
						var BalloonObserver = new MutationObserver(function () {
							try {
							var originalballoonColor = $('.SGPP_UserInfo_balloon .featured__table a').css('color').match(/\d+/g);
							var modifiedballoonColor = ModifyColor(originalballoonColor);
							$('.featured__table a').css('color', modifiedballoonColor);
							if (generatedColor) {
								$('.SGPP_UserInfo_balloon .fa-circle, .SGPP_UserInfo_balloon .fa-circle-o, .SGPP_UserInfo_balloon .featured__heading').css('color', modifiedballoonColor);
							}
							}
							catch(e) {
							}
						});
						BalloonObserver.observe($('#SGPP_UserInfo_balloon')[0], {
							childList: true
						});
					}
					if ($('.SGPP__popup_giveaway').length) {
						var PopupObserver = new MutationObserver(function () {
							try {
							var originalpopupColor = $('.SGPP__popup_giveaway .featured__column i').css('color').match(/\d+/g);
							var modifiedpopupColor = ModifyColor(originalpopupColor);
							$('.SGPP__popup_giveaway .featured__column .fa-clock-o, .SGPP__popup_giveaway .featured__column a[href*="user"]').css('color', modifiedpopupColor);
							if (generatedColor) {
								$('.SGPP__popup_giveaway .featured__heading__medium, .SGPP__popup_giveaway .featured__heading__small').css('color', modifiedpopupColor);
								$('.featured__heading__small').css('opacity', '0.8');
							}
							}
							catch(e) {
							}
						});
						PopupObserver.observe($('.SGPP__popup_giveaway')[0], {
							childList: true
						});
					}
				}, 1000);
			}
		if (theme == 'Dark') {
		$('body').on('change', '.SGv2__Dark-loadfile', function() {
			var file = this.files[0];
			var reader = new FileReader();
			reader.onload = function () {
				var line = this.result.split('\r\n');
				localStorage.setItem('SGv2 Dark Colors', JSON.stringify(new CustomColors().calcSettings(configArray(line[1].slice(19)))));
				if (line[2].slice(11) !== '') {
					localStorage.setItem('SGv2 Preset1', JSON.stringify(configArray(line[2].slice(11))));
				}
				if (line[3].slice(11) !== '') {
					localStorage.setItem('SGv2 Preset2', JSON.stringify(configArray(line[3].slice(11))));
				}
				if (line[4].slice(11) !== '') {
					localStorage.setItem('SGv2 Preset3', JSON.stringify(configArray(line[4].slice(11))));
				}
				confirmMessage('Settings Imported');
				applyStyles('import');
			};
			reader.readAsText(file, "UTF-8");
		});
		$('body').on('click', '#SGv2_Dark__tab-1', function () {
			$('#SGv2_Dark__OptionsContainer-2').hide(); $('#SGv2_Dark__tab-2').removeClass("SGv2_Dark__tab-active"); $('#SGv2_Dark__OptionsContainer-3').hide(); $('#SGv2_Dark__tab-3').removeClass("SGv2_Dark__tab-active");
			$('#SGv2_Dark__OptionsContainer-1').show(); $(this).addClass("SGv2_Dark__tab-active");
		}).on('click', '#SGv2_Dark__tab-2', function () {
			$('#SGv2_Dark__OptionsContainer-1').hide(); $('#SGv2_Dark__tab-1').removeClass("SGv2_Dark__tab-active"); $('#SGv2_Dark__OptionsContainer-3').hide(); $('#SGv2_Dark__tab-3').removeClass("SGv2_Dark__tab-active");
			$('#SGv2_Dark__OptionsContainer-2').show(); $(this).addClass("SGv2_Dark__tab-active");
		}).on('click', '#SGv2_Dark__tab-3', function () {
			$('#SGv2_Dark__OptionsContainer-1').hide(); $('#SGv2_Dark__tab-1').removeClass("SGv2_Dark__tab-active"); $('#SGv2_Dark__OptionsContainer-2').hide(); $('#SGv2_Dark__tab-2').removeClass("SGv2_Dark__tab-active");
			$('#SGv2_Dark__OptionsContainer-3').show(); $(this).addClass("SGv2_Dark__tab-active");
		});
		$('body').on('click', '.comment__submit-button.SGv2_Dark', function () {
			saveFile($('#current_settings').val(),$('#Preset1').val(),$('#Preset2').val(),$('#Preset3').val(),$('style[id="SGv2 Dark"]').text());
		});
		$('body').on('change', 'input[name=Preset]', function() {
			var attr = (('SGv2 ') + (this.getAttributeNode("id").value));
			var water = '0.8,#0d1617,#a4a4a4,#56b9c0,#10181b,#122729,#86c7d7,#a0a0a0,#808d9d,#8ab1b9,#213c3f,#142729,#22444b,#232c36,#285e64,#1c353c,#1e252b,#47721d,#882828,#d5d54e,#808080,#46a640,#3197a0,#000000,1,0.7,#0b2326,#248082,1,0.3,0,1,https://i.imgur.com/N493Dkg.jpg,#000000,0.8,#80bf40,#d84141,#06464f,#80A659,1,#5F3F3F,#466062,#C7C7C7,#4D4D4D,#53BFF9,#101F23,1,#1f1f1f,#a6a6a6,0,1.25,1.2,1.25,#151f23,#b7b776,#d84141,#000000,#8cd7d9,#10181b,#10181b,#8ab1b9,#adadad,#adadad,#adadad,#a4a4a4,#8ab1b9,1.25,#a0a0a0';
			var halloween = '0.8,#0b0b0b,#d17518,#a8a82d,#000000,#4a2900,#baba30,#ea8015,#858585,#d17518,#572700,#4d2a00,#151515,#853000,#9b4200,#0b0b0b,#824700,#384927,#742727,#aba33f,#555555,#4a9546,#377e84,#000000,1,0.85,#000000,#a84700,1,0.4,0,1.4,https://i.imgur.com/AXeH343.jpg,#000000,1,#75a644,#d84141,#994d00,#80a659,1,#5f3f3f,#466062,#f1a65b,#4d4d4d,#53bff9,#0d0d0d,1,#1f1f1f,#a6a6a6,0,1.25,1.2,1.05,#080808,#a4962d,#d84141,#121212,#f79533,#000000,#000000,#d17518,#ed8c2c,#ed8c2c,#ed8c2c,#d17518,#d17518,1.25,#ea8015';
			if (this.value !== '') {
				if (this.value === 'water') {
					localStorage.setItem(attr, JSON.stringify(configArray(water)));
					confirmMessage('Water Theme Saved');
				} else if (this.value === 'halloween') {
					localStorage.setItem(attr, JSON.stringify(configArray(halloween)));
					confirmMessage('Halloween Theme Saved');
				} else {
					localStorage.setItem(attr, JSON.stringify(configArray(this.value)));
					confirmMessage('Theme #' + attr.match(/\d+$/g) + ' Saved');
				}
			} else {
				localStorage.removeItem(attr);
				confirmMessage('Theme #' + attr.match(/\d+$/g) + ' Cleared');
			}
		});
		$('body').on('change', 'input:radio[name=radioPreset]', function() {
			switchToPreset(this.value, this.value);
		});
		$('body').on('change', '#import_settings', function() {
			if (this.value !== '') {
				localStorage.setItem('SGv2 Dark Colors', JSON.stringify(new CustomColors().calcSettings(configArray(this.value))));
				confirmMessage('Settings Imported');
				applyStyles('import');
			}
		});
			if ($('body').tooltip('instance') === undefined) {
				tooltip();
			}
			if (!document.querySelector(".SGv2_Dark__Overlay")) {
				document.querySelector('body').insertAdjacentHTML('afterbegin', '<div class="SGv2_Dark__Overlay"></div>');
			}
			new CustomColors().render();
		}
		var key = [];
		$(window).on("keyup", function (e) {
			key[e.which] = false;
		});
		$(window).on("keydown", function (e) {
			key[e.which] = true;
			if (key[16] && key[18] && key[49]) {
				switchToPreset('Preset1', 'Theme 1');
			}
			if (key[16] && key[18] && key[50]) {
				switchToPreset('Preset2', 'Theme 2');
			}
			if (key[16] && key[18] && key[51]) {
				switchToPreset('Preset3', 'Theme 3');
			}
			if (key[16] && key[18] && key[67]) {
				$('.themetoggle').trigger('click');
			}
			if (key[16] && key[18] && key[88] && theme == 'Dark') {
				$('.SGv2_edit').trigger('click');
			}
		});
			called = true;
		}
	};
})();

function switchToPreset (preset, name) {
	if (theme != 'Dark') {
		$('.themetoggle').trigger('click');
		setTheme('Dark');
	}
	if ($('#SGv2_Dark__OptionsContainer-1').is(':visible')) {
		var tab = '#SGv2_Dark__tab-1';
	} else if ($('#SGv2_Dark__OptionsContainer-2').is(':visible')) {
		tab = '#SGv2_Dark__tab-2';
	} else {
		tab = '#SGv2_Dark__tab-3';
	};
	var getConfig = JSON.parse(localStorage.getItem((('SGv2 ') + (preset))));
	if (getConfig !== null) {
		localStorage.setItem('SGv2 Dark Colors', JSON.stringify(new CustomColors().calcSettings(getConfig)));
		$('style[name^="Theme"], style[name*="Button"]').remove();
		addCss('Theme ' + name);
		addButtonCss();
		if ($(".SGv2_Dark__colorModal_background").is(':visible')){
			var possition = $(".SGv2_Dark__colorModal").position();
			$('.SGv2_Dark__colorModal, .SGv2_Dark__colorModal_background').remove();
			new CustomColors().render();
			$(".SGv2_Dark__colorModal").css({top: possition.top, left: possition.left});
			$('.SGv2_edit').trigger('click');
			$(tab).trigger('click');
		} else {
			$('.SGv2_Dark__colorModal, .SGv2_Dark__colorModal_background').remove();
			new CustomColors().render();
		}

    }
}

function switchToLight() {
	if ($('body').tooltip('instance') !== undefined) {
		$('body').tooltip('destroy');
	}
	$('.SGv2_Dark__colorModal, .SGv2_Dark__colorModal_background').hide();
	$('style[name^="Theme"]').remove();
	setTheme('Light');
}

function getTheme() {
	return localStorage.getItem('SGv2 Dark/Light');
}

function setTheme(val) {
	localStorage.setItem('SGv2 Dark/Light', theme = val);
}

function configArray(config) {
	var cfgArray = config.split(',');
	cfgArray.unshift('');
	return cfgArray;
}

function tooltip () {
	$('body').tooltip({
		tooltipClass: 'SGv2_tooltip',
		track: true,
		position: { my: 'left+15 top+15', at: 'center center' }
	});
	$('.ui-helper-hidden-accessible').remove();
	$(document).click(function() {
		$('div[class*="SGv2_tooltip"]').remove();
	});
}

function applyStyles(name) {
	if ($('#SGv2_Dark__OptionsContainer-1').is(':visible')) {
		var tab = '#SGv2_Dark__tab-1';
	} else if ($('#SGv2_Dark__OptionsContainer-2').is(':visible')) {
		tab = '#SGv2_Dark__tab-2';
	} else {
		tab = '#SGv2_Dark__tab-3';
	};
	var possition = $(".SGv2_Dark__colorModal").position();
	$('.SGv2_Dark__colorModal, .SGv2_Dark__colorModal_background').remove();
	$('style[name^="Theme"], style[name*="Button"]').remove();
	addCss('Theme ' + name);
	addButtonCss();
	new CustomColors().render();
	$(".SGv2_Dark__colorModal").css({top: possition.top, left: possition.left});
	$('.SGv2_edit').trigger('click');
	$(tab).trigger('click');
}

var settings = getSettings();
if (settings !== null) {
	var config = settings;
	var cfg = (defaultconfig());
	var removeCustom = config.indexOf('Custom');
	var removeDefault = config.indexOf('Default');
	if (removeDefault !== -1) {
		config.splice(removeDefault, 1);
	}
	if (removeCustom !== -1) {
		config.splice(removeCustom, 1);
	}

	if (config[config.length - 1] != cfg[cfg.length - 1]) {
		var defaultCfg = cfg.slice(1, (cfg.length - 1));
		var currentCfg = config.slice(1, (config.length - 1));
		var slicedCfg = defaultCfg.slice((currentCfg.length - (defaultCfg.length)), defaultCfg.length);
		var joinedCfg = currentCfg.concat(slicedCfg);
		if (currentCfg[37] === undefined) {
			joinedCfg[37] = currentCfg[15];
		}
		joinedCfg.unshift('');
		localStorage.setItem('SGv2 Dark Colors', JSON.stringify(new CustomColors().calcSettings(joinedCfg)));
		$('style[name*="SGv2 Dark"]').remove();
		addCss('Theme update');
		addButtonCss();
	}
}

function confirmMessage(message) {
	$('<div>', { 'id': 'dialog-message' }).dialog({
		resizable: false,
		draggable: false,
		dialogClass: "SGv2_Dark__Dialog"
	});
	$('<div>', { 'class': 'SGv2_Dark__Message', text: message }).appendTo('#dialog-message');
	$('.ui-dialog-titlebar').detach();
	setTimeout(function () {
		$('#dialog-message').dialog("close");
		setTimeout(function () {
			$('#dialog-message').dialog("destroy");
		}, 1000);
	}, 2000);
}

function saveFile(txt1 , txt2, txt3, txt4, txt5) {
	var file = new Blob(['/*---------------------------------------------- SGv2 Dark Settings v' + GM_info.script.version + '------------------------------------------'+'\r\n' + 'Current Settings:  ' + txt1 +'\r\n' + 'Theme #1:  ' + txt2 +'\r\n' + 'Theme #2:  ' + txt3 +'\r\n' + 'Theme #3:  ' + txt4 +'\r\n' + '---------------------------------------------- SGv2 Stylesheet v' + GM_info.script.version + '---------------------------------------------*/' +'\r\n' + txt5], {
		type: 'text/plain'
	});
	var downloadLink = document.createElement("a");
	var site = (window.location.host);
	downloadLink.download = ('' + site + ' SGv2 Dark v' + GM_info.script.version + '.txt');
	downloadLink.innerHTML = "Download File";
	if (window.URL != null) {
		downloadLink.href = window.URL.createObjectURL(file);
		downloadLink.onclick = destroyClickedElement;
		downloadLink.style.display = "none";
		document.body.appendChild(downloadLink);
	}
	downloadLink.click();
}

function destroyClickedElement(event) {
	document.body.removeChild(event.target);
}

function showConfigValues () {
		$('.SGv2_Dark__colorModal').draggable({ opacity: 0.8, handle: ".SGv2_Presets" })
		Object.keys(localStorage).forEach(function (key) {
			if (/^SGv2 Preset/.test(key)) {
				var presetConfig = JSON.parse(localStorage.getItem(key));
				var sliceConfig = (('#') + (key.slice(5)));
				presetConfig.splice(0, 1);
				$(sliceConfig).val(presetConfig);
			}
		});
}