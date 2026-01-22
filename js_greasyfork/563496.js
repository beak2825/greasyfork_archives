// ==UserScript==
// @name         9gag Dislike Button Fix
// @namespace    https://your-namespace.example/9gag-fix
// @version      1.0
// @description  Fix Dislike button hitbox / spacing on 9gag
// @match        https://9gag.com/*
// @grant        none
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/563496/9gag%20Dislike%20Button%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/563496/9gag%20Dislike%20Button%20Fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const css = `
    ul.btn-vote.left li {
        margin: 0 8px !important;
        float: left;
        list-style: none;
        padding: 0 !important;
    }

    ul.btn-vote.left li a.grouped {
        height: 2em;
        width: 2em;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    `;

    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
})();
