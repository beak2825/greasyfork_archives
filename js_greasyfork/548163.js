// ==UserScript==
// @name         ThreeDaos
// @namespace    http://tampermonkey.net/
// @version      2025-09-02
// @description  ThreeDaos Reader
// @author       AngelXex
// @match        https://threedaos.zdrz.xyz/*
// @icon         https://threedaos.zdrz.xyz/wp-content/uploads/2024/06/cropped-1-192x192.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548163/ThreeDaos.user.js
// @updateURL https://update.greasyfork.org/scripts/548163/ThreeDaos.meta.js
// ==/UserScript==

(function() {
    'use strict';


const paddedit = document.getElementsByClassName("readingnav rnavbot");
Array.prototype.forEach.call(paddedit, function(el) {
el.remove();
});
const paddedit2 = document.getElementsByClassName("scrollToTop");
Array.prototype.forEach.call(paddedit2, function(el) {
el.remove();
});


var temp = document.getElementsByClassName("ts-main-image");
temp[0].addEventListener (
    "click", ButtonClickAction, false
);

function ButtonClickAction (zEvent) {
openFullscreen();
}
/* Get the documentElement (<html>) to display the page in fullscreen */
var elem = document.documentElement;


/* View in fullscreen */
function openFullscreen() {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) { /* Safari */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE11 */
    elem.msRequestFullscreen();
  }
}
})();