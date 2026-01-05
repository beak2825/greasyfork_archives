// ==UserScript==
// @name        reload scheduler
// @description it does nothing but just schedule a page reload
// @namespace   http://mfish.twbbs.org/
// @include     http://*
// @include     https://*
// @version     0.1.1
// @grant       GM_registerMenuCommand 
// @downloadURL https://update.greasyfork.org/scripts/6431/reload%20scheduler.user.js
// @updateURL https://update.greasyfork.org/scripts/6431/reload%20scheduler.meta.js
// ==/UserScript==

(function(){

var reload = function (min_timewait) {
  if (min_timewait > 0) {
    setTimeout(function(){
      location.reload();
    }, min_timewait * 1000 * 60)
  }
}


var onclick = function() {
  var reloadTime = window.prompt("Reload after x minute :", "0");
  var parsedNum = parseInt(reloadTime, 10);
  if (!isNaN(parsedNum) && parsedNum > 0) {
    alert('will reload after : ' + parsedNum + ' minutes');
    reload(parsedNum);
  } else {
    alert('not scheduled');
  }
}

GM_registerMenuCommand("schedule reload", onclick);
  
}())