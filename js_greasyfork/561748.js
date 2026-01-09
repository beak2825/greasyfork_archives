// ==UserScript==
// @name         SillyTavern Sticky Avatar
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  讓 SillyTavern 聊天室中所有訊息的頭像在捲動時保持可見 (Sticky)
// @author       Kilo Code
// @match        *://*:8000/*
// @match        *://127.0.0.1:*/*
// @match        *://localhost:*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/561748/SillyTavern%20Sticky%20Avatar.user.js
// @updateURL https://update.greasyfork.org/scripts/561748/SillyTavern%20Sticky%20Avatar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 注入 CSS 樣式
    // 直接針對所有 .mesAvatarWrapper 設定 sticky
    // 這樣所有訊息的頭像都會在捲動時黏在頂部，直到該訊息區塊結束
    const style = document.createElement('style');
    style.innerHTML = `
        .mesAvatarWrapper {
            position: sticky !important;
            top: 10px !important;
            align-self: flex-start !important;
            z-index: 10 !important;
        }
    `;
    document.head.appendChild(style);

    console.log('SillyTavern Sticky Avatar (All) script loaded.');
})();