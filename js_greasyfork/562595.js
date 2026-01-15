// ==UserScript==
// @name         SOOP Remove Donation Buttons
// @namespace    RetrieverEngine_SOOP
// @version      2026-01-14.001
// @description  SOOP Remove Donation, ADballoon, Sticker Buttons
// @author       RetrieverEngine
// @match        https://play.sooplive.co.kr/*
// @license      All rights reserved
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sooplive.co.kr
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562595/SOOP%20Remove%20Donation%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/562595/SOOP%20Remove%20Donation%20Buttons.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(function() {
        document.querySelector('li.donation')?.remove();
        document.querySelector('li.adballoon')?.remove();
        document.querySelector('li.sticker')?.remove();
        document.querySelector('li.star')?.remove();
    }, 500);
})();