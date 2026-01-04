// ==UserScript==
// @name         Custom MFC
// @namespace    http://tampermonkey.net/
// @version      2025-12-15
// @description  MyFigureCollection Custom Behaviours - Keep search term after getting results
// @match        https://myfigurecollection.net/*
// @icon         https://static.myfigurecollection.net/ressources/assets/webicon.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558983/Custom%20MFC.user.js
// @updateURL https://update.greasyfork.org/scripts/558983/Custom%20MFC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const searchBox = document.querySelector("form.tbx-get-form input[name=keywords]");

    if(searchBox && window.location.search) {
        let queryParameter = window.location.search.substring(1)
                                       .split("&").find(x => x.startsWith("keywords="));

        if(queryParameter) {
            let searchTerm = queryParameter.replace("keywords=", "").replaceAll("+", " ");
            searchBox.value = decodeURIComponent(searchTerm);
        }
    }
})();