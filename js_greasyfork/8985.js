// ==UserScript==
// @name        Project free tv skip ads and simplify.
// @description Baypass 10sec wait ad and simplify episode list
// @namespace   https://greasyfork.org/users/2366-graenfur
// @author      Graenfur
// @include     *www.free-tv-video-online.info/*
// @exclude     *www.free-tv-video-online.info/season-side*
// @exclude     *www.free-tv-video-online.info/episode-buttom*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/8985/Project%20free%20tv%20skip%20ads%20and%20simplify.user.js
// @updateURL https://update.greasyfork.org/scripts/8985/Project%20free%20tv%20skip%20ads%20and%20simplify.meta.js
// ==/UserScript==

function addStyle(){
  var css=document.createElement("style");
  css.type="text/css";
  //css.innerHTML="table tbody tr td.mnllinklist a + *{display:none !important;}"
  
  document.head.appendChild(css);
}

function gup(name, url) {
  if (!url) url = location.href;
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( url );
  return results === null ? "" : results[1];
}

function makeGoodLink(url){
  return gup('lnk',decodeURIComponent(url)).replace(/.*\/\//g,'');
}

function init(){
  addStyle();
  var rows = document.querySelectorAll("table tbody tr td[id].mnllinklist"),
      rowsLen = rows.length,
      row,
      link,
      url,
      host,
      i;
  for(i=0;i<rowsLen;i++){
    link = rows[i].children[0];
    console.log(link);
    link.setAttribute("href", makeGoodLink(link.getAttribute('href')));
    link.removeAttribute("onclick");
    host=link.innerHTML.split("<br>")[1].trim().substring(6);
    link.children[1].innerHTML=host;
    rows[i].innerHTML="";
    rows[i].appendChild(link);
  }
}

init();