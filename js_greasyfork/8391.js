// ==UserScript==
// @name        自动联网
// @namespace   http://handsomeone.com
// @description 自动连接南京大学的网络接入系统
// @include     http://p.nju.edu.cn/portal/index.html*
// @include     http://p/portal/index.html*
// @version     1.1.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/8391/%E8%87%AA%E5%8A%A8%E8%81%94%E7%BD%91.user.js
// @updateURL https://update.greasyfork.org/scripts/8391/%E8%87%AA%E5%8A%A8%E8%81%94%E7%BD%91.meta.js
// ==/UserScript==
(function f() {
  if (document.getElementsByClassName('login_div').length) {
    login_request()
  } else if(!document.getElementsByClassName('messager-window').length) {
    setTimeout(f, 100)
  }
})()