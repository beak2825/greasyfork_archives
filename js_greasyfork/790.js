// ==UserScript==
// @name Show and reload broken images
// @version 3.0.0
// @description The name explained it
// @homepageURL https://github.com/eight04/show-and-reload-broken-images#readme
// @supportURL https://github.com/eight04/show-and-reload-broken-images/issues
// @license MIT
// @author eight04 <eight04@gmail.com>
// @namespace eight04.blogspot.com
// @include *
// @grant GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/790/Show%20and%20reload%20broken%20images.user.js
// @updateURL https://update.greasyfork.org/scripts/790/Show%20and%20reload%20broken%20images.meta.js
// ==/UserScript==

/* eslint-env browser, greasemonkey */

function reloadImages() {
  for (const img of document.images) {
    if (!img.complete || img.matches("[src]:-moz-broken")) {
      img.src += "#";
    }
  }
}

function broadcastEvent() {
  for (const win of window.frames) {
    win.postMessage("RELOAD_BROKEN_IMAGES", "*");
  }
}

function init() {
  window.addEventListener("keyup", e => {
    if (e.keyCode === 82 && e.altKey) {
      reloadImages();
      broadcastEvent();
    }
  });
  
  window.addEventListener("message", e => {
    if (e.data === "RELOAD_BROKEN_IMAGES") {
      reloadImages();
      broadcastEvent();
    }
  });
}

{
  init();
}
