// ==UserScript==
// @name         Block custom pip (for YouTube etc.)
// @version      0.1
// @description  Prevents websites from customizing the PiP interface opened through the "Global Media Controls" menu. (Chrome only)
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @namespace https://greasyfork.org/users/14724
// @downloadURL https://update.greasyfork.org/scripts/550086/Block%20custom%20pip%20%28for%20YouTube%20etc%29.user.js
// @updateURL https://update.greasyfork.org/scripts/550086/Block%20custom%20pip%20%28for%20YouTube%20etc%29.meta.js
// ==/UserScript==

if (navigator.mediaSession?.setActionHandler) {
  const originalHandler = navigator.mediaSession.setActionHandler;

  navigator.mediaSession.setActionHandler = (...args) => {
    if (args[0] !== 'enterpictureinpicture') {
      originalHandler.apply(navigator.mediaSession, args);
    }
  };
}