// ==UserScript==
// @name         Auto redirect youtube
// @namespace    http://tampermonkey.net/
// @version      2025-09-16
// @description  Redirects automatically to the link
// @author       Ximer
// @match        https://www.youtube.com/redirect?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/551475/Auto%20redirect%20youtube.user.js
// @updateURL https://update.greasyfork.org/scripts/551475/Auto%20redirect%20youtube.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var linkBtn = document.getElementById("invalid-token-redirect-goto-site-button");
    window.location.href = linkBtn.href;
})();