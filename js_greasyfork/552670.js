// ==UserScript==
// @name         Kayo Sports Bottom Controls Enhanced
// @namespace    https://userstyles.world/style/19429/kayosports-bottom-controls-enhanced
// @version      1.0.0
// @description  KayoSports bottom controls user experience improved
// @author       Sir,Saarim
// @license      MIT
// @match        *://*.kayosports.com.au/*
// @homepageURL  https://userstyles.world/style/19429/kayosports-bottom-controls-enhanced
// @supportURL   https://www.m.me/sir.saarim
// @run-at       document-end
// @icon         https://resources.kayosports.com.au/production/web-server/kayo-default.png?imwidth=1280
// @downloadURL https://update.greasyfork.org/scripts/552670/Kayo%20Sports%20Bottom%20Controls%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/552670/Kayo%20Sports%20Bottom%20Controls%20Enhanced.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style');
    style.textContent = `
    .lower-controls__StyledDiv-sc-6esuhn-0.bNYQgk {
        --smwplayer-underlay-height: 0px !important;
        height: 15% !important;
        width: 0% !important;
        padding-left: 20%;
        transform: scale(0.8);
    }

    .bNYQgk::before {
        width: 0% !important;
    }

    .goHDxt::before {
        width: 0% !important;
    }
    `;
    document.head.appendChild(style);
})();
