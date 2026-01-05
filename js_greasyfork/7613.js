// ==UserScript==
// @name        SL-chat
// @description Print name in SL-chat
// @namespace   no
// @include     http://smart-lab.ru/chat/
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/7613/SL-chat.user.js
// @updateURL https://update.greasyfork.org/scripts/7613/SL-chat.meta.js
// ==/UserScript==
(function () {
  var t = document.getElementsByTagName('textarea') [1];
  function g(e) {
    var el = e.target;
    if (el.className && (el.className == 'name')) {
      if (e.type == 'mousemove') {
        el.style.cssText = 'cursor:pointer';
      } else if (e.type == 'click') {
        t.value = el.textContent + ', ';
        t.focus();
      }
    }
  }
  document.onclick = g;
  document.onmousemove = g;
}) ();