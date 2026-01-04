// ==UserScript==
// @name         Docassemble Docs Improved Titles
// @namespace    https://github.com/jpagh/
// @version      1.1
// @description  Generate a better URL based page title for Docassemble docs
// @author       Jack Adamson
// @license      MIT
// @match        https://docassemble.org/docs/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=docassemble.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554794/Docassemble%20Docs%20Improved%20Titles.user.js
// @updateURL https://update.greasyfork.org/scripts/554794/Docassemble%20Docs%20Improved%20Titles.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    function getTitleFromUrl() {
        const pathParts = window.location.pathname.split('/');
        const filename = pathParts[pathParts.length - 1].replace('.html', '');
        const baseTitle = capitalizeFirst(filename);
        if (location.hash) {
            const decodedHash = decodeURIComponent(location.hash);
            return `${baseTitle} ${decodedHash}`;
        }
        return baseTitle;
    }

    function updateTitle() {
        document.title = getTitleFromUrl();
    }

    window.addEventListener('hashchange', updateTitle);
    updateTitle();
})();
