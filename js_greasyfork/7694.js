// ==UserScript==
// @name        example
// @description test
// @namespace   http://mfish.twbbs.org/
// @include     http://jsbin.com/*
// @version     1.1
// @grant       GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/7694/example.user.js
// @updateURL https://update.greasyfork.org/scripts/7694/example.meta.js
// ==/UserScript==

var search = location.search
var enabled = false;
var params

function isEnabled () {
  if (search.slice(0,1) != "?") {return false;}
  var temp = search.slice(1);
  temp = temp.split("&")
  
  return temp.indexOf("pluginEnabled") >= 0
}

function rewriteLink () {
  var links = document.querySelectorAll('a');
  var newlink, temp;
  for (var i = 0; i < links.length; i++) {
    var link = links[i];
    //alert(link.href);
    temp = /(https?:\/\/[^\?#]+)(\?[^#]*)?(#.*)?/.exec(link.href.toString());
    if (temp) {
      //alert(JSON.stringify(temp));
      newlink = temp[1];
      if (!temp[2]) {
        newlink += "?pluginEnabled";
      } else {
        newlink += temp[2] + "&pluginEnabled";
      }
      if (temp[3]) {
        newlink += temp[3];
      }
      link.href = newlink
    }
  }
}

function enable () {
  alert('enabled');
  rewriteLink();
}

if (isEnabled()) {
  enable()
}

GM_registerMenuCommand("Enable", enable);