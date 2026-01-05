// ==UserScript==
// @name       Thunder Notification
// @version    0.4
// @description  服务器是雷暴天气时弹出桌面通知
// @homepage   https://woozy.im/
// @include    http://map.xjcraft.org/*
// @author     woozy
// @grant      none
// @namespace  https://greasyfork.org/users/8206
// @downloadURL https://update.greasyfork.org/scripts/7352/Thunder%20Notification.user.js
// @updateURL https://update.greasyfork.org/scripts/7352/Thunder%20Notification.meta.js
// ==/UserScript==

if (!('Notification' in window)) {
  alert('该浏览器不支持桌面通知');
} else if (Notification.permission !== 'granted') {
  Notification.requestPermission();
}

var api = 'http://map.xjcraft.org/up/world/MainLand/';
var nowState = false;
var notification;
setInterval(function() {
  var x = new XMLHttpRequest();
  x.open('GET', api, 1);
  x.onreadystatechange = function() {
    if (x.readyState == 4 && x.status == 200) {
      var data = JSON.parse(x.responseText);
      if (data.isThundering && data.hasStorm) {
        if (nowState != data.isThundering) {
          nowState = data.isThundering;
          var t = new Date().toTimeString().match(/(.*) GMT/)[1];
          notification = new Notification(t + ' - 打雷啦~');
        }
      } else {
        if (nowState != data.isThundering) {
          nowState = data.isThundering;
          notification.close();
        }
      }
    }
  }
  x.send(null);
}, 10000);
