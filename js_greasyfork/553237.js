// ==UserScript==
// @name         GitHub Large PR Checks Pane
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  Increases the height of the checks pane at the bottom of PRs to show more checks.
// @author       Aurélien Bombo
// @match        https://github.com/*
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/553237/GitHub%20Large%20PR%20Checks%20Pane.user.js
// @updateURL https://update.greasyfork.org/scripts/553237/GitHub%20Large%20PR%20Checks%20Pane.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const PANE_HEIGHT = '600px';

    const style = document.createElement('style');
    style.textContent = `
    section[aria-label="Checks"] [class^=MergeBoxExpandable] {
      max-height: ${PANE_HEIGHT} !important;
    }
    `;
    document.head.appendChild(style);
})();