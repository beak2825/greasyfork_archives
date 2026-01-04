// ==UserScript==
// @name         Hide image/video in YouTube Music
// @namespace    https://gitlab.com/user890104
// @version      20251218
// @description  Removes the distractions
// @author       Vencislav Atanasov
// @license      MIT
// @match        https://music.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/555725/Hide%20imagevideo%20in%20YouTube%20Music.user.js
// @updateURL https://update.greasyfork.org/scripts/555725/Hide%20imagevideo%20in%20YouTube%20Music.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
#player {
    background-color: transparent;
}

.html5-video-container, #thumbnail > img {
    visibility: hidden;
}
`);
})();