// ==UserScript==
// @name         MapGenie - Hide Top Right Sidebar
// @namespace    https://github.com/Reacien/Userscripts
// @version      1.0.0
// @description  Hides the top right sidebar on page load
// @author       Reacien
// @match        https://mapgenie.io/*
// @icon         https://cdn.mapgenie.io/favicons/mapgenie/favicon.ico
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/551177/MapGenie%20-%20Hide%20Top%20Right%20Sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/551177/MapGenie%20-%20Hide%20Top%20Right%20Sidebar.meta.js
// ==/UserScript==

(function() {
    setTimeout(function() {
        const rightClose = document.querySelector('#right-sidebar .sidebar-close');
        if (rightClose) rightClose.click();
    }, 1000);
})();
