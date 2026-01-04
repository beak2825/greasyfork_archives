// ==UserScript==
// @name         Open first steam search results
// @namespace    B1773rm4n
// @version      2025-12-24
// @description  When the steam search page is opened, automatically open the first result.
// @copyright    WTFPL
// @license      WTFPL
// @source       https://github.com/B1773rm4n/Tampermonkey_Userscripts/blob/main/steam_OpenFirstSearchResult.js
// @author       B1773rm4n
// @match        https://store.steampowered.com/search/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steampowered.com
// @run-at   document-end
// @downloadURL https://update.greasyfork.org/scripts/559987/Open%20first%20steam%20search%20results.user.js
// @updateURL https://update.greasyfork.org/scripts/559987/Open%20first%20steam%20search%20results.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const newUrl = document.getElementsByClassName('search_result_row')[0].href
    console.log(newUrl)
    location.replace(newUrl);

})();