// ==UserScript==
// @name        Blokace detekce adblocku na doupe
// @description Script umoznujici prohlizeni webu doupe.zive.cz s aktivnim Adblockem
// @namespace   doupe
// @include     http://doupe.zive.cz/*
// @version     1
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/7769/Blokace%20detekce%20adblocku%20na%20doupe.user.js
// @updateURL https://update.greasyfork.org/scripts/7769/Blokace%20detekce%20adblocku%20na%20doupe.meta.js
// ==/UserScript==
(function (w) {
  function pre_script_execute_handler(e) {
    var target = e.target;
    if (target.innerHTML.indexOf('$(document).ready(') != - 1) {
      e.preventDefault();
      e.stopPropagation();
    }
  }
  w.addEventListener('beforescriptexecute', pre_script_execute_handler);
}) (unsafeWindow);