// ==UserScript==
// @name         The Student Room (TSR) Popup Blocker
// @namespace    http://tampermonkey.net/
// @version      4
// @description  Gets rid of the sign up form blocking the page.
// @author       Doomnik
// @match        https://www.thestudentroom.co.uk/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=thestudentroom.co.uk
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549118/The%20Student%20Room%20%28TSR%29%20Popup%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/549118/The%20Student%20Room%20%28TSR%29%20Popup%20Blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const dialog = document.querySelector('.MuiDialog-container');
    if (!dialog) return;
    document.removeChild(dialog);
    document.querySelector('body').style.overflow = 'auto';
})();