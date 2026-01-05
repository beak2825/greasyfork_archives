// ==UserScript==
// @name        remove youtube autoplay
// @description Remove autoplay from video suggestions on youtube
// @namespace   http://greasyfork.org/scripts/7893
// @include     http://www.youtube.com/*
// @include     https://www.youtube.com/*
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/7893/remove%20youtube%20autoplay.user.js
// @updateURL https://update.greasyfork.org/scripts/7893/remove%20youtube%20autoplay.meta.js
// ==/UserScript==

function f() {
  try {
    var node = document.getElementById('autoplay-checkbox').parentNode.parentNode;
    if (node.className == 'checkbox-on-off')
      node.parentNode.removeChild(node);
  }
  catch (e) {}
}
f();
document.body.addEventListener('DOMSubtreeModified', f, false);
