// ==UserScript==
// @name         GitHub Release Filename Wrap
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Improve the display of file names in GitHub Releases with the word-wrap feature so that long file names are fully visible on mobile displays.
// @author       Partner Coding
// @match        https://github.com/*/*/releases*
// @icon         https://github.githubassets.com/pinned-octocat.svg
// @grant        GM_addStyle
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/558440/GitHub%20Release%20Filename%20Wrap.user.js
// @updateURL https://update.greasyfork.org/scripts/558440/GitHub%20Release%20Filename%20Wrap.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const css = `
        .Box-row a.Truncate {
            max-width: none !important;
            height: auto !important;
        }

        .Box-row a.Truncate .Truncate-text {
            white-space: normal !important;
            overflow: visible !important;
            word-break: break-word !important;
            line-height: 1.4 !important;
            padding-bottom: 4px;
        }

        .Box-row span.Truncate {
            max-width: 100% !important;
            display: inline-block !important;
            white-space: nowrap !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            vertical-align: bottom !important;
        }
    `;

    function addGlobalStyle(css) {
        const head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        const style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }

    addGlobalStyle(css);

})();