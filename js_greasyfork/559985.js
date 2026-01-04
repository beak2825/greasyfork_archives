// ==UserScript==
// @name         Exhentai OpenFullPicture
// @namespace    B1773rm4n
// @version      2025-12-24
// @description  When opening a full picture link, directly open the image
// @copyright    WTFPL
// @license      WTFPL
// @source       https://github.com/B1773rm4n/Tampermonkey_Userscripts/blob/main/ehentai_OpenFullPicture.js
// @author       B1773rm4n
// @match        https://exhentai.org/*
// @match        https://e-hentai.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=exhentai.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559985/Exhentai%20OpenFullPicture.user.js
// @updateURL https://update.greasyfork.org/scripts/559985/Exhentai%20OpenFullPicture.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // If on a gallery page itself
    const URL = document.URL
    const regex = /\/s\/[0-f]{10}\/.*-\d+/g;
    const isMatchURL = URL.match(regex);

    if (isMatchURL) {
        const imageURL = document.getElementById("i3").firstChild.firstChild.src
        window.location.assign(imageURL)
    }

})();
