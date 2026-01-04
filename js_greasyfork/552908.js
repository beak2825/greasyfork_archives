// ==UserScript==
// @name         Unlimited Views
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Unlimited views in Mapstudy
// @license      MIT
// @icon         https://mapstudy.edu.vn/assets/images/logo/logo-64.png
// @author       Quang
// @match        https://mapstudy.edu.vn/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552908/Unlimited%20Views.user.js
// @updateURL https://update.greasyfork.org/scripts/552908/Unlimited%20Views.meta.js
// ==/UserScript==

(function() {
  'use strict';var _$_bbb7=["open","prototype","send","_url","apply","/v1/user_lesson_activity/mark-watched-video","includes","Blocked MAPSTUDY view drop!","warn"];const originalOpen=XMLHttpRequest[_$_bbb7[1]][_$_bbb7[0]];const originalSend=XMLHttpRequest[_$_bbb7[1]][_$_bbb7[2]];XMLHttpRequest[_$_bbb7[1]][_$_bbb7[0]]= function(_0x13602,_0x1365C){this[_$_bbb7[3]]= _0x1365C;return originalOpen[_$_bbb7[4]](this,arguments)};XMLHttpRequest[_$_bbb7[1]][_$_bbb7[2]]= function(_0x136B6){if(this[_$_bbb7[3]]&& this[_$_bbb7[3]][_$_bbb7[6]](_$_bbb7[5])){console[_$_bbb7[8]](_$_bbb7[7]);return};return originalSend[_$_bbb7[4]](this,arguments)}
})();
