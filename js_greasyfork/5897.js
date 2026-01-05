// ==UserScript==
// @name           USO to Webextender
// @name:es        USO a Webextender
// @description    Redirect Userscripts.org to Webextender.net
// @description:es Redireccionar Userscripts.org a Webextender.net
// @namespace      https://greasyfork.org/users/4051
// @author         KaZaC
// @include        *
// @version        1.0
// @icon           http://i.imgur.com/8qJTYUy.png
// @license        http://creativecommons.org/licenses/by-nc-sa/3.0/
// @run-at         document-start
// @grant          GM_none
// @downloadURL https://update.greasyfork.org/scripts/5897/USO%20to%20Webextender.user.js
// @updateURL https://update.greasyfork.org/scripts/5897/USO%20to%20Webextender.meta.js
// ==/UserScript==

(function () { "use strict";
var W =  window;
function _log(s){
 //console.log(s);
}
function toObj(s) {
 var r = {}, c = s.split('&'), t;
 for(var i = 0; i < c.length; i++) {
 t = c[i].split('=');
 r[decodeURIComponent(t[0])] = decodeURIComponent(t[1]);
 }
 return r;
}
function anchorMatch(a) {
  for(var k=0; a && k< 5; k++,a=a.parentNode) if(a.localName == 'a') return a;
  return null;
}
var re= /^(http)s?\:\/\/(.*?)\buserscripts\.org(\:8080)?\/(.*)/;
function onDown(e) {
  var h,m, a = anchorMatch(e.target);
  if(a && a.localName == "a"){
    h=a.getAttribute("href");
    if(location.host.indexOf("google")>-1){
      m=a.getAttribute("onmousedown");
      if(m && m.indexOf("return") === 0) { //
        a.removeAttribute("onmousedown");
      }
      if(h) {
         if(h.indexOf("http://") === 0) h = h.substr(h.indexOf("/", 7));
         else if(h.indexOf("https://") === 0) h = h.substr(h.indexOf("/", 8));
         if(h.indexOf("/url?") === 0) {
           _log('spoil '+h);
           h = toObj(h.substr(5));
           a.setAttribute('href', decodeURIComponent(h.url || h.q));
         }
      }   
    }
  
    h=a.getAttribute("href");
    if(!( h && (h=h.match(re)) && h.length==5 )) return;
       h = h[1]+"://www.webextender.net/"+h[4];
       a.setAttribute('href', h);
      _log('USOmirror: '+a.href);
  }
}
 W.addEventListener("mousedown", onDown, true);
 _log('uso-mirror');
})();