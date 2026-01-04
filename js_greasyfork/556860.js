// ==UserScript==
// @name         SangTacViet Nghe Sach Plus
// @namespace    http://tampermonkey.net/
// @version      1.03
// @author       @Tmajh25
// @description  (v1.03) Hiện nút "Nghe sách" ở nguồn Faloo, dịch, sáng tác.
// @match        *://*.sangtacviet.com/*
// @match        *://*.sangtacviet.app/*
// @match        *://*.sangtacviet.me/*
// @match        *://*.sangtacviet.pro/*
// @match        *://sangtacviet.com/*
// @match        *://sangtacviet.app/*
// @match        *://sangtacviet.me/*
// @match        *://sangtacviet.pro/*
// @match        *://14.225.254.182/*
// @match        *://*.14.225.254.182/*
// @icon         http://14.225.254.182/favicon.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/556860/SangTacViet%20Nghe%20Sach%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/556860/SangTacViet%20Nghe%20Sach%20Plus.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function editLine() {
        const btn = document.querySelector('#configBox .bg-dark button[onclick="speaker.readBook()"]');
        if (!btn) return;

        btn.style.display = "";
    }

    editLine();
})();
