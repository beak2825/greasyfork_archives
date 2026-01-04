// ==UserScript==
// @name         Auto Reload on Add/Delete/Edit Button
// @namespace    Violentmonkey Scripts
// @version      1.0
// @license      MIT
// @description  Reload page after clicking Add, Delete or Edit button on truyenwikidich.net
// @match        *://truyenwikidich.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551077/Auto%20Reload%20on%20AddDeleteEdit%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/551077/Auto%20Reload%20on%20AddDeleteEdit%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function autoReload(btnId, delay = 250) {
        const btn = document.querySelector(btnId);
        if (btn) {
            btn.addEventListener("click", function () {
                setTimeout(() => {
                    location.reload();
                }, delay);
            });
        }
    }

    // Xử lý cho các nút
    autoReload("#btnAddName");
    autoReload("#btnDelName");
    autoReload("#btnEditName");
})();
