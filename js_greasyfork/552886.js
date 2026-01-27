// ==UserScript==
// @name         Wider Gemini
// @name:zh-CN   加宽 Gemini
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Widen Gemini display area
// @description:zh-CN  加宽 Gemini 网页版显示区域
// @author       dean
// @match        https://gemini.google.com/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552886/Wider%20Gemini.user.js
// @updateURL https://update.greasyfork.org/scripts/552886/Wider%20Gemini.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        width: '92%',
        max: '1800px'
    };

    const selectors = [
        'mat-sidenav-content',
        '.main-content',
        '.input-area-container',
        '.bottom-bar-container',
        '.conversation-container'
    ];

    const customCSS = `
        ${selectors.join(', ')} {
            width: ${CONFIG.width} !important;
            max-width: ${CONFIG.max} !important;
            margin-left: auto !important;
            margin-right: auto !important;
        }

        .conversation-container {
            width: 100% !important;
        }

        @media (min-width: 2560px) {
            ${selectors.join(', ')} {
                max-width: 2000px !important;
            }
        }
    `;

    try {
        GM_addStyle(customCSS);
        console.log('Wider Gemini v2.4 applied.');
    } catch (e) {
        console.error('Wider Gemini script error:', e);
    }
})();