// ==UserScript==
// @name         Block annoying notification badge :P
// @namespace    http://tampermonkey.net/
// @version      2025-12-21
// @description  Blocks the notification badge in a very very very crude way.
// @author       Sissel
// @match        https://a-lilian-garden.discourse.group/chat/c/blanket-fort/4
// @exclude      /^[^:/#?]*:\/\/([^#?/]*\.)?a-lilian-garden\.discourse\.group(:[0-9]{1,5})?\/.*$/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=discourse.group
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559736/Block%20annoying%20notification%20badge%20%3AP.user.js
// @updateURL https://update.greasyfork.org/scripts/559736/Block%20annoying%20notification%20badge%20%3AP.meta.js
// ==/UserScript==

(function() {
   const originalTitle = "#Blanket Fort - Chat - a_lilian's garden";
    document.title = originalTitle;

  Object.defineProperty(document, 'title', {
    configurable: false,
    get() {
      return originalTitle;
    },
    set(_) {
      // ignore all attempts
    }
  });
})();